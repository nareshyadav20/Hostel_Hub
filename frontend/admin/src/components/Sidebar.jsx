import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutGrid, Building2, Users, UserCheck, CreditCard, 
  Settings, LogOut, ShieldCheck, BarChart3, Package, 
  Megaphone, Share2, ShieldAlert, Calendar, Zap, User
} from 'lucide-react';
import { motion } from 'framer-motion';

const Sidebar = ({ collapsed }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const sections = [
    {
      title: 'General',
      items: [
        { name: 'Dashboard', path: '/dashboard', icon: <LayoutGrid size={18} /> },
        { name: 'Hostels', path: '/hostels', icon: <Building2 size={18} /> },
        { name: 'Owners', path: '/owners', icon: <UserCheck size={18} /> },
        { name: 'Tenants', path: '/tenants', icon: <Users size={18} /> },
        { name: 'Staff', path: '/staff', icon: <Users size={18} /> },
        { name: 'Bookings', path: '/bookings', icon: <Calendar size={18} /> },
      ]
    },
    {
      title: 'Platform',
      items: [
        { name: 'Analytics', path: '/analytics', icon: <BarChart3 size={18} /> },
        { name: 'CMS', path: '/cms', icon: <Megaphone size={18} /> },
        { name: 'Issues', path: '/issues', icon: <ShieldAlert size={18} /> },
        { name: 'Finance', path: '/finance', icon: <CreditCard size={18} /> },
      ]
    },
    {
      title: 'System',
      items: [
        { name: 'Insights', path: '/insights', icon: <Zap size={18} /> },
        { name: 'Support', path: '/support', icon: <ShieldCheck size={18} /> },
        { name: 'Settings', path: '/settings', icon: <Settings size={18} /> },
        { name: 'Profile', path: '/profile', icon: <User size={18} /> },
      ]
    }
  ];

  return (
    <aside className={`fixed top-0 left-0 h-screen bg-surface transition-all duration-300 ease-in-out z-50 flex flex-col border-r border-divider shadow-soft ${collapsed ? 'w-20' : 'w-64'}`}>
      
      {/* BRANDING */}
      <div className="h-16 flex items-center px-6 border-b border-divider">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
            <ShieldCheck size={20} className="text-white" strokeWidth={2.5} />
          </div>
          {!collapsed && (
            <span className="text-lg font-sora font-bold tracking-tight text-text-main">
              Livora <span className="text-primary font-normal">Hub</span>
            </span>
          )}
        </div>
      </div>

      {/* NAVIGATION */}
      <div className="flex-1 overflow-y-auto py-6 space-y-0.5 scrollbar-hide">
        {sections.flatMap(section => section.items).map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3.5 py-3 px-6 transition-all relative group ${isActive
                ? 'text-primary bg-primary-light/50 font-semibold'
                : 'text-text-muted hover:text-text-main hover:bg-gray-50'
              } ${collapsed ? 'justify-center px-0' : ''}`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute left-0 w-1 h-3/5 bg-primary rounded-r-full top-1/2 -translate-y-1/2"
                  />
                )}
                <div className={`shrink-0 transition-all duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-110 group-hover:text-primary'}`}>
                  {item.icon}
                </div>
                {!collapsed && (
                  <span className="text-[13.5px] leading-none">{item.name}</span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>

      {/* FOOTER */}
      <div className="p-4 border-t border-divider">
        <button 
          onClick={handleLogout}
          className={`w-full flex items-center gap-3.5 px-4 py-2.5 text-text-muted hover:text-danger hover:bg-red-50 rounded-lg transition-all group ${collapsed ? 'justify-center px-0' : ''}`}
        >
          <LogOut size={18} className="group-hover:translate-x-0.5 transition-transform" />
          {!collapsed && <span className="text-sm font-semibold">Sign Out</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
