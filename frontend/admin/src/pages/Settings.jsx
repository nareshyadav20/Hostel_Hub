import React from 'react';
import { 
  Settings as SettingsIcon, Globe, Shield, CreditCard, 
  Bell, Database, Save, ArrowRight 
} from 'lucide-react';

const Settings = () => {
  return (
    <div className="page-container animate-fade">
      <div className="page-header">
        <div>
          <h1>Global System Settings</h1>
          <p>Configure platform-wide parameters, security protocols, and financial integrations.</p>
        </div>
        <button className="btn btn-primary">
          <Save size={18} /> Commit Configuration
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 2fr)', gap: '2rem' }}>
        {/* Navigation */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
           {[
             { name: 'General Information', icon: <SettingsIcon size={18} />, active: true },
             { name: 'Internationalization', icon: <Globe size={18} />, active: false },
             { name: 'Security & Auth', icon: <Shield size={18} />, active: false },
             { name: 'Payment Gateways', icon: <CreditCard size={18} />, active: false },
             { name: 'Notification Triggers', icon: <Bell size={18} />, active: false },
             { name: 'API & Infrastructure', icon: <Database size={18} />, active: false },
           ].map((item, idx) => (
             <div key={idx} className="card" style={{ 
               padding: '1rem', 
               cursor: 'pointer',
               display: 'flex',
               justifyContent: 'space-between',
               alignItems: 'center',
               border: item.active ? '1px solid var(--accent-primary)' : '1px solid var(--border-color)',
               background: item.active ? 'rgba(251, 191, 36, 0.05)' : 'var(--bg-secondary)'
             }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: item.active ? 'var(--accent-primary)' : 'var(--text-secondary)' }}>
                 {item.icon}
                 <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{item.name}</span>
               </div>
               <ArrowRight size={16} color={item.active ? 'var(--accent-primary)' : 'var(--text-muted)'} />
             </div>
           ))}
        </div>

        {/* Form Area */}
        <div className="card shadow-lg">
          <h3 style={{ marginBottom: '2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>General Platform Configuration</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
            <div className="form-group">
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Platform Name</label>
              <input className="form-control" defaultValue="HostelHub Premium" style={{ width: '100%', padding: '0.8rem', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', borderRadius: '10px', color: '#fff' }} />
            </div>
            <div className="form-group">
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Admin Support Email</label>
              <input className="form-control" defaultValue="admin-nexus@hostelhub.com" style={{ width: '100%', padding: '0.8rem', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', borderRadius: '10px', color: '#fff' }} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
            <div className="form-group">
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Default Currency</label>
              <select className="form-control" style={{ width: '100%', padding: '0.8rem', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', borderRadius: '10px', color: '#fff' }}>
                <option>INR (₹) - Indian Rupee</option>
                <option>USD ($) - United States Dollar</option>
              </select>
            </div>
            <div className="form-group">
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Default Language</label>
              <select className="form-control" style={{ width: '100%', padding: '0.8rem', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', borderRadius: '10px', color: '#fff' }}>
                <option>English (Global)</option>
                <option>Hindi (Localized)</option>
              </select>
            </div>
          </div>

          <hr style={{ margin: '2rem 0', borderColor: 'var(--border-color)' }} />
          
          <h3 style={{ marginBottom: '1.5rem' }}>Maintenance Mode</h3>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.5rem', background: 'rgba(239, 68, 68, 0.05)', borderRadius: '12px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
            <div>
              <h4 style={{ margin: 0, color: '#ef4444' }}>Restrict Public Access</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>When active, only admin IPs can access the application.</p>
            </div>
            <div style={{ width: '50px', height: '26px', background: 'var(--bg-tertiary)', borderRadius: '20px', position: 'relative', cursor: 'pointer' }}>
              <div style={{ position: 'absolute', top: '3px', left: '3px', width: '20px', height: '20px', background: 'var(--text-muted)', borderRadius: '50%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
