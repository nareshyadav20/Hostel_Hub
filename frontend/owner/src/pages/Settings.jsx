import React, { useState } from 'react';
import { Settings as SettingsIcon, Shield, Bell, User, Building, CreditCard, PaintBucket, ToggleLeft, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [theme, setTheme] = useState('dark');
  const [accentColor, setAccentColor] = useState('#0ea5e9');
  const [notifications, setNotifications] = useState({ email: true, sms: false, push: true, billing: true });

  const tabs = [
    { id: 'profile', name: 'Admin Profile', icon: <User size={18} /> },
    { id: 'business', name: 'Business Details', icon: <Building size={18} /> },
    { id: 'security', name: 'Security & Auth', icon: <Shield size={18} /> },
    { id: 'notifications', name: 'Notifications', icon: <Bell size={18} /> },
    { id: 'billing', name: 'Subscription', icon: <CreditCard size={18} /> },
    { id: 'appearance', name: 'Appearance', icon: <PaintBucket size={18} /> },
  ];

  const handleSave = () => {
    alert('Settings saved successfully!');
  };

  const Toggle = ({ enabled, onClick }) => (
    <div 
      onClick={onClick}
      style={{ 
        width: '44px', height: '24px', background: enabled ? 'var(--accent-primary)' : 'var(--bg-tertiary)', 
        borderRadius: '12px', padding: '2px', cursor: 'pointer', transition: '0.3s',
        display: 'flex', alignItems: 'center', border: '1px solid var(--border-color)',
        justifyContent: enabled ? 'flex-end' : 'flex-start'
      }}
    >
      <motion.div layout style={{ width: '18px', height: '18px', background: '#fff', borderRadius: '50%', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }} />
    </div>
  );

  return (
    <div className="settings-page" style={{ animation: 'fadeIn 0.5s ease-out' }}>
      <header style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: '800', marginBottom: '0.4rem', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <SettingsIcon size={32} color="var(--accent-primary)" /> System Settings
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>Configure your account, business profile, and application preferences.</p>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '2rem' }}>
        
        {/* Left Navigation */}
        <div className="card" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', alignSelf: 'start' }}>
          {tabs.map((tab) => (
             <button 
               key={tab.id}
               onClick={() => setActiveTab(tab.id)}
               className="btn"
               style={{ 
                 display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '0.8rem 1rem', 
                 justifyContent: 'flex-start', fontSize: '0.9rem', fontWeight: activeTab === tab.id ? '700' : '500',
                 background: activeTab === tab.id ? 'var(--bg-tertiary)' : 'transparent',
                 color: activeTab === tab.id ? 'var(--accent-primary)' : 'var(--text-primary)',
                 border: 'none', borderRadius: '8px', transition: 'var(--transition-fast)'
               }}
             >
                <div style={{ opacity: activeTab === tab.id ? 1 : 0.6 }}>{tab.icon}</div>
                {tab.name}
             </button>
          ))}
        </div>

        {/* Right Content Area */}
        <div className="card" style={{ padding: '2.5rem', minHeight: '550px' }}>
          
          <AnimatePresence mode="wait">
            {activeTab === 'profile' && (
              <motion.div key="profile" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <User size={24} color="var(--accent-primary)" /> Profile Information
                </h2>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '3rem' }}>
                  <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'var(--bg-tertiary)', border: '2px dashed var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-primary)', fontSize: '2rem', fontWeight: '800' }}>
                     JD
                  </div>
                  <div>
                     <button className="btn btn-primary" style={{ marginBottom: '0.5rem' }}>Upload Avatar</button>
                     <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Required: JPG, PNG. Max: 2MB.</p>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                   <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Full Name</label>
                      <input type="text" defaultValue="John Doe" style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }} />
                   </div>
                   <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Email Address</label>
                      <input type="email" defaultValue="owner@hostelhub.com" style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }} />
                   </div>
                   <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Phone Number</label>
                      <input type="tel" defaultValue="+91 98765 43210" style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }} />
                   </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'appearance' && (
              <motion.div key="appearance" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                 <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                   <PaintBucket size={24} color="var(--accent-primary)" /> Appearance Settings
                 </h2>
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                       <div>
                          <p style={{ fontWeight: '700' }}>Interface Theme</p>
                          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Choose between light and dark modes.</p>
                       </div>
                       <div style={{ display: 'flex', gap: '1rem', background: 'var(--bg-tertiary)', padding: '0.4rem', borderRadius: '12px' }}>
                          <button onClick={() => setTheme('light')} className="btn" style={{ padding: '0.6rem 1.2rem', background: theme === 'light' ? 'var(--bg-primary)' : 'transparent', color: theme === 'light' ? 'var(--accent-primary)' : 'var(--text-secondary)', border: 'none' }}>Light</button>
                          <button onClick={() => setTheme('dark')} className="btn" style={{ padding: '0.6rem 1.2rem', background: theme === 'dark' ? 'var(--bg-primary)' : 'transparent', color: theme === 'dark' ? 'var(--accent-primary)' : 'var(--text-secondary)', border: 'none' }}>Dark</button>
                       </div>
                    </div>
                    <div>
                       <p style={{ fontWeight: '700', marginBottom: '1rem' }}>Accent Color</p>
                       <div style={{ display: 'flex', gap: '1rem' }}>
                          {['#0ea5e9', '#6366f1', '#10b981', '#f59e0b', '#ef4444'].map(color => (
                            <div 
                              key={color} 
                              onClick={() => setAccentColor(color)}
                              style={{ width: '40px', height: '40px', background: color, borderRadius: '50%', cursor: 'pointer', border: accentColor === color ? '4px solid #fff' : '2px solid transparent', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }} 
                            />
                          ))}
                       </div>
                    </div>
                 </div>
              </motion.div>
            )}

            {activeTab === 'notifications' && (
              <motion.div key="notifications" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                 <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                   <Bell size={24} color="var(--accent-primary)" /> Notification Preferences
                 </h2>
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {Object.entries(notifications).map(([key, val]) => (
                      <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.2rem', background: 'var(--bg-primary)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                        <p style={{ fontWeight: '600', textTransform: 'capitalize' }}>{key} Notifications</p>
                        <Toggle enabled={val} onClick={() => setNotifications({...notifications, [key]: !val})} />
                      </div>
                    ))}
                 </div>
              </motion.div>
            )}

            {!['profile', 'appearance', 'notifications'].includes(activeTab) && (
               <motion.div key="fallback" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)' }}>
                  <SettingsIcon size={48} opacity={0.2} style={{ marginBottom: '1rem' }} />
                  <h3>{tabs.find(t => t.id === activeTab)?.name} Configuration</h3>
                  <p>Features coming in next update.</p>
               </motion.div>
            )}
          </AnimatePresence>

          <div style={{ borderTop: '1px solid var(--border-color)', marginTop: '3rem', paddingTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
            <button onClick={handleSave} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.8rem 2rem' }}>
              <Save size={18} /> Save All Changes
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Settings;
