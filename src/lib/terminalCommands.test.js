import { runCommand, completeCommand, PAGE_ROUTES } from './terminalCommands';
import { profile } from '../content/profile';

describe('terminal command engine', () => {
  test('help lists the documented commands', async () => {
    const { lines } = await runCommand('help');
    const text = lines.map((l) => l.text).join('\n');
    expect(text).toMatch(/whoami/);
    expect(text).toMatch(/ls projects/);
    expect(text).toMatch(/cat about/);
    expect(text).toMatch(/contact/);
  });

  test('whoami answers with name, role, and company', async () => {
    const { lines } = await runCommand('whoami');
    const text = lines.map((l) => l.text).join('\n');
    expect(text).toContain(profile.name);
    expect(text).toContain(profile.role);
    expect(text).toContain(profile.company);
  });

  test('cat about prints the bio', async () => {
    const { lines } = await runCommand('cat about');
    expect(lines.map((l) => l.text)).toEqual(profile.bio);
  });

  test('cat without a valid file errors helpfully', async () => {
    const { lines } = await runCommand('cat resume.pdf');
    expect(lines[0].type).toBe('error');
    expect(lines[0].text).toMatch(/cat about/);
  });

  test('unknown commands point to help', async () => {
    const { lines } = await runCommand('frobnicate');
    expect(lines[0].type).toBe('error');
    expect(lines[0].text).toMatch(/command not found: frobnicate/);
  });

  test('open <page> returns a navigate action for every route', async () => {
    for (const route of PAGE_ROUTES) {
      const { action } = await runCommand(`open ${route}`);
      expect(action).toEqual({ type: 'navigate', route });
    }
  });

  test('open with an unknown page errors without an action', async () => {
    const { lines, action } = await runCommand('open basement');
    expect(action).toBeUndefined();
    expect(lines[0].type).toBe('error');
  });

  test('clear and exit return their actions', async () => {
    expect((await runCommand('clear')).action).toEqual({ type: 'clear' });
    expect((await runCommand('exit')).action).toEqual({ type: 'close' });
  });

  test('ls projects renders repos from the provided fetcher', async () => {
    const fetchProjects = async () => [
      { name: 'repo-a', language: 'JavaScript', stargazers_count: 3 },
      { name: 'repo-b', language: null, stargazers_count: 0 },
    ];
    const { lines } = await runCommand('ls projects', { fetchProjects });
    const text = lines.map((l) => l.text).join('\n');
    expect(text).toContain('repo-a');
    expect(text).toContain('repo-b');
    expect(text).toContain('★ 3');
  });

  test('ls projects reports fetch failures instead of faking data', async () => {
    const fetchProjects = async () => {
      throw new Error('GitHub API error 403');
    };
    const { lines } = await runCommand('ls projects', { fetchProjects });
    expect(lines[0].type).toBe('error');
    expect(lines[0].text).toMatch(/GitHub API error 403/);
  });

  test('sudo hire-me fires the confetti action', async () => {
    const { lines, action } = await runCommand('sudo hire-me');
    expect(action).toEqual({ type: 'confetti' });
    expect(lines.map((l) => l.text).join('\n')).toContain(profile.email);
  });

  test('empty input is a no-op', async () => {
    const { lines, action } = await runCommand('   ');
    expect(lines).toEqual([]);
    expect(action).toBeUndefined();
  });
});

describe('tab completion', () => {
  test('completes commands and open targets', () => {
    expect(completeCommand('he')).toBe('help');
    expect(completeCommand('wh')).toBe('whoami');
    expect(completeCommand('open ch')).toBe('open changelog');
    expect(completeCommand('open case')).toBe('open case-studies');
  });

  test('returns null when nothing matches', () => {
    expect(completeCommand('zzz')).toBeNull();
    expect(completeCommand('open zzz')).toBeNull();
    expect(completeCommand('')).toBeNull();
  });
});
