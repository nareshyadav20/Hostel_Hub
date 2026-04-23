import React from 'react';
import { Plus } from 'lucide-react';

const Offers = () => {
  return (
    <div className="dashboard-container">
      <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: '800' }}>Offers & Discounts</h1>
          <p>Create promotional offers for your services.</p>
        </div>
        <button className="btn btn-primary">
          <Plus size={18} /> Create Offer
        </button>
      </header>
      
      <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>Offers list will appear here.</p>
      </div>
    </div>
  );
};

export default Offers;
