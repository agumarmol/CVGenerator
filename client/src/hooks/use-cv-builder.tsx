import { useState, useCallback, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { CvData, CvSession } from "@shared/schema";

const STEPS = ["fill-form", "processing", "preview-customize"] as const;
const SUB_STEPS = ["personal-info", "experience", "education", "skills"] as const;

type Step = typeof STEPS[number];
type SubStep = typeof SUB_STEPS[number];

const getDefaultCvData = (): CvData => ({
  personalInfo: {
    fullName: "",
    title: "",
    email: "",
    phone: "",
    location: "",
    summary: "",
  },
  experiences: [],
  education: [],
  skills: [],
});

export function useCvBuilder() {
  const [sessionToken, setSessionToken] = useState<string>("");
  const [currentStep, setCurrentStep] = useState<Step>("fill-form");
  const [currentSubStep, setCurrentSubStep] = useState<SubStep>("personal-info");
  const [cvData, setCvData] = useState<CvData>(getDefaultCvData());
  const [isProcessing, setIsProcessing] = useState(false);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Initialize session
  const initializeSession = useCallback(async () => {
    try {
      const response = await apiRequest("POST", "/api/cv-session", {});
      const data = await response.json();
      setSessionToken(data.sessionToken);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to initialize CV session",
        variant: "destructive",
      });
    }
  }, [toast]);

  // Fetch session data
  const { data: session } = useQuery<CvSession>({
    queryKey: ["/api/cv-session", sessionToken],
    enabled: !!sessionToken,
  });

  // Update state when session data changes
  useEffect(() => {
    if (session) {
      setCvData(session.cvData as CvData);
      setCurrentStep(session.currentStep as Step);
      setCurrentSubStep(session.currentSubStep as SubStep);
    }
  }, [session]);

  // Update session mutation
  const updateSessionMutation = useMutation({
    mutationFn: async (updates: { cvData?: CvData; currentStep?: Step; currentSubStep?: SubStep }) => {
      const response = await apiRequest("PUT", `/api/cv-session/${sessionToken}`, updates);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cv-session", sessionToken] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: "Failed to save changes",
        variant: "destructive",
      });
    },
  });

  // Update CV data
  const updateCvData = useCallback((updates: Partial<CvData>) => {
    const newCvData = { ...cvData, ...updates };
    setCvData(newCvData);
    updateSessionMutation.mutate({ cvData: newCvData });
  }, [cvData, updateSessionMutation]);

  // Navigation functions
  const goToStep = useCallback((step: Step) => {
    setCurrentStep(step);
    updateSessionMutation.mutate({ currentStep: step });
  }, [updateSessionMutation]);

  const goToSubStep = useCallback((subStep: SubStep) => {
    setCurrentSubStep(subStep);
    updateSessionMutation.mutate({ currentSubStep: subStep });
  }, [updateSessionMutation]);

  const nextStep = useCallback(() => {
    if (currentStep === "fill-form") {
      const currentSubIndex = SUB_STEPS.indexOf(currentSubStep);
      if (currentSubIndex < SUB_STEPS.length - 1) {
        const nextSubStep = SUB_STEPS[currentSubIndex + 1];
        goToSubStep(nextSubStep);
      } else {
        goToStep("processing");
        setIsProcessing(true);
        // Simulate processing delay
        setTimeout(() => {
          setIsProcessing(false);
          goToStep("preview-customize");
        }, 3000);
      }
    } else {
      const currentIndex = STEPS.indexOf(currentStep);
      if (currentIndex < STEPS.length - 1) {
        const nextStep = STEPS[currentIndex + 1];
        goToStep(nextStep);
      }
    }
  }, [currentStep, currentSubStep, goToStep, goToSubStep]);

  const previousStep = useCallback(() => {
    if (currentStep === "fill-form") {
      const currentSubIndex = SUB_STEPS.indexOf(currentSubStep);
      if (currentSubIndex > 0) {
        const prevSubStep = SUB_STEPS[currentSubIndex - 1];
        goToSubStep(prevSubStep);
      }
    } else {
      const currentIndex = STEPS.indexOf(currentStep);
      if (currentIndex > 0) {
        const prevStep = STEPS[currentIndex - 1];
        if (prevStep === "fill-form") {
          goToStep(prevStep);
          goToSubStep("skills"); // Go to last substep
        } else {
          goToStep(prevStep);
        }
      }
    }
  }, [currentStep, currentSubStep, goToStep, goToSubStep]);

  return {
    session,
    sessionToken,
    cvData,
    currentStep,
    currentSubStep,
    isProcessing,
    initializeSession,
    updateCvData,
    nextStep,
    previousStep,
    goToStep,
    goToSubStep,
  };
}
