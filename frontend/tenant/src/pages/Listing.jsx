import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../api/axios';

const ICONS = {
  WiFi: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>,
  Meals: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg>,
  Security: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  Cleaning: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m3 21 1.9-1.9a1 1 0 0 1 1.4 0l2.5 2.5a1 1 0 0 0 1.4 0l11.1-11.1a1 1 0 0 0 0-1.4l-2.5-2.5a1 1 0 0 0-1.4 0L4.3 18.7a1 1 0 0 0 0 1.4L6.1 22"/><path d="m11.6 15.8 1.8-1.8"/><path d="m13.8 13.6 1.8-1.8"/><path d="m15.8 11.6 1.8-1.8"/><path d="m11 11 2-2"/><path d="m5 5 2-2"/></svg>,
  Power: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>,
  Location: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  Check: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  AC: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7h18"/><path d="M3 12h18"/><path d="M3 17h18"/><path d="M7 7v10"/><path d="M17 7v10"/></svg>,
  Gym: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m6.5 6.5 11 11"/><path d="m11.8 5.8 5.4 5.4"/><path d="m6.8 10.8 5.4 5.4"/><circle cx="5.5" cy="5.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>,
  Laundry: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="13" r="5"/><path d="M4 12V4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8"/><path d="M20 12v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8"/></svg>
};

