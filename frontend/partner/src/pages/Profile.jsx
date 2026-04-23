import React from 'react';

const Profile = () => {
  return (
    <div className="dashboard-container">
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '800' }}>Partner Profile</h1>
        <p>Manage your business details and settings.</p>
      </header>
      
      <div className="card" style={{ maxWidth: '600px' }}>
        <h2 style={{ fontSize: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>Business Information</h2>
        <div style={{ display: 'grid', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--text-secondary)' }}>Business Name</label>
            <input type="text" defaultValue="Premium Laundry Services" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }} readOnly />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--text-secondary)' }}>Contact Email</label>
            <input type="email" defaultValue="partner@example.com" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }} readOnly />
          </div>
          <button className="btn btn-primary" style={{ marginTop: '1rem' }}>Save Changes</button>
        </div>
      </div>
import React, { useState } from 'react';
import { Save, Building2, Mail, Phone, MapPin, User, Camera } from 'lucide-react';

const serviceTypes = ['Pharmacy', 'Salon', 'Laundry', 'Grocery', 'Restaurant', 'Gym', 'Medical Clinic', 'Stationery', 'Courier', 'Other'];

const Profile = () => {
  const stored = JSON.parse(localStorage.getItem('partner') || '{}');
  const [form, setForm] = useState({
    name: stored.name || 'City Pharmacy',
    email: stored.email || 'partner@example.com',
    phone: stored.phone || '+91 98765 43210',
    serviceType: stored.serviceType || 'Pharmacy',
    location: stored.location || 'Hyderabad, Madhapur',
    description: stored.description || 'We provide quick medicine delivery and health checkup services to hostel residents.',
    address: stored.address || '3rd Floor, Tech Park, Madhapur, Hyderabad - 500081',
    website: stored.website || '',
    openHours: stored.openHours || '9:00 AM - 9:00 PM',
  });
  const [saved, setSaved] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = (e) => {
    e.preventDefault();
    const updated = { ...stored, ...form };
    localStorage.setItem('partner', JSON.stringify(updated));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="page-container" id="profile-page">
      <div className="page-header">
        <h1>Profile Management</h1>
        <p>Update your business details and contact information</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '1.5rem' }}>
        {/* Profile Card */}
        <div className="card" style={{ textAlign: 'center', padding: '2rem 1.5rem', alignSelf: 'start' }}>
          <div style={{
            width: '90px', height: '90px', borderRadius: '20px',
            background: 'linear-gradient(135deg, #8b5cf6, #a855f7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1.2rem', color: 'white', fontSize: '2rem', fontWeight: 800,
            boxShadow: '0 10px 30px rgba(139, 92, 246, 0.3)', position: 'relative',
          }}>
            {form.name.charAt(0).toUpperCase()}
            <div style={{
              position: 'absolute', bottom: '-4px', right: '-4px', width: '28px', height: '28px',
              borderRadius: '8px', background: 'var(--bg-secondary)', border: '2px solid var(--border-color)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            }}>
              <Camera size={13} style={{ color: 'var(--text-muted)' }} />
            </div>
          </div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.2rem' }}>{form.name}</h3>
          <span className="badge badge-active" style={{ marginBottom: '0.8rem' }}>{form.serviceType}</span>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            <MapPin size={14} style={{ verticalAlign: 'middle', marginRight: '0.3rem' }} />
            {form.location}
          </p>
          <div style={{ marginTop: '1.2rem', padding: '1rem', background: 'var(--bg-primary)', borderRadius: '14px', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Member Since</div>
            <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.95rem' }}>April 2026</div>
          </div>
        </div>

        {/* Edit Form */}
        <div className="card">
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <User size={20} style={{ color: 'var(--accent-primary)' }} /> Business Details
          </h3>
          <form onSubmit={handleSave} id="profile-form">
            <div className="form-row">
              <div className="form-group">
                <label><Building2 size={14} style={{ verticalAlign: 'middle', marginRight: '0.3rem' }} />Business Name</label>
                <input type="text" name="name" value={form.name} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Service Category</label>
                <select name="serviceType" value={form.serviceType} onChange={handleChange} required>
                  {serviceTypes.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label><Mail size={14} style={{ verticalAlign: 'middle', marginRight: '0.3rem' }} />Email</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label><Phone size={14} style={{ verticalAlign: 'middle', marginRight: '0.3rem' }} />Phone</label>
                <input type="tel" name="phone" value={form.phone} onChange={handleChange} required />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label><MapPin size={14} style={{ verticalAlign: 'middle', marginRight: '0.3rem' }} />Location</label>
                <input type="text" name="location" value={form.location} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Working Hours</label>
                <input type="text" name="openHours" value={form.openHours} onChange={handleChange} placeholder="9:00 AM - 9:00 PM" />
              </div>
            </div>
            <div className="form-group">
              <label>Full Address</label>
              <input type="text" name="address" value={form.address} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Website (optional)</label>
              <input type="url" name="website" value={form.website} onChange={handleChange} placeholder="https://..." />
            </div>
            <div className="form-group">
              <label>Business Description</label>
              <textarea name="description" value={form.description} onChange={handleChange} rows={4} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.8rem', marginTop: '0.5rem' }}>
              {saved && <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--accent-success)', fontWeight: 600, fontSize: '0.9rem' }}>✓ Saved!</span>}
              <button type="submit" className="btn btn-primary" id="save-profile-btn">
                <Save size={18} /> Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          #profile-page > div:last-child { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};

export default Profile;
