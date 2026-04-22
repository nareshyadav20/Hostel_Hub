import React from 'react';
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
    </div>
  );
};

export default Layout;
