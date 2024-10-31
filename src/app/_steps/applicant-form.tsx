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
  const [documentNumberError, setDocumentNumberError] = useState('');
  const [documentTypeError, setDocumentTypeError] = useState('');

  const handleInputChange = (field: keyof FormData, value: string) => {
    updateFormData({ [field]: value });
  };

  useEffect(() => {
    const isFormValid =
      formData.applicantFirstName &&
      formData.applicantLastName &&
      formData.documentType &&
      formData.documentNumber &&
      formData.applicantEmail &&
      isValidEmail(formData.applicantEmail) &&
      isValidPhoneNumber(formData.applicantPhone) &&
      !documentNumberError && 
      !documentTypeError;

    setIsNextDisabled(!isFormValid);
  }, [formData, setIsNextDisabled, documentNumberError, documentTypeError]);

  const isValidEmail = (email: string | undefined): boolean => {
    if (!email) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPhoneNumber = (phone: string | undefined): boolean => {
    if (!phone) return false;
    const phoneRegex = /^[0-9]+$/;
    return phoneRegex.test(phone);
  };

  const handleDocumentTypeChange = (value: string) => {
    handleInputChange('documentType', value);
    setDocumentTypeError(''); // Reset error on document type change
    validateDocumentNumber(value, formData.documentNumber || ''); // Validar el número de documento al cambiar el tipo
  };

  const validateDocumentNumber = (type: string, number: string) => {
    let error = '';
    const isNumeric = /^[0-9]+$/.test(number);

    switch (type) {
      case 'dni':
        if (!isNumeric || number.length !== 8) {
          error = 'El DNI debe contener 8 números.';
        }
        break;
      case 'foreignId':
        if (!isNumeric || number.length !== 9) {
          error = 'El Carné de Extranjería debe contener 9 números.';
        }
        break;
      case 'passport':
        if (number.length < 5) {
          error = 'El Pasaporte debe tener al menos 5 caracteres.';
        }
        break;
      default:
        error = 'Selecciona el tipo de documento.'; // Error si no hay tipo de documento seleccionado
    }
    setDocumentNumberError(error);
  };

  const handleDocumentNumberChange = (value: string) => {
    handleInputChange('documentNumber', value);
    validateDocumentNumber(formData.documentType || '', value);
  };

  return (
    <div className="space-y-6 max-w-[500px] mx-auto mt-9">
      <h1 className="text-2xl font-bold text-center">Ingresa tus datos personales</h1>

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
          <div className="relative flex-shrink-0" style={{ maxWidth: "80px" }}>
            <Select onValueChange={handleDocumentTypeChange} value={formData.documentType || ''}>
              <SelectTrigger id="documentType" className="border-2 border-gray-300 rounded-lg focus:border-blue-600">
                <SelectValue placeholder="Tipo de doc" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dni">DNI</SelectItem>
                <SelectItem value="passport">Pasaporte</SelectItem>
                <SelectItem value="foreignId">Carné de Extranjería</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Error si no hay tipo de documento seleccionado */}
          {documentTypeError && (
            <p className="text-red-500 text-sm">{documentTypeError}</p>
          )}

          {/* Número de Documento */}
          <div className="relative flex-grow">
            <Label
              htmlFor="documentNumber"
              className="absolute -top-3 left-3 bg-white px-1 text-sm text-gray-600 z-10"
            >
              Número de Documento
            </Label>
            <Input
              placeholder="Número de documento"
              id="documentNumber"
              maxLength={formData.documentType === 'passport' ? 20 : (formData.documentType === 'foreignId' ? 9 : 8)}
              value={formData.documentNumber || ''}
              onChange={(e) => handleDocumentNumberChange(e.target.value)}
              className="border-2 border-gray-300 rounded-lg p-2 focus:border-blue-600 focus:outline-none"
            />
          </div>
        </div>

        {documentNumberError && (
          <div className="flex items-center bg-red-100 border-l-4 border-red-500 text-red-700 p-2 mt-2 w-full rounded-lg">
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
            <p className="text-sm">{documentNumberError}</p>
          </div>
        )}
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
          <div className="flex items-center bg-red-100 border-l-4 border-red-500 text-red-700 p-2 mt-2 w-full rounded-lg">
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
            <p className="text-sm">Ingrese un correo válido (ej. nombre@ejemplo.com).</p>
          </div>
        )}
      </div>

      {/* Teléfono */}
      <div className="relative">
        <Label
          htmlFor="applicantPhone"
          className="absolute -top-3 left-3 bg-white px-1 text-sm text-gray-600 z-10"
        >
          Teléfono
        </Label>
        <Input
          placeholder="Ingrese su número de teléfono"
          id="applicantPhone"
          type="tel"
          maxLength={15}
          value={formData.applicantPhone || ''}
          onChange={(e) => {
            const numericValue = e.target.value.replace(/\D/g, ''); // Allow only numbers
            handleInputChange('applicantPhone', numericValue);
          }}
          className="border-2 border-gray-300 rounded-lg p-2 focus:border-blue-600 focus:outline-none"
        />
        {!isValidPhoneNumber(formData.applicantPhone) && formData.applicantPhone && (
          <p className="text-red-500">El número de teléfono debe contener solo dígitos.</p>
        )}
      </div>
    </div>
  );
}
