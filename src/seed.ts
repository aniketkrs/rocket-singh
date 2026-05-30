/**
 * seed.ts — Default company profile and seed leads for Rocket Singh.
 *
 * Provides a fully-configured DemoFlow AI profile and 6 realistic leads:
 *   • 3 good-fit (SaaS, right size, decision-maker titles)
 *   • 2 marginal  (edge-case industry / size)
 *   • 1 bad-fit   (wrong industry, low score)
 */

import type { CompanyProfile, Lead } from './types';

/* ── Default Company Profile ─────────────────────────────── */

export const defaultCompanyProfile: CompanyProfile = {
  id: 'cp-demoflow-001',
  name: 'DemoFlow AI',
  website: 'https://demoflow.ai',
  productDescription:
    'AI demo automation for B2B SaaS — generate interactive product demos in minutes, personalize them per prospect, and track engagement in real time.',
  pricingDetails:
    'Starter $99/mo (up to 10 demos), Growth $299/mo (unlimited demos + analytics), Enterprise custom (SSO, dedicated CSM, SLA).',
  demoVideoUrl: 'https://demo.demoflow.ai/watch',
  bookingCalendarUrl: 'https://cal.demoflow.ai/demo',
  paymentUrl: 'https://pay.demoflow.ai/checkout',
  idealCustomerProfile:
    'B2B SaaS companies with 10-200 employees that rely on product demos to sell. Ideal verticals: DevTools, MarTech, FinTech, HRTech. Buyers are typically VP Sales, Head of Growth, or CRO.',
  negotiationRules: {
    maxDiscountPercent: 20,
    allowedTrialDays: 14,
    annualContractDiscountPercent: 25,
  },
};

/* ── Seed Leads ──────────────────────────────────────────── */

const now = new Date().toISOString();

