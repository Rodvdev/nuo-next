import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { PlusIcon, CheckIcon, ChevronUpIcon, TrashIcon, EditIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import { FormData, Partner, Currency } from "@/types/types";

// Define interfaces for contributions and partners
interface NonMonetaryContribution {
  nonMonetaryContribution: string;
  nonMonetaryValue: string;
  nonMonetaryCurrency: string;
}

interface PartnerContributionsProps {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
  setIsNextDisabled: (disabled: boolean) => void;
}

export function PartnerContributions({
  formData,
  updateFormData,
  setIsNextDisabled,
}: PartnerContributionsProps) {
  const [partners, setPartners] = useState<Partner[]>(
    formData?.partners?.map((partner) => ({
      ...partner,
      currency: partner.currency || Currency.Peruvian_Sol, // Use the renamed enum
      nonMonetaryCurrency: partner.nonMonetaryCurrency || Currency.Peruvian_Sol, // Use the renamed enum
    })) || []
  );


  const [expandedPartnerIndex, setExpandedPartnerIndex] = useState<number | null>(null); // Track the expanded partner

  useEffect(() => {
    validateForm(partners);
  }, [partners]);

  const handleContributionChange = (index: number, field: keyof Partner, value: string) => {
    const updatedPartners = [...partners];
    updatedPartners[index] = {
      ...updatedPartners[index],
      [field]: value || "S/." // Fallback to a default value if value is undefined
    };

    setPartners(updatedPartners);
    updateFormData({ partners: updatedPartners });
    validateForm(updatedPartners);
  };

  const toggleCurrency = (index: number) => {
    const updatedCurrency = partners[index].currency === "$" ? "S/." : "$";
    handleContributionChange(index, "currency", updatedCurrency);
  };

  const toggleNonMonetaryCurrency = (index: number) => {
    const updatedCurrency = partners[index].nonMonetaryCurrency === "$" ? "S/." : "$";
    handleContributionChange(index, "nonMonetaryCurrency", updatedCurrency);
  };


  const validateForm = (partnersList: Partner[]) => {
    const allPartnersValid = partnersList.every(
      (partner) =>
        parseFloat(partner.monetaryContribution || "0") >= 1 ||
        (partner.nonMonetaryContributions && partner.nonMonetaryContributions.length > 0)
    );
    setIsNextDisabled(!allPartnersValid);
  };

  const addNonMonetaryContribution = (index: number, description: string, value: string, currency: Currency) => {
    const updatedPartners = [...partners];
    if (!updatedPartners[index].nonMonetaryContributions) {
      updatedPartners[index].nonMonetaryContributions = [];
    }
    updatedPartners[index].nonMonetaryContributions.push({
      nonMonetaryContribution: description,
      nonMonetaryValue: value,
      nonMonetaryCurrency: currency,
    });

    // Reset the input fields for non-monetary contribution
    updatedPartners[index].newNonMonetaryDescription = "";
    updatedPartners[index].newNonMonetaryValue = "";

    setPartners(updatedPartners);
    updateFormData({ partners: updatedPartners });
  };

  const calculateNonMonetaryTotalsByCurrency = (contributions: NonMonetaryContribution[]) => {
    const totals = contributions.reduce((acc, contribution) => {
      const currency = contribution.nonMonetaryCurrency;
      const value = parseFloat(contribution.nonMonetaryValue || "0");
      acc[currency] = (acc[currency] || 0) + value;
      return acc;
    }, {} as Record<string, number>);
    return totals;
  };

  const isCompleted = (partner: Partner) => {
    return (
      parseFloat(partner.monetaryContribution || "0") >= 1 ||
      (partner.nonMonetaryContributions && partner.nonMonetaryContributions.length > 0)
    );
  };

  const removeNonMonetaryContribution = (partnerIndex: number, contributionIndex: number) => {
    const updatedPartners = [...partners];
    updatedPartners[partnerIndex].nonMonetaryContributions?.splice(contributionIndex, 1);
    setPartners(updatedPartners);
    updateFormData({ partners: updatedPartners });
  };

  const editNonMonetaryContribution = (
    partnerIndex: number,
    contributionIndex: number,
    field: keyof NonMonetaryContribution,
    value: string | Currency // Allow the value to be either string or Currency
  ) => {
    const updatedPartners = [...partners];

    if (updatedPartners[partnerIndex].nonMonetaryContributions) {
      // If the field is 'nonMonetaryCurrency', ensure the value is of type 'Currency'
      if (field === "nonMonetaryCurrency") {
        if (Object.values(Currency).includes(value as Currency)) {
          updatedPartners[partnerIndex].nonMonetaryContributions[contributionIndex][field] = value as Currency;
        } else {
          console.error("Invalid currency value");
        }
      } else {
        // For other fields like 'nonMonetaryContribution' or 'nonMonetaryValue', use the string value
        updatedPartners[partnerIndex].nonMonetaryContributions[contributionIndex][field] = value as string;
      }
    }

    setPartners(updatedPartners);
    updateFormData({ partners: updatedPartners });
  };



  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold">Partner Contributions</h1>

      <div className="grid grid-cols-1 gap-6">
        {partners &&
          partners.map((partner, index) => (
            <div key={index}>
              <div
                className={`border-2 p-4 rounded-lg flex flex-col md:flex-row items-start md:items-center justify-between cursor-pointer ${isCompleted(partner) ? "bg-green-100 border-green-500" : "bg-white"
                  }`}
                onClick={() => setExpandedPartnerIndex(expandedPartnerIndex === index ? null : index)}
              >
                <span className="mb-2 md:mb-0">{partner.name} {partner.lastName}</span>

                {isCompleted(partner) && (
                  <div className="flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-2">
                    {partner.monetaryContribution && (
                      <span>Capital: {partner.currency} {partner.monetaryContribution}</span>
                    )}
                    {partner.nonMonetaryContributions?.length ? (
                      <span>
                        {partner.nonMonetaryContributions.length} items -{" "}
                        {Object.entries(calculateNonMonetaryTotalsByCurrency(partner.nonMonetaryContributions || [])).map(
                          ([currency, total], idx) => (
                            <span key={idx}>
                              {currency} {total}
                              {idx < Object.entries(calculateNonMonetaryTotalsByCurrency(partner.nonMonetaryContributions || [])).length - 1 ? ', ' : ''}
                            </span>
                          )
                        )}
                      </span>
                    ) : null}

                  </div>
                )}

                {expandedPartnerIndex === index ? (
                  <ChevronUpIcon className="cursor-pointer mt-2 md:mt-0" />
                ) : isCompleted(partner) ? (
                  <CheckIcon className="cursor-pointer text-green-500 mt-2 md:mt-0" />
                ) : (
                  <PlusIcon className="cursor-pointer mt-2 md:mt-0" />
                )}
              </div>

              {expandedPartnerIndex === index && (
                <div className="space-y-4 p-6 border border-gray-200 rounded-lg bg-gray-50 mt-4">
                  <h4 className="font-semibold">Contributions for {partners[expandedPartnerIndex].name}</h4>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`monetaryContribution-${expandedPartnerIndex}`}
                        checked={!!partners[expandedPartnerIndex].monetaryContribution}
                        onCheckedChange={(checked) =>
                          handleContributionChange(expandedPartnerIndex, "monetaryContribution", checked ? "" : "")
                        }
                      />
                      <Label htmlFor={`monetaryContribution-${expandedPartnerIndex}`}>Monetary Contribution</Label>
                    </div>
                    {partners[expandedPartnerIndex].monetaryContribution !== null && (
                      <div className="flex space-x-4">
                        <div
                          onClick={() => toggleCurrency(expandedPartnerIndex)}
                          className="cursor-pointer border-2 p-2 rounded-lg"
                        >
                          {partners[expandedPartnerIndex].currency || "S/."}
                        </div>
                        <Input
                          placeholder="Contribution Amount"
                          value={partners[expandedPartnerIndex].monetaryContribution || ""}
                          onChange={(e) =>
                            handleContributionChange(expandedPartnerIndex, "monetaryContribution", e.target.value)
                          }
                        />
                      </div>
                    )}

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`nonMonetaryContribution-${expandedPartnerIndex}`}
                        checked={!!partners[expandedPartnerIndex].nonMonetaryContributions?.length}
                        onCheckedChange={(checked: boolean) =>
                          handleContributionChange(expandedPartnerIndex, "hasNonMonetaryContribution", checked ? "true" : "")
                        }
                      />

                      <Label htmlFor={`nonMonetaryContribution-${expandedPartnerIndex}`}>Non-Monetary Contribution</Label>
                    </div>

                    {partners[expandedPartnerIndex].hasNonMonetaryContribution && (
                      <div className="space-y-4">
                        <div className="space-y-2 space-x-2">
                          <Input
                            placeholder="Description"
                            value={partners[expandedPartnerIndex].newNonMonetaryDescription || ""}
                            onChange={(e) =>
                              handleContributionChange(expandedPartnerIndex, "newNonMonetaryDescription", e.target.value)
                            }
                          />
                          <div className="flex">
                            <div
                              onClick={() => toggleNonMonetaryCurrency(expandedPartnerIndex)}
                              className="cursor-pointer border-2 p-2 rounded-lg"
                            >
                              {partners[expandedPartnerIndex].nonMonetaryCurrency}
                            </div>
                            <Input
                              placeholder="Estimated Value"
                              value={partners[expandedPartnerIndex].newNonMonetaryValue || ""}
                              onChange={(e) =>
                                handleContributionChange(expandedPartnerIndex, "newNonMonetaryValue", e.target.value)
                              }
                            />
                          </div>
                        </div>
                        <Button
                          onClick={() => {
                            addNonMonetaryContribution(
                              expandedPartnerIndex,
                              partners[expandedPartnerIndex].newNonMonetaryDescription!,
                              partners[expandedPartnerIndex].newNonMonetaryValue!,
                              partners[expandedPartnerIndex].nonMonetaryCurrency || Currency.Peruvian_Sol // Default to Currency.Sol if undefined
                            );
                          }}
                        >
                          + Add Non-Monetary Contribution
                        </Button>


                        <div className="space-y-2">
                          {partners[expandedPartnerIndex].nonMonetaryContributions?.map((contribution, idx) => (
                            <div key={idx} className="border rounded-lg p-4 bg-white flex justify-between items-center">
                              <div>
                                <p><strong>Description:</strong> {contribution.nonMonetaryContribution}</p>
                                <p><strong>Estimated Value:</strong> {contribution.nonMonetaryCurrency} {contribution.nonMonetaryValue}</p>
                              </div>
                              <div className="flex space-x-2">
                                <Button
                                  variant="ghost"
                                  onClick={() =>
                                    editNonMonetaryContribution(
                                      expandedPartnerIndex,
                                      idx,
                                      "nonMonetaryContribution",
                                      prompt("Edit description", contribution.nonMonetaryContribution) || contribution.nonMonetaryContribution
                                    )
                                  }
                                >
                                  <EditIcon className="text-gray-600" />
                                </Button>
                                <Button
                                  variant="destructive"
                                  onClick={() => removeNonMonetaryContribution(expandedPartnerIndex, idx)}
                                >
                                  <TrashIcon />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  );
}

