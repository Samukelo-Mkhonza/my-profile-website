// Command engine for the interactive terminal. Pure logic — no DOM, no React —
// so it can be unit-tested directly. The component supplies side effects via
// `ctx` (project fetching) and interprets the returned `action`.

import { profile } from '../content/profile';
import { now } from '../content/now';
import { uses } from '../content/uses';
import { tilNotes } from '../content/til';

const out = (text) => ({ type: 'output', text });
const err = (text) => ({ type: 'error', text });
const heading = (text) => ({ type: 'heading', text });

export const PAGE_ROUTES = ['now', 'uses', 'til', 'case-studies', 'changelog', 'playground'];

export const COMMANDS = [
  'help',
  'whoami',
  'cat about',
  'ls projects',
  'now',
  'uses',
  'til',
  'contact',
  'open',
  'theme',
  'clear',
  'exit',
];

const HELP_LINES = [
  heading('Available commands'),
  out('  help              show this list'),
  out('  whoami            who owns this terminal'),
  out('  cat about         the longer story'),
  out('  ls projects       live list of my GitHub repos'),
  out('  now               what I am focused on right now'),
  out('  uses              tools and stack I use'),
  out('  til               latest "today I learned" notes'),
  out('  contact           how to reach me'),
  out(`  open <page>       jump to a page (${PAGE_ROUTES.join(', ')})`),
  out('  theme             toggle light/dark mode'),
  out('  clear             clear the screen'),
  out('  exit              close the terminal'),
  out(''),
  out('Tab completes commands; ↑/↓ walk history. One or two commands are undocumented…'),
];

const hireMeArt = String.raw`
 _   _ _          __  __
| | | (_)_ __ ___|  \/  | ___
| |_| | | '__/ _ \ |\/| |/ _ \
|  _  | | | |  __/ |  | |  __/
|_| |_|_|_|  \___|_|  |_|\___|
`;

export async function runCommand(rawInput, ctx = {}) {
  const input = rawInput.trim().replace(/\s+/g, ' ');
  if (!input) return { lines: [] };

  const [cmd, ...args] = input.split(' ');
  const arg = args.join(' ');

  switch (cmd.toLowerCase()) {
    case 'help':
    case '?':
      return { lines: HELP_LINES };

    case 'whoami':
      return {
        lines: [
          out(`${profile.name} — ${profile.role} @ ${profile.company}`),
          out(`${profile.location}`),
          out(`Off the clock: ${profile.interests.join(', ').toLowerCase()}.`),
        ],
      };

    case 'cat':
      if (arg === 'about' || arg === 'about.txt') {
        return { lines: profile.bio.map(out) };
      }
      return { lines: [err(`cat: ${arg || 'missing operand'}: No such file — try 'cat about'`)] };

    case 'about':
      return { lines: profile.bio.map(out) };

    case 'ls': {
      if (arg === 'projects' || arg === 'projects/') {
        if (!ctx.fetchProjects) {
          return { lines: [err('ls: projects unavailable in this environment')] };
        }
        try {
          const repos = await ctx.fetchProjects();
          if (!repos.length) return { lines: [out('(no public repositories found)')] };
          const width = Math.max(...repos.map((r) => r.name.length));
          return {
            lines: [
              heading(`${repos.length} public repos (live from GitHub)`),
              ...repos.map((r) =>
                out(
                  `  ${r.name.padEnd(width + 2)}${(r.language || '—').padEnd(12)}★ ${r.stargazers_count}`
                )
              ),
              out(''),
              out(`Full details: ${profile.githubUrl}`),
            ],
          };
        } catch (e) {
          return { lines: [err(`ls: could not reach GitHub (${e.message})`)] };
        }
      }
      return { lines: [out('projects/   (try: ls projects)')] };
    }

    case 'now':
      return {
        lines: [
          heading(`Now — updated ${now.updated}`),
          ...now.items
            .filter((item) => !item.todo)
            .flatMap((item) => [out(`• ${item.title}`), out(`  ${item.detail}`)]),
          out(''),
          out("Full page: open now"),
        ],
      };

    case 'uses':
      return {
        lines: [
          heading('Uses'),
          ...uses.sections.flatMap((section) => {
            const real = section.items.filter((i) => !i.todo);
            if (!real.length) return [];
            return [out(`${section.title}:`), out(`  ${real.map((i) => i.name).join(', ')}`)];
          }),
          out(''),
          out('Full page: open uses'),
        ],
      };

    case 'til':
      return {
        lines: [
          heading('Latest TIL notes'),
          ...tilNotes.slice(0, 3).flatMap((n) => [out(`${n.date}  ${n.title}`)]),
          out(''),
          out('All notes: open til'),
        ],
      };

    case 'contact':
      return {
        lines: [
          heading('Reach me'),
          out(`  email     ${profile.email}`),
          out(`  github    ${profile.githubUrl}`),
          out(`  linkedin  ${profile.linkedinUrl}`),
        ],
      };

    case 'open': {
      const route = arg.toLowerCase();
      if (PAGE_ROUTES.includes(route)) {
        return {
          lines: [out(`Opening ${route}…`)],
          action: { type: 'navigate', route },
        };
      }
      return {
        lines: [err(`open: unknown page '${arg}' — pages: ${PAGE_ROUTES.join(', ')}`)],
      };
    }

    case 'theme':
      return { lines: [out('Toggling theme…')], action: { type: 'theme' } };

    case 'clear':
    case 'cls':
      return { lines: [], action: { type: 'clear' } };

    case 'exit':
    case 'quit':
      return { lines: [out('bye 👋')], action: { type: 'close' } };

    // Undocumented, as every good terminal deserves.
    case 'sudo':
      if (arg === 'hire-me' || arg === 'hire me') {
        return {
          lines: [
            out(hireMeArt),
            out('[sudo] permission granted — excellent judgement.'),
            out(`Let's talk: ${profile.email}`),
          ],
          action: { type: 'confetti' },
        };
      }
      return { lines: [err('visitor is not in the sudoers file. This incident will be reported.')] };

    case 'coffee':
      return {
        lines: [
          out('      ( ('),
          out('       ) )'),
          out('    ........'),
          out('    |      |]'),
          out('    \\      /'),
          out("     `----'"),
          out('Brewing… I run on 3+ cups a day.'),
        ],
      };

    default:
      return {
        lines: [err(`command not found: ${cmd} — try 'help'`)],
      };
  }
}

// Tab completion: returns the completed input, or null if nothing matches.
export function completeCommand(partial) {
  const trimmed = partial.trimStart();
  if (!trimmed) return null;
  if (trimmed.startsWith('open ')) {
    const frag = trimmed.slice(5).toLowerCase();
    const match = PAGE_ROUTES.find((r) => r.startsWith(frag));
    return match ? `open ${match}` : null;
  }
  const match = COMMANDS.find((c) => c.startsWith(trimmed.toLowerCase()));
  return match || null;
}
