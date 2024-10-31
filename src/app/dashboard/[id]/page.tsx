'use client';

import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Menu, Users, X, Building2, User, FileText, CheckCircle } from 'lucide-react';
import Sidebar from './sidebar';
import ApplicantInfoStep from './_steps/applicant-info';
import PartnersInfoStep from './_steps/partners-info';
import CompanyInfoStep from './_steps/company-info';
import DocumentsStep from './_steps/documents';
import VerificationStep from './_steps/verification';
import { useParams } from 'next/navigation';

export const steps = [
  { id: 1, title: "Información de la solucitud", icon: Users },
  { id: 2, title: "Documentos Requeridos", icon: FileText },
  { id: 3, title: "Verificación y Licencias", icon: CheckCircle },
];

export default function Dashboard() {
  const [application, setApplication] = useState(null);
  const [activeStep, setActiveStep] = useState(1);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const response = await fetch(`/api/getApplication/${id}`);
        const data = await response.json();
        setApplication(data.formData);
      } catch (error) {
        console.error("Error fetching application:", error);
      }
    };
    fetchApplication();
  }, [id]);

  const renderStepPreview = () => {
    if (!application) return <p>Cargando...</p>;

    switch (activeStep) {
      case 1:
        return <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4'>
          <div>
            <ApplicantInfoStep application={application} /></div>
            <div>
            <CompanyInfoStep application={application} />
            </div>
            <div>
            <PartnersInfoStep application={application} />
            </div>
          
        </div>
      case 2:
        return <DocumentsStep />;
      case 3:
        return <VerificationStep />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="md:hidden flex justify-between items-center p-4 bg-gray-100">
        <h1 className="text-xl font-semibold">Panel</h1>
        <Button variant="ghost" onClick={() => setIsSidebarOpen(!isSidebarOpen)} aria-label="Alternar Menú">
          {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <aside className={`${isSidebarOpen ? "block" : "hidden"} md:block w-64 bg-white border-r fixed inset-y-0 z-20 md:static md:w-64 md:relative`}>
          <Sidebar activeStep={activeStep} setActiveStep={setActiveStep} setIsSidebarOpen={setIsSidebarOpen} />
        </aside>

        <main className="flex-1 overflow-y-auto">
          <ScrollArea className="h-full">{renderStepPreview()}</ScrollArea>
        </main>
      </div>
    </div>
  );
}
