import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../mockData';
import { Package, AlertTriangle, Filter, Plus, RefreshCw, Info, TrendingDown, X, CheckCircle, Upload, Download, BedDouble, Coffee, MapPin, Box, Zap, CreditCard, ShieldCheck, ShoppingCart } from 'lucide-react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';

// --- SHARED COMPONENTS ---
const Modal = ({ isOpen, onClose, title, children, maxWidth = '700px' }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        style={{
          position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 2000, backdropFilter: 'blur(8px)', padding: '1rem'
        }}
        onClick={onClose}
      >
        <motion.div
          initial={{ y: 50, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 50, opacity: 0, scale: 0.95 }}
          className="card"
          onClick={e => e.stopPropagation()}
          style={{
            width: '100%', maxWidth, padding: '0',
            maxHeight: '94vh', overflowY: 'auto', background: '#F8FAFC',
            borderRadius: '20px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column'
          }}
        >
          <div style={{ padding: '1.5rem 2rem', background: '#FFFFFF', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 10 }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#0F172A', letterSpacing: '-0.02em', margin: 0 }}>{title}</h2>
            <button onClick={onClose} style={{ background: '#F1F5F9', border: 'none', color: '#64748B', cursor: 'pointer', padding: '0.5rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>
              <X size={20} />
            </button>
          </div>
          <div style={{ padding: '2rem' }}>{children}</div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

const Inventory = () => {
  const { buildingId: urlBuildingId } = useParams();
  const activeBuildingId = urlBuildingId || localStorage.getItem('selectedBuildingId');

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInventory();
  }, [activeBuildingId]);

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const data = await api.getInventory(activeBuildingId);
      setItems(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const [activeTab, setActiveTab] = useState('All');
  const [search, setSearch] = useState('');

  // Modals State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [restockOpen, setRestockOpen] = useState(false);

  const [selectedItem, setSelectedItem] = useState(null);
  const [restockItems, setRestockItems] = useState([]);
  const [restockSent, setRestockSent] = useState(false);
  const [actionQuantity, setActionQuantity] = useState(1);
  const [actionLocation, setActionLocation] = useState('');

  // Handlers
  const handleIssueSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.updateInventoryItem(selectedItem.id, {
        stock: selectedItem.stock - actionQuantity,
        inUse: selectedItem.inUse + actionQuantity
      });
      fetchInventory();
      setIsIssueModalOpen(false);
      setActionQuantity(1);
      setActionLocation('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleReturnSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.updateInventoryItem(selectedItem.id, {
        stock: selectedItem.stock + actionQuantity,
        inUse: Math.max(0, selectedItem.inUse - actionQuantity)
      });
      fetchInventory();
      setIsReturnModalOpen(false);
      setActionQuantity(1);
    } catch (err) {
      console.error(err);
    }
  };

  // Derived Data
  const filteredItems = (items || []).filter(item => {
    const matchesSearch = (item.name || '').toLowerCase().includes(search.toLowerCase());
    const matchesTab = activeTab === 'All' || item.type === activeTab;
    return matchesSearch && matchesTab;
  });

  const totalItems = items?.length || 0;
  const totalInUse = (items || []).reduce((sum, item) => sum + (item.inUse || 0), 0);
  const lowStockItems = (items || []).filter(i => i.stock < i.minThreshold);
  const damagedAssets = (items || []).filter(i => i.damaged > 0);

  // UI Helpers
  const inputStyle = { padding: '0.8rem 1rem', borderRadius: '10px', border: '1px solid #E2E8F0', background: '#FFFFFF', color: '#1E293B', width: '100%', fontSize: '0.95rem', outline: 'none' };

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out', minHeight: '100vh', background: '#F8FAFC', padding: '0.5rem' }}>

      {/* HEADER */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: '900', color: '#0F172A', marginBottom: '0.2rem', letterSpacing: '-0.03em', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Box size={32} color="#3B82F6" /> Inventory & Assets
          </h1>
          <p style={{ color: '#64748B', fontSize: '1rem', fontWeight: '500', margin: 0 }}>Track stock levels, issue assets, and manage property supplies.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn" onClick={() => {
            const prefill = lowStockItems.map(i => ({ name: i.name, needed: i.minThreshold - i.stock + 10, unit: i.unit }));
            setRestockItems(prefill);
            setRestockSent(false);
            setRestockOpen(true);
          }} style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', color: '#3B82F6', fontWeight: '700', padding: '0.8rem 1.2rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShoppingCart size={18} /> Launch Restock P.O.
          </button>
          <button onClick={() => alert('Add Item flow triggered!')} className="btn btn-primary" style={{ background: '#3B82F6', border: 'none', padding: '0.8rem 1.2rem', borderRadius: '12px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Plus size={18} /> Add Item
          </button>
        </div>
      </header>

      {/* KPI DASHBOARD */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <div style={{ background: '#FFFFFF', padding: '1.5rem', borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
          <p style={{ color: '#64748B', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Package size={14} /> Total Unique Items</p>
          <h2 style={{ fontSize: '2.2rem', fontWeight: '900', color: '#0F172A', margin: 0 }}>{totalItems}</h2>
        </div>
        <div style={{ background: '#FFFFFF', padding: '1.5rem', borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', borderBottom: '4px solid #3B82F6' }}>
          <p style={{ color: '#64748B', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Zap size={14} /> Assets In Use</p>
          <h2 style={{ fontSize: '2.2rem', fontWeight: '900', color: '#0F172A', margin: 0 }}>{totalInUse}</h2>
        </div>
        <div style={{ background: '#FFFFFF', padding: '1.5rem', borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', borderBottom: '4px solid #10B981' }}>
          <p style={{ color: '#64748B', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}><CheckCircle size={14} /> Healthy Stock</p>
          <h2 style={{ fontSize: '2.2rem', fontWeight: '900', color: '#0F172A', margin: 0 }}>{totalItems - lowStockItems.length}</h2>
        </div>
        <div style={{ background: '#FFFFFF', padding: '1.5rem', borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', borderBottom: '4px solid #EF4444' }}>
          <p style={{ color: '#64748B', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}><AlertTriangle size={14} /> Low / Critical Alerts</p>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
            <h2 style={{ fontSize: '2.2rem', fontWeight: '900', color: '#EF4444', margin: 0 }}>{lowStockItems.length + damagedAssets.length}</h2>
            <span style={{ color: '#EF4444', fontSize: '0.85rem', fontWeight: '700' }}>Requires Action</span>
          </div>
        </div>
      </div>

      {/* ALERTS SECTION */}
      {(lowStockItems.length > 0 || damagedAssets.length > 0) && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2.5rem' }}>
          {lowStockItems.length > 0 && (
            <div style={{ background: '#FFF1F2', border: '1px solid #FECDD3', padding: '1.2rem 1.5rem', borderRadius: '16px', display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
              <div style={{ padding: '0.6rem', background: '#FFE4E6', color: '#E11D48', borderRadius: '12px' }}><AlertTriangle size={20} /></div>
              <div>
                <h3 style={{ fontSize: '1rem', color: '#9F1239', fontWeight: '800', margin: '0 0 0.2rem 0' }}>Low Stock Warning</h3>
                <p style={{ color: '#BE123C', fontSize: '0.85rem', margin: 0, fontWeight: '500' }}>{lowStockItems.length} items have fallen below threshold.</p>
              </div>
            </div>
          )}
          {damagedAssets.length > 0 && (
            <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', padding: '1.2rem 1.5rem', borderRadius: '16px', display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
              <div style={{ padding: '0.6rem', background: '#FEF3C7', color: '#D97706', borderRadius: '12px' }}><Info size={20} /></div>
              <div>
                <h3 style={{ fontSize: '1rem', color: '#92400E', fontWeight: '800', margin: '0 0 0.2rem 0' }}>Damaged Assets</h3>
                <p style={{ color: '#B45309', fontSize: '0.85rem', margin: 0, fontWeight: '500' }}>{damagedAssets.length} asset types have items reported damaged.</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* MAIN LIST VIEW */}
      <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', overflow: 'hidden' }}>

        {/* Toolbar & Tabs */}
        <div style={{ padding: '1.2rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E2E8F0', background: '#F8FAFC' }}>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {['All', 'Asset', 'Consumable'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  fontSize: '0.9rem', padding: '0.6rem 1.2rem', borderRadius: '8px', fontWeight: '700', cursor: 'pointer',
                  background: activeTab === tab ? '#3B82F6' : '#FFFFFF',
                  color: activeTab === tab ? '#FFFFFF' : '#475569',
                  border: activeTab === tab ? 'none' : '1px solid #E2E8F0',
                  transition: 'all 0.2s'
                }}
              >
                {tab === 'All' ? 'All Inventory' : tab + 's'}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <input type="text" placeholder="Search item..." value={search} onChange={e => setSearch(e.target.value)} style={{ padding: '0.6rem 1rem', borderRadius: '8px', border: '1px solid #E2E8F0', outline: 'none', fontSize: '0.9rem' }} />
            <button className="btn" style={{ border: '1px solid #E2E8F0', background: '#FFFFFF', padding: '0.6rem 1rem', borderRadius: '8px', color: '#475569', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Filter size={16} /> Filters
            </button>
          </div>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#FFFFFF', borderBottom: '2px solid #E2E8F0', fontSize: '0.8rem', color: '#64748B' }}>
              <th style={{ padding: '1.2rem 1.5rem', textTransform: 'uppercase', fontWeight: '800' }}>Item Details</th>
              <th style={{ padding: '1.2rem 1.5rem', textTransform: 'uppercase', fontWeight: '800' }}>Location & Usage</th>
              <th style={{ padding: '1.2rem 1.5rem', textTransform: 'uppercase', fontWeight: '800', width: '250px' }}>Stock Level</th>
              <th style={{ padding: '1.2rem 1.5rem', textTransform: 'uppercase', fontWeight: '800', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {filteredItems.map(item => {
                const isLow = item.stock < item.minThreshold;
                const stockPercent = Math.min(100, Math.max(0, (item.stock / item.maxStock) * 100));

                return (
                  <motion.tr
                    layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    key={item.id}
                    className="inv-row"
                    style={{ borderBottom: '1px solid #E2E8F0', background: isLow ? '#FFF1F2' : 'transparent', transition: 'all 0.2s' }}
                  >
                    <td style={{ padding: '1.2rem 1.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: item.type === 'Asset' ? '#EFF6FF' : '#F0FDF4', color: item.type === 'Asset' ? '#3B82F6' : '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {item.type === 'Asset' ? <BedDouble size={20} /> : <Coffee size={20} />}
                        </div>
                        <div>
                          <p style={{ fontWeight: '800', fontSize: '1.05rem', color: '#0F172A', margin: '0 0 0.2rem 0' }}>{item.name}</p>
                          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748B', background: '#F1F5F9', padding: '0.1rem 0.5rem', borderRadius: '4px' }}>{item.category}</span>
                            <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>{item.type}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '1.2rem 1.5rem' }}>
                      <p style={{ fontWeight: '700', fontSize: '0.9rem', color: '#1E293B', margin: '0 0 0.3rem 0', display: 'flex', alignItems: 'center', gap: '0.4rem' }}><MapPin size={14} color="#64748B" /> {item.location}</p>
                      {item.type === 'Asset' && (
                        <p style={{ fontSize: '0.8rem', color: '#64748B', margin: 0, fontWeight: '600' }}>{item.inUse} In Use • <span style={{ color: item.damaged > 0 ? '#EF4444' : '#64748B' }}>{item.damaged} Damaged</span></p>
                      )}
                    </td>
                    <td style={{ padding: '1.2rem 1.5rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.85rem' }}>
                        <span style={{ fontWeight: '800', color: isLow ? '#E11D48' : '#0F172A' }}>{item.stock} {item.unit} available</span>
                        <span style={{ color: '#64748B', fontWeight: '600' }}>/ {item.maxStock}</span>
                      </div>
                      <div style={{ height: '6px', background: isLow ? '#FECDD3' : '#E2E8F0', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', background: isLow ? '#E11D48' : '#3B82F6', width: `${stockPercent}%`, borderRadius: '4px' }} />
                      </div>
                      {isLow && <span style={{ fontSize: '0.7rem', color: '#E11D48', fontWeight: '700', marginTop: '0.4rem', display: 'block' }}>Below threshold ({item.minThreshold})</span>}
                    </td>
                    <td style={{ padding: '1.2rem 1.5rem', textAlign: 'right' }}>
                      <div className="row-actions" style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', opacity: 0.4, transition: 'opacity 0.2s' }}>
                        {item.type === 'Asset' ? (
                          <>
                            <button onClick={() => { setSelectedItem(item); setIsIssueModalOpen(true); }} className="btn" style={{ background: '#FFFFFF', border: '1px solid #3B82F6', color: '#3B82F6', padding: '0.5rem 0.8rem', borderRadius: '8px', fontWeight: '700', fontSize: '0.8rem' }} title="Issue Asset">
                              Issue
                            </button>
                            <button onClick={() => { setSelectedItem(item); setIsReturnModalOpen(true); }} className="btn" style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', color: '#475569', padding: '0.5rem 0.8rem', borderRadius: '8px', fontWeight: '700', fontSize: '0.8rem' }} title="Return Asset">
                              Return
                            </button>
                          </>
                        ) : (
                          <button onClick={() => { setSelectedItem(item); setIsIssueModalOpen(true); }} className="btn" style={{ background: '#FFFFFF', border: '1px solid #3B82F6', color: '#3B82F6', padding: '0.5rem 0.8rem', borderRadius: '8px', fontWeight: '700', fontSize: '0.8rem' }} title="Update Stock">
                            Update
                          </button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </AnimatePresence>
            {filteredItems.length === 0 && (
              <tr><td colSpan="4" style={{ padding: '3rem', textAlign: 'center', color: '#64748B', fontWeight: '600' }}>No items found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <div style={{ flex: 1, padding: '2.5rem', overflowY: 'auto' }}>
        {assetSubTab === 'overview' && (
          <div style={{ animation: 'fadeIn 0.3s ease' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
              {[
                { l: 'TOTAL ASSETS', v: assetStats.total, c: '#3B82F6', i: <Layers /> },
                { l: 'IN SERVICE', v: assetStats.active, c: '#10B981', i: <Zap /> },
                { l: 'REPAIRING', v: assetStats.maintenance, c: '#F59E0B', i: <Hammer /> },
                { l: 'PORTFOLIO VALUE', v: `₹${(assetStats.valuation / 1000).toFixed(1)}K`, c: '#8B5CF6', i: <Wallet /> }
              ].map((s, idx) => (
                <div key={idx} className="card" style={{ padding: '1.5rem', borderLeft: `5px solid ${s.c}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94A3B8', marginBottom: '0.6rem' }}><span style={{ fontSize: '0.75rem', fontWeight: '900' }}>{s.l}</span>{s.i}</div>
                  <h2 style={{ fontSize: '2rem', fontWeight: '900', margin: 0 }}>{s.v}</h2>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#475569' }}>Quantity to Issue</label>
              <input type="number" min="1" max={selectedItem.stock} value={actionQuantity} onChange={e => setActionQuantity(parseInt(e.target.value) || 1)} style={inputStyle} required />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#475569' }}>Target Location / Assignee</label>
              <input type="text" placeholder="e.g. Room 201-A or 'Rahul Sharma'" value={actionLocation} onChange={e => setActionLocation(e.target.value)} style={inputStyle} required />
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button className="btn" type="button" onClick={() => setIsIssueModalOpen(false)} style={{ flex: 1, padding: '1rem', background: '#F1F5F9', color: '#475569', fontWeight: '700' }}>Cancel</button>
              <button className="btn btn-primary" type="submit" style={{ flex: 1, padding: '1rem', background: '#3B82F6', fontWeight: '800' }}>Confirm Issuance</button>
            </div>
          </form>
        )}
      </Modal>

      {/* RETURN ITEM MODAL */}
      <Modal isOpen={isReturnModalOpen} onClose={() => setIsReturnModalOpen(false)} title="Return Asset">
        {selectedItem && (
          <form onSubmit={handleReturnSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '1rem', borderRadius: '12px', display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <p style={{ color: '#475569', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', margin: '0 0 0.2rem 0' }}>Item</p>
                <p style={{ color: '#0F172A', fontSize: '1.1rem', fontWeight: '800', margin: 0 }}>{selectedItem.name}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ color: '#475569', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', margin: '0 0 0.2rem 0' }}>Currently In Use</p>
                <p style={{ color: '#0F172A', fontSize: '1.1rem', fontWeight: '900', margin: 0 }}>{selectedItem.inUse} {selectedItem.unit}</p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#475569' }}>Quantity to Return</label>
              <input type="number" min="1" max={selectedItem.inUse || 1} value={actionQuantity} onChange={e => setActionQuantity(parseInt(e.target.value) || 1)} style={inputStyle} required />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#475569' }}>Asset Condition</label>
              <select style={inputStyle}>
                <option value="good">Good / Functional</option>
                <option value="damaged">Damaged / Needs Repair</option>
                <option value="destroyed">Destroyed / Write-off</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button className="btn" type="button" onClick={() => setIsReturnModalOpen(false)} style={{ flex: 1, padding: '1rem', background: '#F1F5F9', color: '#475569', fontWeight: '700' }}>Cancel</button>
              <button className="btn btn-primary" type="submit" style={{ flex: 1, padding: '1rem', background: '#10B981', border: 'none', fontWeight: '800', color: 'white' }}>Confirm Return</button>
            </div>
          </form>
        )}
      </Modal>

      {/* RESTOCK PO MODAL (PRESERVED LOGIC) */}
      <Modal isOpen={restockOpen} onClose={() => { if (!restockSent) setRestockOpen(false); }} title="🛒 Launch Restock P.O." maxWidth="650px">
        {restockSent ? (
          <div style={{ textAlign: 'center', padding: '3rem 0' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>📦</div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: '900', color: '#10B981', marginBottom: '0.5rem' }}>Purchase Order Launched!</h2>
            <p style={{ color: '#64748B', marginBottom: '2rem', fontWeight: '500' }}>Your restock PO has been generated and sent to the supplier automatically.</p>
            <button className="btn btn-primary" onClick={() => setRestockOpen(false)} style={{ padding: '1rem 3rem', borderRadius: '12px', background: '#10B981', border: 'none', fontWeight: '800', fontSize: '1rem' }}>Done</button>
          </div>
        ) : (
          <>
            <p style={{ color: '#64748B', fontSize: '0.9rem', marginBottom: '1.5rem', fontWeight: '500' }}>Review and adjust quantities for low stock items. Add extra items if needed.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginBottom: '1.5rem' }}>
              {restockItems.map((ri, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '1rem', alignItems: 'center', padding: '1rem', background: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                  <span style={{ flex: 1, fontWeight: '800', fontSize: '1rem', color: '#0F172A' }}>{ri.name}</span>
                  <input type="number" value={ri.needed} onChange={e => setRestockItems(prev => prev.map((r, i) => i === idx ? { ...r, needed: e.target.value } : r))}
                    style={{ width: '80px', padding: '0.6rem', borderRadius: '8px', border: '1px solid #CBD5E1', background: '#FFFFFF', color: '#0F172A', textAlign: 'center', fontWeight: '800', outline: 'none' }} />
                  <span style={{ fontSize: '0.85rem', color: '#64748B', minWidth: '45px', fontWeight: '600' }}>{ri.unit}</span>
                  <button onClick={() => setRestockItems(prev => prev.filter((_, i) => i !== idx))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#EF4444', padding: '0.4rem', borderRadius: '6px' }}><X size={18} /></button>
                </div>
              ))}
            </div>
            <button onClick={() => setRestockItems(prev => [...prev, { name: '', needed: 1, unit: 'Units' }])} className="btn" style={{ width: '100%', border: '2px dashed #CBD5E1', background: 'transparent', marginBottom: '2rem', padding: '1rem', color: '#64748B', fontWeight: '800', borderRadius: '12px' }}>+ Add Extra Item</button>
            {restockItems.length > 0 && restockItems.some(r => r.name) && (
              <button className="btn btn-primary" onClick={() => setRestockSent(true)} style={{ width: '100%', padding: '1.2rem', fontSize: '1.1rem', fontWeight: '900', borderRadius: '12px', background: '#3B82F6', border: 'none' }}>✅ Confirm & Launch P.O.</button>
            )}
          </>
        )}
      </Modal>

      <style>{`
        .card { background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 24px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.03); transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .card:hover { transform: translateY(-5px); box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04); }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
        ::-webkit-scrollbar { height: 6px; width: 6px; }
        ::-webkit-scrollbar-track { background: #F1F5F9; }
        ::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: #94A3B8; }
      `}</style>
    </div>
  );
};

export default InventoryModule;
