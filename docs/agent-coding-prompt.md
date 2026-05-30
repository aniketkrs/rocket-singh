# Coding Agent Prompt: AI Sales Agent Hackathon Prototype

You are building a quick hackathon prototype for an AI Sales Agent Platform named `rocket-singh`.

The product automates the outbound SaaS sales workflow from lead discovery to deal closure using specialized AI agents coordinated by an orchestrator. Build a working demo that shows the full pipeline clearly, even if external integrations are mocked.

## Goal

Build a usable prototype where a SaaS founder can:

1. Enter company, product, pricing, demo, booking, payment, and ICP details.
2. Generate or import sample leads.
3. Run leads through AI-style pipeline stages:
   - `NEW_LEAD`
   - `QUALIFIED`
   - `CONTACTED`
   - `DEMO_SHARED`
   - `SALES_CONVERSATION`
   - `NEGOTIATION`
   - `CLOSED_WON`
   - `CLOSED_LOST`
4. Inspect each lead's shared memory, including qualification, outreach, demo, conversation, negotiation, and closing notes.
5. Chat with a simulated AI sales agent for a selected lead.
6. Send the final booking link, demo link, or payment link when appropriate.

Optimize for a convincing local demo over production completeness.

## Suggested Stack

Use the simplest full-stack setup available in the repo. If no app exists yet, create:

- Frontend: Next.js or Vite React with TypeScript
- Styling: Tailwind CSS or simple CSS modules
- Backend: API routes/server actions or a small Node/Express service
- Storage: SQLite, JSON file persistence, or in-memory store with seed data
- AI: use an LLM provider only if credentials already exist; otherwise implement deterministic mocked agents with realistic generated text

Do not spend hackathon time on auth, billing integration, email delivery, scraping, or real CRM sync unless already available.

## Prototype Scope

### Must Have

- Founder onboarding form
- CRM pipeline board or table
- Lead detail page/drawer
- Shared memory timeline for each lead
- Agent action buttons
- Simulated orchestrator that moves leads between statuses
- Simulated specialized agents:
  - Lead Discovery Agent
  - Qualification Agent
  - Outreach Agent
  - Demo Agent
  - Sales Agent
  - Closing Agent
- Sales chat interface for a lead
- Seed demo data so the app works immediately after startup

### Nice To Have

- Editable negotiation limits
- Lead scoring
- Activity feed
- Basic metrics dashboard
- CSV lead import
- Export conversation or CRM state

### Out Of Scope

- Real prospect scraping
- Real email sending
- Real calendar scheduling
- Real payment processing
- Multi-user accounts
- Advanced analytics
- Long-term nurture sequences
- Customer success, renewals, or upsells

## Core UX

The first screen should be the working product, not a landing page.

Suggested layout:

- Left or top navigation:
  - Onboarding
  - Pipeline
  - Agent Console
  - Metrics
- Main pipeline view:
  - Kanban columns or dense table grouped by status
  - Lead cards with company, contact, score, status, and latest activity
- Lead detail:
  - Company profile
  - Contact information
  - Current status
  - Qualification result
  - Outreach message
  - Demo assets sent
  - Conversation history
  - Negotiation state
  - Closing result
- Agent console:
  - Select lead
  - Run next recommended action
  - Run specific agent
  - Chat as prospect with the AI Sales Agent

Keep the UI practical and demo-friendly. Avoid marketing-only hero sections.

## Data Model

Implement data structures equivalent to the following. Adapt naming to the selected framework.

```ts
type LeadStatus =
  | "NEW_LEAD"
  | "QUALIFIED"
  | "CONTACTED"
  | "DEMO_SHARED"
  | "SALES_CONVERSATION"
  | "NEGOTIATION"
  | "CLOSED_WON"
  | "CLOSED_LOST";

type CompanyProfile = {
  id: string;
  name: string;
  website: string;
  productDescription: string;
  pricingDetails: string;
  demoVideoUrl: string;
  bookingCalendarUrl: string;
  paymentUrl: string;
  idealCustomerProfile: string;
  negotiationRules: {
    maxDiscountPercent: number;
    allowedTrialDays: number;
    annualContractDiscountPercent: number;
  };
};

type Lead = {
  id: string;
  companyName: string;
  website: string;
  industry: string;
  companySize: string;
  contactName: string;
  contactTitle: string;
  contactEmail: string;
  status: LeadStatus;
  score: number;
  memory: LeadMemory;
  createdAt: string;
  updatedAt: string;
};

type LeadMemory = {
  companyInfo: string;
  contactDetails: string;
  qualificationResult?: {
    outcome: "QUALIFIED" | "DISQUALIFIED";
    score: number;
    reasons: string[];
  };
  outreachHistory: Array<{
    channel: "email" | "linkedin" | "demo";
    message: string;
    sentAt: string;
  }>;
  demoActivity: Array<{
    assetUrl: string;
    bookingUrl: string;
    sentAt: string;
  }>;
  conversationHistory: Array<{
    role: "prospect" | "agent" | "system";
    message: string;
    createdAt: string;
  }>;
  salesNotes: string[];
  negotiation?: {
    requestedDiscountPercent?: number;
    approvedDiscountPercent?: number;
    trialDays?: number;
    notes: string[];
  };
  closing?: {
    outcome: "WON" | "LOST";
    paymentUrl?: string;
    reason?: string;
    closedAt: string;
  };
};
```

