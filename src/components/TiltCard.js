import React, { useRef, useCallback, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';

/**
 * Wraps a card in a 3D perspective tilt that follows the cursor.
 * Falls back to a plain wrapper for touch devices (no mousemove)
 * and users with prefers-reduced-motion.
 */
const TiltCard = ({ children, maxTilt = 8, style, ...rest }) => {
  const ref = useRef(null);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springX = useSpring(rotateX, { stiffness: 260, damping: 22 });
  const springY = useSpring(rotateY, { stiffness: 260, damping: 22 });
  const reducedMotion = useReducedMotion();
  const rafId = useRef(null);
  const pendingEvent = useRef(null);

  // getBoundingClientRect() forces a synchronous layout read; raw mousemove
  // events can fire many times per frame, so batch to one read+write per
  // animation frame instead of forcing a reflow on every event.
  const handleMove = useCallback((e) => {
    pendingEvent.current = { clientX: e.clientX, clientY: e.clientY };
    if (rafId.current) return;
    rafId.current = requestAnimationFrame(() => {
      rafId.current = null;
      const el = ref.current;
      const ev = pendingEvent.current;
      if (!el || !ev) return;
      const rect = el.getBoundingClientRect();
      const px = (ev.clientX - rect.left) / rect.width - 0.5;
      const py = (ev.clientY - rect.top) / rect.height - 0.5;
      rotateX.set(-py * maxTilt);
      rotateY.set(px * maxTilt);
    });
  }, [maxTilt, rotateX, rotateY]);

  const handleLeave = useCallback(() => {
    if (rafId.current) {
      cancelAnimationFrame(rafId.current);
      rafId.current = null;
    }
    rotateX.set(0);
    rotateY.set(0);
  }, [rotateX, rotateY]);

  useEffect(() => () => {
    if (rafId.current) cancelAnimationFrame(rafId.current);
  }, []);

  if (reducedMotion) {
    return <div style={style} {...rest}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{
        rotateX: springX,
        rotateY: springY,
        transformPerspective: 900,
        transformStyle: 'preserve-3d',
        height: '100%',
        ...style,
      }}
      {...rest}
    >
      {children}
    </motion.div>
  );
};

export default TiltCard;
