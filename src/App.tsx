import React, { useState, useMemo, useEffect } from 'react';
import {
  supabase,
  fetchAgents,
  fetchMessages,
  fetchTickets,
  createMessage,
  updateTicketStatus,
  type Agent,
  type Message,
  type Ticket
} from './lib/supabase';
import { KnowledgeUpload } from './components/KnowledgeUpload';

// ==========================
// THE IF KERRY MADE CARE HOMES — DREAM TEAM (Futuristic Edition)
// Antique AI Agents with a futuristic twist
// ==========================

// --- Fonts (Google Fonts) ---
const FontLinks = () => (
  <>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
    <link
      href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Inter:wght@300;400;500;600;700&display=swap"
      rel="stylesheet"
    />
  </>
);

// --- CSS Variables (Futuristic Dark Palette) ---
const GlobalStyles = () => (
  <style>{`
    :root{
      --olive:#2f6418;       /* Primary accent */
      --dark:#000000;       /* Pure black background */
      --card:#111111;       /* Card backgrounds */
      --border:#333333;     /* Borders */
      --text:#FFFFFF;       /* Primary text */
      --text-muted:#AAAAAA; /* Muted text */
      --hover:#1a1a1a;      /* Hover states */
      --radius:12px;
      --shadow:0 8px 32px rgba(122, 199, 184, 0.1);
      --glow:0 0 20px rgba(122, 199, 184, 0.3);
      --gap:16px;
      --font-head:"Orbitron", monospace;
      --font-body:"Inter", system-ui, -apple-system, sans-serif;
    }
    
    html, body, #root { 
      height: 100%; 
      margin: 0;
      padding: 0;
    }
    
    body{ 
      background: var(--dark); 
      color: var(--text); 
      font-family: var(--font-body);
      line-height: 1.6;
    }
    
    h1,h2,h3,h4,h5{ 
      font-family: var(--font-head); 
      margin: 0; 
      font-weight: 700;
    }
    
    * { box-sizing: border-box; }
    
    a { 
      color: var(--mint); 
      text-decoration: none; 
      transition: all 0.3s ease;
    }
    a:hover { 
      text-decoration: underline; 
      text-shadow: var(--glow);
    }

    /* Landing Page Styles */
    .landing-page {
      min-height: 100vh;
      background: 
        linear-gradient(to right, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0.4) 70%, rgba(0, 0, 0, 0.4) 100%),
        url('/Landingpage.png');
      background-size: auto, cover;
      background-position: center, right center;
      background-repeat: no-repeat, no-repeat;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 2rem;
      position: relative;
      overflow: hidden;
    }

    .landing-page::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: 
        radial-gradient(circle at 50% 50%, rgba(122, 199, 184, 0.1) 0%, transparent 50%),
        linear-gradient(to left, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.8) 70%, rgba(0, 0, 0, 1) 100%);
      pointer-events: none;
    }

    .hero-content {
      max-width: 800px;
      z-index: 1;
    }

    .hero-title {
      font-size: clamp(2.5rem, 5vw, 4rem);
      font-family: var(--font-head);
      margin-bottom: 1.5rem;
      background: linear-gradient(135deg, var(--text) 0%, var(--mint) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      line-height: 1.2;
    }

    .hero-subtitle {
      font-size: 1.25rem;
      color: var(--text-muted);
      margin-bottom: 3rem;
      font-weight: 300;
    }

    .cta-button {
      background: linear-gradient(135deg, var(--mint) 0%, #5fb3a3 100%);
      color: var(--dark);
      border: none;
      padding: 1rem 2.5rem;
      font-size: 1.1rem;
      font-weight: 600;
      border-radius: var(--radius);
      cursor: pointer;
      transition: all 0.3s ease;
      font-family: var(--font-head);
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .cta-button:hover {
      transform: translateY(-2px);
      box-shadow: var(--glow);
    }

    /* Dashboard Styles */
    .dashboard {
      min-height: 100vh;
      background: var(--dark);
      padding: 2rem;
    }

    .dashboard-header {
      text-align: center;
      margin-bottom: 3rem;
    }

    .dashboard-title {
      font-size: 2.5rem;
      font-family: var(--font-head);
      color: var(--mint);
      margin-bottom: 1rem;
    }

    .dashboard-subtitle {
      color: var(--text-muted);
      font-size: 1.1rem;
    }

    .supervisor-section {
      max-width: 1200px;
      margin: 0 auto 3rem;
      text-align: center;
       display: flex;
       gap: 2rem;
       justify-content: center;
       flex-wrap: wrap;
    }

    .supervisor-card {
      background: var(--card);
      border: 2px solid var(--mint);
      border-radius: var(--radius);
      padding: 2rem;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: var(--shadow);
      flex: 0 0 auto;
      width: 200px;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .supervisor-card:hover {
      transform: translateY(-4px);
      box-shadow: var(--glow);
      border-color: #5fb3a3;
    }

    .supervisor-image {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      object-fit: cover;
      margin-bottom: 1rem;
      border: 3px solid var(--mint);
    }

    .supervisor-name {
      font-size: 1.5rem;
      font-family: var(--font-head);
      color: var(--mint);
      margin-bottom: 0.5rem;
    }

    .supervisor-role {
      color: var(--text-muted);
      font-size: 1rem;
    }

    .agents-grid {
      max-width: 1200px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 2rem;
      padding: 0 1rem;
    }

    .agent-card {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 1.5rem;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: var(--shadow);
      display: flex;
      align-items: center;
      gap: 1rem;
      min-height: 120px;
    }

    .agent-card:hover {
      transform: translateY(-2px);
      border-color: var(--mint);
      box-shadow: var(--glow);
    }

    .agent-image {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid var(--border);
      transition: border-color 0.3s ease;
      flex-shrink: 0;
    }

    .agent-card:hover .agent-image {
      border-color: var(--mint);
    }

    .agent-info {
      flex: 1;
      text-align: right;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-end;
    }

    .agent-name {
      font-size: 1.1rem;
      font-weight: 600;
      color: var(--text);
      margin-bottom: 0.5rem;
    }

    .agent-role {
      color: var(--text-muted);
      font-size: 0.9rem;
    }

    /* Chat Interface Styles */
    .chat-interface {
      min-height: 100vh;
      background: var(--dark);
      display: grid;
      grid-template-columns: 1fr 360px;
      gap: 2rem;
      padding: 2rem;
      max-width: 1400px;
      margin: 0 auto;
    }

    .chat-main {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .back-button {
      background: var(--card);
      border: 1px solid var(--border);
      color: var(--text);
      padding: 0.75rem 1.5rem;
      border-radius: var(--radius);
      cursor: pointer;
      transition: all 0.3s ease;
      font-family: var(--font-body);
      align-self: flex-start;
    }

    .back-button:hover {
      border-color: var(--mint);
      background: var(--hover);
    }

    .panel {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      box-shadow: var(--shadow);
      display: flex;
      flex-direction: column;
    }

    .panel-title {
      padding: 1rem;
      border-bottom: 1px solid var(--border);
      font-weight: 600;
      font-size: 1rem;
      color: var(--mint);
      font-family: var(--font-head);
    }

    .panel-body {
      padding: 1rem;
      flex: 1;
    }

    .compose {
      padding: 1rem;
    }

    .row {
      display: flex;
      gap: 1rem;
      align-items: center;
      margin-bottom: 1rem;
      flex-wrap: wrap;
    }

    select, textarea, input[type="text"] {
      background: var(--hover);
      border: 1px solid var(--border);
      color: var(--text);
      border-radius: var(--radius);
      padding: 0.75rem 1rem;
      outline: none;
      font-family: var(--font-body);
      transition: border-color 0.3s ease;
    }

    select:focus, textarea:focus, input[type="text"]:focus {
      border-color: var(--mint);
    }

    textarea {
      width: 100%;
      min-height: 120px;
      resize: vertical;
    }

    .row select, .row input[type="text"] {
      flex: 1;
      min-width: 0;
    }

    .actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
      margin-top: 1rem;
    }

    .btn {
      border: none;
      border-radius: var(--radius);
      padding: 0.75rem 1.5rem;
      font-weight: 600;
      cursor: pointer;
      font-family: var(--font-body);
      transition: all 0.3s ease;
      font-size: 0.9rem;
    }

    .btn:hover {
      transform: translateY(-1px);
    }

    .btn-primary {
      background: var(--mint);
      color: var(--dark);
    }

    .btn-primary:hover {
      background: #5fb3a3;
      box-shadow: var(--glow);
    }

    .btn-ghost {
      background: transparent;
      border: 1px solid var(--border);
      color: var(--text);
    }

    .btn-ghost:hover {
      border-color: var(--mint);
      background: var(--hover);
    }

    .messages {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      max-height: 500px;
      overflow-y: auto;
      padding-right: 0.5rem;
    }

    .message {
      display: flex;
      gap: 1rem;
      align-items: flex-start;
    }

    .message-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid var(--border);
      flex-shrink: 0;
    }

    .bubble {
      background: var(--hover);
      border: 1px solid var(--border);
      border-radius: 1rem;
      padding: 1rem;
      flex: 1;
      line-height: 1.5;
    }

    .bubble.agent {
      background: rgba(122, 199, 184, 0.1);
      border-color: var(--mint);
    }

    .bubble.user {
      background: rgba(255, 255, 255, 0.05);
      border-color: var(--text-muted);
    }

    .meta {
      font-size: 0.8rem;
      color: var(--text-muted);
      margin-top: 0.5rem;
    }

    .approvals-panel {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .approval-section {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 1rem;
    }

    .approval-section h3 {
      color: var(--mint);
      font-family: var(--font-head);
      font-size: 1.1rem;
      margin-bottom: 1rem;
    }

    .approval-card {
      background: var(--hover);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 1rem;
      margin-bottom: 1rem;
    }

    .approval-card:last-child {
      margin-bottom: 0;
    }

    .approval-title {
      font-weight: 600;
      color: var(--text);
      margin-bottom: 0.5rem;
    }

    .approval-meta {
      font-size: 0.8rem;
      color: var(--text-muted);
      margin-bottom: 0.5rem;
    }

    .approval-preview {
      font-size: 0.9rem;
      color: var(--text-muted);
      margin-bottom: 1rem;
      line-height: 1.4;
    }

    .approval-actions {
      display: flex;
      gap: 0.5rem;
    }

    .approval-actions .btn {
      padding: 0.5rem 1rem;
      font-size: 0.8rem;
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .chat-interface {
        grid-template-columns: 1fr;
        padding: 1rem;
      }
      
      .agents-grid {
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1rem;
      }
      
      .dashboard {
        padding: 1rem;
      }
      
      .hero-title {
        font-size: 2rem;
      }
      
      .row {
        flex-direction: column;
        align-items: stretch;
      }
    }

    /* Scrollbar Styling */
    ::-webkit-scrollbar {
      width: 8px;
    }

    ::-webkit-scrollbar-track {
      background: var(--card);
    }

    ::-webkit-scrollbar-thumb {
      background: var(--border);
      border-radius: 4px;
    }

    ::-webkit-scrollbar-thumb:hover {
      background: var(--mint);
    }

    /* Modal Styles */
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: 2rem;
    }

    .modal-content {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      box-shadow: var(--shadow);
      width: 100%;
      max-width: 800px;
      max-height: 90vh;
      display: flex;
      flex-direction: column;
    }

    .modal-header {
      padding: 1.5rem;
      border-bottom: 1px solid var(--border);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .modal-header h2 {
      color: var(--mint);
      font-family: var(--font-head);
      margin: 0;
    }

    .modal-close {
      background: none;
      border: none;
      color: var(--text-muted);
      font-size: 1.5rem;
      cursor: pointer;
      padding: 0.5rem;
      border-radius: var(--radius);
      transition: all 0.3s ease;
    }

    .modal-close:hover {
      background: var(--hover);
      color: var(--text);
    }

    .modal-body {
      padding: 1.5rem;
      flex: 1;
      overflow-y: auto;
    }

    .edit-meta {
      background: var(--hover);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 1rem;
      margin-bottom: 1.5rem;
      font-size: 0.9rem;
      line-height: 1.6;
      color: var(--text-muted);
    }

    .edit-section {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .edit-section label {
      font-weight: 600;
      color: var(--text);
    }

    .edit-textarea {
      background: var(--hover);
      border: 1px solid var(--border);
      color: var(--text);
      border-radius: var(--radius);
      padding: 1rem;
      font-family: var(--font-body);
      font-size: 0.9rem;
      line-height: 1.5;
      min-height: 300px;
      resize: vertical;
      outline: none;
      transition: border-color 0.3s ease;
    }

    .edit-textarea:focus {
      border-color: var(--mint);
    }

    .modal-actions {
      padding: 1.5rem;
      border-top: 1px solid var(--border);
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
    }

    @media (max-width: 768px) {
      .modal-overlay {
        padding: 1rem;
      }
      
      .modal-actions {
        flex-direction: column;
      }
      
      .modal-actions .btn {
        width: 100%;
      }
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `}</style>
);

