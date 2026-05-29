// src/components/RoomCard.jsx
import React from 'react';
import { X } from 'lucide-react';

export const RoomCard = ({ room, onViewDetails }) => (
  <div style={styles.card}>
    <div style={styles.info}>
      <h4 style={styles.title}>Room {room.roomNumber}</h4>
      <p style={styles.detail}>Available Beds: {room.availableBeds ?? 0}</p>
      <p style={styles.detail}>Occupied Beds: {room.occupiedBeds ?? 0}</p>
    </div>
    <div style={styles.actions}>
      <button style={styles.btn} onClick={() => onViewDetails(room)}>
        Details
      </button>
    </div>
  </div>
);

const styles = {
  card: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem',
    marginBottom: '0.8rem',
    background: 'var(--bg-card)',
    borderRadius: '12px',
    border: '1px solid var(--border-color)',
    boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
  },
  info: { flex: 1 },
  title: { margin: 0, fontSize: '1.1rem', fontWeight: 900 },
  detail: { margin: '0.2rem 0', fontSize: '0.9rem', color: 'var(--text-muted)' },
  actions: { display: 'flex', gap: '0.5rem' },
  btn: { padding: '0.4rem 0.8rem', background: 'var(--accent-primary)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }
};
