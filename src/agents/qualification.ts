/**
 * qualification.ts — Scores leads 0-100 against the company's ICP.
 *
 * Scoring breakdown:
 *   +30  ICP industry match
 *   +25  Company size fit (10-200 employees)
 *   +25  Decision-maker title
 *   +20  Pain-point / product fit
 *
 * Qualified threshold: 65
 */

import type { Lead, CompanyProfile, AgentActionResult } from '../types';

/* ── Scoring helpers ─────────────────────────────────────── */

const GOOD_INDUSTRIES = [
  'saas', 'devtools', 'martech', 'fintech', 'hrtech',
  'adtech', 'healthtech', 'legaltech', 'cybersecurity',
  'data analytics', 'insurtech', 'proptech',
];

const DECISION_MAKER_TITLES = [
  'vp of sales', 'head of growth', 'chief revenue officer', 'cro',
  'director of sales', 'head of sales', 'ceo', 'co-founder',
  'vp of marketing', 'head of sales enablement', 'director of business development',
];

const DEMO_KEYWORDS = [
  'demo', 'demos', 'demonstration', 'showcase', 'interactive',
  'product tour', 'walkthrough', 'presentation', 'sales cycle',
  'prospect', 'pipeline',
];

function scoreIndustryMatch(lead: Lead): { score: number; reason: string } {
  const industry = lead.industry.toLowerCase();
  const isMatch = GOOD_INDUSTRIES.some((g) => industry.includes(g));

  if (isMatch) return { score: 30, reason: `Industry "${lead.industry}" matches ICP verticals` };
  if (industry.includes('edtech') || industry.includes('construction'))
    return { score: 15, reason: `Industry "${lead.industry}" is a partial ICP match` };
  return { score: 0, reason: `Industry "${lead.industry}" does not match ICP` };
}

function scoreSizeFit(lead: Lead): { score: number; reason: string } {
  const sizeMatch = lead.companySize.match(/(\d+)/);
  if (!sizeMatch) return { score: 5, reason: 'Company size unknown — minimal score' };

  const count = parseInt(sizeMatch[1], 10);
  if (count >= 10 && count <= 200)
    return { score: 25, reason: `Company size (${count}) is within ICP range of 10-200` };
  if (count < 10)
    return { score: 8, reason: `Company size (${count}) is below ICP minimum of 10` };
  if (count <= 500)
    return { score: 15, reason: `Company size (${count}) is above ICP range but still reachable` };
  return { score: 3, reason: `Company size (${count}) is far above ICP range — likely enterprise` };
}

function scoreTitleFit(lead: Lead): { score: number; reason: string } {
  const title = lead.contactTitle.toLowerCase();
  const isDecisionMaker = DECISION_MAKER_TITLES.some((t) => title.includes(t));

  if (isDecisionMaker)
    return { score: 25, reason: `"${lead.contactTitle}" is a key decision-maker title` };
  if (title.includes('manager') || title.includes('director'))
    return { score: 15, reason: `"${lead.contactTitle}" has some buying influence` };
  return { score: 5, reason: `"${lead.contactTitle}" may not be a buying decision-maker` };
}

function scorePainPointFit(lead: Lead): { score: number; reason: string } {
  const blob = `${lead.memory.companyInfo} ${lead.memory.contactDetails}`.toLowerCase();
  const hitCount = DEMO_KEYWORDS.filter((kw) => blob.includes(kw)).length;

  if (hitCount >= 3)
    return { score: 20, reason: `Strong pain-point alignment — ${hitCount} demo-related signals found` };
  if (hitCount >= 1)
    return { score: 12, reason: `Moderate pain-point alignment — ${hitCount} demo-related signal(s)` };
  return { score: 3, reason: 'No clear demo-related pain points detected' };
}

/* ── Public API ──────────────────────────────────────────── */

const QUALIFICATION_THRESHOLD = 65;

export function qualifyLead(lead: Lead, _profile: CompanyProfile): AgentActionResult {
  // Deep copy to avoid mutating caller's object
  const updated: Lead = JSON.parse(JSON.stringify(lead));

  const industry = scoreIndustryMatch(updated);
  const size = scoreSizeFit(updated);
  const title = scoreTitleFit(updated);
  const painPoint = scorePainPointFit(updated);

  const totalScore = industry.score + size.score + title.score + painPoint.score;
  const reasons = [industry.reason, size.reason, title.reason, painPoint.reason];
  const qualified = totalScore >= QUALIFICATION_THRESHOLD;

  updated.score = totalScore;
  updated.status = qualified ? 'QUALIFIED' : 'CLOSED_LOST';
  updated.memory.qualificationResult = {
    outcome: qualified ? 'QUALIFIED' : 'DISQUALIFIED',
    score: totalScore,
    reasons,
  };
  updated.updatedAt = new Date().toISOString();

  if (!qualified) {
    updated.memory.salesNotes.push(
      `Disqualified with score ${totalScore}/100 (threshold ${QUALIFICATION_THRESHOLD}).`,
    );
  }

  const description = qualified
    ? `✅ Qualified with score ${totalScore}/100 — ${reasons[0]}`
    : `❌ Disqualified with score ${totalScore}/100 — ${reasons[0]}`;

  return { lead: updated, description };
}
