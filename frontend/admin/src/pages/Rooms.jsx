import React, { useState, useEffect, useCallback } from 'react';
import { 
  Search, Filter, BedDouble, CheckCircle, XCircle, 
  MoreHorizontal, Home, Users, Building, Plus,
  Wrench, Activity, Trash2, Edit3, Eye, Calendar,
  ArrowUpRight, TrendingUp, DollarSign, Layers,
  ChevronRight, ArrowLeft, ShieldCheck, CheckCircle2,
  FileText, Clock, MapPin, Zap, Download, Loader2
} from 'lucide-react';
import Modal from '../components/Modal';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API = 'http://localhost:5000/api/admin';

const Rooms = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [platformStats, setPlatformStats] = useState(null);

  const fetchRooms = useCallback(async () => {
    setLoading(true);
    try {
      const [roomsRes, statsRes] = await Promise.all([
        axios.get(`${API}/rooms`, { params: { search: searchTerm || undefined } }),
        axios.get(`${API}/stats`)
      ]);
      setRooms(roomsRes.data.rooms || []);
      setPlatformStats(statsRes.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [searchTerm]);

  useEffect(() => { fetchRooms(); }, [fetchRooms]);

  const stats = [
    { label: 'Total Units', value: platformStats?.totalRooms || '—', icon: <Building />, color: 'primary' },
    { label: 'Platform Beds', value: platformStats?.totalBeds || '—', icon: <BedDouble />, color: 'indigo' },
    { label: 'Vacant Nodes', value: platformStats?.vacantBeds || '—', icon: <CheckCircle />, color: 'success' },
  ];

  return (
    <div className="space-y-10 pb-20 animate-fade">
      
      {/* --- BACK NAVIGATION --- */}
      <button 
        onClick={() => navigate('/dashboard')}
        className="flex items-center gap-2 text-text-muted hover:text-primary transition-colors text-[10px] font-black uppercase tracking-[0.2em] group"
      >
        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
        Back to Dashboard
      </button>

      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl text-premium-header italic">Inventory Hub: Rooms</h1>
          <p className="text-sm text-text-muted mt-1 font-medium italic">Global room manifest and structural monitoring.</p>
        </div>
        <button className="btn-premium"><Plus size={18} strokeWidth={3} /> Add Room Node</button>
      </div>

      {/* --- KPI HUD --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="card-classic p-6 flex items-center gap-5 group border-none glass-effect">
            <div className={`w-14 h-14 rounded-2xl bg-${stat.color === 'primary' ? 'primary' : stat.color + '-500'}/10 text-${stat.color === 'primary' ? 'primary' : stat.color + '-500'} flex items-center justify-center border border-${stat.color === 'primary' ? 'primary' : stat.color + '-500'}/10 group-hover:scale-110 transition-transform duration-300`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-premium-label mb-1">{stat.label}</p>
              <h3 className="text-2xl font-black text-text-primary tracking-tighter italic">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* --- TABLE --- */}
      <div className="card-classic overflow-hidden">
        <div className="p-6 border-b border-border/50 bg-slate-50/50 flex justify-between items-center">
           <div className="relative w-96 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" size={18} />
              <input 
                type="text" 
                className="w-full bg-background border border-border rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-primary transition-all"
                placeholder="Search Room # or Type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>
        </div>
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-slate-50/50 border-b border-border">
                <th className="py-5 px-8 text-[10px] font-black text-text-muted uppercase tracking-widest">Room #</th>
                <th className="py-5 px-4 text-[10px] font-black text-text-muted uppercase tracking-widest">Property Node</th>
                <th className="py-5 px-4 text-[10px] font-black text-text-muted uppercase tracking-widest">Room Type</th>
                <th className="py-5 px-4 text-[10px] font-black text-text-muted uppercase tracking-widest">Amenities</th>
                <th className="py-5 px-8 text-[10px] font-black text-text-muted uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {loading ? (
                <tr><td colSpan={5} className="py-20 text-center"><Loader2 size={32} className="animate-spin mx-auto text-primary opacity-20" /></td></tr>
              ) : rooms.length === 0 ? (
                <tr><td colSpan={5} className="py-20 text-center text-text-muted font-bold italic">No room nodes detected</td></tr>
              ) : rooms.map((r) => (
                <tr key={r._id} className="group hover:bg-slate-50/50 transition-all">
                  <td className="py-5 px-8 font-black text-primary font-mono italic">#{r.roomNumber || '—'}</td>
                  <td className="py-5 px-4">
                    <p className="text-[13px] font-black text-text-primary uppercase tracking-tight">{r.buildingId?.name || 'Generic Property'}</p>
                  </td>
                  <td className="py-5 px-4">
                    <span className="text-[11px] font-black text-text-secondary uppercase tracking-widest bg-slate-100 px-2 py-1 rounded-lg">{r.roomType || 'Standard'}</span>
                  </td>
                  <td className="py-5 px-4">
                    <div className="flex gap-1">
                      {(r.amenities || ['Wifi', 'Security']).map((a, i) => (
                        <span key={i} className="w-2 h-2 rounded-full bg-emerald-500" title={a} />
                      ))}
                    </div>
                  </td>
                  <td className="py-5 px-8 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-text-muted hover:text-primary transition-all"><Edit3 size={16} /></button>
                      <button className="p-2 text-text-muted hover:text-rose-500 transition-all"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Rooms;
