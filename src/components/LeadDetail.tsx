import React, { useState } from 'react';
import { useApp } from '../store';
import { LEAD_STATUS_LABELS, STATUS_COLORS } from '../types';
import './LeadDetail.css';

const Section: React.FC<{
  icon: string;
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}> = ({ icon, title, defaultOpen = false, children }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="lead-detail__section">
      <div
        className="lead-detail__section-header"
        onClick={() => setOpen((o) => !o)}
      >
        <span className="lead-detail__section-icon">{icon}</span>
        <span className="lead-detail__section-title">{title}</span>
        <span
          className={`lead-detail__section-chevron ${open ? 'lead-detail__section-chevron--open' : ''}`}
        >
          ▾
        </span>
      </div>
      {open && <div className="lead-detail__section-body">{children}</div>}
    </div>
  );
};

const LeadDetail: React.FC = () => {
  const { selectedLead, closeDetail, runNextAgentAction, closeLead, addToast } =
    useApp();

  if (!selectedLead) return null;

  const lead = selectedLead;
  const statusColor = STATUS_COLORS[lead.status];
  const statusLabel = LEAD_STATUS_LABELS[lead.status];
  const mem = lead.memory;

  const handleRunNext = () => {
    runNextAgentAction(lead.id);
    addToast('Agent action executed! 🤖', 'success');
  };

  const handleCloseWon = () => {
    closeLead(lead.id, 'WON');
    addToast('Deal closed — Won! 🎉', 'success');
  };

  const handleCloseLost = () => {
    closeLead(lead.id, 'LOST');
    addToast('Deal closed — Lost.', 'error');
  };

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return iso;
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="lead-detail__overlay"
        id="lead-detail-overlay"
        onClick={closeDetail}
      />

      {/* Drawer */}
      <div className="lead-detail" id="lead-detail-drawer">
        {/* Header */}
        <div className="lead-detail__header">
          <div className="lead-detail__header-info">
            <span className="lead-detail__company">{lead.companyName}</span>
            <span className="lead-detail__subtitle">
              {lead.contactName} · {lead.contactTitle}
            </span>
          </div>
          <button
            className="lead-detail__close"
            id="lead-detail-close"
            onClick={closeDetail}
            aria-label="Close detail"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="lead-detail__body">
          {/* Status + Score */}
          <div className="lead-detail__score-section">
            <div
              className="lead-detail__score-ring"
              style={{ '--score': lead.score } as React.CSSProperties}
            >
              <div className="lead-detail__score-inner">{lead.score}</div>
            </div>
            <div className="lead-detail__score-info">
              <span className="lead-detail__score-title">
                <span className={`badge badge-${statusColor}`}>
                  {statusLabel}
                </span>
              </span>
              <span className="lead-detail__score-subtitle">
                Lead Score · Updated {formatDate(lead.updatedAt)}
              </span>
            </div>
          </div>

          {/* Contact Info */}
          <div className="lead-detail__summary">
            <div className="lead-detail__summary-card">
              <span className="lead-detail__summary-label">📧 Email</span>
              <span className="lead-detail__summary-value">
                <a href={`mailto:${lead.contactEmail}`}>{lead.contactEmail}</a>
              </span>
            </div>
            <div className="lead-detail__summary-card">
              <span className="lead-detail__summary-label">🌐 Website</span>
              <span className="lead-detail__summary-value">
                <a href={lead.website} target="_blank" rel="noreferrer">
                  {lead.website}
                </a>
              </span>
            </div>
            <div className="lead-detail__summary-card">
              <span className="lead-detail__summary-label">🏭 Industry</span>
              <span className="lead-detail__summary-value">
                {lead.industry}
              </span>
            </div>
            <div className="lead-detail__summary-card">
              <span className="lead-detail__summary-label">👥 Size</span>
              <span className="lead-detail__summary-value">
                {lead.companySize}
              </span>
            </div>
          </div>

          {/* Qualification */}
          <Section icon="🎯" title="Qualification" defaultOpen>
            {mem.qualificationResult ? (
              <>
                <p>
                  <span
                    className={`badge badge-${mem.qualificationResult.outcome === 'QUALIFIED' ? 'emerald' : 'rose'}`}
                  >
                    {mem.qualificationResult.outcome}
                  </span>{' '}
                  — Score: <strong>{mem.qualificationResult.score}</strong>
                </p>
                {mem.qualificationResult.reasons.length > 0 && (
                  <ul>
                    {mem.qualificationResult.reasons.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                )}
              </>
            ) : (
              <div className="lead-detail__empty-section">
                No qualification data yet
              </div>
            )}
          </Section>

          {/* Outreach */}
          <Section icon="📧" title="Outreach History">
            {mem.outreachHistory.length > 0 ? (
              mem.outreachHistory.map((o, i) => (
                <div key={i} className="lead-detail__outreach-item">
                  <div className="lead-detail__outreach-channel">
                    <span className="badge badge-amber">{o.channel}</span>
                    <span
                      style={{
                        fontSize: '0.68rem',
                        color: 'var(--text-muted)',
                      }}
                    >
                      {formatDate(o.sentAt)}
                    </span>
                  </div>
                  <div className="lead-detail__outreach-message">
                    {o.message}
                  </div>
                </div>
              ))
            ) : (
              <div className="lead-detail__empty-section">
                No outreach sent yet
              </div>
            )}
          </Section>

          {/* Demo */}
          <Section icon="🎬" title="Demo Activity">
            {mem.demoActivity.length > 0 ? (
              mem.demoActivity.map((d, i) => (
                <div key={i} className="lead-detail__outreach-item">
                  <p>
                    📎 Asset:{' '}
                    <a
                      href={d.assetUrl}
                      target="_blank"
                      rel="noreferrer"
                      style={{ color: 'var(--accent-blue)' }}
                    >
                      {d.assetUrl}
                    </a>
                  </p>
                  <p>
                    📅 Booking:{' '}
                    <a
                      href={d.bookingUrl}
                      target="_blank"
                      rel="noreferrer"
                      style={{ color: 'var(--accent-cyan)' }}
                    >
                      {d.bookingUrl}
                    </a>
                  </p>
                  <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                    Sent {formatDate(d.sentAt)}
                  </p>
                </div>
              ))
            ) : (
              <div className="lead-detail__empty-section">
                No demo activity yet
              </div>
            )}
          </Section>

          {/* Conversation */}
          <Section icon="💬" title="Conversation">
            {mem.conversationHistory.length > 0 ? (
              <div style={{ maxHeight: 260, overflowY: 'auto' }}>
                {mem.conversationHistory.map((c, i) => (
                  <div
                    key={i}
                    style={{
                      marginBottom: 8,
                      paddingBottom: 8,
                      borderBottom: '1px solid var(--border)',
                    }}
                  >
                    <span
                      className={`badge badge-${c.role === 'agent' ? 'blue' : c.role === 'prospect' ? 'amber' : 'purple'}`}
                      style={{ marginBottom: 4 }}
                    >
                      {c.role}
                    </span>
                    <p style={{ marginTop: 4 }}>{c.message}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="lead-detail__empty-section">
                No conversation yet
              </div>
            )}
          </Section>

          {/* Negotiation */}
          <Section icon="🤝" title="Negotiation">
            {mem.negotiation ? (
              <>
                <div className="lead-detail__neg-grid">
                  <div className="lead-detail__neg-item">
                    <span className="lead-detail__neg-label">
                      Requested Discount
                    </span>
                    <span className="lead-detail__neg-value">
                      {mem.negotiation.requestedDiscountPercent ?? '—'}%
                    </span>
                  </div>
                  <div className="lead-detail__neg-item">
                    <span className="lead-detail__neg-label">
                      Approved Discount
                    </span>
                    <span className="lead-detail__neg-value">
                      {mem.negotiation.approvedDiscountPercent ?? '—'}%
                    </span>
                  </div>
                  <div className="lead-detail__neg-item">
                    <span className="lead-detail__neg-label">Trial Days</span>
                    <span className="lead-detail__neg-value">
                      {mem.negotiation.trialDays ?? '—'}
                    </span>
                  </div>
                </div>
                {mem.negotiation.notes.length > 0 && (
                  <ul>
                    {mem.negotiation.notes.map((n, i) => (
                      <li key={i}>{n}</li>
                    ))}
                  </ul>
                )}
              </>
            ) : (
              <div className="lead-detail__empty-section">
                No negotiation data yet
              </div>
            )}
          </Section>

          {/* Closing */}
          <Section icon="🏆" title="Closing">
            {mem.closing ? (
              <div>
                <p>
                  <span
                    className={`badge badge-${mem.closing.outcome === 'WON' ? 'emerald' : 'rose'}`}
                  >
                    {mem.closing.outcome}
                  </span>
                </p>
                {mem.closing.reason && <p>Reason: {mem.closing.reason}</p>}
                {mem.closing.paymentUrl && (
                  <p>
                    💳 Payment:{' '}
                    <a
                      href={mem.closing.paymentUrl}
                      target="_blank"
                      rel="noreferrer"
                      style={{ color: 'var(--accent-emerald)' }}
                    >
                      {mem.closing.paymentUrl}
                    </a>
                  </p>
                )}
                <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                  Closed {formatDate(mem.closing.closedAt)}
                </p>
              </div>
            ) : (
              <div className="lead-detail__empty-section">Not closed yet</div>
            )}
          </Section>

          {/* Sales Notes */}
          {mem.salesNotes.length > 0 && (
            <Section icon="📝" title="Sales Notes">
              <ul>
                {mem.salesNotes.map((n, i) => (
                  <li key={i}>{n}</li>
                ))}
              </ul>
            </Section>
          )}
        </div>

        {/* Actions */}
        <div className="lead-detail__actions">
          <button
            id="lead-detail-run-next"
            className="btn btn-primary"
            onClick={handleRunNext}
          >
            🤖 Run Next Action
          </button>
          <button
            id="lead-detail-close-won"
            className="btn btn-success"
            onClick={handleCloseWon}
          >
            ✅ Close Won
          </button>
          <button
            id="lead-detail-close-lost"
            className="btn btn-danger"
            onClick={handleCloseLost}
          >
            ❌ Close Lost
          </button>
        </div>
      </div>
    </>
  );
};

export default LeadDetail;
