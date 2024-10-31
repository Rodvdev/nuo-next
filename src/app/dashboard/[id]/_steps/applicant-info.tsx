import InfoItem from '../_components/info-item';
import { ApplicantInfo } from '@/types/types';
import { Mail, Phone, Home, User } from 'lucide-react';

export interface ApplicantStepProps {
  application: ApplicantInfo;
}

export default function ApplicantInfoStep({ application }: ApplicantStepProps) {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg shadow-lg max-w-sm mx-auto border border-blue-300 relative mb-8">
      {/* Título e Identificación en el encabezado */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold text-blue-900">Perfil del Solicitante</h1>
        <span className="text-sm text-blue-600 font-medium">{`${application.documentType} ${application.documentNumber}`}</span>
      </div>

      {/* Información resumida con íconos */}
      <div className="grid grid-cols-1 gap-3 text-sm text-gray-800">
        <div className="flex items-center space-x-2">
          <User className="w-4 h-4 text-blue-500" />
          <InfoItem label="Nombre" value={`${application.applicantFirstName} ${application.applicantLastName}`} />
        </div>
        
        <div className="flex items-center space-x-2">
          <Mail className="w-4 h-4 text-blue-500" />
          <InfoItem label="Email" value={application.applicantEmail} />
        </div>
        
        <div className="flex items-center space-x-2">
          <Phone className="w-4 h-4 text-blue-500" />
          <InfoItem label="Contacto" value={`${application.applicantPhoneCode || "+51"} ${application.applicantPhone}`} />
        </div>
        
        <div className="flex items-center space-x-2">
          <Home className="w-4 h-4 text-blue-500" />
          <InfoItem label="Residencia" value={application.residency} />
        </div>
      </div>

      {/* Nota al pie */}
      <div className="text-center mt-3">
        <p className="text-xs text-gray-600 italic">Información confidencial para uso exclusivo de la solicitud.</p>
      </div>
    </div>
  );
}
