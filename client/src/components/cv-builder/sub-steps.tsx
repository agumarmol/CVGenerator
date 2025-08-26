import { cn } from "@/lib/utils";

const SUB_STEPS = [
  { id: "personal-info", label: "Personal Info" },
  { id: "experience", label: "Experience" },
  { id: "education", label: "Education" },
  { id: "skills", label: "Skills" },
];

interface SubStepsProps {
  currentSubStep: string;
  onSubStepClick: (subStep: string) => void;
}

export function SubSteps({ currentSubStep, onSubStepClick }: SubStepsProps) {
  const getCurrentStepIndex = () => SUB_STEPS.findIndex(step => step.id === currentSubStep);
  const currentIndex = getCurrentStepIndex();

  return (
    <div className="mb-8">
      <div className="flex items-center justify-center space-x-6 bg-card rounded-lg p-4 shadow-sm">
        {SUB_STEPS.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <button
              onClick={() => onSubStepClick(step.id)}
              className="flex items-center space-x-2 transition-colors hover:opacity-80"
              data-testid={`substep-${step.id}`}
            >
              <div className={cn(
                "w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium",
                index < currentIndex && "bg-primary text-primary-foreground",
                index === currentIndex && "bg-primary text-primary-foreground",
                index > currentIndex && "bg-muted text-muted-foreground"
              )}>
                {index < currentIndex ? "✓" : index + 1}
              </div>
              <span className={cn(
                "text-sm font-medium",
                index <= currentIndex ? "text-foreground" : "text-muted-foreground"
              )}>
                {step.label}
              </span>
            </button>
            {index < SUB_STEPS.length - 1 && (
              <div className={cn(
                "w-8 h-px ml-4",
                index < currentIndex ? "bg-primary" : "bg-border"
              )} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
