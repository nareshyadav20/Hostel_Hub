<<<<<<< HEAD
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import '@packages/ui-kit/auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      const storedPartners = JSON.parse(localStorage.getItem('mock_partners') || '[]');
      const partner = storedPartners.find(p => p.email === email && p.password === password);

      if (partner || (email === 'partner@example.com' && password === 'password')) {
        localStorage.setItem('partner_token', 'partner_token_' + Date.now());
        localStorage.setItem('partner', JSON.stringify(partner || { 
          name: 'City Pharmacy', 
          email,
          serviceType: 'Pharmacy',
          phone: '+91 98765 43210',
          location: 'Hyderabad'
        }));
        navigate('/dashboard');
      } else {
        setError('Invalid credentials. Try partner@example.com / password');
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
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
          <h1>Partner Portal</h1>
          <p>Sign in to manage your services</p>
        </div>

        {error && <div style={{ color: 'var(--accent-error)', textAlign: 'center', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit} id="partner-login-form">
          <div className="input-group">
            <label>Email Address</label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                placeholder="partner@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                id="login-email"
                style={{ paddingLeft: '2.8rem' }}
              />
              <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            </div>
          </div>

          <div className="input-group">
            <label>Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                id="login-password"
                style={{ paddingLeft: '2.8rem', paddingRight: '2.8rem' }}
              />
              <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '0.8rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex' }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" className="auth-btn" disabled={loading} id="login-submit-btn">
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
                <span className="spinner" style={{ 
                  width: '18px', height: '18px', border: '2px solid rgba(255,255,255,0.3)', 
                  borderTopColor: 'white', borderRadius: '50%', 
                  animation: 'spin 0.6s linear infinite', display: 'inline-block'
                }}></span>
                Signing In...
              </span>
            ) : (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
                <LogIn size={18} /> Sign In
              </span>
            )}
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account? <Link to="/signup">Register as Partner</Link>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
=======
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-secondary)', padding: '2rem' }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px', padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '800', margin: '0 0 0.5rem' }}>Partner Login</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Welcome back to PartnerHub</p>
        </div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--text-primary)' }}>Email</label>
            <input 
              type="email" 
              required
              placeholder="partner@example.com"
              style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', outline: 'none' }} 
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--text-primary)' }}>Password</label>
            <input 
              type="password" 
              required
              placeholder="••••••••"
              style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', outline: 'none' }} 
            />
          </div>
          
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem', padding: '0.875rem' }}>
            Sign In
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          Don't have a partner account? <Link to="/signup" style={{ color: 'var(--accent-primary)', fontWeight: '600' }}>Apply now</Link>
        </p>
      </div>
>>>>>>> staff
    </div>
  );
};

export default Login;
