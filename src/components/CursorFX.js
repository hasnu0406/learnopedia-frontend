import { useEffect, useRef } from 'react';

export default function CursorFX() {
  const wandRef = useRef(null);
  const sparklesRef = useRef([]);

  useEffect(() => {
    const wand = wandRef.current;
    let lastX = 0, lastY = 0;
    let sparklePool = [];

    // Create sparkle pool
    for (let i = 0; i < 12; i++) {
      const s = document.createElement('div');
      s.style.cssText = `
        position:fixed; width:5px; height:5px; border-radius:50%;
        pointer-events:none; z-index:999997; opacity:0;
        background: radial-gradient(circle, #fff 0%, #F0D080 50%, #C9A84C 100%);
        box-shadow: 0 0 4px 2px #F0D080;
        transition: opacity 0.3s ease;
      `;
      document.body.appendChild(s);
      sparklePool.push({ el: s, x: 0, y: 0, life: 0 });
    }

    let poolIdx = 0;
    const move = (e) => {
      const x = e.clientX, y = e.clientY;
      wand.style.left = x + 'px';
      wand.style.top = y + 'px';

      const dx = x - lastX, dy = y - lastY;
      const speed = Math.sqrt(dx * dx + dy * dy);

      if (speed > 3) {
        const s = sparklePool[poolIdx % sparklePool.length];
        poolIdx++;
        const offset = 14;
        const angle = Math.atan2(dy, dx);
        s.x = x - Math.cos(angle) * offset + (Math.random() - 0.5) * 8;
        s.y = y - Math.sin(angle) * offset + (Math.random() - 0.5) * 8;
        s.el.style.left = s.x + 'px';
        s.el.style.top = s.y + 'px';
        s.el.style.opacity = '1';
        s.el.style.width = (Math.random() * 4 + 3) + 'px';
        s.el.style.height = s.el.style.width;
        setTimeout(() => { s.el.style.opacity = '0'; }, 300 + Math.random() * 200);
      }

      lastX = x; lastY = y;
    };

    const down = () => {
      wand.style.boxShadow = '0 0 18px 8px #FFFFFF, 0 0 36px 16px #F0D080, 0 0 60px 24px #C9A84C88';
      wand.style.width = '18px';
      wand.style.height = '18px';
      // burst sparkles on click
      for (let i = 0; i < 8; i++) {
        const s = sparklePool[i];
        const angle = (i / 8) * Math.PI * 2;
        const dist = 20 + Math.random() * 20;
        s.el.style.left = (lastX + Math.cos(angle) * dist) + 'px';
        s.el.style.top = (lastY + Math.sin(angle) * dist) + 'px';
        s.el.style.opacity = '1';
        setTimeout(() => { s.el.style.opacity = '0'; }, 400);
      }
    };

    const up = () => {
      wand.style.boxShadow = '0 0 8px 3px #F0D080, 0 0 20px 8px #C9A84C88, 0 0 36px 12px #C9A84C33';
      wand.style.width = '13px';
      wand.style.height = '13px';
    };

    window.addEventListener('mousemove', move);
    window.addEventListener('mousedown', down);
    window.addEventListener('mouseup', up);

    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mousedown', down);
      window.removeEventListener('mouseup', up);
      sparklePool.forEach(s => s.el.remove());
    };
  }, []);

  return (
    <div ref={wandRef} style={{
      position: 'fixed',
      width: '13px', height: '13px',
      background: 'radial-gradient(circle, #FFFFFF 0%, #F0D080 40%, #C9A84C 100%)',
      borderRadius: '50%',
      pointerEvents: 'none',
      zIndex: 999999,
      transform: 'translate(-50%, -50%)',
      boxShadow: '0 0 8px 3px #F0D080, 0 0 20px 8px #C9A84C88, 0 0 36px 12px #C9A84C33',
      animation: 'wandGlow 2s ease-in-out infinite',
      transition: 'width 0.1s, height 0.1s, box-shadow 0.1s',
    }} />
  );
}