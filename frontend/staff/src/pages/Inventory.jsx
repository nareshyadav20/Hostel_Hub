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
                <td style={{ fontWeight: '700' }}>{item.name}</td>
                <td>
                  <span style={{ fontSize: '1.2rem', fontWeight: '800' }}>{item.stock}</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginLeft: '0.4rem' }}>{item.unit}</span>
                </td>
                <td>
                  <span className={`table-badge ${item.status === 'Low Stock' ? 'error' : 'success'}`}>
                    {item.status}
                  </span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                    <button 
                      onClick={() => updateStock(item.id, -1)}
                      className="btn" 
                      style={{ padding: '0.4rem 0.8rem', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)' }}
                    >
                      -
                    </button>
                    <button 
                      onClick={() => updateStock(item.id, 1)}
                      className="btn" 
                      style={{ padding: '0.4rem 0.8rem', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)' }}
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
