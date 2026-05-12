import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutGrid, Building2, ClipboardList, Users, MessageSquare,
  BarChart3, FileText, Settings, LogOut, ShieldCheck,
  CalendarCheck, BellRing, CheckSquare, UserCheck,
  LifeBuoy, Wrench, Activity
} from 'lucide-react';
import { motion } from 'framer-motion';

const Sidebar = ({ collapsed }) => {
  console.log('Sidebar motion:', typeof motion);
  const sections = [
    {
      title: 'Portfolio',
      items: [
        { name: 'Dashboard', path: '/dashboard', icon: <LayoutGrid size={18} /> },
        { name: 'Properties', path: '/hostels', icon: <Building2 size={18} /> },
        { name: 'Inventory', path: '/rooms', icon: <ClipboardList size={18} /> },
        { name: 'Residents', path: '/tenants', icon: <Users size={18} /> },
      ]
    },
    {
      title: 'Operations',
      items: [
        { name: 'Bookings', path: '/bookings', icon: <CalendarCheck size={18} /> },
        { name: 'Issues', path: '/issues', icon: <Activity size={18} /> },
      ]
    },
    {
      title: 'Intelligence',
      items: [
        { name: 'Finance', path: '/finance', icon: <BarChart3 size={18} /> },
        { name: 'Alerts', path: '/notifications', icon: <BellRing size={18} />, badge: 2 },
        { name: 'Tasks', path: '/tasks', icon: <CheckSquare size={18} /> },
      ]
    },
    {
      title: 'Admin',
      items: [
        { name: 'Staff', path: '/staff', icon: <UserCheck size={18} /> },
        { name: 'Support', path: '/support', icon: <LifeBuoy size={18} /> },
        { name: 'Settings', path: '/settings', icon: <Settings size={18} /> },
      ]
    }
  ];

  return (
    <aside className={`fixed top-0 left-0 h-screen bg-card transition-all duration-500 z-50 flex flex-col border-r border-border shadow-premium ${collapsed ? 'w-20' : 'w-64'}`}>

      {/* LOGO SECTION */}
      <div className="h-16 flex items-center px-6 border-b border-border bg-slate-50/50 dark:bg-white/2">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
            <ShieldCheck size={20} className="text-white" strokeWidth={2.5} />
          </div>
          {!collapsed && (
            <span className="text-lg font-black text-text-primary tracking-tight uppercase italic">Livora</span>
          )}
        </div>
      </div>

      {/* NAVIGATION */}
      <div className="flex-1 overflow-y-auto py-6 space-y-8 scrollbar-hide">
        {sections.map((section, idx) => (
          <div key={idx} className="space-y-2">
            {!collapsed && (
              <h4 className="px-6 text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-4 opacity-50">
                {section.title}
              </h4>
            )}
            <div className="space-y-1">
              {section.items.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-4 py-2.5 px-6 transition-all relative group ${isActive
                      ? 'text-primary bg-primary/5 font-bold'
                      : 'text-text-secondary hover:text-text-primary hover:bg-slate-50 dark:hover:bg-white/2'
                    } ${collapsed ? 'justify-center px-0' : ''}`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <motion.div
                          layoutId="activeBar"
                          className="absolute left-0 w-1 h-2/3 bg-primary rounded-r-full"
                        />
                      )}
                      <div className={`shrink-0 transition-transform duration-300 ${isActive ? 'text-primary scale-110' : 'text-text-muted group-hover:scale-110 group-hover:text-primary'}`}>
                        {item.icon}
                      </div>
                      {!collapsed && (
                        <span className="text-[13px] tracking-tight">{item.name}</span>
                      )}
                      {!collapsed && item.badge && (
                        <div className="ml-auto px-1.5 py-0.5 rounded-md bg-rose-500 text-white text-[9px] font-black shadow-lg shadow-rose-500/20">
                          {item.badge}
                        </div>
                      )}
                      {!collapsed && isActive && !item.badge && (
                        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary shadow-glow" />
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
            {idx < sections.length - 1 && collapsed && (
              <div className="mx-6 h-px bg-border/50" />
            )}
          </div>
        ))}
      </div>

      {/* FOOTER / LOGOUT */}
      <div className="p-4 border-t border-border bg-slate-50/50 dark:bg-white/2">
        <button className={`w-full flex items-center gap-4 px-4 py-3 text-text-secondary hover:text-danger hover:bg-rose-500/5 rounded-xl transition-all group ${collapsed ? 'justify-center px-0' : ''}`}>
          <LogOut size={18} className="group-hover:translate-x-0.5 transition-transform" />
          {!collapsed && <span className="text-[13px] font-bold">Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
