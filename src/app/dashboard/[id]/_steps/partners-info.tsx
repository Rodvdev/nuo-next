import InfoItem from '../_components/info-item';
import { Application } from '@/types/types';

interface PartnersInfoStepProps {
    application: Application;
}

export default function PartnersInfoStep({ application }: PartnersInfoStepProps) {
    return (
        <div className="bg-white p-4 rounded-lg shadow-sm max-w-md mx-auto border border-gray-200">
            {/* Encabezado principal para los socios */}
            <div className="text-left mb-3">
                <h1 className="text-xl font-semibold text-gray-800">Socios y Aportes</h1>
                <p className="text-sm text-gray-500">Información detallada de los socios de la empresa</p>
            </div>

            {/* Mapeo y presentación de cada socio en una tarjeta compacta */}
            <div className="space-y-3">
                {application.partners.map((partner, index) => (
                    <div key={index} className="p-3 border rounded-lg bg-gray-50 shadow-sm">
                        <div className="flex justify-between">
                            <InfoItem label="Nombre" value={`${partner.name} ${partner.lastName}`} />
                            <span className="text-sm text-gray-500">{`${partner.documentType} ${partner.documentNumber}`}</span>
                        </div>
                        <InfoItem label="Nacionalidad" value={partner.nationality} />
                        <InfoItem label="Contacto" value={`${partner.email} / ${partner.countryCode} ${partner.phone}`} />
                        {partner.monetaryContribution && (
                            <InfoItem
                                label="Capital"
                                value={`${partner.currency ?? ''} ${partner.monetaryContribution}`}
                            />
                        )}
                    </div>
                ))}
            </div>

            {/* Nota al pie */}
            <div className="text-center mt-4">
                <p className="text-xs text-gray-500">Información confidencial para uso exclusivo de la solicitud.</p>
            </div>
        </div>
    );
}
