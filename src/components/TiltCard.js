import React, { useRef, useCallback } from 'react';
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

  const handleMove = useCallback((e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    rotateX.set(-py * maxTilt);
    rotateY.set(px * maxTilt);
  }, [maxTilt, rotateX, rotateY]);

  const handleLeave = useCallback(() => {
    rotateX.set(0);
    rotateY.set(0);
  }, [rotateX, rotateY]);

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
