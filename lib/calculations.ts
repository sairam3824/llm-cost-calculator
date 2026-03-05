import { ModelPricing } from "./pricing-data";

export interface CostResult {
  provider: string;
  model: string;
  costPerRequest: number;
  dailyCost: number;
  monthlyCost: number;
  yearlyCost: number;
  costPer1MTokens: number;
}

export function calculateCosts(
  pricing: ModelPricing,
  inputTokens: number,
  outputTokens: number,
  requestsPerDay: number,
  useBatch: boolean
): CostResult {
  const inputMultiplier = useBatch && pricing.supportsBatch ? pricing.batchDiscount : 1;
  const outputMultiplier = useBatch && pricing.supportsBatch ? pricing.batchDiscount : 1;

  const inputCost = (inputTokens / 1_000_000) * pricing.inputCostPer1M * inputMultiplier;
  const outputCost = (outputTokens / 1_000_000) * pricing.outputCostPer1M * outputMultiplier;
  
  const costPerRequest = inputCost + outputCost;
  const dailyCost = costPerRequest * requestsPerDay;
  const monthlyCost = dailyCost * 30;
  const yearlyCost = dailyCost * 365;
  
  const totalTokens = inputTokens + outputTokens;
  const costPer1MTokens = (costPerRequest / totalTokens) * 1_000_000;

  return {
    provider: pricing.provider,
    model: pricing.model,
    costPerRequest,
    dailyCost,
    monthlyCost,
    yearlyCost,
    costPer1MTokens,
  };
}

export function getRecommendation(results: CostResult[], useCase: string, budget: number): string {
  const sorted = [...results].sort((a, b) => a.monthlyCost - b.monthlyCost);
  if (sorted.length === 0) {
    return "No matching models for the current filters. Try adjusting your filters.";
  }

  const withinBudget = sorted.filter(r => r.monthlyCost <= budget);
  
  if (withinBudget.length === 0) {
    return `Consider ${sorted[0].provider} ${sorted[0].model} - the most affordable option at $${sorted[0].monthlyCost.toFixed(2)}/month`;
  }
  
  if (useCase === "code") {
    const codeModels = withinBudget.filter(r => 
      r.model.toLowerCase().includes("code") || 
      r.model.includes("GPT-4") ||
      r.model.includes("Sonnet")
    );
    if (codeModels.length > 0) {
      return `For code generation, we recommend ${codeModels[0].provider} ${codeModels[0].model} at $${codeModels[0].monthlyCost.toFixed(2)}/month`;
    }
  }
  
  const bestValue = withinBudget[Math.floor(withinBudget.length / 2)];
  return `Best value: ${bestValue.provider} ${bestValue.model} at $${bestValue.monthlyCost.toFixed(2)}/month`;
}
