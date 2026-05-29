import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import '@packages/ui-kit/auth.css';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@hostelhub.com');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || 'https://livora-hostel-hub-1.onrender.com/api';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await axios.post(`${API_URL}/auth/login`, { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/dashboard');
    } catch (err) {
      // Auto-register the demo admin if they don't exist in the DB yet
      if (err.response?.status === 404 && email === 'admin@hostelhub.com') {
        try {
          const regRes = await axios.post(`${API_URL}/auth/register`, {
            email, password, name: 'System Admin', role: 'SUPER_ADMIN'
          });
          localStorage.setItem('token', regRes.data.token);
          localStorage.setItem('user', JSON.stringify(regRes.data.user));
          navigate('/dashboard');
          return;
        } catch (regErr) {
          setError('Failed to auto-create demo admin. Please register.');
        }
      } else {
        setError(err.response?.data?.message || 'Invalid credentials');
      }
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Admin Portal</h1>
          <p>Sign in to manage the platform</p>
        </div>

        {error && (
          <div 
            className="error-message" 
            style={{ 
              color: 'var(--accent-error, #EF4444)', 
              textAlign: 'center', 
              marginBottom: '1.5rem', 
              padding: '0.8rem', 
              background: 'rgba(239, 68, 68, 0.1)', 
              borderRadius: '12px', 
              fontSize: '0.9rem' 
            }}
          >
            {error}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Admin Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@hostelhub.com" 
              required 
            />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••" 
              required 
            />
          </div>
          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Accessing...' : 'Access Dashboard'}
          </button>
        </form>



        <div className="auth-footer">
          New admin? <Link to="/signup">Register Admin</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
