import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import ThemeToggle from './ThemeToggle';
import BottomNav from './BottomNav';
import './Layout.css';

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isLoggedIn = !!token && !!user.name;

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = React.useRef(null);
  const [modalData, setModalData] = useState({ gender: 'Male', age: '', occupation: '', locationPref: '', roomPref: 'Double' });

  useEffect(() => {
    if (isLoggedIn && user.profileCompletion === 25) {
      setShowProfileModal(true);
    }
  }, [isLoggedIn, user.profileCompletion]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

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
    <div className="layout-root">
      {isLoggedIn && <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />}
      {isSidebarOpen && <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)}></div>}
      
      <main className={isLoggedIn ? "main-content" : "main-content guest"}>
        <header className="content-header">
          {isLoggedIn && (
            <button className="hamburger-btn" onClick={toggleSidebar}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
          )}

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
                
                <div className="avatar-container" ref={dropdownRef}>
                  <div className="profile-mini-box" onClick={() => setShowDropdown(!showDropdown)}>
                    <div className="profile-text">
                      <span className="p-name">{user.name || 'Guest User'}</span>
                      <span className="p-role">Premium Resident</span>
                    </div>
                    <div className="profile-avatar">
                      <img
                        src={user.profileImage || `https://ui-avatars.com/api/?name=${user.name || 'User'}&background=10b981&color=fff`}
                        alt="Profile"
                      />
                    </div>
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
                        <div className="setup-progress-card">
                          <div className="setup-progress-header">
                            <span>Setup Progress</span>
                            <span className="setup-percent">{user.profileCompletion}%</span>
                          </div>
                          <div className="setup-progress-bar">
                            <div className="setup-progress-fill" style={{ width: `${user.profileCompletion}%` }}></div>
                          </div>

                          {user.profileCompletion < 50 && (
                            <button className="btn-primary-small" onClick={() => { setShowDropdown(false); setShowProfileModal(true); }}>
                              Complete Profile
                            </button>
                          )}
                          {user.profileCompletion === 50 && (
                            <div className="setup-next-step">
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

        <div className="content-body">
          <div className="content-wrapper">
            {children}
          </div>
          
          <footer className="layout-footer">
            <p>© 2024 StayNest All rights reserved.</p>
          </footer>
        </div>

        {isLoggedIn && (
          <div className="floating-emergency-card">
            <div className="emergency-icon">📞</div>
            <div className="emergency-details">
              <strong>Emergency Contact</strong>
              <span>+91 98765 43210</span>
            </div>
          </div>
        )}

        {isLoggedIn && <BottomNav />}

        {showProfileModal && (
          <div className="modal-overlay">
            <div className="modal-content glass-card fade-in">
              <button className="modal-close" onClick={() => setShowProfileModal(false)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
              
              <div className="modal-header">
                <div className="modal-icon-bg">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                </div>
                <h2>Step 2: Preferences</h2>
                <p>Complete your profile to see better matches.</p>
              </div>

              <form onSubmit={handleProfileSubmit} className="modal-form">
                <div className="form-row">
                  <div className="input-group">
                    <label>Age</label>
                    <input type="number" placeholder="e.g. 22" value={modalData.age} onChange={e => setModalData({...modalData, age: e.target.value})} required />
                  </div>
                  <div className="input-group">
                    <label>Gender</label>
                    <select value={modalData.gender} onChange={e => setModalData({...modalData, gender: e.target.value})}>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="input-group">
                  <label>Occupation</label>
                  <select value={modalData.occupation} onChange={e => setModalData({...modalData, occupation: e.target.value})} required>
                    <option value="">Select Occupation</option>
                    <option value="Student">Student</option>
                    <option value="Professional">Working Professional</option>
                  </select>
                </div>

                <div className="input-group">
                  <label>Preferred Location</label>
                  <input type="text" placeholder="e.g. Koramangala, Bengaluru" value={modalData.locationPref} onChange={e => setModalData({...modalData, locationPref: e.target.value})} required />
                </div>

                <div className="input-group">
                  <label>Room Preference</label>
                  <select value={modalData.roomPref} onChange={e => setModalData({...modalData, roomPref: e.target.value})}>
                    <option value="Single">Single Room</option>
                    <option value="Double">2 Sharing</option>
                    <option value="Triple">3 Sharing</option>
                  </select>
                </div>

                <div className="modal-actions">
                  <button type="button" className="btn-secondary" onClick={() => setShowProfileModal(false)}>Save & Resume Later</button>
                  <button type="submit" className="btn-primary">Complete Step 2</button>
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
