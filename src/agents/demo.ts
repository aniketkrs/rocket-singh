/**
 * demo.ts — Shares demo assets and booking links with the lead.
 *
 * Attaches the demo video URL and booking calendar URL from the
 * company profile to the lead's demoActivity log.
 */

import type { Lead, CompanyProfile, AgentActionResult } from '../types';

/* ── Public API ──────────────────────────────────────────── */

export function shareDemo(lead: Lead, profile: CompanyProfile): AgentActionResult {
  const updated: Lead = JSON.parse(JSON.stringify(lead));
  const now = new Date().toISOString();

  // Add demo video asset
  updated.memory.demoActivity.push({
    assetUrl: profile.demoVideoUrl,
    bookingUrl: profile.bookingCalendarUrl,
    sentAt: now,
  });

  // Add a follow-up outreach entry for tracking
  updated.memory.outreachHistory.push({
    channel: 'demo',
    message: `Demo video shared: ${profile.demoVideoUrl}\nBooking link: ${profile.bookingCalendarUrl}\n\nHi ${updated.contactName.split(' ')[0]}, thanks for your interest! I've attached a personalized demo walkthrough of ${profile.name} for ${updated.companyName}. You can book a live session at your convenience using the link above.`,
    sentAt: now,
  });

  updated.status = 'DEMO_SHARED';
  updated.updatedAt = now;

  const description = `🎬 Demo video & booking link shared with ${updated.contactName} at ${updated.companyName}`;
  return { lead: updated, description };
}
