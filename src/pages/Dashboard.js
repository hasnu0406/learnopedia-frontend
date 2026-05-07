import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import BackgroundFX from '../components/BackgroundFX';
import { getRecommendations } from '../services/api';
import { userStorage } from '../services/userStorage';
import RecommendationDisplay from '../components/RecommendationDisplay';

const SUGGESTIONS = {
  interests: [
    'Machine Learning', 'Web Development', 'Data Science', 'UI/UX Design',
    'Cybersecurity', 'Blockchain', 'Cloud Computing', 'Mobile Development',
    'Game Development', 'DevOps', 'Artificial Intelligence', 'Data Engineering',
  ],
  skills: [
    'Python', 'JavaScript', 'SQL', 'React', 'Java', 'C++',
    'Excel', 'Figma', 'Node.js', 'TypeScript', 'HTML/CSS', 'Git',
  ],
  goals: [
    'Get a tech job', 'Start a startup', 'Freelance career',
    'Become a Data Analyst', 'Become a Full-Stack Developer',
    'Become an AI/ML Engineer', 'Become a Product Manager',
    'Switch careers into tech', 'Get a promotion', 'Learn for fun',
  ],
};

const SECTION_META = [
  { key:'interests', icon:'📚', title:'What are you interested in?',       subtitle:'Pick the topics you enjoy or want to learn about',                              ph:'Type a custom interest...' },
  { key:'skills',    icon:'🪄', title:'What skills do you already have?',  subtitle:'Select everything you know even a little — no need to be an expert',           ph:'Type a custom skill...'    },
  { key:'goals',     icon:'🎯', title:'What is your goal?',                subtitle:'Where do you want to be after completing your learning path?',                  ph:'Type a custom goal...'     },
];

