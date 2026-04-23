import React from 'react';
import { useParams } from 'react-router-dom';

const Listing = () => {
  const { id } = useParams();

  return (
    <div className="dashboard-container">
      <div className="card" style={{ padding: 0, overflow: 'hidden', marginBottom: '2rem' }}>
        <div style={{ height: '400px', background: 'var(--bg-tertiary)', position: 'relative' }}>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>
            🏙️ [Hostel Photo Carousel Placeholder]
          </div>
          <div style={{ position: 'absolute', bottom: '20px', right: '20px', display: 'flex', gap: '10px' }}>
            <button className="status-badge" style={{ background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none' }}>🎥 Video Tour</button>
            <button className="status-badge" style={{ background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none' }}>🔄 360° View</button>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem' }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
            <div>
              <h1 style={{ margin: 0, fontSize: '2.5rem' }}>Sunrise Student Stay</h1>
              <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>📍 Koramangala, Bengaluru (200m from Sony World Junction)</p>
            </div>
            <div className="status-badge success" style={{ padding: '0.8rem 1.5rem', fontSize: '1rem' }}>
              Verified Owner
            </div>
          </div>

          <div className="live-status-grid" style={{ marginBottom: '2.5rem' }}>
            <div className="card" style={{ padding: '1rem', textAlign: 'center' }}>
              <h4 style={{ margin: 0 }}>Safety Score</h4>
              <span style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--accent-success)' }}>9.8/10</span>
            </div>
            <div className="card" style={{ padding: '1rem', textAlign: 'center' }}>
              <h4 style={{ margin: 0 }}>Occupancy</h4>
              <span style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--accent-warning)' }}>85% Full</span>
            </div>
          </div>

          <h3>Hostel Rules</h3>
          <ul style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem', padding: 0, listStyle: 'none' }}>
            {['No smoking', 'Entry till 11 PM', 'No guests after 9 PM', 'Biometric attendance required'].map(r => (
              <li key={r} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.95rem' }}>
                <span style={{ color: 'var(--accent-error)' }}>❌</span> {r}
              </li>
            ))}
          </ul>

          <h3 style={{ marginTop: '2rem' }}>Food Menu (Today)</h3>
          <div className="card" style={{ background: 'var(--bg-tertiary)' }}>
            <p><strong>Breakfast:</strong> Poha, Bread Butter, Tea</p>
            <p><strong>Lunch:</strong> Dal Makhani, Mix Veg, Roti, Rice</p>
            <p><strong>Dinner:</strong> Paneer Butter Masala, Jeera Rice</p>
          </div>
        </div>

        <aside>
          <div className="card glass-panel" style={{ position: 'sticky', top: '2rem' }}>
            <h3>Price Breakdown</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', margin: '1.5rem 0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Monthly Rent (Single)</span>
                <strong>₹8,500</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Security Deposit</span>
                <strong>₹17,000</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Maintenance Fee</span>
                <strong>₹500</strong>
              </div>
              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem' }}>
                <strong>Total to Pay</strong>
                <strong style={{ color: 'var(--accent-primary)' }}>₹26,000</strong>
              </div>
            </div>
            <button className="btn btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}>Book Now</button>
            <p style={{ textAlign: 'center', fontSize: '0.8rem', marginTop: '1rem' }}>* Token advance of ₹2,000 required to hold bed</p>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Listing;
