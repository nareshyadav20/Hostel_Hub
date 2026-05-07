import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Settings as SettingsIcon, Shield, Bell, User, Building, 
  CreditCard, PaintBucket, ToggleLeft, Save, HelpCircle, 
  Trash2, Plus, Info, CheckCircle, AlertTriangle, Users,
  Utensils, BarChart, LayoutGrid, DollarSign, Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../mockData';

const Settings = () => {
  const { buildingId } = useParams();
  const [activeTab, setActiveTab] = useState('general');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState(null);
  const [msg, setMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchSettings();
  }, [buildingId]);

  const fetchSettings = async () => {
    try {
      const data = await api.getSettings(buildingId);
      setSettings(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setMsg({ type: '', text: '' });
    try {
      await api.updateSettings(settings);
      setMsg({ type: 'success', text: 'Settings updated successfully!' });
      setTimeout(() => setMsg({ type: '', text: '' }), 3000);
    } catch (err) {
      setMsg({ type: 'error', text: 'Failed to save settings.' });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading System Settings...</div>;

  const tabs = [
    { id: 'general', name: 'General', icon: <Building size={18} /> },
    { id: 'rent', name: 'Rent & Payments', icon: <DollarSign size={18} /> },
    { id: 'rooms', name: 'Infrastructure', icon: <LayoutGrid size={18} /> },
    { id: 'notifications', name: 'Notifications', icon: <Bell size={18} /> },
    { id: 'hygiene', name: 'Hygiene', icon: <Utensils size={18} /> },
    { id: 'roles', name: 'Roles & Access', icon: <Users size={18} /> },
    { id: 'reports', name: 'Reports', icon: <BarChart size={18} /> },
  ];

  const Toggle = ({ enabled, onClick }) => (
    <div 
      onClick={onClick}
      style={{ 
        width: '40px', height: '20px', background: enabled ? 'var(--accent-primary)' : 'var(--bg-tertiary)', 
        borderRadius: '10px', padding: '2px', cursor: 'pointer', transition: '0.3s',
        display: 'flex', alignItems: 'center', border: '1px solid var(--border-color)',
        justifyContent: enabled ? 'flex-end' : 'flex-start'
      }}
    >
      <motion.div layout style={{ width: '14px', height: '14px', background: '#fff', borderRadius: '50%' }} />
    </div>
  );

  const SectionHeader = ({ title, subtitle }) => (
    <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.8rem' }}>
      <h3 style={{ fontSize: '1.2rem', fontWeight: '800', margin: 0 }}>{title}</h3>
      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>{subtitle}</p>
    </div>
  );

  const InputGroup = ({ label, children, info }) => (
    <div style={{ marginBottom: '1.2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem' }}>
        <label style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-secondary)' }}>{label}</label>
        {info && <div title={info} style={{ cursor: 'help', color: 'var(--text-muted)' }}><Info size={12}/></div>}
      </div>
      {children}
    </div>
  );

  return (
    <div className="settings-page" style={{ animation: 'fadeIn 0.5s ease-out' }}>
      {/* Responsive Styles Injection */}
      <style>{`
        @media (max-width: 768px) {
          .header-main {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 1.5rem;
          }
          .header-actions {
            width: 100%;
            justify-content: flex-end;
          }
          .main-layout {
            grid-template-columns: 1fr !important;
          }
          .settings-nav {
            flex-direction: row !important;
            overflow-x: auto;
            padding-bottom: 0.5rem;
          }
          .settings-nav button {
            white-space: nowrap;
          }
          .settings-content {
            padding: 1.5rem !important;
          }
          .form-grid {
            grid-template-columns: 1fr !important;
          }
          .rent-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

      <header className="header-main" style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '900', margin: 0, letterSpacing: '-0.02em' }}>System Settings</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Centralized control for hostel operations.</p>
        </div>
        <div className="header-actions" style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
           <AnimatePresence>
             {msg.text && (
               <motion.div initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0 }}
                 style={{ padding: '0.5rem 1rem', borderRadius: '8px', background: msg.type==='success'?'#DCFCE7':'#FEE2E2', color: msg.type==='success'?'#10B981':'#EF4444', fontSize: '0.85rem', fontWeight: '700' }}>
                 {msg.text}
               </motion.div>
             )}
           </AnimatePresence>
           <button onClick={handleSave} disabled={isSaving} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.7rem 1.5rem' }}>
             {isSaving ? 'Saving...' : <><Save size={18} /> Save Settings</>}
           </button>
        </div>
      </header>

      <div className="main-layout" style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '1.5rem' }}>
        
        {/* Sidebar Navigation */}
        <div className="card settings-nav" style={{ padding: '0.8rem', display: 'flex', flexDirection: 'column', gap: '0.3rem', alignSelf: 'start', borderRadius: '14px' }}>
          {tabs.map((tab) => (
             <button 
               key={tab.id}
               onClick={() => setActiveTab(tab.id)}
               style={{ 
                 display: 'flex', alignItems: 'center', gap: '0.7rem', padding: '0.75rem 1rem', 
                 justifyContent: 'flex-start', fontSize: '0.85rem', fontWeight: activeTab === tab.id ? '800' : '600',
                 background: activeTab === tab.id ? 'var(--bg-tertiary)' : 'transparent',
                 color: activeTab === tab.id ? 'var(--accent-primary)' : 'var(--text-secondary)',
                 border: 'none', borderRadius: '10px', cursor: 'pointer', transition: '0.2s', textAlign: 'left'
               }}
             >
                <div style={{ opacity: activeTab === tab.id ? 1 : 0.6 }}>{tab.icon}</div>
                {tab.name}
             </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="card settings-content" style={{ padding: '2rem', borderRadius: '16px', minHeight: '500px' }}>
          <AnimatePresence mode="wait">
            
            {/* GENERAL SETTINGS */}
            {activeTab === 'general' && settings?.generalSettings && (
              <motion.div key="general" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <SectionHeader title="General Configuration" subtitle="Primary identity and contact information." />
                <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem' }}>
                  <InputGroup label="Hostel Name">
                    <input type="text" value={settings.generalSettings.hostelName || ''} onChange={e => setSettings({...settings, generalSettings: {...settings.generalSettings, hostelName: e.target.value}})} style={iStyle} />
                  </InputGroup>
                  <InputGroup label="Currency Symbol">
                    <input type="text" value={settings.generalSettings.currency || ''} onChange={e => setSettings({...settings, generalSettings: {...settings.generalSettings, currency: e.target.value}})} style={iStyle} />
                  </InputGroup>
                  <InputGroup label="Contact Email">
                    <input type="email" value={settings.generalSettings.contactEmail || ''} onChange={e => setSettings({...settings, generalSettings: {...settings.generalSettings, contactEmail: e.target.value}})} style={iStyle} />
                  </InputGroup>
                  <InputGroup label="Contact Phone">
                    <input type="text" value={settings.generalSettings.contactPhone || ''} onChange={e => setSettings({...settings, generalSettings: {...settings.generalSettings, contactPhone: e.target.value}})} style={iStyle} />
                  </InputGroup>
                </div>
              </motion.div>
            )}

            {!settings?.generalSettings && activeTab === 'general' && (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                General settings data is unavailable.
              </div>
            )}

            {/* RENT & PAYMENTS */}
            {activeTab === 'rent' && (
              <motion.div key="rent" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <SectionHeader title="Rent & Financials" subtitle="Configure pricing, due dates, and late fee policies." />
                <div className="rent-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.2rem', marginBottom: '2rem' }}>
                  <InputGroup label="Default Rent (Single)">
                    <input type="number" value={settings.rentSettings.defaultRent.single} onChange={e => setSettings({...settings, rentSettings: {...settings.rentSettings, defaultRent: {...settings.rentSettings.defaultRent, single: Number(e.target.value)}}})} style={iStyle} />
                  </InputGroup>
                  <InputGroup label="Default Rent (Double)">
                    <input type="number" value={settings.rentSettings.defaultRent.double} onChange={e => setSettings({...settings, rentSettings: {...settings.rentSettings, defaultRent: {...settings.rentSettings.defaultRent, double: Number(e.target.value)}}})} style={iStyle} />
                  </InputGroup>
                  <InputGroup label="Default Rent (Shared)">
                    <input type="number" value={settings.rentSettings.defaultRent.shared} onChange={e => setSettings({...settings, rentSettings: {...settings.rentSettings, defaultRent: {...settings.rentSettings.defaultRent, shared: Number(e.target.value)}}})} style={iStyle} />
                  </InputGroup>
                </div>
                <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem' }}>
                  <InputGroup label="Security Deposit" info="One-time deposit collected at check-in">
                    <input type="number" value={settings.rentSettings.securityDeposit} onChange={e => setSettings({...settings, rentSettings: {...settings.rentSettings, securityDeposit: Number(e.target.value)}})} style={iStyle} />
                  </InputGroup>
                  <InputGroup label="Payment Due Date" info="Day of month when rent is due (1-28)">
                    <input type="number" min="1" max="28" value={settings.rentSettings.paymentDueDate} onChange={e => setSettings({...settings, rentSettings: {...settings.rentSettings, paymentDueDate: Number(e.target.value)}})} style={iStyle} />
                  </InputGroup>
                  <InputGroup label="Grace Period (Days)" info="Days allowed after due date before late fee starts">
                    <input type="number" value={settings.rentSettings.gracePeriod} onChange={e => setSettings({...settings, rentSettings: {...settings.rentSettings, gracePeriod: Number(e.target.value)}})} style={iStyle} />
                  </InputGroup>
                  <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                    <InputGroup label="Late Fee Type">
                      <select value={settings.rentSettings.lateFeeRule.type} onChange={e => setSettings({...settings, rentSettings: {...settings.rentSettings, lateFeeRule: {...settings.rentSettings.lateFeeRule, type: e.target.value}}})} style={iStyle}>
                        <option value="FIXED">Fixed Amount</option>
                        <option value="PERCENTAGE">Percentage</option>
                      </select>
                    </InputGroup>
                    <InputGroup label="Late Fee Value">
                      <input type="number" value={settings.rentSettings.lateFeeRule.value} onChange={e => setSettings({...settings, rentSettings: {...settings.rentSettings, lateFeeRule: {...settings.rentSettings.lateFeeRule, value: Number(e.target.value)}}})} style={iStyle} />
                    </InputGroup>
                  </div>
                </div>
              </motion.div>
            )}

            {/* NOTIFICATIONS */}
            {activeTab === 'notifications' && (
              <motion.div key="notif" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <SectionHeader title="Automated Alerts" subtitle="Control system-wide notification triggers." />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {[
                    { id: 'enablePaymentReminders', label: 'Payment Overdue Reminders', sub: 'Notify tenants and admins when rent is late.' },
                    { id: 'enableVacancyAlerts', label: 'Vacancy & Booking Alerts', sub: 'Alert when beds become available or bookings are made.' },
                    { id: 'enableComplaintAlerts', label: 'Complaint Escalations', sub: 'Notify owner of high-priority complaints.' },
                    { id: 'enableHygieneAlerts', label: 'Hygiene Score Warnings', sub: 'Alert when property health score drops below threshold.' },
                  ].map(item => (
                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.2rem', background: 'var(--bg-tertiary)', borderRadius: '12px' }}>
                      <div>
                        <p style={{ fontWeight: '700', fontSize: '0.9rem', margin: 0 }}>{item.label}</p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>{item.sub}</p>
                      </div>
                      <Toggle 
                        enabled={settings.notificationSettings[item.id]} 
                        onClick={() => setSettings({...settings, notificationSettings: {...settings.notificationSettings, [item.id]: !settings.notificationSettings[item.id]}})} 
                      />
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* INFRASTRUCTURE */}
            {activeTab === 'rooms' && (
              <motion.div key="rooms" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <SectionHeader title="Property Infrastructure" subtitle="Configure room types and automated creation." />
                <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                  <InputGroup label="Default Bed Capacity" info="Default number of beds per room when creating floors.">
                    <input type="number" value={settings.roomConfig.defaultBedCapacity} onChange={e => setSettings({...settings, roomConfig: {...settings.roomConfig, defaultBedCapacity: Number(e.target.value)}})} style={iStyle} />
                  </InputGroup>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'var(--bg-tertiary)', borderRadius: '12px' }}>
                    <div>
                      <p style={{ fontWeight: '700', fontSize: '0.85rem', margin: 0 }}>Auto-create Rooms/Beds</p>
                      <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: 0 }}>Generate defaults when adding buildings.</p>
                    </div>
                    <Toggle 
                      enabled={settings.roomConfig.autoCreateRooms} 
                      onClick={() => setSettings({...settings, roomConfig: {...settings.roomConfig, autoCreateRooms: !settings.roomConfig.autoCreateRooms}})} 
                    />
                  </div>
                </div>
                <InputGroup label="Supported Room Types">
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {settings.roomConfig.roomTypes.map((t, i) => (
                      <span key={i} style={{ padding: '0.4rem 0.8rem', background: 'var(--accent-primary)', color: 'white', borderRadius: '100px', fontSize: '0.8rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        {t} <Trash2 size={12} style={{ cursor: 'pointer' }} onClick={() => setSettings({...settings, roomConfig: {...settings.roomConfig, roomTypes: settings.roomConfig.roomTypes.filter((_, idx) => idx !== i)}})} />
                      </span>
                    ))}
                    <button onClick={() => {
                      const nt = prompt('Enter new room type:');
                      if (nt) setSettings({...settings, roomConfig: {...settings.roomConfig, roomTypes: [...settings.roomConfig.roomTypes, nt]}});
                    }} style={{ padding: '0.4rem 0.8rem', background: 'var(--bg-tertiary)', border: '1px dashed var(--border-color)', borderRadius: '100px', fontSize: '0.8rem', cursor: 'pointer', fontWeight: '700' }}>+ Add Type</button>
                  </div>
                </InputGroup>
              </motion.div>
            )}

            {/* HYGIENE */}
            {activeTab === 'hygiene' && (
              <motion.div key="hygiene" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <SectionHeader title="Hygiene & Health" subtitle="Set quality standards and cleaning schedules." />
                <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                  <InputGroup label="Hygiene Alert Threshold (%)" info="Alerts trigger when score falls below this.">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <input type="range" min="30" max="95" step="5" value={settings.hygieneSettings.hygieneThreshold} onChange={e => setSettings({...settings, hygieneSettings: {...settings.hygieneSettings, hygieneThreshold: Number(e.target.value)}})} style={{ flex: 1 }} />
                      <span style={{ fontWeight: '800', color: 'var(--accent-primary)', fontSize: '1.2rem', minWidth: '40px' }}>{settings.hygieneSettings.hygieneThreshold}%</span>
                    </div>
                  </InputGroup>
                  <InputGroup label="Cleaning Frequency">
                    <select value={settings.hygieneSettings.cleaningFrequency} onChange={e => setSettings({...settings, hygieneSettings: {...settings.hygieneSettings, cleaningFrequency: e.target.value}})} style={iStyle}>
                      <option value="DAILY">Daily Cleaning</option>
                      <option value="WEEKLY">Weekly Deep Clean</option>
                    </select>
                  </InputGroup>
                </div>
              </motion.div>
            )}

            {/* ROLES & PERMISSIONS */}
            {activeTab === 'roles' && (
              <motion.div key="roles" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <SectionHeader title="User Roles & Access" subtitle="Manage permissions for hostel staff." />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                   {[
                     { role: 'Owner', access: 'Full Access', desc: 'All modules, settings, and financial data.', color: '#EF4444' },
                     { role: 'Manager', access: 'Limited Admin', desc: 'Manage tenants, buildings, and staff. No billing/settings.', color: '#F59E0B' },
                     { role: 'Staff / Warden', access: 'View Only', desc: 'Can view rooms and complaints. No edit access.', color: '#10B981' }
                   ].map((r, i) => (
                     <div key={i} style={{ padding: '1.2rem', background: 'var(--bg-tertiary)', borderRadius: '12px', borderLeft: `4px solid ${r.color}` }}>
                       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                         <h4 style={{ margin: 0, fontSize: '1rem' }}>{r.role}</h4>
                         <span style={{ fontSize: '0.72rem', fontWeight: '800', padding: '0.2rem 0.5rem', background: `${r.color}20`, color: r.color, borderRadius: '4px' }}>{r.access}</span>
                       </div>
                       <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>{r.desc}</p>
                     </div>
                   ))}
                   <p style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', fontWeight: '700', textAlign: 'center', marginTop: '1rem', cursor: 'pointer' }}>+ Invite New Staff Member</p>
                </div>
              </motion.div>
            )}

            {/* REPORTS */}
            {activeTab === 'reports' && (
              <motion.div key="reports" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <SectionHeader title="Reporting Engine" subtitle="Configure automated report generation." />
                <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                  <InputGroup label="Default Reporting Period">
                    <select value={settings.reportSettings.defaultPeriod} onChange={e => setSettings({...settings, reportSettings: {...settings.reportSettings, defaultPeriod: e.target.value}})} style={iStyle}>
                      <option value="MONTHLY">Monthly Overview</option>
                      <option value="WEEKLY">Weekly Stats</option>
                    </select>
                  </InputGroup>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'var(--bg-tertiary)', borderRadius: '12px' }}>
                    <div>
                      <p style={{ fontWeight: '700', fontSize: '0.85rem', margin: 0 }}>Auto-generate Reports</p>
                      <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: 0 }}>Pre-calculate data for dashboard widgets.</p>
                    </div>
                    <Toggle 
                      enabled={settings.reportSettings.autoGenerateReports} 
                      onClick={() => setSettings({...settings, reportSettings: {...settings.reportSettings, autoGenerateReports: !settings.reportSettings.autoGenerateReports}})} 
                    />
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

const iStyle = { 
  width: '100%', 
  padding: '0.75rem 1rem', 
  borderRadius: '10px', 
  border: '1px solid var(--border-color)', 
  background: 'var(--bg-tertiary)', 
  color: 'var(--text-primary)',
  fontSize: '0.9rem',
  fontWeight: '600',
  outline: 'none',
  transition: 'border-color 0.2s'
};

export default Settings;
