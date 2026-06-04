import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '@packages/ui-kit/auth.css';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', hostelName: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'https://livora-hostel-hub-1.onrender.com/api';

  const handleSubmit = async (e) => { 
    e.preventDefault(); 
    setIsLoading(true);
    setError('');
    try {
      const res = await axios.post(`${API_URL}/auth/register`, {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: 'OWNER',
        hostelName: formData.hostelName
      });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/owner/portfolio');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Register Property</h1>
          <p>Start managing your hostel digitally</p>
        </div>

        {error && (
          <div style={{ background: '#FEE2E2', color: '#EF4444', padding: '0.8rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.9rem', textAlign: 'center', fontWeight: 'bold'  }}>
            {error}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Full Name</label>
            <input 
              type="text" 
              placeholder="John Owner" 
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required 
            />
          </div>
          <div className="input-group">
            <label>Hostel Name</label>
            <input 
              type="text" 
              placeholder="Sunshine Residency" 
              value={formData.hostelName}
              onChange={(e) => setFormData({ ...formData, hostelName: e.target.value })}
              required 
            />
          </div>
          <div className="input-group">
            <label>Email Address</label>
            <input 
              type="email" 
              placeholder="owner@hostel.com" 
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required 
            />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required 
            />
          </div>
          <button type="submit" className="auth-btn" disabled={isLoading}>
            {isLoading ? 'Creating Account...' : 'Create Account'}
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

