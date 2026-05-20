import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Mail, Shield, ShieldCheck, Key, 
  Bell, Globe, Moon, Sun, Camera, 
  MapPin, Phone, Calendar, Edit2, Save, X,
  Activity, Lock, Smartphone, RefreshCw, Settings
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import API from '../api/axios';

const Profile = () => {
  const { showToast } = useToast();
  const { isDark, toggle } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    name: 'Super Admin',
    email: 'admin@livora.io',
    phone: '+91 98765 43210',
    role: 'Platform Root / Super Administrator',
    location: 'Bangalore, India',
    joined: 'Jan 2024',
    bio: 'Overseeing the entire Livora Hostel Hub ecosystem. Specialized in platform security and administrative intelligence.',
    avatar: ''
  });

  // Fetch real profile data from backend
  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await API.get('/admin/profile');
      if (res.data) {
        setProfile({
          name: res.data.name || 'Super Admin',
          email: res.data.email || 'admin@livora.io',
          phone: res.data.phone || '+91 98765 43210',
          role: 'Platform Root / Super Administrator',
          location: res.data.location || 'Bangalore, India',
          joined: res.data.createdAt ? new Date(res.data.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Jan 2024',
          bio: res.data.bio || 'Overseeing the entire Livora Hostel Hub ecosystem. Specialized in platform security and administrative intelligence.',
          avatar: res.data.avatar || ''
        });
      }
    } catch (err) {
      console.error('Failed to sync profile:', err);
      showToast('Failed to load profile data from backend.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        showToast("Image size must be less than 2MB.", "error");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result;

        // Immediately show the image in the UI (optimistic update)
        setProfile(prev => ({ ...prev, avatar: base64String }));

        // Save to backend in background
        try {
          const res = await API.put('/admin/profile', {
            name: profile.name,
            email: profile.email,
            phone: profile.phone,
            location: profile.location,
            bio: profile.bio,
            avatar: base64String
          });
          if (res.data) {
            // Sync with confirmed server value
            setProfile(prev => ({ ...prev, avatar: res.data.avatar || base64String }));
            showToast('Profile photo uploaded successfully!', 'success');
            // Dispatch local event to notify Sidebar or ProfileDropdown
            window.dispatchEvent(new Event('user-profile-updated'));
          }
        } catch (err) {
          console.error('Failed to upload photo:', err);
          showToast('Failed to save profile photo to database.', 'error');
          // Revert on failure
          setProfile(prev => ({ ...prev, avatar: '' }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await API.put('/admin/profile', {
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
        location: profile.location,
        bio: profile.bio,
        avatar: profile.avatar
      });
      if (res.data) {
        setProfile(prev => ({
          ...prev,
          name: res.data.name,
          email: res.data.email,
          phone: res.data.phone,
          location: res.data.location,
          bio: res.data.bio,
          avatar: res.data.avatar
        }));
        
        // Update localStorage user name/email to reflect changes dynamically
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        user.name = res.data.name;
        user.email = res.data.email;
        localStorage.setItem('user', JSON.stringify(user));
        
        // Dispatch local event to notify Sidebar or ProfileDropdown
        window.dispatchEvent(new Event('user-profile-updated'));
        
        showToast('Profile updated successfully!', 'success');
        setIsEditing(false);
      }
    } catch (err) {
      console.error('Failed to save profile:', err);
      showToast('Failed to save profile changes.', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading && !profile.name) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <RefreshCw className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* HEADER */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-surface p-8 rounded-3xl border border-divider shadow-soft relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl" />
        
        <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
          <div 
            className="relative group cursor-pointer" 
            onClick={() => document.getElementById('avatar-upload')?.click()}
            title="Click to upload profile photo"
          >
            {profile.avatar ? (
              <img 
                src={profile.avatar} 
                alt="Profile Avatar" 
                className="w-32 h-32 rounded-2xl object-cover shadow-xl border-4 border-surface group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="w-32 h-32 rounded-2xl bg-primary flex items-center justify-center text-white text-4xl font-bold shadow-xl shadow-primary/20 border-4 border-surface group-hover:scale-105 transition-transform duration-500">
                {profile.name ? profile.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'SA'}
              </div>
            )}
            <div className="absolute bottom-2 right-2 p-2 bg-surface border border-divider rounded-lg shadow-lg text-text-muted hover:text-primary transition-all scale-100 group-hover:scale-110 duration-300">
              <Camera size={16} />
            </div>
          </div>
          <input 
            id="avatar-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarChange}
          />
          
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold text-text-main tracking-tight">{profile.name}</h1>
            <p className="text-primary font-semibold mt-1">{profile.role}</p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-4">
              <div className="flex items-center gap-1.5 text-text-muted text-xs bg-gray-50 px-3 py-1.5 rounded-full border border-divider">
                <MapPin size={14} /> {profile.location}
              </div>
              <div className="flex items-center gap-1.5 text-text-muted text-xs bg-gray-50 px-3 py-1.5 rounded-full border border-divider">
                <Calendar size={14} /> Joined {profile.joined}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          <AnimatePresence mode="wait">
            {isEditing ? (
              <motion.div 
                key="editing"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex items-center gap-3"
              >
                <button 
                  disabled={saving}
                  onClick={() => setIsEditing(false)}
                  className="btn btn-secondary"
                >
                  <X size={18} /> Cancel
                </button>
                <button 
                  disabled={saving}
                  onClick={handleSave}
                  className="btn btn-primary"
                >
                  {saving ? <RefreshCw className="animate-spin" size={18} /> : <Save size={18} />}
                  Save Changes
                </button>
              </motion.div>
            ) : (
              <motion.button 
                key="viewing"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                onClick={() => setIsEditing(true)}
                className="btn btn-primary"
              >
                <Edit2 size={18} /> Edit Profile
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT COLUMN: INFO */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 space-y-8"
        >
          <div className="bg-surface border border-divider rounded-2xl shadow-soft p-8">
            <h3 className="text-lg font-bold text-text-main mb-6 flex items-center gap-2">
              <User size={20} className="text-primary" /> Personal Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { label: 'Full Name', key: 'name' },
                { label: 'Email Address', key: 'email' },
                { label: 'Phone Number', key: 'phone' },
                { label: 'Location', key: 'location' }
              ].map((field) => (
                <div key={field.key} className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted">{field.label}</label>
                  {isEditing ? (
                    <input 
                      className="w-full bg-gray-50 border border-divider rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary transition-all"
                      value={profile[field.key]}
                      onChange={(e) => setProfile({...profile, [field.key]: e.target.value})}
                    />
                  ) : (
                    <p className="text-sm font-semibold text-text-main px-1">{profile[field.key]}</p>
                  )}
                </div>
              ))}
              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Bio</label>
                {isEditing ? (
                  <textarea 
                    className="w-full bg-gray-50 border border-divider rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary transition-all resize-none"
                    rows={4}
                    value={profile.bio}
                    onChange={(e) => setProfile({...profile, bio: e.target.value})}
                  />
                ) : (
                  <p className="text-sm text-text-muted px-1 leading-relaxed">{profile.bio}</p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-surface border border-divider rounded-2xl shadow-soft p-8">
            <h3 className="text-lg font-bold text-text-main mb-6 flex items-center gap-2">
              <ShieldCheck size={20} className="text-primary" /> Security & Session
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-divider">
                <div className="flex items-center gap-3">
                  <Smartphone className="text-text-muted" size={18} />
                  <div>
                    <p className="text-sm font-bold text-text-main">Chrome on MacBook Pro</p>
                    <p className="text-[10px] text-text-muted">Current Session • Pune, India</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-success bg-success/10 px-2 py-1 rounded-full uppercase">Active Now</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* RIGHT COLUMN: PREFERENCES */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-8"
        >
          <div className="bg-surface border border-divider rounded-2xl shadow-soft p-8">
            <h3 className="text-lg font-bold text-text-main mb-6 flex items-center gap-2">
              <Settings size={20} className="text-primary" /> Preferences
            </h3>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-text-main">Dark Mode</p>
                  <p className="text-[10px] text-text-muted">System-wide appearance</p>
                </div>
                <button 
                  onClick={toggle}
                  className={`w-12 h-6 rounded-full relative transition-all duration-300 ${isDark ? 'bg-primary' : 'bg-gray-200'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 ${isDark ? 'left-7' : 'left-1'}`} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-text-main">Email Notifications</p>
                  <p className="text-[10px] text-text-muted">Reports & Security Alerts</p>
                </div>
                <button className="w-12 h-6 rounded-full bg-primary relative">
                  <div className="absolute top-1 left-7 w-4 h-4 rounded-full bg-white" />
                </button>
              </div>
            </div>
          </div>

          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-8">
            <div className="flex items-center gap-3 text-primary mb-4">
              <ShieldCheck size={24} />
              <h3 className="text-lg font-bold">Verified Account</h3>
            </div>
            <p className="text-xs text-text-muted leading-relaxed">
              You are logged in with **Root Privileges**. All actions are logged for security auditing.
            </p>
            <div className="mt-6 pt-6 border-t border-primary/10 flex items-center justify-between">
              <span className="text-[10px] font-bold text-primary uppercase">Trust Level</span>
              <span className="text-sm font-black text-primary">A+</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
