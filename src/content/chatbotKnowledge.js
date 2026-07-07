// Rule-based knowledge for the site chatbot. No AI: the widget scores a
// visitor's question against each entry's `keywords` (src/lib/chatbotMatcher.js)
// and replies with the canned `answer`. Answers are built from the same content
// files the rest of the site uses, so updating profile.js or skills.js keeps
// the bot in sync automatically.
//
// Matching is exact-word (no stemming), so list both forms where it matters
// ("skill" and "skills"). Multi-word keywords count as one phrase and only
// score when every word appears in the question.

import { profile } from './profile';
import { skillsData } from './skills';

const firstName = profile.name.split(' ')[0];
const topSkills = skillsData.map((s) => s.name).join(', ');
const expertSkills = skillsData
  .filter((s) => s.level === 'Expert')
  .map((s) => s.name)
  .join(', ');

export const suggestedQuestions = [
  `Who is ${firstName}?`,
  'What are your skills?',
  'How can I contact you?',
  'What is this site built with?',
];

export const fallbackAnswer = {
  text: `I'm not sure about that one — I'm a simple rule-based bot (no AI yet!). Try asking about ${firstName}'s skills, projects, experience, or how to get in touch.`,
};

export const knowledgeBase = [
  {
    id: 'greeting',
    keywords: ['hi', 'hello', 'hey', 'howdy', 'greetings', 'morning', 'afternoon', 'evening'],
    answer: `Hi there! 👋 Ask me about ${firstName}'s skills, projects, experience, or how to reach him.`,
  },
  {
    id: 'about',
    keywords: ['who', 'about', 'yourself', 'introduce', 'introduction', 'bio', 'samukelo', 'name'],
    answer: `${profile.name} is a ${profile.role} at ${profile.company}, based in ${profile.location}. He specialises in cloud-native infrastructure and high-performance applications, with 5+ years in tech.`,
  },
  {
    id: 'skills',
    keywords: ['skill', 'skills', 'technologies', 'technology', 'tech', 'stack', 'languages', 'frameworks', 'tools', 'know'],
    answer: `His toolkit covers ${topSkills}. Strongest areas: ${expertSkills}. The Skills section shows concrete "how I've used it" examples for each.`,
  },
  {
    id: 'experience',
    keywords: ['experience', 'career', 'job', 'work', 'working', 'company', 'employer', 'cloudza', 'role'],
    answer: `${firstName} has 5+ years in technology and currently works as a ${profile.role} at ${profile.company}, architecting scalable, secure AWS solutions. The Experience section has the full timeline.`,
  },
  {
    id: 'projects',
    keywords: ['project', 'projects', 'portfolio', 'repo', 'repos', 'repositories', 'github', 'code', 'building'],
    answer: `The Projects section lists his work — it's pulled live from GitHub, so it's always current. You can also browse everything on his GitHub profile.`,
    links: [{ label: 'GitHub profile', href: profile.githubUrl }],
  },
  {
    id: 'cloud',
    keywords: ['aws', 'cloud', 'serverless', 'lambda', 'devops', 'terraform', 'docker', 'kubernetes', 'infrastructure', 'case study', 'case studies'],
    answer: `Cloud is his home turf: AWS (Lambda, S3, ECS, CloudFormation), Docker, Kubernetes, and Terraform. At ${profile.company} he cut client deployment times from 45 minutes to under 8. The case studies page has the details.`,
    links: [{ label: 'Read the case studies', href: '#/case-studies' }],
  },
  {
    id: 'contact',
    keywords: ['contact', 'email', 'reach', 'hire', 'hiring', 'touch', 'message', 'linkedin', 'talk', 'connect'],
    answer: `Best way is email: ${profile.email}. He's also on LinkedIn and GitHub.`,
    links: [
      { label: 'Email', href: `mailto:${profile.email}` },
      { label: 'LinkedIn', href: profile.linkedinUrl },
      { label: 'GitHub', href: profile.githubUrl },
    ],
  },
  {
    id: 'location',
    keywords: ['where', 'location', 'based', 'live', 'lives', 'city', 'country', 'from', 'remote'],
    answer: `He's based in ${profile.location}.`,
  },
  {
    id: 'website',
    keywords: ['site', 'website', 'built', 'made', 'stack', 'source', 'react', 'design', 'page'],
    answer: `This site is hand-built with React 19, styled-components, Framer Motion, and a Three.js background — no site builder. It ships to both S3 + CloudFront and GitHub Pages from one CI pipeline. The source is public.`,
    links: [{ label: 'View the source', href: `https://github.com/${profile.siteRepo}` }],
  },
  {
    id: 'interests',
    keywords: ['hobbies', 'hobby', 'interests', 'fun', 'coffee', 'music', 'gaming', 'games', 'free', 'clock'],
    answer: `Off the clock: ${profile.interests.join(', ').toLowerCase()}. He runs on 3+ cups of coffee a day.`,
  },
  {
    id: 'terminal',
    keywords: ['terminal', 'secret', 'hidden', 'easter', 'egg', 'eggs', 'commands', 'console'],
    answer: 'Psst — press Ctrl+` anywhere on the site to open an interactive terminal. Try "help"… and maybe "sudo hire-me". 🥚',
  },
  {
    id: 'ai',
    keywords: ['ai', 'artificial', 'intelligence', 'gpt', 'llm', 'chatgpt', 'model', 'smart', 'robot'],
    answer: `No AI here — I'm a simple keyword-matching bot answering from a local knowledge base. ${firstName} may wire up a real model later; for now I'm honest, fast, and free to run.`,
  },
];

const chatbotKnowledge = { knowledgeBase, suggestedQuestions, fallbackAnswer };
export default chatbotKnowledge;
