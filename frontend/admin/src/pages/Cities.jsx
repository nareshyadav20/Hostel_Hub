import React, { useState } from 'react';
import { Map, Plus, TrendingUp, Users, Building2, MapPin, X, Globe, Zap, Search, Filter } from 'lucide-react';
import '../NexusElite.css';

const initialCities = [
  { name: 'Bangalore', hubs: 12, properties: 45, tenants: 1840, growth: '+22%', status: 'Active' },
  { name: 'Mumbai',    hubs: 8,  properties: 32, tenants: 1250, growth: '+15%', status: 'Active' },
  { name: 'Pune',      hubs: 6,  properties: 28, tenants: 940,  growth: '+32%', status: 'Active' },
  { name: 'Hyderabad', hubs: 4,  properties: 14, tenants: 450,  growth: '+4%', status: 'Stable' },
];

const Cities = () => {
  const [cities, setCities] = useState(initialCities);
  const [searchTerm, setSearchTerm] = useState('');

  const stats = [
    { label: 'Active Cities', value: '18', icon: <Globe />, color: 'var(--accent-primary)' },
    { label: 'Total Regional Hubs', value: '42', icon: <Zap />, color: 'var(--accent-success)' },
    { label: 'Market Coverage', value: '94%', icon: <TrendingUp />, color: 'var(--accent-secondary)' },
  ];

  return (
    <div className="cities-view">
      <header className="page-header">
        <div>
          <h1 className="page-title">🗺️ City Hub Intelligence</h1>
          <p className="page-subtitle">Territorial management and regional performance algorithms.</p>
        </div>
        <button className="btn btn-primary" style={{ padding: '1rem 2rem', borderRadius: '16px' }}>
          <Plus size={18} />
          Launch New Territory
        </button>
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
            placeholder="Search by city or regional hub..." 
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

      {/* Cities Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
        {cities.map((city, idx) => (
          <div key={idx} className="stat-card-elite" style={{ display: 'block', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
               <div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: '900', margin: 0 }}>{city.name}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.2rem' }}>
                    <MapPin size={14} /> Regional Hub
                  </div>
               </div>
               <span style={{ 
                 padding: '0.4rem 0.8rem', borderRadius: '10px', fontSize: '0.75rem', fontWeight: '900',
                 backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent-success)'
               }}>
                 {city.growth}
               </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
               <div style={{ textAlign: 'center', padding: '1rem', background: 'var(--bg-tertiary)', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                  <Building2 size={16} color="var(--accent-primary)" style={{ marginBottom: '0.5rem' }} />
                  <p style={{ margin: 0, fontWeight: '800', fontSize: '1.1rem' }}>{city.properties}</p>
                  <p style={{ margin: 0, fontSize: '0.65rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Assets</p>
               </div>
               <div style={{ textAlign: 'center', padding: '1rem', background: 'var(--bg-tertiary)', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                  <Users size={16} color="var(--accent-secondary)" style={{ marginBottom: '0.5rem' }} />
                  <p style={{ margin: 0, fontWeight: '800', fontSize: '1.1rem' }}>{city.tenants}</p>
                  <p style={{ margin: 0, fontSize: '0.65rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Tenants</p>
               </div>
               <div style={{ textAlign: 'center', padding: '1rem', background: 'var(--bg-tertiary)', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                  <TrendingUp size={16} color="var(--accent-success)" style={{ marginBottom: '0.5rem' }} />
                  <p style={{ margin: 0, fontWeight: '800', fontSize: '1.1rem' }}>{city.hubs}</p>
                  <p style={{ margin: 0, fontSize: '0.65rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Hubs</p>
               </div>
            </div>

            <button className="nexus-btn-icon" style={{ width: '100%', height: '48px', borderRadius: '14px', gap: '0.75rem' }}>
               <Map size={18} /> View Network Heatmap
            </button>
          </div>
        ))}

        <div className="stat-card-elite" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: '2px dashed var(--border-color)', cursor: 'pointer' }}>
           <div style={{ textAlign: 'center' }}>
              <Plus size={32} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
              <p style={{ fontWeight: '800', color: 'var(--text-secondary)' }}>Launch New City</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Cities;
