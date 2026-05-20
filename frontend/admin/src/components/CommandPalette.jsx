import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Building2, Users, Settings, CreditCard, LayoutGrid } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CommandPalette = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const commands = [
    { id: 1, name: 'Go to Dashboard', icon: <LayoutGrid size={16} />, path: '/dashboard', category: 'Navigation' },
    { id: 2, name: 'Manage Hostels', icon: <Building2 size={16} />, path: '/hostels', category: 'Navigation' },
    { id: 3, name: 'View Tenants', icon: <Users size={16} />, path: '/tenants', category: 'Navigation' },
    { id: 4, name: 'Finance & Payments', icon: <CreditCard size={16} />, path: '/finance', category: 'Navigation' },
    { id: 5, name: 'System Settings', icon: <Settings size={16} />, path: '/settings', category: 'System' },
    { id: 6, name: 'Search Global Users', icon: <Search size={16} />, path: '/users', category: 'Actions' },
  ];

  const filtered = commands.filter(c => c.name.toLowerCase().includes(query.toLowerCase()));

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleSelect = (path) => {
    navigate(path);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-secondary/40 backdrop-blur-sm"
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          className="relative w-full max-w-2xl bg-surface rounded-2xl shadow-premium border border-divider overflow-hidden"
        >
          <div className="flex items-center px-4 border-b border-divider">
            <Search className="text-text-muted shrink-0" size={20} />
            <input
              autoFocus
              type="text"
              className="w-full bg-transparent border-none py-4 px-3 text-sm focus:outline-none focus:ring-0 text-text-main placeholder-text-muted"
              placeholder="Type a command or search..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <div className="flex items-center gap-1 shrink-0 bg-gray-100 rounded p-1 text-[10px] font-bold text-text-muted">
              <span>ESC</span>
            </div>
          </div>

          <div className="max-h-[60vh] overflow-y-auto p-2 scrollbar-hide">
            {filtered.length === 0 ? (
              <div className="py-14 text-center text-sm text-text-muted">
                No results found for "{query}"
              </div>
            ) : (
              <div className="space-y-1">
                {filtered.map((cmd) => (
                  <button
                    key={cmd.id}
                    onClick={() => handleSelect(cmd.path)}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-left text-text-main hover:bg-gray-50 hover:text-primary rounded-xl transition-all group"
                  >
                    <div className="text-text-muted group-hover:text-primary transition-colors">
                      {cmd.icon}
                    </div>
                    <span className="font-medium flex-1">{cmd.name}</span>
                    <span className="text-[10px] font-bold tracking-wider text-text-muted uppercase">
                      {cmd.category}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CommandPalette;
