import React from 'react';

const Orders = () => {
  return (
    <div className="dashboard-container">
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '800' }}>Order Requests</h1>
        <p>Manage and fulfill customer orders.</p>
      </header>
      
      <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>Detailed orders view will appear here.</p>
      </div>
    </div>
  );
};

export default Orders;
