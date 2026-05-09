import { useEffect, useRef } from 'react';

export default function CursorFX() {
  const dotRef = useRef(null);

  useEffect(() => {
    const dot = dotRef.current;
    if (!dot) return;

    const move = (e) => {
      dot.style.left = e.clientX + 'px';
      dot.style.top  = e.clientY + 'px';
      dot.style.opacity = '1';
    };

    const down = () => {
      dot.style.width     = '8px';
      dot.style.height    = '8px';
      dot.style.boxShadow = '0 0 6px 3px #F0D080, 0 0 14px 6px #C9A84C99';
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
        width:         '14px',
        height:        '14px',
        background:    'radial-gradient(circle, #FFFFFF 0%, #F0D080 40%, #C9A84C 100%)',
        borderRadius:  '50%',
        pointerEvents: 'none',
        zIndex:        999999,
        transform:     'translate(-50%, -50%)',
        opacity:       0,
        boxShadow:     '0 0 8px 4px #F0D080, 0 0 20px 8px #C9A84C88, 0 0 36px 12px #C9A84C33',
        transition:    'width 0.1s, height 0.1s, box-shadow 0.1s',
        left:          '-100px',
        top:           '-100px',
      }}
    />
  );
}