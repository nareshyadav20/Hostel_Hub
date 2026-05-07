import React from 'react';
import { NavLink, useParams, Link } from 'react-router-dom';
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
  BellRing,
  RefreshCw
} from 'lucide-react';
import './Sidebar.css';

const Sidebar = ({ isOpen, onClose }) => {
  const { buildingId } = useParams();
  const iconProps = { size: 22, strokeWidth: 2.5 };

  const menuItems = [
    { name: 'Dashboard', path: `/owner/building/${buildingId}/dashboard`, icon: <LayoutDashboard {...iconProps} /> },
    { name: 'Buildings', path: `/owner/building/${buildingId}/buildings`, icon: <Building2 {...iconProps} /> },
    { name: 'Rooms & Beds', path: `/owner/building/${buildingId}/rooms`, icon: <BedDouble {...iconProps} /> },
    { name: 'Tenants', path: `/owner/building/${buildingId}/tenants`, icon: <UsersRound {...iconProps} /> },
    { name: 'Payments', path: `/owner/building/${buildingId}/payments`, icon: <Banknote {...iconProps} /> },
    { name: 'Staff', path: `/owner/building/${buildingId}/staff`, icon: <Briefcase {...iconProps} /> },
    { name: 'Mess Menu', path: `/owner/building/${buildingId}/mess`, icon: <UtensilsCrossed {...iconProps} /> },
    { name: 'Complaints', path: `/owner/building/${buildingId}/complaints`, icon: <MessageSquareWarning {...iconProps} /> },
    { name: 'Transfers', path: `/owner/building/${buildingId}/transfers`, icon: <RefreshCw {...iconProps} /> },
    { name: 'Inventory', path: `/owner/building/${buildingId}/inventory`, icon: <PackageOpen {...iconProps} /> },
    { name: 'Reports', path: `/owner/building/${buildingId}/reports`, icon: <BarChart3 {...iconProps} /> },
    { name: 'Settings', path: `/owner/building/${buildingId}/settings`, icon: <Settings {...iconProps} /> },
    { name: 'Notifications', path: `/owner/building/${buildingId}/notifications`, icon: <BellRing {...iconProps} /> },
  ];

  const handleLinkClick = () => {
    if (window.innerWidth <= 1024) {
      onClose();
    }
  };

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <h2 className="logo">StayNest</h2>
        <button className="sidebar-close-btn" onClick={onClose}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      <div className="portfolio-back-link">
        <Link to="/owner/portfolio" onClick={handleLinkClick}>
          &larr; Back to Portfolio
        </Link>
      </div>
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <NavLink 
            key={item.name} 
            to={item.path} 
            className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
            onClick={handleLinkClick}
          >
            <span className="icon">{item.icon}</span>
            <span className="label">{item.name}</span>
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-footer">
        <div className="version-tag">Owner Portal v1.0</div>
      </div>
    </aside>
  );
};

export default Sidebar;
