import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = ({ isOpen, onClose }) => {
  const menuItems = [
    {
      name: 'Home', path: '/dashboard',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 9.5L12 3L21 9.5V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V9.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M9 21V12H15V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      name: 'Search Hostels', path: '/search',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
          <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
          <path d="M11 7V11L13 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      )
    },
    {
      name: 'My Wishlist', path: '/wishlist',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 21L10.55 19.705C5.4 15.03 2 11.95 2 8.165C2 5.075 4.42 2.655 7.5 2.655C9.24 2.655 10.91 3.465 12 4.735C13.09 3.465 14.76 2.655 17.5 2.655C20.58 2.655 23 5.075 23 8.165C23 11.95 19.6 15.03 14.45 19.71L12 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      name: 'My Booking', path: '/booking',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="3" y="4" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="2"/>
          <path d="M16 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <path d="M8 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <path d="M3 10H21" stroke="currentColor" strokeWidth="2"/>
          <circle cx="8" cy="14" r="1.5" fill="currentColor"/>
          <circle cx="12" cy="14" r="1.5" fill="currentColor"/>
          <circle cx="16" cy="14" r="1.5" fill="currentColor"/>
        </svg>
      )
    },
    {
      name: 'Payments', path: '/payments',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="2" y="5" width="20" height="14" rx="3" stroke="currentColor" strokeWidth="2"/>
          <path d="M2 10H22" stroke="currentColor" strokeWidth="2"/>
          <rect x="6" y="14" width="4" height="2" rx="0.5" fill="currentColor"/>
        </svg>
      )
    },
    {
      name: 'Mess & Menu', path: '/mess',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 8H19C20.6569 8 22 9.34315 22 11C22 12.6569 20.6569 14 19 14H18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <path d="M2 8H18V17C18 19.2091 16.2091 21 14 21H6C3.79086 21 2 19.2091 2 17V8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M6 2V5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <path d="M10 2V5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <path d="M14 2V5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      )
    },
    {
      name: 'Rewards', path: '/rewards',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="8" r="6" stroke="currentColor" strokeWidth="2"/>
          <path d="M15.4771 12.8851L17.5 21L12 18L6.5 21L8.52288 12.8851" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="12" cy="8" r="2" fill="currentColor"/>
        </svg>
      )
    },
    {
      name: 'Complaints', path: '/complaints',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 9V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <path d="M12 17H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <path d="M10.29 3.86L1.82 18C1.445 18.63 1.9 19.43 2.62 19.43H21.38C22.1 19.43 22.555 18.63 22.18 18L13.71 3.86C13.33 3.22 12.67 3.22 12.29 3.86Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      name: 'Room Transfer', path: '/transfers',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7 16L3 12L7 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M3 12H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M17 8L21 12L17 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M21 12H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      name: 'Services', path: '/services',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
        </svg>
      )
    },
    {
      name: 'Community', path: '/community',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      )
    },
    {
      name: 'Safety & SOS', path: '/safety',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
        </svg>
      )
    },
    {
      name: 'Discounts', path: '/discounts',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20.59 13.41L13.41 20.59C12.63 21.37 11.37 21.37 10.59 20.59L2 12V2H12L20.59 10.59C21.37 11.37 21.37 12.63 20.59 13.41Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="7.5" cy="7.5" r="1.5" fill="currentColor"/>
        </svg>
      )
    },
    {
      name: 'My Profile', path: '/profile',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      )
    },
  ];

  // Helper to handle link clicks
  const handleLinkClick = () => {
    if (window.innerWidth <= 768) {
      onClose();
    }
  };

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-logo-container">
          <svg className="sidebar-logo-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L3 9V20C3 20.5304 3.21071 21.0391 3.58579 21.4142C3.96086 21.7893 4.46957 22 5 22H19C19.5304 22 20.0391 21.7893 20.4142 21.4142C20.7893 21.0391 21 20.5304 21 20V9L12 2Z" fill="url(#sidebar_logo_gradient)" stroke="var(--accent-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M9 22V12H15V22" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <defs>
              <linearGradient id="sidebar_logo_gradient" x1="3" y1="2" x2="21" y2="22" gradientUnits="userSpaceOnUse">
                <stop stopColor="var(--accent-primary)" />
                <stop offset="1" stopColor="var(--accent-secondary)" />
              </linearGradient>
            </defs>
          </svg>
          <h2 className="logo-text">Livora</h2>
        </div>
        <button className="sidebar-close-btn" onClick={onClose}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <NavLink 
            key={item.name} 
            to={item.path} 
            className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
            onClick={handleLinkClick}
          >
            <span className="icon">{item.icon}</span>
            <span className="label">{item.name}</span>
          </NavLink>
        ))}
      </nav>

    </aside>
  );
};

export default Sidebar;
