import React, { useState } from 'react';

const Rooms = () => {
  const [rooms, setRooms] = useState([
    { id: 1, number: '201', type: 'Triple sharing', floor: 2, beds: [{ id: '201A', occupied: true }, { id: '201B', occupied: false }, { id: '201C', occupied: false }] },
    { id: 2, number: '202', type: 'Double sharing', floor: 2, beds: [{ id: '202A', occupied: true }, { id: '202B', occupied: true }] },
    { id: 3, number: '101', type: 'Single', floor: 1, beds: [{ id: '101A', occupied: false }] },
  ]);

  const [isAdding, setIsAdding] = useState(false);

  const toggleBed = (roomId, bedId) => {
    setRooms(rooms.map(room => {
      if (room.id === roomId) {
        return {
          ...room,
          beds: room.beds.map(bed => 
            bed.id === bedId ? { ...bed, occupied: !bed.occupied } : bed
          )
        };
      }
      return room;
    }));
  };

  return (
    <div className="rooms-page">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1>🛏️ Rooms & Beds</h1>
          <p>Real-time occupancy tracking and room allocation.</p>
        </div>
        <button className="btn btn-primary">+ Add Room</button>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
        {rooms.map((room) => (
          <div key={room.id} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.4rem' }}>Room {room.number}</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{room.type} • Floor {room.floor}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Availability</p>
                <p style={{ fontWeight: '700', color: 'var(--accent-primary)' }}>
                  {room.beds.filter(b => !b.occupied).length} / {room.beds.length} Available
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              {room.beds.map((bed) => (
                <div 
                  key={bed.id}
                  onClick={() => toggleBed(room.id, bed.id)}
                  style={{
                    flex: 1,
                    minWidth: '80px',
                    padding: '1rem',
                    borderRadius: '12px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    border: '1px solid var(--border-color)',
                    background: bed.occupied ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                    borderColor: bed.occupied ? 'var(--accent-error)' : 'var(--accent-success)',
                    transition: 'var(--transition-fast)'
                  }}
                >
                  <p style={{ fontSize: '1.2rem', marginBottom: '0.3rem' }}>{bed.occupied ? '👤' : '🛏️'}</p>
                  <p style={{ fontSize: '0.75rem', fontWeight: '600', color: bed.occupied ? 'var(--accent-error)' : 'var(--accent-success)' }}>
                    {bed.occupied ? 'Occupied' : 'Available'}
                  </p>
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Bed {bed.id.slice(-1)}</p>
                </div>
              ))}
            </div>
            
            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.5rem' }}>
              <button className="btn" style={{ flex: 1, fontSize: '0.8rem', border: '1px solid var(--border-color)' }}>Edit Room</button>
              <button className="btn" style={{ flex: 1, fontSize: '0.8rem', border: '1px solid var(--border-color)' }}>View History</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Rooms;
