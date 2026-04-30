import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import './Layout.css';

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn] = useState(localStorage.getItem('tenantToken') ? true : true); // Mocked for UI testing

  return (
    <div className="layout-root">
      {isLoggedIn && <Sidebar />}
      
      <div className={isLoggedIn ? "layout-main" : "layout-main guest"}>
        {isLoggedIn && (
          <header className="layout-header">
            <div className="header-left">
               <button className="menu-toggle">☰</button>
               <div className="search-bar-box">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                  <input type="text" placeholder="Search anything..." />
               </div>
            </div>
            
            <div className="header-right">
               <div className="header-icon-btn">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                  <span className="notif-badge">2</span>
               </div>
               
               <div className="profile-mini-box">
                  <div className="profile-text">
                     <span className="p-name">Uma</span>
                     <span className="p-role">Tenant</span>
                  </div>
                  <div className="profile-avatar">
                     <img src="https://ui-avatars.com/api/?name=Uma&background=10b981&color=fff" alt="Profile" />
                  </div>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"></polyline></svg>
               </div>
            </div>
          </header>
        )}
        
        <main className="page-content">
          <Outlet />
        </main>
      </div>

      {/* Floating Bottom Tip */}
      {isLoggedIn && location.pathname === '/dashboard' && (
        <div className="bottom-tip-bar fade-in">
           <div className="tip-content">
              <span className="tip-icon">💡</span>
              <p><strong>Tip:</strong> You can pre-book your meals to avoid rush and food wastage.</p>
           </div>
           <div className="tip-actions">
              <button className="btn-tip">Book Now</button>
              <button className="btn-tip-close">✕</button>
           </div>
        </div>
      )}
    </div>
  );
};

export default Layout;
