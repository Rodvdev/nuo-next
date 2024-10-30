"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { XIcon } from "lucide-react";
import { FormData, Partner, DocumentType, Residency } from "@/types/types";

// Interface for the component props
interface PartnerInformationProps {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
  nextStep: () => void;
  isNextDisabled: boolean;
  setIsNextDisabled: (disabled: boolean) => void;
  showForm: boolean;
  setShowForm: (show: boolean) => void;
}

// Validation for email format
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validation for phone number format (ensuring it's numeric)
const isValidPhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^[0-9]+$/;
  return phoneRegex.test(phone);
};

export function PartnerInformation({
  formData,
  updateFormData,
  nextStep,
  isNextDisabled,
  setIsNextDisabled,
  showForm,
  setShowForm,
}: PartnerInformationProps) {
  const [partners, setPartners] = useState<Partner[]>(formData.partners || []);
  const [numPartners, setNumPartners] = useState<number>(partners.length || 0);
  const [partnerToDelete, setPartnerToDelete] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Updating partners based on residency and numPartners
  useEffect(() => {
    if (numPartners > 0) {
      const updatedPartners = Array.from({ length: numPartners }, (_, index) => {
        const partner: Partner = partners[index] || {
          name: "",
          lastName: "",
          documentType: formData.residency === Residency.Extranjero ? DocumentType.ForeignId : DocumentType.DNI,
          documentNumber: "",
          nationality: formData.residency === Residency.Extranjero ? "Extranjero" : "Peruano",
          otherNationality: "",
          email: "",
          phone: "",
          countryCode: "+51",
        };

        return partner;
      });

      setPartners(updatedPartners);
      updateFormData({ partners: updatedPartners });
    }
  }, [numPartners, formData.residency]);

  useEffect(() => {
    validateForm(partners);
  }, [partners]);

  const validateForm = (partnersList: Partner[]) => {
    const allFieldsFilled =
      partnersList.length >= 2 &&
      partnersList.every(
        (partner) =>
          partner.name &&
          partner.lastName &&
          partner.documentType &&
          partner.documentNumber &&
          (partner.nationality !== "Otra" || partner.otherNationality) &&
          partner.email &&
          isValidEmail(partner.email) &&
          partner.phone &&
          isValidPhoneNumber(partner.phone) && // Ensure phone is valid
          partner.countryCode
      );
    setIsNextDisabled(!allFieldsFilled);
  };

  const handlePartnerChange = (index: number, field: keyof Partner, value: string) => {
    const updatedPartners = [...partners];
    updatedPartners[index] = { ...updatedPartners[index], [field]: value };

    if (field === "nationality" && value !== "Otra") {
      updatedPartners[index].otherNationality = "";
    }

    setPartners(updatedPartners);
    updateFormData({ partners: updatedPartners });
    validateForm(updatedPartners);
  };

  const handleRemovePartner = (index: number) => {
    if (partners.length > 2) {
      const updatedPartners = [...partners];
      updatedPartners.splice(index, 1);
      setPartners(updatedPartners);
      setNumPartners(updatedPartners.length);
      updateFormData({ partners: updatedPartners });
    } else {
      const updatedPartners = [...partners];
      updatedPartners[index] = {
        name: "",
        lastName: "",
        documentType: formData.residency === Residency.Extranjero ? DocumentType.ForeignId : DocumentType.DNI,
        documentNumber: "",
        nationality: "Peruano",
        otherNationality: "",
        email: "",
        phone: "",
        countryCode: "+51",
      };
      setPartners(updatedPartners);
      updateFormData({ partners: updatedPartners });
    }
  };

  const handleAddPartner = () => {
    const newPartner: Partner = {
      name: "",
      lastName: "",
      documentType: formData.residency === Residency.Extranjero ? DocumentType.ForeignId : DocumentType.DNI,
      documentNumber: "",
      nationality: formData.residency === Residency.Extranjero ? "Extranjero" : "Peruano",
      otherNationality: "",
      email: "",
      phone: "",
      countryCode: "+51",
    };
    setPartners([...partners, newPartner]);
    setNumPartners(numPartners + 1);
  };

  const handleNextStep = () => {
    if (partners.length >= 2) {
      nextStep();
    }
  };

  const handleBackToNumSelection = () => {
    setShowForm(false);
    setPartners([]);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {!showForm && (
        <div className="space-y-4 flex flex-col items-center">
          <Label htmlFor="numPartners" className="text-2xl font-bold">
            ¿Cuántos socios tiene tu empresa?
          </Label>
          <Input
            id="numPartners"
            type="number"
            value={numPartners || ""}
            onChange={(e) => setNumPartners(parseInt(e.target.value))}
            placeholder="Ingresa el número de socios"
            className="max-w-md text-center mx-auto border-2 border-gray-300 rounded-lg p-2 focus:outline-none w-full"
          />
          {numPartners < 2 && <p className="text-red-500">Debe haber al menos 2 socios.</p>}
          <Button onClick={() => setShowForm(true)} disabled={numPartners < 2} className="mt-4 mx-auto text-white rounded-lg px-6 py-2 w-full">
            Continuar
          </Button>
        </div>
      )}

      {showForm && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {partners.map((partner, index) => (
              <div key={index} className="space-y-4 rounded-lg bg-white duration-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-black-700 border-b pb-2">Socio {index + 1}</h3>
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <XIcon
                        className="cursor-pointer text-red-500"
                        onClick={() => {
                          setPartnerToDelete(index);
                          setIsDialogOpen(true);
                        }}
                      />
                    </DialogTrigger>
                    <DialogContent>
                      <h2>¿Estás seguro que deseas eliminar al socio {partner.name}?</h2>
                      <DialogFooter>
                        <Button variant="ghost" onClick={() => setIsDialogOpen(false)}>
                          NO
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => {
                            if (partnerToDelete !== null) {
                              handleRemovePartner(partnerToDelete); // Ensures partnerToDelete is a number
                            }
                            setIsDialogOpen(false);
                          }}
                        >
                          SÍ
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  <div className="relative">
                    <Label htmlFor={`name-${index}`} className="absolute -top-3 left-3 bg-white px-1 text-sm text-black-600 z-10">
                      Nombre
                    </Label>
                    <Input
                      id={`name-${index}`}
                      value={partner.name}
                      onChange={(e) => handlePartnerChange(index, "name", e.target.value)}
                      placeholder="Ingrese el nombre del socio"
                      className="border-2 border-gray-300 rounded-lg p-2 focus:outline-none w-full"
                    />
                  </div>

                  <div className="relative">
                    <Label htmlFor={`lastName-${index}`} className="absolute -top-3 left-3 bg-white px-1 text-sm text-black-600 z-10">
                      Apellidos
                    </Label>
                    <Input
                      id={`lastName-${index}`}
                      value={partner.lastName}
                      onChange={(e) => handlePartnerChange(index, "lastName", e.target.value)}
                      placeholder="Ingrese los apellidos del socio"
                      className="border-2 border-gray-300 rounded-lg p-2 focus:outline-none w-full"
                    />
                  </div>

                  <div className="relative">
                    <Label htmlFor={`nationality-${index}`} className="absolute -top-3 left-3 bg-white px-1 text-sm text-black-600 z-10">
                      Nacionalidad
                    </Label>
                    <Select onValueChange={(value) => handlePartnerChange(index, "nationality", value)} defaultValue={partner.nationality}>
                      <SelectTrigger id={`nationality-${index}`} className="border-2 border-gray-300 rounded-lg focus:outline-none">
                        <SelectValue placeholder="Selecciona la nacionalidad" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Peruano">Peruano</SelectItem>
                        <SelectItem value="Extranjero">Extranjero</SelectItem>
                        <SelectItem value="Otra">Otra</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Tipo de Documento y Número */}
                  <div className="relative">
                    <div className="flex space-x-2">
                      {/* Tipo de Documento */}
                      <div className="relative flex-[0.2]" style={{ maxWidth: "80px" }}>
                        <Select onValueChange={(value) => handlePartnerChange(index, "documentType", value)} defaultValue={partner.documentType || "dni"}>
                          <SelectTrigger id={`documentType-${index}`} className="border-2 border-gray-300 rounded-lg focus:border-blue-600">
                            <SelectValue placeholder="Selecciona el tipo de documento" />
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
                        <Label htmlFor={`documentNumber-${index}`} className="absolute -top-3 left-3 bg-white px-1 text-sm text-black-600 z-10">
                          Número de Documento
                        </Label>
                        <Input
                          placeholder="Número de documento"
                          id={`documentNumber-${index}`}
                          maxLength={partner.documentType === "passport" ? 9 : 8}
                          value={partner.documentNumber || ""}
                          onChange={(e) => handlePartnerChange(index, "documentNumber", e.target.value)}
                          className="border-2 border-gray-300 rounded-lg p-2 focus:border-blue-600 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Celular con selección de país */}
                  <div className="relative">
                    <div className="flex space-x-2">
                      {/* Número de celular */}
                      <div className="relative flex-[0.8]">
                        <Label htmlFor={`phone-${index}`} className="absolute -top-3 left-3 bg-white px-1 text-sm text-black-600 z-10">
                          Teléfono
                        </Label>
                        <Input
                          id={`phone-${index}`}
                          type="tel"
                          value={partner.phone || ""}
                          onChange={(e) => handlePartnerChange(index, "phone", e.target.value)}
                          placeholder="Ingrese el teléfono"
                          className="border-2 border-gray-300 rounded-lg p-2 focus:outline-none w-full"
                        />
                        {!isValidPhoneNumber(partner.phone ?? "") && partner.phone && (
                          <p className="text-red-500">Ingrese un número de teléfono válido.</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {partner.nationality === "Otra" && (
                    <div className="relative">
                      <Label htmlFor={`otherNationality-${index}`} className="absolute -top-3 left-3 bg-white px-1 text-sm text-black-600 z-10">
                        Especificar otra nacionalidad
                      </Label>
                      <Input
                        id={`otherNationality-${index}`}
                        value={partner.otherNationality}
                        onChange={(e) => handlePartnerChange(index, "otherNationality", e.target.value)}
                        placeholder="Especifique otra nacionalidad"
                        className="border-2 border-gray-300 rounded-lg p-2 focus:outline-none w-full"
                      />
                    </div>
                  )}

                  <div className="relative">
                    <Label htmlFor={`email-${index}`} className="absolute -top-3 left-3 bg-white px-1 text-sm text-black-600 z-10">
                      Correo Electrónico
                    </Label>
                    <Input
                      id={`email-${index}`}
                      value={partner.email || ""} // Ensure email is always a string
                      onChange={(e) => handlePartnerChange(index, "email", e.target.value)}
                      placeholder="Ingrese el correo electrónico"
                      className="border-2 border-gray-300 rounded-lg p-2 focus:outline-none w-full"
                    />
                    {!isValidEmail(partner.email ?? "") && partner.email && (
                      <p className="text-red-500">Ingrese un correo válido (ej. nombre@ejemplo.com).</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-6">
            <Button onClick={handleAddPartner} className="w-full md:w-auto">
              Agregar Socio
            </Button>
          </div>

          <div className="flex justify-center mt-6">
            <Button onClick={handleNextStep} className="text-white rounded-lg px-6 py-2 w-full md:w-auto" disabled={isNextDisabled}>
              Continuar
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
