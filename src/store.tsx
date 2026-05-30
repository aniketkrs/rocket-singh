/**
 * store.tsx — React context provider with full app state management.
 *
 * Provides centralized state for leads, company profile, UI navigation,
 * and agent orchestration. All agent actions are dispatched through this store.
 */

import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import type {
  CompanyProfile,
  Lead,
  ViewType,
  AgentType,
} from './types';
import { defaultCompanyProfile, seedLeads } from './seed';
import { generateLeads } from './agents/leadDiscovery';
import { qualifyLead } from './agents/qualification';
import { generateOutreach } from './agents/outreach';
import { shareDemo } from './agents/demo';
import { handleProspectMessage } from './agents/sales';
import { closeDeal } from './agents/closing';
import { runNextAction } from './agents/orchestrator';

/* ── Toast type ──────────────────────────────────────────── */

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

/* ── Context value shape ─────────────────────────────────── */

export interface AppContextValue {
  companyProfile: CompanyProfile;
  leads: Lead[];
  activeView: ViewType;
  selectedLeadId: string | null;
  selectedLead: Lead | null;
  isDetailOpen: boolean;
  toasts: Toast[];

  setActiveView: (view: ViewType) => void;
  selectLead: (id: string) => void;
  closeDetail: () => void;
  updateCompanyProfile: (profile: CompanyProfile) => void;
  addLeads: (leads: Lead[]) => void;
  generateNewLeads: (count: number) => void;
  updateLead: (lead: Lead) => void;
  runNextAgentAction: (leadId: string) => string;
  runAgent: (leadId: string, agentType: AgentType) => string;
  sendProspectMessage: (leadId: string, message: string) => void;
  closeLead: (leadId: string, outcome: 'WON' | 'LOST', reason?: string) => void;
  addToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

/* ── Context ─────────────────────────────────────────────── */

const AppContext = createContext<AppContextValue | undefined>(undefined);

/* ── Provider ────────────────────────────────────────────── */

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [companyProfile, setCompanyProfile] = useState<CompanyProfile>(defaultCompanyProfile);
  const [leads, setLeads] = useState<Lead[]>(seedLeads);
  const [activeView, setActiveView] = useState<ViewType>('pipeline');
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  /* ── Derived state ───────────────────────────────────── */

  const selectedLead = useMemo(
    () => leads.find((l) => l.id === selectedLeadId) ?? null,
    [leads, selectedLeadId],
  );

  /* ── Toast helpers ───────────────────────────────────── */

