import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Landing      from './pages/Landing';
import Login        from './pages/Login';
import Signup       from './pages/Signup';
import Dashboard    from './pages/Dashboard';
import LearningPath from './pages/LearningPath';
import Profile      from './pages/Profile';
import './App.css';

function PrivateRoute({ children }) {
  return localStorage.getItem('token') ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"              element={<Landing />} />
        <Route path="/login"         element={<Login />} />
        <Route path="/signup"        element={<Signup />} />
        <Route path="/dashboard"     element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/learning-path" element={<PrivateRoute><LearningPath /></PrivateRoute>} />
        <Route path="/profile"       element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="*"              element={<Navigate to="/" />} />
      </Routes>

      {/* Developer Credit — fixed at bottom, always visible on all pages */}
      <div style={{
        position:   'fixed',
        bottom:     '10px',
        left:       '50%',
        transform:  'translateX(-50%)',
        zIndex:     9999,
        textAlign:  'center',
        pointerEvents: 'none',
      }}>
        <span style={{
          fontFamily:  "'Cinzel', serif",
          fontSize:    '10px',
          letterSpacing: '2.5px',
          background:  'linear-gradient(135deg, #8B6914, #C9A84C, #F0D080, #C9A84C)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor:  'transparent',
          textTransform: 'uppercase',
          opacity: 0.8,
        }}>
          ✦ Developed by Hasna Mubarak Azeem ✦
        </span>
      </div>
    </BrowserRouter>
  );
}