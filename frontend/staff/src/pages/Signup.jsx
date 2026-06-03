import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '@packages/ui-kit/auth.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Signup = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'STAFF' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await axios.post(`${API_URL}/auth/register`, formData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Staff Registration</h1>
          <p>Create a new staff account</p>
        </div>
        {error && <div style={{ color: 'var(--accent-error)', textAlign: 'center', marginBottom: '1rem' }}>{error}</div>}
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="input-group"><label>Full Name</label><input type="text" onChange={(e) => setFormData({...formData, name: e.target.value})} required /></div>
          <div className="input-group"><label>Email Address</label><input type="email" onChange={(e) => setFormData({...formData, email: e.target.value})} required /></div>
          <div className="input-group"><label>Password</label><input type="password" onChange={(e) => setFormData({...formData, password: e.target.value})} required /></div>
          <button type="submit" className="auth-btn" disabled={loading}>Register Staff</button>
        </form>
        <div className="auth-footer">Already have an account? <Link to="/login">Sign In</Link></div>
      </div>
    </div>
  );
};
export default Signup;
