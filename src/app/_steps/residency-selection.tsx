import { FormData, Residency } from '@/types/types';
import { useState, useEffect } from 'react';

interface ResidencySelectionProps {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
  setIsNextDisabled: (disabled: boolean) => void;
}

export function ResidencySelection({ formData, updateFormData, setIsNextDisabled }: ResidencySelectionProps) {
  // Initialize selectedOption with formData.residency if it's available
  const [selectedOption, setSelectedOption] = useState<Residency | undefined>(formData.residency || Residency.Peru);

  const handleOptionChange = (option: Residency) => {
    setSelectedOption(option);
    updateFormData({ residency: option });
  };

  useEffect(() => {
    if (selectedOption) {
      setIsNextDisabled(false);
    } else {
      setIsNextDisabled(true);
    }
  }, [selectedOption, setIsNextDisabled]);

  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold mb-6">Para empezar, ¿qué opción te describe mejor?</h2>
      <div className="flex flex-col md:flex-row justify-center space-y-6 md:space-y-0 md:space-x-6">
        <div
          onClick={() => handleOptionChange(Residency.Extranjero)}
          className={`border-2 rounded-lg p-6 cursor-pointer ${selectedOption === Residency.Extranjero ? 'border-gray-500' : 'border-gray-300'} w-full md:w-64`}
        >
          <h3 className="text-2xl font-semibold text-600">Soy Extranjero</h3>
          <p className="text-sm text-gray-600">Ninguno de los socios tiene RUC o documento de identidad peruano.</p>
        </div>

        <div
          onClick={() => handleOptionChange(Residency.Peru)}
          className={`border-2 rounded-lg p-6 cursor-pointer ${selectedOption === Residency.Peru ? 'border-gray-500' : 'border-gray-300'} w-full md:w-64`}
        >
          <h3 className="text-2xl font-semibold text-600">Resido en Perú</h3>
          <p className="text-sm text-gray-600">Tú o alguno de tus socios tiene RUC o documento de identidad peruano.</p>
        </div>
      </div>
    </div>
  );
}
