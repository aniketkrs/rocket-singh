/**
 * closing.ts — Closes deals as WON or LOST.
 *
 * WON: Attaches payment URL, generates onboarding instructions,
 *      and records the closing result.
 * LOST: Captures the loss reason for pipeline analytics.
 */

import type { Lead, CompanyProfile, AgentActionResult } from '../types';

/* ── Public API ──────────────────────────────────────────── */

export function closeDeal(
  lead: Lead,
  profile: CompanyProfile,
  outcome: 'WON' | 'LOST',
  reason?: string,
): AgentActionResult {
  const updated: Lead = JSON.parse(JSON.stringify(lead));
  const now = new Date().toISOString();

  if (outcome === 'WON') {
    // Build closing result with payment link
    updated.memory.closing = {
      outcome: 'WON',
      paymentUrl: profile.paymentUrl,
      closedAt: now,
    };

    // Calculate final pricing details
    const discount = updated.memory.negotiation?.approvedDiscountPercent ?? 0;
    const trialDays = updated.memory.negotiation?.trialDays ?? profile.negotiationRules.allowedTrialDays;

    // Append onboarding instructions to sales notes
    updated.memory.salesNotes.push(
      `🎉 DEAL WON — ${updated.companyName}`,
      `Closed at: ${now}`,
      discount > 0 ? `Approved discount: ${discount}%` : 'No discount applied',
      `Trial period: ${trialDays} days`,
      '',
      '── Onboarding Next Steps ──',
      `1. Complete payment via: ${profile.paymentUrl}`,
      `2. Schedule onboarding kickoff: ${profile.bookingCalendarUrl}`,
      '3. Admin account will be provisioned within 24 hours',
      '4. Dedicated CSM will reach out within 48 hours',
      '5. Access full documentation at docs.demoflow.ai',
      '',
      `Welcome aboard, ${updated.contactName.split(' ')[0]}! 🚀`,
    );

    // Add a system message to conversation history
    updated.memory.conversationHistory.push({
      role: 'system',
      message: `Deal closed as WON. Payment link sent: ${profile.paymentUrl}`,
      createdAt: now,
    });

    updated.status = 'CLOSED_WON';
    updated.updatedAt = now;

    return {
      lead: updated,
      description: `🏆 Deal WON with ${updated.companyName}! Payment link sent and onboarding instructions generated.`,
    };
  }

  // ── LOST ──────────────────────────────────────────────
  const lossReason = reason || 'No reason provided';

  updated.memory.closing = {
    outcome: 'LOST',
    reason: lossReason,
    closedAt: now,
  };

  updated.memory.salesNotes.push(
    `❌ DEAL LOST — ${updated.companyName}`,
    `Closed at: ${now}`,
    `Reason: ${lossReason}`,
  );

  updated.memory.conversationHistory.push({
    role: 'system',
    message: `Deal closed as LOST. Reason: ${lossReason}`,
    createdAt: now,
  });

  updated.status = 'CLOSED_LOST';
  updated.updatedAt = now;

  return {
    lead: updated,
    description: `❌ Deal LOST with ${updated.companyName} — ${lossReason}`,
  };
}
