# 🚀 Rocket Singh — AI Sales Agent Platform

An AI-powered sales agent platform that automates the outbound SaaS sales workflow from lead discovery to deal closure. Built as a hackathon prototype.

## Stack

- **Frontend**: React 18 + TypeScript (Vite)
- **Styling**: Vanilla CSS (dark theme, glassmorphism)
- **Storage**: In-memory with seed data
- **AI Agents**: Rule-based mocked agents with realistic outputs

## Quick Start

```bash
npm install
npm run dev
```

The app opens at `http://localhost:5173`

## What's Mocked

- **AI Agents** — All agents use deterministic, rule-based logic instead of LLM calls. They generate realistic structured memory and messages.
- **Email Delivery** — Outreach messages are generated but not sent.
- **Calendar/Booking** — Uses placeholder URLs.
- **Payment** — Uses placeholder checkout URL.
- **Lead Discovery** — Generates synthetic leads from randomized pools.

## Demo Flow

1. **Open the app** → Pipeline view loads with 6 seeded leads
2. **View Onboarding** → See/edit the SaaS company profile (DemoFlow AI)
3. **Generate Leads** → Click "Generate Leads" on the Pipeline to create more
4. **Run Pipeline** → Click leads → "Run Next Action" to advance through statuses
5. **Qualification** → Watch leads get scored and qualified/disqualified
6. **Outreach** → See personalized email messages generated
7. **Demo Sharing** → Demo video and booking links attached to leads
8. **Sales Chat** → Open Agent Console → Select a lead → Chat as a prospect:
   - `What pricing plans do you offer?`
   - `Can you integrate with our CRM?`
   - `Can we get a discount?`
9. **Negotiation** → Discount rules are enforced per company settings
10. **Close Deal** → Close as Won → Payment link appears in memory
11. **Metrics** → View conversion rates and pipeline analytics

## Features

- ✅ Founder onboarding form
- ✅ CRM pipeline board (Kanban)
- ✅ Lead detail drawer with shared memory timeline
- ✅ 6 specialized AI agents (Discovery, Qualification, Outreach, Demo, Sales, Closing)
- ✅ Orchestrator for automated pipeline progression
- ✅ Sales chat interface
- ✅ Seed data (works immediately)
- ✅ Metrics dashboard
- ✅ Responsive design (laptop + mobile)
