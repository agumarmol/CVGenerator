import { useEffect } from "react";
import { useCvBuilder } from "@/hooks/use-cv-builder";
import { ProgressSteps } from "@/components/cv-builder/progress-steps";
import { SubSteps } from "@/components/cv-builder/sub-steps";
import { InputMethods } from "@/components/cv-builder/input-methods";
import { PersonalInfoForm } from "@/components/cv-builder/personal-info-form";
import { ExperienceForm } from "@/components/cv-builder/experience-form";
import { EducationForm } from "@/components/cv-builder/education-form";
import { SkillsForm } from "@/components/cv-builder/skills-form";
import { CvPreview } from "@/components/cv-builder/cv-preview";
import { PremiumFeatures } from "@/components/cv-builder/premium-features";
import { ProcessingStatus } from "@/components/cv-builder/processing-status";

export default function CvBuilder() {
  const {
    session,
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
  } = useCvBuilder();

  useEffect(() => {
    initializeSession();
  }, [initializeSession]);

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const renderCurrentForm = () => {
    if (currentStep === "fill-form") {
      switch (currentSubStep) {
        case "personal-info":
          return <PersonalInfoForm data={cvData.personalInfo} onUpdate={(data) => updateCvData({ personalInfo: data })} />;
        case "experience":
          return <ExperienceForm data={cvData.experiences} onUpdate={(data) => updateCvData({ experiences: data })} />;
        case "education":
          return <EducationForm data={cvData.education} onUpdate={(data) => updateCvData({ education: data })} />;
        case "skills":
          return <SkillsForm data={cvData.skills} onUpdate={(data) => updateCvData({ skills: data })} />;
        default:
          return <PersonalInfoForm data={cvData.personalInfo} onUpdate={(data) => updateCvData({ personalInfo: data })} />;
      }
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <i className="fas fa-file-alt text-primary-foreground text-xl"></i>
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">CVMaster Pro</h1>
                <p className="text-xs text-muted-foreground">AI-Powered CV Generation</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <i className="fas fa-shield-alt text-accent"></i>
                <span>256-bit SSL Secured</span>
              </div>
              <button className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                Help & Support
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProgressSteps currentStep={currentStep} onStepClick={(step) => goToStep(step as any)} />
        
        {currentStep === "fill-form" && (
          <SubSteps currentSubStep={currentSubStep} onSubStepClick={(subStep) => goToSubStep(subStep as any)} />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Forms and Input Methods */}
          <div className="lg:col-span-2 space-y-6">
            {currentStep === "fill-form" && currentSubStep === "personal-info" && !cvData.personalInfo.fullName && (
              <InputMethods onDataImported={updateCvData} />
            )}
            
            {renderCurrentForm()}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between">
              <button 
                onClick={previousStep}
                className="px-6 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                data-testid="button-previous"
              >
                <i className="fas fa-arrow-left mr-2"></i>
                Previous
              </button>
              <button 
                onClick={nextStep}
                className="px-6 py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors"
                data-testid="button-next"
              >
                Continue
                <i className="fas fa-arrow-right ml-2"></i>
              </button>
            </div>
          </div>

          {/* Right Column: Preview and Premium Features */}
          <div className="space-y-6">
            <CvPreview cvData={cvData} isWatermarked={!session?.isPaid} />
            
            {!session?.isPaid && <PremiumFeatures sessionToken={session?.sessionToken || ""} />}
            
            {isProcessing && <ProcessingStatus />}
          </div>
        </div>
      </main>
    </div>
  );
}
