'use client'

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect } from "react";
import { FormData } from "@/types/types";

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

  const handleInputChange = (field: keyof FormData, value: string) => {
    updateFormData({ [field]: value });
  };

  // Validate the form to enable/disable the "Next" button
  useEffect(() => {
    const isFormValid =
      formData.applicantFirstName &&
      formData.applicantLastName &&
      formData.documentNumber &&
      formData.applicantEmail;
    setIsNextDisabled(!isFormValid);
  }, [formData, setIsNextDisabled]);

  return (
    <div>
      <Label htmlFor="applicantFirstName">Nombre</Label>
      <Input
        id="applicantFirstName"
        value={formData.applicantFirstName || ""}
        onChange={(e) => handleInputChange("applicantFirstName", e.target.value)}
      />

      <Label htmlFor="applicantLastName">Apellidos</Label>
      <Input
        id="applicantLastName"
        value={formData.applicantLastName || ""}
        onChange={(e) => handleInputChange("applicantLastName", e.target.value)}
      />

      <Label htmlFor="documentNumber">Número de Documento</Label>
      <Input
        id="documentNumber"
        value={formData.documentNumber || ""}
        onChange={(e) => handleInputChange("documentNumber", e.target.value)}
      />

      <Label htmlFor="applicantEmail">Correo Electrónico</Label>
      <Input
        id="applicantEmail"
        value={formData.applicantEmail || ""}
        onChange={(e) => handleInputChange("applicantEmail", e.target.value)}
      />
    </div>
  );
}
