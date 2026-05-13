import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, Mail, Shield, ShieldCheck, Key, 
  Bell, Globe, Moon, Sun, Camera, 
  MapPin, Phone, Briefcase, Calendar,
  Edit2, Save, X
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Profile = () => {
  const { isDark, toggle } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: 'Super Admin',
    email: 'admin@livora.io',
    phone: '+91 98765 43210',
    role: 'Platform Root / Super Administrator',
    location: 'Bangalore, India',
    joined: 'Jan 2024',
    bio: 'Overseeing the entire Livora Hostel Hub ecosystem. Specialized in platform security and administrative intelligence.',
    avatar: 'SA'
  });

  const handleSave = () => {
    setIsEditing(false);
    // Add save logic here
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-surface p-8 rounded-3xl border border-divider shadow-soft relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl" />
        
        <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
          <div className="relative group">
            <div className="w-32 h-32 rounded-2xl bg-primary flex items-center justify-center text-white text-4xl font-bold shadow-xl shadow-primary/20 border-4 border-surface group-hover:scale-105 transition-transform duration-500">
              {profile.avatar}
            </div>
            <button className="absolute bottom-2 right-2 p-2 bg-surface border border-divider rounded-lg shadow-lg text-text-muted hover:text-primary transition-all scale-0 group-hover:scale-100 duration-300">
              <Camera size={16} />
            </button>
          </div>
          
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
          {isEditing ? (
            <>
              <button 
                onClick={() => setIsEditing(false)}
                className="flex items-center gap-2 px-6 py-2.5 bg-gray-50 text-text-main font-bold rounded-xl border border-divider hover:bg-gray-100 transition-all"
              >
                <X size={18} /> Cancel
              </button>
              <button 
                onClick={handleSave}
                className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:scale-105 transition-all"
              >
                <Save size={18} /> Save Changes
              </button>
            </>
          ) : (
            <button 
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:scale-105 transition-all"
            >
              <Edit2 size={18} /> Edit Profile
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT COLUMN: INFO */}
        <div className="lg:col-span-2 space-y-8">
          <div className="card-classic p-8">
            <h3 className="text-lg font-bold text-text-main mb-6 flex items-center gap-2">
              <User size={20} className="text-primary" /> Personal Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Full Name</label>
                {isEditing ? (
                  <input 
                    className="w-full bg-gray-50 border border-divider rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary transition-all"
                    value={profile.name}
                    onChange={(e) => setProfile({...profile, name: e.target.value})}
                  />
                ) : (
                  <p className="text-sm font-semibold text-text-main px-1">{profile.name}</p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Email Address</label>
                {isEditing ? (
                  <input 
                    className="w-full bg-gray-50 border border-divider rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary transition-all"
                    value={profile.email}
                    onChange={(e) => setProfile({...profile, email: e.target.value})}
                  />
                ) : (
                  <p className="text-sm font-semibold text-text-main px-1">{profile.email}</p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Phone Number</label>
                {isEditing ? (
                  <input 
                    className="w-full bg-gray-50 border border-divider rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary transition-all"
                    value={profile.phone}
                    onChange={(e) => setProfile({...profile, phone: e.target.value})}
                  />
                ) : (
                  <p className="text-sm font-semibold text-text-main px-1">{profile.phone}</p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Location</label>
                {isEditing ? (
                  <input 
                    className="w-full bg-gray-50 border border-divider rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary transition-all"
                    value={profile.location}
                    onChange={(e) => setProfile({...profile, location: e.target.value})}
                  />
                ) : (
                  <p className="text-sm font-semibold text-text-main px-1">{profile.location}</p>
                )}
              </div>
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

          <div className="card-classic p-8">
            <h3 className="text-lg font-bold text-text-main mb-6 flex items-center gap-2">
              <ShieldCheck size={20} className="text-primary" /> Security & Access
            </h3>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-divider">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <Key size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-text-main">Change Password</p>
                    <p className="text-[10px] text-text-muted mt-0.5">Last updated 2 months ago</p>
                  </div>
                </div>
                <button className="px-4 py-2 text-[10px] font-bold uppercase tracking-wider bg-surface border border-divider rounded-lg hover:border-primary hover:text-primary transition-all">
                  Update
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-divider">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center text-success">
                    <Shield size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-text-main">Two-Factor Authentication</p>
                    <p className="text-[10px] text-text-muted mt-0.5">Currently enabled for your account</p>
                  </div>
                </div>
                <button className="px-4 py-2 text-[10px] font-bold uppercase tracking-wider bg-success text-white rounded-lg hover:brightness-110 transition-all">
                  Manage
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: PREFERENCES */}
        <div className="space-y-8">
          <div className="card-classic p-8">
            <h3 className="text-lg font-bold text-text-main mb-6 flex items-center gap-2">
              <Settings size={20} className="text-primary" /> Preferences
            </h3>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-text-main">Dark Mode</p>
                  <p className="text-[10px] text-text-muted mt-0.5">Adjust platform theme</p>
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
                  <p className="text-[10px] text-text-muted mt-0.5">System alerts & reports</p>
                </div>
                <button className="w-12 h-6 rounded-full bg-primary relative">
                  <div className="absolute top-1 left-7 w-4 h-4 rounded-full bg-white" />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-text-main">Desktop Alerts</p>
                  <p className="text-[10px] text-text-muted mt-0.5">Real-time push alerts</p>
                </div>
                <button className="w-12 h-6 rounded-full bg-gray-200 relative">
                  <div className="absolute top-1 left-1 w-4 h-4 rounded-full bg-white" />
                </button>
              </div>
            </div>
          </div>

          <div className="card-classic p-8 bg-primary/5 border-primary/20">
            <h3 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
              <ShieldCheck size={20} /> Identity Verified
            </h3>
            <p className="text-xs text-text-muted leading-relaxed">
              Your account is verified as a **Root Administrator**. You have full access to platform-wide configurations, analytics, and security protocols.
            </p>
            <div className="mt-6 pt-6 border-t border-primary/10">
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-primary">
                <span>Verification Level</span>
                <span>Level 4 (Max)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
