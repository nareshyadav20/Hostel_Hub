import React from 'react';
import { X } from 'lucide-react';

export const FloorCard = ({ floor, onViewRooms, onDelete }) => (
  <div style={styles.card}>
    <div style={styles.info}>
      <h4 style={styles.title}>Floor {floor.floorNumber}</h4>
      <p style={styles.detail}>Rooms: {floor.totalRooms || 0}</p>
      <p style={styles.detail}>Beds: {floor.totalBeds || 0}</p>
    </div>
    <div style={styles.actions}>
      <button style={styles.btn} onClick={() => onViewRooms(floor)}>
        View Rooms
      </button>
      <button style={styles.deleteBtn} onClick={() => onDelete(floor)}>
        Delete
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
  btn: { padding: '0.4rem 0.8rem', background: 'var(--accent-primary)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' },
  deleteBtn: { padding: '0.4rem 0.8rem', background: '#EF4444', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }
};
