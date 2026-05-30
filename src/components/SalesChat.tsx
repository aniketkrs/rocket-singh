import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../store';
import './SalesChat.css';

interface SalesChatProps {
  leadId: string;
}

const SalesChat: React.FC<SalesChatProps> = ({ leadId }) => {
  const { leads, sendProspectMessage } = useApp();
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const lead = leads.find((l) => l.id === leadId);
  const messages = lead?.memory.conversationHistory ?? [];

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  const handleSend = () => {
    const trimmed = message.trim();
    if (!trimmed) return;
    sendProspectMessage(leadId, trimmed);
    setMessage('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (iso: string) => {
    try {
      return new Date(iso).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return '';
    }
  };

  const roleEmoji: Record<string, string> = {
    prospect: '🏢',
    agent: '🤖',
    system: '⚙️',
  };

  return (
    <div className="sales-chat" id={`sales-chat-${leadId}`}>
      <div className="sales-chat__header">
        <span className="sales-chat__header-icon">💬</span>
        <span className="sales-chat__header-title">
          {lead ? `Chat — ${lead.companyName}` : 'Sales Chat'}
        </span>
        <span className="sales-chat__header-status">Active</span>
      </div>

      <div className="sales-chat__messages">
        {messages.length === 0 ? (
          <div className="sales-chat__empty">
            <span className="sales-chat__empty-icon">💬</span>
            <span className="sales-chat__empty-text">
              No conversation yet.<br />
              Send a message as the prospect to begin.
            </span>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={idx}
              className={`sales-chat__message sales-chat__message--${msg.role}`}
            >
              <span className="sales-chat__message-role">
                {roleEmoji[msg.role] || ''} {msg.role}
              </span>
              <div className="sales-chat__message-bubble">{msg.message}</div>
              <span className="sales-chat__message-time">
                {formatTime(msg.createdAt)}
              </span>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="sales-chat__input-area">
        <input
          id="sales-chat-input"
          className="sales-chat__input"
          type="text"
          placeholder="Type a prospect message…"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          id="sales-chat-send"
          className="sales-chat__send-btn"
          onClick={handleSend}
          disabled={!message.trim()}
          aria-label="Send message"
        >
          ➤
        </button>
      </div>
    </div>
  );
};

export default SalesChat;
