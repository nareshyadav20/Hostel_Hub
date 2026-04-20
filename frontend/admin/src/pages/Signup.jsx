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
          <h1>Register Admin</h1>
          <p>Create a new platform administrator</p>
        </div>
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Full Name</label>
            <input type="text" placeholder="Admin Name" required />
          </div>
          <div className="input-group">
            <label>Email Address</label>
            <input type="email" placeholder="admin@hostelhub.com" required />
          </div>
          <div className="input-group">
            <label>Secret Key</label>
            <input type="password" placeholder="Admin Secret Key" required />
          </div>
          <button type="submit" className="auth-btn">Register Admin</button>
        </form>
        <div className="auth-footer">
          Already registered? <Link to="/login">Sign In</Link>
        </div>
      </div>
    </div>
  );
};
export default Signup;

