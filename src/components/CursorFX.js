import { useEffect, useRef } from 'react';

export default function CursorFX() {
  return null;
}

  useEffect(() => {
    const dot = dotRef.current;
    if (!dot) return;

    document.body.style.cursor = 'none';

    const allElements = document.querySelectorAll('*');
    allElements.forEach(el => {
      el.style.cursor = 'none';
    });

    const move = (e) => {
      dot.style.left    = e.clientX + 'px';
      dot.style.top     = e.clientY + 'px';
      dot.style.opacity = '1';
    };

    const down = () => {
      dot.style.width     = '22px';
      dot.style.height    = '22px';
      dot.style.background = 'radial-gradient(circle, #FFFFFF 0%, #FFFFFF 30%, #F0D080 60%, #C9A84C 100%)';
      dot.style.boxShadow = '0 0 20px 10px #FFFFFF, 0 0 40px 20px #F0D080, 0 0 60px 30px #C9A84C66';
    };

    const up = () => {
      dot.style.width     = '14px';
      dot.style.height    = '14px';
      dot.style.background = 'radial-gradient(circle, #FFFFFF 0%, #F0D080 40%, #C9A84C 100%)';
      dot.style.boxShadow = '0 0 8px 4px #F0D080, 0 0 20px 8px #C9A84C88, 0 0 36px 12px #C9A84C33';
    };

    window.addEventListener('mousemove', move);
    window.addEventListener('mousedown', down);
    window.addEventListener('mouseup',   up);

    return () => {
      document.body.style.cursor = 'auto';
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
        top:           '-50px',
        left:          '-50px',
        width:         '14px',
        height:        '14px',
        background:    'radial-gradient(circle, #FFFFFF 0%, #F0D080 40%, #C9A84C 100%)',
        borderRadius:  '50%',
        pointerEvents: 'none',
        zIndex:        2147483647,
        opacity:       0,
        boxShadow:     '0 0 8px 4px #F0D080, 0 0 20px 8px #C9A84C88, 0 0 36px 12px #C9A84C33',
        transition:    'width 0.1s ease, height 0.1s ease, opacity 0.3s ease, background 0.1s ease',
        transform:     'translate(-50%, -50%)',
      }}
    />
  );
}