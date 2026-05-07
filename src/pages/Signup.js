import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import BackgroundFX from '../components/BackgroundFX';
import { signup } from '../services/api';

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm]   = useState({ name: '', email: '', password: '', house: 'gryffindor' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      await signup(form.name, form.email, form.password);

      // ── Store the name keyed by email so Profile can read it later ──
      // We store it under the email directly (before login, so no token yet)
      const pendingKey = `pending_profile::${form.email}`;
      localStorage.setItem(pendingKey, JSON.stringify({
        name:  form.name,
        house: form.house,
        title: '',
        bio:   '',
        level: 'Beginner',
        wand:  '',
        patronus: '',
      }));

      navigate('/login');
    } catch (err) {
      setError(err.message || 'Signup failed. Try again!');
    } finally { setLoading(false); }
  };

  return (
    <div style={pageWrap}>
      <BackgroundFX />
      <div style={card}>
        <div style={{ textAlign: 'center', marginBottom: '8px' }}>
          <span style={{ fontSize: '48px', animation: 'float 3s ease-in-out infinite', display: 'inline-block' }}>⚡</span>
        </div>
        <div style={logo}>Learnopedia AI</div>
        <h2 style={title}>Your Hogwarts Letter</h2>
        <p style={sub}>The castle has been expecting you</p>

        {error && <div style={errBox}>🦉 {error}</div>}

        <form onSubmit={handleSubmit}>
          {[
            { k: 'name',     label: '🧙 Full Name',        type: 'text',     ph: 'Your full name...' },
            { k: 'email',    label: '📜 Email Address',    type: 'email',    ph: 'your@email.com' },
            { k: 'password', label: '🔑 Password',         type: 'password', ph: '••••••••' },
          ].map(f => (
            <div key={f.k} style={{ marginBottom: '18px' }}>
              <label style={lbl}>{f.label}</label>
              <input
                type={f.type} placeholder={f.ph}
                value={form[f.k]}
                onChange={e => setForm({ ...form, [f.k]: e.target.value })}
                required style={inp}
              />
            </div>
          ))}

         
          <button type="submit" disabled={loading} style={submitBtn}>
            {loading ? '🪄 Owl is Delivering...' : '📜 Create My Account'}
          </button>
        </form>

        <p style={foot}>
          Already enrolled?{' '}
          <Link to="/login" style={{ color: '#C9A84C', textDecoration: 'none', fontStyle: 'italic' }}>
            Enter the castle →
          </Link>
        </p>
      </div>
    </div>
  );
}

const pageWrap   = { minHeight: '100vh', background: 'linear-gradient(180deg, #080808 0%, #0D0508 60%, #080808 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', padding: '24px' };
const card       = { position: 'relative', zIndex: 10, background: 'linear-gradient(145deg, #111008, #0D0A0A)', border: '1px solid #C9A84C44', borderRadius: '16px', padding: '44px 44px', width: '100%', maxWidth: '480px', boxShadow: '0 0 80px #C9A84C08' };
const logo       = { fontFamily: "'Cinzel Decorative', cursive", fontSize: '22px', fontWeight: 700, background: 'linear-gradient(135deg, #C9A84C, #F0D080)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', textAlign: 'center', marginBottom: '4px' };
const title      = { fontFamily: "'Cinzel', serif", fontSize: '18px', color: '#F0D080', textAlign: 'center', marginBottom: '6px', letterSpacing: '3px' };
const sub        = { fontFamily: "'IM Fell English', serif", fontSize: '15px', fontStyle: 'italic', color: '#7A6A4A', textAlign: 'center', marginBottom: '28px' };
const lbl        = { display: 'block', fontFamily: "'Cinzel', serif", fontSize: '10px', color: '#C9A84C', marginBottom: '7px', letterSpacing: '2px' };
const inp        = { width: '100%', padding: '12px 16px', background: '#0D0A0A', border: '1px solid #C9A84C33', borderRadius: '8px', color: '#F5E6C8', fontFamily: "'IM Fell English', serif", fontSize: '17px', outline: 'none', boxSizing: 'border-box' };
const submitBtn  = { width: '100%', padding: '15px', background: 'linear-gradient(135deg, #6B0F1A, #9B1A2A, #6B0F1A)', border: '1px solid #C9A84C66', borderRadius: '8px', color: '#F0D080', fontFamily: "'Cinzel', serif", fontSize: '13px', fontWeight: 700, letterSpacing: '3px', cursor: 'none', marginTop: '4px' };
const foot       = { textAlign: 'center', marginTop: '22px', fontFamily: "'IM Fell English', serif", fontSize: '15px', fontStyle: 'italic', color: '#7A6A4A' };
const errBox     = { background: '#1A0808', border: '1px solid #8B3030', borderRadius: '8px', padding: '12px 16px', color: '#D07070', marginBottom: '18px', fontFamily: "'IM Fell English', serif", fontSize: '15px', fontStyle: 'italic' };