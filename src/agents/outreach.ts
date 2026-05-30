/**
 * outreach.ts — Generates personalized outbound email messages.
 *
 * Uses lead's company info, title, and pain points along with the
 * company profile's product description to craft a tailored email.
 */

import type { Lead, CompanyProfile, AgentActionResult } from '../types';

/* ── Email templates ─────────────────────────────────────── */

const SUBJECT_LINES = [
  (lead: Lead) => `${lead.contactName}, quick question about your demo process`,
  (lead: Lead) => `Idea for ${lead.companyName}'s sales demos`,
  (lead: Lead) => `${lead.companyName} + DemoFlow — a good fit?`,
  (lead: Lead) => `Cutting demo prep time at ${lead.companyName}`,
];

function buildEmailBody(lead: Lead, profile: CompanyProfile): string {
  const firstName = lead.contactName.split(' ')[0];
  const score = lead.score;

  // Tailor the hook based on qualification score
  let hook: string;
  if (score >= 80) {
    hook = `I noticed ${lead.companyName} is scaling rapidly in the ${lead.industry} space — congrats! Companies at your stage often hit a wall with demo personalization.`;
  } else if (score >= 65) {
    hook = `I came across ${lead.companyName} and thought there might be a fit. As ${lead.contactTitle}, you're likely looking for ways to accelerate your sales cycle.`;
  } else {
    hook = `I wanted to reach out because ${lead.companyName} caught my eye. I work with ${lead.industry} companies looking to modernize their sales demo experience.`;
  }

  return `Hi ${firstName},

${hook}

${profile.name} helps B2B teams like yours ${profile.productDescription.toLowerCase().slice(0, 120)}.

A few things our customers love:
• Create personalized demos in under 5 minutes (no engineering needed)
• Track exactly which features each prospect engages with
• Cut demo-to-close time by 40% on average

Would it make sense to set up a 15-minute call this week? I'd love to show you a quick example tailored to ${lead.companyName}.

Best,
The ${profile.name} Team

P.S. You can also watch a 2-minute overview here: ${profile.demoVideoUrl}`;
}

/* ── Public API ──────────────────────────────────────────── */

export function generateOutreach(lead: Lead, profile: CompanyProfile): AgentActionResult {
  const updated: Lead = JSON.parse(JSON.stringify(lead));

  const subjectFn = SUBJECT_LINES[Math.floor(Math.random() * SUBJECT_LINES.length)];
  const subject = subjectFn(updated);
  const body = buildEmailBody(updated, profile);
  const fullMessage = `Subject: ${subject}\n\n${body}`;

  updated.memory.outreachHistory.push({
    channel: 'email',
    message: fullMessage,
    sentAt: new Date().toISOString(),
  });

  updated.status = 'CONTACTED';
  updated.updatedAt = new Date().toISOString();

  const description = `📧 Personalized email sent to ${updated.contactName} — "${subject}"`;
  return { lead: updated, description };
}
