import { motion, useScroll, useSpring } from 'framer-motion';
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
import { ThemeProvider } from './context/ThemeContext';

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

function App() {
  return (
    <ThemeProvider>
      <main>
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
      </main>
    </ThemeProvider>
  );
}

export default App;
