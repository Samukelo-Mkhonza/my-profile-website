import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark';
  });

  const applyTheme = useCallback((dark) => {
    const root = document.documentElement;
    root.setAttribute('data-theme', dark ? 'dark' : 'light');
    root.style.setProperty('--bg-primary', dark ? '#0a0a0a' : '#ffffff');
    root.style.setProperty('--bg-secondary', dark ? '#1a1a1a' : '#f7f7f7');
    // Translucent section backgrounds so the fixed 3D scene shows through
    root.style.setProperty('--bg-primary-glass', dark ? 'rgba(10,10,10,0.84)' : 'rgba(255,255,255,0.86)');
    root.style.setProperty('--bg-secondary-glass', dark ? 'rgba(26,26,26,0.84)' : 'rgba(247,247,247,0.86)');
    root.style.setProperty('--bg-card', dark ? '#1e1e1e' : '#ffffff');
    root.style.setProperty('--bg-card-hover', dark ? '#2a2a2a' : '#ffffff');
    root.style.setProperty('--text-primary', dark ? '#f0f0f0' : '#000000');
    root.style.setProperty('--text-secondary', dark ? '#a0a0a0' : '#666666');
    root.style.setProperty('--text-muted', dark ? '#888888' : '#999999');
    root.style.setProperty('--border-color', dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)');
    root.style.setProperty('--border-card', dark ? '#333333' : '#e0e0e0');
    root.style.setProperty('--shadow-color', dark ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.1)');
    root.style.setProperty('--accent', dark ? '#ffffff' : '#000000');
    root.style.setProperty('--accent-inverse', dark ? '#000000' : '#ffffff');
    root.style.setProperty('--glass-bg', dark ? 'rgba(20,20,20,0.95)' : 'rgba(255,255,255,0.95)');
    root.style.setProperty('--tag-bg', dark ? '#2a2a2a' : '#f0f0f0');
    root.style.setProperty('--progress-bg', dark ? '#333333' : '#e9ecef');
    root.style.setProperty('--skill-card-bg', dark ? '#141414' : '#f8f9fa');
  }, []);

  useEffect(() => {
    applyTheme(isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark, applyTheme]);

  const toggleTheme = useCallback(() => {
    setIsDark(prev => !prev);
  }, []);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
