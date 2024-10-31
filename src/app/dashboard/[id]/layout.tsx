// DashboardLayout.tsx
'use client';

import { ReactNode, useState } from 'react';
import { Button } from "@/components/ui/button"; {/* Botón de cierre del sidebar en la vista móvil */ }
import Sidebar from './sidebar';
import { Grid, MenuIcon } from 'lucide-react';

interface DashboardLayoutProps {
    children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [activeStep, setActiveStep] = useState(1);

    return (
        <div className="bg-gray-800 min-h-screen flex text-white relative">
            {/* Sidebar */}
            <aside
                className={`${isSidebarOpen ? "block" : "hidden"
                    } md:block  bg-gray-900 border-r border-gray-700 fixed inset-y-0 z-20 md:relative  rounded-r-lg transition-all duration-300`}
            >
                <Sidebar
                    activeStep={activeStep}
                    setActiveStep={setActiveStep}
                    setIsSidebarOpen={setIsSidebarOpen}
                />
            </aside>

            {/* Barra lateral delgada para abrir/cerrar el Sidebar */}
            {!isSidebarOpen && (
                <div
                    className="fixed left-0 top-0 h-full w-2 bg-blue-500 rounded-r-lg cursor-pointer z-30 hover:bg-blue-400 transition-colors duration-200"
                    onClick={() => setIsSidebarOpen(true)}
                ></div>
            )}

            {/* Main Content Wrapper */}
            <div className="flex-1 flex flex-col min-h-screen ml-0 md:ml-64">


                <Button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="absolute right-8 top-4 md:hidden z-40 bg-blue-500 rounded-full p-2 shadow-lg transition-transform hover:bg-blue-400 focus:outline-none"
                >
                    {isSidebarOpen ? (
                        <Grid className="text-white w-5 h-5" />  // Icono "X" para cerrar
                    ) : (
                        <MenuIcon className="text-white w-5 h-5" />  // Icono "Grid" de 4 cuadrados
                    )}
                </Button>


                {/* Main Content */}
                <div className="flex-1 flex items-center justify-center w-full max-w-screen-xl mx-auto px-4 pl-12">
                    {children}
                </div>
            </div>
        </div>
    );
}
