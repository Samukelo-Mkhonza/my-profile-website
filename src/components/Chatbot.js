import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { FaCommentDots, FaTimes, FaPaperPlane } from 'react-icons/fa';
import { profile } from '../content/profile';
import { suggestedQuestions } from '../content/chatbotKnowledge';
import { getBotReply } from '../lib/chatbotMatcher';

// Floating rule-based chat widget, shown on every page. All answers come from
// the local knowledge base via getBotReply() — no network, no AI. Sits below
// the terminal overlay (z-index 1300) so the terminal always wins.

const firstName = profile.name.split(' ')[0];

const GREETING = {
  id: 'greeting',
  role: 'bot',
  text: `Hi! I'm ${firstName}'s site assistant — a simple rule-based bot (no AI). Ask me anything about him, or tap a question below.`,
};

const Launcher = styled(motion.button)`
  position: fixed;
  bottom: 1.25rem;
  right: 1.25rem;
  z-index: 1250;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: none;
  background: var(--accent, #000);
  color: var(--accent-inverse, #fff);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
  cursor: pointer;
  box-shadow: 0 8px 24px var(--shadow-color, rgba(0, 0, 0, 0.25));

  &:focus-visible {
    outline: 2px solid var(--accent, #000);
    outline-offset: 3px;
  }
`;

const Panel = styled(motion.div)`
  position: fixed;
  bottom: 5.75rem;
  right: 1.25rem;
  z-index: 1250;
  width: min(360px, calc(100vw - 1.5rem));
  height: min(520px, calc(100vh - 8rem));
  background: var(--bg-card, #fff);
  border: 1px solid var(--border-card, #e0e0e0);
  border-radius: 16px;
  box-shadow: 0 24px 48px var(--shadow-color, rgba(0, 0, 0, 0.3));
  display: flex;
  flex-direction: column;
  overflow: hidden;

  @media (max-width: 480px) {
    right: 0.75rem;
    width: calc(100vw - 1.5rem);
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.85rem 1rem;
  border-bottom: 1px solid var(--border-card, #e0e0e0);
  background: var(--bg-secondary, #f7f7f7);
`;

