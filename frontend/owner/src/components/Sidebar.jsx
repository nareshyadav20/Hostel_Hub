import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Building2, 
  BedDouble, 
  UsersRound, 
  Banknote, 
  Briefcase, 
  UtensilsCrossed, 
  MessageSquareWarning, 
  PackageOpen, 
  BarChart3, 
  Settings, 
  BellRing 
} from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
  const iconProps = { size: 22, strokeWidth: 2.5 };

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard {...iconProps} /> },
    { name: 'Buildings', path: '/buildings', icon: <Building2 {...iconProps} /> },
    { name: 'Rooms & Beds', path: '/rooms', icon: <BedDouble {...iconProps} /> },
    { name: 'Tenants', path: '/tenants', icon: <UsersRound {...iconProps} /> },
    { name: 'Payments', path: '/payments', icon: <Banknote {...iconProps} /> },
    { name: 'Staff', path: '/staff', icon: <Briefcase {...iconProps} /> },
    { name: 'Mess Menu', path: '/mess', icon: <UtensilsCrossed {...iconProps} /> },
    { name: 'Complaints', path: '/complaints', icon: <MessageSquareWarning {...iconProps} /> },
    { name: 'Inventory', path: '/inventory', icon: <PackageOpen {...iconProps} /> },
    { name: 'Reports', path: '/reports', icon: <BarChart3 {...iconProps} /> },
    { name: 'Settings', path: '/settings', icon: <Settings {...iconProps} /> },
    { name: 'Notifications', path: '/notifications', icon: <BellRing {...iconProps} /> },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2 className="logo">StayNest</h2>
      </div>
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <NavLink 
            key={item.name} 
            to={item.path} 
            className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
          >
            <span className="icon">{item.icon}</span>
            <span className="label">{item.name}</span>
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-footer">
        <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textAlign: 'center' }}>
          Owner Portal v1.0
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
