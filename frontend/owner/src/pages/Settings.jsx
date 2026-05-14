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
      width: '44px', height: '24px', background: enabled ? 'var(--accent-primary)' : '#E2E8F0', 
      borderRadius: '12px', padding: '2px', cursor: 'pointer', transition: '0.3s',
      display: 'flex', alignItems: 'center', border: '1px solid #CBD5E1',
      justifyContent: enabled ? 'flex-end' : 'flex-start'
    }}
  >
    <motion.div layout style={{ width: '18px', height: '18px', background: '#fff', borderRadius: '50%', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }} />
  </div>
);

const iStyle = { 
  width: '100%', 
  padding: '1rem 1.2rem', 
  borderRadius: '14px', 
  border: '1px solid #E2E8F0', 
  background: '#F8FAFC', 
  color: '#0F172A',
  fontSize: '0.95rem',
  fontWeight: '700',
  outline: 'none',
  transition: 'all 0.2s',
  boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.02)'
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
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', padding: '1rem', background: '#F8FAFC', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
      {tags.map((tag, i) => (
        <span key={i} style={{ 
          display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.4rem 0.8rem', 
          background: bgColor, color: color, borderRadius: '8px', fontSize: '0.85rem', fontWeight: '800' 
        }}>
          {tag}
          <Trash2 size={12} style={{ cursor: 'pointer', opacity: 0.7 }} onClick={() => handleRemove(tag)} />
        </span>
      ))}
      <div style={{ display: 'flex', gap: '0.5rem', width: '100%', marginTop: '0.5rem' }}>
        <input 
          type="text" 
          value={inputValue} 
          onChange={e => setInputValue(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
          placeholder="Add new..." 
          style={{ ...iStyle, padding: '0.5rem 1rem', fontSize: '0.85rem', flex: 1 }}
        />
        <button onClick={handleAdd} className="btn" style={{ padding: '0.5rem 1rem', background: 'var(--accent-primary)', color: '#fff', borderRadius: '10px' }}>
          <Plus size={16} />
        </button>
      </div>
    </div>
  );
};

const SectionHeader = ({ title, subtitle }) => (
  <div style={{ marginBottom: '2.5rem', borderBottom: '1px solid #F1F5F9', paddingBottom: '1.2rem' }}>
    <h3 style={{ fontSize: '1.4rem', fontWeight: '900', margin: 0, color: '#0F172A' }}>{title}</h3>
    <p style={{ fontSize: '0.9rem', color: '#64748B', marginTop: '0.4rem', fontWeight: '600' }}>{subtitle}</p>
  </div>
);

