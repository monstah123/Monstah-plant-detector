import { useState, useEffect } from 'react';
import { Leaf, ScanLine, LayoutDashboard, Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Navbar({ currentView, setCurrentView }) {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('monstah-theme');
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('monstah-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(t => t === 'light' ? 'dark' : 'light');
  };

  return (
    <motion.nav
      className="navbar"
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className="navbar-brand" onClick={() => setCurrentView('landing')} style={{ cursor: 'pointer' }}>
        <Leaf className="logo-icon" strokeWidth={2.5} color="var(--accent)" />
        <h2>Monstah <span>Detect</span></h2>
      </div>
      <div className="navbar-links">
        <button 
          onClick={toggleTheme}
          className="theme-toggle"
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          style={{ padding: '8px 12px', display: 'flex', alignItems: 'center', borderRadius: '10px', background: 'transparent', color: 'var(--text)' }}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <button
          id="nav-detect"
          className={currentView === 'detect' ? 'active' : ''}
          onClick={() => setCurrentView('detect')}
        >
          <ScanLine size={16} /> Detect
        </button>
        <button
          id="nav-dashboard"
          className={currentView === 'dashboard' ? 'active' : ''}
          onClick={() => setCurrentView('dashboard')}
        >
          <LayoutDashboard size={16} /> Dashboard
        </button>
      </div>
    </motion.nav>
  );
}
