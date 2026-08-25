import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import ResumeUpload from './components/ResumeUpload';
import LearningAssistant from './components/LearningAssistant';
import FakeReviewDetector from './components/FakeReviewDetector';
import './App.css';

const PrivateRoute = ({ children }) => {
  return localStorage.getItem('token') ? children : <Navigate to="/" />;
};

function App() {
  return (
    <BrowserRouter>
      <div className="container">
        <Routes>
          <Route path="/" element={<Auth />} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/resume" element={<PrivateRoute><ResumeUpload /></PrivateRoute>} />
          <Route path="/learning" element={<PrivateRoute><LearningAssistant /></PrivateRoute>} />
          <Route path="/reviews" element={<PrivateRoute><FakeReviewDetector /></PrivateRoute>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
