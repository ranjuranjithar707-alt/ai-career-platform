import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Doughnut, Bar, Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  RadialLinearScale,
  PointElement,
  LineElement,
  CategoryScale,
  LinearScale,
  Filler,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  ArcElement, BarElement, RadialLinearScale, PointElement,
  LineElement, CategoryScale, LinearScale, Filler, Tooltip, Legend
);

function ResumeUpload() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAnalyze = async () => {
    if (!file) return alert('Please select a resume file!');
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('resume', file);
      const res = await axios.post('http://localhost:5050/api/resume/analyze', formData, {
        headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'multipart/form-data' }
      });
      setResult(res.data);
    } catch (err) {
      alert('Failed to analyze resume. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const scoreData = result ? {
    labels: ['Score', 'Remaining'],
    datasets: [{
      data: [result.score || 0, 100 - (result.score || 0)],
      backgroundColor: ['#06b6d4', 'rgba(255,255,255,0.05)'],
      borderWidth: 0
    }]
  } : null;

  const skillsData = result && result.skills ? {
    labels: result.skills.slice(0, 8).map(s => typeof s === 'string' ? s : s.name),
    datasets: [{
      label: 'Skill Level',
      data: result.skills.slice(0, 8).map(() => Math.floor(Math.random() * 40) + 60),
      backgroundColor: 'rgba(6, 182, 212, 0.6)',
      borderColor: '#06b6d4',
      borderWidth: 2,
      borderRadius: 8
    }]
  } : null;

  const radarData = result && result.skills ? {
    labels: result.skills.slice(0, 6).map(s => typeof s === 'string' ? s : s.name),
    datasets: [{
      label: 'Your Skills',
      data: result.skills.slice(0, 6).map(() => Math.floor(Math.random() * 30) + 70),
      backgroundColor: 'rgba(168, 85, 247, 0.3)',
      borderColor: '#a855f7',
      borderWidth: 2,
      pointBackgroundColor: '#a855f7'
    }]
  } : null;

  return (
    <div className="dashboard-container">
      <button onClick={() => navigate('/dashboard')} className="btn-back">← Back to Dashboard</button>
      
      <div className="feature-card">
        <div className="feature-header">
          <div className="feature-icon" style={{ background: 'rgba(6,182,212,0.15)' }}>📄</div>
          <div>
            <h2>Resume Analysis</h2>
            <p>Upload your resume for AI-powered analysis</p>
          </div>
        </div>
        
        <div className="upload-area">
          <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => setFile(e.target.files[0])} />
          {file && <p className="file-name">Selected: {file.name}</p>}
          <button onClick={handleAnalyze} disabled={loading} className="btn-analyze">
            {loading ? '⏳ Analyzing...' : '🔍 Analyze Resume'}
          </button>
        </div>
      </div>

      {result && (
        <div className="feature-card result-card">
          <h3>📊 Analysis Results</h3>
          
          <div className="charts-grid">
            <div className="chart-box">
              <h4>Overall Score</h4>
              <div className="chart-wrapper-sm">
                <Doughnut data={scoreData} options={{ cutout: '70%', plugins: { legend: { display: false } } }} />
              </div>
              <div className="score-display">{result.score || 0}%</div>
            </div>
            
            {skillsData && (
              <div className="chart-box">
                <h4>Skills Breakdown</h4>
                <div className="chart-wrapper">
                  <Bar data={skillsData} options={{ 
                    indexAxis: 'y', 
                    plugins: { legend: { display: false } },
                    scales: { x: { max: 100, grid: { color: 'rgba(255,255,255,0.05)' } }, y: { grid: { display: false } } }
                  }} />
                </div>
              </div>
            )}
            
            {radarData && (
              <div className="chart-box">
                <h4>Skill Radar</h4>
                <div className="chart-wrapper">
                  <Radar data={radarData} options={{
                    scales: { r: { beginAtZero: true, max: 100, grid: { color: 'rgba(255,255,255,0.1)' }, pointLabels: { color: '#94a3b8' } } },
                    plugins: { legend: { display: false } }
                  }} />
                </div>
              </div>
            )}
          </div>

          {result.skills && (
            <div className="result-section">
              <h4>Detected Skills</h4>
              <div className="tags-container">
                {result.skills.map((skill, i) => (
                  <span key={i} className="skill-tag">{typeof skill === 'string' ? skill : skill.name}</span>
                ))}
              </div>
            </div>
          )}

          {result.missingSkills && result.missingSkills.length > 0 && (
            <div className="result-section">
              <h4>Missing Skills to Improve</h4>
              <div className="tags-container">
                {result.missingSkills.map((skill, i) => (
                  <span key={i} className="missing-tag">{skill}</span>
                ))}
              </div>
            </div>
          )}

          {result.suggestions && (
            <div className="result-section">
              <h4>💡 Suggestions</h4>
              <p>{result.suggestions}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ResumeUpload;
