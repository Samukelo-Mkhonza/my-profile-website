import { useState, useEffect, useCallback, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaGamepad, FaCoffee, FaMusic, FaHeart, FaMountain } from 'react-icons/fa';

// ─── Confetti Canvas ───
const ConfettiCanvas = styled.canvas`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  z-index: 9999;
`;

const useConfetti = () => {
  const canvasRef = useRef(null);
  const animRef = useRef(null);

  const burst = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ['#ff0', '#f0f', '#0ff', '#f00', '#0f0', '#00f', '#ff8800', '#ff0088'];
    const particles = Array.from({ length: 150 }, () => ({
      x: canvas.width / 2,
      y: canvas.height / 2,
      vx: (Math.random() - 0.5) * 20,
      vy: (Math.random() - 0.5) * 20 - 5,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 8 + 3,
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 10,
      life: 1,
    }));

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;
      particles.forEach(p => {
        if (p.life <= 0) return;
        alive = true;
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.3;
        p.vx *= 0.99;
        p.rotation += p.rotSpeed;
        p.life -= 0.012;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        ctx.restore();
      });
      if (alive) animRef.current = requestAnimationFrame(animate);
    };
    if (animRef.current) cancelAnimationFrame(animRef.current);
    animate();
  }, []);

  useEffect(() => () => { if (animRef.current) cancelAnimationFrame(animRef.current); }, []);

  return { canvasRef, burst };
};

// ─── Secret Section ───
const fadeSlide = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;

const SecretOverlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(12px);
  z-index: 9998;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

const SecretCard = styled(motion.div)`
  background: var(--bg-card, #fff);
  border: 2px solid var(--border-card, #e0e0e0);
  border-radius: var(--radius-card, 14px);
  padding: clamp(2rem, 4vw, 3rem);
  max-width: 500px;
  width: 100%;
  position: relative;
  text-align: center;
  box-shadow: var(--shadow-hard-lg, 6px 6px 0 #111);
`;

const SecretClose = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.25rem;
  color: var(--text-secondary, #666);
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.3s ease;
  min-width: 44px;
  min-height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: var(--tag-bg, #f0f0f0);
    color: var(--text-primary, #000);
  }
`;

const SecretTitle = styled.h2`
  font-size: clamp(1.25rem, 3vw, 1.75rem);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-primary, #000);
  margin-bottom: 1.5rem;
`;

const SecretFact = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: var(--tag-bg, #f0f0f0);
  border: 2px solid var(--border-card, #111);
  border-radius: var(--radius-sm, 10px);
  margin-bottom: 0.75rem;
  font-size: clamp(0.875rem, 2vw, 1rem);
  color: var(--text-secondary, #555);
  text-align: left;
  animation: ${fadeSlide} 0.4s ease forwards;
  animation-delay: ${props => props.$delay || '0s'};
  opacity: 0;

  svg {
    color: var(--text-primary, #000);
    flex-shrink: 0;
    font-size: 1.125rem;
  }
`;

const SecretHint = styled.p`
  margin-top: 1.5rem;
  font-size: 0.75rem;
  color: var(--text-muted, #999);
  letter-spacing: 0.1em;
  text-transform: uppercase;
`;

// ─── Konami Toast ───
const Toast = styled(motion.div)`
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  background: var(--accent, #000);
  color: var(--accent-inverse, #fff);
  padding: 1rem 2rem;
  border: 2px solid var(--border-card, #111);
  border-radius: var(--radius-pill, 999px);
  font-weight: 600;
  font-size: 1rem;
  z-index: 10000;
  text-align: center;
  box-shadow: var(--shadow-hard-sm, 3px 3px 0 #111);
  white-space: nowrap;
`;

// ─── Main Component ───
const EasterEggs = () => {
  const { canvasRef, burst } = useConfetti();
  const [showToast, setShowToast] = useState(false);
  const [showSecret, setShowSecret] = useState(false);
  const konamiRef = useRef([]);

  // Console greeting
  useEffect(() => {
    const styles = [
      'color: #fff',
      'background: linear-gradient(135deg, #000 0%, #333 100%)',
      'font-size: 16px',
      'font-weight: bold',
      'padding: 12px 20px',
      'border-radius: 8px',
      'font-family: JetBrains Mono, monospace',
    ].join(';');
    const ascii = String.raw`
 ____                        _        _
/ ___|  __ _ _ __ ___  _   _| | _____| | ___
\___ \ / _' | '_ ' _ \| | | | |/ / _ \ |/ _ \
 ___) | (_| | | | | | | |_| |   <  __/ | (_) |
|____/ \__,_|_| |_| |_|\__,_|_|\_\___|_|\___/
`;
    console.log(
      `%c${ascii}`,
      'color: #888; font-family: JetBrains Mono, monospace; font-size: 10px; line-height: 1.2;'
    );
    console.log('%c👋 Hey developer! Curious minds are always welcome here.', styles);
    console.log(
      '%cPoking around the console is exactly the kind of curiosity I like to work with.\n' +
        'Hiring? → samukelo.mkhonza@outlook.com\n' +
        'Bored?  → press Ctrl+` for a terminal, try the Konami code, or Ctrl+Shift+K.',
      'color: #666; font-size: 12px; font-family: JetBrains Mono, monospace;'
    );
  }, []);

  // Other components (e.g. the terminal's `sudo hire-me`) can fire the
  // confetti burst without importing this component.
  useEffect(() => {
    window.addEventListener('site:confetti', burst);
    return () => window.removeEventListener('site:confetti', burst);
  }, [burst]);

  // Konami code listener
  useEffect(() => {
    const sequence = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
    const handleKey = (e) => {
      konamiRef.current.push(e.key);
      konamiRef.current = konamiRef.current.slice(-sequence.length);
      if (konamiRef.current.join(',') === sequence.join(',')) {
        burst();
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
        konamiRef.current = [];
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [burst]);

  // Secret shortcut: Ctrl+Shift+K
  useEffect(() => {
    const handleShortcut = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'K') {
        e.preventDefault();
        setShowSecret(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleShortcut);
    return () => window.removeEventListener('keydown', handleShortcut);
  }, []);

  return (
    <>
      <ConfettiCanvas ref={canvasRef} />

      <AnimatePresence>
        {showToast && (
          <Toast
            initial={{ opacity: 0, y: 40, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 40, x: '-50%' }}
          >
            🎉 Konami Code Activated! You found a secret!
          </Toast>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSecret && (
          <SecretOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowSecret(false)}
          >
            <SecretCard
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={e => e.stopPropagation()}
            >
              <SecretClose onClick={() => setShowSecret(false)} aria-label="Close">
                <FaTimes />
              </SecretClose>
              <SecretTitle>🔓 Secret Unlocked</SecretTitle>
              <SecretFact $delay="0.1s">
                <FaGamepad /> Favorite game genre: Open-world RPGs
              </SecretFact>
              <SecretFact $delay="0.2s">
                <FaCoffee /> Daily coffee count: 3+ cups minimum
              </SecretFact>
              <SecretFact $delay="0.3s">
                <FaMusic /> Codes best while listening to lo-fi beats
              </SecretFact>
              <SecretFact $delay="0.4s">
                <FaHeart /> First language learned: Java (still has a soft spot)
              </SecretFact>
              <SecretFact $delay="0.5s">
                <FaMountain /> Dream: Build tech solutions across Africa
              </SecretFact>
              <SecretHint>Press Ctrl+Shift+K to toggle this panel</SecretHint>
            </SecretCard>
          </SecretOverlay>
        )}
      </AnimatePresence>
    </>
  );
};

export default EasterEggs;
