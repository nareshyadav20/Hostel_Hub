import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../mockData';
import Sidebar from './Sidebar';
import ThemeToggle from './ThemeToggle';
import ProfileDropdown from './ProfileDropdown';
import './Layout.css';

const Layout = ({ children }) => {
  const { buildingId } = useParams();
  const navigate = useNavigate();
  const [buildings, setBuildings] = useState([]);

  useEffect(() => {
    api.getBuildings().then(data => setBuildings(data || []));
  }, []);

  return (
    <div className="layout">
      <Sidebar />
      <main className="main-content">
        <header className="content-header">
          <div className="header-building-selector" style={{ display: 'flex', gap: '0.5rem' }}>
            {buildings.map(b => {
              const id = b.id || b._id;
              const isActive = buildingId === id;
              return (
                <button
                  key={id}
                  onClick={() => navigate(`/owner/building/${id}/dashboard`)}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '20px',
                    border: 'none',
                    background: isActive ? 'var(--primary-color)' : 'var(--bg-secondary)',
                    color: isActive ? '#fff' : 'var(--text-secondary)',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {b.name}
                </button>
              );
            })}
          </div>
          <div className="user-profile">
            <ThemeToggle />
            <div className="notifications" style={{ color: 'var(--text-secondary)', cursor: 'pointer' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
            </div>
            <ProfileDropdown />
          </div>
        </header>
        <div className="content-body">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
