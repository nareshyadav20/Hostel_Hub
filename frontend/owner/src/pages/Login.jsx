import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { api } from '../api';
import '@packages/ui-kit/auth.css';
import API from '../api/axios';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await axios.post(`${API_URL}/auth/login`, { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/owner/portfolio');
    } catch (err) {
      // Auto-register the demo owner if they don't exist in the DB yet
      if (err.response?.status === 404 && email === 'owner@hostelhub.com') {
        try {
          const regRes = await axios.post(`${API_URL}/auth/register`, {
            email, password, name: 'System Owner', role: 'OWNER'
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
      setLoading(false);
    }
  };



  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Hostel Owner</h1>
          <p>Sign in to manage your property</p>
        </div>

        {error && <div className="error-message" style={{ color: 'var(--accent-error)', textAlign: 'center', marginBottom: '1.5rem', padding: '0.8rem', background: 'rgba(244, 63, 94, 0.1)', borderRadius: '12px', fontSize: '0.9rem'  }}>{error}</div>}

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
          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Accessing...' : 'Access Dashboard'}
          </button>
        </form>



        <div className="auth-footer">
          New owner? <Link to="/signup">Register Property</Link>
        </div>
      </div>
    </div>
  );
};
export default Login;
