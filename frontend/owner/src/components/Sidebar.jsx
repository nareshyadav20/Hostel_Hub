import React, { useState } from 'react';
import { NavLink, useParams, Link, useLocation } from 'react-router-dom';
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
  User
} from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
  const { buildingId: urlBuildingId } = useParams();
  const iconProps = { size: 20, strokeWidth: 2 };

  const activeBuildingId = urlBuildingId || localStorage.getItem('selectedBuildingId');

  const menuItems = [
    { name: 'Dashboard', path: `/owner/building/${activeBuildingId}/dashboard`, icon: <LayoutDashboard {...iconProps} /> },
    { name: 'Buildings', path: `/owner/building/${activeBuildingId}/buildings`, icon: <Building2 {...iconProps} /> },
    { name: 'Rooms & Beds', path: `/owner/building/${activeBuildingId}/rooms`, icon: <BedDouble {...iconProps} /> },
    { name: 'Tenants', path: `/owner/building/${activeBuildingId}/tenants`, icon: <UsersRound {...iconProps} /> },
    { name: 'Payments', path: `/owner/building/${activeBuildingId}/payments`, icon: <Banknote {...iconProps} /> },
    { name: 'Staff', path: `/owner/building/${activeBuildingId}/staff`, icon: <Briefcase {...iconProps} /> },
    { name: 'Inventory', path: `/owner/building/${activeBuildingId}/inventory`, icon: <PackageOpen {...iconProps} /> },
    { name: 'Mess Menu', path: `/owner/building/${activeBuildingId}/mess`, icon: <UtensilsCrossed {...iconProps} /> },
    { name: 'Complaints', path: `/owner/building/${activeBuildingId}/complaints`, icon: <MessageSquareWarning {...iconProps} /> },
    { name: 'Community Hub', path: `/owner/building/${activeBuildingId}/community`, icon: <UsersRound {...iconProps} /> },
    { name: 'Reports', path: `/owner/building/${activeBuildingId}/reports`, icon: <BarChart3 {...iconProps} /> },
    { name: 'Notifications', path: `/owner/building/${activeBuildingId}/notifications`, icon: <BellRing {...iconProps} /> },
    { name: 'Settings', path: `/owner/building/${activeBuildingId}/settings`, icon: <Settings {...iconProps} /> },
    { name: 'Profile', path: `/owner/building/${activeBuildingId}/profile`, icon: <User {...iconProps} /> },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="brand-logo">
          <div className="logo-icon">H</div>
          <div className="logo-text">
            <span className="logo-main">HostelHub</span>
            <span className="logo-sub">OWNER PORTAL</span>
          </div>
        </div>
      </div>

      <div className="sidebar-nav">
        <div className="nav-section-label">MANAGEMENT</div>
        {menuItems.map((item) => (
          <div key={item.name} className="menu-group">
            <NavLink
              to={item.path}
              className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
            >
              <span className="icon">{item.icon}</span>
              <span className="label">{item.name}</span>
            </NavLink>
          </div>
        ))}
      </div>

      <div className="sidebar-footer">
        <div className="user-pill">
          <div className="user-avatar">S</div>
          <div className="user-info">
            <div className="user-name">Shiva</div>
            <div className="user-role">OWNER</div>
          </div>
          <Link to="/logout" className="logout-icon"><User size={16} /></Link>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
