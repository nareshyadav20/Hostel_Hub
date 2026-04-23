import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '@packages/ui-kit/auth.css';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '', mobile: '', email: '', password: '', age: '', gender: 'Male', occupation: '', idProof: '', emergencyContact: '',
    city: '', budget: '', roommates: '', foodPref: '', sleepTiming: '', language: '', stayDuration: '', shiftTiming: ''
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
            <label>Mobile Number (+ OTP)</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input type="tel" name="mobile" placeholder="10-digit number" onChange={handleChange} required style={{ flex: 1 }} />
              <button type="button" className="btn btn-secondary" style={{ padding: '0 1rem' }}>Get OTP</button>
            </div>
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
            <label>ID Proof (Aadhar / PAN) Upload</label>
            <input type="file" name="idProof" onChange={handleChange} required style={{ padding: '0.6rem' }} />
          </div>

          {/* Smart Profile Features */}
          <div className="input-group" style={{ gridColumn: 'span 2', marginTop: '1rem' }}>
            <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Smart Profile Features</h3>
          </div>

          <div className="input-group">
            <label>Preferred City / Area</label>
            <input type="text" name="city" placeholder="e.g. Indiranagar, Bangalore" onChange={handleChange} required />
          </div>

          <div className="input-group">
            <label>Budget Range</label>
            <select name="budget" onChange={handleChange} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '0.8rem', color: 'var(--text-primary)' }}>
              <option value="">Select Budget</option>
              <option value="5k-8k">₹5,000 - ₹8,000</option>
              <option value="8k-12k">₹8,000 - ₹12,000</option>
              <option value="12k+">₹12,000+</option>
            </select>
          </div>

          <div className="input-group">
            <label>Preferred Roommates</label>
            <select name="roommates" onChange={handleChange} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '0.8rem', color: 'var(--text-primary)' }}>
              <option value="Students">Students</option>
              <option value="Professionals">Working Professionals</option>
              <option value="Any">Doesn't Matter</option>
            </select>
          </div>

          <div className="input-group">
            <label>Food Preference</label>
            <select name="foodPref" onChange={handleChange} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '0.8rem', color: 'var(--text-primary)' }}>
              <option value="Veg">Vegetarian</option>
              <option value="NonVeg">Non-Vegetarian</option>
              <option value="Both">Both</option>
            </select>
          </div>

          <div className="input-group">
            <label>Sleep Timing</label>
            <select name="sleepTiming" onChange={handleChange} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '0.8rem', color: 'var(--text-primary)' }}>
              <option value="Early">Early Bird (before 11 PM)</option>
              <option value="Late">Night Owl (after 12 AM)</option>
            </select>
          </div>

          <div className="input-group">
            <label>Language Preference</label>
            <input type="text" name="language" placeholder="English, Hindi, etc." onChange={handleChange} required />
          </div>

          <div className="input-group">
            <label>Stay Duration</label>
            <select name="stayDuration" onChange={handleChange} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '0.8rem', color: 'var(--text-primary)' }}>
              <option value="1-3">1 - 3 Months</option>
              <option value="3-6">3 - 6 Months</option>
              <option value="6+">6+ Months</option>
            </select>
          </div>

          <div className="input-group">
            <label>Shift Timing (Employees)</label>
            <select name="shiftTiming" onChange={handleChange} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '0.8rem', color: 'var(--text-primary)' }}>
              <option value="Day">Day Shift</option>
              <option value="Night">Night Shift</option>
              <option value="Flexible">Flexible</option>
            </select>
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
