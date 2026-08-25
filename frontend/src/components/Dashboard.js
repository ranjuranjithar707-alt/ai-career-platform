import React from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const features = [
    {
      icon: '📄',
      title: 'Resume Analysis',
      desc: 'Upload your resume and get AI-powered analysis with skill scores, match rate, and improvement suggestions.',
      btn: 'Analyze Resume',
      path: '/resume',
      color: '#06b6d4'
    },
    {
      icon: '📚',
      title: 'Learning Assistant',
      desc: 'Enter a topic and get a personalized learning path with modules, difficulty levels, and video recommendations.',
      btn: 'Generate Path',
      path: '/learning',
      color: '#a855f7'
    },
    {
      icon: '🔍',
      title: 'Fake Review Detector',
      desc: 'Paste any product or course review and our AI will detect whether it is genuine or fake.',
      btn: 'Detect Reviews',
      path: '/reviews',
      color: '#ec4899'
    }
  ];

  return (
    <div className="dashboard-container">
      <div className="welcome-section">
        <h2>Welcome back, {user.name || 'User'} 👋</h2>
        <p>Choose a feature below to get started</p>
      </div>

      <div className="dashboard-grid">
        {features.map((f, i) => (
          <div key={i} className="grid-card" style={{ borderTop: `3px solid ${f.color}` }}>
            <div className="card-icon" style={{
              background: `${f.color}15`,
              border: `1px solid ${f.color}30`
            }}>
              <span>{f.icon}</span>
            </div>
            <h3 style={{ color: f.color }}>{f.title}</h3>
            <p>{f.desc}</p>
            <button
              onClick={() => navigate(f.path)}
              className="btn-feature"
              style={{ background: `linear-gradient(135deg, ${f.color}, ${f.color}cc)` }}
            >
              {f.btn} →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
