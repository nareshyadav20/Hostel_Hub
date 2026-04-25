import React, { useState } from 'react';
import { 
  Building2, Plus, Search, Filter, MoreHorizontal, 
  MapPin, Users, CheckCircle2, XCircle, TrendingUp,
  Activity, ArrowUpRight, Zap
} from 'lucide-react';
import Modal from '../components/Modal';

const Hostels = () => {
  const [activeModal, setActiveModal] = useState(null);
  const [hostels, setHostels] = useState([
    { id: 1, name: 'Sapphire Men\'s PG', location: 'Koramangala, BLR', owner: 'Vikram M.', capacity: 120, occupancy: 85, status: 'Active', revenue: '₹4.2L' },
    { id: 2, name: 'Royal Ladies Nest', location: 'HSR Layout, BLR', owner: 'Anjali S.', capacity: 80, occupancy: 92, status: 'Active', revenue: '₹3.8L' },
    { id: 3, name: 'Metro Living Space', location: 'Indiranagar, BLR', owner: 'Suresh I.', capacity: 150, occupancy: 42, status: 'Inactive', revenue: '₹1.1L' },
    { id: 4, name: 'Green Valley Hostel', location: 'Viman Nagar, PUN', owner: 'Rahul K.', capacity: 60, occupancy: 100, status: 'Active', revenue: '₹2.9L' },
  ]);

  return (
    <div className="page-container animate-fade">
      {/* Premium Header */}
      <div className="page-header" style={{ marginBottom: '3.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2.75rem', fontWeight: 900, letterSpacing: '-0.04em' }}>
            Infrastructure <span style={{ color: 'var(--accent-primary)' }}>Grid</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginTop: '0.5rem' }}>
            Operational oversight of the platform's physical property assets.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn btn-secondary">
            <Filter size={18} /> Global Filters
          </button>
          <button className="btn btn-primary" onClick={() => setActiveModal('register')}>
            <Plus size={18} /> Register Property
          </button>
        </div>
      </div>

      {/* Advanced Filter Bar */}
      <div className="global-filter-bar" style={{ marginBottom: '2.5rem' }}>
        <div className="filter-group">
          <Activity size={18} color="var(--accent-primary)" />
          <span className="filter-label">Health Status:</span>
          <select className="filter-select">
            <option>All Properties</option>
            <option>High Occupancy</option>
            <option>Underperforming</option>
          </select>
        </div>
        <div style={{ width: '1px', height: '24px', background: 'var(--border-color)' }}></div>
        <div className="filter-group">
          <Search size={18} color="var(--text-muted)" />
          <input type="text" placeholder="Filter by city, name, or owner..." style={{ background: 'none', border: 'none', color: '#fff', outline: 'none', fontSize: '0.85rem', width: '250px' }} />
        </div>
      </div>

      {/* Infrastructure Grid */}
      <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '2rem' }}>
        {hostels.map(h => (
          <div key={h.id} className="stat-card-premium" style={{ border: h.status === 'Active' ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid rgba(239, 68, 68, 0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div className="stat-icon-container" style={{ width: '48px', height: '48px', background: h.status === 'Active' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: h.status === 'Active' ? '#10b981' : '#ef4444' }}>
                  <Building2 size={22} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{h.name}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600 }}>
                    <MapPin size={12} /> {h.location}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                <div className={`badge ${h.status === 'Active' ? 'badge-success' : 'badge-danger'}`} style={{ padding: '0.4rem 0.75rem' }}>
                  {h.status === 'Active' ? <div className="pulse-dot" style={{ width: 6, height: 6 }}></div> : null}
                  {h.status}
                </div>
                <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)' }}>ID: #{h.id}042</span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid var(--border-light)' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Occupancy Rate</span>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem', marginTop: '0.4rem' }}>
                  <span style={{ fontSize: '1.5rem', fontWeight: 900, color: h.occupancy > 80 ? '#10b981' : h.occupancy < 50 ? '#ef4444' : '#fff' }}>{h.occupancy}%</span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>of {h.capacity}</span>
                </div>
              </div>
              <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid var(--border-light)' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Revenue Flow</span>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem', marginTop: '0.4rem' }}>
                  <span style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--accent-primary)' }}>{h.revenue}</span>
                  <span style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 800 }}>+4.2%</span>
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ height: '6px', width: '100%', background: 'var(--bg-tertiary)', borderRadius: '10px', overflow: 'hidden' }}>
                <div style={{ 
                  height: '100%', 
                  width: `${h.occupancy}%`, 
                  background: `linear-gradient(to right, ${h.occupancy > 90 ? '#10b981' : 'var(--accent-primary)'}, #fbbf24)`, 
                  boxShadow: '0 0 10px rgba(251, 191, 36, 0.3)'
                }}></div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-light)', paddingTop: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800, border: '1px solid var(--border-color)' }}>
                  {h.owner.charAt(0)}
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Managed by</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>{h.owner}</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.6rem' }}>
                <button className="btn btn-secondary btn-sm" style={{ padding: '0.5rem 1rem' }}>
                  View Node <ArrowUpRight size={14} style={{ marginLeft: 4 }} />
                </button>
                <button className="icon-action-btn"><MoreHorizontal size={18} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Register Modal */}
      <Modal 
        isOpen={activeModal === 'register'} 
        onClose={() => setActiveModal(null)}
        title="Initialize New Property Node"
        footer={<button className="btn btn-primary" onClick={() => setActiveModal(null)}>Confirm Registration</button>}
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div className="form-group">
            <label className="form-label">Property Name</label>
            <input className="form-input" placeholder="Elite Living PG" />
          </div>
          <div className="form-group">
            <label className="form-label">City Hub</label>
            <select className="form-input">
              <option>Bangalore (Koramangala)</option>
              <option>Pune (Viman Nagar)</option>
              <option>Hyderabad (Gachibowli)</option>
            </select>
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Owner Reference</label>
          <input className="form-input" placeholder="Search verified owners..." />
        </div>
        <div className="form-group">
          <label className="form-label">Property Key Stats</label>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <input className="form-input" placeholder="Total Beds" type="number" />
            <input className="form-input" placeholder="Base Rent" type="number" />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Hostels;
