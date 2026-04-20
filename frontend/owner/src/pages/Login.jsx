import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '@packages/ui-kit/auth.css';

const Login = () => {
  const navigate = useNavigate();
  const handleSubmit = (e) => { e.preventDefault(); navigate('/dashboard'); };
  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Hostel Owner</h1>
          <p>Sign in to manage your property</p>
        </div>
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Owner Email</label>
            <input type="email" placeholder="owner@hostel.com" required />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input type="password" placeholder="????????" required />
          </div>
          <button type="submit" className="auth-btn">Access Dashboard</button>
        </form>
        <div className="auth-footer">
          New owner? <Link to="/signup">Register Property</Link>
        </div>
      </div>
    </div>
  );
};
export default Login;

