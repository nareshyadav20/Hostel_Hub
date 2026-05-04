import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import '@packages/ui-kit/auth.css';

const Login = () => {
  const navigate = useNavigate();
  const [showVault, setShowVault] = React.useState(false);
  const [email, setEmail] = React.useState('owner@hostelhub.com');
  const [password, setPassword] = React.useState('owner123');
  const [error, setError] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  
  const performLogin = async (loginEmail, loginPass) => {
    setIsLoading(true);
    setError('');
    try {
      const res = await axios.post('http://localhost:5001/api/auth/login', { email: loginEmail, password: loginPass });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/owner/portfolio');
    } catch (err) {
      // Auto-register the demo owner if they don't exist in the DB yet
      if (err.response?.status === 404 && loginEmail === 'owner@hostelhub.com') {
        try {
          const regRes = await axios.post('http://localhost:5001/api/auth/register', {
            email: loginEmail, password: loginPass, name: 'System Owner', role: 'OWNER'
          });
          localStorage.setItem('token', regRes.data.token);
          localStorage.setItem('user', JSON.stringify(regRes.data.user));
          navigate('/owner/portfolio');
          return;
        } catch (regErr) {
          setError('Failed to auto-create demo user. Please register.');
        }
      } else {
        setError(err.response?.data?.message || 'Invalid credentials');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => { 
    e.preventDefault(); 
    performLogin(email, password);
  };

  const handleQuickFill = () => {
    setEmail('owner@hostelhub.com');
    setPassword('owner123');
    performLogin('owner@hostelhub.com', 'owner123');
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Hostel Owner</h1>
          <p>Sign in to manage your property</p>
        </div>
        
        {error && (
          <div style={{ background: '#FEE2E2', color: '#EF4444', padding: '0.8rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.9rem', textAlign: 'center', fontWeight: 'bold' }}>
            {error}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Owner Email</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
          <button type="submit" className="auth-btn" disabled={isLoading}>
            {isLoading ? 'Authenticating...' : 'Access Dashboard'}
          </button>
        </form>

        <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <button 
            type="button"
            onClick={() => setShowVault(!showVault)}
            style={{ 
              background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.2)', 
              color: '#818cf8', padding: '0.6rem', borderRadius: '8px', width: '100%', 
              fontSize: '0.85rem', cursor: 'pointer', fontWeight: '600'
            }}
          >
            {showVault ? 'Hide Mock Credentials' : 'View Login Access Vault'}
          </button>
          
          {showVault && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              style={{ 
                marginTop: '1rem', padding: '1rem', background: 'rgba(0,0,0,0.2)', 
                borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' 
              }}
            >
              <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.8rem', textAlign: 'center' }}>Demo Account (Owner Portal)</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span style={{ color: '#64748b' }}>Email:</span>
                  <code style={{ color: '#e2e8f0' }}>owner@hostelhub.com</code>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span style={{ color: '#64748b' }}>Pass:</span>
                  <code style={{ color: '#e2e8f0' }}>owner123</code>
                </div>
                <button 
                  type="button"
                  onClick={handleQuickFill}
                  style={{ 
                    marginTop: '0.5rem', background: '#6366f1', color: 'white', border: 'none', 
                    padding: '0.4rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '700' 
                  }}
                >
                  Auto-Login Now
                </button>
              </div>
            </motion.div>
          )}
        </div>

        <div className="auth-footer">
          New owner? <Link to="/signup">Register Property</Link>
        </div>
      </div>
    </div>
  );
};
export default Login;

