import React from 'react';
import { useApp } from '../store';
import {
  LEAD_STATUS_ORDER,
  LEAD_STATUS_LABELS,
  STATUS_COLORS,
  LeadStatus,
} from '../types';
import LeadCard from '../components/LeadCard';
import LeadDetail from '../components/LeadDetail';
import './Pipeline.css';

const Pipeline: React.FC = () => {
  const {
    leads,
    isDetailOpen,
    selectLead,
    generateNewLeads,
    runNextAgentAction,
    addToast,
  } = useApp();

  const getLeadsByStatus = (status: LeadStatus) =>
    leads.filter((l) => l.status === status);

  const handleGenerateLeads = () => {
    generateNewLeads(3);
    addToast('New leads generated! 🚀', 'success');
  };

  const handleRunAll = () => {
    leads
      .filter(
        (l) => l.status !== 'CLOSED_WON' && l.status !== 'CLOSED_LOST'
      )
      .forEach((l) => runNextAgentAction(l.id));
    addToast('Running all agent actions… ⚡', 'info');
  };

  const columnEmptyIcons: Record<LeadStatus, string> = {
    NEW_LEAD: '🌱',
    QUALIFIED: '🎯',
    CONTACTED: '📧',
    DEMO_SHARED: '🎬',
    SALES_CONVERSATION: '💬',
    NEGOTIATION: '🤝',
    CLOSED_WON: '🏆',
    CLOSED_LOST: '📉',
  };

  return (
    <div className="pipeline">
      <div className="pipeline__header">
        <div className="pipeline__header-left">
          <h1 className="pipeline__title">
            <span className="pipeline__title-icon">🚀</span>
            Pipeline
          </h1>
          <span className="pipeline__lead-count">
            {leads.length} lead{leads.length !== 1 ? 's' : ''}
          </span>
        </div>
        <div className="pipeline__header-actions">
          <button
            id="pipeline-generate-leads"
            className="btn btn-primary"
            onClick={handleGenerateLeads}
          >
            ✨ Generate Leads
          </button>
          <button
            id="pipeline-run-all"
            className="btn btn-secondary"
            onClick={handleRunAll}
            disabled={leads.length === 0}
          >
            ⚡ Run All
          </button>
        </div>
      </div>

      <div className="pipeline__board">
        {LEAD_STATUS_ORDER.map((status) => {
          const columnLeads = getLeadsByStatus(status);
          const color = STATUS_COLORS[status];
          return (
            <div
              key={status}
              className={`pipeline__column pipeline__column--${color}`}
              id={`pipeline-col-${status}`}
            >
              <div className="pipeline__column-header">
                <span className="pipeline__column-title">
                  {LEAD_STATUS_LABELS[status]}
                </span>
                <span className="pipeline__column-count">
                  {columnLeads.length}
                </span>
              </div>
              <div className="pipeline__column-cards">
                {columnLeads.length > 0 ? (
                  columnLeads.map((lead) => (
                    <LeadCard
                      key={lead.id}
                      lead={lead}
                      onClick={selectLead}
                    />
                  ))
                ) : (
                  <div className="pipeline__column-empty">
                    <span className="pipeline__column-empty-icon">
                      {columnEmptyIcons[status]}
                    </span>
                    No leads
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {isDetailOpen && <LeadDetail />}
    </div>
  );
};

export default Pipeline;
