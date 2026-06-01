import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Check, MapPin, Bed, Users, ShieldCheck, Star, DoorOpen, LayoutGrid, Lock, 
  ChevronDown, ChevronUp, CheckCircle2, ChevronRight, Wind, Bath, Info, Zap, User, ArrowLeft, Heart, Share,
  Search, List, Filter
} from 'lucide-react';
import API from '../api/axios';
import socket, { connectSocket, disconnectSocket } from '../utils/socket';
import './Listing.css';
import ImageModal from '../components/ImageModal';

const Listing = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [hostel, setHostel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalInfo, setModalInfo] = useState({ isOpen: false, image: '' });
  
  // Step-by-Step Flow States
  const [activeFloor, setActiveFloor] = useState(null);
  const [overlayRoom, setOverlayRoom] = useState(null);
  
  // High Volume States
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAC, setFilterAC] = useState('all');
  const [filterAvailability, setFilterAvailability] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  
  // Selection State for Booking
  const [selectedFloor, setSelectedFloor] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedBed, setSelectedBed] = useState(null);

  useEffect(() => {
    const fetchHostel = async () => {
      try {
        const res = await API.get(`/buildings/public/${id}`);
        setHostel(res.data);
        if (res.data.floors && res.data.floors.length > 0) {
          // Initialize first floor if none active
          setActiveFloor(prev => prev ? res.data.floors.find(f => f._id === prev._id) || res.data.floors[0] : res.data.floors[0]);
        }
      } catch (error) {
        console.error("Failed to fetch building data", error);
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

  const handleBedSelect = (floor, room, bed) => {
    const isOccupied = bed.status === 'OCCUPIED' || (hostel?.filledBeds && hostel.filledBeds.some(b => String(b.bedId) === String(bed._id)));
    if (!isOccupied) {
      setSelectedFloor(floor);
      setSelectedRoom(room);
      setSelectedBed(bed);
    }
  };

  const handleBooking = () => {
    if (!selectedBed || !selectedRoom || !selectedFloor) return;
    
    if (!localStorage.getItem('token')) {
      navigate('/login');
      return;
    }

    const bookingData = {
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
      floorNumber: selectedFloor.floorNumber
    };

    navigate(`/booking/${id}`, { state: bookingData });
  };

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

  const renderField = (value) => {
    if (value === null || value === undefined || value === '') return 'No Data Available';
    return value;
  };

  const currentRent = selectedRoom?.rentAmount ? selectedRoom.rentAmount : (hostel.startingPrice || 0);
  const currentDeposit = selectedRoom?.securityDeposit ? selectedRoom.securityDeposit : (hostel.securityDeposit || 0);
  const foodCost = hostel.foodCharges || 0;
  const maintenanceCost = hostel.maintenanceCharges || 0;
  const totalDue = currentRent + currentDeposit + foodCost + maintenanceCost;

  // Filter Logic for High Volume Rooms
  const getFilteredRooms = () => {
    if (!activeFloor || !activeFloor.rooms) return [];
    return activeFloor.rooms; // Search and filters removed as requested
  };

  // Modern Airbnb-style Image Gallery
  const renderGallery = () => {
    const images = hostel.images || [];
    if (images.length === 0) {
      return <div className="liv-gallery-empty">No Visuals Available</div>;
    }
    
    return (
      <div className={`liv-gallery-grid ${images.length < 5 ? 'partial' : ''}`}>
        <div className="liv-gallery-main" onClick={() => setModalInfo({ isOpen: true, image: images[0] })}>
          <img src={images[0]} alt="Main Property" />
        </div>
        {images.length > 1 && (
          <div className="liv-gallery-sub">
            {images.slice(1, 5).map((img, idx) => (
              <div key={idx} className="liv-gallery-item" onClick={() => setModalInfo({ isOpen: true, image: img })}>
                <img src={img} alt={`Gallery ${idx + 1}`} />
                {idx === 3 && images.length > 5 && (
                  <div className="liv-gallery-overlay">+{images.length - 5} photos</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="liv-property-page">
      {/* Dynamic Header */}
      <nav className="liv-top-nav">
        <div className="liv-nav-inner">
          <button className="liv-btn-icon" onClick={() => navigate(-1)}><ArrowLeft size={20}/></button>
          <div className="liv-nav-actions">
            <button className="liv-btn-text"><Share size={16}/> Share</button>
            <button className="liv-btn-text"><Heart size={16}/> Save</button>
          </div>
        </div>
      </nav>

      <div className="liv-container">
        {/* Title Section */}
        <div className="liv-title-section">
          <h1 className="liv-title">{renderField(hostel.name)}</h1>
          <div className="liv-title-meta">
            <span className="liv-meta-item highlight"><Star size={14} fill="currentColor"/> {renderField(hostel.rating)}</span>
            <span className="liv-meta-dot">•</span>
            <span className="liv-meta-item">{renderField(hostel.locationCity)}</span>
            <span className="liv-meta-dot">•</span>
            <span className="liv-meta-item underline">{renderField(hostel.address)}</span>
          </div>
        </div>

        {/* Gallery */}
        {renderGallery()}

        {/* Main Content Layout */}
        <div className="liv-layout">
          <div className="liv-content-main">
            
            <section className="liv-section">
              <div className="liv-section-header">
                <h2>{renderField(hostel.name)} Overview</h2>
                <p>{renderField(hostel.totalRooms)} Rooms • {renderField(hostel.totalBeds)} Beds • {renderField(hostel.genderType)} • {renderField(hostel.category)}</p>
              </div>

              <div className="liv-divider"></div>

              <h3>About this space</h3>
              <p className="liv-description">{renderField(hostel.description)}</p>

              <div className="liv-divider"></div>

              <h3>What this place offers</h3>
              <div className="liv-amenities-grid">
                {hostel.amenities?.length > 0 ? hostel.amenities.map((am, idx) => (
                  <div key={idx} className="liv-amenity-item"><Check size={18} strokeWidth={3}/> {am}</div>
                )) : <div className="liv-text-muted">No Data Available</div>}
              </div>
            </section>

            <section className="liv-section liv-explorer">
              <h2>Property Hierarchy Explorer</h2>
              <p className="liv-subtitle">Select a floor to view its rooms, then click a room to pick your precise bed.</p>

              <div className="liv-floor-selector">
                <label>Select Floor:</label>
                <div className="liv-dropdown-wrap">
                  <select 
                    value={activeFloor?._id || ''} 
                    onChange={(e) => {
                      const floor = hostel.floors.find(f => f._id === e.target.value);
                      setActiveFloor(floor);
                    }}
                    className="liv-dropdown"
                  >
                    {hostel.floors && hostel.floors.map(f => (
                      <option key={f._id} value={f._id}>Floor {renderField(f.floorNumber)} ({f.rooms ? f.rooms.length : 0} Rooms)</option>
                    ))}
                  </select>
                  <ChevronDown className="liv-dropdown-icon" size={18}/>
                </div>
              </div>

              {activeFloor && (
                <div className="liv-floor-content">
                  <div className="liv-data-strip">
                    <div><span>Description</span><strong>{renderField(activeFloor.description)}</strong></div>
                    <div><span>Total Beds</span><strong>{renderField(activeFloor.totalBeds)}</strong></div>
                    <div><span>Facilities</span><strong>{activeFloor.facilities?.length > 0 ? activeFloor.facilities.join(', ') : 'No Data Available'}</strong></div>
                  </div>

                  {/* View Controls */}
                  <div className="liv-rooms-header-controls" style={{ justifyContent: 'flex-end' }}>
                    <div className="liv-view-toggles">
                      <button className={`liv-btn-toggle ${viewMode === 'grid' ? 'active' : ''}`} onClick={() => setViewMode('grid')}><LayoutGrid size={18}/></button>
                      <button className={`liv-btn-toggle ${viewMode === 'list' ? 'active' : ''}`} onClick={() => setViewMode('list')}><List size={18}/></button>
                    </div>
                  </div>

                  {/* Scrollable Room Container */}
                  <div className="liv-rooms-scroll-container">
                    <div className={`liv-rooms-wrapper ${viewMode}`}>
                      {getFilteredRooms().length > 0 ? getFilteredRooms().map((room) => {
                        const occupiedCount = room.beds ? room.beds.filter(b => b.status === 'OCCUPIED' || (hostel.filledBeds && hostel.filledBeds.some(fb => String(fb.bedId) === String(b._id)))).length : 0;
                        const availableCount = (room.beds ? room.beds.length : 0) - occupiedCount;
                        const isSelectedRoom = selectedRoom?._id === room._id;
                        
                        return (
                          <div key={room._id} className={`liv-room-card ${isSelectedRoom ? 'selected' : ''}`} onClick={() => setOverlayRoom(room)}>
                            <div className="liv-rh-info">
                              <h4>Room {renderField(room.roomNumber)}</h4>
                              <div className="liv-tags">
                                <span className="liv-tag type">{room.isAC ? 'AC' : 'Non-AC'}</span>
                                <span className="liv-tag capacity"><Users size={12}/> Cap: {renderField(room.capacity)}</span>
                              </div>
                            </div>
                            <div className="liv-room-footer">
                              <span className="liv-availability">{availableCount} Beds Available</span>
                              <span className="liv-arrow"><ChevronRight size={18}/></span>
                            </div>
                          </div>
                        )
                      }) : <div className="liv-empty-state">No rooms match your filters.</div>}
                    </div>
                  </div>
                </div>
              )}
            </section>
          </div>

          {/* Sticky Checkout Sidebar */}
          <div className="liv-sidebar-wrapper">
            <div className="liv-checkout-card glass">
              <div className="liv-cc-price-header">
                <h3><span className="currency">₹</span>{totalDue.toLocaleString()}<span>/month total</span></h3>
              </div>
              
              <div className="liv-cc-selection">
                <div className="liv-cc-row"><span>Floor</span> <strong>{selectedFloor ? renderField(selectedFloor.floorNumber) : '-'}</strong></div>
                <div className="liv-cc-row"><span>Room</span> <strong>{selectedRoom ? renderField(selectedRoom.roomNumber) : '-'}</strong></div>
                <div className="liv-cc-row highlight"><span>Bed</span> <strong>{selectedBed ? `#${renderField(selectedBed.bedNumber)}` : '-'}</strong></div>
              </div>

              <div className="liv-divider"></div>

              <div className="liv-cc-breakdown">
                <div className="liv-cc-row"><span>Rent</span> <span>{currentRent ? `₹${currentRent.toLocaleString()}` : '-'}</span></div>
                <div className="liv-cc-row"><span>Deposit</span> <span>{currentDeposit ? `₹${currentDeposit.toLocaleString()}` : '-'}</span></div>
                <div className="liv-cc-row"><span>Food</span> <span>{foodCost ? `₹${foodCost.toLocaleString()}` : '-'}</span></div>
                <div className="liv-cc-row"><span>Maintenance</span> <span>{maintenanceCost ? `₹${maintenanceCost.toLocaleString()}` : '-'}</span></div>
              </div>

              <div className="liv-divider"></div>

              <div className="liv-cc-row total">
                <span>Total Due Today</span>
                <span>₹{totalDue.toLocaleString()}</span>
              </div>

              <button 
                className="liv-btn-primary full-width"
                disabled={!selectedBed}
                onClick={handleBooking}
              >
                {selectedBed ? 'Reserve This Bed' : 'Select a Bed to Reserve'}
              </button>
            </div>

            {hostel.policies && (
              <div className="liv-rules-card">
                <h4>House Rules</h4>
                <ul>
                  <li><span className="icon">🚭</span> <span>Smoking:</span> <strong>{renderField(hostel.policies.smoking)}</strong></li>
                  <li><span className="icon">🍷</span> <span>Alcohol:</span> <strong>{renderField(hostel.policies.alcohol)}</strong></li>
                  <li><span className="icon">🐕</span> <span>Pets:</span> <strong>{renderField(hostel.policies.pets)}</strong></li>
                  <li><span className="icon">⏰</span> <span>Visitors:</span> <strong>{renderField(hostel.policies.visitors)}</strong></li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Centered Modal Overlay for Room Beds */}
      <div className={`liv-overlay-backdrop ${overlayRoom ? 'visible' : ''}`} onClick={() => setOverlayRoom(null)}>
        <div className={`liv-modal ${overlayRoom ? 'open' : ''}`} onClick={e => e.stopPropagation()}>
          <div className="liv-modal-header">
            <div className="liv-modal-title">
              <h3>Room {overlayRoom ? renderField(overlayRoom.roomNumber) : ''}</h3>
              <span className="liv-modal-subtitle">Pick your specific bed</span>
            </div>
            <button className="liv-btn-close" onClick={() => setOverlayRoom(null)}>✕</button>
          </div>
          
          {overlayRoom && (
            <div className="liv-modal-content">
              <div className="liv-modal-meta">
                <div className="liv-meta-badge"><Bath size={14}/> <span>{renderField(overlayRoom.washroomType)} Washroom</span></div>
                <div className="liv-meta-badge price"><span className="currency">₹</span> <span>{overlayRoom.rentAmount ? overlayRoom.rentAmount.toLocaleString() : 'N/A'}</span> /mo</div>
              </div>
              
              <div className="liv-divider" style={{margin: '24px 0'}}></div>
              
              <h5 className="liv-modal-section-title">Available Beds in this Room</h5>
              <div className="liv-beds-grid">
                {overlayRoom.beds && overlayRoom.beds.length > 0 ? overlayRoom.beds.map(bed => {
                  const isOccupied = bed.status === 'OCCUPIED' || (hostel.filledBeds && hostel.filledBeds.some(b => String(b.bedId) === String(bed._id)));
                  const isSelected = selectedBed?._id === bed._id;
                  
                  return (
                    <button 
                      key={bed._id} 
                      className={`liv-bed-btn ${isOccupied ? 'disabled' : ''} ${isSelected ? 'selected' : ''}`}
                      onClick={() => handleBedSelect(activeFloor, overlayRoom, bed)}
                      disabled={isOccupied}
                    >
                      <div className="liv-bb-top">
                        <span className="liv-bb-num">#{renderField(bed.bedNumber)}</span>
                        {isOccupied ? <Lock size={16} strokeWidth={2.5}/> : <CheckCircle2 size={16} strokeWidth={2.5}/>}
                      </div>
                      <div className="liv-bb-type">{renderField(bed.bedType)}</div>
                      <div className="liv-bb-pos">{renderField(bed.position)}</div>
                    </button>
                  );
                }) : <div className="liv-text-muted">No Beds Available in this Room</div>}
              </div>
              
              <div className="liv-modal-footer">
                <button 
                  className="liv-btn-primary full-width pulse-hover" 
                  onClick={() => setOverlayRoom(null)}
                >
                  {selectedBed && overlayRoom.beds.some(b => b._id === selectedBed._id) ? 'Confirm Bed Selection' : 'Close Details'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <ImageModal isOpen={modalInfo.isOpen} image={modalInfo.image} onClose={() => setModalInfo({ isOpen: false, image: '' })} />
    </div>
  );
};

export default Listing;
