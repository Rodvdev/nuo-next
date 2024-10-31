import InfoSection from '../_components/info-section';
import { VerificationAndLicenses } from '@/types/types';

export interface VerificationStepProps {
  verification: VerificationAndLicenses;
  onChange: (field: keyof VerificationAndLicenses, value: boolean) => void;
  onComplete: () => void;
}


export default function VerificationStep() {
  return (
    <InfoSection title="Verificación y Licencias" description="Solicita permisos municipales y revisa el estado de tu empresa">
      <p>Detalles sobre licencias municipales y requerimientos adicionales.</p>
    </InfoSection>
  );
}
