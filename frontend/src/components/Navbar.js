import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  // Hide navbar on login/register pages
  if (location.pathname === '/' || location.pathname === '/register') {
    return null;
  }

  return (
    <div className="navbar">
      <h1 onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer' }}>
        🚀 AI Career Assistant
      </h1>
      <nav>
        <button onClick={() => navigate('/dashboard')}>Dashboard</button>
        <button onClick={() => navigate('/resume')}>Resume</button>
        <button onClick={() => navigate('/learning')}>Learning</button>
        <button onClick={() => navigate('/reviews')}>Reviews</button>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '0 0.5rem' }}>
          {user.name || ''}
        </span>
        <button onClick={handleLogout} style={{ color: '#ef4444' }}>Logout</button>
      </nav>
    </div>
  );
}

export default Navbar;
