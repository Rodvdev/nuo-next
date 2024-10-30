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
  // Función para validar el formato del correo electrónico
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Expresión regular básica para validar email
    return emailRegex.test(email);
  };

  const [ceoInfo, setCeoInfo] = useState<CEO>(formData.ceo || {});
  const [isNewCeo, setIsNewCeo] = useState(!formData.ceo?.partner);
  const [requiresLegalRep, setRequiresLegalRep] = useState(false);

  useEffect(() => {
    // Verificar si el CEO necesita un representante legal según nacionalidad y documento
    if (ceoInfo.nationality && ceoInfo.documentType) {
      setRequiresLegalRep(
        ceoInfo.nationality !== 'Peruano' &&
        (ceoInfo.documentType === DocumentType.ForeignId || ceoInfo.documentType === DocumentType.Passport)
      );
    }
    validateForm(ceoInfo);  // Revalidar cuando se cambien estos valores
  }, [ceoInfo.nationality, ceoInfo.documentType]);

  const handleCeoChange = (field: keyof CEO, value: string) => {
    const updatedCeo = { ...ceoInfo, [field]: value };

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

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-semibold">Elegir CEO</h3>

      {/* Selección de CEO entre socios o nuevo CEO */}
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

      {/* Si es un nuevo CEO, mostrar formulario */}
      {isNewCeo && (
        <div className="grid grid-cols-2 gap-4">
          <div className="relative">
            <Label htmlFor="ceoName" className="absolute -top-3 left-3 bg-white px-1 text-sm text-gray-600 z-10">
              Nombre
            </Label>
            <Input
              id="ceoName"
              value={ceoInfo.name || ''}
              onChange={(e) => handleCeoChange('name', e.target.value)}
              className="border-2 border-gray-300 rounded-lg p-2 focus:outline-none"
            />
          </div>

          <div className="relative">
            <Label htmlFor="ceoLastName" className="absolute -top-3 left-3 bg-white px-1 text-sm text-gray-600 z-10">
              Apellidos
            </Label>
            <Input
              id="ceoLastName"
              value={ceoInfo.lastName || ''}
              onChange={(e) => handleCeoChange('lastName', e.target.value)}
              className="border-2 border-gray-300 rounded-lg p-2 focus:outline-none"
            />
          </div>

          {/* Tipo de documento y número */}
          <div className="flex space-x-4">
            <div className="relative flex-1">
              <Label htmlFor="ceoDocumentType" className="absolute -top-3 left-3 bg-white px-1 text-sm text-gray-600 z-10">
                Tipo de documento
              </Label>
              <Select
                onValueChange={(value) => handleCeoChange('documentType', value as DocumentType)}
                defaultValue={ceoInfo.documentType}
              >
                <SelectTrigger id="ceoDocumentType" className="border-2 border-gray-300 rounded-lg focus:outline-none">
                  <SelectValue placeholder="Selecciona el tipo de documento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={DocumentType.Passport}>Pasaporte</SelectItem>
                  <SelectItem value={DocumentType.DNI}>DNI</SelectItem>
                  <SelectItem value={DocumentType.ForeignId}>Carnet de Extranjería</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="relative flex-2">
              <Label htmlFor="ceoDocumentNumber" className="absolute -top-3 left-3 bg-white px-1 text-sm text-gray-600 z-10">
                Número de documento
              </Label>
              <Input
                id="ceoDocumentNumber"
                value={ceoInfo.documentNumber || ''}
                onChange={(e) => handleCeoChange('documentNumber', e.target.value)}
                className="border-2 border-gray-300 rounded-lg p-2 focus:outline-none"
              />
            </div>
          </div>

          {/* Nacionalidad */}
          <div className="relative">
            <Label htmlFor="ceoNationality" className="absolute -top-3 left-3 bg-white px-1 text-sm text-gray-600 z-10">
              Nacionalidad
            </Label>
            <Select
              onValueChange={(value) => handleCeoChange('nationality', value)}
              defaultValue={ceoInfo.nationality}
            >
              <SelectTrigger id="ceoNationality" className="border-2 border-gray-300 rounded-lg focus:outline-none">
                <SelectValue placeholder="Selecciona la nacionalidad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Peruano">Peruano</SelectItem>
                <SelectItem value="Extranjero">Extranjero</SelectItem>
                <SelectItem value="Otra">Otra</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {ceoInfo.nationality === 'Otra' && (
            <div className="relative">
              <Label htmlFor="otherNationality" className="absolute -top-3 left-3 bg-white px-1 text-sm text-gray-600 z-10">
                Especificar otra nacionalidad
              </Label>
              <Input
                id="otherNationality"
                value={"otra"}
                onChange={(e) => handleCeoChange('nationality', e.target.value)}
                className="border-2 border-gray-300 rounded-lg p-2 focus:outline-none"
              />
            </div>
          )}
          <div className="relative">
            <Label htmlFor="ceoPhone" className="absolute -top-3 left-3 bg-white px-1 text-sm text-gray-600 z-10">
              Teléfono
            </Label>
            <Input
              id="ceoPhone"
              type="tel"
              value={ceoInfo.phone || ''}
              onChange={(e) => handleCeoChange('phone', e.target.value)}
              className="border-2 border-gray-300 rounded-lg p-2 focus:outline-none"
            />
          </div>
          {/* Correo Electrónico */}
          <div className="relative">
            <Label
              htmlFor="applicantEmail"
              className="absolute -top-3 left-3 bg-white px-1 text-sm text-gray-600 z-10">
              Correo Electrónico
            </Label>
            <Input
              placeholder="Ingrese su correo electrónico"
              id="CeoEmail"
              type="email"
              value={ceoInfo.email || ''}
              onChange={(e) => handleCeoChange('email', e.target.value)}
              className="border-2 border-gray-300 rounded-lg p-2 focus:border-blue-600 focus:outline-none"
              required={true}
            />
            {!isValidEmail(ceoInfo.email || '') && ceoInfo.email && (
              <p className="text-red-500">Ingrese un correo válido (ej. nombre@ejemplo.com).</p>
            )}
          </div>
        </div>
      )}

      {/* Si requiere representante legal */}
      {requiresLegalRep && (
        <div className="grid grid-cols-2 gap-4 mt-6">
          <h4 className="col-span-2 text-lg font-semibold text-red-600">
            El CEO es extranjero no residente. Se requiere un representante legal en Perú.
          </h4>

          <div className="relative">
            <Label htmlFor="legalRepName" className="absolute -top-3 left-3 bg-white px-1 text-sm text-gray-600 z-10">
              Nombre del Representante Legal
            </Label>
            <Input
              id="legalRepName"
              value={ceoInfo.legalRepName || ''}
              onChange={(e) => handleCeoChange('legalRepName', e.target.value)}
              className="border-2 border-gray-300 rounded-lg p-2 focus:outline-none"
            />
          </div>

          <div className="relative">
            <Label htmlFor="legalRepEmail" className="absolute -top-3 left-3 bg-white px-1 text-sm text-gray-600 z-10">
              Correo del Representante Legal
            </Label>
            <Input
              id="legalRepEmail"
              type="email"
              value={ceoInfo.legalRepEmail || ''}
              onChange={(e) => handleCeoChange('legalRepEmail', e.target.value)}
              className="border-2 border-gray-300 rounded-lg p-2 focus:outline-none"
            />
          </div>
        </div>
      )}
    </div>
  );
}
