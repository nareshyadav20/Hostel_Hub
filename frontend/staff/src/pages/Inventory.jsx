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
    <div className="inventory-page">
      <header style={{ marginBottom: '2rem' }}>
        <h1>📦 Inventory Management</h1>
        <p>Track and update stock for mess and cleaning supplies.</p>
      </header>

      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '1.2rem' }}>Item Name</th>
              <th style={{ padding: '1.2rem' }}>Current Stock</th>
              <th style={{ padding: '1.2rem' }}>Status</th>
              <th style={{ padding: '1.2rem' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '1.2rem', fontWeight: '700' }}>{item.name}</td>
                <td style={{ padding: '1.2rem' }}>
                  <span style={{ fontSize: '1.1rem', fontWeight: '800' }}>{item.stock}</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: '0.3rem' }}>{item.unit}</span>
                </td>
                <td style={{ padding: '1.2rem' }}>
                  <span style={{ 
                    padding: '0.3rem 0.8rem', 
                    borderRadius: '20px', 
                    fontSize: '0.75rem', 
                    fontWeight: '700',
                    background: item.status === 'Low Stock' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                    color: item.status === 'Low Stock' ? 'var(--accent-error)' : 'var(--accent-success)'
                  }}>
                    {item.status}
                  </span>
                </td>
                <td style={{ padding: '1.2rem' }}>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button 
                      onClick={() => updateStock(item.id, -1)}
                      className="btn" 
                      style={{ padding: '0.3rem 0.8rem', border: '1px solid var(--border-color)' }}
                    >
                      -
                    </button>
                    <button 
                      onClick={() => updateStock(item.id, 1)}
                      className="btn" 
                      style={{ padding: '0.3rem 0.8rem', border: '1px solid var(--border-color)' }}
                    >
                      +
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
