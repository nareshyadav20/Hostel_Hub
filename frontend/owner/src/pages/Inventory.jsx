import React, { useState } from 'react';

const Inventory = () => {
  const [items, setItems] = useState([
    { id: 1, name: 'Milk', stock: 5 },
    { id: 2, name: 'Rice', stock: 45 },
    { id: 3, name: 'Soap', stock: 2 },
    { id: 4, name: 'Sugar', stock: 20 },
  ]);

  const handleUpdateStock = (id) => {
    alert('Opening Stock Update form...');
  };

  return (
    <div className="inventory-page">
      <header style={{ marginBottom: '2rem' }}>
        <h1>📦 Inventory Control</h1>
        <p>Global view of stock levels across all buildings.</p>
      </header>

      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '1.2rem' }}>Item Name</th>
              <th style={{ padding: '1.2rem' }}>Current Stock</th>
              <th style={{ padding: '1.2rem' }}>Status</th>
              <th style={{ padding: '1.2rem' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '1.2rem', fontWeight: '700' }}>{item.name}</td>
                <td style={{ padding: '1.2rem', color: item.stock < 10 ? 'var(--accent-error)' : 'inherit', fontWeight: item.stock < 10 ? '800' : '400' }}>
                  {item.stock} Units
                </td>
                <td style={{ padding: '1.2rem' }}>
                  <span style={{ 
                    padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700',
                    background: item.stock < 10 ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                    color: item.stock < 10 ? 'var(--accent-error)' : 'var(--accent-success)'
                  }}>
                    {item.stock < 10 ? 'LOW STOCK' : 'NORMAL'}
                  </span>
                </td>
                <td style={{ padding: '1.2rem' }}>
                  <button 
                    onClick={() => handleUpdateStock(item.id)}
                    className="btn btn-primary" 
                    style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}
                  >
                    ➕ Update Stock
                  </button>
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
