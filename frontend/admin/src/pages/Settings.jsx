import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, Globe, Shield, CreditCard, 
  Bell, Database, Save, ArrowRight, User, Lock, Eye, EyeOff, Check
} from 'lucide-react';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('General');
  const [showPassword, setShowPassword] = useState(false);

  const menuItems = [
    { name: 'General', icon: <SettingsIcon size={18} /> },
    { name: 'Security', icon: <Shield size={18} /> },
    { name: 'Notifications', icon: <Bell size={18} /> },
    { name: 'Payments', icon: <CreditCard size={18} /> },
    { name: 'Localization', icon: <Globe size={18} /> },
    { name: 'Infrastructure', icon: <Database size={18} /> },
  ];

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">System Configuration</h1>
          <p className="text-sm font-medium text-text-muted mt-1">Manage global parameters, security protocols, and operational integrations.</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-all shadow-lg shadow-primary/20">
          <Save size={18} /> Save Changes
        </button>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Navigation Sidebar */}
        <div className="col-span-12 lg:col-span-3 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.name}
              onClick={() => setActiveTab(item.name)}
              className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${
                activeTab === item.name 
                  ? 'layer-2 border-primary/30 text-primary bg-primary/5' 
                  : 'text-text-muted hover:bg-text-primary/5 hover:text-text-primary'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`${activeTab === item.name ? 'text-primary' : 'text-text-muted'}`}>
                  {item.icon}
                </div>
                <span className="text-sm font-bold">{item.name}</span>
              </div>
              {activeTab === item.name && <div className="w-1.5 h-1.5 bg-primary rounded-full shadow-[0_0_8px_rgb(var(--primary))]"></div>}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="col-span-12 lg:col-span-9 space-y-6">
          <div className="layer-2 p-8">
            <h3 className="text-xl font-bold text-text-primary mb-6 flex items-center gap-2">
              <User size={20} className="text-primary" /> Profile & Platform Identity
            </h3>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Platform Name</label>
                <input 
                  type="text" 
                  defaultValue="Livora Enterprise Hub" 
                  className="w-full bg-background border border-border rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-primary/50 text-text-primary"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Support Email</label>
                <input 
                  type="email" 
                  defaultValue="admin@livora.ai" 
                  className="w-full bg-background border border-border rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-primary/50 text-text-primary"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Default Currency</label>
                <select className="w-full bg-background border border-border rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-primary/50 text-text-primary">
                   <option>INR (₹) - Indian Rupee</option>
                   <option>USD ($) - US Dollar</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">System Language</label>
                <select className="w-full bg-background border border-border rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-primary/50 text-text-primary">
                   <option>English (International)</option>
                   <option>Hindi (Local)</option>
                </select>
              </div>
            </div>

            <div className="mt-10 pt-10 border-t border-border">
              <h3 className="text-xl font-bold text-text-primary mb-6 flex items-center gap-2">
                <Lock size={20} className="text-accent" /> Authentication & Security
              </h3>
              <div className="space-y-6">
                 <div className="flex items-center justify-between p-4 rounded-2xl bg-background border border-border">
                    <div>
                       <p className="text-sm font-bold text-text-primary">Two-Factor Authentication</p>
                       <p className="text-[10px] text-text-muted mt-0.5">Secure your account with a secondary verification code.</p>
                    </div>
                    <div className="w-12 h-6 bg-primary rounded-full relative cursor-pointer">
                       <div className="absolute top-1 right-1 w-4 h-4 bg-white rounded-full"></div>
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Change Admin Password</label>
                    <div className="relative">
                       <input 
                         type={showPassword ? "text" : "password"} 
                         defaultValue="••••••••••••"
                         className="w-full bg-background border border-border rounded-xl py-3 pl-4 pr-12 text-sm focus:outline-none focus:border-primary/50 text-text-primary"
                       />
                       <button 
                         onClick={() => setShowPassword(!showPassword)}
                         className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-primary transition-colors"
                       >
                         {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                       </button>
                    </div>
                 </div>
              </div>
            </div>
          </div>

          <div className="layer-2 p-8 border-danger/20 bg-danger/5">
             <div className="flex items-center justify-between">
                <div>
                   <h3 className="text-lg font-bold text-danger">Maintenance Mode</h3>
                   <p className="text-xs text-text-secondary mt-1">Restrict public access while performing critical system updates.</p>
                </div>
                <button className="px-6 py-2 bg-danger text-white font-bold rounded-xl hover:bg-danger-dark transition-all">
                   Activate Now
                </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
