"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { XIcon, PlusIcon } from "lucide-react";
import { FormData, Partner, DocumentType, Residency } from "@/types/types";
import { DialogTitle } from "@radix-ui/react-dialog";


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

// Validation for document number based on document type
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
            break;
    }
    return error;
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
    const [partnerMessage, setPartnerMessage] = useState<string>('');
    // Inicializa el estado de expansión siempre como true
    const [isExpanded, setIsExpanded] = useState<boolean[]>(Array(partners.length).fill(true));


    const toggleExpand = (index: number) => {
        const updatedExpanded = [...isExpanded];
        updatedExpanded[index] = !updatedExpanded[index];
        setIsExpanded(updatedExpanded);
    };

    // Document number error state
    const [documentErrors, setDocumentErrors] = useState<string[]>(Array(numPartners).fill(''));

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
            setDocumentErrors(Array(numPartners).fill('')); // Reset document errors
        }
    }, [numPartners, formData.residency]);

    useEffect(() => {
        validateForm(partners);
    }, [partners]);

    useEffect(() => {
        // Mensajes personalizados según el número de socios
        if (numPartners === 0) {
            setPartnerMessage('');
        } else if (numPartners === 1) {
            setPartnerMessage("¡Para constituir una empresa necesitas al menos 2 socios!");
        } else if (numPartners === 2) {
            setPartnerMessage("¡Genial! Tener 2 socios puede ayudar a compartir la carga de trabajo y las decisiones, lo que fortalece la estructura de la empresa.");
        } else if (numPartners === 3) {
            setPartnerMessage("¡Excelente! Con 3 socios, pueden combinar sus habilidades y experiencias para enfrentar desafíos y generar nuevas ideas.");
        } else if (numPartners === 4) {
            setPartnerMessage("¡Impresionante! Tener 4 socios puede enriquecer la toma de decisiones y promover la diversidad de perspectivas en tu negocio.");
        } else if (numPartners === 5) {
            setPartnerMessage("¡Fantástico! Con 5 socios, tendrás un gran equipo para distribuir responsabilidades y fomentar la colaboración, lo cual es clave para el éxito.");
        } else {
            setPartnerMessage(`¡Increíble! Con ${numPartners} socios, tu empresa tendrá un gran potencial para innovar y crecer. Recuerda que la buena comunicación y el trabajo en equipo son clave para el éxito.`);
        }
    }, [numPartners]);



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

        if (field === "documentType") {
            // Al cambiar el tipo de documento, validar el número de documento
            const documentType = value ?? 'dni'; // Usar el operador de coalescencia nula para un valor predeterminado
            const error = validateDocumentNumber(documentType, updatedPartners[index].documentNumber || ''); // Asegurarse de que el número de documento también sea un string

            setDocumentErrors((prevErrors) => {
                const newErrors = [...prevErrors];
                newErrors[index] = error; // Update error for the specific partner
                return newErrors;
            });
        }

        if (field === "nationality" && value !== "Otra") {
            updatedPartners[index].otherNationality = "";
        }

        setPartners(updatedPartners);
        updateFormData({ partners: updatedPartners });
        validateForm(updatedPartners);
    };


    const handleDocumentNumberChange = (index: number, value: string) => {
        const updatedPartners = [...partners];
        updatedPartners[index].documentNumber = value;

        // Validate document number if documentType is defined
        const documentType = updatedPartners[index].documentType || 'dni'; // Valor predeterminado
        const error = validateDocumentNumber(documentType, value);

        setDocumentErrors((prevErrors) => {
            const newErrors = [...prevErrors];
            newErrors[index] = error; // Update error for the specific partner
            return newErrors;
        });

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
        setDocumentErrors([...documentErrors, '']); // Add an empty error for the new partner
    };

    const handleNextStep = () => {
        if (partners.length >= 2) {
            nextStep();
        }
    };

    return (
        <div className="space-y-4 max-w-5xl mx-auto">
            {!showForm && (
                <div className="space-y-4 flex flex-col items-center">
                    <Label htmlFor="numPartners" className="text-2xl font-bold">
                        ¿Cuántos socios tiene tu empresa?
                    </Label>
                    <Input
                        id="numPartners"
                        type="number" // Usamos 'number' para mejor control del teclado numérico
                        value={numPartners || ""}
                        onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, ""); // Solo permite números
                            const newNumPartners = parseInt(value) || 0; // Cambiado para usar el valor filtrado
                            setNumPartners(newNumPartners);

                            // Set the partner message based on the new number of partners
                            if (newNumPartners < 2) {
                                setPartnerMessage("¡Necesitas al menos 2 socios para constituir una empresa!");
                            } else if (newNumPartners <= 5) {
                                setPartnerMessage(`¡Genial! Constituir una empresa con ${newNumPartners} socios es una excelente idea, ya que pueden aportar diferentes habilidades y recursos.`);
                            } else {
                                setPartnerMessage(`¡Impresionante! Con ${newNumPartners} socios, tu empresa tendrá un gran potencial para innovar y crecer. Recuerda que la buena comunicación y el trabajo en equipo son clave para el éxito.`);
                            }

                            // Resetear el mensaje si no hay socios
                            if (newNumPartners === 0) {
                                setPartnerMessage('');
                            }
                        }}
                        inputMode="numeric" // Esto mostrará el teclado numérico en dispositivos móviles
                        pattern="[0-9]*" // Asegura que solo se acepten números en navegadores compatibles
                        placeholder="Ingresa el número"
                        className="text-2xl max-w-xs text-center mx-auto border-2 border-gray-300 rounded-lg p-4 h-16 focus:outline-none w-full" // Ajustado el ancho y la altura
                    />

                    {partnerMessage && (  // Mostrar el mensaje si existe
                        <div className="mt-4 bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 rounded-lg">
                            <p className="text-sm">{partnerMessage}</p>
                        </div>
                    )}


                    {(!partnerMessage && numPartners < 2) && (
                        <div className="flex items-center bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mt-4 w-full max-w-md rounded-lg">
                            <svg
                                className="w-5 h-5 text-blue-500 mr-2"
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
                            <p className="text-sm">Debe haber al menos 2 socios.</p>
                        </div>
                    )}

                    <Button
                        onClick={() => setShowForm(true)}
                        disabled={numPartners < 2}
                        className="mt-4 mx-auto text-white rounded-lg px-6 py-2 w-full"
                    >
                        Continuar
                    </Button>
                </div>
            )}

            {showForm && (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {partners.map((partner, index) => (
                            <div key={index} className="rounded-lg bg-white duration-200">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-md font-semibold text-black-700">
                                        Socio {index + 1}: {partner.name}
                                    </h3>
                                    <div className="flex items-center space-x-2">

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
                                                <DialogTitle>¿Estás seguro que deseas eliminar al socio {partner.name}?</DialogTitle>
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
                                </div>
                                <button
                                    onClick={() => toggleExpand(index)}
                                    className="text-blue-500 hover:text-blue-700 transition"
                                >
                                    {isExpanded[index] ? "Ocultar datos" : "Mostrar datos"}
                                </button>

                                <div
                                    className={`transition-all duration-500 overflow-hidden ${isExpanded[index] ? "max-h-full opacity-100" : "max-h-0 opacity-0"
                                        }`}
                                >
                                    <div className="grid grid-cols-1 gap-6 pt-2">
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
                                                        maxLength={partner.documentType === "passport" ? 20 : 9}
                                                        value={partner.documentNumber || ""}
                                                        onChange={(e) => handleDocumentNumberChange(index, e.target.value)}
                                                        className="border-2 border-gray-300 rounded-lg p-2 focus:border-blue-600 focus:outline-none"
                                                    />

                                                </div>
                                            </div>
                                            {/* Validación del número de documento */}
                                            {documentErrors[index] && (
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
                                                    <p className="text-sm">{documentErrors[index]}</p>
                                                </div>
                                            )}
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
                                                            <p className="text-sm">Ingrese un número de teléfono válido.</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Correo Electrónico */}
                                        <div className="relative">
                                            <Label htmlFor={`email-${index}`} className="absolute -top-3 left-3 bg-white px-1 text-sm text-black-600 z-10">
                                                Correo Electrónico
                                            </Label>
                                            <Input
                                                id={`email-${index}`}
                                                value={partner.email || ""}
                                                onChange={(e) => handlePartnerChange(index, "email", e.target.value)}
                                                placeholder="Ingrese el correo electrónico"
                                                className="border-2 border-gray-300 rounded-lg p-2 focus:outline-none w-full"
                                            />
                                            {!isValidEmail(partner.email ?? "") && partner.email && (
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
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-center">
                        <Button variant="secondary" onClick={handleAddPartner} className="w-full md:w-auto">
                            Agregar otro socio <PlusIcon />
                        </Button>
                    </div>

                    <div className="flex justify-center">
                        <Button onClick={handleNextStep} className="text-white rounded-lg px-6 py-2 w-full md:w-auto" disabled={isNextDisabled}>
                            Continuar
                        </Button>
                    </div>
                </>
            )}
        </div>
    );
}
