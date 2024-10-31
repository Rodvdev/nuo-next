// DashboardLayout.tsx
'use client';

import { ReactNode, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Menu, X } from 'lucide-react';
import Sidebar from './sidebar';

interface DashboardLayoutProps {
    children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [activeStep, setActiveStep] = useState(1); // Estado para el paso activo

    return (
        <div className="bg-gray-800 min-h-screen flex text-white">
            {/* Sidebar */}
            <aside
                className={`${isSidebarOpen ? "block" : "hidden"
                    } md:block w-64 bg-gray-900 border-r border-gray-700 fixed inset-y-0 z-20 md:relative md:w-64`}
            >
                <Sidebar
                    activeStep={activeStep}
                    setActiveStep={setActiveStep}
                    setIsSidebarOpen={setIsSidebarOpen} // Pasar función para cerrar el sidebar
                />
            </aside>

            {/* Main Content Wrapper */}
            <div className="flex-1 flex flex-col min-h-screen ml-0 md:ml-64">
                {/* Header */}
                <div className="md:hidden flex justify-between items-center hover:text-blue-300 text-blue-300 bg-transparent">
                    <h1 className="text-xl font-semibold">Panel</h1>
                    <Button
                        variant="ghost"
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        aria-label="Alternar Menú"
                        className="bg-transparent hover:bg-transparent hover:text-blue-300 focus:bg-transparent"
                    >
                        {isSidebarOpen ? <X className="h-10 w-10" /> : <Menu className="h-10 w-10" />}
                    </Button>
                </div>

                {/* Main Content */}
                <div className="flex-1 flex items-center justify-center w-full max-w-screen-xl mx-auto">
                    {children}
                </div>
            </div>
        </div>
    );
}
