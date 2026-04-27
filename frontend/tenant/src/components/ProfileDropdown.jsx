import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Settings, LogOut, ChevronDown, Sparkles } from 'lucide-react';

const ProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  
  const user = JSON.parse(localStorage.getItem('user') || '{"name": "Resident", "email": "resident@staynest.com"}');

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="profile-dropdown-container" ref={dropdownRef} style={{ position: 'relative' }}>
      <div 
        className="profile-trigger" 
        onClick={() => setIsOpen(!isOpen)}
        style={{ 
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          padding: '0.4rem 0.75rem',
          borderRadius: '20px',
          cursor: 'pointer',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          background: isOpen ? 'var(--bg-tertiary)' : 'transparent',
          border: '1px solid',
          borderColor: isOpen ? 'var(--border-color)' : 'transparent'
        }}
      >
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--accent-secondary), var(--accent-primary))',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: '800',
          fontSize: '0.85rem',
          boxShadow: '0 4px 10px rgba(99, 102, 241, 0.2)',
          border: '2px solid var(--bg-secondary)'
        }}>
          {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
        </div>
        
        <div style={{ display: 'none', flexDirection: 'column', textAlign: 'left' }} className="desktop-only-flex">
          <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: '1.2' }}>{user.name}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Resident Portal</span>
            <Sparkles size={10} color="var(--accent-secondary)" />
          </div>
        </div>
        
        <ChevronDown size={16} style={{ color: 'var(--text-muted)', transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }} />
      </div>

      {isOpen && (
        <div className="dropdown-menu shadow-premium-lg" style={{
          position: 'absolute',
          top: 'calc(100% + 12px)',
          right: '0',
          width: '260px',
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          borderRadius: '18px',
          padding: '0.75rem',
          zIndex: '1000',
          animation: 'slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          backdropFilter: 'blur(20px)'
        }}>
          <div style={{ padding: '0.75rem', marginBottom: '0.5rem', borderBottom: '1px solid var(--border-subtle)' }}>
            <p style={{ fontWeight: '900', color: 'var(--text-primary)', margin: 0, fontSize: '1rem' }}>{user.name}</p>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0.2rem 0 0', fontWeight: 600 }}>{user.email}</p>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
            <button className="dropdown-item-premium">
              <User size={16} strokeWidth={2.5} /> <span>Resident Profile</span>
            </button>
            <button className="dropdown-item-premium">
              <Settings size={16} strokeWidth={2.5} /> <span>Room Settings</span>
            </button>
          </div>
          
          <div style={{ marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border-subtle)' }}>
            <button 
              onClick={handleLogout}
              className="dropdown-item-premium logout"
              style={{ color: 'var(--accent-error)' }}
            >
              <LogOut size={16} strokeWidth={2.5} /> <span>Sign Out Portal</span>
            </button>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(10px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .dropdown-item-premium {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 0.85rem;
          padding: 0.8rem 0.75rem;
          border-radius: 12px;
          border: none;
          background: transparent;
          color: var(--text-secondary);
          font-weight: 700;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.2s;
        }
        .dropdown-item-premium:hover {
          background: var(--bg-tertiary);
          color: var(--accent-primary);
          padding-left: 1rem;
        }
        .dropdown-item-premium.logout:hover {
          background: rgba(239, 68, 68, 0.05);
          color: var(--accent-error);
        }
        @media (min-width: 1024px) {
          .desktop-only-flex { display: flex !important; }
        }
      `}} />
    </div>
  );
};

export default ProfileDropdown;
