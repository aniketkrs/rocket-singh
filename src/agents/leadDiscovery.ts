/**
 * leadDiscovery.ts — Generates realistic leads from the company's ICP.
 *
 * Randomizes from curated pools of company names, industries, titles,
 * sizes, and pain points to produce believable prospect profiles.
 */

import type { CompanyProfile, Lead } from '../types';

/* ── Data pools for randomization ────────────────────────── */

const COMPANY_POOLS = [
  { name: 'Velocity CRM', website: 'https://velocitycrm.io', industry: 'MarTech / SaaS' },
  { name: 'ShipFast', website: 'https://shipfast.dev', industry: 'DevTools / SaaS' },
  { name: 'InsureFlow', website: 'https://insureflow.com', industry: 'InsurTech / SaaS' },
  { name: 'RecruitBot', website: 'https://recruitbot.ai', industry: 'HRTech / SaaS' },
  { name: 'LedgerSync', website: 'https://ledgersync.io', industry: 'FinTech / SaaS' },
  { name: 'Fieldworks', website: 'https://fieldworks.app', industry: 'Construction Tech / SaaS' },
  { name: 'HealthDash', website: 'https://healthdash.io', industry: 'HealthTech / SaaS' },
  { name: 'AdVantage AI', website: 'https://advantageai.co', industry: 'AdTech / SaaS' },
  { name: 'ContractOwl', website: 'https://contractowl.com', industry: 'LegalTech / SaaS' },
  { name: 'LogiTrack', website: 'https://logitrack.io', industry: 'Logistics / SaaS' },
  { name: 'Questify', website: 'https://questify.io', industry: 'EdTech / SaaS' },
  { name: 'PropView', website: 'https://propview.co', industry: 'PropTech / SaaS' },
  { name: 'SecureOps', website: 'https://secureops.dev', industry: 'CyberSecurity / SaaS' },
  { name: 'DataHive', website: 'https://datahive.ai', industry: 'Data Analytics / SaaS' },
  { name: 'GreenFleet', website: 'https://greenfleet.co', industry: 'CleanTech / SaaS' },
  { name: 'PixelForge', website: 'https://pixelforge.design', industry: 'DesignTech / SaaS' },
  { name: 'MealPlan Pro', website: 'https://mealplanpro.com', industry: 'FoodTech / SaaS' },
  { name: 'RetailEdge', website: 'https://retailedge.com', industry: 'Retail / E-commerce' },
  { name: 'FarmSense', website: 'https://farmsense.ag', industry: 'AgTech / Hardware' },
  { name: 'BrickWorks Ltd', website: 'https://brickworks.co', industry: 'Manufacturing' },
];

const FIRST_NAMES = [
  'Sarah', 'James', 'Ananya', 'Carlos', 'Mei', 'Oliver', 'Fatima', 'Raj',
  'Elena', 'David', 'Yuki', 'Mohammed', 'Lisa', 'Wei', 'Amara', 'Viktor',
];

const LAST_NAMES = [
  'Johnson', 'Patel', 'Kim', 'Santos', 'Müller', 'Nguyen', 'Okafor', 'Larsson',
  'Garcia', 'Ito', 'Williams', 'Sharma', 'Chen', 'Brown', 'Davis', 'Lee',
];

const TITLES = [
  'VP of Sales',
  'Head of Growth',
  'Chief Revenue Officer',
  'Director of Sales',
  'Sales Operations Manager',
  'Head of Sales Enablement',
  'CEO',
  'Co-Founder & CRO',
  'Director of Business Development',
  'VP of Marketing',
];

const COMPANY_SIZES = [
  '12 employees', '25 employees', '40 employees', '65 employees',
  '90 employees', '130 employees', '180 employees', '250 employees',
  '500 employees', '15 employees',
];

const PAIN_POINTS = [
  'spends 3+ hours building each custom demo',
  'losing deals because demos feel generic',
  'needs to scale demo creation without hiring more SEs',
  'prospects drop off before the live demo call',
  'wants to track which demo sections prospects actually watch',
  'demo environment keeps breaking during live calls',
  'looking to reduce time-to-first-value for new prospects',
  'sales cycle is too long due to demo scheduling bottlenecks',
];

const COMPANY_INFO_TEMPLATES = [
  (c: { name: string; industry: string; size: string; pain: string }) =>
    `${c.name} is a ${c.industry} company with ${c.size}. They ${c.pain}. Currently evaluating solutions to improve their sales demo workflow.`,
  (c: { name: string; industry: string; size: string; pain: string }) =>
    `${c.name} operates in the ${c.industry} space (${c.size}). Key challenge: ${c.pain}. Active in the market for demo tooling improvements.`,
  (c: { name: string; industry: string; size: string; pain: string }) =>
    `A ${c.industry} startup, ${c.name} has ${c.size} and ${c.pain}. Their growth team is exploring demo automation to accelerate pipeline velocity.`,
];

/* ── Helpers ──────────────────────────────────────────────── */

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/* ── Public API ──────────────────────────────────────────── */

/**
 * Generate a single realistic lead based on the company's ICP.
 */
export function generateLead(profile: CompanyProfile): Lead {
  const company = pick(COMPANY_POOLS);
  const firstName = pick(FIRST_NAMES);
  const lastName = pick(LAST_NAMES);
  const title = pick(TITLES);
  const size = pick(COMPANY_SIZES);
  const pain = pick(PAIN_POINTS);
  const infoTemplate = pick(COMPANY_INFO_TEMPLATES);

  const contactEmail = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${company.website.replace('https://', '')}`;
  const now = new Date().toISOString();

  // Reference the profile to make the generation ICP-aware
  const companyInfo = infoTemplate({
    name: company.name,
    industry: company.industry,
    size,
    pain,
  });

  const contactDetails = `${firstName} ${lastName}, ${title} at ${company.name}. Discovered via ICP match against "${profile.idealCustomerProfile.slice(0, 60)}…".`;

  return {
    id: crypto.randomUUID(),
    companyName: company.name,
    website: company.website,
    industry: company.industry,
    companySize: size,
    contactName: `${firstName} ${lastName}`,
    contactTitle: title,
    contactEmail,
    status: 'NEW_LEAD',
    score: 0,
    memory: {
      companyInfo,
      contactDetails,
      outreachHistory: [],
      demoActivity: [],
      conversationHistory: [],
      salesNotes: [],
    },
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * Generate multiple leads at once.
 */
export function generateLeads(profile: CompanyProfile, count: number): Lead[] {
  return Array.from({ length: count }, () => generateLead(profile));
}
