import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = ({ isOpen, onClose }) => {
  const menuItems = [
    {
      name: 'Home', path: '/dashboard',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 10.4V20C4 20.5523 4.44772 21 5 21H9V15C9 14.4477 9.44772 14 10 14H14C14.5523 14 15 14.4477 15 15V21H19C19.5523 21 20 20.5523 20 20V10.4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M2 12L12 3L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <rect x="10" y="14" width="4" height="7" rx="0.5" fill="currentColor" opacity="0.15"/>
        </svg>
      )
    },
    {
      name: 'Search Hostels', path: '/search',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="10.5" cy="10.5" r="7.5" stroke="currentColor" strokeWidth="2"/>
          <path d="M21 21L16.2 16.2" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
          <circle cx="10.5" cy="10.5" r="3" fill="currentColor" opacity="0.12"/>
        </svg>
      )
    },
    {
      name: 'My Wishlist', path: '/wishlist',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M19.5 13.572L12 21L4.5 13.572C3.5 12.5 3 11.16 3 9.78C3 6.6 5.69 4 9 4C10.36 4 11.62 4.52 12 5.5C12.38 4.52 13.64 4 15 4C18.31 4 21 6.6 21 9.78C21 11.16 20.5 12.5 19.5 13.572Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 8C12 8 10.5 6 9 6C7.34 6 6 7.34 6 9C6 9.8 6.3 10.5 6.8 11L12 16" fill="currentColor" opacity="0.1"/>
        </svg>
      )
    },
    {
      name: 'My Booking', path: '/booking',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="3" y="5" width="18" height="17" rx="2.5" stroke="currentColor" strokeWidth="2"/>
          <path d="M8 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <path d="M16 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <path d="M3 10H21" stroke="currentColor" strokeWidth="2"/>
          <path d="M9 15L11 17L15 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      name: 'Payments', path: '/payments',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="2" y="5" width="20" height="14" rx="2.5" stroke="currentColor" strokeWidth="2"/>
          <path d="M2 10H22" stroke="currentColor" strokeWidth="2"/>
          <circle cx="17" cy="15" r="1.5" fill="currentColor"/>
          <circle cx="13.5" cy="15" r="1.5" fill="currentColor" opacity="0.4"/>
        </svg>
      )
    },
    {
      name: 'Mess & Menu', path: '/mess',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 7C3 7 3 3 7 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <path d="M10 3V7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <path d="M17 3V7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <path d="M2 9H20V17C20 19.2091 18.2091 21 16 21H6C3.79086 21 2 19.2091 2 17V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M20 10H21C21.5523 10 22 10.4477 22 11V12C22 13.1046 21.1046 14 20 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <path d="M6 14H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.3"/>
        </svg>
      )
    },
    {
      name: 'Rewards', path: '/rewards',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L14.4 8.2L21 9L16.2 13.4L17.6 20L12 16.8L6.4 20L7.8 13.4L3 9L9.6 8.2L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 6L13.2 9.1L16.5 9.5L14.1 11.7L14.8 15L12 13.4L9.2 15L9.9 11.7L7.5 9.5L10.8 9.1L12 6Z" fill="currentColor" opacity="0.12"/>
        </svg>
      )
    },
    {
      name: 'Complaints', path: '/complaints',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 8V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <circle cx="12" cy="14" r="0.5" fill="currentColor" stroke="currentColor" strokeWidth="1"/>
        </svg>
      )
    },
    {
      name: 'Room Transfer', path: '/transfers',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 3H5C3.89543 3 3 3.89543 3 5V8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <path d="M16 3H19C20.1046 3 21 3.89543 21 5V8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <path d="M8 21H5C3.89543 21 3 20.1046 3 19V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <path d="M16 21H19C20.1046 21 21 20.1046 21 19V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <path d="M15 9L9 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <path d="M15 9V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M15 9H11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      name: 'Services', path: '/services',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
          <path d="M12 1V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <path d="M12 20V23" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <path d="M4.22 4.22L6.34 6.34" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <path d="M17.66 17.66L19.78 19.78" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <path d="M1 12H4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <path d="M20 12H23" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <path d="M4.22 19.78L6.34 17.66" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <path d="M17.66 6.34L19.78 4.22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      )
    },
    {
      name: 'Community', path: '/community',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="9" cy="7" r="3.5" stroke="currentColor" strokeWidth="2"/>
          <path d="M2 20C2 16.6863 4.68629 14 8 14H10C13.3137 14 16 16.6863 16 20V21H2V20Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="17.5" cy="8.5" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M19 14.5C20.7 15.1 22 16.8 22 18.8V20H18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      )
    },
    {
      name: 'Safety & SOS', path: '/safety',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 22S20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      name: 'Discounts', path: '/discounts',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L14.5 4H19C19.5523 4 20 4.44772 20 5V9.5L22 12L20 14.5V19C20 19.5523 19.5523 20 19 20H14.5L12 22L9.5 20H5C4.44772 20 4 19.5523 4 19V14.5L2 12L4 9.5V5C4 4.44772 4.44772 4 5 4H9.5L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M8.5 15.5L15.5 8.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <circle cx="9.5" cy="9.5" r="1" fill="currentColor" stroke="currentColor" strokeWidth="0.5"/>
          <circle cx="14.5" cy="14.5" r="1" fill="currentColor" stroke="currentColor" strokeWidth="0.5"/>
        </svg>
      )
    },
    {
      name: 'Notifications', path: '/notifications',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 8A6 6 0 0 0 6 8C6 15 3 17 3 17H21S18 15 18 8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M13.73 21C13.37 21.64 12.74 22 12 22C11.26 22 10.63 21.64 10.27 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <circle cx="18" cy="4" r="3" fill="currentColor" opacity="0.25" stroke="currentColor" strokeWidth="1.5"/>
        </svg>
      )
    },
    {
      name: 'My Profile', path: '/profile',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="8" r="4.5" stroke="currentColor" strokeWidth="2"/>
          <path d="M4 20C4 16.6863 7.58172 14 12 14C16.4183 14 20 16.6863 20 20V21H4V20Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="12" cy="8" r="2" fill="currentColor" opacity="0.12"/>
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
        <Link to="/dashboard" className="sidebar-logo-container" onClick={handleLinkClick}>
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
        </Link>
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