## Agent Behavior

Implement each agent as a function or service that reads a lead plus company profile and returns structured updates. The orchestrator applies those updates to the lead memory and status.

### Orchestrator Agent

Responsibilities:

- Determine next action from current lead status.
- Route work to the right specialized agent.
- Update status.
- Append memory events.
- Prevent invalid transitions.

Expected transitions:

```text
NEW_LEAD -> QUALIFIED or CLOSED_LOST
QUALIFIED -> CONTACTED
CONTACTED -> DEMO_SHARED or CLOSED_LOST
DEMO_SHARED -> SALES_CONVERSATION
SALES_CONVERSATION -> NEGOTIATION or CLOSED_LOST
NEGOTIATION -> CLOSED_WON or CLOSED_LOST
```

### Lead Discovery Agent

For the prototype, generate realistic leads from the ICP. Include company name, website, industry, size, contact name, title, and email.

### Qualification Agent

Score leads from 0 to 100 using simple rules:

- ICP industry match
- company size fit
- decision-maker title
- clear pain point fit

Qualified threshold: 65.

### Outreach Agent

Generate a personalized outbound message with:

- prospect-specific context
- value proposition from the founder's product description
- clear CTA to view demo or book a meeting

### Demo Agent

Attach demo video and booking link to the lead. Move the lead to `DEMO_SHARED`.

### Sales Agent

Power the chat experience. It should:

- answer questions from the product knowledge base
- explain pricing
- handle objections
- ask discovery questions
- identify buying intent
- suggest negotiation when intent is high

If no real LLM is configured, use rule-based responses based on keywords like `pricing`, `integration`, `demo`, `discount`, `trial`, `security`, `not interested`, and `buy`.

### Closing Agent

When the lead is ready:

- summarize agreed terms
- send payment/subscription link
- append onboarding instructions
- mark `CLOSED_WON`

If rejected:

- capture loss reason
- mark `CLOSED_LOST`

## API / Action Surface

Create equivalent endpoints, server actions, or local state actions:

- `createCompanyProfile(input)`
- `generateLeads(count)`
- `listLeads()`
- `getLead(id)`
- `runNextAgentAction(leadId)`
- `runAgent(leadId, agentType)`
- `sendProspectMessage(leadId, message)`
- `updateNegotiationRules(input)`
- `closeLead(leadId, outcome)`

Return updated lead records after each mutation.

## Seed Data

Include one default SaaS profile:

- Company: DemoFlow AI
- Product: AI demo automation for B2B SaaS teams
- ICP: B2B SaaS companies with 10-200 employees that rely on demos to sell
- Pricing: Starter $99/month, Growth $299/month, Enterprise custom
- Demo URL: use a placeholder URL
- Booking URL: use a placeholder calendar URL
- Payment URL: use a placeholder checkout URL
- Negotiation: max 20% discount, 14-day trial, 25% annual discount

Include at least 6 leads:

- 3 good-fit leads
- 2 marginal leads
- 1 obvious bad-fit lead

## Metrics

Show simple computed metrics:

- total leads
- qualified leads
- contacted leads
- demos shared
- closed won
- closed lost
- conversion rate
- average lead score

## Acceptance Criteria

The prototype is complete when:

1. The app starts locally with one command documented in the README.
2. The user can onboard or edit the SaaS company profile.
3. Seed leads appear without manual setup.
4. The user can run the orchestrator and watch leads advance through statuses.
5. The user can inspect the shared memory for a lead.
6. The user can chat with the Sales Agent and see conversation history persist during the session.
7. The user can close a lead as won and see the payment link in memory.
8. The pipeline and metrics update after agent actions.
9. The UI is responsive enough for laptop and mobile demo viewports.

## Implementation Order

1. Scaffold the app and README.
2. Add types and seed data.
3. Add storage/state layer.
4. Implement agent functions.
5. Implement orchestrator.
6. Build pipeline UI.
7. Build lead detail and shared memory UI.
8. Build onboarding/profile editor.
9. Build sales chat.
10. Add metrics dashboard.
11. Run local verification and fix obvious UI/state bugs.

## README Requirements

Add a short README with:

- app purpose
- stack
- setup command
- run command
- what is mocked
- demo flow

## Demo Script

Use this flow during judging:

1. Open the app and show the SaaS profile.
2. Open the pipeline with seeded leads.
3. Run Lead Discovery or show generated leads.
4. Run qualification and show scoring reasons.
5. Run outreach and show personalized message.
6. Share demo and booking link.
7. Open Sales Agent chat and ask:
   - `What pricing plans do you offer?`
   - `Can you integrate with our CRM?`
   - `Can we get a discount?`
8. Run negotiation and show discount rules are respected.
9. Close the lead as won and show checkout link.
10. Open metrics and show conversion updates.

## Build Guidance

Favor a polished vertical slice over a broad unfinished system. Every button in the main demo path should do something visible. Mocked AI is acceptable if it feels coherent and writes useful structured memory.

Keep code simple and readable. Avoid adding infrastructure that does not help the hackathon demo.
