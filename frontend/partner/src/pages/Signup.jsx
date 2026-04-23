<<<<<<< HEAD
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Mail, Lock, Phone, MapPin, Building2, Eye, EyeOff, User } from 'lucide-react';
import '@packages/ui-kit/auth.css';

const serviceTypes = ['Pharmacy', 'Salon', 'Laundry', 'Grocery', 'Restaurant', 'Gym', 'Medical Clinic', 'Stationery', 'Courier', 'Other'];

const Signup = () => {
  const [form, setForm] = useState({
    name: '', serviceType: '', email: '', phone: '', location: '', password: '', confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const existing = JSON.parse(localStorage.getItem('mock_partners') || '[]');
      if (existing.find(p => p.email === form.email)) {
        setError('Email already registered');
        setLoading(false);
        return;
      }

      const newPartner = { ...form, id: Date.now(), createdAt: new Date().toISOString() };
      delete newPartner.confirmPassword;
      existing.push(newPartner);
      localStorage.setItem('mock_partners', JSON.stringify(existing));
      localStorage.setItem('partner_token', 'partner_token_' + Date.now());
      localStorage.setItem('partner', JSON.stringify(newPartner));
      navigate('/dashboard');
    }, 800);
  };

  const inputStyle = { paddingLeft: '2.8rem' };
  const iconStyle = { position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' };

  return (
    <div className="auth-container">
      <div className="auth-card" style={{ maxWidth: '520px' }}>
        <div className="auth-header">
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
            <div style={{
              width: '56px', height: '56px', borderRadius: '16px',
              background: 'linear-gradient(135deg, #8b5cf6, #a855f7)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 8px 24px rgba(139, 92, 246, 0.3)'
            }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7L12 12L22 7L12 2Z"/>
                <path d="M2 17L12 22L22 17"/>
                <path d="M2 12L12 17L22 12"/>
              </svg>
            </div>
          </div>
          <h1>Partner Registration</h1>
          <p>Join StayNest as a service partner</p>
        </div>

        {error && <div style={{ color: 'var(--accent-error)', textAlign: 'center', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit} id="partner-signup-form">
          <div className="input-group">
            <label>Business / Partner Name</label>
            <div style={{ position: 'relative' }}>
              <input type="text" name="name" placeholder="Your Business Name" value={form.name} onChange={handleChange} required id="signup-name" style={inputStyle} />
              <User size={18} style={iconStyle} />
            </div>
          </div>

          <div className="input-group">
            <label>Service Type</label>
            <div style={{ position: 'relative' }}>
              <select name="serviceType" value={form.serviceType} onChange={handleChange} required id="signup-service-type"
                style={{ ...inputStyle, width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '0.8rem 1.2rem 0.8rem 2.8rem', color: 'var(--text-primary)', fontSize: '1rem', fontFamily: 'inherit' }}>
                <option value="">Select service type</option>
                {serviceTypes.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <Building2 size={18} style={iconStyle} />
            </div>
          </div>

          <div className="input-group">
            <label>Email Address</label>
            <div style={{ position: 'relative' }}>
              <input type="email" name="email" placeholder="partner@example.com" value={form.email} onChange={handleChange} required id="signup-email" style={inputStyle} />
              <Mail size={18} style={iconStyle} />
            </div>
          </div>

          <div className="input-group">
            <label>Phone Number</label>
            <div style={{ position: 'relative' }}>
              <input type="tel" name="phone" placeholder="+91 98765 43210" value={form.phone} onChange={handleChange} required id="signup-phone" style={inputStyle} />
              <Phone size={18} style={iconStyle} />
            </div>
          </div>

          <div className="input-group">
            <label>Location</label>
            <div style={{ position: 'relative' }}>
              <input type="text" name="location" placeholder="City, Area" value={form.location} onChange={handleChange} required id="signup-location" style={inputStyle} />
              <MapPin size={18} style={iconStyle} />
            </div>
          </div>

          <div className="input-group">
            <label>Password</label>
            <div style={{ position: 'relative' }}>
              <input type={showPassword ? 'text' : 'password'} name="password" placeholder="Min 6 characters" value={form.password} onChange={handleChange} required id="signup-password" style={{ ...inputStyle, paddingRight: '2.8rem' }} />
              <Lock size={18} style={iconStyle} />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '0.8rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex' }}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="input-group">
            <label>Confirm Password</label>
            <div style={{ position: 'relative' }}>
              <input type="password" name="confirmPassword" placeholder="••••••••" value={form.confirmPassword} onChange={handleChange} required id="signup-confirm-password" style={inputStyle} />
              <Lock size={18} style={iconStyle} />
            </div>
          </div>

          <button type="submit" className="auth-btn" disabled={loading} id="signup-submit-btn">
            {loading ? 'Creating Account...' : (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
                <UserPlus size={18} /> Create Partner Account
              </span>
            )}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? <Link to="/login">Sign In</Link>
        </div>
=======
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Signup = () => {
  const navigate = useNavigate();

  const handleSignup = (e) => {
    e.preventDefault();
    navigate('/login');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-secondary)', padding: '2rem' }}>
      <div className="card" style={{ width: '100%', maxWidth: '450px', padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '800', margin: '0 0 0.5rem' }}>Become a Partner</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Offer your services to hostels on our platform</p>
        </div>

        <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--text-primary)' }}>Business Name</label>
            <input 
              type="text" 
              required
              placeholder="E.g. Fast Clean Laundry"
              style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', outline: 'none' }} 
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--text-primary)' }}>Email</label>
            <input 
              type="email" 
              required
              placeholder="contact@business.com"
              style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', outline: 'none' }} 
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--text-primary)' }}>Password</label>
            <input 
              type="password" 
              required
              placeholder="Create a strong password"
              style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', outline: 'none' }} 
            />
          </div>
          
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem', padding: '0.875rem' }}>
            Submit Application
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--accent-primary)', fontWeight: '600' }}>Sign In</Link>
        </p>
>>>>>>> staff
      </div>
    </div>
  );
};

export default Signup;
