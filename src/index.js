import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// ═══════════════════════════════════════════════════
// MAGICAL CURSOR — lives outside React, never dies
// ═══════════════════════════════════════════════════
(function initMagicCursor() {
  // Skip on touch/mobile devices
  if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return;

  // Hide all default cursors globally
  const style = document.createElement('style');
  style.innerHTML = '* { cursor: none !important; }';
  document.head.appendChild(style);

  // Create the glowing dot
  const dot = document.createElement('div');
  dot.style.cssText = [
    'position: fixed',
    'top: -7px',
    'left: -7px',
    'width: 14px',
    'height: 14px',
    'background: radial-gradient(circle, #FFFFFF 0%, #F0D080 40%, #C9A84C 100%)',
    'border-radius: 50%',
    'pointer-events: none',
    'z-index: 2147483647',
    'opacity: 0',
    'box-shadow: 0 0 8px 4px #F0D080, 0 0 20px 8px #C9A84C88, 0 0 36px 12px #C9A84C33',
    'transition: width 0.1s ease, height 0.1s ease, opacity 0.3s ease, background 0.1s ease, box-shadow 0.1s ease',
    'transform: translate(-100px, -100px)',
    'will-change: transform',
  ].join(';');
  document.body.appendChild(dot);

  let rafId;

  window.addEventListener('mousemove', (e) => {
    cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => {
      dot.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      dot.style.opacity   = '1';
    });
  });

  window.addEventListener('mousedown', () => {
    dot.style.width      = '22px';
    dot.style.height     = '22px';
    dot.style.background = 'radial-gradient(circle, #FFFFFF 0%, #FFFFFF 30%, #F0D080 60%, #C9A84C 100%)';
    dot.style.boxShadow  = '0 0 20px 10px #FFFFFF, 0 0 40px 20px #F0D080, 0 0 60px 30px #C9A84C66';
  });

  window.addEventListener('mouseup', () => {
    dot.style.width      = '14px';
    dot.style.height     = '14px';
    dot.style.background = 'radial-gradient(circle, #FFFFFF 0%, #F0D080 40%, #C9A84C 100%)';
    dot.style.boxShadow  = '0 0 8px 4px #F0D080, 0 0 20px 8px #C9A84C88, 0 0 36px 12px #C9A84C33';
  });

  document.addEventListener('mouseleave', () => { dot.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { dot.style.opacity = '1'; });
})();

// ═══════════════════════════════════════════════════
// React App
// ═══════════════════════════════════════════════════
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);