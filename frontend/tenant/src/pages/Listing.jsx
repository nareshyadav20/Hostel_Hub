import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Check, MapPin, Bed, Users, ShieldCheck, Star, DoorOpen, LayoutGrid, Lock, 
  ChevronDown, ChevronUp, CheckCircle2, ChevronRight, Wind, Bath, Info, Zap, User
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
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Expanded States for Accordions
  const [expandedFloor, setExpandedFloor] = useState(null);
  const [expandedRoom, setExpandedRoom] = useState(null);
  
  // Selection State for Booking
  const [selectedFloor, setSelectedFloor] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedBed, setSelectedBed] = useState(null);

  useEffect(() => {
    const fetchHostel = async () => {
      try {
        const res = await API.get(`/buildings/public/${id}`);
        setHostel(res.data);
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

  const toggleFloor = (floor) => {
    if (expandedFloor?._id === floor._id) {
      setExpandedFloor(null);
      setExpandedRoom(null);
    } else {
      setExpandedFloor(floor);
      setExpandedRoom(null);
    }
  };

  const toggleRoom = (room) => {
    if (expandedRoom?._id === room._id) {
      setExpandedRoom(null);
    } else {
      setExpandedRoom(room);
    }
  };

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
      <div className="lst-page loading">
        <div className="explore-spinner"></div>
      </div>
    );
  }

  if (!hostel) {
    return (
      <div className="lst-page not-found">
        <h2>Property Not Found</h2>
        <button onClick={() => navigate(-1)} className="lst-btn-reserve">Go Back</button>
      </div>
    );
  }

  // Helper for No Data
  const renderField = (value) => {
    if (value === null || value === undefined || value === '') return 'No Data Available';
    return value;
  };

  const currentRent = selectedRoom?.rentAmount ? selectedRoom.rentAmount : (hostel.startingPrice || 0);
  const currentDeposit = selectedRoom?.securityDeposit ? selectedRoom.securityDeposit : (hostel.securityDeposit || 0);
  const foodCost = hostel.foodCharges || 0;
  const maintenanceCost = hostel.maintenanceCharges || 0;
  const totalDue = currentRent + currentDeposit + foodCost + maintenanceCost;

  return (
    <div className="lst-page">
      <header className="lst-header">
        <button className="lst-back-btn" onClick={() => navigate(-1)}>✕</button>
        <div className="lst-title-area">
          <h1 className="lst-title">{renderField(hostel.name)}</h1>
          <div className="lst-meta-tags">
            {hostel.rating ? <span className="lst-tag rating"><Star size={12} fill="currentColor" /> {hostel.rating} Rating</span> : null}
            <span className="lst-tag category">🎓 Category: {renderField(hostel.category)}</span>
            <span className="lst-tag gender">👥 Gender: {renderField(hostel.genderType)}</span>
          </div>
          <p className="lst-address">
            <MapPin size={16}/> {renderField(hostel.address)}, {renderField(hostel.locationCity)}
          </p>
        </div>
      </header>

      <div className="lst-hero-gallery">
        <div className="lst-hg-main" onClick={() => {
          if(hostel.images && hostel.images.length > 0) {
             setModalInfo({ isOpen: true, image: hostel.images[activeImageIndex] });
          }
        }}>
          {hostel.images && hostel.images.length > 0 ? (
            <img src={hostel.images[activeImageIndex]} alt="Property Main" className="lst-hg-img" />
          ) : (
            <div className="lst-no-img">No Data Available</div>
          )}
          {hostel.images && hostel.images.length > 1 && (
            <div className="lst-hg-nav">
              <button onClick={(e) => { e.stopPropagation(); setActiveImageIndex(prev => (prev - 1 + hostel.images.length) % hostel.images.length); }}>❮</button>
              <button onClick={(e) => { e.stopPropagation(); setActiveImageIndex(prev => (prev + 1) % hostel.images.length); }}>❯</button>
            </div>
          )}
        </div>
      </div>

      <div className="lst-layout">
        <div className="lst-explorer">
          
          <section className="lst-block">
            <h2 className="lst-block-title">Building Overview</h2>
            <div className="lst-overview-grid">
               <div className="lst-og-item"><strong>Description:</strong> {renderField(hostel.description)}</div>
               <div className="lst-og-item"><strong>Total Rooms:</strong> {renderField(hostel.totalRooms)}</div>
               <div className="lst-og-item"><strong>Total Beds:</strong> {renderField(hostel.totalBeds)}</div>
               <div className="lst-og-item"><strong>Starting Price:</strong> {hostel.startingPrice ? `₹${hostel.startingPrice}` : 'No Data Available'}</div>
               <div className="lst-og-item"><strong>Security Deposit:</strong> {hostel.securityDeposit ? `₹${hostel.securityDeposit}` : 'No Data Available'}</div>
               <div className="lst-og-item"><strong>Food Charges:</strong> {hostel.foodCharges ? `₹${hostel.foodCharges}` : 'No Data Available'}</div>
               <div className="lst-og-item"><strong>Maintenance Charges:</strong> {hostel.maintenanceCharges ? `₹${hostel.maintenanceCharges}` : 'No Data Available'}</div>
               <div className="lst-og-item"><strong>Property Features:</strong> {renderField(hostel.popularityLabel)}</div>
            </div>

            <h3 className="lst-sub-title">Amenities</h3>
            <div className="lst-features-list">
              {hostel.amenities?.length > 0 ? hostel.amenities.map((amenity, idx) => (
                <div key={idx} className="lst-feature-pill">
                  <Check size={14} color="var(--lst-primary)" /> {amenity}
                </div>
              )) : <span className="lst-none">No Data Available</span>}
            </div>

            <h3 className="lst-sub-title">House Rules</h3>
            <div className="lst-overview-grid">
               <div className="lst-og-item"><strong>Smoking:</strong> {renderField(hostel.policies?.smoking)}</div>
               <div className="lst-og-item"><strong>Alcohol:</strong> {renderField(hostel.policies?.alcohol)}</div>
               <div className="lst-og-item"><strong>Pets:</strong> {renderField(hostel.policies?.pets)}</div>
               <div className="lst-og-item"><strong>Visitors:</strong> {renderField(hostel.policies?.visitors)}</div>
            </div>
          </section>

          <section className="lst-block">
            <h2 className="lst-block-title"><LayoutGrid size={20}/> Floor Explorer</h2>
            
            <div className="lst-accordion-container">
              {hostel.floors && hostel.floors.length > 0 ? (
                hostel.floors.map(floor => (
                  <div key={floor._id} className={`lst-floor-accordion ${expandedFloor?._id === floor._id ? 'expanded' : ''}`}>
                    <div className="lst-floor-header" onClick={() => toggleFloor(floor)}>
                      <div className="lst-fh-left">
                        <h3>Floor {renderField(floor.floorNumber)}</h3>
                        <span className="lst-fh-category">Type: {renderField(floor.floorCategory)}</span>
                      </div>
                      <div className="lst-fh-right">
                        <span className="lst-fh-stats"><DoorOpen size={16}/> {floor.rooms ? floor.rooms.length : 0} Rooms</span>
                        <div className="lst-fh-icon">
                          {expandedFloor?._id === floor._id ? <ChevronUp size={20}/> : <ChevronDown size={20}/>}
                        </div>
                      </div>
                    </div>
                    
                    {expandedFloor?._id === floor._id && (
                      <div className="lst-floor-body">
                        <div className="lst-floor-details-grid">
                          <div><strong>Description:</strong> {renderField(floor.description)}</div>
                          <div><strong>Occupancy:</strong> {renderField(floor.occupancyPercentage)}%</div>
                          <div><strong>Total Rooms:</strong> {renderField(floor.totalRooms)}</div>
                          <div><strong>Total Beds:</strong> {renderField(floor.totalBeds)}</div>
                        </div>

                        {floor.facilities && floor.facilities.length > 0 ? (
                          <div className="lst-floor-facilities">
                            <strong>Facilities: </strong>
                            {floor.facilities.map((fac, idx) => <span key={idx} className="lst-fac-pill">{fac}</span>)}
                          </div>
                        ) : <div style={{margin: '10px 0'}}><strong>Facilities:</strong> No Data Available</div>}
                        
                        <h4 className="lst-explorer-title">Room Explorer</h4>
                        <div className="lst-rooms-accordion">
                          {floor.rooms && floor.rooms.length > 0 ? (
                            floor.rooms.map(room => {
                               const occupiedCount = room.beds ? room.beds.filter(b => b.status === 'OCCUPIED' || (hostel.filledBeds && hostel.filledBeds.some(fb => String(fb.bedId) === String(b._id)))).length : 0;
                               const availableCount = (room.beds ? room.beds.length : 0) - occupiedCount;

                               return (
                              <div key={room._id} className={`lst-room-accordion ${expandedRoom?._id === room._id ? 'expanded' : ''}`}>
                                <div className="lst-room-header" onClick={() => toggleRoom(room)}>
                                  <div className="lst-rh-left">
                                    <h4>Room {renderField(room.roomNumber)}</h4>
                                    <div className="lst-rh-tags">
                                      <span className="lst-tag">Type: {renderField(room.roomType)}</span>
                                      <span className="lst-tag">Status: {renderField(room.status)}</span>
                                    </div>
                                  </div>
                                  <div className="lst-rh-right">
                                    <div className="lst-rh-price">
                                      <span className="amount">₹{room.rentAmount ? room.rentAmount.toLocaleString() : 'N/A'}</span>
                                      <span className="period">/mo</span>
                                    </div>
                                    <div className="lst-rh-icon">
                                      {expandedRoom?._id === room._id ? <ChevronUp size={18}/> : <ChevronDown size={18}/>}
                                    </div>
                                  </div>
                                </div>

                                {expandedRoom?._id === room._id && (
                                  <div className="lst-room-body">
                                    <div className="lst-room-details-grid">
                                      <div><strong>Capacity:</strong> {renderField(room.capacity)}</div>
                                      <div><strong>Occupied Beds:</strong> {occupiedCount}</div>
                                      <div><strong>Available Beds:</strong> {availableCount}</div>
                                      <div><strong>AC:</strong> {room.isAC ? 'Yes' : 'No'}</div>
                                      <div><strong>Washroom:</strong> {renderField(room.washroomType)}</div>
                                      <div><strong>Security Deposit:</strong> {room.securityDeposit ? `₹${room.securityDeposit}` : 'No Data Available'}</div>
                                    </div>

                                    {room.amenities && room.amenities.length > 0 ? (
                                      <div className="lst-room-amenities">
                                        <strong>Facilities: </strong>
                                        {room.amenities.map((am, idx) => <span key={idx}><Check size={12}/> {am}</span>)}
                                      </div>
                                    ) : <div style={{margin: '10px 0'}}><strong>Facilities:</strong> No Data Available</div>}
                                    
                                    <h5 className="lst-beds-title">Bed Explorer</h5>
                                    <div className="lst-beds-grid">
                                      {room.beds && room.beds.length > 0 ? (
                                        room.beds.map(bed => {
                                          const isOccupied = bed.status === 'OCCUPIED' || (hostel.filledBeds && hostel.filledBeds.some(b => String(b.bedId) === String(bed._id)));
                                          const isSelected = selectedBed?._id === bed._id;
                                          
                                          return (
                                            <div 
                                              key={bed._id} 
                                              className={`lst-bed-card ${isOccupied ? 'occupied' : ''} ${isSelected ? 'selected' : ''}`}
                                              onClick={() => handleBedSelect(floor, room, bed)}
                                            >
                                              <div className="lst-bc-top">
                                                <span className="lst-bc-num">#{renderField(bed.bedNumber)}</span>
                                                <div className="lst-bc-status">
                                                  {isOccupied ? <><Lock size={12}/> Occupied</> : <><CheckCircle2 size={12}/> Available</>}
                                                </div>
                                              </div>
                                              <div className="lst-bc-mid">
                                                <span><strong>Type:</strong> {renderField(bed.bedType)}</span>
                                                <span><strong>Pos:</strong> {renderField(bed.position)}</span>
                                              </div>
                                              <div className="lst-bc-badges">
                                                {bed.smartBadges && bed.smartBadges.length > 0 ? bed.smartBadges.slice(0, 2).map((badge, idx) => <span key={idx} className="lst-bc-badge"><Zap size={10}/> {badge}</span>) : <span>No specific features</span>}
                                              </div>
                                            </div>
                                          );
                                        })
                                      ) : (
                                        <div className="lst-none">No Data Available</div>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                           })
                          ) : (
                            <div className="lst-none">No Data Available</div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="lst-none-card">No Data Available</div>
              )}
            </div>
          </section>
        </div>

        {/* Sidebar: Booking Summary */}
        <div className="lst-sidebar">
          <div className="lst-checkout-panel">
            <h3 className="lst-cp-title">Booking Summary</h3>
            
            <div className="lst-cp-selection">
              <div className="lst-cp-row">
                <span className="lst-cp-label">Building Name</span>
                <span className="lst-cp-val">{renderField(hostel.name)}</span>
              </div>
              <div className="lst-cp-row">
                <span className="lst-cp-label">Floor Number</span>
                <span className="lst-cp-val">{selectedFloor ? renderField(selectedFloor.floorNumber) : 'No Data Available'}</span>
              </div>
              <div className="lst-cp-row">
                <span className="lst-cp-label">Room Number</span>
                <span className="lst-cp-val">{selectedRoom ? renderField(selectedRoom.roomNumber) : 'No Data Available'}</span>
              </div>
              <div className="lst-cp-row highlight">
                <span className="lst-cp-label">Bed Number</span>
                <span className="lst-cp-val">{selectedBed ? renderField(selectedBed.bedNumber) : 'No Data Available'}</span>
              </div>
            </div>

            <div className="lst-cp-divider"></div>

            <div className="lst-cp-pricing">
              <div className="lst-cp-row">
                <span>Rent Amount</span>
                <span>{currentRent ? `₹${currentRent.toLocaleString()}` : 'No Data Available'}</span>
              </div>
              <div className="lst-cp-row">
                <span>Deposit Amount</span>
                <span>{currentDeposit ? `₹${currentDeposit.toLocaleString()}` : 'No Data Available'}</span>
              </div>
              <div className="lst-cp-row">
                <span>Food Charges</span>
                <span>{foodCost ? `₹${foodCost.toLocaleString()}` : 'No Data Available'}</span>
              </div>
              <div className="lst-cp-row">
                <span>Maintenance</span>
                <span>{maintenanceCost ? `₹${maintenanceCost.toLocaleString()}` : 'No Data Available'}</span>
              </div>
              <div className="lst-cp-divider"></div>
              <div className="lst-cp-row total">
                <span>Total Amount</span>
                <span className="amount">₹{totalDue.toLocaleString()}</span>
              </div>
            </div>

            <button 
              className="lst-checkout-btn" 
              disabled={!selectedBed}
              onClick={handleBooking}
            >
              Proceed to Booking <ChevronRight size={18} />
            </button>
            <p className="lst-cp-secure"><ShieldCheck size={14}/> Secure Livora Booking</p>
          </div>
        </div>
      </div>

      <ImageModal
        isOpen={modalInfo.isOpen}
        image={modalInfo.image}
        onClose={() => setModalInfo({ isOpen: false, image: '' })}
      />
    </div>
  );
};

export default Listing;
