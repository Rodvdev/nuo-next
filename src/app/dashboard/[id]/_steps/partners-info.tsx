import InfoItem from '../_components/info-item';
import { Application } from '@/types/types';
import { User, Globe, Mail, DollarSign, Phone, List } from 'lucide-react';

interface PartnersInfoStepProps {
    application: Application;
}

export default function PartnersInfoStep({ application }: PartnersInfoStepProps) {
    return (
        <div className="p-6 pt-2 rounded-lg max-w-md mx-auto text-white">
            {/* Encabezado principal para los socios */}
            <div className="flex items-center mb-4 space-x-2">
                <User className="w-6 h-6 text-blue-400" />
                <h1 className="text-xl font-semibold text-blue-200">Socios y Aportes</h1>
            </div>
            <p className="text-sm text-gray-400 mb-5">Información detallada de los socios de la empresa</p>

            {/* Mapeo y presentación de cada socio en una tarjeta compacta */}
            <div className="space-y-4">
                {application.partners.map((partner, index) => (
                    <div key={index} className="bg-gray-700 p-4 rounded-lg shadow-md border border-gray-500 space-y-3">
                        {/* Encabezado de nombre y documento */}
                        <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-2">
                                <h2 className="text-lg font-medium text-blue-300">
                                    {`${partner.name} ${partner.lastName}`}
                                    {partner.isCEO && <span className="ml-2 text-xs text-blue-400 font-semibold">(CEO)</span>}
                                </h2>
                            </div>
                            <span className="text-xs text-gray-400">{`${partner.documentType} ${partner.documentNumber}`}</span>
                        </div>

                        {/* Nacionalidad */}
                        <div className="flex items-center space-x-2">
                            <Globe className="w-4 h-4 text-blue-400" />
                            <InfoItem label="Nacionalidad" value={partner.nationality} />
                        </div>

                        {/* Contacto */}
                        <div className="flex items-center space-x-2">
                            <Mail className="w-4 h-4 text-blue-400" />
                            <InfoItem label="Email" value={partner.email} />
                        </div>
                        <div className="flex items-center space-x-2">
                            <Phone className="w-4 h-4 text-blue-400" />
                            <InfoItem label="Teléfono" value={`${partner.countryCode} ${partner.phone}`} />
                        </div>

                        {/* Capital (si existe) */}
                        {partner.monetaryContribution && (
                            <div className="flex items-center space-x-2">
                                <DollarSign className="w-4 h-4 text-blue-400" />
                                <InfoItem label="Capital" value={`${partner.currency ?? ''} ${partner.monetaryContribution}`} />
                            </div>
                        )}

                        {/* Contribuciones no monetarias */}
                        {partner.nonMonetaryContributions && partner.nonMonetaryContributions.length > 0 && (
                            <div>
                                <div className="flex items-center space-x-2">
                                    <List className="w-4 h-4 text-blue-400" />
                                    <h3 className="text-sm font-semibold text-blue-300">Aportes No Monetarios</h3>
                                </div>
                                <ul className="mt-2 space-y-1 pl-5 list-disc list-inside text-gray-300 text-xs">
                                    {partner.nonMonetaryContributions.map((contribution, idx) => (
                                        <li key={idx}>
                                            <span className="text-gray-300 font-medium">{contribution.nonMonetaryContribution}</span>
                                            {` - Valor: ${contribution.nonMonetaryCurrency ?? ''} ${contribution.nonMonetaryValue ?? ''}`}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Nota al pie */}
            <div className="text-center mt-5">
                <p className="text-xs italic text-gray-400">Información confidencial para uso exclusivo de la solicitud.</p>
            </div>
        </div>
    );
}
