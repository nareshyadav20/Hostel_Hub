import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Scissors, Tag, ShoppingBag, User, LogOut } from 'lucide-react';
import { LayoutDashboard, Wrench, Tag, ClipboardList, User, LogOut } from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/services', label: 'Services', icon: Scissors },
    { path: '/offers', label: 'Offers & Discounts', icon: Tag },
    { path: '/orders', label: 'Order Requests', icon: ShoppingBag },
    { path: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="brand">
          <span style={{ color: 'var(--accent-primary)' }}>✦</span> PartnerHub
        </div>
      </div>
      
      <nav className="nav-links">
        {navItems.map((item) => (
          <NavLink 
            key={item.path} 
            to={item.path} 
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
  const partner = JSON.parse(localStorage.getItem('partner') || '{"name": "Partner", "serviceType": "Service Provider"}');

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={21} /> },
    { name: 'My Services', path: '/services', icon: <Wrench size={21} /> },
    { name: 'Offers & Discounts', path: '/offers', icon: <Tag size={21} /> },
    { name: 'Orders / Requests', path: '/orders', icon: <ClipboardList size={21} /> },
    { name: 'Profile', path: '/profile', icon: <User size={21} /> },
  ];

  const handleLogout = () => {
    localStorage.removeItem('partner_token');
    localStorage.removeItem('partner');
    navigate('/login');
  };

  return (
    <aside className="sidebar" id="partner-sidebar">
      <div className="sidebar-header">
        <div className="logo-container">
          <div className="logo-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h2 className="logo">StayNest</h2>
          <span className="sidebar-badge">Partner</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <NavLink 
            key={item.name} 
            to={item.path} 
            className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
            id={`nav-${item.path.replace('/', '')}`}
          >
            <span className="icon">{item.icon}</span>
            <span className="label">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="logout-btn" onClick={handleLogout}>
          <LogOut size={20} />
          <span>Logout</span>
        </button>
        <div className="sidebar-user" onClick={handleLogout} title="Logout">
          <div className="sidebar-user-avatar">
            {partner.name?.charAt(0).toUpperCase()}
          </div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">{partner.name}</div>
            <div className="sidebar-user-type">{partner.serviceType}</div>
          </div>
          <LogOut size={16} style={{ color: 'var(--text-muted)' }} />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