const MOCK_SEED_DETAILS = [
  { id: 'b1', name: 'Alpha Tower', location: 'North Campus, Bengaluru', city: 'bengaluru', price: 8500, gender: 'Boys', category: 'professional', rating: 4.9, description: "Premium hostel for students and professionals in the heart of Bengaluru's North Campus." },
  { id: 'b2', name: 'Beta Block', location: 'South Campus, Hyderabad', city: 'hyderabad', price: 6500, gender: 'Girls', category: 'student', rating: 4.8, description: "Safe and secure girls-only hostel with 24/7 security and home-style food in Hyderabad." },
  { id: 'b3', name: 'Zenith Living Hyderabad', location: 'Gachibowli, Hyderabad', city: 'hyderabad', price: 15500, gender: 'Mixed', category: 'professional', rating: 4.9, description: "Zenith Living offers a premium co-living experience in Gachibowli with high-end amenities." },
  { id: 'b4', name: 'Cyber Hub Stay', location: 'HITEC City, Hyderabad', city: 'hyderabad', price: 11500, gender: 'Men', category: 'professional', rating: 4.6, description: "Modern stay located in the heart of Hyderabad's IT hub, perfect for young professionals." },
  { id: 'b5', name: 'Kondapur Komfort', location: 'Kondapur, Hyderabad', city: 'hyderabad', price: 9500, gender: 'Women', category: 'student', rating: 4.4, description: "Safe and comfortable hostel for women in Kondapur with homely food and great community." },
  { id: 'b6', name: 'Zeta Zone', location: 'Sector 12, Bengaluru', city: 'bengaluru', price: 7500, gender: 'Girls', category: 'student', rating: 4.6, description: "Quiet and peaceful study-focused hostel for female students in Bengaluru." },
  { id: 'b7', name: 'Eta Heights', location: 'Main Market, Hyderabad', city: 'hyderabad', price: 9000, gender: 'Mixed', category: 'professional', rating: 4.7, description: "Centrally located property with easy access to public transport and IT parks." },
  { id: 'b8', name: 'Theta Terraces', location: 'Lake View, Mumbai', city: 'mumbai', price: 11000, gender: 'Girls', category: 'luxury', rating: 4.8, description: "Lakeside views with premium safety and housekeeping services for girls." },
  { id: 'b9', name: 'Iota Inn', location: 'Central Hub, Bengaluru', city: 'bengaluru', price: 5500, gender: 'Boys', category: 'student', rating: 4.5, description: "High-occupancy student stay with basic needs covered at an affordable price." },
  { id: 'b10', name: 'Kappa Korner', location: 'East Side, Hyderabad', city: 'hyderabad', price: 4500, gender: 'Mixed', category: 'student', rating: 4.4, description: "Budget-friendly rooms for students looking for simplicity and community." },
  { id: 'b11', name: 'Lambda Lodge', location: 'Science Park, Mumbai', city: 'mumbai', price: 8000, gender: 'Girls', category: 'professional', rating: 4.7, description: "Peaceful environment near Mumbai's research and education parks." },
  { id: 'b12', name: 'Mu Mansion', location: 'Royal Lane, Bengaluru', city: 'bengaluru', price: 18000, gender: 'Mixed', category: 'luxury', rating: 5.0, description: "The pinnacle of royal student living with premium services and VIP dining." },
  { id: 'b13', name: 'Gowlidoddy Grand', location: 'Gowlidoddy, Hyderabad', city: 'hyderabad', price: 10000, gender: 'Unisex', category: 'professional', rating: 4.5, description: "Spacious and modern living in Gowlidoddy with excellent connectivity." },
  { id: 'b14', name: 'KPHB Residency', location: 'KPHB, Hyderabad', city: 'hyderabad', price: 8000, gender: 'Men', category: 'student', rating: 4.3, description: "Budget-friendly stay in KPHB with all essential facilities for students." },
  { id: 'b15', name: 'Metro Hub Mumbai', location: 'Powai, Mumbai', city: 'mumbai', price: 17000, gender: 'Unisex', category: 'luxury', rating: 4.5, description: "Executive stay in Powai with premium amenities and gym access." },
  { id: 'b16', name: 'Serene Stays', location: 'Whitefield, Bengaluru', city: 'bengaluru', price: 14500, gender: 'Unisex', category: 'professional', rating: 4.7, description: "Peaceful environment in Whitefield, ideal for IT professionals." },
  { id: 'b17', name: 'Lanco Hills Living', location: 'Manikonda, Hyderabad', city: 'hyderabad', price: 13500, gender: 'Women', category: 'student', rating: 4.6, description: "Luxury living with a view in Lanco Hills, exclusively for women." },
  { id: 'b18', name: 'Urban Den', location: 'Andheri, Mumbai', city: 'mumbai', price: 18000, gender: 'Men', category: 'professional', rating: 4.4, description: "Modern co-living space in Andheri with work-from-home facilities." },
  { id: 'b19', name: 'Madhapur Metro View', location: 'Madhapur, Hyderabad', city: 'hyderabad', price: 12500, gender: 'Unisex', category: 'professional', rating: 4.7, description: "Stay right next to the metro in Madhapur with easy access to the city." },
  { id: 'b20', name: 'Campus Core', location: 'Manipal, Bengaluru', city: 'bengaluru', price: 7500, gender: 'Men', category: 'student', rating: 4.5, description: "Student-focused stay near the campus with a vibrant community." },
  { id: 'b21', name: 'Journalist Colony Suites', location: 'Journalist colony, Hyderabad', city: 'hyderabad', price: 14500, gender: 'Unisex', category: 'professional', rating: 4.7, description: "Premium suites in the quiet Journalist colony area of Hyderabad." },
  { id: 'b22', name: 'Kukatpally Komfort', location: 'Kukatpally, Hyderabad', city: 'hyderabad', price: 9000, gender: 'Women', category: 'student', rating: 4.4, description: "Comfortable and secure stay in Kukatpally for female students and workers." }
];

