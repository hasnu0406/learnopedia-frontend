import { useEffect } from 'react';
import { createPortal } from 'react-dom';

const GOLD = ['#FFD700','#FFC200','#F0D060','#D4AF37','#FFEC8B','#FFF0A0','#FFFFFF'];

function SparkleTrail() {
  useEffect(() => {
    const style = document.createElement('style');
    style.id = 'cfx';
    style.textContent = `
      @keyframes cfx-fly {
        0%   { opacity:1; transform:translate(-50%,-50%) scale(1); }
        100% { opacity:0; transform:translate(var(--tx),var(--ty)) scale(0); }
      }
      .cfx-p {
        position:fixed;
        pointer-events:none;
        z-index:2147483647;
        border-radius:50%;
        animation:cfx-fly var(--dur) ease-out forwards;
      }
    `;
    document.head.appendChild(style);

    function spawnParticle(x, y, big) {
      const color = GOLD[Math.floor(Math.random() * GOLD.length)];
      const angle = Math.random() * Math.PI * 2;
      const dist  = big ? 40 + Math.random() * 70 : 20 + Math.random() * 40;
      const size  = big ? 5  + Math.random() * 7  : 3  + Math.random() * 5;
      const dur   = (big ? 0.6 + Math.random() * 0.4 : 0.4 + Math.random() * 0.3).toFixed(2);
      const el    = document.createElement('div');
      el.className = 'cfx-p';
      el.style.cssText = `
        left:${x}px;top:${y}px;
        width:${size}px;height:${size}px;
        background:${color};
        box-shadow:0 0 ${size*2}px ${size}px ${color};
        --tx:${(Math.cos(angle)*dist).toFixed(1)}px;
        --ty:${(Math.sin(angle)*dist).toFixed(1)}px;
        --dur:${dur}s;
      `;
      document.body.appendChild(el);
      setTimeout(() => el.remove(), parseFloat(dur) * 1000 + 100);
    }

    function burst(x, y, count, big) {
      for (let i = 0; i < count; i++) spawnParticle(x, y, big);
    }

    const onMove = (e) => burst(e.clientX, e.clientY, 3, false);
    const onClick = (e) => burst(e.clientX, e.clientY, 22, false);
    const onTouch = (e) => {
      Array.from(e.changedTouches).forEach(t => burst(t.clientX, t.clientY, 30, true));
    };

    window.addEventListener('mousemove',  onMove,  { passive: true });
    window.addEventListener('click',      onClick);
    window.addEventListener('touchstart', onTouch, { passive: true });

    return () => {
      window.removeEventListener('mousemove',  onMove);
      window.removeEventListener('click',      onClick);
      window.removeEventListener('touchstart', onTouch);
      document.getElementById('cfx')?.remove();
    };
  }, []);

  return null;
}

export default function CursorFX() {
  if (typeof window === 'undefined') return null;
  return createPortal(<SparkleTrail />, document.body);
}