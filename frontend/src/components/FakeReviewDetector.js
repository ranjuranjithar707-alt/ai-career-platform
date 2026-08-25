import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function FakeReviewDetector() {
  const [review, setReview] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleDetect = async () => {
    if (!review.trim()) return alert('Please paste a review!');
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:5050/api/reviews/detect', 
        { review },
        { headers: { Authorization: 'Bearer ' + token } }
      );
      setResult(res.data);
    } catch (err) {
      alert('Failed to analyze review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <button onClick={() => navigate('/dashboard')} className="btn-back">← Back to Dashboard</button>
      
      <div className="feature-card">
        <div className="feature-header">
          <div className="feature-icon" style={{ background: 'rgba(236,72,153,0.15)' }}>🔍</div>
          <div>
            <h2>Fake Review Detector</h2>
            <p>Paste a review to check if it's genuine or fake</p>
          </div>
        </div>
        
        <textarea
          rows={5}
          placeholder="Paste a product or course review here..."
          value={review}
          onChange={(e) => setReview(e.target.value)}
          style={{ marginTop: '15px' }}
        />
        <button onClick={handleDetect} disabled={loading} className="btn-detect" style={{ marginTop: '10px' }}>
          {loading ? '⏳ Analyzing...' : '🔍 Detect Review'}
        </button>
      </div>

      {result && (
        <div className="feature-card result-card">
          <h3>📊 Detection Result</h3>
          
          <div className="result-badge" style={{
            background: result.isFake ? 'rgba(239,68,68,0.15)' : 'rgba(34,197,94,0.15)',
            border: `1px solid ${result.isFake ? 'rgba(239,68,68,0.3)' : 'rgba(34,197,94,0.3)'}`,
            color: result.isFake ? '#ef4444' : '#22c55e'
          }}>
            {result.isFake ? '⚠️ Likely Fake Review' : '✅ Likely Genuine Review'}
          </div>

          {result.confidence && (
            <div className="confidence-section">
              <h4>Confidence</h4>
              <div className="confidence-bar">
                <div className="confidence-fill" style={{ 
                  width: `${(result.confidence * 100)}%`,
                  background: result.isFake ? '#ef4444' : '#22c55e'
                }} />
              </div>
              <span>{(result.confidence * 100).toFixed(1)}%</span>
            </div>
          )}

          {result.reasons && result.reasons.length > 0 && (
            <div className="result-section">
              <h4>📝 Reasons</h4>
              <ul className="reasons-list">
                {result.reasons.map((reason, i) => (
                  <li key={i}>{reason}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default FakeReviewDetector;
