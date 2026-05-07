import React, { useState, useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Package, AlertTriangle, Filter, Plus, Info, CheckCircle, Box, Zap, 
  ShoppingCart, DollarSign, TrendingUp, TrendingDown, ArrowRight, X, 
  ShieldCheck, ArrowDownToLine, Wrench, Settings, Activity, ClipboardList,
  UploadCloud, PlayCircle, Layers, ChevronRight, ChevronDown, Search, Grid,
  Users, FileText, Truck, BarChart3, Clock, Wallet, Trash2, Calendar, Target,
  Move, Shield, QrCode, ClipboardCheck, History, MoreVertical, MapPin, Receipt,
  RefreshCcw, Landmark, Eye, Edit, Share2, AlertCircle, Settings2, Coffee, Utensils,
  Armchair, Bed, Monitor, Brush, Download, FilePlus, ScanLine, LifeBuoy, AlertOctagon,
  Hammer, Navigation, FileCheck, Mail, Tag, ExternalLink, Printer, FileText as FileIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { api } from '../mockData';

// --- SHARED COMPONENTS ---
const Modal = ({ isOpen, onClose, title, children, maxWidth = '700px' }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3000, backdropFilter: 'blur(10px)', padding: '1rem' }}
        onClick={onClose}>
        <motion.div initial={{ y: 50, opacity: 0, scale: 0.95 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 50, opacity: 0, scale: 0.95 }}
          className="card" onClick={e => e.stopPropagation()}
          style={{ width: '100%', maxWidth, padding: '0', maxHeight: '96vh', overflowY: 'auto', background: '#FFFFFF', borderRadius: '24px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '1.5rem 2rem', background: '#FFFFFF', borderBottom: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 10 }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '900', color: '#0F172A', letterSpacing: '-0.02em', margin: 0 }}>{title}</h2>
            <button onClick={onClose} style={{ background: '#F1F5F9', border: 'none', color: '#64748B', cursor: 'pointer', padding: '0.6rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <X size={20} />
            </button>
          </div>
          <div style={{ padding: '2rem' }}>{children}</div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

const Badge = ({ children, color = 'blue' }) => {
  const colors = {
    blue: { bg: '#EFF6FF', text: '#3B82F6' },
    green: { bg: '#ECFDF5', text: '#10B981' },
    red: { bg: '#FFF1F2', text: '#E11D48' },
    amber: { bg: '#FFFBEB', text: '#D97706' },
    slate: { bg: '#F8FAFC', text: '#64748B' },
    purple: { bg: '#F5F3FF', text: '#8B5CF6' },
    cyan: { bg: '#ECFEFF', text: '#0891B2' },
    indigo: { bg: '#EEF2FF', text: '#4F46E5' }
  };
  return (
    <span style={{ padding: '0.4rem 0.8rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: '800', background: colors[color]?.bg || colors.slate.bg, color: colors[color]?.text || colors.slate.text, textTransform: 'uppercase', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', whiteSpace: 'nowrap' }}>
      {children}
    </span>
  );
};

// --- MASTER CONSTANTS ---
const CATEGORIES = [
  { id: 'CAT-FOOD', name: 'Food & Supplies', icon: <Utensils size={18}/> },
  { id: 'CAT-FURN', name: 'Furniture', icon: <Armchair size={18}/> },
  { id: 'CAT-CLEAN', name: 'Cleaning', icon: <Brush size={18}/> },
  { id: 'CAT-ELEC', name: 'Electronics', icon: <Monitor size={18}/> }
];

const SUBCATEGORIES = [
  { id: 'SUB-GRAIN', categoryId: 'CAT-FOOD', name: 'Rice & Grains' },
  { id: 'SUB-PULSE', categoryId: 'CAT-FOOD', name: 'Pulses' },
  { id: 'SUB-VEG', categoryId: 'CAT-FOOD', name: 'Vegetables' },
  { id: 'SUB-FRUIT', categoryId: 'CAT-FOOD', name: 'Fruits' },
  { id: 'SUB-OIL', categoryId: 'CAT-FOOD', name: 'Oils & Fats' },
  { id: 'SUB-DAIRY', categoryId: 'CAT-FOOD', name: 'Dairy' },
  { id: 'SUB-SPICE', categoryId: 'CAT-FOOD', name: 'Spices' },
  { id: 'SUB-BREAK', categoryId: 'CAT-FOOD', name: 'Breakfast Items' },
  { id: 'SUB-BEV', categoryId: 'CAT-FOOD', name: 'Beverages' },
  { id: 'SUB-PACK', categoryId: 'CAT-FOOD', name: 'Packaged Food' },
  { id: 'SUB-KIT', categoryId: 'CAT-FOOD', name: 'Kitchen Supplies' },
  { id: 'SUB-BED', categoryId: 'CAT-FURN', name: 'Beds' },
  { id: 'SUB-CHAIR', categoryId: 'CAT-FURN', name: 'Chairs' },
  { id: 'SUB-TABLE', categoryId: 'CAT-FURN', name: 'Tables' },
  { id: 'SUB-AC', categoryId: 'CAT-ELEC', name: 'ACs' },
  { id: 'SUB-FAN', categoryId: 'CAT-ELEC', name: 'Fans' },
  { id: 'SUB-LIQ', categoryId: 'CAT-CLEAN', name: 'Liquids' },
  { id: 'SUB-TL', categoryId: 'CAT-CLEAN', name: 'Tools' }
];

// Extended Datasets removed (Mock data deleted)

const InventoryModule = () => {
  const { buildingId: urlBuildingId } = useParams();
  const activeBuildingId = urlBuildingId || localStorage.getItem('selectedBuildingId');
  
  const [activeTab, setActiveTab] = useState('inventory');
  const [procSubTab, setProcSubTab] = useState('dashboard');
  const [assetSubTab, setAssetSubTab] = useState('overview');
  const [notifications, setNotifications] = useState([]);
  
  // Data States
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]);
  const [pos, setPos] = useState([]);
  const [assets, setAssets] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [budgets, setBudgets] = useState([]);

  // UI States
  const [selectedCategory, setSelectedCategory] = useState('CAT-FOOD');
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [expandedCategories, setExpandedCategories] = useState({ 'CAT-FOOD': true });
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isAssetModalOpen, setIsAssetModalOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [stockFilter, setStockFilter] = useState('All Levels');
  const [modalCategoryId, setModalCategoryId] = useState('');
  const [selectedPo, setSelectedPo] = useState(null);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [isVendorModalOpen, setIsVendorModalOpen] = useState(false);
  const [isPoModalOpen, setIsPoModalOpen] = useState(false);
  const [isMaintenanceModalOpen, setIsMaintenanceModalOpen] = useState(false);

  useEffect(() => {
    fetchInventory();
  }, [activeBuildingId]);

  const fetchInventory = async () => {
    if (!activeBuildingId) return;
    setLoading(true);
    try {
      // Fetch all data types in parallel
      const [invData, venData, reqData, poData, astData, budData] = await Promise.all([
        api.getInventory(activeBuildingId, 'inventory'),
        api.getInventory(activeBuildingId, 'vendor'),
        api.getInventory(activeBuildingId, 'request'),
        api.getInventory(activeBuildingId, 'po'),
        api.getInventory(activeBuildingId, 'asset'),
        api.getInventory(activeBuildingId, 'budget')
      ]);

      setInventory(invData);
      setVendors(venData);
      setRequests(reqData);
      setPos(poData);
      setAssets(astData);
      setBudgets(budData);
    } catch (err) {
      console.error('Error fetching inventory data:', err);
      // Ensure UI is empty if error
      setInventory([]);
      setVendors([]);
      setRequests([]);
      setPos([]);
      setAssets([]);
      setBudgets([]);
    } finally {
      setLoading(false);
    }
  };

  const triggerNotification = (msg, color = 'blue') => {
    setNotifications(prev => [{ msg, color, id: Date.now() }, ...prev]);
    setTimeout(() => setNotifications(prev => prev.slice(0, -1)), 5000);
  };

  // --- ANALYTICS ---
  const procStats = useMemo(() => ({
    totalSpend: pos.reduce((s, p) => s + p.totalAmount, 0),
    pendingApprovals: requests.filter(r => r.status === 'Pending').length,
    activePOs: pos.filter(p => p.deliveryStatus === 'Pending').length,
    delayed: pos.filter(p => p.deliveryStatus === 'Pending' && new Date(p.expectedDelivery) < new Date()).length
  }), [pos, requests]);

  const assetStats = useMemo(() => ({
    total: assets.length,
    active: assets.filter(a => ['Active', 'In Use'].includes(a.lifecycleStage)).length,
    maintenance: assets.filter(a => a.lifecycleStage === 'Maintenance').length,
    damaged: assets.filter(a => a.conditionStatus === 'Damaged').length,
    valuation: assets.reduce((s, a) => s + (a.currentValue || 0), 0)
  }), [assets]);

  const inventoryStats = useMemo(() => ({
    total: inventory.length,
    lowStock: inventory.filter(i => i.stock <= i.minThreshold).length,
    critical: inventory.filter(i => i.stock <= (i.minThreshold * 0.5)).length,
    categories: [...new Set(inventory.map(i => i.categoryId))].length
  }), [inventory]);

  const spendByMonth = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const data = months.map(m => ({ n: m, v: 0 }));
    pos.forEach(p => {
      const mIdx = new Date(p.createdAt).getMonth();
      data[mIdx].v += p.totalAmount || 0;
    });
    // Return last 5 months
    const currentMonth = new Date().getMonth();
    return data.slice(Math.max(0, currentMonth - 4), currentMonth + 1);
  }, [pos]);

  const renderEmptyState = (title, message, icon, actionLabel, onAction) => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '5rem 2rem', textAlign: 'center', animation: 'fadeIn 0.5s ease' }}>
      <div style={{ width: '100px', height: '100px', background: '#F8FAFC', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94A3B8', marginBottom: '1.5rem' }}>
        {icon}
      </div>
      <h3 style={{ fontSize: '1.5rem', fontWeight: '900', color: '#0F172A', marginBottom: '0.5rem' }}>{title}</h3>
      <p style={{ color: '#64748B', maxWidth: '400px', marginBottom: '2rem', fontWeight: '600' }}>{message}</p>
      {onAction && (
        <button onClick={onAction} style={{ background: '#3B82F6', color: 'white', border: 'none', padding: '1rem 2rem', borderRadius: '16px', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer' }}>
          <Plus size={20}/> {actionLabel}
        </button>
      )}
    </div>
  );

  // --- RENDERS ---

  const renderSidebar = () => (
    <div style={{ width: '300px', background: '#FFFFFF', borderRight: '1px solid #E2E8F0', padding: '1.5rem', height: '100%', overflowY: 'auto' }}>
      <h3 style={{ fontSize: '0.8rem', fontWeight: '900', color: '#64748B', textTransform: 'uppercase', marginBottom: '1.5rem' }}>Inventory Explorer</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        <button onClick={() => { setSelectedCategory(null); setSelectedSubCategory(null); }} style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '1rem', borderRadius: '16px', border: 'none', cursor: 'pointer', background: !selectedCategory ? '#3B82F6' : 'transparent', color: !selectedCategory ? '#FFFFFF' : '#475569', fontWeight: '800', transition: '0.2s', width: '100%', textAlign: 'left' }}>
          <Grid size={20} /> All Categories
        </button>
        {CATEGORIES.map(cat => (
          <div key={cat.id}>
            <button onClick={() => { setExpandedCategories(p => ({ ...p, [cat.id]: !p[cat.id] })); setSelectedCategory(cat.id); setSelectedSubCategory(null); }} style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '1rem', borderRadius: '16px', border: 'none', cursor: 'pointer', background: selectedCategory === cat.id ? '#F8FAFC' : 'transparent', color: selectedCategory === cat.id ? '#0F172A' : '#475569', fontWeight: '700', width: '100%', textAlign: 'left' }}>
              {expandedCategories[cat.id] ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>{cat.icon} {cat.name}</span>
            </button>
            <AnimatePresence>
              {expandedCategories[cat.id] && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden', paddingLeft: '2.8rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', marginTop: '0.4rem' }}>
                  {SUBCATEGORIES.filter(s => s.categoryId === cat.id).map(sub => (
                    <button key={sub.id} onClick={(e) => { e.stopPropagation(); setSelectedSubCategory(sub.id); }} style={{ fontSize: '0.9rem', padding: '0.6rem 0', background: 'transparent', border: 'none', cursor: 'pointer', color: selectedSubCategory === sub.id ? '#3B82F6' : '#64748B', fontWeight: selectedSubCategory === sub.id ? '900' : '600', textAlign: 'left' }}>
                      {sub.name}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );

  const renderInventoryTab = () => (
    <div style={{ display: 'flex', height: '100%' }}>
      {renderSidebar()}
      <div style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
          {[
            { l: 'TOTAL MATERIALS', v: inventoryStats.total, c: '#3B82F6', i: <Layers size={20}/> },
            { l: 'LOW STOCK ITEMS', v: inventoryStats.lowStock, c: '#F59E0B', i: <AlertTriangle size={20}/> },
            { l: 'CRITICAL SHORTAGE', v: inventoryStats.critical, c: '#E11D48', i: <AlertOctagon size={20}/> },
            { l: 'UNIQUE CATEGORIES', v: inventoryStats.categories, c: '#8B5CF6', i: <Grid size={20}/> }
          ].map((s, idx) => (
            <div key={idx} className="card" style={{ padding: '1.2rem 1.5rem', borderLeft: `4px solid ${s.c}` }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94A3B8', marginBottom: '0.4rem' }}><span style={{ fontSize: '0.7rem', fontWeight: '900' }}>{s.l}</span>{s.i}</div>
               <h2 style={{ fontSize: '1.6rem', fontWeight: '900', margin: 0 }}>{s.v}</h2>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '2.5rem' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '300px' }}><Search size={20} style={{ position: 'absolute', left: '1.2rem', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} /><input type="text" placeholder="Search Materials..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ padding: '1rem 1rem 1rem 3.5rem', borderRadius: '16px', border: '1px solid #E2E8F0', width: '100%', outline: 'none', background: '#FFFFFF', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }} /></div>
          <select value={stockFilter} onChange={e => setStockFilter(e.target.value)} style={{ padding: '1rem', borderRadius: '16px', border: '1px solid #E2E8F0', fontWeight: '800', outline: 'none', background: '#FFFFFF' }}>
            <option value="All Levels">All Levels</option>
            <option value="Critical Only">Critical Only</option>
            <option value="Low Stock">Low Stock</option>
          </select>
          <button onClick={() => { setSelectedItem(null); setModalCategoryId(selectedCategory || ''); setIsModalOpen(true); }} style={{ background: '#3B82F6', color: 'white', border: 'none', padding: '1rem 1.5rem', borderRadius: '16px', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer' }}>
            <Plus size={20}/> Add Item
          </button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
          {inventory
            .filter(i => {
              const matchesSearch = i.name.toLowerCase().includes(searchQuery.toLowerCase());
              const matchesCategory = selectedCategory ? i.categoryId === selectedCategory : true;
              const matchesSubCategory = selectedSubCategory ? i.subCategoryId === selectedSubCategory : true;
              
              let matchesStock = true;
              if (stockFilter === 'Critical Only') matchesStock = i.stock <= (i.minThreshold * 0.5);
              else if (stockFilter === 'Low Stock') matchesStock = i.stock <= i.minThreshold;
              
              return matchesSearch && matchesCategory && matchesSubCategory && matchesStock;
            })
            .map(item => (
            <motion.div layout key={item.id} className="card" style={{ padding: '1.8rem', borderTop: `6px solid ${item.stock < item.minThreshold ? '#E11D48' : '#10B981'}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.2rem' }}><Badge color="slate">{SUBCATEGORIES.find(s=>s.id===item.subCategoryId)?.name || item.subCategory || 'Other'}</Badge><Badge color={item.stock < item.minThreshold ? 'red' : 'green'}>{item.stock < item.minThreshold ? 'Low Stock' : 'Stable'}</Badge></div>
              <h3 style={{ margin: '0 0 0.4rem 0', fontWeight: '900', fontSize: '1.2rem' }}>{item.name}</h3>
              <p style={{ margin: '0 0 1.5rem 0', fontSize: '0.9rem', color: '#64748B', fontWeight: '700' }}><MapPin size={14} style={{ marginRight: '0.3rem' }}/> {item.location}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                  <p style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: '800', margin: 0 }}>AVAILABLE STOCK</p>
                  <span style={{ fontSize: '2rem', fontWeight: '900', color: '#0F172A' }}>{item.stock}</span>
                  <span style={{ fontSize: '1rem', color: '#64748B', marginLeft: '0.4rem', fontWeight: '800' }}>{item.unit}</span>
                </div>
                <div style={{ display: 'flex', gap: '0.6rem' }}>
                  <button onClick={() => { setSelectedItem(item); setModalCategoryId(item.categoryId || ''); setIsModalOpen(true); }} style={{ padding: '0.6rem', background: '#F1F5F9', border: 'none', borderRadius: '10px', color: '#3B82F6', cursor: 'pointer' }}>
                    <Edit size={18}/>
                  </button>
                  <button onClick={async () => {
                    if (window.confirm(`Are you sure you want to delete ${item.name}?`)) {
                      try {
                        await api.deleteInventoryItem(item.id);
                        triggerNotification(`${item.name} deleted successfully`, 'amber');
                        fetchInventory(); // Refresh data
                      } catch (err) {
                        console.error(err);
                        triggerNotification('Error deleting item', 'red');
                      }
                    }
                  }} style={{ padding: '0.6rem', background: '#FFF1F2', border: 'none', borderRadius: '10px', color: '#E11D48', cursor: 'pointer' }}>
                    <Trash2 size={18}/>
                  </button>
                  <button style={{ padding: '0.6rem', background: '#F1F5F9', border: 'none', borderRadius: '10px', color: '#64748B', cursor: 'pointer' }}>
                    <History size={18}/>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderProcurementTab = () => (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '0 2.5rem', background: '#FFFFFF', borderBottom: '1px solid #E2E8F0', display: 'flex', gap: '3rem', flexWrap: 'wrap' }}>
        {[
          { id: 'dashboard', label: 'Dashboard', icon: <BarChart3 size={20}/> },
          { id: 'requests', label: 'Purchase Requests', icon: <ClipboardList size={20}/> },
          { id: 'orders', label: 'Active POs', icon: <Truck size={20}/> },
          { id: 'vendors', label: 'Vendor Directory', icon: <Users size={20}/> }
        ].map(sub => (
          <button key={sub.id} onClick={() => setProcSubTab(sub.id)} style={{ padding: '1.2rem 0', background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.8rem', fontSize: '1rem', fontWeight: '900', color: procSubTab === sub.id ? '#3B82F6' : '#64748B', borderBottom: procSubTab === sub.id ? '4px solid #3B82F6' : '4px solid transparent', marginBottom: '-1px' }}>{sub.icon} {sub.label}</button>
        ))}
      </div>
      <div style={{ flex: 1, padding: '2.5rem', overflowY: 'auto' }}>
        {procSubTab === 'dashboard' && (
          <div style={{ animation: 'fadeIn 0.3s ease' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
              {[
                { l: 'MONTHLY SPEND', v: `₹${(procStats.totalSpend || 0).toLocaleString()}`, c: '#3B82F6', i: <DollarSign size={20}/> },
                { l: 'PENDING APPROVALS', v: procStats.pendingApprovals || 0, c: '#F59E0B', i: <Clock size={20}/> },
                { l: 'ACTIVE ORDERS', v: procStats.activePOs || 0, c: '#8B5CF6', i: <Package size={20}/> },
                { l: 'DELAYED DELIVERIES', v: procStats.delayed || 0, c: '#E11D48', i: <AlertTriangle size={20}/> }
              ].map((s, idx) => (
                <div key={idx} className="card" style={{ padding: '1.5rem', borderLeft: `5px solid ${s.c}` }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94A3B8', marginBottom: '0.6rem' }}><span style={{ fontSize: '0.75rem', fontWeight: '900' }}>{s.l}</span>{s.i}</div>
                   <h2 style={{ fontSize: '2rem', fontWeight: '900', margin: 0 }}>{s.v}</h2>
                </div>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '1.5rem' }}>
               <div className="card" style={{ padding: '2rem' }}><h3 style={{ fontSize: '1.2rem', fontWeight: '900', marginBottom: '2rem' }}>Spend Trend (Last 5 Months)</h3><div style={{ height: '300px' }}><ResponsiveContainer width="100%" height="100%"><AreaChart data={spendByMonth}><CartesianGrid strokeDasharray="3 3" vertical={false}/><XAxis dataKey="n"/><YAxis/><RechartsTooltip/><Area type="monotone" dataKey="v" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.1}/></AreaChart></ResponsiveContainer></div></div>
               <div className="card" style={{ padding: '2rem' }}><h3 style={{ fontSize: '1.2rem', fontWeight: '900', marginBottom: '2rem' }}>Budget Control</h3><div style={{ display: 'flex', flexDirection: 'column', gap: '1.8rem' }}>{budgets.map(b => (<div key={b.categoryId}><div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem' }}><span style={{ fontWeight: '800', color: '#0F172A' }}>{CATEGORIES.find(c=>c.id===b.categoryId)?.name}</span><span style={{ fontWeight: '900', fontSize: '0.9rem' }}>₹{(b.used || 0).toLocaleString()} / ₹{(b.allocated || 0).toLocaleString()}</span></div><div style={{ height: '10px', background: '#F1F5F9', borderRadius: '10px', overflow: 'hidden' }}><div style={{ height: '100%', background: (b.used/b.allocated) > 0.8 ? '#E11D48' : '#3B82F6', width: `${(b.used/b.allocated)*100}%` }} /></div></div>))}</div></div>
            </div>
          </div>
        )}
        {procSubTab === 'requests' && (
          <div style={{ animation: 'fadeIn 0.2s ease' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '2rem' }}>
              <button onClick={() => setIsRequestModalOpen(true)} style={{ background: '#3B82F6', color: 'white', border: 'none', padding: '1rem 1.5rem', borderRadius: '16px', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '0.6rem' }}><Plus size={20}/> New Request</button>
            </div>
            <div className="card" style={{ overflowX: 'auto' }}>
               <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
                  <thead style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}><tr style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: '900', textTransform: 'uppercase' }}><th style={{ padding: '1.5rem' }}>Request ID</th><th style={{ padding: '1.5rem' }}>Requested By</th><th style={{ padding: '1.5rem' }}>Item & Sub-Cat</th><th style={{ padding: '1.5rem' }}>Qty/Unit</th><th style={{ padding: '1.5rem' }}>Priority</th><th style={{ padding: '1.5rem' }}>Status</th></tr></thead>
                  <tbody>{requests.map(r => (<tr key={r.id} style={{ borderBottom: '1px solid #F1F5F9' }}><td style={{ padding: '1.5rem', fontWeight: '900' }}>{r.requestId || 'N/A'}</td><td style={{ padding: '1.5rem', fontWeight: '700' }}>{r.requestedBy}</td><td style={{ padding: '1.5rem' }}><p style={{ fontWeight: '800', margin: 0 }}>{r.itemName || r.name}</p><p style={{ fontSize: '0.75rem', color: '#94A3B8', margin: 0 }}>{r.subCategory}</p></td><td style={{ padding: '1.5rem', fontWeight: '900' }}>{r.quantity} {r.unit}</td><td style={{ padding: '1.5rem' }}><Badge color={r.priority === 'High' ? 'red' : 'blue'}>{r.priority}</Badge></td><td style={{ padding: '1.5rem' }}><div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}><Badge color={r.status === 'Approved' ? 'green' : 'amber'}>{r.status}</Badge><button onClick={() => { setProcSubTab('orders'); triggerNotification(`Viewing orders for ${r.name}`, 'indigo'); }} style={{ background: '#F8FAFC', border: 'none', borderRadius: '8px', padding: '0.4rem', cursor: 'pointer', color: '#64748B' }} title="View Linked Orders"><ExternalLink size={16}/></button></div></td></tr>))}</tbody>
               </table>
            </div>
          </div>
        )}
        {procSubTab === 'orders' && (
          <div style={{ animation: 'fadeIn 0.2s ease' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '2rem' }}>
              <button onClick={() => setIsPoModalOpen(true)} style={{ background: '#3B82F6', color: 'white', border: 'none', padding: '1rem 1.5rem', borderRadius: '16px', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '0.6rem' }}><Plus size={20}/> New PO</button>
            </div>
            {pos.length === 0 ? renderEmptyState('No Purchase Orders', 'Track your shipments and procurement history here.', <Truck size={48}/>, 'Create First PO', () => setIsPoModalOpen(true)) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(450px, 1fr))', gap: '2rem' }}>
                {pos.map(po => (
                  <div key={po.id} className="card" style={{ padding: '2rem', borderTop: `6px solid ${po.deliveryStatus === 'Completed' ? '#10B981' : '#3B82F6'}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                      <Badge color="slate">{po.poNumber}</Badge>
                      <Badge color={po.deliveryStatus === 'Completed' ? 'green' : 'blue'}>{po.deliveryStatus}</Badge>
                    </div>
                    <h3 style={{ margin: '0 0 1rem 0', fontWeight: '900', fontSize: '1.3rem' }}>{po.vendorName}</h3>
                    <div style={{ background: '#F8FAFC', padding: '1.2rem', borderRadius: '16px', marginBottom: '1.5rem' }}>
                      {po.items.map((it, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', fontWeight: '700' }}>
                          <span>{it.name} x {it.quantity}</span>
                          <span>₹{((it.quantity || 0) * (it.unitPrice || 0)).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <p style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: '800', margin: 0 }}>TOTAL PAYABLE</p>
                        <h2 style={{ margin: 0, color: '#0F172A' }}>₹{(po.totalAmount || 0).toLocaleString()}</h2>
                      </div>
                      <button onClick={() => setSelectedPo(po)} style={{ background: '#3B82F6', color: 'white', border: 'none', padding: '0.8rem 1.5rem', borderRadius: '12px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer' }}>
                        <Eye size={18}/> View PO
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {procSubTab === 'vendors' && (
          <div style={{ animation: 'fadeIn 0.2s ease' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '2rem' }}>
              <button onClick={() => setIsVendorModalOpen(true)} style={{ background: '#3B82F6', color: 'white', border: 'none', padding: '1rem 1.5rem', borderRadius: '16px', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '0.6rem' }}><Plus size={20}/> Add Vendor</button>
            </div>
            {vendors.length === 0 ? renderEmptyState('No Vendors Found', 'Build your supplier directory to streamline procurement.', <Users size={48}/>, 'Add New Vendor', () => setIsVendorModalOpen(true)) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
                {vendors.map(v => (
                  <div key={v.id} className="card" onClick={() => setSelectedVendor(v)} style={{ padding: '1.8rem', cursor: 'pointer' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                      <div style={{ background: '#EFF6FF', color: '#3B82F6', padding: '0.8rem', borderRadius: '14px' }}><Users size={24}/></div>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ fontSize: '0.9rem', fontWeight: '900', margin: 0 }}>★ {v.rating || 0}</p>
                        <p style={{ fontSize: '0.75rem', color: '#10B981', fontWeight: '800', margin: 0 }}>{v.onTimeRate || 'N/A'} On-Time</p>
                      </div>
                    </div>
                    <h3 style={{ margin: '0 0 0.4rem 0', fontWeight: '900', fontSize: '1.2rem' }}>{v.name}</h3>
                    <p style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: '600', marginBottom: '1.5rem' }}>{(v.suppliedCategories || []).join(', ')}</p>
                    <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.85rem', color: '#475569', fontWeight: '600' }}><Mail size={14}/> {v.email}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.85rem', color: '#475569', fontWeight: '600' }}><Clock size={14}/> Reliable Partner</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  const renderAssetsTab = () => (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '0 2.5rem', background: '#FFFFFF', borderBottom: '1px solid #E2E8F0', display: 'flex', gap: '3rem', flexWrap: 'wrap' }}>
        {[
          { id: 'overview', label: 'Insights', icon: <Grid size={20}/> },
          { id: 'registry', label: 'Master Registry', icon: <Box size={20}/> },
          { id: 'maintenance', label: 'Maintenance Hub', icon: <Wrench size={20}/> },
          { id: 'financials', label: 'Depreciation', icon: <DollarSign size={20}/> }
        ].map(sub => (
          <button key={sub.id} onClick={() => setAssetSubTab(sub.id)} style={{ padding: '1.2rem 0', background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.8rem', fontSize: '1rem', fontWeight: '900', color: assetSubTab === sub.id ? '#3B82F6' : '#64748B', borderBottom: assetSubTab === sub.id ? '4px solid #3B82F6' : '4px solid transparent', marginBottom: '-1px' }}>{sub.icon} {sub.label}</button>
        ))}
      </div>
      <div style={{ flex: 1, padding: '2.5rem', overflowY: 'auto' }}>
        {assetSubTab === 'overview' && (
          <div style={{ animation: 'fadeIn 0.3s ease' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
              {[
                { l: 'TOTAL ASSETS', v: assetStats.total, c: '#3B82F6', i: <Layers size={20}/> },
                { l: 'IN SERVICE', v: assetStats.active, c: '#10B981', i: <Zap size={20}/> },
                { l: 'REPAIRING', v: assetStats.maintenance, c: '#F59E0B', i: <Hammer size={20}/> },
                { l: 'PORTFOLIO VALUE', v: `₹${(assetStats.valuation/1000).toFixed(1)}K`, c: '#8B5CF6', i: <Wallet size={20}/> }
              ].map((s, idx) => (
                <div key={idx} className="card" style={{ padding: '1.5rem', borderLeft: `5px solid ${s.c}` }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94A3B8', marginBottom: '0.6rem' }}><span style={{ fontSize: '0.75rem', fontWeight: '900' }}>{s.l}</span>{s.i}</div>
                   <h2 style={{ fontSize: '2rem', fontWeight: '900', margin: 0 }}>{s.v}</h2>
                </div>
              ))}
            </div>
            <div className="card" style={{ padding: '2rem' }}><h3 style={{ fontSize: '1.2rem', fontWeight: '900', marginBottom: '2rem' }}>Condition Health Score</h3><div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>{assets.map(a => (<div key={a.id} style={{ background: '#F8FAFC', padding: '1.5rem', borderRadius: '16px' }}><div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}><span style={{ fontWeight: '800' }}>{a.name}</span><Badge color={a.conditionScore > 7 ? 'green' : 'amber'}>{a.conditionScore}/10</Badge></div><div style={{ height: '6px', background: '#E2E8F0', borderRadius: '10px' }}><div style={{ height: '100%', background: a.conditionScore > 7 ? '#10B981' : '#F59E0B', width: `${a.conditionScore*10}%`, borderRadius: '10px' }} /></div></div>))}</div></div>
          </div>
        )}
        {assetSubTab === 'registry' && (
          <div style={{ animation: 'fadeIn 0.2s ease' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '2rem' }}>
              <button onClick={() => { setSelectedAsset(null); setIsAssetModalOpen(true); }} style={{ background: '#3B82F6', color: 'white', border: 'none', padding: '1rem 1.5rem', borderRadius: '16px', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '0.6rem' }}><Plus size={20}/> Add Asset</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1.5rem' }}>
              {assets.map(asset => (
                <motion.div layout key={asset.id} className="card" onClick={() => { setSelectedAsset(asset); setIsAssetModalOpen(true); }} style={{ padding: '2rem', cursor: 'pointer' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}><div style={{ display: 'flex', gap: '0.5rem' }}><Badge color="slate">{asset.tag}</Badge><Badge color="indigo">{asset.lifecycleStage}</Badge></div><QrCode size={20} color="#94A3B8"/></div>
                  <h3 style={{ margin: '0 0 0.5rem 0', fontWeight: '900', fontSize: '1.3rem' }}>{asset.name}</h3>
                  <p style={{ margin: '0 0 1.5rem 0', fontSize: '0.95rem', color: '#64748B', fontWeight: '700' }}><MapPin size={16} style={{ marginRight: '0.4rem' }}/> {asset.buildingId} • Floor {asset.floorId} • Room {asset.roomId}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #F1F5F9', paddingTop: '1.2rem', alignItems: 'center' }}>
                  <div><p style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: '800', margin: 0 }}>CONDITION</p><p style={{ fontWeight: '900', margin: 0, color: '#10B981' }}>{asset.conditionStatus}</p></div>
                  <div style={{ display: 'flex', gap: '0.6rem' }}>
                    <button onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm(`Are you sure you want to delete ${asset.name}?`)) {
                        api.deleteInventoryItem(asset.id).then(() => {
                          triggerNotification(`${asset.name} deleted`, 'amber');
                          fetchInventory();
                        });
                      }
                    }} style={{ padding: '0.5rem', background: '#FFF1F2', border: 'none', borderRadius: '10px', color: '#E11D48', cursor: 'pointer' }}>
                      <Trash2 size={16}/>
                    </button>
                    <div style={{ textAlign: 'right' }}><p style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: '800', margin: 0 }}>WARRANTY</p><p style={{ fontWeight: '900', margin: 0 }}>{asset.warrantyExpiry}</p></div>
                  </div>
                </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {assetSubTab === 'maintenance' && (
          <div style={{ animation: 'fadeIn 0.3s ease' }}>
            {assets.filter(a => a.maintenanceSchedule).length === 0 ? renderEmptyState('No Maintenance Scheduled', 'Stay ahead of repairs by scheduling regular maintenance for your assets.', <Wrench size={48}/>, 'Schedule Maintenance', () => setIsMaintenanceModalOpen(true)) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(420px, 1fr))', gap: '1.5rem' }}>
                {assets.filter(a => a.maintenanceSchedule).map(asset => (
                  <div key={asset.id} className="card" style={{ padding: '1.8rem', display: 'flex', gap: '1.5rem' }}>
                    <div style={{ width: '70px', height: '70px', background: '#F5F3FF', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8B5CF6' }}>
                      <Wrench size={32}/>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem', alignItems: 'flex-start' }}>
                        <h4 style={{ margin: 0, fontWeight: '900', fontSize: '1.1rem' }}>{asset.name}</h4>
                        <Badge color={new Date(asset.nextMaintenance) < new Date() ? 'red' : 'amber'}>Due: {asset.nextMaintenance}</Badge>
                      </div>
                      <p style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: '700', margin: '0 0 1.2rem 0' }}>Cycle: {asset.maintenanceSchedule} • Last: {asset.lastMaintenance}</p>
                      <div style={{ display: 'flex', gap: '0.8rem' }}>
                        <button onClick={() => { setSelectedAsset(asset); setIsMaintenanceModalOpen(true); }} style={{ padding: '0.6rem 1.2rem', background: '#3B82F6', color: 'white', border: 'none', borderRadius: '10px', fontWeight: '800', fontSize: '0.8rem', cursor: 'pointer' }}>Schedule Now</button>
                        <button onClick={() => { setSelectedAsset(asset); setIsAssetModalOpen(true); }} style={{ padding: '0.6rem 1.2rem', background: '#F1F5F9', border: 'none', borderRadius: '10px', fontWeight: '800', fontSize: '0.8rem', color: '#475569', cursor: 'pointer' }}>Full History</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {assetSubTab === 'financials' && (
          <div className="card" style={{ padding: '2rem', animation: 'fadeIn 0.3s ease' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '900', marginBottom: '2rem' }}>Asset Depreciation & Financials</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
                <thead>
                  <tr style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: '900', textTransform: 'uppercase', borderBottom: '1px solid #E2E8F0' }}>
                    <th style={{ padding: '1rem' }}>Asset Details</th>
                    <th style={{ padding: '1rem' }}>Purchase Cost</th>
                    <th style={{ padding: '1rem' }}>Depreciation</th>
                    <th style={{ padding: '1rem' }}>Current Value</th>
                    <th style={{ padding: '1rem' }}>Warranty Status</th>
                  </tr>
                </thead>
                <tbody>
                  {assets.map(a => (
                    <tr key={a.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                      <td style={{ padding: '1.2rem 1rem' }}>
                        <p style={{ fontWeight: '900', margin: 0 }}>{a.name}</p>
                        <p style={{ fontSize: '0.75rem', color: '#64748B', margin: 0 }}>{a.tag}</p>
                      </td>
                      <td style={{ padding: '1.2rem 1rem', fontWeight: '800' }}>₹{(a.purchaseCost || 0).toLocaleString()}</td>
                      <td style={{ padding: '1.2rem 1rem' }}>
                        <Badge color="cyan">{a.depreciationRate || '0%'} / Year</Badge>
                      </td>
                      <td style={{ padding: '1.2rem 1rem', fontWeight: '900', color: '#3B82F6' }}>₹{(a.currentValue || 0).toLocaleString()}</td>
                      <td style={{ padding: '1.2rem 1rem' }}>
                        {a.warrantyExpiry ? (
                          <Badge color={new Date(a.warrantyExpiry) < new Date() ? 'red' : 'green'}>{a.warrantyExpiry}</Badge>
                        ) : (
                          <span style={{ color: '#94A3B8', fontWeight: '600', fontSize: '0.85rem' }}>No Data</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: '#F8FAFC', fontSmooth: 'antialiased' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.2rem 2.5rem', background: '#FFFFFF', borderBottom: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <div><h1 style={{ fontSize: '1.8rem', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '0.8rem', color: '#0F172A' }}><Layers size={32} color="#3B82F6" /> Material Control Center</h1><p style={{ color: '#64748B', fontSize: '0.95rem', fontWeight: '600', margin: 0 }}>Integrated Procurement, Smart Inventory & Asset Intelligence.</p></div>
        <div style={{ display: 'flex', gap: '1rem' }}><button onClick={fetchInventory} style={{ padding: '0.8rem 1.2rem', background: '#F1F5F9', border: 'none', borderRadius: '12px', color: '#0F172A', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.6rem' }}><RefreshCcw size={18}/> Sync Data</button></div>
      </header>
      <div style={{ display: 'flex', gap: '1.5rem', background: '#FFFFFF', padding: '0 2.5rem', borderBottom: '1px solid #E2E8F0', overflowX: 'auto' }}>
        {[
          { id: 'inventory', label: 'Smart Inventory', icon: <Package size={22} /> },
          { id: 'procurement', label: 'Purchase Management', icon: <ShoppingCart size={22} /> },
          { id: 'assets', label: 'Assets Management', icon: <History size={22} /> }
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ padding: '1.4rem 1.5rem', background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.8rem', fontSize: '1.05rem', fontWeight: '900', color: activeTab === tab.id ? '#3B82F6' : '#64748B', borderBottom: activeTab === tab.id ? '4px solid #3B82F6' : '4px solid transparent', marginBottom: '-1px', transition: '0.2s' }}>{tab.icon} {tab.label}</button>
        ))}
      </div>
      <div style={{ flex: 1, overflowY: 'hidden' }}>
        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <RefreshCcw className="animate-spin" size={40} color="#3B82F6" />
          </div>
        ) : (
          <>
            {activeTab === 'inventory' && renderInventoryTab()}
            {activeTab === 'procurement' && renderProcurementTab()}
            {activeTab === 'assets' && renderAssetsTab()}
          </>
        )}
      </div>

      {/* Asset Detail Modal */}
      <Modal isOpen={isAssetModalOpen} onClose={() => setIsAssetModalOpen(false)} title={selectedAsset ? "Asset Life-Cycle Dossier" : "Register New Asset"} maxWidth="900px">
        {selectedAsset ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem' }}>
             <div>
                <div style={{ width: '100%', height: '240px', background: '#F1F5F9', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem' }}>
                   <Monitor size={100} color="#94A3B8" />
                </div>
                <div style={{ background: '#0F172A', color: 'white', padding: '2rem', borderRadius: '24px', textAlign: 'center' }}>
                   <p style={{ fontSize: '0.8rem', fontWeight: '900', color: '#94A3B8', marginBottom: '1rem' }}>SECURE ASSET TAG</p>
                   <QrCode size={140} style={{ margin: '0 auto' }} />
                   <p style={{ fontSize: '1rem', fontWeight: '900', marginTop: '1rem' }}>{selectedAsset.tag}</p>
                </div>
             </div>
             <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}><Badge color="indigo">{selectedAsset.lifecycleStage}</Badge><Badge color="blue">{selectedAsset.category}</Badge></div>
                <h2 style={{ fontSize: '2.2rem', fontWeight: '900', color: '#0F172A', marginBottom: '0.5rem' }}>{selectedAsset.name}</h2>
                <p style={{ color: '#64748B', fontWeight: '700', marginBottom: '2.5rem' }}>Internal Code: {selectedAsset.code}</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '3rem' }}>
                   <div><p style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: '800', margin: '0 0 0.4rem 0' }}>PURCHASE COST</p><p style={{ fontSize: '1.1rem', fontWeight: '900', margin: 0 }}>₹{(selectedAsset.purchaseCost || 0).toLocaleString()}</p></div>
                   <div><p style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: '800', margin: '0 0 0.4rem 0' }}>CURRENT VALUE</p><p style={{ fontSize: '1.1rem', fontWeight: '900', margin: 0, color: '#3B82F6' }}>₹{(selectedAsset.currentValue || 0).toLocaleString()}</p></div>
                   <div><p style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: '800', margin: '0 0 0.4rem 0' }}>LOCATION</p><p style={{ fontSize: '1.1rem', fontWeight: '900', margin: 0 }}>Room {selectedAsset.roomId}</p></div>
                   <div><p style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: '800', margin: '0 0 0.4rem 0' }}>CONDITION</p><p style={{ fontSize: '1.1rem', fontWeight: '900', margin: 0, color: '#10B981' }}>{selectedAsset.conditionScore}/10</p></div>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                   <button style={{ flex: 1, padding: '1.2rem', background: '#3B82F6', color: 'white', border: 'none', borderRadius: '16px', fontWeight: '900', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.8rem' }}><Move size={20}/> Asset Transfer</button>
                   <button style={{ flex: 1, padding: '1.2rem', background: '#F1F5F9', color: '#0F172A', border: 'none', borderRadius: '16px', fontWeight: '900', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.8rem' }}><Wrench size={20}/> Service Log</button>
                </div>
             </div>
          </div>
        ) : (
          <form onSubmit={async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData.entries());
            data.buildingId = activeBuildingId;
            data.dataType = 'asset';
            data.lifecycleStage = 'Active';
            data.conditionStatus = 'Excellent';
            data.conditionScore = 10;
            data.purchaseCost = Number(data.purchaseCost) || 0;
            data.currentValue = Number(data.purchaseCost) || 0;
            data.depreciationRate = '10%';
            
            try {
              await api.addInventoryItem(data);
              triggerNotification('Asset registered successfully', 'green');
              setIsAssetModalOpen(false);
              fetchInventory();
            } catch (err) {
              console.error(err);
              triggerNotification('Error registering asset', 'red');
            }
          }} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '800' }}>Asset Name</label>
              <input name="name" required style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', border: '1px solid #E2E8F0' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '800' }}>Asset Tag (Serial)</label>
              <input name="tag" required style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', border: '1px solid #E2E8F0' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '800' }}>Category</label>
              <select name="category" required style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                <option value="Electronics">Electronics</option>
                <option value="Furniture">Furniture</option>
                <option value="Appliances">Appliances</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '800' }}>Purchase Cost (₹)</label>
              <input name="purchaseCost" type="number" required style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', border: '1px solid #E2E8F0' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '800' }}>Purchase Date</label>
              <input name="purchaseDate" type="date" required style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', border: '1px solid #E2E8F0' }} />
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <button type="submit" style={{ width: '100%', padding: '1.2rem', background: '#3B82F6', color: 'white', border: 'none', borderRadius: '16px', fontWeight: '900' }}>Register Asset</button>
            </div>
          </form>
        )}
      </Modal>

      {/* Vendor Modal */}
      <Modal isOpen={isVendorModalOpen} onClose={() => setIsVendorModalOpen(false)} title="Register New Vendor" maxWidth="500px">
        <form onSubmit={async (e) => {
          e.preventDefault();
          const formData = new FormData(e.target);
          const data = Object.fromEntries(formData.entries());
          data.buildingId = activeBuildingId;
          data.dataType = 'vendor';
          data.suppliedCategories = [data.category];
          
          try {
            await api.addInventoryItem(data);
            triggerNotification('Vendor registered successfully', 'green');
            setIsVendorModalOpen(false);
            fetchInventory();
          } catch (err) {
            console.error(err);
            triggerNotification('Error registering vendor', 'red');
          }
        }} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '800' }}>Vendor Name</label>
            <input name="name" required style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', border: '1px solid #E2E8F0' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '800' }}>Contact Number</label>
              <input name="contact" required style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', border: '1px solid #E2E8F0' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '800' }}>Email Address</label>
              <input name="email" type="email" required style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', border: '1px solid #E2E8F0' }} />
            </div>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '800' }}>Primary Category</label>
            <select name="category" required style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
              <option value="Food & Supplies">Food & Supplies</option>
              <option value="Furniture">Furniture</option>
              <option value="Electronics">Electronics</option>
              <option value="Cleaning">Cleaning</option>
            </select>
          </div>
          <button type="submit" style={{ padding: '1rem', background: '#3B82F6', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '900', marginTop: '1rem' }}>
            Register Vendor
          </button>
        </form>
      </Modal>

      {/* Purchase Request Modal */}
      <Modal isOpen={isRequestModalOpen} onClose={() => setIsRequestModalOpen(false)} title="New Purchase Request" maxWidth="500px">
        <form onSubmit={async (e) => {
          e.preventDefault();
          const formData = new FormData(e.target);
          const data = Object.fromEntries(formData.entries());
          data.buildingId = activeBuildingId;
          data.dataType = 'request';
          data.status = 'Pending';
          data.requestId = `REQ-${Math.floor(1000 + Math.random() * 9000)}`;
          
          try {
            await api.addInventoryItem(data);
            triggerNotification('Purchase request submitted', 'green');
            setIsRequestModalOpen(false);
            fetchInventory();
          } catch (err) {
            console.error(err);
            triggerNotification('Error submitting request', 'red');
          }
        }} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '800' }}>Item Name</label>
            <input name="name" required style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', border: '1px solid #E2E8F0' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '800' }}>Quantity</label>
              <input name="quantity" type="number" required style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', border: '1px solid #E2E8F0' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '800' }}>Unit</label>
              <input name="unit" placeholder="Kg, Units" required style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', border: '1px solid #E2E8F0' }} />
            </div>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '800' }}>Priority</label>
            <select name="priority" required style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
              <option value="Normal">Normal</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '800' }}>Requested By</label>
            <input name="requestedBy" required style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', border: '1px solid #E2E8F0' }} />
          </div>
          <button type="submit" style={{ padding: '1rem', background: '#3B82F6', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '900', marginTop: '1rem' }}>
            Submit Request
          </button>
        </form>
      </Modal>
      
      {/* Inventory Item Modal */}
      <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setSelectedItem(null); setModalCategoryId(''); }} title={selectedItem ? "Update Material" : "Add New Material"} maxWidth="500px">
        <form onSubmit={async (e) => {
          e.preventDefault();
          const formData = new FormData(e.target);
          const data = Object.fromEntries(formData.entries());
          data.buildingId = activeBuildingId;
          data.dataType = 'inventory';
          
          try {
            // Find category and subcategory names for storage
            const cat = CATEGORIES.find(c => c.id === data.categoryId);
            const sub = SUBCATEGORIES.find(s => s.id === data.subCategoryId);
            data.category = cat ? cat.name : '';
            data.subCategory = sub ? sub.name : '';

            if (selectedItem?.id) {
              await api.updateInventoryItem(selectedItem.id, data);
              triggerNotification('Material updated successfully', 'green');
            } else {
              await api.addInventoryItem(data);
              triggerNotification('Material added successfully', 'green');
            }
            setIsModalOpen(false);
            setSelectedItem(null);
            setModalCategoryId('');
            fetchInventory();
          } catch (err) {
            console.error(err);
            triggerNotification('Error saving material', 'red');
          }
        }} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '800' }}>Material Name</label>
            <input name="name" defaultValue={selectedItem?.name} required style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', border: '1px solid #E2E8F0' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '800' }}>Category</label>
              <select 
                name="categoryId" 
                value={modalCategoryId} 
                onChange={(e) => setModalCategoryId(e.target.value)}
                required 
                style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', border: '1px solid #E2E8F0' }}
              >
                <option value="">Select Category</option>
                {CATEGORIES.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '800' }}>Sub-Category</label>
              <select name="subCategoryId" defaultValue={selectedItem?.subCategoryId || selectedSubCategory || ''} required style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                <option value="">Select Sub-Category</option>
                {SUBCATEGORIES.filter(s => !modalCategoryId || s.categoryId === modalCategoryId).map(sub => (
                  <option key={sub.id} value={sub.id}>{sub.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '800' }}>Stock</label>
              <input name="stock" type="number" defaultValue={selectedItem?.stock} required style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', border: '1px solid #E2E8F0' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '800' }}>Unit</label>
              <input name="unit" defaultValue={selectedItem?.unit} placeholder="Kg, Units, etc." required style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', border: '1px solid #E2E8F0' }} />
            </div>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '800' }}>Location</label>
            <input name="location" defaultValue={selectedItem?.location} required style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', border: '1px solid #E2E8F0' }} />
          </div>
          <button type="submit" style={{ padding: '1rem', background: '#3B82F6', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '900', marginTop: '1rem' }}>
            {selectedItem ? "Save Changes" : "Create Material"}
          </button>
        </form>
      </Modal>

      {/* PO Modal */}
      <Modal isOpen={isPoModalOpen} onClose={() => setIsPoModalOpen(false)} title="Create Purchase Order" maxWidth="500px">
        <form onSubmit={async (e) => {
          e.preventDefault();
          const formData = new FormData(e.target);
          const data = Object.fromEntries(formData.entries());
          data.buildingId = activeBuildingId;
          data.dataType = 'po';
          data.poNumber = `PO-${Date.now().toString().slice(-6)}`;
          data.name = data.poNumber; // Fix: Set required name field
          data.deliveryStatus = 'Pending';
          data.totalAmount = Number(data.amount) || 0;
          const qty = Number(data.quantity) || 1;
          data.items = [{ name: data.itemName, quantity: qty, unitPrice: (data.totalAmount / qty) }];
          
          try {
            await api.addInventoryItem(data);
            triggerNotification('PO created successfully', 'green');
            setIsPoModalOpen(false);
            fetchInventory();
          } catch (err) {
            console.error(err);
            triggerNotification('Error creating PO', 'red');
          }
        }} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '800' }}>Vendor Name</label>
            <input name="vendorName" required style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', border: '1px solid #E2E8F0' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '800' }}>Item Description</label>
            <input name="itemName" required style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', border: '1px solid #E2E8F0' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '800' }}>Quantity</label>
              <input name="quantity" type="number" required style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', border: '1px solid #E2E8F0' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '800' }}>Total Amount (₹)</label>
              <input name="amount" type="number" required style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', border: '1px solid #E2E8F0' }} />
            </div>
          </div>
          <button type="submit" style={{ padding: '1rem', background: '#3B82F6', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '900', marginTop: '1rem' }}>
            Generate PO
          </button>
        </form>
      </Modal>

      {/* Maintenance Modal */}
      <Modal isOpen={isMaintenanceModalOpen} onClose={() => setIsMaintenanceModalOpen(false)} title="Schedule Maintenance" maxWidth="500px">
        <form onSubmit={async (e) => {
          e.preventDefault();
          const formData = new FormData(e.target);
          const data = Object.fromEntries(formData.entries());
          
          // In a real app, we'd update the asset. For now, we'll create a maintenance record or update asset field.
          // Since we use a polymorphic collection, we can update the asset's maintenance fields.
          const assetId = data.assetId;
          const updateData = {
            maintenanceSchedule: data.cycle,
            lastMaintenance: new Date().toISOString().split('T')[0],
            nextMaintenance: data.nextDate,
          };

          try {
            await api.updateInventoryItem(assetId, updateData);
            triggerNotification('Maintenance scheduled', 'purple');
            setIsMaintenanceModalOpen(false);
            fetchInventory();
          } catch (err) {
            console.error(err);
            triggerNotification('Error scheduling maintenance', 'red');
          }
        }} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '800' }}>Select Asset</label>
            <select name="assetId" required style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
              {assets.map(a => <option key={a.id} value={a.id}>{a.name} ({a.tag})</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '800' }}>Maintenance Cycle</label>
            <select name="cycle" required style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
              <option value="Monthly">Monthly</option>
              <option value="Quarterly">Quarterly</option>
              <option value="Half-Yearly">Half-Yearly</option>
              <option value="Annual">Annual</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '800' }}>Next Maintenance Date</label>
            <input name="nextDate" type="date" required style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', border: '1px solid #E2E8F0' }} />
          </div>
          <button type="submit" style={{ padding: '1rem', background: '#3B82F6', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '900', marginTop: '1rem' }}>
            Set Schedule
          </button>
        </form>
      </Modal>

      {/* PO Detail Modal */}
      <Modal isOpen={!!selectedPo} onClose={() => setSelectedPo(null)} title="Purchase Order Details" maxWidth="700px">
        {selectedPo && (
          <div style={{ padding: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem', borderBottom: '1px solid #F1F5F9', paddingBottom: '1.5rem' }}>
              <div>
                <h2 style={{ fontSize: '2rem', fontWeight: '900', margin: '0 0 0.5rem 0' }}>{selectedPo.poNumber}</h2>
                <p style={{ color: '#64748B', fontWeight: '700', fontSize: '1rem' }}>Vendor: {selectedPo.vendorName}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <Badge color={selectedPo.deliveryStatus === 'Completed' ? 'green' : 'blue'}>{selectedPo.deliveryStatus}</Badge>
                <p style={{ marginTop: '0.8rem', fontWeight: '800', color: '#94A3B8' }}>Date: {new Date(selectedPo.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
            
            <div style={{ marginBottom: '2.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '900', marginBottom: '1.2rem', color: '#0F172A' }}>ORDERED ITEMS</h3>
              <div style={{ background: '#F8FAFC', borderRadius: '18px', padding: '1.5rem' }}>
                {selectedPo.items?.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 0', borderBottom: idx < selectedPo.items.length - 1 ? '1px solid #E2E8F0' : 'none' }}>
                    <div>
                      <p style={{ fontWeight: '800', margin: 0, fontSize: '1.1rem' }}>{item.name}</p>
                      <p style={{ fontSize: '0.85rem', color: '#64748B', margin: 0 }}>Qty: {item.quantity}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontWeight: '900', margin: 0, fontSize: '1.1rem' }}>₹{(item.unitPrice * item.quantity).toLocaleString()}</p>
                      <p style={{ fontSize: '0.85rem', color: '#94A3B8', margin: 0 }}>₹{item.unitPrice.toLocaleString()} / unit</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#0F172A', color: 'white', padding: '1.8rem 2.5rem', borderRadius: '24px' }}>
              <div>
                <p style={{ margin: 0, fontSize: '0.8rem', fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase' }}>Grand Total</p>
                <h2 style={{ margin: 0, fontSize: '2.2rem', fontWeight: '900' }}>₹{(selectedPo.totalAmount || 0).toLocaleString()}</h2>
              </div>
              <button style={{ background: '#3B82F6', color: 'white', border: 'none', padding: '1rem 1.8rem', borderRadius: '16px', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '0.8rem' }}><Printer size={20}/> Print PO</button>
            </div>
          </div>
        )}
      </Modal>

      {/* Vendor Detail Modal */}
      <Modal isOpen={!!selectedVendor} onClose={() => setSelectedVendor(null)} title="Vendor Profile & Performance" maxWidth="600px">
        {selectedVendor && (
          <div style={{ padding: '1rem' }}>
            <div style={{ display: 'flex', gap: '2rem', marginBottom: '2.5rem', alignItems: 'center' }}>
              <div style={{ width: '80px', height: '80px', background: '#F0F9FF', color: '#0EA5E9', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Users size={40}/>
              </div>
              <div>
                <h2 style={{ fontSize: '2.2rem', fontWeight: '900', margin: 0 }}>{selectedVendor.name}</h2>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                   <Badge color="green">Verified Partner</Badge>
                   <span style={{ color: '#94A3B8', fontWeight: '800' }}>★ {selectedVendor.rating || 4.5} Rating</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2.5rem' }}>
               <div style={{ background: '#F8FAFC', padding: '1.5rem', borderRadius: '20px' }}>
                  <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.75rem', fontWeight: '900', color: '#94A3B8' }}>PRIMARY CONTACT</p>
                  <p style={{ margin: 0, fontWeight: '800', fontSize: '1.1rem' }}>{selectedVendor.contact || 'N/A'}</p>
                  <p style={{ margin: '0.4rem 0 0 0', color: '#3B82F6', fontWeight: '700' }}>{selectedVendor.email}</p>
               </div>
               <div style={{ background: '#F8FAFC', padding: '1.5rem', borderRadius: '20px' }}>
                  <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.75rem', fontWeight: '900', color: '#94A3B8' }}>ON-TIME DELIVERY</p>
                  <p style={{ margin: 0, fontWeight: '900', fontSize: '1.5rem', color: '#10B981' }}>{selectedVendor.onTimeRate || '98%'}</p>
                  <p style={{ margin: '0.2rem 0 0 0', color: '#64748B', fontWeight: '700' }}>Industry Avg: 85%</p>
               </div>
            </div>

            <div style={{ marginBottom: '2.5rem' }}>
               <h3 style={{ fontSize: '1.1rem', fontWeight: '900', marginBottom: '1.2rem' }}>SUPPLIED CATEGORIES</h3>
               <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.8rem' }}>
                  {(selectedVendor.suppliedCategories || ['Food', 'Cleaning']).map((c, i) => (
                    <Badge key={i} color="slate">{c}</Badge>
                  ))}
               </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
               <button onClick={() => window.location.href = `mailto:${selectedVendor.email}?subject=Inquiry from Hostel Hub`} style={{ flex: 1, padding: '1.2rem', background: '#3B82F6', color: 'white', border: 'none', borderRadius: '16px', fontWeight: '900', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.8rem', cursor: 'pointer' }}><Mail size={20}/> Send Message</button>
               <button onClick={() => { setProcSubTab('orders'); setSelectedVendor(null); triggerNotification(`Showing history for ${selectedVendor.name}`, 'indigo'); }} style={{ flex: 1, padding: '1.2rem', background: '#F1F5F9', color: '#0F172A', border: 'none', borderRadius: '16px', fontWeight: '900', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.8rem', cursor: 'pointer' }}><History size={20}/> Order History</button>
            </div>
          </div>
        )}
      </Modal>

      <style>{`
        .card { background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 24px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.03); transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .card:hover { transform: translateY(-5px); box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04); }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        ::-webkit-scrollbar { height: 6px; width: 6px; }
        ::-webkit-scrollbar-track { background: #F1F5F9; }
        ::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: #94A3B8; }
      `}</style>
    </div>
  );
};

export default InventoryModule;
