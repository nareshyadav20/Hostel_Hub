import React, { useState, useEffect } from 'react';
import API from '../api/axios';

const Laundry = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await API.get('/laundry/me');
      setOrders(response.data);
    } catch (err) {
      console.error('Error fetching laundry orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestLaundry = async () => {
    setRequesting(true);
    try {
      const response = await API.post('/laundry');
      setOrders([response.data, ...orders]);
      alert('Laundry pickup requested! Our staff will collect it soon.');
    } catch (err) {
      console.error('Error requesting laundry:', err);
      alert('Failed to request laundry. Please try again.');
    } finally {
      setRequesting(false);
    }
  };

  const activeOrder = orders[0];
  const steps = [
    { label: 'Picked', status: activeOrder?.status === 'Picked' ? 'current' : orders.some(o => o.status !== 'Picked') ? 'completed' : 'pending', time: activeOrder?.status === 'Picked' ? 'Today' : '' },
    { label: 'Washing', status: activeOrder?.status === 'Washing' ? 'current' : ['Ironing', 'Ready', 'Delivered'].includes(activeOrder?.status) ? 'completed' : 'pending', time: '' },
    { label: 'Delivered', status: activeOrder?.status === 'Delivered' ? 'completed' : 'pending', time: 'Expected Soon' },
  ];

  return (
    <div className="dashboard-container">
      <div className="welcome-section">
        <div className="welcome-text">
          <h1>Laundry Service</h1>
          <p>Track your laundry status in real-time.</p>
        </div>
      </div>

      <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
        {loading ? (
          <p style={{ textAlign: 'center' }}>Loading orders...</p>
        ) : activeOrder ? (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
              <h2 style={{ margin: 0 }}>Current Order #{activeOrder.orderNumber}</h2>
              <span className={`status-badge ${activeOrder.status === 'Delivered' ? 'success' : 'warning'}`}>{activeOrder.status}</span>
            </div>

            <div style={{ position: 'relative', paddingLeft: '2rem' }}>
              <div style={{ position: 'absolute', left: '7px', top: '0', bottom: '0', width: '2px', background: 'var(--border-color)' }}></div>
              {steps.map((step, i) => (
                <div key={i} style={{ position: 'relative', marginBottom: '2.5rem' }}>
                  <div style={{ 
                    position: 'absolute', left: '-2rem', top: '0', width: '16px', height: '16px', borderRadius: '50%', 
                    background: step.status === 'completed' ? 'var(--accent-success)' : step.status === 'current' ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
                    border: '4px solid var(--bg-secondary)', zIndex: 1,
                    boxShadow: step.status === 'current' ? '0 0 10px var(--accent-primary)' : 'none'
                  }}></div>
                  <div style={{ opacity: step.status === 'pending' ? 0.5 : 1 }}>
                    <h3 style={{ margin: '0 0 0.2rem', fontSize: '1.1rem' }}>{step.label}</h3>
                    <p style={{ margin: 0, fontSize: '0.9rem' }}>{step.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p style={{ color: 'var(--text-muted)' }}>No active laundry orders.</p>
          </div>
        )}

        <button 
          onClick={handleRequestLaundry} 
          disabled={requesting}
          className="btn btn-primary" 
          style={{ width: '100%', marginTop: '1rem' }}
        >
          {requesting ? 'Requesting...' : 'Request New Laundry'}
        </button>
      </div>
    </div>
  );
};

export default Laundry;