const Listing = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('photos');
  const [selectedRoomIdx, setSelectedRoomIdx] = useState(0);
  const [hostel, setHostel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openPolicy, setOpenPolicy] = useState(0);

  useEffect(() => {
    const fetchHostelDetails = async () => {
      try {
        let b;
        // Check if ID is a mock ID (e.g., b1, b2, etc.)
        if (id.startsWith('b') && id.length <= 3) {
          const mock = MOCK_SEED_DETAILS.find(m => m.id === id);
          if (mock) {
            b = {
              _id: mock.id,
              name: mock.name,
              address: mock.location,
              locationCity: mock.city,
              category: mock.category,
              genderType: mock.gender,
              description: mock.description,
              rating: mock.rating,
              startingPrice: mock.price,
              amenities: ['WiFi', 'AC', 'Laundry', 'Security'],
              staffInfo: { name: 'Rajesh Kumar', role: 'Chief Warden', contact: '+91 98765 43210' }
            };
          }
        } else {
          const response = await API.get(`/buildings/${id}`);
          b = response.data;
        }
        
        if (!b) throw new Error('Property not found');

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
          amenities: b.amenities?.length > 0 ? b.amenities : ['WiFi', 'Mess', 'Laundry', 'AC', 'Power Backup'],
          facilities: ['Common Lounge', 'Study Room', 'Biometric Entry', 'CCTV', 'Parking', 'Dining Hall'],
          roomTypes: b.floors?.flatMap(f => f.rooms).slice(0, 4).map(r => ({
            type: r.roomNumber.toString().includes('1') ? 'Single Sharing' : 'Double Sharing',
            name: `Room ${r.roomNumber}`,
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
        console.error('Error fetching building details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHostelDetails();
  }, [id]);

  if (loading) return <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', color: '#3B82F6', fontWeight: '800' }}>Crafting your premium stay...</div>;
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

  return (
    <div className="listing-premium" style={{ background: '#F8FAFC', minHeight: '100vh', paddingBottom: '5rem' }}>
      {/* HEADER NAV */}
      <nav style={{ maxWidth: '1200px', margin: '0 auto', padding: '1.5rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/search" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none', color: '#64748B', fontWeight: '700', fontSize: '0.9rem' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
          Back to Search
        </Link>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button style={{ background: 'white', border: '1px solid #E2E8F0', padding: '0.6rem 1rem', borderRadius: '12px', fontWeight: '700', cursor: 'pointer' }}>Share</button>
          <button style={{ background: 'white', border: '1px solid #E2E8F0', padding: '0.6rem 1rem', borderRadius: '12px', fontWeight: '700', cursor: 'pointer' }}>Save</button>
        </div>
      </nav>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
        {/* HERO SECTION */}
        <section className="hero-card" style={{ background: 'white', borderRadius: '32px', padding: '2.5rem', boxShadow: '0 10px 40px rgba(0,0,0,0.04)', border: '1px solid #E2E8F0', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '2rem' }}>
            <div style={{ flex: 1, minWidth: '300px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.8rem' }}>
                <span style={{ background: '#EFF6FF', color: '#3B82F6', padding: '0.4rem 1rem', borderRadius: '30px', fontSize: '0.8rem', fontWeight: '800', border: '1px solid #DBEafe' }}>{hostel.gender}</span>
                <span style={{ background: '#F0FDF4', color: '#10B981', padding: '0.4rem 1rem', borderRadius: '30px', fontSize: '0.8rem', fontWeight: '800', border: '1px solid #DCFCE7' }}>{hostel.category}</span>
                {hostel.fillingFast && <span style={{ background: '#FFF7ED', color: '#F59E0B', padding: '0.4rem 1rem', borderRadius: '30px', fontSize: '0.8rem', fontWeight: '800', border: '1px solid #FFEDD5' }}>⚡ Filling Fast</span>}
              </div>
              <h1 style={{ fontSize: '3.5rem', fontWeight: '950', letterSpacing: '-2px', margin: '0 0 0.5rem 0', color: '#0F172A' }}>{hostel.name}</h1>
              <p style={{ fontSize: '1.2rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '500' }}>
                <ICONS.Location /> {hostel.location} • <span style={{ color: '#3B82F6', fontWeight: '700' }}>{hostel.distance}</span>
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

            <div style={{ background: '#F8FAFC', padding: '2rem', borderRadius: '24px', border: '1px solid #E2E8F0', textAlign: 'right' }}>
              <p style={{ margin: 0, color: '#64748B', fontWeight: '700', fontSize: '0.9rem' }}>Starting from</p>
              <div style={{ fontSize: '3rem', fontWeight: '950', color: '#0F172A', lineHeight: '1' }}>₹{hostel.price.toLocaleString()}<span style={{ fontSize: '1.2rem', color: '#64748B', fontWeight: '600' }}>/mo</span></div>
              <p style={{ margin: '0.5rem 0 1.5rem', color: '#10B981', fontWeight: '800', fontSize: '0.85rem' }}>✓ Includes WiFi + Food + Cleaning</p>
              <div style={{ color: '#EF4444', fontWeight: '800', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '1.5rem' }}>No hidden charges</div>
              <Link to={`/booking/${hostel.id}`} style={{ display: 'block', background: '#3B82F6', color: 'white', textDecoration: 'none', padding: '1.2rem 2.5rem', borderRadius: '16px', fontWeight: '900', fontSize: '1.1rem', boxShadow: '0 10px 25px rgba(59, 130, 246, 0.4)', transition: 'all 0.3s ease' }}>Book Now</Link>
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
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: '#475569', fontWeight: '700', fontSize: '0.95rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3B82F6' }}>{item.icon}</div>
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
            <section style={{ background: 'white', borderRadius: '24px', padding: '2rem', border: '1px solid #E2E8F0' }}>
              <h2 style={{ fontSize: '1.8rem', fontWeight: '900', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                🛏️ Room & Bed Selection
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.2rem' }}>
                {hostel.roomTypes.map((room, i) => (
                  <div 
                    key={i} 
                    onClick={() => setSelectedRoomIdx(i)}
                    style={{ 
                      padding: '1.5rem', 
                      borderRadius: '20px', 
                      border: selectedRoomIdx === i ? '2px solid #3B82F6' : '1px solid #E2E8F0',
                      background: selectedRoomIdx === i ? '#EFF6FF' : 'white',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: '900', color: room.color, textTransform: 'uppercase' }}>{room.status}</span>
                      <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: room.color }}></div>
                    </div>
                    <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', fontWeight: '800' }}>{room.type}</h3>
                    <p style={{ fontSize: '1.4rem', fontWeight: '900', color: '#0F172A' }}>₹{room.price.toLocaleString()}<span style={{ fontSize: '0.8rem', color: '#64748B' }}>/mo</span></p>
                    <div style={{ marginTop: '1rem', fontSize: '0.85rem', color: '#64748B', fontWeight: '600' }}>
                      {room.availableBeds} of {room.totalBeds} beds available
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: '2rem', padding: '1.5rem', background: '#F8FAFC', borderRadius: '16px', display: 'flex', gap: '2rem' }}>
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: '0 0 0.5rem 0', fontWeight: '800' }}>Selected: {selectedRoom.name}</h4>
                  <p style={{ fontSize: '0.9rem', color: '#64748B', margin: 0 }}>Spacious rooms with study desk, wardrobe and attached balcony. Premium furniture included.</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: '800', color: '#64748B', marginBottom: '0.4rem' }}>BED AVAILABILITY</div>
                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    {[...Array(selectedRoom.totalBeds)].map((_, i) => (
                      <div key={i} style={{ width: '30px', height: '10px', borderRadius: '4px', background: i < (selectedRoom.totalBeds - selectedRoom.availableBeds) ? '#EF4444' : '#10B981' }}></div>
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
            <div style={{ background: 'white', borderRadius: '24px', padding: '2rem', border: '1px solid #E2E8F0' }}>
              <h3 style={{ fontSize: '1.4rem', fontWeight: '900', marginBottom: '1.5rem' }}>Policies</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {hostel.policies.map((p, idx) => (
                  <div key={idx} style={{ borderBottom: idx === hostel.policies.length - 1 ? 'none' : '1px solid #F1F5F9' }}>
                    <button 
                      onClick={() => setOpenPolicy(openPolicy === idx ? -1 : idx)}
                      style={{ width: '100%', padding: '1rem 0', background: 'none', border: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', textAlign: 'left', fontWeight: '800', color: '#0F172A' }}
                    >
                      {p.title}
                      <span style={{ fontSize: '1.2rem' }}>{openPolicy === idx ? '−' : '+'}</span>
                    </button>
                    {openPolicy === idx && (
                      <div style={{ paddingBottom: '1rem', fontSize: '0.9rem', color: '#64748B', lineHeight: '1.6', fontWeight: '500' }}>{p.content}</div>
                    )}
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
