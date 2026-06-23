import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import {
  Check, MapPin, Bed, Users, ShieldCheck, Star, DoorOpen, LayoutGrid, Lock,
  ChevronDown, ChevronUp, CheckCircle2, ChevronRight, Wind, Bath, Info, Zap, User, ArrowLeft, Heart, Share,
  Search, List, Filter, Shield, Calendar, Award, Sparkles, CheckCircle, Coffee, Clock,
  Wifi, WashingMachine, SprayCan, GlassWater, Dumbbell, Car, Video, Snowflake, Zap as ZapIcon,
  ChefHat, Sofa
} from 'lucide-react';
import API from '../api/axios';
import socket, { connectSocket, disconnectSocket } from '../utils/socket';
import { getAmenitiesFromBuilding, getHostelTypeLabel } from '../utils/buildingHelpers';
import './Listing.css';
import ImageModal from '../components/ImageModal';

const Listing = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();

  const [hostel, setHostel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalInfo, setModalInfo] = useState({ isOpen: false, image: '' });

  // Flow Step State: 1=Hostel Details, 2=Floors, 3=Rooms, 4=Beds
  const [activeStep, setActiveStep] = useState(1);
  const [showAllAmenities, setShowAllAmenities] = useState(false);
  const [selectedCapacityFilter, setSelectedCapacityFilter] = useState(() => {
    const st = searchParams.get('stayType');
    if (st === 'Single') return 1;
    if (st && !isNaN(Number(st))) return Number(st);
    return null;
  });

  // Selection state for booking
  const [selectedFloor, setSelectedFloor] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedBed, setSelectedBed] = useState(null);

  // Booking details
  const [moveInDate, setMoveInDate] = useState('');
  const [agreementType, setAgreementType] = useState('Monthly');

  useEffect(() => {
    const fetchHostel = async () => {
      try {
        const res = await API.get(`/buildings/public/${id}`);
        setHostel(res.data);
      } catch (error) {
        console.error('Failed to fetch building data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHostel();
    connectSocket(id);
    socket.on('hostelUpdated', (updatedHostel) => {
      if (updatedHostel._id === id || (updatedHostel.buildings && updatedHostel.buildings.includes(id))) {
        fetchHostel();
      }
    });
    socket.on('bedStatusUpdated', () => fetchHostel());

    return () => {
      socket.off('hostelUpdated');
      socket.off('bedStatusUpdated');
      disconnectSocket();
    };
  }, [id]);

  // ─── Helpers ────────────────────────────────────────────────────────────────

  const checkOccupied = (bed) =>
    bed.status === 'OCCUPIED' ||
    (hostel?.filledBeds && hostel.filledBeds.some(b => String(b.bedId) === String(bed._id)));

  const renderField = (value, fallback = 'No Data') =>
    (value === null || value === undefined || value === '') ? fallback : value;

  const deduplicateAddress = (address) => {
    if (!address) return 'No Address Available';
    // Clean up extra spaces and normalize commas
    const cleaned = address.replace(/\s+/g, ' ').replace(/\s*,\s*/g, ',');
    const parts = cleaned.split(',').map(p => p.trim()).filter(Boolean);
    const uniqueParts = [...new Set(parts)];
    return uniqueParts.join(', ');
  };

  const getSharingLabel = (cap) => {
    const n = Number(cap);
    if (n >= 6) return '6+ Sharing';
    return `${n} Sharing`;
  };

  const getFloorStats = (floor, capacityFilter = null) => {
    let totalBeds = 0, occupiedBeds = 0, roomCount = 0;
    if (floor.rooms) {
      floor.rooms.forEach(r => {
        if (!capacityFilter || Number(r.capacity) === capacityFilter) {
          roomCount++;
          if (r.beds) {
            totalBeds += r.beds.length;
            occupiedBeds += r.beds.filter(b => checkOccupied(b)).length;
          }
        }
      });
    }
    const availableBeds = totalBeds - occupiedBeds;
    const availabilityPercent = totalBeds > 0 ? Math.round((availableBeds / totalBeds) * 100) : 100;
    return { totalBeds, occupiedBeds, availableBeds, availabilityPercent, roomCount };
  };

  const getRoomStats = (room) => {
    const total = room.beds?.length || 0;
    const occupied = room.beds?.filter(b => checkOccupied(b)).length || 0;
    return { total, occupied, available: total - occupied };
  };

  const getAvailableBedsCount = () => {
    if (!hostel?.floors) return hostel?.totalBeds - (hostel?.filledBeds?.length || 0);
    let totalAvail = 0;
    hostel.floors.forEach(floor => {
      if (floor.rooms) {
        floor.rooms.forEach(room => {
          if (room.beds) {
            totalAvail += room.beds.filter(b => !checkOccupied(b)).length;
          }
        });
      }
    });
    return totalAvail > 0 ? totalAvail : (hostel.totalBeds - (hostel.filledBeds?.length || 0));
  };

  const getAmenityIcon = (am) => {
    const l = am.toLowerCase();
    if (l.includes('wifi') || l.includes('wi-fi')) return <Wifi size={20} />;
    if (l.includes('laundry')) return <Coffee size={20} />; // fallback
    if (l.includes('housekeep') || l.includes('clean')) return <Sparkles size={20} />;
    if (l.includes('water')) return <Coffee size={20} />;
    if (l.includes('gym')) return <Dumbbell size={20} />;
    if (l.includes('parking')) return <Car size={20} />;
    if (l.includes('cctv') || l.includes('security')) return <Video size={20} />;
    if (l.includes('ac') || l.includes('air')) return <Snowflake size={20} />;
    if (l.includes('power')) return <ZapIcon size={20} />;
    if (l.includes('kitchen') || l.includes('breakfast') || l.includes('lunch') || l.includes('dinner')) return <ChefHat size={20} />;
    if (l.includes('lounge') || l.includes('furnished')) return <Sofa size={20} />;
    return <CheckCircle2 size={20} />;
  };

  // ─── Flow handlers ────────────────────────────────────────────────────────

  const handleFloorSelect = (floor) => {
    setSelectedFloor(floor);
    setSelectedRoom(null);
    setSelectedBed(null);
    setActiveStep(3);
  };

  const handleRoomSelect = (room, floorCtx) => {
    if (floorCtx && !selectedFloor) setSelectedFloor(floorCtx);
    setSelectedRoom(room);
    setSelectedBed(null);
    setActiveStep(4);
  };

  const handleBedSelect = (bed, room, floor) => {
    if (!checkOccupied(bed)) {
      setSelectedBed(bed);
      if (room) setSelectedRoom(room);
      if (floor) setSelectedFloor(floor);
    }
  };

  const handleClearSelection = () => {
    setSelectedFloor(null);
    setSelectedRoom(null);
    setSelectedBed(null);
  };

  const handleBooking = () => {
    if (!selectedBed || !selectedRoom || !selectedFloor) return;
    if (!localStorage.getItem('token')) { navigate('/login'); return; }

    navigate(`/booking/${id}`, {
      state: {
        buildingId: hostel._id,
        floorId: selectedFloor._id,
        roomId: selectedRoom._id,
        bedId: selectedBed._id,
        rentAmount: selectedRoom.rentAmount || hostel.startingPrice,
        securityDeposit: selectedRoom.securityDeposit || hostel.securityDeposit || 0,
        foodCharges: hostel.foodCharges || 0,
        maintenanceCharges: hostel.maintenanceCharges || 0,
        roomNumber: selectedRoom.roomNumber,
        bedNumber: selectedBed.bedNumber,
        floorNumber: selectedFloor.floorNumber,
        moveInDate,
        agreementType
      }
    });
  };

  // ─── Loading / Not Found ────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="liv-page-loading">
        <div className="liv-pulse-ring"></div>
        <p>Curating your premium stay...</p>
      </div>
    );
  }

  if (!hostel) {
    return (
      <div className="liv-page-notfound">
        <div className="liv-404-card">
          <h2>Property Unavailable</h2>
          <p>The property you are looking for has been removed or does not exist.</p>
          <button onClick={() => navigate(-1)} className="liv-btn-primary">Return to Explore</button>
        </div>
      </div>
    );
  }

  // ─── Pricing ────────────────────────────────────────────────────────────────

  const currentRent = (selectedRoom?.rentAmount > 0) ? selectedRoom.rentAmount :
    (selectedRoom?.capacity === 1 && hostel.rentSingle) ? hostel.rentSingle :
    (selectedRoom?.capacity === 2 && hostel.rentDouble) ? hostel.rentDouble :
    (selectedRoom?.capacity === 3 && hostel.rentTriple) ? hostel.rentTriple :
    (selectedRoom?.capacity === 4 && hostel.rent4Sharing) ? hostel.rent4Sharing :
    (selectedRoom?.capacity === 5 && hostel.rent5Sharing) ? hostel.rent5Sharing :
    (selectedRoom?.capacity >= 6 && hostel.rent6Sharing) ? hostel.rent6Sharing :
    (hostel.startingPrice || 0);

  const currentDeposit = selectedRoom?.securityDeposit || hostel.securityDeposit || 0;
  const foodCost = hostel.foodCharges || 0;
  const maintenanceCost = hostel.maintenanceCharges || 0;
  const totalDue = currentRent + currentDeposit + foodCost + maintenanceCost;

  const images = hostel.images || [];

  // ─── Flow steps config ────────────────────────────────────────────────────

  const flowSteps = [
    { id: 1, label: 'Hostel Details', sub: hostel.name },
    {
      id: 2, label: 'Floors',
      sub: hostel.floors?.length ? `${hostel.floors.length} Floor${hostel.floors.length > 1 ? 's' : ''}` : 'No floors'
    },
    {
      id: 3, label: 'Rooms',
      sub: selectedFloor ? `Floor ${selectedFloor.floorNumber}` : 'Select a floor'
    },
    {
      id: 4, label: 'Beds',
      sub: selectedRoom
        ? `Room ${selectedRoom.roomNumber}`
        : selectedFloor
          ? `Floor ${selectedFloor.floorNumber}`
          : 'Select a room'
    }
  ];

  // ─── Gallery ────────────────────────────────────────────────────────────────

  const renderGallery = () => {
    const len = images.length;
    if (len === 0) return <div className="liv-gallery-empty">No Visuals Available</div>;
    if (len === 1) return (
      <div className="liv-gallery-single" onClick={() => setModalInfo({ isOpen: true, image: images[0] })}>
        <img src={images[0]} alt="Property Main" />
      </div>
    );
    if (len === 2) return (
      <div className="liv-gallery-split" onClick={() => setModalInfo({ isOpen: true, image: images[0] })}>
        <div className="liv-gallery-split-left"><img src={images[0]} alt="Property Main" /></div>
        <div className="liv-gallery-split-right" onClick={(e) => { e.stopPropagation(); setModalInfo({ isOpen: true, image: images[1] }); }}>
          <img src={images[1]} alt="Property Sub" />
        </div>
      </div>
    );
    if (len === 3) return (
      <div className="liv-gallery-three">
        <div className="liv-gallery-main-three" onClick={() => setModalInfo({ isOpen: true, image: images[0] })}>
          <img src={images[0]} alt="Property Main" />
        </div>
        <div className="liv-gallery-right-three">
          <div className="liv-gallery-sub-three" onClick={() => setModalInfo({ isOpen: true, image: images[1] })}><img src={images[1]} alt="Property Sub 1" /></div>
          <div className="liv-gallery-sub-three" onClick={() => setModalInfo({ isOpen: true, image: images[2] })}><img src={images[2]} alt="Property Sub 2" /></div>
        </div>
      </div>
    );
    if (len === 4) return (
      <div className="liv-gallery-four">
        <div className="liv-gallery-main-four" onClick={() => setModalInfo({ isOpen: true, image: images[0] })}><img src={images[0]} alt="Property Main" /></div>
        <div className="liv-gallery-right-four">
          <div className="liv-gallery-sub-four" onClick={() => setModalInfo({ isOpen: true, image: images[1] })}><img src={images[1]} alt="Property Sub 1" /></div>
          <div className="liv-gallery-sub-four" onClick={() => setModalInfo({ isOpen: true, image: images[2] })}><img src={images[2]} alt="Property Sub 2" /></div>
          <div className="liv-gallery-sub-four" onClick={() => setModalInfo({ isOpen: true, image: images[3] })}><img src={images[3]} alt="Property Sub 3" /></div>
        </div>
      </div>
    );
    return (
      <div className="liv-gallery-container">
        <div className="liv-gallery-main" onClick={() => setModalInfo({ isOpen: true, image: images[0] })}>
          <img src={images[0]} alt="Property Main" />
        </div>
        <div className="liv-gallery-grid-right">
          {images.slice(1, 5).map((img, idx) => (
            <div key={idx} className="liv-gallery-sub-img" onClick={() => setModalInfo({ isOpen: true, image: img })}>
              <img src={img} alt={`Gallery Sub ${idx}`} />
              {idx === 3 && len > 5 && (
                <div className="liv-gallery-more-overlay"><span>+{len - 5} Photos</span></div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // ─── Beds to display in Step 4 ────────────────────────────────────────────

  const getBedGroups = () => {
    if (selectedRoom) {
      return [{ room: selectedRoom, floor: selectedFloor }];
    }
    if (selectedFloor) {
      return (selectedFloor.rooms || []).map(room => ({ room, floor: selectedFloor }));
    }
    return (hostel.floors || []).flatMap(floor =>
      (floor.rooms || []).map(room => ({ room, floor }))
    );
  };

  // ─── RENDER ────────────────────────────────────────────────────────────────

  return (
    <div className="liv-property-page">
      {/* Back bar */}
      <div className="liv-top-back-bar">
        <div className="liv-nav-inner">
          <button className="liv-btn-back" onClick={() => navigate('/search')}>
            <ArrowLeft size={16} /> Back to search
          </button>
          <div className="liv-nav-actions">
            <button className="liv-action-btn"><Share size={16} /> Share</button>
            <button className="liv-action-btn"><Heart size={16} /> Save</button>
          </div>
        </div>
      </div>

      <div className="liv-container">
        {renderGallery()}

        <div className="liv-layout">
          {/* ══════════════════ LEFT COLUMN ══════════════════ */}
          <div className="liv-content-main">
            {/* Property header */}
            <div className="liv-property-header">
              <div className="liv-verified-badge"><CheckCircle size={14} /> Verified Property</div>
              <div className="liv-title-row">
                <h1 className="liv-title">{renderField(hostel.name)}</h1>
                <div className="liv-rating-badge">
                  <span className="liv-stars">
                    <Star size={16} fill="#fbbf24" color="#fbbf24" />
                    <Star size={16} fill="#fbbf24" color="#fbbf24" />
                    <Star size={16} fill="#fbbf24" color="#fbbf24" />
                    <Star size={16} fill="#fbbf24" color="#fbbf24" />
                    <Star size={16} fill="#fbbf24" color="#fbbf24" />
                  </span>
                  <span className="liv-rating-value">{hostel.rating || '4.5'}</span>
                </div>
              </div>
              <div className="liv-address">
                <MapPin size={16} /><span>{deduplicateAddress(hostel.address)}</span>
              </div>
              <div className="liv-tag-pills">
                {(hostel.locality || hostel.locationCity) && (
                  <span className="liv-pill-tag location"><MapPin size={13} /> {hostel.locality || hostel.locationCity}</span>
                )}
                
                {getHostelTypeLabel(hostel) && (
                  <span className="liv-pill-tag gender">
                    <User size={13} /> {getHostelTypeLabel(hostel)}
                  </span>
                )}
                
                {hostel.category && hostel.category !== getHostelTypeLabel(hostel) && (
                  <span className="liv-pill-tag"><Award size={13} /> {hostel.category === 'Student' ? 'Student Friendly' : hostel.category === 'Luxury' ? 'Premium' : hostel.category === 'Professional' ? 'Professional' : hostel.category}</span>
                )}
                
                {hostel.foodCharges > 0 && <span className="liv-pill-tag food"><Coffee size={13} /> Food Included</span>}
                {hostel.isAC && <span className="liv-pill-tag ac"><Sparkles size={13} /> AC Rooms</span>}
              </div>
            </div>

            {/* Metric cards */}
            <div className="liv-metrics-row">
              <div className="liv-metric-card green">
                <span className="liv-metric-val">₹{renderField(hostel.startingPrice?.toLocaleString())}</span>
                <span className="liv-metric-lbl">Starting from / month</span>
              </div>
              <div className="liv-metric-card purple">
                <div className="liv-metric-header">
                  <span className="liv-metric-val">{getAvailableBedsCount()} Beds</span>
                  <Bed size={20} className="liv-metric-icon" />
                </div>
                <span className="liv-metric-lbl">Available</span>
              </div>
              <div className="liv-metric-card blue">
                <div className="liv-metric-header">
                  <span className="liv-metric-val">{hostel.floors?.length || 0} Floors</span>
                  <LayoutGrid size={20} className="liv-metric-icon" />
                </div>
                <span className="liv-metric-lbl">Total</span>
              </div>
              {hostel.security && (
                <div className="liv-metric-card light-purple">
                  <div className="liv-metric-header">
                    <span className="liv-metric-val">24/7</span>
                    <Shield size={20} className="liv-metric-icon" />
                  </div>
                  <span className="liv-metric-lbl">Security</span>
                </div>
              )}
            </div>

            {/* ══════ FLOW NAVIGATION ══════ */}
            <div className="liv-flow-nav">
              {flowSteps.map((step, idx) => (
                <React.Fragment key={step.id}>
                  <button
                    className={`liv-fnav-step ${activeStep === step.id ? 'active' : ''} ${activeStep > step.id ? 'done' : ''}`}
                    onClick={() => setActiveStep(step.id)}
                  >
                    <div className="liv-fnav-circle">
                      {activeStep > step.id ? <Check size={13} strokeWidth={3} /> : step.id}
                    </div>
                    <div className="liv-fnav-text">
                      <span className="liv-fnav-label">{step.label}</span>
                      <span className="liv-fnav-sub">{step.sub}</span>
                    </div>
                  </button>
                  {idx < flowSteps.length - 1 && (
                    <div className={`liv-fnav-connector ${activeStep > step.id ? 'done' : ''}`}>
                      <ChevronRight size={14} />
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* ══════════ STEP 1: HOSTEL DETAILS ══════════ */}
            {activeStep === 1 && (
              <div className="liv-step-panel fade-in">
                {/* Property Overview instead of About */}
                  {(() => {
                    // Strictly compute from actual floor data the owner created
                    const hasFloors = hostel.floors && hostel.floors.length > 0;
                    const rooms = hasFloors
                      ? hostel.floors.reduce((acc, f) => acc + (f.rooms?.length || 0), 0)
                      : 0;
                    const beds = hasFloors
                      ? hostel.floors.reduce((acc, f) =>
                          acc + (f.rooms?.reduce((bAcc, r) => bAcc + (r.beds?.length || 0), 0) || 0), 0)
                      : 0;
                    const floorCount = hasFloors ? hostel.floors.length : 0;
                    
                    // Collect unique sharing types actually created by owner
                    const sharingTypes = new Set();
                    if (hasFloors) {
                      hostel.floors.forEach(f => {
                        f.rooms?.forEach(r => {
                          const cap = Number(r.capacity);
                          if (cap > 0) sharingTypes.add(cap);
                        });
                      });
                    }
                    
                    return (
                      <div className="liv-prop-overview-tags">
                        {hostel.genderType && (
                          <div className="liv-overview-tag">
                            <User size={16} className="text-purple" />
                            <div className="liv-ot-info">
                              <span>Gender</span>
                              <strong>{hostel.genderType}</strong>
                            </div>
                          </div>
                        )}
                        {floorCount > 0 && (
                          <div className="liv-overview-tag">
                            <LayoutGrid size={16} className="text-blue" />
                            <div className="liv-ot-info">
                              <span>Floors</span>
                              <strong>{floorCount}</strong>
                            </div>
                          </div>
                        )}
                        {rooms > 0 && (
                          <div className="liv-overview-tag">
                            <DoorOpen size={16} className="text-blue" />
                            <div className="liv-ot-info">
                              <span>Rooms</span>
                              <strong>{rooms}</strong>
                            </div>
                          </div>
                        )}
                        {beds > 0 && (
                          <div className="liv-overview-tag">
                            <Bed size={16} className="text-orange" />
                            <div className="liv-ot-info">
                              <span>Capacity</span>
                              <strong>{beds} Beds</strong>
                            </div>
                          </div>
                        )}
                        {sharingTypes.size > 0 && (
                          <div className="liv-overview-tag">
                            <Users size={16} className="text-purple" />
                            <div className="liv-ot-info">
                              <span>Sharing</span>
                              <strong>
                                {Array.from(sharingTypes).sort((a,b)=>a-b).map(c =>
                                  getSharingLabel(c)
                                ).join(', ')}
                              </strong>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                  
                  {(() => {
                    if (!hostel.description) return null;
                    // Remove auto-generated metadata lines the old form used to create
                    const cleaned = hostel.description
                      .replace(/#+\s*Property Overview[\s\S]*?\n/gi, '')
                      .replace(/Type:\s*[^|\n]*/gi, '')
                      .replace(/Gender:\s*[^|\n]*/gi, '')
                      .replace(/Contact:\s*[^\n]*/gi, '')
                      .replace(/---+/g, '')
                      .replace(/\|/g, '')
                      .replace(/[#*]+/g, '')
                      .replace(/\n{3,}/g, '\n\n')
                      .trim();
                    if (!cleaned) return null;
                    return (
                      <div className="liv-about-section">
                        <h2 className="liv-section-title">About This Property</h2>
                        <p className="liv-desc-text" style={{ whiteSpace: 'pre-wrap' }}>{cleaned}</p>
                      </div>
                    );
                  })()}
                  
                  <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '20px 0' }} />
                  
                  <div className="liv-pricing-combined-section">
                    <h2 className="liv-section-title">Pricing & Fees</h2>
                    
                    <div className="liv-pricing-grid-new">
                      {/* Base Rent — only show if explicitly set */}
                      {hostel.startingPrice > 0 && (
                        <div className="liv-pricing-card-new">
                          <div className="liv-pc-icon base"><MapPin size={20} /></div>
                          <div className="liv-pc-details">
                            <span className="liv-pc-label">Base Rent Starts At</span>
                            <span className="liv-pc-value">₹{hostel.startingPrice.toLocaleString()} <small>/mo</small></span>
                          </div>
                        </div>
                      )}
                      
                      {/* Security Deposit — only if owner set it > 0 */}
                      {hostel.securityDeposit > 0 && (
                        <div className="liv-pricing-card-new">
                          <div className="liv-pc-icon deposit"><Lock size={20} /></div>
                          <div className="liv-pc-details">
                            <span className="liv-pc-label">Security Deposit</span>
                            <span className="liv-pc-value">₹{hostel.securityDeposit.toLocaleString()}</span>
                          </div>
                        </div>
                      )}

                      {/* Food — only if owner explicitly enabled mess */}
                      {hostel.mess === true && (
                        <div className="liv-pricing-card-new">
                          <div className="liv-pc-icon food"><Coffee size={20} /></div>
                          <div className="liv-pc-details">
                            <span className="liv-pc-label">Food (Monthly)</span>
                            <span className="liv-pc-value">
                              {hostel.foodCharges > 0 ? `₹${hostel.foodCharges.toLocaleString()}` : 'Included'} <small>/mo</small>
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Maintenance — only if owner explicitly set a non-default value */}
                      {hostel.maintenanceCharges > 0 && hostel.maintenanceCharges !== 799 && (
                        <div className="liv-pricing-card-new">
                          <div className="liv-pc-icon maint"><ZapIcon size={20} /></div>
                          <div className="liv-pc-details">
                            <span className="liv-pc-label">Maintenance</span>
                            <span className="liv-pc-value">₹{hostel.maintenanceCharges.toLocaleString()} <small>/mo</small></span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Dynamic Room Sharing Options */}
                    {(() => {
                      const optionsMap = new Map();
                      
                      if (hostel.floors) {
                        hostel.floors.forEach(f => {
                          if (f.rooms) {
                            f.rooms.forEach(r => {
                              const cap = Number(r.capacity);
                              const rent = Number(r.rentAmount) || 0;
                              // ONLY show if the owner explicitly set a rent on this room
                              if (cap > 0 && rent > 0) {
                                if (!optionsMap.has(cap) || rent < optionsMap.get(cap)) {
                                  optionsMap.set(cap, rent);
                                }
                              }
                            });
                          }
                        });
                      }
                      
                      if (optionsMap.size === 0) return null;
                      
                      const options = Array.from(optionsMap.entries())
                        .map(([cap, price]) => ({ cap: Number(cap), price }))
                        .sort((a, b) => a.cap - b.cap);

                      return (
                        <div className="liv-sharing-options-box">
                          <h3 className="liv-sharing-title">Available Room Options</h3>
                          <div className="liv-sharing-chips">
                            {options.map(opt => (
                              <button 
                                key={opt.cap} 
                                className={`liv-sharing-chip ${selectedCapacityFilter === opt.cap ? 'active' : ''}`}
                                onClick={() => {
                                  setSelectedCapacityFilter(opt.cap === selectedCapacityFilter ? null : opt.cap);
                                  setSelectedFloor(null); // Clear floor to ensure clean navigation
                                  setActiveStep(2); // Jump to floors view to see filtered floors
                                }}
                                type="button"
                              >
                                <span>{getSharingLabel(opt.cap)}</span>
                                <strong>₹{opt.price.toLocaleString()}</strong>
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                  
                  <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '20px 0' }} />
                  
                  {/* Amenities from facility booleans */}
                  {(() => {
                    const amenities = getAmenitiesFromBuilding(hostel);
                    if (amenities.length === 0) return null;
                    return (
                      <>
                        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '0 0 12px 0' }}>Amenities & Facilities</h2>
                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' }}>
                          {amenities.map(a => (
                            <span key={a} style={{
                              display: 'inline-flex', alignItems: 'center', gap: '6px',
                              padding: '6px 14px', borderRadius: '20px', fontSize: '0.88rem',
                              background: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0', fontWeight: 500
                            }}>
                              {getAmenityIcon(a)} {a}
                            </span>
                          ))}
                        </div>
                      </>
                    );
                  })()}
                  
                  {/* Policies */}
                  {hostel.policies && (hostel.policies.smoking || hostel.policies.alcohol || hostel.policies.visitors || hostel.policies.pets) && (
                    <>
                      <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '20px 0' }} />
                      <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '0 0 12px 0' }}>House Policies</h2>
                      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '20px', fontSize: '0.95rem' }}>
                        {hostel.policies.smoking && <span>🚭 Smoking: {hostel.policies.smoking}</span>}
                        {hostel.policies.alcohol && <><span style={{ color: '#cbd5e1' }}>|</span><span>🍺 Alcohol: {hostel.policies.alcohol}</span></>}
                        {hostel.policies.visitors && <><span style={{ color: '#cbd5e1' }}>|</span><span>👥 Visitors: {hostel.policies.visitors}</span></>}
                        {hostel.policies.pets && <><span style={{ color: '#cbd5e1' }}>|</span><span>🐾 Pets: {hostel.policies.pets}</span></>}
                      </div>
                    </>
                  )}
                  
                  <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '20px 0' }} />
                  
                  {/* Contact Card */}
                  <div className="liv-contact-card">
                    <div className="liv-cc-icon"><Info size={24} className="text-blue" /></div>
                    <div className="liv-cc-content">
                      <h3 className="liv-cc-title">Property Management</h3>
                      {(hostel.ownerName || hostel.ownerPhone || hostel.warden || hostel.wardenNumber || hostel.staffInfo?.name) ? (
                        <div className="liv-cc-grid">
                          {hostel.warden && (
                            <div className="liv-cc-row">
                              <span className="liv-cc-label">Warden:</span>
                              <span className="liv-cc-val">{hostel.warden}{hostel.wardenNumber ? ` — ${hostel.wardenNumber}` : ''}</span>
                            </div>
                          )}
                          {hostel.staffInfo?.name && (
                            <div className="liv-cc-row">
                              <span className="liv-cc-label">{hostel.staffInfo.role || 'Staff'}:</span>
                              <span className="liv-cc-val">{hostel.staffInfo.name}{hostel.staffInfo.contact ? ` — ${hostel.staffInfo.contact}` : ''}</span>
                            </div>
                          )}
                          {hostel.ownerName && (
                            <div className="liv-cc-row">
                              <span className="liv-cc-label">Owner:</span>
                              <span className="liv-cc-val">{hostel.ownerName}{hostel.ownerPhone ? ` — ${hostel.ownerPhone}` : ''}</span>
                            </div>
                          )}
                          {!hostel.warden && !hostel.ownerName && !hostel.staffInfo?.name && hostel.ownerPhone && (
                            <div className="liv-cc-row">
                              <span className="liv-cc-label">Phone:</span>
                              <span className="liv-cc-val">{hostel.ownerPhone}</span>
                            </div>
                          )}
                        </div>
                      ) : (
                        <p className="liv-cc-empty">Contact details are private. Please proceed with booking to communicate.</p>
                      )}
                    </div>
                  </div>                {/* CTA to next step */}
                <div className="liv-step-cta">
                  <button className="liv-step-next-btn" onClick={() => setActiveStep(2)}>
                    Explore Floors &amp; Rooms <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            )}

            {/* ══════════ STEP 2: FLOOR DETAILS ══════════ */}
            {activeStep === 2 && (
              <div className="liv-step-panel fade-in">
                <div className="liv-details-section">
                  <div className="liv-step-header-row">
                    <div>
                      <h2 className="liv-section-title">Select a Floor</h2>
                      <p className="liv-property-desc">Choose a floor to browse available rooms and beds. Click any floor to continue.</p>
                    </div>
                    <button className="liv-step-back-pill" onClick={() => setActiveStep(1)}>
                      <ArrowLeft size={13} /> Back to Hostel Details
                    </button>
                  </div>

                  {(!hostel.floors || hostel.floors.length === 0) ? (
                    <div className="liv-empty-state">
                      <Info size={32} />
                      <h3>No Layout Data Available</h3>
                      <p>The landlord has not configured floors for this property yet.</p>
                    </div>
                  ) : (
                    <div className="liv-floor-list">
                      {(() => {
                        const filteredFloors = hostel.floors.filter(floor => {
                          if (!selectedCapacityFilter) return true;
                          return floor.rooms && floor.rooms.some(r => Number(r.capacity) === selectedCapacityFilter);
                        });

                        if (filteredFloors.length === 0) {
                          return (
                            <div className="liv-empty-state">
                              <Info size={32} />
                              <h3>No Floors Match Your Filter</h3>
                              <p>None of the floors have rooms for {selectedCapacityFilter === 1 ? 'Single Room' : `${selectedCapacityFilter}-Sharing`}.</p>
                              <button className="liv-step-back-pill" style={{ marginTop: '1rem' }} onClick={() => setSelectedCapacityFilter(null)}>
                                Clear Filter
                              </button>
                            </div>
                          );
                        }

                        return filteredFloors.map((floor) => {
                          const stats = getFloorStats(floor, selectedCapacityFilter);
                          const isSelected = selectedFloor?._id === floor._id;
                          return (
                            <div
                              key={floor._id}
                              className={`liv-floor-select-card ${isSelected ? 'selected' : ''} ${stats.availableBeds === 0 ? 'full' : ''}`}
                              onClick={() => handleFloorSelect(floor)}
                            >
                              <div className="liv-fsc-left">
                                <div className={`liv-fsc-icon ${isSelected ? 'active' : ''}`}>
                                  <LayoutGrid size={22} />
                                </div>
                                <div className="liv-fsc-info">
                                  <h4>Floor {floor.floorNumber}</h4>
                                  <div className="liv-fsc-meta">
                                    <span>{stats.roomCount} Rooms</span>
                                    <span className="liv-dot">·</span>
                                    <span>{stats.totalBeds} Beds</span>
                                    <span className="liv-dot">·</span>
                                    <span className={stats.availableBeds > 0 ? 'text-green' : 'text-red'}>
                                      {stats.availableBeds} Available
                                    </span>
                                  </div>
                                  {floor.description && <p className="liv-fsc-desc">{floor.description}</p>}
                                </div>
                              </div>
                              <div className="liv-fsc-right">
                                <div className="liv-fsc-avail-ring">
                                  <svg viewBox="0 0 36 36" className="liv-fsc-ring-svg">
                                    <path className="liv-fsc-ring-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                    <path
                                      className="liv-fsc-ring-fill"
                                      strokeDasharray={`${stats.availabilityPercent}, 100`}
                                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                    />
                                    <text x="18" y="21" className="liv-fsc-ring-text">{stats.availabilityPercent}%</text>
                                  </svg>
                                </div>
                                <div className={`liv-fsc-arrow-wrap ${isSelected ? 'selected' : ''}`}>
                                  <ChevronRight size={20} />
                                </div>
                              </div>
                            </div>
                          );
                        });
                      })()}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ══════════ STEP 3: ROOMS ══════════ */}
            {activeStep === 3 && (
              <div className="liv-step-panel fade-in">
                <div className="liv-details-section">
                  <div className="liv-step-header-row">
                    <div>
                      <h2 className="liv-section-title">
                        {selectedFloor ? `Rooms on Floor ${selectedFloor.floorNumber}` : 'All Rooms'}
                        {selectedCapacityFilter && ` (${selectedCapacityFilter === 1 ? 'Single Room' : selectedCapacityFilter + ' Sharing'})`}
                      </h2>
                      <p className="liv-property-desc">
                        {selectedFloor
                          ? `Showing all rooms on Floor ${selectedFloor.floorNumber}. Select a room to view its beds.`
                          : 'Showing rooms across all floors. Select a room to view available beds.'}
                      </p>
                    </div>
                    {selectedFloor && (
                      <button className="liv-step-back-pill" onClick={() => setActiveStep(2)}>
                        <ArrowLeft size={13} /> Back to Floors
                      </button>
                    )}
                  </div>

                  {(() => {
                    let roomList = selectedFloor
                      ? (selectedFloor.rooms || []).map(room => ({ room, floor: selectedFloor }))
                      : (hostel.floors || []).flatMap(floor => (floor.rooms || []).map(room => ({ room, floor })));

                    if (selectedCapacityFilter) {
                      roomList = roomList.filter(({ room }) => Number(room.capacity) === selectedCapacityFilter);
                    }

                    if (roomList.length === 0) return (
                      <div className="liv-empty-state">
                        <Info size={32} />
                        <h3>No Rooms Available</h3>
                        <p>No rooms configured {selectedFloor ? `on Floor ${selectedFloor.floorNumber}` : 'in this hostel'}.</p>
                        <button className="liv-step-back-pill" style={{ marginTop: '1rem' }} onClick={() => setActiveStep(2)}>
                          <ArrowLeft size={13} /> Back to Floors
                        </button>
                      </div>
                    );

                    return (
                      <div className="liv-rooms-flow-grid">
                        {roomList.map(({ room, floor }) => {
                          const stats = getRoomStats(room);
                          const isSelected = selectedRoom?._id === room._id;
                          const occupancyPct = room.beds?.length ? Math.round((stats.occupied / room.beds.length) * 100) : 0;

                          return (
                            <div
                              key={room._id}
                              className={`liv-room-flow-card ${isSelected ? 'selected' : ''} ${stats.available === 0 ? 'full' : ''}`}
                            >
                              <div className="liv-rfc-header">
                                <div className="liv-rfc-title-row">
                                  <h4>Room {room.roomNumber}</h4>
                                  <span className={`liv-rfc-badge ${stats.available > 0 ? 'avail' : 'full'}`}>
                                    {stats.available > 0 ? `${stats.available} Free` : 'Full'}
                                  </span>
                                </div>
                                {!selectedFloor && floor && (
                                  <span className="liv-rfc-floor-tag">
                                    <LayoutGrid size={11} /> Floor {floor.floorNumber}
                                  </span>
                                )}
                              </div>

                              <div className="liv-rfc-details">
                                <div className="liv-rfc-detail-item">
                                  <Users size={13} />
                                  <span>{getSharingLabel(room.capacity)}</span>
                                </div>
                                <div className="liv-rfc-detail-item">
                                  {room.isAC
                                    ? <><Sparkles size={13} className="text-purple" /><span>AC</span></>
                                    : <><Wind size={13} /><span>Non-AC</span></>}
                                </div>
                                <div className="liv-rfc-detail-item">
                                  <Bath size={13} />
                                  <span>{room.washroomType ? renderField(room.washroomType) : (room.attachedBathroom ? 'Attached' : 'Common')}</span>
                                </div>
                              </div>

                              {/* Occupancy bar */}
                              <div className="liv-rfc-occ-bar">
                                <div className="liv-rfc-occ-fill" style={{ width: `${occupancyPct}%` }} />
                              </div>
                              <div className="liv-rfc-occ-label">
                                <span>{stats.occupied}/{stats.total} occupied</span>
                              </div>

                              <div className="liv-rfc-footer">
                                <div className="liv-rfc-price">
                                  <strong>₹{(room.rentAmount > 0 ? room.rentAmount : (room.capacity === 1 && hostel.rentSingle) ? hostel.rentSingle : (room.capacity === 2 && hostel.rentDouble) ? hostel.rentDouble : (room.capacity === 3 && hostel.rentTriple) ? hostel.rentTriple : (room.capacity === 4 && hostel.rent4Sharing) ? hostel.rent4Sharing : (room.capacity === 5 && hostel.rent5Sharing) ? hostel.rent5Sharing : (room.capacity >= 6 && hostel.rent6Sharing) ? hostel.rent6Sharing : hostel.startingPrice || 0).toLocaleString()}</strong>
                                  <span>/month</span>
                                </div>
                                <button
                                  className={`liv-rfc-select-btn ${stats.available === 0 ? 'disabled' : ''}`}
                                  disabled={stats.available === 0}
                                  onClick={() => handleRoomSelect(room, floor)}
                                >
                                  View Beds <ChevronRight size={14} />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}
                </div>
              </div>
            )}

            {/* ══════════ STEP 4: BEDS ══════════ */}
            {activeStep === 4 && (
              <div className="liv-step-panel fade-in">
                <div className="liv-details-section">
                  <div className="liv-step-header-row">
                    <div>
                      <h2 className="liv-section-title">
                        {selectedRoom
                          ? `Beds in Room ${selectedRoom.roomNumber}`
                          : selectedFloor
                            ? `All Beds on Floor ${selectedFloor.floorNumber}`
                            : 'All Available Beds'}
                      </h2>
                      <p className="liv-property-desc">
                        {selectedRoom
                          ? `Select an available bed in Room ${selectedRoom.roomNumber}.`
                          : 'Select a bed from the options below.'}
                      </p>
                    </div>
                    <button
                      className="liv-step-back-pill"
                      onClick={() => setActiveStep(selectedRoom ? 3 : selectedFloor ? 2 : 2)}
                    >
                      <ArrowLeft size={13} /> Back to Rooms
                    </button>
                  </div>

                  {(() => {
                    const bedGroups = getBedGroups();
                    if (bedGroups.length === 0 || bedGroups.every(g => !g.room.beds?.length)) {
                      return (
                        <div className="liv-empty-state">
                          <Info size={32} />
                          <h3>No Beds Available</h3>
                          <p>No beds configured for the selected room.</p>
                        </div>
                      );
                    }

                    return bedGroups.map(({ room, floor }) => (
                      <div key={room._id} className="liv-bed-group">
                        {/* Group header when not in single-room context */}
                        {!selectedRoom && (
                          <div className="liv-bed-group-header">
                            <span className="liv-bgh-room">Room {room.roomNumber}</span>
                            {floor && !selectedFloor && (
                              <span className="liv-bgh-floor">· Floor {floor.floorNumber}</span>
                            )}
                            <span className={`liv-rfc-badge ${getRoomStats(room).available > 0 ? 'avail' : 'full'}`} style={{ marginLeft: 'auto' }}>
                              {getRoomStats(room).available} Free
                            </span>
                          </div>
                        )}

                        <div className="liv-beds-flow-grid">
                          {(room.beds || []).map(bed => {
                            const occ = checkOccupied(bed);
                            const isSel = selectedBed?._id === bed._id;
                            return (
                              <button
                                key={bed._id}
                                className={`liv-bed-flow-card ${occ ? 'occupied' : 'free'} ${isSel ? 'selected' : ''}`}
                                onClick={() => handleBedSelect(bed, room, floor)}
                                disabled={occ}
                              >
                                <div className="liv-bfc-status-dot-row">
                                  <div className={`liv-bfc-dot ${occ ? 'red' : isSel ? 'gold' : 'green'}`} />
                                </div>
                                <div className="liv-bfc-icon-wrap">
                                  {occ ? <Lock size={28} strokeWidth={1.5} /> : <Bed size={28} strokeWidth={1.5} />}
                                </div>
                                <div className="liv-bfc-num">#{renderField(bed.bedNumber)}</div>
                                <div className="liv-bfc-type">{renderField(bed.bedType, 'Single')}</div>
                                <div className="liv-bfc-pos">{bed.position ? renderField(bed.position) : ''}</div>
                                <div className={`liv-bfc-label ${occ ? 'occ' : isSel ? 'sel' : 'avail'}`}>
                                  {occ ? 'Occupied' : isSel ? '✓ Selected' : 'Available'}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ));
                  })()}

                  {selectedBed && (
                    <div className="liv-bed-selected-banner fade-in">
                      <CheckCircle2 size={18} className="text-green" />
                      <span>Bed #{selectedBed.bedNumber} selected — proceed to booking from the panel →</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* ══════════════════ RIGHT SIDEBAR ══════════════════ */}
          <div className="liv-sidebar-sticky">
            <div className="liv-selection-card">
              <div className="liv-selection-header-row">
                <h3>Your Selection</h3>
                {(selectedFloor || selectedRoom || selectedBed) && (
                  <button className="liv-clear-btn" onClick={handleClearSelection}>Clear</button>
                )}
              </div>

              {/* Flow stepper in sidebar */}
              <div className="liv-stepper-timeline">
                <div
                  className={`liv-stepper-step ${selectedFloor ? 'active' : ''}`}
                  onClick={() => setActiveStep(2)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="liv-step-bullet"><LayoutGrid size={12} /></div>
                  <div className="liv-step-content">
                    <span className="liv-step-label">Floor</span>
                    <span className="liv-step-val">{selectedFloor ? `Floor ${selectedFloor.floorNumber}` : 'Not Selected'}</span>
                  </div>
                </div>

                <div
                  className={`liv-stepper-step ${selectedRoom ? 'active' : ''}`}
                  onClick={() => setActiveStep(3)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="liv-step-bullet"><Users size={12} /></div>
                  <div className="liv-step-content">
                    <span className="liv-step-label">Room</span>
                    <span className="liv-step-val">
                      {selectedRoom
                        ? `Room ${selectedRoom.roomNumber} (${selectedRoom.capacity === 3 ? 'Triple' : selectedRoom.capacity === 2 ? 'Double' : 'Single'}, ${selectedRoom.isAC ? 'AC' : 'Non-AC'})`
                        : 'Not Selected'}
                    </span>
                  </div>
                </div>

                <div
                  className={`liv-stepper-step ${selectedBed ? 'active' : ''}`}
                  onClick={() => setActiveStep(4)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="liv-step-bullet"><Bed size={12} /></div>
                  <div className="liv-step-content">
                    <span className="liv-step-label">Bed</span>
                    <span className="liv-step-val">
                      {selectedBed ? `Bed ${selectedBed.bedNumber} (${selectedBed.position || 'Upper Bunk'})` : 'Not Selected'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Price details */}
              <div className="liv-price-section">
                <h4>Price Details</h4>
                <div className="liv-price-row"><span>Base Rent</span><strong>₹{currentRent.toLocaleString()}</strong></div>
                <div className="liv-price-row"><span>Security Deposit (One-time)</span><strong>₹{currentDeposit.toLocaleString()}</strong></div>
                <div className="liv-price-row"><span>Food Charges (Monthly)</span><strong>₹{foodCost.toLocaleString()}</strong></div>
                <div className="liv-price-row"><span>Maintenance Charges</span><strong>₹{maintenanceCost.toLocaleString()}</strong></div>
              </div>

              <div className="liv-total-row">
                <div className="liv-total-left"><span>Total Due Today</span></div>
                <div className="liv-total-val">₹{totalDue.toLocaleString()}</div>
              </div>

              {/* Booking inputs */}
              <div className="liv-booking-inputs">
                <div className="liv-input-group">
                  <label><Calendar size={14} /> Move-in Date</label>
                  <input
                    type="date"
                    className="liv-date-input"
                    value={moveInDate}
                    onChange={(e) => setMoveInDate(e.target.value)}
                  />
                </div>
                <div className="liv-input-group">
                  <label>Agreement Type</label>
                  <div className="liv-agreement-tabs">
                    {['Monthly', 'Quarterly', 'Half Yearly', 'Yearly'].map(type => (
                      <button
                        key={type}
                        type="button"
                        className={`liv-agreement-tab-btn ${agreementType === type ? 'active' : ''}`}
                        onClick={() => setAgreementType(type)}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button
                className={`liv-proceed-btn ${!selectedBed ? 'disabled-btn' : ''}`}
                onClick={() => {
                  if (!selectedBed) {
                    alert('Please select a Floor, Room, and Bed before proceeding.');
                    return;
                  }
                  handleBooking();
                }}
              >
                Proceed to Book <ChevronRight size={18} />
              </button>
              <span className="liv-not-charged-sub">
                {!selectedBed ? 'Select a bed to continue' : "You won't be charged yet"}
              </span>
            </div>

            {/* Trust widgets */}
            <div className="liv-trust-widgets">
              <div className="liv-trust-item">
                <CheckCircle2 size={16} className="text-green" />
                <div className="liv-trust-text"><strong>Secure Booking</strong><span>Your data is protected</span></div>
              </div>
              <div className="liv-trust-item">
                <CheckCircle2 size={16} className="text-green" />
                <div className="liv-trust-text"><strong>No Hidden Charges</strong><span>Transparent pricing</span></div>
              </div>
              <div className="liv-trust-item">
                <CheckCircle2 size={16} className="text-green" />
                <div className="liv-trust-text"><strong>24/7 Support</strong><span>We are here to help</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ImageModal isOpen={modalInfo.isOpen} image={modalInfo.image} onClose={() => setModalInfo({ isOpen: false, image: '' })} />
    </div>
  );
};

export default Listing;
