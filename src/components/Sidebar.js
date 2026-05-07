import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const navItems = [
  { label: 'Great Hall', path: '/dashboard',     icon: '🏰' },
  { label: 'My Path',    path: '/learning-path', icon: '📜' },
  { label: 'Profile',    path: '/profile',        icon: '🧙' },
];

export default function Sidebar() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <>
      {/* ══ DESKTOP SIDEBAR ══ */}
      <div style={{
        width: '240px', minHeight: '100vh',
        background: '#0C0C0C',
        borderRight: '1px solid #C9A84C18',
        display: 'flex', flexDirection: 'column',
        padding: '36px 0',
        position: 'fixed', left: 0, top: 0, bottom: 0, zIndex: 100,
      }} className="desktop-sidebar">

        <div style={{ textAlign: 'center', marginBottom: '44px', padding: '0 20px' }}>
          <div style={{ fontSize: '28px', marginBottom: '6px' }}>⚡</div>
          <div style={{
            fontFamily: "'Cinzel Decorative', cursive",
            fontSize: '13px', fontWeight: 700,
            background: 'linear-gradient(135deg, #C9A84C, #F0D080)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            letterSpacing: '1px',
          }}>Learnopedia AI</div>
          <div style={{
            fontFamily: "'Cinzel', serif", fontSize: '8px',
            color: '#C9A84C88', letterSpacing: '3px', marginTop: '4px',
          }}>GATEWAY OF MAGICAL GUIDANCE</div>
          <div style={{
            width: '60px', height: '1px', margin: '12px auto 0',
            background: 'linear-gradient(90deg, transparent, #C9A84C44, transparent)',
          }} />
        </div>

        <div style={{ flex: 1, padding: '0 14px' }}>
          {navItems.map(item => {
            const active = location.pathname === item.path;
            return (
              <button key={item.path} onClick={() => navigate(item.path)} style={{
                width: '100%',
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '14px 16px', marginBottom: '6px',
                background: active ? '#C9A84C12' : 'transparent',
                border: active ? '1px solid #C9A84C44' : '1px solid transparent',
                borderRadius: '10px',
                color: active ? '#F0D080' : '#7A6A4A',
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

        <div style={{ padding: '0 14px 12px' }}>
          <div style={{
            fontFamily: "'IM Fell English', serif", fontSize: '11px',
            fontStyle: 'italic', color: '#C9A84C33',
            textAlign: 'center', marginBottom: '12px',
          }}>
            "It does not do to dwell on dreams"
          </div>
          <button onClick={handleLogout} style={{
            width: '100%', padding: '12px',
            background: 'transparent', border: '1px solid #C9A84C33',
            borderRadius: '8px', color: '#C9A84C',
            fontFamily: "'Cinzel', serif",
            fontSize: '10px', letterSpacing: '2px', cursor: 'none',
          }}>
            🚪 LOGOUT
          </button>
        </div>
      </div>

      {/* ══ MOBILE TOP BAR ══ */}
      <div className="mobile-topbar" style={{
        display: 'none',
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
        background: '#0C0C0C',
        borderBottom: '1px solid #C9A84C22',
        padding: '14px 20px',
        alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{
          fontFamily: "'Cinzel Decorative', cursive", fontSize: '15px',
          background: 'linear-gradient(135deg, #C9A84C, #F0D080)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>
          ⚡ Learnopedia
        </div>
        <button onClick={() => setMenuOpen(!menuOpen)} style={{
          background: 'none', border: '1px solid #C9A84C44',
          borderRadius: '6px', padding: '6px 12px',
          color: '#C9A84C', fontSize: '16px', cursor: 'pointer',
        }}>
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="mobile-menu" style={{
          display: 'none',
          position: 'fixed', top: '56px', left: 0, right: 0, zIndex: 199,
          background: '#0D0A0A',
          borderBottom: '1px solid #C9A84C22',
          padding: '12px',
        }}>
          {navItems.map(item => {
            const active = location.pathname === item.path;
            return (
              <button key={item.path}
                onClick={() => { navigate(item.path); setMenuOpen(false); }}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center',
                  gap: '12px', padding: '14px 16px', marginBottom: '6px',
                  background: active ? '#C9A84C12' : 'transparent',
                  border: active ? '1px solid #C9A84C33' : '1px solid transparent',
                  borderRadius: '8px',
                  color: active ? '#F0D080' : '#7A6A4A',
                  fontFamily: "'Cinzel', serif", fontSize: '12px',
                  letterSpacing: '1px', cursor: 'pointer', textAlign: 'left',
                }}>
                <span>{item.icon}</span><span>{item.label}</span>
              </button>
            );
          })}
          <button onClick={handleLogout} style={{
            width: '100%', padding: '12px', marginTop: '6px',
            background: 'transparent', border: '1px solid #C9A84C22',
            borderRadius: '8px', color: '#C9A84C',
            fontFamily: "'Cinzel', serif",
            fontSize: '11px', letterSpacing: '2px', cursor: 'pointer',
          }}>
            🚪 LOGOUT
          </button>
        </div>
      )}

      {/* ══ MOBILE BOTTOM NAV ══ */}
      <div className="mobile-bottomnav" style={{
        display: 'none',
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 200,
        background: '#0C0C0C',
        borderTop: '1px solid #C9A84C22',
        padding: '8px 0 12px',
        justifyContent: 'space-around', alignItems: 'center',
      }}>
        {navItems.map(item => {
          const active = location.pathname === item.path;
          return (
            <button key={item.path} onClick={() => navigate(item.path)} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              gap: '3px', padding: '4px 12px',
              background: 'none', border: 'none',
              color: active ? '#F0D080' : '#5A4A3A',
              cursor: 'pointer',
            }}>
              <span style={{ fontSize: '22px' }}>{item.icon}</span>
              <span style={{
                fontFamily: "'Cinzel', serif",
                fontSize: '8px', letterSpacing: '1px',
                color: active ? '#F0D080' : '#5A4A3A',
              }}>
                {item.label}
              </span>
            </button>
          );
        })}
        <button onClick={handleLogout} style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          gap: '3px', padding: '4px 12px',
          background: 'none', border: 'none',
          color: '#5A4A3A', cursor: 'pointer',
        }}>
          <span style={{ fontSize: '22px' }}>🚪</span>
          <span style={{ fontFamily: "'Cinzel', serif", fontSize: '8px', letterSpacing: '1px' }}>
            Logout
          </span>
        </button>
      </div>

      {/* ══ RESPONSIVE CSS ══ */}
      <style>{`
        @media (max-width: 768px) {
          .desktop-sidebar  { display: none !important; }
          .mobile-topbar    { display: flex !important; }
          .mobile-bottomnav { display: flex !important; }
          .mobile-menu      { display: block !important; }
        }
      `}</style>
    </>
  );
}