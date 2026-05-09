import { useEffect, useRef, useState } from 'react';

export default function CursorFX() {
  const dotRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const pos = useRef({ x: -100, y: -100 });

  useEffect(() => {
    const dot = dotRef.current;
    if (!dot) return;

    const move = (e) => {
      pos.current = { x: e.clientX, y: e.clientY };
      dot.style.transform = `translate(${e.clientX - 7}px, ${e.clientY - 7}px)`;
      if (!visible) setVisible(true);
    };

    const down = () => {
      dot.style.width     = '20px';
      dot.style.height    = '20px';
      dot.style.boxShadow = '0 0 16px 8px #FFFFFF, 0 0 32px 16px #F0D080, 0 0 60px 24px #C9A84C66';
    };

    const up = () => {
      dot.style.width     = '14px';
      dot.style.height    = '14px';
      dot.style.boxShadow = '0 0 8px 4px #F0D080, 0 0 20px 8px #C9A84C88, 0 0 36px 12px #C9A84C33';
    };

    window.addEventListener('mousemove', move);
    window.addEventListener('mousedown', down);
    window.addEventListener('mouseup',   up);

    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mousedown', down);
      window.removeEventListener('mouseup',   up);
    };
  }, []);

  return (
    <div
      ref={dotRef}
      style={{
        position:      'fixed',
        top:           0,
        left:          0,
        width:         '14px',
        height:        '14px',
        background:    'radial-gradient(circle, #FFFFFF 0%, #F0D080 40%, #C9A84C 100%)',
        borderRadius:  '50%',
        pointerEvents: 'none',
        zIndex:        999999,
        opacity:       visible ? 1 : 0,
        boxShadow:     '0 0 8px 4px #F0D080, 0 0 20px 8px #C9A84C88, 0 0 36px 12px #C9A84C33',
        transition:    'width 0.1s ease, height 0.1s ease, box-shadow 0.15s ease, opacity 0.2s ease',
        willChange:    'transform',
        transform:     'translate(-100px, -100px)',
      }}
    />
  );
}