// ---- Icon component (uses DB image if provided; falls back to map) ----
const Icon = ({ label, agentId, imageUrl, className = "" }) => {
  const fallbackMap = {
    supervisor: '/dottysupervisor.png',
    founder: '/kerryfounder.png',
    dementia: '/mollydementia.png',
    cqc: '/bobcqc.png',
    manager: '/suecarehomemanager.png',
    activities: '/nadiaactivities.png',
    designer: '/daveinteriors.png',
    alex: '/alexdesigner.png',
    colin: '/colinquizmaster.png',
    brian: '/brianhistorian.png',
    doris: '/dorispa.png',
    minal: '/minaltrainer.png',
    sid: '/sidsurveymonkey.png',
    social: '/jacksocialmediamanager.png',
    copy: '/jeancopywriter.png',
    bdm: '/violetbusinessdevelopment.png',
    entre: '/jeffentrepreneur.png',
    email: '/ruthemailmarketing.png',
    seo: '/georgeseo.png',
    chef: '/ozziechef.png',
    competitor: '/vincecompetitor.png',
    commissioning: '/andrewcommissions.png',
    tech: '/franktech.png',
    finance: '/jimfinance.png'
  };

  const src = imageUrl || fallbackMap[agentId] || '/dottysupervisor.png';

  return (
    <img
      src={src}
      alt={label}
      className={className || "message-avatar"}
      style={{
        width: className.includes('supervisor') ? '120px' : className.includes('agent') ? '120px' : '40px',
        height: className.includes('supervisor') ? '120px' : className.includes('agent') ? '120px' : '40px',
        borderRadius: '50%',
        objectFit: 'cover'
      }}
    />
  );
};




