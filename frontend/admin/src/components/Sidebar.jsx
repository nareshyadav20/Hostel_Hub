import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, Building2, Users, UserCog, UserCheck, 
  BarChart3, Bell, Globe, Tags, ClipboardList, Map, Settings, LogOut, ArrowLeft, ShieldCheck 
} from 'lucide-react';
import './Sidebar.css';

const navGroups = [
  {
    title: 'MANAGEMENT',
    items: [
      { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={18} /> },
      { name: 'Hostels', path: '/hostels', icon: <Building2 size={18} /> },
      { name: 'Owners', path: '/owners', icon: <UserCog size={18} /> },
      { name: 'Tenants', path: '/tenants', icon: <Users size={18} /> },
      { name: 'Staff', path: '/staff', icon: <UserCheck size={18} /> },
      { name: 'KYC & Audit', path: '/users', icon: <ShieldCheck size={18} /> },
    ]
  },
  {
    title: 'OPERATIONS',
    items: [
      { name: 'Analytics', path: '/analytics', icon: <BarChart3 size={18} /> },
      { name: 'Notifications', path: '/notifications', icon: <Bell size={18} /> },
      { name: 'CMS & Content', path: '/cms', icon: <Globe size={18} /> },
      { name: 'Offers & Promo', path: '/offers', icon: <Tags size={18} /> },
    ]
  },
  {
    title: 'SYSTEM',
    items: [
      { name: 'Cities', path: '/cities', icon: <Map size={18} /> },
      { name: 'Settings', path: '/settings', icon: <Settings size={18} /> },
    ]
  }
];

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2 className="logo">
          <ShieldCheck size={24} color="var(--accent-primary)" />
          LEVORA
        </h2>
      </div>

      <nav className="sidebar-nav">
        {navGroups.map((group) => (
          <div key={group.title} className="nav-group">
            <h3 className="group-title">{group.title}</h3>
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
