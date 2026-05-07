import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import BackgroundFX from '../components/BackgroundFX';
import { userStorage } from '../services/userStorage';
import RecommendationDisplay from '../components/RecommendationDisplay';
import useIsMobile from '../hooks/useIsMobile';

const MONTHS = [
  { num:1, icon:'🌱', title:'Month 1 — Foundations',       desc:'Learn the basics and core concepts' },
  { num:2, icon:'📖', title:'Month 2 — Theory & Depth',     desc:'Go deeper — understand the why' },
  { num:3, icon:'🧪', title:'Month 3 — Hands-On Practice',  desc:'Build small projects and apply what you learned' },
  { num:4, icon:'⚔️', title:'Month 4 — Real Challenges',    desc:'Tackle harder problems and bigger projects' },
  { num:5, icon:'🔮', title:'Month 5 — Specialisation',     desc:'Pick a niche and go deeper' },
  { num:6, icon:'🎓', title:'Month 6 — Capstone & Career',  desc:'Build portfolio and start applying for jobs' },
];

const STATUS_OPTIONS = [
  { value:'not_started', label:'Not Started', color:'#4A4A4A', bg:'#1A1A1A' },
  { value:'in_progress', label:'In Progress', color:'#C9A84C', bg:'#C9A84C18' },
  { value:'completed',   label:'Completed ✓', color:'#40C070', bg:'#40C07018' },
];

