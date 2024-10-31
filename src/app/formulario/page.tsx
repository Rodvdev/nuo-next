"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ApplicantInformation } from "../_steps/applicant-form";
import { ResidencySelection } from "../_steps/residency-selection";
import { CompanyTypeSelection } from "../_steps/company-type-selection";
import { CorporatePurpose } from "../_steps/corporate-purpose";
import { CEOSelection } from "../_steps/ceo-selection";
import { PartnerInformation } from "../_steps/partners-form";
import { PartnerContributions } from "../_steps/partners-contributions";
import FormReview from "../_steps/review";
import { ProgressBar } from "@/components/progress-bar";
import { SupportChat } from "@/components/support-chat";
import { FormData } from "@/types/types";
import { ArrowLeft } from "lucide-react";


const STORAGE_KEY = process.env.STORAGE_KEY || 'incorporationFormData';
// Acceder a las variables de entorno
const STEP_KEY = process.env.NEXT_PUBLIC_STEP_KEY || 'currentStep';
const EXPIRATION_KEY = process.env.NEXT_PUBLIC_EXPIRATION_KEY || 'formExpiration';
const EXPIRATION_TIME = Number(process.env.NEXT_PUBLIC_EXPIRATION_TIME) || 86400000;  // 24 horas en ms


export default function IncorporationForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({});
  const [isNextDisabled, setIsNextDisabled] = useState(true);
  const [showPartnersForm, setShowPartnersForm] = useState(false);

  const totalSteps = 8;

  // Load saved form data and step from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    const savedStep = localStorage.getItem(STEP_KEY);
    const expiration = localStorage.getItem(EXPIRATION_KEY);

    if (expiration) {
      const expirationDate = new Date(parseInt(expiration));
      if (expirationDate > new Date()) {
        if (savedData) {
          setFormData(JSON.parse(savedData));
        }
        if (savedStep) {
          setCurrentStep(Number(savedStep));
        }
      } else {
        // Data is expired, clear it
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(STEP_KEY);
        localStorage.removeItem(EXPIRATION_KEY);
      }
    }
  }, []);

  // Save form data and current step to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
    const expirationDate = new Date().getTime() + EXPIRATION_TIME;
    localStorage.setItem(EXPIRATION_KEY, expirationDate.toString());
  }, [formData]);

  useEffect(() => {
    localStorage.setItem(STEP_KEY, currentStep.toString());
    const expirationDate = new Date().getTime() + EXPIRATION_TIME;
    localStorage.setItem(EXPIRATION_KEY, expirationDate.toString());
  }, [currentStep]);

  // Update formData by merging new step data
  const updateFormData = (stepData: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...stepData }));
  };

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
    setIsNextDisabled(true);
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  // Add an onStepClick handler for the ProgressBar
  const handleStepClick = (step: number) => {
    if (step <= currentStep) {
      setCurrentStep(step);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <ApplicantInformation
            formData={formData}
            updateFormData={updateFormData}
            setIsNextDisabled={setIsNextDisabled}
          />
        );
      case 2:
        return (
          <ResidencySelection
            formData={formData}
            updateFormData={updateFormData}
            setIsNextDisabled={setIsNextDisabled}
          />
        );
      case 3:
        return (
          <CompanyTypeSelection
            formData={formData}
            updateFormData={updateFormData}
            setIsNextDisabled={setIsNextDisabled}
          />
        );
      case 4:
        return (
          <CorporatePurpose
            formData={formData}
            updateFormData={updateFormData}
            setIsNextDisabled={setIsNextDisabled}
          />
        );
      case 5:
        return (
          <PartnerInformation
            formData={formData}
            updateFormData={updateFormData}
            isNextDisabled={isNextDisabled}
            setIsNextDisabled={setIsNextDisabled}
            nextStep={handleNext}
            showForm={showPartnersForm}
            setShowForm={setShowPartnersForm}
          />
        );
      case 6:
        return (
          <CEOSelection
            formData={formData}
            updateFormData={updateFormData}
            setIsNextDisabled={setIsNextDisabled}
          />
        );
      case 7:
        return (
          <PartnerContributions
            formData={formData}
            updateFormData={updateFormData}
            setIsNextDisabled={setIsNextDisabled}
          />

        );
      case 8:
        return (
          <FormReview
            formData={formData}
            goToStep={setCurrentStep}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto w-full flex flex-col justify-between p-8">
      <div className="flex-grow">
        <div className="w-full max-h-[20vh] overflow-auto">
          <ProgressBar currentStep={currentStep} totalSteps={totalSteps} onStepClick={handleStepClick} />
          {currentStep > 1 && (
            <Button variant="link" className="flex items-center space-x-2" onClick={handlePrevious}>
              <ArrowLeft size={20} />
              <span>Regresar</span>
            </Button>
          )}
        </div>

        <div className="w-full flex-grow overflow-auto">
          {renderStep()}
        </div>

        <div className={`w-full flex mt-4 max-h-[10vh] pb-40 ${currentStep === totalSteps ? 'justify-center' : 'justify-between'}`}>
          {currentStep < totalSteps && currentStep !== 5 && (
            <Button onClick={handleNext} className="mx-auto" disabled={isNextDisabled}>
              Continuar
            </Button>
          )}
        </div>
      </div>

      <SupportChat />
    </div>
  );
}
