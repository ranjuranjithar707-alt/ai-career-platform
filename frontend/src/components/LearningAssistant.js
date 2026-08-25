import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function LearningAssistant() {
  const [topic, setTopic] = useState('');
  const [learningPath, setLearningPath] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGenerate = async () => {
    if (!topic) return alert('Please enter a topic!');
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:5050/api/learning/generate', 
        { topic },
        { headers: { Authorization: 'Bearer ' + token } }
      );
      setLearningPath(res.data);
    } catch (err) {
      alert('Failed to generate learning path');
    } finally {
      setLoading(false);
    }
  };

  const videoTopics = [
    { title: 'Complete Tutorial', query: topic + ' complete tutorial for beginners', icon: '🎬' },
    { title: 'Advanced Concepts', query: topic + ' advanced concepts explained', icon: '🚀' },
    { title: 'Real World Projects', query: topic + ' real world project tutorial', icon: '💼' }
  ];

  return (
    <div className="dashboard-container">
      <button onClick={() => navigate('/dashboard')} className="btn-back">← Back to Dashboard</button>
      
      <div className="feature-card">
        <div className="feature-header">
          <div className="feature-icon" style={{ background: 'rgba(168,85,247,0.15)' }}>📚</div>
          <div>
            <h2>Learning Assistant</h2>
            <p>Enter a topic to get a personalized learning path</p>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
          <input
            type="text"
            placeholder="e.g. React, Python, Machine Learning..."
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            style={{ flex: 1 }}
          />
          <button onClick={handleGenerate} disabled={loading} className="btn-generate">
            {loading ? '⏳ Generating...' : '🎯 Generate Path'}
          </button>
        </div>
      </div>

      {learningPath && (
        <div className="feature-card result-card">
          <h3>🎯 Learning Path for: {learningPath.topic}</h3>
          
          {learningPath.modules && learningPath.modules.length > 0 && (
            <div className="result-section">
              <h4>📋 Modules</h4>
              {learningPath.modules.map((module, idx) => (
                <div key={idx} className="module-item">
                  <span className="module-number">{idx + 1}</span>
                  <span>{typeof module === 'string' ? module : module.title || JSON.stringify(module)}</span>
                </div>
              ))}
            </div>
          )}

          <div className="result-section">
            <h4>🎬 Recommended Videos</h4>
            <div className="video-grid">
              {videoTopics.map((v, i) => (
                <a 
                  key={i} 
                  href={`https://www.youtube.com/results?search_query=${encodeURIComponent(v.query)}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="video-card"
                >
                  <span className="video-icon">{v.icon}</span>
                  <span className="video-title">{v.title}</span>
                  <span className="video-subtitle">Watch on YouTube →</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LearningAssistant;
