import React, { useState } from 'react';

const Buildings = () => {
  const [buildings, setBuildings] = useState([
    { id: 1, name: 'Sunshine Residency', address: '123 Main St', rooms: 24, tenants: 60 },
    { id: 2, name: 'Moonlight Annex', address: '456 West Side', rooms: 12, tenants: 24 },
  ]);

  const [isAdding, setIsAdding] = useState(false);
  const [newBuilding, setNewBuilding] = useState({ name: '', address: '' });

  const handleAdd = (e) => {
    e.preventDefault();
    setBuildings([...buildings, { ...newBuilding, id: buildings.length + 1, rooms: 0, tenants: 0 }]);
    setNewBuilding({ name: '', address: '' });
    setIsAdding(false);
  };

  return (
    <div className="buildings-page">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1>🏢 Building Management</h1>
          <p>Manage multiple hostel buildings from here.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsAdding(true)}>+ Add Building</button>
      </header>

      {isAdding && (
        <div className="card" style={{ marginBottom: '2rem', animation: 'fadeIn 0.3s ease' }}>
          <h3>Add New Building</h3>
          <form onSubmit={handleAdd} style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="input-group">
              <label>Building Name</label>
              <input 
                type="text" 
                placeholder="e.g. Blue Sky Towers" 
                value={newBuilding.name}
                onChange={(e) => setNewBuilding({...newBuilding, name: e.target.value})}
                required 
              />
            </div>
            <div className="input-group">
              <label>Address</label>
              <input 
                type="text" 
                placeholder="e.g. 789 North Ave" 
                value={newBuilding.address}
                onChange={(e) => setNewBuilding({...newBuilding, address: e.target.value})}
                required 
              />
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button type="submit" className="btn btn-primary">Save Building</button>
              <button type="button" className="btn" onClick={() => setIsAdding(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {buildings.map((building) => (
          <div key={building.id} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <h3>{building.name}</h3>
              <span style={{ fontSize: '0.8rem', background: 'var(--accent-primary)', color: 'var(--bg-primary)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>ACTIVE</span>
            </div>
            <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>📍 {building.address}</p>
            <div style={{ display: 'flex', gap: '2rem', marginTop: '1.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
              <div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Rooms</p>
                <p style={{ fontWeight: '700' }}>{building.rooms}</p>
              </div>
              <div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Tenants</p>
                <p style={{ fontWeight: '700' }}>{building.tenants}</p>
              </div>
            </div>
            <div style={{ marginTop: '1.5rem' }}>
              <button className="btn" style={{ width: '100%', border: '1px solid var(--border-color)' }}>Manage Rooms</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Buildings;
