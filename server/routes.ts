import type { Express } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import multer from "multer";
import type { Request } from "express";

interface MulterRequest extends Request {
  file?: Express.Multer.File;
}
import { storage } from "./storage";
import { cvDataSchema } from "@shared/schema";
import { enhanceJobDescription, extractCvDataFromText, generatePersonalSummary } from "./services/ai";
import { extractTextFromPDF, validatePDFFile } from "./services/pdf-parser";
import { randomBytes } from "crypto";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20",
});

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Create new CV session
  app.post("/api/cv-session", async (req, res) => {
    try {
      const sessionToken = randomBytes(32).toString('hex');
      const cvData = {
        personalInfo: {
          fullName: "",
          title: "",
          email: "",
          phone: "",
          location: "",
          summary: ""
        },
        experiences: [],
        education: [],
        skills: []
      };

      const session = await storage.createCvSession({
        sessionToken,
        cvData: cvData as any,
        currentStep: "personal-info",
        currentSubStep: "personal-info",
        isPaid: false,
        paymentIntentId: null,
      });

      res.json({ sessionToken, sessionId: session.id });
    } catch (error: any) {
      res.status(500).json({ message: "Error creating CV session: " + error.message });
    }
  });

  // Get CV session
  app.get("/api/cv-session/:token", async (req, res) => {
    try {
      const { token } = req.params;
      const session = await storage.getCvSessionByToken(token);
      
      if (!session) {
        return res.status(404).json({ message: "Session not found" });
      }

      res.json(session);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching CV session: " + error.message });
    }
  });

  // Update CV session data
  app.put("/api/cv-session/:token", async (req, res) => {
    try {
      const { token } = req.params;
      const { cvData, currentStep, currentSubStep } = req.body;
      
      const session = await storage.getCvSessionByToken(token);
      if (!session) {
        return res.status(404).json({ message: "Session not found" });
      }

      const updatedSession = await storage.updateCvSession(session.id, {
        cvData: cvData as any,
        currentStep,
        currentSubStep,
      });

      res.json(updatedSession);
    } catch (error: any) {
      res.status(500).json({ message: "Error updating CV session: " + error.message });
    }
  });

  // Upload and parse JSON CV data
  app.post("/api/upload-json", upload.single('file'), async (req: MulterRequest, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const jsonContent = req.file.buffer.toString('utf-8');
      const cvData = JSON.parse(jsonContent);
      
      // Validate the CV data structure
      const validatedData = cvDataSchema.parse(cvData);
      
      res.json({ cvData: validatedData });
    } catch (error: any) {
      res.status(400).json({ message: "Invalid JSON file: " + error.message });
    }
  });

  // Upload and parse PDF CV with AI
  app.post("/api/upload-pdf", upload.single('file'), async (req: MulterRequest, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      if (!validatePDFFile(req.file.buffer)) {
        return res.status(400).json({ message: "Invalid PDF file" });
      }

      // Extract text from PDF
      const extractedText = await extractTextFromPDF(req.file.buffer);
      
      // Use AI to structure the data
      const cvData = await extractCvDataFromText(extractedText);
      
      res.json({ cvData });
    } catch (error: any) {
      res.status(500).json({ message: "Error processing PDF: " + error.message });
    }
  });

  // Enhance job description with AI
  app.post("/api/enhance-description", async (req, res) => {
    try {
      const { description, jobTitle, company } = req.body;
      
      if (!description || !jobTitle || !company) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const enhancedDescription = await enhanceJobDescription(description, jobTitle, company);
      
      res.json({ enhancedDescription });
    } catch (error: any) {
      res.status(500).json({ message: "Error enhancing description: " + error.message });
    }
  });

  // Generate professional summary
  app.post("/api/generate-summary", async (req, res) => {
    try {
      const { personalInfo, experiences, education, skills } = req.body;
      
      const summary = await generatePersonalSummary(personalInfo, experiences, education, skills);
      
      res.json({ summary });
    } catch (error: any) {
      res.status(500).json({ message: "Error generating summary: " + error.message });
    }
  });

  // Create payment intent for CV purchase
  app.post("/api/create-payment-intent", async (req, res) => {
    try {
      const { sessionToken } = req.body;
      const amount = 999; // $9.99 in cents
      
      const session = await storage.getCvSessionByToken(sessionToken);
      if (!session) {
        return res.status(404).json({ message: "Session not found" });
      }

      if (session.isPaid) {
        return res.status(400).json({ message: "Session already paid" });
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: "usd",
        metadata: {
          sessionId: session.id,
          sessionToken: sessionToken,
        },
      });

      // Store payment record
      await storage.createPayment({
        sessionId: session.id,
        stripePaymentIntentId: paymentIntent.id,
        amount: "9.99",
        currency: "usd",
        status: paymentIntent.status,
      });

      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      res.status(500).json({ message: "Error creating payment intent: " + error.message });
    }
  });

  // Verify payment and unlock premium features
  app.post("/api/verify-payment", async (req, res) => {
    try {
      const { paymentIntentId, sessionToken } = req.body;
      
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      
      if (paymentIntent.status !== 'succeeded') {
        return res.status(400).json({ message: "Payment not completed" });
      }

      const session = await storage.getCvSessionByToken(sessionToken);
      if (!session) {
        return res.status(404).json({ message: "Session not found" });
      }

      // Mark session as paid
      await storage.markSessionAsPaid(session.id, paymentIntentId);

      // Update payment status
      const payment = await storage.getPaymentByIntentId(paymentIntentId);
      if (payment) {
        // In a real implementation, you would update the payment status
      }

      res.json({ success: true, message: "Payment verified and premium features unlocked" });
    } catch (error: any) {
      res.status(500).json({ message: "Error verifying payment: " + error.message });
    }
  });

  // Generate final PDF (only for paid sessions)
  app.post("/api/generate-pdf", async (req, res) => {
    try {
      const { sessionToken } = req.body;
      
      const session = await storage.getCvSessionByToken(sessionToken);
      if (!session) {
        return res.status(404).json({ message: "Session not found" });
      }

      if (!session.isPaid) {
        return res.status(403).json({ message: "Premium feature - payment required" });
      }

      // In a real implementation, you would generate a PDF using a library like puppeteer
      // For now, we'll return a success message
      res.json({ 
        success: true, 
        message: "PDF generation initiated",
        downloadUrl: `/api/download-pdf/${sessionToken}`
      });
    } catch (error: any) {
      res.status(500).json({ message: "Error generating PDF: " + error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
