import React from 'react';
import { Lead, LEAD_STATUS_LABELS, STATUS_COLORS } from '../types';
import './LeadCard.css';

interface LeadCardProps {
  lead: Lead;
  onClick: (id: string) => void;
}

const LeadCard: React.FC<LeadCardProps> = ({ lead, onClick }) => {
  const statusColor = STATUS_COLORS[lead.status];
  const statusLabel = LEAD_STATUS_LABELS[lead.status];

  // Get latest activity snippet
  const getLatestSnippet = (): string | null => {
    const history = lead.memory.conversationHistory;
    if (history.length > 0) {
      return history[history.length - 1].message;
    }
    if (lead.memory.outreachHistory.length > 0) {
      return lead.memory.outreachHistory[lead.memory.outreachHistory.length - 1].message;
    }
    if (lead.memory.companyInfo) {
      return lead.memory.companyInfo;
    }
    return null;
  };

  const snippet = getLatestSnippet();

  return (
    <div
      className="lead-card"
      id={`lead-card-${lead.id}`}
      onClick={() => onClick(lead.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick(lead.id)}
    >
      <div className="lead-card__header">
        <span className="lead-card__company">{lead.companyName}</span>
        <span className={`badge badge-${statusColor}`}>{statusLabel}</span>
      </div>

      <div className="lead-card__contact">
        <span className="lead-card__contact-name">{lead.contactName}</span>
        <span className="lead-card__contact-title">{lead.contactTitle}</span>
      </div>

      <div className="lead-card__meta">
        <span className="badge badge-purple">{lead.industry}</span>
        <span className="badge badge-cyan">{lead.companySize}</span>
      </div>

      <div className="lead-card__score">
        <span className="lead-card__score-label">Score</span>
        <div className="lead-card__score-bar">
          <div
            className="lead-card__score-fill"
            style={{ width: `${lead.score}%` }}
          />
        </div>
        <span className="lead-card__score-value">{lead.score}</span>
      </div>

      {snippet && (
        <div className="lead-card__snippet">{snippet.slice(0, 80)}</div>
      )}
    </div>
  );
};

export default LeadCard;