const HeaderText = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
`;

const HeaderTitle = styled.span`
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--text-primary, #000);
`;

const HeaderSub = styled.span`
  font-size: 0.7rem;
  color: var(--text-muted, #999);
`;

const CloseButton = styled.button`
  margin-left: auto;
  background: none;
  border: none;
  color: var(--text-secondary, #666);
  cursor: pointer;
  font-size: 1rem;
  padding: 0.5rem;
  min-width: 44px;
  min-height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover,
  &:focus-visible {
    color: var(--text-primary, #000);
  }
`;

const MessageList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
`;

const Bubble = styled.div`
  max-width: 85%;
  padding: 0.6rem 0.85rem;
  border-radius: 14px;
  font-size: 0.85rem;
  line-height: 1.5;
  white-space: pre-wrap;
  word-break: break-word;
  align-self: ${(p) => (p.$role === 'user' ? 'flex-end' : 'flex-start')};
  background: ${(p) => (p.$role === 'user' ? 'var(--accent, #000)' : 'var(--tag-bg, #f0f0f0)')};
  color: ${(p) => (p.$role === 'user' ? 'var(--accent-inverse, #fff)' : 'var(--text-primary, #000)')};
  border-bottom-right-radius: ${(p) => (p.$role === 'user' ? '4px' : '14px')};
  border-bottom-left-radius: ${(p) => (p.$role === 'user' ? '14px' : '4px')};
`;

const LinkRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  align-self: flex-start;
  max-width: 85%;
`;

const LinkChip = styled.a`
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.35rem 0.75rem;
  border-radius: 999px;
  border: 1px solid var(--border-card, #e0e0e0);
  background: var(--bg-card, #fff);
  color: var(--text-primary, #000);
  text-decoration: none;

  &:hover,
  &:focus-visible {
    border-color: var(--accent, #000);
  }
`;

const Suggestions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  padding: 0 1rem 0.75rem;
`;

const SuggestionChip = styled.button`
  font-family: inherit;
  font-size: 0.75rem;
  padding: 0.4rem 0.8rem;
  border-radius: 999px;
  border: 1px solid var(--border-card, #e0e0e0);
  background: var(--bg-card, #fff);
  color: var(--text-secondary, #666);
  cursor: pointer;

  &:hover,
  &:focus-visible {
    color: var(--text-primary, #000);
    border-color: var(--accent, #000);
  }
`;

const InputRow = styled.form`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  border-top: 1px solid var(--border-card, #e0e0e0);
`;

const TextInput = styled.input`
  flex: 1;
  min-width: 0;
  font-family: inherit;
  font-size: 0.85rem;
  padding: 0.6rem 0.9rem;
  border-radius: 999px;
  border: 1px solid var(--border-card, #e0e0e0);
  background: var(--bg-secondary, #f7f7f7);
  color: var(--text-primary, #000);

  &::placeholder {
    color: var(--text-muted, #999);
  }

  &:focus-visible {
    outline: none;
    border-color: var(--accent, #000);
  }
`;

const SendButton = styled.button`
  width: 44px;
  height: 44px;
  flex-shrink: 0;
  border-radius: 50%;
  border: none;
  background: var(--accent, #000);
  color: var(--accent-inverse, #fff);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 0.9rem;

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  &:focus-visible {
    outline: 2px solid var(--accent, #000);
    outline-offset: 2px;
  }
`;

const TypingDots = styled(Bubble)`
  letter-spacing: 0.2em;
  color: var(--text-muted, #999);
`;

const Chatbot = () => {
  const reducedMotion = useReducedMotion();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([GREETING]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const listRef = useRef(null);
  const inputRef = useRef(null);
  const replyTimer = useRef(null);
  const nextId = useRef(1);

  useEffect(() => () => clearTimeout(replyTimer.current), []);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  // Keep the newest message in view
  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, isTyping]);

  const send = (raw) => {
    const question = raw.trim();
    if (!question || isTyping) return;
    setMessages((prev) => [...prev, { id: nextId.current++, role: 'user', text: question }]);
    setInput('');
    setIsTyping(true);
    const reply = getBotReply(question);
    // Tiny pause so the reply reads as a response, not an echo
    replyTimer.current = setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        { id: nextId.current++, role: 'bot', text: reply.text, links: reply.links },
      ]);
    }, reducedMotion ? 0 : 500);
  };

  const showSuggestions = !messages.some((m) => m.role === 'user');

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <Panel
            role="dialog"
            aria-label={`Chat with ${firstName}'s site assistant`}
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.97 }}
            animate={reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            onKeyDown={(e) => {
              if (e.key === 'Escape') setIsOpen(false);
            }}
          >
            <Header>
              <HeaderText>
                <HeaderTitle>{firstName}'s site assistant</HeaderTitle>
                <HeaderSub>rule-based · no AI · answers instantly</HeaderSub>
              </HeaderText>
              <CloseButton onClick={() => setIsOpen(false)} aria-label="Close chat">
                <FaTimes aria-hidden="true" />
              </CloseButton>
            </Header>

            <MessageList ref={listRef} aria-live="polite">
              {messages.map((m) => (
                <div key={m.id} style={{ display: 'contents' }}>
                  <Bubble $role={m.role}>{m.text}</Bubble>
                  {m.links?.length > 0 && (
                    <LinkRow>
                      {m.links.map((link) => (
                        <LinkChip
                          key={link.href}
                          href={link.href}
                          target={link.href.startsWith('http') ? '_blank' : undefined}
                          rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                        >
                          {link.label}
                        </LinkChip>
                      ))}
                    </LinkRow>
                  )}
                </div>
              ))}
              {isTyping && <TypingDots $role="bot">•••</TypingDots>}
            </MessageList>

            {showSuggestions && (
              <Suggestions>
                {suggestedQuestions.map((q) => (
                  <SuggestionChip key={q} onClick={() => send(q)}>
                    {q}
                  </SuggestionChip>
                ))}
              </Suggestions>
            )}

            <InputRow
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
            >
              <TextInput
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about skills, projects…"
                aria-label="Type your question"
              />
              <SendButton type="submit" disabled={!input.trim() || isTyping} aria-label="Send question">
                <FaPaperPlane aria-hidden="true" />
              </SendButton>
            </InputRow>
          </Panel>
        )}
      </AnimatePresence>

      <Launcher
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? 'Close chat assistant' : 'Open chat assistant'}
        aria-expanded={isOpen}
        whileHover={reducedMotion ? undefined : { scale: 1.08 }}
        whileTap={reducedMotion ? undefined : { scale: 0.94 }}
      >
        {isOpen ? <FaTimes aria-hidden="true" /> : <FaCommentDots aria-hidden="true" />}
      </Launcher>
    </>
  );
};

export default Chatbot;
