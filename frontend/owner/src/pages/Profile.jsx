import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Briefcase, ShieldCheck, CreditCard, BarChart3, Settings, 
  Camera, CheckCircle2, AlertCircle, Upload, Save, X, Phone, Mail, 
  MapPin, Calendar, Building, Hash, FileText, Lock, Bell, Activity,
  Globe, Plus, Trash2, Eye, EyeOff, LayoutDashboard, History, Sparkles,
  Smartphone, Monitor, ChevronRight, ExternalLink, BedDouble, UsersRound
} from 'lucide-react';
import { api } from '../mockData';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [profileData, statsData] = await Promise.all([
        api.getOwnerProfile(),
        api.getOwnerStats()
      ]);
      setProfile(profileData);
      setStats(statsData);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setMessage({ type: 'error', text: 'Failed to load profile data.' });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (section, data) => {
    setSaving(true);
    try {
      const updatedProfile = await api.updateOwnerProfile({ [section]: data });
      setProfile(updatedProfile);
      setMessage({ type: 'success', text: 'Update successful!' });
      setIsEditing(false);
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update.' });
      setTimeout(() => setMessage(null), 3000);
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setSaving(true);
    // Simulate manual upload delay
    setTimeout(async () => {
      const mockUrl = URL.createObjectURL(file);
      await handleUpdate('personalInfo', { ...profile.personalInfo, profilePhotoUrl: mockUrl });
      setMessage({ type: 'success', text: 'Profile photo updated!' });
      setTimeout(() => setMessage(null), 3000);
      setSaving(false);
    }, 1000);
  };

  const handleKYCUpload = async (type, event) => {
    const file = event.target.files[0];
    if (!file) return;

    setSaving(true);
    // Simulate manual upload delay
    setTimeout(async () => {
      const mockUrl = URL.createObjectURL(file);
      try {
        const updatedProfile = await api.updateOwnerDocuments({ name: file.name, type, url: mockUrl });
        setProfile(updatedProfile);
        setMessage({ type: 'success', text: 'Document uploaded successfully!' });
        setTimeout(() => setMessage(null), 3000);
      } catch (error) {
        setMessage({ type: 'error', text: 'Upload failed.' });
        setTimeout(() => setMessage(null), 3000);
      } finally {
        setSaving(false);
      }
    }, 1500);
  };

  const handleSessionLogout = (sessionId) => {
    const updatedSessions = profile.securitySettings.activeSessions.filter(s => s._id !== sessionId);
    handleUpdate('securitySettings', { ...profile.securitySettings, activeSessions: updatedSessions });
    setMessage({ type: 'success', text: 'Session terminated.' });
  };

  const handleDownloadDoc = (url) => {
    window.open(url, '_blank');
    setMessage({ type: 'success', text: 'Download started.' });
  };

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
      <div className="loader">Initializing Module...</div>
    </div>
  );

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={18} /> },
    { id: 'profile', label: 'Identity', icon: <User size={18} /> },
    { id: 'business', label: 'Business', icon: <Briefcase size={18} /> },
    { id: 'kyc', label: 'KYC Docs', icon: <ShieldCheck size={18} /> },
    { id: 'bank', label: 'Bank Details', icon: <CreditCard size={18} /> },
    { id: 'performance', label: 'Performance', icon: <BarChart3 size={18} /> },
    { id: 'security', label: 'Security', icon: <Lock size={18} /> },
  ];

  return (
    <div className="profile-container" style={{ padding: '1.5rem', maxWidth: '1300px', margin: '0 auto' }}>
      {/* Header with Completeness */}
      <div className="card" style={{ padding: '2rem', borderRadius: '24px', marginBottom: '2rem', display: 'flex', gap: '2.5rem', alignItems: 'center', flexWrap: 'wrap', position: 'relative' }}>
        <div style={{ position: 'relative' }}>
          <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: 'var(--bg-tertiary)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: '800', color: 'var(--accent-primary)', border: '4px solid var(--bg-secondary)', boxShadow: 'var(--shadow-lg)' }}>
            {profile?.personalInfo?.profilePhotoUrl ? (
              <img src={profile.personalInfo.profilePhotoUrl} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              profile?.personalInfo?.fullName?.split(' ').map(n => n[0]).join('') || 'O'
            )}
          </div>
          <label 
            htmlFor="profile-photo-input"
            style={{ position: 'absolute', bottom: '0', right: '0', width: '36px', height: '36px', borderRadius: '50%', background: 'var(--accent-primary)', color: 'white', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 12px rgba(99,102,241,0.4)' }}
          >
            <Camera size={18} />
          </label>
          <input 
            id="profile-photo-input" 
            type="file" 
            accept="image/*" 
            style={{ display: 'none' }} 
            onChange={handlePhotoUpload} 
            disabled={saving}
          />
        </div>

        <div style={{ flex: 1, minWidth: '300px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
            <h1 style={{ margin: 0, fontSize: '2.2rem', fontWeight: '900', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>{profile?.personalInfo?.fullName}</h1>
            {profile?.isVerified ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#DCFCE7', color: '#166534', padding: '0.3rem 0.8rem', borderRadius: '100px', fontSize: '0.75rem', fontWeight: '800' }}>
                <CheckCircle2 size={14} /> Verified
              </span>
            ) : (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#FEF3C7', color: '#92400E', padding: '0.3rem 0.8rem', borderRadius: '100px', fontSize: '0.75rem', fontWeight: '800' }}>
                <AlertCircle size={14} /> Pending
              </span>
            )}
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', margin: 0 }}>{profile?.businessDetails?.businessName || 'Property Owner'}</p>
        </div>
        
        <div style={{ minWidth: '280px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--text-muted)' }}>PROFILE STRENGTH</span>
            <span style={{ fontSize: '1rem', fontWeight: '900', color: 'var(--accent-primary)' }}>{profile?.profileCompleteness || 0}%</span>
          </div>
          <div style={{ height: '8px', width: '200px', background: 'var(--bg-tertiary)', borderRadius: '100px', overflow: 'hidden' }}>
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${profile?.profileCompleteness || 0}%` }}
              style={{ height: '100%', background: 'linear-gradient(90deg, var(--accent-primary), #818cf8)' }}
            />
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', background: 'var(--bg-secondary)', padding: '0.5rem', borderRadius: '16px', border: '1px solid var(--border-color)', overflowX: 'auto' }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); setIsEditing(false); }}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.7rem 1.2rem', borderRadius: '12px',
              border: 'none', background: activeTab === tab.id ? 'var(--bg-primary)' : 'transparent',
              color: activeTab === tab.id ? 'var(--accent-primary)' : 'var(--text-secondary)', 
              fontWeight: '800', cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.2s',
              boxShadow: activeTab === tab.id ? 'var(--shadow-sm)' : 'none'
            }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <div style={{ display: 'grid', gridTemplateColumns: activeTab === 'overview' ? '1fr 340px' : '1fr', gap: '2rem' }}>
        <motion.div 
          key={activeTab}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          className="card" 
          style={{ padding: '2.5rem', borderRadius: '24px' }}
        >
          {activeTab === 'overview' && <OverviewTab profile={profile} stats={stats} setActiveTab={setActiveTab} />}
          {activeTab === 'profile' && <ProfileTab profile={profile} onSave={(data) => handleUpdate('personalInfo', data)} isEditing={isEditing} setIsEditing={setIsEditing} saving={saving} />}
          {activeTab === 'business' && <BusinessTab profile={profile} onSave={(data) => handleUpdate('businessDetails', data)} isEditing={isEditing} setIsEditing={setIsEditing} saving={saving} />}
          {activeTab === 'kyc' && <KYCTab profile={profile} onUpload={handleKYCUpload} onDownload={handleDownloadDoc} />}
          {activeTab === 'bank' && <BankTab profile={profile} onSave={(data) => handleUpdate('bankDetails', data)} isEditing={isEditing} setIsEditing={setIsEditing} saving={saving} />}
          {activeTab === 'performance' && <PerformanceTab stats={stats} />}
          {activeTab === 'security' && <SecurityTab profile={profile} onUpdate={(data) => handleUpdate('notificationSettings', data)} onSecurityUpdate={(data) => handleUpdate('securitySettings', data)} onLogoutSession={handleSessionLogout} />}
        </motion.div>

        {activeTab === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <ActivityLog logs={profile.activityLogs || []} />
            <BrandingCard profile={profile} onSave={(data) => handleUpdate('businessDetails', data)} />
          </div>
        )}
      </div>

      {/* Message Toast */}
      <AnimatePresence>
        {message && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            style={{ 
              position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 1000, 
              padding: '1rem 2rem', borderRadius: '12px', background: message.type === 'success' ? '#10B981' : '#EF4444',
              color: 'white', fontWeight: '700', boxShadow: 'var(--shadow-lg)'
            }}
          >
            {message.text}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- SUB-COMPONENTS ---

const OverviewTab = ({ profile, stats, setActiveTab }) => {
  return (
    <div>
      <h2 style={{ fontWeight: '900', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
        <Sparkles color="var(--accent-primary)" /> Profile Summary
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        {[
          { label: 'Hostels', val: stats?.buildingCount, icon: <Building size={20} />, color: '#6366f1' },
          { label: 'Total Capacity', val: stats?.totalBeds, icon: <BedDouble size={20} />, color: '#8b5cf6' },
          { label: 'Active Tenants', val: stats?.occupiedBeds, icon: <UsersRound size={20} />, color: '#10b981' },
          { label: 'Monthly Revenue', val: `₹${(stats?.expectedMonthlyRevenue/1000).toFixed(0)}k`, icon: <CreditCard size={20} />, color: '#f59e0b' }
        ].map((item, i) => (
          <div key={i} className="card" style={{ padding: '1.5rem', background: 'var(--bg-tertiary)', border: 'none', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: `${item.color}20`, color: item.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {item.icon}
            </div>
            <p style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--text-muted)', margin: 0 }}>{item.label}</p>
            <h3 style={{ fontSize: '1.6rem', fontWeight: '900', margin: 0 }}>{item.val || 0}</h3>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem' }}>
        <section>
          <h4 style={{ fontWeight: '800', marginBottom: '1.2rem', color: 'var(--text-muted)' }}>QUICK ACTIONS</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            {[
              { label: 'Complete KYC Verification', tab: 'kyc', icon: <ShieldCheck size={18} /> },
              { label: 'Update Bank Details', tab: 'bank', icon: <CreditCard size={18} /> },
              { label: 'Change Account Password', tab: 'security', icon: <Lock size={18} /> },
              { label: 'View Performance Analytics', tab: 'performance', icon: <BarChart3 size={18} /> }
            ].map((action, i) => (
              <button 
                key={i} 
                onClick={() => setActiveTab(action.tab)}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.2rem', borderRadius: '14px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--accent-primary)'}
                onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ color: 'var(--accent-primary)' }}>{action.icon}</span>
                  {action.label}
                </div>
                <ChevronRight size={18} color="var(--text-muted)" />
              </button>
            ))}
          </div>
        </section>

        <section>
          <h4 style={{ fontWeight: '800', marginBottom: '1.2rem', color: 'var(--text-muted)' }}>PROFILE SUGGESTIONS</h4>
          <div className="card" style={{ padding: '1.5rem', background: '#F0F9FF', border: '1px solid #BAE6FD', borderRadius: '18px' }}>
            <ul style={{ padding: 0, margin: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <li style={{ display: 'flex', gap: '0.8rem', fontSize: '0.9rem', color: '#0369A1', fontWeight: '600' }}>
                <CheckCircle2 size={18} color="#0EA5E9" /> Add your GST number for tax invoices.
              </li>
              <li style={{ display: 'flex', gap: '0.8rem', fontSize: '0.9rem', color: '#0369A1', fontWeight: '600' }}>
                <CheckCircle2 size={18} color="#0EA5E9" /> Upload property proof to get verified.
              </li>
              <li style={{ display: 'flex', gap: '0.8rem', fontSize: '0.9rem', color: '#0369A1', fontWeight: '600' }}>
                <CheckCircle2 size={18} color="#0EA5E9" /> Enable 2FA for better security.
              </li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
};

const ProfileTab = ({ profile, onSave, isEditing, setIsEditing, saving }) => {
  const [formData, setFormData] = useState(profile.personalInfo);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <h2 style={{ margin: 0, fontWeight: '900' }}>Identity & Personal Info</h2>
        {!isEditing ? (
          <button className="btn btn-primary" onClick={() => setIsEditing(true)}>Edit Profile</button>
        ) : (
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn" onClick={() => setIsEditing(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={() => onSave(formData)} disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</button>
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem' }}>
        <div className="input-group">
          <label>Full Legal Name</label>
          <input type="text" disabled={!isEditing} value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} />
        </div>
        <div className="input-group">
          <label>Email ID (Primary)</label>
          <input type="email" disabled={true} value="owner@hostelhub.com" />
        </div>
        <div className="input-group">
          <label>Phone Number</label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input type="text" disabled={!isEditing} value={profile.phone || '+91 9876543210'} style={{ flex: 1 }} />
            {!isEditing && <div style={{ display: 'flex', alignItems: 'center', color: '#10b981', fontSize: '0.75rem', fontWeight: '800' }}><CheckCircle2 size={14} /> VERIFIED</div>}
          </div>
        </div>
        <div className="input-group">
          <label>Date of Birth</label>
          <input type="date" disabled={!isEditing} value={formData.dob?.split('T')[0] || ''} onChange={(e) => setFormData({...formData, dob: e.target.value})} />
        </div>
        <div className="input-group">
          <label>Gender</label>
          <select disabled={!isEditing} value={formData.gender || 'Male'} onChange={(e) => setFormData({...formData, gender: e.target.value})} style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
        </div>
        <div className="input-group">
          <label>Alternate Contact</label>
          <input type="text" disabled={!isEditing} value={formData.alternateContact} onChange={(e) => setFormData({...formData, alternateContact: e.target.value})} />
        </div>
        <div className="input-group" style={{ gridColumn: 'span 2' }}>
          <label>Residential Address</label>
          <textarea rows="3" disabled={!isEditing} value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} />
        </div>
        <div className="input-group" style={{ gridColumn: 'span 2' }}>
          <label>Google Maps Location URL (Optional)</label>
          <input type="url" disabled={!isEditing} value={formData.googleMapUrl} onChange={(e) => setFormData({...formData, googleMapUrl: e.target.value})} placeholder="https://maps.app.goo.gl/..." />
        </div>
      </div>
    </div>
  );
};

const BusinessTab = ({ profile, onSave, isEditing, setIsEditing, saving }) => {
  const [formData, setFormData] = useState(profile.businessDetails);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <h2 style={{ margin: 0, fontWeight: '900' }}>Business Entity Details</h2>
        {!isEditing ? (
          <button className="btn btn-primary" onClick={() => setIsEditing(true)}>Edit Details</button>
        ) : (
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn" onClick={() => setIsEditing(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={() => onSave(formData)} disabled={saving}>Save</button>
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem' }}>
        <div className="input-group">
          <label>Business Name</label>
          <input type="text" disabled={!isEditing} value={formData.businessName} onChange={(e) => setFormData({...formData, businessName: e.target.value})} />
        </div>
        <div className="input-group">
          <label>Business Type</label>
          <select disabled={!isEditing} value={formData.businessType} onChange={(e) => setFormData({...formData, businessType: e.target.value})} style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}>
            <option>Individual</option>
            <option>Company</option>
          </select>
        </div>
        <div className="input-group">
          <label>Years of Experience</label>
          <input type="number" disabled={!isEditing} value={formData.experienceYears} onChange={(e) => setFormData({...formData, experienceYears: e.target.value})} />
        </div>
        <div className="input-group">
          <label>GST Number</label>
          <input type="text" disabled={!isEditing} value={formData.gstNumber} onChange={(e) => setFormData({...formData, gstNumber: e.target.value})} />
        </div>
        <div className="input-group">
          <label>PAN Number (Business)</label>
          <input type="text" disabled={!isEditing} value={formData.panNumber} onChange={(e) => setFormData({...formData, panNumber: e.target.value})} />
        </div>
        <div className="input-group" style={{ gridColumn: 'span 2' }}>
          <label>Registered Office Address</label>
          <textarea rows="2" disabled={!isEditing} value={formData.officeAddress} onChange={(e) => setFormData({...formData, officeAddress: e.target.value})} />
        </div>
      </div>
    </div>
  );
};

const KYCTab = ({ profile, onUpload, onDownload }) => {
  const docs = profile.documents || [];
  return (
    <div>
      <h2 style={{ fontWeight: '900', marginBottom: '2.5rem' }}>KYC & Verification Hub</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
        {[
          { title: 'Government ID', desc: 'Aadhaar Card, Voter ID, or Passport', icon: <Hash size={24} />, id: 'govt-id' },
          { title: 'PAN Card', desc: 'Personal or Business PAN card', icon: <CreditCard size={24} />, id: 'pan-id' },
          { title: 'Property Proof', desc: 'Electricity bill or Registration docs', icon: <Building size={24} />, id: 'property-id' }
        ].map((item, i) => {
          const doc = docs.find(d => d.type === item.title);
          return (
            <div key={i} className="card" style={{ padding: '2rem', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: '20px' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: 'var(--bg-primary)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                {item.icon}
              </div>
              <h4 style={{ margin: '0 0 0.5rem', fontWeight: '800' }}>{item.title}</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>{item.desc}</p>
              
              <input 
                id={`file-input-${item.id}`} 
                type="file" 
                style={{ display: 'none' }} 
                onChange={(e) => onUpload(item.title, e)} 
              />
              
              {doc ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: 'var(--bg-secondary)', borderRadius: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                    <CheckCircle2 size={18} color={doc.status === 'Verified' ? '#10b981' : '#f59e0b'} />
                    <span style={{ fontSize: '0.85rem', fontWeight: '700', color: doc.status === 'Verified' ? '#10b981' : '#f59e0b' }}>{doc.status}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn" onClick={() => onDownload(doc.url)} style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>View</button>
                    <label htmlFor={`file-input-${item.id}`} className="btn" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', cursor: 'pointer' }}>Change</label>
                  </div>
                </div>
              ) : (
                <label htmlFor={`file-input-${item.id}`} className="btn btn-primary" style={{ width: '100%', padding: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Upload size={18} style={{ marginRight: '0.5rem' }} /> Upload Now
                </label>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const BankTab = ({ profile, onSave, isEditing, setIsEditing, saving }) => {
  const [formData, setFormData] = useState(profile.bankDetails);
  const [step, setStep] = useState('view');
  const [otp, setOtp] = useState('');

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <h2 style={{ margin: 0, fontWeight: '900' }}>Payout & Financial Details</h2>
        
        {step === 'view' && <button className="btn btn-primary" onClick={() => setStep('otp')}>Update Details</button>}
        
        {step === 'otp' && (
          <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
            <input type="text" placeholder="Enter OTP (1234)" value={otp} onChange={(e) => setOtp(e.target.value)} style={{ width: '140px', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--accent-primary)' }} />
            <button className="btn btn-primary" onClick={() => otp === '1234' ? setStep('edit') : alert('Use 1234')}>Verify</button>
            <button className="btn" onClick={() => setStep('view')}>Cancel</button>
          </div>
        )}

        {step === 'edit' && (
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn" onClick={() => setStep('view')}>Cancel</button>
            <button className="btn btn-primary" onClick={() => { onSave(formData); setStep('view'); }} disabled={saving}>Save</button>
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem' }}>
        <div className="input-group">
          <label>Account Holder Name</label>
          <input type="text" disabled={step !== 'edit'} value={formData.accountHolderName} onChange={(e) => setFormData({...formData, accountHolderName: e.target.value})} />
        </div>
        <div className="input-group">
          <label>Bank Name</label>
          <input type="text" disabled={step !== 'edit'} value={formData.bankName} onChange={(e) => setFormData({...formData, bankName: e.target.value})} />
        </div>
        <div className="input-group">
          <label>Account Number</label>
          <input type={step === 'edit' ? 'text' : 'password'} disabled={step !== 'edit'} value={formData.accountNumber} onChange={(e) => setFormData({...formData, accountNumber: e.target.value})} />
        </div>
        <div className="input-group">
          <label>IFSC Code</label>
          <input type="text" disabled={step !== 'edit'} value={formData.ifscCode} onChange={(e) => setFormData({...formData, ifscCode: e.target.value})} />
        </div>
      </div>
    </div>
  );
};

const PerformanceTab = ({ stats }) => {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <h2 style={{ margin: 0, fontWeight: '900' }}>Business Performance Analytics</h2>
        <button className="btn btn-primary" onClick={() => alert('Generating detailed performance report...')}>
          <FileText size={18} style={{ marginRight: '0.5rem' }} /> Export Report
        </button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
        {[
          { label: 'Occupancy Rate', val: `${stats?.occupancyRate}%`, color: '#6366f1' },
          { label: 'Monthly Revenue', val: `₹${stats?.expectedMonthlyRevenue?.toLocaleString()}`, color: '#10b981' },
          { label: 'Retention Rate', val: '94.2%', color: '#f59e0b' },
          { label: 'Avg Resolution Time', val: '3.4 hrs', color: '#8b5cf6' }
        ].map((p, i) => (
          <div key={i} className="card" style={{ padding: '2rem', background: 'var(--bg-tertiary)', border: 'none' }}>
            <p style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>{p.label}</p>
            <h3 style={{ fontSize: '2.2rem', fontWeight: '900', color: p.color, margin: 0 }}>{p.val}</h3>
            <div style={{ display: 'flex', gap: '0.4rem', marginTop: '1rem', height: '6px', background: 'var(--border-color)', borderRadius: '100px' }}>
              <div style={{ width: '70%', background: p.color, borderRadius: '100px' }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const SecurityTab = ({ profile, onUpdate, onSecurityUpdate, onLogoutSession }) => {
  const [settings, setSettings] = useState(profile.notificationSettings);

  const toggle = (section, channel) => {
    const updated = { ...settings, [section]: { ...settings[section], [channel]: !settings[section][channel] } };
    setSettings(updated);
    onUpdate(updated);
  };

  const handlePasswordChange = () => {
    alert('A password reset link has been sent to your email.');
  };

  return (
    <div>
      <h2 style={{ fontWeight: '900', marginBottom: '2.5rem' }}>Security & Notifications</h2>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h4 style={{ fontWeight: '800', margin: 0, color: 'var(--text-muted)' }}>CHANGE PASSWORD</h4>
            <button className="btn btn-primary" onClick={handlePasswordChange}>Request Reset Link</button>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>We will send a secure link to your registered email to update your password.</p>
        </section>

        <section style={{ borderTop: '1px solid var(--border-color)', paddingTop: '3rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div>
              <h4 style={{ fontWeight: '800', margin: 0, color: 'var(--text-muted)' }}>TWO-FACTOR AUTHENTICATION (2FA)</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Adds an extra layer of protection to your account.</p>
            </div>
            <div 
              onClick={() => onSecurityUpdate({ ...profile.securitySettings, twoFactorEnabled: !profile.securitySettings.twoFactorEnabled })}
              style={{ width: '56px', height: '30px', borderRadius: '100px', background: profile.securitySettings.twoFactorEnabled ? '#10B981' : '#CBD5E1', position: 'relative', cursor: 'pointer', transition: 'all 0.3s ease' }}
            >
              <div style={{ position: 'absolute', top: '3px', left: profile.securitySettings.twoFactorEnabled ? '29px' : '3px', width: '24px', height: '24px', borderRadius: '50%', background: 'white', transition: 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }} />
            </div>
          </div>
        </section>

        <section style={{ borderTop: '1px solid var(--border-color)', paddingTop: '3rem' }}>
          <h4 style={{ fontWeight: '800', marginBottom: '1.5rem', color: 'var(--text-muted)' }}>ACTIVE SESSIONS</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {(profile.securitySettings.activeSessions || [
              { _id: '1', device: 'Chrome — MacBook Pro', loc: 'Bengaluru, India', ip: '192.168.1.1', type: <Monitor size={18} /> },
              { _id: '2', device: 'Safari — iPhone 15', loc: 'Pune, India', ip: '192.168.1.45', type: <Smartphone size={18} /> }
            ]).map((s, i) => (
              <div key={s._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.2rem', background: 'var(--bg-tertiary)', borderRadius: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ color: 'var(--text-muted)' }}>{s.type || <Globe size={18} />}</div>
                  <div>
                    <p style={{ margin: 0, fontWeight: '800' }}>{s.device}</p>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>{s.loc} • {s.ip}</p>
                  </div>
                </div>
                {i !== 0 && <button onClick={() => onLogoutSession(s._id)} style={{ background: 'none', border: 'none', color: '#ef4444', fontWeight: '800', cursor: 'pointer' }}>Logout</button>}
              </div>
            ))}
          </div>
        </section>

        <section style={{ borderTop: '1px solid var(--border-color)', paddingTop: '3rem' }}>
          <h4 style={{ fontWeight: '800', marginBottom: '1.5rem', color: 'var(--text-muted)' }}>NOTIFICATION CHANNELS</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {Object.keys(settings).map(key => (
              <div key={key} className="card" style={{ padding: '1.5rem', background: 'var(--bg-tertiary)' }}>
                <p style={{ fontWeight: '800', marginBottom: '1rem', textTransform: 'capitalize' }}>{key.replace(/([A-Z])/g, ' $1')}</p>
                <div style={{ display: 'flex', gap: '1.5rem' }}>
                  {['app', 'email', 'sms'].map(chan => (
                    <div key={chan} onClick={() => toggle(key, chan)} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <div style={{ width: '16px', height: '16px', borderRadius: '4px', border: '2px solid var(--accent-primary)', background: settings[key][chan] ? 'var(--accent-primary)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {settings[key][chan] && <CheckCircle2 size={12} color="white" />}
                      </div>
                      <span style={{ fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase' }}>{chan}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section style={{ borderTop: '1px solid var(--border-color)', paddingTop: '3rem' }}>
          <h4 style={{ fontWeight: '800', marginBottom: '1.5rem', color: 'var(--text-muted)' }}>ACTIVE SESSIONS</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[
              { device: 'Chrome — MacBook Pro', loc: 'Bengaluru, India', ip: '192.168.1.1', type: <Monitor size={18} /> },
              { device: 'Safari — iPhone 15', loc: 'Pune, India', ip: '192.168.1.45', type: <Smartphone size={18} /> }
            ].map((s, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.2rem', background: 'var(--bg-tertiary)', borderRadius: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ color: 'var(--text-muted)' }}>{s.type}</div>
                  <div>
                    <p style={{ margin: 0, fontWeight: '800' }}>{s.device}</p>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>{s.loc} • {s.ip}</p>
                  </div>
                </div>
                {i !== 0 && <button style={{ background: 'none', border: 'none', color: '#ef4444', fontWeight: '800', cursor: 'pointer' }}>Logout</button>}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

const ActivityLog = ({ logs }) => {
  return (
    <div className="card" style={{ padding: '2rem', borderRadius: '24px' }}>
      <h3 style={{ fontWeight: '900', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        <History size={20} color="var(--accent-primary)" /> Activity Log
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {(logs.length > 0 ? logs : [
          { action: 'Updated Payout Settings', timestamp: new Date(), type: 'Profile' },
          { action: 'New Property Created', timestamp: new Date(Date.now() - 86400000), type: 'System' },
          { action: 'Login from New Device', timestamp: new Date(Date.now() - 172800000), type: 'Security' }
        ]).map((log, i) => (
          <div key={i} style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ position: 'relative' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: log.type === 'Security' ? '#ef4444' : 'var(--accent-primary)', marginTop: '5px' }} />
              {i !== logs.length - 1 && <div style={{ position: 'absolute', top: '15px', left: '4px', bottom: '-20px', width: '2px', background: 'var(--border-color)' }} />}
            </div>
            <div>
              <p style={{ margin: 0, fontWeight: '800', fontSize: '0.9rem' }}>{log.action}</p>
              <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(log.timestamp).toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const BrandingCard = ({ profile, onSave }) => {
  const [data, setData] = useState(profile.businessDetails);

  return (
    <div className="card" style={{ padding: '2rem', borderRadius: '24px', background: 'linear-gradient(135deg, var(--bg-secondary), var(--bg-tertiary))' }}>
      <h3 style={{ fontWeight: '900', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        <Sparkles size={20} color="#f59e0b" /> Branding
      </h3>
      <div className="input-group" style={{ marginBottom: '1.2rem' }}>
        <label>Logo URL</label>
        <input type="text" value={data.logoUrl || ''} onChange={(e) => setData({...data, logoUrl: e.target.value})} placeholder="https://..." />
      </div>
      <div className="input-group" style={{ marginBottom: '1.2rem' }}>
        <label>Tagline</label>
        <input type="text" value={data.tagline || ''} onChange={(e) => setData({...data, tagline: e.target.value})} placeholder="Premium Living..." />
      </div>
      <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => onSave(data)}>Update Branding</button>
    </div>
  );
};

export default Profile;
