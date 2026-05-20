import React, { useState, useEffect } from 'react';
import { 
  Settings as SettingsIcon, Shield, Bell, CreditCard, 
  Globe, Database, User, Save, Lock, Eye, EyeOff, 
  Check, Info, Zap, Smartphone, Mail, Hash,
  Layout, Image, Paintbrush, Activity, Key,
  Cloud, Terminal, ChevronRight, AlertTriangle, ArrowLeft,
  RefreshCw
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import API from '../api/axios';

const Settings = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('General');
  const [showPassword, setShowPassword] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [settings, setSettings] = useState({
    twoFactor: true,
    sessionPersistence: false,
    smtpEmailRelay: true,
    smsGateway: true,
    webPush: false,
    paymentOverdue: true,
    highPriorityIssues: true,
    staffDailyDigest: false,
    platformPersona: "StayNest Enterprise Hub",
    adminEmail: "ops@staynest.com",
    fiscalUnit: "INR (₹) - Indian Rupee",
    operationalLanguage: "English (Universal)",
    invoicingPrefix: "LIV-",
    taxPercentage: "18%",
  });

  // Fetch settings from admin_settings collection in backend
  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await API.get('/admin/settings');
      if (res.data) {
        setSettings({
          twoFactor: res.data.twoFactor !== undefined ? res.data.twoFactor : true,
          sessionPersistence: res.data.sessionPersistence !== undefined ? res.data.sessionPersistence : false,
          smtpEmailRelay: res.data.smtpEmailRelay !== undefined ? res.data.smtpEmailRelay : true,
          smsGateway: res.data.smsGateway !== undefined ? res.data.smsGateway : true,
          webPush: res.data.webPush !== undefined ? res.data.webPush : false,
          paymentOverdue: res.data.paymentOverdue !== undefined ? res.data.paymentOverdue : true,
          highPriorityIssues: res.data.highPriorityIssues !== undefined ? res.data.highPriorityIssues : true,
          staffDailyDigest: res.data.staffDailyDigest !== undefined ? res.data.staffDailyDigest : false,
          platformPersona: res.data.platformPersona || "StayNest Enterprise Hub",
          adminEmail: res.data.adminEmail || "ops@staynest.com",
          fiscalUnit: res.data.fiscalUnit || "INR (₹) - Indian Rupee",
          operationalLanguage: res.data.operationalLanguage || "English (Universal)",
          invoicingPrefix: res.data.invoicingPrefix || "LIV-",
          taxPercentage: res.data.taxPercentage || "18%",
        });
      }
    } catch (err) {
      console.error('Failed to fetch settings from backend:', err);
      showToast('Failed to load settings from database.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleInputChange = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const menuItems = [
    { name: 'General', icon: <SettingsIcon size={18} />, description: 'Platform defaults & system parameters' },
    { name: 'Security', icon: <Shield size={18} />, description: 'Authentication & access protocols' },
    { name: 'Notifications', icon: <Bell size={18} />, description: 'Transmission & alert preferences' },
    { name: 'Payments', icon: <CreditCard size={18} />, description: 'Fiscal gateways & invoicing' },
    { name: 'Localization', icon: <Globe size={18} />, description: 'Regional settings & time manifests' },
    { name: 'Infrastructure', icon: <Database size={18} />, description: 'Cloud nodes & API integrations' },
    { name: 'Identity', icon: <User size={18} />, description: 'Branding & platform persona' },
  ];

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await API.put('/admin/settings', settings);
      if (res.data) {
        setIsSaved(true);
        showToast('Platform configurations stored inside admin_settings collection!', 'success');
        setTimeout(() => setIsSaved(false), 2000);
      }
    } catch (err) {
      console.error('Failed to update settings in backend:', err);
      showToast('Failed to save settings to backend database.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const Toggle = ({ name, label, sub }) => (
    <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50/50 dark:bg-white/[0.02] border border-divider/50">
       <div>
          <p className="text-[11px] font-black text-text-primary uppercase tracking-tight">{label}</p>
          <p className="text-[9px] font-bold text-text-muted uppercase italic">{sub}</p>
       </div>
       <button 
          onClick={() => {
            setSettings(prev => {
              const next = { ...prev, [name]: !prev[name] };
              showToast(`${label} is now ${next[name] ? 'Enabled' : 'Disabled'}.`, 'info');
              return next;
            });
          }}
          className={`w-12 h-6 rounded-full relative transition-all duration-300 ${settings[name] ? 'bg-primary shadow-glow' : 'bg-slate-200 dark:bg-white/10'}`}
       >
          <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 ${settings[name] ? 'right-1' : 'left-1'}`} />
       </button>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <RefreshCw className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-20 animate-fade">
      
      {/* --- BACK NAVIGATION --- */}
      <button 
        onClick={() => navigate('/dashboard')}
        className="flex items-center gap-2 text-text-muted hover:text-primary transition-colors text-[10px] font-black uppercase tracking-[0.2em] group"
      >
        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
        Back to Dashboard
      </button>
      {/* --- ELITE HEADER --- */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-text-primary tracking-tight uppercase italic">System Configuration</h1>
          <p className="text-sm text-text-muted mt-1 font-medium italic">Global administrative oversight of platform architecture and security protocols</p>
        </div>
        <button 
          onClick={handleSave}
          className={`flex items-center gap-2 px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg ${
            isSaved ? 'bg-emerald-500 text-white shadow-emerald-500/20' : 'bg-primary text-white shadow-primary/20 hover:bg-primary-dark'
          }`}
        >
          {isSaved ? <Check size={16} strokeWidth={3} /> : <Save size={16} strokeWidth={3} />}
          {isSaved ? 'Configuration Updated' : 'Commit Changes'}
        </button>
      </div>

      <div className="grid grid-cols-12 gap-10">
        
        {/* --- TACTICAL SIDEBAR --- */}
        <div className="col-span-12 lg:col-span-3 space-y-3">
           {menuItems.map((item) => (
             <button
               key={item.name}
               onClick={() => setActiveTab(item.name)}
               className={`w-full group text-left p-5 rounded-2xl transition-all border ${
                 activeTab === item.name 
                   ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' 
                   : 'bg-card border-divider hover:border-primary/30 hover:bg-slate-50 dark:hover:bg-white/2'
               }`}
             >
               <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                    activeTab === item.name ? 'bg-white/20 text-white' : 'bg-primary/5 text-primary group-hover:scale-110'
                  }`}>
                    {React.cloneElement(item.icon, { strokeWidth: 2.5 })}
                  </div>
                  <div>
                    <p className={`text-[11px] font-black uppercase tracking-widest ${activeTab === item.name ? 'text-white' : 'text-text-primary'}`}>
                      {item.name}
                    </p>
                    <p className={`text-[9px] font-bold mt-0.5 italic ${activeTab === item.name ? 'text-white/60' : 'text-text-muted'}`}>
                      {item.description}
                    </p>
                  </div>
               </div>
             </button>
           ))}

           <div className="p-6 rounded-2xl bg-amber-500/5 border border-amber-500/10 mt-10">
              <div className="flex items-center gap-2 text-amber-600 mb-2">
                 <AlertTriangle size={14} strokeWidth={3} />
                 <span className="text-[10px] font-black uppercase tracking-widest">Audit Notice</span>
              </div>
              <p className="text-[9px] font-bold text-amber-700/70 italic uppercase leading-relaxed">
                 All system modifications are logged in the global manifest for administrative review.
              </p>
           </div>
        </div>

        {/* --- SETTINGS CANVAS --- */}
        <div className="col-span-12 lg:col-span-9">
           <div className="card-classic p-10 min-h-[600px] relative overflow-hidden">
              <AnimatePresence mode="wait">
                 <motion.div
                   key={activeTab}
                   initial={{ opacity: 0, x: 20 }}
                   animate={{ opacity: 1, x: 0 }}
                   exit={{ opacity: 0, x: -20 }}
                   transition={{ duration: 0.3 }}
                   className="space-y-12"
                 >
                    {/* CATEGORY HEADER */}
                    <div className="flex items-center gap-4 border-b border-divider/50 pb-8">
                       <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                          {React.cloneElement(menuItems.find(m => m.name === activeTab).icon, { size: 28, strokeWidth: 2.5 })}
                       </div>
                       <div>
                          <h2 className="text-2xl font-black text-text-primary uppercase tracking-tight italic">{activeTab} Manifest</h2>
                          <p className="text-[11px] font-bold text-text-muted uppercase tracking-[0.2em]">{menuItems.find(m => m.name === activeTab).description}</p>
                       </div>
                    </div>

                    {/* DYNAMIC CONTENT */}
                    {activeTab === 'General' && (
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-3">
                             <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Platform Persona</label>
                             <input type="text" value={settings.platformPersona} onChange={(e) => handleInputChange('platformPersona', e.target.value)} className="w-full bg-slate-50 dark:bg-white/[0.02] border border-divider rounded-xl py-4 px-6 text-sm font-bold text-text-primary focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all" />
                          </div>
                          <div className="space-y-3">
                             <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Administrative Email</label>
                             <input type="email" value={settings.adminEmail} onChange={(e) => handleInputChange('adminEmail', e.target.value)} className="w-full bg-slate-50 dark:bg-white/[0.02] border border-divider rounded-xl py-4 px-6 text-sm font-bold text-text-primary focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all" />
                          </div>
                          <div className="space-y-3">
                             <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Primary Fiscal Unit</label>
                             <select value={settings.fiscalUnit} onChange={(e) => handleInputChange('fiscalUnit', e.target.value)} className="w-full bg-slate-50 dark:bg-white/[0.02] border border-divider rounded-xl py-4 px-6 text-sm font-bold text-text-primary focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all">
                                <option>INR (₹) - Indian Rupee</option>
                                <option>USD ($) - US Dollar</option>
                             </select>
                          </div>
                          <div className="space-y-3">
                             <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Operational Language</label>
                             <select className="w-full bg-slate-50 dark:bg-white/[0.02] border border-divider rounded-xl py-4 px-6 text-sm font-bold text-text-primary focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all">
                                <option>English (Universal)</option>
                                <option>Hindi (Localized)</option>
                             </select>
                          </div>
                       </div>
                    )}

                    {activeTab === 'Security' && (
                       <div className="space-y-10">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <Toggle name="twoFactor" label="Two-Factor Protocol" sub="Enforce dual-layer authorization" />
                             <Toggle name="sessionPersistence" label="Session Persistence" sub="Extend login token duration" />
                          </div>
                          <div className="space-y-6">
                             <h4 className="text-[11px] font-black text-text-primary uppercase tracking-[0.2em] flex items-center gap-2">
                                <Lock size={14} className="text-primary" /> Credential Matrix
                             </h4>
                             <div className="relative group max-w-md">
                                <input 
                                  type={showPassword ? "text" : "password"} 
                                  defaultValue="••••••••••••"
                                  className="w-full bg-slate-50 dark:bg-white/[0.02] border border-divider rounded-xl py-4 pl-6 pr-14 text-sm font-bold text-text-primary focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all"
                                />
                                <button 
                                  onClick={() => setShowPassword(!showPassword)}
                                  className="absolute right-6 top-1/2 -translate-y-1/2 text-text-muted hover:text-primary transition-all"
                                >
                                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                             </div>
                          </div>
                          <div className="p-8 rounded-3xl bg-rose-500/5 border border-rose-500/10 flex items-center justify-between group cursor-pointer hover:bg-rose-500 hover:border-rose-500 transition-all duration-500">
                             <div>
                                <h4 className="text-lg font-black text-rose-500 group-hover:text-white uppercase tracking-tight italic transition-colors">Critical Maintenance Mode</h4>
                                <p className="text-[11px] font-bold text-rose-500/60 group-hover:text-white/60 uppercase tracking-widest transition-colors">Restrict public access for system upgrades</p>
                             </div>
                             <button className="px-8 py-3 bg-rose-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest group-hover:bg-white group-hover:text-rose-500 transition-all shadow-lg shadow-rose-500/20">Initiate Protocol</button>
                          </div>
                       </div>
                    )}

                    {activeTab === 'Notifications' && (
                       <div className="space-y-8">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <div className="card-classic p-6 space-y-6 border-dashed">
                                <h4 className="text-[11px] font-black text-text-primary uppercase tracking-[0.2em] flex items-center gap-2">
                                   <Mail size={16} className="text-primary" /> Transmission Channels
                                </h4>
                                <div className="space-y-3">
                                   <Toggle name="smtpEmailRelay" label="SMTP Email Relay" sub="Primary communication vector" />
                                   <Toggle name="smsGateway" label="SMS Gateway" sub="Critical urgent alerts" />
                                   <Toggle name="webPush" label="Web Push" sub="Browser-level HUD alerts" />
                                </div>
                             </div>
                             <div className="card-classic p-6 space-y-6 border-dashed">
                                <h4 className="text-[11px] font-black text-text-primary uppercase tracking-[0.2em] flex items-center gap-2">
                                   <Zap size={16} className="text-warning" /> Trigger Logic
                                </h4>
                                <div className="space-y-3">
                                   <Toggle name="paymentOverdue" label="Payment Overdue" sub="Automatic fiscal escalation" />
                                   <Toggle name="highPriorityIssues" label="High Priority Issues" sub="Maintenance emergency pulse" />
                                   <Toggle name="staffDailyDigest" label="Staff Daily Digest" sub="Global manifest summary" />
                                </div>
                             </div>
                          </div>
                       </div>
                    )}

                    {activeTab === 'Payments' && (
                       <div className="space-y-10">
                          <div className="card-classic p-8 bg-emerald-500/[0.02] border-emerald-500/20">
                             <div className="flex items-center gap-6 mb-8">
                                <div className="w-16 h-10 rounded-lg bg-white dark:bg-card border border-divider flex items-center justify-center font-black text-[10px] text-primary italic shadow-subtle">STRIPE</div>
                                <div>
                                   <h4 className="text-[13px] font-black text-text-primary uppercase tracking-tight">Stripe Connect Manifest</h4>
                                   <p className="text-[10px] font-bold text-emerald-500 uppercase italic">Active Node: live_sk_90...21</p>
                                </div>
                                <button className="ml-auto px-6 py-2 border border-divider rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white dark:hover:bg-white/5 transition-all">Calibrate</button>
                             </div>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                   <label className="text-[9px] font-black text-text-muted uppercase tracking-widest">Invoicing Prefix</label>
                                   <input type="text" value={settings.invoicingPrefix} onChange={(e) => handleInputChange('invoicingPrefix', e.target.value)} className="w-full bg-white dark:bg-card border border-divider rounded-xl py-3 px-4 text-xs font-bold" />
                                </div>
                                <div className="space-y-2">
                                   <label className="text-[9px] font-black text-text-muted uppercase tracking-widest">Tax Percentage (GST)</label>
                                   <input type="text" value={settings.taxPercentage} onChange={(e) => handleInputChange('taxPercentage', e.target.value)} className="w-full bg-white dark:bg-card border border-divider rounded-xl py-3 px-4 text-xs font-bold" />
                                </div>
                             </div>
                          </div>
                       </div>
                    )}

                    {activeTab === 'Infrastructure' && (
                       <div className="space-y-8">
                          <div className="grid grid-cols-3 gap-6">
                             {[
                               { label: 'Cloud Node', val: 'AWS Mumbai', status: 'Healthy', icon: <Cloud /> },
                               { label: 'API Velocity', val: '1.2k req/min', status: 'Stable', icon: <Terminal /> },
                               { label: 'Database Sync', val: '99.9% Ops', status: 'Ready', icon: <Database /> },
                             ].map((infra, i) => (
                               <div key={i} className="card-classic p-6 border-dashed">
                                  <div className="text-primary mb-3">{infra.icon}</div>
                                  <p className="text-[9px] font-black text-text-muted uppercase tracking-widest">{infra.label}</p>
                                  <h5 className="text-[13px] font-black text-text-primary uppercase tracking-tight italic mt-1">{infra.val}</h5>
                                  <div className="flex items-center gap-1.5 mt-3">
                                     <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-glow" />
                                     <span className="text-[9px] font-black text-emerald-500 uppercase italic">{infra.status}</span>
                                  </div>
                               </div>
                             ))}
                          </div>
                          <div className="space-y-4">
                             <h4 className="text-[11px] font-black text-text-primary uppercase tracking-[0.2em]">API Key Manifest</h4>
                             <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-divider flex items-center justify-between">
                                <span className="text-[11px] font-mono text-text-muted">admin_manifest_key_v2_9872...9011</span>
                                <button className="p-2 text-primary hover:bg-primary/5 rounded-lg transition-all"><Key size={14} /></button>
                             </div>
                          </div>
                       </div>
                    )}

                    {activeTab === 'Identity' && (
                       <div className="space-y-12">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                             <div className="space-y-6">
                                <h4 className="text-[11px] font-black text-text-primary uppercase tracking-[0.2em] flex items-center gap-2">
                                   <Image size={16} className="text-primary" /> Visual Branding
                                </h4>
                                <div className="flex items-center gap-8">
                                   <div className="w-24 h-24 rounded-3xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                                      <Zap size={40} className="text-white" strokeWidth={3} />
                                   </div>
                                   <div className="space-y-3">
                                      <button className="px-6 py-2.5 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest">Replace Logo</button>
                                      <p className="text-[9px] font-bold text-text-muted uppercase italic">Recommended: SVG or PNG (512x512)</p>
                                   </div>
                                </div>
                             </div>
                             <div className="space-y-6">
                                <h4 className="text-[11px] font-black text-text-primary uppercase tracking-[0.2em] flex items-center gap-2">
                                   <Paintbrush size={16} className="text-indigo-500" /> Color Architecture
                                </h4>
                                <div className="flex items-center gap-4">
                                   {[
                                     { label: 'Primary', color: 'bg-primary' },
                                     { label: 'Accent', color: 'bg-indigo-500' },
                                     { label: 'Success', color: 'bg-emerald-500' },
                                     { label: 'Danger', color: 'bg-rose-500' },
                                   ].map((c, i) => (
                                     <div key={i} className="flex flex-col items-center gap-2">
                                        <div className={`w-10 h-10 rounded-xl ${c.color} cursor-pointer ring-offset-4 hover:ring-2 ring-primary transition-all shadow-lg`} />
                                        <span className="text-[8px] font-black text-text-muted uppercase tracking-widest">{c.label}</span>
                                     </div>
                                   ))}
                                </div>
                             </div>
                          </div>
                       </div>
                    )}
                 </motion.div>
              </AnimatePresence>
           </div>
        </div>
      </div>

    </div>
  );
};

export default Settings;
