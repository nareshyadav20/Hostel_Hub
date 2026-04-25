import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import ThemeToggle from './ThemeToggle';
import { Bell, User, ArrowLeft } from 'lucide-react';
import './Layout.css';

const Layout = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isDashboard = location.pathname === '/dashboard' || location.pathname === '/';

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    setIsSearching(val.length > 0);
  };

  return (
    <div className="layout">
      <Sidebar />
      <main className="main-content">
        <header className="topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            {!isDashboard && (
              <button 
                className="back-btn-top" 
                onClick={() => navigate('/dashboard')}
                title="Back to Command Center"
              >
                <ArrowLeft size={18} />
              </button>
            )}
            <div className="search-bar" style={{ width: '450px', position: 'relative' }}>
              <svg width="16" height="16" fill="none" stroke="var(--accent-primary)" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              <input 
                type="text" 
                placeholder="Search properties, owners, regions..." 
                value={searchQuery}
                onChange={handleSearchChange}
                onBlur={() => setTimeout(() => setIsSearching(false), 200)}
              />
              {isSearching && (
                <div className="search-results-overlay" style={{ top: '120%' }}>
                  <div className="search-result-item" onClick={() => navigate('/hostels')}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(251,191,36,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <svg width="14" height="14" fill="none" stroke="var(--accent-primary)" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 21h18M3 7v1a3 3 0 0 0 6 0V7m0 1a3 3 0 0 0 6 0V7m0 1a3 3 0 0 0 6 0V7M4 21V4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v17"/></svg>
                    </div>
                    <div className="leader-info">
                      <span className="leader-name" style={{ fontSize: '0.9rem' }}>Sapphire Men's PG</span>
                      <span className="leader-sub">Koramangala, Bangalore</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="topbar-right">
            <ThemeToggle />

            <button className="topbar-btn" title="Notifications">
              <Bell size={18} />
              <span className="notif-dot"></span>
            </button>

            <div className="admin-avatar" title="Admin">
              <User size={16} />
            </div>
          </div>
        </header>

        <div className="content-body animate-fade">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
