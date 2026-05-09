import { useEffect, useRef } from 'react';

const GOLD_COLORS = [
  '#FFD700', '#FFC200', '#F0D060', '#D4AF37',
  '#C9A84C', '#F5C518', '#FFEC8B', '#FFF0A0',
  '#FFFFFF', '#FFF8DC',
];

const BLANK =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1' height='1'%3E%3C/svg%3E\") 0 0, none";

const isMobileDevice = () =>
  'ontouchstart' in window ||
  navigator.maxTouchPoints > 0 ||
  window.innerWidth <= 768;

export default function CursorFX() {
  const canvasRef = useRef(null);
  const cursorRef = useRef(null);
  const particles = useRef([]);
  const rafRef    = useRef(null);
  const mobile    = useRef(false);

  useEffect(() => {
    mobile.current = isMobileDevice();

    /* ─── blank system cursor on desktop only ─── */
    const tag = document.createElement('style');
    tag.id = 'cursorfx-css';
    tag.textContent = !mobile.current
      ? `html, html *, html *::before, html *::after { cursor: ${BLANK} !important; }`
      : '';
    document.head.appendChild(tag);

    /* ─── canvas ─── */
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext('2d');
    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
      mobile.current = isMobileDevice();
      tag.textContent = !mobile.current
        ? `html, html *, html *::before, html *::after { cursor: ${BLANK} !important; }`
        : '';
      // hide/show cursor div on resize
      if (cursorRef.current) {
        cursorRef.current.style.display = mobile.current ? 'none' : 'block';
      }
    };
    resize();
    window.addEventListener('resize', resize);

    /* ─── particles ─── */
    function spawn(x, y, count, big) {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = big ? 1.8 + Math.random() * 4 : 0.5 + Math.random() * 1.8;
        const size  = big ? 3   + Math.random() * 4 : 1.5 + Math.random() * 2.8;
        particles.current.push({
          x, y,
          vx:       Math.cos(angle) * speed,
          vy:       Math.sin(angle) * speed - (big ? 1.4 : 0.8),
          alpha:    1, size,
          color:    GOLD_COLORS[Math.floor(Math.random() * GOLD_COLORS.length)],
          isStar:   Math.random() > 0.4,
          rotation: Math.random() * Math.PI * 2,
          rotSpeed: (Math.random() - 0.5) * 0.18,
          decay:    big ? 0.010 + Math.random() * 0.013 : 0.015 + Math.random() * 0.018,
          gravity:  0.035 + Math.random() * 0.03,
        });
      }
    }

    function drawStar(x, y, r, rot) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rot);
      ctx.beginPath();
      for (let i = 0; i < 8; i++) {
        const a   = (i * Math.PI) / 4;
        const rad = i % 2 === 0 ? r : r * 0.38;
        i === 0
          ? ctx.moveTo(Math.cos(a) * rad, Math.sin(a) * rad)
          : ctx.lineTo(Math.cos(a) * rad, Math.sin(a) * rad);
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    /* ─── RAF loop ─── */
    let frame = 0;
    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frame++;

      if (!mobile.current && frame % 2 === 0) {
        const el = cursorRef.current;
        if (el) {
          const x = parseFloat(el.dataset.x || -300);
          const y = parseFloat(el.dataset.y || -300);
          spawn(x + (Math.random() - 0.5) * 6, y + (Math.random() - 0.5) * 6, 2, false);
        }
      }

      particles.current = particles.current.filter(p => p.alpha > 0.01);
      for (const p of particles.current) {
        p.x += p.vx; p.y += p.vy;
        p.vy       += p.gravity;
        p.vx       *= 0.97;
        p.alpha    -= p.decay;
        p.rotation += p.rotSpeed;

        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle   = p.color;
        ctx.shadowBlur  = 10;
        ctx.shadowColor = '#D4AF37';
        p.isStar
          ? drawStar(p.x, p.y, p.size * 1.1, p.rotation)
          : (ctx.beginPath(), ctx.arc(p.x, p.y, p.size * 0.6, 0, Math.PI * 2), ctx.fill());
        ctx.shadowBlur  = 0;
        ctx.globalAlpha = 1;
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    /* ─── events ─── */
    const onMove = (e) => {
      const el = cursorRef.current;
      if (el && !mobile.current) {
        // centre the 12px circle on the pointer
        el.style.transform = `translate(${e.clientX - 6}px, ${e.clientY - 6}px)`;
        el.dataset.x = e.clientX;
        el.dataset.y = e.clientY;
      }
      spawn(e.clientX, e.clientY, 2, false);
    };
    const onClick = (e) => spawn(e.clientX, e.clientY, 20, false);
    const onTouch = (e) => {
      Array.from(e.changedTouches).forEach(t =>
        spawn(t.clientX, t.clientY, 28, true)
      );
    };

    document.addEventListener('mousemove',  onMove,  { passive: true });
    document.addEventListener('click',      onClick);
    document.addEventListener('touchstart', onTouch, { passive: true });
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      document.removeEventListener('mousemove',  onMove);
      document.removeEventListener('click',      onClick);
      document.removeEventListener('touchstart', onTouch);
      window.removeEventListener('resize',       resize);
      cancelAnimationFrame(rafRef.current);
      document.getElementById('cursorfx-css')?.remove();
    };
  }, []);

  return (
    <>
      {/* sparkle canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position:      'fixed',
          top:           0,
          left:          0,
          width:         '100vw',
          height:        '100vh',
          pointerEvents: 'none',
          zIndex:        999998,
        }}
      />

      {/* small gold circle — desktop only, hidden on mobile */}
      <div
        ref={cursorRef}
        style={{
          display:       isMobileDevice() ? 'none' : 'block',
          position:      'fixed',
          top:           0,
          left:          0,
          width:         12,
          height:        12,
          borderRadius:  '50%',
          background:    'radial-gradient(circle, #FFFFFF 0%, #FFD700 60%, #D4AF37 100%)',
          boxShadow:     '0 0 6px 2px #FFD700, 0 0 14px 5px rgba(212,175,55,0.5)',
          pointerEvents: 'none',
          zIndex:        999999,
          willChange:    'transform',
          transform:     'translate(-300px, -300px)',
        }}
      />
    </>
  );
}