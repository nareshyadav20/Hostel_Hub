import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { MOCK_HOSTELS } from '../utils/mockData';

const ICONS = {
  Location: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>,
  Security: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>,
  WiFi: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12.55a11 11 0 0 1 14.08 0" /><path d="M1.42 9a16 16 0 0 1 21.16 0" /><path d="M8.53 16.11a6 6 0 0 1 6.95 0" /><line x1="12" y1="20" x2="12.01" y2="20" /></svg>,
  Meals: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 8h1a4 4 0 0 1 0 8h-1" /><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" /><line x1="6" y1="1" x2="6" y2="4" /><line x1="10" y1="1" x2="10" y2="4" /><line x1="14" y1="1" x2="14" y2="4" /></svg>,
  Cleaning: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 12h-4l-3-9L9 3l-3 9H2" /><path d="M4.5 12v6a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-6" /><line x1="9" y1="12" x2="9" y2="20" /><line x1="15" y1="12" x2="15" y2="20" /></svg>,
  Power: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>,
  Check: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>,
  ArrowLeft: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>,
  Share: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" /></svg>,
  Heart: (props) => <svg width="18" height="18" viewBox="0 0 24 24" fill={props.filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
};

const ROOM_SPECS_ICONS = {
  size: "📐",
  sharing: "👥",
  beds: "🛏",
  direction: "🧭",
  windows: "🪟",
  fans: "🌀",
  lights: "💡",
  sockets: "🔌",
  cupboards: "🚪",
  studyTable: "📚",
  balcony: "🏖",
  bathroom: "🚿"
};

const Listing = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [selectedRoomIdx, setSelectedRoomIdx] = useState(0);
  const [selectedSharing, setSelectedSharing] = useState(2); // 1, 2, 3 sharing
  const [selectedPlanIdx, setSelectedPlanIdx] = useState(1);
  const [hostel, setHostel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [wishlistId, setWishlistId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [activeSpec, setActiveSpec] = useState(null);

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
          name: b.name || "Alpha Tower",
          location: b.address || "Alpha Tower Street, Bengaluru",
          distance: "300m from college",
          category: b.category || "Student",
          gender: b.genderType || "Boys",
          fillingFast: true,
          verified: true,
          rating: b.rating || 4.1,
          reviews: 124,
          price: 16700,
          deposit: 33400,
          maintenance: 999,
          roomTypes: (b.floors?.[0]?.rooms || []).map(r => ({
            id: r._id,
            type: r.roomNumber
          })).slice(0, 3) || [],
          menu: { breakfast: 'Poha / Omelette / Tea', lunch: 'Veg Thali / Curd / Salad', dinner: 'Phulka / Mix Veg / Paneer' },
          plans: [
            { name: 'Basic', price: 500, desc: 'Breakfast only' },
            { name: 'Standard', price: 1000, desc: 'Breakfast & Dinner' },
            { name: 'Premium', price: 1500, desc: 'All 3 Meals + Weekend Special' }
          ],
          images: [
            'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1502672260266-1c1c24240938?auto=format&fit=crop&w=1200&q=80'
          ],
          testimonials: [
            { name: "Rahul S.", text: "Best hostel in the city. The food is actually homely!", rating: 5 },
            { name: "Priya M.", text: "Very safe for girls, security is top-notch.", rating: 5 }
          ]
        };

        if (mapped.roomTypes.length === 0) {
          mapped.roomTypes = [{ type: '101' }, { type: '102' }];
        }

        setHostel(mapped);

        // Check wishlist status
        const wishRes = await API.get('/tenant-portal/wishlist');
        const existing = wishRes.data.find(w => (w.hostelId === b._id || w.hostelId === id));
        if (existing) setWishlistId(existing._id);

      } catch (err) {
        console.error('Error fetching details:', err);
        const mockHostel = MOCK_HOSTELS.find(h => h.id === id) || MOCK_HOSTELS[0];
        setHostel({
          ...mockHostel,
          name: "Alpha Tower",
          location: "Alpha Tower Street, Bengaluru",
          distance: "300m from college",
          gender: 'Boys',
          category: 'Student',
          price: 16700,
          deposit: 33400,
          maintenance: 999,
          roomTypes: [{ type: '101' }, { type: '102' }],
          menu: { breakfast: 'Poha / Omelette / Tea', lunch: 'Veg Thali / Curd / Salad', dinner: 'Phulka / Mix Veg / Paneer' },
          plans: [{ name: 'Basic', price: 500, desc: 'Breakfast only' }, { name: 'Standard', price: 1000, desc: 'Breakfast & Dinner' }, { name: 'Premium', price: 1500, desc: 'All 3 Meals + Weekend Special' }],
          images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1502672260266-1c1c24240938?auto=format&fit=crop&w=1200&q=80'],
          testimonials: [{ name: "Rahul S.", text: "Best hostel in the city. The food is actually homely!", rating: 5 }, { name: "Priya M.", text: "Very safe for girls, security is top-notch.", rating: 5 }]
        });
      } finally {
        setLoading(false);
      }
    };
    fetchHostelDetails();
  }, [id]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: hostel.name,
        text: `Check out ${hostel.name} in ${hostel.location}`,
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const handleWishlistToggle = async () => {
    if (isSaving) return;
    setIsSaving(true);
    try {
      if (wishlistId) {
        await API.delete(`/tenant-portal/wishlist/${wishlistId}`);
        setWishlistId(null);
      } else {
        const res = await API.post('/tenant-portal/wishlist', {
          hostelId: hostel.id || id,
          hostelName: hostel.name,
          hostelLocation: hostel.location,
          hostelPrice: hostel.price,
          hostelImage: hostel.images[0],
          hostelRating: hostel.rating || 4.1,
          gender: hostel.gender,
          type: 'Premium'
        });
        setWishlistId(res.data._id);
        alert('Added to wishlist!');
      }
    } catch (err) {
      console.error('Wishlist error:', err);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', color: '#3B82F6', fontWeight: '800' }}>Crafting your premium stay...</div>;
  if (!hostel) return <div style={{ textAlign: 'center', padding: '5rem' }}>Property not found.</div>;

  const selectedRoom = hostel.roomTypes[selectedRoomIdx] || hostel.roomTypes[0];
  const activePlan = hostel.plans[selectedPlanIdx];

  const dynamicSpecs = [
    { label: 'Size', value: selectedSharing === 1 ? '10×12 ft' : selectedSharing === 2 ? '12×14 ft' : '14×16 ft', icon: ROOM_SPECS_ICONS.size },
    { label: 'Sharing', value: `${selectedSharing} Sharing`, icon: ROOM_SPECS_ICONS.sharing },
    { label: 'Beds', value: `${selectedSharing} Single`, icon: ROOM_SPECS_ICONS.beds },
    { label: 'Direction', value: 'East Facing', icon: ROOM_SPECS_ICONS.direction },
    { label: 'Windows', value: selectedSharing === 3 ? '3' : '2', icon: ROOM_SPECS_ICONS.windows },
    { label: 'Fans', value: selectedSharing === 3 ? '2' : '1', icon: ROOM_SPECS_ICONS.fans },
    { label: 'Lights', value: selectedSharing * 1, icon: ROOM_SPECS_ICONS.lights },
    { label: 'Sockets', value: selectedSharing * 2, icon: ROOM_SPECS_ICONS.sockets },
    { label: 'Cupboards', value: selectedSharing, icon: ROOM_SPECS_ICONS.cupboards },
    { label: 'Study Table', value: 'Yes', icon: ROOM_SPECS_ICONS.studyTable },
    { label: 'Balcony', value: selectedSharing === 1 ? 'No' : 'Yes', icon: ROOM_SPECS_ICONS.balcony },
    { label: 'Bathroom', value: 'Attached', icon: ROOM_SPECS_ICONS.bathroom }
  ];

  return (
    <div className="listing-modern" style={{ background: '#F8FAFC', minHeight: '100vh', padding: '2rem 4rem 6rem' }}>

      <main style={{ maxWidth: '1400px', margin: '0 auto' }}>

        {/* HERO SECTION - WIDER & BETTER ALIGNED */}
        <section style={{ background: 'white', borderRadius: '32px', padding: '3rem', border: '1px solid #E2E8F0', marginBottom: '2rem', position: 'relative', boxShadow: '0 10px 30px rgba(0,0,0,0.02)' }}>

          <div style={{ position: 'absolute', top: '2.5rem', right: '2.5rem', display: 'flex', gap: '1.2rem', zIndex: 10 }}>
            <button onClick={handleShare} style={{ background: '#F1F5F9', border: 'none', padding: '0.8rem 1.6rem', borderRadius: '14px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#64748B', transition: 'all 0.3s' }}>
              <ICONS.Share /> Share
            </button>
            <button onClick={handleWishlistToggle} style={{ background: wishlistId ? '#EF4444' : '#F1F5F9', border: 'none', padding: '0.8rem 1.6rem', borderRadius: '14px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.6rem', color: wishlistId ? 'white' : '#64748B', transition: 'all 0.3s' }}>
              <ICONS.Heart filled={wishlistId} /> {wishlistId ? 'Saved' : 'Save'}
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '4rem', alignItems: 'center' }}>
            <div style={{ paddingTop: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', marginBottom: '1.8rem' }}>
                <span style={{ background: '#EFF6FF', color: '#3B82F6', padding: '0.6rem 1.4rem', borderRadius: '30px', fontSize: '0.8rem', fontWeight: '900', textTransform: 'uppercase' }}>{hostel.gender}</span>
                <span style={{ background: '#F0FDF4', color: '#10B981', padding: '0.6rem 1.4rem', borderRadius: '30px', fontSize: '0.8rem', fontWeight: '900', textTransform: 'uppercase' }}>{hostel.category}</span>
                <span style={{ background: '#FFF7ED', color: '#F59E0B', padding: '0.6rem 1.4rem', borderRadius: '30px', fontSize: '0.8rem', fontWeight: '900' }}>⚡ Filling Fast</span>
              </div>
              <h1 style={{ fontSize: '4.2rem', fontWeight: '950', margin: '0 0 1rem', color: '#0F172A', letterSpacing: '-2.5px', lineHeight: '0.95' }}>{hostel.name}</h1>
              <p style={{ fontSize: '1.3rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '0.8rem', fontWeight: '600' }}>
                <ICONS.Location style={{ color: '#3B82F6' }} /> {hostel.location} • <span style={{ color: '#3B82F6', fontWeight: '800' }}>{hostel.distance}</span>
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem', marginTop: '3rem' }}>
                <div style={{ color: '#D97706', fontWeight: '950', fontSize: '1.4rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>★ {hostel.rating || 4.1} <span style={{ color: '#94A3B8', fontSize: '1.1rem', fontWeight: '700' }}>({hostel.reviews} Reviews)</span></div>
                <div style={{ color: '#10B981', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '0.8rem', fontSize: '1.2rem' }}>
                  <ICONS.Check style={{ strokeWidth: 4 }} /> Verified Property
                </div>
              </div>
            </div>

            <div style={{ background: '#F8FAFC', padding: '3.5rem', borderRadius: '36px', border: '1px solid #E2E8F0', textAlign: 'center', boxShadow: 'inset 0 4px 12px rgba(0,0,0,0.03)' }}>
              <p style={{ margin: 0, color: '#64748B', fontWeight: '800', fontSize: '1.1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Starting from</p>
              <div style={{ fontSize: '4.2rem', fontWeight: '950', color: '#0F172A', lineHeight: '1', margin: '1rem 0' }}>₹{hostel.price.toLocaleString()}<span style={{ fontSize: '1.4rem', color: '#94A3B8', fontWeight: '700' }}>/mo</span></div>
              <p style={{ margin: '1.2rem 0 2.5rem', color: '#10B981', fontWeight: '900', fontSize: '1.2rem' }}>✓ Includes WiFi + Food + Cleaning</p>
              <button onClick={() => navigate(`/booking/${hostel.id}`)} style={{ width: '100%', background: '#10B981', color: 'white', border: 'none', padding: '1.6rem', borderRadius: '22px', fontWeight: '950', fontSize: '1.5rem', cursor: 'pointer', boxShadow: '0 15px 35px rgba(16, 185, 129, 0.25)', transition: 'all 0.3s' }}>Book Now</button>
            </div>
          </div>
        </section>

        {/* IMAGE GALLERY - OPTIMIZED FOR LAPTOP */}
        <section style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', height: '620px', marginBottom: '3.5rem' }}>
          <div style={{ borderRadius: '32px', overflow: 'hidden', boxShadow: '0 25px 50px rgba(0,0,0,0.08)' }}>
            <img src={hostel.images[0]} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Main" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ height: 'calc(50% - 0.75rem)', borderRadius: '32px', overflow: 'hidden', boxShadow: '0 25px 50px rgba(0,0,0,0.08)' }}>
              <img src={hostel.images[1]} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Thumb 1" />
            </div>
            <div style={{ height: 'calc(50% - 0.75rem)', position: 'relative', borderRadius: '32px', overflow: 'hidden', boxShadow: '0 25px 50px rgba(0,0,0,0.08)' }}>
              <img src={hostel.images[2]} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Thumb 2" />
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '950', cursor: 'pointer', fontSize: '1.5rem', backdropFilter: 'blur(6px)' }}>View All 24 Photos</div>
            </div>
          </div>
        </section>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.1fr', gap: '4rem', alignItems: 'start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3.5rem' }}>

            {/* ROOM & BED SELECTION - WIDER TABLES */}
            <section style={{ background: 'white', borderRadius: '36px', padding: '4rem', border: '1px solid #E2E8F0', boxShadow: '0 4px 25px rgba(0,0,0,0.02)' }}>
              <h2 style={{ fontSize: '2.5rem', fontWeight: '950', marginBottom: '2.5rem', color: '#0F172A', letterSpacing: '-1.5px' }}>🛏️ Room & Bed Selection</h2>

              <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2.5rem' }}>
                {hostel.roomTypes.map((room, idx) => (
                  <button key={idx} onClick={() => setSelectedRoomIdx(idx)} style={{ padding: '1.4rem 3.5rem', borderRadius: '24px', background: selectedRoomIdx === idx ? '#3B82F6' : '#F8FAFC', color: selectedRoomIdx === idx ? 'white' : '#64748B', border: '2px solid #E2E8F0', fontWeight: '950', fontSize: '1.2rem', cursor: 'pointer', boxShadow: selectedRoomIdx === idx ? '0 12px 24px rgba(59, 130, 246, 0.2)' : 'none' }}>{room.type}</button>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '3.5rem' }}>
                {[1, 2, 3].map(s => (
                  <button key={s} onClick={() => setSelectedSharing(s)} style={{ padding: '1.2rem 3rem', borderRadius: '20px', background: selectedSharing === s ? '#0F172A' : 'white', color: selectedSharing === s ? 'white' : '#0F172A', border: '2px solid #0F172A', fontWeight: '900', cursor: 'pointer', fontSize: '1.1rem' }}>{s} Sharing</button>
                ))}
              </div>

              <div style={{ background: '#F8FAFC', borderRadius: '32px', padding: '3rem', marginBottom: '4rem', border: '1px solid #E2E8F0' }}>
                <p style={{ margin: 0, fontWeight: '950', color: '#1E293B', fontSize: '1.6rem' }}>Selected Room: <span style={{ color: '#3B82F6' }}>{selectedRoom.type} ({selectedSharing} Sharing)</span></p>
                <p style={{ margin: '1.2rem 0 0', color: '#64748B', fontWeight: '600', lineHeight: '1.8', fontSize: '1.2rem' }}>Spacious premium suite with designer work pods, ergonomic storage solutions, and high-performance climate control. Engineered for the ultimate co-living experience.</p>

                <div style={{ marginTop: '3rem' }}>
                  <div style={{ fontSize: '1rem', fontWeight: '950', color: '#94A3B8', marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '1.5px' }}>BED AVAILABILITY STATUS</div>
                  <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                    {[...Array(selectedSharing)].map((_, i) => (
                      <button
                        key={i}
                        disabled={i === 0}
                        style={{
                          padding: '1.2rem 2.5rem',
                          borderRadius: '18px',
                          background: i === 0 ? '#EF4444' : '#10B981',
                          color: 'white',
                          border: 'none',
                          fontWeight: '950',
                          fontSize: '1.1rem',
                          cursor: i === 0 ? 'not-allowed' : 'pointer',
                          opacity: i === 0 ? 0.8 : 1,
                          boxShadow: `0 10px 20px ${i === 0 ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)'}`
                        }}
                      >
                        Bed {i + 1} {i === 0 ? '(Filled)' : '(Available)'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <h3 style={{ fontSize: '2rem', fontWeight: '950', marginBottom: '2.5rem', color: '#0F172A' }}>📐 Room Specifications</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.8rem' }}>
                {dynamicSpecs.map(spec => (
                  <div key={spec.label} onClick={() => setActiveSpec(spec.label)} style={{ background: activeSpec === spec.label ? '#EFF6FF' : 'white', borderRadius: '32px', padding: '2.2rem', border: `2px solid ${activeSpec === spec.label ? '#3B82F6' : '#F1F5F9'}`, textAlign: 'center', cursor: 'pointer', transition: 'all 0.3s' }}>
                    <div style={{ fontSize: '2.8rem', marginBottom: '1rem' }}>{spec.icon}</div>
                    <div style={{ fontSize: '0.9rem', color: '#94A3B8', fontWeight: '900', textTransform: 'uppercase', marginBottom: '0.6rem' }}>{spec.label}</div>
                    <div style={{ fontWeight: '950', color: '#0F172A', fontSize: '1.4rem' }}>{spec.value}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* DINING SECTION - WIDER */}
            <section style={{ background: 'white', borderRadius: '36px', padding: '4rem', border: '1px solid #E2E8F0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3.5rem' }}>
                <h2 style={{ fontSize: '2.5rem', fontWeight: '950', margin: 0, letterSpacing: '-1.5px' }}>🍽️ Dining & Nutrition</h2>
                <div style={{ display: 'flex', gap: '1.2rem' }}>
                  <span style={{ background: '#F0FDF4', color: '#10B981', padding: '0.8rem 1.8rem', borderRadius: '18px', fontWeight: '950', fontSize: '1rem' }}>✨ Hygienic</span>
                  <span style={{ background: '#F0FDF4', color: '#10B981', padding: '0.8rem 1.8rem', borderRadius: '18px', fontWeight: '950', fontSize: '1rem' }}>🏠 Homely</span>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', marginBottom: '4rem' }}>
                {Object.entries(hostel.menu).map(([m, c]) => (
                  <div key={m} style={{ padding: '2.2rem', background: '#F8FAFC', borderRadius: '32px', border: '1px solid #E2E8F0' }}>
                    <div style={{ fontSize: '0.9rem', fontWeight: '950', color: '#64748B', textTransform: 'uppercase', marginBottom: '1rem' }}>{m}</div>
                    <div style={{ fontWeight: '950', color: '#1E293B', fontSize: '1.4rem', lineHeight: '1.5' }}>{c}</div>
                  </div>
                ))}
              </div>
              <h4 style={{ fontWeight: '950', marginBottom: '2.5rem', fontSize: '1.8rem', color: '#0F172A' }}>⭐ Subscription Plans</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
                {hostel.plans.map((p, i) => (
                  <div key={p.name} onClick={() => setSelectedPlanIdx(i)} style={{ padding: '2.8rem', borderRadius: '36px', border: `4px solid ${selectedPlanIdx === i ? '#10B981' : '#F1F5F9'}`, background: selectedPlanIdx === i ? '#F0FDF4' : 'white', cursor: 'pointer', transition: 'all 0.3s' }}>
                    <div style={{ fontWeight: '950', fontSize: '1.4rem', marginBottom: '1rem', color: selectedPlanIdx === i ? '#10B981' : '#0F172A' }}>{p.name}</div>
                    <div style={{ fontSize: '3.2rem', fontWeight: '950', color: '#0F172A', lineHeight: '1' }}>₹{p.price}</div>
                    <div style={{ fontSize: '1.1rem', color: '#64748B', fontWeight: '700', marginTop: '1.5rem', lineHeight: '1.6' }}>{p.desc}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* MODULAR TABLES - WIDER */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
              <section style={{ background: 'white', borderRadius: '36px', padding: '3rem', border: '1px solid #E2E8F0' }}>
                <h3 style={{ fontSize: '1.6rem', fontWeight: '950', marginBottom: '2.2rem' }}>🚿 Bathroom Features</h3>
                <div style={{ background: '#F8FAFC', borderRadius: '24px', padding: '1rem' }}>
                  {[
                    ['Type', 'Attached'], ['Hot Water', '24/7 Geyser'],
                    ['Toilet', 'Western Style'], ['Cleaning', 'Daily Cycle']
                  ].map(([k, v], idx) => (
                    <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '1.5rem 2rem', borderBottom: idx === 3 ? 'none' : '1px solid #E2E8F0' }}>
                      <span style={{ fontWeight: '850', color: '#64748B', fontSize: '1.1rem' }}>{k}</span>
                      <span style={{ fontWeight: '950', color: '#0F172A', fontSize: '1.1rem' }}>{v}</span>
                    </div>
                  ))}
                </div>
              </section>
              <section style={{ background: 'white', borderRadius: '36px', padding: '3rem', border: '1px solid #E2E8F0' }}>
                <h3 style={{ fontSize: '1.6rem', fontWeight: '950', marginBottom: '2.2rem' }}>🏢 Infrastructure</h3>
                <div style={{ background: '#F8FAFC', borderRadius: '24px', padding: '1rem' }}>
                  {[
                    ['Floor', '3rd Premium'], ['Lift', 'High Speed'],
                    ['Building Age', '4 Years Old'], ['Water Supply', 'RO 24/7'],
                    ['Power Backup', '100% UPS']
                  ].map(([k, v], idx) => (
                    <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '1.5rem 2rem', borderBottom: idx === 4 ? 'none' : '1px solid #E2E8F0' }}>
                      <span style={{ fontWeight: '850', color: '#64748B', fontSize: '1.1rem' }}>{k}</span>
                      <span style={{ fontWeight: '950', color: '#0F172A', fontSize: '1.1rem' }}>{v}</span>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>

          {/* SIDEBAR - WIDER FOR LAPTOP */}
          <aside style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
            <div style={{ background: 'white', borderRadius: '36px', padding: '3.5rem', border: '1px solid #E2E8F0', boxShadow: '0 40px 80px rgba(0,0,0,0.06)', position: 'sticky', top: '2rem' }}>
              <h3 style={{ fontSize: '2rem', fontWeight: '950', marginBottom: '3rem', letterSpacing: '-1px' }}>💰 Payment Summary</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.8rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '850', color: '#64748B', fontSize: '1.25rem' }}>Monthly Rent <span>₹16,700</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '850', color: '#64748B', fontSize: '1.25rem' }}>Security Deposit <span>₹33,400</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '850', color: '#64748B', fontSize: '1.25rem' }}>Dining ({activePlan.name}) <span style={{ color: '#10B981' }}>₹{activePlan.price}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '850', color: '#64748B', fontSize: '1.25rem' }}>Maintenance Fee <span>₹999</span></div>
                <div style={{ borderTop: '5px dashed #F1F5F9', paddingTop: '2.5rem', marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '1.8rem', fontWeight: '950' }}>Total Due</span>
                  <span style={{ fontSize: '3.2rem', fontWeight: '950', color: '#10B981', letterSpacing: '-1.5px' }}>₹{(16700 + 33400 + activePlan.price + 999).toLocaleString()}</span>
                </div>
                <p style={{ fontSize: '1rem', color: '#94A3B8', fontStyle: 'italic', marginTop: '1.5rem', fontWeight: '700', textAlign: 'center' }}>* Full deposit is refundable upon move-out.</p>
              </div>
              <button onClick={() => navigate(`/booking/${hostel.id}`)} style={{ width: '100%', background: '#10B981', color: 'white', border: 'none', padding: '1.8rem', borderRadius: '24px', fontWeight: '950', fontSize: '1.6rem', marginTop: '4rem', cursor: 'pointer', boxShadow: '0 25px 50px rgba(16, 185, 129, 0.3)', transition: 'all 0.4s' }}>Reserve This Bed</button>
              <button onClick={handleWishlistToggle} style={{ width: '100%', background: 'white', color: '#0F172A', border: '3px solid #F1F5F9', padding: '1.5rem', borderRadius: '24px', fontWeight: '950', marginTop: '1.5rem', cursor: 'pointer', fontSize: '1.3rem', transition: 'all 0.3s' }}>Schedule Site Visit</button>
            </div>

            <section style={{ background: 'white', borderRadius: '36px', padding: '3rem', border: '1px solid #E2E8F0' }}>
              <h3 style={{ fontSize: '1.8rem', fontWeight: '950', marginBottom: '2.5rem' }}>📊 Live Occupancy</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {[['Total Capacity', '40 Beds'], ['Current Vacancy', '12 Beds'], ['Occupancy Rate', '70%']].map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '1.6rem 2rem', background: '#F8FAFC', borderRadius: '24px', fontWeight: '950', fontSize: '1.2rem' }}>
                    <span style={{ color: '#64748B' }}>{k}</span> <span>{v}</span>
                  </div>
                ))}
                <div style={{ marginTop: '1.5rem' }}>
                  <div style={{ height: '16px', background: '#F1F5F9', borderRadius: '16px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
                    <div style={{ width: '70%', height: '100%', background: 'linear-gradient(90deg, #F59E0B, #D97706)', borderRadius: '16px' }}></div>
                  </div>
                  <p style={{ color: '#D97706', fontSize: '1.1rem', fontWeight: '950', marginTop: '1.5rem', textAlign: 'center' }}>⚠️ Filling Fast! Only 12 beds remaining.</p>
                </div>
              </div>
            </section>
          </aside>
        </div>
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
        .listing-modern { font-family: 'Plus Jakarta Sans', sans-serif; -webkit-font-smoothing: antialiased; }
        button, div[onClick] { transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
        button:hover { transform: translateY(-6px); }
        button:active { transform: scale(0.94); }
        .listing-modern img { transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1); }
        .listing-modern img:hover { transform: scale(1.05); }
      `}</style>
    </div>
  );
};

export default Listing;
