import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BackgroundFX from '../components/BackgroundFX';
import useIsMobile from '../hooks/useIsMobile';

const SPELLS = ['Lumos!', 'Alohomora!', 'Wingardium Leviosa!', 'Expecto Patronum!', 'Accio Knowledge!'];

export default function Landing() {
  const navigate  = useNavigate();
  const isMobile  = useIsMobile();
  const [spell,   setSpell]   = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const iv = setInterval(() => {
      setVisible(false);
      setTimeout(() => { setSpell(s => (s + 1) % SPELLS.length); setVisible(true); }, 400);
    }, 2800);
    return () => clearInterval(iv);
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #080808 0%, #0D0508 40%, #080810 100%)',
      position: 'relative', display: 'flex', flexDirection: 'column',
    }}>
      <BackgroundFX />

      {/* Stone texture */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 1, pointerEvents: 'none',
        backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 30px, #ffffff03 30px, #ffffff03 31px), repeating-linear-gradient(90deg, transparent, transparent 40px, #ffffff02 40px, #ffffff02 41px)`,
      }} />

      {/* Navbar */}
      <nav style={{
        position: 'relative', zIndex: 10,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: isMobile ? '16px 20px' : '20px 60px',
        borderBottom: '1px solid #C9A84C22',
        background: 'linear-gradient(90deg, #6B0F1A11, transparent, #6B0F1A11)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: isMobile ? '20px' : '28px' }}>⚡</span>
          <div>
            <div style={{
              fontFamily: "'Cinzel Decorative', cursive",
              fontSize: isMobile ? '13px' : '18px', fontWeight: 700,
              background: 'linear-gradient(135deg, #C9A84C, #F0D080, #C9A84C)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>Learnopedia AI</div>
            {!isMobile && (
              <div style={{
                fontFamily: "'Cinzel', serif", fontSize: '8px',
                color: '#C9A84C88', letterSpacing: '4px',
              }}>GATEWAY OF MAGICAL GUIDANCE</div>
            )}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => navigate('/login')}  style={navBtn(false, isMobile)}>Sign In</button>
          <button onClick={() => navigate('/signup')} style={navBtn(true,  isMobile)}>⚡ Enrol</button>
        </div>
      </nav>

      {/* Hero */}
      <div style={{
        flex: 1, zIndex: 10, position: 'relative',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        textAlign: 'center',
        padding: isMobile ? '40px 20px 60px' : '60px 24px',
      }}>
        {/* Rotating spell */}
        <div style={{
          fontFamily: "'IM Fell English', serif",
          fontSize: isMobile ? '13px' : '16px', fontStyle: 'italic',
          color: '#F0D080',
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.4s ease',
          marginBottom: '24px', letterSpacing: '3px',
        }}>
          ✦ {SPELLS[spell]} ✦
        </div>

        <div style={{
          border: '1px solid #C9A84C33', borderRadius: '4px',
          padding: '4px 20px', marginBottom: '20px',
          background: 'linear-gradient(90deg, transparent, #C9A84C0A, transparent)',
        }}>
          <div style={{
            fontFamily: "'Cinzel', serif",
            fontSize: isMobile ? '8px' : '11px',
            letterSpacing: isMobile ? '4px' : '8px',
            color: '#C9A84C', textTransform: 'uppercase',
          }}>Welcome to Hogwarts of Knowledge</div>
        </div>

        <h1 style={{
          fontFamily: "'Cinzel Decorative', cursive",
          fontSize: isMobile ? '26px' : 'clamp(30px, 5.5vw, 66px)',
          fontWeight: 900,
          background: 'linear-gradient(135deg, #8B6914 0%, #C9A84C 30%, #F0D080 50%, #C9A84C 70%, #8B6914 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          lineHeight: 1.25, maxWidth: '820px', marginBottom: '24px',
        }}>
          Your Magical Learning Journey Begins Here
        </h1>

        <div style={{
          width: '80px', height: '1px', margin: '0 auto 24px',
          background: 'linear-gradient(90deg, transparent, #C9A84C, transparent)',
        }} />

        <p style={{
          fontFamily: "'IM Fell English', serif",
          fontSize: isMobile ? '16px' : '20px', fontStyle: 'italic',
          color: '#C4A87A', maxWidth: '580px',
          lineHeight: 1.9, marginBottom: isMobile ? '36px' : '52px',
          padding: isMobile ? '0 8px' : '0',
        }}>
          Like a Hogwarts letter that finds you, our AI discovers the perfect courses and
          learning paths crafted for your unique abilities and ambitions.
        </p>

        {/* Buttons */}
        <div style={{
          display: 'flex', gap: '14px', flexWrap: 'wrap',
          justifyContent: 'center', marginBottom: '60px',
        }}>
          <button onClick={() => navigate('/signup')} style={heroBtn(true,  isMobile)}>
            🪄 Begin Your Journey
          </button>
          <button onClick={() => navigate('/login')}  style={heroBtn(false, isMobile)}>
            🔑 Enter the Castle
          </button>
        </div>

        {/* House cards — desktop only */}
        {!isMobile && (
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
            {[
              { icon: '🦁', house: 'Gryffindor', trait: 'Brave & Determined', color: '#C9A84C', bg: '#6B0F1A' },
              { icon: '🦅', house: 'Ravenclaw',  trait: 'Wise & Curious',      color: '#9BB0D0', bg: '#0D1B2A' },
              { icon: '🦡', house: 'Hufflepuff', trait: 'Patient & Loyal',     color: '#F0C040', bg: '#3A2A0A' },
              { icon: '🐍', house: 'Slytherin',  trait: 'Ambitious & Clever',  color: '#80B080', bg: '#1A3A2A' },
            ].map(h => (
              <div key={h.house} style={{
                background: `linear-gradient(135deg, ${h.bg}CC, #111)`,
                border: `1px solid ${h.color}44`,
                borderRadius: '12px', padding: '24px 20px',
                textAlign: 'center', width: '160px',
              }}>
                <div style={{ fontSize: '32px', marginBottom: '10px' }}>{h.icon}</div>
                <div style={{ fontFamily: "'Cinzel',serif", fontSize: '13px', color: h.color, marginBottom: '6px' }}>{h.house}</div>
                <div style={{ fontFamily: "'IM Fell English',serif", fontSize: '13px', fontStyle: 'italic', color: '#7A6A4A' }}>{h.trait}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Footer ── */}
      <div style={{
        position: 'relative', zIndex: 10,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center',
        padding: '28px 20px 32px',
        borderTop: '1px solid #C9A84C22',
        background: 'linear-gradient(180deg, transparent, #0D0A0A)',
        gap: '16px',
      }}>

        {/* Dumbledore quote */}
        <p style={{
          fontFamily: "'IM Fell English', serif",
          fontSize: isMobile ? '11px' : '13px',
          fontStyle: 'italic',
          color: '#C9A84C55',
          letterSpacing: '1px',
          textAlign: 'center',
        }}>
          "Happiness can be found even in the darkest of times" — Albus Dumbledore
        </p>

        {/* Divider */}
        <div style={{
          width: '120px', height: '1px',
          background: 'linear-gradient(90deg, transparent, #C9A84C44, transparent)',
        }} />

        {/* Developer credit — prominent, styled like a badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          background: 'linear-gradient(135deg, #111008, #0D0A0A)',
          border: '1px solid #C9A84C33',
          borderRadius: '40px',
          padding: isMobile ? '8px 20px' : '10px 28px',
          boxShadow: '0 0 18px #C9A84C11',
        }}>
          <span style={{ fontSize: isMobile ? '14px' : '16px' }}>⚡</span>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontFamily: "'Cinzel', serif",
              fontSize: isMobile ? '8px' : '9px',
              letterSpacing: '3px',
              color: '#C9A84C77',
              textTransform: 'uppercase',
              marginBottom: '3px',
            }}>
              Crafted with magic by
            </div>
            <div style={{
              fontFamily: "'Cinzel Decorative', cursive",
              fontSize: isMobile ? '12px' : '15px',
              fontWeight: 700,
              background: 'linear-gradient(135deg, #8B6914, #C9A84C, #F0D080, #C9A84C, #8B6914)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '1px',
            }}>
              Hasna Mubarak Azeem
            </div>
          </div>
          <span style={{ fontSize: isMobile ? '14px' : '16px' }}>⚡</span>
        </div>

      </div>
    </div>
  );
}

const navBtn = (primary, isMobile) => ({
  padding: isMobile ? '8px 14px' : '10px 24px',
  background: primary ? 'linear-gradient(135deg, #6B0F1A, #9B1A2A)' : 'transparent',
  border: '1px solid #C9A84C88', borderRadius: '6px',
  color: primary ? '#F0D080' : '#C9A84C',
  fontFamily: "'Cinzel', serif",
  fontSize: isMobile ? '10px' : '11px', letterSpacing: '1px',
  fontWeight: 600, cursor: 'pointer',
});

const heroBtn = (primary, isMobile) => ({
  padding: isMobile ? '13px 28px' : '16px 44px',
  background: primary
    ? 'linear-gradient(135deg, #6B0F1A 0%, #9B1A2A 50%, #6B0F1A 100%)'
    : 'transparent',
  border: `2px solid ${primary ? '#C9A84C' : '#C9A84C88'}`,
  borderRadius: '8px',
  color: primary ? '#F0D080' : '#C9A84C',
  fontFamily: "'Cinzel', serif",
  fontSize: isMobile ? '11px' : '13px', letterSpacing: '2px',
  fontWeight: 700, cursor: 'pointer',
  boxShadow: primary ? '0 0 24px #C9A84C22' : 'none',
});