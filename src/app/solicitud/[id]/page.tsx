'use client';

import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { User, Building2, Users, Mail, Phone, FileText, Globe, DollarSign, Loader, CheckCircle, Menu, X } from 'lucide-react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useRouter, useParams } from 'next/navigation'; // Use Next.js router and params
import { Sidebar } from './sidebar'; // Import your Sidebar component

interface ApplicationData {
  applicantFirstName: string;
  applicantLastName: string;
  applicantEmail: string;
  documentType: string;
  documentNumber: string;
  applicantPhoneCode: string;
  applicantPhone: string;
  residency: string;
  ceo: {
    name: string;
    lastName: string;
    partner: boolean;
  };
  corporatePurpose: string;
  companyType: string;
  partners: Partner[];
  razonSocial1?: string;
  razonSocial2?: string;
  razonSocial3?: string;
  razonSocial4?: string;
  razonSocial5?: string;
}

interface Partner {
  name: string;
  lastName: string;
  documentType: string;
  documentNumber: string;
  nationality: string;
  email: string;
  phone: string;
  countryCode: string;
  monetaryContribution?: number;
  currency?: string;
  nonMonetaryContributions?: NonMonetaryContribution[];
}

interface NonMonetaryContribution {
  nonMonetaryContribution: string;
  nonMonetaryCurrency: string;
  nonMonetaryValue: number;
}

// Draggable Company Name Item
const ItemType = 'razonSocial';

interface SocialReasonItemProps {
  socialReason: string;
  index: number;
  moveItem: (fromIndex: number, toIndex: number) => void;
  companyType?: string;
  isVerifying: boolean;
}

