import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutGrid, Building2, ClipboardList, Users, MessageSquare, 
  BarChart3, Globe, FileText, Activity, 
  Bell, Settings, LogOut, ShieldCheck, CalendarCheck
} from 'lucide-react';

const Sidebar = ({ collapsed }) => {
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutGrid size={20} /> },
    { name: 'Properties', path: '/hostels', icon: <Building2 size={20} /> },
    { name: 'Rooms', path: '/rooms', icon: <ClipboardList size={20} /> },
    { name: 'Tenants', path: '/tenants', icon: <Users size={20} /> },
    { name: 'Bookings', path: '/bookings', icon: <CalendarCheck size={20} /> },
    { name: 'Complaints', path: '/complaints', icon: <MessageSquare size={20} /> },
    { name: 'Maintenance', path: '/maintenance', icon: <Activity size={20} /> },
    { name: 'Revenue', path: '/finance', icon: <BarChart3 size={20} /> },
    { name: 'Reports', path: '/reports', icon: <FileText size={20} /> },
    { name: 'Settings', path: '/settings', icon: <Settings size={20} /> },
  ];

  return (
    <aside className={`fixed top-0 left-0 h-screen bg-card transition-all duration-300 z-50 flex flex-col border-r border-border ${collapsed ? 'w-20' : 'w-64'}`}>
      
      {/* LOGO SECTION */}
      <div className="h-16 flex items-center px-6 border-b border-border">
        <div className="flex items-center gap-3">
          <ShieldCheck size={24} className="text-primary" strokeWidth={2.5} />
          {!collapsed && (
            <span className="text-lg font-black text-text-primary tracking-tight uppercase">Livora</span>
          )}
        </div>
      </div>

      {/* NAVIGATION */}
      <div className="flex-1 overflow-y-auto py-6 space-y-1 scrollbar-hide">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) => 
              `flex items-center gap-4 py-3 px-6 transition-all relative ${
                isActive 
                  ? 'text-primary bg-primary/5 font-semibold' 
                  : 'text-text-secondary hover:text-text-primary hover:bg-background'
              } ${collapsed ? 'justify-center px-0' : ''}`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <div className="absolute left-0 w-1 h-full bg-primary" />
                )}
                <div className={`shrink-0 ${isActive ? 'text-primary' : 'text-text-muted'}`}>
                  {item.icon}
                </div>
                {!collapsed && (
                  <span className="text-[14px]">{item.name}</span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>

      {/* FOOTER / LOGOUT */}
      <div className="p-4 border-t border-border">
        <button className={`w-full flex items-center gap-4 px-4 py-3 text-text-secondary hover:text-danger hover:bg-danger/5 rounded-lg transition-all ${collapsed ? 'justify-center px-0' : ''}`}>
          <LogOut size={20} />
          {!collapsed && <span className="text-[14px] font-medium">Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
