'use client';

import { Dispatch, SetStateAction, useEffect, useRef } from 'react';
import { Step } from '@/types/types';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { steps } from './page';
import { useRouter } from 'next/navigation';

interface SidebarProps {
  activeStep: number;
  setActiveStep: Dispatch<SetStateAction<number>>;
  setIsSidebarOpen: Dispatch<SetStateAction<boolean>>;
}

export default function Sidebar({ activeStep, setActiveStep, setIsSidebarOpen }: SidebarProps) {
  const router = useRouter();
  const sidebarRef = useRef<HTMLDivElement>(null);

  const navigateToStep = (stepId: 1 | 2 | 3) => {
    const stepRoutes: { 1: string; 2: string; 3: string } = {
      1: '/dashboard/informacion-solicitud',
      2: '/dashboard/documentos-requeridos',
      3: 'showComponent <',
    };
    router.push(stepRoutes[stepId]);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setIsSidebarOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setIsSidebarOpen]);

  return (
    <div ref={sidebarRef} className="space-y-4">
      <h2 className="px-4 text-lg font-semibold">Próximos Pasos</h2>
      {steps.map((step: Step) => (
        <Button
          key={step.id}
          variant={activeStep === step.id ? 'secondary' : 'ghost'}
          className="w-full justify-start"
          onClick={() => {
            setActiveStep(step.id);
            setIsSidebarOpen(false);
            navigateToStep(step.id as 1 | 2 | 3);
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