export default function Dashboard() {
  const [interests,      setInterests]      = useState([]);
  const [skills,         setSkills]         = useState([]);
  const [goals,          setGoals]          = useState([]);
  const [custom,         setCustom]         = useState({ interests:'', skills:'', goals:'' });
  const [recommendation, setRecommendation] = useState('');
  const [loading,        setLoading]        = useState(false);
  const [error,          setError]          = useState('');
  const [step,           setStep]           = useState(0);

  const listMap   = { interests, skills, goals };
  const setterMap = { interests: setInterests, skills: setSkills, goals: setGoals };

  const toggle = (field, item) => {
    const list = listMap[field];
    setterMap[field](list.includes(item) ? list.filter(x => x !== item) : [...list, item]);
  };

  const addCustom = (field) => {
    const val = custom[field].trim();
    if (!val) return;
    if (!listMap[field].includes(val)) setterMap[field]([...listMap[field], val]);
    setCustom({ ...custom, [field]: '' });
  };

  const handleSubmit = async () => {
    if (!interests.length || !skills.length || !goals.length) {
      setError('Please select at least one item from each section before generating your path.');
      return;
    }
    setLoading(true); setError(''); setRecommendation('');
    try {
      const data = await getRecommendations(interests, skills, goals);
      setRecommendation(data.recommendation);
      userStorage.set('last_recommendation', data.recommendation);
      userStorage.set('last_rec_date', new Date().toLocaleDateString());
      setStep(1);
      window.scrollTo({ top:0, behavior:'smooth' });
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally { setLoading(false); }
  };

  const handleReset = () => {
    setStep(0);
    setInterests([]); setSkills([]); setGoals([]);
    setRecommendation(''); setError('');
    window.scrollTo({ top:0, behavior:'smooth' });
  };

  return (
    <div style={{ display:'flex', minHeight:'100vh', background:'#080808' }}>
      <BackgroundFX />
      <Sidebar />
      <main style={{ marginLeft:'240px', flex:1, padding:'44px 52px', position:'relative', zIndex:10 }}>

        {step === 0 ? (
          <>
            {/* Header */}
            <div style={{ marginBottom:'40px' }}>
              <div style={{ fontFamily:"'Cinzel', serif", fontSize:'10px', color:'#C9A84C88', letterSpacing:'5px', marginBottom:'10px' }}>
                ⚡ THE GREAT HALL — GET YOUR COURSE RECOMMENDATION
              </div>
              <h1 style={{
                fontFamily:"'Cinzel Decorative', cursive",
                fontSize:'clamp(22px, 4vw, 42px)', fontWeight:900,
                background:'linear-gradient(135deg, #8B6914, #C9A84C, #F0D080, #C9A84C)',
                WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
                lineHeight:1.2, marginBottom:'10px',
              }}>
                Build Your AI Learning Path
              </h1>
              <p style={{ fontFamily:"'IM Fell English', serif", fontSize:'17px', fontStyle:'italic', color:'#7A6A4A', maxWidth:'600px', lineHeight:1.7 }}>
                Answer three simple questions below. Our AI will instantly generate a personalised course plan and 6-month roadmap just for you.
              </p>
              <div style={{ width:'100px', height:'1px', marginTop:'18px', background:'linear-gradient(90deg, #C9A84C, transparent)' }} />
            </div>

            {/* Progress pills */}
            <div style={{ display:'flex', gap:'12px', alignItems:'center', marginBottom:'32px', flexWrap:'wrap' }}>
              {SECTION_META.map((s, i) => {
                const list = listMap[s.key];
                const done = list.length > 0;
                return (
                  <React.Fragment key={s.key}>
                    <div style={{
                      display:'flex', alignItems:'center', gap:'8px',
                      padding:'8px 16px',
                      background: done ? '#C9A84C18' : '#0D0A0A',
                      border:`1px solid ${done ? '#C9A84C' : '#C9A84C22'}`,
                      borderRadius:'20px', transition:'all 0.3s',
                    }}>
                      <span style={{ fontSize:'16px' }}>{done ? '✅' : s.icon}</span>
                      <span style={{ fontFamily:"'Cinzel', serif", fontSize:'10px', color: done ? '#F0D080' : '#6A5A3A', letterSpacing:'1px' }}>
                        {s.title.split(' ').slice(0,3).join(' ')}...
                      </span>
                      {done && (
                        <span style={{ fontFamily:"'Cinzel', serif", fontSize:'10px', color:'#C9A84C' }}>({list.length})</span>
                      )}
                    </div>
                    {i < 2 && <div style={{ color:'#C9A84C33', fontSize:'16px' }}>›</div>}
                  </React.Fragment>
                );
              })}
            </div>

            {/* Error */}
            {error && (
              <div style={{
                background:'#1A0808', border:'1px solid #8B3030',
                borderRadius:'10px', padding:'14px 20px', color:'#D07070',
                marginBottom:'28px',
                fontFamily:"'IM Fell English', serif", fontSize:'16px', fontStyle:'italic',
              }}>⚠ {error}</div>
            )}

            {/* Sections */}
            {SECTION_META.map((s, sIdx) => {
              const list = listMap[s.key];
              return (
                <div key={s.key} style={{
                  background:'linear-gradient(145deg, #0D0A0A, #111008)',
                  border:'1px solid #C9A84C22', borderRadius:'14px',
                  padding:'32px', marginBottom:'20px',
                  boxShadow:'inset 0 1px 0 #C9A84C08',
                }}>
                  <div style={{ display:'flex', alignItems:'flex-start', gap:'14px', marginBottom:'18px' }}>
                    <span style={{ fontSize:'28px', marginTop:'2px' }}>{s.icon}</span>
                    <div style={{ flex:1 }}>
                      <div style={{ fontFamily:"'Cinzel', serif", fontSize:'14px', color:'#F0D080', letterSpacing:'1px', marginBottom:'4px' }}>
                        {sIdx + 1}. {s.title}
                      </div>
                      <div style={{ fontFamily:"'IM Fell English', serif", fontSize:'14px', fontStyle:'italic', color:'#6A5A3A' }}>
                        {s.subtitle}
                      </div>
                    </div>
                    {list.length > 0 && (
                      <div style={{
                        whiteSpace:'nowrap', fontFamily:"'Cinzel', serif", fontSize:'10px',
                        color:'#C9A84C', background:'#C9A84C18', border:'1px solid #C9A84C44',
                        borderRadius:'12px', padding:'4px 12px',
                      }}>
                        {list.length} selected
                      </div>
                    )}
                  </div>

                  {/* Tags */}
                  <div style={{ display:'flex', flexWrap:'wrap', gap:'9px', marginBottom:'18px' }}>
                    {SUGGESTIONS[s.key].map(item => {
                      const active = list.includes(item);
                      return (
                        <button key={item} onClick={() => toggle(s.key, item)} style={{
                          padding:'9px 18px',
                          background: active ? '#C9A84C18' : 'transparent',
                          border:`1px solid ${active ? '#C9A84C' : '#C9A84C2A'}`,
                          borderRadius:'20px',
                          color: active ? '#F0D080' : '#6A5A3A',
                          fontFamily:"'IM Fell English', serif",
                          fontSize:'15px', fontStyle: active ? 'normal' : 'italic',
                          cursor:'none', transition:'all 0.2s',
                          boxShadow: active ? '0 0 10px #C9A84C18' : 'none',
                        }}>
                          {active ? '✦ ' : ''}{item}
                        </button>
                      );
                    })}
                    {list.filter(x => !SUGGESTIONS[s.key].includes(x)).map(item => (
                      <button key={item} onClick={() => toggle(s.key, item)} style={{
                        padding:'9px 18px',
                        background:'#C9A84C18', border:'1px solid #C9A84C',
                        borderRadius:'20px', color:'#F0D080',
                        fontFamily:"'IM Fell English', serif", fontSize:'15px',
                        cursor:'none',
                      }}>
                        ✦ {item} ✕
                      </button>
                    ))}
                  </div>

                  <div style={{ height:'1px', background:'linear-gradient(90deg, transparent, #C9A84C18, transparent)', marginBottom:'16px' }} />

                  {/* Custom input */}
                  <div style={{ display:'flex', gap:'10px', alignItems:'center' }}>
                    <div style={{ fontFamily:"'Cinzel', serif", fontSize:'9px', color:'#C9A84C66', letterSpacing:'2px', whiteSpace:'nowrap' }}>
                      ADD CUSTOM:
                    </div>
                    <input
                      placeholder={s.ph}
                      value={custom[s.key]}
                      onChange={e => setCustom({ ...custom, [s.key]: e.target.value })}
                      onKeyDown={e => e.key === 'Enter' && addCustom(s.key)}
                      style={{
                        flex:1, padding:'10px 16px', background:'#080808',
                        border:'1px solid #C9A84C22', borderRadius:'8px',
                        color:'#F5E6C8', fontFamily:"'IM Fell English', serif",
                        fontSize:'16px', fontStyle:'italic', outline:'none',
                      }}
                    />
                    <button onClick={() => addCustom(s.key)} style={{
                      padding:'10px 20px', background:'transparent',
                      border:'1px solid #C9A84C44', borderRadius:'8px',
                      color:'#C9A84C', fontFamily:"'Cinzel', serif",
                      fontSize:'10px', letterSpacing:'2px', cursor:'none', whiteSpace:'nowrap',
                    }}>
                      + ADD
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Summary */}
            {(interests.length > 0 || skills.length > 0 || goals.length > 0) && (
              <div style={{
                background:'#0D0A05', border:'1px solid #C9A84C33',
                borderRadius:'12px', padding:'20px 28px', marginBottom:'24px',
              }}>
                <div style={{ fontFamily:"'Cinzel', serif", fontSize:'10px', color:'#C9A84C88', letterSpacing:'3px', marginBottom:'14px' }}>
                  YOUR SELECTIONS AT A GLANCE
                </div>
                <div style={{ display:'flex', flexWrap:'wrap', gap:'24px' }}>
                  {[
                    { label:'Interests', list:interests, icon:'📚' },
                    { label:'Skills',    list:skills,    icon:'🪄' },
                    { label:'Goals',     list:goals,     icon:'🎯' },
                  ].map(g => (
                    <div key={g.label} style={{ flex:1, minWidth:'180px' }}>
                      <div style={{ fontFamily:"'Cinzel', serif", fontSize:'9px', color:'#C9A84C66', letterSpacing:'2px', marginBottom:'8px' }}>
                        {g.icon} {g.label.toUpperCase()} ({g.list.length})
                      </div>
                      <div style={{ display:'flex', flexWrap:'wrap', gap:'6px' }}>
                        {g.list.length === 0 ? (
                          <span style={{ fontFamily:"'IM Fell English', serif", fontSize:'13px', fontStyle:'italic', color:'#4A3A2A' }}>Nothing selected yet</span>
                        ) : g.list.map(item => (
                          <span key={item} style={{
                            fontFamily:"'IM Fell English', serif", fontSize:'13px',
                            color:'#C4A87A', background:'#C9A84C0A',
                            border:'1px solid #C9A84C22', borderRadius:'4px', padding:'3px 10px',
                          }}>
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Generate button */}
            <button onClick={handleSubmit} disabled={loading} style={{
              width:'100%', padding:'20px',
              background: loading ? '#1A1A1A' : 'linear-gradient(135deg, #6B0F1A 0%, #9B1A2A 50%, #6B0F1A 100%)',
              border:'1px solid #C9A84C88', borderRadius:'12px',
              color: loading ? '#4A4A4A' : '#F0D080',
              fontFamily:"'Cinzel', serif",
              fontSize:'15px', fontWeight:700, letterSpacing:'4px',
              cursor:'none', marginBottom:'16px',
              boxShadow: loading ? 'none' : '0 0 40px #C9A84C18, 0 0 80px #6B0F1A33',
              transition:'all 0.3s',
            }}>
              {loading ? '⏳ Generating your personalised learning path...' : '⚡ GENERATE MY LEARNING PATH'}
            </button>

            {loading && (
              <div style={{ textAlign:'center', fontFamily:"'IM Fell English', serif", fontSize:'15px', fontStyle:'italic', color:'#C9A84C55' }}>
                The AI is analysing your profile and crafting a custom plan. This takes about 10–15 seconds...
              </div>
            )}
          </>
        ) : (
          <>
            {/* Result view */}
            <div style={{ marginBottom:'32px' }}>
              <div style={{ fontFamily:"'Cinzel', serif", fontSize:'10px', color:'#C9A84C88', letterSpacing:'5px', marginBottom:'10px' }}>
                ✦ YOUR PERSONALISED RESULT
              </div>
              <h1 style={{
                fontFamily:"'Cinzel Decorative', cursive",
                fontSize:'clamp(22px, 4vw, 38px)', fontWeight:900,
                background:'linear-gradient(135deg, #C9A84C, #F0D080)',
                WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
                marginBottom:'10px',
              }}>
                Your AI-Generated Course Plan 📜
              </h1>
              <p style={{ fontFamily:"'IM Fell English', serif", fontSize:'16px', fontStyle:'italic', color:'#7A6A4A' }}>
                Based on your interests, skills, and goals — your personalised learning roadmap
              </p>
            </div>

            {/* Selections recap chips */}
            <div style={{ display:'flex', gap:'10px', flexWrap:'wrap', marginBottom:'28px' }}>
              {[
                { label:'Interests', list:interests, icon:'📚' },
                { label:'Skills',    list:skills,    icon:'🪄' },
                { label:'Goals',     list:goals,     icon:'🎯' },
              ].map(g => (
                <div key={g.label} style={{
                  background:'#0D0A0A', border:'1px solid #C9A84C22',
                  borderRadius:'8px', padding:'8px 14px',
                  fontFamily:"'Cinzel', serif", fontSize:'10px',
                  color:'#C9A84C88', letterSpacing:'1px',
                  maxWidth:'320px',
                }}>
                  {g.icon} {g.label}: <span style={{ color:'#C9A84C' }}>{g.list.join(', ')}</span>
                </div>
              ))}
            </div>

            {/* Formatted result */}
            <div style={{
              background:'linear-gradient(145deg, #0D0A05, #100D08)',
              border:'1px solid #C9A84C55', borderRadius:'16px',
              padding:'44px 48px', marginBottom:'28px',
              position:'relative', overflow:'hidden',
              boxShadow:'0 0 80px #C9A84C08',
            }}>
              <div style={{ position:'absolute', top:0, left:0, right:0, height:'3px', background:'linear-gradient(90deg, transparent, #C9A84C, #F0D080, #C9A84C, transparent)' }} />
              <div style={{ position:'absolute', bottom:0, left:0, right:0, height:'3px', background:'linear-gradient(90deg, transparent, #C9A84C, #F0D080, #C9A84C, transparent)' }} />

              <div style={{ fontFamily:"'Cinzel', serif", fontSize:'11px', color:'#C9A84C66', letterSpacing:'3px', marginBottom:'6px' }}>
                📜 GENERATED ON {new Date().toLocaleDateString().toUpperCase()}
              </div>
              <div style={{ height:'1px', background:'linear-gradient(90deg, #C9A84C22, transparent)', marginBottom:'28px' }} />

              {/* ✅ Formatted output — no more raw text */}
              <RecommendationDisplay text={recommendation} />
            </div>

            {/* Action buttons */}
            <div style={{ display:'flex', gap:'14px', flexWrap:'wrap' }}>
              <button onClick={handleReset} style={{
                flex:1, minWidth:'200px', padding:'16px',
                background:'transparent', border:'1px solid #C9A84C66',
                borderRadius:'10px', color:'#C9A84C',
                fontFamily:"'Cinzel', serif", fontSize:'12px',
                letterSpacing:'3px', cursor:'none',
              }}>
                ← START OVER
              </button>
              <button onClick={() => window.location.href = '/learning-path'} style={{
                flex:1, minWidth:'200px', padding:'16px',
                background:'linear-gradient(135deg, #6B0F1A, #9B1A2A)',
                border:'1px solid #C9A84C66', borderRadius:'10px',
                color:'#F0D080', fontFamily:"'Cinzel', serif",
                fontSize:'12px', letterSpacing:'3px', cursor:'none',
                boxShadow:'0 0 20px #C9A84C11',
              }}>
                📖 VIEW MY LEARNING PATH →
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}