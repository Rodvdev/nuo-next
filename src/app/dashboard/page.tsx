import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { User, Building2, Users, Check, Mail, Phone, FileText, Globe, DollarSign, Loader, CheckCircle, Menu, X } from 'lucide-react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useRouter } from 'next/navigation'; // Use Next.js router
import { Sidebar } from './sidebar';
import { FormData, Partner, NonMonetaryContribution } from "@/types/types";



// Draggable Company Name Item
const ItemType = 'razonSocial';

interface SocialReasonItemProps {
    socialReason?: string;
    index: number;
    moveItem: (fromIndex: number, toIndex: number) => void;
    companyType?: string;
    isVerifying: boolean;
}

function SocialReasonItem({ socialReason, index, moveItem, companyType, isVerifying }: SocialReasonItemProps) {
    const [{ isDragging }, drag] = useDrag({
        type: ItemType,
        item: { index },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    const [, drop] = useDrop({
        accept: ItemType,
        hover: (draggedItem: { index: number }) => {
            if (draggedItem.index !== index) {
                moveItem(draggedItem.index, index);
                draggedItem.index = index;
            }
        },
    });

    return (
        <div
            ref={(node) => {
                if (node) {
                    drag(drop(node)); // Asegúrate de que esto no retorne ningún valor
                }
            }}
            className={`flex flex-col items-center justify-center bg-gray-50 border border-gray-300 rounded-md shadow-sm w-full min-w-[150px] md:min-w-[200px] h-[50px] transition-transform ${isDragging ? 'opacity-50' : ''}`}
        >
            <div className="flex items-center justify-center w-full">
                <p className="text-sm text-center">{`Company Name ${index + 1}`}</p>
                {/* Verification Indicator */}
                {isVerifying ? (
                    <Loader className="w-4 h-4 ml-2 text-yellow-500 animate-spin" /> // Spinner for ongoing verification
                ) : (
                    <CheckCircle className="w-4 h-4 ml-2 text-green-500" /> // Check icon for verified
                )}
            </div>
            <p className="text-lg font-semibold text-center">{socialReason ? `${socialReason} ${companyType}` : 'N/A'}</p>
        </div>
    );
}

const steps = [
    { id: 1, title: "Applicant Information", icon: User },
    { id: 2, title: "About the Company", icon: Building2 },
    { id: 3, title: "Partner Information", icon: Users },
];


export default function Dashboard() {
    const [formData, setFormData] = useState<FormData | null>(null);
    const [socialReasons, setSocialReasons] = useState<string[]>([]);
    const [activeStep, setActiveStep] = useState<number>(1);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const router = useRouter(); // Use Next.js router

    useEffect(() => {
        // Retrieve form data from localStorage when the component mounts
        const savedFormData = localStorage.getItem('formData');
        if (savedFormData) {
            const parsedData: FormData = JSON.parse(savedFormData);
            setFormData(parsedData);
            setSocialReasons([
                parsedData?.razonSocial1 || '',
                parsedData?.razonSocial2 || '',
                parsedData?.razonSocial3 || '',
                parsedData?.razonSocial4 || '',
                parsedData?.razonSocial5 || '',
            ]);
        }
    }, []);

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
            router.push('/dashboard'); // Navigate to /dashboard on the final step
        }
    };

    const renderStepPreview = () => {
        if (!formData) {
            return <p>Loading...</p>;
        }

        switch (activeStep) {
            case 1:
                return (
                    <>
                        <div className="p-4 shadow-sm">
                            <div className="mb-3">
                                <h2 className="text-2xl font-bold">Applicant Information</h2>
                                <p className="text-gray-500">Review your personal details</p>
                            </div>
                            <div>
                                <p><strong>Name:</strong> {`${formData.applicantFirstName || "N/A"} ${formData.applicantLastName || "N/A"}`}</p>
                                <p><strong>Email:</strong> {formData.applicantEmail || "N/A"}</p>
                                <p><strong>Document Type:</strong> {formData.documentType || "N/A"}</p>
                                <p><strong>Document Number:</strong> {formData.documentNumber || "N/A"}</p>
                                <p><strong>Phone:</strong> {`${formData.applicantPhoneCode || "+51"} ${formData.applicantPhone || "N/A"}`}</p>
                            </div>
                        </div>
                        <div className="p-4 shadow-sm mt-4">
                            <div className="mb-3">
                                <h2 className="text-2xl font-bold">Residency Selection</h2>
                                <p className="text-gray-500">Your selected residency status</p>
                            </div>
                            <div>
                                <p><strong>Residency:</strong> {formData?.residency || "N/A"}</p>
                            </div>
                        </div>
                    </>
                );
            case 2:
                return (
                    <div className="p-6 shadow-sm">
                        <div className="mb-4">
                            <h2 className="text-xl font-bold">About the Company: Corporate Purpose, CEO Information & Company Name</h2>
                            <p className="text-sm text-gray-500">Review and organize your company details</p>
                        </div>
                        {/* CEO Information */}
                        <div className="mb-4">
                            <h3 className="text-lg font-semibold">CEO</h3>
                            <p>{`${formData?.ceo?.name || "N/A"} ${formData?.ceo?.lastName || "N/A"} ${formData?.ceo?.partner ? "(Partner)" : ""}`}</p>
                        </div>
                        {/* Corporate Purpose */}
                        <div className="mb-4">
                            <h3 className="text-lg font-semibold">Corporate Purpose</h3>
                            <p className="text-base text-gray-700">{formData?.corporatePurpose || "N/A"}</p>
                        </div>
                        {/* Company Names */}
                        <div className="mb-4">
                            <h3 className="text-lg font-semibold">Company Names</h3>
                            <p className="text-sm text-gray-500">Company Names are being verified to ensure uniqueness. Drag to reorder the social reasons based on your preference.</p>
                            <DndProvider backend={HTML5Backend}>
                                <div className="flex flex-col gap-2 mt-3">
                                    {socialReasons.map((socialReason, index) => (
                                        <SocialReasonItem
                                            key={index}
                                            index={index}
                                            socialReason={socialReason}
                                            moveItem={moveItem}
                                            companyType={formData?.companyType}
                                            isVerifying={true}
                                        />
                                    ))}
                                </div>
                            </DndProvider>
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="p-6 shadow-sm mb-4">
                        <div className="mb-3">
                            <h2 className="text-2xl font-bold">Partner Information & Contributions</h2>
                            <p className="text-gray-500">Details of company partners and their contributions</p>
                        </div>
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

                                        <>
                                            {partner.monetaryContribution && (
                                                <div className="flex items-center space-x-3">
                                                    <DollarSign className="text-gray-600" />
                                                    <p><strong>Capital Contribution:</strong> {partner.currency} {partner.monetaryContribution || "N/A"}</p>
                                                </div>
                                            )}
                                            {(partner.nonMonetaryContributions?.length ?? 0) > 0 && (
                                                <div>
                                                    <h4 className="font-semibold text-gray-700">Non-Monetary Contributions:</h4>
                                                    {partner.nonMonetaryContributions && partner.nonMonetaryContributions.length > 0 ? (
                                                        partner.nonMonetaryContributions.map((contribution, idx) => (
                                                            <div key={idx} className="pl-2 mb-2 border-l-2 border-gray-300">
                                                                <p><strong>Description:</strong> {contribution.nonMonetaryContribution}</p>
                                                                <p><strong>Value:</strong> {contribution.nonMonetaryCurrency} {contribution.nonMonetaryValue}</p>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <p>No non-monetary contributions.</p>  // Esto es opcional, puedes mostrar algo en caso de que no haya contribuciones
                                                    )}

                                                </div>
                                            )}
                                        </>
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
        <div className="flex flex-col h-screen">
            <div className="md:hidden flex justify-between items-center p-4 bg-gray-100">
                <h1 className="text-xl font-semibold">Dashboard</h1>
                <Button
                    variant="ghost"
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    aria-label="Toggle Menu"
                >
                    {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </Button>
            </div>

            <div className="flex flex-1 overflow-hidden">
                <aside
                    className={`${isSidebarOpen ? "block" : "hidden"
                        } md:block w-64 bg-white border-r fixed inset-y-0 z-20 md:static md:w-64 md:relative`}
                >
                    {/* Llamada al Sidebar */}
                    <Sidebar
                        className="h-full"
                        activeStep={activeStep}
                        setActiveStep={setActiveStep}
                        setIsSidebarOpen={setIsSidebarOpen}
                    />
                </aside>

                <main className="flex-1 overflow-y-auto">
                    <ScrollArea className="h-full">
                        {renderStepPreview()}
                    </ScrollArea>
                </main>
            </div>
        </div>
    );
}
