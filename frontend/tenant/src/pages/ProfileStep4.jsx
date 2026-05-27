import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProfileStep4.css';

const ProfileStep4 = () => {
  const navigate = useNavigate();
  const photoInputRef  = useRef(null);
  const idInputRef     = useRef(null);

  const [form, setForm] = useState({
    profilePhoto:     null,
    photoPreview:     null,
    idProof:          null,
    idProofPreview:   null,
    idProofName:      '',
    emergencyContact: '',
    addressLine1:     '',
    addressLine2:     '',
    city:             '',
    state:            '',
    pincode:          '',
    agreedToTerms:    false,
  });

  const [errors,  setErrors]  = useState({});
  const [saving,  setSaving]  = useState(false);
  const [success, setSuccess] = useState(false);
  const [dragOver, setDragOver] = useState({ photo: false, id: false });

  /* ── field setter ── */
  const set = (key, val) => {
    setForm(p => ({ ...p, [key]: val }));
    setErrors(p => ({ ...p, [key]: '' }));
  };

  /* ── photo upload ── */
  const handlePhotoFile = (file) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { setErrors(p => ({ ...p, profilePhoto: 'Max file size is 5 MB.' })); return; }
    const reader = new FileReader();
    reader.onload = e => set('photoPreview', e.target.result);
    reader.readAsDataURL(file);
    set('profilePhoto', file);
    setErrors(p => ({ ...p, profilePhoto: '' }));
  };

  /* ── ID proof upload ── */
  const handleIdFile = (file) => {
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) { setErrors(p => ({ ...p, idProof: 'Max file size is 10 MB.' })); return; }
    const isImage = file.type.startsWith('image/');
    const reader = new FileReader();
    reader.onload = e => {
      set('idProofPreview', isImage ? e.target.result : null);
      set('idProofName', file.name);
    };
    reader.readAsDataURL(file);
    set('idProof', file);
    setErrors(p => ({ ...p, idProof: '' }));
  };

  /* ── drag & drop ── */
  const onDrop = (type, e) => {
    e.preventDefault();
    setDragOver(p => ({ ...p, [type]: false }));
    const file = e.dataTransfer.files[0];
    if (type === 'photo') handlePhotoFile(file);
    else handleIdFile(file);
  };

  /* ── validate ── */
  const validate = () => {
    const e = {};
    if (!form.profilePhoto)     e.profilePhoto     = 'Profile photo is required.';
    if (!form.idProof)          e.idProof           = 'ID proof document is required.';
    if (!form.emergencyContact) e.emergencyContact  = 'Emergency contact is required.';
    else if (!/^\+?[\d\s-]{10,15}$/.test(form.emergencyContact.trim()))
                                e.emergencyContact  = 'Enter a valid phone number.';
    if (!form.addressLine1)     e.addressLine1      = 'Address line 1 is required.';
    if (!form.city)             e.city              = 'City is required.';
    if (!form.state)            e.state             = 'State is required.';
    if (!form.pincode)          e.pincode           = 'Pincode is required.';
    else if (!/^\d{6}$/.test(form.pincode.trim()))
                                e.pincode           = 'Enter a valid 6-digit pincode.';
    if (!form.agreedToTerms)    e.agreedToTerms     = 'You must agree to the Terms & Conditions.';
    return e;
  };

  /* ── submit ── */
  const handleComplete = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setSaving(true);
    await new Promise(r => setTimeout(r, 1400));   // simulate API
    try {
      const existing = JSON.parse(localStorage.getItem('profileSetup') || '{}');
      localStorage.setItem('profileSetup', JSON.stringify({
        ...existing,
        step4: {
          emergencyContact: form.emergencyContact,
          address: {
            line1: form.addressLine1, line2: form.addressLine2,
            city: form.city, state: form.state, pincode: form.pincode,
          },
          agreedToTerms: form.agreedToTerms,
        },
        completed: true,
      }));
    } catch (_) {}
    setSaving(false);
    setSuccess(true);
  };

  /* ── success screen ── */
  if (success) return (
    <div className="ps4-overlay">
      <div className="ps4-success-modal slide-up">
        <div className="ps4-success-animation">
          <div className="ps4-success-circle">
            <svg className="ps4-checkmark" viewBox="0 0 52 52">
              <circle className="ps4-checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
              <path className="ps4-checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
            </svg>
          </div>
          <div className="ps4-confetti">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="ps4-confetti-piece" style={{ '--i': i }} />
            ))}
          </div>
        </div>
        <h2 className="ps4-success-title">Profile Complete! 🎉</h2>
        <p className="ps4-success-msg">
          Welcome aboard! Your Livora tenant profile is fully set up. You're all set to explore and book your perfect hostel.
        </p>
        <div className="ps4-success-badges">
          <div className="ps4-badge-item">
            <span>✅</span><span>Verified Tenant</span>
          </div>
          <div className="ps4-badge-item">
            <span>🏆</span><span>100% Complete</span>
          </div>
          <div className="ps4-badge-item">
            <span>🔐</span><span>ID Submitted</span>
          </div>
        </div>
        <button className="ps4-btn-go" onClick={() => navigate('/profile')}>
          Go to My Profile
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </button>
      </div>
    </div>
  );

  return (
    <div className="ps4-overlay">
      <div className="ps4-modal slide-up">

        {/* ── close ── */}
        <button className="ps4-close" onClick={() => navigate('/profile')} aria-label="Close">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>

        {/* ── hero ── */}
        <div className="ps4-hero">
          <div className="ps4-step-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          </div>
          <h1 className="ps4-title">Verification &amp; Final Setup</h1>
          <p className="ps4-subtitle">Complete your verification to unlock full access</p>
        </div>

        {/* ── progress ── */}
        <div className="ps4-progress-wrap">
          <div className="ps4-progress-meta">
            <span className="ps4-step-label">Step 4 of 4 — Final Step!</span>
            <span className="ps4-pct">100%</span>
          </div>
          <div className="ps4-progress-track">
            <div className="ps4-progress-bar" style={{ width: '100%' }} />
          </div>
          <div className="ps4-step-dots">
            {[1,2,3,4].map(s => (
              <div key={s} className={`ps4-dot done ${s === 4 ? 'current' : ''}`}>
                {s < 4
                  ? <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                  : <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                }
              </div>
            ))}
          </div>
        </div>

        {/* ── form ── */}
        <div className="ps4-form">

          {/* Profile Photo */}
          <div className={`ps4-field ${errors.profilePhoto ? 'has-error' : ''}`}>
            <label className="ps4-label">
              <span className="ps4-label-icon">📸</span> Profile Photo
            </label>
            <div
              className={`ps4-upload-zone photo-zone ${dragOver.photo ? 'drag-over' : ''} ${form.photoPreview ? 'has-file' : ''}`}
              onDragOver={e => { e.preventDefault(); setDragOver(p => ({ ...p, photo: true })); }}
              onDragLeave={() => setDragOver(p => ({ ...p, photo: false }))}
              onDrop={e => onDrop('photo', e)}
              onClick={() => photoInputRef.current?.click()}
            >
              {form.photoPreview ? (
                <div className="ps4-photo-preview">
                  <img src={form.photoPreview} alt="Profile preview" />
                  <button type="button" className="ps4-remove-btn"
                    onClick={e => { e.stopPropagation(); set('profilePhoto', null); set('photoPreview', null); }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  </button>
                  <div className="ps4-photo-overlay">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                      <circle cx="12" cy="13" r="4"/>
                    </svg>
                    Change Photo
                  </div>
                </div>
              ) : (
                <div className="ps4-upload-placeholder">
                  <div className="ps4-upload-icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                      <circle cx="12" cy="13" r="4"/>
                    </svg>
                  </div>
                  <p className="ps4-upload-text">Drop photo here or <span>click to browse</span></p>
                  <p className="ps4-upload-hint">JPG, PNG, WebP · Max 5 MB</p>
                </div>
              )}
              <input ref={photoInputRef} type="file" accept="image/*" hidden
                onChange={e => handlePhotoFile(e.target.files[0])} />
            </div>
            {errors.profilePhoto && <span className="ps4-error-msg">{errors.profilePhoto}</span>}
          </div>

          {/* ID Proof */}
          <div className={`ps4-field ${errors.idProof ? 'has-error' : ''}`}>
            <label className="ps4-label">
              <span className="ps4-label-icon">🪪</span> ID Proof
              <span className="ps4-badge-hint">Aadhaar / Passport / Driving Licence</span>
            </label>
            <div
              className={`ps4-upload-zone id-zone ${dragOver.id ? 'drag-over' : ''} ${form.idProof ? 'has-file' : ''}`}
              onDragOver={e => { e.preventDefault(); setDragOver(p => ({ ...p, id: true })); }}
              onDragLeave={() => setDragOver(p => ({ ...p, id: false }))}
              onDrop={e => onDrop('id', e)}
              onClick={() => !form.idProof && idInputRef.current?.click()}
            >
              {form.idProof ? (
                <div className="ps4-id-preview">
                  {form.idProofPreview
                    ? <img src={form.idProofPreview} alt="ID preview" />
                    : (
                      <div className="ps4-file-icon">
                        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                          <polyline points="14 2 14 8 20 8"/>
                        </svg>
                      </div>
                    )
                  }
                  <div className="ps4-id-info">
                    <p className="ps4-id-name">{form.idProofName}</p>
                    <p className="ps4-id-size">
                      {form.idProof.size > 1024*1024
                        ? `${(form.idProof.size / (1024*1024)).toFixed(1)} MB`
                        : `${(form.idProof.size / 1024).toFixed(0)} KB`}
                    </p>
                    <div className="ps4-id-status">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                      Ready to upload
                    </div>
                  </div>
                  <button type="button" className="ps4-remove-btn"
                    onClick={e => { e.stopPropagation(); set('idProof', null); set('idProofPreview', null); set('idProofName', ''); }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  </button>
                </div>
              ) : (
                <div className="ps4-upload-placeholder">
                  <div className="ps4-upload-icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="17 8 12 3 7 8"/>
                      <line x1="12" y1="3" x2="12" y2="15"/>
                    </svg>
                  </div>
                  <p className="ps4-upload-text">Drop ID document here or <span>click to browse</span></p>
                  <p className="ps4-upload-hint">JPG, PNG, PDF · Max 10 MB</p>
                </div>
              )}
              <input ref={idInputRef} type="file" accept="image/*,application/pdf" hidden
                onChange={e => handleIdFile(e.target.files[0])} />
            </div>
            {errors.idProof && <span className="ps4-error-msg">{errors.idProof}</span>}
          </div>

          {/* Emergency Contact */}
          <div className={`ps4-field ${errors.emergencyContact ? 'has-error' : ''}`}>
            <label className="ps4-label">
              <span className="ps4-label-icon">📞</span> Emergency Contact Number
            </label>
            <div className="ps4-input-wrap">
              <span className="ps4-input-prefix">+91</span>
              <input
                type="tel"
                className="ps4-input with-prefix"
                placeholder="9876543210"
                value={form.emergencyContact}
                onChange={e => set('emergencyContact', e.target.value)}
                maxLength={15}
              />
            </div>
            {errors.emergencyContact && <span className="ps4-error-msg">{errors.emergencyContact}</span>}
          </div>

          {/* Address */}
          <div className="ps4-field">
            <label className="ps4-label">
              <span className="ps4-label-icon">📍</span> Address Details
            </label>
            <div className="ps4-address-card">
              <div className={`ps4-addr-field ${errors.addressLine1 ? 'has-error' : ''}`}>
                <input
                  className="ps4-input"
                  placeholder="Address Line 1 *"
                  value={form.addressLine1}
                  onChange={e => set('addressLine1', e.target.value)}
                />
                {errors.addressLine1 && <span className="ps4-error-msg small">{errors.addressLine1}</span>}
              </div>
              <div className="ps4-addr-field">
                <input
                  className="ps4-input"
                  placeholder="Address Line 2 (Optional)"
                  value={form.addressLine2}
                  onChange={e => set('addressLine2', e.target.value)}
                />
              </div>
              <div className="ps4-addr-row">
                <div className={`ps4-addr-field ${errors.city ? 'has-error' : ''}`}>
                  <input
                    className="ps4-input"
                    placeholder="City *"
                    value={form.city}
                    onChange={e => set('city', e.target.value)}
                  />
                  {errors.city && <span className="ps4-error-msg small">{errors.city}</span>}
                </div>
                <div className={`ps4-addr-field ${errors.state ? 'has-error' : ''}`}>
                  <input
                    className="ps4-input"
                    placeholder="State *"
                    value={form.state}
                    onChange={e => set('state', e.target.value)}
                  />
                  {errors.state && <span className="ps4-error-msg small">{errors.state}</span>}
                </div>
                <div className={`ps4-addr-field ${errors.pincode ? 'has-error' : ''}`}>
                  <input
                    className="ps4-input"
                    placeholder="Pincode *"
                    value={form.pincode}
                    onChange={e => set('pincode', e.target.value)}
                    maxLength={6}
                  />
                  {errors.pincode && <span className="ps4-error-msg small">{errors.pincode}</span>}
                </div>
              </div>
            </div>
          </div>

          {/* Terms */}
          <div className={`ps4-field ${errors.agreedToTerms ? 'has-error' : ''}`}>
            <div
              className={`ps4-terms-card ${form.agreedToTerms ? 'agreed' : ''}`}
              onClick={() => set('agreedToTerms', !form.agreedToTerms)}
            >
              <div className={`ps4-checkbox ${form.agreedToTerms ? 'checked' : ''}`}>
                {form.agreedToTerms && (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                )}
              </div>
              <div className="ps4-terms-text">
                <p className="ps4-terms-main">I agree to the Terms &amp; Conditions</p>
                <p className="ps4-terms-sub">
                  By completing your profile, you agree to Livora's{' '}
                  <a href="/terms" onClick={e => e.stopPropagation()} className="ps4-link">Terms of Service</a>
                  {' '}and{' '}
                  <a href="/privacy" onClick={e => e.stopPropagation()} className="ps4-link">Privacy Policy</a>.
                </p>
              </div>
            </div>
            {errors.agreedToTerms && <span className="ps4-error-msg">{errors.agreedToTerms}</span>}
          </div>

          {/* Security note */}
          <div className="ps4-security-note">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            Your data is encrypted and securely stored. We never share your personal information.
          </div>

        </div>{/* /form */}

        {/* ── actions ── */}
        <div className="ps4-actions">
          <button className="ps4-btn-back" onClick={() => navigate('/profile-setup/step3')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
            Back
          </button>
          <button className="ps4-btn-complete" onClick={handleComplete} disabled={saving}>
            {saving ? (
              <>
                <span className="ps4-spinner" />
                Completing Profile…
              </>
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
                Complete Profile
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};

export default ProfileStep4;
