// Matching engine for the rule-based chatbot. Pure logic — no DOM, no React —
// so it can be unit-tested directly (same pattern as terminalCommands.js).
//
// Scoring: each single-word keyword found in the question is worth 1 point;
// a multi-word keyword ("case studies") only scores when every word appears,
// and is worth one point per word so specific phrases beat loose overlaps.
// Highest score wins; ties go to the earlier entry in the knowledge base.
//
// The UI only calls getBotReply(), so swapping this file for a real AI
// backend later means changing one function without touching the widget.

import { knowledgeBase, fallbackAnswer } from '../content/chatbotKnowledge';

const tokenize = (text) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);

export function matchEntry(input, entries) {
  const words = new Set(tokenize(input));
  if (!words.size) return null;

  let best = null;
  let bestScore = 0;
  for (const entry of entries) {
    let score = 0;
    for (const keyword of entry.keywords) {
      const parts = tokenize(keyword);
      if (!parts.length) continue;
      if (parts.every((p) => words.has(p))) score += parts.length;
    }
    if (score > bestScore) {
      best = entry;
      bestScore = score;
    }
  }
  return best;
}

export function getBotReply(input, { entries = knowledgeBase, fallback = fallbackAnswer } = {}) {
  const entry = matchEntry(input, entries);
  if (entry) return { id: entry.id, text: entry.answer, links: entry.links };
  return { id: 'fallback', text: fallback.text, links: fallback.links };
}
