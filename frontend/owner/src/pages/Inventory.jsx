import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Package, Search, Plus, AlertTriangle, Trash2, Edit, History,
  MapPin, ShoppingCart, Utensils, Brush, Hammer, MoreVertical,
  ChevronRight, ArrowUpRight, ArrowDownRight, Clock, CheckCircle2,
  AlertCircle, X, Save, Filter, ChevronLeft, Download, Printer, FileText,
  Eye, ShieldCheck, Camera, Send, User, TrendingUp, BarChart, StickyNote,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../mockData';
import socket, { connectSocket } from '../utils/socket';

// --- CONFIGURATION ---
const CATEGORIES = [
  { 
    id: 'Groceries', name: 'Groceries', icon: <Utensils size={18} />, color: '#00A859', bg: '#E8F5E9',
    subCategories: ['Grains', 'Vegetables', 'Fruits', 'Dairy', 'Spices']
  },
  { 
    id: 'Cleaning', name: 'Cleaning Supplies', icon: <Brush size={18} />, color: '#4DABF7', bg: '#E7F5FF',
    subCategories: ['Floor Cleaners', 'Detergents', 'Sanitizers', 'Tools']
  },
  { 
    id: 'Kitchen', name: 'Kitchen Equipment', icon: <Hammer size={18} />, color: '#F59E0B', bg: '#FFFBEB',
    subCategories: ['Utensils', 'Electronics', 'Storage', 'Cutlery']
  },
  { 
    id: 'Miscellaneous', name: 'Miscellaneous', icon: <Package size={18} />, color: '#64748B', bg: '#F1F5F9',
    subCategories: ['Stationery', 'Medical', 'Bedding', 'Other']
  }
];

const TABS = [
  { id: 'master', name: 'INVENTORY MASTER', icon: <Package size={18} /> },
  { id: 'damage', name: 'DAMAGE ENTRIES', icon: <AlertTriangle size={18} /> },
  { id: 'deductions', name: '$ DEDUCTIONS', icon: <ArrowDownRight size={18} /> },
  { id: 'reports', name: 'REPORTS & ANALYTICS', icon: <FileText size={18} /> }
];

