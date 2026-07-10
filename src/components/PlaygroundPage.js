import { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { FaPlay } from 'react-icons/fa';
import PageShell from './PageShell';

// Client-side JavaScript playground. Code runs in a Worker inside a sandboxed
// iframe:
//   * sandbox="allow-scripts" only — unique origin, no access to this page,
//     its storage, or its cookies
//   * a CSP of default-src 'none' inside the frame blocks all network access,
//     including fetch from the worker
//   * the worker runs on its own thread, so infinite loops never freeze the
//     page and worker.terminate() kills them preemptively after 3 seconds
// Nothing ever reaches a server — there is deliberately no /run endpoint.

const KILL_MS = 3000; // sync budget inside the sandbox
const BOOT_TIMEOUT_MS = 6000; // parent-side backstop if the sandbox never responds

const EXAMPLES = {
  wave: {
    label: 'ASCII wave',
    code: `// Draw a sine wave in ASCII — press Run (or Ctrl+Enter).
const width = 48, height = 12;
let frame = '';
for (let y = 0; y < height; y++) {
  let row = '';
  for (let x = 0; x < width; x++) {
    const wave = Math.round((Math.sin(x / 4) + 1) * (height - 1) / 2);
    row += wave === y ? '\\u25cf' : ' ';
  }
  frame += row + '\\n';
}
console.log(frame);`,
  },
  sandbox: {
    label: 'Sandbox check',
    code: `// Your code runs in a worker inside a sandboxed iframe:
// no network, no DOM, no access to this page.
fetch('https://example.com')
  .then(() => console.log('This should never print'))
  .catch((e) => console.error('Network blocked, as designed:', e.message));

console.log('DOM access:', typeof document === 'undefined' ? 'none — as designed' : 'unexpected!');
console.log('Sync code finished; the fetch above fails asynchronously.');`,
  },
  fib: {
    label: 'Memoised Fibonacci',
    code: `// Classic interview warm-up, memoised.
const fib = (n, memo = {}) =>
  n <= 1 ? n : (memo[n] ??= fib(n - 1, memo) + fib(n - 2, memo));

for (let i = 1; i <= 10; i++) console.log('fib(' + i + ') =', fib(i));`,
  },
};

const Toolbar = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
`;

const RunButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--accent, #000);
  color: var(--accent-inverse, #fff);
  border: 2px solid var(--border-card, #111);
  border-radius: var(--radius-pill, 999px);
  box-shadow: var(--shadow-hard-sm, 3px 3px 0 #111);
  padding: 0.6rem 1.25rem;
  font-family: inherit;
  font-size: 0.8125rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  cursor: pointer;
  min-height: 44px;
  transition: opacity 0.2s;

  &:hover,
  &:focus-visible {
    opacity: 0.85;
  }

  svg {
    font-size: 0.7rem;
  }
`;

const ExampleSelect = styled.select`
  background: var(--bg-card, #fff);
  color: var(--text-primary, #000);
  border: 2px solid var(--border-card, #e0e0e0);
  border-radius: var(--radius-sm, 10px);
  padding: 0.6rem 0.75rem;
  font-family: inherit;
  font-size: 0.8125rem;
  min-height: 44px;
  cursor: pointer;
`;

const Hint = styled.span`
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-muted, #999);
  margin-left: auto;

  @media (max-width: 768px) {
    display: none;
  }
`;

const Editor = styled.textarea`
  width: 100%;
  min-height: 260px;
  background: var(--bg-card, #fff);
  color: var(--text-primary, #000);
  border: 2px solid var(--border-card, #e0e0e0);
  border-radius: var(--radius-sm, 10px);
  padding: 1rem 1.25rem;
  font-family: inherit;
  font-size: max(0.8125rem, 16px);
  line-height: 1.7;
  resize: vertical;
  tab-size: 2;

  &:focus-visible {
    outline: 2px solid var(--text-primary, #000);
    outline-offset: 2px;
  }

  @media (min-width: 769px) {
    font-size: 0.8125rem;
  }
`;

const OutputPanel = styled.div`
  margin-top: 1rem;
  background: var(--bg-secondary, #f7f7f7);
  border: 2px solid var(--border-card, #e0e0e0);
  border-radius: var(--radius-sm, 10px);
  padding: 1rem 1.25rem;
  min-height: 120px;
  max-height: 320px;
  overflow-y: auto;
`;

const OutputLabel = styled.div`
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--text-muted, #999);
  margin-bottom: 0.5rem;
`;

const OutputLine = styled.pre`
  margin: 0;
  font-family: inherit;
  font-size: 0.8125rem;
  line-height: 1.7;
  white-space: pre-wrap;
  word-break: break-word;
  color: ${(p) => (p.$kind === 'error' || p.$kind === 'warn'
    ? 'var(--text-primary, #000)'
    : 'var(--text-secondary, #555)')};
  font-weight: ${(p) => (p.$kind === 'error' ? 600 : 400)};
`;

const HiddenFrame = styled.iframe`
  display: none;
`;

// Build the sandboxed document. The user code is JSON-encoded (with `<`
// escaped so it can never close the script tag) and spliced into a Worker
// built from a blob, giving it its own thread. The iframe page itself only
// hosts the worker, relays its console output to the parent, and enforces
// the kill timers.
const buildSrcDoc = (code) => {
  const encoded = JSON.stringify(code).replace(/</g, '\\u003c');
  return `<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'unsafe-inline' blob:; worker-src blob:">
</head>
<body>
<script>
(function () {
  var relay = function (kind, text) {
    parent.postMessage({ __playground: true, kind: kind, text: text }, '*');
  };
  var prelude = [
    'var send = function (kind, args) {',
    '  var text = args.map(function (a) {',
    '    if (typeof a === "string") return a;',
    '    try { return JSON.stringify(a, null, 1); } catch (e) { return String(a); }',
    '  }).join(" ");',
    '  postMessage({ kind: kind, text: text });',
    '};',
    'var console = {',
    '  log: function () { send("log", [].slice.call(arguments)); },',
    '  info: function () { send("info", [].slice.call(arguments)); },',
    '  warn: function () { send("warn", [].slice.call(arguments)); },',
    '  error: function () { send("error", [].slice.call(arguments)); }',
    '};',
    'self.onerror = function (e) { send("error", [String(e && e.message ? e.message : e)]); };',
    'self.onunhandledrejection = function (e) { send("error", ["Unhandled rejection: " + e.reason]); };'
  ].join('\\n');
  var userCode = ${encoded};
  var src = prelude +
    '\\ntry {\\n' + userCode + '\\n} catch (e) { send("error", [String(e)]); }\\n' +
    'postMessage({ kind: "done" });';
  var worker;
  try {
    worker = new Worker(URL.createObjectURL(new Blob([src], { type: 'application/javascript' })));
  } catch (e) {
    relay('error', 'Could not start the sandbox worker: ' + e.message);
    relay('done', '');
    return;
  }
  // The worker has its own thread, so this fires even during a busy-loop.
  var killTimer = setTimeout(function () {
    worker.terminate();
    relay('error', 'Stopped after ${KILL_MS / 1000}s — infinite loop?');
    relay('done', '');
  }, ${KILL_MS});
  // Absolute cap so async stragglers (timers) cannot run forever.
  setTimeout(function () { worker.terminate(); }, 30000);
  worker.onmessage = function (e) {
    var data = e.data || {};
    if (data.kind === 'done') clearTimeout(killTimer);
    relay(data.kind, data.text || '');
  };
})();
</script>
</body>
</html>`;
};

const PlaygroundPage = ({ onClose }) => {
  const [code, setCode] = useState(EXAMPLES.wave.code);
  const [output, setOutput] = useState([]);
  const [running, setRunning] = useState(false);
  const [srcDoc, setSrcDoc] = useState(null);
  const frameRef = useRef(null);
  const watchdogRef = useRef(null);

  useEffect(() => {
    const onMessage = (e) => {
      const data = e.data;
      if (!data || data.__playground !== true) return;
      if (frameRef.current && e.source !== frameRef.current.contentWindow) return;
      if (data.kind === 'done') {
        clearTimeout(watchdogRef.current);
        setRunning(false);
        return;
      }
      setOutput((prev) => [...prev, { kind: data.kind, text: data.text }]);
    };
    window.addEventListener('message', onMessage);
    return () => {
      window.removeEventListener('message', onMessage);
      clearTimeout(watchdogRef.current);
    };
  }, []);

  const run = useCallback(() => {
    clearTimeout(watchdogRef.current);
    setOutput([]);
    setRunning(true);
    // Remount the frame each run so the previous run's timers die with it.
    setSrcDoc(null);
    requestAnimationFrame(() => setSrcDoc(buildSrcDoc(code)));
    // Backstop only: the sandbox enforces its own kill timer, so this fires
    // just when the iframe itself failed to boot.
    watchdogRef.current = setTimeout(() => {
      setSrcDoc(null);
      setRunning(false);
      setOutput((prev) => [
        ...prev,
        { kind: 'error', text: 'The sandbox did not respond — try running again.' },
      ]);
    }, BOOT_TIMEOUT_MS);
  }, [code]);

  const onEditorKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      run();
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const { selectionStart, selectionEnd, value } = e.target;
      const next = `${value.slice(0, selectionStart)}  ${value.slice(selectionEnd)}`;
      setCode(next);
      requestAnimationFrame(() => {
        e.target.selectionStart = e.target.selectionEnd = selectionStart + 2;
      });
    }
  };

  return (
    <PageShell
      title="Playground"
      subtitle="Write some JavaScript and run it right here. Everything executes in a sandboxed iframe in your browser — no server, no network, no access to this page."
      onClose={onClose}
    >
      <Toolbar>
        <RunButton onClick={run} disabled={running}>
          <FaPlay aria-hidden="true" />
          {running ? 'Running…' : 'Run'}
        </RunButton>
        <ExampleSelect
          aria-label="Load an example snippet"
          defaultValue="wave"
          onChange={(e) => {
            setCode(EXAMPLES[e.target.value].code);
            setOutput([]);
          }}
        >
          {Object.entries(EXAMPLES).map(([key, ex]) => (
            <option key={key} value={key}>
              {ex.label}
            </option>
          ))}
        </ExampleSelect>
        <Hint>Ctrl+Enter runs</Hint>
      </Toolbar>

      <Editor
        value={code}
        onChange={(e) => setCode(e.target.value)}
        onKeyDown={onEditorKeyDown}
        aria-label="JavaScript code editor"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
      />

      <OutputPanel aria-live="polite" aria-label="Code output">
        <OutputLabel>Output</OutputLabel>
        {output.length === 0 && !running && (
          <OutputLine $kind="log">(run the code to see output here)</OutputLine>
        )}
        {output.map((line, i) => (
          <OutputLine key={i} $kind={line.kind}>
            {line.text}
          </OutputLine>
        ))}
      </OutputPanel>

      {srcDoc && (
        <HiddenFrame
          ref={frameRef}
          sandbox="allow-scripts"
          srcDoc={srcDoc}
          title="Playground sandbox"
          aria-hidden="true"
        />
      )}
    </PageShell>
  );
};

export default PlaygroundPage;
