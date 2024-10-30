'use client';

import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Check } from 'lucide-react';
import { Dispatch, SetStateAction } from 'react';
import { User, Building2, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';

export const steps = [
    {
        id: 1,
        title: "Applicant Information",
        icon: User,
    },
    {
        id: 2,
        title: "About the Company",
        icon: Building2,
    },
    {
        id: 3,
        title: "Partner Information",
        icon: Users,
    },
];

export type Step = {
    id: number;
    title: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>; // More specific type for icons
};

interface SidebarProps {
    className?: string;
    activeStep: number;
    setActiveStep: Dispatch<SetStateAction<number>>;
    setIsSidebarOpen: Dispatch<SetStateAction<boolean>>;
}

export const Sidebar = ({ className, activeStep, setActiveStep, setIsSidebarOpen }: SidebarProps) => {
    const router = useRouter();

    const handleNextStep = () => {
        if (activeStep < steps.length) {
            setActiveStep((prevStep) => prevStep + 1);
        } else {
            router.push('/dashboard'); // Navigate to /dashboard on the final step
        }
    };

    return (
        <div className={className}>
            <div className="space-y-4">
                <h2 className="px-4 text-lg font-semibold">Next Steps</h2>
                {steps.map((step) => (
                    <Button
                        key={step.id}
                        variant={activeStep === step.id ? 'secondary' : 'ghost'}
                        className="w-full justify-start"
                        onClick={() => {
                            setActiveStep(step.id);
                            setIsSidebarOpen(false); // Cierra el sidebar al seleccionar un paso en mobile
                        }}
                    >
                        <step.icon className="mr-2 h-4 w-4" />
                        {step.title}
                        {step.id < activeStep && <Check className="ml-auto h-4 w-4 text-green-500" />}
                    </Button>
                ))}

                {/* Botón Next */}
                <div className="px-4">
                    <Button 
                        className="w-full" 
                        variant="default" 
                        onClick={handleNextStep}>
                        {activeStep < steps.length ? "Next" : "Finish"}
                    </Button>
                </div>

                {/* Barra de progreso */}
                <div className="px-4 py-4">
                    <strong>Progress:</strong>
                    <Progress
                        value={activeStep === 1 ? 33 : activeStep === 2 ? 66 : 100}
                        className="w-full"
                    />
                </div>
            </div>
        </div>
    );
};
