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
  const iconProps = { size: 24, strokeWidth: 2.25 };

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
    { name: 'Assets', path: `/owner/building/${activeBuildingId}/assets`, icon: <PackageOpen {...iconProps} /> },
    { name: 'Community Hub', path: `/owner/building/${activeBuildingId}/community`, icon: <UsersRound {...iconProps} /> },
    { name: 'Reports', path: `/owner/building/${activeBuildingId}/reports`, icon: <BarChart3 {...iconProps} /> },
    { name: 'Notifications', path: `/owner/building/${activeBuildingId}/notifications`, icon: <BellRing {...iconProps} /> },
    { name: 'Settings', path: `/owner/building/${activeBuildingId}/settings`, icon: <Settings {...iconProps} /> },
    { name: 'Profile', path: `/owner/building/${activeBuildingId}/profile`, icon: <User {...iconProps} /> },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <Link to={`/owner/building/${activeBuildingId}/dashboard`} className="brand-logo" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <svg className="sidebar-logo-svg" width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L3 9V20C3 20.5304 3.21071 21.0391 3.58579 21.4142C3.96086 21.7893 4.46957 22 5 22H19C19.5304 22 20.0391 21.7893 20.4142 21.4142C20.7893 21.0391 21 20.5304 21 20V9L12 2Z" fill="url(#sidebar_logo_gradient)" stroke="var(--primary-green)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M9 22V12H15V22" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <defs>
              <linearGradient id="sidebar_logo_gradient" x1="3" y1="2" x2="21" y2="22" gradientUnits="userSpaceOnUse">
                <stop stopColor="var(--primary-green)" />
                <stop offset="1" stopColor="#059669" />
              </linearGradient>
            </defs>
          </svg>
          <div className="logo-text" style={{ display: 'flex', flexDirection: 'column' }}>
            <span className="logo-main" style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.1 }}>Livora</span>
            <span className="logo-sub" style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--primary-green)', letterSpacing: '0.05em' }}>OWNER PORTAL</span>
          </div>
        </Link>
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

    </aside>
  );
};

export default Sidebar;
