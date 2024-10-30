import { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles } from 'lucide-react';
import { FormData } from "@/types/types";

// Define the stopwords
const stopwords = [
    "somos", "una", "dediada", "la", "el", "a", "en", "de", "que", "para", "y", "del",
    "un", "con", "por", "al", "como", "más", "sus", "su", "las", "los", "sobre",
    "etc", "se", "ha", "han", "es", "o", "pero", "entre", "esta", "este", "estas", "estos", "dedicada", "compañía", "compa"
];

// Interface for the component props
interface CorporatePurposeProps {
    formData: FormData;
    updateFormData: (data: Partial<FormData>) => void;
    setIsNextDisabled: (disabled: boolean) => void;
}

// Function to simulate AI suggestions for company names
const simulateAISuggestions = (description: string): string[] => {
    const keywords = description
        .toLowerCase()
        .split(/\W+/)
        .filter(word => word.length > 2 && !stopwords.includes(word));

    const suggestions = [
        `${keywords[0] || 'Tech'} ${keywords[1] || 'Corp'}`,
        `${keywords.slice(0, 2).join('')} Solutions`,
        `${keywords[0] || 'Global'} Innovations`,
        `${keywords[1] || 'Advanced'} Global`,
        `${keywords[0] || 'Tech'} Group`,
    ];

    return suggestions;
};

export function CorporatePurpose({ formData, updateFormData, setIsNextDisabled }: CorporatePurposeProps) {
    const [charCount, setCharCount] = useState(0);  // Character count
    const [isPurposeValid, setIsPurposeValid] = useState(false); // Controls whether the purpose is valid
    const [error, setError] = useState('');
    const maxChars = 1000;
    const minChars = 100;

    // Effect to initialize character count and validate the form on mount
    useEffect(() => {
        if (formData.corporatePurpose) {
            const charLength = formData.corporatePurpose.length;
            setCharCount(charLength);
            validatePurpose(charLength);
        }
    }, [formData.corporatePurpose]);

    useEffect(() => {
        localStorage.setItem('corporatePurposeFormData', JSON.stringify(formData));
        validateForm(); // Revalidate the form every time charCount or formData changes
    }, [charCount, formData]);

    // Validate the corporate purpose field based on the character count
    const validatePurpose = (charCount: number) => {
        if (charCount >= minChars && charCount <= maxChars) {
            setIsPurposeValid(true);
            setError('');
        } else {
            setIsPurposeValid(false);
            setError(charCount < minChars
                ? `El propósito debe tener al menos ${minChars} caracteres.`
                : `El propósito no puede exceder los ${maxChars} caracteres.`);
        }
    };

    const checkDuplicateRazonSocial = (): string[] => {
        const razonSociales = [
            formData.razonSocial1,
            formData.razonSocial2,
            formData.razonSocial3,
            formData.razonSocial4,
            formData.razonSocial5
        ].filter((item): item is string => !!item); // Filter out undefined values and cast to string[]

        const duplicates = razonSociales.filter((item, index) => razonSociales.indexOf(item) !== index);
        return duplicates;
    };


    // Handle input changes
    const handleInputChange = (field: keyof FormData, value: string) => {
        if (field === 'corporatePurpose') {
            setCharCount(value.length);
            validatePurpose(value.length);
        }
        updateFormData({ [field]: value });
    };

    // Generate name suggestions using simulated AI
    const generateSuggestions = (field: keyof FormData) => {
        const generatedSuggestions = simulateAISuggestions(formData.corporatePurpose || '');
        const randomSuggestion = generatedSuggestions[Math.floor(Math.random() * generatedSuggestions.length)];
        updateFormData({ [field]: randomSuggestion });
    };

    // Validate the entire form based on the data
    const validateForm = () => {
        const duplicates = checkDuplicateRazonSocial();
        const areRazonSocialValid = duplicates.length === 0 &&
            formData.razonSocial1 && formData.razonSocial2 && formData.razonSocial3 &&
            formData.razonSocial4 && formData.razonSocial5;

        setIsNextDisabled(!(isPurposeValid && areRazonSocialValid));
    };

    const duplicates = checkDuplicateRazonSocial();

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-2xl font-bold mb-3">Cuéntanos más de tu empresa</h2>

            {/* Corporate purpose section */}
            <div className="relative">
                <Label
                    htmlFor="corporatePurpose"
                    className="absolute top-0.5 left-2 bg-white px-1 text-sm text-gray-600 z-10"
                >
                    Cuéntanos qué hace tu compañía
                </Label>
                <Textarea
                    id="corporatePurpose"
                    placeholder="Describe brevemente las actividades de tu compañía..."
                    value={formData.corporatePurpose || ''}
                    onChange={(e) => handleInputChange('corporatePurpose', e.target.value)}
                    className="h-40 relative pt-5"
                    maxLength={maxChars}
                />
                {/* Character count display */}
                <p className={`absolute top-1 right-3 text-xs text-gray-500`}>
                    {charCount}/{maxChars}
                </p>
                {/* Error message display */}
                {error && <p className="absolute bottom-1 right-3 text-xs text-red-500">{error}</p>}
            </div>

            {/* Company name section */}
            <div className="relative">
                <Label
                    htmlFor="companyName"
                    className="absolute -top-3 left-3 bg-white px-1 text-sm text-gray-600"
                >
                    Nombre comercial de tu empresa
                </Label>
                <Input
                    id="companyName"
                    placeholder="Ingresa el nombre comercial de tu empresa"
                    value={formData.companyName || ''}
                    onChange={(e) => handleInputChange('companyName', e.target.value)}
                    className="mt-4 pr-12"
                />
            </div>

            {/* Razon Social (5 options) */}
            <div className="space-y-4">
                <Label htmlFor="razonSocial">Ingresa 5 opciones para la Razón Social de tu empresa</Label>
                {[1, 2, 3, 4, 5].map((num) => {
                    // Ensure the value is treated as a string by using '|| ""' to handle undefined
                    const razonSocialValue = formData[`razonSocial${num}` as keyof FormData] as string || '';

                    const duplicate = duplicates.includes(razonSocialValue);

                    return (
                        <div className="relative" key={num}>
                            <Input
                                id={`razonSocial-${num}`}
                                value={razonSocialValue} // Using the explicitly casted value
                                placeholder={`Razón social opción ${num}`}
                                onChange={(e) => handleInputChange(`razonSocial${num}` as keyof FormData, e.target.value)}
                                className={`mt-2 pr-12 ${duplicate ? 'border-red-500' : ''}`} // Border color if duplicate
                            />
                            {/* Icon for AI suggestions */}
                            <div
                                className={`absolute inset-y-0 ${error && "inset-y-2"} right-3 flex items-center cursor-pointer text-blue-600`}
                                onClick={() => generateSuggestions(`razonSocial${num}` as keyof FormData)}
                                title="Sugerir nombres con IA"
                            >
                                <Sparkles size={24} />
                            </div>
                            {duplicate && <p className="text-xs text-red-500">Este nombre ya fue ingresado.</p>}
                        </div>
                    );
                })}
            </div>

        </div>
    );
}