  const addToast = useCallback(
    (message: string, type: 'success' | 'error' | 'info' = 'info') => {
      const toast: Toast = { id: crypto.randomUUID(), message, type };
      setToasts((prev) => [...prev, toast]);

      // Auto-dismiss after 4 seconds
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== toast.id));
      }, 4000);
    },
    [],
  );

  /* ── Navigation ──────────────────────────────────────── */

  const selectLead = useCallback((id: string) => {
    setSelectedLeadId(id);
    setIsDetailOpen(true);
  }, []);

  const closeDetail = useCallback(() => {
    setIsDetailOpen(false);
  }, []);

  /* ── Profile management ──────────────────────────────── */

  const updateCompanyProfile = useCallback((profile: CompanyProfile) => {
    setCompanyProfile(profile);
  }, []);

  /* ── Lead CRUD ───────────────────────────────────────── */

  const addLeads = useCallback((newLeads: Lead[]) => {
    setLeads((prev) => [...prev, ...newLeads]);
  }, []);

  const generateNewLeads = useCallback(
    (count: number) => {
      const newLeads = generateLeads(companyProfile, count);
      setLeads((prev) => [...prev, ...newLeads]);
      addToast(`🔍 Discovered ${count} new lead${count > 1 ? 's' : ''}`, 'success');
    },
    [companyProfile, addToast],
  );

  const updateLead = useCallback((updatedLead: Lead) => {
    setLeads((prev) =>
      prev.map((l) => (l.id === updatedLead.id ? updatedLead : l)),
    );
  }, []);

  /* ── Lead lookup helper ──────────────────────────────── */

  const findLead = useCallback(
    (leadId: string): Lead | null => {
      return leads.find((l) => l.id === leadId) ?? null;
    },
    [leads],
  );

  /* ── Agent orchestration ─────────────────────────────── */

  const runNextAgentAction = useCallback(
    (leadId: string): string => {
      const lead = findLead(leadId);
      if (!lead) {
        addToast('Lead not found', 'error');
        return 'Lead not found';
      }

      const result = runNextAction(lead, companyProfile);
      if (!result) {
        const msg = 'No automatic action available for this lead';
        addToast(msg, 'info');
        return msg;
      }

      updateLead(result.lead);
      addToast(result.description, 'success');
      return result.description;
    },
    [findLead, companyProfile, updateLead, addToast],
  );

  const runAgent = useCallback(
    (leadId: string, agentType: AgentType): string => {
      const lead = findLead(leadId);
      if (!lead) {
        addToast('Lead not found', 'error');
        return 'Lead not found';
      }

      let result;
      switch (agentType) {
        case 'qualification':
          result = qualifyLead(lead, companyProfile);
          break;
        case 'outreach':
          result = generateOutreach(lead, companyProfile);
          break;
        case 'demo':
          result = shareDemo(lead, companyProfile);
          break;
        case 'sales':
          result = handleProspectMessage(lead, companyProfile, '');
          break;
        case 'closing':
          result = closeDeal(lead, companyProfile, 'WON');
          break;
        case 'discovery':
          // Discovery generates new leads, doesn't process existing ones
          generateNewLeads(1);
          return 'Generated a new lead via discovery';
        default:
          return `Unknown agent type: ${agentType}`;
      }

      updateLead(result.lead);
      addToast(result.description, 'success');
      return result.description;
    },
    [findLead, companyProfile, updateLead, addToast, generateNewLeads],
  );

  /* ── Chat ────────────────────────────────────────────── */

  const sendProspectMessage = useCallback(
    (leadId: string, message: string) => {
      const lead = findLead(leadId);
      if (!lead) {
        addToast('Lead not found', 'error');
        return;
      }

      const result = handleProspectMessage(lead, companyProfile, message);
      updateLead(result.lead);

      // If the status transitioned to NEGOTIATION, notify
      if (result.lead.status === 'NEGOTIATION' && lead.status !== 'NEGOTIATION') {
        addToast('🤝 Buying signal detected — moved to Negotiation!', 'success');
      }
    },
    [findLead, companyProfile, updateLead, addToast],
  );

  /* ── Deal closing ────────────────────────────────────── */

  const closeLead = useCallback(
    (leadId: string, outcome: 'WON' | 'LOST', reason?: string) => {
      const lead = findLead(leadId);
      if (!lead) {
        addToast('Lead not found', 'error');
        return;
      }

      const result = closeDeal(lead, companyProfile, outcome, reason);
      updateLead(result.lead);
      addToast(result.description, outcome === 'WON' ? 'success' : 'info');
    },
    [findLead, companyProfile, updateLead, addToast],
  );

  /* ── Context value ───────────────────────────────────── */

  const value: AppContextValue = useMemo(
    () => ({
      companyProfile,
      leads,
      activeView,
      selectedLeadId,
      selectedLead,
      isDetailOpen,
      toasts,

      setActiveView,
      selectLead,
      closeDetail,
      updateCompanyProfile,
      addLeads,
      generateNewLeads,
      updateLead,
      runNextAgentAction,
      runAgent,
      sendProspectMessage,
      closeLead,
      addToast,
    }),
    [
      companyProfile,
      leads,
      activeView,
      selectedLeadId,
      selectedLead,
      isDetailOpen,
      toasts,
      selectLead,
      closeDetail,
      updateCompanyProfile,
      addLeads,
      generateNewLeads,
      updateLead,
      runNextAgentAction,
      runAgent,
      sendProspectMessage,
      closeLead,
      addToast,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

/* ── Hook ────────────────────────────────────────────────── */

export function useApp(): AppContextValue {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp() must be used within an <AppProvider>');
  }
  return context;
}
