import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import BackgroundFX from '../components/BackgroundFX';
import { login } from '../services/api';
import { userStorage } from '../services/userStorage';
import useIsMobile from '../hooks/useIsMobile';

export default function Login() {
  const navigate  = useNavigate();
  const isMobile  = useIsMobile();
  const [form,    setForm]    = useState({ email: '', password: '' });
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const data = await login(form.email, form.password);
      localStorage.setItem('token', data.access_token);

      const pendingKey = `pending_profile::${form.email}`;
      const pending    = localStorage.getItem(pendingKey);
      if (pending && !userStorage.get('profile')) {
        userStorage.set('profile', JSON.parse(pending));
        localStorage.removeItem(pendingKey);
      } else if (!userStorage.get('profile')) {
        userStorage.set('profile', {
          name: form.email.split('@')[0],
          title: '', bio: '', level: 'Beginner', learnStyle: '', dreamCareer: '',
        });
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid credentials');
    } finally { setLoading(false); }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #080808 0%, #0D0508 60%, #080808 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      position: 'relative', padding: '24px',
    }}>
      <BackgroundFX />
      <div style={{
        position: 'relative', zIndex: 10,
        background: 'linear-gradient(145deg, #111008, #0D0A0A)',
        border: '1px solid #C9A84C44', borderRadius: '16px',
        padding: isMobile ? '32px 24px' : '48px 44px',
        width: '100%', maxWidth: '460px',
        boxShadow: '0 0 80px #C9A84C08',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '8px' }}>
          <span style={{ fontSize: '44px', animation: 'float 3s ease-in-out infinite', display: 'inline-block' }}>🔮</span>
        </div>
        <div style={{
          fontFamily: "'Cinzel Decorative', cursive", fontSize: '20px', fontWeight: 700,
          background: 'linear-gradient(135deg, #C9A84C, #F0D080)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          textAlign: 'center', marginBottom: '4px',
        }}>Learnopedia AI</div>
        <h2 style={{
          fontFamily: "'Cinzel', serif", fontSize: '16px', color: '#F0D080',
          textAlign: 'center', marginBottom: '6px', letterSpacing: '3px',
        }}>Welcome Back</h2>
        <p style={{
          fontFamily: "'IM Fell English', serif", fontSize: '14px', fontStyle: 'italic',
          color: '#7A6A4A', textAlign: 'center', marginBottom: '28px',
        }}>Sign in to continue your learning journey</p>

        {error && (
          <div style={{
            background: '#1A0808', border: '1px solid #8B3030',
            borderRadius: '8px', padding: '12px 16px', color: '#D07070',
            marginBottom: '20px', fontFamily: "'IM Fell English', serif",
            fontSize: '14px', fontStyle: 'italic',
          }}>🦉 {error}</div>
        )}

        <form onSubmit={handleSubmit}>
          {[
            { k: 'email',    label: '📜 Email Address',  type: 'email',    ph: 'your@email.com' },
            { k: 'password', label: '🔑 Password',        type: 'password', ph: '••••••••' },
          ].map(f => (
            <div key={f.k} style={{ marginBottom: '18px' }}>
              <label style={{ display:'block', fontFamily:"'Cinzel',serif", fontSize:'10px', color:'#C9A84C', marginBottom:'7px', letterSpacing:'2px' }}>
                {f.label}
              </label>
              <input
                type={f.type} placeholder={f.ph}
                value={form[f.k]}
                onChange={e => setForm({ ...form, [f.k]: e.target.value })}
                required
                style={{
                  width: '100%', padding: '12px 16px',
                  background: '#0D0A0A', border: '1px solid #C9A84C33',
                  borderRadius: '8px', color: '#F5E6C8',
                  fontFamily: "'IM Fell English', serif",
                  fontSize: '16px', outline: 'none', boxSizing: 'border-box',
                }}
              />
            </div>
          ))}
          <button type="submit" disabled={loading} style={{
            width: '100%', padding: '15px',
            background: 'linear-gradient(135deg, #6B0F1A, #9B1A2A, #6B0F1A)',
            border: '1px solid #C9A84C66', borderRadius: '8px',
            color: '#F0D080', fontFamily: "'Cinzel', serif",
            fontSize: '13px', fontWeight: 700, letterSpacing: '3px',
            cursor: 'pointer', marginTop: '8px',
          }}>
            {loading ? '🪄 Signing In...' : '⚡ Sign In'}
          </button>
        </form>

        <p style={{
          textAlign: 'center', marginTop: '22px',
          fontFamily: "'IM Fell English', serif",
          fontSize: '14px', fontStyle: 'italic', color: '#7A6A4A',
        }}>
          New here?{' '}
          <Link to="/signup" style={{ color: '#C9A84C', textDecoration: 'none' }}>
            Create an Account →
          </Link>
        </p>
      </div>
    </div>
  );
}