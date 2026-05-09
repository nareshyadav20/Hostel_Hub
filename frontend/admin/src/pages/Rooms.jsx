import React, { useState } from 'react';
import { Search, Filter, BedDouble, CheckCircle, XCircle, MoreHorizontal, Home, Users, Building, Plus } from 'lucide-react';

const Rooms = () => {
  const [rooms] = useState([
    { id: '101', type: 'Double Sharing', property: 'Sapphire PG', occupants: 2, capacity: 2, status: 'Full', price: '₹12,000' },
    { id: '102', type: 'Single sharing', property: 'Sapphire PG', occupants: 0, capacity: 1, status: 'Vacant', price: '₹18,000' },
    { id: '201', type: 'Triple Sharing', property: 'Elite Living', occupants: 2, capacity: 3, status: 'Partial', price: '₹10,000' },
    { id: '202', type: 'Double Sharing', property: 'Elite Living', occupants: 1, capacity: 2, status: 'Partial', price: '₹12,000' },
    { id: '301', type: 'Single Sharing', property: 'Tech Park PG', occupants: 1, capacity: 1, status: 'Full', price: '₹22,000' },
  ]);

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">Inventory: Rooms</h1>
          <p className="text-sm font-medium text-text-muted mt-1">Global inventory of living spaces, occupancy states, and pricing nodes.</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-all shadow-lg shadow-primary/20">
          <Plus size={18} /> Add Room Config
        </button>
      </div>

      {/* KPI Cluster */}
      <div className="grid grid-cols-12 gap-6">
        {[
          { label: 'Total Inventory', value: '456', sub: 'Active Rooms', icon: <Building />, color: 'primary' },
          { label: 'Full Occupancy', value: '382', sub: '83.7% Efficiency', icon: <CheckCircle />, color: 'success' },
          { label: 'Available Now', value: '42', sub: '9.2% Vacancy', icon: <BedDouble />, color: 'warning' },
          { label: 'Avg Rent/Room', value: '₹14,200', sub: '+5% this month', icon: <Home />, color: 'accent' }
        ].map((stat, i) => (
          <div key={i} className="col-span-12 md:col-span-6 lg:col-span-3 layer-2 p-6 group">
            <div className={`w-12 h-12 rounded-2xl bg-${stat.color}/10 text-${stat.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
              {stat.icon}
            </div>
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{stat.label}</p>
            <h3 className="text-2xl font-bold text-text-primary mt-1 tracking-tight">{stat.value}</h3>
            <p className="text-[10px] text-text-muted font-medium mt-1">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search by Room #, Property, or Type..." 
            className="w-full bg-card/50 border border-border rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-primary/50 transition-all text-text-primary shadow-sm"
          />
        </div>
        <button className="p-3 bg-card border border-border rounded-2xl text-text-muted hover:text-primary transition-all shadow-sm">
          <Filter size={20} />
        </button>
      </div>

      {/* Room Grid */}
      <div className="grid grid-cols-12 gap-6">
         {rooms.map((room) => (
            <div key={room.id} className="col-span-12 md:col-span-6 lg:col-span-4 layer-2 overflow-hidden group hover:border-primary/30 transition-all cursor-pointer">
               <div className="p-6">
                  <div className="flex justify-between items-start mb-6">
                     <div>
                        <p className="text-[10px] font-black text-text-muted tracking-widest uppercase mb-1">ROOM {room.id}</p>
                        <h3 className="text-lg font-bold text-text-primary">{room.type}</h3>
                        <p className="text-xs text-primary font-bold mt-1">{room.property}</p>
                     </div>
                     <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border ${
                        room.status === 'Full' ? 'bg-success/10 text-success border-success/20' : 
                        room.status === 'Vacant' ? 'bg-danger/10 text-danger border-danger/20' : 
                        'bg-warning/10 text-warning border-warning/20'
                     }`}>
                        {room.status.toUpperCase()}
                     </span>
                  </div>

                  <div className="space-y-4">
                     <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                           <Users size={14} className="text-text-muted" />
                           <span className="text-xs font-bold text-text-secondary">Occupancy</span>
                        </div>
                        <div className="flex items-center gap-2">
                           <span className="text-xs font-bold text-text-primary">{room.occupants}/{room.capacity}</span>
                           <div className="w-16 h-1.5 bg-background border border-border rounded-full overflow-hidden">
                              <div className="h-full bg-primary" style={{ width: `${(room.occupants/room.capacity)*100}%` }}></div>
                           </div>
                        </div>
                     </div>
                     <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                           <Home size={14} className="text-text-muted" />
                           <span className="text-xs font-bold text-text-secondary">Monthly Rate</span>
                        </div>
                        <span className="text-sm font-bold text-text-primary">{room.price}</span>
                     </div>
                  </div>
               </div>
               <div className="px-6 py-4 bg-card/50 border-t border-border flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="text-[10px] font-bold text-primary uppercase tracking-widest hover:underline">View Occupants</button>
                  <div className="flex items-center gap-2">
                     <button className="p-1.5 rounded-lg hover:bg-primary/10 text-text-muted hover:text-primary transition-all"><Plus size={14} /></button>
                     <button className="p-1.5 rounded-lg hover:bg-primary/10 text-text-muted hover:text-primary transition-all"><MoreHorizontal size={14} /></button>
                  </div>
               </div>
            </div>
         ))}
      </div>
    </div>
  );
};

export default Rooms;
