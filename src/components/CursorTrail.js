import { useEffect, useRef } from 'react';
import styled from 'styled-components';

const Canvas = styled.canvas`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  z-index: 9990;

  @media (hover: none) {
    display: none;
  }
`;

const CursorTrail = () => {
  const canvasRef = useRef(null);
  const points = useRef([]);
  const mouse = useRef({ x: -100, y: -100 });
  const animRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const handleMove = (e) => {
      mouse.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', handleMove);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      points.current.push({
        x: mouse.current.x,
        y: mouse.current.y,
        life: 1,
      });

      // Keep trail short for performance
      if (points.current.length > 20) {
        points.current = points.current.slice(-20);
      }

      points.current.forEach((p, i) => {
        p.life -= 0.04;
        if (p.life <= 0) return;

        const size = p.life * 6;
        const alpha = p.life * 0.4;
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

        ctx.beginPath();
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        ctx.fillStyle = isDark
          ? `rgba(255, 255, 255, ${alpha})`
          : `rgba(0, 0, 0, ${alpha})`;
        ctx.fill();
      });

      points.current = points.current.filter(p => p.life > 0);
      animRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMove);
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  return <Canvas ref={canvasRef} />;
};

export default CursorTrail;
