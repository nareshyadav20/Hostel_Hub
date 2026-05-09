import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import ThemeToggle from './ThemeToggle';
import { Bell, User, ArrowLeft, Search, Bot, Sparkles, X, ChevronUp, AlertTriangle, TrendingUp } from 'lucide-react';

const FloatingAIAssistant = () => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`fixed bottom-6 right-6 transition-all duration-500 z-[60] flex flex-col items-end ${expanded ? 'w-80' : 'w-14'}`}>
      {/* Expanded Panel */}
      <div className={`layer-4 overflow-hidden transition-all duration-500 transform origin-bottom-right mb-4 border border-border w-full flex flex-col ${expanded ? 'scale-100 opacity-100 max-h-96 pointer-events-auto' : 'scale-90 opacity-0 max-h-0 pointer-events-none'}`}>
        <div className="bg-primary/10 border-b border-border p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot size={18} className="text-primary" />
            <span className="font-bold text-sm tracking-wide text-text-primary">Livora Intelligence</span>
          </div>
          <button onClick={() => setExpanded(false)} className="text-text-muted hover:text-text-primary transition-colors">
            <X size={16} />
          </button>
        </div>
        <div className="p-4 space-y-3 overflow-y-auto custom-scrollbar">
          <div className="p-3 rounded-lg bg-background border border-border flex gap-3">
            <AlertTriangle size={16} className="text-warning flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-text-primary">Occupancy Warning</p>
              <p className="text-[10px] text-text-muted mt-1 leading-snug">Building B is 5% below target. Suggesting flash offer.</p>
            </div>
          </div>
          <div className="p-3 rounded-lg bg-background border border-border flex gap-3">
            <TrendingUp size={16} className="text-success flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-text-primary">Finance Insight</p>
              <p className="text-[10px] text-text-muted mt-1 leading-snug">Energy costs up 12% in Pune. Auto-adjusting AC schedules.</p>
            </div>
          </div>
        </div>
        <div className="p-3 border-t border-border bg-black/20 dark:bg-black/40">
           <div className="relative">
             <input type="text" placeholder="Ask Livora AI..." className="w-full bg-background border border-border rounded-lg py-2 pl-3 pr-8 text-xs focus:outline-none focus:border-primary/50 text-text-primary placeholder:text-text-muted" />
             <Sparkles size={14} className="absolute right-2.5 top-2.5 text-primary" />
           </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <button 
        onClick={() => setExpanded(!expanded)}
        className="w-14 h-14 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center text-white shadow-[0_0_20px_rgb(var(--primary)/0.4)] hover:shadow-[0_0_30px_rgb(var(--primary)/0.6)] hover:scale-105 transition-all duration-300 relative group"
      >
        <span className="absolute top-0 right-0 w-3 h-3 bg-danger rounded-full border-2 border-background animate-pulse"></span>
        {expanded ? <ChevronUp size={24} className="transform rotate-180 transition-transform" /> : <Bot size={24} className="group-hover:animate-pulse" />}
      </button>
    </div>
  );
};

const Layout = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isDashboard = location.pathname === '/dashboard' || location.pathname === '/';

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    setIsSearching(val.length > 0);
  };

  return (
    <div className="min-h-screen bg-background flex font-sans text-text-primary overflow-hidden">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      
      <main className={`flex-1 flex flex-col transition-all duration-300 relative ${collapsed ? 'ml-20' : 'ml-64'}`}>
        <header className="h-[72px] px-8 bg-card/80 backdrop-blur-md border-b border-border sticky top-0 z-40 flex items-center justify-between">
          {/* Left: Greeting & Summary */}
          <div className="flex items-center gap-4 flex-1">
            {!isDashboard && (
              <button 
                className="w-8 h-8 flex items-center justify-center rounded-lg text-text-secondary hover:bg-text-primary/5 hover:text-text-primary transition-colors"
                onClick={() => navigate('/dashboard')}
                title="Back to Command Center"
              >
                <ArrowLeft size={18} />
              </button>
            )}
            {isDashboard && (
              <div className="flex flex-col">
                <span className="text-sm font-semibold tracking-tight text-text-primary">Good Morning, Admin 👋</span>
                <span className="text-xs font-medium text-success flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse"></span>
                  12 hostels operating normally today
                </span>
              </div>
            )}
          </div>

          {/* Center: Command Palette Search */}
          <div className="flex-1 flex justify-center max-w-2xl w-full">
            <div className="relative w-full max-w-lg group">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-text-muted group-focus-within:text-primary transition-colors">
                <Search size={16} />
              </div>
              <input 
                type="text" 
                className="w-full bg-background border border-border rounded-xl py-2 pl-10 pr-12 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-text-muted text-text-primary shadow-sm hover:border-border/80"
                placeholder="Search tenants, bookings, complaints, inventory..." 
                value={searchQuery}
                onChange={handleSearchChange}
                onBlur={() => setTimeout(() => setIsSearching(false), 200)}
              />
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-semibold text-text-muted bg-card border border-border rounded shadow-sm">
                  ⌘K
                </kbd>
              </div>
              
              {isSearching && (
                <div className="absolute top-full left-0 right-0 mt-2 layer-3 p-2 z-50 animate-fade">
                  <div 
                    className="flex items-center gap-3 p-2 hover:bg-text-primary/5 rounded-lg cursor-pointer transition-colors"
                    onClick={() => navigate('/hostels')}
                  >
                    <div className="w-10 h-10 rounded-lg bg-warning/10 text-warning flex items-center justify-center flex-shrink-0">
                      <Search size={18} />
                    </div>
                    <div>
                      <div className="font-semibold text-sm">Sapphire Men's PG</div>
                      <div className="text-xs text-text-muted">Koramangala, Bangalore</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center justify-end gap-3 flex-1">
            <ThemeToggle />

            <button className="relative w-10 h-10 flex items-center justify-center rounded-xl text-text-secondary hover:bg-text-primary/5 hover:text-text-primary border border-transparent hover:border-border transition-all">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-danger text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-card">12</span>
            </button>

            <div className="flex items-center gap-3 ml-4 cursor-pointer group">
              <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center font-bold text-sm shadow-lg shadow-primary/20 group-hover:scale-105 transition-all">
                A
              </div>
              <div className="hidden lg:flex flex-col text-left">
                <span className="text-sm font-bold text-text-primary leading-none">Admin</span>
                <span className="text-[10px] font-bold text-text-muted mt-1 uppercase tracking-widest">Super Admin</span>
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 p-8 overflow-y-auto custom-scrollbar animate-fade">
          {children}
        </div>
      </main>

      <FloatingAIAssistant />
    </div>
  );
};

export default Layout;
