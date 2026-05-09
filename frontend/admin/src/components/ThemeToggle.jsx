import React, { useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
  const { isDark, toggle } = useTheme();

  // Add/remove dark class to body when theme changes
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }, [isDark]);

  return (
    <button
      onClick={toggle}
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      className="w-9 h-9 flex items-center justify-center rounded-lg bg-card border border-border text-text-secondary hover:bg-text-primary/5 hover:text-primary transition-all duration-200"
    >
      {isDark ? <Sun size={18} className="text-warning" /> : <Moon size={18} className="text-primary" />}
    </button>
  );
};

export default ThemeToggle;
