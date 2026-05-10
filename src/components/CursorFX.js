import { useEffect, useRef } from 'react';

const GOLD_COLORS = [
  '#FFD700', '#FFC200', '#F0D060', '#D4AF37',
  '#C9A84C', '#F5C518', '#FFEC8B', '#FFF0A0',
  '#FFFFFF', '#FFF8DC',
];

const BLANK = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1' height='1'%3E%3C/svg%3E\") 0 0, none";

export default function CursorFX() {
  const canvasRef = useRef(null);
  const dotRef    = useRef(null);
  const particles = useRef([]);
  const rafRef    = useRef(null);
  const posX      = useRef(-300);
  const posY      = useRef(-300);

  useEffect(() => {
    const isMobile =
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      window.innerWidth <= 768;

    const tag = document.createElement('style');
    tag.id = 'cfx';
    tag.textContent = isMobile ? '' : `html,html *,html *::before,html *::after{cursor:${BLANK}!important}`;
    document.head.appendChild(tag);

    const dot = dotRef.current;
    dot.style.display = isMobile ? 'none' : 'block';

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);

    function spawn(x, y, count, big) {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = big ? 1.8 + Math.random() * 4 : 0.5 + Math.random() * 1.8;
        const size  = big ? 3 + Math.random() * 4 : 1.5 + Math.random() * 2.8;
        particles.current.push({
          x, y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - (big ? 1.4 : 0.8),
          alpha: 1, size,
          color: GOLD_COLORS[Math.floor(Math.random() * GOLD_COLORS.length)],
          isStar: Math.random() > 0.4,
          rotation: Math.random() * Math.PI * 2,
          rotSpeed: (Math.random() - 0.5) * 0.18,
          decay: big ? 0.010 + Math.random() * 0.013 : 0.015 + Math.random() * 0.018,
          gravity: 0.035 + Math.random() * 0.03,
        });
      }
    }

    function drawStar(x, y, r, rot) {
      ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.beginPath();
      for (let i = 0; i < 8; i++) {
        const a = (i * Math.PI) / 4;
        const rad = i % 2 === 0 ? r : r * 0.38;
        i === 0 ? ctx.moveTo(Math.cos(a) * rad, Math.sin(a) * rad) : ctx.lineTo(Math.cos(a) * rad, Math.sin(a) * rad);
      }
      ctx.closePath(); ctx.fill(); ctx.restore();
    }

    let frame = 0;
    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frame++;
      if (!isMobile && frame % 2 === 0) {
        spawn(posX.current + (Math.random() - 0.5) * 6, posY.current + (Math.random() - 0.5) * 6, 2, false);
      }
      particles.current = particles.current.filter(p => p.alpha > 0.01);
      for (const p of particles.current) {
        p.x += p.vx; p.y += p.vy; p.vy += p.gravity; p.vx *= 0.97;
        p.alpha -= p.decay; p.rotation += p.rotSpeed;
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color; ctx.shadowBlur = 10; ctx.shadowColor = '#D4AF37';
        p.isStar ? drawStar(p.x, p.y, p.size * 1.1, p.rotation) : (ctx.beginPath(), ctx.arc(p.x, p.y, p.size * 0.6, 0, Math.PI * 2), ctx.fill());
        ctx.shadowBlur = 0; ctx.globalAlpha = 1;
      }
      rafRef.current = requestAnimationFrame(loop);
    };

    const onMove = (e) => {
      posX.current = e.clientX; posY.current = e.clientY;
      dot.style.transform = `translate(${e.clientX - 6}px,${e.clientY - 6}px)`;
      spawn(e.clientX, e.clientY, 2, false);
    };
    const onClick = (e) => spawn(e.clientX, e.clientY, 20, false);
    const onTouch = (e) => { Array.from(e.changedTouches).forEach(t => spawn(t.clientX, t.clientY, 28, true)); };

    if (!isMobile) {
      document.addEventListener('mousemove', onMove, { passive: true });
      document.addEventListener('click', onClick);
    } else {
      document.addEventListener('touchstart', onTouch, { passive: true });
    }
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('click', onClick);
      document.removeEventListener('touchstart', onTouch);
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(rafRef.current);
      document.getElementById('cfx')?.remove();
    };
  }, []);

  return (
    <>
      <canvas ref={canvasRef} style={{ position:'fixed', top:0, left:0, width:'100vw', height:'100vh', pointerEvents:'none', zIndex:999998 }} />
      <div ref={dotRef} style={{ display:'none', position:'fixed', top:0, left:0, width:12, height:12, borderRadius:'50%', background:'radial-gradient(circle, #FFFFFF 0%, #FFD700 55%, #D4AF37 100%)', boxShadow:'0 0 6px 3px #FFD700, 0 0 16px 6px rgba(212,175,55,0.55)', pointerEvents:'none', zIndex:999999, willChange:'transform', transform:'translate(-300px,-300px)' }} />
    </>
  );
}