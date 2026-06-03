import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '@packages/ui-kit/auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
            const storedUsers = JSON.parse(localStorage.getItem('staff_users') || '[]');
      const user = storedUsers.find(u => u.email === email && u.password === password);
  
      if (user || (email === 'staff@example.com' && password === 'password')) {
        const loggedUser = user || { name: 'Staff Member', email };
        localStorage.setItem('token', 'mock_token_' + Date.now());
        localjkkjkkjjjjjjjjjjjjk 
        torage.setItem('user', JSON.stringify(loggedUser));
        navigate('/dashboard');
      } else {
        setError('Invalid credentials. (Try staff@example.com / password)');
      }
      setLoading(false);
    }, 800);
  };
 
  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Staff Portal</h1>
          <p>Sign in to manage operations</p>
        </div>
        {error && <div style={{ color: 'var(--accent-error)', textAlign: 'center', marginBottom: '1rem' }}>{error}</div>}
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email Address</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
        <div className="auth-footer">Don't have an account? <Link to="/signup">Register Staff</Link></div>
      </div>
    </div>
  );
};
export default Login;
