# LLM Cost Calculator

A web application for comparing AI API costs across major LLM providers. Built with Next.js, TypeScript, and Tailwind CSS.

## Features

- Compare costs across multiple providers/models
- Real-time cost calculations (per request/day/month/year)
- Use-case presets (chat, code, summarization, RAG, agents)
- Batch API discount toggle for supported models
- Provider and batch-support filters
- Cost comparison table and charts
- Shareable URL state
- CSV export

## Supported Providers

- OpenAI
- Anthropic
- Google
- Mistral
- DeepSeek
- Open-source hosting estimates (Meta, Alibaba)

## Prerequisites

- Node.js 18+
- npm

## Run in Terminal

From this project directory:

```bash
cd "/Users/sairammaruri/Documents/New git projects/llm-cost-calculator/llm-cost-calculator"
npm install
npm run dev
```

Open: [http://localhost:3000](http://localhost:3000)

## Production Run

```bash
npm run build
npm start
```

## Useful Commands

```bash
npm run lint
npm run build
npm run dev -- --port 3001
```

## Usage

1. Select a use case.
2. Set input/output tokens and requests per day.
3. Optionally enable batch mode.
4. Optionally filter by provider or batch-supported models.
5. Compare costs and review recommendation/charts.
6. Share results or export CSV.

## Tech Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4
- Recharts
- Lucide React

## Project Structure

```text
llm-cost-calculator/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   └── opengraph-image.tsx
├── components/ui/
├── lib/
│   ├── pricing-data.ts
│   ├── calculations.ts
│   └── utils.ts
└── public/
```

## Known Non-Blocking Warnings

- Next.js may warn about multiple lockfiles and inferred workspace root.
- Next.js may warn `metadataBase` is not set (defaults to localhost in build logs).

These warnings do not block local development or production builds.

## License

Licensed under the MIT License. See [LICENSE](LICENSE).

## Disclaimer

Costs are estimates based on public pricing. Verify provider pricing before production decisions.

---

Last Updated: March 5, 2026
