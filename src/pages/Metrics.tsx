import React from 'react';
import { useApp } from '../store';
import {
  LEAD_STATUS_ORDER,
  LEAD_STATUS_LABELS,
  STATUS_COLORS,
} from '../types';
import './Metrics.css';

const Metrics: React.FC = () => {
  const { leads } = useApp();

  // Compute metrics
  const total = leads.length;
  const qualified = leads.filter((l) => l.status !== 'NEW_LEAD').length;
  const contacted = leads.filter(
    (l) =>
      l.status !== 'NEW_LEAD' &&
      l.status !== 'QUALIFIED'
  ).length;
  const demosShared = leads.filter(
    (l) => l.memory.demoActivity.length > 0
  ).length;
  const closedWon = leads.filter((l) => l.status === 'CLOSED_WON').length;
  const closedLost = leads.filter((l) => l.status === 'CLOSED_LOST').length;

  const conversionRate = total > 0 ? ((closedWon / total) * 100).toFixed(1) : '0.0';
  const avgScore =
    total > 0
      ? (leads.reduce((sum, l) => sum + l.score, 0) / total).toFixed(0)
      : '0';

  // Pipeline bar data
  const maxCountInStatus = Math.max(
    1,
    ...LEAD_STATUS_ORDER.map(
      (s) => leads.filter((l) => l.status === s).length
    )
  );

  const kpiCards = [
    { icon: '📊', value: total, label: 'Total Leads', color: 'blue' },
    { icon: '🎯', value: qualified, label: 'Qualified', color: 'purple' },
    { icon: '📧', value: contacted, label: 'Contacted', color: 'amber' },
    { icon: '🎬', value: demosShared, label: 'Demos Shared', color: 'cyan' },
    { icon: '🏆', value: closedWon, label: 'Closed Won', color: 'emerald' },
    { icon: '📉', value: closedLost, label: 'Closed Lost', color: 'rose' },
  ];

  if (total === 0) {
    return (
      <div className="metrics">
        <div className="metrics__header">
          <h1 className="metrics__title">📊 Metrics</h1>
        </div>
        <div className="metrics__body">
          <div className="metrics__empty">
            <span className="metrics__empty-icon">📊</span>
            <span className="metrics__empty-text">
              No leads yet. Generate leads from the Pipeline to see metrics here.
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="metrics">
      <div className="metrics__header">
        <h1 className="metrics__title">📊 Metrics Dashboard</h1>
      </div>

      <div className="metrics__body">
        <div className="metrics__content">
          {/* KPI Cards */}
          <div className="metrics__kpi-grid">
            {kpiCards.map((kpi) => (
              <div
                key={kpi.label}
                className={`metrics__kpi-card metrics__kpi-card--${kpi.color}`}
                id={`metrics-kpi-${kpi.label.toLowerCase().replace(/\s/g, '-')}`}
              >
                <span className="metrics__kpi-icon">{kpi.icon}</span>
                <span className="metrics__kpi-value">{kpi.value}</span>
                <span className="metrics__kpi-label">{kpi.label}</span>
              </div>
            ))}
          </div>

          {/* Highlights: Conversion Rate & Avg Score */}
          <div className="metrics__highlights">
            <div className="metrics__highlight-card metrics__highlight-card--primary">
              <span className="metrics__highlight-title">
                🎯 Conversion Rate
              </span>
              <span className="metrics__highlight-value metrics__highlight-value--primary">
                {conversionRate}%
              </span>
              <span className="metrics__highlight-sub">
                {closedWon} won of {total} total leads
              </span>
            </div>
            <div className="metrics__highlight-card metrics__highlight-card--warm">
              <span className="metrics__highlight-title">
                ⚡ Average Lead Score
              </span>
              <span className="metrics__highlight-value metrics__highlight-value--warm">
                {avgScore}
              </span>
              <span className="metrics__highlight-sub">
                Across {total} leads in pipeline
              </span>
            </div>
          </div>

          {/* Pipeline Stage Distribution */}
          <div className="metrics__pipeline-section">
            <h3 className="metrics__pipeline-title">
              🚀 Pipeline Distribution
            </h3>
            <div className="metrics__pipeline-bars">
              {LEAD_STATUS_ORDER.map((status) => {
                const count = leads.filter((l) => l.status === status).length;
                const pct = (count / maxCountInStatus) * 100;
                const color = STATUS_COLORS[status];
                return (
                  <div
                    key={status}
                    className="metrics__pipeline-row"
                    id={`metrics-bar-${status}`}
                  >
                    <span className="metrics__pipeline-label">
                      {LEAD_STATUS_LABELS[status]}
                    </span>
                    <div className="metrics__pipeline-bar-track">
                      <div
                        className={`metrics__pipeline-bar-fill metrics__pipeline-bar-fill--${color}`}
                        style={{ width: `${Math.max(pct, count > 0 ? 8 : 0)}%` }}
                      >
                        {count > 0 ? count : ''}
                      </div>
                    </div>
                    <span className="metrics__pipeline-count">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Metrics;
