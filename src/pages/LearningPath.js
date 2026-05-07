import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import BackgroundFX from '../components/BackgroundFX';
import { userStorage } from '../services/userStorage';
import RecommendationDisplay from '../components/RecommendationDisplay';

const MONTHS = [
  { num:1, icon:'🌱', title:'Month 1 — Foundations',       desc:'Learn the basics and core concepts of your chosen field' },
  { num:2, icon:'📖', title:'Month 2 — Theory & Depth',     desc:'Go deeper — understand the "why" behind things' },
  { num:3, icon:'🧪', title:'Month 3 — Hands-On Practice',  desc:'Build small projects and apply what you have learned' },
  { num:4, icon:'⚔️', title:'Month 4 — Real Challenges',    desc:'Tackle harder problems and work on a bigger project' },
  { num:5, icon:'🔮', title:'Month 5 — Specialisation',     desc:'Pick a niche within your field and go deeper' },
  { num:6, icon:'🎓', title:'Month 6 — Capstone & Career',  desc:'Build a portfolio project and start applying for jobs' },
];

const STATUS_OPTIONS = [
  { value:'not_started', label:'Not Started', color:'#4A4A4A', bg:'#1A1A1A' },
  { value:'in_progress', label:'In Progress', color:'#C9A84C', bg:'#C9A84C18' },
  { value:'completed',   label:'Completed ✓', color:'#40C070', bg:'#40C07018' },
];

