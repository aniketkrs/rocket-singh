/**
 * orchestrator.ts — Routes leads to the correct agent based on status.
 *
 * Status → Agent mapping:
 *   NEW_LEAD            → qualification
 *   QUALIFIED           → outreach
 *   CONTACTED           → demo
 *   DEMO_SHARED         → sales (injects system greeting)
 *   SALES_CONVERSATION  → null (manual chat required)
 *   NEGOTIATION         → closing (WON by default — caller can override)
 *   CLOSED_WON          → null
 *   CLOSED_LOST         → null
 */

import type { Lead, CompanyProfile, AgentType, AgentActionResult } from '../types';
import { qualifyLead } from './qualification';
import { generateOutreach } from './outreach';
import { shareDemo } from './demo';
import { handleProspectMessage } from './sales';
import { closeDeal } from './closing';

/* ── Public API ──────────────────────────────────────────── */

/**
 * Determine which agent should handle this lead next.
 * Returns null when manual intervention is needed or the lead is terminal.
 */
export function getNextAction(lead: Lead): AgentType | null {
  switch (lead.status) {
    case 'NEW_LEAD':
      return 'qualification';
    case 'QUALIFIED':
      return 'outreach';
    case 'CONTACTED':
      return 'demo';
    case 'DEMO_SHARED':
      return 'sales';
    case 'SALES_CONVERSATION':
      return null; // Manual chat — user drives the conversation
    case 'NEGOTIATION':
      return 'closing';
    case 'CLOSED_WON':
    case 'CLOSED_LOST':
      return null; // Terminal states
    default:
      return null;
  }
}

/**
 * Run the next appropriate agent action for a lead.
 * Returns null if no automatic action is available.
 */
export function runNextAction(
  lead: Lead,
  profile: CompanyProfile,
): AgentActionResult | null {
  const nextAgent = getNextAction(lead);
  if (!nextAgent) return null;

  switch (nextAgent) {
    case 'qualification':
      return qualifyLead(lead, profile);

    case 'outreach':
      return generateOutreach(lead, profile);

    case 'demo':
      return shareDemo(lead, profile);

    case 'sales': {
      // Inject a system message to kick off the conversation
      const updated: Lead = JSON.parse(JSON.stringify(lead));
      updated.status = 'SALES_CONVERSATION';
      updated.updatedAt = new Date().toISOString();

      updated.memory.conversationHistory.push({
        role: 'system',
        message: `Sales conversation started with ${updated.contactName} from ${updated.companyName}. Demo was shared — awaiting prospect response.`,
        createdAt: new Date().toISOString(),
      });

      // Add an initial agent greeting
      const firstName = updated.contactName.split(' ')[0];
      updated.memory.conversationHistory.push({
        role: 'agent',
        message: `Hi ${firstName}! 👋 Thanks for checking out our demo. I'd love to hear what stood out to you and answer any questions about how ${profile.name} could help ${updated.companyName}. What's on your mind?`,
        createdAt: new Date().toISOString(),
      });

      return {
        lead: updated,
        description: `💬 Sales conversation started with ${updated.contactName} — awaiting prospect reply`,
      };
    }

    case 'closing':
      // Default to WON — the UI can override with closeLead()
      return closeDeal(lead, profile, 'WON');

    // Discovery is not triggered automatically via orchestrator
    // (it generates new leads, not processes existing ones)
    default:
      return null;
  }
}
