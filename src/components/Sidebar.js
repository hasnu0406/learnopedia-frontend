import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const navItems = [
  { label: 'The Great Hall', path: '/dashboard', icon: '🏰' },
  { label: 'My Learning Path', path: '/learning-path', icon: '📜' },
  { label: 'Wizard Profile', path: '/profile', icon: '🧙' },
];

const HOUSE_COLORS = {
  gryffindor: { bg: '#6B0F1A', accent: '#C9A84C' },
  slytherin: { bg: '#1A3A2A', accent: '#80B080' },
  ravenclaw: { bg: '#0D1B2A', accent: '#9BB0D0' },
  hufflepuff: { bg: '#3A2A0A', accent: '#F0C040' },
};

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [house] = useState('gryffindor');
  const hc = HOUSE_COLORS[house];

  return (
    <div style={{
      width: '240px', minHeight: '100vh',
      background: `linear-gradient(180deg, #0A0A0A 0%, ${hc.bg}22 50%, #0A0A0A 100%)`,
      borderRight: `1px solid ${hc.accent}33`,
      display: 'flex', flexDirection: 'column',
      padding: '0',
      position: 'fixed', left: 0, top: 0, bottom: 0, zIndex: 100,
    }}>
      {/* Crest area */}
      <div style={{
        padding: '32px 20px 24px',
        borderBottom: `1px solid ${hc.accent}22`,
        textAlign: 'center',
        background: `linear-gradient(180deg, ${hc.bg}44 0%, transparent 100%)`,
      }}>
        <div style={{ fontSize: '48px', marginBottom: '8px', animation: 'float 4s ease-in-out infinite' }}>⚡</div>
        <div style={{
          fontFamily: "'Cinzel Decorative', cursive",
          fontSize: '13px', fontWeight: 700,
          background: `linear-gradient(135deg, ${hc.accent}, #fff, ${hc.accent})`,
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          letterSpacing: '1px', lineHeight: 1.3,
        }}>
          Learnopedia
        </div>
        <div style={{
          fontFamily: "'Cinzel', serif",
          fontSize: '9px', color: hc.accent,
          letterSpacing: '4px', marginTop: '4px',
          opacity: 0.7,
        }}>THE MAGICAL GUIDANCE</div>
        <div style={{
          width: '80px', height: '1px', margin: '14px auto 0',
          background: `linear-gradient(90deg, transparent, ${hc.accent}, transparent)`,
        }} />
      </div>

      {/* Nav */}
      <div style={{ flex: 1, padding: '20px 12px' }}>
        {navItems.map(item => {
          const active = location.pathname === item.path;
          return (
            <button key={item.path} onClick={() => navigate(item.path)} style={{
              width: '100%',
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '14px 16px', marginBottom: '6px',
              background: active ? `${hc.accent}18` : 'transparent',
              border: active ? `1px solid ${hc.accent}55` : '1px solid transparent',
              borderRadius: '8px',
              color: active ? hc.accent : '#7A6A4A',
              fontFamily: "'Cinzel', serif",
              fontSize: '11px', letterSpacing: '1.5px',
              cursor: 'none', transition: 'all 0.25s', textAlign: 'left',
            }}>
              <span style={{ fontSize: '18px' }}>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Spell / Logout */}
      <div style={{ padding: '16px 12px 24px' }}>
        <div style={{
          fontFamily: "'IM Fell English', serif",
          fontSize: '11px', fontStyle: 'italic',
          color: '#C9A84C44', textAlign: 'center',
          marginBottom: '12px',
        }}>
          "It does not do to dwell on dreams"
        </div>
        <button onClick={() => { localStorage.removeItem('token'); navigate('/'); }} style={{
          width: '100%', padding: '12px',
          background: 'transparent',
          border: `1px solid ${hc.accent}33`,
          borderRadius: '8px', color: hc.accent,
          fontFamily: "'Cinzel', serif",
          fontSize: '10px', letterSpacing: '2px', cursor: 'none',
        }}>
          🚪 DISENCHANT!
        </button>
      </div>
    </div>
  );
}