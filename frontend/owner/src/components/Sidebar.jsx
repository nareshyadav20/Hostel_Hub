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

const Sidebar = () => {
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