function SocialReasonItem({ socialReason, index, moveItem, companyType, isVerifying }: SocialReasonItemProps) {
  const [{ isDragging }, drag] = useDrag({
    type: ItemType,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: ItemType,
    hover: (draggedItem: { index: number }) => {
      if (draggedItem.index !== index) {
        moveItem(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  return (
    <div
      ref={(node) => {
        if (node) drag(drop(node));
      }}
      className={`flex flex-col items-center justify-center bg-gray-50 border border-gray-300 rounded-md shadow-sm w-full min-w-[150px] md:min-w-[200px] h-[50px] transition-transform ${isDragging ? 'opacity-50' : ''}`}
    >
      <div className="flex items-center justify-center w-full">
        <p className="text-sm text-center">{`Nombre de la Empresa ${index + 1}`}</p>
        {isVerifying ? (
          <Loader className="w-4 h-4 ml-2 text-yellow-500 animate-spin" />
        ) : (
          <CheckCircle className="w-4 h-4 ml-2 text-green-500" />
        )}
      </div>
      <p className="text-lg font-semibold text-center">{socialReason ? `${socialReason} ${companyType}` : 'N/A'}</p>
    </div>
  );
}

export default function Dashboard() {
  const [application, setApplication] = useState<ApplicationData | null>(null);
  const [socialReasons, setSocialReasons] = useState<string[]>([]);
  const [activeStep, setActiveStep] = useState<number>(1);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();
  const { id } = useParams(); // Get the application ID from the URL params

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const response = await fetch(`/api/getApplication/${id}`);
        const data = await response.json();

        // Log the API response to confirm it's correct
        console.log('API Response:', data);

        if (data && data.formData) {
          setApplication(data.formData); // Access formData directly from the response
          setSocialReasons([
            data.formData?.razonSocial1 || '',
            data.formData?.razonSocial2 || '',
            data.formData?.razonSocial3 || '',
            data.formData?.razonSocial4 || '',
            data.formData?.razonSocial5 || '',
          ]);
        }
      } catch (error) {
        console.error("Error fetching application:", error);
      }
    };

    fetchApplication();
  }, [id]);

  useEffect(() => {
    console.log('Application state:', application);
  }, [application]);

  const moveItem = (fromIndex: number, toIndex: number) => {
    const updatedList = [...socialReasons];
    const [movedItem] = updatedList.splice(fromIndex, 1);
    updatedList.splice(toIndex, 0, movedItem);
    setSocialReasons(updatedList);
  };

  const renderStepPreview = () => {
    if (!application) return <p>Cargando...</p>;

    switch (activeStep) {
      case 1:
        return (
          <>
            <InfoSection title="Información del Solicitante" description="Revisa tus datos personales">
              <InfoItem label="Nombre" value={`${application.applicantFirstName} ${application.applicantLastName}`} />
              <InfoItem label="Email" value={application.applicantEmail} />
              <InfoItem label="Tipo de Documento" value={application.documentType} />
              <InfoItem label="Número de Documento" value={application.documentNumber} />
              <InfoItem label="Teléfono" value={`${application.applicantPhoneCode} ${application.applicantPhone}`} />
            </InfoSection>

            <InfoSection title="Selección de Residencia" description="Tu estado de residencia seleccionado">
              <InfoItem label="Residencia" value={application.residency} />
            </InfoSection>
          </>
        );
      case 2:
        return (
          <div className="p-6 shadow-sm">
            <InfoSection title="Sobre la Empresa" description="Propósito Corporativo, Información del CEO y Nombre de la Empresa">
              <InfoItem label="CEO" value={`${application.ceo.name} ${application.ceo.lastName}`} />
              <InfoItem label="Propósito Corporativo" value={application.corporatePurpose} />

              <h3 className="text-lg font-semibold">Nombres de la Empresa</h3>
              <p className="text-sm text-gray-500">Arrastra para reordenar los nombres de la empresa según tu preferencia</p>
              <DndProvider backend={HTML5Backend}>
                <div className="flex flex-col gap-2 mt-3">
                  {socialReasons.map((socialReason, index) => (
                    <SocialReasonItem
                      key={index}
                      index={index}
                      socialReason={socialReason}
                      moveItem={moveItem}
                      companyType={application.companyType}
                      isVerifying={true}
                    />
                  ))}
                </div>
              </DndProvider>
            </InfoSection>
          </div>
        );
      case 3:
        return (
          <div className="p-6 shadow-sm mb-4">
            <InfoSection title="Información de Socios y Aportes" description="Detalles de los socios de la empresa y sus aportes">
              {application.partners.map((partner, index) => (
                <div key={index} className="p-4 border rounded-lg bg-gray-50 shadow-sm space-y-4">
                  <InfoItem label="Nombre" value={`${partner.name} ${partner.lastName}`} />
                  <InfoItem label="Documento" value={`${partner.documentType} - ${partner.documentNumber}`} />
                  <InfoItem label="Nacionalidad" value={partner.nationality} />
                  <InfoItem label="Email" value={partner.email} />
                  <InfoItem label="Teléfono" value={`${partner.countryCode} ${partner.phone}`} />
                  {partner.monetaryContribution && (
                    <InfoItem label="Aporte de Capital" value={`${partner.currency} ${partner.monetaryContribution}`} />
                  )}
                  {partner.nonMonetaryContributions?.length ? (
                    <>
                      <h4 className="font-semibold text-gray-700">Aportes No Monetarios:</h4>
                      {partner.nonMonetaryContributions.map((contribution, idx) => (
                        <InfoItem key={idx} label="Descripción" value={contribution.nonMonetaryContribution} />
                      ))}
                    </>
                  ) : (
                    <p>No hay aportes no monetarios.</p>
                  )}
                </div>
              ))}
            </InfoSection>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Menú Móvil */}
      <div className="md:hidden flex justify-between items-center p-4 bg-gray-100">
        <h1 className="text-xl font-semibold">Panel</h1>
        <Button variant="ghost" onClick={() => setIsSidebarOpen(!isSidebarOpen)} aria-label="Alternar Menú">
          {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Barra Lateral */}
        <aside className={`${isSidebarOpen ? "block" : "hidden"} md:block w-64 bg-white border-r fixed inset-y-0 z-20 md:static md:w-64 md:relative`}>
          <Sidebar activeStep={activeStep} setActiveStep={setActiveStep} setIsSidebarOpen={setIsSidebarOpen} />
        </aside>

        {/* Contenido Principal */}
        <main className="flex-1 overflow-y-auto">
          <ScrollArea className="h-full">{renderStepPreview()}</ScrollArea>
        </main>
      </div>
    </div>
  );
}

// Reusable components for Info Sections
interface InfoSectionProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

function InfoSection({ title, description, children }: InfoSectionProps) {
  return (
    <div className="p-4 shadow-sm mb-4">
      <div className="mb-3">
        <h2 className="text-2xl font-bold">{title}</h2>
        <p className="text-gray-500">{description}</p>
      </div>
      {children}
    </div>
  );
}

interface InfoItemProps {
  label: string;
  value: string;
}

function InfoItem({ label, value }: InfoItemProps) {
  return (
    <p>
      <strong>{label}:</strong> {value}
    </p>
  );
}
