import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import ThemeToggle from './ThemeToggle';
import { Bell, Search, Settings, Calendar, Menu, ChevronDown } from 'lucide-react';
import axios from 'axios';

const Layout = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [collapsed, setCollapsed] = useState(false);
  
  return (
    <div className="min-h-screen bg-background flex font-sans text-text-primary overflow-hidden">
      <Sidebar collapsed={collapsed} />
      
      <main className={`flex-1 flex flex-col transition-all duration-300 relative ${collapsed ? 'ml-20' : 'ml-64'}`}>
        
        {/* TOP BAR */}
        <header className="h-16 px-8 bg-card border-b border-border flex items-center justify-between sticky top-0 z-40">
          
          {/* Greeting & Date */}
          <div className="flex items-center gap-6">
            <div>
              <h1 className="text-[15px] font-bold text-text-primary">Hello, Administrator</h1>
              <div className="flex items-center gap-2 text-[11px] text-text-muted font-medium uppercase tracking-wider">
                <Calendar size={12} />
                {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-xl px-10">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
              <input 
                type="text" 
                className="w-full bg-background border border-border rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                placeholder="Search everything..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Actions & Profile */}
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <button className="p-2 text-text-secondary hover:text-primary transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-danger rounded-full border-2 border-card"></span>
            </button>
            <div className="h-8 w-[1px] bg-border mx-2" />
            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs border border-primary/20">
                AD
              </div>
              <ChevronDown size={14} className="text-text-muted group-hover:text-text-primary transition-colors" />
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
