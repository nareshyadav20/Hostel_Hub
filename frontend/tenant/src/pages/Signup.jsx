import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '@packages/ui-kit/auth.css';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', age: '', gender: 'Male', occupation: '', idProof: '', emergencyContact: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Mock Signup Logic
    setTimeout(() => {
      const storedUsers = JSON.parse(localStorage.getItem('mock_users') || '[]');
      
      if (storedUsers.some(u => u.email === formData.email)) {
        setError('Email already registered.');
        setLoading(false);
        return;
      }

      const newUser = { ...formData, id: Date.now() };
      storedUsers.push(newUser);
      localStorage.setItem('mock_users', JSON.stringify(storedUsers));
      
      localStorage.setItem('token', 'mock_token_' + Date.now());
      localStorage.setItem('user', JSON.stringify(newUser));
      
      navigate('/dashboard');
      setLoading(false);
    }, 800);
  };

  return (
    <div className="auth-container" style={{ padding: '2rem 0' }}>
      <div className="auth-card" style={{ maxWidth: '600px' }}>
        <div className="auth-header">
          <h1>Create Account</h1>
          <p>Join the StayNest community</p>
        </div>

        {error && <div style={{ color: 'var(--accent-error)', textAlign: 'center', marginBottom: '1rem' }}>{error}</div>}
        
        <form className="auth-form" onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="input-group" style={{ gridColumn: 'span 2' }}>
            <label>Full Name</label>
            <input type="text" name="name" placeholder="John Doe" onChange={handleChange} required />
          </div>

          <div className="input-group">
            <label>Email Address</label>
            <input type="email" name="email" placeholder="name@example.com" onChange={handleChange} required />
          </div>
          
          <div className="input-group">
            <label>Password</label>
            <input type="password" name="password" placeholder="••••••••" onChange={handleChange} required />
          </div>

          <div className="input-group">
            <label>Age</label>
            <input type="number" name="age" placeholder="22" onChange={handleChange} required />
          </div>

          <div className="input-group">
            <label>Gender</label>
            <select name="gender" onChange={handleChange} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '0.8rem', color: 'var(--text-primary)' }}>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="input-group">
            <label>Occupation</label>
            <input type="text" name="occupation" placeholder="Student / Employee" onChange={handleChange} required />
          </div>

          <div className="input-group">
            <label>Emergency Contact</label>
            <input type="text" name="emergencyContact" placeholder="+91 98765 43210" onChange={handleChange} required />
          </div>

          <div className="input-group" style={{ gridColumn: 'span 2' }}>
            <label>ID Proof (Aadhar / PAN)</label>
            <input type="text" name="idProof" placeholder="Enter ID Number" onChange={handleChange} required />
          </div>
          
          <button type="submit" className="auth-btn" style={{ gridColumn: 'span 2' }} disabled={loading}>
            {loading ? 'Creating Account...' : 'Sign Up'}
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
