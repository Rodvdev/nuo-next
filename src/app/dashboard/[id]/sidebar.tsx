import { Dispatch, SetStateAction } from 'react';
import { Step } from '@/types/types';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { steps } from './stepsConfig';

interface SidebarProps {
  activeStep: number;
  setActiveStep: Dispatch<SetStateAction<number>>;
  setIsSidebarOpen: Dispatch<SetStateAction<boolean>>;
}

export default function Sidebar({ activeStep, setActiveStep, setIsSidebarOpen }: SidebarProps) {
  return (
    <div className="space-y-4">
      <h2 className="px-4 text-lg font-semibold">Próximos Pasos</h2>
      {steps.map((step: Step) => (
        <Button
          key={step.id}
          variant={activeStep === step.id ? 'secondary' : 'ghost'}
          className="w-full justify-start"
          onClick={() => {
            setActiveStep(step.id);
            setIsSidebarOpen(false);
          }}
        >
          <step.icon className="mr-2 h-4 w-4" />
          {step.title}
          {step.id < activeStep && <Check className="ml-auto h-4 w-4 text-green-500" />}
        </Button>
      ))}
      <div className="px-4">
        <Button className="w-full" variant="default" onClick={() => setActiveStep((prev) => prev + 1)}>
          {activeStep < steps.length ? "Siguiente" : "Finalizar"}
        </Button>
      </div>
      <div className="px-4 py-4">
        <strong>Progreso:</strong>
        <Progress value={(activeStep / steps.length) * 100} className="w-full" />
      </div>
    </div>
  );
}
