import React, { useState } from 'react';
import { Map, Plus, TrendingUp, Users, Building2, MapPin, X, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const initialCities = [
  { name: 'Bangalore', hubs: 12, properties: 45, tenants: 1840, growth: '+22%' },
  { name: 'Mumbai',    hubs: 8,  properties: 32, tenants: 1250, growth: '+15%' },
  { name: 'Pune',      hubs: 6,  properties: 28, tenants: 940,  growth: '+32%' },
  { name: 'Hyderabad', hubs: 4,  properties: 14, tenants: 450,  growth: '+4%' },
];

const Cities = () => {
  const navigate = useNavigate();
  const [cities, setCities] = useState(initialCities);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', hubs: '', properties: '', tenants: '' });

  const handleAdd = (e) => {
    e.preventDefault();
    setCities([{ name: form.name, hubs: parseInt(form.hubs) || 1, properties: parseInt(form.properties) || 0, tenants: parseInt(form.tenants) || 0, growth: 'New' }, ...cities]);
    setShowModal(false);
    setForm({ name: '', hubs: '', properties: '', tenants: '' });
  };

  return (
    <div className="animate-fade" style={{ maxWidth: '1300px' }}>
      {/* --- BACK NAVIGATION --- */}
      <button 
        onClick={() => navigate('/dashboard')}
        className="flex items-center gap-2 text-text-muted hover:text-primary transition-colors text-[10px] font-black uppercase tracking-[0.2em] group mb-6"
      >
        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
        Back to Dashboard
      </button>
      <div className="page-header">
        <div>
          <h1>City Intelligence & Expansion</h1>
          <p>Monitor regional performance and manage new territorial launches.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={16} /> Launch New City Hub
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
        {cities.map((city, idx) => (
          <div key={idx} className="card animate-fade">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
              <div>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 800, margin: 0 }}>{city.name}</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#94a3b8', fontSize: '0.85rem', marginTop: '0.3rem' }}>
                  <MapPin size={14} color="#7c3aed" /> Active Operations
                </div>
              </div>
              <span style={{ padding: '0.3rem 0.8rem', borderRadius: '8px', background: 'rgba(16,185,129,0.1)', color: '#10b981', fontWeight: 800, fontSize: '0.8rem' }}>
                {city.growth}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.8rem', marginBottom: '1.5rem' }}>
              {[
                { icon: <Building2 size={14} />, val: city.properties, label: 'Hostels' },
                { icon: <Users size={14} />, val: city.tenants.toLocaleString(), label: 'Tenants' },
                { icon: <TrendingUp size={14} />, val: city.hubs, label: 'Hubs' },
              ].map((s, i) => (
                <div key={i} style={{ textAlign: 'center', padding: '0.8rem', background: 'rgba(255,255,255,0.02)', borderRadius: '10px' }}>
                  <div style={{ color: '#475569', marginBottom: '0.3rem' }}>{s.icon}</div>
                  <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>{s.val}</div>
                  <div style={{ fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#475569' }}>{s.label}</div>
                </div>
              ))}
            </div>

            <button className="btn btn-secondary" style={{ width: '100%' }}>
              <Map size={16} /> View Heatmap
            </button>
          </div>
        ))}

        <div className="card" onClick={() => setShowModal(true)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed rgba(255,255,255,0.07)', background: 'transparent', cursor: 'pointer', minHeight: '220px' }}>
          <div style={{ textAlign: 'center', color: '#475569' }}>
            <Plus size={28} style={{ marginBottom: '0.7rem' }} />
            <p style={{ fontWeight: 600 }}>Launch New City</p>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowModal(false)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', color: '#475569', cursor: 'pointer' }}><X size={20} /></button>
            <div className="modal-header"><h2>Launch New City Hub</h2><p>Initialize a new regional market for HostelHub.</p></div>
            <form onSubmit={handleAdd}>
              <div className="form-group">
                <label className="form-label">City Name</label>
                <input className="form-input" required placeholder="e.g. Chennai" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Initial Hubs</label>
                  <input className="form-input" type="number" placeholder="e.g. 2" value={form.hubs} onChange={e => setForm({ ...form, hubs: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Target Properties</label>
                  <input className="form-input" type="number" placeholder="e.g. 10" value={form.properties} onChange={e => setForm({ ...form, properties: e.target.value })} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 2 }}>Initialize City</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cities;
