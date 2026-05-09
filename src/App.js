import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Landing      from './pages/Landing';
import Login        from './pages/Login';
import Signup       from './pages/Signup';
import Dashboard    from './pages/Dashboard';
import LearningPath from './pages/LearningPath';
import Profile      from './pages/Profile';
import CursorFX     from './components/CursorFX';
import './App.css';

function PrivateRoute({ children }) {
  return localStorage.getItem('token') ? children : <Navigate to="/login" />;
}

function SmartCursor() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Only show custom cursor if device has a real mouse
    const hasTouch    = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const isMobile    = window.innerWidth <= 768;
    const hasMouse    = window.matchMedia('(pointer: fine)').matches;

    if (!hasTouch && !isMobile && hasMouse) {
      setShow(true);
    }
  }, []);

  if (!show) return null;
  return <CursorFX />;
}

export default function App() {
  return (
    <BrowserRouter>
      <SmartCursor />
      <Routes>
        <Route path="/"              element={<Landing />} />
        <Route path="/login"         element={<Login />} />
        <Route path="/signup"        element={<Signup />} />
        <Route path="/dashboard"     element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/learning-path" element={<PrivateRoute><LearningPath /></PrivateRoute>} />
        <Route path="/profile"       element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="*"              element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}