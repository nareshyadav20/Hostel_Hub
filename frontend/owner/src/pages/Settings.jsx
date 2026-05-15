import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Settings as SettingsIcon, Shield, Bell, User, Building, 
  CreditCard, PaintBucket, ToggleLeft, Save, HelpCircle, 
  Trash2, Plus, Info, CheckCircle, AlertTriangle, Users,
  Utensils, BarChart, LayoutGrid, DollarSign, Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../mockData';

const Toggle = ({ enabled, onClick }) => (
  <div 
    onClick={onClick}
    style={{ 
      width: '50px', height: '26px', 
      background: enabled ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : '#E2E8F0', 
      borderRadius: '100px', padding: '3px', cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      display: 'flex', alignItems: 'center',
      justifyContent: enabled ? 'flex-end' : 'flex-start',
      boxShadow: enabled ? '0 4px 12px rgba(99, 102, 241, 0.2)' : 'none'
    }}
  >
    <motion.div 
      layout 
      style={{ 
        width: '20px', height: '20px', background: '#fff', borderRadius: '50%', 
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)' 
      }} 
    />
  </div>
);

const iStyle = { 
  width: '100%', 
  padding: '1.2rem 1.4rem', 
  borderRadius: '16px', 
  border: '1px solid #E2E8F0', 
  background: '#F8FAFC', 
  color: '#0F172A',
  fontSize: '0.95rem',
  fontWeight: '700',
  outline: 'none',
  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.01)'
};

const EditableTags = ({ tags, onUpdate, color = '#3B82F6', bgColor = '#EFF6FF' }) => {
  const [inputValue, setInputValue] = useState('');

  const handleAdd = () => {
    if (inputValue.trim() && !tags.includes(inputValue.trim())) {
      onUpdate([...tags, inputValue.trim()]);
      setInputValue('');
    }
  };

  const handleRemove = (tagToRemove) => {
    onUpdate(tags.filter(t => t !== tagToRemove));
  };

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', padding: '1.2rem', background: '#F8FAFC', borderRadius: '20px', border: '1px solid #E2E8F0' }}>
      <AnimatePresence>
        {tags.map((tag, i) => (
          <motion.span 
            key={tag} 
            initial={{ scale: 0.8, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }} 
            exit={{ scale: 0.8, opacity: 0 }}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.9rem', 
              background: bgColor, color: color, borderRadius: '10px', fontSize: '0.85rem', fontWeight: '800',
              border: `1px solid ${color}20`
            }}
          >
            {tag}
            <Trash2 size={12} style={{ cursor: 'pointer', opacity: 0.7 }} onClick={() => handleRemove(tag)} />
          </motion.span>
        ))}
      </AnimatePresence>
      <div style={{ display: 'flex', gap: '0.6rem', width: '100%', marginTop: '0.4rem' }}>
        <input 
          type="text" 
          value={inputValue} 
          onChange={e => setInputValue(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
          placeholder="Type and press Enter..." 
          style={{ ...iStyle, padding: '0.7rem 1.2rem', fontSize: '0.85rem', flex: 1, background: '#ffffff' }}
        />
        <button onClick={handleAdd} className="btn" style={{ padding: '0.7rem 1.2rem', background: 'var(--accent-primary)', color: '#fff', borderRadius: '12px', border: 'none' }}>
          <Plus size={18} />
        </button>
      </div>
    </div>
  );
};

const SectionHeader = ({ title, subtitle }) => (
  <div style={{ marginBottom: '3rem' }}>
    <h3 style={{ fontSize: '1.8rem', fontWeight: '950', margin: 0, color: '#0F172A', letterSpacing: '-0.02em' }}>{title}</h3>
    <p style={{ fontSize: '0.95rem', color: '#64748B', marginTop: '0.5rem', fontWeight: '600' }}>{subtitle}</p>
    <div style={{ width: '60px', height: '4px', background: 'var(--accent-primary)', borderRadius: '100px', marginTop: '1.5rem', opacity: 0.2 }} />
  </div>
);

