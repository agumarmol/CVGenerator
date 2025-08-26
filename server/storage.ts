import { type User, type UpsertUser, type CvSession, type InsertCvSession, type Payment, type InsertPayment, type CvData } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  createCvSession(session: InsertCvSession): Promise<CvSession>;
  getCvSessionByToken(token: string): Promise<CvSession | undefined>;
  updateCvSession(id: string, updates: Partial<CvSession>): Promise<CvSession>;
  markSessionAsPaid(sessionId: string, paymentIntentId: string): Promise<CvSession>;
  
  createPayment(payment: InsertPayment): Promise<Payment>;
  getPaymentByIntentId(intentId: string): Promise<Payment | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private cvSessions: Map<string, CvSession> = new Map();
  private payments: Map<string, Payment> = new Map();

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const existingUser = this.users.get(userData.id!);
    if (existingUser) {
      const updatedUser = {
        ...existingUser,
        ...userData,
        updatedAt: new Date(),
      };
      this.users.set(userData.id!, updatedUser);
      return updatedUser;
    } else {
      const id = userData.id || randomUUID();
      const user: User = {
        id,
        email: userData.email || null,
        firstName: userData.firstName || null,
        lastName: userData.lastName || null,
        profileImageUrl: userData.profileImageUrl || null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.users.set(id, user);
      return user;
    }
  }

  async createCvSession(insertSession: InsertCvSession): Promise<CvSession> {
    const id = randomUUID();
    const now = new Date();
    const session: CvSession = {
      sessionToken: insertSession.sessionToken,
      cvData: insertSession.cvData,
      currentStep: insertSession.currentStep || "personal-info",
      currentSubStep: insertSession.currentSubStep || "personal-info",
      isPaid: insertSession.isPaid || false,
      paymentIntentId: insertSession.paymentIntentId || null,
      id,
      createdAt: now,
      updatedAt: now,
    };
    this.cvSessions.set(id, session);
    return session;
  }

  async getCvSessionByToken(token: string): Promise<CvSession | undefined> {
    return Array.from(this.cvSessions.values()).find(
      (session) => session.sessionToken === token,
    );
  }

  async updateCvSession(id: string, updates: Partial<CvSession>): Promise<CvSession> {
    const session = this.cvSessions.get(id);
    if (!session) throw new Error("Session not found");
    
    const updatedSession = { 
      ...session, 
      ...updates, 
      updatedAt: new Date() 
    };
    this.cvSessions.set(id, updatedSession);
    return updatedSession;
  }

  async markSessionAsPaid(sessionId: string, paymentIntentId: string): Promise<CvSession> {
    return this.updateCvSession(sessionId, { 
      isPaid: true, 
      paymentIntentId 
    });
  }

  async createPayment(insertPayment: InsertPayment): Promise<Payment> {
    const id = randomUUID();
    const payment: Payment = {
      sessionId: insertPayment.sessionId || null,
      stripePaymentIntentId: insertPayment.stripePaymentIntentId,
      amount: insertPayment.amount,
      currency: insertPayment.currency || "usd",
      status: insertPayment.status,
      id,
      createdAt: new Date(),
    };
    this.payments.set(id, payment);
    return payment;
  }

  async getPaymentByIntentId(intentId: string): Promise<Payment | undefined> {
    return Array.from(this.payments.values()).find(
      (payment) => payment.stripePaymentIntentId === intentId,
    );
  }
}

export const storage = new MemStorage();
