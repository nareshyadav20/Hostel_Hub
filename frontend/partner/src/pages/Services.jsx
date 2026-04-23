import React from 'react';
import { Plus } from 'lucide-react';

const Services = () => {
  return (
    <div className="dashboard-container">
      <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: '800' }}>Service Management</h1>
          <p>Add, edit, or remove services offered to hostels.</p>
        </div>
        <button className="btn btn-primary">
          <Plus size={18} /> Add New Service
        </button>
      </header>
      
      <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>Service list will appear here.</p>
      </div>
import React, { useState } from 'react';
import { Plus, Edit3, Trash2, X, Wrench, Search, ToggleLeft, ToggleRight } from 'lucide-react';

const categories = ['Health & Medicine', 'Beauty & Salon', 'Laundry', 'Food & Grocery', 'Fitness', 'Stationery', 'Courier', 'Other'];

const initialServices = [
  { id: 1, name: 'Medicine Delivery', category: 'Health & Medicine', description: 'Fast delivery of OTC and prescribed medicines to hostel rooms.', price: 50, available: true },
  { id: 2, name: 'Men\'s Haircut', category: 'Beauty & Salon', description: 'Professional haircut with styling at our nearby salon.', price: 200, available: true },
  { id: 3, name: 'Full Body Checkup', category: 'Health & Medicine', description: 'Comprehensive health checkup package for hostel residents.', price: 999, available: false },
  { id: 4, name: 'Laundry - Wash & Fold', category: 'Laundry', description: 'Pickup, wash, fold, and deliver within 24 hours.', price: 150, available: true },
];

const Services = () => {
  const [services, setServices] = useState(initialServices);
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [form, setForm] = useState({ name: '', category: '', description: '', price: '', available: true });

  const openAdd = () => {
    setEditingService(null);
    setForm({ name: '', category: '', description: '', price: '', available: true });
    setShowModal(true);
  };

  const openEdit = (service) => {
    setEditingService(service);
    setForm({ ...service, price: String(service.price) });
    setShowModal(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (editingService) {
      setServices(services.map(s => s.id === editingService.id ? { ...s, ...form, price: Number(form.price) } : s));
    } else {
      setServices([...services, { ...form, price: Number(form.price), id: Date.now() }]);
    }
    setShowModal(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this service?')) {
      setServices(services.filter(s => s.id !== id));
    }
  };

  const toggleAvailability = (id) => {
    setServices(services.map(s => s.id === id ? { ...s, available: !s.available } : s));
  };

  const filtered = services.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="page-container" id="services-page">
      <div className="section-header">
        <div className="page-header" style={{ marginBottom: 0 }}>
          <h1>Service Management</h1>
          <p>Add, edit, and manage your service offerings</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd} id="add-service-btn">
          <Plus size={18} /> Add Service
        </button>
      </div>

      {/* Search */}
      <div style={{
        background: 'var(--bg-secondary)', border: '1px solid var(--border-color)',
        borderRadius: '14px', padding: '0.7rem 1.2rem', display: 'flex', alignItems: 'center',
        gap: '0.8rem', marginBottom: '1.5rem', maxWidth: '400px',
      }}>
        <Search size={18} style={{ color: 'var(--text-muted)' }} />
        <input
          type="text" placeholder="Search services..." value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ background: 'none', border: 'none', color: 'var(--text-primary)', width: '100%', fontSize: '0.92rem', fontFamily: 'inherit', outline: 'none' }}
          id="search-services"
        />
      </div>

      {/* Service Cards */}
      {filtered.length === 0 ? (
        <div className="empty-state">
          <Wrench size={48} />
          <h3>No services found</h3>
          <p>Add your first service to start receiving orders from tenants.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.2rem' }}>
          {filtered.map(service => (
            <div className="card" key={service.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.2rem' }}>{service.name}</h3>
                  <span className="badge badge-active" style={{ fontSize: '0.72rem' }}>{service.category}</span>
                </div>
                <button
                  onClick={() => toggleAvailability(service.id)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: service.available ? 'var(--accent-success)' : 'var(--text-muted)', display: 'flex' }}
                  title={service.available ? 'Available' : 'Unavailable'}
                >
                  {service.available ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
                </button>
              </div>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5, flex: 1 }}>
                {service.description}
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.5rem', borderTop: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--accent-primary)' }}>₹{service.price}</span>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button className="btn btn-sm btn-secondary" onClick={() => openEdit(service)}>
                    <Edit3 size={14} /> Edit
                  </button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(service.id)}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingService ? 'Edit Service' : 'Add New Service'}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}><X size={18} /></button>
            </div>
            <form onSubmit={handleSave} id="service-form">
              <div className="form-group">
                <label>Service Name</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Medicine Delivery" required />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Category</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required>
                    <option value="">Select</option>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Price (₹)</label>
                  <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="0" min="0" required />
                </div>
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Describe your service..." rows={3} />
              </div>
              <div className="form-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', cursor: 'pointer' }}>
                  <input type="checkbox" checked={form.available} onChange={(e) => setForm({ ...form, available: e.target.checked })}
                    style={{ width: '18px', height: '18px', accentColor: 'var(--accent-primary)' }} />
                  Available for booking
                </label>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" id="save-service-btn">
                  {editingService ? 'Update Service' : 'Add Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Services;
