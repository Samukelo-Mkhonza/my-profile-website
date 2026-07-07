import { matchEntry, getBotReply } from './chatbotMatcher';
import { knowledgeBase, fallbackAnswer, suggestedQuestions } from '../content/chatbotKnowledge';
import { profile } from '../content/profile';

describe('chatbot matcher', () => {
  test('matches a skills question', () => {
    expect(matchEntry('What are your skills?', knowledgeBase).id).toBe('skills');
  });

  test('is case-insensitive and ignores punctuation', () => {
    expect(matchEntry('WHO ARE YOU???', knowledgeBase).id).toBe('about');
    expect(matchEntry('how can i contact you!!', knowledgeBase).id).toBe('contact');
  });

  test('picks the entry with the most keyword hits', () => {
    // "stack" alone also appears in the skills entry; "website" + "built"
    // must tip the score toward the website entry.
    expect(matchEntry('what stack is this website built with', knowledgeBase).id).toBe('website');
  });

  test('multi-word keywords require every word', () => {
    expect(matchEntry('show me the case studies', knowledgeBase).id).toBe('cloud');
  });

  test('returns null when nothing matches', () => {
    expect(matchEntry('xyzzy plugh quux', knowledgeBase)).toBeNull();
    expect(matchEntry('   ', knowledgeBase)).toBeNull();
    expect(matchEntry('', knowledgeBase)).toBeNull();
  });

  test('every suggested question has a real answer', () => {
    for (const question of suggestedQuestions) {
      expect(matchEntry(question, knowledgeBase)).not.toBeNull();
    }
  });
});

describe('getBotReply', () => {
  test('contact question includes the email address', () => {
    const reply = getBotReply('How can I contact you?');
    expect(reply.text).toContain(profile.email);
    expect(reply.links.some((l) => l.href === `mailto:${profile.email}`)).toBe(true);
  });

  test('falls back gracefully on unknown questions', () => {
    const reply = getBotReply('do you enjoy pineapple pizza');
    expect(reply.id).toBe('fallback');
    expect(reply.text).toBe(fallbackAnswer.text);
  });

  test('empty input falls back instead of throwing', () => {
    expect(getBotReply('').id).toBe('fallback');
  });
});