export default function LearningPath() {
  const isMobile = useIsMobile();
  const [activeMonth, setActiveMonth] = useState(0);
  const [notes,       setNotes]       = useState({});
  const [statuses,    setStatuses]    = useState({});
  const [resources,   setResources]   = useState({});
  const [noteInput,   setNoteInput]   = useState('');
  const [resInput,    setResInput]    = useState('');
  const [activeTab,   setActiveTab]   = useState('notes');
  const [showPlan,    setShowPlan]    = useState(false);

  useEffect(() => {
    setNotes(userStorage.get('wizard_notes') || {});
    setStatuses(userStorage.get('month_statuses') || {});
    setResources(userStorage.get('month_resources') || {});
  }, []);

  const saveNote = () => {
    if (!noteInput.trim()) return;
    const updated = { ...notes, [activeMonth]: [...(notes[activeMonth] || []), noteInput.trim()] };
    setNotes(updated); userStorage.set('wizard_notes', updated); setNoteInput('');
  };

  const deleteNote = (mIdx, nIdx) => {
    const updated = { ...notes, [mIdx]: (notes[mIdx] || []).filter((_, i) => i !== nIdx) };
    setNotes(updated); userStorage.set('wizard_notes', updated);
  };

  const saveResource = () => {
    if (!resInput.trim()) return;
    const updated = { ...resources, [activeMonth]: [...(resources[activeMonth] || []), resInput.trim()] };
    setResources(updated); userStorage.set('month_resources', updated); setResInput('');
  };

  const deleteResource = (mIdx, rIdx) => {
    const updated = { ...resources, [mIdx]: (resources[mIdx] || []).filter((_, i) => i !== rIdx) };
    setResources(updated); userStorage.set('month_resources', updated);
  };

  const setStatus = (mIdx, val) => {
    const updated = { ...statuses, [mIdx]: val };
    setStatuses(updated); userStorage.set('month_statuses', updated);
  };

  const completedCount = Object.values(statuses).filter(s => s === 'completed').length;
  const progressPct    = Math.round((completedCount / 6) * 100);
  const rec     = userStorage.get('last_recommendation') || '';
  const recDate = userStorage.get('last_rec_date') || '';

  return (
    <div style={{ display:'flex', minHeight:'100vh', background:'#080808' }}>
      <BackgroundFX />
      <Sidebar />
      <main style={{
        marginLeft: isMobile ? '0' : '240px',
        flex: 1,
        padding: isMobile ? '76px 16px 88px' : '44px 52px',
        position: 'relative', zIndex: 10,
      }}>

        {/* Header */}
        <div style={{ marginBottom:'28px' }}>
          <div style={{ fontFamily:"'Cinzel',serif", fontSize:'10px', color:'#C9A84C88', letterSpacing:'5px', marginBottom:'10px' }}>
            📜 MY LEARNING PATH
          </div>
          <h1 style={{
            fontFamily:"'Cinzel Decorative',cursive",
            fontSize: isMobile ? '22px' : 'clamp(22px,3.5vw,40px)',
            fontWeight:900,
            background:'linear-gradient(135deg,#C9A84C,#F0D080)',
            WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
            lineHeight:1.2, marginBottom:'8px',
          }}>
            Your 6-Month Learning Journey
          </h1>
          <p style={{ fontFamily:"'IM Fell English',serif", fontSize: isMobile ? '14px' : '16px', fontStyle:'italic', color:'#7A6A4A' }}>
            Track your progress month by month. Tap any month to add notes and resources.
          </p>
        </div>

        {/* Progress bar */}
        <div style={{
          background:'#0D0A0A', border:'1px solid #C9A84C22',
          borderRadius:'12px', padding:'16px 20px', marginBottom:'24px',
        }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'10px' }}>
            <div style={{ fontFamily:"'Cinzel',serif", fontSize:'10px', color:'#C9A84C88', letterSpacing:'2px' }}>
              OVERALL PROGRESS
            </div>
            <div style={{ fontFamily:"'Cinzel Decorative',cursive", fontSize: isMobile ? '16px' : '18px', color:'#F0D080' }}>
              {completedCount}/6
            </div>
          </div>
          <div style={{ height:'8px', background:'#1A1A1A', borderRadius:'4px', overflow:'hidden' }}>
            <div style={{
              height:'100%', borderRadius:'4px', width:`${progressPct}%`,
              background: progressPct === 100
                ? 'linear-gradient(90deg,#2A8A4A,#40C070)'
                : 'linear-gradient(90deg,#6B0F1A,#C9A84C)',
              transition:'width 0.6s ease',
            }} />
          </div>
          <div style={{ fontFamily:"'IM Fell English',serif", fontSize:'13px', fontStyle:'italic', color:'#5A4A3A', marginTop:'8px' }}>
            {progressPct === 0    && 'Click a month below to get started!'}
            {progressPct > 0   && progressPct < 50  && 'Great start! Keep going.'}
            {progressPct >= 50 && progressPct < 100 && 'Over halfway! Excellent progress.'}
            {progressPct === 100 && '🎓 You completed your full learning path!'}
          </div>
        </div>

        {/* Month cards */}
        <div style={{
          display:'grid',
          gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(3,1fr)',
          gap:'12px', marginBottom:'24px',
        }}>
          {MONTHS.map((m, i) => {
            const status  = statuses[i] || 'not_started';
            const st      = STATUS_OPTIONS.find(s => s.value === status);
            const noteLen = (notes[i] || []).length;
            const resLen  = (resources[i] || []).length;
            const active  = activeMonth === i;

            return (
              <button key={i} onClick={() => setActiveMonth(i)} style={{
                background: active
                  ? 'linear-gradient(145deg,#1A1005,#1A0808)'
                  : 'linear-gradient(145deg,#0D0A0A,#111008)',
                border:`1px solid ${active ? '#C9A84C' : '#C9A84C18'}`,
                borderRadius:'12px',
                padding: isMobile ? '14px 12px' : '20px',
                textAlign:'left', cursor:'pointer',
                transition:'all 0.25s',
                boxShadow: active ? '0 0 20px #C9A84C18' : 'none',
              }}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'8px' }}>
                  <span style={{ fontSize: isMobile ? '22px' : '28px' }}>{m.icon}</span>
                  <div style={{
                    padding:'3px 7px',
                    background:st.bg, border:`1px solid ${st.color}55`,
                    borderRadius:'8px', fontFamily:"'Cinzel',serif",
                    fontSize:'8px', color:st.color, letterSpacing:'1px',
                  }}>
                    {isMobile ? (status === 'completed' ? '✓' : status === 'in_progress' ? '...' : '—') : st.label}
                  </div>
                </div>
                <div style={{
                  fontFamily:"'Cinzel',serif",
                  fontSize: isMobile ? '9px' : '11px',
                  color: active ? '#F0D080' : '#C9A84C',
                  letterSpacing:'1px', marginBottom:'4px',
                }}>
                  {isMobile ? m.title.split('—')[0] : m.title}
                </div>
                {!isMobile && (
                  <div style={{ fontFamily:"'IM Fell English',serif", fontSize:'13px', fontStyle:'italic', color:'#5A4A3A', lineHeight:1.4, marginBottom:'8px' }}>
                    {m.desc}
                  </div>
                )}
                {(noteLen > 0 || resLen > 0) && (
                  <div style={{ display:'flex', gap:'8px' }}>
                    {noteLen > 0 && <div style={{ fontFamily:"'Cinzel',serif", fontSize:'8px', color:'#C9A84C66' }}>📝 {noteLen}</div>}
                    {resLen  > 0 && <div style={{ fontFamily:"'Cinzel',serif", fontSize:'8px', color:'#C9A84C66' }}>🔗 {resLen}</div>}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Detail panel */}
        <div style={{
          background:'linear-gradient(145deg,#0D0A05,#100D08)',
          border:'1px solid #C9A84C44', borderRadius:'16px',
          padding: isMobile ? '20px 16px' : '32px',
          marginBottom:'24px', position:'relative', overflow:'hidden',
        }}>
          <div style={{ position:'absolute', top:0, left:0, right:0, height:'2px', background:'linear-gradient(90deg,transparent,#C9A84C,transparent)' }} />

          {/* Panel header */}
          <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:'20px', flexWrap:'wrap', gap:'12px' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
              <span style={{ fontSize:'28px' }}>{MONTHS[activeMonth].icon}</span>
              <div>
                <div style={{ fontFamily:"'Cinzel Decorative',cursive", fontSize: isMobile ? '15px' : '18px', color:'#F0D080' }}>
                  {MONTHS[activeMonth].title}
                </div>
                <div style={{ fontFamily:"'IM Fell English',serif", fontSize:'13px', fontStyle:'italic', color:'#7A6A4A', marginTop:'2px' }}>
                  {MONTHS[activeMonth].desc}
                </div>
              </div>
            </div>

            {/* Status buttons */}
            <div style={{ display:'flex', gap:'6px', flexWrap:'wrap' }}>
              {STATUS_OPTIONS.map(opt => {
                const current = (statuses[activeMonth] || 'not_started') === opt.value;
                return (
                  <button key={opt.value} onClick={() => setStatus(activeMonth, opt.value)} style={{
                    padding: isMobile ? '6px 10px' : '8px 14px',
                    background: current ? opt.bg : 'transparent',
                    border:`1px solid ${current ? opt.color : '#C9A84C22'}`,
                    borderRadius:'8px', color: current ? opt.color : '#4A4A4A',
                    fontFamily:"'Cinzel',serif",
                    fontSize: isMobile ? '8px' : '9px',
                    letterSpacing:'1px', cursor:'pointer', transition:'all 0.2s',
                  }}>
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display:'flex', marginBottom:'16px', borderBottom:'1px solid #C9A84C18' }}>
            {[
              { id:'notes',     label:'📝 Notes',     count:(notes[activeMonth]||[]).length     },
              { id:'resources', label:'🔗 Resources',  count:(resources[activeMonth]||[]).length },
            ].map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
                padding:'10px 20px', background:'transparent', border:'none',
                borderBottom:`2px solid ${activeTab === tab.id ? '#C9A84C' : 'transparent'}`,
                color: activeTab === tab.id ? '#F0D080' : '#5A4A3A',
                fontFamily:"'Cinzel',serif", fontSize:'10px',
                letterSpacing:'2px', cursor:'pointer',
                transition:'all 0.2s', marginBottom:'-1px',
              }}>
                {tab.label}
                {tab.count > 0 && (
                  <span style={{ marginLeft:'6px', background:'#C9A84C22', border:'1px solid #C9A84C44', borderRadius:'10px', padding:'2px 7px', fontSize:'9px', color:'#C9A84C' }}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Notes tab */}
          {activeTab === 'notes' && (
            <>
              <div style={{ marginBottom:'12px' }}>
                {(notes[activeMonth] || []).length === 0 ? (
                  <div style={{ textAlign:'center', padding:'20px', fontFamily:"'IM Fell English',serif", fontSize:'14px', fontStyle:'italic', color:'#3A2A1A' }}>
                    No notes yet. Add something you learned!
                  </div>
                ) : (
                  (notes[activeMonth] || []).map((note, ni) => (
                    <div key={ni} style={{
                      display:'flex', alignItems:'flex-start', gap:'10px',
                      padding:'10px 14px', marginBottom:'8px',
                      background:'#0A0808', border:'1px solid #C9A84C15', borderRadius:'8px',
                    }}>
                      <span style={{ color:'#C9A84C', marginTop:'3px', fontSize:'10px' }}>✦</span>
                      <span style={{ flex:1, fontFamily:"'IM Fell English',serif", fontSize:'15px', color:'#C4A87A', lineHeight:1.6 }}>
                        {note}
                      </span>
                      <button onClick={() => deleteNote(activeMonth, ni)} style={{ background:'none', border:'none', color:'#5A3A3A', cursor:'pointer', fontSize:'13px' }}>✕</button>
                    </div>
                  ))
                )}
              </div>
              <div style={{ display:'flex', gap:'8px' }}>
                <input
                  placeholder="Write a note..."
                  value={noteInput}
                  onChange={e => setNoteInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && saveNote()}
                  style={{
                    flex:1, padding:'10px 14px', background:'#080808',
                    border:'1px solid #C9A84C22', borderRadius:'8px',
                    color:'#F5E6C8', fontFamily:"'IM Fell English',serif",
                    fontSize:'15px', fontStyle:'italic', outline:'none',
                  }}
                />
                <button onClick={saveNote} style={{
                  padding:'10px 16px',
                  background:'linear-gradient(135deg,#6B0F1A,#9B1A2A)',
                  border:'1px solid #C9A84C44', borderRadius:'8px',
                  color:'#F0D080', fontFamily:"'Cinzel',serif",
                  fontSize:'9px', letterSpacing:'1px', cursor:'pointer', whiteSpace:'nowrap',
                }}>+ ADD</button>
              </div>
            </>
          )}

          {/* Resources tab */}
          {activeTab === 'resources' && (
            <>
              <div style={{ marginBottom:'12px' }}>
                {(resources[activeMonth] || []).length === 0 ? (
                  <div style={{ textAlign:'center', padding:'20px', fontFamily:"'IM Fell English',serif", fontSize:'14px', fontStyle:'italic', color:'#3A2A1A' }}>
                    No resources saved yet. Paste a link or course name!
                  </div>
                ) : (
                  (resources[activeMonth] || []).map((res, ri) => {
                    const isLink = res.startsWith('http://') || res.startsWith('https://');
                    return (
                      <div key={ri} style={{
                        display:'flex', alignItems:'center', gap:'10px',
                        padding:'10px 14px', marginBottom:'8px',
                        background:'#0A0808', border:'1px solid #C9A84C15', borderRadius:'8px',
                      }}>
                        <span>{isLink ? '🔗' : '📌'}</span>
                        {isLink ? (
                          <a href={res} target="_blank" rel="noreferrer" style={{
                            flex:1, fontFamily:"'IM Fell English',serif", fontSize:'14px',
                            color:'#9BB0D0', textDecoration:'none',
                            overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap',
                          }}>{res}</a>
                        ) : (
                          <span style={{ flex:1, fontFamily:"'IM Fell English',serif", fontSize:'14px', color:'#C4A87A' }}>{res}</span>
                        )}
                        <button onClick={() => deleteResource(activeMonth, ri)} style={{ background:'none', border:'none', color:'#5A3A3A', cursor:'pointer', fontSize:'13px' }}>✕</button>
                      </div>
                    );
                  })
                )}
              </div>
              <div style={{ display:'flex', gap:'8px' }}>
                <input
                  placeholder="Paste a link or type a course name..."
                  value={resInput}
                  onChange={e => setResInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && saveResource()}
                  style={{
                    flex:1, padding:'10px 14px', background:'#080808',
                    border:'1px solid #C9A84C22', borderRadius:'8px',
                    color:'#F5E6C8', fontFamily:"'IM Fell English',serif",
                    fontSize:'15px', fontStyle:'italic', outline:'none',
                  }}
                />
                <button onClick={saveResource} style={{
                  padding:'10px 16px',
                  background:'linear-gradient(135deg,#6B0F1A,#9B1A2A)',
                  border:'1px solid #C9A84C44', borderRadius:'8px',
                  color:'#F0D080', fontFamily:"'Cinzel',serif",
                  fontSize:'9px', letterSpacing:'1px', cursor:'pointer', whiteSpace:'nowrap',
                }}>+ SAVE</button>
              </div>
            </>
          )}
        </div>

        {/* Collapsible AI plan */}
        <div style={{ background:'linear-gradient(145deg,#0D0A05,#100D08)', border:'1px solid #C9A84C33', borderRadius:'16px', overflow:'hidden' }}>
          <button onClick={() => setShowPlan(p => !p)} style={{
            width:'100%', padding: isMobile ? '16px' : '20px 32px',
            background:'transparent', border:'none',
            display:'flex', alignItems:'center', justifyContent:'space-between', cursor:'pointer',
          }}>
            <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
              <span style={{ fontSize:'20px' }}>📜</span>
              <div style={{ textAlign:'left' }}>
                <div style={{ fontFamily:"'Cinzel',serif", fontSize:'11px', color:'#C9A84C88', letterSpacing:'2px' }}>
                  YOUR AI-GENERATED COURSE PLAN
                </div>
                <div style={{ fontFamily:"'IM Fell English',serif", fontSize:'12px', fontStyle:'italic', color:'#5A4A3A', marginTop:'2px' }}>
                  {rec ? `Generated on ${recDate} — click to ${showPlan ? 'hide' : 'view'}` : 'No plan yet — visit The Great Hall'}
                </div>
              </div>
            </div>
            <div style={{ color:'#C9A84C', fontSize:'18px', transform: showPlan ? 'rotate(180deg)' : 'rotate(0deg)', transition:'transform 0.3s' }}>▾</div>
          </button>

          {showPlan && (
            <div style={{ padding: isMobile ? '0 16px 24px' : '0 32px 36px' }}>
              <div style={{ height:'1px', background:'linear-gradient(90deg,#C9A84C22,transparent)', marginBottom:'24px' }} />
              {rec ? (
                <RecommendationDisplay text={rec} />
              ) : (
                <div style={{ textAlign:'center', padding:'32px 20px' }}>
                  <div style={{ fontSize:'40px', marginBottom:'14px', opacity:0.3 }}>🔮</div>
                  <div style={{ fontFamily:"'IM Fell English',serif", fontSize:'15px', fontStyle:'italic', color:'#3A2A1A', marginBottom:'20px' }}>
                    You have not generated your course plan yet.
                  </div>
                  <button onClick={() => window.location.href = '/dashboard'} style={{
                    padding:'12px 28px',
                    background:'linear-gradient(135deg,#6B0F1A,#9B1A2A)',
                    border:'1px solid #C9A84C44', borderRadius:'8px',
                    color:'#F0D080', fontFamily:"'Cinzel',serif",
                    fontSize:'11px', letterSpacing:'2px', cursor:'pointer',
                  }}>
                    ⚡ GO TO GREAT HALL
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