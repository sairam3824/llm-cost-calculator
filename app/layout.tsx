import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LLM Cost Calculator - Compare AI API Costs Across All Providers",
  description: "Interactive web app that lets you compare costs across OpenAI, Anthropic, Google, Mistral, DeepSeek, and open-source alternatives. Real-time cost projections and budget estimations.",
  keywords: ["LLM", "AI", "cost calculator", "OpenAI", "Anthropic", "Claude", "GPT-4", "pricing", "API costs", "AI comparison"],
  authors: [{ name: "LLM Cost Calculator" }],
  openGraph: {
    title: "LLM Cost Calculator - Compare AI API Costs",
    description: "Compare AI API costs across OpenAI, Anthropic, Google, Mistral, DeepSeek and more. Real-time projections and smart recommendations.",
    type: "website",
    siteName: "LLM Cost Calculator",
  },
  twitter: {
    card: "summary_large_image",
    title: "LLM Cost Calculator",
    description: "Compare AI API costs across all major providers",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