const InputGroup = ({ label, children, info }) => (
  <div style={{ marginBottom: '1.8rem' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.6rem' }}>
      <label style={{ fontSize: '0.85rem', fontWeight: '800', color: '#475569' }}>{label}</label>
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
      // Ensure buildingId is part of the state for updates
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
      setMsg({ type: 'success', text: 'Settings updated successfully!' });
      setTimeout(() => setMsg({ type: '', text: '' }), 3000);
    } catch (err) {
      setMsg({ type: 'error', text: 'Failed to save settings.' });
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

  if (isLoading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading System Settings...</div>;
  if (!settings) return <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--accent-primary)' }}>Failed to load settings or no settings available.</div>;

  const tabs = [
    { id: 'general', name: 'General', icon: <Building size={18} /> },
    { id: 'rent', name: 'Rent & Payments', icon: <DollarSign size={18} /> },
    { id: 'rooms', name: 'Infrastructure', icon: <LayoutGrid size={18} /> },
    { id: 'notifications', name: 'Notifications', icon: <Bell size={18} /> },
    { id: 'hygiene', name: 'Hygiene', icon: <Utensils size={18} /> },
    { id: 'roles', name: 'Roles & Access', icon: <Shield size={18} /> },
    { id: 'reports', name: 'Reports', icon: <BarChart size={18} /> },
    { id: 'theme', name: 'Theme & UX', icon: <PaintBucket size={18} /> },
  ];

  return (
    <div className="settings-page" style={{ animation: 'fadeIn 0.5s ease-out' }}>
      <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <button 
            onClick={() => navigate(`/owner/building/${activeBuildingId}/dashboard`)}
            className="btn" 
            style={{ padding: '0.6rem 1rem', background: 'var(--bg-tertiary)', borderRadius: '12px', border: '1px solid var(--border-color)', fontWeight: '700' }}
          >
            &larr; Dashboard
          </button>
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: '900', margin: 0, letterSpacing: '-0.02em' }}>System Settings</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Centralized control for hostel operations.</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
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

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* Horizontal Navigation Bar */}
        <div className="card" style={{ 
          padding: '0.6rem', display: 'flex', gap: '0.8rem', borderRadius: '20px', 
          overflowX: 'auto', background: '#FFFFFF', border: '1px solid #E2E8F0',
          scrollbarWidth: 'none', msOverflowStyle: 'none'
        }}>
          {tabs.map((tab) => (
             <button 
               key={tab.id}
               onClick={() => setActiveTab(tab.id)}
               style={{ 
                 display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '0.8rem 1.5rem', 
                 whiteSpace: 'nowrap', fontSize: '0.9rem', fontWeight: activeTab === tab.id ? '900' : '700',
                 background: activeTab === tab.id ? 'var(--accent-primary)' : 'transparent',
                 color: activeTab === tab.id ? '#FFFFFF' : '#64748B',
                 border: 'none', borderRadius: '14px', cursor: 'pointer', transition: '0.3s'
               }}
             >
                {tab.icon}
                {tab.name}
             </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="card" style={{ padding: '3.5rem', borderRadius: '28px', minHeight: '650px', background: '#FFFFFF', border: '1px solid #E2E8F0', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)' }}>
          <AnimatePresence mode="wait">
            
            {/* GENERAL SETTINGS */}
            {activeTab === 'general' && (
              <motion.div key="general" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <SectionHeader title="General Configuration" subtitle="Primary identity and contact information." />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.8rem' }}>
                  <InputGroup label="Hostel Name"><input type="text" value={settings.generalSettings?.hostelName || ''} onChange={e => handleChange('generalSettings', 'hostelName', e.target.value)} style={iStyle} /></InputGroup>
                  <InputGroup label="Owner Name"><input type="text" value={settings.generalSettings?.ownerName || ''} onChange={e => handleChange('generalSettings', 'ownerName', e.target.value)} style={iStyle} /></InputGroup>
                  <InputGroup label="Contact Number"><input type="text" value={settings.generalSettings?.contactNumber || ''} onChange={e => handleChange('generalSettings', 'contactNumber', e.target.value)} style={iStyle} /></InputGroup>
                  <InputGroup label="Contact Email"><input type="email" value={settings.generalSettings?.email || ''} onChange={e => handleChange('generalSettings', 'email', e.target.value)} style={iStyle} /></InputGroup>
                  <div style={{ gridColumn: 'span 2' }}>
                    <InputGroup label="Full Address"><textarea value={settings.generalSettings?.address || ''} onChange={e => handleChange('generalSettings', 'address', e.target.value)} style={{ ...iStyle, height: '100px', resize: 'none' }} /></InputGroup>
                  </div>
                  <InputGroup label="Hostel Logo (URL)"><input type="text" value={settings.generalSettings?.hostelLogo || ''} onChange={e => handleChange('generalSettings', 'hostelLogo', e.target.value)} style={iStyle} /></InputGroup>
                  <InputGroup label="Timezone"><select value={settings.generalSettings?.timezone || 'IST (UTC+5:30)'} onChange={e => handleChange('generalSettings', 'timezone', e.target.value)} style={iStyle}><option>IST (UTC+5:30)</option><option>EST (UTC-5:00)</option><option>GMT (UTC+0:00)</option></select></InputGroup>
                  <InputGroup label="Currency"><input type="text" value={settings.generalSettings?.currency || '₹'} onChange={e => handleChange('generalSettings', 'currency', e.target.value)} style={iStyle} /></InputGroup>
                  <InputGroup label="Language"><select value={settings.generalSettings?.language || 'English'} onChange={e => handleChange('generalSettings', 'language', e.target.value)} style={iStyle}><option>English</option><option>Hindi</option><option>Telugu</option></select></InputGroup>
                </div>
              </motion.div>
            )}

            {/* RENT & PAYMENTS */}
            {activeTab === 'rent' && (
              <motion.div key="rent" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <SectionHeader title="Rent & Financials" subtitle="Configure pricing, due dates, and late fee policies." />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.8rem' }}>
                  <div style={{ gridColumn: 'span 2', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', padding: '1.5rem', background: '#F8FAFC', borderRadius: '16px' }}>
                    <InputGroup label="Default Rent (Single)"><input type="number" value={settings.rentSettings?.defaultRent?.single || 0} onChange={e => handleChange('rentSettings', 'defaultRent', Number(e.target.value), 'single')} style={iStyle} /></InputGroup>
                    <InputGroup label="Default Rent (Double)"><input type="number" value={settings.rentSettings?.defaultRent?.double || 0} onChange={e => handleChange('rentSettings', 'defaultRent', Number(e.target.value), 'double')} style={iStyle} /></InputGroup>
                    <InputGroup label="Default Rent (Shared)"><input type="number" value={settings.rentSettings?.defaultRent?.shared || 0} onChange={e => handleChange('rentSettings', 'defaultRent', Number(e.target.value), 'shared')} style={iStyle} /></InputGroup>
                  </div>
                  <InputGroup label="Rent Cycle"><select value={settings.rentSettings?.rentCycle || 'MONTHLY'} onChange={e => handleChange('rentSettings', 'rentCycle', e.target.value)} style={iStyle}><option value="MONTHLY">Monthly</option><option value="QUARTERLY">Quarterly</option><option value="CUSTOM">Custom</option></select></InputGroup>
                  <InputGroup label="Rent Due Date (Day of Month)"><input type="number" min="1" max="28" value={settings.rentSettings?.rentDueDate || 5} onChange={e => handleChange('rentSettings', 'rentDueDate', Number(e.target.value))} style={iStyle} /></InputGroup>
                  <InputGroup label="Grace Period (Days)"><input type="number" value={settings.rentSettings?.gracePeriodDays || 3} onChange={e => handleChange('rentSettings', 'gracePeriodDays', Number(e.target.value))} style={iStyle} /></InputGroup>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <InputGroup label="Late Fee Type"><select value={settings.rentSettings?.lateFeeType || 'FIXED'} onChange={e => handleChange('rentSettings', 'lateFeeType', e.target.value)} style={iStyle}><option value="FIXED">Fixed</option><option value="PERCENTAGE">Percentage</option></select></InputGroup>
                    <InputGroup label="Value"><input type="number" value={settings.rentSettings?.lateFeeValue || 0} onChange={e => handleChange('rentSettings', 'lateFeeValue', Number(e.target.value))} style={iStyle} /></InputGroup>
                  </div>
                  <InputGroup label="Security Deposit Amount"><input type="number" value={settings.rentSettings?.securityDepositAmount || 0} onChange={e => handleChange('rentSettings', 'securityDepositAmount', Number(e.target.value))} style={iStyle} /></InputGroup>
                  <InputGroup label="Allowed Payment Methods">
                    <EditableTags 
                      tags={settings.rentSettings?.allowedPaymentMethods || []} 
                      onUpdate={newTags => handleChange('rentSettings', 'allowedPaymentMethods', newTags)}
                      color="#8B5CF6" bgColor="#F5F3FF"
                    />
                  </InputGroup>
                  <div style={{ display: 'flex', gap: '2rem', padding: '1.5rem', background: '#F8FAFC', borderRadius: '16px', gridColumn: 'span 2' }}>
                     <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}><Toggle enabled={settings.rentSettings?.autoInvoiceGeneration} onClick={() => handleChange('rentSettings', 'autoInvoiceGeneration', !settings.rentSettings?.autoInvoiceGeneration)} /><span style={{ fontWeight: '700', fontSize: '0.9rem' }}>Auto Invoice Generation</span></div>
                     <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}><Toggle enabled={settings.rentSettings?.allowPartialPayment} onClick={() => handleChange('rentSettings', 'allowPartialPayment', !settings.rentSettings?.allowPartialPayment)} /><span style={{ fontWeight: '700', fontSize: '0.9rem' }}>Allow Partial Payments</span></div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* INFRASTRUCTURE */}
            {activeTab === 'rooms' && (
              <motion.div key="rooms" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <SectionHeader title="Property Infrastructure" subtitle="Configure buildings, floors, and room types." />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
                  <InputGroup label="Total Buildings"><input type="number" value={settings.roomConfig?.totalBuildings || 0} onChange={e => handleChange('roomConfig', 'totalBuildings', Number(e.target.value))} style={iStyle} /></InputGroup>
                  <InputGroup label="Floors / Building"><input type="number" value={settings.roomConfig?.floorsPerBuilding || 0} onChange={e => handleChange('roomConfig', 'floorsPerBuilding', Number(e.target.value))} style={iStyle} /></InputGroup>
                  <InputGroup label="Rooms / Floor"><input type="number" value={settings.roomConfig?.roomsPerFloor || 0} onChange={e => handleChange('roomConfig', 'roomsPerFloor', Number(e.target.value))} style={iStyle} /></InputGroup>
                  <InputGroup label="Beds / Room"><input type="number" value={settings.roomConfig?.bedsPerRoom || 0} onChange={e => handleChange('roomConfig', 'bedsPerRoom', Number(e.target.value))} style={iStyle} /></InputGroup>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                  <InputGroup label="Supported Room Types">
                    <EditableTags 
                      tags={settings.roomConfig?.roomTypes || []} 
                      onUpdate={newTags => handleChange('roomConfig', 'roomTypes', newTags)}
                    />
                  </InputGroup>
                  <InputGroup label="Bed Configuration">
                    <EditableTags 
                      tags={settings.roomConfig?.bedTypes || []} 
                      onUpdate={newTags => handleChange('roomConfig', 'bedTypes', newTags)}
                      color="#10B981" bgColor="#F0FDF4"
                    />
                  </InputGroup>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', background: '#F8FAFC', borderRadius: '16px', gridColumn: 'span 2' }}>
                     <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}><Toggle enabled={settings.roomConfig?.autoCreateRooms} onClick={() => handleChange('roomConfig', 'autoCreateRooms', !settings.roomConfig?.autoCreateRooms)} /><span style={{ fontWeight: '700', fontSize: '0.9rem' }}>Auto Create Rooms on Sync</span></div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* NOTIFICATIONS */}
            {activeTab === 'notifications' && (
              <motion.div key="notif" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <SectionHeader title="Communication Channels" subtitle="Manage automated alerts and notification templates." />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2.5rem' }}>
                  {[
                    { id: 'enableSMS', label: 'SMS Notifications', sub: 'Send critical alerts via text message.' },
                    { id: 'enableEmail', label: 'Email Notifications', sub: 'Standard communication via official email.' },
                    { id: 'enableAppNotifications', label: 'In-App Alerts', sub: 'Real-time dashboard and mobile notifications.' },
                    { id: 'rentReminderEnabled', label: 'Rent Reminders', sub: 'Auto-notify tenants before due date.' },
                    { id: 'complaintAlertEnabled', label: 'Complaint Escalations', sub: 'Alert admins on high-priority tickets.' },
                    { id: 'paymentConfirmationEnabled', label: 'Payment Receipts', sub: 'Instant confirmation after successful payment.' },
                    { id: 'maintenanceAlertsEnabled', label: 'Maintenance Alerts', sub: 'Notify staff on scheduled asset service.' },
                  ].map(item => (
                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', background: '#F8FAFC', borderRadius: '16px', border: '1px solid #F1F5F9' }}>
                      <div><p style={{ fontWeight: '800', fontSize: '0.95rem', margin: 0 }}>{item.label}</p><p style={{ fontSize: '0.8rem', color: '#64748B', margin: 0, fontWeight: '600' }}>{item.sub}</p></div>
                      <Toggle enabled={settings.notificationSettings?.[item.id]} onClick={() => handleChange('notificationSettings', item.id, !settings.notificationSettings?.[item.id])} />
                    </div>
                  ))}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                  <InputGroup label="Rent Due Template"><textarea value={settings.notificationSettings?.notificationTemplates?.rentDue || ''} onChange={e => handleChange('notificationSettings', 'notificationTemplates', e.target.value, 'rentDue')} style={{ ...iStyle, height: '80px', resize: 'none' }} /></InputGroup>
                  <InputGroup label="Payment Success Template"><textarea value={settings.notificationSettings?.notificationTemplates?.paymentSuccess || ''} onChange={e => handleChange('notificationSettings', 'notificationTemplates', e.target.value, 'paymentSuccess')} style={{ ...iStyle, height: '80px', resize: 'none' }} /></InputGroup>
                </div>
              </motion.div>
            )}

            {/* HYGIENE */}
            {activeTab === 'hygiene' && (
              <motion.div key="hygiene" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <SectionHeader title="Hygiene Standards" subtitle="Cleaning frequencies, staff assignments, and checklists." />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                  <InputGroup label="Cleaning Frequency"><select value={settings.hygieneSettings?.cleaningFrequency || 'DAILY'} onChange={e => handleChange('hygieneSettings', 'cleaningFrequency', e.target.value)} style={iStyle}><option value="DAILY">Daily</option><option value="WEEKLY">Weekly</option><option value="BI-WEEKLY">Bi-Weekly</option></select></InputGroup>
                  <InputGroup label="Inspection Schedule"><input type="text" value={settings.hygieneSettings?.inspectionSchedule || ''} onChange={e => handleChange('hygieneSettings', 'inspectionSchedule', e.target.value)} style={iStyle} /></InputGroup>
                  <InputGroup label="Hygiene Threshold (%)"><input type="number" value={settings.hygieneSettings?.hygieneThreshold || 70} onChange={e => handleChange('hygieneSettings', 'hygieneThreshold', Number(e.target.value))} style={iStyle} /></InputGroup>
                  <InputGroup label="Rating Scale (Max)"><input type="number" value={settings.hygieneSettings?.hygieneRatingScale || 5} onChange={e => handleChange('hygieneSettings', 'hygieneRatingScale', Number(e.target.value))} style={iStyle} /></InputGroup>
                  <InputGroup label="Hygiene Checklist Areas">
                    <EditableTags 
                      tags={settings.hygieneSettings?.hygieneChecklist || []} 
                      onUpdate={newTags => handleChange('hygieneSettings', 'hygieneChecklist', newTags)}
                      color="#DB2777" bgColor="#FDF2F8"
                    />
                  </InputGroup>
                  <InputGroup label="Assigned Cleaning Staff">
                    <EditableTags 
                      tags={settings.hygieneSettings?.assignedCleaningStaff || []} 
                      onUpdate={newTags => handleChange('hygieneSettings', 'assignedCleaningStaff', newTags)}
                      color="#4F46E5" bgColor="#EEF2FF"
                    />
                  </InputGroup>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', background: '#F8FAFC', borderRadius: '16px', gridColumn: 'span 2' }}>
                    <span style={{ fontWeight: '800' }}>Enable Direct Issue Reporting</span>
                    <Toggle enabled={settings.hygieneSettings?.issueReportingEnabled} onClick={() => handleChange('hygieneSettings', 'issueReportingEnabled', !settings.hygieneSettings?.issueReportingEnabled)} />
                  </div>
                </div>
              </motion.div>
            )}

            {/* ROLES & PERMISSIONS */}
            {activeTab === 'roles' && (
              <motion.div key="roles" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <SectionHeader title="Access Control" subtitle="Manage permissions and module visibility across roles." />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                   <InputGroup label="Available Roles">
                     <EditableTags 
                       tags={settings.roleAccess?.roles || []} 
                       onUpdate={newTags => handleChange('roleAccess', 'roles', newTags)}
                       color="#3B82F6" bgColor="#EFF6FF"
                     />
                   </InputGroup>
                   <InputGroup label="Module Access">
                     <EditableTags 
                       tags={settings.roleAccess?.permissions?.moduleAccess || []} 
                       onUpdate={newTags => handleChange('roleAccess', 'permissions', newTags, 'moduleAccess')}
                       color="#10B981" bgColor="#F0FDF4"
                     />
                   </InputGroup>
                   <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', background: '#F8FAFC', padding: '2rem', borderRadius: '24px' }}>
                      {[
                        { id: 'viewAccess', label: 'View Access', sub: 'Allow users to view data.' },
                        { id: 'editAccess', label: 'Edit Access', sub: 'Allow users to modify records.' },
                        { id: 'deleteAccess', label: 'Delete Access', sub: 'Allow users to remove records.' },
                        { id: 'approvalRights', label: 'Approval Rights', sub: 'Allow users to approve requests.' },
                      ].map(item => (
                        <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.2rem', background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
                          <div><p style={{ fontWeight: '800', fontSize: '0.95rem', margin: 0 }}>{item.label}</p><p style={{ fontSize: '0.8rem', color: '#64748B', margin: 0 }}>{item.sub}</p></div>
                          <Toggle enabled={settings.roleAccess?.permissions?.[item.id]} onClick={() => handleChange('roleAccess', 'permissions', !settings.roleAccess?.permissions?.[item.id], item.id)} />
                        </div>
                      ))}
                   </div>
                </div>
              </motion.div>
            )}

            {/* REPORTS */}
            {activeTab === 'reports' && (
              <motion.div key="reports" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <SectionHeader title="Analytics & Export" subtitle="Configure report formats and automated generation." />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                  <InputGroup label="Report Frequency"><select value={settings.reportSettings?.reportFrequency || 'MONTHLY'} onChange={e => handleChange('reportSettings', 'reportFrequency', e.target.value)} style={iStyle}><option value="DAILY">Daily</option><option value="WEEKLY">Weekly</option><option value="MONTHLY">Monthly</option></select></InputGroup>
                  <InputGroup label="Export Formats">
                    <EditableTags 
                      tags={settings.reportSettings?.exportFormats || []} 
                      onUpdate={newTags => handleChange('reportSettings', 'exportFormats', newTags)}
                      color="#64748B" bgColor="#F1F5F9"
                    />
                  </InputGroup>
                  <InputGroup label="Report Types" info="Financial, Occupancy, Inventory, etc.">
                    <EditableTags 
                      tags={settings.reportSettings?.reportTypes || []} 
                      onUpdate={newTags => handleChange('reportSettings', 'reportTypes', newTags)}
                      color="#F59E0B" bgColor="#FFFBEB"
                    />
                  </InputGroup>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', background: '#F8FAFC', borderRadius: '16px', gridColumn: 'span 2' }}>
                     <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}><Toggle enabled={settings.reportSettings?.autoReportGeneration} onClick={() => handleChange('reportSettings', 'autoReportGeneration', !settings.reportSettings?.autoReportGeneration)} /><span style={{ fontWeight: '800' }}>Automated Report Pre-calculation</span></div>
                     <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}><Toggle enabled={settings.reportSettings?.emailReportsEnabled} onClick={() => handleChange('reportSettings', 'emailReportsEnabled', !settings.reportSettings?.emailReportsEnabled)} /><span style={{ fontWeight: '800' }}>Weekly Email Summary</span></div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* THEME SETTINGS */}
            {activeTab === 'theme' && (
              <motion.div key="theme" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <SectionHeader title="Look & Feel" subtitle="Customize the dashboard appearance and user interface." />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                  <InputGroup label="Theme Mode">
                    <select 
                      value={settings.themeSettings?.mode || 'LIGHT'} 
                      onChange={e => handleChange('themeSettings', 'mode', e.target.value)} 
                      style={iStyle}
                    >
                      <option value="LIGHT">Light Mode</option>
                      <option value="DARK">Dark Mode</option>
                    </select>
                  </InputGroup>
                  <div style={{ gridColumn: 'span 2', padding: '2rem', background: '#F8FAFC', borderRadius: '24px', textAlign: 'center', color: '#64748B' }}>
                    <PaintBucket size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                    <p style={{ fontWeight: '700' }}>More customization options coming soon!</p>
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
