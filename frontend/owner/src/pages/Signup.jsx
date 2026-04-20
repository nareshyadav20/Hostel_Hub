import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '@packages/ui-kit/auth.css';

const Signup = () => {
  const navigate = useNavigate();
  const handleSubmit = (e) => { e.preventDefault(); navigate('/dashboard'); };
  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Register Property</h1>
          <p>Start managing your hostel digitally</p>
        </div>
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Full Name</label>
            <input type="text" placeholder="John Owner" required />
          </div>
          <div className="input-group">
            <label>Hostel Name</label>
            <input type="text" placeholder="Sunshine Residency" required />
          </div>
          <div className="input-group">
            <label>Email Address</label>
            <input type="email" placeholder="owner@hostel.com" required />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input type="password" placeholder="????????" required />
          </div>
          <button type="submit" className="auth-btn">Create Account</button>
        </form>
        <div className="auth-footer">
          Already have an account? <Link to="/login">Sign In</Link>
        </div>
      </div>
    </div>
  );
};
export default Signup;

