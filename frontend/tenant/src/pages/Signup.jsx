import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import './auth.css';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '', mobile: '', email: '', password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const cleanName = formData.name.trim();
    const cleanEmail = formData.email.trim();
    const cleanPassword = formData.password.trim();
    const cleanPhone = formData.mobile.trim();

    try {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      sessionStorage.clear();

      const searchParams = new URLSearchParams(window.location.search);
      const referralCode = searchParams.get('ref') || '';

      const response = await API.post('/auth/register', {
        name: cleanName,
        email: cleanEmail,
        password: cleanPassword,
        phone: cleanPhone,
        role: 'TENANT',
        referralCode
      });

      const { user, token, tenantProfile } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      if (tenantProfile) {
        localStorage.setItem('tenantProfile', JSON.stringify(tenantProfile));
        if (tenantProfile.buildingId) {
          localStorage.setItem('buildingId', String(tenantProfile.buildingId));
        }
        if (tenantProfile._id) {
          localStorage.setItem('tenantId', String(tenantProfile._id));
        }
      }

      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">

        <button className="auth-close-btn" onClick={() => navigate('/')} aria-label="Close">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div className="auth-header">
          <h1>Create Account</h1>
          <p>Join the community and find your perfect stay</p>
        </div>

        {error && (
          <div style={{ color: 'var(--accent-error)', textAlign: 'center', marginBottom: '1.5rem', padding: '0.8rem', background: 'rgba(244, 63, 94, 0.1)', borderRadius: '12px' }}>
            {error}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Full Name</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </span>
              <input type="text" name="name" placeholder="John Doe" value={formData.name} onChange={handleChange} required style={{ paddingLeft: '3rem' }} />
            </div>
          </div>

          <div className="input-group">
            <label>Email Address</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </span>
              <input type="email" name="email" placeholder="name@example.com" value={formData.email} onChange={handleChange} required style={{ paddingLeft: '3rem' }} />
            </div>
          </div>

          <div className="input-group">
            <label>Mobile Number</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                </span>
                <input type="tel" name="mobile" placeholder="10-digit number" value={formData.mobile} onChange={handleChange} required style={{ paddingLeft: '3rem', width: '100%' }} />
              </div>
              <button type="button" className="otp-btn">Get OTP</button>
            </div>
          </div>

          <div className="input-group">
            <label>Password</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </span>
              <input type="password" name="password" placeholder="••••••••" value={formData.password} onChange={handleChange} required style={{ paddingLeft: '3rem', width: '100%' }} />
            </div>
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
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
