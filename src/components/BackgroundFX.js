import { useEffect, useRef } from 'react';

const HP_OBJECTS = ['⚡','🦉','🧙','✨','🔮','🧪','📜','🕯️','⭐','🌙','🪄','🐍','🦁','🏰','💫','🌟','🦅','🔯'];

export default function BackgroundFX() {
  const ref = useRef(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;
    const items = [];

    for (let i = 0; i < 22; i++) {
      const el   = document.createElement('div');
      const icon = HP_OBJECTS[Math.floor(Math.random() * HP_OBJECTS.length)];
      const size = Math.random() * 22 + 14;
      const dur  = Math.random() * 14 + 12;
      const dly  = Math.random() * 10;
      el.innerText   = icon;
      el.style.cssText = `
        position:absolute;
        font-size:${size}px;
        left:${Math.random() * 100}%;
        top:${Math.random() * 100}%;
        opacity:${Math.random() * 0.15 + 0.04};
        animation:float ${dur}s ease-in-out ${dly}s infinite;
        pointer-events:none;
        user-select:none;
      `;
      container.appendChild(el);
      items.push(el);
    }

    for (let i = 0; i < 30; i++) {
      const star = document.createElement('div');
      const sz   = Math.random() * 2 + 1;
      star.style.cssText = `
        position:absolute;
        width:${sz}px;
        height:${sz}px;
        background:#F0D080;
        border-radius:50%;
        left:${Math.random() * 100}%;
        top:${Math.random() * 100}%;
        animation:starTwinkle ${Math.random() * 3 + 2}s ease-in-out ${Math.random() * 4}s infinite;
        pointer-events:none;
      `;
      container.appendChild(star);
      items.push(star);
    }

    return () => items.forEach(el => el.remove());
  }, []);

  return (
    <div ref={ref} style={{
      position: 'fixed', inset: 0, zIndex: 0,
      pointerEvents: 'none', overflow: 'hidden',
    }} />
  );
}