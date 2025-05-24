import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Experience from './components/Experience';
import Blog from './components/Blog';
import Footer from './components/Footer';

function App() {
  return (
    <main>
      <Navbar />
      <Hero />
      {/* <About /> */}
      <Skills />
      {/* <Experience /> */}
      <Blog />
      <Footer />
    </main>
  );
}

export default App;