export const seedLeads: Lead[] = [
  /* ── Good Fit #1 ─────────────────────────────────────── */
  {
    id: 'lead-a1b2c3d4-1001',
    companyName: 'CloudMetrics',
    website: 'https://cloudmetrics.io',
    industry: 'DevTools / SaaS',
    companySize: '45 employees',
    contactName: 'Priya Sharma',
    contactTitle: 'VP of Sales',
    contactEmail: 'priya@cloudmetrics.io',
    status: 'NEW_LEAD',
    score: 0,
    memory: {
      companyInfo:
        'CloudMetrics provides real-time observability dashboards for cloud-native teams. Series A funded, growing 3× YoY. Heavy demo-driven sales motion with a 6-person AE team.',
      contactDetails:
        'Priya Sharma, VP of Sales — 8 years in SaaS sales leadership. Previously at Datadog. Active on LinkedIn, frequent speaker at SaaStr events.',
      outreachHistory: [],
      demoActivity: [],
      conversationHistory: [],
      salesNotes: [],
    },
    createdAt: now,
    updatedAt: now,
  },

  /* ── Good Fit #2 ─────────────────────────────────────── */
  {
    id: 'lead-a1b2c3d4-1002',
    companyName: 'TalentPulse',
    website: 'https://talentpulse.com',
    industry: 'HRTech / SaaS',
    companySize: '120 employees',
    contactName: 'Marcus Chen',
    contactTitle: 'Head of Growth',
    contactEmail: 'marcus@talentpulse.com',
    status: 'NEW_LEAD',
    score: 0,
    memory: {
      companyInfo:
        'TalentPulse is an AI-powered talent assessment platform for mid-market companies. Series B, $28M raised. Sells through consultative demos — current demo creation takes 2+ hours per prospect.',
      contactDetails:
        'Marcus Chen, Head of Growth — Previously led demand gen at Greenhouse. Manages a team of 12 SDRs + 4 AEs. Has publicly discussed demo bottlenecks on his podcast.',
      outreachHistory: [],
      demoActivity: [],
      conversationHistory: [],
      salesNotes: [],
    },
    createdAt: now,
    updatedAt: now,
  },

  /* ── Good Fit #3 ─────────────────────────────────────── */
  {
    id: 'lead-a1b2c3d4-1003',
    companyName: 'PayStack Pro',
    website: 'https://paystackpro.io',
    industry: 'FinTech / SaaS',
    companySize: '75 employees',
    contactName: 'Aisha Okafor',
    contactTitle: 'Chief Revenue Officer',
    contactEmail: 'aisha@paystackpro.io',
    status: 'NEW_LEAD',
    score: 0,
    memory: {
      companyInfo:
        'PayStack Pro offers embedded payment infrastructure APIs for African fintechs. Series A, expanding into Europe. Complex product requires tailored demos for each geography and integration path.',
      contactDetails:
        'Aisha Okafor, CRO — 12 years in fintech sales. Built the GTM team from 0 → 30 at her previous startup. Needs to scale demo capacity across 3 continents without adding headcount.',
      outreachHistory: [],
      demoActivity: [],
      conversationHistory: [],
      salesNotes: [],
    },
    createdAt: now,
    updatedAt: now,
  },

  /* ── Marginal Fit #1 ─────────────────────────────────── */
  {
    id: 'lead-a1b2c3d4-2001',
    companyName: 'BrightBoard Education',
    website: 'https://brightboard.edu',
    industry: 'EdTech / SaaS',
    companySize: '200 employees',
    contactName: 'Tom Lindgren',
    contactTitle: 'Director of Partnerships',
    contactEmail: 'tom@brightboard.edu',
    status: 'NEW_LEAD',
    score: 0,
    memory: {
      companyInfo:
        'BrightBoard builds LMS software for K-12 school districts. Strong recurring revenue but longer sales cycles (6-9 months). Uses live webinars for demos — some automation interest but limited budget.',
      contactDetails:
        'Tom Lindgren, Director of Partnerships — Manages channel partner relationships. Not a direct sales leader but influences tooling decisions. Has been evaluating demo tools internally.',
      outreachHistory: [],
      demoActivity: [],
      conversationHistory: [],
      salesNotes: [],
    },
    createdAt: now,
    updatedAt: now,
  },

  /* ── Marginal Fit #2 ─────────────────────────────────── */
  {
    id: 'lead-a1b2c3d4-2002',
    companyName: 'NanoBot Robotics',
    website: 'https://nanobotrobotics.com',
    industry: 'Hardware / IoT',
    companySize: '8 employees',
    contactName: 'Kenji Tanaka',
    contactTitle: 'CEO & Founder',
    contactEmail: 'kenji@nanobotrobotics.com',
    status: 'NEW_LEAD',
    score: 0,
    memory: {
      companyInfo:
        'NanoBot Robotics develops miniature inspection robots for industrial pipes. Pre-Series A startup. Physical product requires in-person demos, but they have a cloud dashboard component that could use interactive demos.',
      contactDetails:
        'Kenji Tanaka, CEO & Founder — Technical founder, making all buying decisions. Very price-sensitive at current stage. Interested in the Growth plan if ROI is clear.',
      outreachHistory: [],
      demoActivity: [],
      conversationHistory: [],
      salesNotes: [],
    },
    createdAt: now,
    updatedAt: now,
  },

  /* ── Bad Fit #1 ──────────────────────────────────────── */
  {
    id: 'lead-a1b2c3d4-3001',
    companyName: 'MegaMart Retail',
    website: 'https://megamartretail.com',
    industry: 'Retail / Brick-and-Mortar',
    companySize: '2500 employees',
    contactName: 'Diane Foster',
    contactTitle: 'Store Operations Manager',
    contactEmail: 'diane.foster@megamart.com',
    status: 'NEW_LEAD',
    score: 0,
    memory: {
      companyInfo:
        'MegaMart is a regional big-box retail chain with 40 stores across the Midwest. No software product, no demo-driven sales process. IT spend is focused on POS and inventory systems.',
      contactDetails:
        'Diane Foster, Store Operations Manager — Manages day-to-day logistics for 12 stores. No involvement in software purchasing. Filled out a web form by mistake while looking for POS demo software.',
      outreachHistory: [],
      demoActivity: [],
      conversationHistory: [],
      salesNotes: [],
    },
    createdAt: now,
    updatedAt: now,
  },
];
