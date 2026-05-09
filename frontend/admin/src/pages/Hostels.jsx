import React, { useState } from 'react';
import { 
  Building2, Plus, Search, Filter, MoreHorizontal, 
  MapPin, Users, Activity, ArrowUpRight, Zap,
  TrendingUp, ShieldCheck, Home, Target, ChevronRight,
  Settings2, Download
} from 'lucide-react';
import Modal from '../components/Modal';

const Hostels = () => {
  const [activeModal, setActiveModal] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [hostels] = useState([
    { id: 1, name: 'Sapphire Men\'s PG', location: 'Koramangala, BLR', owner: 'Vikram M.', capacity: 120, occupancy: 85, status: 'Active', revenue: '4.2L', health: 92 },
    { id: 2, name: 'Royal Ladies Nest', location: 'HSR Layout, BLR', owner: 'Anjali S.', capacity: 80, occupancy: 92, status: 'Active', revenue: '3.8L', health: 96 },
    { id: 3, name: 'Metro Living Space', location: 'Indiranagar, BLR', owner: 'Suresh I.', capacity: 150, occupancy: 42, status: 'Warning', revenue: '1.1L', health: 54 },
    { id: 4, name: 'Green Valley Hostel', location: 'Viman Nagar, PUN', owner: 'Rahul K.', capacity: 60, occupancy: 100, status: 'Active', revenue: '2.9L', health: 100 },
  ]);

  const stats = [
    { label: 'Asset Nodes', value: '1,240', change: '+12', icon: <Building2 size={18} />, color: 'var(--primary)' },
    { label: 'Global Health', value: '88.4%', change: '+4.2%', icon: <Activity size={18} />, color: 'var(--success)' },
    { label: 'Deployment Capacity', value: '54k', change: '+2.4k', icon: <Zap size={18} />, color: 'var(--accent)' },
  ];

  return (
    <div className="space-y-6 animate-fade pb-20">
      {/* --- OPERATIONAL HEADER --- */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-card/40 p-6 rounded-2xl border border-border">
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight flex items-center gap-2">
            Infrastructure Grid <span className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full uppercase">Strategic Assets</span>
          </h1>
          <p className="text-sm text-text-muted mt-1">Unified management of platform-wide property nodes and operational health.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-widest bg-background border border-border rounded-xl text-text-secondary hover:bg-text-primary/5 transition-all">
            <Download size={14} /> Audit Trail
          </button>
          <button className="flex items-center gap-2 px-6 py-2 text-xs font-bold uppercase tracking-widest bg-primary text-white rounded-xl hover:bg-primary-dark transition-all shadow-lg shadow-primary/20" onClick={() => setActiveModal('register')}>
            <Plus size={18} /> Register Node
          </button>
        </div>
      </div>

      {/* --- STATS OVERVIEW --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="layer-2 p-6 group hover:border-primary/30 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-background border border-border flex items-center justify-center text-text-muted group-hover:text-primary transition-colors">
                {stat.icon}
              </div>
              <span className="text-[10px] font-bold text-success bg-success/10 px-2 py-0.5 rounded-full">{stat.change}</span>
            </div>
            <h3 className="text-text-muted text-[10px] font-bold uppercase tracking-[0.15em]">{stat.label}</h3>
            <div className="text-2xl font-bold text-text-primary tracking-tight mt-1">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* --- FILTERS --- */}
      <div className="layer-2 p-4 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative flex items-center group">
          <Search size={16} className="absolute left-4 text-text-muted group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            placeholder="Search by city, property name, or owner reference..." 
            className="w-full bg-background border border-border rounded-xl py-2.5 pl-12 pr-4 text-sm focus:outline-none focus:border-primary/50 transition-all text-text-primary placeholder:text-text-muted"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <button className="flex items-center justify-center px-4 rounded-xl bg-background border border-border text-text-secondary hover:bg-text-primary/5 transition-all text-xs font-bold gap-2">
            <Filter size={14} /> Filters
          </button>
          <button className="flex items-center justify-center w-12 h-12 rounded-xl bg-background border border-border text-text-secondary hover:bg-text-primary/5 transition-all">
            <Settings2 size={18} />
          </button>
        </div>
      </div>

      {/* --- PROPERTY GRID --- */}
      <div className="grid grid-cols-12 gap-6">
        {hostels.map((h) => (
          <div key={h.id} className="col-span-12 md:col-span-6 xl:col-span-4 layer-2 p-6 flex flex-col group hover:-translate-y-1 transition-all duration-300">
            {/* Card Header */}
            <div className="flex justify-between items-start mb-6">
              <div className="flex gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm transition-colors duration-300 ${
                  h.status === 'Active' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
                }`}>
                  <Home size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-text-primary tracking-tight leading-tight group-hover:text-primary transition-colors">{h.name}</h3>
                  <div className="flex items-center gap-1.5 text-text-muted text-[10px] mt-1 font-medium">
                    <MapPin size={10} /> {h.location}
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[9px] font-bold uppercase rounded-md border ${
                  h.status === 'Active' ? 'bg-success/10 text-success border-success/20' : 'bg-warning/10 text-warning border-warning/20'
                }`}>
                  <span className={`w-1 h-1 rounded-full ${h.status === 'Active' ? 'bg-success' : 'bg-warning'}`}></span>
                  {h.status}
                </span>
                <span className="text-[9px] font-bold text-text-muted opacity-50 tracking-widest">#{h.id}X00</span>
              </div>
            </div>

            {/* Core Metrics */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-background border border-border p-4 rounded-2xl flex flex-col justify-center transition-all group-hover:border-primary/20">
                <p className="text-[9px] font-bold text-text-muted uppercase tracking-widest mb-1">Occupancy</p>
                <div className="flex items-baseline gap-1.5">
                  <span className={`text-xl font-bold tracking-tight ${h.occupancy > 85 ? 'text-success' : 'text-text-primary'}`}>{h.occupancy}%</span>
                  <span className="text-[10px] text-text-muted font-medium">/ {h.capacity}</span>
                </div>
              </div>
              <div className="bg-background border border-border p-4 rounded-2xl flex flex-col justify-center transition-all group-hover:border-primary/20">
                <p className="text-[9px] font-bold text-text-muted uppercase tracking-widest mb-1">Revenue Stream</p>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xl font-bold text-text-primary tracking-tight">₹{h.revenue}</span>
                  <span className="text-[9px] text-success font-bold flex items-center gap-0.5"><TrendingUp size={10} /> +12%</span>
                </div>
              </div>
            </div>

            {/* Progress / Health bar */}
            <div className="mb-6 space-y-2">
              <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider">
                <span className="text-text-muted">Node Health Score</span>
                <span className={h.health > 80 ? 'text-success' : h.health > 50 ? 'text-warning' : 'text-danger'}>{h.health}%</span>
              </div>
              <div className="h-1.5 w-full bg-background border border-border/50 rounded-full overflow-hidden shadow-inner">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ${
                    h.health > 80 ? 'bg-gradient-to-r from-success to-primary' : h.health > 50 ? 'bg-warning' : 'bg-danger'
                  }`} 
                  style={{ width: `${h.health}%` }}
                ></div>
              </div>
            </div>

            {/* Card Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center font-bold text-[10px] text-primary shadow-sm">
                  {h.owner.charAt(0)}
                </div>
                <div>
                  <p className="text-[9px] font-bold text-text-muted uppercase leading-none">Ops Lead</p>
                  <p className="text-xs font-bold text-text-primary mt-0.5">{h.owner}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="p-2 rounded-lg bg-background border border-border text-text-muted hover:text-primary hover:border-primary/30 transition-all shadow-sm">
                  <ArrowUpRight size={14} />
                </button>
                <button className="p-2 rounded-lg bg-background border border-border text-text-muted hover:text-text-primary transition-all shadow-sm">
                  <MoreHorizontal size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* --- ADD NEW PROPERTY CARD --- */}
        <div 
          onClick={() => setActiveModal('register')}
          className="col-span-12 md:col-span-6 xl:col-span-4 layer-2 border-dashed border-2 hover:border-primary/50 flex flex-col items-center justify-center p-8 gap-4 group cursor-pointer transition-all bg-primary/5 hover:bg-primary/10"
        >
          <div className="w-16 h-16 rounded-2xl bg-background border border-border flex items-center justify-center text-text-muted group-hover:text-primary group-hover:scale-110 transition-all">
            <Plus size={32} />
          </div>
          <div className="text-center">
            <h3 className="text-lg font-bold text-text-primary tracking-tight">Expand Infrastructure</h3>
            <p className="text-xs text-text-muted mt-1 max-w-[200px]">Initialize a new property node into the platform cluster.</p>
          </div>
        </div>
      </div>

      {/* --- REGISTRATION MODAL --- */}
      <Modal 
        isOpen={activeModal === 'register'} 
        onClose={() => setActiveModal(null)}
        title="Initialize New Property Node"
        footer={
          <div className="flex justify-end gap-3 w-full">
            <button className="px-4 py-2 text-xs font-bold text-text-secondary hover:bg-text-primary/5 rounded-xl transition-all" onClick={() => setActiveModal(null)}>Cancel</button>
            <button className="px-6 py-2 text-xs font-bold bg-primary text-white rounded-xl hover:bg-primary-dark transition-all shadow-lg shadow-primary/20" onClick={() => setActiveModal(null)}>Confirm Deployment</button>
          </div>
        }
      >
        <div className="space-y-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest ml-1">Property Name</label>
              <input className="w-full bg-background border border-border rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-primary/50 text-text-primary placeholder:text-text-muted transition-all" placeholder="e.g. Emerald Heights" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest ml-1">Asset Category</label>
              <select className="w-full bg-background border border-border rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-primary/50 text-text-primary transition-all">
                <option>Premium PG</option>
                <option>Standard Hostel</option>
                <option>Elite Suites</option>
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest ml-1">Geographical Hub</label>
            <div className="relative flex items-center group">
              <MapPin size={16} className="absolute left-4 text-text-muted group-focus-within:text-primary transition-colors" />
              <input className="w-full bg-background border border-border rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-primary/50 text-text-primary placeholder:text-text-muted transition-all" placeholder="Search for location..." />
            </div>
          </div>
          <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 flex gap-4 items-center">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <Target size={20} />
            </div>
            <div>
              <p className="text-xs font-bold text-text-primary">System Recommendation</p>
              <p className="text-[10px] text-text-muted leading-tight mt-0.5">High demand detected in Koramangala area. Expected break-even in 14 months.</p>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Hostels;
