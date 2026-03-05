"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { PRICING_DATA, USE_CASES, LAST_UPDATED } from "@/lib/pricing-data";
import { calculateCosts, getRecommendation } from "@/lib/calculations";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from "recharts";
import { Download, Share2, Zap, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface InitialState {
  inputTokens: number;
  outputTokens: number;
  requestsPerDay: number;
  useBatch: boolean;
  useCase: string;
}

function getInitialStateFromUrl(): InitialState {
  const defaults: InitialState = {
    inputTokens: 500,
    outputTokens: 300,
    requestsPerDay: 1000,
    useBatch: false,
    useCase: "chat",
  };

  if (typeof window === "undefined") {
    return defaults;
  }

  const params = new URLSearchParams(window.location.search);
  const input = Number(params.get("input"));
  const output = Number(params.get("output"));
  const requests = Number(params.get("requests"));
  const useCase = params.get("useCase");

  return {
    inputTokens: Number.isFinite(input) && input > 0 ? input : defaults.inputTokens,
    outputTokens: Number.isFinite(output) && output > 0 ? output : defaults.outputTokens,
    requestsPerDay: Number.isFinite(requests) && requests > 0 ? requests : defaults.requestsPerDay,
    useBatch: params.get("batch") === "true",
    useCase: useCase || defaults.useCase,
  };
}

export default function Home() {
  const initialState = useMemo(() => getInitialStateFromUrl(), []);

  const [inputTokens, setInputTokens] = useState(initialState.inputTokens);
  const [outputTokens, setOutputTokens] = useState(initialState.outputTokens);
  const [requestsPerDay, setRequestsPerDay] = useState(initialState.requestsPerDay);
  const [useBatch, setUseBatch] = useState(initialState.useBatch);
  const [useCase, setUseCase] = useState(initialState.useCase);
  const [providerFilter, setProviderFilter] = useState<string>("all");
  const [showOnlyBatchSupported, setShowOnlyBatchSupported] = useState(false);

  const results = useMemo(() => {
    let filtered = PRICING_DATA;
    
    if (providerFilter !== "all") {
      filtered = filtered.filter(p => p.provider === providerFilter);
    }
    
    if (showOnlyBatchSupported) {
      filtered = filtered.filter(p => p.supportsBatch);
    }
    
    return filtered.map(pricing =>
      calculateCosts(pricing, inputTokens, outputTokens, requestsPerDay, useBatch)
    ).sort((a, b) => a.monthlyCost - b.monthlyCost);
  }, [inputTokens, outputTokens, requestsPerDay, useBatch, providerFilter, showOnlyBatchSupported]);

  const chartData = results.slice(0, 10).map(r => ({
    name: `${r.provider} ${r.model}`,
    cost: Number(r.monthlyCost.toFixed(2)),
  }));

  type ProjectionDataPoint = { days: number } & Record<string, number>;
  const projectionData: ProjectionDataPoint[] = [1, 7, 30, 90, 180, 365].map(days => {
    const data: ProjectionDataPoint = { days };
    results.slice(0, 5).forEach(r => {
      data[`${r.provider} ${r.model}`] = Number((r.dailyCost * days).toFixed(2));
    });
    return data;
  });

  const recommendation = getRecommendation(results, useCase, 1000);
  
  const providers = ["all", ...Array.from(new Set(PRICING_DATA.map(p => p.provider)))];

  const [showCopyNotification, setShowCopyNotification] = useState(false);

  const shareResults = () => {
    const url = `${window.location.origin}?input=${inputTokens}&output=${outputTokens}&requests=${requestsPerDay}&batch=${useBatch}&useCase=${useCase}`;
    navigator.clipboard.writeText(url).then(() => {
      setShowCopyNotification(true);
      setTimeout(() => setShowCopyNotification(false), 3000);
    }).catch(() => {
      alert("Failed to copy link. Please copy manually: " + url);
    });
  };

  const exportCSV = () => {
    const csv = [
      ["Provider", "Model", "Monthly Cost", "Yearly Cost", "Cost per Request"],
      ...results.map(r => [r.provider, r.model, r.monthlyCost.toFixed(2), r.yearlyCost.toFixed(2), r.costPerRequest.toFixed(6)])
    ].map(row => row.join(",")).join("\n");
    
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "llm-cost-comparison.csv";
    a.click();
    URL.revokeObjectURL(url); // Clean up memory
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-gray-100">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full mb-4">
            <Zap className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-blue-400">Last updated: {LAST_UPDATED}</span>
          </div>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            LLM Cost Calculator
          </h1>
          <p className="text-xl text-gray-400">Compare AI API costs across all major providers</p>
        </div>

        {/* Input Panel */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">Configure Your Usage</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Use Case</label>
                <select
                  value={useCase}
                  onChange={(e) => {
                    setUseCase(e.target.value);
                    const selected = USE_CASES.find(uc => uc.value === e.target.value);
                    if (selected) {
                      setInputTokens(selected.defaultInput);
                      setOutputTokens(selected.defaultOutput);
                    }
                  }}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  {USE_CASES.map(uc => (
                    <option key={uc.value} value={uc.value}>{uc.label}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Requests per Day</label>
                <input
                  type="number"
                  min="1"
                  value={requestsPerDay}
                  onChange={(e) => setRequestsPerDay(Math.max(1, Number(e.target.value)))}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Input Tokens per Request: {inputTokens.toLocaleString()}
              </label>
              <Slider
                value={inputTokens}
                onValueChange={setInputTokens}
                min={100}
                max={10000}
                step={100}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Output Tokens per Request: {outputTokens.toLocaleString()}
              </label>
              <Slider
                value={outputTokens}
                onValueChange={setOutputTokens}
                min={50}
                max={5000}
                step={50}
              />
            </div>

            <div className="flex items-center gap-3">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={useBatch}
                  onChange={(e) => setUseBatch(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
              <label htmlFor="batch" className="text-sm cursor-pointer">
                Use Batch API (50% cheaper for supported models)
              </label>
            </div>

            <div className="grid md:grid-cols-2 gap-6 pt-4 border-t border-gray-800">
              <div>
                <label className="block text-sm font-medium mb-2">Filter by Provider</label>
                <select
                  value={providerFilter}
                  onChange={(e) => setProviderFilter(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  {providers.map(p => (
                    <option key={p} value={p}>{p === "all" ? "All Providers" : p}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-end">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showOnlyBatchSupported}
                    onChange={(e) => setShowOnlyBatchSupported(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  <span className="ms-3 text-sm">Show only batch-supported models</span>
                </label>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={shareResults}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition relative"
              >
                <Share2 className="w-4 h-4" />
                Share Results
                {showCopyNotification && (
                  <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-green-600 text-white text-xs px-3 py-1 rounded whitespace-nowrap">
                    Link copied!
                  </span>
                )}
              </button>
              <button
                onClick={exportCSV}
                className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Summary Stats */}
        {results.length > 0 ? (
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="text-sm text-gray-400 mb-1">Cheapest Option</div>
                <div className="text-2xl font-bold text-green-400">${results[0].monthlyCost.toFixed(2)}</div>
                <div className="text-xs text-gray-500 mt-1">{results[0].provider} {results[0].model}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="text-sm text-gray-400 mb-1">Most Expensive</div>
                <div className="text-2xl font-bold text-red-400">${results[results.length - 1].monthlyCost.toFixed(2)}</div>
                <div className="text-xs text-gray-500 mt-1">{results[results.length - 1].provider} {results[results.length - 1].model}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="text-sm text-gray-400 mb-1">Average Cost</div>
                <div className="text-2xl font-bold text-blue-400">
                  ${(results.reduce((sum, r) => sum + r.monthlyCost, 0) / results.length).toFixed(2)}
                </div>
                <div className="text-xs text-gray-500 mt-1">Across {results.length} models</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="text-sm text-gray-400 mb-1">Total Tokens/Day</div>
                <div className="text-2xl font-bold text-purple-400">
                  {((inputTokens + outputTokens) * requestsPerDay / 1_000_000).toFixed(2)}M
                </div>
                <div className="text-xs text-gray-500 mt-1">{requestsPerDay.toLocaleString()} requests</div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card className="mb-8">
            <CardContent className="p-6 text-center text-gray-400">
              No models match your filter criteria. Try adjusting your filters.
            </CardContent>
          </Card>
        )}

        {/* Recommendation */}
        {results.length > 0 && (
          <Card className="mb-8 bg-gradient-to-r from-blue-900/20 to-purple-900/20 border-blue-500/30">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <TrendingUp className="w-6 h-6 text-blue-400 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg mb-1">Smart Recommendation</h3>
                  <p className="text-gray-300">{recommendation}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Cost Comparison Table */}
        {results.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl">Cost Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-800">
                      <th className="text-left py-3 px-4">Provider</th>
                      <th className="text-left py-3 px-4">Model</th>
                      <th className="text-right py-3 px-4">Per Request</th>
                      <th className="text-right py-3 px-4">Daily</th>
                      <th className="text-right py-3 px-4">Monthly</th>
                      <th className="text-right py-3 px-4">Yearly</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((result, i) => {
                      const pricing = PRICING_DATA.find(p => p.provider === result.provider && p.model === result.model);
                      return (
                        <tr key={i} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition">
                          <td className="py-3 px-4 font-medium">{result.provider}</td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              {result.model}
                              {pricing?.supportsBatch && (
                                <Badge variant="info" className="text-[10px]">BATCH</Badge>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-4 text-right">${result.costPerRequest.toFixed(6)}</td>
                          <td className="py-3 px-4 text-right">${result.dailyCost.toFixed(2)}</td>
                          <td className="py-3 px-4 text-right font-semibold">${result.monthlyCost.toFixed(2)}</td>
                          <td className="py-3 px-4 text-right">${result.yearlyCost.toFixed(2)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Charts */}
        {results.length > 0 && (
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Cost Comparison (Top 10)</CardTitle>
              </CardHeader>
              <CardContent>
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                      <YAxis tick={{ fill: '#9CA3AF' }} />
                      <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }} />
                      <Bar dataKey="cost" fill="#3B82F6" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-gray-400">
                    No data to display
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cost Projection Over Time (Top 5)</CardTitle>
              </CardHeader>
              <CardContent>
                {results.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={projectionData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="days" tick={{ fill: '#9CA3AF' }} label={{ value: 'Days', position: 'insideBottom', offset: -5, fill: '#9CA3AF' }} />
                      <YAxis tick={{ fill: '#9CA3AF' }} />
                      <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }} />
                      <Legend wrapperStyle={{ fontSize: '12px' }} />
                      {results.slice(0, 5).map((r, i) => (
                        <Line 
                          key={i} 
                          type="monotone" 
                          dataKey={`${r.provider} ${r.model}`}
                          stroke={['#3B82F6', '#8B5CF6', '#EC4899', '#10B981', '#F59E0B'][i]} 
                          strokeWidth={2}
                        />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-gray-400">
                    No data to display
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Cost per 1M Tokens & Breakeven Analysis */}
        {results.length > 0 && (
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Cost per 1M Tokens (Top 10)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {results.slice(0, 10).map((result, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                      <div>
                        <div className="font-medium">{result.provider} {result.model}</div>
                        <div className="text-sm text-gray-400">Combined tokens</div>
                      </div>
                      <div className="text-lg font-semibold text-blue-400">
                        ${result.costPer1MTokens.toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Breakeven Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-gray-400 mb-4">
                    At what daily request volume does one provider become cheaper than another?
                  </p>
                  {results.length >= 4 ? (
                    results.slice(0, 3).map((cheaper, i) => {
                      const expensiveIndex = results.length - 1 - i;
                      if (expensiveIndex <= i) return null; // Avoid comparing same or overlapping models
                      
                      const expensive = results[expensiveIndex];
                      const costDiff = expensive.costPerRequest - cheaper.costPerRequest;
                      const breakevenRequests = costDiff > 0 ? Math.ceil(1 / costDiff) : Infinity;
                      
                      return (
                        <div key={i} className="p-4 bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-lg border border-blue-500/20">
                          <div className="text-sm font-medium mb-2">
                            {cheaper.provider} {cheaper.model} vs {expensive.provider} {expensive.model}
                          </div>
                          <div className="text-xs text-gray-400">
                            {breakevenRequests === Infinity ? (
                              <span>{cheaper.provider} {cheaper.model} is always cheaper</span>
                            ) : (
                              <span>
                                Breakeven at <span className="text-blue-400 font-semibold">{breakevenRequests.toLocaleString()}</span> requests/day
                                <br />
                                <span className="text-gray-500">
                                  (${(breakevenRequests * cheaper.costPerRequest).toFixed(2)}/day)
                                </span>
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-sm text-gray-400 text-center py-8">
                      Need at least 4 models to show breakeven analysis
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Footer */}
        <div className="text-center text-gray-500 text-sm">
          <p>Pricing data last updated: {LAST_UPDATED}</p>
          <p className="mt-2">All costs are estimates. Check provider websites for current pricing.</p>
        </div>
      </div>
    </div>
  );
}
