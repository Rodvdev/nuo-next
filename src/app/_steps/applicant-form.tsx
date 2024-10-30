'use client';

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { FormData } from "@/types/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ApplicantInformationProps {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
  setIsNextDisabled: (disabled: boolean) => void;
}

export function ApplicantInformation({
  formData,
  updateFormData,
  setIsNextDisabled,
}: ApplicantInformationProps) {
  const [documentTypeError, setDocumentTypeError] = useState(false);

  // Handle input changes and update formData
  const handleInputChange = (field: keyof FormData, value: string) => {
    updateFormData({ [field]: value });
  };

  // Validate the form to enable/disable the "Next" button
  useEffect(() => {
    const isFormValid =
      formData.applicantFirstName &&
      formData.applicantLastName &&
      formData.documentNumber &&
      formData.applicantEmail &&
      isValidEmail(formData.applicantEmail) &&
      isValidDocumentNumber(formData.documentType, formData.documentNumber);
    setIsNextDisabled(!isFormValid);
  }, [formData, setIsNextDisabled]);

  // Function to validate the email format
  const isValidEmail = (email: string | undefined): boolean => {
    if (!email) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Function to validate the document number based on document type
  const isValidDocumentNumber = (documentType: string | undefined, documentNumber: string | undefined): boolean => {
    if (!documentType || !documentNumber) return false;

    const lengthByType: Record<string, number | [number, number]> = {
      dni: 8,           // DNI: Exactly 8 digits
      passport: [6, 9], // Passport: Between 6 and 9 characters
      foreignId: 9,     // Foreign ID: Exactly 9 characters
    };

    const length = lengthByType[documentType];

    if (Array.isArray(length)) {
      return documentNumber.length >= length[0] && documentNumber.length <= length[1];
    }

    return documentNumber.length === length;
  };

  const handleDocumentTypeChange = (value: string) => {
    handleInputChange('documentType', value);
    setDocumentTypeError(false);
  };

  return (
    <div className="space-y-6 max-w-[500px] mx-auto mt-9">

<h1 className="text-2xl font-bold">Ingrese sus datos personales</h1>
      {/* Nombre */}
      <div className="relative">
        <Label
          htmlFor="applicantFirstName"
          className="absolute -top-3 left-3 bg-white px-1 text-sm text-gray-600 z-10"
        >
          Nombre
        </Label>
        <Input
          placeholder="Ingrese sus nombres"
          id="applicantFirstName"
          maxLength={50}
          value={formData.applicantFirstName || ''}
          onChange={(e) => handleInputChange('applicantFirstName', e.target.value)}
          className="border-2 border-gray-300 rounded-lg p-2 focus:border-blue-600 focus:outline-none"
        />
      </div>

      {/* Apellidos */}
      <div className="relative">
        <Label
          htmlFor="applicantLastName"
          className="absolute -top-3 left-3 bg-white px-1 text-sm text-gray-600 z-10"
        >
          Apellidos
        </Label>
        <Input
          placeholder="Ingrese sus apellidos"
          id="applicantLastName"
          maxLength={50}
          value={formData.applicantLastName || ''}
          onChange={(e) => handleInputChange('applicantLastName', e.target.value)}
          className="border-2 border-gray-300 rounded-lg p-2 focus:border-blue-600 focus:outline-none"
        />
      </div>

      {/* Tipo de Documento y Número */}
      <div className="relative">
        <div className="flex space-x-2">
          {/* Tipo de Documento */}
          <div className="relative flex-[0.2]" style={{ maxWidth: "80px" }}>
            <Select
              onValueChange={handleDocumentTypeChange}
              value={formData.documentType || ''}
            >
              <SelectTrigger id="documentType" className="border-2 border-gray-300 rounded-lg focus:border-blue-600">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dni">DNI</SelectItem>
                <SelectItem value="passport">Pasaporte</SelectItem>
                <SelectItem value="foreignId">Carné de Extranjería</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Número de Documento */}
          <div className="relative flex-[0.8]">
            <Label
              htmlFor="documentNumber"
              className="absolute -top-3 left-3 bg-white px-1 text-sm text-gray-600 z-10"
            >
              Número de Documento
            </Label>
            <Input
              placeholder="Número de documento"
              id="documentNumber"
              maxLength={formData.documentType === 'passport' ? 9 : 8}
              value={formData.documentNumber || ''}
              onChange={(e) => {
                if (!formData.documentType) {
                  setDocumentTypeError(true);
                }
                handleInputChange('documentNumber', e.target.value);
              }}
              className="border-2 border-gray-300 rounded-lg p-2 focus:border-blue-600 focus:outline-none"
            />
            {!documentTypeError && !isValidDocumentNumber(formData.documentType, formData.documentNumber) && formData.documentNumber && (
              <p className="text-red-500">Número de documento inválido.</p>
            )}
            {documentTypeError && !isValidDocumentNumber(formData.documentType, formData.documentNumber) && formData.documentNumber && (
              <p className="text-red-500">Seleccione un tipo de documento.</p>
            )}
          </div>
        </div>
      </div>

      {/* Correo Electrónico */}
      <div className="relative">
        <Label
          htmlFor="applicantEmail"
          className="absolute -top-3 left-3 bg-white px-1 text-sm text-gray-600 z-10"
        >
          Correo Electrónico
        </Label>
        <Input
          placeholder="Ingrese su correo electrónico"
          id="applicantEmail"
          type="email"
          maxLength={100}
          value={formData.applicantEmail || ''}
          onChange={(e) => handleInputChange('applicantEmail', e.target.value)}
          className="border-2 border-gray-300 rounded-lg p-2 focus:border-blue-600 focus:outline-none"
          required
        />
        {!isValidEmail(formData.applicantEmail) && formData.applicantEmail && (
          <p className="text-red-500">Ingrese un correo válido (ej. nombre@ejemplo.com).</p>
        )}
      </div>
    </div>
  );
}
