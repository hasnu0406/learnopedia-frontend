import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BackgroundFX from '../components/BackgroundFX';

const SPELLS = ['Lumos!', 'Alohomora!', 'Wingardium Leviosa!', 'Expecto Patronum!', 'Accio Knowledge!'];

export default function Landing() {
  const navigate = useNavigate();
  const [spell, setSpell] = useState(0);
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

      {/* Stone wall texture overlay */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 1, pointerEvents: 'none',
        backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 30px, #ffffff03 30px, #ffffff03 31px), repeating-linear-gradient(90deg, transparent, transparent 40px, #ffffff02 40px, #ffffff02 41px)`,
      }} />

      {/* Navbar */}
      <nav style={{
        position: 'relative', zIndex: 10,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '20px 60px',
        borderBottom: '1px solid #C9A84C22',
        background: 'linear-gradient(90deg, #6B0F1A11, transparent, #6B0F1A11)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '28px' }}>⚡</span>
          <div>
            <div style={{
              fontFamily: "'Cinzel Decorative', cursive",
              fontSize: '18px', fontWeight: 700,
              background: 'linear-gradient(135deg, #C9A84C, #F0D080, #C9A84C)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>Learnopedia AI</div>
            <div style={{
              fontFamily: "'Cinzel', serif", fontSize: '8px',
              color: '#C9A84C88', letterSpacing: '4px',
            }}>GATEWAY OF MAGICAL GUIDANCE</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={() => navigate('/login')} style={navBtn(false)}>Sign In</button>
          <button onClick={() => navigate('/signup')} style={navBtn(true)}>⚡ Enroll Now</button>
        </div>
      </nav>

      {/* Hero */}
      <div style={{
        flex: 1, zIndex: 10, position: 'relative',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', padding: '60px 24px',
      }}>
        {/* Animated spell */}
        <div style={{
          fontFamily: "'IM Fell English', serif",
          fontSize: '16px', fontStyle: 'italic',
          color: '#F0D080',
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.4s ease',
          marginBottom: '28px',
          letterSpacing: '3px',
        }}>
          ✦ {SPELLS[spell]} ✦
        </div>

        {/* Gate/title */}
        <div style={{
          border: '1px solid #C9A84C33',
          borderRadius: '4px',
          padding: '4px 32px',
          marginBottom: '24px',
          background: 'linear-gradient(90deg, transparent, #C9A84C0A, transparent)',
        }}>
          <div style={{
            fontFamily: "'Cinzel', serif",
            fontSize: '11px', letterSpacing: '8px',
            color: '#C9A84C', textTransform: 'uppercase',
          }}>Welcome to Hogwarts of Knowledge</div>
        </div>

        <h1 style={{
          fontFamily: "'Cinzel Decorative', cursive",
          fontSize: 'clamp(30px, 5.5vw, 66px)',
          fontWeight: 900,
          background: 'linear-gradient(135deg, #8B6914 0%, #C9A84C 30%, #F0D080 50%, #C9A84C 70%, #8B6914 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          lineHeight: 1.25, maxWidth: '820px',
          marginBottom: '28px',
          textShadow: 'none',
          filter: 'drop-shadow(0 0 30px #C9A84C44)',
        }}>
          Your Magical Learning Journey Begins Here
        </h1>

        <div style={{
          width: '120px', height: '1px', margin: '0 auto 28px',
          background: 'linear-gradient(90deg, transparent, #C9A84C, transparent)',
        }} />

        <p style={{
          fontFamily: "'IM Fell English', serif",
          fontSize: '20px', fontStyle: 'italic',
          color: '#C4A87A', maxWidth: '600px',
          lineHeight: 1.9, marginBottom: '52px',
        }}>
          Like a Hogwarts letter that finds you, our AI discovers the perfect courses and learning paths crafted for your unique magical abilities and ambitions.
        </p>

        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '80px' }}>
          <button onClick={() => navigate('/signup')} style={heroBtn(true)}>🪄 Begin Your Journey</button>
          <button onClick={() => navigate('/login')} style={heroBtn(false)}>🔑 Enter the Castle</button>
        </div>

        {/* House cards */}
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {[
            { icon: '🦁', house: 'Gryffindor', trait: 'Brave & Determined', color: '#C9A84C', bg: '#6B0F1A' },
            { icon: '🦅', house: 'Ravenclaw', trait: 'Wise & Curious', color: '#9BB0D0', bg: '#0D1B2A' },
            { icon: '🦡', house: 'Hufflepuff', trait: 'Patient & Loyal', color: '#F0C040', bg: '#3A2A0A' },
            { icon: '🐍', house: 'Slytherin', trait: 'Ambitious & Clever', color: '#80B080', bg: '#1A3A2A' },
          ].map(h => (
            <div key={h.house} style={{
              background: `linear-gradient(135deg, ${h.bg}CC, #111)`,
              border: `1px solid ${h.color}44`,
              borderRadius: '12px', padding: '24px 20px',
              textAlign: 'center', width: '160px',
              transition: 'transform 0.2s',
            }}>
              <div style={{ fontSize: '32px', marginBottom: '10px' }}>{h.icon}</div>
              <div style={{
                fontFamily: "'Cinzel', serif",
                fontSize: '13px', color: h.color,
                marginBottom: '6px', letterSpacing: '1px',
              }}>{h.house}</div>
              <div style={{
                fontFamily: "'IM Fell English', serif",
                fontSize: '13px', fontStyle: 'italic', color: '#7A6A4A',
              }}>{h.trait}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer quote */}
      <div style={{
        position: 'relative', zIndex: 10,
        textAlign: 'center', padding: '24px',
        borderTop: '1px solid #C9A84C11',
        fontFamily: "'IM Fell English', serif",
        fontSize: '13px', fontStyle: 'italic', color: '#C9A84C44',
      }}>
        "Happiness can be found even in the darkest of times, if one only remembers to turn on the light." — Albus Dumbledore
      </div>
    </div>
  );
}

const navBtn = (primary) => ({
  padding: '10px 24px',
  background: primary ? 'linear-gradient(135deg, #6B0F1A, #9B1A2A)' : 'transparent',
  border: '1px solid #C9A84C88',
  borderRadius: '6px',
  color: primary ? '#F0D080' : '#C9A84C',
  fontFamily: "'Cinzel', serif",
  fontSize: '11px', letterSpacing: '2px',
  fontWeight: 600, cursor: 'none',
});

const heroBtn = (primary) => ({
  padding: '16px 44px',
  background: primary
    ? 'linear-gradient(135deg, #6B0F1A 0%, #9B1A2A 50%, #6B0F1A 100%)'
    : 'transparent',
  border: `2px solid ${primary ? '#C9A84C' : '#C9A84C88'}`,
  borderRadius: '8px',
  color: primary ? '#F0D080' : '#C9A84C',
  fontFamily: "'Cinzel', serif",
  fontSize: '13px', letterSpacing: '3px',
  fontWeight: 700, cursor: 'none',
  boxShadow: primary ? '0 0 24px #C9A84C22, inset 0 0 24px #6B0F1A44' : 'none',
});