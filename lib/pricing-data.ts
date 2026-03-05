export interface ModelPricing {
  provider: string;
  model: string;
  inputCostPer1M: number;
  outputCostPer1M: number;
  supportsBatch: boolean;
  batchDiscount: number;
  category: string;
}

export const PRICING_DATA: ModelPricing[] = [
  // OpenAI
  { provider: "OpenAI", model: "GPT-4o", inputCostPer1M: 2.5, outputCostPer1M: 10, supportsBatch: true, batchDiscount: 0.5, category: "premium" },
  { provider: "OpenAI", model: "GPT-4o-mini", inputCostPer1M: 0.15, outputCostPer1M: 0.6, supportsBatch: true, batchDiscount: 0.5, category: "efficient" },
  { provider: "OpenAI", model: "o1", inputCostPer1M: 15, outputCostPer1M: 60, supportsBatch: false, batchDiscount: 0, category: "reasoning" },
  { provider: "OpenAI", model: "o3-mini", inputCostPer1M: 1.1, outputCostPer1M: 4.4, supportsBatch: false, batchDiscount: 0, category: "reasoning" },
  
  // Anthropic
  { provider: "Anthropic", model: "Claude Opus 4", inputCostPer1M: 15, outputCostPer1M: 75, supportsBatch: true, batchDiscount: 0.5, category: "premium" },
  { provider: "Anthropic", model: "Claude Sonnet 4", inputCostPer1M: 3, outputCostPer1M: 15, supportsBatch: true, batchDiscount: 0.5, category: "balanced" },
  { provider: "Anthropic", model: "Claude Haiku 3.5", inputCostPer1M: 0.8, outputCostPer1M: 4, supportsBatch: true, batchDiscount: 0.5, category: "efficient" },
  
  // Google
  { provider: "Google", model: "Gemini 2.5 Pro", inputCostPer1M: 1.25, outputCostPer1M: 5, supportsBatch: false, batchDiscount: 0, category: "balanced" },
  { provider: "Google", model: "Gemini 2.5 Flash", inputCostPer1M: 0.075, outputCostPer1M: 0.3, supportsBatch: false, batchDiscount: 0, category: "efficient" },
  
  // Mistral
  { provider: "Mistral", model: "Large", inputCostPer1M: 2, outputCostPer1M: 6, supportsBatch: false, batchDiscount: 0, category: "balanced" },
  { provider: "Mistral", model: "Small", inputCostPer1M: 0.2, outputCostPer1M: 0.6, supportsBatch: false, batchDiscount: 0, category: "efficient" },
  { provider: "Mistral", model: "Codestral", inputCostPer1M: 0.3, outputCostPer1M: 0.9, supportsBatch: false, batchDiscount: 0, category: "code" },
  
  // DeepSeek
  { provider: "DeepSeek", model: "V3", inputCostPer1M: 0.27, outputCostPer1M: 1.1, supportsBatch: false, batchDiscount: 0, category: "efficient" },
  { provider: "DeepSeek", model: "R1", inputCostPer1M: 0.55, outputCostPer1M: 2.19, supportsBatch: false, batchDiscount: 0, category: "reasoning" },
  
  // Open Source (estimated hosting costs on cloud GPU)
  { provider: "Meta", model: "Llama 3.3 70B", inputCostPer1M: 0.35, outputCostPer1M: 0.4, supportsBatch: false, batchDiscount: 0, category: "open-source" },
  { provider: "Alibaba", model: "Qwen 2.5 72B", inputCostPer1M: 0.35, outputCostPer1M: 0.4, supportsBatch: false, batchDiscount: 0, category: "open-source" },
];

export const USE_CASES = [
  { value: "chat", label: "Chat / Conversational AI", defaultInput: 500, defaultOutput: 300 },
  { value: "code", label: "Code Generation", defaultInput: 800, defaultOutput: 1200 },
  { value: "summarization", label: "Summarization", defaultInput: 3000, defaultOutput: 500 },
  { value: "rag", label: "RAG / Q&A", defaultInput: 2000, defaultOutput: 400 },
  { value: "agents", label: "AI Agents", defaultInput: 1500, defaultOutput: 800 },
];

export const LAST_UPDATED = "2026-03-04";
