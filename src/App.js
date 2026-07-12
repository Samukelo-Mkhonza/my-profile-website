import { useState, useEffect, lazy, Suspense } from 'react';
import { motion, useScroll, useSpring, useReducedMotion } from 'framer-motion';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Experience from './components/Experience';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Blog from './components/Blog';
import Explore from './components/Explore';
import Footer from './components/Footer';
import EasterEggs from './components/EasterEggs';
import CursorTrail from './components/CursorTrail';
import SitePages from './components/SitePages';
import { ThemeProvider, useTheme } from './context/ThemeContext';

// WebGL scene is heavy, so it is code-split and only loaded after first paint
const Background3D = lazy(() => import('./components/Background3D'));
// Chat widget isn't needed for first paint either; deferring its parse/eval
// keeps it off the critical path for LCP/TBT.
const Chatbot = lazy(() => import('./components/Chatbot'));

const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 3,
        transformOrigin: '0 0',
        scaleX,
        background: 'var(--accent, #000)',
        zIndex: 2000,
      }}
    />
  );
};

// Single fixed 3D canvas behind every section; must live inside
// ThemeProvider so it can follow the active theme.
const SceneBackdrop = () => {
  const { isDark } = useTheme();
  const reducedMotion = useReducedMotion();
  const [show, setShow] = useState(false);

  // Skip the ~240KB three.js/react-three-fiber scene entirely on narrow/
  // touch viewports: it's a cursor-following decoration (little payoff with
  // no hover), and this is exactly where the parse/eval cost hurts most.
  useEffect(() => {
    if (reducedMotion) return;
    if (window.matchMedia('(max-width: 768px), (hover: none)').matches) return;
    // requestIdleCallback (falling back to setTimeout) so the scene never
    // competes with hydration/interactivity work on slower devices.
    const idle = window.requestIdleCallback || ((cb) => setTimeout(cb, 200));
    const cancelIdle = window.cancelIdleCallback || clearTimeout;
    const handle = idle(() => setShow(true), { timeout: 1000 });
    return () => cancelIdle(handle);
  }, [reducedMotion]);

  if (!show) return null;

  return (
    <Suspense fallback={null}>
      <Background3D isDark={isDark} />
    </Suspense>
  );
};

function App() {
  return (
    <ThemeProvider>
      <main>
        <SceneBackdrop />
        {/* Keeps all content stacked above the fixed 3D canvas */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <ScrollProgress />
          <CursorTrail />
          <EasterEggs />
          <Navbar />
          <Hero />
          <About />
          <Experience />
          <Skills />
          <Projects />
          <Blog />
          <Explore />
          <Footer />
          <Suspense fallback={null}>
            <Chatbot />
          </Suspense>
        </div>
        {/* Hash-routed extra pages (#/now, #/uses, …) + terminal overlay */}
        <SitePages />
      </main>
    </ThemeProvider>
  );
}

export default App;
