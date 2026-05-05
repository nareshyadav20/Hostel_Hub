import React, { useState } from 'react';

const Inventory = () => {
  const [items, setItems] = useState([
    { id: 1, name: 'Milk', stock: 5, unit: 'Liters', status: 'Low Stock' },
    { id: 2, name: 'Rice', stock: 45, unit: 'KG', status: 'Normal' },
    { id: 3, name: 'Soap', stock: 2, unit: 'Boxes', status: 'Low Stock' },
    { id: 4, name: 'Cleaning Liquid', stock: 12, unit: 'Bottles', status: 'Normal' },
    { id: 5, name: 'Sugar', stock: 20, unit: 'KG', status: 'Normal' },
  ]);

  const updateStock = (id, amount) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const newStock = Math.max(0, item.stock + amount);
        return {
          ...item,
          stock: newStock,
          status: newStock < 10 ? 'Low Stock' : 'Normal'
        };
      }
      return item;
    }));
  };

  return (
    <div className="inventory-page animate-fade-in">
      <header style={{ marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
        <div className="icon-box" style={{ background: 'var(--grad-warning)', color: '#fff', marginBottom: 0 }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"></path>
            <polyline points="3.29 7 12 12 20.71 7"></polyline>
            <line x1="12" y1="22" x2="12" y2="12"></line>
          </svg>
        </div>
        <div>
          <h1>Inventory Management</h1>
          <p style={{ fontWeight: '600' }}>Track and update stock for mess and cleaning supplies.</p>
        </div>
      </header>

      <div className="table-container">
        <table className="premium-table">
          <thead>
            <tr>
              <th>Item Name</th>
              <th>Current Stock</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id}>
                <td style={{ fontWeight: '800', color: 'var(--text-primary)' }}>{item.name}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem' }}>
                    <span style={{ fontSize: '1.4rem', fontWeight: '900', color: 'var(--text-primary)' }}>{item.stock}</span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '700' }}>{item.unit}</span>
                  </div>
                </td>
                <td>
                  <span className={`table-badge ${item.status === 'Low Stock' ? 'error' : 'success'}`}>
                    {item.status}
                  </span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: '0.8rem', justifyContent: 'flex-end' }}>
                    <button 
                      onClick={() => updateStock(item.id, -1)}
                      className="btn" 
                      style={{ 
                        padding: '0', 
                        width: '40px', 
                        height: '40px', 
                        background: 'var(--bg-tertiary)', 
                        border: '1px solid var(--border-color)', 
                        color: 'var(--text-primary)',
                        borderRadius: '12px'
                      }}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                      </svg>
                    </button>
                    <button 
                      onClick={() => updateStock(item.id, 1)}
                      className="btn" 
                      style={{ 
                        padding: '0', 
                        width: '40px', 
                        height: '40px', 
                        background: 'var(--accent-primary)', 
                        color: '#fff',
                        borderRadius: '12px'
                      }}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Inventory;

