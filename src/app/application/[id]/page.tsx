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
        <p className="text-sm text-center">{`Company Name ${index + 1}`}</p>
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
    // Fetch the application data using the ID
    const fetchApplication = async () => {
      try {
        const response = await fetch(`/api/getApplication/${id}`); // Replace with your API endpoint
        const data = await response.json();

        if (data && data.application) {
          setApplication(data.application.formData); // Access the correct nested formData
          setSocialReasons([
            data.application.formData?.razonSocial1 || '',
            data.application.formData?.razonSocial2 || '',
            data.application.formData?.razonSocial3 || '',
            data.application.formData?.razonSocial4 || '',
            data.application.formData?.razonSocial5 || '',
          ]);
        }
      } catch (error) {
        console.error("Error fetching application:", error);
      }
    };

    fetchApplication();
  }, [id]);

  const moveItem = (fromIndex: number, toIndex: number) => {
    const updatedList = [...socialReasons];
    const [movedItem] = updatedList.splice(fromIndex, 1);
    updatedList.splice(toIndex, 0, movedItem);
    setSocialReasons(updatedList);
  };

  const renderStepPreview = () => {
    if (!application) return <p>Loading...</p>;

    switch (activeStep) {
      case 1:
        return (
          <>
            <InfoSection title="Applicant Information" description="Review your personal details">
              <InfoItem label="Name" value={`${application.applicantFirstName} ${application.applicantLastName}`} />
              <InfoItem label="Email" value={application.applicantEmail} />
              <InfoItem label="Document Type" value={application.documentType} />
              <InfoItem label="Document Number" value={application.documentNumber} />
              <InfoItem label="Phone" value={`${application.applicantPhoneCode} ${application.applicantPhone}`} />
            </InfoSection>

            <InfoSection title="Residency Selection" description="Your selected residency status">
              <InfoItem label="Residency" value={application.residency} />
            </InfoSection>
          </>
        );
      case 2:
        return (
          <div className="p-6 shadow-sm">
            <InfoSection title="About the Company" description="Corporate Purpose, CEO Information & Company Name">
              <InfoItem label="CEO" value={`${application.ceo.name} ${application.ceo.lastName}`} />
              <InfoItem label="Corporate Purpose" value={application.corporatePurpose} />

              <h3 className="text-lg font-semibold">Company Names</h3>
              <p className="text-sm text-gray-500">Drag to reorder the company names based on your preference</p>
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
            <InfoSection title="Partner Information & Contributions" description="Details of company partners and their contributions">
              {application.partners.map((partner, index) => (
                <div key={index} className="p-4 border rounded-lg bg-gray-50 shadow-sm space-y-4">
                  <InfoItem label="Name" value={`${partner.name} ${partner.lastName}`} />
                  <InfoItem label="Document" value={`${partner.documentType} - ${partner.documentNumber}`} />
                  <InfoItem label="Nationality" value={partner.nationality} />
                  <InfoItem label="Email" value={partner.email} />
                  <InfoItem label="Phone" value={`${partner.countryCode} ${partner.phone}`} />
                  {partner.monetaryContribution && (
                    <InfoItem label="Capital Contribution" value={`${partner.currency} ${partner.monetaryContribution}`} />
                  )}
                  {partner.nonMonetaryContributions?.length ? (
                    <>
                      <h4 className="font-semibold text-gray-700">Non-Monetary Contributions:</h4>
                      {partner.nonMonetaryContributions.map((contribution, idx) => (
                        <InfoItem key={idx} label="Description" value={contribution.nonMonetaryContribution} />
                      ))}
                    </>
                  ) : (
                    <p>No non-monetary contributions.</p>
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
      {/* Mobile Menu */}
      <div className="md:hidden flex justify-between items-center p-4 bg-gray-100">
        <h1 className="text-xl font-semibold">Dashboard</h1>
        <Button variant="ghost" onClick={() => setIsSidebarOpen(!isSidebarOpen)} aria-label="Toggle Menu">
          {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className={`${isSidebarOpen ? "block" : "hidden"} md:block w-64 bg-white border-r fixed inset-y-0 z-20 md:static md:w-64 md:relative`}>
          <Sidebar activeStep={activeStep} setActiveStep={setActiveStep} setIsSidebarOpen={setIsSidebarOpen} />
        </aside>

        {/* Main Content */}
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
