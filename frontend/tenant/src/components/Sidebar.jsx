import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: '🏠' },
    { name: 'Payments', path: '/payments', icon: '📄' },
    { name: 'My Room', path: '/room', icon: '🛏️' },
    { name: 'Complaints', path: '/complaints', icon: '💬' },
    { name: 'Notices', path: '/notices', icon: '📢' },
    { name: 'Mess & Food', path: '/mess', icon: '🍽️' },
    { name: 'Visitors', path: '/visitors', icon: '👤' },
    { name: 'Amenities', path: '/amenities', icon: '🏢' },
    { name: 'Support', path: '/support', icon: '🎧' },
    { name: 'Rewards', path: '/rewards', icon: '🎁' },
    { name: 'Settings', path: '/settings', icon: '⚙️' },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="staynest-logo">
           <span className="logo-icon">🏠</span>
           <span className="logo-text">StayNest</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <NavLink 
            key={item.name} 
            to={item.path} 
            className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
          >
            <span className="icon">{item.icon}</span>
            <span className="label">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="emergency-box">
         <div className="emergency-header">
            <strong>Emergency Contact</strong>
            <span className="e-sub">24/7 Assistance</span>
         </div>
         <div className="e-number">📞 +91 98765 43210</div>
      </div>

      <div className="sidebar-footer">
         <span className="copy">© 2024 StayNest</span>
         <span className="all-rights">All rights reserved.</span>
      </div>
    </aside>
  );
};

export default Sidebar;
