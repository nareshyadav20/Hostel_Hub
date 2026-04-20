import React from 'react';
import Sidebar from './Sidebar';
import ThemeToggle from './ThemeToggle';
import ProfileDropdown from './ProfileDropdown';
import './Layout.css';

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <Sidebar />
      <main className="main-content">
        <header className="content-header">
          <div className="search-bar"><span>🔍</span><input type="text" placeholder="Search hostels, owners..." /></div>
          <div className="user-profile">
            <ThemeToggle />
            <div className="notifications" style={{ color: 'var(--text-secondary)', cursor: 'pointer' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
            </div>
            <ProfileDropdown />
          </div>
        </header>
        <div className="content-body">{children}</div>
      </main>
    </div>
  );
};
export default Layout;
