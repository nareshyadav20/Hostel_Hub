import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, Building2, Users, PieChart, Wallet, 
  Settings, LogOut, ShieldCheck, MapPin, BedDouble, 
  UtensilsCrossed, Package, Receipt, AlertCircle, 
  UserCheck, Zap, Brain, Bell, Globe, ChevronLeft, ChevronRight
} from 'lucide-react';

const navGroups = [
  {
    title: 'CORE',
    items: [
      { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={18} /> },
      { name: 'Analytics', path: '/analytics', icon: <PieChart size={18} /> },
    ]
  },
  {
    title: 'PROPERTIES',
    items: [
      { name: 'Hostels', path: '/hostels', icon: <Building2 size={18} /> },
      { name: 'Rooms', path: '/rooms', icon: <BedDouble size={18} /> },
      { name: 'Beds', path: '/beds', icon: <BedDouble size={18} /> },
    ]
  },
  {
    title: 'OPERATIONS',
    items: [
      { name: 'Tenants', path: '/tenants', icon: <Users size={18} /> },
      { name: 'Mess', path: '/mess', icon: <UtensilsCrossed size={18} /> },
      { name: 'Inventory', path: '/inventory', icon: <Package size={18} /> },
      { name: 'Complaints', path: '/complaints', icon: <AlertCircle size={18} /> },
      { name: 'Staff', path: '/staff', icon: <UserCheck size={18} /> },
    ]
  },
  {
    title: 'FINANCE',
    items: [
      { name: 'Finance', path: '/finance', icon: <Receipt size={18} /> },
      { name: 'Wallet', path: '/wallet', icon: <Wallet size={18} /> },
    ]
  },
  {
    title: 'INTELLIGENCE',
    items: [
      { name: 'Automation', path: '/automation', icon: <Zap size={18} /> },
      { name: 'AI Insights', path: '/insights', icon: <Brain size={18} /> },
    ]
  },
  {
    title: 'SYSTEM',
    items: [
      { name: 'Settings', path: '/settings', icon: <Settings size={18} /> },
    ]
  }
];

const Sidebar = ({ collapsed, setCollapsed }) => {
  return (
    <aside className={`fixed top-0 left-0 h-screen bg-card border-r border-border transition-all duration-300 z-50 flex flex-col ${collapsed ? 'w-20' : 'w-64'}`}>
      {/* Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-border">
        {!collapsed && (
          <div className="flex items-center gap-2 text-primary">
            <ShieldCheck size={24} className="text-primary" />
            <span className="font-bold text-lg tracking-wider text-text-primary">LIVORA</span>
          </div>
        )}
        {collapsed && (
          <div className="w-full flex justify-center">
            <ShieldCheck size={24} className="text-primary" />
          </div>
        )}
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded-md text-text-muted hover:text-text-primary hover:bg-text-primary/5 transition-colors absolute -right-3 top-5 bg-card border border-border"
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      {/* Nav Content */}
      <div className="flex-1 overflow-y-auto py-6 scrollbar-hide">
        {navGroups.map((group, idx) => (
          <div key={group.title} className="mb-6 relative">
            {idx !== 0 && (
              <div className="absolute top-[-12px] left-4 right-4 h-px bg-gradient-to-r from-transparent via-border to-transparent opacity-50" />
            )}
            
            {!collapsed && (
              <h3 className="text-[10px] font-bold text-text-muted tracking-[0.15em] mb-3 uppercase px-6">
                {group.title}
              </h3>
            )}
            
            <nav className={`space-y-0.5 ${collapsed ? 'px-3' : 'px-4'}`}>
              {group.items.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  title={collapsed ? item.name : ''}
                  className={({ isActive }) => 
                    `flex items-center gap-3 py-2 px-3 rounded-xl transition-all duration-300 group ${
                      isActive 
                        ? 'bg-gradient-to-r from-primary/15 to-primary/5 text-primary shadow-[inset_3px_0_0_0_rgb(var(--primary))]' 
                        : 'text-text-secondary hover:bg-text-primary/5 hover:text-text-primary'
                    } ${collapsed ? 'justify-center px-0' : ''}`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div className={`flex items-center justify-center w-8 h-8 rounded-lg transition-colors duration-300 ${isActive ? 'bg-primary/20 text-primary' : 'bg-transparent text-text-muted group-hover:text-text-primary group-hover:bg-text-primary/10'} ${collapsed ? 'w-10 h-10' : ''}`}>
                        {item.icon}
                      </div>
                      {!collapsed && <span className={`text-[13px] font-medium tracking-tight ${isActive ? 'font-semibold' : ''}`}>{item.name}</span>}
                    </>
                  )}
                </NavLink>
              ))}
            </nav>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <button className={`w-full flex items-center gap-3 py-2 px-3 rounded-lg text-text-secondary hover:bg-danger/10 hover:text-danger transition-colors ${collapsed ? 'justify-center px-0' : ''}`}>
          <LogOut size={18} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
