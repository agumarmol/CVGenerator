import { cn } from "@/lib/utils";

const STEPS = [
  { id: "fill-form", label: "Fill Form", description: "Personal & Professional Info" },
  { id: "processing", label: "AI Processing", description: "Enhancement & Optimization" },
  { id: "preview-customize", label: "Preview & Buy", description: "Customize & Purchase" },
];

interface ProgressStepsProps {
  currentStep: string;
  onStepClick: (step: string) => void;
}

export function ProgressSteps({ currentStep, onStepClick }: ProgressStepsProps) {
  const getCurrentStepIndex = () => STEPS.findIndex(step => step.id === currentStep);
  const currentIndex = getCurrentStepIndex();

  return (
    <div className="mb-12">
      <div className="flex items-center justify-center space-x-8">
        {STEPS.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center">
              <button
                onClick={() => onStepClick(step.id)}
                className={cn(
                  "step-progress w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-lg mb-3 transition-all",
                  index < currentIndex && "step-completed bg-accent",
                  index === currentIndex && "step-active",
                  index > currentIndex && "bg-muted text-muted-foreground"
                )}
                data-testid={`step-${step.id}`}
              >
                {index < currentIndex ? (
                  <i className="fas fa-check text-sm"></i>
                ) : (
                  index + 1
                )}
              </button>
              <div className="text-center">
                <p className={cn(
                  "text-sm font-medium",
                  index <= currentIndex ? "text-foreground" : "text-muted-foreground"
                )}>
                  {step.label}
                </p>
                <p className="text-xs text-muted-foreground mt-1">{step.description}</p>
              </div>
            </div>
            {index < STEPS.length - 1 && (
              <div className={cn(
                "w-20 h-px ml-8",
                index < currentIndex ? "bg-accent" : "bg-border"
              )} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
