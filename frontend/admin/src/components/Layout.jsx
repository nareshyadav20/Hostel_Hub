import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Bell, Search, Settings, Menu, ChevronDown, Sun, Moon, Globe, LogOut, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import CommandPalette from './CommandPalette';
import API from '../api/axios';

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const { isDark, toggle } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [collapsed, setCollapsed] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [profile, setProfile] = useState(null);

  const fetchProfile = async () => {
    try {
      const res = await API.get('/admin/profile');
      if (res.data) {
        setProfile(res.data);
      }
    } catch (err) {
      console.error('Layout failed to fetch admin profile:', err);
    }
  };

  React.useEffect(() => {
    fetchProfile();

    // Listen to custom profile update event from Profile.jsx
    window.addEventListener('user-profile-updated', fetchProfile);

    const down = (e) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsCommandOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    
    return () => {
      window.removeEventListener('user-profile-updated', fetchProfile);
      document.removeEventListener('keydown', down);
    };
  }, []);

  const pathSegments = location.pathname.split('/').filter(Boolean);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background flex font-inter text-text-main overflow-hidden">
      <Sidebar collapsed={collapsed} />

      <main className={`flex-1 flex flex-col transition-all duration-300 ease-in-out relative ${collapsed ? 'ml-20' : 'ml-64'}`}>

        {/* TOP NAVBAR */}
        <header className="h-16 px-8 bg-surface border-b border-divider flex items-center justify-between sticky top-0 z-40 shadow-sm">

          <div className="flex items-center gap-6">
            <button 
              onClick={() => setCollapsed(!collapsed)}
              className="p-2 hover:bg-gray-100 rounded-xl text-text-muted hover:text-primary transition-all active:scale-95"
            >
              <Menu size={20} />
            </button>
            <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-green-50 rounded-full border border-green-100">
              <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
              <span className="text-[10px] font-bold text-success uppercase tracking-wider">Platform Live</span>
            </div>
          </div>

          {/* BREADCRUMBS & COMMAND SEARCH */}
          <div className="flex-1 px-8 flex items-center justify-between">
            <div className="hidden lg:flex items-center gap-2 text-sm font-medium">
              <span className="text-text-muted hover:text-primary transition-colors cursor-pointer" onClick={() => navigate('/dashboard')}>Home</span>
              {pathSegments.map((segment, idx) => (
                <React.Fragment key={idx}>
                  <span className="text-text-muted">/</span>
                  <span className={`capitalize ${idx === pathSegments.length - 1 ? 'text-text-main font-bold' : 'text-text-muted hover:text-primary cursor-pointer'}`}>
                    {segment}
                  </span>
                </React.Fragment>
              ))}
            </div>

            <div className="flex-1 max-w-md ml-auto">
              <button 
                onClick={() => setIsCommandOpen(true)}
                className="w-full flex items-center justify-between bg-gray-50/50 hover:bg-gray-100 border border-divider rounded-xl py-2 pl-4 pr-3 text-sm text-text-muted transition-all group"
              >
                <div className="flex items-center gap-3">
                  <Search className="text-text-muted group-hover:text-primary transition-colors" size={16} />
                  <span>Search commands...</span>
                </div>
                <div className="flex items-center gap-1">
                  <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 bg-white border border-divider rounded text-[10px] font-bold text-text-muted shadow-sm">
                    <span className="text-xs">⌘</span>K
                  </kbd>
                </div>
              </button>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex items-center gap-4">
            <button 
              onClick={toggle}
              className="p-2.5 text-text-muted hover:text-primary hover:bg-gray-50 rounded-xl transition-all"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <button className="p-2.5 text-text-muted hover:text-primary hover:bg-gray-50 rounded-xl transition-all relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-danger rounded-full border-2 border-surface"></span>
            </button>

            <div className="h-6 w-px bg-border mx-2" />
            
            <div className="relative">
              <div 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-3 cursor-pointer group p-1 hover:bg-gray-50 rounded-xl transition-all"
              >
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-xs border border-primary/20 overflow-hidden">
                  {profile?.avatar ? (
                    <img src={profile.avatar} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    (profile?.name || 'Super Admin').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
                  )}
                </div>
                <div className="hidden lg:block">
                  <p className="text-xs font-bold text-text-main leading-none">{profile?.name || 'Super Admin'}</p>
                  <p className="text-[10px] text-text-muted mt-1 leading-none">Platform Root</p>
                </div>
                <ChevronDown size={14} className={`text-text-muted transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`} />
              </div>

              <AnimatePresence>
                {isProfileOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)} />
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute top-full right-0 mt-2 w-56 bg-surface border border-divider rounded-2xl shadow-premium z-50 overflow-hidden"
                    >
                      <div className="p-4 border-b border-divider bg-gray-50/50">
                        <p className="text-xs font-bold text-text-main">{profile?.email || 'admin@livora.io'}</p>
                        <p className="text-[10px] text-text-muted mt-1 font-medium italic">Root Access Level</p>
                      </div>
                      <div className="p-2">
                        <button 
                          onClick={() => { navigate('/profile'); setIsProfileOpen(false); }}
                          className="w-full flex items-center gap-3 px-3 py-2 text-xs font-semibold text-text-main hover:bg-gray-50 rounded-lg transition-all"
                        >
                          <User size={14} /> My Profile
                        </button>
                        <button 
                          onClick={() => { navigate('/settings'); setIsProfileOpen(false); }}
                          className="w-full flex items-center gap-3 px-3 py-2 text-xs font-semibold text-text-main hover:bg-gray-50 rounded-lg transition-all"
                        >
                          <Settings size={14} /> System Settings
                        </button>
                        <button className="w-full flex items-center gap-3 px-3 py-2 text-xs font-semibold text-text-main hover:bg-gray-50 rounded-lg transition-all">
                          <Globe size={14} /> Change Language
                        </button>
                        <button 
                          onClick={handleLogout}
                          className="w-full mt-1 flex items-center gap-3 px-3 py-2 text-xs font-bold text-danger hover:bg-red-50 rounded-lg transition-all"
                        >
                          <LogOut size={14} /> Sign Out
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* MAIN CONTENT AREA */}
        <div className="flex-1 p-8 overflow-y-auto bg-background scroll-smooth scrollbar-hide">
          <div className="max-w-7xl mx-auto animate-fade-in">
            {children}
          </div>
        </div>
      </main>

      {/* COMMAND PALETTE */}
      <CommandPalette isOpen={isCommandOpen} onClose={() => setIsCommandOpen(false)} />
    </div>
  );
};

export default Layout;
