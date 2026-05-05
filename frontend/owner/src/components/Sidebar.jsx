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
  User,
  RefreshCw
} from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
  const { buildingId: urlBuildingId } = useParams();
  const iconProps = { size: 22, strokeWidth: 2.5 };

  // Restore context from localStorage if URL doesn't have it (e.g. on Profile page)
  const activeBuildingId = urlBuildingId || localStorage.getItem('selectedBuildingId');

  const menuItems = [
    { name: 'Dashboard', path: `/owner/building/${activeBuildingId}/dashboard`, icon: <LayoutDashboard {...iconProps} /> },
    { name: 'Buildings', path: `/owner/building/${activeBuildingId}/buildings`, icon: <Building2 {...iconProps} /> },
    { name: 'Rooms & Beds', path: `/owner/building/${activeBuildingId}/rooms`, icon: <BedDouble {...iconProps} /> },
    { name: 'Tenants', path: `/owner/building/${activeBuildingId}/tenants`, icon: <UsersRound {...iconProps} /> },
    { name: 'Payments', path: `/owner/building/${activeBuildingId}/payments`, icon: <Banknote {...iconProps} /> },
    { name: 'Staff', path: `/owner/building/${activeBuildingId}/staff`, icon: <Briefcase {...iconProps} /> },
    { name: 'Mess Menu', path: `/owner/building/${activeBuildingId}/mess`, icon: <UtensilsCrossed {...iconProps} /> },
    { name: 'Complaints', path: `/owner/building/${activeBuildingId}/complaints`, icon: <MessageSquareWarning {...iconProps} /> },
    { name: 'Transfers', path: `/owner/building/${activeBuildingId}/transfers`, icon: <RefreshCw {...iconProps} /> },
    { name: 'Inventory', path: `/owner/building/${activeBuildingId}/inventory`, icon: <PackageOpen {...iconProps} /> },
    { name: 'Reports', path: `/owner/building/${activeBuildingId}/reports`, icon: <BarChart3 {...iconProps} /> },
    { name: 'Settings', path: `/owner/building/${activeBuildingId}/settings`, icon: <Settings {...iconProps} /> },
    { name: 'Notifications', path: `/owner/building/${activeBuildingId}/notifications`, icon: <BellRing {...iconProps} /> },
    { name: 'Profile', path: `/owner/building/${activeBuildingId}/profile`, icon: <User {...iconProps} /> },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header" style={{ paddingBottom: '1rem' }}>
        <h2 className="logo">StayNest</h2>
      </div>
      <div style={{ padding: '0 1.5rem', marginBottom: '1.5rem' }}>
        <Link to="/owner/portfolio" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '600' }}>
          &larr; Back to Portfolio
        </Link>
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
