import { useState, useEffect, lazy, Suspense } from 'react';
import { motion, useScroll, useSpring, useReducedMotion } from 'framer-motion';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Experience from './components/Experience';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Blog from './components/Blog';
import Footer from './components/Footer';
import EasterEggs from './components/EasterEggs';
import CursorTrail from './components/CursorTrail';
import SitePages from './components/SitePages';
import { ThemeProvider, useTheme } from './context/ThemeContext';

// WebGL scene is heavy, so it is code-split and only loaded after first paint
const Background3D = lazy(() => import('./components/Background3D'));

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

  // Defer the WebGL scene until after first paint
  useEffect(() => {
    if (reducedMotion) return;
    const timer = setTimeout(() => setShow(true), 200);
    return () => clearTimeout(timer);
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
          <Footer />
        </div>
        {/* Hash-routed extra pages (#/now, #/uses, …) + terminal overlay */}
        <SitePages />
      </main>
    </ThemeProvider>
  );
}

export default App;
