import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Package, Search, Plus, AlertTriangle, Trash2, Edit, History,
  MapPin, ShoppingCart, Utensils, Brush, Hammer, MoreVertical,
  ChevronRight, ArrowUpRight, ArrowDownRight, Clock, CheckCircle2,
  AlertCircle, X, Save, Filter, ChevronLeft, Download, Printer, FileText,
  Eye, ShieldCheck, Camera, Send, User, TrendingUp, BarChart, StickyNote,
  Info, ArrowLeft, ArrowRight, ScanBarcode, Maximize2, LayoutGrid
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
  const [addStep, setAddStep] = useState(1);
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
      const matchesSearch = (item.name || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      // Support both subCategory (frontend) and subCategoryId (backend)
      const itemSub = item.subCategory || item.subCategoryId || '';
      const matchesSubCategory = selectedSubCategory === 'All' || itemSub === selectedSubCategory;
      const matchesStatus = selectedStatus === 'All' || 
                           (selectedStatus === 'Active' && item.stock > 0) || 
                           (selectedStatus === 'Out of Stock' && item.stock <= 0);
      return matchesSearch && matchesCategory && matchesSubCategory && matchesStatus;
    });
  }, [inventory, searchQuery, selectedCategory, selectedSubCategory, selectedStatus]);

  const filteredDamageEntries = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return damageEntries.filter(e =>
      e.product.toLowerCase().includes(q) ||
      e.id.toLowerCase().includes(q) ||
      e.reportedBy.toLowerCase().includes(q) ||
      e.type.toLowerCase().includes(q)
    );
  }, [damageEntries, searchQuery]);

  const filteredDeductions = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return deductions.filter(d =>
      d.item.toLowerCase().includes(q) ||
      d.id.toLowerCase().includes(q) ||
      d.person.toLowerCase().includes(q) ||
      d.reason.toLowerCase().includes(q)
    );
  }, [deductions, searchQuery]);

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
    if (e && e.preventDefault) e.preventDefault();
    if (!formData.name.trim()) { alert('Please enter a product name.'); return; }
    try {
      const payload = {
        ...formData,
        buildingId: activeBuildingId,
        // Map subCategory → subCategoryId for backend schema compatibility
        subCategoryId: formData.subCategory || formData.subCategoryId,
        // Map price fields correctly
        price: formData.sellingPrice || formData.price || 0,
      };
      if (selectedItem) {
        await api.updateInventoryItem(selectedItem.id || selectedItem._id, payload);
      } else {
        await api.addInventoryItem(payload);
      }
      setIsAddModalOpen(false);
      setAddStep(1);
      setFormData(initialFormData);
      setSelectedItem(null);
      fetchInventory();
    } catch (err) {
      console.error(err);
      alert('Error saving item. Please try again.');
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
    if (!damageFormData.productId.trim()) { alert('Please select a product.'); return; }
    if (!damageFormData.qty || damageFormData.qty < 1) { alert('Please enter a valid quantity.'); return; }
    const newEntry = {
      id: `VK-DMG-${Date.now()}`,
      date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' }),
      product: damageFormData.productId,
      reportedBy: 'You',
      qty: damageFormData.qty,
      type: damageFormData.type.toUpperCase(),
      loss: 0,
      status: 'PENDING'
    };
    setDamageEntries(prev => [newEntry, ...prev]);
    setIsDamageModalOpen(false);
    setDamageFormData({ productId: '', qty: 0, type: 'Damaged', description: '' });
  };

  const handleApproveDamage = (id) => {
    setDamageEntries(prev => prev.map(e => e.id === id ? { ...e, status: 'APPROVED' } : e));
  };

  const handleDeleteDamage = (id) => {
    if (window.confirm('Remove this damage entry?')) {
      setDamageEntries(prev => prev.filter(e => e.id !== id));
    }
  };

  const handleSettleDeduction = (id) => {
    setDeductions(prev => prev.map(d => d.id === id ? { ...d, status: 'PAID' } : d));
  };

  const handleDeleteDeduction = (id) => {
    if (window.confirm('Remove this deduction entry?')) {
      setDeductions(prev => prev.filter(d => d.id !== id));
    }
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
            <button className="primary-btn" onClick={() => { setSelectedItem(null); setFormData(initialFormData); setAddStep(1); setIsAddModalOpen(true); }}>
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
                  <select className="filter-select" value={selectedCategory} onChange={e => { setSelectedCategory(e.target.value); setSelectedSubCategory('All'); }}>
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
              {/* ── LOADING STATE ── */}
              {loading && activeTab === 'master' && [1,2,3,4].map(i => (
                <tr key={i}>
                  {[1,2,3,4,5].map(j => (
                    <td key={j}><div className="skeleton-cell" /></td>
                  ))}
                </tr>
              ))}

              {/* ── MASTER TAB ── */}
              {!loading && activeTab === 'master' && filteredInventory.map(item => (
                <tr key={item.id || item._id}>
                  <td>
                    <div className="cell-product">
                      <div className="product-img" style={{
                          background: CATEGORIES.find(c=>c.id===item.category)?.bg || 'var(--bg-secondary)',
                          color: CATEGORIES.find(c=>c.id===item.category)?.color || 'var(--text-muted)'
                        }}>
                        {item.name ? item.name[0].toUpperCase() : '?'}
                      </div>
                      <div>
                        <div className="product-name">{item.name}</div>
                        <div className="cell-sub">{item.category}{(item.subCategory || item.subCategoryId) ? ` • ${item.subCategory || item.subCategoryId}` : ''}</div>
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
                    />
                  </td>
                  <td>
                    <div className="action-btns">
                      <button className="action-btn" title="Edit" onClick={() => { setSelectedItem(item); setFormData(item); setAddStep(1); setIsAddModalOpen(true); }}><Edit size={16} /></button>
                      <button className="action-btn delete" title="Delete" onClick={() => handleDelete(item.id || item._id)}><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}

              {/* ── DAMAGE TAB ── */}
              {activeTab === 'damage' && filteredDamageEntries.map(entry => (
                <tr key={entry.id}>
                  <td>
                    <div className="cell-id">{entry.id}</div>
                    <div className="cell-sub">{entry.date}</div>
                  </td>
                  <td>
                    <div className="cell-product">
                      <div className="product-img" style={{ background: 'rgba(249,115,22,0.1)', color: '#f97316' }}>{entry.product[0]}</div>
                      <div className="product-name">{entry.product}</div>
                    </div>
                  </td>
                  <td>
                    <div className="cell-main">{entry.reportedBy}</div>
                    <div className="cell-sub" style={{ display:'flex', alignItems:'center', gap:'4px' }}><ShieldCheck size={12} /> VERIFIED</div>
                  </td>
                  <td><span className="qty-badge">{entry.qty}</span></td>
                  <td>
                    <span className="type-badge" style={{
                      background: entry.type==='DAMAGED' ? 'rgba(249,115,22,0.1)' : entry.type==='EXPIRED' ? 'rgba(139,92,246,0.1)' : 'rgba(239,68,68,0.1)',
                      color: entry.type==='DAMAGED' ? '#f97316' : entry.type==='EXPIRED' ? '#8b5cf6' : '#ef4444'
                    }}>{entry.type}</span>
                  </td>
                  <td><span className="loss-val">₹{entry.loss}</span></td>
                  <td><span className={`status-pill ${entry.status.toLowerCase()}`}>{entry.status}</span></td>
                  <td>
                    <div className="action-btns">
                      <button className="action-btn verify" title="Approve" onClick={() => handleApproveDamage(entry.id)} style={{ opacity: entry.status === 'APPROVED' ? 0.4 : 1 }} disabled={entry.status === 'APPROVED'}><ShieldCheck size={16} /></button>
                      <button className="action-btn delete" title="Remove" onClick={() => handleDeleteDamage(entry.id)}><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}

              {/* ── DEDUCTIONS TAB ── */}
              {activeTab === 'deductions' && filteredDeductions.map(ded => (
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
                  <td><span className="loss-val">₹{ded.amount}</span></td>
                  <td><div className="cell-sub">{ded.date}</div></td>
                  <td><span className={`status-pill ${ded.status.toLowerCase()}`}>{ded.status}</span></td>
                  <td>
                    <div className="action-btns">
                      <button className="action-btn verify" title="Mark as Paid" onClick={() => handleSettleDeduction(ded.id)} style={{ opacity: ded.status === 'PAID' ? 0.4 : 1 }} disabled={ded.status === 'PAID'}><CheckCircle2 size={16} /></button>
                      <button className="action-btn delete" title="Remove" onClick={() => handleDeleteDeduction(ded.id)}><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}

              {/* ── REPORTS TAB ── */}
              {activeTab === 'reports' && reports.map(rep => (
                <tr key={rep.id}>
                  <td>
                    <div className="cell-product">
                      <div className="product-img" style={{ background: rep.type === 'PDF' ? 'rgba(239,68,68,0.1)' : 'rgba(14,165,233,0.1)', color: rep.type === 'PDF' ? '#EF4444' : '#0EA5E9' }}>
                        {rep.type === 'PDF' ? '📄' : '📊'}
                      </div>
                      <div className="product-name">{rep.name}</div>
                    </div>
                  </td>
                  <td><div className="cell-sub">{rep.date}</div></td>
                  <td><span className="type-badge" style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}>{rep.type}</span></td>
                  <td><div className="cell-sub">{rep.size}</div></td>
                  <td>
                    <div className="action-btns">
                      <button className="action-btn" title="Download" onClick={() => { const a = document.createElement('a'); a.href = '#'; a.download = rep.name; a.click(); }}><Download size={16} /></button>
                      <button className="action-btn" title="Preview" onClick={() => alert(`Preview: ${rep.name}\nSize: ${rep.size}\nGenerated: ${rep.date}`)}><Eye size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* ── EMPTY STATES ── */}
          {!loading && activeTab === 'master' && filteredInventory.length === 0 && (
            <div className="empty-state">
              <div className="empty-state-icon">
                <Package size={48} strokeWidth={1.2} />
              </div>
              <h3 className="empty-state-title">
                {searchQuery || selectedCategory !== 'All' || selectedStatus !== 'All'
                  ? 'No items match your filters'
                  : 'No Inventory Items Yet'}
              </h3>
              <p className="empty-state-sub">
                {searchQuery || selectedCategory !== 'All' || selectedStatus !== 'All'
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Add your first product to start tracking hostel inventory, stock levels, and procurement.'}
              </p>
              {!searchQuery && selectedCategory === 'All' && selectedStatus === 'All' && (
                <button className="primary-btn" style={{ margin: '0 auto' }}
                  onClick={() => { setSelectedItem(null); setFormData(initialFormData); setAddStep(1); setIsAddModalOpen(true); }}>
                  <Plus size={18} /> Add First Item
                </button>
              )}
              {(searchQuery || selectedCategory !== 'All' || selectedStatus !== 'All') && (
                <button className="empty-reset-btn"
                  onClick={() => { setSearchQuery(''); setSelectedCategory('All'); setSelectedSubCategory('All'); setSelectedStatus('All'); }}>
                  Clear Filters
                </button>
              )}
            </div>
          )}

          {activeTab === 'damage' && filteredDamageEntries.length === 0 && (
            <div className="empty-state">
              <div className="empty-state-icon" style={{ background: 'rgba(249,115,22,0.08)', color: '#f97316' }}>
                <AlertTriangle size={48} strokeWidth={1.2} />
              </div>
              <h3 className="empty-state-title">{searchQuery ? 'No matching damage entries' : 'No Damage Entries'}</h3>
              <p className="empty-state-sub">{searchQuery ? 'Try a different search term.' : 'All inventory items are in good condition. Report any damage using the button above.'}</p>
              {searchQuery && <button className="empty-reset-btn" onClick={() => setSearchQuery('')}>Clear Search</button>}
            </div>
          )}

          {activeTab === 'deductions' && filteredDeductions.length === 0 && (
            <div className="empty-state">
              <div className="empty-state-icon" style={{ background: 'rgba(16,185,129,0.08)', color: '#10b981' }}>
                <CheckCircle2 size={48} strokeWidth={1.2} />
              </div>
              <h3 className="empty-state-title">{searchQuery ? 'No matching deductions' : 'No Deductions Recorded'}</h3>
              <p className="empty-state-sub">{searchQuery ? 'Try a different search term.' : 'No financial deductions have been logged yet.'}</p>
              {searchQuery && <button className="empty-reset-btn" onClick={() => setSearchQuery('')}>Clear Search</button>}
            </div>
          )}
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
          <div style={{ position: 'fixed', inset: 0, zIndex: 3000, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', background: 'rgba(15,23,42,0.55)', backdropFilter: 'blur(6px)', overflowY: 'auto', padding: '2rem 1rem' }}>
            <div style={{ width: '100%', maxWidth: '1040px', background: 'var(--bg-primary)', borderRadius: '12px', boxShadow: '0 25px 60px rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column', fontFamily: "'Inter', sans-serif", marginBottom: '2rem' }}>

              {/* TOP BAR */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2rem', height: '60px', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)', borderRadius: '12px 12px 0 0', flexShrink: 0 }}>
                <button onClick={() => setIsAddModalOpen(false)}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer', padding: '7px 14px', borderRadius: '7px', transition: '0.18s' }}
                  onMouseEnter={e => { e.currentTarget.style.background='var(--bg-tertiary)'; }} onMouseLeave={e => { e.currentTarget.style.background='transparent'; }}>
                  <ArrowLeft size={15} /> Back to List
                </button>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Add New Item</div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 500 }}>Inventory Management</div>
                </div>
                <button onClick={() => setIsAddModalOpen(false)}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '34px', height: '34px', background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-muted)', cursor: 'pointer', borderRadius: '7px', transition: '0.18s' }}
                  onMouseEnter={e => { e.currentTarget.style.background='#fee2e2'; e.currentTarget.style.color='#ef4444'; }} onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.color='var(--text-muted)'; }}>
                  <X size={18} />
                </button>
              </div>

              {/* TABS */}
              <div style={{ display: 'flex', gap: '2rem', padding: '0 2rem', borderBottom: '1px solid var(--border-color)', background: 'var(--bg-primary)' }}>
                {[{id:1,label:'Basic Information',icon:<Info size={14}/>},{id:2,label:'Pricing & Stock',icon:<Package size={14}/>}].map(t => (
                  <div key={t.id} onClick={() => setAddStep ? setAddStep(t.id) : null}
                    style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '1rem 0', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.04em', color: (addStep||1)===t.id ? 'var(--primary-green)' : 'var(--text-muted)', borderBottom: (addStep||1)===t.id ? '2.5px solid var(--primary-green)' : '2.5px solid transparent', marginBottom: '-1px', transition: '0.18s' }}>
                    {t.icon} {t.label}
                  </div>
                ))}
              </div>

              {/* CONTENT */}
              <div style={{ padding: '2rem' }}>
                {(!addStep || addStep === 1) ? (
                  <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '3rem' }}>
                    {/* Left */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>
                      <div>
                        <div style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>Product Visual</div>
                        <div style={{ width: '100%', aspectRatio: '1/1', background: 'var(--bg-secondary)', border: '2px dashed var(--border-color)', borderRadius: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                          <Camera size={26} /><span>Select Image</span>
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>Display Name *</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', border: '1px solid var(--border-color)', borderRadius: '8px', background: 'var(--bg-primary)' }}>
                          <Package size={15} color="var(--text-muted)" />
                          <input placeholder="e.g. Organic Tomato Ketchup" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                            style={{ border: 'none', background: 'transparent', width: '100%', fontWeight: 500, outline: 'none', fontSize: '0.88rem', color: 'var(--text-primary)' }} />
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>Barcode / SKU ID</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', border: '1px solid var(--border-color)', borderRadius: '8px', background: 'var(--bg-primary)' }}>
                          <ScanBarcode size={15} color="var(--text-muted)" />
                          <input placeholder="Scan or type barcode..." style={{ border: 'none', background: 'transparent', width: '100%', fontWeight: 500, outline: 'none', fontSize: '0.88rem', color: 'var(--text-primary)' }} />
                          <Maximize2 size={13} color="var(--text-muted)" />
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--primary-green)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>Initial Stock</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', border: '1px solid rgba(0, 168, 89, 0.3)', borderRadius: '8px', background: 'rgba(0, 168, 89, 0.1)' }}>
                          <Package size={15} color="var(--primary-green)" />
                          <input type="number" placeholder="0" value={formData.stock} onChange={e => setFormData({...formData, stock: parseInt(e.target.value)||0})}
                            style={{ border: 'none', background: 'transparent', width: '100%', fontWeight: 700, outline: 'none', fontSize: '0.95rem', color: 'var(--primary-green)' }} />
                        </div>
                      </div>
                    </div>
                    {/* Right */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                        <div>
                          <div style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>Category *</div>
                          <div style={{ position: 'relative' }}>
                            <select value={formData.category} onChange={e => handleCategoryChange(e.target.value)}
                              style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border-color)', borderRadius: '8px', fontWeight: 500, fontSize: '0.88rem', outline: 'none', color: 'var(--text-primary)', appearance: 'none', cursor: 'pointer', background: 'var(--bg-primary)' }}>
                              {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                            <LayoutGrid size={13} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                          </div>
                        </div>
                        <div>
                          <div style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>Sub Category *</div>
                          <div style={{ position: 'relative' }}>
                            <select value={formData.subCategory} onChange={e => setFormData({...formData, subCategory: e.target.value})}
                              style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border-color)', borderRadius: '8px', fontWeight: 500, fontSize: '0.88rem', outline: 'none', color: 'var(--text-primary)', appearance: 'none', cursor: 'pointer', background: 'var(--bg-primary)' }}>
                              {CATEGORIES.find(c => c.id === formData.category)?.subCategories.map(sub => <option key={sub} value={sub}>{sub}</option>)}
                            </select>
                            <LayoutGrid size={13} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                          </div>
                        </div>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                        <div>
                          <div style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>Unit Type *</div>
                          <select value={formData.unit} onChange={e => setFormData({...formData, unit: e.target.value})}
                            style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border-color)', borderRadius: '8px', fontWeight: 500, fontSize: '0.88rem', outline: 'none', color: 'var(--text-primary)', cursor: 'pointer', background: 'var(--bg-primary)' }}>
                            <option>Kg</option><option>Liters</option><option>Pieces</option><option>Boxes</option>
                          </select>
                        </div>
                        <div>
                          <div style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>Unit Value</div>
                          <input placeholder="e.g. 500 (for 500g)"
                            style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border-color)', borderRadius: '8px', fontWeight: 500, fontSize: '0.88rem', outline: 'none', color: 'var(--text-primary)', boxSizing: 'border-box', background: 'var(--bg-primary)' }} />
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>Product Description</div>
                        <textarea placeholder="Describe the product details..." rows={5} value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})}
                          style={{ width: '100%', padding: '12px 14px', border: '1px solid var(--border-color)', borderRadius: '8px', fontWeight: 500, fontSize: '0.88rem', outline: 'none', color: 'var(--text-primary)', resize: 'none', boxSizing: 'border-box', fontFamily: 'inherit', background: 'var(--bg-primary)' }} />
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <button onClick={() => setAddStep && setAddStep(2)}
                          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 22px', background: 'var(--primary-green)', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer', letterSpacing: '0.03em' }}
                          onMouseEnter={e => e.currentTarget.style.background='var(--primary-green-dark)'} onMouseLeave={e => e.currentTarget.style.background='var(--primary-green)'}>
                          NEXT: PRICING &amp; STOCK <ArrowRight size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem' }}>
                      {[{label:'Selling Price *',field:'sellingPrice'},{label:'Purchase Price',field:'purchasePrice'},{label:'Min Threshold',field:'minThreshold'}].map(({label,field}) => (
                        <div key={field}>
                          <div style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>{label}</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', border: '1px solid var(--border-color)', borderRadius: '8px', background: 'var(--bg-primary)' }}>
                            <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>₹</span>
                            <input type="number" placeholder="0.00" value={formData[field]||''} onChange={e => setFormData({...formData, [field]: e.target.value})}
                              style={{ border: 'none', background: 'transparent', width: '100%', fontWeight: 500, outline: 'none', fontSize: '0.88rem', color: 'var(--text-primary)' }} />
                          </div>
                        </div>
                      ))}
                    </div>
                    <div style={{ paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <button onClick={() => setAddStep && setAddStep(1)}
                        style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 18px', background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', borderRadius: '8px', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer' }}>
                        <ArrowLeft size={14} /> Back
                      </button>
                      <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <button onClick={() => { setIsAddModalOpen(false); setFormData(initialFormData); if(setAddStep) setAddStep(1); }}
                          style={{ padding: '10px 22px', background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', borderRadius: '8px', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer' }}>CANCEL</button>
                        <button onClick={handleSave}
                          style={{ padding: '10px 22px', background: 'var(--primary-green)', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer' }}
                          onMouseEnter={e => e.currentTarget.style.background='var(--primary-green-dark)'} onMouseLeave={e => e.currentTarget.style.background='var(--primary-green)'}>
                          SAVE &amp; ADD TO INVENTORY
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {isDamageModalOpen && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(6px)' }}>
            <div style={{ width: '100%', maxWidth: '600px', background: 'var(--bg-primary)', borderRadius: '16px', boxShadow: '0 30px 70px rgba(0,0,0,0.25)', overflow: 'hidden', fontFamily: "'Inter', sans-serif" }}>

              {/* Red Header Banner */}
              <div style={{ background: 'linear-gradient(135deg, #dc2626, #b91c1c)', padding: '1.5rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ width: '44px', height: '44px', background: 'rgba(255,255,255,0.15)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <AlertTriangle size={22} color="#fff" />
                  </div>
                  <div>
                    <div style={{ color: '#fff', fontWeight: 800, fontSize: '1rem', letterSpacing: '0.02em' }}>Report Damage Entry</div>
                    <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.72rem', fontWeight: 500, marginTop: '2px' }}>Log a damaged, expired, or lost inventory item</div>
                  </div>
                </div>
                <button onClick={() => setIsDamageModalOpen(false)}
                  style={{ width: '34px', height: '34px', background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '8px', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <X size={18} />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleDamageSubmit} style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>

                {/* Product Search */}
                <div>
                  <div style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>Select Product *</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', border: '1px solid var(--border-color)', borderRadius: '8px', background: 'var(--bg-secondary)' }}>
                    <Search size={16} color="var(--text-muted)" />
                    <input type="text" placeholder="Search product by name or SKU..."
                      value={damageFormData.productId}
                      onChange={e => setDamageFormData({...damageFormData, productId: e.target.value})}
                      required
                      style={{ border: 'none', background: 'transparent', width: '100%', fontWeight: 500, outline: 'none', fontSize: '0.88rem', color: 'var(--text-primary)' }} />
                  </div>
                </div>

                {/* Damage Type Chips */}
                <div>
                  <div style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px' }}>Damage Type *</div>
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    {[
                      { val: 'Damaged', color: '#f97316', bg: 'rgba(249, 115, 22, 0.1)', border: '#fed7aa', emoji: '🔨' },
                      { val: 'Expired', color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.1)', border: '#ddd6fe', emoji: '⏰' },
                      { val: 'Lost',    color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)', border: '#fecaca', emoji: '❌' },
                    ].map(t => (
                      <div key={t.val} onClick={() => setDamageFormData({...damageFormData, type: t.val})}
                        style={{ flex: 1, padding: '0.9rem 0.5rem', border: `2px solid ${damageFormData.type === t.val ? t.color : 'var(--border-color)'}`, borderRadius: '10px', background: damageFormData.type === t.val ? t.bg : 'var(--bg-primary)', cursor: 'pointer', textAlign: 'center', transition: '0.18s' }}>
                        <div style={{ fontSize: '1.4rem', marginBottom: '5px' }}>{t.emoji}</div>
                        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: damageFormData.type === t.val ? t.color : 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>{t.val}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Qty + Loss */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                  <div>
                    <div style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>Quantity Damaged *</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', border: '1px solid var(--border-color)', borderRadius: '8px', background: 'var(--bg-primary)' }}>
                      <Package size={15} color="var(--text-muted)" />
                      <input type="number" min="1" placeholder="0"
                        value={damageFormData.qty}
                        onChange={e => setDamageFormData({...damageFormData, qty: parseInt(e.target.value)||0})}
                        required
                        style={{ border: 'none', background: 'transparent', width: '100%', fontWeight: 600, outline: 'none', fontSize: '0.95rem', color: 'var(--text-primary)' }} />
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>Estimated Loss (₹)</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.1)' }}>
                      <span style={{ color: '#ef4444', fontWeight: 700 }}>₹</span>
                      <input type="number" placeholder="0.00"
                        style={{ border: 'none', background: 'transparent', width: '100%', fontWeight: 700, outline: 'none', fontSize: '0.95rem', color: '#ef4444' }} />
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <div style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>Description / Remarks</div>
                  <textarea placeholder="Describe how the damage occurred, location, or any additional context..."
                    rows={3} value={damageFormData.description}
                    onChange={e => setDamageFormData({...damageFormData, description: e.target.value})}
                    style={{ width: '100%', padding: '12px 14px', border: '1px solid var(--border-color)', borderRadius: '8px', fontWeight: 500, fontSize: '0.88rem', outline: 'none', color: 'var(--text-primary)', resize: 'none', boxSizing: 'border-box', fontFamily: 'inherit', background: 'var(--bg-primary)' }} />
                </div>

                {/* Buttons */}
                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', paddingTop: '0.5rem', borderTop: '1px solid var(--border-color)' }}>
                  <button type="button" onClick={() => setIsDamageModalOpen(false)}
                    style={{ padding: '10px 22px', background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', borderRadius: '8px', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer' }}>
                    Cancel
                  </button>
                  <button type="submit"
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 22px', background: '#dc2626', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer' }}
                    onMouseEnter={e => e.currentTarget.style.background='#b91c1c'}
                    onMouseLeave={e => e.currentTarget.style.background='#dc2626'}>
                    <Send size={15} /> Submit Damage Report
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </AnimatePresence>

      <style jsx="true">{`
        .inventory-v3 { padding: 1.5rem 2.5rem; background: var(--bg-main); min-height: 100vh; font-family: 'Inter', sans-serif; color: var(--text-primary); }
        .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
        .header-left { display: flex; align-items: center; gap: 1.5rem; }
        .back-btn { width: 40px; height: 40px; border-radius: 10px; border: 1px solid var(--border-color); background: var(--bg-primary); display: flex; align-items: center; justify-content: center; color: var(--text-secondary); cursor: pointer; }
        .header-title-area h1 { font-size: 1.5rem; font-weight: 800; color: var(--text-primary); margin: 0; }
        .header-title-area p { font-size: 0.85rem; color: var(--text-muted); margin: 0.2rem 0 0; font-weight: 500; }
        .header-actions { display: flex; gap: 0.8rem; align-items: center; }
        .icon-btn { width: 40px; height: 40px; border-radius: 10px; border: 1px solid var(--border-color); background: var(--bg-primary); color: var(--text-secondary); display: flex; align-items: center; justify-content: center; cursor: pointer; }
        .primary-btn { padding: 0.7rem 1.5rem; border-radius: 10px; border: none; background: var(--primary-green); color: white; font-weight: 700; font-size: 0.85rem; display: flex; align-items: center; gap: 0.5rem; cursor: pointer; }
        .primary-btn.damage { background: #EF4444; }
        .tab-nav { display: flex; gap: 2rem; border-bottom: 1px solid var(--border-color); margin-bottom: 2rem; }
        .tab-item { padding: 1rem 0; background: transparent; border: none; color: var(--text-muted); font-weight: 700; font-size: 0.8rem; display: flex; align-items: center; gap: 0.6rem; cursor: pointer; position: relative; }
        .tab-item.active { color: var(--primary-green); }
        .tab-item.active::after { content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 2px; background: var(--primary-green); }
        .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; margin-bottom: 2rem; }
        .stat-card { background: var(--bg-card); padding: 1.5rem; border-radius: 20px; border: 1px solid var(--border-light); display: flex; justify-content: space-between; align-items: flex-start; transition: transform 0.2s; }
        .stat-card:hover { transform: translateY(-5px); }
        .stat-label { font-size: 0.7rem; font-weight: 800; color: var(--text-muted); letter-spacing: 0.05em; }
        .stat-value { font-size: 1.8rem; font-weight: 800; color: var(--text-primary); margin: 0.5rem 0 0; }
        .stat-trend { font-size: 0.75rem; font-weight: 700; padding: 0.3rem 0.6rem; border-radius: 8px; background: rgba(0,168,89,0.1); color: var(--primary-green); display: flex; align-items: center; gap: 0.3rem; }
        .content-card { background: var(--bg-card); border-radius: 24px; border: 1px solid var(--border-light); padding: 1.5rem; box-shadow: var(--shadow-soft); }
        .table-filters { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
        .search-box { position: relative; width: 400px; }
        .search-box svg { position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: var(--text-muted); }
        .search-box input { width: 100%; padding: 0.8rem 1rem 0.8rem 3rem; border-radius: 12px; border: 1px solid var(--border-color); background: var(--bg-secondary); color: var(--text-primary); font-weight: 500; outline: none; }
        .filter-actions { display: flex; gap: 1rem; }
        .filter-select { padding: 0.7rem 1rem; border-radius: 10px; border: 1px solid var(--border-color); background: var(--bg-primary); font-weight: 600; color: var(--text-secondary); font-size: 0.85rem; outline: none; }
        .custom-table { width: 100%; border-collapse: collapse; }
        .custom-table th { text-align: left; padding: 1rem; font-size: 0.7rem; font-weight: 800; color: var(--text-muted); letter-spacing: 0.05em; border-bottom: 1px solid var(--border-light); }
        .custom-table td { padding: 1.2rem 1rem; border-bottom: 1px solid var(--border-light); }
        .cell-id { font-weight: 700; color: var(--text-primary); font-size: 0.9rem; }
        .cell-sub { font-size: 0.75rem; color: var(--text-muted); font-weight: 600; }
        .cell-main { font-weight: 700; color: var(--text-primary); font-size: 0.95rem; }
        .cell-product { display: flex; align-items: center; gap: 1rem; }
        .product-img { width: 40px; height: 40px; background: var(--bg-secondary); border-radius: 8px; display: flex; align-items: center; justify-content: center; font-weight: 800; color: var(--text-muted); font-size: 1.2rem; }
        .product-name { font-weight: 700; color: var(--text-primary); font-size: 0.95rem; }
        .qty-badge { background: var(--bg-secondary); padding: 0.4rem 0.8rem; border-radius: 8px; font-weight: 700; color: var(--text-secondary); }
        .type-badge { padding: 0.4rem 0.8rem; border-radius: 8px; font-size: 0.75rem; font-weight: 800; }
        .type-badge.damaged { background: rgba(249, 115, 22, 0.1); color: #f97316; }
        .loss-val { font-weight: 800; color: #EF4444; }
        .status-pill { padding: 0.4rem 0.8rem; border-radius: 20px; font-size: 0.7rem; font-weight: 800; }
        .status-pill.pending { background: rgba(245, 158, 11, 0.1); color: #D97706; }
        .status-pill.paid, .status-pill.approved { background: rgba(16, 185, 129, 0.1); color: #10B981; }
        .action-btns { display: flex; gap: 0.5rem; justify-content: flex-end; }
        .action-btn { width: 32px; height: 32px; border-radius: 8px; border: 1px solid var(--border-color); background: var(--bg-primary); color: var(--text-secondary); display: flex; align-items: center; justify-content: center; cursor: pointer; }
        .action-btn.verify { color: var(--primary-green); background: rgba(16, 185, 129, 0.1); border-color: rgba(16, 185, 129, 0.2); }
        .action-btn.delete { color: #EF4444; background: rgba(239, 68, 68, 0.1); border-color: rgba(239, 68, 68, 0.2); }
        .stock-dist { display: flex; gap: 1rem; }
        .dist-item { display: flex; flex-direction: column; align-items: center; min-width: 40px; }
        .dist-val { font-weight: 800; color: var(--text-primary); font-size: 0.9rem; }
        .dist-label { font-size: 0.6rem; color: var(--text-muted); font-weight: 800; }
        .dist-item.total .dist-val { color: var(--primary-green); }
        .toggle-switch { width: 40px; height: 22px; background: var(--border-color); border-radius: 20px; position: relative; }
        .toggle-switch.active { background: var(--primary-green); }
        .toggle-switch::before { content: ''; position: absolute; width: 16px; height: 16px; background: var(--bg-primary); border-radius: 50%; top: 3px; left: 3px; transition: transform 0.2s; }
        .toggle-switch.active::before { transform: translateX(18px); }
        .modal-overlay { position: fixed; inset: 0; background: rgba(15, 23, 42, 0.4); backdrop-filter: blur(8px); z-index: 2000; display: flex; align-items: center; justify-content: center; }
        .modal-content { background: var(--bg-primary); border-radius: 32px; box-shadow: var(--shadow-soft); overflow: hidden; width: 90%; }
        .modal-content.large { max-width: 800px; }
        .modal-content.medium { max-width: 500px; }
        .modal-header { padding: 1.5rem 2.5rem; border-bottom: 1px solid var(--border-color); }
        .header-badge { display: inline-flex; align-items: center; gap: 0.5rem; background: rgba(16, 185, 129, 0.1); color: var(--primary-green); padding: 0.4rem 0.8rem; border-radius: 8px; font-size: 0.7rem; font-weight: 800; margin-bottom: 0.5rem; }
        .modal-header h2 { font-size: 1.4rem; font-weight: 900; color: var(--text-primary); margin: 0; }
        .close-btn { position: absolute; top: 1.5rem; right: 1.5rem; background: transparent; border: none; color: var(--text-muted); cursor: pointer; }
        .modal-body { padding: 2.5rem; }
        .modal-info-box { background: rgba(99, 102, 241, 0.1); border: 1px solid rgba(99, 102, 241, 0.2); border-radius: 12px; padding: 1rem; margin-bottom: 1.5rem; display: flex; align-items: center; gap: 0.8rem; color: #818cf8; font-size: 0.85rem; font-weight: 600; }
        .inventory-form { display: flex; flex-direction: column; gap: 1.5rem; }
        .form-row { display: flex; gap: 1.5rem; }
        .form-group { flex: 1; display: flex; flex-direction: column; gap: 0.5rem; }
        .form-group.full { width: 100%; }
        .form-group label { font-size: 0.7rem; font-weight: 800; color: var(--text-muted); letter-spacing: 0.05em; }
        .form-group input, .form-group select, .form-group textarea { padding: 1rem; border-radius: 12px; border: 1px solid var(--border-color); background: var(--bg-secondary); color: var(--text-primary); font-weight: 600; font-size: 0.9rem; outline: none; transition: 0.2s; }
        .form-group input:focus, .form-group select:focus, .form-group textarea:focus { border-color: var(--primary-green); background: var(--bg-primary); box-shadow: 0 0 0 4px var(--primary-green-light); }
        .form-group textarea { height: 100px; resize: none; }
        .form-footer { display: flex; justify-content: flex-end; gap: 1rem; margin-top: 2rem; }
        .secondary-btn { padding: 0.8rem 1.8rem; border-radius: 12px; border: 1px solid var(--border-color); background: var(--bg-primary); color: var(--text-primary); font-weight: 700; cursor: pointer; }
        .submit-damage-btn { margin-top: 1rem; padding: 1.2rem; border-radius: 16px; border: none; background: #FDA4AF; color: white; font-weight: 800; display: flex; align-items: center; justify-content: center; gap: 0.8rem; cursor: pointer; font-size: 1rem; transition: background 0.3s; }
        .submit-damage-btn:hover { background: #F43F5E; }
        .table-container { overflow-x: auto; }
        .empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 4rem 2rem; text-align: center; gap: 1rem; }
        .empty-state-icon { width: 96px; height: 96px; border-radius: 24px; background: rgba(0, 168, 89, 0.08); color: var(--primary-green); display: flex; align-items: center; justify-content: center; margin-bottom: 0.5rem; }
        .empty-state-title { font-size: 1.15rem; font-weight: 800; color: var(--text-primary); margin: 0; }
        .empty-state-sub { font-size: 0.85rem; color: var(--text-muted); margin: 0; max-width: 360px; line-height: 1.6; font-weight: 500; }
        .empty-reset-btn { margin-top: 0.5rem; padding: 0.6rem 1.4rem; border-radius: 10px; border: 1px solid var(--border-color); background: var(--bg-secondary); color: var(--text-secondary); font-weight: 700; font-size: 0.82rem; cursor: pointer; transition: 0.18s; }
        .empty-reset-btn:hover { background: var(--bg-tertiary); color: var(--text-primary); }
        .skeleton-cell { height: 20px; border-radius: 6px; background: linear-gradient(90deg, var(--bg-secondary) 25%, var(--bg-tertiary) 50%, var(--bg-secondary) 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; }
        @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
      `}</style>
    </div>
  );
};

export default InventoryManagement;
