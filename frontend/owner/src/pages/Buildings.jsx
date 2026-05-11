// Updated: 2026-05-07 - Premium Infrastructure Update
import React, { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useParams, useNavigate } from 'react-router-dom';
import {
  Building as BuildingIcon, Layers, DoorOpen, Bed, PlusCircle, UsersRound, Banknote, Clock, MessageSquareWarning,
  ArrowLeft, CheckSquare, Square, Trash2, Edit2, Zap, X, Image as ImageIcon, BedDouble, Filter, ChevronRight, Search,
  Heart, ShieldCheck, Sparkles, Wind, Sun, BatteryCharging, Wifi, Monitor, Coffee, Lock, UserCheck, Star, 
  MapPin, Thermometer, Fan, Smartphone, Tablet, Luggage, Lightbulb, Ruler, Weight, FileText, Wrench, History,
  Maximize, ArrowUp, Brush, Palette, LayoutGrid, Activity, Droplets,
  TrendingUp, Coins, BarChart3, HardDrive, Waves, Flame, Fingerprint
} from 'lucide-react';

import { api } from '../mockData';

// Full-Screen Professional Modal Component
const Modal = ({ isOpen, onClose, title, children }) => (
  <AnimatePresence>
    {isOpen && (
      <div style={{ position: 'fixed', inset: 0, zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          style={{ position: 'absolute', inset: 0, background: 'rgba(15, 23, 42, 0.3)', backdropFilter: 'blur(12px)' }}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          style={{
            position: 'relative', width: '100%', maxWidth: '950px', maxHeight: '90vh',
            background: 'white', borderRadius: '32px', overflow: 'hidden',
            display: 'flex', flexDirection: 'column', boxShadow: '0 50px 100px -20px rgba(0,0,0,0.25)',
            border: '1px solid rgba(255,255,255,0.4)'
          }}
        >
          {/* Modal Header */}
          <div style={{ 
            padding: '1.2rem 2.5rem', borderBottom: '1px solid #F1F5F9',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            background: 'white', flexShrink: 0
          }}>
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: '950', letterSpacing: '-0.04em', color: '#0F172A', margin: 0 }}>{title}</h2>
              <p style={{ fontSize: '0.75rem', color: '#64748B', margin: '0.1rem 0 0 0', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Administrative Intelligence</p>
            </div>
            <button 
              onClick={onClose} 
              style={{ 
                background: '#F8FAFC', border: '1px solid #F1F5F9', color: '#64748B', 
                cursor: 'pointer', width: '40px', height: '40px', borderRadius: '12px', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', 
                transition: 'all 0.2s'
              }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Modal Content */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem 2.5rem 2.5rem 2.5rem', scrollbarWidth: 'none' }}>
            {children}
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

// --- Ultra-Premium Property Intelligence Drawer ---
const PropertyDetailDrawer = ({ isOpen, onClose, target, type, activeTab, onTabChange }) => {
  if (!target) return null;

  const tabs = ['Overview', 'Analytics', 'Safety', 'Hygiene', 'AI Insights', 'Smart Features'];

  const renderTabContent = () => {
    switch(activeTab) {
      case 'Overview':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
               {[
                 { label: 'Status', value: target.status || 'Active', icon: <Activity size={18} />, color: '#10B981' },
                 { label: 'Occupancy', value: `${target.occupancyRate || 88}%`, icon: <UsersRound size={18} />, color: '#6366F1' },
                 { label: 'Health Score', value: `${target.hygieneScore || target.hygieneIndex || 96}/100`, icon: <Heart size={18} />, color: '#EF4444' },
                 { label: 'AI Confidence', value: target.aiConfidence || 'High', icon: <Sparkles size={18} />, color: '#F59E0B' }
               ].map((kpi, i) => (
                 <div key={i} style={{ padding: '1.2rem', background: '#F8FAFC', borderRadius: '24px', border: '1px solid #F1F5F9' }}>
                   <div style={{ color: kpi.color, marginBottom: '0.6rem' }}>{kpi.icon}</div>
                   <p style={{ margin: 0, fontSize: '0.65rem', fontWeight: '900', color: '#64748B', letterSpacing: '0.05em' }}>{kpi.label.toUpperCase()}</p>
                   <p style={{ margin: 0, fontSize: '1.2rem', fontWeight: '1000', color: '#0F172A' }}>{kpi.value}</p>
                 </div>
               ))}
            </div>
            
            <div style={{ position: 'relative', height: '240px', borderRadius: '32px', overflow: 'hidden', marginBottom: '1rem' }}>
              <img 
                src={target.images?.[0] || target.imageUrl || 'https://images.unsplash.com/photo-1545324418-f1d3c5b53571?auto=format&fit=crop&w=800&q=80'} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                alt="Property" 
              />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent, rgba(15, 23, 42, 0.8))' }} />
              <div style={{ position: 'absolute', bottom: '1.5rem', left: '2rem' }}>
                 <h3 style={{ color: 'white', fontSize: '1.5rem', fontWeight: '900', margin: 0 }}>{target.name || target.buildingName || `Room ${target.roomNumber}`}</h3>
                 <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem', fontWeight: '700', margin: '0.2rem 0 0 0' }}>{type.toUpperCase()} VISUALIZATION</p>
              </div>
            </div>

            <div style={{ padding: '2rem', background: '#0F172A', borderRadius: '32px', color: 'white', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(99, 102, 241, 0.2) 0%, transparent 70%)' }} />
              <h4 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                <Zap size={20} color="#FCD34D" /> Operational Live Stream
              </h4>
              <p style={{ fontSize: '0.9rem', opacity: 0.8, lineHeight: '1.6', maxWidth: '80%' }}>
                {target.aiInsight || `System heart-beat is stable. All biometric access points are online. HVAC systems operating at peak efficiency (22.5°C).`}
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
               <div style={{ padding: '1.5rem', borderRadius: '28px', border: '1px solid #E2E8F0' }}>
                 <h5 style={{ margin: '0 0 1rem 0', fontSize: '0.9rem', fontWeight: '900' }}>Infrastructure Health</h5>
                 {[
                   { label: 'Connectivity', val: target.connectivityStatus || 'EXCELLENT' },
                   { label: 'Power Backup', val: target.systemsStatus?.power || '100% ONLINE' },
                   { label: 'Water Systems', val: target.systemsStatus?.water || 'STABLE' },
                   { label: 'Security Grid', val: target.smartAccessSystem ? 'BIOMETRIC ACTIVE' : 'SECURE' }
                 ].map(item => (
                   <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.8rem 0', borderBottom: '1px solid #F1F5F9' }}>
                     <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#475569' }}>{item.label}</span>
                     <span style={{ fontSize: '0.85rem', fontWeight: '950', color: '#10B981' }}>{item.val}</span>
                   </div>
                 ))}
               </div>
               <div style={{ padding: '1.5rem', borderRadius: '28px', background: '#F8FAFC' }}>
                 <h5 style={{ margin: '0 0 1rem 0', fontSize: '0.9rem', fontWeight: '900' }}>{type.toUpperCase()} SPECIFIC LOG</h5>
                 {[
                   type === 'bed' ? (target.hygieneSeal || 'Linen changed 2h ago') : (target.hygieneAudit || 'Floor corridor sanitized'),
                   type === 'room' ? (target.smartLockStatus || 'RFID lock battery at 92%') : (target.accessLog || 'Biometric entry verified'),
                   'Operational health audit passed',
                   'Intelligence threshold met'
                 ].map((act, i) => (
                   <div key={i} style={{ display: 'flex', gap: '0.8rem', marginBottom: '1rem' }}>
                     <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#6366F1', marginTop: '5px' }} />
                     <p style={{ margin: 0, fontSize: '0.8rem', fontWeight: '700', color: '#475569' }}>{act}</p>
                   </div>
                 ))}
               </div>
            </div>
          </div>
        );
      case 'Analytics':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ height: '300px', background: '#F8FAFC', borderRadius: '32px', display: 'flex', alignItems: 'flex-end', gap: '1rem', padding: '2rem', border: '1px solid #E2E8F0' }}>
              {(target.performanceData || [60, 45, 80, 55, 90, 75, 85, 60, 95, 70, 80, 100]).map((h, i) => (
                <motion.div 
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  style={{ flex: 1, background: 'linear-gradient(to top, #6366F1, #A5B4FC)', borderRadius: '8px 8px 0 0' }}
                />
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
               {[
                 { label: 'Monthly ROI', value: `+${target.roiValue || 22.4}%`, color: '#10B981' },
                 { label: 'Est. Revenue', value: target.revenueEngine ? `₹${(target.revenueEngine/100000).toFixed(1)}L` : '₹4.2L', color: '#6366F1' },
                 { label: 'Energy Load', value: `${target.energyEfficiency || 82}%`, color: '#EF4444' }
               ].map((stat, i) => (
                 <div key={i} style={{ padding: '1.5rem', background: 'white', borderRadius: '24px', border: '1px solid #E2E8F0', textAlign: 'center' }}>
                   <p style={{ margin: 0, fontSize: '0.7rem', fontWeight: '900', color: '#64748B' }}>{stat.label.toUpperCase()}</p>
                   <p style={{ margin: '0.4rem 0 0 0', fontSize: '1.4rem', fontWeight: '1000', color: stat.color }}>{stat.value}</p>
                 </div>
               ))}
            </div>
          </div>
        );
      case 'Safety':
        return (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            <div style={{ padding: '2rem', background: '#FEF2F2', borderRadius: '32px', border: '1px solid #FEE2E2' }}>
              <ShieldCheck size={32} color="#EF4444" style={{ marginBottom: '1rem' }} />
              <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem', fontWeight: '1000', color: '#991B1B' }}>Active Security</h4>
              <p style={{ fontSize: '0.9rem', color: '#B91C1C', fontWeight: '700', lineHeight: '1.6' }}>
                All 24/7 monitoring systems are operational. Emergency protocols synced with local authorities. Smart system status: {target.systemsStatus?.fire || 'Verified'}.
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                { label: 'CCTV Health', value: '100%', status: 'Stable' },
                { label: 'Fire Systems', value: target.systemsStatus?.fire || 'Verified', status: 'Active' },
                { label: 'Smart Access', value: target.smartAccessSystem || 'RFID+QR', status: 'Online' },
                { label: 'Emergency Resp', value: '< 2 mins', status: 'Optimal' }
              ].map((item, i) => (
                <div key={i} style={{ padding: '1.2rem', background: '#F8FAFC', borderRadius: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                   <div>
                     <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: '900', color: '#0F172A' }}>{item.label}</p>
                     <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748B', fontWeight: '700' }}>{item.value}</p>
                   </div>
                   <span style={{ fontSize: '0.7rem', fontWeight: '950', color: '#10B981', background: '#ECFDF5', padding: '0.3rem 0.6rem', borderRadius: '8px' }}>{item.status}</span>
                </div>
              ))}
            </div>
          </div>
        );
      case 'Hygiene':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.2rem' }}>
               {[
                 { label: 'Last Sanitized', value: target.lastSanitized || '2h ago', icon: <Sparkles size={18} /> },
                 { label: 'Hygiene Score', value: `${target.hygieneScore || target.hygieneIndex || 98}%`, icon: <Droplets size={18} /> },
                 { label: 'Audit Status', value: target.hygieneSeal ? 'SEALED' : 'Passed', icon: <CheckSquare size={18} /> }
               ].map((h, i) => (
                 <div key={i} style={{ padding: '1.5rem', background: '#F0FDFA', borderRadius: '24px', border: '1px solid #CCFBF1', textAlign: 'center' }}>
                   <div style={{ color: '#10B981', marginBottom: '0.8rem', display: 'flex', justifyContent: 'center' }}>{h.icon}</div>
                   <p style={{ margin: 0, fontSize: '0.7rem', fontWeight: '900', color: '#0F766E' }}>{h.label.toUpperCase()}</p>
                   <p style={{ margin: '0.4rem 0 0 0', fontSize: '1.3rem', fontWeight: '1000', color: '#115E59' }}>{h.value}</p>
                 </div>
               ))}
            </div>
            <div style={{ padding: '2rem', background: 'white', borderRadius: '32px', border: '1px solid #E2E8F0' }}>
              <h4 style={{ margin: '0 0 1.5rem 0', fontSize: '1rem', fontWeight: '900' }}>Maintenance Backlog</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[
                  { task: 'HVAC Filter Replacement', priority: 'High', date: 'Today' },
                  { task: 'Biometric Scanner Calibration', priority: 'Medium', date: 'Tomorrow' },
                  { task: 'General Sanitization Cycle', priority: 'Routine', date: '08 May' }
                ].map((task, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: '#F8FAFC', borderRadius: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                       <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6366F1' }}><Wrench size={18} /></div>
                       <div>
                         <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: '800', color: '#1E293B' }}>{task.task}</p>
                         <p style={{ margin: 0, fontSize: '0.7rem', color: '#64748B', fontWeight: '700' }}>{task.date}</p>
                       </div>
                    </div>
                    <span style={{ fontSize: '0.65rem', fontWeight: '950', color: task.priority === 'High' ? '#EF4444' : '#6366F1' }}>{task.priority.toUpperCase()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'AI Insights':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ padding: '2.5rem', background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)', borderRadius: '40px', color: 'white', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: '-100px', left: '-100px', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%)' }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.5rem' }}>
                 <div style={{ width: '40px', height: '40px', borderRadius: '14px', background: 'rgba(99, 102, 241, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#818CF8' }}><Sparkles size={24} /></div>
                 <div>
                   <h4 style={{ margin: 0, fontSize: '1.4rem', fontWeight: '1000', letterSpacing: '-0.02em' }}>Intelligence Engine</h4>
                   <p style={{ margin: 0, fontSize: '0.75rem', opacity: 0.6, fontWeight: '700' }}>Real-time predictive modeling</p>
                 </div>
              </div>
              <p style={{ fontSize: '1.1rem', fontWeight: '700', lineHeight: '1.6', marginBottom: '2rem' }}>
                {target.aiInsight || `Based on historical trends, we forecast a strong performance for this ${type}. Operational efficiency is within target thresholds.`}
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
                {[
                  { label: 'Comfort Score', val: target.comfortScore || 92 },
                  { label: 'Privacy Index', val: target.privacyLevel === 'High' ? 95 : 88 },
                  { label: 'Market Demand', val: 96 }
                ].map(s => (
                  <div key={s.label} style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <p style={{ margin: 0, fontSize: '0.6rem', fontWeight: '900', color: 'rgba(255,255,255,0.5)' }}>{s.label.toUpperCase()}</p>
                    <p style={{ margin: '0.2rem 0 0 0', fontSize: '1.2rem', fontWeight: '1000' }}>{s.val}%</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'Smart Features':
        return (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {[
              { label: 'Smart Access', desc: target.smartAccessSystem || 'RFID + Mobile QR active', icon: <Lock size={20} />, color: '#6366F1' },
              { label: 'Climate Control', desc: target.isAC ? 'Automated HVAC enabled' : 'Natural airflow optimized', icon: <Wind size={20} />, color: '#10B981' },
              { label: 'Energy Monitor', desc: `Energy Efficiency: ${target.energyEfficiency || 82}%`, icon: <Zap size={20} />, color: '#F59E0B' },
              { label: 'Natural Light', desc: target.views ? `Excellent ${target.views} view` : 'High natural airflow score', icon: <Flame size={20} />, color: '#EF4444' }
            ].map((f, i) => (
              <div key={i} style={{ padding: '2rem', background: 'white', borderRadius: '32px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: `${f.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: f.color }}>
                  {f.icon}
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '950', color: '#0F172A' }}>{f.label}</h4>
                  <p style={{ margin: '0.3rem 0 0 0', fontSize: '0.85rem', color: '#64748B', fontWeight: '700', lineHeight: '1.4' }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 4000, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '1rem' }}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ position: 'absolute', inset: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(15px)' }}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            style={{
              position: 'relative', width: '100%', maxWidth: '1100px', height: '95vh',
              background: 'white', borderRadius: '32px', overflow: 'hidden',
              display: 'flex', flexDirection: 'column', boxShadow: '0 50px 100px -20px rgba(0,0,0,0.3)'
            }}
          >
            {/* Drawer Header */}
            <div style={{ padding: '2.5rem', borderBottom: '1px solid #F1F5F9', background: 'white', zIndex: 10 }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                 <div style={{ flex: 1 }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.8rem', flexWrap: 'wrap' }}>
                    <span style={{ padding: '0.4rem 0.8rem', borderRadius: '10px', background: '#0F172A', color: 'white', fontSize: '0.7rem', fontWeight: '950', letterSpacing: '0.05em' }}>
                      {type.toUpperCase()} ID: {target.id?.slice(-6).toUpperCase() || 'SYS-INFRA'}
                    </span>
                    <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#6366F1', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Activity size={14} /> LIVE MONITORING
                    </span>
                  </div>
                  <h2 style={{ fontSize: '2.4rem', fontWeight: '1000', color: '#0F172A', margin: 0, letterSpacing: '-0.04em' }}>
                    {target.name || `Room ${target.roomNumber}` || `Floor ${target.floorNumber}`}
                  </h2>
                </div>
                <button onClick={onClose} style={{ width: '48px', height: '48px', borderRadius: '16px', background: '#F8FAFC', border: '1px solid #F1F5F9', color: '#64748B', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  <X size={24} />
                </button>
              </div>

              {/* Tab Navigation */}
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '2.5rem', overflowX: 'auto', scrollbarWidth: 'none', paddingBottom: '0.5rem' }}>
                {tabs.map(tab => (
                  <button
                    key={tab}
                    onClick={() => onTabChange(tab)}
                    style={{
                      padding: '0.8rem 1.4rem', borderRadius: '14px',
                      background: activeTab === tab ? '#0F172A' : '#F8FAFC',
                      color: activeTab === tab ? 'white' : '#64748B',
                      border: '1px solid',
                      borderColor: activeTab === tab ? '#0F172A' : '#F1F5F9',
                      fontSize: '0.85rem', fontWeight: '950', whiteSpace: 'nowrap',
                      cursor: 'pointer', transition: 'all 0.2s'
                    }}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Drawer Content */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '2.5rem', background: 'white', scrollbarWidth: 'none' }}>
              {renderTabContent()}
            </div>

            {/* Drawer Footer Actions */}
            <div style={{ padding: '2rem 2.5rem', borderTop: '1px solid #F1F5F9', background: '#F8FAFC', display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
               <button className="btn" style={{ flex: '1 1 min-content', padding: '1.2rem', borderRadius: '18px', background: 'white', border: '1px solid #E2E8F0', color: '#0F172A', fontWeight: '950', fontSize: '1rem', whiteSpace: 'nowrap' }}>
                 Download Report
               </button>
               <button className="btn btn-primary" style={{ flex: '1.5 1 min-content', padding: '1.2rem', borderRadius: '18px', fontWeight: '950', fontSize: '1rem', boxShadow: '0 15px 30px rgba(99, 102, 241, 0.3)', whiteSpace: 'nowrap' }}>
                 Manage Operational Logic
               </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const INITIAL_FORM_STATE = {
  // Core Identity
  name: '', buildingName: '', address: '', number: '', type: 'Single', 
  capacity: 1, status: 'AVAILABLE', imageUrl: '', 
  isAC: false, washroomType: 'Attached', balcony: false, facing: 'Road',
  position: 'Standard', bedType: 'Single', floorType: 'Tiles', windowCount: 1, 
  furniture: [], amenities: [],
  rentAmount: 8000, securityDeposit: 16000, noticePeriod: 30, description: '',
  
  // Intelligence & Health Metrics
  hygieneScore: 98,
  energyEfficiency: 82,
  revenueEngine: 1240000,
  roiValue: 12.4,
  aiInsight: 'Best for students: High natural light score.',
  comfortScore: 92,
  area: '240 sqft',
  views: 'Garden',
  privacyLevel: 'High',
  
  // Smart Config
  smartFeatures: {
    hasSmartLock: true,
    hasRFID: true,
    hasAirFlow: true,
    hasReadingLight: true,
    hasUSBPort: true,
    hasFastWiFi: true,
    hasPersonalLocker: true
  },
  
  // Systems
  systemsStatus: {
    power: 'Backup',
    water: '24/7',
    fire: 'Secure',
    lift: 'Smart'
  },
  smartAccessSystem: 'Biometric + RFID Active',
  
  // Specs
  specs: {
    mattress: 'Memory Foam',
    capacityWeight: '180kg',
    material: 'Teak Wood'
  },
  
  // Floor Specific
  occupancyHeatmap: 78,
  liveFacilities: ['Laundry', 'Smart Access', 'Pantry', 'Gaming Zone', 'Study Hall'],
  floorDescription: 'Mixed Residency'
};

const Buildings = () => {
  const { buildingId: urlBuildingId } = useParams();
  const navigate = useNavigate();

  // Step 1: Restore context
  const activeBuildingId = urlBuildingId || localStorage.getItem('selectedBuildingId');

  const [view, setView] = useState('buildings');
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('All');

  const [buildings, setBuildings] = useState([]);
  const [floors, setFloors] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [beds, setBeds] = useState([]);

  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [selectedFloor, setSelectedFloor] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);

  // Modal states
  const [isAddBuildingOpen, setIsAddBuildingOpen] = useState(false);
  const [isAddFloorOpen, setIsAddFloorOpen] = useState(false);
  const [isAddRoomOpen, setIsAddRoomOpen] = useState(false);
  const [isAddBedOpen, setIsAddBedOpen] = useState(false);
  const [isEditRoomOpen, setIsEditRoomOpen] = useState(false);
  const [isEditBedOpen, setIsEditBedOpen] = useState(false);
  const [isViewBedDetailsOpen, setIsViewBedDetailsOpen] = useState(false);
  const [isViewBedHistoryOpen, setIsViewBedHistoryOpen] = useState(false);
  const [isViewRoomDetailsOpen, setIsViewRoomDetailsOpen] = useState(false);
  const [isAssignTenantOpen, setIsAssignTenantOpen] = useState(false);
  const [isAssignConfirmOpen, setIsAssignConfirmOpen] = useState(false);
  const [assignData, setAssignData] = useState({ bed: null, tenant: null });
  const [isAnalyticsModalOpen, setIsAnalyticsModalOpen] = useState(false);
  const [analyticsTarget, setAnalyticsTarget] = useState(null);
  const [viewingBed, setViewingBed] = useState(null);
  const [previewingRoom, setPreviewingRoom] = useState(null);
  
  // New Smart Ecosystem State
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);
  const [detailTarget, setDetailTarget] = useState(null);
  const [detailType, setDetailType] = useState('building'); // 'building', 'floor', 'room', 'bed'
  const [activeDetailTab, setActiveDetailTab] = useState('Overview');

  const handleViewDetail = (target, type) => {
    setDetailTarget(target);
    setDetailType(type);
    setIsDetailDrawerOpen(true);
    setActiveDetailTab('Overview');
  };

  // Form states
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);

  const [loading, setLoading] = useState(false);

  const fetchBuildings = async () => {
    setLoading(true);
    console.log("Buildings module fetching for ID:", activeBuildingId);
    try {
      const bData = await api.getBuildings();
      const safeData = Array.isArray(bData) ? bData : [];

      if (activeBuildingId) {
        const matchingBuilding = safeData.find(b => (b.id === activeBuildingId || b._id === activeBuildingId));
        if (matchingBuilding) {
          setBuildings([matchingBuilding]); // Isolate to current building only
          setSelectedBuilding(matchingBuilding);
          // Pre-fetch floors but stay on buildings view to show the card first
          try {
            const floorData = await api.getFloors(matchingBuilding._id || matchingBuilding.id);
            setFloors(floorData || []);
          } catch (err) {
            console.error("Failed to pre-load floors:", err);
          }
        } else {
          setBuildings(safeData);
        }
      } else {
        setBuildings(safeData);
      }
    } catch (err) {
      console.error("Fetch error in Buildings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBuildings();
  }, [activeBuildingId]);

  const handleSelectBuilding = async (b) => {
    const bId = b?._id || b?.id;
    if (!bId) return;
    setSearchQuery(''); // Clear search on navigate
    setSelectedBuilding(b);
    setLoading(true);
    try {
      const data = await api.getFloors(bId);
      console.log(`Loaded ${data?.length || 0} floors for building:`, bId);
      setFloors(data || []);
      setView('floors');
    } catch (err) {
      console.error("Failed to load floors:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectFloor = async (f) => {
    const fId = f?._id || f?.id;
    if (!fId) return;
    setSearchQuery(''); // Clear search on navigate
    setSelectedFloor(f);
    setLoading(true);
    try {
      const data = await api.getRooms(fId);
      console.log(`Loaded ${data?.length || 0} rooms for floor:`, fId);
      setRooms(data || []);
      setView('rooms');
    } catch (err) {
      console.error("Failed to load rooms:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectRoom = async (r) => {
    const rId = r?._id || r?.id;
    if (!rId) return;
    setSelectedRoom(r);
    setView('beds');
    try {
      const data = await api.getBeds(rId);
      setBeds(data || []);
    } catch (err) {
      console.error("Failed to load beds:", err);
      setBeds([]);
    }
  };

  const handleOpenEditRoom = (r) => {
    setFormData({
      ...INITIAL_FORM_STATE,
      ...r,
      id: r.id || r._id,
      number: r.roomNumber,
      type: r.roomType,
      imageUrl: r.images?.[0] || ''
    });
    setIsEditRoomOpen(true);
  };

  const handleUpdateRoom = async (e) => {
    e.preventDefault();
    try {
      const updated = await api.updateRoom(formData.id, {
        roomNumber: formData.number,
        roomType: formData.type,
        capacity: formData.capacity,
        rentAmount: formData.rentAmount,
        securityDeposit: formData.securityDeposit,
        noticePeriod: formData.noticePeriod,
        isAC: formData.isAC,
        washroomType: formData.washroomType,
        balcony: formData.balcony,
        facing: formData.facing,
        floorType: formData.floorType,
        windowCount: formData.windowCount,
        furniture: formData.furniture
      });
      setSelectedRoom(updated);
      setRooms(prev => prev.map(r => (r.id === updated.id || r._id === updated._id) ? updated : r));
      setIsEditRoomOpen(false);
    } catch (err) {
      alert("Failed to update room: " + (err.response?.data?.error || err.message));
    }
  };

  const handleOpenEditBed = (b) => {
    setFormData({
      ...INITIAL_FORM_STATE,
      ...b,
      id: b.id || b._id,
      number: b.bedNumber,
      imageUrl: b.images?.[0] || ''
    });
    setIsEditBedOpen(true);
  };

  const handleUpdateBed = async (e) => {
    e.preventDefault();
    try {
      const updated = await api.updateBed(formData.id, {
        bedNumber: formData.number,
        status: formData.status,
        position: formData.position,
        bedType: formData.bedType
      });
      // Update beds list
      setBeds(prev => prev.map(b => (b.id === updated.id || b._id === updated._id) ? updated : b));
      setIsEditBedOpen(false);
    } catch (err) {
      alert("Failed to update bed: " + (err.response?.data?.error || err.message));
    }
  };

  // --- HELPER: Image Upload ---
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({ ...prev, imageUrl: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const updateRoomImageDirectly = async (roomId, file) => {
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result;
      try {
        // Append to existing images
        const currentImages = selectedRoom?.images || [];
        const newImages = [...currentImages, base64];
        const updated = await api.updateRoom(roomId, { images: newImages });
        setSelectedRoom(prev => ({ ...prev, images: updated.images }));
        setRooms(prev => prev.map(r => (r.id === roomId || r._id === roomId) ? { ...r, images: updated.images } : r));
      } catch (err) { console.error("Room image update failed", err); }
    };
    reader.readAsDataURL(file);
  };

  // Generic Breadcrumb
  const renderBreadcrumb = () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '2.5rem', color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
      <button 
        onClick={() => { 
          setView('buildings'); 
          setSelectedBuilding(null); 
          setSelectedFloor(null); 
          setSelectedRoom(null);
          // Clear isolated state to show full portfolio
          localStorage.removeItem('selectedBuildingId');
          fetchBuildings(); // Refresh to show all buildings
        }} 
        style={{ background: 'none', border: 'none', color: view === 'buildings' ? 'var(--accent-primary)' : 'inherit', cursor: 'pointer', fontWeight: '900' }}
      >
        Infrastructure
      </button>
      {selectedBuilding && (
        <>
          <ChevronRight size={14} style={{ opacity: 0.5 }} />
          <button 
            onClick={() => { 
              setView('floors'); 
              setSelectedFloor(null); 
              setSelectedRoom(null); 
            }} 
            style={{ background: 'none', border: 'none', color: view === 'floors' ? 'var(--accent-primary)' : 'inherit', cursor: 'pointer', fontWeight: '900' }}
          >
            {selectedBuilding.name}
          </button>
        </>
      )}
      {selectedFloor && (view === 'rooms' || view === 'beds') && (
        <>
          <ChevronRight size={14} style={{ opacity: 0.5 }} />
          <button 
            onClick={() => { 
              setView('rooms'); 
              setSelectedRoom(null); 
            }} 
            style={{ background: 'none', border: 'none', color: view === 'rooms' ? 'var(--accent-primary)' : 'inherit', cursor: 'pointer', fontWeight: '900' }}
          >
            Floor {selectedFloor.floorNumber}
          </button>
        </>
      )}
      {selectedRoom && view === 'beds' && (
        <>
          <ChevronRight size={14} style={{ opacity: 0.5 }} />
          <span style={{ color: 'var(--text-primary)', fontWeight: '900' }}>Room {selectedRoom.roomNumber}</span>
        </>
      )}
    </div>
  );

  const inputStyle = { padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-tertiary)', color: 'var(--text-primary)' };

  const handleAddBuilding = async (e) => {
    e.preventDefault();
    try {
      const newB = await api.addBuilding({ 
        name: formData.name, 
        address: formData.address, 
        genderType: formData.genderType || 'Mixed',
        category: formData.category || 'Mixed',
        rating: formData.rating || 4.5,
        amenities: formData.amenities || [],
        isAC: formData.isAC,
        images: formData.imageUrl ? [formData.imageUrl] : [] 
      });
      setBuildings([...buildings, newB]);
      setIsAddBuildingOpen(false);
      setFormData(INITIAL_FORM_STATE);
    } catch (err) {
      alert("Failed to add building: " + (err.response?.data?.error || err.message));
    }
  };

  const handleAddFloor = async (e) => {
    e.preventDefault();
    try {
      const bId = selectedBuilding?.id || selectedBuilding?._id;
      if (!bId) throw new Error("Please select a building first.");
      const newF = await api.addFloor({ 
        buildingId: bId, 
        floorNumber: formData.number, 
        description: formData.description,
        images: formData.imageUrl ? [formData.imageUrl] : [] 
      });
      setFloors([...floors, newF]);
      setIsAddFloorOpen(false);
      setFormData(INITIAL_FORM_STATE);
    } catch (err) {
      alert("Failed to add floor: " + (err.response?.data?.error || err.message));
    }
  };

  const handleAddRoom = async (e) => {
    e.preventDefault();
    try {
      const fId = selectedFloor?.id || selectedFloor?._id;
      if (!fId) throw new Error("Please select a floor first.");
      const newR = await api.addRoom({
        floorId: fId,
        roomNumber: formData.number,
        roomType: formData.type,
        capacity: formData.capacity,
        rentAmount: formData.rentAmount,
        securityDeposit: formData.securityDeposit,
        noticePeriod: formData.noticePeriod,
        isAC: formData.isAC,
        washroomType: formData.washroomType,
        balcony: formData.balcony,
        facing: formData.facing,
        floorType: formData.floorType,
        windowCount: formData.windowCount,
        furniture: formData.furniture,
        images: formData.imageUrl ? [formData.imageUrl] : []
      });
      setRooms([...rooms, newR]);
      setIsAddRoomOpen(false);
      setFormData(INITIAL_FORM_STATE);
    } catch (err) {
      alert("Failed to deploy room: " + (err.response?.data?.error || err.message));
    }
  };

  const handleAddBed = async (e) => {
    e.preventDefault();
    try {
      const newB = await api.addBed({ 
        roomId: selectedRoom.id || selectedRoom._id, 
        bedNumber: formData.number, 
        status: formData.status, 
        position: formData.position,
        bedType: formData.bedType,
        images: formData.imageUrl ? [formData.imageUrl] : [] 
      });
      setBeds([...beds, newB]);
      setIsAddBedOpen(false);
      setFormData(INITIAL_FORM_STATE);
    } catch (err) {
      alert("Failed to add bed: " + (err.response?.data?.error || err.message));
    }
  };

  return (
    <>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes neon-pulse {
          0% { box-shadow: 0 0 5px rgba(99, 102, 241, 0.2); }
          50% { box-shadow: 0 0 20px rgba(99, 102, 241, 0.6); }
          100% { box-shadow: 0 0 5px rgba(99, 102, 241, 0.2); }
        }
        .smart-card:hover {
          border-color: #6366F1 !important;
          background: #FFFFFF !important;
          backdrop-filter: none !important;
          -webkit-backdrop-filter: none !important;
          box-shadow: 0 40px 80px -15px rgba(99, 102, 241, 0.2) !important;
          transform: translateY(-12px) !important;
        }
        .smart-card {
          backface-visibility: hidden;
          -webkit-font-smoothing: antialiased;
          transform: translateZ(0);
          will-change: transform, box-shadow;
        }
        .smart-card:hover .bento-item, .smart-card:hover * {
          backdrop-filter: none !important;
          -webkit-backdrop-filter: none !important;
          transform: translateZ(0);
        }
        .status-pill {
          transition: all 0.3s ease;
        }
        .status-pill:hover {
          transform: scale(1.05);
          filter: brightness(1.1);
        }
      `}</style>
      <div className="buildings-page" style={{ animation: 'fadeIn 0.5s ease-out', minHeight: '100vh' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: '800', marginBottom: '0.4rem', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BuildingIcon size={32} color="var(--accent-primary)" /> Property Infrastructure
          </h1>

          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>Advanced hierarchical management of buildings, floors, rooms, and beds.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder={`Search ${view}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ ...inputStyle, paddingLeft: '2.8rem', width: '250px', background: 'var(--bg-secondary)' }} 
            />
          </div>
          <button
            className="btn"
            onClick={() => navigate(`/owner/building/${activeBuildingId}/rooms`)}
            style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--accent-primary)', fontWeight: '700' }}
          >
            <BedDouble size={18} /> Occupancy View
          </button>
          <button className="btn" onClick={() => setShowFilters(!showFilters)} style={{ background: showFilters ? 'var(--accent-primary)' : 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: showFilters ? 'white' : 'var(--text-primary)' }}>
            <Filter size={16} /> Filters
          </button>
          {['buildings', 'floors', 'rooms', 'beds'].includes(view) && (
            <button 
              className="btn btn-primary" 
              onClick={() => {
                if (view === 'buildings') setIsAddBuildingOpen(true);
                else if (view === 'floors') setIsAddFloorOpen(true);
                else if (view === 'rooms') setIsAddRoomOpen(true);
                else if (view === 'beds') setIsAddBedOpen(true);
              }}
              style={{ padding: '0.7rem 1.5rem', borderRadius: '12px', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '0.6rem' }}
            >
              <PlusCircle size={20} /> Add {view === 'buildings' ? 'Building' : view === 'floors' ? 'Floor' : view === 'rooms' ? 'Room' : 'Bed'}
            </button>
          )}
          <button onClick={() => window.history.back()} className="btn" style={{ padding: '0.7rem', borderRadius: '50%', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={20} />
          </button>
        </div>
      </header>

      {showFilters && (
        <motion.div 
          initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
          style={{ overflow: 'hidden', marginBottom: '2rem', background: 'var(--bg-tertiary)', padding: '1rem', borderRadius: '16px', border: '1px solid var(--border-color)', display: 'flex', gap: '1rem', alignItems: 'center' }}
        >
          <span style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Filter By:</span>
          {['All', 'AC', 'Non-AC', 'Available', 'Occupied'].map(f => (
            <button 
              key={f}
              onClick={() => setFilterType(f)}
              style={{
                padding: '0.5rem 1.2rem', borderRadius: '10px', border: '1px solid var(--border-color)',
                background: filterType === f ? 'var(--accent-primary)' : 'var(--bg-primary)',
                color: filterType === f ? 'white' : 'var(--text-primary)',
                fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer'
              }}
            >
              {f}
            </button>
          ))}
        </motion.div>
      )}

      {renderBreadcrumb()}

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem', marginTop: '2rem' }}>
          {[1,2,3].map(i => (
            <div key={i} className="card" style={{ height: '350px', background: 'var(--bg-secondary)', position: 'relative', overflow: 'hidden' }}>
              <motion.div 
                animate={{ x: ['-100%', '100%'] }} 
                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent)' }}
              />
            </div>
          ))}
        </div>
      ) : (
        <AnimatePresence mode="wait">
          {view === 'buildings' && (
            <motion.div key="buildings" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <BuildingsList 
                buildings={buildings.filter(b => 
                  ((b?.name || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
                   (b?.address || '').toLowerCase().includes(searchQuery.toLowerCase())) &&
                  (filterType === 'All' || (filterType === 'AC' && b.isAC) || (filterType === 'Non-AC' && !b.isAC))
                )} 
                onSelect={handleSelectBuilding} 
                onAdd={() => setIsAddBuildingOpen(true)} 
                onViewAnalytics={(target, type) => handleViewDetail(target, type)}
              />
            </motion.div>
          )}
          {view === 'floors' && (
            <motion.div key="floors" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <FloorsList 
                floors={floors.filter(f => (f?.floorNumber?.toString() || '').toLowerCase().includes(searchQuery.toLowerCase()))} 
                building={selectedBuilding} 
                onSelect={handleSelectFloor} 
                onBack={() => setView('buildings')} 
                onAdd={() => setIsAddFloorOpen(true)} 
                onViewAnalytics={(target, type) => handleViewDetail(target, type)}
              />
            </motion.div>
          )}
          {view === 'rooms' && (
            <motion.div key="rooms" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <RoomsList 
                rooms={rooms.filter(r => 
                  ((r?.roomNumber?.toString() || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
                   (r?.floorType || '').toLowerCase().includes(searchQuery.toLowerCase())) &&
                  (filterType === 'All' || 
                   (filterType === 'AC' && r.isAC) || 
                   (filterType === 'Non-AC' && !r.isAC) ||
                   (filterType === 'Available' && (r.beds?.some(b => b.status === 'AVAILABLE') || r.status === 'AVAILABLE')) ||
                   (filterType === 'Occupied' && r.beds?.length > 0 && !r.beds?.some(b => b.status === 'AVAILABLE')))
                )} 
                floor={selectedFloor} 
                building={selectedBuilding}
                onSelect={handleSelectRoom} 
                onBack={() => setView('floors')} 
                onAdd={() => setIsAddRoomOpen(true)} 
                onViewDetails={(room) => handleViewDetail(room, 'room')}
              />
            </motion.div>
          )}
          {view === 'beds' && (
            <motion.div key="beds" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
               <RoomHero 
                 room={selectedRoom} 
                 onImageUpdate={(file) => updateRoomImageDirectly(selectedRoom.id || selectedRoom._id, file)} 
                 onEdit={() => handleOpenEditRoom(selectedRoom)}
               />
               <BedsList 
                 beds={beds.filter(b => 
                   (b?.bedNumber?.toString() || '').toLowerCase().includes(searchQuery.toLowerCase()) &&
                   (filterType === 'All' || (filterType === 'Available' && b.status === 'AVAILABLE') || (filterType === 'Occupied' && b.status === 'OCCUPIED'))
                 )} 
                 room={selectedRoom} 
                 floor={selectedFloor}
                  building={selectedBuilding}
                 onBack={() => setView('rooms')} 
                 onAdd={() => setIsAddBedOpen(true)} 
                 onEditBed={handleOpenEditBed}
                 onViewDetails={(bed) => handleViewDetail(bed, 'bed')}
                 onViewHistory={(bed) => { setViewingBed(bed); setIsViewBedHistoryOpen(true); }}
                 onAssignTenant={(bed) => { setViewingBed(bed); setIsAssignTenantOpen(true); }}
               />
            </motion.div>
          )}
          {view === 'assign' && (
            <motion.div key="assign" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <AssignFloors buildings={buildings} onBack={() => setView('buildings')} />
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* --- Addition Modals --- */}

      <Modal isOpen={isAddBuildingOpen} onClose={() => setIsAddBuildingOpen(false)} title="Add New Building">
        <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} onSubmit={handleAddBuilding}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', background: 'linear-gradient(90deg, #F8FAFC, #EFF6FF)', padding: '1rem', borderRadius: '16px', border: '1px solid #E2E8F0', marginBottom: '0.5rem' }}>
            <Activity size={20} color="#3B82F6" />
            <span style={{ fontSize: '0.85rem', fontWeight: '900', color: '#1E293B', letterSpacing: '0.02em' }}>ADMINISTRATIVE INTELLIGENCE ACTIVE</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem' }}>
            <div className="input-group"><label style={{fontSize:'0.8rem', fontWeight:'900', color:'var(--text-muted)'}}>HOSTEL NAME</label><input placeholder="ReatchAll" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={inputStyle} required /></div>
            <div className="input-group"><label style={{fontSize:'0.8rem', fontWeight:'900', color:'var(--text-muted)'}}>BUILDING NAME</label><input placeholder="Royal residency" value={formData.buildingName} onChange={e => setFormData({...formData, buildingName: e.target.value})} style={inputStyle} required /></div>
          </div>
          
          <div className="input-group"><label style={{fontSize:'0.8rem', fontWeight:'900', color:'var(--text-muted)'}}>ADDRESS</label><input placeholder="123 tech street" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} style={inputStyle} required /></div>
          
          <div className="input-group">
            <label style={{fontSize:'0.8rem', fontWeight:'900', color:'var(--text-muted)'}}>BUILDING IMAGE</label>
            <div style={{ position: 'relative', marginTop: '0.6rem' }}>
              <input type="file" accept="image/*" onChange={handleImageUpload} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', zIndex: 2 }} />
              <div style={{ ...inputStyle, display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(99, 102, 241, 0.05)', borderColor: 'rgba(99, 102, 241, 0.3)', minHeight: '60px' }}>
                <ImageIcon size={22} color="var(--accent-primary)" />
                <span style={{ fontSize: '0.95rem', color: formData.imageUrl ? 'var(--accent-primary)' : 'var(--text-muted)', fontWeight: '800' }}>
                   {formData.imageUrl ? 'Photo Selected' : 'Choose Building Photo'}
                </span>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem' }}>
            <div className="input-group"><label style={{fontSize:'0.8rem', fontWeight:'900', color:'var(--text-muted)'}}>GENDER TYPE</label>
              <select value={formData.genderType} onChange={e => setFormData({...formData, genderType: e.target.value})} style={inputStyle}>
                <option value="Mixed">Mixed</option>
                <option value="Boys">Boys Only</option>
                <option value="Girls">Girls Only</option>
                <option value="Co-living (Both)">Co-living (Both)</option>
              </select>
            </div>
            <div className="input-group"><label style={{fontSize:'0.8rem', fontWeight:'900', color:'var(--text-muted)'}}>CATEGORY</label>
              <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} style={inputStyle}>
                <option value="Mixed">Mixed</option>
                <option value="Student">Student</option>
                <option value="Professional">Professional</option>
                <option value="Luxury">Luxury Residency</option>
              </select>
            </div>
          </div>

          <div className="input-group">
            <label style={{fontSize:'0.8rem', fontWeight:'900', color:'var(--text-muted)'}}>AMENITIES</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', marginTop: '0.5rem' }}>
              {['Wi-Fi', 'CCTV', 'Power Backup', 'Laundry', 'Parking', 'Kitchen', 'Gym', 'Biometric Access', 'Fire Safety', 'Smart Elevator'].map(a => (
                <div 
                  key={a} onClick={() => {
                    const newAm = formData.amenities?.includes(a) ? formData.amenities.filter(i => i !== a) : [...(formData.amenities||[]), a];
                    setFormData({...formData, amenities: newAm});
                  }}
                  style={{ padding: '0.4rem 0.8rem', borderRadius: '8px', fontSize: '0.75rem', fontWeight: '800', cursor: 'pointer', background: formData.amenities?.includes(a) ? 'var(--accent-primary)' : 'var(--bg-tertiary)', color: formData.amenities?.includes(a) ? 'white' : 'var(--text-secondary)', border: '1px solid var(--border-color)' }}
                >
                  {a}
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'var(--bg-tertiary)', padding: '1rem', borderRadius: '14px', cursor: 'pointer', border: '1px solid var(--border-color)' }} onClick={() => setFormData({...formData, isAC: !formData.isAC})}>
              <div style={{ width: '20px', height: '20px', border: '2px solid var(--accent-primary)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: formData.isAC ? 'var(--accent-primary)' : 'transparent' }}>
                {formData.isAC && <div style={{ width: '8px', height: '8px', background: 'white', borderRadius: '1.5px' }} />}
              </div>
              <span style={{ fontSize: '0.9rem', fontWeight: '900' }}>Full Centralized AC</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: '#F0FDFA', padding: '1rem', borderRadius: '14px', border: '1px solid #CCFBF1' }}>
              <ShieldCheck size={20} color="#10B981" />
              <span style={{ fontSize: '0.9rem', fontWeight: '900', color: '#134E4A' }}>Verified Operational</span>
            </div>
          </div>

          <button className="btn btn-primary" type="submit" style={{ padding: '1.2rem', borderRadius: '18px', fontWeight: '950', marginTop: '1rem', fontSize: '1.1rem', boxShadow: '0 10px 15px -3px rgba(99, 102, 241, 0.3)' }}>🚀 Deploy Property Ecosystem</button>
        </form>
      </Modal>

      <Modal isOpen={isAddFloorOpen} onClose={() => setIsAddFloorOpen(false)} title={`Add Floor to ${selectedBuilding?.name}`}>
        <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} onSubmit={handleAddFloor}>
          <div className="input-group"><label style={{fontSize:'0.8rem', fontWeight:'900', color:'var(--text-muted)'}}>FLOOR NUMBER</label><input placeholder="e.g. G, 1, 2" value={formData.number} onChange={e => setFormData({...formData, number: e.target.value})} style={inputStyle} required /></div>
          <div className="input-group"><label style={{fontSize:'0.8rem', fontWeight:'900', color:'var(--text-muted)'}}>DESCRIPTION</label><textarea placeholder="e.g. Common Area, Library, etc." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} style={{ ...inputStyle, minHeight: '80px', paddingTop: '0.8rem' }} /></div>
          <div className="input-group">
            <label style={{fontSize:'0.8rem', fontWeight:'900', color:'var(--text-muted)'}}>FLOOR LAYOUT PHOTO</label>
            <div style={{ position: 'relative', marginTop: '0.6rem' }}>
              <input type="file" accept="image/*" onChange={handleImageUpload} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', zIndex: 2 }} />
              <div style={{ ...inputStyle, display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(99, 102, 241, 0.05)', borderColor: 'rgba(99, 102, 241, 0.3)', minHeight: '60px' }}>
                <ImageIcon size={22} color="var(--accent-primary)" />
                <span style={{ fontSize: '0.95rem', color: formData.imageUrl ? 'var(--accent-primary)' : 'var(--text-muted)', fontWeight: '800' }}>
                  {formData.imageUrl ? 'Photo Loaded' : 'Upload Floor View'}
                </span>
              </div>
            </div>
          </div>
          <button className="btn btn-primary" type="submit" style={{ padding: '1.1rem', borderRadius: '16px', fontWeight: '900', fontSize: '1rem' }}>Save Floor Structure</button>
        </form>
      </Modal>

      <Modal isOpen={isAddRoomOpen} onClose={() => setIsAddRoomOpen(false)} title={`Add Room to Floor ${selectedFloor?.floorNumber}`}>
        <form style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }} onSubmit={handleAddRoom}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', background: '#F8FAFC', padding: '0.8rem', borderRadius: '14px', border: '1px solid #E2E8F0' }}>
            <Activity size={18} color="#6366F1" />
            <span style={{ fontSize: '0.8rem', fontWeight: '900', color: '#1E293B' }}>ADMINISTRATIVE INTELLIGENCE ACTIVE</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem' }}>
            <div className="input-group"><label style={{fontSize:'0.75rem', fontWeight:'900', color:'var(--text-muted)'}}>ROOM NO.</label><input placeholder="101" value={formData.number} onChange={e => setFormData({...formData, number: e.target.value})} style={inputStyle} required /></div>
            <div className="input-group"><label style={{fontSize:'0.75rem', fontWeight:'900', color:'var(--text-muted)'}}>ROOM TYPE</label>
              <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} style={{ ...inputStyle, width: '100%' }} required>
                <option value="Single">Single Suite</option>
                <option value="Double">Double Suite</option>
                <option value="Triple">Triple Residency</option>
                <option value="Shared">Shared Room</option>
                <option value="Dormitory">Dormitory</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem' }}>
            <div className="input-group"><label style={{fontSize:'0.75rem', fontWeight:'900', color:'var(--text-muted)'}}>MONTHLY RENT (₹)</label><input type="number" placeholder="8000" value={formData.rentAmount} onChange={e => setFormData({...formData, rentAmount: parseInt(e.target.value)})} style={inputStyle} required /></div>
            <div className="input-group"><label style={{fontSize:'0.75rem', fontWeight:'900', color:'var(--text-muted)'}}>DEPOSIT (₹)</label><input type="number" placeholder="16000" value={formData.securityDeposit} onChange={e => setFormData({...formData, securityDeposit: parseInt(e.target.value)})} style={inputStyle} required /></div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem' }}>
            <div className="input-group"><label style={{fontSize:'0.75rem', fontWeight:'900', color:'var(--text-muted)'}}>CAPACITY (BEDS)</label><input type="number" placeholder="1" value={formData.capacity} onChange={e => setFormData({...formData, capacity: parseInt(e.target.value)})} style={inputStyle} required min="1" /></div>
            <div className="input-group"><label style={{fontSize:'0.75rem', fontWeight:'900', color:'var(--text-muted)'}}>NOTICE PERIOD (DAYS)</label><input type="number" placeholder="30" value={formData.noticePeriod} onChange={e => setFormData({...formData, noticePeriod: parseInt(e.target.value)})} style={inputStyle} required /></div>
          </div>

          <div className="input-group">
            <label style={{fontSize:'0.75rem', fontWeight:'900', color:'var(--text-muted)'}}>ROOM PREVIEW</label>
            <div style={{ position: 'relative', marginTop: '0.6rem' }}>
              <input type="file" accept="image/*" onChange={handleImageUpload} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', zIndex: 2 }} />
              <div style={{ ...inputStyle, display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(99, 102, 241, 0.05)', borderColor: 'rgba(99, 102, 241, 0.3)', minHeight: '60px' }}>
                <ImageIcon size={20} color="var(--accent-primary)" />
                <span style={{ fontSize: '0.9rem', color: formData.imageUrl ? 'var(--accent-primary)' : 'var(--text-muted)', fontWeight: '800' }}>
                   {formData.imageUrl ? 'Room Photo Ready' : 'Take/Select Room Photo'}
                </span>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', background: 'var(--bg-tertiary)', padding: '0.8rem', borderRadius: '12px', cursor: 'pointer', border: '1px solid var(--border-color)' }} onClick={() => setFormData({...formData, isAC: !formData.isAC})}>
              <div style={{ width: '18px', height: '18px', border: '2px solid var(--accent-primary)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: formData.isAC ? 'var(--accent-primary)' : 'transparent' }}>
                {formData.isAC && <div style={{ width: '8px', height: '8px', background: 'white', borderRadius: '1px' }} />}
              </div>
              <span style={{ fontSize: '0.85rem', fontWeight: '800' }}>AC</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', background: 'var(--bg-tertiary)', padding: '0.8rem', borderRadius: '12px', cursor: 'pointer', border: '1px solid var(--border-color)' }} onClick={() => setFormData({...formData, balcony: !formData.balcony})}>
              <div style={{ width: '18px', height: '18px', border: '2px solid var(--accent-primary)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: formData.balcony ? 'var(--accent-primary)' : 'transparent' }}>
                {formData.balcony && <div style={{ width: '8px', height: '8px', background: 'white', borderRadius: '1px' }} />}
              </div>
              <span style={{ fontSize: '0.85rem', fontWeight: '800' }}>Balcony</span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem' }}>
            <div className="input-group"><label style={{fontSize:'0.75rem', fontWeight:'900', color:'var(--text-muted)'}}>WASHROOM</label>
              <select value={formData.washroomType} onChange={e => setFormData({...formData, washroomType: e.target.value})} style={{ ...inputStyle, width: '100%' }}>
                <option value="Attached">Attached</option>
                <option value="Common">Common / Shared</option>
              </select>
            </div>
            <div className="input-group"><label style={{fontSize:'0.75rem', fontWeight:'900', color:'var(--text-muted)'}}>FACING</label>
              <input placeholder="e.g. Garden, Road" value={formData.facing} onChange={e => setFormData({...formData, facing: e.target.value})} style={inputStyle} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem' }}>
            <div className="input-group"><label style={{fontSize:'0.75rem', fontWeight:'900', color:'var(--text-muted)'}}>FLOORING</label>
              <select value={formData.floorType} onChange={e => setFormData({...formData, floorType: e.target.value})} style={{ ...inputStyle, width: '100%' }}>
                <option value="Tiles">Ceramic Tiles</option>
                <option value="Marble">Premium Marble</option>
                <option value="Wooden">Wooden Finish</option>
              </select>
            </div>
            <div className="input-group"><label style={{fontSize:'0.75rem', fontWeight:'900', color:'var(--text-muted)'}}>WINDOWS</label>
              <input type="number" value={formData.windowCount} onChange={e => setFormData({...formData, windowCount: parseInt(e.target.value)})} style={inputStyle} min="0" />
            </div>
          </div>

          <div className="input-group">
            <label style={{fontSize:'0.75rem', fontWeight:'900', color:'var(--text-muted)'}}>FURNITURE & AMENITIES</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', marginTop: '0.4rem' }}>
              {['Bed', 'Cupboard', 'Study Table', 'Mirror', 'Fan', 'Curtains', 'Smart Lock', 'RFID Access', 'Air Flow Intelligence'].map(item => (
                <div 
                  key={item} 
                  onClick={() => {
                    const currentFurn = Array.isArray(formData.furniture) ? formData.furniture : [];
                    const newFurn = currentFurn.includes(item) 
                      ? currentFurn.filter(i => i !== item)
                      : [...currentFurn, item];
                    setFormData({...formData, furniture: newFurn});
                  }}
                  style={{ 
                    padding: '0.4rem 0.8rem', borderRadius: '10px', fontSize: '0.75rem', fontWeight: '800', cursor: 'pointer',
                    background: (Array.isArray(formData.furniture) && formData.furniture.includes(item)) ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
                    color: (Array.isArray(formData.furniture) && formData.furniture.includes(item)) ? 'white' : 'var(--text-secondary)',
                    border: '1px solid var(--border-color)', transition: 'all 0.2s'
                  }}
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
          <button className="btn btn-primary" type="submit" style={{ padding: '1.2rem', borderRadius: '18px', fontWeight: '950', marginTop: '0.5rem', fontSize: '1rem' }}>🚀 Deploy Intelligent Room</button>
        </form>
      </Modal>

      <Modal isOpen={isEditRoomOpen} onClose={() => setIsEditRoomOpen(false)} title={`Edit Room ${formData.number} Features`}>
        <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} onSubmit={handleUpdateRoom}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem' }}>
            <div className="input-group"><label style={{fontSize:'0.75rem', fontWeight:'900', color:'var(--text-muted)'}}>ROOM NO.</label><input placeholder="101" value={formData.number} onChange={e => setFormData({...formData, number: e.target.value})} style={inputStyle} required /></div>
            <div className="input-group"><label style={{fontSize:'0.75rem', fontWeight:'900', color:'var(--text-muted)'}}>ROOM TYPE</label>
              <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} style={{ ...inputStyle, width: '100%' }} required>
                <option value="Single">Single Suite</option>
                <option value="Shared">Shared Room</option>
                <option value="Dormitory">Dormitory</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem' }}>
            <div className="input-group"><label style={{fontSize:'0.75rem', fontWeight:'900', color:'var(--text-muted)'}}>MONTHLY RENT (₹)</label><input type="number" value={formData.rentAmount} onChange={e => setFormData({...formData, rentAmount: parseInt(e.target.value)})} style={inputStyle} required /></div>
            <div className="input-group"><label style={{fontSize:'0.75rem', fontWeight:'900', color:'var(--text-muted)'}}>DEPOSIT (₹)</label><input type="number" value={formData.securityDeposit} onChange={e => setFormData({...formData, securityDeposit: parseInt(e.target.value)})} style={inputStyle} required /></div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem' }}>
            <div className="input-group"><label style={{fontSize:'0.75rem', fontWeight:'900', color:'var(--text-muted)'}}>CAPACITY</label><input type="number" value={formData.capacity} onChange={e => setFormData({...formData, capacity: parseInt(e.target.value)})} style={inputStyle} required min="1" /></div>
            <div className="input-group"><label style={{fontSize:'0.75rem', fontWeight:'900', color:'var(--text-muted)'}}>NOTICE PERIOD</label><input type="number" value={formData.noticePeriod} onChange={e => setFormData({...formData, noticePeriod: parseInt(e.target.value)})} style={inputStyle} required /></div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', background: 'var(--bg-tertiary)', padding: '0.8rem', borderRadius: '12px', cursor: 'pointer', border: '1px solid var(--border-color)' }} onClick={() => setFormData({...formData, isAC: !formData.isAC})}>
              <div style={{ width: '18px', height: '18px', border: '2px solid var(--accent-primary)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: formData.isAC ? 'var(--accent-primary)' : 'transparent' }}>
                {formData.isAC && <div style={{ width: '8px', height: '8px', background: 'white', borderRadius: '1px' }} />}
              </div>
              <span style={{ fontSize: '0.85rem', fontWeight: '800' }}>AC</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', background: 'var(--bg-tertiary)', padding: '0.8rem', borderRadius: '12px', cursor: 'pointer', border: '1px solid var(--border-color)' }} onClick={() => setFormData({...formData, balcony: !formData.balcony})}>
              <div style={{ width: '18px', height: '18px', border: '2px solid var(--accent-primary)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: formData.balcony ? 'var(--accent-primary)' : 'transparent' }}>
                {formData.balcony && <div style={{ width: '8px', height: '8px', background: 'white', borderRadius: '1px' }} />}
              </div>
              <span style={{ fontSize: '0.85rem', fontWeight: '800' }}>Balcony</span>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem' }}>
            <div className="input-group"><label style={{fontSize:'0.75rem', fontWeight:'900', color:'var(--text-muted)'}}>WASHROOM</label>
              <select value={formData.washroomType} onChange={e => setFormData({...formData, washroomType: e.target.value})} style={{ ...inputStyle, width: '100%' }}>
                <option value="Attached">Attached</option>
                <option value="Common">Common / Shared</option>
              </select>
            </div>
            <div className="input-group"><label style={{fontSize:'0.75rem', fontWeight:'900', color:'var(--text-muted)'}}>FACING</label>
              <input placeholder="Garden" value={formData.facing} onChange={e => setFormData({...formData, facing: e.target.value})} style={inputStyle} />
            </div>
          </div>
          <button className="btn btn-primary" type="submit" style={{ padding: '1.2rem', borderRadius: '18px', fontWeight: '950', marginTop: '0.5rem', fontSize: '1rem' }}>Save Changes</button>
        </form>
      </Modal>

      <Modal isOpen={isEditBedOpen} onClose={() => setIsEditBedOpen(false)} title={`Edit Bed ${formData.number}`}>
        <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} onSubmit={handleUpdateBed}>
          <div className="input-group"><label style={{fontSize:'0.75rem', fontWeight:'900', color:'var(--text-muted)'}}>BED NO.</label><input value={formData.number} onChange={e => setFormData({...formData, number: e.target.value})} style={inputStyle} required /></div>
          <div className="input-group"><label style={{fontSize:'0.75rem', fontWeight:'900', color:'var(--text-muted)'}}>STATUS</label>
            <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} style={{ ...inputStyle, width: '100%' }}>
              <option value="AVAILABLE">AVAILABLE</option>
              <option value="OCCUPIED">OCCUPIED</option>
              <option value="MAINTENANCE">MAINTENANCE</option>
            </select>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem' }}>
            <div className="input-group"><label style={{fontSize:'0.75rem', fontWeight:'900', color:'var(--text-muted)'}}>TYPE</label>
              <select value={formData.bedType} onChange={e => setFormData({...formData, bedType: e.target.value})} style={{ ...inputStyle, width: '100%' }}>
                <option value="Single">Single</option>
                <option value="Lower Bunk">Lower Bunk</option>
                <option value="Upper Bunk">Upper Bunk</option>
              </select>
            </div>
            <div className="input-group"><label style={{fontSize:'0.75rem', fontWeight:'900', color:'var(--text-muted)'}}>POSITION</label>
              <select value={formData.position} onChange={e => setFormData({...formData, position: e.target.value})} style={{ ...inputStyle, width: '100%' }}>
                <option value="Standard">Standard</option>
                <option value="Window side">Window Side</option>
                <option value="Corner">Corner</option>
              </select>
            </div>
          </div>
          <button className="btn btn-primary" type="submit" style={{ padding: '1.1rem', borderRadius: '16px', fontWeight: '900' }}>Save Bed Details</button>
        </form>
      </Modal>

      <Modal isOpen={isAddBedOpen} onClose={() => setIsAddBedOpen(false)} title={`Configure New Bed in Room ${selectedRoom?.roomNumber}`}>
        <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} onSubmit={handleAddBed}>
          <div className="input-group"><label style={{fontSize:'0.75rem', fontWeight:'900', color:'var(--text-muted)'}}>BED IDENTIFIER</label><input placeholder="e.g. A, B, 101-A" value={formData.number} onChange={e => setFormData({...formData, number: e.target.value})} style={inputStyle} required /></div>
          <div className="input-group"><label style={{fontSize:'0.75rem', fontWeight:'900', color:'var(--text-muted)'}}>AVAILABILITY STATUS</label>
            <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} style={{ ...inputStyle, width: '100%' }} required>
              <option value="AVAILABLE">AVAILABLE</option>
              <option value="OCCUPIED">OCCUPIED</option>
              <option value="MAINTENANCE">MAINTENANCE</option>
            </select>
          </div>
          <div className="input-group">
            <label style={{fontSize:'0.75rem', fontWeight:'900', color:'var(--text-muted)'}}>BED PHOTO</label>
            <div style={{ position: 'relative', marginTop: '0.6rem' }}>
              <input type="file" accept="image/*" onChange={handleImageUpload} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', zIndex: 2 }} />
              <div style={{ ...inputStyle, display: 'flex', alignItems: 'center', gap: '1.2rem', background: 'rgba(99, 102, 241, 0.05)', borderColor: 'rgba(99, 102, 241, 0.3)', minHeight: '65px' }}>
                <ImageIcon size={22} color="var(--accent-primary)" />
                <span style={{ fontSize: '0.95rem', color: formData.imageUrl ? 'var(--accent-primary)' : 'var(--text-muted)', fontWeight: '800' }}>
                  {formData.imageUrl ? 'Photo Captured ✅' : 'Click to Upload Bed Image'}
                </span>
              </div>
            </div>
            {formData.imageUrl && (
              <div style={{ marginTop: '1rem', width: '100%', height: '120px', borderRadius: '16px', backgroundImage: `url(${formData.imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center', border: '1px solid var(--border-color)' }}></div>
            )}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem' }}>
            <div className="input-group"><label style={{fontSize:'0.75rem', fontWeight:'900', color:'var(--text-muted)'}}>BED TYPE</label>
              <select value={formData.bedType} onChange={e => setFormData({...formData, bedType: e.target.value})} style={{ ...inputStyle, width: '100%' }}>
                <option value="Single">Single</option>
                <option value="Lower Bunk">Lower Bunk</option>
                <option value="Upper Bunk">Upper Bunk</option>
                <option value="Queen">Queen Size</option>
              </select>
            </div>
            <div className="input-group"><label style={{fontSize:'0.75rem', fontWeight:'900', color:'var(--text-muted)'}}>POSITION</label>
              <select value={formData.position} onChange={e => setFormData({...formData, position: e.target.value})} style={{ ...inputStyle, width: '100%' }}>
                <option value="Standard">Standard</option>
                <option value="Window side">Window Side</option>
                <option value="Entrance side">Entrance Side</option>
                <option value="Corner">Corner</option>
              </select>
            </div>
          </div>
          <button className="btn btn-primary" type="submit" style={{ padding: '1.2rem', borderRadius: '18px', fontWeight: '950', marginTop: '0.5rem', fontSize: '1.05rem' }}>Save Bed Assignment</button>
        </form>
      </Modal>

      <Modal isOpen={isViewBedDetailsOpen} onClose={() => setIsViewBedDetailsOpen(false)} title={`Premium Bed Details - ${viewingBed?.bedNumber}`}>
        {viewingBed && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginTop: '-0.5rem' }}>
            <div style={{ 
              height: '280px', 
              borderRadius: '24px', 
              background: '#F1F5F9',
              backgroundImage: `url("${viewingBed.images && viewingBed.images[0] ? viewingBed.images[0] : 'https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=1200&auto=format&fit=crop'}"), linear-gradient(135deg, #F1F5F9 0%, #E2E8F0 100%)`, 
              backgroundSize: 'cover', 
              backgroundPosition: 'center', 
              position: 'relative',
              boxShadow: 'inset 0 0 100px rgba(0,0,0,0.1)',
              overflow: 'hidden'
            }}>
              <div style={{ 
                position: 'absolute', 
                top: '1.5rem', 
                right: '1.5rem', 
                padding: '0.6rem 1.2rem', 
                borderRadius: '14px', 
                background: 'rgba(15, 23, 42, 0.85)', 
                backdropFilter: 'blur(12px)', 
                color: 'white', 
                fontSize: '0.9rem', 
                fontWeight: '950',
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: '0 10px 20px rgba(0,0,0,0.2)'
              }}>
                ₹{viewingBed.price || 8500}<span style={{ opacity: 0.7, fontSize: '0.7rem', fontWeight: '700' }}>/MONTH</span>
              </div>
            </div>

            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', 
              gap: '2.5rem' 
            }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '900', marginBottom: '1.2rem', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <Bed size={20} color="#6366F1" /> Technical Specifications
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  {[
                    { label: 'Bed Type', value: viewingBed.bedType || 'Single Bunk', icon: <BedDouble size={16} /> },
                    { label: 'Position', value: viewingBed.position || 'Window Side', icon: <Sun size={16} /> },
                    { label: 'Material', value: 'High-Grade Steel', icon: <Ruler size={16} /> },
                    { label: 'Mattress', value: 'Memory Foam', icon: <Heart size={16} /> },
                    { label: 'Capacity', value: '180kg Max', icon: <Weight size={16} /> },
                    { label: 'Power', value: 'USB-C Ready', icon: <BatteryCharging size={16} /> }
                  ].map((spec, i) => (
                    <div key={i} style={{ padding: '1rem', borderRadius: '16px', background: '#F8FAFC', border: '1px solid #F1F5F9' }}>
                      <div style={{ color: '#6366F1', marginBottom: '0.4rem' }}>{spec.icon}</div>
                      <p style={{ fontSize: '0.6rem', color: '#94A3B8', fontWeight: '800', margin: 0, textTransform: 'uppercase' }}>{spec.label}</p>
                      <p style={{ fontSize: '0.85rem', color: '#1E293B', fontWeight: '900', margin: 0 }}>{spec.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '900', marginBottom: '1.2rem', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <UsersRound size={20} color="#3B82F6" /> Occupancy Control
                </h3>
                {viewingBed.status === 'OCCUPIED' ? (
                  <div style={{ padding: '1.5rem', borderRadius: '24px', background: '#EFF6FF', border: '1px solid #BFDBFE' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.2rem' }}>
                      <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: '#3B82F6', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: '900' }}>
                        {viewingBed.tenant?.name?.[0] || 'T'}
                      </div>
                      <div>
                        <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: '900' }}>{viewingBed.tenant?.name || 'John Doe'}</h4>
                        <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748B', fontWeight: '700' }}>Tenant ID: #TEN-4920</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                      <p style={{ fontSize: '0.85rem', color: '#1E293B', fontWeight: '700', display: 'flex', justifyContent: 'space-between' }}><span>Check-in:</span> <span style={{fontWeight: '900'}}>01 May 2026</span></p>
                      <p style={{ fontSize: '0.85rem', color: '#1E293B', fontWeight: '700', display: 'flex', justifyContent: 'space-between' }}><span>Rent Status:</span> <span style={{color: '#10B981', fontWeight: '900'}}>Paid</span></p>
                      <p style={{ fontSize: '0.85rem', color: '#1E293B', fontWeight: '700', display: 'flex', justifyContent: 'space-between' }}><span>Documents:</span> <span style={{color: '#3B82F6', fontWeight: '900'}}>Verified</span></p>
                    </div>
                    <button style={{ width: '100%', marginTop: '1.2rem', padding: '0.8rem', borderRadius: '12px', background: '#3B82F6', color: 'white', border: 'none', fontWeight: '900', fontSize: '0.85rem', cursor: 'pointer' }}>Message Tenant</button>
                  </div>
                ) : (
                  <div style={{ padding: '2rem', textAlign: 'center', borderRadius: '24px', background: '#ECFDF5', border: '1px dashed #10B981' }}>
                    <Sparkles size={32} color="#10B981" style={{ marginBottom: '1rem' }} />
                    <h4 style={{ margin: '0 0 0.5rem 0', color: '#065F46' }}>Bed Available</h4>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: '#065F46', opacity: 0.8 }}>This bed is ready for immediate deployment.</p>
                    <button 
                      onClick={() => setIsAssignTenantOpen(true)}
                      style={{ marginTop: '1.2rem', padding: '0.8rem 1.5rem', borderRadius: '12px', background: '#10B981', color: 'white', border: 'none', fontWeight: '900', cursor: 'pointer' }}
                    >
                      Assign Tenant
                    </button>
                  </div>
                )}

                <div style={{ marginTop: '2rem', padding: '1.5rem', borderRadius: '24px', background: '#F1F5F9', border: '1px solid #E2E8F0' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: '900', marginBottom: '0.8rem', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <MapPin size={18} color="#6366F1" /> Infrastructure Context
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <p style={{ margin: 0, fontSize: '0.65rem', color: '#64748B', fontWeight: '800' }}>FLOOR</p>
                      <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: '900' }}>Level {selectedRoom?.floorNumber || 2}</p>
                    </div>
                    <div>
                      <p style={{ margin: 0, fontSize: '0.65rem', color: '#64748B', fontWeight: '800' }}>ROOM</p>
                      <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: '900' }}>Suite {selectedRoom?.roomNumber || '204'}</p>
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: '2rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: '900', marginBottom: '0.8rem' }}>Smart Amenities</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {['USB-C Charging', 'Wi-Fi 6', 'Locker', 'Reading Light', 'Personal Fan', 'Smart Lock'].map(a => (
                      <span key={a} style={{ padding: '0.4rem 0.8rem', borderRadius: '10px', background: 'white', border: '1px solid #E2E8F0', fontSize: '0.75rem', fontWeight: '800', color: '#475569' }}>{a}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div style={{ padding: '1.5rem', borderRadius: '24px', background: '#0F172A', color: 'white' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '900', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Sparkles size={20} color="#6366F1" /> Asset Intelligence
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)', lineHeight: '1.6', margin: 0 }}>
                This {viewingBed.bedType || 'premium'} unit is optimized for maximum comfort and privacy. 
                Featuring integrated smart modules and high-durability materials, it maintains a 98% 
                satisfaction rating among professional tenants.
              </p>
              <div style={{ display: 'flex', gap: '2rem', marginTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.5rem' }}>
                <div>
                  <p style={{ margin: 0, fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)', fontWeight: '800' }}>DEPLOYED</p>
                  <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: '900' }}>12 Jan 2026</p>
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)', fontWeight: '800' }}>LAST SERVICE</p>
                  <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: '900' }}>28 Apr 2026</p>
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)', fontWeight: '800' }}>REVENUE LDT</p>
                  <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: '900' }}>₹42,500</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* --- Room Details Modal --- */}
      <Modal isOpen={isViewRoomDetailsOpen} onClose={() => setIsViewRoomDetailsOpen(false)} title={`Luxury Room Intelligence - ${previewingRoom?.roomNumber}`}>
        {previewingRoom && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginTop: '-0.5rem' }}>
            {/* Hero Image Section */}
            <div style={{ 
              height: '320px', borderRadius: '32px', background: '#F1F5F9',
              backgroundImage: `url("${previewingRoom.images?.[0] || 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80'}"), linear-gradient(135deg, #F1F5F9 0%, #E2E8F0 100%)`, 
              backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative',
              boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
            }}>
              <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', padding: '0.6rem 1.2rem', borderRadius: '14px', background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(12px)', color: 'white', fontSize: '0.9rem', fontWeight: '950', border: '1px solid rgba(255,255,255,0.1)' }}>
                ₹{previewingRoom.rentAmount || 0}<span style={{ opacity: 0.7, fontSize: '0.7rem' }}>/MONTH</span>
              </div>
              <div style={{ position: 'absolute', bottom: '1.5rem', left: '1.5rem', display: 'flex', gap: '0.8rem' }}>
                <span style={{ padding: '0.5rem 1rem', borderRadius: '12px', background: 'white', color: '#0F172A', fontSize: '0.75rem', fontWeight: '950' }}>{previewingRoom.roomType}</span>
                <span style={{ padding: '0.5rem 1rem', borderRadius: '12px', background: '#10B981', color: 'white', fontSize: '0.75rem', fontWeight: '950' }}>{previewingRoom.occupied === previewingRoom.capacity ? 'FULL' : 'AVAILABLE'}</span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
              {/* Left Column: Specs & Environment */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: '950', marginBottom: '1.2rem', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <Ruler size={20} color="#6366F1" /> Technical Specifications
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    {[
                      { label: 'Room Area', value: '240 sq.ft', icon: <Maximize size={16} /> },
                      { label: 'Ceiling Height', value: '10.5 ft', icon: <ArrowUp size={16} /> },
                      { label: 'Flooring', value: 'Italian Marble', icon: <Square size={16} /> },
                      { label: 'Ventilation', value: 'Dual Aspect', icon: <Wind size={16} /> },
                      { label: 'Wall Finish', value: 'Premium Emulsion', icon: <Brush size={16} /> },
                      { label: 'Interior Theme', value: 'Minimalist Nordic', icon: <Palette size={16} /> }
                    ].map((spec, i) => (
                      <div key={i} style={{ padding: '1rem', borderRadius: '18px', background: '#F8FAFC', border: '1px solid #F1F5F9' }}>
                        <div style={{ color: '#6366F1', marginBottom: '0.4rem' }}>{spec.icon}</div>
                        <p style={{ fontSize: '0.6rem', color: '#94A3B8', fontWeight: '800', margin: 0, textTransform: 'uppercase' }}>{spec.label}</p>
                        <p style={{ fontSize: '0.85rem', color: '#1E293B', fontWeight: '950', margin: 0 }}>{spec.value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: '950', marginBottom: '1.2rem', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <Sparkles size={20} color="#3B82F6" /> Environment & Comfort
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    {[
                      { label: 'Natural Light', score: 92, color: '#F59E0B' },
                      { label: 'Air Quality', score: 96, color: '#10B981' },
                      { label: 'Noise Insulation', score: 88, color: '#6366F1' },
                      { label: 'Privacy Index', score: 95, color: '#EC4899' }
                    ].map((env, i) => (
                      <div key={i} style={{ padding: '1.2rem', borderRadius: '24px', background: 'white', border: '1px solid #F1F5F9', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: '900', color: '#64748B' }}>{env.label}</span>
                          <span style={{ fontSize: '0.75rem', fontWeight: '1000', color: env.color }}>{env.score}%</span>
                        </div>
                        <div style={{ height: '6px', background: '#F1F5F9', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${env.score}%`, background: env.color, borderRadius: '3px' }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Amenities & Safety */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: '950', marginBottom: '1.2rem', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <LayoutGrid size={20} color="#10B981" /> Smart Amenities
                  </h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                    {['WiFi 6', 'Smart TV', 'Air Conditioner', 'Fan', 'Geyser', 'Study Desk', 'Ergonomic Chair', 'Personal Locker', 'USB Charging', 'Reading Light'].map(a => (
                      <span key={a} style={{ padding: '0.6rem 1.2rem', borderRadius: '14px', background: 'white', border: '1px solid #E2E8F0', fontSize: '0.8rem', fontWeight: '900', color: '#1E293B', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10B981' }} /> {a}
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{ padding: '1.5rem', borderRadius: '28px', background: '#F0FDFA', border: '1px solid #CCFBF1' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: '950', marginBottom: '1rem', color: '#134E4A', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <ShieldCheck size={20} color="#0D9488" /> Safety & Hygiene Protocol
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: '800', color: '#134E4A' }}>
                      <span>Last Sanitized:</span>
                      <span style={{ fontWeight: '950' }}>Today, 09:30 AM</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: '800', color: '#134E4A' }}>
                      <span>Hygiene Score:</span>
                      <span style={{ fontWeight: '950', color: '#0D9488' }}>98/100 (A+)</span>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                      <span style={{ padding: '0.3rem 0.7rem', borderRadius: '8px', background: '#D1FAE5', color: '#065F46', fontSize: '0.65rem', fontWeight: '900' }}>CCTV SECURED</span>
                      <span style={{ padding: '0.3rem 0.7rem', borderRadius: '8px', background: '#D1FAE5', color: '#065F46', fontSize: '0.65rem', fontWeight: '900' }}>FIRE RATED</span>
                    </div>
                  </div>
                </div>

                <div style={{ padding: '1.5rem', borderRadius: '28px', background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)', color: 'white' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.8rem' }}>
                    <Sparkles size={20} color="#6366F1" />
                    <h3 style={{ fontSize: '1rem', fontWeight: '950', margin: 0 }}>AI Operational Insight</h3>
                  </div>
                  <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)', lineHeight: '1.6', margin: 0 }}>
                    This room is currently performing at **peak efficiency**. Demand for this unit is **1.4x higher** than average. 
                    Recommended for long-stay professionals.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* --- Assign Tenant Modal --- */}
      <Modal isOpen={isAssignTenantOpen} onClose={() => setIsAssignTenantOpen(false)} title={`Assign Tenant - Bed ${viewingBed?.bedNumber}`}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ padding: '1.2rem', background: '#F8FAFC', borderRadius: '20px', border: '1px solid #E2E8F0' }}>
            <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', fontWeight: '900', color: '#0F172A' }}>Select Candidate</h4>
            <div style={{ position: 'relative' }}>
              <Search size={18} color="#94A3B8" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input 
                placeholder="Search by name or ID..." 
                style={{ ...inputStyle, paddingLeft: '3rem', fontSize: '0.9rem', width: '100%' }} 
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', maxHeight: '400px', overflowY: 'auto', paddingRight: '0.5rem' }}>
            {[
              { id: 'T001', name: 'Aryan Sharma', type: 'Professional', status: 'Verified', rent: '9,500' },
              { id: 'T002', name: 'Vikram Singh', type: 'Student', status: 'Pending Docs', rent: '8,500' },
              { id: 'T003', name: 'Siddharth Rao', type: 'Professional', status: 'Verified', rent: '9,500' },
              { id: 'T004', name: 'Kabir Verma', type: 'Student', status: 'Verified', rent: '8,500' }
            ].map(tenant => (
              <motion.div 
                key={tenant.id}
                whileHover={{ scale: 1.01, background: '#F1F5F9' }}
                onClick={() => {
                  setAssignData({ bed: viewingBed, tenant });
                  setIsAssignConfirmOpen(true);
                }}
                style={{ 
                  padding: '1rem 1.5rem', borderRadius: '20px', border: '1px solid #E2E8F0', 
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
                  cursor: 'pointer', background: 'white', transition: 'all 0.2s' 
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#6366F1', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900' }}>
                    {tenant.name[0]}
                  </div>
                  <div>
                    <h5 style={{ margin: 0, fontSize: '0.95rem', fontWeight: '900', color: '#0F172A' }}>{tenant.name}</h5>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748B', fontWeight: '700' }}>{tenant.type} • ID: {tenant.id}</p>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ 
                    padding: '0.3rem 0.6rem', borderRadius: '8px', background: tenant.status === 'Verified' ? '#ECFDF5' : '#FEF2F2', 
                    color: tenant.status === 'Verified' ? '#10B981' : '#EF4444', fontSize: '0.65rem', fontWeight: '950' 
                  }}>
                    {tenant.status}
                  </span>
                  <p style={{ margin: '0.4rem 0 0 0', fontSize: '0.85rem', fontWeight: '900', color: '#0F172A' }}>₹{tenant.rent}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <button 
              className="btn" 
              style={{ padding: '1rem', borderRadius: '16px', background: '#F1F5F9', border: '1px solid #E2E8F0', color: '#475569', fontWeight: '900' }}
              onClick={() => setIsAssignTenantOpen(false)}
            >
              Cancel
            </button>
            <button 
              className="btn btn-primary" 
              style={{ padding: '1rem', borderRadius: '16px', fontWeight: '900' }}
              onClick={() => alert("Redirecting to New Tenant Application...")}
            >
              <PlusCircle size={18} /> New Applicant
            </button>
          </div>
        </div>
      </Modal>
      
      {/* --- Assignment Confirmation Modal --- */}
      <Modal isOpen={isAssignConfirmOpen} onClose={() => setIsAssignConfirmOpen(false)} title="Confirm Assignment">
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '1rem' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#ECFDF5', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
            <UserCheck size={40} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '1000', color: '#0F172A', margin: '0 0 0.5rem 0' }}>Verify Assignment?</h3>
            <p style={{ color: '#64748B', fontWeight: '700', lineHeight: '1.6' }}>
              You are about to assign <span style={{ color: '#0F172A', fontWeight: '900' }}>{assignData.tenant?.name}</span> to 
              <span style={{ color: '#0F172A', fontWeight: '900' }}> Bed {assignData.bed?.bedNumber}</span> in 
              <span style={{ color: '#0F172A', fontWeight: '900' }}> Room {selectedRoom?.roomNumber}</span>.
            </p>
          </div>
          
          <div style={{ background: '#F8FAFC', padding: '1.5rem', borderRadius: '24px', border: '1px solid #E2E8F0', textAlign: 'left' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
              <span style={{ color: '#64748B', fontWeight: '700', fontSize: '0.85rem' }}>Monthly Rent</span>
              <span style={{ fontWeight: '900', color: '#0F172A' }}>₹{assignData.tenant?.rent || 8500}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
              <span style={{ color: '#64748B', fontWeight: '700', fontSize: '0.85rem' }}>Security Deposit</span>
              <span style={{ fontWeight: '900', color: '#0F172A' }}>₹{(parseInt(assignData.tenant?.rent?.replace(',','') || 8500) * 2).toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#64748B', fontWeight: '700', fontSize: '0.85rem' }}>Move-in Date</span>
              <span style={{ fontWeight: '900', color: '#6366F1' }}>{new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '1rem' }}>
            <button 
              className="btn" 
              style={{ padding: '1.1rem', borderRadius: '18px', background: 'white', border: '1px solid #E2E8F0', color: '#475569', fontWeight: '950' }}
              onClick={() => setIsAssignConfirmOpen(false)}
            >
              Back
            </button>
            <button 
              className="btn btn-primary" 
              style={{ padding: '1.1rem', borderRadius: '18px', fontWeight: '950', boxShadow: '0 15px 30px rgba(16, 185, 129, 0.25)' }}
              onClick={async () => {
                try {
                  // alert(`Successfully assigned ${assignData.tenant.name} to Bed ${assignData.bed.bedNumber}`);
                  setIsAssignConfirmOpen(false);
                  setIsAssignTenantOpen(false);
                  setIsViewBedDetailsOpen(false);
                  setBeds(prev => prev.map(b => (b.id === assignData.bed.id || b._id === assignData.bed.id) ? { ...b, status: 'OCCUPIED', tenant: assignData.tenant } : b));
                } catch (err) {
                  alert("Failed to assign bed: " + err.message);
                }
              }}
            >
              Confirm Assignment
            </button>
          </div>
        </div>
      </Modal>

      {/* Smart Property Intelligence Drawer */}
      <PropertyDetailDrawer 
        isOpen={isDetailDrawerOpen} 
        onClose={() => setIsDetailDrawerOpen(false)} 
        target={detailTarget} 
        type={detailType} 
        activeTab={activeDetailTab} 
        onTabChange={setActiveDetailTab} 
      />

      {/* --- Smart Analytics Modal (Legacy, being phased out) --- */}
      <Modal isOpen={isAnalyticsModalOpen} onClose={() => setIsAnalyticsModalOpen(false)} title={`Advanced Analytics - ${analyticsTarget?.name || 'Level ' + analyticsTarget?.floorNumber}`}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Main KPI Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.2rem' }}>
            {[
              { label: 'Utilization', value: '92.4%', color: '#6366F1', icon: <Activity size={18} /> },
              { label: 'Revenue ROI', value: '+14.2%', color: '#10B981', icon: <TrendingUp size={18} /> },
              { label: 'Churn Rate', value: '1.2%', color: '#EF4444', icon: <UsersRound size={18} /> }
            ].map((kpi, i) => (
              <div key={i} style={{ padding: '1.5rem', background: '#F8FAFC', borderRadius: '24px', border: '1px solid #E2E8F0' }}>
                <div style={{ color: kpi.color, marginBottom: '0.8rem' }}>{kpi.icon}</div>
                <p style={{ margin: 0, fontSize: '0.7rem', fontWeight: '900', color: '#64748B', letterSpacing: '0.05em' }}>{kpi.label.toUpperCase()}</p>
                <p style={{ margin: 0, fontSize: '1.4rem', fontWeight: '1000', color: '#0F172A' }}>{kpi.value}</p>
              </div>
            ))}
          </div>

          {/* Performance Visualization (Mock Chart) */}
          <div style={{ padding: '2rem', background: '#0F172A', borderRadius: '32px', color: 'white' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
              <div>
                <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '900' }}>Operational Efficiency Trends</h4>
                <p style={{ margin: 0, fontSize: '0.75rem', opacity: 0.6 }}>Last 30 days performance cycle</p>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {['7D', '30D', '90D'].map(t => (
                  <span key={t} style={{ padding: '0.3rem 0.6rem', borderRadius: '8px', background: t === '30D' ? '#6366F1' : 'rgba(255,255,255,0.1)', fontSize: '0.65rem', fontWeight: '900', cursor: 'pointer' }}>{t}</span>
                ))}
              </div>
            </div>
            
            <div style={{ height: '180px', display: 'flex', alignItems: 'flex-end', gap: '1rem', padding: '0 1rem' }}>
              {[40, 65, 45, 80, 55, 90, 75, 85, 60, 95].map((h, i) => (
                <motion.div 
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  transition={{ delay: i * 0.1 }}
                  style={{ flex: 1, background: i === 9 ? '#6366F1' : 'rgba(99, 102, 241, 0.3)', borderRadius: '6px 6px 0 0', position: 'relative' }}
                >
                   {i === 9 && <div style={{ position: 'absolute', top: '-25px', left: '50%', transform: 'translateX(-50%)', fontSize: '0.6rem', fontWeight: '900' }}>PEAK</div>}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Detailed Breakdown Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.5rem' }}>
            <div style={{ padding: '1.5rem', borderRadius: '28px', border: '1px solid #E2E8F0' }}>
              <h4 style={{ margin: '0 0 1rem 0', fontSize: '0.9rem', fontWeight: '900' }}>Occupancy Distribution</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[
                  { label: 'Premium Suites', val: 85, color: '#6366F1' },
                  { label: 'Standard Units', val: 94, color: '#10B981' },
                  { label: 'Budget Zones', val: 78, color: '#F59E0B' }
                ].map((row, i) => (
                  <div key={i}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: '800', marginBottom: '0.4rem' }}>
                      <span style={{ color: '#475569' }}>{row.label}</span>
                      <span style={{ color: '#0F172A' }}>{row.val}%</span>
                    </div>
                    <div style={{ height: '8px', background: '#F1F5F9', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${row.val}%`, background: row.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ padding: '1.5rem', borderRadius: '28px', background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)', color: 'white' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
                <Sparkles size={18} />
                <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: '900' }}>AI Forecast</h4>
              </div>
              <p style={{ margin: 0, fontSize: '0.8rem', lineHeight: '1.6', fontWeight: '700' }}>
                Demand expected to surge by **18%** next month. 
                Recommended action: **Adjust dynamic pricing** for upper bunk units.
              </p>
              <button style={{ width: '100%', marginTop: '1.5rem', padding: '0.8rem', borderRadius: '14px', background: 'white', color: '#4F46E5', border: 'none', fontWeight: '950', fontSize: '0.8rem', cursor: 'pointer' }}>
                Optimize ROI Now
              </button>
            </div>
          </div>
        </div>
      </Modal>

      {/* --- Bed History Modal --- */}
      <Modal isOpen={isViewBedHistoryOpen} onClose={() => setIsViewBedHistoryOpen(false)} title={`Operational History - ${viewingBed?.bedNumber}`}>
        {viewingBed && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
              gap: '1.5rem', 
              padding: '1.5rem', 
              background: '#F8FAFC', 
              borderRadius: '24px', 
              border: '1px solid #F1F5F9' 
            }}>
              <div style={{ textAlign: 'center' }}>
                <p style={{ margin: 0, fontSize: '0.7rem', color: '#94A3B8', fontWeight: '800', textTransform: 'uppercase' }}>Lifetime Occupancy</p>
                <p style={{ margin: '0.2rem 0 0 0', fontSize: '1.6rem', fontWeight: '1000', color: '#0F172A' }}>94% <span style={{ fontSize: '0.9rem', color: '#10B981', verticalAlign: 'middle' }}>↑ 4%</span></p>
              </div>
              <div style={{ textAlign: 'center', borderLeft: '1px solid #E2E8F0', borderRight: '1px solid #E2E8F0' }}>
                <p style={{ margin: 0, fontSize: '0.7rem', color: '#94A3B8', fontWeight: '800', textTransform: 'uppercase' }}>Maintenance Events</p>
                <p style={{ margin: '0.2rem 0 0 0', fontSize: '1.6rem', fontWeight: '1000', color: '#0F172A' }}>12 <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: '700' }}>Logged</span></p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ margin: 0, fontSize: '0.7rem', color: '#94A3B8', fontWeight: '800', textTransform: 'uppercase' }}>Revenue Generated</p>
                <p style={{ margin: '0.2rem 0 0 0', fontSize: '1.6rem', fontWeight: '1000', color: '#0F172A' }}>₹1.2L</p>
              </div>
            </div>

            <div style={{ position: 'relative', paddingLeft: '2rem' }}>
              <div style={{ position: 'absolute', left: '7px', top: '0', bottom: '0', width: '2px', background: '#E2E8F0' }} />
              {[
                { date: '01 May 2026', title: 'Tenant Check-in', desc: 'John Doe assigned to Bed #4. Deposit paid.', icon: <UserCheck size={14} />, color: '#3B82F6' },
                { date: '28 Apr 2026', title: 'Sanitization & Cleaning', desc: 'Routine hygiene check completed by Staff: Rohit.', icon: <Sparkles size={14} />, color: '#10B981' },
                { date: '15 Apr 2026', title: 'Maintenance Request', desc: 'USB Port repair completed. Tested and verified.', icon: <Wrench size={14} />, color: '#F59E0B' },
                { date: '10 Apr 2026', title: 'Previous Tenant Checkout', desc: 'Alice Smith vacated. Full settlement done.', icon: <Clock size={14} />, color: '#64748B' },
                { date: '01 Mar 2026', title: 'Initial Deployment', desc: 'Bed installed as part of Floor 2 infrastructure.', icon: <BuildingIcon size={14} />, color: '#0F172A' }
              ].map((log, i) => (
                <div key={i} style={{ position: 'relative', marginBottom: '1.5rem' }}>
                  <div style={{ position: 'absolute', left: '-2rem', top: '4px', width: '16px', height: '16px', borderRadius: '50%', background: 'white', border: `3px solid ${log.color}`, zIndex: 2 }} />
                  <p style={{ margin: '0 0 0.2rem 0', fontSize: '0.75rem', fontWeight: '800', color: '#94A3B8' }}>{log.date}</p>
                  <h4 style={{ margin: '0 0 0.2rem 0', fontSize: '0.9rem', fontWeight: '950', color: '#1E293B' }}>{log.title}</h4>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748B', fontWeight: '600' }}>{log.desc}</p>
                </div>
              ))}
            </div>
            
            <button style={{ padding: '1rem', borderRadius: '16px', background: '#F1F5F9', color: '#475569', border: '1px solid #E2E8F0', fontWeight: '900', cursor: 'pointer' }}>Download Full Audit Log</button>
          </div>
        )}
      </Modal>

      </div>
    </>
  );
};

// --- Sub Components ---

const RoomHero = ({ room, onImageUpdate, onEdit }) => (
  <div style={{
    width: '100%',
    height: '400px',
    borderRadius: '40px',
    overflow: 'hidden',
    position: 'relative',
    marginBottom: '3.5rem',
    boxShadow: '0 35px 70px -15px rgba(0,0,0,0.3)',
    border: '1px solid rgba(255,255,255,0.1)'
  }}>
    <motion.div
      initial={{ scale: 1.1 }} animate={{ scale: 1 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      style={{
        position: 'absolute', inset: 0,
        backgroundImage: `url("${room?.images?.[0] || 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1600&q=80'}")`,
        backgroundSize: 'cover', backgroundPosition: 'center',
      }}
    >
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to top, rgba(15, 23, 42, 0.95) 0%, rgba(15, 23, 42, 0.4) 50%, transparent 100%)'
      }} />
    </motion.div>

    <div style={{
      position: 'absolute', top: '2rem', right: '2rem',
      display: 'flex', gap: '0.8rem', zIndex: 20
    }}>
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        <button className="btn" style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', padding: '0.6rem 1.2rem', borderRadius: '12px', fontSize: '0.8rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ImageIcon size={16} /> Add Pictures
        </button>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => {
            if (e.target.files.length > 0) {
              Array.from(e.target.files).forEach(file => onImageUpdate(file));
            }
          }}
          style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }}
        />
      </div>
    </div>

    {room?.images && room.images.length > 1 && (
      <div style={{ position: 'absolute', bottom: '15rem', right: '3rem', display: 'flex', gap: '0.5rem', zIndex: 20 }}>
        {room.images.map((img, i) => (
          <div key={i} style={{ width: '60px', height: '60px', borderRadius: '12px', border: '2px solid rgba(255,255,255,0.5)', backgroundImage: `url("${img}")`, backgroundSize: 'cover', backgroundPosition: 'center', cursor: 'pointer' }} />
        ))}
      </div>
    )}

    <div style={{
      position: 'absolute', bottom: '3rem', left: '3rem', right: '3rem',
      display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
      zIndex: 10
    }}>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
          <span style={{ padding: '0.4rem 1rem', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.25)', color: '#A5B4FC', fontSize: '0.8rem', fontWeight: '950', border: '1px solid rgba(99, 102, 241, 0.35)', backdropFilter: 'blur(15px)', letterSpacing: '0.05em' }}>PREMIUM SUITE CONFIG</span>
          {room?.isAC && <span style={{ padding: '0.4rem 1rem', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.25)', color: '#FCD34D', fontSize: '0.8rem', fontWeight: '950', border: '1px solid rgba(245, 158, 11, 0.35)', display: 'flex', alignItems: 'center', gap: '0.4rem', backdropFilter: 'blur(15px)' }}><Zap size={14} fill="#FCD34D" /> AC READY</span>}
        </div>
        <h2 style={{ fontSize: '4.5rem', fontWeight: '1000', color: 'white', margin: 0, letterSpacing: '-0.05em', lineHeight: 0.9 }}>Room {room?.roomNumber}</h2>
        <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '1.25rem', fontWeight: '700', marginTop: '0.8rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <span style={{ color: '#10B981', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><UsersRound size={20}/> {room?.occupied || 0}/{room?.capacity} Occupied</span>
          <span style={{ opacity: 0.3 }}>|</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Banknote size={20}/> ₹{room?.rentAmount || 0} / mo</span>
          <span style={{ opacity: 0.3 }}>|</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Clock size={20}/> {room?.noticePeriod || 30}d Notice</span>
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '2rem' }}>
          <div style={{ padding: '0.7rem 1.2rem', borderRadius: '14px', background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', display: 'flex', alignItems: 'center', gap: '0.8rem', fontSize: '0.9rem', fontWeight: '800' }}>
            <Zap size={18} color={room?.isAC ? '#F59E0B' : '#94A3B8'} fill={room?.isAC ? '#F59E0B' : 'transparent'} /> {room?.isAC ? 'Climate Controlled' : 'Non-AC'}
          </div>
          <div style={{ padding: '0.7rem 1.2rem', borderRadius: '14px', background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', display: 'flex', alignItems: 'center', gap: '0.8rem', fontSize: '0.9rem', fontWeight: '800' }}>
            <Layers size={18} color="#A5B4FC" /> {room?.floorType} Flooring
          </div>
          <div style={{ padding: '0.7rem 1.2rem', borderRadius: '14px', background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', display: 'flex', alignItems: 'center', gap: '0.8rem', fontSize: '0.9rem', fontWeight: '800' }}>
            <MessageSquareWarning size={18} color="#FCD34D" /> {room?.washroomType} Washroom
          </div>
          {room?.balcony && (
            <div style={{ padding: '0.7rem 1.2rem', borderRadius: '14px', background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', display: 'flex', alignItems: 'center', gap: '0.8rem', fontSize: '0.9rem', fontWeight: '800' }}>
              <ImageIcon size={18} color="#10B981" /> Balcony Access
            </div>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem' }}>
        <div style={{ position: 'relative' }}>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => e.target.files[0] && onImageUpdate(e.target.files[0])}
            style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', zIndex: 5 }}
          />
          <button className="btn" style={{ padding: '1.2rem', borderRadius: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '60px', height: '60px', background: 'rgba(255,255,255,0.1)', color: 'white', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)', transition: 'all 0.3s' }}>
            <ImageIcon size={24} />
          </button>
        </div>
        <button 
          onClick={onEdit}
          className="btn" 
          style={{ padding: '1.2rem 2.2rem', borderRadius: '22px', display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '1.1rem', fontWeight: '950', background: 'white', color: '#0F172A', boxShadow: '0 20px 40px rgba(0,0,0,0.4)', transition: 'all 0.3s' }}
        >
          <Edit2 size={24} /> Edit Features
        </button>
      </div>
    </div>
  </div>
);

const PremiumBuildingCard = ({ building, onSelect, onViewAnalytics }) => {
  const occupancyRate = building.occupancyRate || 84; 
  const monthlyRevenue = building.revenueEngine ? `${(building.revenueEngine/100000).toFixed(1)}L` : '12.4L';
  const hygieneScore = building.hygieneScore || 98;
  
  const stats = {
    floors: building.floors?.length || 0,
    rooms: building.totalRooms || 32,
    beds: building.totalBeds || 128,
    occupied: building.occupiedBeds || 108
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -15, scale: 1.01 }}
      onClick={() => onSelect(building)}
      style={{
        background: 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(30px)',
        borderRadius: '40px',
        padding: '1.5rem',
        border: '1px solid rgba(255, 255, 255, 0.4)',
        boxShadow: '0 30px 60px -12px rgba(0, 0, 0, 0.12)',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.2rem',
        cursor: 'pointer',
        overflow: 'hidden',
        minHeight: '820px',
        maxWidth: '100%'
      }}
    >
      {/* Background Neon Accent */}
      <div style={{
        position: 'absolute', top: '-100px', right: '-100px', width: '300px', height: '300px',
        background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)',
        zIndex: 0, pointerEvents: 'none'
      }} />

      {/* Header Section */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.6rem' }}>
              <span style={{ 
                padding: '0.4rem 0.8rem', borderRadius: '12px', background: '#0F172A', color: 'white', 
                fontSize: '0.7rem', fontWeight: '950', letterSpacing: '0.05em' 
              }}>
                B-ID: {building.id?.slice(-6).toUpperCase()}
              </span>
              <span style={{ padding: '0.4rem 0.8rem', borderRadius: '12px', background: '#F0F9FF', color: '#0369A1', fontSize: '0.65rem', fontWeight: '900' }}>
                {building.category?.toUpperCase() || 'PREMIUM'}
              </span>
            </div>
            <h3 style={{ fontSize: '2rem', fontWeight: '1000', margin: 0, color: '#0F172A', letterSpacing: '-0.04em' }}>
              {building.name}
            </h3>
            <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.9rem', color: '#64748B', fontWeight: '700' }}>{building.address}</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.4rem' }}>
            <motion.div 
              animate={{ scale: [1, 1.1, 1] }} 
              transition={{ duration: 2, repeat: Infinity }}
              style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10B981', boxShadow: '0 0 10px #10B981' }} 
            />
            <span style={{ fontSize: '0.65rem', fontWeight: '950', color: '#10B981' }}>LIVE OPERATIONAL</span>
          </div>
        </div>
      </div>

      {/* Hero Visualization */}
      <div style={{ 
        position: 'relative', height: '220px', borderRadius: '32px', overflow: 'hidden', 
        background: '#F1F5F9', border: '1px solid rgba(255,255,255,0.8)', zIndex: 1 
      }}>
        <img 
          src={building.images?.[0] || 'https://images.unsplash.com/photo-1545324418-f1d3c5b53571?auto=format&fit=crop&w=800&q=80'} 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          alt={building.name || "Building"}
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1545324418-f1d3c5b53571?auto=format&fit=crop&w=800&q=80';
          }}
        />
        <div style={{ 
          position: 'absolute', inset: 0, 
          background: 'linear-gradient(to top, rgba(15, 23, 42, 0.9) 0%, transparent 60%)' 
        }} />
        <div style={{ position: 'absolute', bottom: '1.5rem', left: '1.5rem', right: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <div>
              <p style={{ margin: 0, fontSize: '0.6rem', fontWeight: '900', color: 'rgba(255,255,255,0.6)', letterSpacing: '0.05em' }}>TOTAL CAPACITY</p>
              <p style={{ margin: 0, fontSize: '1.2rem', fontWeight: '950', color: 'white' }}>{stats.beds} Beds</p>
            </div>
            <div>
              <p style={{ margin: 0, fontSize: '0.6rem', fontWeight: '900', color: 'rgba(255,255,255,0.6)', letterSpacing: '0.05em' }}>RESIDENCY</p>
              <p style={{ margin: 0, fontSize: '1.2rem', fontWeight: '950', color: 'white' }}>{building.genderType}</p>
            </div>
          </div>
          <div style={{ padding: '0.8rem 1.2rem', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.3)', color: 'white' }}>
            <p style={{ margin: 0, fontSize: '0.6rem', fontWeight: '900', textAlign: 'center', opacity: 0.8 }}>OCCUPANCY</p>
            <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: '1000' }}>{occupancyRate}%</p>
          </div>
        </div>
      </div>

      {/* Bento Grid: Analytics & Performance */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '1rem', zIndex: 1 }}>
        {/* Financial Bento */}
        <div style={{ 
          padding: '1.5rem', borderRadius: '32px', 
          background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)', 
          color: 'white', display: 'flex', flexDirection: 'column', gap: '0.6rem' 
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Coins size={16} color="#F59E0B" />
            <span style={{ fontSize: '0.65rem', fontWeight: '950', letterSpacing: '0.1em' }}>REVENUE ENGINE</span>
          </div>
          <div>
            <h4 style={{ margin: 0, fontSize: '1.6rem', fontWeight: '1000' }}>₹{monthlyRevenue}</h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.4rem' }}>
               {[40, 60, 45, 70, 55, 80, 75].map((h, i) => (
                 <div key={i} style={{ width: '4px', height: `${h * 0.2}px`, background: i === 6 ? '#10B981' : 'rgba(255,255,255,0.2)', borderRadius: '2px' }} />
               ))}
               <p style={{ margin: 0, fontSize: '0.65rem', fontWeight: '800', color: '#10B981', display: 'flex', alignItems: 'center', gap: '0.3rem', marginLeft: '0.4rem' }}>
                <TrendingUp size={12} /> +12.4%
              </p>
            </div>
          </div>
          <div style={{ marginTop: 'auto', padding: '0.6rem', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', fontSize: '0.6rem', fontWeight: '800', textAlign: 'center' }}>
            ROI OPTIMIZED BY AI
          </div>
        </div>

        {/* Intelligence Bento */}
        <div style={{ padding: '1.5rem', borderRadius: '32px', background: 'white', border: '1px solid #F1F5F9', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: '950', color: '#0F172A' }}>Building Health</span>
            <BarChart3 size={18} color="#6366F1" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            {[
              { label: 'Hygiene Score', value: hygieneScore, color: '#10B981' },
              { label: 'Energy Efficiency', value: 82, color: '#6366F1' }
            ].map((score, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', fontWeight: '900', marginBottom: '0.3rem' }}>
                  <span style={{ color: '#64748B' }}>{score.label.toUpperCase()}</span>
                  <span style={{ color: score.color }}>{score.value}%</span>
                </div>
                <div style={{ height: '6px', background: '#F1F5F9', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${score.value}%`, background: score.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Infrastructure KPI Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.8rem', zIndex: 1 }}>
        {[
          { label: 'Power', value: 'Backup', icon: <Zap size={14} /> },
          { label: 'Water', value: '24/7', icon: <Waves size={14} /> },
          { label: 'Fire', value: 'Secure', icon: <Flame size={14} /> },
          { label: 'Lift', value: 'Smart', icon: <ArrowUp size={14} /> }
        ].map((kpi, i) => (
          <div key={i} style={{ padding: '0.8rem', background: '#F8FAFC', borderRadius: '20px', border: '1px solid #F1F5F9', textAlign: 'center' }}>
            <div style={{ color: '#6366F1', marginBottom: '0.4rem', display: 'flex', justifyContent: 'center' }}>{kpi.icon}</div>
            <p style={{ margin: 0, fontSize: '0.55rem', fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase' }}>{kpi.label}</p>
            <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: '950', color: '#1E293B' }}>{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* Security & Access Section */}
      <div style={{ padding: '1.2rem', borderRadius: '24px', background: 'rgba(99, 102, 241, 0.05)', border: '1px dashed #6366F1', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6366F1', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
            <Fingerprint size={20} />
          </div>
          <div>
            <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: '950', color: '#0F172A' }}>Smart Access System</p>
            <p style={{ margin: 0, fontSize: '0.65rem', color: '#64748B', fontWeight: '700' }}>Biometric + RFID Active</p>
          </div>
        </div>
        <ShieldCheck size={20} color="#10B981" />
      </div>

      {/* AI Insights & Badges */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', zIndex: 1 }}>
        {['Highest ROI', 'Top Rated Hygiene', 'Student Choice', 'Low Maintenance'].map(badge => (
          <span key={badge} style={{ padding: '0.4rem 0.8rem', borderRadius: '10px', background: 'white', border: '1px solid #E2E8F0', fontSize: '0.65rem', fontWeight: '800', color: '#475569', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Sparkles size={10} color="#F59E0B" /> {badge}
          </span>
        ))}
      </div>

      {/* Action Footer */}
      <div style={{ 
        marginTop: 'auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem', 
        paddingTop: '1.2rem', borderTop: '1px solid #F1F5F9', zIndex: 1 
      }}>
        <button 
          className="btn" 
          onClick={(e) => { e.stopPropagation(); onViewAnalytics(building, 'building'); }}
          style={{ 
            padding: '1.1rem', borderRadius: '22px', background: '#F8FAFC', color: '#0F172A', 
            fontWeight: '950', fontSize: '0.85rem', border: '1px solid #E2E8F0', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem' 
          }}
        >
          <BarChart3 size={18} /> Intelligence
        </button>
        <button 
          className="btn btn-primary" 
          onClick={(e) => { e.stopPropagation(); onSelect(building); }}
          style={{ 
            padding: '1.1rem', borderRadius: '22px', fontWeight: '950', fontSize: '0.85rem',
            boxShadow: '0 10px 20px rgba(99, 102, 241, 0.3)'
          }}
        >
          View Floors
        </button>
      </div>
    </motion.div>
  );
};

const BuildingsList = ({ buildings, onSelect, onAdd, onViewAnalytics }) => (
  <div>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3rem', alignItems: 'center' }}>
      <div>
        <h2 style={{ fontSize: '2.5rem', fontWeight: '1000', margin: 0, color: '#0F172A', letterSpacing: '-0.04em' }}>Property Portfolio</h2>
        <p style={{ color: '#64748B', fontSize: '1rem', fontWeight: '700' }}>Manage and monitor your smart building ecosystem.</p>
      </div>
      <button className="btn btn-primary" onClick={onAdd} style={{ padding: '1rem 2rem', borderRadius: '20px', fontWeight: '950', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.8rem', boxShadow: '0 15px 30px -5px rgba(99, 102, 241, 0.4)' }}>
        <PlusCircle size={22} /> Register Property
      </button>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(440px, 1fr))', gap: '3rem' }}>
      {buildings.length > 0 ? buildings.map((b, i) => (
        <PremiumBuildingCard key={b._id || b.id || i} building={b} onSelect={onSelect} onViewAnalytics={onViewAnalytics} />
      )) : (
        <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '6rem 3rem', background: 'rgba(255,255,255,0.5)', backdropFilter: 'blur(20px)', borderRadius: '40px', border: '2px dashed #E2E8F0' }}>
          <BuildingIcon size={64} color="#94A3B8" style={{ marginBottom: '1.5rem' }} />
          <h3 style={{ fontSize: '1.8rem', fontWeight: '900', color: '#1E293B', marginBottom: '0.5rem' }}>No Properties Registered</h3>
          <p style={{ color: '#64748B', fontWeight: '700', fontSize: '1.1rem' }}>Register your first smart building to begin administrative oversight.</p>
        </div>
      )}
    </div>
  </div>
);

const PremiumFloorCard = ({ floor, building, onSelect, onViewAnalytics }) => {
  const occupancyRate = floor.occupancyRate || 78;
  const totalRooms = floor.rooms?.length || 0;
  const totalBeds = floor.totalBeds || 48;
  
  const scores = {
    hygiene: floor.hygieneScore || 96,
    comfort: floor.comfortScore || 92,
    security: floor.securityScore || 98,
    efficiency: floor.efficiencyScore || 89
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -15, scale: 1.01 }}
      onClick={() => onSelect(floor)}
      style={{
        background: 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(30px)',
        borderRadius: '40px',
        padding: '1.5rem',
        border: '1px solid rgba(255, 255, 255, 0.4)',
        boxShadow: '0 30px 60px -12px rgba(0, 0, 0, 0.12)',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.2rem',
        cursor: 'pointer',
        overflow: 'hidden',
        minHeight: '720px',
        maxWidth: '100%'
      }}
    >
      {/* Background Neon Accent */}
      <div style={{
        position: 'absolute', top: '-100px', right: '-100px', width: '250px', height: '250px',
        background: 'radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%)',
        zIndex: 0, pointerEvents: 'none'
      }} />

      {/* Header: Visual Identity */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
              <span style={{ 
                padding: '0.4rem 0.8rem', borderRadius: '12px', background: '#0F172A', color: 'white', 
                fontSize: '0.7rem', fontWeight: '950', letterSpacing: '0.05em' 
              }}>
                LEVEL {floor.floorNumber}
              </span>
              <span style={{ padding: '0.4rem 0.8rem', borderRadius: '12px', background: '#ECFDF5', color: '#10B981', fontSize: '0.65rem', fontWeight: '900' }}>
                PREMIUM WING
              </span>
            </div>
            <h3 style={{ fontSize: '1.8rem', fontWeight: '1000', margin: 0, color: '#0F172A', letterSpacing: '-0.04em' }}>
              {building?.name} <span style={{ fontWeight: '500', color: '#64748B', fontSize: '1.2rem' }}>• Block A</span>
            </h3>
          </div>
          <div style={{ textAlign: 'right' }}>
            <Activity size={24} color="#6366F1" />
          </div>
        </div>
      </div>

      {/* Hero Visualization Area */}
      <div style={{ 
        position: 'relative', height: '240px', borderRadius: '32px', overflow: 'hidden', 
        background: '#F1F5F9', border: '1px solid rgba(255,255,255,0.8)', zIndex: 1 
      }}>
        <img 
          src={floor.images?.[0] || 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80'} 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          alt="Floor"
        />
        <div style={{ 
          position: 'absolute', inset: 0, 
          background: 'linear-gradient(to top, rgba(15, 23, 42, 0.8) 0%, transparent 60%)' 
        }} />
        <div style={{ position: 'absolute', bottom: '1.5rem', left: '1.5rem', right: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <p style={{ margin: 0, fontSize: '0.7rem', fontWeight: '900', color: 'rgba(255,255,255,0.7)', letterSpacing: '0.05em' }}>FLOOR TYPE</p>
            <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: '950', color: 'white' }}>Mixed Residency</p>
          </div>
          <div style={{ padding: '0.6rem 1rem', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.3)', color: 'white', fontSize: '0.75rem', fontWeight: '900' }}>
            {occupancyRate}% OCCUPIED
          </div>
        </div>
      </div>

      {/* Bento Grid: Intelligence & Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1rem', zIndex: 1 }}>
        {/* Occupancy Heatmap Bento */}
        <div style={{ padding: '1.5rem', borderRadius: '32px', background: 'white', border: '1px solid #F1F5F9', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: '950', color: '#0F172A' }}>Occupancy Heatmap</span>
            <UsersRound size={18} color="#6366F1" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '0.4rem' }}>
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} style={{ height: '24px', borderRadius: '6px', background: i < 8 ? '#6366F1' : '#F1F5F9' }} />
            ))}
          </div>
          <div style={{ marginTop: 'auto', display: 'flex', gap: '1.5rem' }}>
            <div>
              <p style={{ margin: 0, fontSize: '1rem', fontWeight: '1000', color: '#0F172A' }}>{totalRooms}</p>
              <p style={{ margin: 0, fontSize: '0.6rem', fontWeight: '800', color: '#94A3B8' }}>ROOMS</p>
            </div>
            <div>
              <p style={{ margin: 0, fontSize: '1rem', fontWeight: '1000', color: '#0F172A' }}>{totalBeds}</p>
              <p style={{ margin: 0, fontSize: '0.6rem', fontWeight: '800', color: '#94A3B8' }}>TOTAL BEDS</p>
            </div>
          </div>
        </div>

        {/* AI Health Bento */}
        <div style={{ 
          padding: '1.5rem', borderRadius: '32px', 
          background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)', 
          color: 'white', display: 'flex', flexDirection: 'column', gap: '0.8rem' 
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={16} color="#6366F1" />
            <span style={{ fontSize: '0.65rem', fontWeight: '950', letterSpacing: '0.1em' }}>AI INSIGHTS</span>
          </div>
          <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: '700', lineHeight: '1.4', opacity: 0.9 }}>
            "High natural light detected on East wing. Recommended for study zones."
          </p>
          <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6rem', fontWeight: '900' }}>
              <span>HYGIENE SCORE</span>
              <span style={{ color: '#10B981' }}>{scores.hygiene}%</span>
            </div>
            <div style={{ height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${scores.hygiene}%`, background: '#10B981' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Infrastructure KPI Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.8rem', zIndex: 1 }}>
        {[
          { label: 'Washrooms', value: '4 Units', icon: <Droplets size={14} /> },
          { label: 'CCTV', value: 'Active', icon: <ShieldCheck size={14} /> },
          { label: 'WiFi 6', value: 'Full', icon: <Wifi size={14} /> },
          { label: 'Lounges', value: '2 Areas', icon: <Coffee size={14} /> }
        ].map((kpi, i) => (
          <div key={i} style={{ padding: '0.8rem', background: '#F8FAFC', borderRadius: '18px', border: '1px solid #F1F5F9', textAlign: 'center' }}>
            <div style={{ color: '#6366F1', marginBottom: '0.3rem', display: 'flex', justifyContent: 'center' }}>{kpi.icon}</div>
            <p style={{ margin: 0, fontSize: '0.55rem', fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase' }}>{kpi.label}</p>
            <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: '950', color: '#1E293B' }}>{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* Quick Access Facilities */}
      <div style={{ zIndex: 1 }}>
        <p style={{ fontSize: '0.75rem', fontWeight: '950', color: '#0F172A', marginBottom: '0.8rem' }}>LIVE FACILITIES</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
          {['Laundry', 'Smart Access', 'Pantry', 'Gaming Zone', 'Study Hall'].map(f => (
            <span key={f} style={{ padding: '0.4rem 0.8rem', borderRadius: '12px', background: 'white', border: '1px solid #E2E8F0', fontSize: '0.7rem', fontWeight: '800', color: '#475569' }}>
              {f}
            </span>
          ))}
        </div>
      </div>

      {/* Action Footer */}
      <div style={{ 
        marginTop: 'auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem', 
        paddingTop: '1.2rem', borderTop: '1px solid #F1F5F9', zIndex: 1 
      }}>
        <button 
          className="btn" 
          onClick={(e) => { e.stopPropagation(); onViewAnalytics(floor, 'floor'); }}
          style={{ 
            padding: '1rem', borderRadius: '20px', background: '#F8FAFC', color: '#0F172A', 
            fontWeight: '950', fontSize: '0.85rem', border: '1px solid #E2E8F0', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem' 
          }}
        >
          <Monitor size={16} /> Intelligence
        </button>
        <button 
          className="btn btn-primary" 
          onClick={(e) => { e.stopPropagation(); onSelect(floor); }}
          style={{ 
            padding: '1rem', borderRadius: '20px', fontWeight: '950', fontSize: '0.85rem',
            boxShadow: '0 10px 20px rgba(99, 102, 241, 0.3)'
          }}
        >
          View Rooms
        </button>
      </div>
    </motion.div>
  );
};

const FloorsList = ({ floors, building, onSelect, onBack, onAdd, onViewAnalytics }) => (
  <div>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2.5rem', alignItems: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
        <motion.button whileHover={{ x: -5 }} onClick={onBack} style={{ width: '45px', height: '45px', borderRadius: '15px', background: 'white', border: '1px solid var(--border-color)', color: '#0F172A', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}><ArrowLeft size={24} /></motion.button>
        <div>
          <h2 style={{ fontSize: '2rem', fontWeight: '1000', margin: 0, letterSpacing: '-0.04em', color: '#0F172A' }}>Floors Management</h2>
          <p style={{ color: '#64748B', fontSize: '0.9rem', fontWeight: '700' }}>{building?.name} • Infrastructure Overview</p>
        </div>
      </div>
      <button className="btn btn-primary" onClick={onAdd} style={{ padding: '0.8rem 1.8rem', borderRadius: '16px', fontWeight: '950', fontSize: '1rem', boxShadow: '0 10px 15px -3px rgba(99, 102, 241, 0.3)' }}>
        <PlusCircle size={22} /> Add New Level
      </button>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(420px, 1fr))', gap: '2.5rem' }}>
      {floors.length > 0 ? floors.map((f, i) => (
        <PremiumFloorCard
          key={f._id || f.id || i}
          floor={f}
          building={building}
          onSelect={onSelect}
          onViewAnalytics={onViewAnalytics}
        />
      )) : (
        <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '2rem', background: 'var(--bg-secondary)', borderRadius: '16px', border: '2px dashed var(--border-color)' }}>
          <Layers size={32} color="var(--text-muted)" style={{ marginBottom: '0.5rem' }} />
          <p style={{ color: 'var(--text-secondary)' }}>No floors found in this building.</p>
        </div>
      )}
    </div>
  </div>
);

const RoomsList = ({ rooms, floor, building, onSelect, onBack, onAdd, onViewDetails }) => (
  <div>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', alignItems: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer' }}><ArrowLeft size={24} /></button>
        <div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: '1000', margin: 0, letterSpacing: '-0.04em', color: '#0F172A' }}>Rooms on Floor {floor?.floorNumber}</h2>
          <p style={{ color: '#64748B', fontSize: '0.9rem', fontWeight: '700' }}>{building?.name || 'Property'} • Advanced Inventory Management</p>
        </div>
      </div>
      <button className="btn btn-primary" onClick={onAdd}><PlusCircle size={18} /> Add Room</button>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '2rem' }}>
      {rooms.length > 0 ? rooms.map((r, i) => (
        <PremiumRoomCard
          key={r._id || r.id || i}
          room={r}
          floor={floor}
          onSelect={onSelect}
          onViewDetails={onViewDetails}
          onEdit={() => {}} 
        />
      )) : (
        <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '2rem', background: 'var(--bg-secondary)', borderRadius: '16px', border: '2px dashed var(--border-color)' }}>
          <DoorOpen size={32} color="var(--text-muted)" style={{ marginBottom: '0.5rem' }} />
          <p style={{ color: 'var(--text-secondary)' }}>No rooms found on this floor.</p>
        </div>
      )}
    </div>
  </div>
);

const PremiumRoomCard = ({ room, floor, onSelect, onViewDetails, onEdit }) => {
  const occupancyRate = Math.round(((room.occupied || 0) / (room.capacity || 1)) * 100);
  const isHighDemand = occupancyRate > 80;
  
  // Intelligence Metrics from dynamic data
  const scores = {
    comfort: room.comfortScore || 92,
    hygiene: room.hygieneScore || room.hygieneIndex || 98,
    safety: room.safetyScore || 96,
    environment: room.environmentScore || 88
  };

  const statusColors = {
    Available: '#10B981',
    Occupied: '#3B82F6',
    Full: '#EF4444',
    Maintenance: '#F59E0B'
  };

  const activeStatus = room.occupied === room.capacity ? 'Full' : (room.occupied > 0 ? 'Occupied' : 'Available');
  const themeColor = statusColors[activeStatus];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -15, scale: 1.01 }}
      onClick={() => onSelect(room)}
      style={{
        background: 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(30px)',
        borderRadius: '38px',
        padding: '1.5rem',
        border: '1px solid rgba(255, 255, 255, 0.4)',
        boxShadow: '0 30px 60px -12px rgba(0, 0, 0, 0.12)',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.2rem',
        cursor: 'pointer',
        overflow: 'hidden',
        minHeight: '680px',
        maxWidth: '100%'
      }}
    >
      {/* Dynamic Background Glow */}
      <div style={{
        position: 'absolute', top: '-150px', right: '-150px', width: '300px', height: '300px',
        background: `radial-gradient(circle, ${themeColor}15 0%, transparent 70%)`,
        zIndex: 0, pointerEvents: 'none'
      }} />

      {/* Header: Visual Identity */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
              <span style={{ 
                padding: '0.4rem 0.8rem', borderRadius: '12px', background: '#0F172A', color: 'white', 
                fontSize: '0.7rem', fontWeight: '950', letterSpacing: '0.05em' 
              }}>
                ROOM {room.roomNumber}
              </span>
              {isHighDemand && (
                <motion.span 
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{ padding: '0.4rem 0.8rem', borderRadius: '12px', background: '#FEF2F2', color: '#EF4444', fontSize: '0.6rem', fontWeight: '900', border: '1px solid #FEE2E2' }}
                >
                  HIGH DEMAND
                </motion.span>
              )}
            </div>
            <h3 style={{ fontSize: '1.8rem', fontWeight: '1000', margin: 0, color: '#0F172A', letterSpacing: '-0.04em' }}>
              {room.roomType} <span style={{ fontWeight: '500', color: '#64748B', fontSize: '1.2rem' }}>• Suite</span>
            </h3>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ margin: 0, fontSize: '0.65rem', fontWeight: '900', color: '#64748B', letterSpacing: '0.05em' }}>MONTHLY RENT</p>
            <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: '1000', color: themeColor }}>₹{room.rentAmount || 0}</p>
          </div>
        </div>
      </div>

      {/* Hero Image Section */}
      <div style={{ 
        position: 'relative', height: '220px', borderRadius: '28px', overflow: 'hidden', 
        background: '#F1F5F9', border: '1px solid rgba(255,255,255,0.8)', zIndex: 1 
      }}>
        <img 
          src={room.images?.[0] || 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80'} 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          alt="Room"
        />
        <div style={{ 
          position: 'absolute', bottom: '1.2rem', left: '1.2rem', 
          display: 'flex', gap: '0.5rem' 
        }}>
          {room.isAC && (
            <div style={{ padding: '0.5rem 1rem', background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(10px)', color: 'white', borderRadius: '14px', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', fontWeight: '800' }}>
              <Zap size={14} color="#F59E0B" /> Smart AC
            </div>
          )}
          <div style={{ padding: '0.5rem 1rem', background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(10px)', color: '#0F172A', borderRadius: '14px', fontSize: '0.75rem', fontWeight: '900' }}>
            Level {floor?.floorNumber || room.floorNumber || 1}
          </div>
        </div>
      </div>

      {/* Bento Section: Occupancy & Intelligence */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1rem', zIndex: 1 }}>
        {/* Occupancy Bento */}
        <div style={{ padding: '1.5rem', borderRadius: '28px', background: 'white', border: '1px solid #F1F5F9', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: '950', color: '#0F172A' }}>Occupancy</span>
              <UsersRound size={18} color={themeColor} />
            </div>
            <div style={{ height: '8px', background: '#F1F5F9', borderRadius: '4px', overflow: 'hidden', marginBottom: '0.5rem' }}>
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${occupancyRate}%` }}
                style={{ height: '100%', background: themeColor }}
              />
            </div>
            <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: '800', color: '#64748B' }}>
              {room.occupied} of {room.capacity} beds deployed
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
            {Array.from({ length: room.capacity }).map((_, i) => (
              <div key={i} style={{ width: '12px', height: '12px', borderRadius: '4px', background: i < room.occupied ? themeColor : '#F1F5F9' }} />
            ))}
          </div>
        </div>

        {/* AI Insight Bento */}
        <div style={{ 
          padding: '1.5rem', borderRadius: '28px', 
          background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)', 
          color: 'white', display: 'flex', flexDirection: 'column', gap: '0.8rem' 
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={16} color="#6366F1" />
            <span style={{ fontSize: '0.65rem', fontWeight: '950', letterSpacing: '0.1em' }}>AI INSIGHT</span>
          </div>
          <p style={{ margin: 0, fontSize: '0.8rem', fontWeight: '700', lineHeight: '1.4', opacity: 0.9 }}>
            {occupancyRate > 90 ? 'High ROI: Optimization recommended.' : 'Best for students: High natural light score.'}
          </p>
          <div style={{ marginTop: 'auto', padding: '0.4rem 0.8rem', background: 'rgba(255,255,255,0.1)', borderRadius: '10px', fontSize: '0.65rem', fontWeight: '900', textAlign: 'center' }}>
            {scores.comfort}% COMFORT
          </div>
        </div>
      </div>

      {/* Specifications Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.8rem', zIndex: 1 }}>
        {[
          { label: 'Area', value: '240 sqft', icon: <Ruler size={14} /> },
          { label: 'Views', value: 'Garden', icon: <Sun size={14} /> },
          { label: 'Privacy', value: 'High', icon: <ShieldCheck size={14} /> }
        ].map((spec, i) => (
          <div key={i} style={{ padding: '1rem', background: '#F8FAFC', borderRadius: '20px', border: '1px solid #F1F5F9' }}>
            <div style={{ color: '#6366F1', marginBottom: '0.4rem' }}>{spec.icon}</div>
            <p style={{ margin: 0, fontSize: '0.55rem', fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase' }}>{spec.label}</p>
            <p style={{ margin: 0, fontSize: '0.8rem', fontWeight: '950', color: '#1E293B' }}>{spec.value}</p>
          </div>
        ))}
      </div>

      {/* Amenities Section */}
      <div style={{ zIndex: 1 }}>
        <p style={{ fontSize: '0.75rem', fontWeight: '950', color: '#0F172A', marginBottom: '0.8rem' }}>AMENITIES</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
          {['Smart TV', 'Wi-Fi 6', 'Balcony', 'Geyser', 'Study Desk'].slice(0, 4).map(a => (
            <span key={a} style={{ padding: '0.4rem 0.8rem', borderRadius: '12px', background: 'white', border: '1px solid #E2E8F0', fontSize: '0.7rem', fontWeight: '800', color: '#475569' }}>
              {a}
            </span>
          ))}
          <span style={{ padding: '0.4rem 0.8rem', borderRadius: '12px', background: '#F1F5F9', color: '#64748B', fontSize: '0.7rem', fontWeight: '800' }}>+4 more</span>
        </div>
      </div>

      {/* AI Intelligence Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.8rem', zIndex: 1 }}>
         <div style={{ padding: '1rem', background: '#F0FDFA', borderRadius: '24px', border: '1px solid #CCFBF1' }}>
           <p style={{ margin: 0, fontSize: '0.6rem', fontWeight: '900', color: '#0F766E' }}>HYGIENE INDEX</p>
           <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.2rem' }}>
             <Sparkles size={14} color="#10B981" />
             <span style={{ fontSize: '1.1rem', fontWeight: '1000', color: '#115E59' }}>{scores.hygiene}%</span>
           </div>
         </div>
         <div style={{ padding: '1rem', background: '#F5F3FF', borderRadius: '24px', border: '1px solid #DDD6FE' }}>
           <p style={{ margin: 0, fontSize: '0.6rem', fontWeight: '900', color: '#6D28D9' }}>COMFORT SCORE</p>
           <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.2rem' }}>
             <Heart size={14} color="#7C3AED" />
             <span style={{ fontSize: '1.1rem', fontWeight: '1000', color: '#5B21B6' }}>{scores.comfort}%</span>
           </div>
         </div>
      </div>

      {/* Smart Infrastructure Badges */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', zIndex: 1 }}>
         {[
           { label: 'Smart Lock', icon: <Lock size={12} />, color: '#6366F1' },
           { label: 'RFID Access', icon: <Fingerprint size={12} />, color: '#10B981' },
           { label: 'Air Flow', icon: <Wind size={12} />, color: '#3B82F6' }
         ].map(tag => (
           <span key={tag.label} style={{ padding: '0.4rem 0.8rem', borderRadius: '10px', background: 'white', border: '1px solid #E2E8F0', fontSize: '0.65rem', fontWeight: '800', color: '#475569', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
             <span style={{ color: tag.color }}>{tag.icon}</span> {tag.label}
           </span>
         ))}
      </div>

      {/* Action Footer */}
      <div style={{ 
        marginTop: 'auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem', 
        paddingTop: '1.2rem', borderTop: '1px solid #F1F5F9', zIndex: 1 
      }}>
        <button 
          className="btn" 
          onClick={(e) => { e.stopPropagation(); onViewDetails(room, 'room'); }}
          style={{ 
            padding: '1rem', borderRadius: '18px', background: '#F8FAFC', color: '#0F172A', 
            fontWeight: '950', fontSize: '0.85rem', border: '1px solid #E2E8F0', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem' 
          }}
        >
          <Monitor size={16} /> Intelligence
        </button>
        <button 
          className="btn btn-primary" 
          onClick={(e) => { e.stopPropagation(); onSelect(room); }}
          style={{ 
            padding: '1rem', borderRadius: '18px', fontWeight: '950', fontSize: '0.85rem',
            boxShadow: `0 10px 20px ${themeColor}30`
          }}
        >
          Manage Beds
        </button>
      </div>
    </motion.div>
  );
};

const SmartBedCard = ({ bed, floor, onEdit, onViewDetails, onViewHistory, onAssign }) => {
  const isAvailable = bed.status === 'AVAILABLE';
  const isOccupied = bed.status === 'OCCUPIED';
  const isMaintenance = bed.status === 'MAINTENANCE';

  const features = {
    comfort: [
      { id: 'light', icon: <Lightbulb size={12} />, label: 'Reading Light', active: true },
      { id: 'charge', icon: <BatteryCharging size={12} />, label: 'USB Port', active: true },
      { id: 'wifi', icon: <Wifi size={12} />, label: 'Fast Wi-Fi', active: true },
      { id: 'locker', icon: <Lock size={12} />, label: 'Personal Locker', active: true }
    ],
    position: [
      { id: 'window', icon: <Sun size={12} />, label: 'Window Side', active: bed.position?.toLowerCase().includes('window') },
      { id: 'ac', icon: <Wind size={12} />, label: 'AC Vent', active: true },
      { id: 'quiet', icon: <ShieldCheck size={12} />, label: 'Quiet Zone', active: true }
    ],
    specs: [
      { label: 'Mattress', value: bed.specs?.mattress || '7" Memory Foam', icon: <Sparkles size={14} /> },
      { label: 'Capacity', value: bed.specs?.capacity || '180kg', icon: <Weight size={14} /> },
      { label: 'Material', value: bed.specs?.material || 'Teak Wood', icon: <Ruler size={14} /> }
    ],
    intelligence: {
      comfort: bed.comfortScore || 95,
      hygiene: bed.hygieneScore || 98
    }
  };

  const getStatusColor = () => {
    if (isAvailable) return '#10B981';
    if (isOccupied) return '#3B82F6';
    return '#EF4444';
  };

  const statusGlow = {
    boxShadow: `0 0 20px ${getStatusColor()}40`,
    border: `1px solid ${getStatusColor()}30`
  };

  return (
    <motion.div
      layout
      whileHover={{ y: -12 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="smart-card"
      style={{
        background: 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(20px)',
        borderRadius: '32px',
        padding: '1.2rem',
        border: '1px solid rgba(255, 255, 255, 0.4)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.08)',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        overflow: 'hidden',
        minWidth: '320px',
        transition: 'all 0.3s ease-out',
        backfaceVisibility: 'hidden',
        WebkitFontSmoothing: 'antialiased'
      }}
    >
      {/* Background Neon Accent */}
      <div style={{
        position: 'absolute',
        top: '-100px',
        right: '-100px',
        width: '200px',
        height: '200px',
        background: `radial-gradient(circle, ${getStatusColor()}15 0%, transparent 70%)`,
        pointerEvents: 'none'
      }} />

      {/* Header Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', zIndex: 1 }}>
        <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '16px',
            background: `linear-gradient(135deg, ${getStatusColor()}20, ${getStatusColor()}40)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: getStatusColor(),
            ...statusGlow
          }}>
            <BedDouble size={24} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '1000', margin: 0, color: '#0F172A', letterSpacing: '-0.03em' }}>{bed.bedNumber}</h3>
              {isAvailable && (
                <motion.div
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981' }}
                />
              )}
            </div>
            <p style={{ fontSize: '0.75rem', fontWeight: '800', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {bed.bedType} • {bed.position}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', alignItems: 'flex-end' }}>
          <span 
            className="status-pill"
            style={{
              padding: '0.4rem 0.8rem',
              borderRadius: '12px',
              fontSize: '0.65rem',
              fontWeight: '950',
              background: isAvailable ? '#ECFDF5' : isOccupied ? '#EFF6FF' : '#FEF2F2',
              color: getStatusColor(),
              border: `1px solid ${getStatusColor()}20`,
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              whiteSpace: 'nowrap',
              cursor: 'default'
            }}
          >
            {isAvailable ? <Sparkles size={12} /> : isOccupied ? <UserCheck size={12} /> : <Wrench size={12} />}
            {bed.status}
          </span>
          <div style={{ display: 'flex', gap: '0.3rem' }}>
            <button 
              onClick={() => onEdit(bed)}
              style={{
                width: '32px', height: '32px', borderRadius: '10px', background: 'white',
                border: '1px solid #E2E8F0', color: '#64748B', display: 'flex',
                alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <Edit2 size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Hero Image Section */}
      <div style={{ position: 'relative', height: '160px', borderRadius: '24px', overflow: 'hidden' }}>
        <img 
          src={bed.images?.[0] || 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80'} 
          alt="Bed"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.6) 100%)'
        }} />
        
        {/* AI Insight Badge */}
        <div style={{
          position: 'absolute',
          bottom: '12px',
          left: '12px',
          background: 'rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(12px)',
          padding: '0.4rem 0.8rem',
          borderRadius: '12px',
          border: '1px solid rgba(255,255,255,0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          color: 'white',
          fontSize: '0.7rem',
          fontWeight: '800'
        }}>
          <Sparkles size={14} color="#FCD34D" fill="#FCD34D" />
          AI RECOMMENDED
        </div>
        <div style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          background: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(8px)',
          padding: '0.4rem 0.8rem',
          borderRadius: '10px',
          color: 'white',
          fontSize: '0.65rem',
          fontWeight: '900',
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          FLOOR {floor?.floorNumber || '01'}
        </div>
      </div>

      {/* Bento Grid Content */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
        {/* Specifications */}
        <div className="bento-item" style={{
          background: 'rgba(248, 250, 252, 0.8)',
          padding: '1rem',
          borderRadius: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.6rem',
          transition: 'all 0.3s ease'
        }}>
          <h4 style={{ fontSize: '0.65rem', fontWeight: '900', color: '#94A3B8', margin: 0, letterSpacing: '0.05em' }}>SPECS</h4>
          {features.specs.map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ color: '#6366F1' }}>{s.icon}</div>
              <div style={{ lineHeight: 1 }}>
                <p style={{ fontSize: '0.8rem', fontWeight: '800', color: '#1E293B', margin: 0 }}>{s.value}</p>
                <p style={{ fontSize: '0.6rem', color: '#64748B', margin: 0, fontWeight: '700' }}>{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Comfort Score */}
        <div className="bento-item" style={{
          background: 'rgba(248, 250, 252, 0.8)',
          padding: '1rem',
          borderRadius: '20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          position: 'relative',
          transition: 'all 0.3s ease'
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: `conic-gradient(#6366F1 ${features.intelligence.comfort}%, #E2E8F0 0)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '0.5rem'
          }}>
            <div style={{
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              background: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1rem',
              fontWeight: '1000',
              color: '#1E293B'
            }}>{(features.intelligence.comfort / 10).toFixed(1)}</div>
          </div>
          <p style={{ fontSize: '0.65rem', fontWeight: '900', color: '#64748B', margin: 0 }}>COMFORT SCORE</p>
        </div>

        {/* Smart Features */}
        <div className="bento-item" style={{
          gridColumn: 'span 2',
          background: 'rgba(248, 250, 252, 0.8)',
          padding: '1rem',
          borderRadius: '20px',
          transition: 'all 0.3s ease'
        }}>
          <h4 style={{ fontSize: '0.65rem', fontWeight: '900', color: '#94A3B8', margin: '0 0 0.8rem 0', letterSpacing: '0.05em' }}>SMART FEATURES</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
            {features.comfort.map(f => (
              <div key={f.id} style={{
                padding: '0.4rem 0.6rem',
                borderRadius: '10px',
                background: 'white',
                border: '1px solid #E2E8F0',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.7rem',
                fontWeight: '800',
                color: '#475569'
              }}>
                <span style={{ color: '#6366F1' }}>{f.icon}</span>
                {f.label}
              </div>
            ))}
          </div>
        </div>

        {/* Climate & Flow */}
        <div className="bento-item" style={{
          gridColumn: 'span 2',
          background: 'rgba(99, 102, 241, 0.05)',
          padding: '0.8rem 1rem',
          borderRadius: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          transition: 'all 0.3s ease'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <div style={{ color: '#6366F1' }}><Wind size={20} /></div>
            <div>
              <p style={{ fontSize: '0.85rem', fontWeight: '900', color: '#1E293B', margin: 0 }}>Optimal Airflow</p>
              <p style={{ fontSize: '0.65rem', color: '#64748B', margin: 0, fontWeight: '700' }}>Direct vent access available</p>
            </div>
          </div>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
            style={{ color: '#6366F1', opacity: 0.5 }}
          >
            <Fan size={24} />
          </motion.div>
        </div>

        {/* Hygiene & Comfort Badge */}
        <div className="bento-item" style={{
          gridColumn: 'span 2',
          padding: '1rem',
          borderRadius: '20px',
          background: '#ECFDF5',
          border: '1px solid #10B98120',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          transition: 'all 0.3s ease'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '12px', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10B981', boxShadow: '0 4px 10px rgba(0,0,0,0.03)' }}>
              <Sparkles size={18} />
            </div>
            <div>
              <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: '950', color: '#065F46' }}>Hygiene Seal</p>
              <p style={{ margin: 0, fontSize: '0.65rem', color: '#047857', fontWeight: '700' }}>Last Sanitized: 2h ago</p>
            </div>
          </div>
          <ShieldCheck size={20} color="#10B981" />
        </div>
      </div>

      {/* Tenant Section (If occupied) */}
      {bed.tenant && (
        <div style={{
          marginTop: '0.4rem',
          padding: '0.8rem',
          borderRadius: '20px',
          background: 'rgba(15, 23, 42, 0.03)',
          border: '1px dashed #CBD5E1',
          display: 'flex',
          alignItems: 'center',
          gap: '0.8rem'
        }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#6366F1', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: '900' }}>
            {typeof bed.tenant === 'object' ? bed.tenant.name?.[0] : bed.tenant?.[0]}
          </div>
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <p style={{ fontSize: '0.8rem', fontWeight: '900', color: '#1E293B', margin: 0, textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
              {typeof bed.tenant === 'object' ? bed.tenant.name : bed.tenant}
            </p>
            <p style={{ fontSize: '0.65rem', color: '#64748B', margin: 0, fontWeight: '700' }}>Verified Tenant</p>
          </div>
          <div style={{ color: '#10B981' }}><ShieldCheck size={18} /></div>
        </div>
      )}

      {/* Footer Actions */}
      <div style={{ display: 'flex', gap: '0.6rem', marginTop: 'auto' }}>
        {(isAvailable || isOccupied) && (
          <motion.button 
            whileHover={{ scale: 1.05, background: isOccupied ? '#2563EB' : '#059669' }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => { e.stopPropagation(); onAssign(bed); }}
            style={{
              flex: 1,
              padding: '0.8rem',
              borderRadius: '14px',
              background: isOccupied ? '#3B82F6' : '#10B981',
              color: 'white',
              border: 'none',
              fontSize: '0.8rem',
              fontWeight: '950',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.6rem',
              boxShadow: isOccupied ? '0 10px 15px -3px rgba(59, 130, 246, 0.3)' : '0 10px 15px -3px rgba(16, 185, 129, 0.3)'
            }}
          >
            <UserCheck size={16} /> {isOccupied ? 'Reassign' : 'Assign'}
          </motion.button>
        )}
        <motion.button 
          whileHover={{ scale: 1.05, background: '#1E293B' }}
          whileTap={{ scale: 0.95 }}
          onClick={(e) => { e.stopPropagation(); onViewDetails(bed, 'bed'); }}
          style={{
            flex: isAvailable ? 'none' : 1,
            width: isAvailable ? '45px' : 'auto',
            padding: '0.8rem',
            borderRadius: '14px',
            background: '#0F172A',
            color: 'white',
            border: 'none',
            fontSize: '0.8rem',
            fontWeight: '900',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.6rem'
          }}
        >
          <Activity size={16} /> {!isAvailable && 'Intelligence'}
        </motion.button>
        <motion.button 
          whileHover={{ scale: 1.1, background: '#E2E8F0' }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => { e.stopPropagation(); onViewHistory(bed); }}
          style={{
            width: '45px',
            height: '45px',
            borderRadius: '14px',
            background: '#F1F5F9',
            border: 'none',
            color: '#64748B',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <History size={18} />
        </motion.button>
      </div>
    </motion.div>
  );
};

const BedsList = ({ beds, room, floor, building, onBack, onAdd, onEditBed, onViewDetails, onViewHistory, onAssignTenant }) => {
  const [activeFilter, setActiveFilter] = useState('All Beds');

  const filteredBeds = beds.filter(b => {
    if (activeFilter === 'All Beds') return true;
    if (activeFilter === 'Lower Bunk') return b.bedType === 'Lower Bunk';
    if (activeFilter === 'Upper Bunk') return b.bedType === 'Upper Bunk';
    if (activeFilter === 'Window Side') return b.position?.toLowerCase().includes('window');
    if (activeFilter === 'Budget') return (b.price || 8500) < 9000;
    if (activeFilter === 'Premium') return (b.price || 8500) >= 9000;
    return true;
  });

  return (
  <div>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2.5rem', alignItems: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
        <motion.button 
          whileHover={{ x: -5 }}
          onClick={onBack} 
          style={{ 
            width: '45px', height: '45px', borderRadius: '15px', 
            background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', 
            color: 'var(--text-primary)', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}
        >
          <ArrowLeft size={24} />
        </motion.button>
        <div>
          <h2 style={{ fontSize: '2rem', fontWeight: '1000', margin: 0, letterSpacing: '-0.04em', color: '#0F172A' }}>Room {room?.roomNumber}</h2>
          <p style={{ color: '#64748B', fontSize: '0.9rem', fontWeight: '700' }}>{building?.name} • Floor {floor?.floorNumber || 'N/A'} • Smart Bed Management</p>
        </div>
      </div>
      <button className="btn btn-primary" onClick={onAdd} style={{ padding: '0.8rem 1.8rem', borderRadius: '16px', fontWeight: '950', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.8rem', boxShadow: '0 10px 15px -3px rgba(99, 102, 241, 0.3)' }}>
        <PlusCircle size={22} /> Deploy New Bed
      </button>
    </div>

    {/* Filter Chips Bar */}
    <div style={{ display: 'flex', gap: '0.8rem', marginBottom: '2.5rem', overflowX: 'auto', paddingBottom: '0.5rem', scrollbarWidth: 'none' }}>
      {['All Beds', 'Lower Bunk', 'Upper Bunk', 'Window Side', 'Budget', 'Premium'].map((f) => (
        <button 
          key={f} 
          onClick={() => setActiveFilter(f)}
          style={{
            padding: '0.7rem 1.4rem',
            borderRadius: '16px',
            background: activeFilter === f ? '#0F172A' : 'white',
            color: activeFilter === f ? 'white' : '#475569',
            border: '1px solid #E2E8F0',
            fontSize: '0.85rem',
            fontWeight: '950',
            whiteSpace: 'nowrap',
            cursor: 'pointer',
            transition: 'all 0.2s',
            boxShadow: activeFilter === f ? '0 10px 15px -3px rgba(15, 23, 42, 0.2)' : 'none'
          }}
        >
          {f}
        </button>
      ))}
    </div>

    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', 
      gap: '2rem'
    }}>
      {filteredBeds.length > 0 ? filteredBeds.map(b => (
        <SmartBedCard 
          key={b.id} 
          bed={b} 
          floor={floor}
          onEdit={onEditBed} 
          onViewDetails={onViewDetails}
          onViewHistory={onViewHistory}
          onAssign={onAssignTenant} 
        />
      )) : (
        <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '5rem 2rem', background: 'rgba(255,255,255,0.5)', backdropFilter: 'blur(10px)', borderRadius: '32px', border: '2px dashed #E2E8F0' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
            <Bed size={40} color="#94A3B8" />
          </div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '900', color: '#1E293B', marginBottom: '0.5rem' }}>No Beds Configured</h3>
          <p style={{ color: '#64748B', fontWeight: '700' }}>Deploy your first smart bed to this room to begin management.</p>
        </div>
      )}
    </div>
  </div>
  );
};

const AssignFloors = ({ buildings, onBack }) => {
  const [hostels, setHostels] = useState([]);
  const [selectedHostel, setSelectedHostel] = useState('');
  const [selectedBuilding, setSelectedBuilding] = useState('');
  const [floors, setFloors] = useState([]);
  const [assignedFloors, setAssignedFloors] = useState(new Set());

  useEffect(() => {
    api.getHostels().then(setHostels);
  }, []);

  useEffect(() => {
    if (selectedBuilding) {
      api.getFloors(selectedBuilding).then(setFloors);
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFloors([]);
    }
  }, [selectedBuilding]);

  useEffect(() => {
    if (selectedHostel) {
      api.getAssignedFloors(selectedHostel).then(fIds => setAssignedFloors(new Set(fIds || [])));
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAssignedFloors(new Set());
    }
  }, [selectedHostel]);

  const toggleFloor = (floorId) => {
    const newSet = new Set(assignedFloors);
    if (newSet.has(floorId)) newSet.delete(floorId);
    else newSet.add(floorId);
    setAssignedFloors(newSet);
  };

  const handleSave = () => {
    alert("Saved assignments: " + Array.from(assignedFloors).join(', '));
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer' }}><ArrowLeft size={24} /></button>
        <h2 style={{ fontSize: '1.8rem', fontWeight: '800' }}>Assign Floors to Hostel</h2>
      </div>

      <div className="card" style={{ padding: '2rem', maxWidth: '800px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Select Hostel</label>
            <select value={selectedHostel} onChange={e => setSelectedHostel(e.target.value)} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}>
              <option value="">-- Choose a Hostel --</option>
              {hostels.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Select Building</label>
            <select value={selectedBuilding} onChange={e => setSelectedBuilding(e.target.value)} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}>
              <option value="">-- Choose a Building --</option>
              {buildings.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </div>
        </div>

        {selectedHostel && selectedBuilding && (
          <div style={{ marginTop: '2rem', borderTop: '1px solid var(--border-color)', paddingTop: '2rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '1rem' }}>Available Floors</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {floors.map(f => (
                <div key={f.id} onClick={() => toggleFloor(f.id)} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', borderRadius: '8px', background: assignedFloors.has(f.id) ? 'rgba(99, 102, 241, 0.1)' : 'var(--bg-tertiary)', border: `1px solid ${assignedFloors.has(f.id) ? 'var(--accent-primary)' : 'var(--border-color)'}`, cursor: 'pointer', transition: 'all 0.2s' }}>
                  {assignedFloors.has(f.id) ? <CheckSquare color="var(--accent-primary)" /> : <Square color="var(--text-secondary)" />}
                  <span style={{ fontSize: '1.1rem', fontWeight: '600' }}>Floor {f.floorNumber}</span>
                </div>
              ))}
              {floors.length === 0 && <p style={{ color: 'var(--text-muted)' }}>No floors available in this building.</p>}
            </div>

            <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn btn-primary" onClick={handleSave} disabled={floors.length === 0}>Save Assignments</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Buildings;
