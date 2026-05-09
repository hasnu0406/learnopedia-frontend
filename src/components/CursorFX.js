import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

// Detect touch device once at module level — never changes
const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

// Inject cursor:none style ONCE at module level — survives all navigation
if (!isTouchDevice) {
  let styleTag = document.getElementById('cursor-hide-style');
  if (!styleTag) {
    styleTag = document.createElement('style');
    styleTag.id = 'cursor-hide-style';
    styleTag.innerHTML = `* { cursor: none !important; }`;
    document.head.appendChild(styleTag);
  }
}

export default function CursorFX() {
  const dotRef = useRef(null);

  useEffect(() => {
    if (isTouchDevice) return;

    const dot = dotRef.current;
    if (!dot) return;

    let rafId;

    const move = (e) => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        dot.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
        dot.style.opacity   = '1';
      });
    };

    const down = () => {
      dot.style.width      = '22px';
      dot.style.height     = '22px';
      dot.style.background = 'radial-gradient(circle, #FFFFFF 0%, #FFFFFF 30%, #F0D080 60%, #C9A84C 100%)';
      dot.style.boxShadow  = '0 0 20px 10px #FFFFFF, 0 0 40px 20px #F0D080, 0 0 60px 30px #C9A84C66';
    };

    const up = () => {
      dot.style.width      = '14px';
      dot.style.height     = '14px';
      dot.style.background = 'radial-gradient(circle, #FFFFFF 0%, #F0D080 40%, #C9A84C 100%)';
      dot.style.boxShadow  = '0 0 8px 4px #F0D080, 0 0 20px 8px #C9A84C88, 0 0 36px 12px #C9A84C33';
    };

    const leave = () => { dot.style.opacity = '0'; };
    const enter = () => { dot.style.opacity = '1'; };

    window.addEventListener('mousemove',    move);
    window.addEventListener('mousedown',    down);
    window.addEventListener('mouseup',      up);
    document.addEventListener('mouseleave', leave);
    document.addEventListener('mouseenter', enter);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove',    move);
      window.removeEventListener('mousedown',    down);
      window.removeEventListener('mouseup',      up);
      document.removeEventListener('mouseleave', leave);
      document.removeEventListener('mouseenter', enter);
      // NOTE: we intentionally do NOT remove the styleTag here
      // so cursor:none persists across page navigation
    };
  }, []);

  if (isTouchDevice) return null;

  return createPortal(
    <div
      ref={dotRef}
      style={{
        position:      'fixed',
        top:           '-7px',
        left:          '-7px',
        width:         '14px',
        height:        '14px',
        background:    'radial-gradient(circle, #FFFFFF 0%, #F0D080 40%, #C9A84C 100%)',
        borderRadius:  '50%',
        pointerEvents: 'none',
        zIndex:        2147483647,
        opacity:       0,
        boxShadow:     '0 0 8px 4px #F0D080, 0 0 20px 8px #C9A84C88, 0 0 36px 12px #C9A84C33',
        transition:    'width 0.1s ease, height 0.1s ease, opacity 0.3s ease, background 0.1s ease',
        transform:     'translate(-100px, -100px)',
        willChange:    'transform',
      }}
    />,
    document.body
  );
}