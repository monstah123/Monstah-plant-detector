import { Leaf, ScanLine, LayoutDashboard } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Navbar({ currentView, setCurrentView }) {
  return (
    <motion.nav
      className="navbar"
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className="navbar-brand">
        <Leaf className="logo-icon" strokeWidth={2.5} color="var(--accent)" />
        <h2>Monstah <span>Detect</span></h2>
      </div>
      <div className="navbar-links">
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