const InventoryManagement = ({ initialTab = 'master' }) => {
  const { buildingId: urlBuildingId } = useParams();
  const navigate = useNavigate();
  const activeBuildingId = urlBuildingId || localStorage.getItem('selectedBuildingId');

  // UI States
  const [activeTab, setActiveTab] = useState(initialTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSubCategory, setSelectedSubCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDamageModalOpen, setIsDamageModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  
  // Data States
  const [inventory, setInventory] = useState([]);
  const [damageEntries, setDamageEntries] = useState([
    { id: 'VK-AP-HUB-DMG-0003', date: '18 Apr 26', product: 'Basmati Rice 5kg', reportedBy: 'Abhiram', qty: 2, type: 'DAMAGED', loss: 796, status: 'PENDING' },
    { id: 'VK-AP-HUB-DMG-0002', date: '15 Apr 26', product: 'Liquid Detergent', reportedBy: 'Suresh', qty: 1, type: 'EXPIRED', loss: 450, status: 'APPROVED' },
  ]);
  const [deductions, setDeductions] = useState([
    { id: 'DED-001', date: '19 Apr 26', item: 'Broken Window Pan', person: 'Rahul (T-102)', amount: 1500, reason: 'Accidental Damage', status: 'PENDING' },
    { id: 'DED-002', date: '17 Apr 26', item: 'Electric Kettle', person: 'Staff: Anita', amount: 850, reason: 'Improper Handling', status: 'PAID' },
  ]);
  const [reports, setReports] = useState([
    { id: 'REP-001', name: 'Monthly Stock Audit - April', date: '01 May 26', type: 'PDF', size: '2.4 MB' },
    { id: 'REP-002', name: 'Damage Loss Analytics Q1', date: '15 Apr 26', type: 'EXCEL', size: '1.1 MB' },
    { id: 'REP-003', name: 'Vendor Procurement Summary', date: '10 Apr 26', type: 'PDF', size: '850 KB' },
  ]);
  const [loading, setLoading] = useState(true);

  // Form States
  const initialFormData = {
    name: '', 
    category: 'Groceries', 
    subCategory: 'Grains',
    stock: 0, 
    minThreshold: 5, 
    unit: 'Kg', 
    location: '', 
    notes: '',
    status: 'active',
    lastPurchased: new Date().toISOString().split('T')[0]
  };
  const [formData, setFormData] = useState(initialFormData);

  const [damageFormData, setDamageFormData] = useState({
    productId: '',
    qty: 0,
    type: 'Damaged',
    description: ''
  });

  useEffect(() => {
    fetchInventory();
    if (activeBuildingId) connectSocket(activeBuildingId);
  }, [activeBuildingId]);

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const data = await api.getInventory(activeBuildingId);
      setInventory(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredInventory = useMemo(() => {
    return inventory.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      const matchesSubCategory = selectedSubCategory === 'All' || item.subCategory === selectedSubCategory;
      const matchesStatus = selectedStatus === 'All' || 
                           (selectedStatus === 'Active' && item.stock > 0) || 
                           (selectedStatus === 'Out of Stock' && item.stock <= 0);
      return matchesSearch && matchesCategory && matchesSubCategory && matchesStatus;
    });
  }, [inventory, searchQuery, selectedCategory, selectedSubCategory, selectedStatus]);

  const stats = useMemo(() => {
    if (activeTab === 'damage') {
      return [
        { label: 'TOTAL ENTRIES', value: damageEntries.length, color: '#6366F1', bg: '#EEF2FF' },
        { label: 'PENDING REVIEW', value: damageEntries.filter(e => e.status === 'PENDING').length, color: '#F59E0B', bg: '#FFFBEB' },
        { label: 'APPROVED', value: damageEntries.filter(e => e.status === 'APPROVED').length, color: '#10B981', bg: '#ECFDF5' },
        { label: 'TOTAL LOSS', value: `₹${damageEntries.reduce((acc, curr) => acc + curr.loss, 0)}`, color: '#EF4444', bg: '#FEF2F2' }
      ];
    }
    if (activeTab === 'deductions') {
      return [
        { label: 'TOTAL DEDUCTIONS', value: deductions.length, color: '#6366F1', bg: '#EEF2FF' },
        { label: 'PENDING COLLECTION', value: deductions.filter(d => d.status === 'PENDING').length, color: '#F59E0B', bg: '#FFFBEB' },
        { label: 'RECOVERED', value: deductions.filter(d => d.status === 'PAID').length, color: '#10B981', bg: '#ECFDF5' },
        { label: 'TOTAL AMOUNT', value: `₹${deductions.reduce((acc, curr) => acc + curr.amount, 0)}`, color: '#00A859', bg: '#E8F5E9' }
      ];
    }
    if (activeTab === 'reports') {
      return [
        { label: 'TOTAL REPORTS', value: reports.length, color: '#6366F1', bg: '#EEF2FF' },
        { label: 'DOWNLOADS (MONTH)', value: '142', color: '#10B981', bg: '#ECFDF5' },
        { label: 'AUTO-GENERATED', value: '12', color: '#F59E0B', bg: '#FFFBEB' },
        { label: 'DATA ACCURACY', value: '99.8%', color: '#00A859', bg: '#E8F5E9' }
      ];
    }
    return [
      { label: 'TOTAL ITEMS', value: inventory.length, color: '#00A859', bg: '#E8F5E9' },
      { label: 'LOW STOCK', value: inventory.filter(i => i.stock <= i.minThreshold && i.stock > 0).length, color: '#F59E0B', bg: '#FFFBEB' },
      { label: 'OUT OF STOCK', value: inventory.filter(i => i.stock <= 0).length, color: '#EF4444', bg: '#FEF2F2' },
      { label: 'CATEGORIES', value: CATEGORIES.length, color: '#6366F1', bg: '#EEF2FF' }
    ];
  }, [inventory, damageEntries, deductions, reports, activeTab]);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (selectedItem) {
        await api.updateInventoryItem(selectedItem.id || selectedItem._id, formData);
      } else {
        await api.addInventoryItem({ ...formData, buildingId: activeBuildingId });
      }
      setIsAddModalOpen(false);
      setFormData(initialFormData);
      fetchInventory();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await api.deleteInventoryItem(id);
        fetchInventory();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleToggleStatus = async (item) => {
    const newStock = item.stock > 0 ? 0 : 10; // Simple toggle simulation
    try {
      await api.updateInventoryItem(item.id || item._id, { ...item, stock: newStock });
      fetchInventory();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCategoryChange = (catId) => {
    const cat = CATEGORIES.find(c => c.id === catId);
    setFormData({
      ...formData,
      category: catId,
      subCategory: cat ? cat.subCategories[0] : ''
    });
  };

  const handleDamageSubmit = (e) => {
    e.preventDefault();
    alert('Damage report submitted successfully!');
    setIsDamageModalOpen(false);
    setDamageFormData({ productId: '', qty: 0, type: 'Damaged', description: '' });
  };

  return (
    <div className="inventory-v3">
      {/* 1. TOP HEADER */}
      <header className="page-header">
        <div className="header-left">
          <button className="back-btn" onClick={() => navigate(-1)} title="Back"><ChevronLeft size={20} /></button>
          <div className="header-title-area">
            <h1>
              {activeTab === 'master' ? 'Inventory Master' : 
               activeTab === 'damage' ? 'Damage Tracking' : 
               activeTab === 'deductions' ? 'Financial Deductions' : 
               'Reports & Analytics'}
            </h1>
            <p>Track hostel supplies, consumables and financial recovery with precision.</p>
          </div>
        </div>
        <div className="header-actions">
          <button className="icon-btn" onClick={() => alert('Opening documents...')}><FileText size={18} /></button>
          <button className="icon-btn" onClick={() => window.print()}><Printer size={18} /></button>
          <button className="icon-btn" onClick={() => alert('Downloading reports...')}><Download size={18} /></button>
          {activeTab === 'master' && (
            <button className="primary-btn" onClick={() => { setSelectedItem(null); setFormData(initialFormData); setIsAddModalOpen(true); }}>
              <Plus size={20} /> ADD ITEM
            </button>
          )}
          {activeTab === 'damage' && (
            <button className="primary-btn damage" onClick={() => setIsDamageModalOpen(true)}>
              <Plus size={20} /> REPORT DAMAGE
            </button>
          )}
        </div>
      </header>

      {/* 2. TAB NAVIGATION */}
      <nav className="tab-nav">
        {TABS.map(tab => (
          <button 
            key={tab.id} 
            className={`tab-item ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => { setActiveTab(tab.id); setSearchQuery(''); }}
          >
            {tab.icon} {tab.name}
          </button>
        ))}
      </nav>

      {/* 3. STATS CARDS */}
      <div className="stats-grid">
        {stats.map((stat, i) => (
          <div key={i} className="stat-card" style={{ '--accent': stat.color, '--bg': stat.bg }}>
            <div className="stat-info">
              <span className="stat-label">{stat.label}</span>
              <h2 className="stat-value">{stat.value}</h2>
            </div>
            <div className="stat-trend"><ArrowUpRight size={14} /> 12%</div>
          </div>
        ))}
      </div>

      {/* 4. MAIN CONTENT AREA */}
      <div className="content-card">
        {activeTab !== 'reports' && (
          <div className="table-filters">
            <div className="search-box">
              <Search size={18} />
              <input 
                type="text" 
                placeholder={`Search ${activeTab === 'damage' ? 'entries' : activeTab === 'deductions' ? 'deductions' : 'products'}...`} 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="filter-actions">
              <select className="filter-select" value={selectedStatus} onChange={e => setSelectedStatus(e.target.value)}>
                <option value="All">All Status</option>
                <option value="Active">Active / In Stock</option>
                <option value="Out of Stock">Out of Stock</option>
              </select>
              {activeTab === 'master' && (
                <>
                  <select className="filter-select" onChange={e => { setSelectedCategory(e.target.value); setSelectedSubCategory('All'); }}>
                    <option value="All">All Categories</option>
                    {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                  <select className="filter-select" onChange={e => setSelectedSubCategory(e.target.value)} value={selectedSubCategory}>
                    <option value="All">All Sub Categories</option>
                    {selectedCategory !== 'All' && CATEGORIES.find(c => c.id === selectedCategory)?.subCategories.map(sub => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                  </select>
                </>
              )}
            </div>
          </div>
        )}

        <div className="table-container">
          <table className="custom-table">
            <thead>
              {activeTab === 'master' && (
                <tr>
                  <th>PRODUCT & CATEGORY</th>
                  <th>PRICING & TAX</th>
                  <th>STOCK DISTRIBUTION</th>
                  <th>STATUS</th>
                  <th style={{ textAlign: 'right' }}>ACTIONS</th>
                </tr>
              )}
              {activeTab === 'damage' && (
                <tr>
                  <th>ID / DATE</th>
                  <th>PRODUCT</th>
                  <th>REPORTED BY</th>
                  <th>QTY</th>
                  <th>TYPE</th>
                  <th>LOSS</th>
                  <th>STATUS</th>
                  <th style={{ textAlign: 'right' }}>ACTIONS</th>
                </tr>
              )}
              {activeTab === 'deductions' && (
                <tr>
                  <th>DEDUCTION ID</th>
                  <th>ITEM / REASON</th>
                  <th>RESPONSIBLE PERSON</th>
                  <th>AMOUNT</th>
                  <th>DATE</th>
                  <th>STATUS</th>
                  <th style={{ textAlign: 'right' }}>ACTIONS</th>
                </tr>
              )}
              {activeTab === 'reports' && (
                <tr>
                  <th>REPORT NAME</th>
                  <th>GENERATED ON</th>
                  <th>TYPE</th>
                  <th>FILE SIZE</th>
                  <th style={{ textAlign: 'right' }}>ACTIONS</th>
                </tr>
              )}
            </thead>
            <tbody>
              {activeTab === 'master' && filteredInventory.map(item => (
                <tr key={item.id}>
                  <td>
                    <div className="cell-product">
                      <div className="product-img">{item.name[0]}</div>
                      <div>
                        <div className="product-name">{item.name}</div>
                        <div className="cell-sub">{item.category} {item.subCategory ? `• ${item.subCategory}` : ''}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="cell-main">₹{item.price || '0.00'} <span className="cell-sub">0%</span></div>
                    <div className="cell-sub">Tax Inclusive</div>
                  </td>
                  <td>
                    <div className="stock-dist">
                      <div className="dist-item">
                        <span className="dist-val">{item.stock}</span>
                        <span className="dist-label">STORE</span>
                      </div>
                      <div className="dist-item">
                        <span className="dist-val">0</span>
                        <span className="dist-label">USED</span>
                      </div>
                      <div className="dist-item total">
                        <span className="dist-val">{item.stock}</span>
                        <span className="dist-label">TOTAL</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div 
                      className={`toggle-switch ${item.stock > 0 ? 'active' : ''}`}
                      onClick={() => handleToggleStatus(item)}
                      style={{ cursor: 'pointer' }}
                    ></div>
                  </td>
                  <td>
                    <div className="action-btns">
                      <button className="action-btn" onClick={() => { setSelectedItem(item); setFormData(item); setIsAddModalOpen(true); }}><Edit size={16} /></button>
                      <button className="action-btn delete" onClick={() => handleDelete(item.id || item._id)}><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}

              {activeTab === 'damage' && damageEntries.map(entry => (
                <tr key={entry.id}>
                  <td>
                    <div className="cell-id">{entry.id}</div>
                    <div className="cell-sub">{entry.date}</div>
                  </td>
                  <td>
                    <div className="cell-product">
                      <div className="product-img">{entry.product[0]}</div>
                      <div className="product-name">{entry.product}</div>
                    </div>
                  </td>
                  <td>
                    <div className="cell-main">{entry.reportedBy}</div>
                    <div className="cell-sub"><ShieldCheck size={12} /> VERIFIED</div>
                  </td>
                  <td><span className="qty-badge">{entry.qty}</span></td>
                  <td><span className="type-badge damaged">{entry.type}</span></td>
                  <td><span className="loss-val">₹{entry.loss}</span></td>
                  <td><span className={`status-pill ${entry.status.toLowerCase()}`}>{entry.status}</span></td>
                  <td>
                    <div className="action-btns">
                      <button className="action-btn" onClick={() => alert('Viewing details...')}><Eye size={16} /></button>
                      <button className="action-btn verify" onClick={() => alert('Entry verified!')}><ShieldCheck size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}

              {activeTab === 'deductions' && deductions.map(ded => (
                <tr key={ded.id}>
                  <td><div className="cell-id">{ded.id}</div></td>
                  <td>
                    <div className="cell-main">{ded.item}</div>
                    <div className="cell-sub">{ded.reason}</div>
                  </td>
                  <td>
                    <div className="cell-main">{ded.person}</div>
                    <div className="cell-sub">Liability Confirmed</div>
                  </td>
                  <td><span className="loss-val" style={{ color: '#0F172A' }}>₹{ded.amount}</span></td>
                  <td><div className="cell-sub">{ded.date}</div></td>
                  <td><span className={`status-pill ${ded.status.toLowerCase()}`}>{ded.status}</span></td>
                  <td>
                    <div className="action-btns">
                      <button className="action-btn" onClick={() => alert('Viewing document...')}><FileText size={16} /></button>
                      <button className="action-btn verify" onClick={() => alert('Deduction settled!')}><CheckCircle2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}

              {activeTab === 'reports' && reports.map(rep => (
                <tr key={rep.id}>
                  <td>
                    <div className="cell-product">
                      <div className="product-img" style={{ background: rep.type === 'PDF' ? '#FEE2E2' : '#E0F2FE', color: rep.type === 'PDF' ? '#EF4444' : '#0EA5E9' }}>
                        {rep.type === 'PDF' ? 'P' : 'X'}
                      </div>
                      <div className="product-name">{rep.name}</div>
                    </div>
                  </td>
                  <td><div className="cell-sub">{rep.date}</div></td>
                  <td><span className="type-badge" style={{ background: '#F1F5F9', color: '#64748B' }}>{rep.type}</span></td>
                  <td><div className="cell-sub">{rep.size}</div></td>
                  <td>
                    <div className="action-btns">
                      <button className="action-btn" onClick={() => alert('Downloading...')}><Download size={16} /></button>
                      <button className="action-btn" onClick={() => alert('Previewing...')}><Eye size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ANALYTICS SECTION */}
      {activeTab === 'reports' && (
        <div className="analytics-section" style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <div className="content-card">
            <h3 style={{ fontSize: '1rem', fontWeight: '800', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <TrendingUp size={20} color="#00A859" /> Stock Consumption Trend
            </h3>
            <div style={{ height: '200px', display: 'flex', alignItems: 'flex-end', gap: '1rem', padding: '1rem' }}>
              {[60, 40, 85, 30, 95, 70, 55].map((h, i) => (
                <div key={i} style={{ flex: 1, background: 'var(--primary-green)', height: `${h}%`, borderRadius: '4px 4px 0 0', opacity: 0.2 + (h/100) }} />
              ))}
            </div>
          </div>
          <div className="content-card">
            <h3 style={{ fontSize: '1rem', fontWeight: '800', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <BarChart size={20} color="#6366F1" /> Category Distribution
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              {CATEGORIES.map(cat => (
                <div key={cat.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748B', width: '80px' }}>{cat.name}</span>
                  <div style={{ flex: 1, height: '8px', background: '#F1F5F9', borderRadius: '10px', overflow: 'hidden' }}>
                    <div style={{ width: `${Math.random() * 80 + 20}%`, height: '100%', background: cat.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODALS */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="modal-overlay">
            <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="modal-content large">
              <div className="modal-header">
                <div className="header-badge"><Package size={16} /> ITEM DRAFTING</div>
                <h2>{selectedItem ? 'Edit Existing Item' : 'Create New Inventory SKU'}</h2>
                <button className="close-btn" onClick={() => setIsAddModalOpen(false)}><X size={24} /></button>
              </div>
              <div className="modal-body">
                <div className="modal-info-box">
                  <Info size={16} /> <span>Tip: Define sub-categories to track stock more granularly across hostel floors.</span>
                </div>
                <form className="inventory-form" onSubmit={handleSave}>
                  <div className="form-row">
                    <div className="form-group full">
                      <label>DISPLAY NAME *</label>
                      <input 
                        required type="text" placeholder="e.g. Premium Basmati Rice" 
                        value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>MAIN CATEGORY *</label>
                      <select value={formData.category} onChange={e => handleCategoryChange(e.target.value)}>
                        {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>SUB CATEGORY *</label>
                      <select 
                        value={formData.subCategory} 
                        onChange={e => setFormData({...formData, subCategory: e.target.value})}
                      >
                        {CATEGORIES.find(c => c.id === formData.category)?.subCategories.map(sub => (
                          <option key={sub} value={sub}>{sub}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>UNIT TYPE *</label>
                      <select value={formData.unit} onChange={e => setFormData({...formData, unit: e.target.value})}>
                        <option>Kg</option><option>Liters</option><option>Pieces</option><option>Boxes</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>INITIAL STOCK *</label>
                      <input 
                        required type="number" min="0" value={formData.stock} 
                        onChange={e => setFormData({...formData, stock: parseInt(e.target.value)})}
                      />
                    </div>
                  </div>
                  <div className="form-group full">
                    <label>CUSTOM NOTES (EXTRA DETAILS) <StickyNote size={14} style={{ marginLeft: '4px', verticalAlign: 'middle' }} /></label>
                    <textarea 
                      placeholder="Add any specific instructions, vendor details, or floor-wise distribution notes here..."
                      value={formData.notes}
                      onChange={e => setFormData({...formData, notes: e.target.value})}
                      style={{ height: '120px' }}
                    ></textarea>
                  </div>
                  <div className="form-footer">
                    <button type="button" className="secondary-btn" onClick={() => { setIsAddModalOpen(false); setFormData(initialFormData); }}>DISCARD</button>
                    <button type="submit" className="primary-btn">
                      <Save size={18} /> {selectedItem ? 'UPDATE ITEM' : 'ADD TO INVENTORY'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}

        {isDamageModalOpen && (
          <div className="modal-overlay">
            <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="modal-content medium">
              <div className="modal-header">
                <div className="header-hint"><AlertTriangle size={16} /> REPORT NEW DAMAGE</div>
                <button className="close-btn" onClick={() => setIsDamageModalOpen(false)}><X size={24} /></button>
              </div>
              <div className="modal-body">
                <form className="damage-form-box" onSubmit={handleDamageSubmit}>
                  <div className="form-group full">
                    <label>SELECT PRODUCT *</label>
                    <div className="search-input-box" style={{ position: 'relative' }}>
                      <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                      <input 
                        type="text" placeholder="Search product..." style={{ paddingLeft: '3rem', width: '100%' }}
                        value={damageFormData.productId}
                        onChange={e => setDamageFormData({...damageFormData, productId: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>QUANTITY *</label>
                      <input 
                        type="number" min="1" 
                        value={damageFormData.qty}
                        onChange={e => setDamageFormData({...damageFormData, qty: parseInt(e.target.value)})}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>DAMAGE TYPE *</label>
                      <select 
                        value={damageFormData.type}
                        onChange={e => setDamageFormData({...damageFormData, type: e.target.value})}
                      >
                        <option>Damaged</option><option>Expired</option><option>Lost</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-group full">
                    <label>DESCRIPTION</label>
                    <textarea 
                      placeholder="Briefly describe the damage..."
                      value={damageFormData.description}
                      onChange={e => setDamageFormData({...damageFormData, description: e.target.value})}
                      style={{ height: '80px' }}
                    ></textarea>
                  </div>
                  <button type="submit" className="submit-damage-btn">
                    <Send size={18} /> SUBMIT DAMAGE REPORT
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style jsx="true">{`
        .inventory-v3 { padding: 1.5rem 2.5rem; background: #F8FAFB; min-height: 100vh; font-family: 'Inter', sans-serif; }
        .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
        .header-left { display: flex; align-items: center; gap: 1.5rem; }
        .back-btn { width: 40px; height: 40px; border-radius: 10px; border: 1px solid #E2E8F0; background: white; display: flex; align-items: center; justify-content: center; color: #64748B; cursor: pointer; }
        .header-title-area h1 { font-size: 1.5rem; font-weight: 800; color: #1E293B; margin: 0; }
        .header-title-area p { font-size: 0.85rem; color: #94A3B8; margin: 0.2rem 0 0; font-weight: 500; }
        .header-actions { display: flex; gap: 0.8rem; align-items: center; }
        .icon-btn { width: 40px; height: 40px; border-radius: 10px; border: 1px solid #E2E8F0; background: white; color: #64748B; display: flex; align-items: center; justify-content: center; cursor: pointer; }
        .primary-btn { padding: 0.7rem 1.5rem; border-radius: 10px; border: none; background: var(--primary-green); color: white; font-weight: 700; font-size: 0.85rem; display: flex; align-items: center; gap: 0.5rem; cursor: pointer; }
        .primary-btn.damage { background: #EF4444; }
        .tab-nav { display: flex; gap: 2rem; border-bottom: 1px solid #E2E8F0; margin-bottom: 2rem; }
        .tab-item { padding: 1rem 0; background: transparent; border: none; color: #94A3B8; font-weight: 700; font-size: 0.8rem; display: flex; align-items: center; gap: 0.6rem; cursor: pointer; position: relative; }
        .tab-item.active { color: var(--primary-green); }
        .tab-item.active::after { content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 2px; background: var(--primary-green); }
        .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; margin-bottom: 2rem; }
        .stat-card { background: white; padding: 1.5rem; border-radius: 20px; border: 1px solid #F1F5F9; display: flex; justify-content: space-between; align-items: flex-start; transition: transform 0.2s; }
        .stat-card:hover { transform: translateY(-5px); }
        .stat-label { font-size: 0.7rem; font-weight: 800; color: #94A3B8; letter-spacing: 0.05em; }
        .stat-value { font-size: 1.8rem; font-weight: 800; color: #1E293B; margin: 0.5rem 0 0; }
        .stat-trend { font-size: 0.75rem; font-weight: 700; padding: 0.3rem 0.6rem; border-radius: 8px; background: var(--bg); color: var(--accent); display: flex; align-items: center; gap: 0.3rem; }
        .content-card { background: white; border-radius: 24px; border: 1px solid #F1F5F9; padding: 1.5rem; box-shadow: 0 4px 20px rgba(0,0,0,0.02); }
        .table-filters { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
        .search-box { position: relative; width: 400px; }
        .search-box svg { position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: #94A3B8; }
        .search-box input { width: 100%; padding: 0.8rem 1rem 0.8rem 3rem; border-radius: 12px; border: 1px solid #E2E8F0; background: #F8FAFB; font-weight: 500; outline: none; }
        .filter-actions { display: flex; gap: 1rem; }
        .filter-select { padding: 0.7rem 1rem; border-radius: 10px; border: 1px solid #E2E8F0; background: white; font-weight: 600; color: #475569; font-size: 0.85rem; outline: none; }
        .custom-table { width: 100%; border-collapse: collapse; }
        .custom-table th { text-align: left; padding: 1rem; font-size: 0.7rem; font-weight: 800; color: #94A3B8; letter-spacing: 0.05em; border-bottom: 1px solid #F1F5F9; }
        .custom-table td { padding: 1.2rem 1rem; border-bottom: 1px solid #F1F5F9; }
        .cell-id { font-weight: 700; color: #1E293B; font-size: 0.9rem; }
        .cell-sub { font-size: 0.75rem; color: #94A3B8; font-weight: 600; }
        .cell-main { font-weight: 700; color: #1E293B; font-size: 0.95rem; }
        .cell-product { display: flex; align-items: center; gap: 1rem; }
        .product-img { width: 40px; height: 40px; background: #F1F5F9; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-weight: 800; color: #64748B; font-size: 1.2rem; }
        .product-name { font-weight: 700; color: #1E293B; font-size: 0.95rem; }
        .qty-badge { background: #F1F5F9; padding: 0.4rem 0.8rem; border-radius: 8px; font-weight: 700; color: #475569; }
        .type-badge { padding: 0.4rem 0.8rem; border-radius: 8px; font-size: 0.75rem; font-weight: 800; }
        .type-badge.damaged { background: #FEF2F2; color: #EF4444; }
        .loss-val { font-weight: 800; color: #EF4444; }
        .status-pill { padding: 0.4rem 0.8rem; border-radius: 20px; font-size: 0.7rem; font-weight: 800; }
        .status-pill.pending { background: #FFFBEB; color: #D97706; }
        .status-pill.paid, .status-pill.approved { background: #ECFDF5; color: #10B981; }
        .action-btns { display: flex; gap: 0.5rem; justify-content: flex-end; }
        .action-btn { width: 32px; height: 32px; border-radius: 8px; border: 1px solid #E2E8F0; background: white; color: #64748B; display: flex; align-items: center; justify-content: center; cursor: pointer; }
        .action-btn.verify { color: var(--primary-green); background: #E8F5E9; border-color: #C8E6C9; }
        .action-btn.delete { color: #EF4444; background: #FEF2F2; border-color: #FEE2E2; }
        .stock-dist { display: flex; gap: 1rem; }
        .dist-item { display: flex; flex-direction: column; align-items: center; min-width: 40px; }
        .dist-val { font-weight: 800; color: #1E293B; font-size: 0.9rem; }
        .dist-label { font-size: 0.6rem; color: #94A3B8; font-weight: 800; }
        .dist-item.total .dist-val { color: var(--primary-green); }
        .toggle-switch { width: 40px; height: 22px; background: #E2E8F0; border-radius: 20px; position: relative; }
        .toggle-switch.active { background: var(--primary-green); }
        .toggle-switch::before { content: ''; position: absolute; width: 16px; height: 16px; background: white; border-radius: 50%; top: 3px; left: 3px; transition: transform 0.2s; }
        .toggle-switch.active::before { transform: translateX(18px); }
        .modal-overlay { position: fixed; inset: 0; background: rgba(15, 23, 42, 0.4); backdrop-filter: blur(8px); z-index: 2000; display: flex; align-items: center; justify-content: center; }
        .modal-content { background: white; border-radius: 32px; box-shadow: 0 40px 100px -12px rgba(0,0,0,0.25); overflow: hidden; width: 90%; }
        .modal-content.large { max-width: 800px; }
        .modal-content.medium { max-width: 500px; }
        .modal-header { padding: 1.5rem 2.5rem; border-bottom: 1px solid #F1F5F9; }
        .header-badge { display: inline-flex; align-items: center; gap: 0.5rem; background: #E8F5E9; color: var(--primary-green); padding: 0.4rem 0.8rem; border-radius: 8px; font-size: 0.7rem; font-weight: 800; margin-bottom: 0.5rem; }
        .modal-header h2 { font-size: 1.4rem; font-weight: 900; color: #0F172A; margin: 0; }
        .close-btn { position: absolute; top: 1.5rem; right: 1.5rem; background: transparent; border: none; color: #94A3B8; cursor: pointer; }
        .modal-body { padding: 2.5rem; }
        .modal-info-box { background: #EEF2FF; border: 1px solid #E0E7FF; border-radius: 12px; padding: 1rem; margin-bottom: 1.5rem; display: flex; align-items: center; gap: 0.8rem; color: #6366F1; font-size: 0.85rem; font-weight: 600; }
        .inventory-form { display: flex; flex-direction: column; gap: 1.5rem; }
        .form-row { display: flex; gap: 1.5rem; }
        .form-group { flex: 1; display: flex; flex-direction: column; gap: 0.5rem; }
        .form-group.full { width: 100%; }
        .form-group label { font-size: 0.7rem; font-weight: 800; color: #94A3B8; letter-spacing: 0.05em; }
        .form-group input, .form-group select, .form-group textarea { padding: 1rem; border-radius: 12px; border: 1px solid #E2E8F0; background: #F8FAFB; font-weight: 600; font-size: 0.9rem; outline: none; transition: 0.2s; }
        .form-group input:focus, .form-group select:focus, .form-group textarea:focus { border-color: var(--primary-green); background: white; box-shadow: 0 0 0 4px var(--primary-green-light); }
        .form-group textarea { height: 100px; resize: none; }
        .form-footer { display: flex; justify-content: flex-end; gap: 1rem; margin-top: 2rem; }
        .secondary-btn { padding: 0.8rem 1.8rem; border-radius: 12px; border: 1px solid #E2E8F0; background: white; color: #64748B; font-weight: 700; cursor: pointer; }
        .submit-damage-btn { margin-top: 1rem; padding: 1.2rem; border-radius: 16px; border: none; background: #FDA4AF; color: white; font-weight: 800; display: flex; align-items: center; justify-content: center; gap: 0.8rem; cursor: pointer; font-size: 1rem; transition: background 0.3s; }
        .submit-damage-btn:hover { background: #F43F5E; }
      `}</style>
    </div>
  );
};

export default InventoryManagement;
