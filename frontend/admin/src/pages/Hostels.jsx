import React, { useState } from 'react';
import { 
  Building2, Plus, Search, Filter, MoreHorizontal, 
  MapPin, Users, Activity, ArrowUpRight, Zap,
  TrendingUp, ShieldCheck, Home
} from 'lucide-react';
import Modal from '../components/Modal';
import '../NexusElite.css';

const Hostels = () => {
  const [activeModal, setActiveModal] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [hostels, setHostels] = useState([
    { id: 1, name: 'Sapphire Men\'s PG', location: 'Koramangala, BLR', owner: 'Vikram M.', capacity: 120, occupancy: 85, status: 'Active', revenue: '4.2L' },
    { id: 2, name: 'Royal Ladies Nest', location: 'HSR Layout, BLR', owner: 'Anjali S.', capacity: 80, occupancy: 92, status: 'Active', revenue: '3.8L' },
    { id: 3, name: 'Metro Living Space', location: 'Indiranagar, BLR', owner: 'Suresh I.', capacity: 150, occupancy: 42, status: 'Inactive', revenue: '1.1L' },
    { id: 4, name: 'Green Valley Hostel', location: 'Viman Nagar, PUN', owner: 'Rahul K.', capacity: 60, occupancy: 100, status: 'Active', revenue: '2.9L' },
  ]);

  const stats = [
    { label: 'Total Properties', value: '1,240', icon: <Building2 />, color: 'var(--accent-primary)' },
    { label: 'Global Occupancy', value: '82%', icon: <Users />, color: 'var(--accent-success)' },
    { label: 'Asset Valuation', value: '₹420 Cr', icon: <TrendingUp />, color: 'var(--accent-secondary)' },
  ];

  return (
    <div className="hostels-view">
      <header className="page-header">
        <div>
          <h1 className="page-title">🏠 Infrastructure Grid</h1>
          <p className="page-subtitle">Strategic management of platform-wide property assets and operational health.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="nexus-btn-icon" style={{ width: 'auto', padding: '0 1.5rem', borderRadius: '12px' }}>
            <Zap size={18} style={{ marginRight: '0.75rem' }} /> Deployment Mode
          </button>
          <button className="btn btn-primary" style={{ padding: '1rem 2rem', borderRadius: '16px' }} onClick={() => setActiveModal('register')}>
            <Plus size={20} /> Register Property
          </button>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="nexus-stats-grid">
        {stats.map((stat, i) => (
          <div key={i} className="stat-card-elite">
            <div className="stat-icon-elite" style={{ backgroundColor: `${stat.color}15`, color: stat.color }}>
              {stat.icon}
            </div>
            <div className="stat-data">
              <h3>{stat.value}</h3>
              <p>{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filter Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3rem', gap: '1.5rem' }}>
        <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center' }}>
          <Search size={18} style={{ position: 'absolute', left: '1.5rem', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="Search by city, name, or owner reference..." 
            style={{ 
              width: '100%', padding: '1rem 1rem 1rem 3.5rem', 
              background: 'var(--bg-secondary)', border: '1px solid var(--border-color)',
              borderRadius: '16px', color: 'var(--text-primary)', outline: 'none'
            }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="nexus-btn-icon" style={{ width: '56px', height: '56px' }}>
          <Filter size={20} />
        </button>
      </div>

      {/* Infrastructure Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
        {hostels.map((h) => (
          <div key={h.id} className="stat-card-elite" style={{ display: 'block', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', gap: '1.25rem' }}>
                <div style={{ 
                  width: '56px', height: '56px', borderRadius: '16px', 
                  background: h.status === 'Active' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                  color: h.status === 'Active' ? 'var(--accent-success)' : 'var(--accent-error)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <Home size={28} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: '900', margin: 0 }}>{h.name}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.2rem' }}>
                    <MapPin size={14} /> {h.location}
                  </div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span className="nexus-badge" style={{ 
                  backgroundColor: h.status === 'Active' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                  color: h.status === 'Active' ? 'var(--accent-success)' : 'var(--accent-error)'
                }}>
                   <span className="status-dot" style={{ backgroundColor: h.status === 'Active' ? 'var(--accent-success)' : 'var(--accent-error)' }}></span>
                   {h.status}
                </span>
                <p style={{ margin: '0.5rem 0 0', fontSize: '0.7rem', fontWeight: '800', color: 'var(--text-muted)' }}>ID: #{h.id}X00</p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '2rem' }}>
              <div style={{ background: 'var(--bg-tertiary)', padding: '1.25rem', borderRadius: '20px', border: '1px solid var(--border-color)' }}>
                <p style={{ margin: 0, fontSize: '0.7rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Occupancy</p>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <span style={{ fontSize: '1.6rem', fontWeight: '900', color: h.occupancy > 85 ? 'var(--accent-success)' : 'var(--text-primary)' }}>{h.occupancy}%</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>of {h.capacity}</span>
                </div>
              </div>
              <div style={{ background: 'var(--bg-tertiary)', padding: '1.25rem', borderRadius: '20px', border: '1px solid var(--border-color)' }}>
                <p style={{ margin: 0, fontSize: '0.7rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Revenue Flow</p>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginTop: '0.5rem' }}>
                   <span style={{ fontSize: '1.6rem', fontWeight: '900', color: 'var(--accent-primary)' }}>₹{h.revenue}</span>
                   <span style={{ fontSize: '0.75rem', color: 'var(--accent-success)', fontWeight: '800' }}>+12%</span>
                </div>
              </div>
            </div>

            <div style={{ height: '8px', background: 'var(--bg-tertiary)', borderRadius: '10px', overflow: 'hidden', marginBottom: '2rem' }}>
               <div style={{ 
                 height: '100%', width: `${h.occupancy}%`, 
                 background: `linear-gradient(90deg, var(--accent-primary), var(--accent-secondary))`,
                 boxShadow: '0 0 10px var(--accent-primary)'
               }}></div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '0.8rem', border: '1px solid var(--border-color)' }}>
                    {h.owner.charAt(0)}
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '700' }}>Managed by</p>
                    <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: '700' }}>{h.owner}</p>
                  </div>
               </div>
               <div className="nexus-action-group">
                 <button className="nexus-btn-icon"><ArrowUpRight size={18} /></button>
                 <button className="nexus-btn-icon"><MoreHorizontal size={18} /></button>
               </div>
            </div>
          </div>
        ))}
      </div>

      <Modal 
        isOpen={activeModal === 'register'} 
        onClose={() => setActiveModal(null)}
        title="Initialize New Property Node"
        footer={<button className="btn btn-primary" style={{ padding: '0.8rem 2rem' }} onClick={() => setActiveModal(null)}>Confirm Registration</button>}
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', padding: '1rem 0' }}>
          <div className="form-group">
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '800', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Property Name</label>
            <input style={{ width: '100%', padding: '1rem', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: '12px', color: '#fff' }} placeholder="Elite Living PG" />
          </div>
          <div className="form-group">
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '800', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>City Hub</label>
            <select style={{ width: '100%', padding: '1rem', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: '12px', color: '#fff' }}>
              <option>Bangalore (Koramangala)</option>
              <option>Pune (Viman Nagar)</option>
              <option>Hyderabad (Gachibowli)</option>
            </select>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Hostels;
