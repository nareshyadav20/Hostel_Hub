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
          <h1>Admin Portal</h1>
          <p>Sign in to manage the platform</p>
        </div>
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Admin Email</label>
            <input type="email" placeholder="admin@hostelhub.com" required />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input type="password" placeholder="????????" required />
          </div>
          <button type="submit" className="auth-btn">Access Dashboard</button>
        </form>
      </div>
    </div>
  );
};
export default Login;

