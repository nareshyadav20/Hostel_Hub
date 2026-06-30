import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Home, Building2, Users, UserCheck, CreditCard, 
  Settings, LogOut, ShieldCheck, BarChart3, 
  Megaphone, ShieldAlert, Calendar, Zap, User, UsersRound, CheckCircle
} from 'lucide-react';

const Sidebar = ({ collapsed, setCollapsed }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const sections = [
    {
      title: 'General',
      items: [
        { name: 'Dashboard', path: '/dashboard', icon: <Home size={20} strokeWidth={2} /> },
        { name: 'Approvals', path: '/approvals', icon: <CheckCircle size={20} strokeWidth={2} /> },
        { name: 'Hostels', path: '/hostels', icon: <Building2 size={20} strokeWidth={2} /> },
        { name: 'Owners', path: '/owners', icon: <UserCheck size={20} strokeWidth={2} /> },
        { name: 'Tenants', path: '/tenants', icon: <Users size={20} strokeWidth={2} /> },
        { name: 'Staff', path: '/staff', icon: <UsersRound size={20} strokeWidth={2} /> },
        { name: 'Bookings', path: '/bookings', icon: <Calendar size={20} strokeWidth={2} /> },
      ]
    },
    {
      title: 'Platform',
      items: [
        { name: 'Analytics', path: '/analytics', icon: <BarChart3 size={20} strokeWidth={2} /> },
        { name: 'Issues', path: '/issues', icon: <ShieldAlert size={20} strokeWidth={2} /> },
        { name: 'Finance', path: '/finance', icon: <CreditCard size={20} strokeWidth={2} /> },
      ]
    },
    {
      title: 'System',
      items: [
        { name: 'Insights', path: '/insights', icon: <Zap size={20} strokeWidth={2} /> },
        { name: 'Support', path: '/support', icon: <ShieldCheck size={20} strokeWidth={2} /> },
        { name: 'Settings', path: '/settings', icon: <Settings size={20} strokeWidth={2} /> },
        { name: 'Profile', path: '/profile', icon: <User size={20} strokeWidth={2} /> },
      ]
    }
  ];

  return (
    <aside className={`fixed top-0 left-0 h-screen bg-surface transition-all duration-300 ease-in-out z-50 flex flex-col border-r border-divider shadow-soft ${collapsed ? '-translate-x-full md:translate-x-0 w-20' : 'translate-x-0 w-64'}`}>
      
      {/* BRANDING */}
      <div className="h-16 flex items-center px-6 border-b border-divider bg-surface">
        <div className="flex items-center gap-3">
          <svg className="w-8 h-8 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L3 9V20C3 20.5304 3.21071 21.0391 3.58579 21.4142C3.96086 21.7893 4.46957 22 5 22H19C19.5304 22 20.0391 21.7893 20.4142 21.4142C20.7893 21.0391 21 20.5304 21 20V9L12 2Z" fill="url(#logo_gradient)" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M9 22V12H15V22" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <defs>
              <linearGradient id="logo_gradient" x1="3" y1="2" x2="21" y2="22" gradientUnits="userSpaceOnUse">
                <stop stopColor="#16a34a" />
                <stop offset="1" stopColor="#10b981" />
              </linearGradient>
            </defs>
          </svg>
          {!collapsed && (
            <span className="text-xl font-bold tracking-tight text-text-main">
              Livora
            </span>
          )}
        </div>
      </div>

      {/* NAVIGATION */}
      <div className="flex-1 overflow-y-auto py-6 space-y-1.5 scrollbar-hide bg-surface">
        {sections.flatMap(section => section.items).map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            onClick={() => {
              if (window.innerWidth <= 768 && setCollapsed) {
                setCollapsed(true);
              }
            }}
            className={({ isActive }) =>
              `flex items-center gap-3.5 py-3 px-4 mx-3 rounded-xl transition-all duration-200 group ${isActive
                ? 'font-bold text-primary bg-primary/10'
                : 'font-bold text-text-muted hover:text-text-main hover:bg-background'
              } ${collapsed ? 'justify-center px-0 mx-1' : ''}`
            }
          >
            {({ isActive }) => (
              <>
                <div className={`shrink-0 transition-all duration-200 ${isActive ? 'scale-105 text-primary' : 'text-text-muted group-hover:scale-105 group-hover:text-text-main'}`}>
                  {item.icon}
                </div>
                {!collapsed && (
                  <span className="text-[14px] tracking-wide leading-none">{item.name}</span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>

      {/* FOOTER */}
      <div className="p-4 border-t border-divider bg-surface">
        <button 
          onClick={handleLogout}
          className={`w-full flex items-center gap-3.5 px-4 py-2.5 text-text-muted hover:text-danger hover:bg-red-500/10 rounded-xl transition-all group font-bold ${collapsed ? 'justify-center px-0' : ''}`}
        >
          <LogOut size={20} strokeWidth={2} className="group-hover:translate-x-0.5 transition-transform" />
          {!collapsed && <span className="text-[14px]">Sign Out</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

