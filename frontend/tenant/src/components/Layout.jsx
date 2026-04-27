import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Sidebar from './Sidebar';
import ThemeToggle from './ThemeToggle';
import './Layout.css';

const Layout = ({ children }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isLoggedIn = !!token && !!user.name;

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  const [showProfileModal, setShowProfileModal] = useState(false);
  const [modalData, setModalData] = useState({ gender: 'Male', age: '', occupation: '', locationPref: '', roomPref: 'Double' });

  useEffect(() => {
    if (isLoggedIn && user.profileCompletion === 25) {
      setShowProfileModal(true);
    }
  }, [isLoggedIn, user.profileCompletion]);

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    const updatedUser = { ...user, ...modalData, profileCompletion: 50 };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    const users = JSON.parse(localStorage.getItem('mock_users') || '[]');
    const userIndex = users.findIndex(u => u.email === user.email);
    if (userIndex > -1) {
      users[userIndex] = updatedUser;
      localStorage.setItem('mock_users', JSON.stringify(users));
    }
    setShowProfileModal(false);
    window.location.reload(); 
  };

  return (
    <div className="layout">
      {isLoggedIn && <Sidebar />}
      <main className={isLoggedIn ? "main-content" : "main-content guest"}>
        <header className="content-header">
          <div style={{ flex: 1 }}></div>
          <div className="user-profile">
            <ThemeToggle />
            {isLoggedIn ? (
              <>
                <div className="notifications">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                  </svg>
                </div>
                
                <div className="avatar-container">
                  <div className="avatar" onClick={() => setShowDropdown(!showDropdown)}>
                    {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </div>
                  
                  {showDropdown && (
                    <div className="profile-dropdown glass-card">
                      <div className="dropdown-header">
                        <div className="dropdown-avatar-large">
                          {user.name ? user.name[0].toUpperCase() : 'U'}
                        </div>
                        <div className="dropdown-user-info">
                          <h4>{user.name || 'uma'}</h4>
                          <p>{user.email || 'uma@gmail.com'}</p>
                        </div>
                      </div>
                      <div className="dropdown-divider"></div>
                      
                      {user.profileCompletion && user.profileCompletion < 100 && (
                        <div style={{ padding: '0.8rem 1.2rem', background: 'rgba(255,255,255,0.02)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <span style={{ fontSize: '0.85rem', fontWeight: '700' }}>Setup Progress</span>
                            <span style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--accent-success)' }}>{user.profileCompletion}%</span>
                          </div>
                          <div style={{ width: '100%', height: '6px', background: 'var(--bg-tertiary)', borderRadius: '3px', overflow: 'hidden', marginBottom: '0.8rem' }}>
                            <div style={{ width: `${user.profileCompletion}%`, height: '100%', background: 'linear-gradient(90deg, var(--accent-warning), var(--accent-success))' }}></div>
                          </div>
                          
                          {user.profileCompletion < 50 && (
                            <button className="btn btn-primary" style={{ width: '100%', padding: '0.5rem', fontSize: '0.8rem', fontWeight: '700', borderRadius: '6px' }} onClick={() => { setShowDropdown(false); setShowProfileModal(true); }}>
                              Complete Profile
                            </button>
                          )}
                          {user.profileCompletion === 50 && (
                            <div style={{ fontSize: '0.75rem', color: 'var(--accent-warning)', textAlign: 'center', fontWeight: '600' }}>
                              Next: Book a Room to Verify ID
                            </div>
                          )}
                        </div>
                      )}
                      
                      <div className="dropdown-divider"></div>
                      <button className="dropdown-item" onClick={() => { setShowDropdown(false); setShowProfileModal(true); }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                          <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                        Profile
                      </button>
                      <button className="dropdown-item" onClick={() => { setShowDropdown(false); navigate('/payments'); }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                          <line x1="1" y1="10" x2="23" y2="10"></line>
                        </svg>
                        Payments
                      </button>
                      <div className="dropdown-divider"></div>
                      <button className="dropdown-item logout" onClick={handleLogout}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                          <polyline points="16 17 21 12 16 7"></polyline>
                          <line x1="21" y1="12" x2="9" y2="12"></line>
                        </svg>
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="guest-nav">
                <Link to="/login" className="nav-btn">Sign In</Link>
                <Link to="/signup" className="nav-btn primary">Sign Up</Link>
              </div>
            )}
          </div>
        </header>

        <div className="content-body">{children}</div>

        {showProfileModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(5px)' }}>
            <div className="glass-card fade-in" style={{ width: '100%', maxWidth: '500px', padding: '2.5rem', background: 'var(--bg-secondary)', borderRadius: '24px', border: '1px solid var(--accent-primary)', position: 'relative', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
              <button onClick={() => setShowProfileModal(false)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
              
              <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
                <div style={{ width: '64px', height: '64px', background: 'rgba(14, 165, 233, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', color: 'var(--accent-primary)' }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                </div>
                <h2 style={{ fontSize: '1.8rem', fontWeight: '900', margin: 0 }}>Step 2: Preferences</h2>
                <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Complete your profile to see better matches.</p>
              </div>

              <form onSubmit={handleProfileSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div className="input-group" style={{ flex: 1 }}>
                    <label>Age</label>
                    <input type="number" placeholder="e.g. 22" value={modalData.age} onChange={e => setModalData({...modalData, age: e.target.value})} required style={{ background: 'var(--bg-tertiary)', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)', color: 'white', width: '100%' }} />
                  </div>
                  <div className="input-group" style={{ flex: 1 }}>
                    <label>Gender</label>
                    <select value={modalData.gender} onChange={e => setModalData({...modalData, gender: e.target.value})} style={{ background: 'var(--bg-tertiary)', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)', color: 'white', width: '100%' }}>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="input-group">
                  <label>Occupation</label>
                  <select value={modalData.occupation} onChange={e => setModalData({...modalData, occupation: e.target.value})} required style={{ background: 'var(--bg-tertiary)', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)', color: 'white', width: '100%' }}>
                    <option value="">Select Occupation</option>
                    <option value="Student">Student</option>
                    <option value="Professional">Working Professional</option>
                  </select>
                </div>

                <div className="input-group">
                  <label>Preferred Location</label>
                  <input type="text" placeholder="e.g. Koramangala, Bengaluru" value={modalData.locationPref} onChange={e => setModalData({...modalData, locationPref: e.target.value})} required style={{ background: 'var(--bg-tertiary)', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)', color: 'white', width: '100%' }} />
                </div>

                <div className="input-group">
                  <label>Room Preference</label>
                  <select value={modalData.roomPref} onChange={e => setModalData({...modalData, roomPref: e.target.value})} style={{ background: 'var(--bg-tertiary)', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)', color: 'white', width: '100%' }}>
                    <option value="Single">Single Room</option>
                    <option value="Double">2 Sharing</option>
                    <option value="Triple">3 Sharing</option>
                  </select>
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <button type="button" className="btn btn-secondary" style={{ flex: 1, padding: '1rem' }} onClick={() => setShowProfileModal(false)}>Save & Resume Later</button>
                  <button type="submit" className="btn btn-primary" style={{ flex: 1, padding: '1rem', fontWeight: '800' }}>Complete Step 2</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Layout;
