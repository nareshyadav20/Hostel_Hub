import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Activity, BrainCircuit,
  Building2, Map, Layers, DoorOpen, BedDouble, Cpu,
  Users, UserPlus, ArrowRightLeft, MessageSquareWarning, LogIn, BadgeCheck,
  UserCog, ShieldCheck, CreditCard, Award,
  DollarSign, TrendingUp, AlertCircle, Receipt, PieChart,
  PackageSearch, ShoppingCart, Contact2, BellRing,
  Users2, Clock, CalendarRange, Wrench, Sparkles,
  Bell, Megaphone, LifeBuoy, Ticket,
  FileText, BarChart3, LineChart, Brain,
  Settings, KeyRound, ShieldAlert, ScrollText,
  ChevronDown, ChevronRight, Zap, LogOut, CheckCircle2, UserCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { useTheme } from '../context/ThemeContext';

const Sidebar = ({ collapsed }) => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedSections, setExpandedSections] = useState({
    'Overview': true,
    'Hostel Management': false
  });

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const toggleSection = (title) => {
    if (collapsed) return; // Prevent toggle if collapsed
    setExpandedSections(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  const menuStructure = [
    {
      title: 'Overview',
      icon: <LayoutDashboard size={18} />,
      items: [
        { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={16} /> },
        { name: 'Live Analytics', path: '/analytics/live', icon: <Activity size={16} />, glow: true },
        { name: 'AI Insights', path: '/analytics/ai', icon: <BrainCircuit size={16} /> },
      ]
    },
    {
      title: 'Hostel Management',
      icon: <Building2 size={18} />,
      items: [
        { name: 'Hostels', path: '/hostels', icon: <Building2 size={16} /> },
        { name: 'Floors', path: '/floors', icon: <Layers size={16} /> },
        { name: 'Rooms', path: '/rooms', icon: <DoorOpen size={16} /> },
        { name: 'Beds', path: '/beds', icon: <BedDouble size={16} />, badge: '5 V' },
        { name: 'Smart Infra', path: '/infra', icon: <Cpu size={16} /> },
      ]
    },
    {
      title: 'Tenant Management',
      icon: <Users size={18} />,
      items: [
        { name: 'Tenants', path: '/tenants', icon: <Users size={16} /> },
        { name: 'Admissions', path: '/admissions', icon: <UserPlus size={16} />, badge: '3' },
        { name: 'Transfers', path: '/transfers', icon: <ArrowRightLeft size={16} /> },
        { name: 'Complaints', path: '/complaints', icon: <MessageSquareWarning size={16} />, alert: true },
        { name: 'Check-In/Out', path: '/checkins', icon: <LogIn size={16} /> },
        { name: 'Visitors', path: '/visitors', icon: <BadgeCheck size={16} /> },
      ]
    },
    {
      title: 'Owners Management',
      icon: <UserCog size={18} />,
      items: [
        { name: 'Hostel Owners', path: '/owners', icon: <UserCog size={16} /> },
        { name: 'Verification', path: '/verifications', icon: <ShieldCheck size={16} />, badge: '12' },
        { name: 'Subscriptions', path: '/subscriptions', icon: <CreditCard size={16} /> },
        { name: 'Performance', path: '/performance', icon: <Award size={16} /> },
      ]
    },
    {
      title: 'Payments & Finance',
      icon: <DollarSign size={18} />,
      items: [
        { name: 'Payments', path: '/payments', icon: <DollarSign size={16} /> },
        { name: 'Revenue', path: '/revenue', icon: <TrendingUp size={16} /> },
        { name: 'Pending Dues', path: '/dues', icon: <AlertCircle size={16} />, alert: true },
        { name: 'Transactions', path: '/transactions', icon: <Receipt size={16} /> },
        { name: 'Fin Reports', path: '/finance-reports', icon: <PieChart size={16} /> },
      ]
    },
    {
      title: 'Inventory & Procure',
      icon: <PackageSearch size={18} />,
      items: [
        { name: 'Smart Inventory', path: '/inventory', icon: <PackageSearch size={16} /> },
        { name: 'Procurement', path: '/procurement', icon: <ShoppingCart size={16} /> },
        { name: 'Vendors', path: '/vendors', icon: <Contact2 size={16} /> },
        { name: 'Alerts', path: '/inventory-alerts', icon: <BellRing size={16} />, alert: true },
      ]
    },
    {
      title: 'Staff & Operations',
      icon: <Users2 size={18} />,
      items: [
        { name: 'Staff', path: '/staff', icon: <Users2 size={16} /> },
        { name: 'Attendance', path: '/attendance', icon: <Clock size={16} /> },
        { name: 'Shifts', path: '/shifts', icon: <CalendarRange size={16} /> },
        { name: 'Maintenance', path: '/maintenance', icon: <Wrench size={16} /> },
        { name: 'Hygiene', path: '/hygiene', icon: <Sparkles size={16} /> },
      ]
    },
    {
      title: 'Notify & Support',
      icon: <Bell size={18} />,
      items: [
        { name: 'Notifications', path: '/notifications', icon: <Bell size={16} />, badge: '99+' },
        { name: 'Announce', path: '/announcements', icon: <Megaphone size={16} /> },
        { name: 'Support', path: '/support', icon: <LifeBuoy size={16} /> },
        { name: 'Tickets', path: '/tickets', icon: <Ticket size={16} /> },
      ]
    },
    {
      title: 'Reports & AI',
      icon: <FileText size={18} />,
      items: [
        { name: 'All Reports', path: '/reports', icon: <FileText size={16} /> },
        { name: 'Occupancy AI', path: '/reports/occupancy', icon: <BarChart3 size={16} /> },
        { name: 'Revenue AI', path: '/reports/revenue', icon: <LineChart size={16} /> },
        { name: 'Predictions', path: '/predictions', icon: <Brain size={16} />, glow: true },
      ]
    },
    {
      title: 'Settings & Security',
      icon: <Settings size={18} />,
      items: [
        { name: 'Settings', path: '/settings', icon: <Settings size={16} /> },
        { name: 'Roles', path: '/roles', icon: <KeyRound size={16} /> },
        { name: 'Security', path: '/security', icon: <ShieldAlert size={16} /> },
        { name: 'Audit Logs', path: '/audit', icon: <ScrollText size={16} /> },
      ]
    }
  ];

  return (
    <aside className={`fixed top-0 left-0 h-screen transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] z-[100] flex flex-col border-r border-border shadow-[20px_0_40px_-15px_rgba(0,0,0,0.05)] ${collapsed ? 'w-20' : 'w-72'} ${isDark ? 'bg-slate-900/95 backdrop-blur-2xl' : 'bg-white/95 backdrop-blur-2xl'}`}>

      {/* 🚀 BRANDING & LOGO */}
      <div className={`h-20 flex items-center px-6 border-b border-border relative overflow-hidden group cursor-pointer`}>
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-primary flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
            <ShieldCheck size={22} className="text-white" strokeWidth={2.5} />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className={`text-xl font-black tracking-tighter uppercase italic ${isDark ? 'text-white' : 'text-slate-900'}`}>StayNest</span>
              <span className="text-[9px] text-emerald-600 font-bold tracking-widest uppercase flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Master Control
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ⚡ QUICK ACTION BUTTON (Only expanded) */}
      {!collapsed && (
        <div className="px-6 py-4">
          <button className={`w-full py-2.5 rounded-xl border border-border text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-primary hover:border-primary hover:text-white transition-all shadow-sm hover:shadow-primary/20 group ${isDark ? 'bg-white/5 text-white' : 'bg-slate-900/5 text-slate-700'}`}>
            <Zap size={14} className="text-amber-500 group-hover:text-white group-hover:animate-bounce" /> Global Command
          </button>
        </div>
      )}

      {/* 🧭 NAVIGATION CORE */}
      <div className={`flex-1 overflow-y-auto px-4 pb-10 space-y-2 scrollbar-hide ${collapsed ? 'pt-6' : 'pt-2'}`}>
        {menuStructure.map((section, idx) => {
          const isExpanded = expandedSections[section.title];
          const hasActiveChild = section.items.some(item => location.pathname.startsWith(item.path));
          
          if (collapsed) {
            return (
              <div key={idx} className="relative group/icon mb-4 flex justify-center">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center cursor-pointer transition-all ${hasActiveChild ? 'bg-primary text-white shadow-lg shadow-primary/30' : `hover:bg-primary/10 ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`}`}>
                  {section.icon}
                </div>
                <div className={`absolute left-16 top-1/2 -translate-y-1/2 text-[10px] font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover/icon:opacity-100 pointer-events-none whitespace-nowrap z-50 border border-border shadow-xl transition-opacity ${isDark ? 'bg-slate-800 text-white' : 'bg-white text-slate-900'}`}>
                  {section.title}
                </div>
              </div>
            );
          }

          return (
            <div key={idx} className="mb-2">
              <button 
                onClick={() => toggleSection(section.title)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-colors ${hasActiveChild || isExpanded ? (isDark ? 'bg-white/5' : 'bg-slate-900/5') : (isDark ? 'hover:bg-white/5' : 'hover:bg-slate-900/5')}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`${hasActiveChild ? 'text-primary' : (isDark ? 'text-slate-400' : 'text-slate-500')}`}>
                    {section.icon}
                  </div>
                  <span className={`text-[12px] font-bold tracking-wide ${hasActiveChild ? (isDark ? 'text-white' : 'text-slate-900') : (isDark ? 'text-slate-400' : 'text-slate-600')}`}>
                    {section.title}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {hasActiveChild && !isExpanded && <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-glow" />}
                  <ChevronRight size={14} className={`text-slate-400 transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''}`} />
                </div>
              </button>

              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className={`pl-9 pr-2 py-2 space-y-1 relative border-l ml-5 mt-1 ${isDark ? 'border-white/10' : 'border-slate-900/10'}`}>
                      {section.items.map((item) => (
                        <NavLink
                          key={item.name}
                          to={item.path}
                          className={({ isActive }) =>
                            `flex items-center justify-between py-2 px-3 rounded-lg transition-all relative group overflow-hidden ${isActive
                              ? 'bg-primary/10 text-primary border border-primary/20 shadow-sm'
                              : `${isDark ? 'text-slate-400 hover:text-white hover:bg-white/5' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-900/5'} border border-transparent`
                            }`
                          }
                        >
                          {({ isActive }) => (
                            <>
                              {isActive && (
                                <motion.div layoutId="activeBg" className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent" />
                              )}
                              <div className="flex items-center gap-3 relative z-10">
                                <div className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                                  {item.icon}
                                </div>
                                <span className={`text-[11px] font-bold ${isActive ? 'text-primary' : ''}`}>{item.name}</span>
                              </div>
                              
                              <div className="flex items-center relative z-10">
                                {item.badge && (
                                  <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${isActive ? 'bg-primary text-white' : (isDark ? 'bg-white/10 text-slate-300' : 'bg-slate-200 text-slate-700')}`}>
                                    {item.badge}
                                  </span>
                                )}
                                {item.alert && <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)] animate-pulse" />}
                                {item.glow && !item.alert && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse" />}
                              </div>
                            </>
                          )}
                        </NavLink>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* 🛡️ USER PROFILE FOOTER */}
      <div className={`p-4 border-t border-border relative z-20 ${isDark ? 'bg-white/2' : 'bg-slate-50/50'}`}>
        {!collapsed ? (
          <div className={`flex items-center justify-between border border-border p-3 rounded-2xl transition-all group cursor-pointer ${isDark ? 'bg-slate-800 hover:bg-slate-700' : 'bg-white hover:bg-slate-50'}`}>
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border-2 border-white/10 z-10 relative">
                  <UserCircle size={20} className="text-primary" />
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white/20 rounded-full z-20 shadow-sm" />
              </div>
              <div>
                <p className={`text-[12px] font-black leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>Admin Executive</p>
                <p className="text-[9px] text-slate-500 font-bold tracking-widest uppercase">System Master</p>
              </div>
            </div>
            <button onClick={handleLogout} className="w-8 h-8 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all shadow-sm">
              <LogOut size={14} />
            </button>
          </div>
        ) : (
          <button onClick={handleLogout} className="w-12 h-12 mx-auto rounded-xl flex items-center justify-center bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-all shadow-sm">
            <LogOut size={18} />
          </button>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
