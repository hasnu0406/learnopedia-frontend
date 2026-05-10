import { useEffect, useRef } from 'react';

const GOLD = [
  '#FFD700', '#FFC200', '#F0D060', '#D4AF37',
  '#FFEC8B', '#FFF0A0', '#FFFFFF', '#FFF8DC',
];

export default function CursorFX() {
  const dotRef = useRef(null);

  useEffect(() => {
    const isMobile =
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      window.innerWidth <= 768;

    /* ── inject keyframes + spark style ── */
    const style = document.createElement('style');
    style.id = 'cfx-style';
    style.textContent = `
      @keyframes cfx-fly {
        0%   { opacity: 1; transform: translate(-50%, -50%) scale(1) rotate(0deg); }
        100% { opacity: 0; transform: translate(var(--tx), var(--ty)) scale(0) rotate(var(--tr)); }
      }
      @keyframes cfx-star {
        0%   { opacity: 1; transform: translate(-50%, -50%) scale(1.2) rotate(0deg); }
        100% { opacity: 0; transform: translate(var(--tx), var(--ty)) scale(0) rotate(var(--tr)); }
      }
      .cfx-dot  { position:fixed; pointer-events:none; z-index:999997; border-radius:50%;  animation: cfx-fly  var(--dur) ease-out forwards; }
      .cfx-star { position:fixed; pointer-events:none; z-index:999997;                      animation: cfx-star var(--dur) ease-out forwards; }
      ${!isMobile ? `
        html, html *, html *::before, html *::after {
          cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1' height='1'%3E%3C/svg%3E") 0 0, none !important;
        }
      ` : ''}
    `;
    document.head.appendChild(style);

    /* ── show gold dot on desktop only ── */
    const dot = dotRef.current;
    if (dot) dot.style.opacity = isMobile ? '0' : '1';

    /* ── draw a 4-point star as an inline SVG string ── */
    function starSVG(size, color) {
      const r = size / 2;
      const inner = r * 0.38;
      let d = '';
      for (let i = 0; i < 8; i++) {
        const angle = (i * Math.PI) / 4 - Math.PI / 2;
        const rad   = i % 2 === 0 ? r : inner;
        const x     = Math.cos(angle) * rad + r;
        const y     = Math.sin(angle) * rad + r;
        d += (i === 0 ? 'M' : 'L') + `${x},${y}`;
      }
      d += 'Z';
      return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}'%3E%3Cpath d='${d}' fill='${encodeURIComponent(color)}'/%3E%3C/svg%3E`;
    }

    /* ── spawn one sparkle element ── */
    function spawnOne(x, y, big) {
      const color   = GOLD[Math.floor(Math.random() * GOLD.length)];
      const angle   = Math.random() * Math.PI * 2;
      const dist    = big ? 40 + Math.random() * 70 : 18 + Math.random() * 35;
      const dur     = (big ? 0.55 + Math.random() * 0.35 : 0.4 + Math.random() * 0.25).toFixed(2);
      const isStar  = Math.random() > 0.45;
      const size    = big
        ? (isStar ? 10 + Math.random() * 10 : 5 + Math.random() * 6)
        : (isStar ?  6 + Math.random() *  6 : 2 + Math.random() * 4);
      const tx = (Math.cos(angle) * dist).toFixed(1);
      const ty = (Math.sin(angle) * dist).toFixed(1);
      const tr = ((Math.random() - 0.5) * 180).toFixed(0) + 'deg';

      const el = document.createElement('div');
      el.className = isStar ? 'cfx-star' : 'cfx-dot';
      el.style.cssText = `
        left: ${x}px;
        top:  ${y}px;
        width:  ${size}px;
        height: ${size}px;
        --tx: ${tx}px;
        --ty: ${ty}px;
        --tr: ${tr};
        --dur: ${dur}s;
        ${isStar
          ? `background: url("${starSVG(size, color)}") center/contain no-repeat;`
          : `background: ${color}; box-shadow: 0 0 ${size * 1.5}px ${size * 0.8}px ${color};`
        }
      `;
      document.body.appendChild(el);
      setTimeout(() => el.remove(), parseFloat(dur) * 1000 + 50);
    }

    function burst(x, y, count, big) {
      for (let i = 0; i < count; i++) spawnOne(x, y, big);
    }

    /* ── events ── */
    const onMove = (e) => {
      if (dot) {
        dot.style.left = e.clientX + 'px';
        dot.style.top  = e.clientY + 'px';
      }
      /* trail: spawn 2-3 sparks every move */
      burst(e.clientX, e.clientY, 2 + (Math.random() > 0.6 ? 1 : 0), false);
    };

    const onClick = (e) => burst(e.clientX, e.clientY, 20, false);

    /* mobile: burst ONLY on tap (touchstart), not on scroll/drag */
    const onTouch = (e) => {
      Array.from(e.changedTouches).forEach(t =>
        burst(t.clientX, t.clientY, 28, true)
      );
    };

    if (!isMobile) {
      document.addEventListener('mousemove',  onMove,  { passive: true });
      document.addEventListener('click',      onClick);
    } else {
      document.addEventListener('touchstart', onTouch, { passive: true });
    }

    return () => {
      document.removeEventListener('mousemove',  onMove);
      document.removeEventListener('click',      onClick);
      document.removeEventListener('touchstart', onTouch);
      document.getElementById('cfx-style')?.remove();
    };
  }, []);

  return (
    <div
      ref={dotRef}
      style={{
        position:     'fixed',
        top:          0,
        left:         0,
        width:        10,
        height:       10,
        marginLeft:   -5,
        marginTop:    -5,
        borderRadius: '50%',
        background:   'radial-gradient(circle, #FFFFFF 0%, #FFD700 50%, #D4AF37 100%)',
        boxShadow:    '0 0 8px 3px #FFD700, 0 0 18px 6px rgba(212,175,55,0.6)',
        pointerEvents:'none',
        zIndex:       999999,
        opacity:      0,
        transition:   'opacity 0.2s',
      }}
    />
  );
}