const InputGroup = ({ label, children, info }) => (
  <div style={{ marginBottom: '2rem' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.8rem' }}>
      <label style={{ fontSize: '0.9rem', fontWeight: '800', color: '#1E293B' }}>{label}</label>
      {info && <div title={info} style={{ cursor: 'help', color: '#94A3B8' }}><Info size={14}/></div>}
    </div>
    {children}
  </div>
);

const Settings = () => {
  const { buildingId: urlBuildingId } = useParams();
  const activeBuildingId = urlBuildingId || localStorage.getItem('selectedBuildingId');
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('general');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState(null);
  const [msg, setMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    if (activeBuildingId) fetchSettings();
    else setIsLoading(false);
  }, [activeBuildingId]);

  const fetchSettings = async () => {
    try {
      const data = await api.getSettings(activeBuildingId);
      setSettings({ ...data, buildingId: activeBuildingId });
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
      await api.updateSettings(settings, activeBuildingId);
      setMsg({ type: 'success', text: 'Changes deployed successfully!' });
      setTimeout(() => setMsg({ type: '', text: '' }), 3000);
    } catch (err) {
      setMsg({ type: 'error', text: 'Critical: Failed to sync settings.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (section, field, value, subField = null) => {
    setSettings(prev => {
      if (!prev) return prev;
      
      const updatedSection = { ...(prev[section] || {}) };
      
      if (subField) {
        updatedSection[field] = {
          ...(updatedSection[field] || {}),
          [subField]: value
        };
      } else {
        updatedSection[field] = value;
      }
      
      return {
        ...prev,
        [section]: updatedSection
      };
    });
  };

  if (isLoading) return (
    <div style={{ padding: '10rem 2rem', textAlign: 'center' }}>
       <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}>
          <SettingsIcon size={48} color="var(--accent-primary)" opacity={0.3} />
       </motion.div>
       <p style={{ fontWeight: '800', marginTop: '1.5rem', color: 'var(--text-secondary)' }}>Syncing configurations...</p>
    </div>
  );

  if (!settings) return <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--accent-primary)' }}>Configuration layer unreachable.</div>;

  const tabs = [
    { id: 'general', name: 'Identity', icon: <Building size={20} />, sub: 'Core hostel branding' },
    { id: 'rent', name: 'Financials', icon: <DollarSign size={20} />, sub: 'Rent & billing logic' },
    { id: 'rooms', name: 'Infrastructure', icon: <LayoutGrid size={20} />, sub: 'Beds & layouts' },
    { id: 'notifications', name: 'Communication', icon: <Bell size={20} />, sub: 'Alerts & templates' },
    { id: 'hygiene', name: 'Standards', icon: <Utensils size={20} />, sub: 'Cleaning & audits' },
    { id: 'roles', name: 'Permissions', icon: <Shield size={20} />, sub: 'Access control' },
    { id: 'reports', name: 'Intelligence', icon: <BarChart size={20} />, sub: 'Analytics settings' },
    { id: 'theme', name: 'Interface', icon: <PaintBucket size={20} />, sub: 'Visual preferences' },
  ];

  return (
    <div className="settings-page" style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <header style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            onClick={() => navigate(`/owner/building/${activeBuildingId}/dashboard`)}
            style={{ 
              width: '48px', height: '48px', borderRadius: '16px', background: '#ffffff', 
              border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
            }}
          >
            &larr;
          </motion.button>
          <div>
            <h1 style={{ fontSize: '2.4rem', fontWeight: '950', margin: 0, letterSpacing: '-0.03em' }}>System Parameters</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', fontWeight: '600' }}>Fine-tune your hostel's operational logic.</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '1.2rem', alignItems: 'center' }}>
           <AnimatePresence>
             {msg.text && (
               <motion.div initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0 }}
                 style={{ 
                   padding: '0.8rem 1.4rem', borderRadius: '14px', 
                   background: msg.type==='success'?'#DCFCE7':'#FEE2E2', 
                   color: msg.type==='success'?'#10B981':'#EF4444', 
                   fontSize: '0.9rem', fontWeight: '800', border: '1px solid currentColor' 
                 }}>
                 {msg.text}
               </motion.div>
             )}
           </AnimatePresence>
           <button 
             onClick={handleSave} 
             disabled={isSaving} 
             className="btn btn-primary" 
             style={{ 
               padding: '0.9rem 1.8rem', borderRadius: '16px', fontSize: '1rem', fontWeight: '900',
               display: 'flex', alignItems: 'center', gap: '0.8rem'
             }}
           >
             {isSaving ? 'Syncing...' : <><Save size={20} /> Commit Changes</>}
           </button>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '3rem', alignItems: 'start' }}>
        
        {/* Vertical Navigation sidebar */}
        <div className="card" style={{ 
          padding: '1.2rem', borderRadius: '28px', 
          background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.4)',
          position: 'sticky', top: '100px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.02)'
        }}>
          {tabs.map((tab) => (
             <button 
               key={tab.id}
               onClick={() => setActiveTab(tab.id)}
               style={{ 
                 width: '100%', display: 'flex', alignItems: 'center', gap: '1.2rem', padding: '1.2rem', 
                 fontSize: '0.95rem', fontWeight: activeTab === tab.id ? '900' : '700',
                 background: activeTab === tab.id ? 'var(--accent-primary)' : 'transparent',
                 color: activeTab === tab.id ? '#FFFFFF' : '#475569',
                 border: 'none', borderRadius: '20px', cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                 textAlign: 'left', marginBottom: '0.4rem'
               }}
             >
                <div style={{ 
                  padding: '0.6rem', borderRadius: '12px', 
                  background: activeTab === tab.id ? 'rgba(255,255,255,0.2)' : '#F1F5F9',
                  color: activeTab === tab.id ? '#FFFFFF' : '#64748B'
                }}>
                  {tab.icon}
                </div>
                <div>
                   <div style={{ fontSize: '0.95rem' }}>{tab.name}</div>
                   <div style={{ fontSize: '0.75rem', opacity: 0.7, fontWeight: '600' }}>{tab.sub}</div>
                </div>
             </button>
          ))}
        </div>

        {/* Content Area - Premium Panel */}
        <div className="card" style={{ 
          padding: '4rem', borderRadius: '40px', minHeight: '750px', 
          background: '#FFFFFF', border: '1px solid #F1F5F9', 
          boxShadow: '0 30px 70px rgba(0, 0, 0, 0.04)' 
        }}>
          <AnimatePresence mode="wait">
            
            {/* GENERAL SETTINGS */}
            {activeTab === 'general' && (
              <motion.div key="general" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <SectionHeader title="Operational Identity" subtitle="Configure your hostel's public persona and core localization." />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem' }}>
                  <InputGroup label="Hostel Brand Name"><input type="text" value={settings.generalSettings?.hostelName || ''} onChange={e => handleChange('generalSettings', 'hostelName', e.target.value)} style={iStyle} /></InputGroup>
                  <InputGroup label="Authorized Signatory"><input type="text" value={settings.generalSettings?.ownerName || ''} onChange={e => handleChange('generalSettings', 'ownerName', e.target.value)} style={iStyle} /></InputGroup>
                  <InputGroup label="Primary Support Contact"><input type="text" value={settings.generalSettings?.contactNumber || ''} onChange={e => handleChange('generalSettings', 'contactNumber', e.target.value)} style={iStyle} /></InputGroup>
                  <InputGroup label="Administrative Email"><input type="email" value={settings.generalSettings?.email || ''} onChange={e => handleChange('generalSettings', 'email', e.target.value)} style={iStyle} /></InputGroup>
                  <div style={{ gridColumn: 'span 2' }}>
                    <InputGroup label="Registered Address"><textarea value={settings.generalSettings?.address || ''} onChange={e => handleChange('generalSettings', 'address', e.target.value)} style={{ ...iStyle, height: '120px', resize: 'none' }} /></InputGroup>
                  </div>
                  <InputGroup label="Brand Assets (Logo URL)"><input type="text" value={settings.generalSettings?.hostelLogo || ''} onChange={e => handleChange('generalSettings', 'hostelLogo', e.target.value)} style={iStyle} /></InputGroup>
                  <InputGroup label="Local Timezone"><select value={settings.generalSettings?.timezone || 'IST (UTC+5:30)'} onChange={e => handleChange('generalSettings', 'timezone', e.target.value)} style={iStyle}><option>IST (UTC+5:30)</option><option>EST (UTC-5:00)</option><option>GMT (UTC+0:00)</option></select></InputGroup>
                  <InputGroup label="Currency Symbol"><input type="text" value={settings.generalSettings?.currency || '₹'} onChange={e => handleChange('generalSettings', 'currency', e.target.value)} style={iStyle} /></InputGroup>
                  <InputGroup label="Primary Language"><select value={settings.generalSettings?.language || 'English'} onChange={e => handleChange('generalSettings', 'language', e.target.value)} style={iStyle}><option>English</option><option>Hindi</option><option>Telugu</option></select></InputGroup>
                </div>
              </motion.div>
            )}

            {/* RENT & PAYMENTS */}
            {activeTab === 'rent' && (
              <motion.div key="rent" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <SectionHeader title="Financial Protocol" subtitle="Define automated billing cycles and payment compliance policies." />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem' }}>
                  <div style={{ gridColumn: 'span 2', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem', padding: '2rem', background: '#F8FAFC', borderRadius: '24px', border: '1px solid #F1F5F9' }}>
                    <InputGroup label="Single Room Base"><input type="number" value={settings.rentSettings?.defaultRent?.single || 0} onChange={e => handleChange('rentSettings', 'defaultRent', Number(e.target.value), 'single')} style={iStyle} /></InputGroup>
                    <InputGroup label="Double Room Base"><input type="number" value={settings.rentSettings?.defaultRent?.double || 0} onChange={e => handleChange('rentSettings', 'defaultRent', Number(e.target.value), 'double')} style={iStyle} /></InputGroup>
                    <InputGroup label="Shared Room Base"><input type="number" value={settings.rentSettings?.defaultRent?.shared || 0} onChange={e => handleChange('rentSettings', 'defaultRent', Number(e.target.value), 'shared')} style={iStyle} /></InputGroup>
                  </div>
                  <InputGroup label="Billing Cycle"><select value={settings.rentSettings?.rentCycle || 'MONTHLY'} onChange={e => handleChange('rentSettings', 'rentCycle', e.target.value)} style={iStyle}><option value="MONTHLY">Monthly</option><option value="QUARTERLY">Quarterly</option><option value="CUSTOM">Custom</option></select></InputGroup>
                  <InputGroup label="Due Date Threshold (Day)"><input type="number" min="1" max="28" value={settings.rentSettings?.rentDueDate || 5} onChange={e => handleChange('rentSettings', 'rentDueDate', Number(e.target.value))} style={iStyle} /></InputGroup>
                  <InputGroup label="Default Grace Period (Days)"><input type="number" value={settings.rentSettings?.gracePeriodDays || 3} onChange={e => handleChange('rentSettings', 'gracePeriodDays', Number(e.target.value))} style={iStyle} /></InputGroup>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                    <InputGroup label="Late Fee Strategy"><select value={settings.rentSettings?.lateFeeType || 'FIXED'} onChange={e => handleChange('rentSettings', 'lateFeeType', e.target.value)} style={iStyle}><option value="FIXED">Fixed Amount</option><option value="PERCENTAGE">Percentage (%)</option></select></InputGroup>
                    <InputGroup label="Penalty Value"><input type="number" value={settings.rentSettings?.lateFeeValue || 0} onChange={e => handleChange('rentSettings', 'lateFeeValue', Number(e.target.value))} style={iStyle} /></InputGroup>
                  </div>
                  <InputGroup label="Standard Security Deposit"><input type="number" value={settings.rentSettings?.securityDepositAmount || 0} onChange={e => handleChange('rentSettings', 'securityDepositAmount', Number(e.target.value))} style={iStyle} /></InputGroup>
                  <InputGroup label="Accepted Settlement Channels">
                    <EditableTags 
                      tags={settings.rentSettings?.allowedPaymentMethods || []} 
                      onUpdate={newTags => handleChange('rentSettings', 'allowedPaymentMethods', newTags)}
                      color="#8B5CF6" bgColor="#F5F3FF"
                    />
                  </InputGroup>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', padding: '2rem', background: '#F8FAFC', borderRadius: '24px', gridColumn: 'span 2', border: '1px solid #F1F5F9' }}>
                     <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}><Toggle enabled={settings.rentSettings?.autoInvoiceGeneration} onClick={() => handleChange('rentSettings', 'autoInvoiceGeneration', !settings.rentSettings?.autoInvoiceGeneration)} /><span style={{ fontWeight: '800', fontSize: '0.95rem' }}>Autonomous Invoice Generation</span></div>
                     <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}><Toggle enabled={settings.rentSettings?.allowPartialPayment} onClick={() => handleChange('rentSettings', 'allowPartialPayment', !settings.rentSettings?.allowPartialPayment)} /><span style={{ fontWeight: '800', fontSize: '0.95rem' }}>Permit Partial Settlements</span></div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* INFRASTRUCTURE */}
            {activeTab === 'rooms' && (
              <motion.div key="rooms" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <SectionHeader title="Structural Framework" subtitle="Architectural definitions for units, blocks, and inventory." />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2.5rem' }}>
                  <InputGroup label="Blocks/Bldgs"><input type="number" value={settings.roomConfig?.totalBuildings || 0} onChange={e => handleChange('roomConfig', 'totalBuildings', Number(e.target.value))} style={iStyle} /></InputGroup>
                  <InputGroup label="Floors/Block"><input type="number" value={settings.roomConfig?.floorsPerBuilding || 0} onChange={e => handleChange('roomConfig', 'floorsPerBuilding', Number(e.target.value))} style={iStyle} /></InputGroup>
                  <InputGroup label="Units/Floor"><input type="number" value={settings.roomConfig?.roomsPerFloor || 0} onChange={e => handleChange('roomConfig', 'roomsPerFloor', Number(e.target.value))} style={iStyle} /></InputGroup>
                  <InputGroup label="Inventory/Unit"><input type="number" value={settings.roomConfig?.bedsPerRoom || 0} onChange={e => handleChange('roomConfig', 'bedsPerRoom', Number(e.target.value))} style={iStyle} /></InputGroup>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem' }}>
                  <InputGroup label="Authorized Room Classes">
                    <EditableTags 
                      tags={settings.roomConfig?.roomTypes || []} 
                      onUpdate={newTags => handleChange('roomConfig', 'roomTypes', newTags)}
                    />
                  </InputGroup>
                  <InputGroup label="Inventory Classes">
                    <EditableTags 
                      tags={settings.roomConfig?.bedTypes || []} 
                      onUpdate={newTags => handleChange('roomConfig', 'bedTypes', newTags)}
                      color="#10B981" bgColor="#F0FDF4"
                    />
                  </InputGroup>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '2rem', background: '#F8FAFC', borderRadius: '24px', gridColumn: 'span 2', border: '1px solid #F1F5F9' }}>
                     <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}><Toggle enabled={settings.roomConfig?.autoCreateRooms} onClick={() => handleChange('roomConfig', 'autoCreateRooms', !settings.roomConfig?.autoCreateRooms)} /><span style={{ fontWeight: '800', fontSize: '1rem' }}>Autonomous Asset Creation on Sync</span></div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* NOTIFICATIONS */}
            {activeTab === 'notifications' && (
              <motion.div key="notif" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <SectionHeader title="Outreach Channels" subtitle="Manage communication triggers and automated engagement." />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '3rem' }}>
                  {[
                    { id: 'enableSMS', label: 'SMS Gateway', sub: 'Critical text alert integration.' },
                    { id: 'enableEmail', label: 'SMTP Relay', sub: 'Official documentation and logs.' },
                    { id: 'enableAppNotifications', label: 'Push Hub', sub: 'Real-time dashboard engagement.' },
                    { id: 'rentReminderEnabled', label: 'Billing Reminders', sub: 'Automated payment nudge logic.' },
                    { id: 'complaintAlertEnabled', label: 'SLA Escalations', sub: 'Admin alerts for pending tickets.' },
                    { id: 'paymentConfirmationEnabled', label: 'Settlement Proofs', sub: 'Instant receipt generation.' },
                    { id: 'maintenanceAlertsEnabled', label: 'Asset Service', sub: 'Facility management alerts.' },
                  ].map(item => (
                    <motion.div 
                      key={item.id} 
                      whileHover={{ y: -2 }}
                      style={{ 
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
                        padding: '1.8rem', background: '#F8FAFC', borderRadius: '24px', 
                        border: '1px solid #F1F5F9', boxShadow: '0 4px 12px rgba(0,0,0,0.01)'
                      }}
                    >
                      <div>
                        <p style={{ fontWeight: '900', fontSize: '1rem', margin: 0, color: '#1E293B' }}>{item.label}</p>
                        <p style={{ fontSize: '0.8rem', color: '#64748B', margin: '0.2rem 0 0 0', fontWeight: '600' }}>{item.sub}</p>
                      </div>
                      <Toggle enabled={settings.notificationSettings?.[item.id]} onClick={() => handleChange('notificationSettings', item.id, !settings.notificationSettings?.[item.id])} />
                    </motion.div>
                  ))}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem' }}>
                  <InputGroup label="Billing Template (Smart Tags enabled)"><textarea value={settings.notificationSettings?.notificationTemplates?.rentDue || ''} onChange={e => handleChange('notificationSettings', 'notificationTemplates', e.target.value, 'rentDue')} style={{ ...iStyle, height: '100px', resize: 'none' }} /></InputGroup>
                  <InputGroup label="Receipt Template (Smart Tags enabled)"><textarea value={settings.notificationSettings?.notificationTemplates?.paymentSuccess || ''} onChange={e => handleChange('notificationSettings', 'notificationTemplates', e.target.value, 'paymentSuccess')} style={{ ...iStyle, height: '100px', resize: 'none' }} /></InputGroup>
                </div>
              </motion.div>
            )}

            {/* HYGIENE */}
            {activeTab === 'hygiene' && (
              <motion.div key="hygiene" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <SectionHeader title="Compliance & Sanitation" subtitle="Hygiene benchmarks, audit cycles, and staff delegation." />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem' }}>
                  <InputGroup label="Standard Audit Frequency"><select value={settings.hygieneSettings?.cleaningFrequency || 'DAILY'} onChange={e => handleChange('hygieneSettings', 'cleaningFrequency', e.target.value)} style={iStyle}><option value="DAILY">Daily Cycle</option><option value="WEEKLY">Weekly Cycle</option><option value="BI-WEEKLY">Bi-Weekly Cycle</option></select></InputGroup>
                  <InputGroup label="Inspection Protocol"><input type="text" value={settings.hygieneSettings?.inspectionSchedule || ''} onChange={e => handleChange('hygieneSettings', 'inspectionSchedule', e.target.value)} style={iStyle} /></InputGroup>
                  <InputGroup label="Critical Threshold (%)"><input type="number" value={settings.hygieneSettings?.hygieneThreshold || 70} onChange={e => handleChange('hygieneSettings', 'hygieneThreshold', Number(e.target.value))} style={iStyle} /></InputGroup>
                  <InputGroup label="Metric Resolution"><input type="number" value={settings.hygieneSettings?.hygieneRatingScale || 5} onChange={e => handleChange('hygieneSettings', 'hygieneRatingScale', Number(e.target.value))} style={iStyle} /></InputGroup>
                  <InputGroup label="Audit Checkpoints">
                    <EditableTags 
                      tags={settings.hygieneSettings?.hygieneChecklist || []} 
                      onUpdate={newTags => handleChange('hygieneSettings', 'hygieneChecklist', newTags)}
                      color="#DB2777" bgColor="#FDF2F8"
                    />
                  </InputGroup>
                  <InputGroup label="Deployment Staff">
                    <EditableTags 
                      tags={settings.hygieneSettings?.assignedCleaningStaff || []} 
                      onUpdate={newTags => handleChange('hygieneSettings', 'assignedCleaningStaff', newTags)}
                      color="#4F46E5" bgColor="#EEF2FF"
                    />
                  </InputGroup>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '2rem', background: '#F8FAFC', borderRadius: '24px', gridColumn: 'span 2', border: '1px solid #F1F5F9' }}>
                    <span style={{ fontWeight: '900', color: '#1E293B' }}>Autonomous Issue Escalation</span>
                    <Toggle enabled={settings.hygieneSettings?.issueReportingEnabled} onClick={() => handleChange('hygieneSettings', 'issueReportingEnabled', !settings.hygieneSettings?.issueReportingEnabled)} />
                  </div>
                </div>
              </motion.div>
            )}

            {/* ROLES & PERMISSIONS */}
            {activeTab === 'roles' && (
              <motion.div key="roles" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <SectionHeader title="Access Intelligence" subtitle="Granular permission mapping across the system architecture." />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                   <InputGroup label="Authorized Role Schema">
                     <EditableTags 
                       tags={settings.roleAccess?.roles || []} 
                       onUpdate={newTags => handleChange('roleAccess', 'roles', newTags)}
                       color="#3B82F6" bgColor="#EFF6FF"
                     />
                   </InputGroup>
                   <InputGroup label="Global Module Visibility">
                     <EditableTags 
                       tags={settings.roleAccess?.permissions?.moduleAccess || []} 
                       onUpdate={newTags => handleChange('roleAccess', 'permissions', newTags, 'moduleAccess')}
                       color="#10B981" bgColor="#F0FDF4"
                     />
                   </InputGroup>
                   <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', background: '#F8FAFC', padding: '2.5rem', borderRadius: '32px', border: '1px solid #F1F5F9' }}>
                      {[
                        { id: 'viewAccess', label: 'Read Privileges', sub: 'Data visualization rights.' },
                        { id: 'editAccess', label: 'Write Privileges', sub: 'Record modification rights.' },
                        { id: 'deleteAccess', label: 'Purge Privileges', sub: 'Destructive action rights.' },
                        { id: 'approvalRights', label: 'Auth Rights', sub: 'System override & approvals.' },
                      ].map(item => (
                        <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', background: '#FFFFFF', borderRadius: '20px', border: '1px solid #E2E8F0' }}>
                          <div><p style={{ fontWeight: '900', fontSize: '0.95rem', margin: 0 }}>{item.label}</p><p style={{ fontSize: '0.75rem', color: '#64748B', margin: '0.2rem 0 0 0' }}>{item.sub}</p></div>
                          <Toggle enabled={settings.roleAccess?.permissions?.[item.id]} onClick={() => handleChange('roleAccess', 'permissions', !settings.roleAccess?.permissions?.[item.id], item.id)} />
                        </div>
                      ))}
                   </div>
                </div>
              </motion.div>            )}

            {/* REPORTS */}
            {activeTab === 'reports' && (
              <motion.div key="reports" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <SectionHeader title="Intelligence & Analytics" subtitle="Configure automated report generation and data export protocols." />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem' }}>
                  <InputGroup label="Standard Pulse Frequency">
                    <select value={settings.reportSettings?.reportFrequency || 'MONTHLY'} onChange={e => handleChange('reportSettings', 'reportFrequency', e.target.value)} style={iStyle}>
                      <option value="DAILY">Daily Pulse</option>
                      <option value="WEEKLY">Weekly Pulse</option>
                      <option value="MONTHLY">Monthly Pulse</option>
                    </select>
                  </InputGroup>
                  <InputGroup label="Export Protocols">
                    <EditableTags 
                      tags={settings.reportSettings?.exportFormats || []} 
                      onUpdate={newTags => handleChange('reportSettings', 'exportFormats', newTags)}
                      color="#64748B" bgColor="#F1F5F9"
                    />
                  </InputGroup>
                  <InputGroup label="Data Clusters" info="Financial, Occupancy, Inventory, etc.">
                    <EditableTags 
                      tags={settings.reportSettings?.reportTypes || []} 
                      onUpdate={newTags => handleChange('reportSettings', 'reportTypes', newTags)}
                      color="#F59E0B" bgColor="#FFFBEB"
                    />
                  </InputGroup>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '2rem', background: '#F8FAFC', borderRadius: '32px', gridColumn: 'span 2', border: '1px solid #F1F5F9' }}>
                     <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}><Toggle enabled={settings.reportSettings?.autoReportGeneration} onClick={() => handleChange('reportSettings', 'autoReportGeneration', !settings.reportSettings?.autoReportGeneration)} /><span style={{ fontWeight: '900' }}>Autonomous Analytics Pre-calculation</span></div>
                     <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}><Toggle enabled={settings.reportSettings?.emailReportsEnabled} onClick={() => handleChange('reportSettings', 'emailReportsEnabled', !settings.reportSettings?.emailReportsEnabled)} /><span style={{ fontWeight: '900' }}>Weekly Intelligence Email</span></div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* THEME SETTINGS - Coming soon styling */}
            {activeTab === 'theme' && (
              <motion.div key="theme" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <SectionHeader title="Experience Layer" subtitle="Customize the visual telemetry and UI behaviors." />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem' }}>
                  <InputGroup label="Telemetry Mode">
                    <select 
                      value={settings.themeSettings?.mode || 'LIGHT'} 
                      onChange={e => handleChange('themeSettings', 'mode', e.target.value)} 
                      style={iStyle}
                    >
                      <option value="LIGHT">Optic Light</option>
                      <option value="DARK">Quantum Dark</option>
                    </select>
                  </InputGroup>
                  <div style={{ gridColumn: 'span 2', padding: '4rem', background: 'linear-gradient(135deg, #f8faff 0%, #f1f5f9 100%)', borderRadius: '32px', textAlign: 'center', color: '#64748B', border: '1px dashed #CBD5E1' }}>
                    <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 3 }}>
                       <PaintBucket size={64} style={{ margin: '0 auto 1.5rem', opacity: 0.4 }} />
                    </motion.div>
                    <h4 style={{ fontWeight: '900', color: '#1E293B', margin: 0 }}>Custom Shader Engine</h4>
                    <p style={{ fontWeight: '600', marginTop: '0.5rem', fontSize: '0.9rem' }}>Advanced CSS-in-JS customization modules are currently in staging.</p>
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

export default Settings;
