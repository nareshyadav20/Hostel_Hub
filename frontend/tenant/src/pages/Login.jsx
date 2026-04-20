import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '@packages/ui-kit/auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Mock Login Logic
    setTimeout(() => {
      const storedUsers = JSON.parse(localStorage.getItem('mock_users') || '[]');
      const user = storedUsers.find(u => u.email === email && u.password === password);

      if (user || (email === 'tenant@example.com' && password === 'password')) {
        localStorage.setItem('token', 'mock_token_' + Date.now());
        localStorage.setItem('user', JSON.stringify(user || { name: 'Demo Tenant', email }));
        navigate('/dashboard');
      } else {
        setError('Invalid email or password. (Try tenant@example.com / password)');
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Welcome Back</h1>
          <p>Sign in to your Tenant Portal</p>
        </div>
        
        {error && <div style={{ color: 'var(--accent-error)', textAlign: 'center', marginBottom: '1rem' }}>{error}</div>}
        
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email Address</label>
            <input 
              type="email" 
              placeholder="name@example.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          
          <div className="input-group">
            <label>Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
          
          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
        
        <div className="auth-footer">
          Don't have an account? <Link to="/signup">Create account</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
