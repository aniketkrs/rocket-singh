import React, { useState } from 'react';
import { useApp } from '../store';
import { LEAD_STATUS_LABELS, STATUS_COLORS, AgentType } from '../types';
import SalesChat from '../components/SalesChat';
import './AgentConsole.css';

const AGENT_ACTIONS: { type: AgentType; icon: string; label: string }[] = [
  { type: 'discovery', icon: '🔍', label: 'Discovery Agent' },
  { type: 'qualification', icon: '🎯', label: 'Qualification Agent' },
  { type: 'outreach', icon: '📧', label: 'Outreach Agent' },
  { type: 'demo', icon: '🎬', label: 'Demo Agent' },
  { type: 'sales', icon: '💬', label: 'Sales Agent' },
  { type: 'closing', icon: '🏆', label: 'Closing Agent' },
];

const AgentConsole: React.FC = () => {
  const { leads, runNextAgentAction, runAgent, addToast } = useApp();
  const [selectedId, setSelectedId] = useState<string>('');

  const selectedLead = leads.find((l) => l.id === selectedId);

  const handleRunNext = () => {
    if (!selectedId) return;
    runNextAgentAction(selectedId);
    addToast('Next agent action executed! 🤖', 'success');
  };

  const handleRunAgent = (agentType: AgentType) => {
    if (!selectedId) return;
    runAgent(selectedId, agentType);
    addToast(`${agentType.charAt(0).toUpperCase() + agentType.slice(1)} agent ran! ⚡`, 'success');
  };

  return (
    <div className="agent-console">
      {/* Left Panel */}
      <div className="agent-console__left">
        <div className="agent-console__left-header">
          <h2 className="agent-console__left-title">
            🤖 Agent Console
          </h2>
          <select
            id="agent-console-lead-select"
            className="select agent-console__lead-selector"
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
          >
            <option value="">Select a lead…</option>
            {leads.map((lead) => (
              <option key={lead.id} value={lead.id}>
                {lead.companyName} — {lead.contactName}
              </option>
            ))}
          </select>
        </div>

        {selectedLead && (
          <div className="agent-console__lead-info">
            <span className="agent-console__lead-name">
              {selectedLead.companyName}
            </span>
            <div className="agent-console__lead-meta">
              <span className="badge badge-purple">{selectedLead.industry}</span>
              <span className="badge badge-cyan">{selectedLead.companySize}</span>
            </div>
            <div className="agent-console__lead-status-row">
              <span
                className={`badge badge-${STATUS_COLORS[selectedLead.status]}`}
              >
                {LEAD_STATUS_LABELS[selectedLead.status]}
              </span>
              <div className="agent-console__lead-score">
                <div className="agent-console__lead-score-bar">
                  <div
                    className="agent-console__lead-score-fill"
                    style={{ width: `${selectedLead.score}%` }}
                  />
                </div>
                <span className="agent-console__lead-score-val">
                  {selectedLead.score}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="agent-console__actions">
          <span className="agent-console__actions-title">Agent Actions</span>

          <button
            id="agent-console-run-next"
            className="agent-console__action-btn agent-console__run-next"
            onClick={handleRunNext}
            disabled={!selectedId}
          >
            <span className="agent-console__action-icon">⚡</span>
            <span className="agent-console__action-label">Run Next Action</span>
            <span className="agent-console__action-arrow">→</span>
          </button>

          {AGENT_ACTIONS.map((action) => (
            <button
              key={action.type}
              id={`agent-console-${action.type}`}
              className="agent-console__action-btn"
              onClick={() => handleRunAgent(action.type)}
              disabled={!selectedId}
            >
              <span className="agent-console__action-icon">{action.icon}</span>
              <span className="agent-console__action-label">{action.label}</span>
              <span className="agent-console__action-arrow">→</span>
            </button>
          ))}
        </div>
      </div>

      {/* Right Panel */}
      <div className="agent-console__right">
        {selectedId ? (
          <SalesChat leadId={selectedId} />
        ) : (
          <div className="agent-console__empty">
            <span className="agent-console__empty-icon">🤖</span>
            <span className="agent-console__empty-title">
              Select a lead to begin
            </span>
            <span className="agent-console__empty-desc">
              Choose a lead from the dropdown to view the conversation and run
              AI agent actions.
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentConsole;
