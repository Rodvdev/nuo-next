'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useRouter } from 'next/navigation'; // Replacing useNavigate with useRouter from next/navigation
import { User, Building2, Users, DollarSign, Mail, Phone, FileText, Globe } from 'lucide-react';
import { FormData } from "@/types/types";

// Acceder a las variables de entorno
const STEP_KEY = process.env.NEXT_PUBLIC_STEP_KEY || 'currentStep';
const EXPIRATION_KEY = process.env.NEXT_PUBLIC_EXPIRATION_KEY || 'formExpiration';
const EXPIRATION_TIME = Number(process.env.NEXT_PUBLIC_EXPIRATION_TIME) || 86400000;  // 24 horas en ms



// Component for each draggable company name item
function SocialReasonItem({
    socialReason,
    index,
    moveItem,
    companyType,
}: {
    socialReason?: string;
    index: number;
    moveItem: (fromIndex: number, toIndex: number) => void;
    companyType?: string;
}) {
    const [{ isDragging }, drag] = useDrag({
        type: 'razonSocial',
        item: { index },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    const [, drop] = useDrop({
        accept: 'razonSocial',
        hover: (draggedItem: { index: number }) => {
            if (draggedItem.index !== index) {
                moveItem(draggedItem.index, index);
                draggedItem.index = index;
            }
        },
    });

    return (
        <div
            ref={(node: HTMLDivElement | null) => {
                if (node) {
                    drag(drop(node));
                }
            }}
            className={`flex flex-col items-center justify-center bg-gray-50 border border-gray-300 rounded-md shadow-sm w-full min-w-[150px] md:min-w-[200px] h-[50px] transition-transform ${isDragging ? 'opacity-50' : ''
                }`}
        >
            <p className="text-sm">{`Company Name ${index + 1}`}</p>
            <p className="text-lg font-semibold">{socialReason ? `${socialReason} ${companyType}` : 'N/A'}</p>
        </div>
    );
}

const steps = [
    { id: 1, title: "Applicant Information", icon: User },
    { id: 2, title: "About the Company", icon: Building2 },
    { id: 3, title: "Partner Information", icon: Users },
];

interface FormReviewProps {
    formData: FormData;
    goToStep: (step: number) => void;
}

export default function FormReview({ formData = {}, goToStep }: FormReviewProps) {
    const [activeStep, setActiveStep] = useState(1);
    const [socialReasons, setSocialReasons] = useState<string[]>([
        formData?.razonSocial1 || '',
        formData?.razonSocial2 || '',
        formData?.razonSocial3 || '',
        formData?.razonSocial4 || '',
        formData?.razonSocial5 || '',
    ]);

    const router = useRouter(); // Using useRouter from next/navigation

    // Function to move items within the list
    const moveItem = (fromIndex: number, toIndex: number) => {
        const updatedList = [...socialReasons];
        const [movedItem] = updatedList.splice(fromIndex, 1);
        updatedList.splice(toIndex, 0, movedItem);
        setSocialReasons(updatedList);
    };

    const handleNextStep = () => {
        if (activeStep < steps.length) {
            setActiveStep((prevStep) => prevStep + 1);
        } else {
            // Clear form data from localStorage before navigating to confirmation
            localStorage.removeItem('formData'); // Borra los datos del formulario
            localStorage.removeItem(STEP_KEY);   // Borra el paso actual
            localStorage.removeItem(EXPIRATION_KEY); // Borra la expiración del formulario
            router.push('/confirmation'); // Navega a la página de confirmación
        }
    };
    

    const handleGoBack = () => {
        if (activeStep === 1) goToStep(1);
        else if (activeStep === 2) goToStep(3);
        else goToStep(5);
    };

    const renderStepPreview = () => {
        switch (activeStep) {
            case 1:
                return (
                    <div className="p-4 shadow-sm">
                        <h2 className="text-2xl font-bold">Review your information</h2>
                        <p><strong>Residency:</strong> {formData?.residency || "N/A"}</p>
                        <p><strong>Name:</strong> {`${formData.applicantFirstName || "N/A"} ${formData.applicantLastName || "N/A"}`}</p>
                        <p><strong>Email:</strong> {formData.applicantEmail || "N/A"}</p>
                        <p><strong>Document Type:</strong> {formData.documentType || "N/A"}</p>
                        <p><strong>Document Number:</strong> {formData.documentNumber || "N/A"}</p>
                        <p><strong>Phone:</strong> {`${formData.applicantPhoneCode || "+51"} ${formData.applicantPhone || "N/A"}`}</p>
                    </div>
                );
            case 2:
                return (
                    <div className="shadow-sm">
                        <h3 className="text-lg font-semibold">CEO</h3>
                        <p>{`${formData?.ceo?.name || "N/A"} ${formData?.ceo?.lastName || "N/A"} ${formData?.ceo?.partner ? "(Partner)" : ""}`}</p>

                        <h3 className="text-lg font-semibold">Corporate Purpose</h3>
                        <p>{formData?.corporatePurpose || "N/A"}</p>

                        <h3 className="text-lg font-semibold">Company Names</h3>
                        <p className="text-sm text-gray-500">Drag to reorder the company names based on your preference</p>

                        <DndProvider backend={HTML5Backend}>
                            <div className="flex flex-col gap-2 mt-3">
                                {socialReasons.map((socialReason, index) => (
                                    <SocialReasonItem
                                        key={index}
                                        index={index}
                                        socialReason={socialReason}
                                        moveItem={moveItem}
                                        companyType={formData?.companyType}
                                    />
                                ))}
                            </div>
                        </DndProvider>
                    </div>
                );
            case 3:
                return (
                    <div className="shadow-sm mb-4">
                        <h2 className="text-2xl font-bold">Partner Information & Contributions</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {formData?.partners?.map((partner, index) => (
                                <div key={index} className="p-4 border rounded-lg bg-gray-50 shadow-sm space-y-4">
                                    <div className="flex items-center space-x-3">
                                        <User className="text-gray-600" />
                                        <p className="text-lg font-semibold">{partner?.name || "N/A"} {partner?.lastName || "N/A"}</p>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <FileText className="text-gray-600" />
                                        <p>{partner?.documentType || "N/A"} - {partner?.documentNumber || "N/A"}</p>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <Globe className="text-gray-600" />
                                        <p>{partner?.nationality || "N/A"} {partner?.nationality === "Otra" && `(${partner?.otherNationality || "N/A"})`}</p>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <Mail className="text-gray-600" />
                                        <p>{partner?.email || "N/A"}</p>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <Phone className="text-gray-600" />
                                        <p>{partner?.countryCode || "+51"} {partner?.phone || "N/A"}</p>
                                    </div>
                                    <div className="mt-4 border-t pt-4">

                                        {partner.monetaryContribution && (
                                            <div className="flex items-center space-x-3">
                                                <DollarSign className="text-gray-600" />
                                                <p><strong>Capital Contribution:</strong> {partner.currency} {partner.monetaryContribution || "N/A"}</p>
                                            </div>
                                        )}
                                        {(partner.nonMonetaryContributions?.length ?? 0) > 0 && (
                                            <div>
                                                <h4 className="font-semibold text-gray-700">Non-Monetary Contributions:</h4>
                                                {partner.nonMonetaryContributions?.map((contribution, idx) => (
                                                    <div key={idx} className="pl-2 mb-2 border-l-2 border-gray-300">
                                                        <p><strong>Description:</strong> {contribution.nonMonetaryContribution}</p>
                                                        <p><strong>Value:</strong> {contribution.nonMonetaryCurrency} {contribution.nonMonetaryValue}</p>
                                                    </div>
                                                ))}
                                            </div>

                                        )}
                                    </div>
                                </div>
                            )) || <p>No partners available</p>}
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="flex flex-col">
            <main className="flex-1 overflow-y-auto">
                <ScrollArea className="h-full">
                    {renderStepPreview()}
                </ScrollArea>
            </main>
            <div className="px-4 py-4 flex justify-between">
                <Button variant="outline" onClick={handleGoBack} className="w-1/2 mr-2">
                    Edit
                </Button>
                <Button onClick={handleNextStep} className="w-1/2">
                    {activeStep === steps.length ? "Send Application" : "Confirm"}
                </Button>
            </div>
        </div>
    );
}
