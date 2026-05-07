import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import BackgroundFX from '../components/BackgroundFX';
import { userStorage } from '../services/userStorage';
import RecommendationDisplay from '../components/RecommendationDisplay';

const LEVELS      = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
const LEARN_STYLES = ['Visual (videos, diagrams)', 'Reading (articles, books)', 'Practical (projects, coding)', 'Auditory (podcasts, lectures)', 'Mixed'];

function calcCompletion(p) {
  const fields = [p.name, p.title, p.bio, p.level, p.learnStyle, p.dreamCareer];
  return Math.round((fields.filter(Boolean).length / fields.length) * 100);
}

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [draft,   setDraft]   = useState(null);
  const [saved,   setSaved]   = useState(false);
  const [showPlan, setShowPlan] = useState(false);

  useEffect(() => {
    const stored = userStorage.get('profile');
    if (stored) {
      setProfile(stored); setDraft(stored);
    } else {
      const email    = userStorage.getEmail();
      const fallback = { name: email.split('@')[0], title: '', bio: '', level: 'Beginner', learnStyle: '', dreamCareer: '' };
      setProfile(fallback); setDraft(fallback);
      userStorage.set('profile', fallback);
    }
  }, []);

  const handleSave = () => {
    userStorage.set('profile', draft);
    setProfile(draft);
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  };

  const notes      = userStorage.get('wizard_notes') || {};
  const noteCount  = Object.values(notes).flat().length;
  const rec        = userStorage.get('last_recommendation') || '';
  const recDate    = userStorage.get('last_rec_date') || '';

  if (!profile) return (
    <div style={{ display:'flex', minHeight:'100vh', background:'#080808', alignItems:'center', justifyContent:'center' }}>
      <div style={{ fontFamily:"'Cinzel', serif", color:'#C9A84C', letterSpacing:'4px' }}>Loading your profile...</div>
    </div>
  );

  const completion = calcCompletion(profile);

  const BADGES = [
    { icon:'🦉', label:'Account Created',      desc:'Successfully signed up',                   earned: true },
    { icon:'⚡', label:'First Course Plan',     desc:'Generated your first AI recommendation',   earned: !!rec },
    { icon:'📝', label:'Active Note-Taker',      desc:'Wrote 5 or more learning notes',           earned: noteCount >= 5 },
    { icon:'🌟', label:'Profile Complete',       desc:'Filled in all profile details',            earned: completion === 100 },
    { icon:'🎯', label:'Goal Setter',            desc:'Added your dream career',                  earned: !!profile.dreamCareer },
    { icon:'📚', label:'Dedicated Learner',      desc:'Added your preferred learning style',      earned: !!profile.learnStyle },
  ];

  return (
    <div style={{ display:'flex', minHeight:'100vh', background:'#080808' }}>
      <BackgroundFX />
      <Sidebar />
      <main style={{ marginLeft:'240px', flex:1, padding:'44px 52px', position:'relative', zIndex:10 }}>

        {/* ── Header ── */}
        <div style={{ marginBottom:'32px' }}>
          <div style={{ fontFamily:"'Cinzel', serif", fontSize:'10px', color:'#C9A84C88', letterSpacing:'5px', marginBottom:'8px' }}>
            🧙 MY PROFILE
          </div>
          <h1 style={{
            fontFamily:"'Cinzel Decorative', cursive",
            fontSize:'clamp(22px, 3.5vw, 40px)', fontWeight:900,
            background:'linear-gradient(135deg, #C9A84C, #F0D080)',
            WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
          }}>Your Learning Identity</h1>
          <p style={{ fontFamily:"'IM Fell English', serif", fontSize:'16px', fontStyle:'italic', color:'#7A6A4A', marginTop:'6px' }}>
            The more you fill in, the better the AI can guide you
          </p>
        </div>

        {/* ── Completion bar ── */}
        <div style={{
          background:'#0D0A0A', border:'1px solid #C9A84C22',
          borderRadius:'10px', padding:'16px 24px', marginBottom:'28px',
          display:'flex', alignItems:'center', gap:'20px', flexWrap:'wrap',
        }}>
          <div style={{ fontFamily:"'Cinzel', serif", fontSize:'10px', color:'#C9A84C88', letterSpacing:'3px', whiteSpace:'nowrap' }}>
            PROFILE COMPLETION
          </div>
          <div style={{ flex:1, minWidth:'120px', height:'6px', background:'#1A1A1A', borderRadius:'3px', overflow:'hidden' }}>
            <div style={{
              height:'100%', borderRadius:'3px', width:`${completion}%`,
              background: completion === 100
                ? 'linear-gradient(90deg, #2A8A4A, #40C070)'
                : 'linear-gradient(90deg, #C9A84C, #F0D080)',
              transition:'width 0.6s ease',
            }} />
          </div>
          <div style={{ fontFamily:"'Cinzel', serif", fontSize:'13px', color:'#F0D080' }}>{completion}%</div>
          <div style={{ fontFamily:"'IM Fell English', serif", fontSize:'14px', fontStyle:'italic', color:'#6A5A3A' }}>
            {completion === 100
              ? '✦ Great! The AI can guide you perfectly now'
              : 'Fill in more details for better AI recommendations'}
          </div>
        </div>

        {/* ── Main grid ── */}
        <div style={{ display:'grid', gridTemplateColumns:'280px 1fr', gap:'24px', marginBottom:'24px' }}>

          {/* Left — avatar card */}
          <div style={{
            background:'linear-gradient(145deg, #1A0A0A, #0D0A0A)',
            border:'1px solid #C9A84C44',
            borderRadius:'16px', padding:'36px 24px',
            textAlign:'center',
            boxShadow:'0 0 40px #C9A84C08',
          }}>
            <div style={{ fontSize:'72px', marginBottom:'16px', animation:'float 4s ease-in-out infinite', display:'inline-block' }}>
              🎓
            </div>
            <div style={{ fontFamily:"'Cinzel Decorative', cursive", fontSize:'17px', color:'#F0D080', marginBottom:'4px', lineHeight:1.3 }}>
              {profile.name}
            </div>
            {profile.title && (
              <div style={{ fontFamily:"'IM Fell English', serif", fontSize:'14px', fontStyle:'italic', color:'#8A7A5A', marginBottom:'12px' }}>
                {profile.title}
              </div>
            )}
            <div style={{
              display:'inline-flex', alignItems:'center', gap:'6px',
              background:'#C9A84C18', border:'1px solid #C9A84C44',
              borderRadius:'20px', padding:'7px 16px', margin:'8px 0',
              fontFamily:"'Cinzel', serif", fontSize:'11px',
              color:'#C9A84C', letterSpacing:'2px',
            }}>
              🎯 {profile.level || 'Beginner'}
            </div>
            {profile.learnStyle && (
              <div style={{ fontFamily:"'IM Fell English', serif", fontSize:'13px', fontStyle:'italic', color:'#5A4A3A', marginTop:'8px' }}>
                {profile.learnStyle}
              </div>
            )}
            <div style={{ width:'60px', height:'1px', margin:'16px auto', background:'linear-gradient(90deg, transparent, #C9A84C44, transparent)' }} />
            <div style={{ display:'flex', justifyContent:'center', gap:'28px' }}>
              {[
                { icon:'📜', val: rec ? '1' : '0', label:'Paths'  },
                { icon:'✍️', val: noteCount,        label:'Notes'  },
              ].map(s => (
                <div key={s.label} style={{ textAlign:'center' }}>
                  <div style={{ fontSize:'20px' }}>{s.icon}</div>
                  <div style={{ fontFamily:"'Cinzel Decorative', cursive", fontSize:'20px', color:'#F0D080' }}>{s.val}</div>
                  <div style={{ fontFamily:"'Cinzel', serif", fontSize:'8px', color:'#C9A84C55', letterSpacing:'1.5px' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — editable fields */}
          <div style={{
            background:'linear-gradient(145deg, #0D0A0A, #111008)',
            border:'1px solid #C9A84C33', borderRadius:'16px', padding:'32px',
          }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'24px' }}>
              <div style={{ fontFamily:"'Cinzel', serif", fontSize:'11px', color:'#C9A84C', letterSpacing:'3px' }}>
                ✦ PERSONAL DETAILS
              </div>
              <div style={{ display:'flex', gap:'8px' }}>
                {editing && (
                  <button onClick={() => { setDraft(profile); setEditing(false); }} style={ghostBtn}>
                    CANCEL
                  </button>
                )}
                <button onClick={editing ? handleSave : () => setEditing(true)} style={{
                  ...ghostBtn,
                  background: editing ? 'linear-gradient(135deg,#6B0F1A,#9B1A2A)' : 'transparent',
                  color:       editing ? '#F0D080' : '#C9A84C',
                  borderColor: editing ? '#C9A84C88' : '#C9A84C44',
                }}>
                  {saved ? '✓ Saved!' : editing ? '💾 Save Changes' : '✏️ Edit Profile'}
                </button>
              </div>
            </div>

            {/* Name + Title */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'18px', marginBottom:'18px' }}>
              <div>
                <label style={fieldLbl}>FULL NAME</label>
                <input value={draft?.name || ''} onChange={e => setDraft({ ...draft, name: e.target.value })} disabled={!editing} placeholder="Your full name" style={fieldInp(editing)} />
              </div>
              <div>
                <label style={fieldLbl}>PROFESSIONAL TITLE</label>
                <input value={draft?.title || ''} onChange={e => setDraft({ ...draft, title: e.target.value })} disabled={!editing} placeholder="e.g. Aspiring AI & ML Engineer" style={fieldInp(editing)} />
              </div>
            </div>

            {/* Bio */}
            <div style={{ marginBottom:'18px' }}>
              <label style={fieldLbl}>ABOUT YOU</label>
              <textarea
                value={draft?.bio || ''}
                onChange={e => setDraft({ ...draft, bio: e.target.value })}
                disabled={!editing}
                placeholder="Tell the AI about yourself — your background, what you're studying, and what you want to achieve..."
                rows={3}
                style={{ ...fieldInp(editing), resize:'none' }}
              />
              {!editing && !profile.bio && (
                <div style={{ fontFamily:"'IM Fell English', serif", fontSize:'12px', fontStyle:'italic', color:'#4A3A2A', marginTop:'5px' }}>
                  Click "Edit Profile" to add a bio — this helps the AI give much better recommendations
                </div>
              )}
            </div>

            {/* Dream career + Learning style */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'18px', marginBottom:'18px' }}>
              <div>
                <label style={fieldLbl}>🎯 DREAM CAREER</label>
                <input value={draft?.dreamCareer || ''} onChange={e => setDraft({ ...draft, dreamCareer: e.target.value })} disabled={!editing} placeholder="e.g. AI Engineer, Data Scientist..." style={fieldInp(editing)} />
              </div>
              <div>
                <label style={fieldLbl}>📚 HOW DO YOU LEARN BEST?</label>
                {editing ? (
                  <select value={draft?.learnStyle || ''} onChange={e => setDraft({ ...draft, learnStyle: e.target.value })} style={{ ...fieldInp(true), cursor:'none' }}>
                    <option value="">Select your style...</option>
                    {LEARN_STYLES.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                ) : (
                  <input value={profile.learnStyle || ''} disabled placeholder="Your preferred learning style" style={fieldInp(false)} />
                )}
              </div>
            </div>

            {/* Experience level */}
            <div>
              <label style={fieldLbl}>EXPERIENCE LEVEL</label>
              {editing ? (
                <div style={{ display:'flex', gap:'8px', flexWrap:'wrap', marginTop:'8px' }}>
                  {LEVELS.map(lv => (
                    <button key={lv} type="button" onClick={() => setDraft({ ...draft, level: lv })} style={{
                      padding:'8px 18px',
                      background: draft?.level === lv ? '#C9A84C22' : 'transparent',
                      border:`1px solid ${draft?.level === lv ? '#C9A84C' : '#C9A84C22'}`,
                      borderRadius:'20px',
                      color: draft?.level === lv ? '#F0D080' : '#6A5A3A',
                      fontFamily:"'Cinzel', serif", fontSize:'10px',
                      letterSpacing:'1px', cursor:'none', transition:'all 0.2s',
                    }}>{lv}</button>
                  ))}
                </div>
              ) : (
                <div style={{
                  display:'inline-flex', alignItems:'center', gap:'8px',
                  background:'#C9A84C18', border:'1px solid #C9A84C33',
                  borderRadius:'20px', padding:'8px 18px', marginTop:'8px',
                }}>
                  <span style={{ fontFamily:"'Cinzel', serif", fontSize:'11px', color:'#F0D080', letterSpacing:'2px' }}>
                    🎯 {profile.level || 'Beginner'}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Achievements ── */}
        <div style={{
          background:'linear-gradient(145deg, #0D0A0A, #111008)',
          border:'1px solid #C9A84C22', borderRadius:'16px',
          padding:'28px 32px', marginBottom:'24px',
        }}>
          <div style={{ fontFamily:"'Cinzel', serif", fontSize:'11px', color:'#C9A84C', letterSpacing:'3px', marginBottom:'4px' }}>
            🏅 YOUR ACHIEVEMENTS
          </div>
          <div style={{ fontFamily:"'IM Fell English', serif", fontSize:'13px', fontStyle:'italic', color:'#5A4A3A', marginBottom:'16px' }}>
            Badges you earn as you use Learnopedia AI
          </div>
          <div style={{ height:'1px', background:'linear-gradient(90deg, #C9A84C18, transparent)', marginBottom:'16px' }} />
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(220px,1fr))', gap:'12px' }}>
            {BADGES.map((b, i) => (
              <div key={i} style={{
                display:'flex', alignItems:'center', gap:'14px',
                padding:'14px 16px',
                background: b.earned ? '#C9A84C08' : 'transparent',
                border:`1px solid ${b.earned ? '#C9A84C33' : '#1A1A1A'}`,
                borderRadius:'10px', opacity: b.earned ? 1 : 0.35,
                transition:'all 0.3s',
              }}>
                <span style={{ fontSize:'26px', filter: b.earned ? 'none' : 'grayscale(1)' }}>{b.icon}</span>
                <div>
                  <div style={{ fontFamily:"'Cinzel', serif", fontSize:'10px', color: b.earned ? '#F0D080' : '#4A4A4A', letterSpacing:'1px', marginBottom:'3px' }}>
                    {b.label}
                  </div>
                  <div style={{ fontFamily:"'IM Fell English', serif", fontSize:'12px', fontStyle:'italic', color: b.earned ? '#7A6A4A' : '#2A2A2A' }}>
                    {b.desc}
                  </div>
                </div>
                {b.earned && <div style={{ marginLeft:'auto', color:'#C9A84C88', fontSize:'12px' }}>✦</div>}
              </div>
            ))}
          </div>
        </div>

        {/* ── Last course plan — collapsed accordion ── */}
        {rec && (
          <div style={{
            background:'linear-gradient(145deg, #0D0A05, #100D08)',
            border:'1px solid #C9A84C33', borderRadius:'16px',
            overflow:'hidden',
          }}>
            {/* Clickable header */}
            <button
              onClick={() => setShowPlan(p => !p)}
              style={{
                width:'100%', padding:'20px 32px',
                background:'transparent', border:'none',
                display:'flex', alignItems:'center', justifyContent:'space-between',
                cursor:'none',
              }}
            >
              <div style={{ display:'flex', alignItems:'center', gap:'14px' }}>
                <span style={{ fontSize:'20px' }}>📜</span>
                <div style={{ textAlign:'left' }}>
                  <div style={{ fontFamily:"'Cinzel', serif", fontSize:'11px', color:'#C9A84C88', letterSpacing:'3px' }}>
                    YOUR LAST AI-GENERATED COURSE PLAN
                  </div>
                  <div style={{ fontFamily:"'IM Fell English', serif", fontSize:'13px', fontStyle:'italic', color:'#5A4A3A', marginTop:'3px' }}>
                    Generated on {recDate} — click to {showPlan ? 'hide' : 'view'} your full plan
                  </div>
                </div>
              </div>
              <div style={{
                fontFamily:"'Cinzel', serif", fontSize:'18px', color:'#C9A84C',
                transform: showPlan ? 'rotate(180deg)' : 'rotate(0deg)',
                transition:'transform 0.3s',
              }}>
                ▾
              </div>
            </button>

            {/* Expanded content */}
            {showPlan && (
              <div style={{ padding:'0 36px 36px' }}>
                <div style={{ height:'1px', background:'linear-gradient(90deg, #C9A84C22, transparent)', marginBottom:'28px' }} />
                <RecommendationDisplay text={rec} />
              </div>
            )}
          </div>
        )}

      </main>
    </div>
  );
}

const fieldLbl = {
  display:'block', fontFamily:"'Cinzel', serif",
  fontSize:'9px', color:'#C9A84C88',
  marginBottom:'7px', letterSpacing:'2px',
};
const fieldInp = (editing) => ({
  width:'100%', padding:'11px 14px',
  background: editing ? '#080808' : 'transparent',
  border:`1px solid ${editing ? '#C9A84C44' : '#C9A84C18'}`,
  borderRadius:'8px',
  color: editing ? '#F5E6C8' : '#9A8A6A',
  fontFamily:"'IM Fell English', serif",
  fontSize:'16px', outline:'none',
  boxSizing:'border-box', transition:'all 0.2s',
});
const ghostBtn = {
  padding:'8px 18px', background:'transparent',
  border:'1px solid #C9A84C44', borderRadius:'6px',
  fontFamily:"'Cinzel', serif", fontSize:'10px',
  letterSpacing:'2px', cursor:'none', color:'#7A5A5A',
};