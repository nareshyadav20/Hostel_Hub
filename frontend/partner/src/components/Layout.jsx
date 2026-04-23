import React from 'react';
<<<<<<< HEAD
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import ThemeToggle from './ThemeToggle';
import { Bell } from 'lucide-react';
import './Layout.css';

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const partner = JSON.parse(localStorage.getItem('partner') || '{"name": "Partner"}');

  return (
    <div className="layout">
      <Sidebar />
      <main className="main-content">
        <header className="content-header" id="partner-header">
          <div className="header-left">
            <span className="header-greeting">
              Welcome back, <strong>{partner.name}</strong>
            </span>
          </div>
          <div className="header-actions">
            <ThemeToggle />
            <button className="header-icon-btn" title="Notifications" id="notifications-btn">
              <Bell size={20} />
              <span className="notification-dot"></span>
            </button>
            <div 
              className="header-avatar" 
              onClick={() => navigate('/profile')}
              title="Profile"
              id="header-profile-btn"
            >
              {partner.name?.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>
        <div className="content-body">{children}</div>
      </main>
=======
import Sidebar from './Sidebar';
import './Layout.css';

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <header className="topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontWeight: '600' }}>Partner User</span>
            <div style={{ width: '35px', height: '35px', borderRadius: '50%', backgroundColor: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold' }}>
              P
            </div>
          </div>
        </header>
        <main className="page-content">
          {children}
        </main>
      </div>
>>>>>>> staff
    </div>
  );
};

export default Layout;
