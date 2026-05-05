import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { MOCK_HOSTELS } from '../utils/mockData';

const ICONS = {
  Location: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  Security: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  WiFi: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>,
  Meals: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>,
  Cleaning: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 12h-4l-3-9L9 3l-3 9H2"/><path d="M4.5 12v6a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-6"/><line x1="9" y1="12" x2="9" y2="20"/><line x1="15" y1="12" x2="15" y2="20"/></svg>,
  Power: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>,
  Check: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
};

const Listing = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('photos');
  const [selectedRoomIdx, setSelectedRoomIdx] = useState(0);
  const [hostel, setHostel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openPolicy, setOpenPolicy] = useState(0);
  const [wishlistId, setWishlistId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
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
          name: b.name,
          location: b.address,
          distance: "300m from college",
          city: b.locationCity,
          category: b.category,
          gender: b.genderType,
          description: b.description || "A premium stay for students and professionals featuring state-of-the-art facilities and a vibrant community.",
          rating: b.rating || 4.8,
          reviews: 124,
          safetyScore: 9.8,
          occupancy: '94%',
          fillingFast: true,
          verified: true,
          price: b.startingPrice || 6500,
          deposit: (b.startingPrice || 6500) * 2,
          amenities: b.amenities && b.amenities.length > 0 ? b.amenities : ['WiFi', 'Mess', 'Laundry'],
          facilities: b.facilities && b.facilities.length > 0 ? b.facilities : ['Gym', 'Cafeteria', 'Gaming Zone', 'Study Room'],
          roomTypes: b.floors?.[0]?.rooms?.slice(0, 4).map(r => ({
            type: r.roomNumber,
            price: b.startingPrice || 6500,
            deposit: (b.startingPrice || 6500) * 2,
            totalBeds: r.beds?.length || 2,
            availableBeds: r.beds?.filter(bd => bd.status === 'VACANT').length || 0,
            status: r.beds?.some(bed => bed.status === 'VACANT') ? 'Available' : 'Filling Fast',
            color: r.beds?.some(bed => bed.status === 'VACANT') ? '#10B981' : '#EF4444'
          })) || [
            { type: 'Single Sharing', name: 'Premium Single', price: b.startingPrice || 12000, deposit: (b.startingPrice || 12000) * 2, totalBeds: 1, availableBeds: 0, status: 'Full', color: '#EF4444' },
            { type: 'Double Sharing', name: 'Standard Double', price: b.startingPrice || 8500, deposit: (b.startingPrice || 8500) * 2, totalBeds: 2, availableBeds: 1, status: 'Available', color: '#10B981' }
          ],
          staff: b.staffInfo || { name: 'Rajesh Kumar', role: 'Chief Warden', contact: '+91 98765 43210' },
          menu: { 
            breakfast: 'Poha / Omelette / Tea', 
            lunch: 'Veg Thali / Curd / Salad', 
            dinner: 'Phulka / Mix Veg / Paneer' 
          },
          plans: [
            { name: 'Basic', price: 500, desc: 'Breakfast only' },
            { name: 'Standard', price: 1000, desc: 'Breakfast & Dinner' },
            { name: 'Premium', price: 1500, desc: 'All 3 Meals + Weekend Special' }
          ],
          policies: [
            { title: "Rent & Deposit", content: "Rent is due by the 5th of every month. Security deposit is refundable at the time of checkout." },
            { title: "Refund Policy", content: "Full refund if cancelled 15 days before move-in. Pro-rata basis after move-in." },
            { title: "Notice Period", content: "A mandatory 30-day notice period is required before vacating the premises." },
            { title: "Guest Policy", content: "Visitors allowed till 8 PM. Overnight stay for immediate family only with prior permission." },
            { title: "Curfew Timing", content: "Hostel gates close at 11:00 PM for safety. Late entry requires warden notification." }
          ],
          testimonials: [
            { name: "Rahul S.", text: "Best hostel in the city. The food is actually homely!", rating: 5 },
            { name: "Priya M.", text: "Very safe for girls, security is top-notch.", rating: 5 }
          ]
        };
        setHostel(mapped);
      } catch (err) {
        console.error('Error fetching building details, using mock data fallback:', err);
        // Fallback to mock data
        const mockHostel = MOCK_HOSTELS.find(h => h.id === id) || MOCK_HOSTELS[0];
        if (mockHostel) {
          const mappedMock = {
            id: mockHostel.id,
            name: mockHostel.name,
            location: mockHostel.locality + ', ' + mockHostel.city,
            distance: "500m from transit",
            gender: mockHostel.gender || 'Unisex',
            category: mockHostel.category || 'Professional',
            fillingFast: true,
            description: mockHostel.description || "A premium stay for students and professionals featuring state-of-the-art facilities and a vibrant community.",
            rating: mockHostel.rating || 4.5,
            reviews: 120,
            safetyScore: 9.5,
            occupancy: '85%',
            verified: true,
            price: mockHostel.price,
            deposit: mockHostel.price * 2,
            amenities: mockHostel.amenities || ['WiFi', 'AC', 'Laundry'],
            facilities: ['Gym', 'Cafeteria', 'Gaming Zone', 'Study Room'],
            roomTypes: [
              { type: 'Private Room', name: 'Premium Single', price: mockHostel.price + 2000, deposit: (mockHostel.price + 2000) * 2, totalBeds: 1, availableBeds: 1, status: 'Available', color: 'var(--accent-success)' },
              { type: '2 Sharing', name: 'Standard Double', price: mockHostel.price, deposit: mockHostel.price * 2, totalBeds: 2, availableBeds: 2, status: 'Available', color: 'var(--accent-success)' },
              { type: '3 Sharing', name: 'Economy Triple', price: mockHostel.price - 1500, deposit: (mockHostel.price - 1500) * 2, totalBeds: 3, availableBeds: 0, status: 'Few Left', color: 'var(--accent-warning)' }
            ],
            staff: { name: 'Admin', role: 'Warden', contact: '+91 00000 00000' },
            landmarks: [{ name: 'Nearby Station', distance: '500m' }, { name: 'Tech Park', distance: '1.2km' }],
            rules: ['No smoking indoors', 'Quiet hours 11 PM', 'Visitors allowed until 8 PM'],
            menu: { breakfast: 'Idli/Dosa', lunch: 'Rice, Dal, Curry', dinner: 'Roti, Paneer' },
            plans: [
              { name: 'Basic', price: 500, desc: 'Breakfast only' },
              { name: 'Standard', price: 1000, desc: 'Breakfast & Dinner' },
              { name: 'Premium', price: 1500, desc: 'All 3 Meals + Weekend Special' }
            ],
            policies: [
              { title: "Rent & Deposit", content: "Rent is due by the 5th of every month. Security deposit is refundable at the time of checkout." },
              { title: "Refund Policy", content: "Full refund if cancelled 15 days before move-in. Pro-rata basis after move-in." }
            ],
            testimonials: [
              { name: "Rahul S.", text: "Best hostel in the city. The food is actually homely!", rating: 5 },
              { name: "Priya M.", text: "Very safe for girls, security is top-notch.", rating: 5 }
            ]
          };
          setHostel(mappedMock);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchHostelDetails();
  }, [id]);

  if (loading) return <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-primary)', fontWeight: '800' }}>Crafting your premium stay...</div>;
  if (!hostel) return <div style={{ textAlign: 'center', padding: '5rem' }}>Property not found.</div>;

  const selectedRoom = hostel.roomTypes[selectedRoomIdx] || hostel.roomTypes[0];

  const handleBookingClick = (e) => {
    const token = localStorage.getItem('token');
    if (!token) {
      e.preventDefault();
      alert('Please Sign In to proceed with booking and payments.');
      window.location.href = '/login';
    }
  };

  const handleToggleWishlist = async () => {
    if (isSaving) return;
    setIsSaving(true);
    try {
      if (wishlistId) {
        await API.delete(`/tenant-portal/wishlist/${wishlistId}`);
        setWishlistId(null);
      } else {
        const res = await API.post('/tenant-portal/wishlist', {
          hostelId: hostel.id,
          hostelName: hostel.name,
          hostelLocation: hostel.location,
          hostelPrice: hostel.price,
          hostelImage: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
          hostelRating: hostel.rating,
          gender: hostel.gender,
          type: hostel.category
        });
        setWishlistId(res.data._id);
      }
    } catch (err) {
      console.error('Error toggling wishlist:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="listing-premium" style={{ background: 'var(--bg-primary)', minHeight: '100vh', paddingBottom: '5rem' }}>
      {/* HEADER NAV */}
      <nav style={{ maxWidth: '1200px', margin: '0 auto', padding: '1.5rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button 
          onClick={() => navigate(-1)} 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.6rem', 
            background: 'none', 
            border: 'none', 
            color: 'var(--text-secondary)', 
            fontWeight: '700', 
            fontSize: '0.9rem', 
            cursor: 'pointer',
            padding: 0
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
          Go Back
        </button>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', padding: '0.6rem 1.5rem', borderRadius: '12px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
            Share
          </button>
          <button 
            onClick={handleToggleWishlist}
            disabled={isSaving}
            style={{ 
              background: wishlistId ? 'var(--accent-error)' : 'var(--bg-secondary)', 
              border: `1px solid ${wishlistId ? 'var(--accent-error)' : 'var(--border-color)'}`, 
              padding: '0.6rem 1.5rem', 
              borderRadius: '12px', 
              fontWeight: '800', 
              cursor: 'pointer', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem', 
              color: wishlistId ? 'white' : 'var(--text-secondary)',
              transition: 'all 0.3s ease'
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill={wishlistId ? '#ef4444' : 'none'} stroke="currentColor" strokeWidth="2.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            {wishlistId ? 'Saved' : 'Save'}
          </button>
        </div>
      </nav>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
        {/* HERO SECTION */}
        <section className="hero-card" style={{ background: 'var(--bg-secondary)', borderRadius: '32px', padding: '2.5rem', boxShadow: '0 10px 40px rgba(0,0,0,0.04)', border: '1px solid var(--border-color)', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '2rem' }}>
            <div style={{ flex: 1, minWidth: '300px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.8rem' }}>
                <span style={{ background: '#EFF6FF', color: '#3B82F6', padding: '0.4rem 1rem', borderRadius: '30px', fontSize: '0.8rem', fontWeight: '800', border: '1px solid #DBEafe' }}>{hostel.gender}</span>
                <span style={{ background: '#F0FDF4', color: '#10B981', padding: '0.4rem 1rem', borderRadius: '30px', fontSize: '0.8rem', fontWeight: '800', border: '1px solid #DCFCE7' }}>{hostel.category}</span>
                {hostel.fillingFast && <span style={{ background: '#FFF7ED', color: '#F59E0B', padding: '0.4rem 1rem', borderRadius: '30px', fontSize: '0.8rem', fontWeight: '800', border: '1px solid #FFEDD5' }}>⚡ Filling Fast</span>}
              </div>
              <h1 style={{ fontSize: '3.5rem', fontWeight: '950', letterSpacing: '-2px', margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>{hostel.name}</h1>
              <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '500' }}>
                <ICONS.Location /> {hostel.location} • <span style={{ color: 'var(--accent-primary)', fontWeight: '700' }}>{hostel.distance}</span>
              </p>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#FEF3C7', color: '#D97706', padding: '0.5rem 1rem', borderRadius: '12px', fontWeight: '800' }}>
                  ★ {hostel.rating} <span style={{ fontSize: '0.8rem', fontWeight: '600' }}>({hostel.reviews} Reviews)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10B981', fontWeight: '700' }}>
                  <ICONS.Security /> Verified Property
                </div>
              </div>
            </div>

            <div style={{ background: 'var(--bg-primary)', padding: '2rem', borderRadius: '24px', border: '1px solid var(--border-color)', textAlign: 'right' }}>
              <p style={{ margin: 0, color: 'var(--text-secondary)', fontWeight: '700', fontSize: '0.9rem' }}>Starting from</p>
              <div style={{ fontSize: '3rem', fontWeight: '950', color: 'var(--text-primary)', lineHeight: '1' }}>₹{hostel.price.toLocaleString()}<span style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', fontWeight: '600' }}>/mo</span></div>
              <p style={{ margin: '0.5rem 0 1.5rem', color: 'var(--accent-success)', fontWeight: '800', fontSize: '0.85rem' }}>✓ Includes WiFi + Food + Cleaning</p>
              <div style={{ color: 'var(--accent-error)', fontWeight: '800', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '1.5rem' }}>No hidden charges</div>
              <Link to={`/booking/${hostel.id}`} style={{ display: 'block', background: 'var(--accent-primary)', color: 'white', textDecoration: 'none', padding: '1.2rem 2.5rem', borderRadius: '16px', fontWeight: '900', fontSize: '1.1rem', boxShadow: '0 10px 25px rgba(var(--accent-primary-rgb), 0.4)', transition: 'all 0.3s ease' }}>Book Now</Link>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.5rem', marginTop: '3rem', paddingTop: '2.5rem', borderTop: '1px solid #F1F5F9' }}>
            {[
              { label: "High Speed WiFi", icon: <ICONS.WiFi /> },
              { label: "3 Meals Included", icon: <ICONS.Meals /> },
              { label: "24/7 Security", icon: <ICONS.Security /> },
              { label: "Daily Cleaning", icon: <ICONS.Cleaning /> },
              { label: "Power Backup", icon: <ICONS.Power /> }
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: 'var(--text-secondary)', fontWeight: '700', fontSize: '0.95rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-primary)' }}>{item.icon}</div>
                {item.label}
              </div>
            ))}
          </div>
        </section>

        {/* IMAGE GALLERY */}
        <section style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem', height: '500px', marginBottom: '3rem' }}>
          <div style={{ borderRadius: '24px', overflow: 'hidden', border: '1px solid #E2E8F0' }}>
            <img src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80" alt="Hostel Exterior" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ flex: 1, borderRadius: '24px', overflow: 'hidden', border: '1px solid #E2E8F0' }}>
              <img src="https://images.unsplash.com/photo-1502672260266-1c1c24240938?auto=format&fit=crop&w=600&q=80" alt="Premium Room" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ flex: 1, borderRadius: '24px', overflow: 'hidden', border: '1px solid #E2E8F0', position: 'relative' }}>
              <img src="https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=600&q=80" alt="Bed Detail" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '800', cursor: 'pointer' }}>View All 24 Photos</div>
            </div>
          </div>
        </section>

        <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.2fr', gap: '2.5rem', alignItems: 'start' }}>
          {/* LEFT CONTENT */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            
            {/* ROOM SELECTION */}
            <section style={{ background: 'var(--bg-secondary)', borderRadius: '24px', padding: '2rem', border: '1px solid var(--border-color)' }}>
              <h2 style={{ fontSize: '1.8rem', fontWeight: '900', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.8rem', color: 'var(--text-primary)' }}>
                🛏️ Room & Bed Selection
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                {hostel.roomTypes.map((room, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => setSelectedRoomIdx(idx)}
                    style={{ 
                      padding: '2rem', 
                      borderRadius: '24px', 
                      background: selectedRoomIdx === idx ? 'var(--bg-primary)' : 'var(--bg-secondary)', 
                      border: `2px solid ${selectedRoomIdx === idx ? 'var(--accent-primary)' : 'var(--border-color)'}`, 
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      position: 'relative'
                    }}
                  >
                    <h4 style={{ fontSize: '1.4rem', fontWeight: '900', color: 'var(--text-primary)', margin: '0 0 0.5rem 0' }}>{room.type}</h4>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem', fontWeight: '600' }}>Starting from</p>
                    <div style={{ fontSize: '1.8rem', fontWeight: '950', color: 'var(--accent-primary)' }}>₹{room.price.toLocaleString()}<span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>/mo</span></div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'var(--bg-primary)', borderRadius: '16px', display: 'flex', gap: '2rem', border: '1px solid var(--border-color)' }}>
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: '0 0 0.5rem 0', fontWeight: '800', color: 'var(--text-primary)' }}>Selected: {selectedRoom.name}</h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0 }}>Spacious rooms with study desk, wardrobe and attached balcony. Premium furniture included.</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>BED AVAILABILITY</div>
                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    {[...Array(selectedRoom.totalBeds)].map((_, i) => (
                      <div key={i} style={{ width: '30px', height: '10px', borderRadius: '4px', background: i < (selectedRoom.totalBeds - selectedRoom.availableBeds) ? 'var(--accent-error)' : 'var(--accent-success)' }}></div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* FOOD & MESS */}
            <section style={{ background: 'white', borderRadius: '24px', padding: '2rem', border: '1px solid #E2E8F0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.8rem', fontWeight: '900', margin: 0, display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                  🍽️ Dining & Nutrition
                </h2>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <span style={{ background: '#F0FDF4', color: '#10B981', padding: '0.4rem 0.8rem', borderRadius: '8px', fontSize: '0.75rem', fontWeight: '800' }}>Hygienic</span>
                  <span style={{ background: '#F0FDF4', color: '#10B981', padding: '0.4rem 0.8rem', borderRadius: '8px', fontSize: '0.75rem', fontWeight: '800' }}>Homely</span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
                {Object.entries(hostel.menu).map(([meal, content]) => (
                  <div key={meal} style={{ padding: '1.5rem', background: '#F8FAFC', borderRadius: '20px', border: '1px solid #E2E8F0' }}>
                    <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.75rem', fontWeight: '900', color: meal === 'lunch' ? '#10B981' : meal === 'dinner' ? '#F59E0B' : '#3B82F6', textTransform: 'uppercase' }}>{meal}</p>
                    <p style={{ margin: 0, fontWeight: '800', fontSize: '1rem' }}>{content}</p>
                  </div>
                ))}
              </div>

              <h4 style={{ fontWeight: '900', marginBottom: '1rem' }}>Subscription Plans</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                {hostel.plans.map(plan => (
                  <div key={plan.name} style={{ padding: '1.2rem', borderRadius: '16px', border: '1px solid #E2E8F0', background: plan.name === 'Standard' ? '#EFF6FF' : 'white' }}>
                    <div style={{ fontWeight: '900', color: '#0F172A' }}>{plan.name}</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: '950', margin: '0.3rem 0' }}>₹{plan.price}</div>
                    <div style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: '600' }}>{plan.desc}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* AMENITIES & FACILITIES */}
            <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
              <div style={{ background: 'white', borderRadius: '24px', padding: '2rem', border: '1px solid #E2E8F0' }}>
                <h3 style={{ fontSize: '1.4rem', fontWeight: '900', marginBottom: '1.5rem' }}>Core Amenities</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem' }}>
                  {hostel.amenities.map(amn => (
                    <div key={amn} style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: '#475569', fontWeight: '700', fontSize: '0.9rem' }}>
                      <ICONS.Check /> {amn}
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ background: 'white', borderRadius: '24px', padding: '2rem', border: '1px solid #E2E8F0' }}>
                <h3 style={{ fontSize: '1.4rem', fontWeight: '900', marginBottom: '1.5rem' }}>Building Facilities</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem' }}>
                  {hostel.facilities.map(fac => (
                    <div key={fac} style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: '#475569', fontWeight: '700', fontSize: '0.9rem' }}>
                      <ICONS.Check /> {fac}
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>

          {/* RIGHT SIDEBAR */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* BOOKING SUMMARY */}
            <div style={{ background: 'white', borderRadius: '24px', padding: '2rem', border: '1px solid #E2E8F0', position: 'sticky', top: '2rem' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '900', marginBottom: '1.5rem' }}>Move-in Estimates</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748B', fontWeight: '700' }}>First Month Rent</span>
                  <span style={{ fontWeight: '800' }}>₹{selectedRoom.price.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748B', fontWeight: '700' }}>Security Deposit</span>
                  <span style={{ fontWeight: '800' }}>₹{selectedRoom.deposit.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748B', fontWeight: '700' }}>Maintenance / Setup</span>
                  <span style={{ fontWeight: '800' }}>₹999</span>
                </div>
                <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '1.2rem', marginTop: '0.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '1.2rem', fontWeight: '900' }}>Total Due</span>
                    <span style={{ fontSize: '1.8rem', fontWeight: '950', color: '#3B82F6' }}>₹{(selectedRoom.price + selectedRoom.deposit + 999).toLocaleString()}</span>
                  </div>
                </div>
              </div>
              <button onClick={handleBookingClick} style={{ width: '100%', background: '#3B82F6', color: 'white', border: 'none', padding: '1.4rem', borderRadius: '16px', fontWeight: '900', fontSize: '1.1rem', marginTop: '2rem', cursor: 'pointer', boxShadow: '0 10px 25px rgba(59, 130, 246, 0.4)' }}>Reserve This Bed</button>
              <button style={{ width: '100%', background: 'white', color: '#0F172A', border: '1px solid #E2E8F0', padding: '1.2rem', borderRadius: '16px', fontWeight: '800', marginTop: '1rem', cursor: 'pointer' }}>Schedule Visit</button>
              
              <div style={{ marginTop: '1.5rem', padding: '1.2rem', background: '#F8FAFC', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#3B82F6', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800' }}>M</div>
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: '800' }}>Manager: {hostel.staff?.name || 'Property Manager'}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: '600' }}>Available 9 AM - 8 PM</div>
                  </div>
                </div>
                <button style={{ width: '100%', background: '#F1F5F9', color: '#3B82F6', border: 'none', padding: '0.8rem', borderRadius: '12px', fontWeight: '800', marginTop: '1rem', cursor: 'pointer' }}>Contact Owner</button>
              </div>
            </div>

            {/* POLICIES ACCORDION */}
            <div style={{ background: 'var(--bg-secondary)', borderRadius: '24px', padding: '2.5rem', border: '1px solid var(--border-color)' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '900', marginBottom: '2rem', color: 'var(--text-primary)' }}>Policy Details</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[
                  { q: "Security Deposit", a: "One month's rent (Refundable)" },
                  { q: "Notice Period", a: "30 days before vacating" },
                  { q: "Electricity", a: "Prepaid meter/actual usage" },
                  { q: "Gate Timings", a: "No entry after 11:30 PM" }
                ].map((item, i) => (
                  <div key={i} style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
                    <div 
                      onClick={() => setOpenPolicy(openPolicy === i ? -1 : i)}
                      style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', fontWeight: '800', color: 'var(--text-primary)' }}
                    >
                      {item.q}
                      <span>{openPolicy === i ? '−' : '+'}</span>
                    </div>
                    {openPolicy === i && <p style={{ marginTop: '0.8rem', color: 'var(--text-secondary)', fontSize: '0.95rem', fontWeight: '500' }}>{item.a}</p>}
                  </div>
                ))}
              </div>
            </div>

            {/* SAFETY BADGES */}
            <div style={{ background: 'linear-gradient(135deg, #0F172A, #1E293B)', borderRadius: '24px', padding: '2rem', color: 'white' }}>
              <h3 style={{ fontSize: '1.4rem', fontWeight: '900', marginBottom: '1.5rem' }}>Safety & Trust</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ width: '44px', height: '44px', background: 'rgba(255,255,255,0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ICONS.Security /></div>
                  <div>
                    <div style={{ fontWeight: '800' }}>24/7 Security Guard</div>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: '#94A3B8' }}>Physical security presence at gate</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ width: '44px', height: '44px', background: 'rgba(255,255,255,0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ICONS.WiFi /></div>
                  <div>
                    <div style={{ fontWeight: '800' }}>CCTV Surveillance</div>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: '#94A3B8' }}>All common areas monitored</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ width: '44px', height: '44px', background: 'rgba(255,255,255,0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ICONS.Check /></div>
                  <div>
                    <div style={{ fontWeight: '800' }}>Biometric Entry</div>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: '#94A3B8' }}>Verified access only</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SOCIAL PROOF */}
        <section style={{ marginTop: '4rem', padding: '4rem', background: '#3B82F6', borderRadius: '32px', color: 'white', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '950', marginBottom: '1rem' }}>Join Our Community</h2>
          <p style={{ fontSize: '1.2rem', color: '#DBEafe', marginBottom: '3rem' }}>Rated 4.8/5 by over 200 happy residents</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {hostel.testimonials.map((t, idx) => (
              <div key={idx} style={{ background: 'rgba(255,255,255,0.1)', padding: '2rem', borderRadius: '24px', backdropFilter: 'blur(10px)', textAlign: 'left', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ color: '#FCD34D', marginBottom: '1rem' }}>★★★★★</div>
                <p style={{ fontSize: '1.1rem', fontWeight: '600', fontStyle: 'italic', marginBottom: '1.5rem' }}>"{t.text}"</p>
                <div style={{ fontWeight: '800' }}>- {t.name}</div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <style>{`
        .listing-premium {
          font-family: 'Outfit', sans-serif;
        }
        .hero-card, .card {
          transition: transform 0.3s ease;
        }
        .hero-card:hover {
          transform: translateY(-5px);
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        main > section {
          animation: fadeIn 0.8s cubic-bezier(0.4, 0, 0.2, 1) both;
        }
      `}</style>
    </div>
  );
};

export default Listing;
