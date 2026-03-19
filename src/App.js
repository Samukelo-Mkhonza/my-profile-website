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

function App() {
  return (
    <ThemeProvider>
      <main>
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
