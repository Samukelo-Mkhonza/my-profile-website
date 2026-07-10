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
    // Neo-brutalist palette: light = warm cream + near-black ink/borders,
    // dark = near-black + charcoal cards with off-white ink/borders.
    // Light values must mirror the :root defaults in index.css.
    root.style.setProperty('--bg-primary', dark ? '#0e0e0c' : '#faf3e8');
    root.style.setProperty('--bg-secondary', dark ? '#171714' : '#f2e9d8');
    // Translucent section backgrounds so the fixed 3D scene shows through
    root.style.setProperty('--bg-primary-glass', dark ? 'rgba(14,14,12,0.9)' : 'rgba(250,243,232,0.9)');
    root.style.setProperty('--bg-secondary-glass', dark ? 'rgba(23,23,20,0.9)' : 'rgba(242,233,216,0.9)');
    root.style.setProperty('--bg-card', dark ? '#1c1c19' : '#fffcf5');
    root.style.setProperty('--bg-card-hover', dark ? '#232320' : '#ffffff');
    root.style.setProperty('--text-primary', dark ? '#f5f1e6' : '#111111');
    root.style.setProperty('--text-secondary', dark ? '#c9c3b4' : '#44403a');
    root.style.setProperty('--text-muted', dark ? '#8f8a7c' : '#78716a');
    root.style.setProperty('--border-color', dark ? 'rgba(245,241,230,0.2)' : 'rgba(17,17,17,0.15)');
    root.style.setProperty('--border-card', dark ? '#f5f1e6' : '#111111');
    // Feeds the hard offset shadows (--shadow-hard*): ink in light mode,
    // a light tone in dark mode so offsets stay visible on near-black.
    root.style.setProperty('--shadow-color', dark ? 'rgba(255,255,255,0.9)' : '#111111');
    root.style.setProperty('--accent', dark ? '#f5f1e6' : '#111111');
    root.style.setProperty('--accent-inverse', dark ? '#111111' : '#fffcf5');
    root.style.setProperty('--glass-bg', dark ? 'rgba(24,24,21,0.95)' : 'rgba(255,252,245,0.95)');
    root.style.setProperty('--tag-bg', dark ? '#28281f' : '#f2e9d8');
    root.style.setProperty('--progress-bg', dark ? '#34342e' : '#e7e0d0');
    root.style.setProperty('--skill-card-bg', dark ? '#171714' : '#fffcf5');
    root.style.setProperty('--green', dark ? '#58c15c' : '#43a047');
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
