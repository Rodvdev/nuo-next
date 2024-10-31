'use client';

import { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormData, CEO, DocumentType } from "@/types/types";

interface CEOSelectionProps {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
  setIsNextDisabled: (disabled: boolean) => void;
}

export function CEOSelection({
  formData,
  updateFormData,
  setIsNextDisabled,
}: CEOSelectionProps) {
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const [ceoInfo, setCeoInfo] = useState<CEO>(formData.ceo || {});
  const [isNewCeo, setIsNewCeo] = useState(!formData.ceo?.partner);
  const [requiresLegalRep, setRequiresLegalRep] = useState(false);
  const [documentError, setDocumentError] = useState("");

  useEffect(() => {
    if (ceoInfo.nationality && ceoInfo.documentType) {
      setRequiresLegalRep(
        ceoInfo.nationality !== "Peruano" &&
        (ceoInfo.documentType === DocumentType.ForeignId || ceoInfo.documentType === DocumentType.Passport)
      );
    }
    validateForm(ceoInfo);
  }, [ceoInfo]);

  const handleCeoChange = (field: keyof CEO, value: string) => {
    const updatedCeo = { ...ceoInfo, [field]: value };

    if (field === "documentType" || field === "documentNumber") {
      const error = validateDocumentNumber(updatedCeo.documentType!, updatedCeo.documentNumber || "");
      setDocumentError(error);
    }

    setCeoInfo(updatedCeo);
    updateFormData({ ceo: updatedCeo });
    validateForm(updatedCeo);
  };

  const handlePartnerAsCeo = (partner: CEO) => {
    setIsNewCeo(false);
    const selectedCeo = { ...partner, partner: true };
    setCeoInfo(selectedCeo);
    updateFormData({ ceo: selectedCeo });
    setRequiresLegalRep(
      selectedCeo.nationality !== 'Peruano' && selectedCeo.documentType === DocumentType.ForeignId
    );
    validateForm(selectedCeo);
  };

  const handleNewCeo = () => {
    setIsNewCeo(true);
    setCeoInfo({});
    updateFormData({ ceo: {} });
    validateForm({});
  };

  const validateForm = (updatedCeo: CEO) => {
    const isCeoValid =
      updatedCeo.name &&
      updatedCeo.lastName &&
      updatedCeo.documentType &&
      updatedCeo.documentNumber &&
      updatedCeo.nationality !== 'Otra' &&
      isValidEmail(updatedCeo.email || '') &&
      updatedCeo.phone;

    const isLegalRepValid =
      !requiresLegalRep || (updatedCeo.name && updatedCeo.email);

    setIsNextDisabled(!(isCeoValid && isLegalRepValid));
  };

  
  const validateDocumentNumber = (type: DocumentType, number: string) => {
    let error = "";
    const isNumeric = /^[0-9]+$/.test(number);

    if (type === DocumentType.DNI && (!isNumeric || number.length !== 8)) {
      error = "El DNI debe contener 8 números.";
    } else if (type === DocumentType.ForeignId && (!isNumeric || number.length !== 9)) {
      error = "El Carnet de Extranjería debe contener 9 números.";
    } else if (type === DocumentType.Passport && number.length < 5) {
      error = "El Pasaporte debe tener al menos 5 caracteres.";
    }
    return error;
  };

  return (
    <div className="space-y-6 overflow-hidden"> {/* Added overflow-hidden to prevent scroll */}
      <h3 className="text-2xl font-semibold">Elegir CEO</h3>

      <div>
        <Select
          onValueChange={(value) => {
            if (value === 'new-ceo') {
              handleNewCeo();
            } else {
              const partner = formData.partners?.find((p) => `${p.name} ${p.lastName}` === value);
              if (partner) handlePartnerAsCeo(partner as CEO);
            }
          }}
          defaultValue={isNewCeo ? 'new-ceo' : `${ceoInfo.name} ${ceoInfo.lastName}`}
        >
          <SelectTrigger className="border-2 border-gray-300 rounded-lg focus:outline-none">
            <SelectValue placeholder="Selecciona un socio o agrega un nuevo CEO" />
          </SelectTrigger>
          <SelectContent>
            {formData.partners && formData.partners.map((partner, index) => (
              <SelectItem key={index} value={`${partner.name} ${partner.lastName}`}>
                {partner.name} {partner.lastName} (Socio) {partner.nationality ? `(${partner.nationality})` : ''}
              </SelectItem>
            ))}
            <SelectItem value="new-ceo">Asignar un nuevo CEO</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isNewCeo && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <Label htmlFor="ceoName" className="absolute -top-3 left-3 bg-white px-1 text-sm text-gray-600 z-10">
            Nombre
          </Label>
          <Input
            id="ceoName"
            value={ceoInfo.name || ""}
            onChange={(e) => handleCeoChange("name", e.target.value)}
            className="border-2 border-gray-300 rounded-lg p-2 focus:outline-none w-full"
          />
        </div>

        <div className="relative">
          <Label htmlFor="ceoLastName" className="absolute -top-3 left-3 bg-white px-1 text-sm text-gray-600 z-10">
            Apellidos
          </Label>
          <Input
            id="ceoLastName"
            value={ceoInfo.lastName || ""}
            onChange={(e) => handleCeoChange("lastName", e.target.value)}
            className="border-2 border-gray-300 rounded-lg p-2 focus:outline-none w-full"
          />
        </div>

        {/* Campo de selección de nacionalidad */}
        <div className="relative">
          <Label htmlFor="ceoNationality" className="absolute -top-3 left-3 bg-white px-1 text-sm text-gray-600 z-10">
            Nacionalidad
          </Label>
          <Select onValueChange={(value) => handleCeoChange("nationality", value)} defaultValue={ceoInfo.nationality}>
            <SelectTrigger className="border-2 border-gray-300 rounded-lg focus:outline-none">
              <SelectValue placeholder="Selecciona la nacionalidad" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Peruano">Peruano</SelectItem>
              <SelectItem value="Extranjero">Extranjero</SelectItem>
              <SelectItem value="Otra">Otra</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex space-x-2">
          <Select onValueChange={(value) => handleCeoChange("documentType", value as DocumentType)} defaultValue={ceoInfo.documentType}>
            <SelectTrigger className="border-2 border-gray-300 rounded-lg focus:outline-none">
              <SelectValue placeholder="Tipo de documento" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={DocumentType.DNI}>DNI</SelectItem>
              <SelectItem value={DocumentType.ForeignId}>Carnet de Extranjería</SelectItem>
              <SelectItem value={DocumentType.Passport}>Pasaporte</SelectItem>
            </SelectContent>
          </Select>

          <Input
            id="ceoDocumentNumber"
            value={ceoInfo.documentNumber || ""}
            onChange={(e) => handleCeoChange("documentNumber", e.target.value)}
            placeholder="Número de documento"
            className="border-2 border-gray-300 rounded-lg p-2 focus:outline-none w-full"
          />
        </div>

        {documentError && <p className="text-red-500 text-sm">{documentError}</p>}

        <div className="relative">
          <Label htmlFor="ceoEmail" className="absolute -top-3 left-3 bg-white px-1 text-sm text-gray-600 z-10">
            Correo Electrónico
          </Label>
          <Input
            id="ceoEmail"
            value={ceoInfo.email || ""}
            onChange={(e) => handleCeoChange("email", e.target.value)}
            className="border-2 border-gray-300 rounded-lg p-2 focus:outline-none w-full"
          />
          {!isValidEmail(ceoInfo.email || "") && ceoInfo.email && <p className="text-red-500">Correo inválido.</p>}
        </div>

        <div className="relative">
          <Label htmlFor="ceoPhone" className="absolute -top-3 left-3 bg-white px-1 text-sm text-gray-600 z-10">
            Teléfono
          </Label>
          <Input
            id="ceoPhone"
            value={ceoInfo.phone || ""}
            onChange={(e) => handleCeoChange("phone", e.target.value)}
            className="border-2 border-gray-300 rounded-lg p-2 focus:outline-none w-full"
          />
        </div>

        {requiresLegalRep && (
          <>
            <div className="relative">
              <Label htmlFor="legalRepName" className="absolute -top-3 left-3 bg-white px-1 text-sm text-gray-600 z-10">
                Nombre del Representante Legal
              </Label>
              <Input
                id="legalRepName"
                value={ceoInfo.legalRepName || ""}
                onChange={(e) => handleCeoChange("legalRepName", e.target.value)}
                className="border-2 border-gray-300 rounded-lg p-2 focus:outline-none w-full"
              />
            </div>
            <div className="relative">
              <Label htmlFor="legalRepEmail" className="absolute -top-3 left-3 bg-white px-1 text-sm text-gray-600 z-10">
                Correo del Representante Legal
              </Label>
              <Input
                id="legalRepEmail"
                value={ceoInfo.legalRepEmail || ""}
                onChange={(e) => handleCeoChange("legalRepEmail", e.target.value)}
                className="border-2 border-gray-300 rounded-lg p-2 focus:outline-none w-full"
              />
            </div>
          </>
        )}
      </div>
      )}


      {requiresLegalRep && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <h4 className="col-span-2 text-md font-semibold text-red-600 flex items-center">
            {/* SVG de advertencia */}
            <div className="flex items-center bg-red-100 border-l-4 border-red-500 text-red-700 p-2 rounded-lg">
              <svg
                className="w-4 h-4 text-red-500 mr-2"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01M12 2a10 10 0 100 20 10 10 0 000-20z"
                />
              </svg>
              El CEO es extranjero no residente. Se requiere un representante legal en Perú.
            </div>
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="relative col-span-1">
              <Label htmlFor="legalRepName" className="absolute -top-3 left-3 bg-white px-1 text-sm text-gray-600 z-10">
                Nombre del Representante Legal
              </Label>
              <Input
                id="legalRepName"
                value={ceoInfo.legalRepName || ''}
                onChange={(e) => handleCeoChange('legalRepName', e.target.value)}
                className="border-2 border-gray-300 rounded-lg p-2 focus:outline-none w-full"
              />
            </div>

            <div className="relative col-span-1">
              <Label htmlFor="legalRepEmail" className="absolute -top-3 left-3 bg-white px-1 text-sm text-gray-600 z-10">
                Correo del Representante Legal
              </Label>
              <Input
                id="legalRepEmail"
                type="email"
                value={ceoInfo.legalRepEmail || ''}
                onChange={(e) => handleCeoChange('legalRepEmail', e.target.value)}
                className="border-2 border-gray-300 rounded-lg p-2 focus:outline-none w-full"
              />
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
