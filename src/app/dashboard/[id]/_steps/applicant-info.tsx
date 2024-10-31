import InfoItem from '../_components/info-item';
import { ApplicantInfo } from '@/types/types';

export interface ApplicantStepProps {
  application: ApplicantInfo;
}

export default function ApplicantInfoStep({ application }: ApplicantStepProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm max-w-sm mx-auto border border-gray-200 relative">
      {/* Título a la izquierda y Documento a la derecha */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold text-gray-800">Perfil del Solicitante</h1>
        <span className="text-sm text-gray-500">{`${application.documentType} ${application.documentNumber}`}</span>
      </div>

      {/* Información en formato resumido */}
      <div className="grid grid-cols-1 gap-1 text-sm text-gray-700">
        <InfoItem label="Nombre" value={`${application.applicantFirstName} ${application.applicantLastName}`} />
        <InfoItem label="Contacto" value={`${application.applicantEmail} / ${application.applicantPhoneCode || "+51"} ${application.applicantPhone}`} />
        <InfoItem label="Residencia" value={application.residency} />
      </div>

      {/* Nota al pie */}
      <div className="text-center mt-3">
        <p className="text-xs text-gray-500">Información confidencial para uso exclusivo de la solicitud.</p>
      </div>
    </div>
  );
}
