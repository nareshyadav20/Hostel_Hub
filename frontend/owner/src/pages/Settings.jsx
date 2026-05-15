import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Settings as SettingsIcon, Shield, Bell, User, Building, 
  CreditCard, PaintBucket, ToggleLeft, Save, HelpCircle, 
  Trash2, Plus, Info, CheckCircle, AlertTriangle, Users,
  Utensils, BarChart, LayoutGrid, DollarSign, Clock, ArrowLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../mockData';
import './Settings.css';

const Toggle = ({ enabled, onClick }) => (
  <div 
    className={`toggle-switch ${enabled ? 'enabled' : ''}`}
    onClick={onClick}
  >
    <motion.div layout className="toggle-knob" />
  </div>
);

const EditableTags = ({ tags, onUpdate, color = '#4F46E5', bgColor = '#EEF2FF' }) => {
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
    <div className="tag-container">
      {tags.map((tag, i) => (
        <span key={i} className="tag-item" style={{ background: bgColor, color: color }}>
          {tag}
          <Trash2 size={14} className="tag-remove" onClick={() => handleRemove(tag)} />
        </span>
      ))}
      <div style={{ display: 'flex', gap: '0.5rem', width: '100%', marginTop: '0.8rem' }}>
        <input 
          type="text" 
          value={inputValue} 
          className="settings-input"
          style={{ padding: '0.6rem 1rem', fontSize: '0.85rem', flex: 1 }}
          onChange={e => setInputValue(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
          placeholder="Add new tag..." 
        />
        <button onClick={handleAdd} className="save-btn" style={{ padding: '0.5rem 1rem', boxShadow: 'none' }}>
          <Plus size={18} />
        </button>
      </div>
    </div>
  );
};

const SectionHeader = ({ title, subtitle }) => (
  <div className="settings-section-header">
    <h2>{title}</h2>
    <p>{subtitle}</p>
  </div>
);

const InputGroup = ({ label, children, info, fullWidth }) => (
  <div className="input-wrapper" style={{ gridColumn: fullWidth ? 'span 2' : 'span 1' }}>
    <div className="input-label-row">
      <label>{label}</label>
      {info && <div title={info} className="info-icon"><Info size={14}/></div>}
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
      setMsg({ type: 'success', text: 'All changes saved successfully!' });
      setTimeout(() => setMsg({ type: '', text: '' }), 4000);
    } catch (err) {
      setMsg({ type: 'error', text: 'Error saving settings. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (section, field, value, subField = null) => {
    setSettings(prev => {
      if (!prev) return prev;
      const updatedSection = { ...(prev[section] || {}) };
      if (subField) {
        updatedSection[field] = { ...(updatedSection[field] || {}), [subField]: value };
      } else {
        updatedSection[field] = value;
      }
      return { ...prev, [section]: updatedSection };
    });
  };

  if (isLoading) return <div className="loader">Optimizing System Configurations...</div>;
  if (!settings) return <div style={{ padding: '4rem', textAlign: 'center', color: '#EF4444', fontWeight: '800' }}>Failed to synchronize with the management module.</div>;

  const tabs = [
    { id: 'general', name: 'General', icon: <Building size={18} /> },
    { id: 'rent', name: 'Payments', icon: <DollarSign size={18} /> },
    { id: 'rooms', name: 'Infrastructure', icon: <LayoutGrid size={18} /> },
    { id: 'notifications', name: 'Automations', icon: <Bell size={18} /> },
    { id: 'hygiene', name: 'Hygiene', icon: <Utensils size={18} /> },
    { id: 'roles', name: 'Access', icon: <Shield size={18} /> },
    { id: 'reports', name: 'Intelligence', icon: <BarChart size={18} /> },
  ];

  return (
    <div className="settings-page">
      <header className="settings-header">
        <div className="header-left">
          <button 
            onClick={() => navigate(`/owner/building/${activeBuildingId}/dashboard`)}
            className="back-btn"
          >
            <ArrowLeft size={18} /> Dashboard
          </button>
          <div className="settings-title-container">
            <h1>System Intelligence</h1>
            <p>Master control for building operations and automation.</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
           <AnimatePresence>
             {msg.text && (
               <motion.div initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0 }}
                 className={`settings-alert ${msg.type}`}>
                 {msg.type === 'success' ? <CheckCircle size={16} /> : <AlertTriangle size={16} />}
                 {msg.text}
               </motion.div>
             )}
           </AnimatePresence>
           <button onClick={handleSave} disabled={isSaving} className="save-btn">
             {isSaving ? 'Synchronizing...' : <><Save size={18} /> Update System</>}
           </button>
        </div>
      </header>

      <nav className="tabs-container">
        {tabs.map((tab) => (
           <button 
             key={tab.id}
             onClick={() => setActiveTab(tab.id)}
             className={`settings-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
           >
              {tab.icon}
              {tab.name}
           </button>
        ))}
      </nav>

      <div className="settings-card">
        <AnimatePresence mode="wait">
          
          {/* GENERAL */}
          {activeTab === 'general' && (
            <motion.div key="general" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
              <SectionHeader title="Global Configuration" subtitle="Define the core identity of your property." />
              <div className="settings-grid">
                <InputGroup label="Hostel Identity"><input type="text" className="settings-input" value={settings.generalSettings?.hostelName || ''} onChange={e => handleChange('generalSettings', 'hostelName', e.target.value)} /></InputGroup>
                <InputGroup label="Administrative Head"><input type="text" className="settings-input" value={settings.generalSettings?.ownerName || ''} onChange={e => handleChange('generalSettings', 'ownerName', e.target.value)} /></InputGroup>
                <InputGroup label="Primary Contact"><input type="text" className="settings-input" value={settings.generalSettings?.contactNumber || ''} onChange={e => handleChange('generalSettings', 'contactNumber', e.target.value)} /></InputGroup>
                <InputGroup label="Support Email"><input type="email" className="settings-input" value={settings.generalSettings?.email || ''} onChange={e => handleChange('generalSettings', 'email', e.target.value)} /></InputGroup>
                <InputGroup label="Physical Location" fullWidth><textarea className="settings-textarea" value={settings.generalSettings?.address || ''} onChange={e => handleChange('generalSettings', 'address', e.target.value)} style={{ height: '100px' }} /></InputGroup>
                <InputGroup label="Operational Timezone"><select className="settings-select" value={settings.generalSettings?.timezone || 'IST (UTC+5:30)'} onChange={e => handleChange('generalSettings', 'timezone', e.target.value)}><option>IST (UTC+5:30)</option><option>EST (UTC-5:00)</option><option>GMT (UTC+0:00)</option></select></InputGroup>
                <InputGroup label="System Currency"><input type="text" className="settings-input" value={settings.generalSettings?.currency || '₹'} onChange={e => handleChange('generalSettings', 'currency', e.target.value)} /></InputGroup>
              </div>
            </motion.div>
          )}

          {/* RENT */}
          {activeTab === 'rent' && (
            <motion.div key="rent" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
              <SectionHeader title="Financial Protocols" subtitle="Configure automated invoicing and payment handling." />
              <div className="settings-grid">
                <div style={{ gridColumn: 'span 2', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', background: '#F8FAFC', padding: '2rem', borderRadius: '24px', border: '1px solid #E2E8F0', marginBottom: '1rem' }}>
                  <InputGroup label="Single (₹)"><input type="number" className="settings-input" value={settings.rentSettings?.defaultRent?.single || 0} onChange={e => handleChange('rentSettings', 'defaultRent', Number(e.target.value), 'single')} /></InputGroup>
                  <InputGroup label="Double (₹)"><input type="number" className="settings-input" value={settings.rentSettings?.defaultRent?.double || 0} onChange={e => handleChange('rentSettings', 'defaultRent', Number(e.target.value), 'double')} /></InputGroup>
                  <InputGroup label="Shared (₹)"><input type="number" className="settings-input" value={settings.rentSettings?.defaultRent?.shared || 0} onChange={e => handleChange('rentSettings', 'defaultRent', Number(e.target.value), 'shared')} /></InputGroup>
                </div>
                <InputGroup label="Billing Cycle"><select className="settings-select" value={settings.rentSettings?.rentCycle || 'MONTHLY'} onChange={e => handleChange('rentSettings', 'rentCycle', e.target.value)}><option value="MONTHLY">Monthly</option><option value="QUARTERLY">Quarterly</option><option value="CUSTOM">Custom</option></select></InputGroup>
                <InputGroup label="Collection Window (Day)"><input type="number" className="settings-input" value={settings.rentSettings?.rentDueDate || 5} onChange={e => handleChange('rentSettings', 'rentDueDate', Number(e.target.value))} /></InputGroup>
                <InputGroup label="Late Fee Architecture"><select className="settings-select" value={settings.rentSettings?.lateFeeType || 'FIXED'} onChange={e => handleChange('rentSettings', 'lateFeeType', e.target.value)}><option value="FIXED">Fixed Amount</option><option value="PERCENTAGE">Percentage Basis</option></select></InputGroup>
                <InputGroup label="Fee Magnitude"><input type="number" className="settings-input" value={settings.rentSettings?.lateFeeValue || 0} onChange={e => handleChange('rentSettings', 'lateFeeValue', Number(e.target.value))} /></InputGroup>
                <InputGroup label="Accepted Payment Gateways" fullWidth>
                  <EditableTags 
                    tags={settings.rentSettings?.allowedPaymentMethods || []} 
                    onUpdate={newTags => handleChange('rentSettings', 'allowedPaymentMethods', newTags)}
                    color="#8B5CF6" bgColor="#F5F3FF"
                  />
                </InputGroup>
                <div style={{ gridColumn: 'span 2', display: 'flex', gap: '1.5rem' }}>
                   <div className="feature-card" style={{ flex: 1 }}>
                     <div className="feature-info"><h4>Smart Invoicing</h4><p>Auto-generate bills on schedule.</p></div>
                     <Toggle enabled={settings.rentSettings?.autoInvoiceGeneration} onClick={() => handleChange('rentSettings', 'autoInvoiceGeneration', !settings.rentSettings?.autoInvoiceGeneration)} />
                   </div>
                   <div className="feature-card" style={{ flex: 1 }}>
                     <div className="feature-info"><h4>Partial Settlements</h4><p>Allow split payment contributions.</p></div>
                     <Toggle enabled={settings.rentSettings?.allowPartialPayment} onClick={() => handleChange('rentSettings', 'allowPartialPayment', !settings.rentSettings?.allowPartialPayment)} />
                   </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* INFRASTRUCTURE */}
          {activeTab === 'rooms' && (
            <motion.div key="infra" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
              <SectionHeader title="Structural Blueprint" subtitle="Manage building hierarchy and inventory types." />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2.5rem' }}>
                <div className="card" style={{ padding: '1.5rem', background: '#F8FAFC', textAlign: 'center' }}>
                  <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: '800', color: '#64748B' }}>BUILDINGS</p>
                  <input type="number" className="settings-input" style={{ textAlign: 'center', marginTop: '0.5rem' }} value={settings.roomConfig?.totalBuildings || 0} onChange={e => handleChange('roomConfig', 'totalBuildings', Number(e.target.value))} />
                </div>
                <div className="card" style={{ padding: '1.5rem', background: '#F8FAFC', textAlign: 'center' }}>
                  <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: '800', color: '#64748B' }}>FLOORS / B</p>
                  <input type="number" className="settings-input" style={{ textAlign: 'center', marginTop: '0.5rem' }} value={settings.roomConfig?.floorsPerBuilding || 0} onChange={e => handleChange('roomConfig', 'floorsPerBuilding', Number(e.target.value))} />
                </div>
                <div className="card" style={{ padding: '1.5rem', background: '#F8FAFC', textAlign: 'center' }}>
                  <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: '800', color: '#64748B' }}>ROOMS / F</p>
                  <input type="number" className="settings-input" style={{ textAlign: 'center', marginTop: '0.5rem' }} value={settings.roomConfig?.roomsPerFloor || 0} onChange={e => handleChange('roomConfig', 'roomsPerFloor', Number(e.target.value))} />
                </div>
                <div className="card" style={{ padding: '1.5rem', background: '#F8FAFC', textAlign: 'center' }}>
                  <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: '800', color: '#64748B' }}>BEDS / R</p>
                  <input type="number" className="settings-input" style={{ textAlign: 'center', marginTop: '0.5rem' }} value={settings.roomConfig?.bedsPerRoom || 0} onChange={e => handleChange('roomConfig', 'bedsPerRoom', Number(e.target.value))} />
                </div>
              </div>
              <div className="settings-grid">
                <InputGroup label="Unit Classes">
                  <EditableTags tags={settings.roomConfig?.roomTypes || []} onUpdate={newTags => handleChange('roomConfig', 'roomTypes', newTags)} />
                </InputGroup>
                <InputGroup label="Inventory Sub-types">
                  <EditableTags tags={settings.roomConfig?.bedTypes || []} onUpdate={newTags => handleChange('roomConfig', 'bedTypes', newTags)} color="#10B981" bgColor="#F0FDF4" />
                </InputGroup>
                <div className="feature-card" style={{ gridColumn: 'span 2' }}>
                  <div className="feature-info"><h4>Automated Unit Generation</h4><p>Instantly deploy room records upon building synchronization.</p></div>
                  <Toggle enabled={settings.roomConfig?.autoCreateRooms} onClick={() => handleChange('roomConfig', 'autoCreateRooms', !settings.roomConfig?.autoCreateRooms)} />
                </div>
              </div>
            </motion.div>
          )}

          {/* AUTOMATIONS / NOTIFICATIONS */}
          {activeTab === 'notifications' && (
            <motion.div key="auto" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
              <SectionHeader title="Automation Engine" subtitle="Configure system-triggered alerts and event responses." />
              <div className="settings-grid">
                {[
                  { id: 'enableSMS', label: 'SMS Gateway', sub: 'Critical emergency and financial pings.' },
                  { id: 'enableEmail', label: 'Email Server', sub: 'Official documents and monthly reports.' },
                  { id: 'enableAppNotifications', label: 'Push Hub', sub: 'In-app real-time activity stream.' },
                  { id: 'rentReminderEnabled', label: 'Rent Watchdog', sub: 'Auto-reminders 48h before due date.' },
                  { id: 'complaintAlertEnabled', label: 'Escalation Node', sub: 'High-priority ticket admin bypass.' },
                  { id: 'paymentConfirmationEnabled', label: 'Receipt Engine', sub: 'Instant ledger updates for tenants.' },
                ].map(item => (
                  <div key={item.id} className="feature-card">
                    <div className="feature-info"><h4>{item.label}</h4><p>{item.sub}</p></div>
                    <Toggle enabled={settings.notificationSettings?.[item.id]} onClick={() => handleChange('notificationSettings', item.id, !settings.notificationSettings?.[item.id])} />
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* HYGIENE */}
          {activeTab === 'hygiene' && (
            <motion.div key="hygiene" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
              <SectionHeader title="Sanitation Ecosystem" subtitle="Maintain property hygiene through scheduled compliance." />
              <div className="settings-grid">
                <InputGroup label="Service Frequency"><select className="settings-select" value={settings.hygieneSettings?.cleaningFrequency || 'DAILY'} onChange={e => handleChange('hygieneSettings', 'cleaningFrequency', e.target.value)}><option value="DAILY">Daily Intensive</option><option value="WEEKLY">Weekly Deep Clean</option></select></InputGroup>
                <InputGroup label="Compliance Threshold"><input type="number" className="settings-input" value={settings.hygieneSettings?.hygieneThreshold || 70} onChange={e => handleChange('hygieneSettings', 'hygieneThreshold', Number(e.target.value))} /></InputGroup>
                <InputGroup label="Audit Checkpoints" fullWidth>
                  <EditableTags tags={settings.hygieneSettings?.hygieneChecklist || []} onUpdate={newTags => handleChange('hygieneSettings', 'hygieneChecklist', newTags)} color="#DB2777" bgColor="#FDF2F8" />
                </InputGroup>
                <div className="feature-card" style={{ gridColumn: 'span 2' }}>
                  <div className="feature-info"><h4>Tenant Feedback Node</h4><p>Allow direct hygiene escalation from resident portal.</p></div>
                  <Toggle enabled={settings.hygieneSettings?.issueReportingEnabled} onClick={() => handleChange('hygieneSettings', 'issueReportingEnabled', !settings.hygieneSettings?.issueReportingEnabled)} />
                </div>
              </div>
            </motion.div>
          )}

          {/* ACCESS */}
          {activeTab === 'roles' && (
            <motion.div key="access" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
              <SectionHeader title="Permission Matrix" subtitle="Define role-based security and module accessibility." />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                <InputGroup label="Defined Security Roles" fullWidth>
                  <EditableTags tags={settings.roleAccess?.roles || []} onUpdate={newTags => handleChange('roleAccess', 'roles', newTags)} />
                </InputGroup>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', background: '#F8FAFC', padding: '2.5rem', borderRadius: '32px' }}>
                   {[
                     { id: 'viewAccess', label: 'Data Visibility', sub: 'Read-only access to records.' },
                     { id: 'editAccess', label: 'Write Permission', sub: 'Ability to update existing entries.' },
                     { id: 'deleteAccess', label: 'Purge Authority', sub: 'Destructive record management.' },
                     { id: 'approvalRights', label: 'Executive Sign-off', sub: 'Authorize pending workflow tasks.' },
                   ].map(item => (
                     <div key={item.id} className="feature-card" style={{ background: '#FFFFFF' }}>
                       <div className="feature-info"><h4>{item.label}</h4><p>{item.sub}</p></div>
                       <Toggle enabled={settings.roleAccess?.permissions?.[item.id]} onClick={() => handleChange('roleAccess', 'permissions', !settings.roleAccess?.permissions?.[item.id], item.id)} />
                     </div>
                   ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* REPORTS */}
          {activeTab === 'reports' && (
            <motion.div key="intel" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
              <SectionHeader title="Business Intelligence" subtitle="Configure automated analytical streams." />
              <div className="settings-grid">
                <InputGroup label="Pulse Frequency"><select className="settings-select" value={settings.reportSettings?.reportFrequency || 'MONTHLY'} onChange={e => handleChange('reportSettings', 'reportFrequency', e.target.value)}><option value="DAILY">Daily Snapshots</option><option value="WEEKLY">Weekly Analysis</option><option value="MONTHLY">Monthly Overview</option></select></InputGroup>
                <InputGroup label="Supported Exporters"><EditableTags tags={settings.reportSettings?.exportFormats || []} onUpdate={newTags => handleChange('reportSettings', 'exportFormats', newTags)} color="#64748B" bgColor="#F1F5F9" /></InputGroup>
                <div className="feature-card" style={{ gridColumn: 'span 2' }}>
                  <div className="feature-info"><h4>Automated Dispatch</h4><p>Email executive summaries to stakeholders automatically.</p></div>
                  <Toggle enabled={settings.reportSettings?.emailReportsEnabled} onClick={() => handleChange('reportSettings', 'emailReportsEnabled', !settings.reportSettings?.emailReportsEnabled)} />
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
};

export default Settings;
