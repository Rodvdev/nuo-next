// types.ts
import { ComponentType, SVGProps } from 'react';
// Interface para cada paso en el sidebar
export interface Step {
  id: number;
  title: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
}

export interface Application {
  partners: Partner[];
}

export interface FormData {
  applicantFirstName?: string;
  applicantLastName?: string;
  documentNumber?: string;
  applicantEmail?: string;
  applicantPhone?: string;
  applicantPhoneCode?: string;
  documentType?: DocumentType;
  residency?: Residency;
  companyType?: CompanyType;
  corporatePurpose?: string;
  ceo?: CEO;
  companyName?: string;
  partners?: Partner[];
  razonSocial1?: string;
  razonSocial2?: string;
  razonSocial3?: string;
  razonSocial4?: string;
  razonSocial5?: string;
}

export interface CEO {
  name?: string;
  lastName?: string;
  nationality?: string;
  documentType?: DocumentType;
  documentNumber?: string;
  email?: string;
  phone?: string;
  countryCode?: string;
  partner?: boolean;
  legalRepName?: string;
  legalRepEmail?: string;
}

export interface Partner {
  name?: string;
  lastName?: string;
  documentType?: DocumentType;
  documentNumber?: string;
  nationality?: string;
  otherNationality?: string;
  email?: string;
  phone?: string;
  countryCode?: string;
  monetaryContribution?: string;
  currency?: Currency;
  nonMonetaryContributions?: NonMonetaryContribution[];
  nonMonetaryCurrency?: Currency;
  newNonMonetaryDescription?: string;
  newNonMonetaryValue?: string;
  hasNonMonetaryContribution?: boolean;
}

export interface NonMonetaryContribution {
  nonMonetaryContribution: string;
  nonMonetaryValue: string;
  nonMonetaryCurrency: Currency;
}

// Información básica del solicitante
export interface ApplicantInfo {
  applicantFirstName: string;
  applicantLastName: string;
  applicantEmail: string;
  documentType: string;
  documentNumber: string;
  applicantPhoneCode: string;
  applicantPhone: string;
  residency: string;
}


// Información de la empresa
export interface CompanyInfo {
  ceo: {
    name: string;
    lastName: string;
    partner: boolean;
  };
  corporatePurpose: string;
  companyType: string;
}
export interface CompanyDashboardInfo {
  ceo: {
    name: string;
    lastName: string;
  };
  companyName: string;
  companyType: string;
  corporatePurpose: string;
  razonSocial1?: string;
  razonSocial2?: string;
  razonSocial3?: string;
  razonSocial4?: string;
  razonSocial5?: string;
}

// Documentos requeridos
export interface RequiredDocuments {
  identityDocuments: File[];
  notarizedPowers: File[];
  addressProofs: File[];
}

// Licencias y verificaciones
export interface VerificationAndLicenses {
  municipalLicenses: boolean;
  taxClearance: boolean;
  businessRegistration: boolean;
}


export enum DocumentType {
  DNI = "dni",
  Passport = "passport",
  ForeignId = "foreignId",
}

export enum Residency {
  Extranjero = "extranjero",
  Peru = "peru",
}

export enum CompanyType {
  SAC = "SAC",
  SA = "SA",
}

export enum Currency {
  US_Dollar = "$",
  Peruvian_Sol = "S/.",
}

