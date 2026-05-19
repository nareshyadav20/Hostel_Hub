import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

const ProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [profile, setProfile] = useState(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  
  const localUser = JSON.parse(localStorage.getItem('user') || '{"name": "Staff Member", "email": "staff@staynest.com"}');

  const fetchProfile = async () => {
    try {
      const res = await API.get('/admin/profile');
      if (res.data) {
        setProfile(res.data);
      }
    } catch (err) {
      console.error('Dropdown failed to fetch admin profile:', err);
    }
  };

  useEffect(() => {
    fetchProfile();
    
    // Listen to custom profile update event from Profile.jsx
    window.addEventListener('user-profile-updated', fetchProfile);
    
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      window.removeEventListener('user-profile-updated', fetchProfile);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const name = profile?.name || localUser.name;
  const email = profile?.email || localUser.email;
  const avatar = profile?.avatar || '';

  return (
    <div className="profile-dropdown-container" ref={dropdownRef} style={{ position: 'relative' }}>
      <div 
        className="avatar-container" 
        onClick={() => setIsOpen(!isOpen)}
        style={{ 
          cursor: 'pointer', 
          userSelect: 'none',
          width: '38px',
          height: '38px',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          backgroundColor: 'var(--primary, #6366f1)',
          color: '#fff',
          fontWeight: 'bold',
          fontSize: '0.9rem',
          boxShadow: '0 4px 12px rgba(99, 102, 241, 0.15)'
        }}
      >
        {avatar ? (
          <img src={avatar} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
        )}
      </div>

      {isOpen && (
        <div className="dropdown-menu" style={{
          position: 'absolute',
          top: '120%',
          right: '0',
          width: '240px',
          background: 'var(--bg-secondary, #1e293b)',
          border: '1px solid var(--border-color, rgba(255,255,255,0.05))',
          borderRadius: '16px',
          boxShadow: 'var(--shadow-lg)',
          padding: '1rem',
          zIndex: '1000',
          animation: 'fadeIn 0.2s ease'
        }}>
          <div style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color, rgba(255,255,255,0.05))' }}>
            <div style={{ display: 'flex', items: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                overflow: 'hidden',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {avatar ? (
                  <img src={avatar} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}</div>
                )}
              </div>
              <div>
                <p style={{ fontWeight: '700', color: 'var(--text-primary)', fontSize: '0.9rem', lineHeight: '1.2' }}>{name}</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Super Admin</p>
              </div>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis' }}>{email}</p>
          </div>
          
          <button 
            onClick={() => {
              setIsOpen(false);
              navigate('/profile');
            }}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '0.8rem',
              padding: '0.8rem',
              borderRadius: '10px',
              color: 'var(--text-primary)',
              background: 'rgba(255, 255, 255, 0.02)',
              border: 'none',
              cursor: 'pointer',
              fontWeight: '600',
              marginBottom: '0.5rem',
              transition: 'var(--transition-fast)'
            }}
          >
            Profile Settings
          </button>

          <button 
            onClick={handleLogout}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '0.8rem',
              padding: '0.8rem',
              borderRadius: '10px',
              color: 'var(--accent-error, #f43f5e)',
              background: 'rgba(244, 63, 94, 0.05)',
              border: 'none',
              cursor: 'pointer',
              fontWeight: '600',
              transition: 'var(--transition-fast)'
            }}
            onMouseOver={(e) => e.currentTarget.style.background = 'rgba(244, 63, 94, 0.1)'}
            onMouseOut={(e) => e.currentTarget.style.background = 'rgba(244, 63, 94, 0.05)'}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
