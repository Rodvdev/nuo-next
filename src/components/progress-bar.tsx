'use client';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  onStepClick: (step: number) => void;
}

export function ProgressBar({ currentStep, totalSteps, onStepClick }: ProgressBarProps) {
  const handleStepClick = (step: number) => {
    if (step < currentStep) {
      onStepClick(step);
    }
  };

  return (
    <div className="space-y-2 mb-2 mt-6 mx-auto">
      {/* Números del paso actual y total */}
      <div className="text-sm font-medium text-gray-700 dark:text-gray-300 text-left ml-2">
        Step {currentStep} / {totalSteps}
      </div>

      {/* Barra de progreso dividida en secciones */}
      <div className="grid grid-cols-8 gap-1 h-2.5">
        {Array.from({ length: totalSteps }, (_, index) => (
          <div
            key={index}
            className={`h-full rounded-full cursor-pointer ${
              index < currentStep ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
            }`}
            onClick={() => handleStepClick(index + 1)}
          ></div>
        ))}
      </div>
    </div>
  );
}
