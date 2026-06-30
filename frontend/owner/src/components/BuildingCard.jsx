import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, AlertCircle, MapPin, Edit2, ShieldCheck, Shield, Heart, Zap, Shirt, ClipboardList, Dumbbell, Car, BookOpen, Utensils, Star, CheckCircle, X, UsersRound, ChevronLeft, ChevronRight, Search, Clock } from 'lucide-react';
import { api } from '../api';
import { createPortal } from 'react-dom';

const AMENITY_ICONS = {
  'Security': <ShieldCheck size={14} />, 'CCTV': <Shield size={14} />, 'Medical Support': <Heart size={14} />,
  'Power Backup': <Zap size={14} />, 'Laundry': <Shirt size={14} />, 'Housekeeping': <ClipboardList size={14} />,
  'Gym': <Dumbbell size={14} />, 'Parking': <Car size={14} />, 'Library': <BookOpen size={14} />,
  'Mess': <Utensils size={14} />
};

const BuildingCard = ({ building, onNavigate, onRefresh, onImageClick, onResubmit, onEdit }) => {
  const [imgIdx, setImgIdx] = useState(0);
  const [showAllAmenities, setShowAllAmenities] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const isPending = building.status === 'Pending Approval' || building.status === 'Pending' || building.approvalStatus === 'pending';
  const isRejected = building.status === 'Rejected' || building.approvalStatus === 'rejected';
  const isApproved = building.approvalStatus === 'approved' && building.isApproved;

  const displayAmenities = useMemo(() => {
    let amens = building.amenities || [];
    if (!Array.isArray(amens)) amens = [amens];
    
    let parsedAmens = [];
    amens.forEach(a => {
      if (typeof a === 'string') {
        if (a.includes(',')) {
          parsedAmens.push(...a.split(',').map(s => s.trim()));
        } else {
          parsedAmens.push(a.trim());
        }
      }
    });

    parsedAmens = parsedAmens.filter(a => a && a !== '');
    if (parsedAmens.length === 0) {
      parsedAmens = ['Security', 'CCTV', 'Parking', 'Power Backup', 'Mess'];
    }
    return [...new Set(parsedAmens)];
  }, [building.amenities]);

  const images = useMemo(() => {
    const baseServerUrl = (import.meta.env.VITE_API_URL || 'https://livora-hostel-hub-1.onrender.com/api').replace('/api', '');
    if (building.images && Array.isArray(building.images)) {
      const validImages = building.images.filter(img => typeof img === 'string' && img.trim().length > 0 && img !== '[object Object]');
      if (validImages.length > 0) {
        return validImages.map(img => {
          if (img.startsWith('http') || img.startsWith('data:')) return img;
          const separator = img.startsWith('/') ? '' : '/';
          return `${baseServerUrl}${separator}${img}`;
        });
      }
    }
    return [
      'https://images.unsplash.com/photo-1555854817-5b2260d50c63?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1522770179533-24471fcdba45?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&q=80&w=800'
    ];
  }, [building.images]);

  useEffect(() => {
    const timer = setInterval(() => {
      setImgIdx(prev => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -10, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)' }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="property-card-premium"
        style={{
          padding: 0,
          overflow: 'hidden',
          position: 'relative',
          borderRadius: '28px',
          border: '1.5px solid #F1F5F9',
          background: "var(--bg-card)",
          height: '100%',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <div style={{ height: '220px', position: 'relative', overflow: 'hidden' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={imgIdx}
              initial={{ opacity: 0.8, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              style={{
                height: '100%',
                width: '100%',
                backgroundImage: `url("${images[imgIdx]}")`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundColor: '#F1F5F9'
              }}
            />
          </AnimatePresence>

          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.4) 60%, rgba(0,0,0,0.8) 100%)' }} />

          {images.length > 1 && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 0.5rem', zIndex: 10 }}>
              <button onClick={(e) => { e.stopPropagation(); setImgIdx(prev => (prev - 1 + images.length) % images.length); }} style={{ background: 'rgba(255,255,255,0.7)', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', backdropFilter: 'blur(4px)', color: '#1E293B' }}>
                <ChevronLeft size={20} />
              </button>
              <button onClick={(e) => { e.stopPropagation(); setImgIdx(prev => (prev + 1) % images.length); }} style={{ background: 'rgba(255,255,255,0.7)', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', backdropFilter: 'blur(4px)', color: '#1E293B' }}>
                <ChevronRight size={20} />
              </button>
            </div>
          )}

          {onImageClick && (
            <button
              onClick={(e) => { e.stopPropagation(); onImageClick(images[imgIdx]); }}
              style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', zIndex: 10, background: 'rgba(255,255,255,0.7)', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'zoom-in', backdropFilter: 'blur(4px)', color: '#1E293B' }}
              title="View Full Image"
            >
              <Search size={16} />
            </button>
          )}


          <div style={{ position: 'absolute', bottom: '1.25rem', left: '1.25rem', right: '1.25rem', zIndex: 5 }}>
            <h3 style={{ fontSize: '1.8rem', fontWeight: '950', color: "var(--text-on-primary)", textShadow: '0 2px 8px rgba(0,0,0,0.4)', margin: 0, letterSpacing: '-0.02em' }}>{building.buildingName || building.name}</h3>
          </div>

          {/* Pending Approval badge on image */}
          {isPending && (
            <div style={{
              position: 'absolute', top: '1rem', left: '1rem', zIndex: 15,
              background: 'rgba(245, 158, 11, 0.95)', backdropFilter: 'blur(8px)',
              borderRadius: '12px', padding: '0.4rem 0.8rem',
              display: 'flex', alignItems: 'center', gap: '0.4rem',
              boxShadow: '0 4px 12px rgba(245, 158, 11, 0.4)',
              animation: 'pulse 2s infinite'
            }}>
              <Clock size={13} color="#FFFFFF" />
              <span style={{ fontSize: '0.72rem', fontWeight: '900', color: '#FFFFFF', letterSpacing: '0.04em' }}>PENDING APPROVAL</span>
            </div>
          )}
        </div>

        <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.2rem' }}>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: '0.85rem', color: '#64748B', margin: '0 0 1rem 0', fontWeight: '600' }}>
                <MapPin size={14} style={{ verticalAlign: 'text-bottom', marginRight: '6px', color: '#EF4444' }} />
                {building.address || 'Address not set'}
              </p>

              
              <div style={{ display: 'flex', gap: '0.8rem', fontSize: '0.85rem', fontWeight: '700', color: '#475569', flexWrap: 'wrap' }}>
                 <span>{building.totalFloors || 0} Floors</span>
                 <span style={{ color: '#CBD5E1' }}>•</span>
                 <span>{building.totalRooms || 0} Rooms</span>
                 <span style={{ color: '#CBD5E1' }}>•</span>
                 <span>{building.totalBeds || 0} Beds</span>
              </div>
            </div>
          </div>

          <div style={{ padding: '1rem', borderRadius: '16px', background: '#F8FAFC', border: '1.5px solid #F1F5F9', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.85rem', color: '#475569', fontWeight: '800' }}>Occupancy</span>
              <span style={{ fontSize: '0.85rem', fontWeight: '900', color: (building.occupancyPercentage || 0) > 80 ? '#10B981' : (building.occupancyPercentage || 0) > 50 ? '#F59E0B' : '#EF4444' }}>{building.occupancyPercentage || 0}%</span>
            </div>
            <div style={{ width: '100%', height: '8px', background: '#E2E8F0', borderRadius: '4px', overflow: 'hidden', marginBottom: '1rem' }}>
              <div style={{ width: `${building.occupancyPercentage || 0}%`, height: '100%', background: (building.occupancyPercentage || 0) > 80 ? '#10B981' : (building.occupancyPercentage || 0) > 50 ? '#F59E0B' : '#EF4444', borderRadius: '4px', transition: 'width 1s ease-in-out' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#1E293B' }}>{building.occupiedBeds || Math.round(((building.occupancyPercentage || 0) / 100) * (building.totalBeds || 0))} Occupied <span style={{ margin: '0 0.4rem', color: '#CBD5E1' }}>•</span> {building.vacantBeds || ((building.totalBeds || 0) - Math.round(((building.occupancyPercentage || 0) / 100) * (building.totalBeds || 0)))} Vacant</span>
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem', position: 'relative' }}>
            <div style={{ display: 'flex', flexWrap: 'nowrap', gap: '0.5rem', overflow: 'hidden' }}>
              {displayAmenities.slice(0, 2).map((feat, fidx) => (
                <div
                  key={fidx}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.4rem',
                    padding: '0.4rem 0.8rem', borderRadius: '10px',
                    background: "var(--bg-card)", border: '1.5px solid #F1F5F9',
                    fontSize: '0.75rem', fontWeight: '800', color: '#475569', whiteSpace: 'nowrap', flexShrink: 1, overflow: 'hidden', textOverflow: 'ellipsis'
                  }}
                >
                  <span style={{ color: 'var(--accent-primary)', display: 'flex', alignItems: 'center' }}>
                    {AMENITY_ICONS[feat] || <Star size={14} />}
                  </span>
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{feat}</span>
                </div>
              ))}
              {displayAmenities.length > 2 && (
                <div 
                  onClick={(e) => { e.stopPropagation(); setShowAllAmenities(!showAllAmenities); }}
                  style={{ padding: '0.4rem', fontSize: '0.75rem', fontWeight: '900', color: 'var(--accent-primary)', alignSelf: 'center', cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0 }}
                >
                  {displayAmenities.length} view
                </div>
              )}
            </div>

            <AnimatePresence>
              {showAllAmenities && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  style={{
                    position: 'absolute', bottom: '100%', left: '-10px', right: '-10px',
                    background: '#FFFFFF', padding: '1.25rem', borderRadius: '20px',
                    boxShadow: '0 15px 35px rgba(0,0,0,0.2), 0 5px 15px rgba(0,0,0,0.1)', border: '1px solid #E2E8F0',
                    zIndex: 20, marginBottom: '0.8rem', display: 'flex', flexWrap: 'wrap', gap: '0.6rem'
                  }}
                >
                  <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: '900', color: '#1E293B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>All Amenities</span>
                    <button onClick={(e) => { e.stopPropagation(); setShowAllAmenities(false); }} style={{ background: '#F1F5F9', border: 'none', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748B' }}><X size={16}/></button>
                  </div>
                  {displayAmenities.map((feat, fidx) => (
                    <div key={`pop-${fidx}`} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.9rem', borderRadius: '10px', background: '#F8FAFC', border: '1px solid #F1F5F9', fontSize: '0.85rem', fontWeight: '800', color: '#334155' }}>
                      <span style={{ color: 'var(--accent-primary)', display: 'flex', alignItems: 'center' }}>
                        {AMENITY_ICONS[feat] || <Star size={14} />}
                      </span>
                      {feat}
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {isRejected && building.rejectionReason && (
            <div style={{
              background: '#FEF2F2',
              border: '1.5px solid #FEE2E2',
              borderRadius: '16px',
              padding: '0.8rem 1rem',
              marginBottom: '1.2rem',
              display: 'flex',
              gap: '0.5rem',
              alignItems: 'flex-start'
            }}>
              <AlertCircle size={16} color="#EF4444" style={{ marginTop: '2px', flexShrink: 0 }} />
              <div>
                <p style={{ margin: 0, fontSize: '0.7rem', fontWeight: '850', color: '#991B1B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Rejection Reason</p>
                <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.8rem', fontWeight: '600', color: '#EF4444', lineHeight: 1.4 }}>{building.rejectionReason}</p>
              </div>
            </div>
          )}

          <div style={{ marginTop: 'auto', display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
            {isPending ? (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <button
                  disabled
                  style={{
                    flex: 1,
                    padding: '0.9rem',
                    borderRadius: '16px',
                    fontSize: '0.9rem',
                    fontWeight: '900',
                    background: 'linear-gradient(135deg, #FEF3C7, #FDE68A)',
                    color: '#92400E',
                    border: '2px solid #FCD34D',
                    cursor: 'not-allowed',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                    transition: 'all 0.2s'
                  }}
                >
                  <Clock size={16} />
                  Pending Admin Approval
                </button>
                <p style={{ margin: 0, fontSize: '0.72rem', color: '#92400E', textAlign: 'center', fontWeight: '600' }}>
                  You can add floors &amp; rooms after approval
                </p>
              </div>
            ) : isRejected ? (
              <button
                style={{
                  flex: 1,
                  padding: '0.9rem',
                  borderRadius: '16px',
                  fontSize: '0.9rem',
                  fontWeight: '900',
                  background: 'linear-gradient(135deg, #F59E0B, #D97706)',
                  color: "#FFFFFF",
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: '0 4px 12px rgba(245, 158, 11, 0.2)'
                }}
                onClick={(e) => { e.stopPropagation(); if (onResubmit) onResubmit(building.id); }}
                onMouseEnter={(e) => e.target.style.filter = 'brightness(1.1)'}
                onMouseLeave={(e) => e.target.style.filter = 'none'}
              >
                Resubmit for Approval
              </button>
            ) : (
              <div style={{ display: 'flex', gap: '0.8rem', flex: 1 }}>
                <button
                  style={{
                    flex: 1,
                    padding: '0.9rem',
                    borderRadius: '16px',
                    fontSize: '0.9rem',
                    fontWeight: '900',
                    background: 'linear-gradient(135deg, var(--accent-primary), #4F46E5)',
                    color: "var(--text-on-primary)",
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    boxShadow: '0 4px 12px rgba(79, 70, 229, 0.2)'
                  }}
                  onClick={(e) => { e.stopPropagation(); if (onNavigate) onNavigate(); }}
                  onMouseEnter={(e) => e.target.style.filter = 'brightness(1.1)'}
                  onMouseLeave={(e) => e.target.style.filter = 'none'}
                >
                  Manage Building
                </button>
                <button
                  style={{
                    padding: '0.9rem',
                    borderRadius: '16px',
                    fontSize: '0.9rem',
                    fontWeight: '900',
                    background: '#F1F5F9',
                    color: "#475569",
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onClick={(e) => { e.stopPropagation(); if (onEdit) onEdit(building.id); }}
                  onMouseEnter={(e) => e.target.style.background = '#E2E8F0'}
                  onMouseLeave={(e) => e.target.style.background = '#F1F5F9'}
                  title="Edit Features"
                >
                  Edit
                </button>
              </div>
            )}
            <button
              style={{
                width: '48px',
                height: '48px',
                padding: 0,
                borderRadius: '16px',
                background: '#FEE2E2',
                border: 'none',
                color: '#EF4444',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
              onClick={(e) => { e.stopPropagation(); setShowDeleteModal(true); }}
              title="Delete Building"
            >
              <Trash2 size={20} />
            </button>
          </div>
        </div>
      </motion.div>

      {showDeleteModal && createPortal(
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            position: 'fixed', inset: 0, zIndex: 99999,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '1rem'
          }}
        >
          <div
            onClick={() => setShowDeleteModal(false)}
            style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
          />

          <div style={{
            position: 'relative', zIndex: 1,
            background: 'var(--bg-primary, #ffffff)',
            borderRadius: '24px',
            padding: 'clamp(1.5rem, 5vw, 2.5rem)',
            width: '100%', maxWidth: '440px',
            border: '1px solid rgba(239,68,68,0.2)',
            boxShadow: '0 32px 64px -12px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)'
          }}>

            <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'linear-gradient(135deg, #FEE2E2, #FECACA)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', boxShadow: '0 8px 20px rgba(239,68,68,0.25)' }}>
              <Trash2 size={30} color="#EF4444" />
            </div>

            <h2 style={{ textAlign: 'center', fontSize: 'clamp(1.2rem, 4vw, 1.5rem)', fontWeight: '900', margin: '0 0 0.4rem', color: 'var(--text-primary, #111)' }}>
              Delete Property?
            </h2>
            <p style={{ textAlign: 'center', color: 'var(--text-secondary, #555)', fontSize: '0.9rem', margin: '0 0 1rem' }}>
              You are about to permanently delete
            </p>

            <p style={{ textAlign: 'center', fontWeight: '800', fontSize: '1rem', color: 'var(--text-primary, #111)', margin: '0 0 1.2rem', background: 'var(--bg-tertiary, #f5f5f5)', padding: '0.6rem 1rem', borderRadius: '12px', border: '1px solid var(--border-color, #e5e7eb)' }}>
              {building.buildingName || building.name}
            </p>

            <p style={{ textAlign: 'center', color: '#DC2626', fontSize: '0.8rem', fontWeight: '700', margin: '0 0 2rem', padding: '0.75rem 1rem', background: '#FFF1F2', borderRadius: '10px', border: '1px solid #FECACA', lineHeight: 1.6 }}>
              This action is <strong>irreversible</strong>. All associated rooms, beds, and tenant records will be permanently removed.
            </p>

            {deleteError && (
              <div style={{ marginBottom: '1.5rem', padding: '0.8rem', borderRadius: '12px', background: '#FEF2F2', border: '1px solid #FEE2E2', color: '#B91C1C', fontSize: '0.8rem', fontWeight: '700', textAlign: 'center' }}>
                {deleteError}
              </div>
            )}

            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => setShowDeleteModal(false)}
                style={{ flex: 1, minWidth: '120px', padding: '0.9rem', borderRadius: '12px', background: 'var(--bg-tertiary, #f5f5f5)', border: '1px solid var(--border-color, #e5e7eb)', color: 'var(--text-primary, #111)', fontWeight: '800', cursor: 'pointer', fontSize: '0.95rem', transition: 'all 0.2s' }}
              >
                Cancel
              </button>
              <button
                disabled={isDeleting}
                onClick={async () => {
                  setIsDeleting(true);
                  try {
                    await api.deleteBuilding(building.id);
                    setShowDeleteModal(false);
                    if (onRefresh) onRefresh();
                  } catch (err) {
                    console.error('Delete failed:', err);
                    setDeleteError(err.response?.data?.error || 'Failed to delete property. Server connection issue.');
                    setIsDeleting(false);
                  }
                }}
                style={{ flex: 1, minWidth: '120px', padding: '0.9rem', borderRadius: '12px', background: isDeleting ? '#FCA5A5' : 'linear-gradient(135deg, #EF4444, #DC2626)', border: 'none', color: "var(--text-on-primary)", fontWeight: '900', cursor: isDeleting ? 'not-allowed' : 'pointer', fontSize: '0.95rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', boxShadow: isDeleting ? 'none' : '0 4px 14px rgba(239,68,68,0.4)', transition: 'all 0.2s' }}
              >
                {isDeleting ? 'Deleting...' : <><Trash2 size={16} /> Delete Forever</>}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default BuildingCard;
