/**
 * sales.ts — Rule-based sales chat agent.
 *
 * Handles prospect messages by matching keywords to response categories:
 * pricing, integrations, demo, discount, trial, security, objections,
 * buying intent, and a default discovery fallback.
 */

import type { Lead, CompanyProfile, AgentActionResult } from '../types';

/* ── Keyword → response rules ────────────────────────────── */

interface Rule {
  keywords: string[];
  respond: (lead: Lead, profile: CompanyProfile) => string;
}

const RULES: Rule[] = [
  {
    keywords: ['pricing', 'cost', 'price', 'how much', 'plan', 'plans'],
    respond: (_lead, profile) =>
      `Great question! Here's our pricing breakdown:\n\n${profile.pricingDetails}\n\nMost teams your size start with the Growth plan. Would you like a custom quote?`,
  },
  {
    keywords: ['integration', 'crm', 'api', 'integrate', 'salesforce', 'hubspot', 'zapier'],
    respond: () =>
      `We integrate with all major CRMs — Salesforce, HubSpot, Pipedrive — plus Slack and Zapier for custom workflows. Our REST API is fully documented so your team can build bespoke integrations too. Want me to send over the API docs?`,
  },
  {
    keywords: ['demo', 'see', 'show', 'watch', 'look'],
    respond: (_lead, profile) =>
      `Absolutely! Here's a 2-minute product overview you can watch right now:\n🎬 ${profile.demoVideoUrl}\n\nOr if you'd prefer a live walkthrough, grab a time here:\n📅 ${profile.bookingCalendarUrl}`,
  },
  {
    keywords: ['discount', 'cheaper', 'deal', 'lower price', 'negotiate', 'budget'],
    respond: (_lead, profile) => {
      const rules = profile.negotiationRules;
      return `I understand budget matters! Here are some options:\n• We can offer up to ${rules.maxDiscountPercent}% off for the right fit\n• Annual contracts come with a ${rules.annualContractDiscountPercent}% discount\n• We also offer a ${rules.allowedTrialDays}-day free trial so you can validate ROI before committing\n\nWant me to put together a custom proposal?`;
    },
  },
  {
    keywords: ['trial', 'try', 'test', 'free', 'pilot'],
    respond: (_lead, profile) =>
      `We'd love for you to experience the product firsthand! We offer a ${profile.negotiationRules.allowedTrialDays}-day free trial with full access — no credit card required. Shall I set that up for you?`,
  },
  {
    keywords: ['security', 'compliance', 'gdpr', 'soc', 'hipaa', 'encryption', 'safe'],
    respond: () =>
      `Security is a top priority for us:\n• SOC 2 Type II certified\n• GDPR compliant with EU data residency options\n• All data encrypted at rest (AES-256) and in transit (TLS 1.3)\n• SSO via SAML/OIDC on Enterprise plans\n• Annual third-party penetration testing\n\nHappy to schedule a call with our security team if you need more details.`,
  },
  {
    keywords: ['not interested', 'no thanks', 'pass', 'not for us', 'not a fit'],
    respond: (lead) =>
      `Totally understand, ${lead.contactName.split(' ')[0]}. Appreciate you taking the time to chat. If anything changes or you'd like to revisit in the future, feel free to reach out. Wishing ${lead.companyName} all the best! 🙏`,
  },
  {
    keywords: ['buy', 'purchase', 'sign up', 'ready', 'move forward', 'let\'s do it', 'onboard'],
    respond: (lead) =>
      `That's great to hear, ${lead.contactName.split(' ')[0]}! 🎉 Let me prepare a summary of terms and next steps. We'll move into the contract phase where I'll outline pricing, trial terms, and get you set up. Moving to negotiation now!`,
  },
];

/* ── Default discovery response ──────────────────────────── */

function defaultResponse(lead: Lead): string {
  const firstName = lead.contactName.split(' ')[0];
  const questions = [
    `${firstName}, I'd love to learn more about your current sales process. How does your team typically handle product demos today?`,
    `Thanks for sharing that, ${firstName}. What's the biggest bottleneck in your current demo workflow?`,
    `Interesting! How many demos does your team typically run per week, ${firstName}?`,
    `That's helpful context. Who else on your team would be involved in evaluating a tool like this?`,
    `Got it. What would an ideal solution look like for ${lead.companyName}?`,
  ];
  // Pick based on conversation length to cycle through questions
  const idx = lead.memory.conversationHistory.length % questions.length;
  return questions[idx];
}

/* ── Public API ──────────────────────────────────────────── */

export function handleProspectMessage(
  lead: Lead,
  profile: CompanyProfile,
  message: string,
): AgentActionResult {
  const updated: Lead = JSON.parse(JSON.stringify(lead));
  const now = new Date().toISOString();
  const lowerMessage = message.toLowerCase();

  // Record the prospect's message
  updated.memory.conversationHistory.push({
    role: 'prospect',
    message,
    createdAt: now,
  });

  // Find matching rule
  let agentResponse: string | null = null;
  let shouldMoveToNegotiation = false;

  for (const rule of RULES) {
    if (rule.keywords.some((kw) => lowerMessage.includes(kw))) {
      agentResponse = rule.respond(updated, profile);

      // Check if this is a buying signal → trigger negotiation transition
      if (
        rule.keywords.includes('buy') &&
        ['buy', 'purchase', 'sign up', 'ready', 'move forward', 'onboard'].some((kw) =>
          lowerMessage.includes(kw),
        )
      ) {
        shouldMoveToNegotiation = true;
      }

      break;
    }
  }

  // Fallback to discovery question
  if (!agentResponse) {
    agentResponse = defaultResponse(updated);
  }

  // Record the agent's response
  updated.memory.conversationHistory.push({
    role: 'agent',
    message: agentResponse,
    createdAt: new Date().toISOString(),
  });

  // Update status
  if (shouldMoveToNegotiation) {
    updated.status = 'NEGOTIATION';
    updated.memory.negotiation = {
      notes: ['Prospect expressed buying intent. Moved to negotiation.'],
    };
  } else if (
    updated.status !== 'SALES_CONVERSATION' &&
    updated.status !== 'NEGOTIATION' &&
    updated.status !== 'CLOSED_WON' &&
    updated.status !== 'CLOSED_LOST'
  ) {
    updated.status = 'SALES_CONVERSATION';
  }

  updated.updatedAt = new Date().toISOString();

  const description = shouldMoveToNegotiation
    ? `🤝 Buying signal detected — moved ${updated.contactName} to Negotiation`
    : `💬 Responded to ${updated.contactName}: "${agentResponse.slice(0, 80)}…"`;

  return { lead: updated, description };
}
