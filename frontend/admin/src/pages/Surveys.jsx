import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { ClipboardList, Plus, Search, MoreVertical, MessageCircle, X } from 'lucide-react';

const initialSurveys = [
  { id: 1, title: 'Resident Satisfaction Q3', responses: 1240, status: 'Active', created: 'Oct 1, 2024' },
  { id: 2, title: 'New Amenity Feedback', responses: 850, status: 'Draft', created: 'Oct 15, 2024' },
  { id: 3, title: 'Warden Performance Hub', responses: 2100, status: 'Closed', created: 'Aug 20, 2024' },
];

const surveyData = [
  { name: 'Food Quality', score: 85 },
  { name: 'Cleanliness', score: 92 },
  { name: 'WiFi Speed', score: 45 },
  { name: 'Safety', score: 98 },
  { name: 'Pricing', score: 72 },
];

const Surveys = () => {
  const [surveys, setSurveys] = useState(initialSurveys);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: '', type: 'Rating Scale' });

  const handleAdd = (e) => {
    e.preventDefault();
    setSurveys([{ id: Date.now(), title: form.title, responses: 0, status: 'Draft', created: new Date().toLocaleDateString('en-GB') }, ...surveys]);
    setShowModal(false);
    setForm({ title: '', type: 'Rating Scale' });
  };

  return (
    <div className="animate-fade" style={{ maxWidth: '1300px' }}>
      <div className="page-header">
        <div>
          <h1>Voice of Residents</h1>
          <p>Analyze feedback and conduct platform-wide surveys.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={16} /> Design New Survey
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.5fr)', gap: '2rem' }}>
        <div className="card">
          <h3 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <MessageCircle size={18} color="#7c3aed" /> Satisfaction Scores
          </h3>
          <div style={{ width: '100%', height: 320 }}>
            <ResponsiveContainer>
              <BarChart data={surveyData} layout="vertical">
                <XAxis type="number" hide domain={[0, 100]} />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} width={90} />
                <Tooltip cursor={{ fill: 'rgba(255,255,255,0.02)' }} contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '8px', color: '#f8fafc' }} />
                <Bar dataKey="score" radius={[0, 6, 6, 0]} fill="#7c3aed" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div style={{ marginTop: '1.5rem', padding: '0.8rem 1rem', background: 'rgba(239,68,68,0.05)', borderRadius: '10px', border: '1px dashed rgba(239,68,68,0.3)', fontSize: '0.82rem', color: '#ef4444' }}>
            ⚠️ WiFi Speed below 50% threshold — action needed.
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="card" style={{ padding: '1rem' }}>
            <div className="search-bar">
              <Search size={16} color="#475569" />
              <input type="text" placeholder="Search surveys..." />
            </div>
          </div>

          {surveys.map(s => (
            <div key={s.id} className="card" style={{ padding: '1rem 1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <div style={{ padding: '0.6rem', background: 'rgba(255,255,255,0.03)', borderRadius: '10px' }}>
                    <ClipboardList size={20} color={s.status === 'Active' ? '#7c3aed' : '#475569'} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600 }}>{s.title}</div>
                    <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '0.2rem' }}>
                      {s.responses} responses · {s.created}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                  <span className={`badge ${s.status === 'Active' ? 'badge-success' : s.status === 'Draft' ? 'badge-warning' : 'badge-danger'}`}>{s.status}</span>
                  <button style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#475569' }}><MoreVertical size={18} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowModal(false)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', color: '#475569', cursor: 'pointer' }}><X size={20} /></button>
            <div className="modal-header"><h2>Design New Survey</h2><p>Create a feedback survey to share with residents.</p></div>
            <form onSubmit={handleAdd}>
              <div className="form-group">
                <label className="form-label">Survey Title</label>
                <input className="form-input" required placeholder="e.g. Q4 Resident Satisfaction" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Question Type</label>
                <select className="form-input" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                  <option>Rating Scale (1-10)</option>
                  <option>Multiple Choice</option>
                  <option>Open Text</option>
                  <option>Yes / No</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Target Audience</label>
                <select className="form-input">
                  <option>All Tenants</option>
                  <option>Specific Hostel</option>
                  <option>City: Bangalore</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 2 }}>Create Survey</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Surveys;