// ---- Landing Page Component ----
const LandingPage = ({ onEnter }: { onEnter: () => void }) => (
  <div className="landing-page">
    <div className="hero-content">
      <h1 className="hero-title">
        You've heard of silver surfers, now meet the antique AI agents.
      </h1>
      <p className="hero-subtitle">
        The future of care home management is here, powered by wisdom that's been around the block... several times.
      </p>
      <button className="cta-button" onClick={onEnter}>
        Meet The Dream Team
      </button>
    </div>
  </div>
);

// ---- Agent Dashboard Component ----
const AgentDashboard = ({ agents, onAgentSelect }: { agents: Agent[], onAgentSelect: (id: string) => void }) => {
  const supervisor = agents.find(a => a.id === 'supervisor');
  const founder = agents.find(a => a.id === 'founder');
  const otherAgents = agents.filter(a => a.id !== 'supervisor' && a.id !== 'founder');

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <button className="back-button" onClick={() => setCurrentScreen('landing')} style={{ marginBottom: '2rem' }}>
          ← Back to Landing
        </button>
        <button className="back-button" onClick={() => setCurrentScreen('knowledge')} style={{ marginBottom: '2rem', marginLeft: '1rem' }}>
          📚 Manage Knowledge Base
        </button>
        <h1 className="dashboard-title">The Dream Team</h1>
        <p className="dashboard-subtitle">
          Just ask Dotty your question and she'll connect you to the best man/woman/monkey for the job. If you know the agent you need, just click on their face, to speak to them directly. Dotty won't be offended, it'll give her a chance to put the kettle on.
        </p>
      </div>

      {(supervisor || founder) && (
        <div className="supervisor-section">
          {founder && (
            <div className="supervisor-card" onClick={() => onAgentSelect(founder.id)}>
              <Icon label={founder.name} agentId={founder.id} className="supervisor-image" />
              <div className="supervisor-name">{founder.name}</div>
              <div className="supervisor-role">{founder.role}</div>
            </div>
          )}
          {supervisor && (
            <div className="supervisor-card" onClick={() => onAgentSelect(supervisor.id)}>
              <Icon label={supervisor.name} agentId={supervisor.id} className="supervisor-image" />
              <div className="supervisor-name">{supervisor.name}</div>
              <div className="supervisor-role">{supervisor.role}</div>
            </div>
          )}
        </div>
      )}

      <div className="agents-grid">
        {otherAgents.map(agent => (
          <div 
            key={agent.id} 
            className="agent-card"
            onClick={() => onAgentSelect(agent.id)}
          >
            <Icon label={agent.name} agentId={agent.id} className="agent-image" />
            <div className="agent-info">
              <div className="agent-name">{agent.name}</div>
              <div className="agent-role">{agent.role}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ---- Task Input Component ----
const TaskInput = ({ routeTo, setRouteTo, text, setText, onSend, agents }: {
  routeTo: string,
  setRouteTo: (id: string) => void,
  text: string,
  setText: (text: string) => void,
  onSend: () => void,
  agents: Agent[]
}) => (
  <div className="panel">
    <div className="panel-title">New Task</div>
    <div className="compose">
      <div className="row">
        <select value={routeTo} onChange={(e) => setRouteTo(e.target.value)}>
          {agents.map(a => (
            <option key={a.id} value={a.id}>{a.name} - {a.role}</option>
          ))}
        </select>
        <button className="btn btn-ghost">Upload File</button>
      </div>
      <div className="row">
        <input type="text" placeholder="Task title (optional)" />
      </div>
      <textarea 
        value={text} 
        onChange={(e) => setText(e.target.value)} 
        placeholder="Describe your task or ask a question..."
      />
      <div className="actions">
        <button className="btn btn-primary" onClick={onSend}>
          Send to {agents.find(a => a.id === routeTo)?.role || 'Agent'}
        </button>
        <button className="btn btn-ghost" onClick={() => setText("")}>
          Clear
        </button>
      </div>
    </div>
  </div>
);

// ---- Chat Component ----
const Chat = ({ messages, agents }: { messages: Message[], agents: Agent[] }) => (
  <div className="panel">
    <div className="panel-title">Conversation</div>
    <div className="panel-body">
      <div className="messages">
        {messages.length === 0 && (
          <div className="meta">No messages yet. Send a task above to start the conversation.</div>
        )}
        {messages.map((m, i) => (
          <div className="message" key={i}>
            <Icon label={m.agent_name || 'You'} agentId={m.agent_id || 'user'} />
            <div style={{ flex: 1 }}>
              <div className={`bubble ${m.role === 'user' ? 'user' : 'agent'}`}>
                <div style={{ whiteSpace: 'pre-wrap' }}>{m.content}</div>
              </div>
              <div className="meta">{m.agent_name || 'You'} • {new Date(m.created_at).toLocaleTimeString()}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ---- Approvals Component ----
const Approvals = ({ tickets, setTickets }: { tickets: Ticket[], setTickets: React.Dispatch<React.SetStateAction<Ticket[]>> }) => {
  const [editingTicket, setEditingTicket] = useState<Ticket | null>(null);
  const [editContent, setEditContent] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const approve = async (id: string) => {
    try {
      await updateTicketStatus(id, 'Approved');
      setTickets(prev => prev.map(t => t.id === id ? { ...t, status: 'Approved' as const } : t));
    } catch (err) {
      console.error('Error approving ticket:', err);
    }
  };
  
  const openEditor = (ticket: Ticket) => {
    setEditingTicket(ticket);
    setEditContent(ticket.preview); // Start with the preview content
  };
  
  const closeEditor = () => {
    setEditingTicket(null);
    setEditContent('');
  };
  
  const saveChanges = async () => {
    if (!editingTicket) return;
    
    setIsUpdating(true);
    try {
      // Update the ticket with new content
      const { error } = await supabase
        .from('tickets')
        .update({ 
          preview: editContent,
          updated_at: new Date().toISOString() 
        })
        .eq('id', editingTicket.id);

      if (error) throw error;

      // Update local state
      setTickets(prev => prev.map(t => 
        t.id === editingTicket.id 
          ? { ...t, preview: editContent, updated_at: new Date().toISOString() }
          : t
      ));
      
      closeEditor();
    } catch (err) {
      console.error('Error updating ticket:', err);
      alert('Failed to save changes. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };
  
  const needsApproval = tickets.filter(t => t.status === 'Needs Approval');
  const drafts = tickets.filter(t => t.status === 'Draft');

  return (
    <>
      <div className="approvals-panel">
      <div className="approval-section">
        <h3>Needs Approval</h3>
        {needsApproval.map(t => (
          <div className="approval-card" key={t.id}>
            <div className="approval-title">{t.title}</div>
            <div className="approval-meta">Agent: {t.agent_name}</div>
            <div className="approval-preview">{t.preview}</div>
            <div className="approval-actions">
              <button className="btn btn-primary" onClick={() => approve(t.id)}>
                Approve
              </button>
              <button className="btn btn-ghost" onClick={() => openEditor(t)}>
                View/Edit
              </button>
            </div>
          </div>
        ))}
        {needsApproval.length === 0 && (
          <div className="meta">No items awaiting approval</div>
        )}
      </div>

      <div className="approval-section">
        <h3>Drafts</h3>
        {drafts.map(t => (
          <div className="approval-card" key={t.id}>
            <div className="approval-title">{t.title}</div>
            <div className="approval-meta">Agent: {t.agent_name}</div>
            <div className="approval-preview">{t.preview}</div>
            <div className="approval-actions">
              <button className="btn btn-primary" onClick={() => approve(t.id)}>
                Approve
              </button>
              <button className="btn btn-ghost" onClick={() => openEditor(t)}>
                View/Edit
              </button>
            </div>
          </div>
        ))}
        {drafts.length === 0 && (
          <div className="meta">No draft items</div>
        )}
      </div>
      </div>
      
      {/* Edit Modal */}
      {editingTicket && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Edit Response</h2>
              <button className="modal-close" onClick={closeEditor}>×</button>
            </div>
            <div className="modal-body">
              <div className="edit-meta">
                <strong>Title:</strong> {editingTicket.title}<br/>
                <strong>Agent:</strong> {editingTicket.agent_name}<br/>
                <strong>Status:</strong> {editingTicket.status}<br/>
                <strong>Created:</strong> {new Date(editingTicket.created_at).toLocaleString()}
              </div>
              <div className="edit-section">
                <label htmlFor="edit-content">Response Content:</label>
                <textarea
                  id="edit-content"
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="edit-textarea"
                  placeholder="Edit the response content..."
                />
              </div>
            </div>
            <div className="modal-actions">
              <button 
                className="btn btn-primary" 
                onClick={saveChanges}
                disabled={isUpdating}
              >
                {isUpdating ? 'Saving...' : 'Save Changes'}
              </button>
              <button 
                className="btn btn-primary" 
                onClick={async () => {
                  await saveChanges();
                  if (editingTicket) {
                    await approve(editingTicket.id);
                  }
                }}
                disabled={isUpdating}
              >
                Save & Approve
              </button>
              <button className="btn btn-ghost" onClick={closeEditor}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// ---- Main App ----
export default function DreamTeamApp() {
  const [currentScreen, setCurrentScreen] = useState('landing'); // 'landing', 'dashboard', 'chat', 'knowledge'
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeId, setActiveId] = useState('supervisor');
  const [routeTo, setRouteTo] = useState('supervisor');
  const [text, setText] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);

  // Load data from Supabase on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [agentsData, messagesData, ticketsData] = await Promise.all([
          fetchAgents(),
          fetchMessages(),
          fetchTickets()
        ]);
        
        setAgents(agentsData);
        setMessages(messagesData);
        setTickets(ticketsData);
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Failed to load data from database');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleEnterApp = () => {
    setCurrentScreen('dashboard');
  };

  const handleAgentSelect = (agentId) => {
    setActiveId(agentId);
    setRouteTo(agentId);
    setCurrentScreen('chat');
    
   // Create personalized greeting based on agent
let greeting = '';
switch (agentId) {
  case 'founder':
    greeting = `Hello! I'm Kerry, the founder of this amazing care home concept. I'm passionate about revolutionizing elderly care and would love to help you with any questions about our vision, strategy, or business development. How can I assist you today?`;
    break;

  case 'supervisor':
    greeting = `Hello there! I'm Dotty, your friendly supervisor. I've been managing care teams for decades and I'm here to help coordinate your requests with the right team members. What can I help you with today?`;
    break;

  case 'dementia':
    greeting = `Hello! I'm Molly, your dementia care specialist. I have extensive experience in creating supportive environments for residents with dementia and their families. How can I help you today?`;
    break;

  case 'cqc':
    greeting = `Good day! I'm Bob, your CQC compliance expert. I'll help ensure everything meets regulatory standards and best practices. What compliance or quality matters can I assist you with?`;
    break;

  case 'manager':
    greeting = `Hello! I'm Sue, your care home manager. I oversee daily operations and staff management. How can I help you improve your care home operations today?`;
    break;

  case 'activities':
    greeting = `Hi there! I'm Nadia, your activities coordinator. I specialize in creating engaging, meaningful activities for residents. What kind of programming can I help you develop?`;
    break;

  // NEW — Alex (Designer)
  case 'alex':
  case 'alexdesigner':
  case 'designer_alex':
    greeting = `Hello! I'm Alex, your designer. I focus on layouts, signage, and visual identity that help residents feel at home. What would you like to design or refresh today?`;
    break;

  // Existing — Dave (Interior Designer)
  case 'designer':
    greeting = `Hello! I'm Dave, your interior design specialist. I create beautiful, functional spaces that feel like home for residents. How can I help with your design needs?`;
    break;

  // NEW — Colin (Quizmaster / Engagement)
  case 'colin':
  case 'quizmaster':
    greeting = `Hi! I'm Colin, your quizmaster and engagement lead. I build lively activities that spark conversation and joy. Fancy a quiz pack or an activity plan?`;
    break;

  // NEW — Brian (Historian / Reminiscence)
  case 'brian':
  case 'historian':
    greeting = `Hello! I'm Brian, your social historian. I create reminiscence materials and local-history themes that residents love. What era or topic should we explore?`;
    break;

  // NEW — Doris (PA / Admin Support)
  case 'doris':
  case 'pa':
    greeting = `Hello dear! I'm Doris, your PA. I’m here to tidy tasks, format documents, and keep everything shipshape. What would you like me to organise today?`;
    break;

  // NEW — Minal (Trainer)
  case 'minal':
  case 'trainer':
    greeting = `Hello! I'm Minal, your training lead. I build bite-sized training, inductions, and competency checklists. What would you like your team trained on?`;
    break;

  // NEW — Sid (Survey Monkey / Surveys)
  case 'sid':
  case 'surveys':
    greeting = `Hi! I'm Sid, your surveys guy. I create family, resident, and staff surveys — and turn results into clear actions. What survey do you need right now?`;
    break;

  case 'social':
    greeting = `Hey! I'm Jack, your social media manager. I'll help you connect with families and the community through engaging digital content. What's your social media goal?`;
    break;

  case 'copy':
    greeting = `Hello! I'm Jean, your copywriter. I craft compelling content that tells your care home's story. What writing project can I help you with today?`;
    break;

  case 'bdm':
    greeting = `Hello! I'm Violet, your business development manager. I focus on growth strategies and building partnerships. How can I help expand your reach?`;
    break;

  case 'entre':
    greeting = `Hi! I'm Jeff, your entrepreneurial advisor. I help with innovative business solutions and strategic thinking. What challenge can we tackle together?`;
    break;

  case 'email':
    greeting = `Hello! I'm Ruth, your email marketing specialist. I create campaigns that keep families informed and engaged. What email strategy can I develop for you?`;
    break;

  case 'seo':
    greeting = `Hello! I'm George, your SEO specialist. I help people find your care home online when they need it most. How can I improve your digital visibility?`;
    break;

  case 'chef':
    greeting = `Hello! I'm Ozzie, your food and nutrition expert. I create delicious, healthy meals that residents love. How can I help with your dining program?`;
    break;

  case 'competitor':
    greeting = `Hello! I'm Vince, your competitive intelligence analyst. I keep track of what others are doing so you can stay ahead. What market insights do you need?`;
    break;

  case 'commissioning':
    greeting = `Hello! I'm Andrew, your commissioning specialist. I help secure contracts and build relationships with local authorities. How can I support your commissioning goals?`;
    break;

  case 'tech':
    greeting = `Hello! I'm Frank, your tech specialist. I handle all the digital systems that keep your care home running smoothly. What technical challenge can I solve?`;
    break;

  case 'finance':
    greeting = `Hello! I'm Jim, your finance manager. I help with budgets, costs, and financial planning to keep your care home profitable and sustainable. How can I help with your finances?`;
    break;

  default: {
    const a = agents.find(a => a.id === agentId);
    greeting = `Hello! I'm ${a?.name ?? 'your assistant'}, your ${a?.role?.toLowerCase() ?? 'agent'}. How can I help you today?`;
  }
}

      setMessages([{
        id: 'initial-' + Date.now(),
        role: 'agent',
        content: greeting,
        agent_id: agentId,
        agent_name: agent.name,
        created_at: new Date().toISOString()
      }]);
    }
  };

  const handleBackToDashboard = () => {
    setCurrentScreen('dashboard');
  };

  const draftWithAgent = async () => {
    if (!text.trim()) return;
    
    const agent = agents.find(a => a.id === routeTo);
    const agentName = agent?.name || 'Agent';
    const agentRole = agent?.role || 'Assistant';
    
    try {
      // Add user message to database
      const userMessage = await createMessage({
        role: 'user',
        content: text,
        agent_id: routeTo,
        agent_name: 'You'
      });
      
      // Update local state
      setMessages(m => [...m, userMessage]);

      // Call the AI chat function
      const chatResponse = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: text,
          agentId: routeTo,
          agentName: agentName,
          agentRole: agentRole
        }),
      });

      if (!chatResponse.ok) {
        throw new Error('Failed to get AI response');
      }

      const { response: aiResponse } = await chatResponse.json();

      // Add AI response to database
      const agentMessage = await createMessage({
        role: 'agent',
        content: aiResponse,
        agent_id: routeTo,
        agent_name: agentName
      });
      
      setMessages(m => [...m, agentMessage]);
      
      // Refresh tickets from database
      const updatedTickets = await fetchTickets();
      setTickets(updatedTickets);
      
      setText("");
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message');
    }
  };

  // Show loading state
  if (loading) {
    return (
      <>
        <FontLinks />
        <GlobalStyles />
        <div style={{ 
          minHeight: '100vh', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          background: 'var(--dark)',
          color: 'var(--text)',
          fontFamily: 'var(--font-body)'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              border: '3px solid var(--border)', 
              borderTop: '3px solid var(--mint)',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 1rem'
            }} />
            <p>Loading Dream Team...</p>
          </div>
        </div>
      </>
    );
  }

  // Show error state
  if (error) {
    return (
      <>
        <FontLinks />
        <GlobalStyles />
        <div style={{ 
          minHeight: '100vh', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          background: 'var(--dark)',
          color: 'var(--text)',
          fontFamily: 'var(--font-body)'
        }}>
          <div style={{ textAlign: 'center', maxWidth: '400px', padding: '2rem' }}>
            <h2 style={{ color: 'var(--mint)', marginBottom: '1rem' }}>Connection Error</h2>
            <p style={{ marginBottom: '2rem' }}>{error}</p>
            <button 
              className="btn btn-primary" 
              onClick={() => window.location.reload()}
              style={{
                background: 'var(--mint)',
                color: 'var(--dark)',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: 'var(--radius)',
                cursor: 'pointer'
              }}
            >
              Retry
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <FontLinks />
      <GlobalStyles />
      
      {currentScreen === 'landing' && (
        <LandingPage onEnter={handleEnterApp} />
      )}
      
      {currentScreen === 'dashboard' && (
        <AgentDashboard 
          agents={agents} 
          onAgentSelect={handleAgentSelect} 
        />
      )}
      
      {currentScreen === 'chat' && (
        <div className="chat-interface">
          <div className="chat-main">
            <button className="back-button" onClick={handleBackToDashboard}>
              ← Back to Dashboard
            </button>
            <TaskInput 
              routeTo={routeTo} 
              setRouteTo={setRouteTo} 
              text={text} 
              setText={setText} 
              onSend={draftWithAgent}
              agents={agents}
            />
            <Chat messages={messages} agents={agents} />
          </div>
          <Approvals tickets={tickets} setTickets={setTickets} />
        </div>
      )}
      
      {currentScreen === 'knowledge' && (
        <div className="dashboard">
          <button className="back-button" onClick={() => setCurrentScreen('dashboard')} style={{ marginBottom: '2rem' }}>
            ← Back to Dashboard
          </button>
          <KnowledgeUpload 
            agents={agents} 
            onUploadComplete={() => {
              console.log('Knowledge upload completed');
            }} 
          />
        </div>
      )}
    </>
  );
}
