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
      </div>
    </div>
  );
};

export default Signup;
