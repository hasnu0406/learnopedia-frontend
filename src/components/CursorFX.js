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

    const style = document.createElement('style');
    style.id = 'cfx-style';
    style.textContent = `
      @keyframes cfx-fly {
        0%   { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        100% { opacity: 0; transform: translate(var(--tx), var(--ty)) scale(0); }
      }
      .cfx-particle {
        position: fixed;
        pointer-events: none;
        z-index: 999997;
        border-radius: 50%;
        animation: cfx-fly var(--dur) ease-out forwards;
      }
    `;
    document.head.appendChild(style);

    const dot = dotRef.current;

    function spawnParticle(x, y, big) {
      const color = GOLD[Math.floor(Math.random() * GOLD.length)];
      const angle = Math.random() * Math.PI * 2;
      const dist  = big ? 40 + Math.random() * 70 : 20 + Math.random() * 40;
      const size  = big ? 5  + Math.random() * 7  : 3  + Math.random() * 5;
      const dur   = (big ? 0.6 + Math.random() * 0.4 : 0.4 + Math.random() * 0.3).toFixed(2);
      const el = document.createElement('div');
      el.className = 'cfx-particle';
      el.style.cssText = `
        left: ${x}px; top: ${y}px;
        width: ${size}px; height: ${size}px;
        background: ${color};
        box-shadow: 0 0 ${size * 2}px ${size}px ${color};
        --tx: ${(Math.cos(angle) * dist).toFixed(1)}px;
        --ty: ${(Math.sin(angle) * dist).toFixed(1)}px;
        --dur: ${dur}s;
      `;
      document.body.appendChild(el);
      setTimeout(() => el.remove(), parseFloat(dur) * 1000 + 100);
    }

    function burst(x, y, count, big) {
      for (let i = 0; i < count; i++) spawnParticle(x, y, big);
    }

    const onMove = (e) => {
      dot.style.left = e.clientX + 'px';
      dot.style.top  = e.clientY + 'px';
      burst(e.clientX, e.clientY, 3, false);
    };
    const onClick = (e) => burst(e.clientX, e.clientY, 22, false);
    const onTouch = (e) => {
      Array.from(e.changedTouches).forEach(t => burst(t.clientX, t.clientY, 30, true));
    };

    if (!isMobile) {
      document.addEventListener('mousemove', onMove,  { passive: true });
      document.addEventListener('click',     onClick);
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
        top:          '-20px',
        left:         '-20px',
        width:        16,
        height:       16,
        marginLeft:   -8,
        marginTop:    -8,
        borderRadius: '50%',
        background:   'radial-gradient(circle, #FFFFFF 0%, #FFD700 45%, #D4AF37 100%)',
        boxShadow:    '0 0 10px 4px #FFD700, 0 0 24px 8px rgba(212,175,55,0.7)',
        pointerEvents:'none',
        zIndex:       999999,
      }}
    />
  );
}