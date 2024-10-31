import { DndProvider } from "react-dnd";
import InfoItem from "../_components/info-item";
import SocialReasonItem from "../_components/social-reason-item";
import { CompanyDashboardInfo } from "@/types/types";
import { HTML5Backend } from "react-dnd-html5-backend";
import { User, Building, Briefcase } from 'lucide-react';

interface CompanyDashboardInfoStepProps {
  application: CompanyDashboardInfo;
}

export default function CompanyDashboardInfoStep({ application }: CompanyDashboardInfoStepProps) {
  const socialReasons = [
    application.razonSocial1,
    application.razonSocial2,
    application.razonSocial3,
    application.razonSocial4,
    application.razonSocial5,
  ];

  const moveItem = (fromIndex: number, toIndex: number) => {
    const updatedSocialReasons = [...socialReasons];
    const [movedItem] = updatedSocialReasons.splice(fromIndex, 1);
    updatedSocialReasons.splice(toIndex, 0, movedItem);
  };

  return (
    <div className="bp-6 rounded-lg max-w-md mx-auto text-gray-100">
      {/* Encabezado de la compañía */}
      <div className="flex items-center mb-4 space-x-3">
        <Building className="w-6 h-6 text-blue-400" />
        <h1 className="text-xl font-semibold text-blue-300">Perfil Corporativo</h1>
      </div>

      {/* Nombres de la empresa */}
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-gray-300 mb-1">Nombre Comercial</h3>
        <h1 className="text-xl font-semibold text-blue-300">{application.companyName}</h1>
      </div>

      {/* Información básica de la compañía */}
      <div className="p-3 pt-0 rounded-lg mb-1 shadow-inner space-y-2">
        <div className="flex items-center space-x-2">
          <User className="w-5 h-5 text-blue-400" />
          <InfoItem label="CEO" value={`${application.ceo.name} ${application.ceo.lastName}`} />
        </div>
        <div className="flex items-center space-x-2">
          <InfoItem label="Propósito" value={application.corporatePurpose} />
        </div>
      </div>

      {/* Razón social con drag-and-drop */}
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-gray-300 mb-1">Razón Social</h3>
        <DndProvider backend={HTML5Backend}>
          <div className="p-3 rounded-lg shadow-inner border border-gray-500 flex flex-col gap-2">
            {Array.isArray(socialReasons) && socialReasons.map((socialReason, index) => (
              <SocialReasonItem
                key={index}
                index={index}
                socialReason={socialReason || 'N/A'} // Valor por defecto si socialReason es undefined
                companyType={application.companyType}
                moveItem={moveItem}
                isVerifying={true}
              />
            ))}
          </div>
        </DndProvider>
      </div>

      {/* Nota de confidencialidad */}
      <div className="text-center mt-3">
        <p className="text-xs italic text-gray-400">Confidencialidad de la empresa asegurada.</p>
      </div>
    </div>
  );
}
