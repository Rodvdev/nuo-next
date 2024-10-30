"use client";

import { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { XIcon } from 'lucide-react';
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

// Email validation function
const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
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

    useEffect(() => {
        if (numPartners > 0) {
            const updatedPartners = Array.from({ length: numPartners }, (_, index) => {
                const partner: Partner = partners[index] || {
                    name: '',
                    lastName: '',
                    documentType: formData.residency === Residency.Extranjero ? DocumentType.ForeignId : DocumentType.DNI,
                    documentNumber: '',
                    nationality: formData.residency === Residency.Extranjero ? 'Extranjero' : 'Peruano',
                    otherNationality: '',
                    email: '',
                    phone: '',
                    countryCode: '+51',
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
        const allFieldsFilled = partnersList.length >= 2 && partnersList.every(partner =>
            partner.name &&
            partner.lastName &&
            partner.documentType &&
            partner.documentNumber &&
            (partner.nationality !== 'Otra' || partner.otherNationality) &&
            partner.email &&
            isValidEmail(partner.email) &&
            partner.phone &&
            partner.countryCode
        );
        setIsNextDisabled(!allFieldsFilled);
    };

    const handlePartnerChange = (index: number, field: keyof Partner, value: string) => {
        const updatedPartners = [...partners];
        updatedPartners[index] = { ...updatedPartners[index], [field]: value };

        if (field === 'nationality' && value !== 'Otra') {
            updatedPartners[index].otherNationality = '';
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
                name: '',
                lastName: '',
                documentType: formData.residency === Residency.Extranjero ? DocumentType.ForeignId : DocumentType.DNI,  // Assign a valid default value
                documentNumber: '',
                nationality: 'Peruano',
                otherNationality: '',
                email: '',
                phone: '',
                countryCode: '+51'
            };
            setPartners(updatedPartners);
            updateFormData({ partners: updatedPartners });
        }
    };

    const handleAddPartner = () => {
        const newPartner: Partner = {
            name: '',
            lastName: '',
            documentType: formData.residency === Residency.Extranjero ? DocumentType.ForeignId : DocumentType.DNI,
            documentNumber: '',
            nationality: formData.residency === Residency.Extranjero ? 'Extranjero' : 'Peruano',
            otherNationality: '',
            email: '',
            phone: '',
            countryCode: '+51'
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
                    <Label htmlFor="numPartners" className="text-2xl font-bold">¿Cuántos socios tiene tu empresa?</Label>
                    <Input
                        id="numPartners"
                        type="number"
                        value={numPartners || ''}
                        onChange={(e) => setNumPartners(parseInt(e.target.value))}
                        placeholder="Ingresa el número de socios"
                        className="max-w-md text-center mx-auto border-2 border-gray-300 rounded-lg p-2 focus:outline-none w-full"
                    />
                    {numPartners < 2 && (
                        <p className="text-red-500">Debe haber al menos 2 socios.</p>
                    )}
                    <Button onClick={() => setShowForm(true)} disabled={numPartners < 2} className="mt-4 mx-auto text-white rounded-lg px-6 py-2 w-full">
                        Continuar
                    </Button>
                </div>
            )}

            {showForm && (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {partners.map((partner, index) => (
                            <div key={index} className="space-y-4 rounded-lg bg-white hover:shadow-xl duration-200">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-lg font-semibold text-black-700 border-b pb-2">Socio {index + 1}</h3>
                                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                        <DialogTrigger asChild>
                                            <XIcon className="cursor-pointer text-red-500" onClick={() => {
                                                setPartnerToDelete(index);
                                                setIsDialogOpen(true);
                                            }} />
                                        </DialogTrigger>
                                        <DialogContent>
                                            <h2>¿Estás seguro que deseas eliminar al socio {partner.name}?</h2>
                                            <DialogFooter>
                                                <Button variant="ghost" onClick={() => setIsDialogOpen(false)}>NO</Button>
                                                <Button variant="destructive" onClick={() => {
                                                    handleRemovePartner(partnerToDelete as number);
                                                    setIsDialogOpen(false);
                                                }}>SÍ</Button>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                </div>

                                {/* Partner Fields */}
                                <div className="grid grid-cols-1 gap-6">
                                    <div className="relative">
                                        <Label htmlFor={`name-${index}`} className="absolute -top-3 left-3 bg-white px-1 text-sm text-black-600 z-10">Nombre</Label>
                                        <Input
                                            id={`name-${index}`}
                                            value={partner.name}
                                            onChange={(e) => handlePartnerChange(index, 'name', e.target.value)}
                                            placeholder="Ingrese el nombre del socio"
                                            className="border-2 border-gray-300 rounded-lg p-2 focus:outline-none w-full"
                                        />
                                    </div>

                                    <div className="relative">
                                        <Label htmlFor={`lastName-${index}`} className="absolute -top-3 left-3 bg-white px-1 text-sm text-black-600 z-10">Apellidos</Label>
                                        <Input
                                            id={`lastName-${index}`}
                                            value={partner.lastName}
                                            onChange={(e) => handlePartnerChange(index, 'lastName', e.target.value)}
                                            placeholder="Ingrese los apellidos del socio"
                                            className="border-2 border-gray-300 rounded-lg p-2 focus:outline-none w-full"
                                        />
                                    </div>

                                    {/* Additional fields (e.g., nationality, document type, etc.) */}
                                    {/* Add more fields as needed... */}
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