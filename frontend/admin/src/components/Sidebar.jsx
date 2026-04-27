import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Building2, Users, UserCog, UserCheck,
  BarChart3, Bell, Globe, Tags, ClipboardList, Map, Settings, LogOut
} from 'lucide-react';
import './Sidebar.css';

const menuGroups = [
  {
    title: "Core",
    items: [
      { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
      { name: 'Hostels', path: '/hostels', icon: <Building2 size={20} /> },
    ]
  },
  {
    title: "User Management",
    items: [
      { name: 'Owners', path: '/owners', icon: <UserCog size={20} /> },
      { name: 'Tenants', path: '/tenants', icon: <Users size={20} /> },
      { name: 'Staff', path: '/staff', icon: <UserCheck size={20} /> },
      { name: 'KYC Verification', path: '/users', icon: <ClipboardList size={20} /> },
    ]
  },
  {
    title: "Operations",
    items: [
      { name: 'Analytics', path: '/analytics', icon: <BarChart3 size={20} /> },
      { name: 'Notifications', path: '/notifications', icon: <Bell size={20} /> },
      { name: 'CMS', path: '/cms', icon: <Globe size={20} /> },
      { name: 'Offers & Promo', path: '/offers', icon: <Tags size={20} /> },
      { name: 'Surveys', path: '/surveys', icon: <ClipboardList size={20} /> },
      { name: 'Cities', path: '/cities', icon: <Map size={20} /> },
    ]
  },
  {
    title: "System",
    items: [
      { name: 'Settings', path: '/settings', icon: <Settings size={20} /> },
    ]
  }
];

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2 className="logo">LEVORA</h2>
        <span className="logo-sub">GLOBAL COMMAND</span>
      </div>

      <nav className="sidebar-nav">
        {menuGroups.map((group, idx) => (
          <div key={idx} className="nav-group">
            <span className="group-title">{group.title}</span>
            {group.items.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
              >
                <span className="icon">{item.icon}</span>
                <span className="label">{item.name}</span>
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="logout-btn">
          <LogOut size={20} />
          <span className="label">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
