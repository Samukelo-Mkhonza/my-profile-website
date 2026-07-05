import { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { motion, useReducedMotion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { profile } from '../content/profile';
import { runCommand, completeCommand } from '../lib/terminalCommands';

// Interactive terminal overlay. Keyboard-first (Ctrl+` toggles it, Tab
// completes, ↑/↓ recall history), accessible (labelled input, live-region
// output), and full-screen on small viewports.

const Overlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  z-index: 1300;
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: clamp(0rem, 3vw, 2rem);
`;

const Window = styled(motion.div)`
  width: 100%;
  max-width: 780px;
  height: min(70vh, 560px);
  background: var(--bg-card, #fff);
  border: 1px solid var(--border-card, #e0e0e0);
  border-radius: 12px;
  box-shadow: 0 24px 48px var(--shadow-color, rgba(0, 0, 0, 0.3));
  display: flex;
  flex-direction: column;
  overflow: hidden;

  @media (max-width: 768px) {
    max-width: none;
    height: 100%;
    border-radius: 0;
  }
`;

const TitleBar = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--border-card, #e0e0e0);
  background: var(--bg-secondary, #f7f7f7);
`;

const Dot = styled.span`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${(p) => p.$color};
  flex-shrink: 0;
`;

const TitleText = styled.span`
  margin-left: 0.5rem;
  font-size: 0.75rem;
  letter-spacing: 0.05em;
  color: var(--text-secondary, #666);
  user-select: none;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const CloseButton = styled.button`
  margin-left: auto;
  background: none;
  border: none;
  font-family: inherit;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-secondary, #666);
  cursor: pointer;
  padding: 0.5rem;
  min-height: 44px;

  &:hover,
  &:focus-visible {
    color: var(--text-primary, #000);
  }
`;

const Screen = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem 1.25rem;
  font-size: 0.8125rem;
  line-height: 1.7;
  cursor: text;
`;

const Line = styled.pre`
  margin: 0;
  font-family: inherit;
  white-space: pre-wrap;
  word-break: break-word;
  color: ${(p) =>
    p.$type === 'error'
      ? 'var(--text-primary, #000)'
      : p.$type === 'heading'
      ? 'var(--text-primary, #000)'
      : p.$type === 'input'
      ? 'var(--text-primary, #000)'
      : 'var(--text-secondary, #555)'};
  font-weight: ${(p) => (p.$type === 'heading' || p.$type === 'input' ? 600 : 400)};
  opacity: ${(p) => (p.$type === 'error' ? 0.85 : 1)};
`;

const InputRow = styled.form`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.75rem 1.25rem;
  border-top: 1px solid var(--border-card, #e0e0e0);
`;

const Prompt = styled.span`
  font-weight: 700;
  color: var(--text-primary, #000);
  user-select: none;
`;

const Input = styled.input`
  flex: 1;
  background: none;
  border: none;
  outline: none;
  font-family: inherit;
  /* 16px floor prevents iOS zoom-on-focus */
  font-size: max(0.8125rem, 16px);
  color: var(--text-primary, #000);
  caret-color: var(--text-primary, #000);

  @media (min-width: 769px) {
    font-size: 0.8125rem;
  }
`;

const WELCOME = [
  { type: 'heading', text: `${profile.name} — portfolio terminal` },
  { type: 'output', text: "Type 'help' to see what I respond to." },
];

const Terminal = ({ onClose, onNavigate }) => {
  const reducedMotion = useReducedMotion();
  const { toggleTheme } = useTheme();
  const [lines, setLines] = useState(WELCOME);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [busy, setBusy] = useState(false);
  const inputRef = useRef(null);
  const screenRef = useRef(null);
  const projectsCache = useRef(null);

  // Focus on open, and re-focus after async commands re-enable the input.
  useEffect(() => {
    if (!busy) inputRef.current?.focus();
  }, [busy]);

  useEffect(() => {
    const el = screenRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines, busy]);

  const fetchProjects = useCallback(async () => {
    if (projectsCache.current) return projectsCache.current;
    const res = await fetch(
      `https://api.github.com/users/${profile.github}/repos?sort=updated&per_page=50`
    );
    if (!res.ok) throw new Error(`GitHub API error ${res.status}`);
    const data = await res.json();
    projectsCache.current = data.filter((r) => !r.fork);
    return projectsCache.current;
  }, []);

  const submit = useCallback(
    async (e) => {
      e?.preventDefault();
      if (busy) return;
      const raw = input;
      const trimmed = raw.trim();
      setInput('');
      setHistoryIndex(-1);
      setLines((prev) => [...prev, { type: 'input', text: `❯ ${raw}` }]);
      if (!trimmed) return;

      setHistory((prev) =>
        prev[prev.length - 1] === trimmed ? prev : [...prev, trimmed]
      );

      setBusy(true);
      const { lines: outLines, action } = await runCommand(trimmed, { fetchProjects });
      setBusy(false);

      if (action?.type === 'clear') {
        setLines([]);
        return;
      }
      setLines((prev) => [...prev, ...outLines]);

      if (action?.type === 'close') {
        setTimeout(onClose, 400);
      } else if (action?.type === 'navigate') {
        setTimeout(() => onNavigate(action.route), 300);
      } else if (action?.type === 'theme') {
        toggleTheme();
      } else if (action?.type === 'confetti') {
        window.dispatchEvent(new CustomEvent('site:confetti'));
      }
    },
    [busy, input, fetchProjects, onClose, onNavigate, toggleTheme]
  );

  const onKeyDown = (e) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (!history.length) return;
      const next = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(next);
      setInput(history[next]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex === -1) return;
      const next = historyIndex + 1;
      if (next >= history.length) {
        setHistoryIndex(-1);
        setInput('');
      } else {
        setHistoryIndex(next);
        setInput(history[next]);
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const completed = completeCommand(input);
      if (completed) setInput(completed);
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <Overlay
      initial={reducedMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
    >
      <Window
        initial={reducedMotion ? false : { opacity: 0, scale: 0.97, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.97, y: 16 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        role="region"
        aria-label="Interactive terminal"
        onClick={(e) => {
          e.stopPropagation();
          inputRef.current?.focus();
        }}
      >
        <TitleBar>
          <Dot $color="#ff5f57" />
          <Dot $color="#febc2e" />
          <Dot $color="#28c840" />
          <TitleText>visitor@samukelo.dev: ~</TitleText>
          <CloseButton onClick={onClose} aria-label="Close terminal">
            Esc
          </CloseButton>
        </TitleBar>
        <Screen ref={screenRef} aria-live="polite" aria-atomic="false">
          {lines.map((line, i) => (
            <Line key={i} $type={line.type}>
              {line.text}
            </Line>
          ))}
          {busy && <Line $type="output">…</Line>}
        </Screen>
        <InputRow onSubmit={submit}>
          <Prompt aria-hidden="true">❯</Prompt>
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            aria-label="Terminal command input. Type help and press Enter to list commands."
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            disabled={busy}
          />
        </InputRow>
      </Window>
    </Overlay>
  );
};

export default Terminal;
