import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import ThemeToggle from './ThemeToggle';
import { Bell, Search, Settings, Calendar, Menu, ChevronDown, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [collapsed, setCollapsed] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background flex font-sans text-text-primary overflow-hidden">
      <Sidebar collapsed={collapsed} />

      <main className={`flex-1 flex flex-col transition-all duration-300 ease-in-out relative ${collapsed ? 'ml-20' : 'ml-64'}`}>

        {/* TOP BAR */}
        <header className="h-16 px-8 bg-card border-b border-border flex items-center justify-between sticky top-0 z-40">

          {/* Collapse Toggle & Greeting */}
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setCollapsed(!collapsed)}
              className="p-2 hover:bg-primary/5 rounded-lg text-text-muted hover:text-primary transition-all active:scale-95"
              title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              <Menu size={20} className={`transition-transform duration-300 ${collapsed ? '' : 'rotate-180'}`} />
            </button>
            <div>
              <h1 className="text-[14px] text-premium-header flex items-center gap-2">
                 StayNest Admin <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </h1>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-xl px-10">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" size={18} />
              <input
                type="text"
                className="w-full bg-background border border-border rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all shadow-subtle"
                placeholder="Command Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Actions & Profile */}
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <button className="p-2 text-text-secondary hover:text-primary transition-colors relative group">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-danger rounded-full border-2 border-card"></span>
              
              {/* Notification Tooltip/Dropdown Placeholder */}
              <div className="absolute top-full right-0 mt-2 w-64 bg-card border border-border rounded-xl shadow-premium opacity-0 group-hover:opacity-100 pointer-events-none transition-all z-50 p-4">
                <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-2">Recent Notifications</p>
                <p className="text-xs text-text-secondary">No new critical alerts.</p>
              </div>
            </button>
            <div className="h-8 w-[1px] bg-border mx-2" />
            
            <div className="relative">
              <div 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black text-xs border border-primary/20 group-hover:shadow-glow transition-all">
                  AD
                </div>
                <ChevronDown size={14} className={`text-text-muted group-hover:text-text-primary transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`} />
              </div>

              <AnimatePresence>
                {isProfileOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)} />
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute top-full right-0 mt-2 w-56 bg-card border border-border rounded-2xl shadow-premium z-50 overflow-hidden"
                    >
                      <div className="p-4 border-b border-border bg-slate-50/50 dark:bg-white/2">
                        <p className="text-xs font-black text-text-primary uppercase tracking-tight">Super Admin</p>
                        <p className="text-[10px] font-medium text-text-muted mt-0.5 italic">admin@staynest.com</p>
                      </div>
                      <div className="p-2">
                        <button className="w-full flex items-center gap-3 px-3 py-2 text-[11px] font-bold text-text-secondary hover:text-primary hover:bg-primary/5 rounded-lg transition-all">
                          <Settings size={14} /> Account Settings
                        </button>
                        <button 
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-3 py-2 text-[11px] font-bold text-rose-500 hover:bg-rose-500/5 rounded-lg transition-all"
                        >
                          <Settings size={14} className="opacity-0" /> Sign Out
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* MAIN CONTENT */}
        <div className="flex-1 p-10 overflow-y-auto scrollbar-hide bg-background">
          <div className="max-w-[1400px] mx-auto animate-fade">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;
