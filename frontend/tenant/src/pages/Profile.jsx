import React, { useState, useEffect } from 'react';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [editedUser, setEditedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Not authenticated');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('http://localhost:5000/api/user/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setUser(data);
          setEditedUser(data);
          localStorage.setItem('user', JSON.stringify(data));
        } else {
          const storedUser = JSON.parse(localStorage.getItem('user'));
          setUser(storedUser);
          setEditedUser(storedUser);
        }
      } catch (e) {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        setUser(storedUser);
        setEditedUser(storedUser);
      }
    } catch (err) {
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser({ ...editedUser, [name]: value });
  };

  const handleSave = async () => {
    setSaveLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/user/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editedUser)
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data);
        localStorage.setItem('user', JSON.stringify(data));
        setIsEditing(false);
      } else {
        alert('Failed to update profile');
      }
    } catch (err) {
      alert('Error updating profile');
    } finally {
      setSaveLoading(false);
    }
  };

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading profile...</div>;
  if (error) return <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--accent-error)' }}>{error}</div>;
  if (!user) return <div style={{ padding: '2rem', textAlign: 'center' }}>No user data found.</div>;

  return (
    <div className="profile-page">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1>👤 My Profile</h1>
          <p>Manage your personal information and preferences.</p>
        </div>
        <button 
          className={`btn ${isEditing ? 'btn-secondary' : 'btn-primary'}`} 
          onClick={() => isEditing ? setIsEditing(false) : setIsEditing(true)}
          style={{ padding: '0.8rem 1.5rem' }}
        >
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </button>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '350px 1fr', gap: '2rem' }}>
        {/* Left: Avatar & Basic Info */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card" style={{ textAlign: 'center', padding: '2.5rem 2rem' }}>
            <div style={{ 
              width: '120px', height: '120px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent-primary), #6366f1)', 
              margin: '0 auto 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '3.5rem', color: 'white', fontWeight: 'bold', boxShadow: '0 10px 25px rgba(56, 189, 248, 0.3)'
            }}>
              {user.name?.[0]}
            </div>
            {isEditing ? (
              <input 
                type="text" 
                name="name" 
                value={editedUser.name} 
                onChange={handleInputChange} 
                style={{ width: '100%', textAlign: 'center', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'white', padding: '0.5rem' }}
              />
            ) : (
              <h2 style={{ marginBottom: '0.5rem', fontSize: '1.8rem' }}>{user.name}</h2>
            )}
            <p style={{ color: 'var(--accent-primary)', fontWeight: '600', marginBottom: '1.5rem', letterSpacing: '1px', textTransform: 'uppercase', fontSize: '0.8rem' }}>
              {user.role}
            </p>
            <div style={{ padding: '0.6rem 1.2rem', background: 'var(--bg-tertiary)', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'inline-block', width: '100%' }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Occupation: </span>
              <span style={{ fontWeight: 'bold' }}>{user.occupation || 'N/A'}</span>
            </div>
          </div>

          <div className="card" style={{ background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
            <h4 style={{ color: 'var(--accent-success)', marginBottom: '1rem' }}>Account Status</h4>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Verified Account</span>
              <span style={{ color: 'var(--accent-success)', fontWeight: 'bold' }}>✓ ACTIVE</span>
            </div>
          </div>
        </aside>

        {/* Right: Detailed Info */}
        <main style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Section: Personal Information */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
              <h3 style={{ margin: 0 }}>Basic Details</h3>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
              <ProfileField label="Email Address" value={user.email} name="email" isEditing={false} />
              <ProfileField label="Mobile Number" value={user.mobile} name="mobile" isEditing={isEditing} editedValue={editedUser.mobile} onChange={handleInputChange} />
              <ProfileField label="Age" value={user.age} name="age" type="number" isEditing={isEditing} editedValue={editedUser.age} onChange={handleInputChange} />
              <ProfileField label="Gender" value={user.gender} name="gender" isEditing={isEditing} editedValue={editedUser.gender} onChange={handleInputChange} />
              <ProfileField label="Emergency Contact" value={user.emergencyContact} name="emergencyContact" isEditing={isEditing} editedValue={editedUser.emergencyContact} onChange={handleInputChange} />
              <ProfileField label="Language" value={user.language} name="language" isEditing={isEditing} editedValue={editedUser.language} onChange={handleInputChange} />
            </div>
          </div>

          {/* Section: Smart Profile */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
              <h3 style={{ margin: 0 }}>Stay Preferences</h3>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
              <ProfileField label="Preferred City" value={user.city} name="city" isEditing={isEditing} editedValue={editedUser.city} onChange={handleInputChange} />
              <ProfileField label="Budget Range" value={user.budget} name="budget" isEditing={isEditing} editedValue={editedUser.budget} onChange={handleInputChange} />
              <ProfileField label="Sleep Timing" value={user.sleepTiming} name="sleepTiming" isEditing={isEditing} editedValue={editedUser.sleepTiming} onChange={handleInputChange} />
              <ProfileField label="Food Preference" value={user.foodPref} name="foodPref" isEditing={isEditing} editedValue={editedUser.foodPref} onChange={handleInputChange} />
              <ProfileField label="Shift Timing" value={user.shiftTiming} name="shiftTiming" isEditing={isEditing} editedValue={editedUser.shiftTiming} onChange={handleInputChange} />
              <ProfileField label="Stay Duration" value={user.stayDuration} name="stayDuration" isEditing={isEditing} editedValue={editedUser.stayDuration} onChange={handleInputChange} />
            </div>
          </div>

          {isEditing && (
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button 
                className="btn btn-primary" 
                style={{ flex: 1, padding: '1rem' }} 
                onClick={handleSave}
                disabled={saveLoading}
              >
                {saveLoading ? 'Saving Changes...' : 'Save Profile Changes'}
              </button>
              <button 
                className="btn btn-secondary" 
                style={{ padding: '1rem 2rem' }} 
                onClick={() => setIsEditing(false)}
              >
                Discard
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

const ProfileField = ({ label, value, name, isEditing, editedValue, onChange, type = "text" }) => (
  <div className="profile-field">
    <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.5rem', fontWeight: '500' }}>{label}</label>
    {isEditing ? (
      <input 
        type={type} 
        name={name} 
        value={editedValue || ''} 
        onChange={onChange} 
        style={{ 
          width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', 
          borderRadius: '10px', padding: '0.8rem', color: 'white', fontSize: '1rem'
        }} 
      />
    ) : (
      <p style={{ fontWeight: '600', fontSize: '1.05rem', margin: 0, padding: '0.8rem 0' }}>{value || 'Not provided'}</p>
    )}
  </div>
);

export default Profile;
