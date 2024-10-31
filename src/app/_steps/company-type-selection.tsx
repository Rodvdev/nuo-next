import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { CompanyType, FormData } from "@/types/types";

// Define the props for the component
interface CompanyTypeSelectionProps {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
  setIsNextDisabled: (disabled: boolean) => void;
}

export function CompanyTypeSelection({ formData, updateFormData, setIsNextDisabled }: CompanyTypeSelectionProps) {
  const [selectedOption, setSelectedOption] = useState<string>(formData.companyType || '');

  const handleCompanyTypeChange = (value: CompanyType) => {
    setSelectedOption(value);
    updateFormData({ companyType: value });
  };

  // Validar si se ha seleccionado un tipo de sociedad para habilitar/deshabilitar el botón de "Continuar"
  useEffect(() => {
    if (selectedOption) {
      setIsNextDisabled(false); // Habilitar botón "Continuar"
    } else {
      setIsNextDisabled(true); // Deshabilitar botón "Continuar"
    }
  }, [selectedOption, setIsNextDisabled]);

  return (
    <div className="flex flex-col justify-center items-center text-center w-full max-w-6xl mx-auto h-full max-h-screen overflow-auto">
      <h2 className="text-2xl font-bold mb-6">¿Qué tipo de sociedad necesita tu empresa?</h2>

      {/* Cambiar flex-col a flex-row en pantallas grandes */}
      <div className="flex flex-col md:flex-row justify-center space-y-6 md:space-y-0 md:space-x-8 w-full">
        {/* Opción SAC */}
        <div
          onClick={() => handleCompanyTypeChange(CompanyType.SAC)}
          className={`border-2 rounded-lg p-6 w-full max-w-sm cursor-pointer transition-all hover:border-gray-600 ${selectedOption === CompanyType.SAC ? 'border-gray-500 bg-gray-50' : 'border-gray-300 bg-white'}`}
        >
          <h3 className="text-xl font-semibold">S.A.C. - Sociedad Anónima Cerrada</h3>
          <p className="text-base text-gray-600 mt-2">Ideal para pequeñas empresas con pocos accionistas. Las acciones no pueden ser cotizadas públicamente.</p>
        </div>

        {/* Opción SA */}
        <div
          onClick={() => handleCompanyTypeChange(CompanyType.SA)}
          className={`border-2 rounded-lg p-6 w-full max-w-sm cursor-pointer transition-all hover:border-gray-600 ${selectedOption === CompanyType.SA ? 'border-gray-500 bg-gray-50' : 'border-gray-300 bg-white'}`}
        >
          <h3 className="text-xl font-semibold">S.A. - Sociedad Anónima</h3>
          <p className="text-base text-gray-600 mt-2">Ideal para empresas más grandes, las acciones pueden cotizarse públicamente y permite una estructura más compleja.</p>
        </div>
      </div>

      {/* Diálogo informativo */}
      <div className="mt-6">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="link" className="text-600 flex items-center">
              <svg
                className="w-4 h-4 text-blue-600 mr-2"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z"
                />
              </svg>
              ¿No sabes cuál elegir?
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>¿Qué tipo de sociedad debería elegir?</DialogTitle>
              <DialogDescription>
                <strong>S.A.C. (Sociedad Anónima Cerrada):</strong> Ideal para empresas más pequeñas, donde las acciones no se cotizan públicamente. Proporciona flexibilidad y es más fácil de manejar.<br /><br />
                <strong>S.A. (Sociedad Anónima):</strong> Es ideal para empresas grandes con varios accionistas. Las acciones pueden cotizarse en bolsa y permite una estructura organizacional más amplia.
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
