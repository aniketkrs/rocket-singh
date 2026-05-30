/* ── Lead statuses ───────────────────────────────────────── */

export type LeadStatus =
  | 'NEW_LEAD'
  | 'QUALIFIED'
  | 'CONTACTED'
  | 'DEMO_SHARED'
  | 'SALES_CONVERSATION'
  | 'NEGOTIATION'
  | 'CLOSED_WON'
  | 'CLOSED_LOST';

export type AgentType =
  | 'discovery'
  | 'qualification'
  | 'outreach'
  | 'demo'
  | 'sales'
  | 'closing';

export type ViewType = 'pipeline' | 'onboarding' | 'console' | 'metrics';

/* ── Company profile ────────────────────────────────────── */

export interface NegotiationRules {
  maxDiscountPercent: number;
  allowedTrialDays: number;
  annualContractDiscountPercent: number;
}

export interface CompanyProfile {
  id: string;
  name: string;
  website: string;
  productDescription: string;
  pricingDetails: string;
  demoVideoUrl: string;
  bookingCalendarUrl: string;
  paymentUrl: string;
  idealCustomerProfile: string;
  negotiationRules: NegotiationRules;
}

/* ── Lead memory sub-types ──────────────────────────────── */

export interface QualificationResult {
  outcome: 'QUALIFIED' | 'DISQUALIFIED';
  score: number;
  reasons: string[];
}

export interface OutreachEntry {
  channel: 'email' | 'linkedin' | 'demo';
  message: string;
  sentAt: string;
}

export interface DemoActivity {
  assetUrl: string;
  bookingUrl: string;
  sentAt: string;
}

export interface ConversationMessage {
  role: 'prospect' | 'agent' | 'system';
  message: string;
  createdAt: string;
}

export interface NegotiationState {
  requestedDiscountPercent?: number;
  approvedDiscountPercent?: number;
  trialDays?: number;
  notes: string[];
}

export interface ClosingResult {
  outcome: 'WON' | 'LOST';
  paymentUrl?: string;
  reason?: string;
  closedAt: string;
}

export interface LeadMemory {
  companyInfo: string;
  contactDetails: string;
  qualificationResult?: QualificationResult;
  outreachHistory: OutreachEntry[];
  demoActivity: DemoActivity[];
  conversationHistory: ConversationMessage[];
  salesNotes: string[];
  negotiation?: NegotiationState;
  closing?: ClosingResult;
}

/* ── Lead ───────────────────────────────────────────────── */

export interface Lead {
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
}

/* ── Constants ──────────────────────────────────────────── */

export const LEAD_STATUS_ORDER: LeadStatus[] = [
  'NEW_LEAD',
  'QUALIFIED',
  'CONTACTED',
  'DEMO_SHARED',
  'SALES_CONVERSATION',
  'NEGOTIATION',
  'CLOSED_WON',
  'CLOSED_LOST',
];

export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  NEW_LEAD: 'New Lead',
  QUALIFIED: 'Qualified',
  CONTACTED: 'Contacted',
  DEMO_SHARED: 'Demo Shared',
  SALES_CONVERSATION: 'Sales Conversation',
  NEGOTIATION: 'Negotiation',
  CLOSED_WON: 'Closed Won',
  CLOSED_LOST: 'Closed Lost',
};

export const STATUS_COLORS: Record<LeadStatus, string> = {
  NEW_LEAD: 'blue',
  QUALIFIED: 'purple',
  CONTACTED: 'amber',
  DEMO_SHARED: 'cyan',
  SALES_CONVERSATION: 'emerald',
  NEGOTIATION: 'amber',
  CLOSED_WON: 'emerald',
  CLOSED_LOST: 'rose',
};

/* ── Agent action result ────────────────────────────────── */

export interface AgentActionResult {
  lead: Lead;
  description: string;
}
