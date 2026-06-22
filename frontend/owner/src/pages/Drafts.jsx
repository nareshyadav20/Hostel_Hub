import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Building2, Trash2, Edit2 } from 'lucide-react';
import { api } from '../api';

const TOTAL_STEPS = 5;
const STEP_CONFIG = [
  { title: 'Basic Info' },
  { title: 'Property Details' },
  { title: 'Location' },
  { title: 'Financials' },
  { title: 'Legal & Contact' }
];

export default function Drafts() {
  const [drafts, setDrafts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDrafts();
  }, []);

  const fetchDrafts = async () => {
    setIsLoading(true);
    try {
      const data = await api.getDraftBuildings();
      setDrafts((data || []).map(b => ({ ...b, id: b._id || b.id })));
    } catch (err) {
      console.error('Failed to fetch drafts', err);
    }
    setIsLoading(false);
  };

  const deleteDraft = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to permanently delete this draft?')) return;
    try {
      await api.deleteBuilding(id);
      fetchDrafts();
    } catch (err) {
      console.error(err);
      alert('Failed to delete draft');
    }
  };

  const resumeDraft = (draft) => {
    // Navigate to Portfolio and tell it to resume this draft
    navigate('/owner/portfolio', { state: { resumeDraftId: draft.id || draft._id } });
  };

  const openFreshForm = () => {
    navigate('/owner/portfolio', { state: { openNewForm: true } });
  };

  if (isLoading) {
    return (
      <div style={{ padding: '2rem', flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>Loading Drafts...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '900', color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.03em' }}>Saved Hostel Drafts</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.3rem', fontSize: '0.95rem' }}>
            {drafts.length} draft{drafts.length !== 1 ? 's' : ''} saved • click any card to continue filling details
          </p>
        </div>
        <button
          onClick={openFreshForm}
          style={{ padding: '0.8rem 1.6rem', borderRadius: '12px', background: 'var(--accent-primary)', color: "var(--text-on-primary)", border: 'none', fontWeight: '800', cursor: 'pointer', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.6rem', boxShadow: '0 8px 20px rgba(99,102,241,0.3)' }}
        >
          <Plus size={18} /> Create New Hostel
        </button>
      </div>

      {/* CONTENT */}
      {drafts.length === 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, minHeight: '40vh', gap: '1rem', background: 'var(--bg-card)', borderRadius: '24px', border: '1.5px dashed var(--border-color)' }}>
          <div style={{ fontSize: '4rem', opacity: 0.3 }}><Building2 size={64} /></div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-secondary)', margin: 0 }}>No saved drafts yet</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>Start creating a hostel and save your progress to resume later.</p>
          <button onClick={openFreshForm} style={{ marginTop: '0.5rem', padding: '0.8rem 1.6rem', borderRadius: '12px', background: 'var(--accent-primary)', color: "var(--text-on-primary)", border: 'none', fontWeight: '800', cursor: 'pointer', fontSize: '0.9rem' }}>
            + Create New Hostel
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {drafts.map(draft => {
            const progress = Math.round(((draft.lastStep || 1) / TOTAL_STEPS) * 100);
            const stepLabel = STEP_CONFIG[(draft.lastStep || 1) - 1]?.title || 'Basic Info';
            const ago = draft.updatedAt ? (() => { const d = (Date.now() - new Date(draft.updatedAt)) / 60000; return d < 60 ? `${Math.round(d)}m ago` : `${Math.round(d / 60)}h ago`; })() : 'Recently';
            return (
              <motion.div
                key={draft.id}
                whileHover={{ y: -5, boxShadow: '0 20px 48px rgba(99,102,241,0.2)', borderColor: '#6366F1' }}
                onClick={() => resumeDraft(draft)}
                style={{
                  padding: '1.5rem',
                  borderRadius: '18px',
                  border: '1.5px solid var(--border-color)',
                  background: 'var(--bg-card)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'border-color 0.2s'
                }}
              >
                {/* Progress accent stripe at top */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: `linear-gradient(90deg, #6366F1 ${progress}%, var(--border-color) ${progress}%)`, borderRadius: '4px 4px 0 0' }} />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
                    <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: 'linear-gradient(135deg, #6366F1, #3B82F6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: "var(--text-on-primary)", flexShrink: 0 }}><Building2 size={24} /></div>
                    <div>
                      <div style={{ fontWeight: '800', fontSize: '1rem', color: 'var(--text-primary)' }}>{draft.name || 'Untitled Draft'}</div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Last saved {ago}</div>
                    </div>
                  </div>
                  <span style={{ padding: '0.3rem 0.7rem', borderRadius: '20px', background: '#FEF3C7', color: '#D97706', fontSize: '0.68rem', fontWeight: '800', textTransform: 'uppercase', flexShrink: 0 }}>Draft</span>
                </div>

                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span style={{ color: 'var(--accent-primary)' }}><Edit2 size={14} /></span> Paused at: <b style={{ color: 'var(--text-primary)' }}>{stepLabel}</b>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '6px', fontWeight: '700' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Completion</span>
                    <span style={{ color: 'var(--accent-primary)', fontWeight: '900' }}>{progress}%</span>
                  </div>
                  <div style={{ height: '8px', background: 'var(--bg-tertiary)', borderRadius: '100px', overflow: 'hidden' }}>
                    <div style={{ width: `${progress}%`, height: '100%', background: 'linear-gradient(90deg, #6366F1, #3B82F6)', borderRadius: '100px', transition: 'width 0.6s ease' }} />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.8rem', marginTop: '0.5rem' }}>
                  <div style={{ flex: 1, padding: '0.75rem', borderRadius: '12px', background: 'linear-gradient(135deg, #6366F1, #3B82F6)', color: "var(--text-on-primary)", fontWeight: '800', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                    Continue Filling
                  </div>
                  <button
                    onClick={(e) => deleteDraft(e, draft.id)}
                    style={{ padding: '0.75rem 1rem', borderRadius: '12px', background: '#FEE2E2', color: '#EF4444', border: 'none', fontWeight: '700', cursor: 'pointer', fontSize: '0.85rem', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
