import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProfileStep3.css';

const AMENITIES = [
  { id: 'wifi',     label: 'WiFi',     icon: '📶' },
  { id: 'ac',       label: 'AC',       icon: '❄️' },
  { id: 'laundry',  label: 'Laundry',  icon: '👕' },
  { id: 'parking',  label: 'Parking',  icon: '🚗' },
  { id: 'gym',      label: 'Gym',      icon: '🏋️' },
  { id: 'kitchen',  label: 'Kitchen',  icon: '🍳' },
];

const ROOMMATE_TYPES = ['Any', 'Students Only', 'Working Professionals', 'Same Gender', 'Couple Friendly'];
const SCHEDULES     = ['Early Morning (5–9 AM)', 'Day Shift (9 AM–5 PM)', 'Evening (5–10 PM)', 'Night Shift', 'Flexible / WFH'];

const ProfileStep3 = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    foodPref:      '',
    smoking:       '',
    schedule:      '',
    roommateType:  '',
    amenities:     [],
    budgetMin:     5000,
    budgetMax:     20000,
  });

  const [errors, setErrors]   = useState({});
  const [saving, setSaving]   = useState(false);
  const [touched, setTouched] = useState({});

  /* ── helpers ── */
  const set = (key, val) => {
    setForm(p => ({ ...p, [key]: val }));
    setErrors(p => ({ ...p, [key]: '' }));
    setTouched(p => ({ ...p, [key]: true }));
  };

  const toggleAmenity = id =>
    set('amenities',
      form.amenities.includes(id)
        ? form.amenities.filter(a => a !== id)
        : [...form.amenities, id]
    );

  const validate = () => {
    const e = {};
    if (!form.foodPref)     e.foodPref     = 'Please select a food preference.';
    if (!form.smoking)      e.smoking      = 'Please select a smoking preference.';
    if (!form.schedule)     e.schedule     = 'Please select your schedule.';
    if (!form.roommateType) e.roommateType = 'Please select preferred roommate type.';
    return e;
  };

  const handleSave = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setSaving(true);
    await new Promise(r => setTimeout(r, 900));   // simulate API
    try {
      const existing = JSON.parse(localStorage.getItem('profileSetup') || '{}');
      localStorage.setItem('profileSetup', JSON.stringify({ ...existing, step3: form }));
    } catch (_) {}
    setSaving(false);
    navigate('/profile-setup/step4');
  };

  const progress = 75;

  return (
    <div className="ps3-overlay">
      <div className="ps3-modal slide-up">

        {/* ── close ── */}
        <button className="ps3-close" onClick={() => navigate('/profile')} aria-label="Close">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>

        {/* ── hero ── */}
        <div className="ps3-hero">
          <div className="ps3-step-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
              <path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/>
              <line x1="15" y1="9" x2="15.01" y2="9"/>
            </svg>
          </div>
          <h1 className="ps3-title">Lifestyle &amp; Requirements</h1>
          <p className="ps3-subtitle">Help us find your perfect hostel match</p>
        </div>

        {/* ── progress ── */}
        <div className="ps3-progress-wrap">
          <div className="ps3-progress-meta">
            <span className="ps3-step-label">Step 3 of 4</span>
            <span className="ps3-pct">{progress}%</span>
          </div>
          <div className="ps3-progress-track">
            <div className="ps3-progress-bar" style={{ width: `${progress}%` }} />
          </div>
          <div className="ps3-step-dots">
            {[1,2,3,4].map(s => (
              <div key={s} className={`ps3-dot ${s <= 3 ? 'done' : ''} ${s === 3 ? 'current' : ''}`}>
                {s < 3
                  ? <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                  : s}
              </div>
            ))}
          </div>
        </div>

        {/* ── form body ── */}
        <div className="ps3-form">

          {/* food preference */}
          <div className={`ps3-field ${errors.foodPref ? 'has-error' : ''}`}>
            <label className="ps3-label">
              <span className="ps3-label-icon">🍽️</span> Food Preference
            </label>
            <div className="ps3-toggle-group">
              {['Veg', 'Non-Veg', 'Both'].map(opt => (
                <button
                  key={opt}
                  type="button"
                  className={`ps3-toggle-btn ${form.foodPref === opt ? 'active' : ''}`}
                  onClick={() => set('foodPref', opt)}
                >
                  {opt === 'Veg' ? '🥦 ' : opt === 'Non-Veg' ? '🍗 ' : '🍱 '}{opt}
                </button>
              ))}
            </div>
            {errors.foodPref && <span className="ps3-error-msg">{errors.foodPref}</span>}
          </div>

          {/* smoking */}
          <div className={`ps3-field ${errors.smoking ? 'has-error' : ''}`}>
            <label className="ps3-label">
              <span className="ps3-label-icon">🚬</span> Smoking Preference
            </label>
            <div className="ps3-toggle-group">
              {['Yes', 'No'].map(opt => (
                <button
                  key={opt}
                  type="button"
                  className={`ps3-toggle-btn ${form.smoking === opt ? 'active' : ''} ${opt === 'No' ? 'no-smoke' : ''}`}
                  onClick={() => set('smoking', opt)}
                >
                  {opt === 'Yes' ? '✅ Smoker' : '🚫 Non-Smoker'}
                </button>
              ))}
            </div>
            {errors.smoking && <span className="ps3-error-msg">{errors.smoking}</span>}
          </div>

          {/* schedule */}
          <div className={`ps3-field ${errors.schedule ? 'has-error' : ''}`}>
            <label className="ps3-label">
              <span className="ps3-label-icon">⏰</span> Work / Study Schedule
            </label>
            <div className="ps3-select-wrap">
              <select
                className="ps3-select"
                value={form.schedule}
                onChange={e => set('schedule', e.target.value)}
              >
                <option value="">Select your daily schedule</option>
                {SCHEDULES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <svg className="ps3-select-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </div>
            {errors.schedule && <span className="ps3-error-msg">{errors.schedule}</span>}
          </div>

          {/* roommate type */}
          <div className={`ps3-field ${errors.roommateType ? 'has-error' : ''}`}>
            <label className="ps3-label">
              <span className="ps3-label-icon">🤝</span> Preferred Roommate Type
            </label>
            <div className="ps3-select-wrap">
              <select
                className="ps3-select"
                value={form.roommateType}
                onChange={e => set('roommateType', e.target.value)}
              >
                <option value="">Select roommate preference</option>
                {ROOMMATE_TYPES.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
              <svg className="ps3-select-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </div>
            {errors.roommateType && <span className="ps3-error-msg">{errors.roommateType}</span>}
          </div>

          {/* amenities */}
          <div className="ps3-field">
            <label className="ps3-label">
              <span className="ps3-label-icon">🏠</span> Amenities Needed
              <span className="ps3-optional">Optional</span>
            </label>
            <div className="ps3-amenities-grid">
              {AMENITIES.map(a => (
                <button
                  key={a.id}
                  type="button"
                  className={`ps3-amenity-chip ${form.amenities.includes(a.id) ? 'active' : ''}`}
                  onClick={() => toggleAmenity(a.id)}
                >
                  <span className="chip-icon">{a.icon}</span>
                  <span>{a.label}</span>
                  {form.amenities.includes(a.id) && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* budget */}
          <div className="ps3-field">
            <label className="ps3-label">
              <span className="ps3-label-icon">💰</span> Monthly Budget Range
            </label>
            <div className="ps3-budget-card">
              <div className="ps3-budget-display">
                <div className="ps3-budget-val">
                  <span className="bv-label">Min</span>
                  <span className="bv-amount">₹{form.budgetMin.toLocaleString()}</span>
                </div>
                <div className="ps3-budget-separator">—</div>
                <div className="ps3-budget-val">
                  <span className="bv-label">Max</span>
                  <span className="bv-amount">₹{form.budgetMax.toLocaleString()}</span>
                </div>
              </div>
              <div className="ps3-range-row">
                <span className="range-label">₹2K</span>
                <div className="ps3-range-wrap">
                  <input
                    type="range" min="2000" max="50000" step="500"
                    value={form.budgetMin}
                    onChange={e => {
                      const v = Number(e.target.value);
                      if (v < form.budgetMax) set('budgetMin', v);
                    }}
                    className="ps3-range"
                  />
                  <input
                    type="range" min="2000" max="50000" step="500"
                    value={form.budgetMax}
                    onChange={e => {
                      const v = Number(e.target.value);
                      if (v > form.budgetMin) set('budgetMax', v);
                    }}
                    className="ps3-range ps3-range-top"
                  />
                </div>
                <span className="range-label">₹50K</span>
              </div>
              <div className="ps3-budget-presets">
                {[
                  { label: 'Budget', min: 2000, max: 8000 },
                  { label: 'Mid',    min: 8000, max: 20000 },
                  { label: 'Premium', min: 20000, max: 50000 },
                ].map(p => (
                  <button
                    key={p.label}
                    type="button"
                    className={`budget-preset ${form.budgetMin === p.min && form.budgetMax === p.max ? 'active' : ''}`}
                    onClick={() => { set('budgetMin', p.min); set('budgetMax', p.max); }}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

        </div>{/* /form */}

        {/* ── actions ── */}
        <div className="ps3-actions">
          <button className="ps3-btn-back" onClick={() => navigate('/profile-setup/step2')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
            Back
          </button>
          <button className="ps3-btn-save" onClick={handleSave} disabled={saving}>
            {saving ? (
              <>
                <span className="ps3-spinner" />
                Saving…
              </>
            ) : (
              <>
                Save &amp; Continue
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};

export default ProfileStep3;
