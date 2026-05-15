import React, { useState, useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Package, Search, Plus, AlertTriangle, Trash2, Edit, History,
  Utensils, Brush, Hammer, MoreVertical, ChevronRight, CheckCircle2,
  AlertCircle, X, Save, Filter, ChevronLeft, Calendar, TrendingDown,
  Download, Upload, PieChart as PieIcon, BarChart3, ArrowUpDown, Info,
  Eye, Zap, Warehouse, LayoutList, SlidersHorizontal, Tag, ArrowUpRight,
  ArrowDownRight, Bookmark, ShieldCheck, FileSpreadsheet
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { api } from '../mockData';
import socket, { connectSocket } from '../utils/socket';

// --- PREMIUM CONFIG ---
const THEME = {
  primary: '#4F46E5', // Indigo
  success: '#10B981', // Emerald
  warning: '#F59E0B', // Amber
  danger: '#EF4444', // Rose
  text: '#1E293B',
  muted: '#64748B',
  border: '#E2E8F0',
  card: '#FFFFFF',
  bg: '#F8FAFC',
  glass: 'rgba(255, 255, 255, 0.8)'
};

const CATEGORIES = [
  { id: 'Groceries', name: 'Mess & Food', icon: <Utensils size={16}/>, color: THEME.success },
  { id: 'Cleaning', name: 'Hygiene', icon: <Brush size={16}/>, color: '#0EA5E9' },
  { id: 'Kitchen', name: 'Equipment', icon: <Hammer size={16}/>, color: '#8B5CF6' },
  { id: 'Miscellaneous', name: 'General', icon: <Package size={16}/>, color: THEME.warning }
];

const InventoryEnterprisePremium = () => {
  const { buildingId: urlBuildingId } = useParams();
  const activeBuildingId = urlBuildingId || localStorage.getItem('selectedBuildingId');

  // Core Data
  const [inventory, setInventory] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState('Admin'); // 'Admin' or 'Staff'

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [quickFilter, setQuickFilter] = useState('All'); 
  const [selectedCats, setSelectedCats] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [savedFilters, setSavedFilters] = useState([{ name: 'Critical FMCG', cats: ['Groceries'], quick: 'Low' }]);

  // Inline Edit State
  const [inlineEdit, setInlineEdit] = useState({ id: null, field: null, value: '' });

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '', category: 'Groceries', stock: 0, minThreshold: 5,
    unit: 'Kg', location: 'Main Store', buyPrice: 0, salePrice: 0, tax: 0
  });

  // Sync Logic
  useEffect(() => {
    fetchInventory();
    if (activeBuildingId) {
      connectSocket(activeBuildingId);
      const handleSync = () => fetchInventory();
      socket.on('inventoryAdded', handleSync);
      socket.on('inventoryUpdated', handleSync);
      socket.on('inventoryDeleted', handleSync);
      return () => {
        socket.off('inventoryAdded', handleSync);
        socket.off('inventoryUpdated', handleSync);
        socket.off('inventoryDeleted', handleSync);
      };
    }
  }, [activeBuildingId]);

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const data = await api.getInventory(activeBuildingId);
      setInventory(data || []);
      setActivities([
        { id: 1, type: 'refill', item: 'Milk (Dairy)', user: 'Staff', time: '15m ago', icon: <CheckCircle2 size={14}/> },
        { id: 2, type: 'price', item: 'Cleaning Phenyl', user: 'Admin', time: '1h ago', icon: <Tag size={14}/> },
        { id: 3, type: 'alert', item: 'Refined Oil', user: 'System', time: '3h ago', icon: <AlertTriangle size={14}/> }
      ]);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  // Logic: Filters & Search
  const filteredItems = useMemo(() => {
    return inventory.filter(item => {
      const matchSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat = selectedCats.length === 0 || selectedCats.includes(item.category);
      const matchQuick = quickFilter === 'All' ? true : 
                         quickFilter === 'Low' ? (item.stock > 0 && item.stock <= item.minThreshold) :
                         quickFilter === 'Out' ? (item.stock <= 0) : true;
      return matchSearch && matchCat && matchQuick;
    });
  }, [inventory, searchQuery, selectedCats, quickFilter]);

  const stats = useMemo(() => {
    const totalVal = inventory.reduce((acc, i) => acc + (i.stock * (i.buyPrice || 0)), 0);
    return { total: inventory.length, units: inventory.reduce((a,i)=>a+i.stock, 0), low: inventory.filter(i=>i.stock <= i.minThreshold).length, valuation: totalVal };
  }, [inventory]);

  const chartData = useMemo(() => {
    return [
      { name: 'Mon', v: 45 }, { name: 'Tue', v: 52 }, { name: 'Wed', v: 48 },
      { name: 'Thu', v: 61 }, { name: 'Fri', v: 55 }, { name: 'Sat', v: 67 },
      { name: 'Sun', v: 70 }
    ];
  }, [filteredItems]);

  const handleInlineSave = async () => {
    const item = inventory.find(i => (i.id || i._id) === inlineEdit.id);
    if (item) {
      try {
        await api.updateInventoryItem(inlineEdit.id, { ...item, [inlineEdit.field]: parseFloat(inlineEdit.value) || inlineEdit.value });
        setInlineEdit({ id: null, field: null, value: '' });
      } catch (err) { console.error(err); }
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (selectedItem) {
        await api.updateInventoryItem(selectedItem.id || selectedItem._id, formData);
      } else {
        await api.addInventoryItem({ ...formData, buildingId: activeBuildingId });
      }
      setIsModalOpen(false);
      setSelectedItem(null);
      fetchInventory();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ background: THEME.bg, minHeight: '100vh', padding: '2.5rem', fontFamily: "'Plus Jakarta Sans', sans-serif", color: THEME.text }}>
      
      {/* --- ENTERPRISE HEADER --- */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: THEME.primary, fontWeight: '900', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '0.6rem' }}>
            <ShieldCheck size={18} /> Enterprise Stock Command
          </div>
          <h1 style={{ fontSize: '2.8rem', fontWeight: '950', letterSpacing: '-0.05em', margin: 0 }}>Inventory Intelligence</h1>
          <p style={{ color: THEME.muted, fontSize: '1.1rem', fontWeight: '500', marginTop: '0.5rem' }}>Next-gen valuation, predictive audits, and resource tracking.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ position: 'relative', width: '320px' }}>
            <Search size={18} style={{ position: 'absolute', left: '1.2rem', top: '50%', transform: 'translateY(-50%)', color: THEME.muted }} />
            <input 
              type="text" placeholder="Smart Search SKUs..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              style={headerSearch}
            />
          </div>
          <button onClick={() => { setSelectedItem(null); setIsModalOpen(true); }} style={primaryBtn}><Plus size={20} strokeWidth={3} /> Register SKU</button>
        </div>
      </div>

      {/* --- STRATEGIC KPI CARDS WITH TRENDS --- */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
        <SummaryCard label="Active SKUs" value={stats.total} trend="+4" icon={<Package/>} color={THEME.primary} bg="#EEF2FF" isUp={true} />
        <SummaryCard label="Total Units" value={stats.units} trend="+124" icon={<Warehouse/>} color={THEME.success} bg="#F0FDF4" isUp={true} />
        <SummaryCard label="Low Alerts" value={stats.low} trend="-2" icon={<AlertTriangle/>} color={THEME.warning} bg="#FFFBEB" isUp={false} />
        <SummaryCard label="Valuation" value={`₹${stats.valuation.toLocaleString()}`} trend="+₹12.4k" icon={<BarChart3/>} color="#8B5CF6" bg="#F5F3FF" isUp={true} />
      </div>

      {/* --- SMART FILTER BAR --- */}
      <div style={panelStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '0.8rem' }}>
            {['All', 'Low', 'Out'].map(f => (
              <button 
                key={f} onClick={() => setQuickFilter(f)}
                style={{ ...pillBtn, background: quickFilter === f ? THEME.text : '#FFF', color: quickFilter === f ? '#FFF' : THEME.muted }}
              >
                {f} Stock
              </button>
            ))}
            <div style={{ width: '2px', height: '32px', background: THEME.border, margin: '0 0.5rem' }} />
            <button onClick={() => setIsDrawerOpen(true)} style={drawerBtn}><SlidersHorizontal size={18}/> Advanced Filters</button>
          </div>
          <div style={{ display: 'flex', gap: '0.8rem' }}>
            <button style={actionBtnAlt}><FileSpreadsheet size={18}/> Bulk Upload</button>
            <button style={actionBtnAlt}><Download size={18}/> Export Audit</button>
          </div>
        </div>

        {/* ACTIVE CHIPS & SAVED FILTERS */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
            {selectedCats.map(cat => <FilterChip key={cat} label={cat} onRemove={() => setSelectedCats(prev => prev.filter(c=>c!==cat))} />)}
            {searchQuery && <FilterChip label={`Search: ${searchQuery}`} onRemove={() => setSearchQuery('')} />}
            {(selectedCats.length > 0 || searchQuery !== '' || quickFilter !== 'All') && (
              <button onClick={() => {setSelectedCats([]); setSearchQuery(''); setQuickFilter('All');}} style={clearBtn}>Clear All</button>
            )}
          </div>
          <div style={{ display: 'flex', gap: '0.6rem' }}>
            <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: '800', color: THEME.muted, alignSelf: 'center' }}>SAVED:</p>
            {savedFilters.map(f => (
              <button key={f.name} onClick={() => { setSelectedCats(f.cats); setQuickFilter(f.quick); }} style={savedFilterBtn}><Bookmark size={12}/> {f.name}</button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2.5rem', marginTop: '3rem' }}>
        
        {/* --- MAIN REGISTRY: INLINE EDITABLE TABLE --- */}
        <main>
          <div style={{ ...panelStyle, padding: '1rem' }}>
            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 0.8rem' }}>
              <thead>
                <tr style={{ textAlign: 'left', color: THEME.muted, fontSize: '0.75rem', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                  <th style={{ padding: '0 1.2rem' }}>Product Registry</th>
                  <th>Category</th>
                  <th>Current Stock</th>
                  <th>Price (B/S)</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right', paddingRight: '1.2rem' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map(item => {
                  const isExpanded = expandedId === (item.id || item._id);
                  const isLow = item.stock <= item.minThreshold;
                  const cat = CATEGORIES.find(c => c.id === item.category) || CATEGORIES[0];
                  const itemId = item.id || item._id;

                  return (
                    <React.Fragment key={itemId}>
                      <tr className="registry-row" style={{ background: '#FFF', borderRadius: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.01)' }}>
                        <td style={{ padding: '1.2rem', borderRadius: '20px 0 0 20px', border: `1px solid ${THEME.border}`, borderRight: 'none' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: cat.color + '15', color: cat.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{cat.icon}</div>
                            <div>
                              <p style={{ margin: 0, fontWeight: '900', fontSize: '1.05rem' }}>{item.name}</p>
                              <p style={{ margin: 0, fontSize: '0.75rem', color: THEME.muted, fontWeight: '700' }}>SKU-{itemId.slice(-6).toUpperCase()}</p>
                            </div>
                          </div>
                        </td>
                        <td style={{ borderTop: `1px solid ${THEME.border}`, borderBottom: `1px solid ${THEME.border}` }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: '900', padding: '0.4rem 0.8rem', borderRadius: '10px', background: THEME.bg, color: THEME.muted }}>{item.category}</span>
                        </td>
                        <td style={{ borderTop: `1px solid ${THEME.border}`, borderBottom: `1px solid ${THEME.border}` }}>
                          {inlineEdit.id === itemId && inlineEdit.field === 'stock' ? (
                            <div style={{ display: 'flex', gap: '0.4rem' }}>
                              <input autoFocus value={inlineEdit.value} onChange={e => setInlineEdit({...inlineEdit, value: e.target.value})} onBlur={handleInlineSave} onKeyDown={e => e.key === 'Enter' && handleInlineSave()} style={inlineInput} />
                            </div>
                          ) : (
                            <div onDoubleClick={() => setInlineEdit({ id: itemId, field: 'stock', value: item.stock })} style={{ fontWeight: '950', fontSize: '1.2rem', cursor: 'text' }}>
                              {item.stock} <span style={{ fontSize: '0.75rem', color: THEME.muted, fontWeight: '700' }}>{item.unit}</span>
                            </div>
                          )}
                        </td>
                        <td style={{ borderTop: `1px solid ${THEME.border}`, borderBottom: `1px solid ${THEME.border}` }}>
                          <div style={{ fontSize: '0.9rem', fontWeight: '800' }}>₹{item.buyPrice} / ₹{item.salePrice}</div>
                        </td>
                        <td style={{ borderTop: `1px solid ${THEME.border}`, borderBottom: `1px solid ${THEME.border}` }}>
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', borderRadius: '14px', fontSize: '0.7rem', fontWeight: '900', background: isLow ? '#FEF2F2' : '#F0FDF4', color: isLow ? THEME.danger : THEME.success }}>
                            {isLow ? <AlertTriangle size={14} /> : <CheckCircle2 size={14} />}
                            {isLow ? 'CRITICAL' : 'OPTIMAL'}
                          </div>
                        </td>
                        <td style={{ padding: '1.2rem', borderRadius: '0 20px 20px 0', border: `1px solid ${THEME.border}`, borderLeft: 'none', textAlign: 'right' }}>
                          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                            <button onClick={()=>setExpandedId(isExpanded ? null : itemId)} style={actionBtn}><Eye size={18}/></button>
                            <button onClick={()=>{setSelectedItem(item); setFormData({...item}); setIsModalOpen(true);}} style={actionBtn}><Edit size={18}/></button>
                          </div>
                        </td>
                      </tr>
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            <td colSpan="6" style={{ padding: '0 1rem 1rem 1rem' }}>
                              <div style={expandPanel}>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem' }}>
                                  <div>
                                    <p style={subLabel}>Cost Analysis</p>
                                    <p style={subVal}>Taxation: {item.tax}%</p>
                                    <p style={subVal}>Valuation: ₹{(item.stock * item.buyPrice).toLocaleString()}</p>
                                  </div>
                                  <div>
                                    <p style={subLabel}>Sourcing</p>
                                    <p style={subVal}>Vendor: {item.vendorName || 'Not Set'}</p>
                                    <p style={subVal}>Lead Time: 2-4 Days</p>
                                  </div>
                                  <div style={{ gridColumn: 'span 2' }}>
                                    <p style={subLabel}>AI Predictive Insights</p>
                                    <div style={aiPanel}>
                                      <Zap size={20} color={THEME.primary} />
                                      <span>Current consumption suggests reordering <b>25 units</b> by next Wednesday to avoid stockout.</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </td>
                          </motion.tr>
                        )}
                      </AnimatePresence>
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </main>

        {/* --- RIGHT SIDEBAR: ANALYTICS & AUDITS --- */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div style={panelStyle}>
            <h3 style={panelTitle}><BarChart3 size={18}/> Stock Velocity</h3>
            <div style={{ height: '180px', width: '100%', minHeight: '180px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <Area type="monotone" dataKey="v" stroke={THEME.primary} strokeWidth={3} fill={THEME.primary + '10'} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <p style={{ margin: '1rem 0 0 0', fontSize: '0.8rem', fontWeight: '800', color: THEME.muted, textAlign: 'center' }}>Weekly Consumption Trend</p>
          </div>

          <div style={panelStyle}>
            <h3 style={panelTitle}><History size={18}/> Live Audit Trail</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'relative' }}>
              <div style={{ position: 'absolute', left: '11px', top: '10px', bottom: '10px', width: '2px', background: '#F1F5F9' }} />
              {activities.map(act => (
                <div key={act.id} style={{ display: 'flex', gap: '1.2rem', position: 'relative', zIndex: 1 }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#FFF', border: `2px solid ${THEME.primary}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {act.icon}
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: '850' }}>{act.item}</p>
                    <p style={{ margin: '2px 0 0 0', fontSize: '0.7rem', color: THEME.muted, fontWeight: '700' }}>{act.user} • {act.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>

      {/* --- ADVANCED FILTER DRAWER --- */}
      <AnimatePresence>
        {isDrawerOpen && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 2000, display: 'flex', justifyContent: 'flex-end' }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsDrawerOpen(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(8px)' }} />
            <motion.div initial={{ x: 400 }} animate={{ x: 0 }} exit={{ x: 400 }} style={drawerStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                <h2 style={{ margin: 0, fontSize: '1.8rem', fontWeight: '950' }}>Advanced Filters</h2>
                <button onClick={() => setIsDrawerOpen(false)} style={closeBtn}><X size={20}/></button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div>
                  <p style={filterLabel}>Product Categories</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                    {CATEGORIES.map(c => (
                      <label key={c.id} style={checkboxRow}>
                        <input type="checkbox" checked={selectedCats.includes(c.id)} onChange={() => {
                          if (selectedCats.includes(c.id)) setSelectedCats(prev => prev.filter(x=>x!==c.id));
                          else setSelectedCats([...selectedCats, c.id]);
                        }} />
                        <span>{c.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div style={{ marginTop: 'auto' }}>
                  <button onClick={() => {setSelectedCats([]); setQuickFilter('All'); setIsDrawerOpen(false);}} style={primaryBtn}>Reset All Filters</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- REGISTER MODAL --- */}
      <AnimatePresence>
        {isModalOpen && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 2100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={()=>setIsModalOpen(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(10px)' }} />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} style={modalStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                <div><h2 style={{ margin: 0, fontSize: '2rem', fontWeight: '950' }}>{selectedItem ? 'Update Asset' : 'Register SKU'}</h2><p style={{ margin: 0, color: THEME.muted, fontWeight: '700' }}>Enterprise Registry Protocol</p></div>
                <button onClick={()=>setIsModalOpen(false)} style={closeBtn}><X size={20}/></button>
              </div>
              <form onSubmit={handleSave}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
                    <div><label style={modalLabel}>SKU Name</label><input required value={formData.name} onChange={e=>setFormData({...formData, name: e.target.value})} style={modalInput} /></div>
                    <div><label style={modalLabel}>Category</label><select value={formData.category} onChange={e=>setFormData({...formData, category: e.target.value})} style={modalInput}>{CATEGORIES.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                    <div><label style={modalLabel}>Initial Stock</label><input type="number" value={formData.stock} onChange={e=>setFormData({...formData, stock: parseInt(e.target.value)})} style={modalInput} /></div>
                    <div><label style={modalLabel}>Buy Price</label><input type="number" value={formData.buyPrice} onChange={e=>setFormData({...formData, buyPrice: parseFloat(e.target.value)})} style={modalInput} /></div>
                    <div><label style={modalLabel}>Alert Threshold</label><input type="number" value={formData.minThreshold} onChange={e=>setFormData({...formData, minThreshold: parseInt(e.target.value)})} style={modalInput} /></div>
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                    <button type="button" onClick={()=>setIsModalOpen(false)} style={secondaryBtnAlt}>Cancel</button>
                    <button type="submit" style={primaryBtn}><Zap size={20}/> Complete Registration</button>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        .registry-row:hover { background: #F8FAFF !important; transform: scale(1.002); }
        .registry-row td { transition: 0.2s; }
        input[type="checkbox"] { width: 18px; height: 18px; cursor: pointer; accent-color: ${THEME.primary}; }
      `}</style>
    </div>
  );
};

// --- STYLING ---
const headerSearch = { width: '100%', padding: '1.1rem 1.1rem 1.1rem 3.5rem', borderRadius: '22px', border: `2px solid ${THEME.border}`, outline: 'none', fontWeight: '800', fontSize: '1rem', background: '#FFF' };
const primaryBtn = { padding: '1.1rem 2rem', borderRadius: '22px', border: 'none', background: THEME.text, color: '#FFF', fontWeight: '950', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.8rem', cursor: 'pointer', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' };
const pillBtn = { padding: '0.7rem 1.5rem', borderRadius: '14px', border: `1px solid ${THEME.border}`, fontWeight: '900', fontSize: '0.9rem', cursor: 'pointer', transition: '0.2s' };
const drawerBtn = { padding: '0.7rem 1.5rem', borderRadius: '14px', border: `2px solid ${THEME.border}`, background: '#FFF', color: THEME.muted, fontWeight: '900', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer' };
const panelStyle = { background: '#FFF', padding: '1.8rem', borderRadius: '28px', border: `1px solid ${THEME.border}`, boxShadow: '0 10px 30px rgba(0,0,0,0.02)' };
const actionBtn = { width: '42px', height: '42px', borderRadius: '12px', border: 'none', background: THEME.bg, color: THEME.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' };
const actionBtnAlt = { padding: '0.8rem 1.4rem', borderRadius: '14px', border: `2px solid ${THEME.border}`, background: '#FFF', color: THEME.muted, fontWeight: '900', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.8rem', cursor: 'pointer' };
const closeBtn = { background: THEME.bg, border: 'none', padding: '0.7rem', borderRadius: '14px', color: THEME.muted, cursor: 'pointer' };
const panelTitle = { margin: '0 0 1.5rem 0', display: 'flex', alignItems: 'center', gap: '0.8rem', fontSize: '1rem', fontWeight: '950', color: THEME.text, textTransform: 'uppercase', letterSpacing: '0.05em' };
const filterLabel = { fontSize: '0.8rem', fontWeight: '950', color: THEME.muted, textTransform: 'uppercase', marginBottom: '1.2rem' };
const checkboxRow = { display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '1rem', fontWeight: '900', color: THEME.text, cursor: 'pointer' };
const clearBtn = { border: 'none', background: 'transparent', color: THEME.danger, fontSize: '0.85rem', fontWeight: '900', cursor: 'pointer', padding: '0 0.5rem' };
const savedFilterBtn = { display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 1rem', borderRadius: '10px', background: '#F8FAFC', border: `1px solid ${THEME.border}`, color: THEME.muted, fontSize: '0.75rem', fontWeight: '850', cursor: 'pointer' };
const expandPanel = { background: '#FAFBFF', borderRadius: '24px', border: `1px solid ${THEME.border}`, padding: '2rem', marginTop: '-0.5rem' };
const subLabel = { fontSize: '0.75rem', fontWeight: '950', color: THEME.muted, textTransform: 'uppercase', marginBottom: '0.8rem' };
const subVal = { fontSize: '0.95rem', fontWeight: '800', color: THEME.text, margin: '0.3rem 0' };
const aiPanel = { padding: '1.2rem', borderRadius: '18px', background: '#FFF', border: `1px solid ${THEME.primary}20`, display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.9rem', fontWeight: '800', color: '#475569' };
const inlineInput = { width: '60px', padding: '0.4rem', borderRadius: '8px', border: `2px solid ${THEME.primary}`, outline: 'none', fontWeight: '950', fontSize: '1.1rem', textAlign: 'center' };
const drawerStyle = { position: 'relative', width: '420px', height: '100%', background: '#FFF', padding: '4rem', boxShadow: '-10px 0 60px rgba(0,0,0,0.1)' };
const modalStyle = { position: 'relative', width: '100%', maxWidth: '700px', background: '#FFF', borderRadius: '40px', padding: '4rem', boxShadow: '0 50px 120px rgba(0,0,0,0.3)' };
const modalInput = { width: '100%', padding: '1.2rem', borderRadius: '24px', border: `2px solid ${THEME.border}`, background: THEME.bg, outline: 'none', fontWeight: '800', fontSize: '1rem' };
const modalLabel = { display: 'block', marginBottom: '0.8rem', fontSize: '0.85rem', fontWeight: '950', color: THEME.text, textTransform: 'uppercase' };
const secondaryBtnAlt = { flex: 1, padding: '1.1rem', borderRadius: '22px', border: `2px solid ${THEME.border}`, background: '#FFF', color: THEME.muted, fontWeight: '900', cursor: 'pointer' };

const FilterChip = ({ label, onRemove }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.5rem 1.2rem', borderRadius: '12px', background: THEME.primary + '10', color: THEME.primary, fontSize: '0.85rem', fontWeight: '900' }}>
    {label} <X size={14} style={{ cursor: 'pointer' }} onClick={onRemove} />
  </div>
);

const SummaryCard = ({ label, value, trend, icon, color, bg, isUp }) => (
  <div style={{ ...panelStyle, position: 'relative', overflow: 'hidden' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
      <div style={{ color, background: bg, padding: '1rem', borderRadius: '18px' }}>{icon}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: isUp ? THEME.success : THEME.danger, background: (isUp ? THEME.success : THEME.danger) + '10', padding: '0.4rem 0.8rem', borderRadius: '12px', fontSize: '0.8rem', fontWeight: '950' }}>
        {isUp ? <ArrowUpRight size={14}/> : <ArrowDownRight size={14}/>} {trend}
      </div>
    </div>
    <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: '900', color: THEME.muted, textTransform: 'uppercase' }}>{label}</p>
    <h2 style={{ margin: '0.2rem 0 1.2rem 0', fontSize: '2.4rem', fontWeight: '950' }}>{typeof value === 'number' ? value.toLocaleString() : value}</h2>
    <div style={{ width: '100%', height: '6px', background: THEME.bg, borderRadius: '10px' }}>
      <motion.div initial={{ width: 0 }} animate={{ width: '80%' }} style={{ height: '100%', background: color, borderRadius: '10px' }} />
    </div>
  </div>
);

export default InventoryEnterprisePremium;
