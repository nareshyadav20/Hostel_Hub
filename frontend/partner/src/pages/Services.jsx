import React from 'react';
import { Plus } from 'lucide-react';

const Services = () => {
  return (
    <div className="dashboard-container">
      <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: '800' }}>Service Management</h1>
          <p>Add, edit, or remove services offered to hostels.</p>
        </div>
        <button className="btn btn-primary">
          <Plus size={18} /> Add New Service
        </button>
      </header>
      
      <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>Service list will appear here.</p>
      </div>
    </div>
  );
};

export default Services;
