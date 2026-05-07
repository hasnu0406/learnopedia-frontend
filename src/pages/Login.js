import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import BackgroundFX from '../components/BackgroundFX';
import { login } from '../services/api';
import { userStorage } from '../services/userStorage';

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm]   = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const data = await login(form.email, form.password);
      // ── 1. Store token first so userStorage can decode it ──
      localStorage.setItem('token', data.access_token);

      // ── 2. If this is a brand-new user, migrate the pending profile ──
      const pendingKey = `pending_profile::${form.email}`;
      const pending    = localStorage.getItem(pendingKey);

      if (pending && !userStorage.get('profile')) {
        // First login — move signup data into per-user storage
        userStorage.set('profile', JSON.parse(pending));
        localStorage.removeItem(pendingKey); // clean up
      } else if (!userStorage.get('profile')) {
        // Existing user without profile data (edge case) — create minimal
        userStorage.set('profile', {
          name: form.email.split('@')[0],
          house: 'gryffindor',
          title: '', bio: '', level: 'Beginner', wand: '', patronus: '',
        });
      }

      navigate('/dashboard');
    } catch (err) {
      setError(err.message || "The password is wrong. Even the Fat Lady won't let you in!");
    } finally { setLoading(false); }
  };

  return (
    <div style={pageWrap}>
      <BackgroundFX />
      <div style={card}>
        <div style={{ textAlign: 'center', marginBottom: '8px' }}>
          <span style={{ fontSize: '52px', animation: 'float 3s ease-in-out infinite', display: 'inline-block' }}>🔮</span>
        </div>
        <div style={logo}>Learnopedia AI</div>
        <div style={{ fontFamily: "'Cinzel', serif", fontSize: '9px', color: '#C9A84C88', letterSpacing: '4px', textAlign: 'center', marginBottom: '6px' }}>
          SPEAK FRIEND AND ENTER
        </div>
        <h2 style={title}>The Sorting Gate</h2>
        <p style={sub}>Present your credentials to the castle</p>

        {error && <div style={errBox}>🦉 {error}</div>}

        <form onSubmit={handleSubmit}>
          {[
            { k: 'email',    label: '📜 Email Address',      type: 'email',    ph: 'your@email.com' },
            { k: 'password', label: '🔑 Secret Incantation', type: 'password', ph: '••••••••' },
          ].map(f => (
            <div key={f.k} style={{ marginBottom: '20px' }}>
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
            {loading ? '🪄 Casting Alohomora...' : '⚡ Enter the Castle'}
          </button>
        </form>

        <p style={foot}>
          Not yet enrolled?{' '}
          <Link to="/signup" style={{ color: '#C9A84C', textDecoration: 'none', fontStyle: 'italic' }}>
            Receive your Hogwarts Letter →
          </Link>
        </p>
      </div>
    </div>
  );
}

const pageWrap  = { minHeight: '100vh', background: 'linear-gradient(180deg, #080808 0%, #0D0508 60%, #080808 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', padding: '24px' };
const card      = { position: 'relative', zIndex: 10, background: 'linear-gradient(145deg, #111008, #0D0A0A)', border: '1px solid #C9A84C44', borderRadius: '16px', padding: '48px 44px', width: '100%', maxWidth: '460px', boxShadow: '0 0 80px #C9A84C08, 0 0 0 1px #C9A84C11' };
const logo      = { fontFamily: "'Cinzel Decorative', cursive", fontSize: '22px', fontWeight: 700, background: 'linear-gradient(135deg, #C9A84C, #F0D080)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', textAlign: 'center', marginBottom: '4px' };
const title     = { fontFamily: "'Cinzel', serif", fontSize: '18px', color: '#F0D080', textAlign: 'center', marginBottom: '6px', letterSpacing: '3px' };
const sub       = { fontFamily: "'IM Fell English', serif", fontSize: '15px', fontStyle: 'italic', color: '#7A6A4A', textAlign: 'center', marginBottom: '32px' };
const lbl       = { display: 'block', fontFamily: "'Cinzel', serif", fontSize: '10px', color: '#C9A84C', marginBottom: '7px', letterSpacing: '2px' };
const inp       = { width: '100%', padding: '13px 16px', background: '#0D0A0A', border: '1px solid #C9A84C33', borderRadius: '8px', color: '#F5E6C8', fontFamily: "'IM Fell English', serif", fontSize: '17px', outline: 'none', boxSizing: 'border-box' };
const submitBtn = { width: '100%', padding: '15px', background: 'linear-gradient(135deg, #6B0F1A, #9B1A2A, #6B0F1A)', border: '1px solid #C9A84C66', borderRadius: '8px', color: '#F0D080', fontFamily: "'Cinzel', serif", fontSize: '13px', fontWeight: 700, letterSpacing: '3px', cursor: 'none', marginTop: '8px', boxShadow: '0 0 20px #C9A84C11' };
const foot      = { textAlign: 'center', marginTop: '24px', fontFamily: "'IM Fell English', serif", fontSize: '15px', fontStyle: 'italic', color: '#7A6A4A' };
const errBox    = { background: '#1A0808', border: '1px solid #8B3030', borderRadius: '8px', padding: '12px 16px', color: '#D07070', marginBottom: '20px', fontFamily: "'IM Fell English', serif", fontSize: '15px', fontStyle: 'italic' };