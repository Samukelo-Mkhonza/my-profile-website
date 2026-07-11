import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';

/* Shared modal dialog for the whole site: one overlay, panel, close button,
   and open/close animation, plus the full dialog behaviour every modal needs
   (Escape to close, click-outside to close, body scroll lock, focus trap,
   focus restored to the opener). Section-specific content stays in each
   consuming component. */

/* ─── Frame ───────────────────────────────────────────────────────────────── */

const Overlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
`;

const Panel = styled(motion.div)`
  background: var(--bg-card, #fff);
  border: 2px solid var(--border-card, #111);
  border-radius: var(--radius-card, 14px);
  box-shadow: var(--shadow-hard-lg, 6px 6px 0 #111);
  width: 100%;
  max-width: ${p => p.$maxWidth || '640px'};
  max-height: 85vh;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  padding: clamp(1.5rem, 5vw, 2.5rem);
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  ${p => p.$center && 'text-align: center; align-items: center;'}
  &:focus { outline: none; }
  @supports (height: 1dvh) { max-height: calc(100dvh - 2rem); }
`;

const CloseButton = styled(motion.button)`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: var(--tag-bg, #f0f0f0);
  border: 2px solid var(--border-card, #111);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--text-secondary, #666);
  font-size: 0.875rem;
  transition: background 0.2s, color 0.2s;
  flex-shrink: 0;
  &:hover { background: var(--text-primary, #000); color: var(--accent-inverse, #fff); }
  &:focus-visible {
    outline: 3px solid var(--accent-orange, #ee5a24);
    outline-offset: 2px;
  }
`;

/* ─── Shared content primitives ───────────────────────────────────────────── */

/* Header block that clears the absolutely-positioned close button. */
export const ModalHeader = styled.div`
  padding-right: 2.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const ModalTitle = styled.h2`
  font-size: clamp(1.25rem, 4vw, 1.75rem);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-primary, #000);
  line-height: 1.2;
  margin: 0;
`;

export const ModalMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem;
`;

export const ModalDescription = styled.p`
  font-size: clamp(0.875rem, 2vw, 1rem);
  line-height: 1.8;
  color: var(--text-secondary, #555);
  margin: 0;
`;

export const Divider = styled.hr`
  border: none;
  border-top: 1px solid var(--border-color, #e0e0e0);
  margin: 0;
  width: 100%;
`;

export const ModalSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const SectionLabel = styled.span`
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--text-muted, #888);
`;

export const ChipRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

export const Chip = styled.span`
  background: var(--tag-bg, #f0f0f0);
  color: var(--text-primary, #444);
  border: 2px solid var(--border-card, #111);
  padding: 0.3rem 0.75rem;
  border-radius: var(--radius-pill, 999px);
  font-size: 0.8rem;
  font-weight: 600;
`;

/* ─── Behaviour ───────────────────────────────────────────────────────────── */

const FOCUSABLE_SELECTOR =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

const Modal = ({ isOpen, onClose, labelledBy, maxWidth, center = false, children }) => {
  const panelRef = useRef(null);
  const closeButtonRef = useRef(null);
  const reducedMotion = useReducedMotion();

  /* Read onClose through a ref so the dialog effect only runs on open/close,
     even when callers pass a new closure every render. */
  const onCloseRef = useRef(onClose);
  useEffect(() => { onCloseRef.current = onClose; });

  useEffect(() => {
    if (!isOpen) return undefined;
    const openerElement = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    const onKey = (e) => {
      if (e.key === 'Escape') { onCloseRef.current(); return; }
      if (e.key !== 'Tab' || !panelRef.current) return;
      const focusables = panelRef.current.querySelectorAll(FOCUSABLE_SELECTOR);
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && (active === first || active === panelRef.current)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
      if (openerElement instanceof HTMLElement) openerElement.focus();
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <Overlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <Panel
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={labelledBy}
            tabIndex={-1}
            $maxWidth={maxWidth}
            $center={center}
            initial={{ opacity: 0, y: reducedMotion ? 0 : 40, scale: reducedMotion ? 1 : 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: reducedMotion ? 0 : 40, scale: reducedMotion ? 1 : 0.96 }}
            transition={{ type: 'spring', damping: 26, stiffness: 300 }}
            onClick={e => e.stopPropagation()}
          >
            <CloseButton
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Close dialog"
            >
              <FaTimes />
            </CloseButton>
            {children}
          </Panel>
        </Overlay>
      )}
    </AnimatePresence>
  );
};

export default Modal;
