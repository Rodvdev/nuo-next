import { Input } from "@/components/ui/input";
import { PlusIcon, CheckIcon, ChevronUpIcon, TrashIcon, EditIcon, ChevronDownIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FormData, Partner, Currency } from "@/types/types";

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
      currency: partner.currency || Currency.Peruvian_Sol,
      nonMonetaryCurrency: partner.nonMonetaryCurrency || Currency.Peruvian_Sol,
    })) || []
  );

  const [expandedPartnerIndex, setExpandedPartnerIndex] = useState<number | null>(null);
  const [editingNonMonetaryIndex, setEditingNonMonetaryIndex] = useState<{ partnerIndex: number; contributionIndex: number } | null>(null);

  const validateForm = (partnersList: Partner[]) => {
    const allPartnersValid = partnersList.every(
      (partner) =>
        parseFloat(partner.monetaryContribution || "0") >= 1 ||
        (partner.nonMonetaryContributions && partner.nonMonetaryContributions.length > 0)
    );
    setIsNextDisabled(!allPartnersValid);
  };

  useEffect(() => {
    validateForm(partners);
  }, [partners]);

  const handleContributionChange = (index: number, field: keyof Partner, value: string) => {
    const updatedPartners = [...partners];
    updatedPartners[index] = {
      ...updatedPartners[index],
      [field]: value
    };

    setPartners(updatedPartners);
    updateFormData({ partners: updatedPartners });
    validateForm(updatedPartners);
  };

  const isCompleted = (partner: Partner) =>
    parseFloat(partner.monetaryContribution || "0") >= 1 ||
    (partner.nonMonetaryContributions && partner.nonMonetaryContributions.length > 0);

  const toggleCurrency = (index: number) => {
    const updatedCurrency = partners[index].currency === "$" ? "S/." : "$";
    handleContributionChange(index, "currency", updatedCurrency);
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

    updatedPartners[index].newNonMonetaryDescription = "";
    updatedPartners[index].newNonMonetaryValue = "";

    setPartners(updatedPartners);
    updateFormData({ partners: updatedPartners });
  };

  const removeNonMonetaryContribution = (partnerIndex: number, contributionIndex: number) => {
    const updatedPartners = [...partners];
    updatedPartners[partnerIndex].nonMonetaryContributions?.splice(contributionIndex, 1);
    setPartners(updatedPartners);
    updateFormData({ partners: updatedPartners });
  };

  const startEditingNonMonetaryContribution = (partnerIndex: number, contributionIndex: number) => {
    setEditingNonMonetaryIndex({ partnerIndex, contributionIndex });
  };

  const saveNonMonetaryContribution = (
    partnerIndex: number,
    contributionIndex: number,
    field: keyof NonMonetaryContribution,
    value: string
  ) => {
    const updatedPartners = [...partners];

    if (field === "nonMonetaryCurrency") {
      // Verificar que el valor sea una moneda válida antes de asignarlo
      if (Object.values(Currency).includes(value as Currency)) {
        updatedPartners[partnerIndex].nonMonetaryContributions![contributionIndex][field] = value as Currency;
      } else {
        console.error("Valor de moneda inválido");
        return;
      }
    } else {
      updatedPartners[partnerIndex].nonMonetaryContributions![contributionIndex][field] = value;
    }

    setEditingNonMonetaryIndex(null);
    setPartners(updatedPartners);
    updateFormData({ partners: updatedPartners });
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold">Aportes de los Socios</h1>

      <div className="grid grid-cols-1 gap-6">
        {partners.map((partner, index) => (
          <div key={index}>
            <div
              className={`border-2 p-4 rounded-lg flex flex-col md:flex-row items-start md:items-center justify-between cursor-pointer ${isCompleted(partner) ? "bg-green-100 border-green-500" : "bg-white"}`}
              onClick={() => setExpandedPartnerIndex(expandedPartnerIndex === index ? null : index)}
            >
              <div className="flex flex-col mb-2 md:mb-0 md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                <span>{partner.name} {partner.lastName}</span>

                {/* Resumen de Aportes */}
                <div className="flex flex-col text-sm text-gray-700">
                  {/* Aporte Monetario */}
                  {partner.monetaryContribution && (
                    <span>Capital: {partner.currency} {partner.monetaryContribution}</span>
                  )}
                  {/* Aportes en Especie */}
                  {partner.nonMonetaryContributions && partner.nonMonetaryContributions.length > 0 && (
                    <span>
                      Aportes en Especie: {partner.nonMonetaryContributions.length} items -{" "}
                      {Object.entries(
                        (partner.nonMonetaryContributions || []).reduce((acc, contribution) => {
                          const { nonMonetaryCurrency, nonMonetaryValue } = contribution;
                          const value = parseFloat(nonMonetaryValue || "0");
                          acc[nonMonetaryCurrency] = (acc[nonMonetaryCurrency] || 0) + value;
                          return acc;
                        }, {} as Record<string, number>)
                      ).map(([currency, total], idx) => (
                        <span key={idx}>
                          {currency} {total}
                          {idx < Object.entries((partner.nonMonetaryContributions || []).reduce((acc, contribution) => {
                            const { nonMonetaryCurrency, nonMonetaryValue } = contribution;
                            const value = parseFloat(nonMonetaryValue || "0");
                            acc[nonMonetaryCurrency] = (acc[nonMonetaryCurrency] || 0) + value;
                            return acc;
                          }, {} as Record<string, number>)).length - 1 ? ", " : ""}
                        </span>
                      ))}
                    </span>
                  )}
                </div>
              </div>

              {/* Icons */}
              <div className="flex items-center space-x-2">
                {isCompleted(partner) ? (
                  <CheckIcon className="text-green-500 mt-2 md:mt-0" />
                ) : (
                  <PlusIcon className="mt-2 md:mt-0" />
                )}
                {expandedPartnerIndex === index ? (
                  <ChevronUpIcon className="mt-2 md:mt-0" />
                ) : (
                  <ChevronDownIcon className="mt-2 md:mt-0" />
                )}
              </div>
            </div>


            {expandedPartnerIndex === index && (
              <div className="space-y-4 p-6 border border-gray-200 rounded-lg bg-gray-50 mt-4">
                <h4 className="font-semibold">Aportes de {partners[expandedPartnerIndex].name}</h4>

                {/* Aportes de Capital */}
                <div className="space-y-2">
                  <Label>Aportes de Capital</Label>
                  <div className="flex space-x-2 mb-4">
                    <div
                      onClick={() => toggleCurrency(expandedPartnerIndex)}
                      className="flex items-center cursor-pointer border-2 px-2 rounded-lg"
                    >
                      {partners[expandedPartnerIndex].currency || "S/."}
                    </div>
                    <Input
                      placeholder="Monto"
                      value={partners[expandedPartnerIndex].monetaryContribution || ""}
                      onChange={(e) =>
                        handleContributionChange(expandedPartnerIndex, "monetaryContribution", e.target.value)
                      }
                    />
                  </div>
                </div>

                {/* Aportes no dinerarios */}
                <div className="space-y-2">
                  <Label>Aportes no Dinerarios</Label>
                  <div className="space-y-2">
                    <Input
                      placeholder="Descripción"
                      value={partners[expandedPartnerIndex].newNonMonetaryDescription || ""}
                      onChange={(e) =>
                        handleContributionChange(expandedPartnerIndex, "newNonMonetaryDescription", e.target.value)
                      }
                    />
                    <div className="flex items-center space-x-2">
                      <div
                        onClick={() => toggleCurrency(expandedPartnerIndex)}
                        className="flex items-center cursor-pointer border-2 px-2 py-1 rounded-lg"
                      >
                        {partners[expandedPartnerIndex].nonMonetaryCurrency}
                      </div>
                      <Input
                        placeholder="Valor Estimado"
                        value={partners[expandedPartnerIndex].newNonMonetaryValue || ""}
                        onChange={(e) =>
                          handleContributionChange(expandedPartnerIndex, "newNonMonetaryValue", e.target.value)
                        }
                      />
                    </div>
                    <Button
                      onClick={() => {
                        addNonMonetaryContribution(
                          expandedPartnerIndex,
                          partners[expandedPartnerIndex].newNonMonetaryDescription!,
                          partners[expandedPartnerIndex].newNonMonetaryValue!,
                          partners[expandedPartnerIndex].nonMonetaryCurrency || Currency.Peruvian_Sol
                        );
                      }}
                      className="bg-blue-600 text-white mt-2"
                    >
                      + Agregar Aporte en especie
                    </Button>
                  </div>

                  {partners[expandedPartnerIndex]?.nonMonetaryContributions &&
                    partners[expandedPartnerIndex].nonMonetaryContributions.length > 0 && (
                      <div className="space-y-2 mt-4">
                        <h5 className="font-semibold">Aportes en Especie Agregados</h5>
                        {partners[expandedPartnerIndex].nonMonetaryContributions.map((contribution, idx) => (
                          <div key={idx} className="border rounded-lg p-4 bg-white flex justify-between items-center">
                            <div>
                              {editingNonMonetaryIndex?.partnerIndex === expandedPartnerIndex && editingNonMonetaryIndex.contributionIndex === idx ? (
                                <>
                                  <Input
                                    value={contribution.nonMonetaryContribution}
                                    onChange={(e) => saveNonMonetaryContribution(expandedPartnerIndex, idx, "nonMonetaryContribution", e.target.value)}
                                  />
                                  <Input
                                    value={contribution.nonMonetaryValue}
                                    onChange={(e) => saveNonMonetaryContribution(expandedPartnerIndex, idx, "nonMonetaryValue", e.target.value)}
                                  />
                                </>
                              ) : (
                                <>
                                  <p><strong>Descripción:</strong> {contribution.nonMonetaryContribution}</p>
                                  <p><strong>Valor Estimado:</strong> {contribution.nonMonetaryCurrency} {contribution.nonMonetaryValue}</p>
                                </>
                              )}
                            </div>
                            <div className="flex space-x-2">
                              {editingNonMonetaryIndex?.partnerIndex === expandedPartnerIndex && editingNonMonetaryIndex.contributionIndex === idx ? (
                                <Button onClick={() => setEditingNonMonetaryIndex(null)}>Guardar</Button>
                              ) : (
                                <Button
                                  variant="ghost"
                                  onClick={() => startEditingNonMonetaryContribution(expandedPartnerIndex, idx)}
                                >
                                  <EditIcon className="text-gray-600" />
                                </Button>
                              )}
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
