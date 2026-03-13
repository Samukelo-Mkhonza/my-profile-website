import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Skills from './components/Skills';
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
        <Skills />
        <Blog />
        <Footer />
      </main>
    </ThemeProvider>
  );
}

export default App;
