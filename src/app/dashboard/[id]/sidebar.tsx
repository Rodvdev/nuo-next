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
    <div className="bg-gray-900 p-6 rounded-r-lg shadow-lg space-y-6 text-white h-full">
      {/* Encabezado */}
      <h2 className="text-xl font-semibold text-blue-300 border-b border-gray-700 pb-4">Próximos Pasos</h2>

      {/* Lista de Pasos */}
      <div className="space-y-2">
        {steps.map((step: Step) => (
          <Button
            key={step.id}
            variant={activeStep === step.id ? 'secondary' : 'ghost'}
            className={`w-full justify-start rounded-lg px-4 py-2 transition-colors duration-200 ${
              activeStep === step.id
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:bg-gray-800 hover:text-blue-400'
            }`}
            onClick={() => {
              setActiveStep(step.id);
              setIsSidebarOpen(false);
            }}
          >
            <step.icon className="mr-3 h-5 w-5 text-blue-400" />
            <span className="font-medium">{step.title}</span>
            {step.id < activeStep && <Check className="ml-auto h-5 w-5 text-green-500" />}
          </Button>
        ))}
      </div>

      {/* Botón de Siguiente */}
      <div className="px-4 pt-4 border-t border-gray-700">
        <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg py-2" onClick={() => setActiveStep((prev) => prev + 1)}>
          {activeStep < steps.length ? "Siguiente" : "Finalizar"}
        </Button>
      </div>

      {/* Barra de Progreso */}
      <div className="px-4 py-4">
        <strong className="text-gray-300">Progreso</strong>
        <Progress value={(activeStep / steps.length) * 100} className="mt-2 bg-gray-700 rounded-full" />
      </div>
    </div>
  );
}
