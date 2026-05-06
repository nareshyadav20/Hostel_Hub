import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { MOCK_HOSTELS } from '../utils/mockData';

const Listing = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [selectedBedId, setSelectedBedId] = useState('A');
  const [selectedPlanIdx, setSelectedPlanIdx] = useState(1);
  const [hostel, setHostel] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock Bed Data for Interactive Layout
  const roomBeds = [
    { id: 'A', status: 'available', features: ['Near window 🌤', 'Charging socket 🔌', 'Study lamp 💡'], distance: '5 steps to bathroom 🚿', recommended: true },
    { id: 'B', status: 'booked', features: ['Near window 🌤', 'Charging socket 🔌', 'Study lamp 💡'], distance: '5 steps to bathroom 🚿', recommended: false },
    { id: 'C', status: 'available', features: ['Near door 🚪', 'Easy access 🏃', 'Charging socket 🔌'], distance: '2 steps to bathroom 🚿', recommended: false },
    { id: 'D', status: 'available', features: ['Near bathroom 🚿', 'Charging socket 🔌', 'Study lamp 💡'], distance: '1 step to bathroom 🚿', recommended: false }
  ];

  useEffect(() => {
    const fetchHostelDetails = async () => {
      if (!id || id === 'undefined' || id === 'null') {
        setLoading(false);
        return;
      }
      try {
        const response = await API.get(`/buildings/${id}`);
        const b = response.data;

        const mapped = {
          id: b._id,
          name: b.name || "Alpha Tower Residence",
          location: b.address || "Koramangala, Bengaluru",
          price: 16700,
          deposit: 33400,
          rating: b.rating || 4.8,
          reviews: 124,
          plans: [
            { name: 'Basic', price: 500, desc: 'Breakfast only', items: ['Tea/Coffee', '1 Breakfast Dish'] },
            { name: 'Standard', price: 1000, desc: 'Breakfast & Dinner', items: ['Tea/Coffee', 'Breakfast', 'Full Veg Thali Dinner'] },
            { name: 'Premium', price: 1500, desc: 'All 3 Meals + Weekend Special', items: ['All Meals', 'Evening Snacks', 'Sunday Special'] }
          ],
          images: [
            'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1502672260266-1c1c24240938?auto=format&fit=crop&w=1200&q=80'
          ]
        };
        setHostel(mapped);
      } catch (err) {
        console.error('Error fetching details:', err);
        const mockHostel = MOCK_HOSTELS.find(h => h.id === id) || MOCK_HOSTELS[0];
        setHostel({
          ...mockHostel,
          name: "Alpha Tower Residence",
          location: "Koramangala, Bengaluru",
          price: 16700,
          deposit: 33400,
          rating: 4.8,
          reviews: 124,
          plans: [
            { name: 'Basic', price: 500, desc: 'Breakfast only', items: ['Tea/Coffee', '1 Breakfast Dish'] }, 
            { name: 'Standard', price: 1000, desc: 'Breakfast & Dinner', items: ['Tea/Coffee', 'Breakfast', 'Full Veg Thali Dinner'] }, 
            { name: 'Premium', price: 1500, desc: 'All 3 Meals + Weekend Special', items: ['All Meals', 'Evening Snacks', 'Sunday Special'] }
          ],
          images: [
            'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80', 
            'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1200&q=80', 
            'https://images.unsplash.com/photo-1502672260266-1c1c24240938?auto=format&fit=crop&w=1200&q=80'
          ]
        });
      } finally {
        setLoading(false);
      }
    };
    fetchHostelDetails();
  }, [id]);

  if (loading) return <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', color: '#3B82F6', fontWeight: '800' }}>Loading Premium Residence...</div>;
  if (!hostel) return <div style={{ textAlign: 'center', padding: '5rem' }}>Property not found.</div>;

  const activePlan = hostel.plans[selectedPlanIdx];
  const selectedBed = roomBeds.find(b => b.id === selectedBedId) || roomBeds[0];

  const amenities = [
    { label: 'High-Speed WiFi', icon: '📶' },
    { label: 'Housekeeping', icon: '🧹' },
    { label: 'Laundry Service', icon: '👕' },
    { label: 'Power Backup', icon: '⚡' },
    { label: 'Air Conditioning', icon: '❄️' },
    { label: 'Biometric Security', icon: '🔐' },
  ];

  return (
    <div className="listing-elite" style={{ background: '#FFFFFF', minHeight: '100vh', paddingBottom: '120px', color: '#0F172A' }}>
      
      {/* 1. HERO SECTION (Whitespace driven) */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', paddingTop: '64px', paddingBottom: '48px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <span style={{ color: '#10B981', fontWeight: '700', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '4px' }}>✔ Verified</span>
          <span style={{ color: '#64748B', fontSize: '0.9rem' }}>•</span>
          <span style={{ color: '#64748B', fontWeight: '600', fontSize: '0.9rem' }}>Managed by Livora</span>
          <span style={{ color: '#64748B', fontSize: '0.9rem' }}>•</span>
          <span style={{ color: '#0F172A', fontWeight: '700', fontSize: '0.9rem' }}>⭐ {hostel.rating} ({hostel.reviews} Reviews)</span>
        </div>
        
        <h1 style={{ fontSize: '3.8rem', fontWeight: '800', color: '#0F172A', marginBottom: '12px', letterSpacing: '-1.5px', lineHeight: '1.1' }}>{hostel.name}</h1>
        <p style={{ color: '#64748B', fontSize: '1.2rem', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px' }}>
          📍 {hostel.location} • <span style={{ color: '#3B82F6' }}>300m from college</span>
        </p>
      </section>

      {/* 2. PREMIUM IMAGE GALLERY */}
      <section style={{ maxWidth: '1200px', margin: '0 auto 80px auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px', height: '480px' }}>
          <div style={{ borderRadius: '24px', overflow: 'hidden' }}>
            <img src={hostel.images[0]} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Main" />
          </div>
          <div style={{ display: 'grid', gridTemplateRows: '1fr 1fr', gap: '16px' }}>
            <div style={{ borderRadius: '24px', overflow: 'hidden' }}>
              <img src={hostel.images[1]} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Secondary" />
            </div>
            <div style={{ position: 'relative', borderRadius: '24px', overflow: 'hidden', cursor: 'pointer', group: 'photo' }} className="photo-group">
              <img src={hostel.images[2]} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Kitchen" />
              <div className="photo-overlay" style={{ position: 'absolute', inset: 0, background: 'rgba(15,23,42,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '700', fontSize: '1.1rem', backdropFilter: 'blur(2px)', transition: 'background 0.4s ease' }}>
                View All Photos
              </div>
            </div>
          </div>
        </div>
      </section>

      <main style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1.7fr 1fr', gap: '80px', alignItems: 'start' }}>
        
        {/* LEFT CONTENT AREA */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '80px' }}>
          
          {/* 3. REALISTIC ROOM FLOOR PLAN */}
          <section>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
              <div>
                <h2 style={{ fontSize: '2rem', fontWeight: '800', letterSpacing: '-0.5px', marginBottom: '8px' }}>Select Your Bed</h2>
                <p style={{ color: '#64748B', fontSize: '1rem', margin: 0 }}>4-Sharing Studio Unit</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.85rem', fontWeight: '600', color: '#64748B' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10B981' }}></div> Available</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#E2E8F0' }}></div> Booked</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#3B82F6', boxShadow: '0 0 10px rgba(59,130,246,0.5)' }}></div> Selected</span>
              </div>
            </div>

            {/* Layout Blueprint (No hard borders, realistic flow) */}
            <div style={{ background: '#F8FAFC', padding: '48px', borderRadius: '32px', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              
              {/* Window */}
              <div style={{ width: '180px', height: '12px', background: '#CBD5E1', borderRadius: '8px', marginBottom: '40px', position: 'relative' }}>
                <div style={{ position: 'absolute', top: '-24px', width: '100%', textAlign: 'center', fontSize: '0.8rem', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', letterSpacing: '2px' }}>Window 🌤</div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px', width: '100%', maxWidth: '450px' }}>
                
                {/* Left Side (Bed A & Bed C) */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                  {roomBeds.filter(b => b.id === 'A' || b.id === 'C').map(bed => (
                    <div key={bed.id} style={{ position: 'relative' }}>
                      {bed.recommended && <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', color: '#FFFFFF', fontSize: '0.65rem', fontWeight: '800', textAlign: 'center', background: '#F59E0B', padding: '4px 10px', borderRadius: '12px', zIndex: 10, whiteSpace: 'nowrap', boxShadow: '0 4px 10px rgba(245, 158, 11, 0.3)' }}>★ MOST POPULAR</div>}
                      <button 
                        onClick={() => bed.status === 'available' && setSelectedBedId(bed.id)}
                        disabled={bed.status === 'booked'}
                        style={{ 
                          width: '100%', height: '120px', borderRadius: '16px', position: 'relative', overflow: 'hidden', cursor: bed.status === 'booked' ? 'not-allowed' : 'pointer', border: 'none',
                          background: bed.status === 'booked' ? '#E2E8F0' : selectedBedId === bed.id ? '#3B82F6' : '#FFFFFF',
                          color: selectedBedId === bed.id ? 'white' : bed.status === 'booked' ? '#94A3B8' : '#0F172A',
                          boxShadow: selectedBedId === bed.id ? '0 12px 32px rgba(59, 130, 246, 0.4)' : '0 8px 24px rgba(0,0,0,0.03)',
                          transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
                        }} className={selectedBedId === bed.id ? 'selected-bed' : 'hover-bed'}>
                        <div style={{ fontSize: '1.4rem', fontWeight: '800' }}>Bed {bed.id}</div>
                        {bed.status === 'booked' && <div style={{ fontSize: '0.7rem', fontWeight: '700', marginTop: '6px' }}>UNAVAILABLE</div>}
                      </button>
                    </div>
                  ))}
                </div>

                {/* Right Side (Bed B & Bed D) */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                  {roomBeds.filter(b => b.id === 'B' || b.id === 'D').map(bed => (
                    <div key={bed.id} style={{ position: 'relative' }}>
                      <button 
                        onClick={() => bed.status === 'available' && setSelectedBedId(bed.id)}
                        disabled={bed.status === 'booked'}
                        style={{ 
                          width: '100%', height: '120px', borderRadius: '16px', position: 'relative', overflow: 'hidden', cursor: bed.status === 'booked' ? 'not-allowed' : 'pointer', border: 'none',
                          background: bed.status === 'booked' ? '#E2E8F0' : selectedBedId === bed.id ? '#3B82F6' : '#FFFFFF',
                          color: selectedBedId === bed.id ? 'white' : bed.status === 'booked' ? '#94A3B8' : '#0F172A',
                          boxShadow: selectedBedId === bed.id ? '0 12px 32px rgba(59, 130, 246, 0.4)' : '0 8px 24px rgba(0,0,0,0.03)',
                          transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
                        }} className={selectedBedId === bed.id ? 'selected-bed' : 'hover-bed'}>
                        <div style={{ fontSize: '1.4rem', fontWeight: '800' }}>Bed {bed.id}</div>
                        {bed.status === 'booked' && <div style={{ fontSize: '0.7rem', fontWeight: '700', marginTop: '6px' }}>UNAVAILABLE</div>}
                      </button>
                    </div>
                  ))}
                </div>

              </div>

              {/* Bottom: Door & Bathroom */}
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', maxWidth: '450px', marginTop: '48px', color: '#64748B', fontWeight: '700', fontSize: '0.9rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#E2E8F0', padding: '8px 16px', borderRadius: '8px' }}>🚪 Door</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#E2E8F0', padding: '8px 16px', borderRadius: '8px' }}>🚿 Washroom</div>
              </div>
            </div>

            {/* Interactive Connected Details Panel (Floating effect) */}
            <div style={{ marginTop: '32px', background: 'transparent', display: 'flex', gap: '32px', alignItems: 'flex-start' }}>
              <div style={{ width: '64px', height: '64px', background: '#EEF2FF', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3B82F6', fontSize: '1.8rem', fontWeight: '800' }}>
                {selectedBed.id}
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '1.4rem', fontWeight: '800', margin: '0 0 16px 0', color: '#0F172A' }}>Bed {selectedBed.id} Details</h3>
                <div style={{ display: 'flex', gap: '40px', alignItems: 'center' }}>
                  <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 32px' }}>
                    {selectedBed.features.map(f => (
                      <li key={f} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1rem', color: '#475569', fontWeight: '500' }}>
                        <span style={{ color: '#10B981', fontSize: '1.2rem' }}>✔</span> {f}
                      </li>
                    ))}
                  </ul>
                  <div style={{ height: '40px', width: '1px', background: '#E2E8F0' }}></div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Distance</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: '700', color: '#0F172A' }}>{selectedBed.distance}</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 4. WASHROOM DETAILS (Soft layout, NO BOXES) */}
          <section>
            <h2 style={{ fontSize: '2rem', fontWeight: '800', letterSpacing: '-0.5px', marginBottom: '32px' }}>Washroom Details</h2>
            <div style={{ display: 'flex', gap: '64px', alignItems: 'flex-start' }}>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ color: '#94A3B8', fontWeight: '700', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Type</span>
                  <span style={{ color: '#0F172A', fontWeight: '800', fontSize: '1.2rem' }}>Attached</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ color: '#94A3B8', fontWeight: '700', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Used By</span>
                  <span style={{ color: '#0F172A', fontWeight: '800', fontSize: '1.2rem' }}>Shared by 4 people</span>
                </div>
              </div>
              
              <div style={{ width: '1px', background: '#F1F5F9', height: '100px', alignSelf: 'center' }}></div>

              <div style={{ flex: 2 }}>
                <h4 style={{ fontSize: '0.8rem', fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '24px', margin: 0 }}>Includes</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontWeight: '600', color: '#0F172A', fontSize: '1.1rem' }}><span style={{ fontSize: '1.5rem' }}>🚿</span> Shower Area</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontWeight: '600', color: '#0F172A', fontSize: '1.1rem' }}><span style={{ fontSize: '1.5rem' }}>🚽</span> Western Toilet</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontWeight: '600', color: '#0F172A', fontSize: '1.1rem' }}><span style={{ fontSize: '1.5rem' }}>🔥</span> 24/7 Geyser</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontWeight: '600', color: '#0F172A', fontSize: '1.1rem' }}><span style={{ fontSize: '1.5rem' }}>🪞</span> Large Mirror</div>
                </div>
              </div>
            </div>
          </section>

          {/* 5. TOP AMENITIES (Soft grid) */}
          <section>
            <h2 style={{ fontSize: '2rem', fontWeight: '800', letterSpacing: '-0.5px', marginBottom: '32px' }}>Top Amenities</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }}>
              {amenities.map(item => (
                <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <span style={{ fontSize: '1.8rem', opacity: 0.9 }}>{item.icon}</span>
                  <span style={{ color: '#0F172A', fontWeight: '600', fontSize: '1.1rem' }}>{item.label}</span>
                </div>
              ))}
            </div>
          </section>

          {/* 6. DINING PLANS (Flat, Borderless) */}
          <section>
            <h2 style={{ fontSize: '2rem', fontWeight: '800', letterSpacing: '-0.5px', marginBottom: '32px' }}>Dining & Nutrition</h2>
            <div style={{ display: 'flex', gap: '24px' }}>
              {hostel.plans.map((p, i) => (
                <div key={p.name} onClick={() => setSelectedPlanIdx(i)} style={{ flex: 1, padding: '32px', borderRadius: '24px', cursor: 'pointer', background: selectedPlanIdx === i ? '#EEF2FF' : '#F8FAFC', transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)', border: 'none' }}>
                  <div style={{ fontWeight: '800', fontSize: '1.2rem', color: selectedPlanIdx === i ? '#3B82F6' : '#64748B', marginBottom: '12px' }}>{p.name}</div>
                  <div style={{ fontSize: '2.5rem', fontWeight: '800', color: selectedPlanIdx === i ? '#1E3A8A' : '#0F172A', marginBottom: '24px', lineHeight: '1', letterSpacing: '-1px' }}>₹{p.price}<span style={{ fontSize: '1rem', color: selectedPlanIdx === i ? '#60A5FA' : '#94A3B8', fontWeight: '600' }}>/mo</span></div>
                  <ul style={{ padding: 0, margin: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {p.items.map((item, idx) => (
                      <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1rem', color: selectedPlanIdx === i ? '#1E40AF' : '#475569', fontWeight: '500' }}>
                        <span style={{ color: selectedPlanIdx === i ? '#3B82F6' : '#CBD5E1', fontSize: '1.2rem' }}>✔</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

        </div>

        {/* RIGHT STICKY SIDEBAR (Ultra-Soft Shadow) */}
        <aside style={{ position: 'sticky', top: '40px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          <div style={{ background: '#FFFFFF', borderRadius: '32px', padding: '48px', boxShadow: '0 24px 48px -12px rgba(0,0,0,0.06)' }}>
            
            {/* Urgency Signal */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#EF4444', fontSize: '0.9rem', fontWeight: '700', marginBottom: '24px' }}>
              🔥 Only 3 beds left in this unit
            </div>

            <div style={{ marginBottom: '40px' }}>
              <div style={{ fontSize: '3.5rem', fontWeight: '800', color: '#0F172A', lineHeight: '1', letterSpacing: '-1.5px' }}>₹{hostel.price.toLocaleString()}<span style={{ fontSize: '1.2rem', color: '#64748B', fontWeight: '600' }}>/mo</span></div>
              <p style={{ color: '#64748B', fontSize: '1rem', margin: '12px 0 0 0', fontWeight: '500' }}>Includes Rent + Maintenance</p>
            </div>

            {/* Total Move-In Calculation */}
            <div style={{ marginBottom: '40px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569', fontWeight: '500', marginBottom: '16px', fontSize: '1.1rem' }}><span>Rent (1st Month)</span> <span>₹{hostel.price.toLocaleString()}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569', fontWeight: '500', marginBottom: '16px', fontSize: '1.1rem' }}><span>Security Deposit</span> <span>₹{hostel.deposit.toLocaleString()}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569', fontWeight: '500', marginBottom: '16px', fontSize: '1.1rem' }}><span>Dining ({activePlan.name})</span> <span>₹{activePlan.price.toLocaleString()}</span></div>
              <div style={{ borderTop: '1px solid #F1F5F9', margin: '24px 0' }}></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#0F172A', fontWeight: '800', fontSize: '1.4rem' }}><span>Total Move-in</span> <span>₹{(hostel.price + hostel.deposit + activePlan.price).toLocaleString()}</span></div>
            </div>

            {/* Deep Trust Builder */}
            <div style={{ background: '#F8FAFC', padding: '24px', borderRadius: '16px', marginBottom: '40px', display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
              <span style={{ fontSize: '1.5rem' }}>🛡️</span>
              <div>
                <div style={{ fontWeight: '800', color: '#0F172A', fontSize: '1rem', marginBottom: '4px' }}>100% Refundable Deposit</div>
                <div style={{ color: '#64748B', fontSize: '0.9rem', fontWeight: '500', lineHeight: '1.5' }}>Deposit is fully returned to you within 7 days of moving out. Zero hidden charges.</div>
              </div>
            </div>

            {/* Actions */}
            <button onClick={() => navigate(`/booking/${hostel.id}`)} style={{ width: '100%', background: '#3B82F6', color: 'white', border: 'none', padding: '20px', borderRadius: '16px', fontWeight: '800', fontSize: '1.2rem', cursor: 'pointer', marginBottom: '16px', transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)', boxShadow: '0 12px 32px rgba(59, 130, 246, 0.3)' }} className="cta-primary">Reserve Bed {selectedBed.id}</button>
            <button style={{ width: '100%', background: 'transparent', color: '#0F172A', border: 'none', padding: '16px', borderRadius: '16px', fontWeight: '700', fontSize: '1.1rem', cursor: 'pointer', transition: 'background 0.2s', textDecoration: 'underline' }}>Schedule a Visit First</button>

          </div>
        </aside>

      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
        .listing-elite { font-family: 'Plus Jakarta Sans', sans-serif; -webkit-font-smoothing: antialiased; }
        .hover-bed:not(:disabled):hover { transform: translateY(-4px); box-shadow: 0 16px 32px rgba(0,0,0,0.05) !important; }
        .selected-bed { transform: scale(1.02); }
        .cta-primary:hover { transform: translateY(-2px); box-shadow: 0 16px 40px rgba(59, 130, 246, 0.4) !important; }
        .cta-primary:active { transform: translateY(0) scale(0.98); }
        .photo-overlay { opacity: 0; }
        .photo-group:hover .photo-overlay { opacity: 1; }
      `}</style>
    </div>
  );
};

export default Listing;