export default function LearningPath() {
  const [activeMonth, setActiveMonth] = useState(0);
  const [notes,       setNotes]       = useState({});
  const [statuses,    setStatuses]    = useState({});
  const [resources,   setResources]   = useState({});
  const [noteInput,   setNoteInput]   = useState('');
  const [resInput,    setResInput]    = useState('');
  const [activeTab,   setActiveTab]   = useState('notes');
  const [showPlan,    setShowPlan]    = useState(false);

  // Only load tracker data — NOT the full curriculum text
  useEffect(() => {
    setNotes(userStorage.get('wizard_notes') || {});
    setStatuses(userStorage.get('month_statuses') || {});
    setResources(userStorage.get('month_resources') || {});
  }, []);

  /* ── Notes ── */
  const saveNote = () => {
    if (!noteInput.trim()) return;
    const updated = { ...notes, [activeMonth]: [...(notes[activeMonth] || []), noteInput.trim()] };
    setNotes(updated);
    userStorage.set('wizard_notes', updated);
    setNoteInput('');
  };
  const deleteNote = (mIdx, nIdx) => {
    const updated = { ...notes, [mIdx]: (notes[mIdx] || []).filter((_, i) => i !== nIdx) };
    setNotes(updated);
    userStorage.set('wizard_notes', updated);
  };

  /* ── Resources ── */
  const saveResource = () => {
    if (!resInput.trim()) return;
    const updated = { ...resources, [activeMonth]: [...(resources[activeMonth] || []), resInput.trim()] };
    setResources(updated);
    userStorage.set('month_resources', updated);
    setResInput('');
  };
  const deleteResource = (mIdx, rIdx) => {
    const updated = { ...resources, [mIdx]: (resources[mIdx] || []).filter((_, i) => i !== rIdx) };
    setResources(updated);
    userStorage.set('month_resources', updated);
  };

  /* ── Status ── */
  const setStatus = (mIdx, val) => {
    const updated = { ...statuses, [mIdx]: val };
    setStatuses(updated);
    userStorage.set('month_statuses', updated);
  };

  /* ── Progress ── */
  const completedCount = Object.values(statuses).filter(s => s === 'completed').length;
  const progressPct    = Math.round((completedCount / 6) * 100);

  /* ── Plan data (only read when user clicks "View Plan") ── */
  const rec     = userStorage.get('last_recommendation') || '';
  const recDate = userStorage.get('last_rec_date') || '';

  return (
    <div style={{ display:'flex', minHeight:'100vh', background:'#080808' }}>
      <BackgroundFX />
      <Sidebar />
      <main style={{ marginLeft:'240px', flex:1, padding:'44px 52px', position:'relative', zIndex:10 }}>

        {/* ── Page header ── */}
        <div style={{ marginBottom:'36px' }}>
          <div style={{ fontFamily:"'Cinzel', serif", fontSize:'10px', color:'#C9A84C88', letterSpacing:'5px', marginBottom:'10px' }}>
            📜 MY LEARNING PATH
          </div>
          <h1 style={{
            fontFamily:"'Cinzel Decorative', cursive",
            fontSize:'clamp(22px, 3.5vw, 40px)', fontWeight:900,
            background:'linear-gradient(135deg, #C9A84C, #F0D080)',
            WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
            lineHeight:1.2, marginBottom:'10px',
          }}>
            Your 6-Month Learning Journey
          </h1>
          <p style={{ fontFamily:"'IM Fell English', serif", fontSize:'16px', fontStyle:'italic', color:'#7A6A4A', maxWidth:'580px', lineHeight:1.7 }}>
            Track your progress month by month. Click any month card to add notes, save resources, and mark your progress.
          </p>
        </div>

        {/* ── Overall progress bar ── */}
        <div style={{
          background:'#0D0A0A', border:'1px solid #C9A84C22',
          borderRadius:'12px', padding:'20px 28px', marginBottom:'32px',
        }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'12px' }}>
            <div style={{ fontFamily:"'Cinzel', serif", fontSize:'11px', color:'#C9A84C88', letterSpacing:'3px' }}>
              OVERALL PROGRESS
            </div>
            <div style={{ fontFamily:"'Cinzel Decorative', cursive", fontSize:'20px', color:'#F0D080' }}>
              {completedCount} / 6 months completed
            </div>
          </div>
          <div style={{ height:'8px', background:'#1A1A1A', borderRadius:'4px', overflow:'hidden' }}>
            <div style={{
              height:'100%', borderRadius:'4px', width:`${progressPct}%`,
              background: progressPct === 100
                ? 'linear-gradient(90deg, #2A8A4A, #40C070)'
                : 'linear-gradient(90deg, #6B0F1A, #C9A84C)',
              transition:'width 0.6s ease',
            }} />
          </div>
          <div style={{ display:'flex', justifyContent:'space-between', marginTop:'10px' }}>
            <div style={{ fontFamily:"'IM Fell English', serif", fontSize:'13px', fontStyle:'italic', color:'#5A4A3A' }}>
              {progressPct === 0    && 'You have not started yet — click a month below to begin!'}
              {progressPct > 0   && progressPct < 50  && 'Great start! Keep going.'}
              {progressPct >= 50 && progressPct < 100 && 'You are over halfway there! Excellent progress.'}
              {progressPct === 100 && '🎓 Congratulations! You have completed your full learning path!'}
            </div>
            <div style={{ fontFamily:"'Cinzel', serif", fontSize:'13px', color:'#C9A84C' }}>
              {progressPct}%
            </div>
          </div>
        </div>

        {/* ── Month cards grid ── */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:'14px', marginBottom:'32px' }}>
          {MONTHS.map((m, i) => {
            const status  = statuses[i] || 'not_started';
            const st      = STATUS_OPTIONS.find(s => s.value === status);
            const noteLen = (notes[i] || []).length;
            const resLen  = (resources[i] || []).length;
            const active  = activeMonth === i;

            return (
              <button key={i} onClick={() => setActiveMonth(i)} style={{
                background: active
                  ? 'linear-gradient(145deg, #1A1005, #1A0808)'
                  : 'linear-gradient(145deg, #0D0A0A, #111008)',
                border:`1px solid ${active ? '#C9A84C' : '#C9A84C18'}`,
                borderRadius:'12px', padding:'20px',
                textAlign:'left', cursor:'none',
                transition:'all 0.25s',
                boxShadow: active ? '0 0 28px #C9A84C18' : 'none',
              }}>
                {/* Icon + status badge */}
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'10px' }}>
                  <span style={{ fontSize:'30px' }}>{m.icon}</span>
                  <div style={{
                    padding:'4px 10px',
                    background:st.bg, border:`1px solid ${st.color}55`,
                    borderRadius:'10px', fontFamily:"'Cinzel', serif",
                    fontSize:'9px', color:st.color, letterSpacing:'1px',
                  }}>
                    {st.label}
                  </div>
                </div>

                {/* Title */}
                <div style={{
                  fontFamily:"'Cinzel', serif", fontSize:'11px',
                  color: active ? '#F0D080' : '#C9A84C',
                  letterSpacing:'1px', marginBottom:'6px',
                }}>
                  {m.title}
                </div>

                {/* Desc */}
                <div style={{
                  fontFamily:"'IM Fell English', serif", fontSize:'13px',
                  fontStyle:'italic', color:'#5A4A3A', lineHeight:1.5, marginBottom:'12px',
                }}>
                  {m.desc}
                </div>

                {/* Mini stats */}
                {(noteLen > 0 || resLen > 0) && (
                  <div style={{ display:'flex', gap:'12px' }}>
                    {noteLen > 0 && (
                      <div style={{ fontFamily:"'Cinzel', serif", fontSize:'9px', color:'#C9A84C66', letterSpacing:'1px' }}>
                        📝 {noteLen} note{noteLen > 1 ? 's' : ''}
                      </div>
                    )}
                    {resLen > 0 && (
                      <div style={{ fontFamily:"'Cinzel', serif", fontSize:'9px', color:'#C9A84C66', letterSpacing:'1px' }}>
                        🔗 {resLen} resource{resLen > 1 ? 's' : ''}
                      </div>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* ── Active month detail panel ── */}
        <div style={{
          background:'linear-gradient(145deg, #0D0A05, #100D08)',
          border:'1px solid #C9A84C44', borderRadius:'16px',
          padding:'32px', marginBottom:'32px',
          position:'relative', overflow:'hidden',
        }}>
          <div style={{ position:'absolute', top:0, left:0, right:0, height:'2px', background:'linear-gradient(90deg, transparent, #C9A84C, transparent)' }} />

          {/* Panel header + status switcher */}
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'24px', flexWrap:'wrap', gap:'12px' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'14px' }}>
              <span style={{ fontSize:'36px' }}>{MONTHS[activeMonth].icon}</span>
              <div>
                <div style={{ fontFamily:"'Cinzel Decorative', cursive", fontSize:'18px', color:'#F0D080' }}>
                  {MONTHS[activeMonth].title}
                </div>
                <div style={{ fontFamily:"'IM Fell English', serif", fontSize:'14px', fontStyle:'italic', color:'#7A6A4A', marginTop:'3px' }}>
                  {MONTHS[activeMonth].desc}
                </div>
              </div>
            </div>

            {/* Status buttons */}
            <div style={{ display:'flex', gap:'8px', flexWrap:'wrap' }}>
              {STATUS_OPTIONS.map(opt => {
                const current = (statuses[activeMonth] || 'not_started') === opt.value;
                return (
                  <button key={opt.value} onClick={() => setStatus(activeMonth, opt.value)} style={{
                    padding:'8px 14px',
                    background: current ? opt.bg : 'transparent',
                    border:`1px solid ${current ? opt.color : '#C9A84C22'}`,
                    borderRadius:'8px',
                    color: current ? opt.color : '#4A4A4A',
                    fontFamily:"'Cinzel', serif",
                    fontSize:'9px', letterSpacing:'1.5px', cursor:'none',
                    transition:'all 0.2s',
                  }}>
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display:'flex', gap:'0', marginBottom:'20px', borderBottom:'1px solid #C9A84C18' }}>
            {[
              { id:'notes',     label:'📝 My Notes',        count:(notes[activeMonth]||[]).length     },
              { id:'resources', label:'🔗 Saved Resources',  count:(resources[activeMonth]||[]).length },
            ].map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
                padding:'10px 24px', background:'transparent', border:'none',
                borderBottom:`2px solid ${activeTab === tab.id ? '#C9A84C' : 'transparent'}`,
                color: activeTab === tab.id ? '#F0D080' : '#5A4A3A',
                fontFamily:"'Cinzel', serif", fontSize:'10px',
                letterSpacing:'2px', cursor:'none',
                transition:'all 0.2s', marginBottom:'-1px',
              }}>
                {tab.label}
                {tab.count > 0 && (
                  <span style={{
                    marginLeft:'8px', background:'#C9A84C22',
                    border:'1px solid #C9A84C44', borderRadius:'10px',
                    padding:'2px 8px', fontSize:'9px', color:'#C9A84C',
                  }}>{tab.count}</span>
                )}
              </button>
            ))}
          </div>

          {/* ── NOTES TAB ── */}
          {activeTab === 'notes' && (
            <>
              <div style={{ marginBottom:'16px' }}>
                {(notes[activeMonth] || []).length === 0 ? (
                  <div style={{
                    textAlign:'center', padding:'28px',
                    fontFamily:"'IM Fell English', serif", fontSize:'15px',
                    fontStyle:'italic', color:'#3A2A1A',
                  }}>
                    No notes for this month yet. Add something you learned, a reminder, or anything useful!
                  </div>
                ) : (
                  (notes[activeMonth] || []).map((note, ni) => (
                    <div key={ni} style={{
                      display:'flex', alignItems:'flex-start', gap:'12px',
                      padding:'12px 16px', marginBottom:'8px',
                      background:'#0A0808', border:'1px solid #C9A84C15',
                      borderRadius:'8px',
                    }}>
                      <span style={{ color:'#C9A84C', marginTop:'3px', fontSize:'12px' }}>✦</span>
                      <span style={{ flex:1, fontFamily:"'IM Fell English', serif", fontSize:'16px', color:'#C4A87A', lineHeight:1.6 }}>
                        {note}
                      </span>
                      <button onClick={() => deleteNote(activeMonth, ni)} style={{
                        background:'none', border:'none', color:'#5A3A3A',
                        cursor:'none', fontSize:'14px', padding:'0 4px', flexShrink:0,
                      }}>✕</button>
                    </div>
                  ))
                )}
              </div>
              <div style={{ display:'flex', gap:'10px' }}>
                <input
                  placeholder="Write a note — something you learned, a reminder, a question..."
                  value={noteInput}
                  onChange={e => setNoteInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && saveNote()}
                  style={{
                    flex:1, padding:'12px 16px', background:'#080808',
                    border:'1px solid #C9A84C22', borderRadius:'8px',
                    color:'#F5E6C8', fontFamily:"'IM Fell English', serif",
                    fontSize:'16px', fontStyle:'italic', outline:'none',
                  }}
                />
                <button onClick={saveNote} style={{
                  padding:'12px 24px',
                  background:'linear-gradient(135deg, #6B0F1A, #9B1A2A)',
                  border:'1px solid #C9A84C44', borderRadius:'8px',
                  color:'#F0D080', fontFamily:"'Cinzel', serif",
                  fontSize:'10px', letterSpacing:'2px', cursor:'none', whiteSpace:'nowrap',
                }}>
                  + ADD NOTE
                </button>
              </div>
            </>
          )}

          {/* ── RESOURCES TAB ── */}
          {activeTab === 'resources' && (
            <>
              <div style={{ fontFamily:"'IM Fell English', serif", fontSize:'13px', fontStyle:'italic', color:'#5A4A3A', marginBottom:'14px' }}>
                Save useful links, course names, YouTube videos, or any resource for this month.
              </div>
              <div style={{ marginBottom:'16px' }}>
                {(resources[activeMonth] || []).length === 0 ? (
                  <div style={{
                    textAlign:'center', padding:'28px',
                    fontFamily:"'IM Fell English', serif", fontSize:'15px',
                    fontStyle:'italic', color:'#3A2A1A',
                  }}>
                    No resources saved yet. Paste a link or type a course name!
                  </div>
                ) : (
                  (resources[activeMonth] || []).map((res, ri) => {
                    const isLink = res.startsWith('http://') || res.startsWith('https://');
                    return (
                      <div key={ri} style={{
                        display:'flex', alignItems:'center', gap:'12px',
                        padding:'12px 16px', marginBottom:'8px',
                        background:'#0A0808', border:'1px solid #C9A84C15',
                        borderRadius:'8px',
                      }}>
                        <span style={{ fontSize:'16px' }}>{isLink ? '🔗' : '📌'}</span>
                        {isLink ? (
                          <a href={res} target="_blank" rel="noreferrer" style={{
                            flex:1, fontFamily:"'IM Fell English', serif", fontSize:'15px',
                            color:'#9BB0D0', textDecoration:'none',
                            overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap',
                          }}>{res}</a>
                        ) : (
                          <span style={{ flex:1, fontFamily:"'IM Fell English', serif", fontSize:'15px', color:'#C4A87A' }}>
                            {res}
                          </span>
                        )}
                        <button onClick={() => deleteResource(activeMonth, ri)} style={{
                          background:'none', border:'none', color:'#5A3A3A',
                          cursor:'none', fontSize:'14px', padding:'0 4px', flexShrink:0,
                        }}>✕</button>
                      </div>
                    );
                  })
                )}
              </div>
              <div style={{ display:'flex', gap:'10px' }}>
                <input
                  placeholder="Paste a link (https://...) or type a course / book name..."
                  value={resInput}
                  onChange={e => setResInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && saveResource()}
                  style={{
                    flex:1, padding:'12px 16px', background:'#080808',
                    border:'1px solid #C9A84C22', borderRadius:'8px',
                    color:'#F5E6C8', fontFamily:"'IM Fell English', serif",
                    fontSize:'16px', fontStyle:'italic', outline:'none',
                  }}
                />
                <button onClick={saveResource} style={{
                  padding:'12px 24px',
                  background:'linear-gradient(135deg, #6B0F1A, #9B1A2A)',
                  border:'1px solid #C9A84C44', borderRadius:'8px',
                  color:'#F0D080', fontFamily:"'Cinzel', serif",
                  fontSize:'10px', letterSpacing:'2px', cursor:'none', whiteSpace:'nowrap',
                }}>
                  + SAVE
                </button>
              </div>
            </>
          )}
        </div>

        {/* ── AI Course Plan — collapsed by default, user opens it ── */}
        <div style={{
          background:'linear-gradient(145deg, #0D0A05, #100D08)',
          border:'1px solid #C9A84C33', borderRadius:'16px',
          overflow:'hidden',
        }}>
          {/* Collapsible header */}
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
              <span style={{ fontSize:'22px' }}>📜</span>
              <div style={{ textAlign:'left' }}>
                <div style={{ fontFamily:"'Cinzel', serif", fontSize:'12px', color:'#C9A84C', letterSpacing:'3px' }}>
                  YOUR AI-GENERATED COURSE PLAN
                </div>
                {rec ? (
                  <div style={{ fontFamily:"'IM Fell English', serif", fontSize:'13px', fontStyle:'italic', color:'#5A4A3A', marginTop:'3px' }}>
                    Generated on {recDate} — click to {showPlan ? 'hide' : 'view'} your full plan
                  </div>
                ) : (
                  <div style={{ fontFamily:"'IM Fell English', serif", fontSize:'13px', fontStyle:'italic', color:'#4A3A2A', marginTop:'3px' }}>
                    No plan generated yet — visit The Great Hall to create one
                  </div>
                )}
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

          {/* Expanded plan */}
          {showPlan && (
            <div style={{ padding:'0 32px 36px' }}>
              <div style={{ height:'1px', background:'linear-gradient(90deg, #C9A84C22, transparent)', marginBottom:'28px' }} />

              {rec ? (
                <RecommendationDisplay text={rec} />
              ) : (
                <div style={{ textAlign:'center', padding:'40px 20px' }}>
                  <div style={{ fontSize:'48px', marginBottom:'16px', opacity:0.3 }}>🔮</div>
                  <div style={{ fontFamily:"'Cinzel', serif", fontSize:'12px', color:'#3A2A1A', letterSpacing:'2px', marginBottom:'10px' }}>
                    NO COURSE PLAN YET
                  </div>
                  <div style={{ fontFamily:"'IM Fell English', serif", fontSize:'15px', fontStyle:'italic', color:'#3A2A1A', marginBottom:'24px' }}>
                    You have not generated your personalised course plan yet.
                  </div>
                  <button onClick={() => window.location.href = '/dashboard'} style={{
                    padding:'12px 32px',
                    background:'linear-gradient(135deg, #6B0F1A, #9B1A2A)',
                    border:'1px solid #C9A84C44', borderRadius:'8px',
                    color:'#F0D080', fontFamily:"'Cinzel', serif",
                    fontSize:'11px', letterSpacing:'3px', cursor:'none',
                  }}>
                    ⚡ GO TO THE GREAT HALL
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

      </main>
    </div>
  );
}