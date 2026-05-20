import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { 
  Package, Search, Filter, Plus, ChevronLeft, ChevronRight, Download, MoreVertical, 
  LayoutGrid, List, AlertTriangle, FileText, ClipboardList, Info, CheckCircle2,
  ArrowRight, ArrowLeft, Store, MapPin, BarChart3, Bed, Utensils, Wrench, Trash, X,
  ScanBarcode, Shield, History, Banknote, Camera, Maximize2, User
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../mockData';
import './InventoryMaster.css';

const PORTALS = [
  { id: 'master', name: 'MASTER', icon: <Package size={18} /> },
  { id: 'stock', name: 'STOCK', icon: <ClipboardList size={18} /> },
  { id: 'damaged', name: 'DAMAGED', icon: <AlertTriangle size={18} /> },
  { id: 'report', name: 'REPORT', icon: <FileText size={18} /> },
];

const HOSTEL_CATEGORIES = [
  { id: 'CLEANING', name: 'CLEANING & HYGIENE', icon: <Trash size={14} />, desc: 'Phenyl, Brooms, Toiletries' },
  { id: 'BEDDING', name: 'BEDDING & LINEN', icon: <Bed size={14} />, desc: 'Pillows, Sheets, Blankets' },
  { id: 'MESS', name: 'MESS & KITCHEN', icon: <Utensils size={14} />, desc: 'Rice, Gas, Groceries' },
  { id: 'MAINTENANCE', name: 'MAINTENANCE & HDW', icon: <Wrench size={14} />, desc: 'Bulbs, Taps, Batteries' },
  { id: 'ASSETS', name: 'ROOM ASSETS', icon: <Package size={14} />, desc: 'Fans, AC Remotes, Chairs' }
];

const CATEGORIES_LIST = ['ALL ITEMS', 'CLEANING & HYGIENE', 'BEDDING & LINEN', 'MESS & KITCHEN', 'MAINTENANCE & HDW', 'ROOM ASSETS'];

const InventoryMaster = () => {
  const { buildingId: urlBuildingId } = useParams();
  const location = useLocation();
  const buildingId = urlBuildingId || localStorage.getItem('selectedBuildingId');

  const fileInputRef = React.useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAddFormData(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const [activePortal, setActivePortal] = useState('master');
  const [activeFilter, setActiveFilter] = useState('ALL ITEMS');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [allProducts, setAllProducts] = useState([]);
  
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [addStep, setAddStep] = useState(1);
  const [isReportingDamage, setIsReportingDamage] = useState(false);
  
  const [addFormData, setAddFormData] = useState({
    name: '', sku: '', category: '', subCategory: '', unitType: '', unitValue: '', 
    description: '', sellingPrice: 0, mrpPrice: 0, purchasePrice: 0, gstRate: 0, lowStockLevel: 5, isFreeItem: false,
    image: ''
  });

  const [damageEntries, setDamageEntries] = useState([
    { id: 'DMG-H-001', date: '20 May 26', product: 'Pillow Cover (Cotton)', reportedBy: 'Staff Ramesh', location: 'Room 302', qty: 2, type: 'RESIDENT DAMAGE', loss: 240, status: 'PENDING', img: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?q=80&w=100' }
  ]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    if (tab && ['master', 'damaged', 'stock', 'report'].includes(tab)) setActivePortal(tab);
    fetchInventory();
  }, [buildingId, location.search]);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const data = await api.getInventory(buildingId);
      setAllProducts(data.map(item => ({
        ...item,
        store: item.quantity || 0,
        fleet: item.fleetQuantity || 0,
        total: (item.quantity || 0) + (item.fleetQuantity || 0),
        img: item.image || 'https://images.unsplash.com/photo-1586769852836-bc069f19e1b6?q=80&w=100'
      })));
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const filteredProducts = useMemo(() => {
    return allProducts.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.sku?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch && (activeFilter === 'ALL ITEMS' || p.category === activeFilter);
    });
  }, [allProducts, searchQuery, activeFilter]);

  const stats = useMemo(() => ({
    total: allProducts.length,
    lowStock: allProducts.filter(p => p.total <= 10 && p.total > 0).length,
    damaged: allProducts.filter(p => damageEntries.some(d => d.product === p.name)).length,
    totalValue: allProducts.reduce((acc, p) => acc + (p.price * p.total), 0).toLocaleString()
  }), [allProducts, damageEntries]);

  // ELITE HOSTEL INVENTORY CREATOR (MATCHING USER SCREENSHOTS)
  const renderAddProductView = () => {
    const taxAmount = (addFormData.purchasePrice * (addFormData.gstRate / 100)).toFixed(2);
    const landingPrice = (parseFloat(addFormData.purchasePrice || 0) + parseFloat(taxAmount)).toFixed(2);
    const grossMargin = (parseFloat(addFormData.sellingPrice || 0) - parseFloat(landingPrice)).toFixed(2);

    return (
    <div className="add-product-overlay">
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '50px', background: 'red', zIndex: 99999, color: 'white', fontSize: '24px', textAlign: 'center' }}>
        DEBUG BANNER: IF YOU SEE THIS, RENDER ADD PRODUCT VIEW IS WORKING
      </div>
      <div className="creator-modal">
        {/* Classic Top Bar */}
        <div className="creator-top-bar" style={{ display: 'flex', minHeight: '60px', background: '#ffebee' }}>
          <button className="btn-back-classic" onClick={() => setIsAddingProduct(false)}>
            <ArrowLeft size={16} /> Back to List
          </button>
          <button className="btn-close-classic" onClick={() => setIsAddingProduct(false)}>
            <X size={20} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="creator-tabs-container">
          <div className="creator-tabs">
            <div className={`tab-item ${addStep === 1 ? 'active' : ''}`} onClick={() => setAddStep(1)}>
              <Info size={16} /> BASIC INFORMATION
            </div>
            <div className={`tab-item ${addStep === 2 ? 'active' : ''}`} onClick={() => setAddStep(2)}>
              <Package size={16} /> PRICING & STOCK
            </div>
          </div>
        </div>

        <div className="creator-content">
          {addStep === 1 ? (
            <div className="tab-layout">
              {/* Left Column */}
              <div className="tab-col-left">
                <div className="creator-input-group">
                  <label>PRODUCT VISUAL</label>
                  <div 
                    className="upload-box-square" 
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      cursor: 'pointer',
                      position: 'relative',
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      border: '2px dashed var(--border-color)',
                      borderRadius: '8px',
                      height: '140px',
                      width: '100%',
                      background: 'var(--bg-secondary)'
                    }}
                  >
                    {addFormData.image ? (
                      <>
                        <img src={addFormData.image} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <div style={{
                          position: 'absolute',
                          inset: 0,
                          background: 'rgba(0,0,0,0.5)',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#fff',
                          opacity: 0,
                          transition: 'opacity 0.2s',
                          gap: '4px',
                          fontSize: '11px',
                          fontWeight: 'bold'
                        }}
                        onMouseEnter={e => { e.currentTarget.style.opacity = 1; }}
                        onMouseLeave={e => { e.currentTarget.style.opacity = 0; }}
                        >
                          <Camera size={18} />
                          <span>CHANGE IMAGE</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <Camera size={28} />
                        <span>SELECT IMAGE</span>
                      </>
                    )}
                  </div>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    style={{ display: 'none' }} 
                    accept="image/*" 
                    onChange={handleImageChange} 
                  />
                </div>

                <div className="creator-input-group">
                  <label>DISPLAY NAME *</label>
                  <div className="creator-input">
                    <Package size={16} />
                    <input placeholder="e.g. Organic Tomato Ketchup" value={addFormData.name} onChange={e => setAddFormData({...addFormData, name: e.target.value})} />
                  </div>
                </div>

                <div className="creator-input-group">
                  <label>BARCODE / SKU ID</label>
                  <div className="creator-input">
                    <ScanBarcode size={16} />
                    <input placeholder="Scan or type barcode..." value={addFormData.sku} onChange={e => setAddFormData({...addFormData, sku: e.target.value})} />
                    <Maximize2 size={14} className="scan-icon" />
                  </div>
                </div>

                <div className="creator-input-group">
                  <label>INITIAL STOCK</label>
                  <div className="creator-input highlight-green">
                    <Package size={16} />
                    <input type="number" placeholder="0" value={addFormData.stock || ''} onChange={e => setAddFormData({...addFormData, stock: parseInt(e.target.value)})} />
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="tab-col-right">
                <div className="creator-grid-2">
                  <div className="creator-input-group">
                    <label>CATEGORY *</label>
                    <div className="creator-select-wrapper">
                      <select className="creator-select" value={addFormData.category} onChange={e => setAddFormData({...addFormData, category: e.target.value})}>
                        <option value="">Select Category</option>
                        {CATEGORIES_LIST.slice(1).map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                      <LayoutGrid size={14} className="select-icon" />
                    </div>
                  </div>
                  <div className="creator-input-group">
                    <label>SUB CATEGORY *</label>
                    <div className="creator-select-wrapper">
                      <select className="creator-select" value={addFormData.subCategory} onChange={e => setAddFormData({...addFormData, subCategory: e.target.value})}>
                        <option value="">Select Sub Category</option>
                        <option value="Daily Essentials">Daily Essentials</option>
                        <option value="Bulk Supplies">Bulk Supplies</option>
                      </select>
                      <LayoutGrid size={14} className="select-icon" />
                    </div>
                  </div>
                </div>

                <div className="creator-grid-2">
                  <div className="creator-input-group">
                    <label>UNIT TYPE *</label>
                    <select className="creator-select" value={addFormData.unitType} onChange={e => setAddFormData({...addFormData, unitType: e.target.value})}>
                      <option value="">Select Unit</option>
                      <option value="Pcs">Pcs</option><option value="Kg">Kg</option><option value="Liters">Liters</option><option value="Boxes">Boxes</option>
                    </select>
                  </div>
                  <div className="creator-input-group">
                    <label>UNIT VALUE</label>
                    <div className="creator-input no-icon">
                      <input placeholder="e.g. 500 (for 500g)" value={addFormData.unitValue} onChange={e => setAddFormData({...addFormData, unitValue: e.target.value})} />
                    </div>
                  </div>
                </div>

                <div className="creator-input-group desc-group">
                  <label>PRODUCT DESCRIPTION</label>
                  <textarea className="creator-textarea" placeholder="Describe the product details..." rows={4} value={addFormData.description} onChange={e => setAddFormData({...addFormData, description: e.target.value})} />
                </div>

                <div className="creator-footer">
                  <button className="btn-creator-next" onClick={() => setAddStep(2)}>NEXT: PRICING & STOCK <ArrowRight size={14} /></button>
                </div>
              </div>
            </div>
          ) : (
            <div className="tab-layout vertical">
              <div className="creator-grid-4">
                <div className="creator-input-group">
                  <label>SELLING PRICE *</label>
                  <div className="creator-input"><span className="curr">₹</span><input type="number" placeholder="0.00" value={addFormData.sellingPrice || ''} onChange={e => setAddFormData({...addFormData, sellingPrice: e.target.value})} /></div>
                </div>
                <div className="creator-input-group">
                  <label>MRP PRICE</label>
                  <div className="creator-input"><span className="curr">₹</span><input type="number" placeholder="0.00" value={addFormData.mrpPrice || ''} onChange={e => setAddFormData({...addFormData, mrpPrice: e.target.value})} /></div>
                </div>
                <div className="creator-input-group">
                  <label>PURCHASE PRICE (LND)</label>
                  <div className="creator-input"><span className="curr">₹</span><input type="number" placeholder="0.00" value={addFormData.purchasePrice || ''} onChange={e => setAddFormData({...addFormData, purchasePrice: e.target.value})} /></div>
                </div>
                <div className="creator-input-group">
                  <label>GST RATE (%)</label>
                  <select className="creator-select" value={addFormData.gstRate} onChange={e => setAddFormData({...addFormData, gstRate: e.target.value})}>
                    <option value={0}>0%</option><option value={5}>5%</option><option value={12}>12%</option><option value={18}>18%</option>
                  </select>
                </div>
              </div>

              <div className="creator-grid-4">
                <div className="creator-input-group highlight-soft">
                  <label>TAX AMOUNT (₹)</label>
                  <div className="creator-input highlight-green-light">
                    <span className="curr">₹</span>
                    <input disabled value={taxAmount} className="bold-input" />
                    <span className="incl-gst">INCL. GST</span>
                  </div>
                </div>
                <div className="creator-input-group">
                  <label>LOW STOCK ALERT (QTY)</label>
                  <div className="creator-input"><input type="number" value={addFormData.lowStockLevel} onChange={e => setAddFormData({...addFormData, lowStockLevel: e.target.value})} /></div>
                </div>
                <div className="creator-input-group">
                  <label>PROMOTIONAL (FREE)</label>
                  <div className="creator-checkbox-card">
                    <input type="checkbox" id="promo" checked={addFormData.isFreeItem} onChange={e => setAddFormData({...addFormData, isFreeItem: e.target.checked})} />
                    <label htmlFor="promo">Mark as Free Item</label>
                  </div>
                </div>
              </div>

              <div className="creator-footer-final">
                <div className="final-meta">
                   <div className="meta-col">
                     <span className="calc-label">CALCULATED LANDING PRICE: <strong className="black-text">₹{landingPrice}</strong></span>
                     <span className="gross-margin">GROSS MARGIN: <strong className="green-text">₹{grossMargin}</strong></span>
                   </div>
                </div>
                <div className="final-btns">
                  <button className="btn-creator-secondary" onClick={() => setAddStep(1)}>CANCEL</button>
                  <button className="btn-creator-publish" onClick={() => setIsAddingProduct(false)}>SAVE & PUBLISH SKU</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
    );
  };

  // TAILORED DAMAGE REPORT FLOW (MATCHING ELITE DESIGN)
  const renderDamageView = () => {
    if (isReportingDamage) {
      return (
        <div className="add-product-overlay">
          <div className="creator-modal">
            {/* Elite Header Bar */}
            <div className="creator-header">
              <button className="btn-back-link" onClick={() => setIsReportingDamage(false)}>
                <ChevronLeft size={16} /> BACK TO DASHBOARD
              </button>
              <div className="draft-indicator danger">
                <div className="pulse-dot red"></div>
                DRAFTING DAMAGE AUDIT
              </div>
            </div>

            {/* Tab Navigation (Single Tab for Damage right now) */}
            <div className="creator-tabs">
              <div className="tab-item active">
                <AlertTriangle size={16} /> DAMAGE INCIDENT DETAILS
              </div>
            </div>

            <div className="creator-content">
              <div className="tab-layout">
                {/* Left Column: Evidence & Identity */}
                <div className="tab-col-left">
                  <div className="image-upload-zone">
                    <label className="ccc-label">INCIDENT EVIDENCE (PHOTO) *</label>
                    <div className="upload-box danger">
                      <Camera size={32} />
                      <span>UPLOAD DAMAGE PHOTO</span>
                    </div>
                  </div>

                  <div className="creator-input-group">
                    <label>SELECT DAMAGED ASSET *</label>
                    <div className="creator-input">
                      <Search size={16} />
                      <input placeholder="Search product (e.g. Fan, Table)..." />
                    </div>
                  </div>

                  <div className="creator-input-group">
                    <label>INCIDENT LOCATION *</label>
                    <div className="creator-input">
                      <MapPin size={16} />
                      <input placeholder="e.g. Room 402 / Corridors" />
                    </div>
                  </div>
                </div>

                {/* Right Column: Accountability & Recovery */}
                <div className="tab-col-right">
                  <div className="creator-grid-2">
                    <div className="creator-input-group">
                      <label>ACCOUNTABILITY TYPE</label>
                      <select className="creator-select">
                        <option>Resident Negligence</option>
                        <option>General Wear & Tear</option>
                        <option>Staff Negligence</option>
                        <option>Theft / Missing</option>
                      </select>
                    </div>
                    <div className="creator-input-group">
                      <label>INCIDENT DATE</label>
                      <div className="creator-input">
                        <History size={16} />
                        <input type="date" />
                      </div>
                    </div>
                  </div>

                  <div className="creator-grid-2">
                    <div className="creator-input-group">
                      <label>QUANTITY AFFECTED</label>
                      <div className="creator-input">
                        <Package size={16} />
                        <input type="number" placeholder="1" />
                      </div>
                    </div>
                    <div className="creator-input-group">
                      <label>RECOVERY AMOUNT (₹)</label>
                      <div className="creator-input highlight-red">
                        <Banknote size={16} />
                        <input type="number" placeholder="0.00" />
                      </div>
                    </div>
                  </div>

                  <div className="creator-input-group">
                    <label>RESIDENT / STAFF NAME (IF APPLICABLE)</label>
                    <div className="creator-input">
                      <User size={16} />
                      <input placeholder="e.g. Rahul Sharma" />
                    </div>
                  </div>

                  <div className="creator-input-group">
                    <label>DESCRIPTION OF DAMAGE</label>
                    <textarea className="creator-textarea" placeholder="Provide details about how it happened..." rows={4} />
                  </div>

                  <div className="creator-footer">
                    <button className="btn-creator-publish danger" onClick={() => setIsReportingDamage(false)}>
                      CONFIRM DAMAGE AUDIT & DEDUCTION
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className="damage-portal-view">
        <div className="portal-header">
           <div className="header-left"><div className="header-icon-box"><AlertTriangle size={24} /></div><div className="header-titles"><h1 className="portal-title">Damage & Deductions</h1><p className="portal-subtitle">Track hostel assets damage and resident accountability logs.</p></div></div>
           <div className="header-actions"><button className="btn-primary-action danger" onClick={() => setIsReportingDamage(true)}><Plus size={20} /> REPORT DAMAGE</button></div>
        </div>
        <div className="portal-sub-tabs">
           <button className={`sub-tab ${damageSubTab === 'entries' ? 'active' : ''}`} onClick={() => setDamageSubTab('entries')}>DAMAGE ENTRIES</button>
           <button className={`sub-tab ${damageSubTab === 'reports' ? 'active' : ''}`} onClick={() => setDamageSubTab('reports')}>REPORTS & ANALYTICS</button>
        </div>
        <div className="portal-stats-grid">
           <div className="p-stat-card"><div className="p-stat-label">TOTAL LOGS</div><div className="p-stat-value">12</div></div>
           <div className="p-stat-card warning"><div className="p-stat-label">RESIDENT-CAUSED</div><div className="p-stat-value">4</div></div>
           <div className="p-stat-card info"><div className="p-stat-label">APPROVED</div><div className="p-stat-value">8</div></div>
           <div className="p-stat-card danger"><div className="p-stat-label">RECOVERY AMNT</div><div className="p-stat-value">₹1,240</div></div>
        </div>
        <div className="table-wrapper">
          <table className="damage-table-new">
            <thead><tr><th>ID / DATE</th><th>ASSET / ITEM</th><th>LOCATION</th><th>QTY</th><th>TYPE</th><th>DEDUCTION</th><th>STATUS</th><th style={{ textAlign: 'right' }}>ACTIONS</th></tr></thead>
            <tbody>
              {damageEntries.map(e => (
                <tr key={e.id}>
                  <td><div className="id-cell"><span className="dmg-id">{e.id}</span><span className="dmg-date">{e.date}</span></div></td>
                  <td><div className="product-cell"><img src={e.img} alt={e.product} /><span className="p-name">{e.product}</span></div></td>
                  <td><div className="reported-cell"><span className="loc">● {e.location}</span></div></td>
                  <td><span className="qty-badge">{e.qty}</span></td>
                  <td><span className="type-badge">RESIDENT</span></td>
                  <td><span className="loss-val">₹{e.loss}</span></td>
                  <td><span className="status-badge pending">PENDING</span></td>
                  <td><div className="action-cell"><Eye size={18} /><Trash2 size={18} /></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderMasterView = () => {
    if (isAddingProduct) return renderAddProductView();
    return (
      <div className="master-view-inner">
        <div className="master-header-row">
          <div><h1 className="master-title">Inventory Master <Package size={20} /></h1><p className="master-subtitle">Comprehensive management of hostel consumables and durable assets.</p></div>
          <div className="master-actions"><button className="master-btn btn-outline"><Download size={16} /> Export Audit</button><button className="master-btn btn-primary" onClick={() => setIsAddingProduct(true)}><Plus size={20} /> ADD HOSTEL ITEM</button></div>
        </div>
        <div className="master-toolbar-row">
          <div className="search-box"><Search className="search-icon" size={18} /><input type="text" placeholder="Search consumables, hardware..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} /><ScanBarcode className="barcode-icon" size={20} /></div>
          <button className="master-btn btn-outline"><Filter size={18} /> Filter by Room</button>
        </div>
        <div className="filter-pills">{CATEGORIES_LIST.map(cat => (<button key={cat} onClick={() => setActiveFilter(cat)} className={`filter-pill ${activeFilter === cat ? 'active' : ''}`}>{cat}</button>))}</div>
        <div className="table-wrapper">
          <table className="villagkart-table">
            <thead><tr><th>PRODUCT & TYPE</th><th>USAGE STATS</th><th>STOCK DIST</th><th>STATUS</th><th style={{ textAlign: 'right' }}>ACTIONS</th></tr></thead>
            <tbody>
              {filteredProducts.map(p => (
                <tr key={p.id}>
                  <td><div className="product-cell"><img src={p.img} alt={p.name} /><div className="product-meta"><span className="p-name">{p.name}</span><div className="p-tags"><span className="p-cat">{p.category}</span></div></div></div></td>
                  <td><div className="price-cell"><span className="p-price">₹{p.price}</span><span className="usage-tag">HIGH PRIORITY</span></div></td>
                  <td><div className="stock-distribution"><div className="s-item"><span>{p.store}</span><small>STORE</small></div><div className="s-item"><span>{p.total}</span><small>TOTAL</small></div></div></td>
                  <td><div className={`status-toggle ${p.status ? 'active' : ''}`}><div className="knob" /></div></td>
                  <td><div className="action-cell"><Edit size={16} /><Trash2 size={16} /></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  if (loading) return <div className="loader-container"><Loader2 className="animate-spin" size={48} color="#10B981" /></div>;

  return (
    <div className="inventory-master-page">
      {!isAddingProduct && !isReportingDamage && (
        <div className="top-stats-container">
          {[
            { label: 'All Items', value: stats.total, color: '#10B981', icon: <Package />, bg: '#ECFDF5' },
            { label: 'Stock Alerts', value: stats.lowStock, color: '#F59E0B', icon: <AlertTriangle />, bg: '#FFFBEB' },
            { label: 'Damaged Assets', value: stats.damaged, color: '#EF4444', icon: <AlertCircle />, bg: '#FEF2F2' },
            { label: 'Asset Value', value: `₹${stats.totalValue}`, color: '#6366F1', icon: <ArrowUpRight />, bg: '#EEF2FF' }
          ].map((s, i) => (
            <motion.div whileHover={{ y: -3 }} key={i} className="stat-card">
              <div className="stat-icon" style={{ background: s.bg, color: s.color }}>{s.icon}</div>
              <div className="stat-content"><p className="stat-label">{s.label}</p><h2 className="stat-value">{s.value}</h2></div>
            </motion.div>
          ))}
        </div>
      )}

      <div className="portal-tabs">
        {PORTALS.map(portal => (
          <button key={portal.id} onClick={() => { setActivePortal(portal.id); setIsReportingDamage(false); setIsAddingProduct(false); }} className={`portal-tab ${activePortal === portal.id ? 'active' : ''}`}>
            {portal.icon} {portal.name}
          </button>
        ))}
      </div>

      <div className="master-card">
        {activePortal === 'master' ? renderMasterView() : 
         activePortal === 'damaged' ? renderDamageView() : 
         <div className="placeholder-view">View under development...</div>}
      </div>
    </div>
  );
};

export default InventoryMaster;
