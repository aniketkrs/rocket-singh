import { useState, useEffect } from 'react';
import { useApp } from './store';
import Pipeline from './pages/Pipeline';
import Onboarding from './pages/Onboarding';
import AgentConsole from './pages/AgentConsole';
import Metrics from './pages/Metrics';
import './App.css';

const NAV_ITEMS = [
  { id: 'pipeline' as const, label: 'Pipeline', icon: '📋' },
  { id: 'onboarding' as const, label: 'Onboarding', icon: '🏢' },
  { id: 'console' as const, label: 'Agent Console', icon: '🤖' },
  { id: 'metrics' as const, label: 'Metrics', icon: '📊' },
];

export default function App() {
  const { activeView, setActiveView, companyProfile, toasts } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile sidebar when view changes
  useEffect(() => {
    setMobileOpen(false);
  }, [activeView]);

  const renderPage = () => {
    switch (activeView) {
      case 'pipeline':
        return <Pipeline />;
      case 'onboarding':
        return <Onboarding />;
      case 'console':
        return <AgentConsole />;
      case 'metrics':
        return <Metrics />;
      default:
        return <Pipeline />;
    }
  };

  return (
    <div className="app">
      {/* Mobile header */}
      <div className="mobile-header">
        <button
          className="mobile-toggle"
          onClick={() => setMobileOpen(!mobileOpen)}
          id="mobile-menu-toggle"
        >
          ☰
        </button>
        <span className="mobile-logo">🚀 Rocket Singh</span>
      </div>

      {/* Sidebar overlay for mobile */}
      <div
        className={`sidebar-overlay ${mobileOpen ? 'open' : ''}`}
        onClick={() => setMobileOpen(false)}
      />

      {/* Sidebar */}
      <aside className={`sidebar ${mobileOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <span className="sidebar-logo-icon">🚀</span>
            <div className="sidebar-logo-text">
              <span className="sidebar-logo-name">Rocket Singh</span>
              <span className="sidebar-logo-tagline">AI Sales Agent</span>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              id={`nav-${item.id}`}
              className={`nav-item ${activeView === item.id ? 'active' : ''}`}
              onClick={() => setActiveView(item.id)}
            >
              <span className="nav-item-icon">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-profile">
            <div className="sidebar-profile-avatar">
              {companyProfile.name.charAt(0)}
            </div>
            <div className="sidebar-profile-info">
              <span className="sidebar-profile-name">{companyProfile.name}</span>
              <span className="sidebar-profile-role">Founder</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="main-content">
        {renderPage()}
      </main>

      {/* Toasts */}
      {toasts.length > 0 && (
        <div className="toast-container">
          {toasts.map((toast) => (
            <div key={toast.id} className={`toast toast-${toast.type}`}>
              <span className="toast-icon">
                {toast.type === 'success' ? '✅' : toast.type === 'error' ? '❌' : 'ℹ️'}
              </span>
              <span className="toast-message">{toast.message}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
