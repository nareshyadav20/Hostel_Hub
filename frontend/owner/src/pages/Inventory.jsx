import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../mockData';
import { 
  Package, AlertTriangle, Filter, Plus, RefreshCw, Info, TrendingDown, X, 
  CheckCircle, Upload, Download, BedDouble, Coffee, MapPin, Box, Zap, 
  CreditCard, ShieldCheck, ShoppingCart, Grid, ChevronDown, ChevronRight, 
  Search, History, Edit, BarChart3, ClipboardList, Truck, Users, DollarSign, 
  Clock, Layers, Hammer, Wallet, QrCode, Wrench, Mail, Eye 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, 
  Legend, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, BarChart as RechartsBarChart
} from 'recharts';

// --- SHARED COMPONENTS ---
const Badge = ({ children, color = 'blue' }) => {
  const colors = {
    blue: { bg: '#EFF6FF', text: '#3B82F6' },
    red: { bg: '#FFF1F2', text: '#E11D48' },
    green: { bg: '#F0FDF4', text: '#10B981' },
    amber: { bg: '#FFFBEB', text: '#D97706' },
    slate: { bg: '#F8FAFC', text: '#64748B' },
    indigo: { bg: '#EEF2FF', text: '#4F46E5' },
    cyan: { bg: '#ECFEFF', text: '#0891B2' },
    purple: { bg: '#F5F3FF', text: '#8B5CF6' }
  };
  const c = colors[color] || colors.blue;
  return (
    <span style={{ 
      padding: '0.25rem 0.6rem', borderRadius: '6px', fontSize: '0.75rem', 
      fontWeight: '700', background: c.bg, color: c.text, display: 'inline-flex', 
      alignItems: 'center', gap: '0.3rem' 
    }}>
      {children}
    </span>
  );
};

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

// --- EXTENDED DATASETS ---
const CATEGORIES = [
  { id: 'CAT-FOOD', name: 'Food & Supplies', icon: <Coffee size={18}/> },
  { id: 'CAT-FURN', name: 'Furniture', icon: <BedDouble size={18}/> },
  { id: 'CAT-ELEC', name: 'Electronics', icon: <Zap size={18}/> },
  { id: 'CAT-CLEAN', name: 'Cleaning', icon: <ShieldCheck size={18}/> }
];

const SUBCATEGORIES = [
  { id: 'SUB-GRAIN', categoryId: 'CAT-FOOD', name: 'Rice & Grains' },
  { id: 'SUB-PULSE', categoryId: 'CAT-FOOD', name: 'Pulses' },
  { id: 'SUB-VEG', categoryId: 'CAT-FOOD', name: 'Vegetables' },
  { id: 'SUB-DAIRY', categoryId: 'CAT-FOOD', name: 'Dairy' },
  { id: 'SUB-KIT', categoryId: 'CAT-FOOD', name: 'Kitchen Assets' },
  { id: 'SUB-BED', categoryId: 'CAT-FURN', name: 'Beds & Bedding' },
  { id: 'SUB-AC', categoryId: 'CAT-ELEC', name: 'ACs & Cooling' },
  { id: 'SUB-LIQ', categoryId: 'CAT-CLEAN', name: 'Liquids & Chemicals' }
];

const INITIAL_INVENTORY = [
  { id: 'F-RG-001', name: 'Basmati Rice', categoryId: 'CAT-FOOD', subCategoryId: 'SUB-GRAIN', stock: 50, maxStock: 100, minThreshold: 20, unit: 'Kg', location: 'Dry Store A', type: 'Consumable' },
  { id: 'F-RG-002', name: 'Sona Masoori Rice', categoryId: 'CAT-FOOD', subCategoryId: 'SUB-GRAIN', stock: 100, maxStock: 150, minThreshold: 30, unit: 'Kg', location: 'Dry Store A', type: 'Consumable' },
  { id: 'F-RG-004', name: 'Wheat Flour (Atta)', categoryId: 'CAT-FOOD', subCategoryId: 'SUB-GRAIN', stock: 80, maxStock: 150, minThreshold: 40, unit: 'Kg', location: 'Dry Store B', type: 'Consumable' },
  { id: 'F-PL-001', name: 'Toor Dal', categoryId: 'CAT-FOOD', subCategoryId: 'SUB-PULSE', stock: 40, maxStock: 60, minThreshold: 15, unit: 'Kg', location: 'Pantry 1', type: 'Consumable' },
  { id: 'F-VG-001', name: 'Potato', categoryId: 'CAT-FOOD', subCategoryId: 'SUB-VEG', stock: 100, maxStock: 150, minThreshold: 40, unit: 'Kg', location: 'Cold Store', type: 'Consumable' },
  { id: 'F-DY-001', name: 'Milk', categoryId: 'CAT-FOOD', subCategoryId: 'SUB-DAIRY', stock: 100, maxStock: 150, minThreshold: 40, unit: 'L/Day', location: 'Dairy Cooler', type: 'Consumable' },
  { id: 'F-KS-001', name: 'Gas Cylinder', categoryId: 'CAT-FOOD', subCategoryId: 'SUB-KIT', stock: 10, maxStock: 15, minThreshold: 3, unit: 'Units', location: 'Gas Bank', type: 'Asset' },
  { id: 'INV-G001', name: 'Single Bed (Steel)', categoryId: 'CAT-FURN', subCategoryId: 'SUB-BED', stock: 45, maxStock: 50, minThreshold: 5, unit: 'Units', location: 'Block A', type: 'Asset' },
  { id: 'INV-E001', name: 'Split AC (1.5 Ton)', categoryId: 'CAT-ELEC', subCategoryId: 'SUB-AC', stock: 24, maxStock: 30, minThreshold: 2, unit: 'Units', location: 'Room 101', type: 'Asset' },
  { id: 'INV-C001', name: 'Floor Cleaner', categoryId: 'CAT-CLEAN', subCategoryId: 'SUB-LIQ', stock: 5, maxStock: 25, minThreshold: 10, unit: 'Liters', location: 'Janitor Room', type: 'Consumable' }
];

const INITIAL_VENDORS = [
  { id: 'V-001', name: 'Metro Wholesalers', contact: '+91 98765 43210', email: 'orders@metro.com', categories: ['Food & Supplies', 'Cleaning'], rating: 4.8, onTimeRate: '98%', suppliedCategories: ['Rice', 'Pulses', 'Liquids'] },
  { id: 'V-002', name: 'Sleepwell Systems', contact: '+91 99887 76655', email: 'sales@sleepwell.in', categories: ['Furniture'], rating: 4.5, onTimeRate: '92%', suppliedCategories: ['Beds', 'Tables'] },
  { id: 'V-003', name: 'Global Electronics', contact: '+91 91234 56789', email: 'support@globalelec.com', categories: ['Electronics'], rating: 4.2, onTimeRate: '85%', suppliedCategories: ['ACs', 'Fans'] }
];

const INITIAL_REQUESTS = [
  { id: 'REQ-1001', requestId: 'PR-24-001', requestedBy: 'Chef Anand', category: 'Food & Supplies', subCategory: 'Rice & Grains', itemName: 'Sona Masoori Rice', quantity: 50, unit: 'Kg', requiredDate: '2024-05-25', priority: 'High', status: 'Approved', approvalStatus: 'Approved', approvedBy: 'Manager Rahul', approvalDate: '2024-05-20', approvalComments: 'Approved for monthly mess supply.' },
  { id: 'REQ-1002', requestId: 'PR-24-002', requestedBy: 'Staff Kamal', category: 'Cleaning', subCategory: 'Liquids', itemName: 'Floor Cleaner', quantity: 20, unit: 'Liters', requiredDate: '2024-05-28', priority: 'Medium', status: 'Pending', approvalStatus: 'Pending' }
];

const INITIAL_POS = [
  { 
    id: 'PO-5001', poNumber: 'PO-2024-001', linkedRequestId: 'REQ-1001', vendorId: 'V-001', vendorName: 'Metro Wholesalers', 
    items: [{ id: 'ITEM-1', name: 'Sona Masoori Rice', category: 'Food', quantity: 50, unitPrice: 85, tax: 5, discount: 0 }], 
    totalAmount: 4250, orderDate: '2024-05-21', deliveryStatus: 'Completed', expectedDelivery: '2024-05-24', 
    deliveryDate: '2024-05-24', receivedQty: 50, receivedBy: 'Chef Anand', grnNumber: 'GRN-001', qualityCheck: 'Pass', remarks: 'Good quality' 
  },
  { 
    id: 'PO-5002', poNumber: 'PO-2024-002', vendorId: 'V-002', vendorName: 'Sleepwell Systems', 
    items: [{ id: 'ITEM-2', name: 'Single Bed (Steel)', category: 'Furniture', quantity: 10, unitPrice: 4500, tax: 18, discount: 5 }], 
    totalAmount: 45000, orderDate: '2024-05-22', deliveryStatus: 'Pending', expectedDelivery: '2024-05-30', grnStatus: 'Pending' 
  }
];

const INITIAL_ASSETS = [
  { 
    id: 'AST-1001', name: 'Samsung Split AC', code: 'AC-B1-101', tag: 'HOSTEL-AC-001', category: 'Electronics', subCategory: 'ACs',
    lifecycleStage: 'In Use', lifecycleStatus: 'Healthy', conditionScore: 9, conditionStatus: 'Excellent',
    assignedTo: 'Room 101', buildingId: 'B1', floorId: 'F1', roomId: '101', bedId: 'N/A',
    purchaseDate: '2023-04-15', purchaseCost: 45000, currentValue: 38000, depreciationRate: '10%', depreciationMethod: 'Straight Line',
    maintenanceStatus: 'Good', maintenanceSchedule: 'Quarterly', lastMaintenance: '2024-03-10', nextMaintenance: '2024-06-10', 
    warrantyExpiry: '2025-04-15', vendor: 'Global Electronics',
    movementHistory: [{ from: 'Warehouse', to: 'Room 101', date: '2023-04-16', approvedBy: 'Manager' }],
    maintenanceHistory: [{ date: '2024-03-10', type: 'Cleaning', cost: 1500, vendor: 'Rajesh Services' }]
  },
  { 
    id: 'AST-1002', name: 'Steel Bunk Bed', code: 'BED-B2-205', tag: 'HOSTEL-BED-205', category: 'Furniture', subCategory: 'Beds',
    lifecycleStage: 'Active', lifecycleStatus: 'Healthy', conditionScore: 7, conditionStatus: 'Good',
    assignedTo: 'Room 205', buildingId: 'B2', floorId: 'F2', roomId: '205',
    purchaseDate: '2022-08-10', purchaseCost: 8500, currentValue: 6200, depreciationRate: '15%', depreciationMethod: 'Straight Line',
    maintenanceStatus: 'Good', maintenanceSchedule: 'Bi-Annual', lastMaintenance: '2023-12-05', nextMaintenance: '2024-06-05',
    warrantyExpiry: '2024-08-10', vendor: 'Sleepwell Systems',
    movementHistory: [], maintenanceHistory: []
  }
];

const INITIAL_BUDGETS = [
  { categoryId: 'CAT-FOOD', allocated: 150000, used: 85000 },
  { categoryId: 'CAT-FURN', allocated: 200000, used: 120000 },
  { categoryId: 'CAT-CLEAN', allocated: 15000, used: 4500 },
  { categoryId: 'CAT-ELEC', allocated: 50000, used: 32000 }
];

const Inventory = () => {
  const { buildingId: urlBuildingId } = useParams();
  const activeBuildingId = urlBuildingId || localStorage.getItem('selectedBuildingId');
  
  const [activeTab, setActiveTab] = useState('inventory');
  const [procSubTab, setProcSubTab] = useState('dashboard');
  const [assetSubTab, setAssetSubTab] = useState('overview');
  const [notifications, setNotifications] = useState([]);
  
  // Data States
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState(INITIAL_REQUESTS);
  const [pos, setPos] = useState(INITIAL_POS);
  const [assets, setAssets] = useState(INITIAL_ASSETS);
  const [vendors] = useState(INITIAL_VENDORS);
  const [budgets] = useState(INITIAL_BUDGETS);

  // UI States
  const [selectedCategory, setSelectedCategory] = useState('CAT-FOOD');
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [expandedCategories, setExpandedCategories] = useState({ 'CAT-FOOD': true });
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [isAssetModalOpen, setIsAssetModalOpen] = useState(false);
  const [restockItems, setRestockItems] = useState([]);
  const [restockSent, setRestockSent] = useState(false);
  const [restockOpen, setRestockOpen] = useState(false);

  useEffect(() => {
    fetchInventory();
  }, [activeBuildingId]);

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const data = await api.getInventory(activeBuildingId);
      setInventory(data || INITIAL_INVENTORY);
    } catch (err) {
      console.error(err);
      setInventory(INITIAL_INVENTORY);
    } finally {
      setLoading(false);
    }
  };

  const triggerNotification = (msg, color = 'blue') => {
    setNotifications(prev => [{ msg, color, id: Date.now() }, ...prev]);
    setTimeout(() => setNotifications(prev => prev.slice(0, -1)), 5000);
  };

  const procStats = {
    totalSpend: budgets.reduce((sum, b) => sum + b.used, 0),
    pendingApprovals: requests.filter(r => r.status === 'Pending').length,
    activePOs: pos.filter(p => p.deliveryStatus !== 'Completed').length,
    delayed: 0
  };

  const assetStats = {
    total: assets.length,
    active: assets.filter(a => a.lifecycleStage === 'In Use' || a.lifecycleStage === 'Active').length,
    maintenance: assets.filter(a => a.lifecycleStatus === 'Maintenance').length,
    valuation: assets.reduce((sum, a) => sum + a.currentValue, 0)
  };

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
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '2.5rem' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '300px' }}><Search size={20} style={{ position: 'absolute', left: '1.2rem', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} /><input type="text" placeholder="Search Materials..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ padding: '1rem 1rem 1rem 3.5rem', borderRadius: '16px', border: '1px solid #E2E8F0', width: '100%', outline: 'none', background: '#FFFFFF', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }} /></div>
          <select style={{ padding: '1rem', borderRadius: '16px', border: '1px solid #E2E8F0', fontWeight: '800', outline: 'none', background: '#FFFFFF' }}><option>All Levels</option><option>Critical Only</option><option>Low Stock</option></select>
          <button style={{ background: '#3B82F6', color: 'white', border: 'none', padding: '1rem 1.5rem', borderRadius: '16px', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '0.6rem' }}><Plus size={20}/> Add Item</button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
          {inventory.filter(i => (selectedCategory ? i.categoryId === selectedCategory : true) && (selectedSubCategory ? i.subCategoryId === selectedSubCategory : true) && i.name.toLowerCase().includes(searchQuery.toLowerCase())).map(item => (
            <motion.div layout key={item.id} className="card" style={{ padding: '1.8rem', borderTop: `6px solid ${item.stock < item.minThreshold ? '#E11D48' : '#10B981'}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.2rem' }}><Badge color="slate">{SUBCATEGORIES.find(s=>s.id===item.subCategoryId)?.name}</Badge><Badge color={item.stock < item.minThreshold ? 'red' : 'green'}>{item.stock < item.minThreshold ? 'Low Stock' : 'Stable'}</Badge></div>
              <h3 style={{ margin: '0 0 0.4rem 0', fontWeight: '900', fontSize: '1.2rem' }}>{item.name}</h3>
              <p style={{ margin: '0 0 1.5rem 0', fontSize: '0.9rem', color: '#64748B', fontWeight: '700' }}><MapPin size={14} style={{ marginRight: '0.3rem' }}/> {item.location}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}><div><p style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: '800', margin: 0 }}>AVAILABLE STOCK</p><span style={{ fontSize: '2rem', fontWeight: '900', color: '#0F172A' }}>{item.stock}</span><span style={{ fontSize: '1rem', color: '#64748B', marginLeft: '0.4rem', fontWeight: '800' }}>{item.unit}</span></div><div style={{ display: 'flex', gap: '0.6rem' }}><button onClick={() => { setSelectedItem(item); setIsModalOpen(true); }} style={{ padding: '0.6rem', background: '#F1F5F9', border: 'none', borderRadius: '10px', color: '#3B82F6' }}><Edit size={18}/></button><button style={{ padding: '0.6rem', background: '#F1F5F9', border: 'none', borderRadius: '10px', color: '#64748B' }}><History size={18}/></button></div></div>
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
                { l: 'MONTHLY SPEND', v: `₹${procStats.totalSpend.toLocaleString()}`, c: '#3B82F6', i: <DollarSign size={20}/> },
                { l: 'PENDING APPROVALS', v: procStats.pendingApprovals, c: '#F59E0B', i: <Clock size={20}/> },
                { l: 'ACTIVE ORDERS', v: procStats.activePOs, c: '#8B5CF6', i: <Package size={20}/> },
                { l: 'DELAYED DELIVERIES', v: procStats.delayed, c: '#E11D48', i: <AlertTriangle size={20}/> }
              ].map((s, idx) => (
                <div key={idx} className="card" style={{ padding: '1.5rem', borderLeft: `5px solid ${s.c}` }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94A3B8', marginBottom: '0.6rem' }}><span style={{ fontSize: '0.75rem', fontWeight: '900' }}>{s.l}</span>{s.i}</div>
                   <h2 style={{ fontSize: '2rem', fontWeight: '900', margin: 0 }}>{s.v}</h2>
                </div>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '1.5rem' }}>
               <div className="card" style={{ padding: '2rem' }}><h3 style={{ fontSize: '1.2rem', fontWeight: '900', marginBottom: '2rem' }}>Category-wise Allocation</h3><div style={{ height: '300px' }}><ResponsiveContainer width="100%" height="100%"><AreaChart data={[{n:'Jan',v:45000},{n:'Feb',v:52000},{n:'Mar',v:48000},{n:'Apr',v:61000},{n:'May',v:55000}]}><CartesianGrid strokeDasharray="3 3" vertical={false}/><XAxis dataKey="n"/><YAxis/><RechartsTooltip/><Area type="monotone" dataKey="v" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.1}/></AreaChart></ResponsiveContainer></div></div>
               <div className="card" style={{ padding: '2rem' }}><h3 style={{ fontSize: '1.2rem', fontWeight: '900', marginBottom: '2rem' }}>Budget Control</h3><div style={{ display: 'flex', flexDirection: 'column', gap: '1.8rem' }}>{budgets.map(b => (<div key={b.categoryId}><div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem' }}><span style={{ fontWeight: '800', color: '#0F172A' }}>{CATEGORIES.find(c=>c.id===b.categoryId)?.name}</span><span style={{ fontWeight: '900', fontSize: '0.9rem' }}>₹{b.used.toLocaleString()} / ₹{b.allocated.toLocaleString()}</span></div><div style={{ height: '10px', background: '#F1F5F9', borderRadius: '10px', overflow: 'hidden' }}><div style={{ height: '100%', background: (b.used/b.allocated) > 0.8 ? '#E11D48' : '#3B82F6', width: `${(b.used/b.allocated)*100}%` }} /></div></div>))}</div></div>
            </div>
          </div>
        )}
        {procSubTab === 'requests' && (
          <div className="card" style={{ overflowX: 'auto', animation: 'fadeIn 0.2s ease' }}>
             <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
                <thead style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}><tr style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: '900', textTransform: 'uppercase' }}><th style={{ padding: '1.5rem' }}>Request ID</th><th style={{ padding: '1.5rem' }}>Requested By</th><th style={{ padding: '1.5rem' }}>Item & Sub-Cat</th><th style={{ padding: '1.5rem' }}>Qty/Unit</th><th style={{ padding: '1.5rem' }}>Priority</th><th style={{ padding: '1.5rem' }}>Status</th></tr></thead>
                <tbody>{requests.map(r => (<tr key={r.id} style={{ borderBottom: '1px solid #F1F5F9' }}><td style={{ padding: '1.5rem', fontWeight: '900' }}>{r.requestId}</td><td style={{ padding: '1.5rem', fontWeight: '700' }}>{r.requestedBy}</td><td style={{ padding: '1.5rem' }}><p style={{ fontWeight: '800', margin: 0 }}>{r.itemName}</p><p style={{ fontSize: '0.75rem', color: '#94A3B8', margin: 0 }}>{r.subCategory}</p></td><td style={{ padding: '1.5rem', fontWeight: '900' }}>{r.quantity} {r.unit}</td><td style={{ padding: '1.5rem' }}><Badge color={r.priority === 'High' ? 'red' : 'blue'}>{r.priority}</Badge></td><td style={{ padding: '1.5rem' }}><Badge color={r.status === 'Approved' ? 'green' : 'amber'}>{r.status}</Badge></td></tr>))}</tbody>
             </table>
          </div>
        )}
        {procSubTab === 'orders' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(450px, 1fr))', gap: '2rem' }}>
            {pos.map(po => (<div key={po.id} className="card" style={{ padding: '2rem', borderTop: `6px solid ${po.deliveryStatus === 'Completed' ? '#10B981' : '#3B82F6'}` }}><div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}><Badge color="slate">{po.poNumber}</Badge><Badge color={po.deliveryStatus === 'Completed' ? 'green' : 'blue'}>{po.deliveryStatus}</Badge></div><h3 style={{ margin: '0 0 1rem 0', fontWeight: '900', fontSize: '1.3rem' }}>{po.vendorName}</h3><div style={{ background: '#F8FAFC', padding: '1.2rem', borderRadius: '16px', marginBottom: '1.5rem' }}>{po.items.map((it, i) => (<div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', fontWeight: '700' }}><span>{it.name} x {it.quantity}</span><span>₹{(it.quantity * it.unitPrice).toLocaleString()}</span></div>))}</div><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><div><p style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: '800', margin: 0 }}>TOTAL PAYABLE</p><h2 style={{ margin: 0, color: '#0F172A' }}>₹{po.totalAmount.toLocaleString()}</h2></div><button style={{ background: '#3B82F6', color: 'white', border: 'none', padding: '0.8rem 1.5rem', borderRadius: '12px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.6rem' }}><Eye size={18}/> View PO</button></div></div>))}
          </div>
        )}
        {procSubTab === 'vendors' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem', animation: 'fadeIn 0.3s ease' }}>
            {vendors.map(v => (
              <div key={v.id} className="card" style={{ padding: '1.8rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                  <div style={{ background: '#EFF6FF', color: '#3B82F6', padding: '0.8rem', borderRadius: '14px' }}><Users size={24}/></div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '0.9rem', fontWeight: '900', margin: 0 }}>★ {v.rating}</p>
                    <p style={{ fontSize: '0.75rem', color: '#10B981', fontWeight: '800', margin: 0 }}>{v.onTimeRate} On-Time</p>
                  </div>
                </div>
                <h3 style={{ margin: '0 0 0.4rem 0', fontWeight: '900', fontSize: '1.2rem' }}>{v.name}</h3>
                <p style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: '600', marginBottom: '1.5rem' }}>{v.suppliedCategories.join(', ')}</p>
                <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.85rem', color: '#475569', fontWeight: '600' }}><Mail size={14}/> {v.email}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.85rem', color: '#475569', fontWeight: '600' }}><Clock size={14}/> Reliable Partner since 2022</div>
                </div>
              </div>
            ))}
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1.5rem' }}>
            {assets.map(asset => (
              <motion.div layout key={asset.id} className="card" onClick={() => { setSelectedAsset(asset); setIsAssetModalOpen(true); }} style={{ padding: '2rem', cursor: 'pointer' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}><div style={{ display: 'flex', gap: '0.5rem' }}><Badge color="slate">{asset.tag}</Badge><Badge color="indigo">{asset.lifecycleStage}</Badge></div><QrCode size={20} color="#94A3B8"/></div>
                <h3 style={{ margin: '0 0 0.5rem 0', fontWeight: '900', fontSize: '1.3rem' }}>{asset.name}</h3>
                <p style={{ margin: '0 0 1.5rem 0', fontSize: '0.95rem', color: '#64748B', fontWeight: '700' }}><MapPin size={16} style={{ marginRight: '0.4rem' }}/> {asset.buildingId} • Floor {asset.floorId} • Room {asset.roomId}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #F1F5F9', paddingTop: '1.2rem' }}><div><p style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: '800', margin: 0 }}>CONDITION</p><p style={{ fontWeight: '900', margin: 0, color: '#10B981' }}>{asset.conditionStatus}</p></div><div style={{ textAlign: 'right' }}><p style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: '800', margin: 0 }}>WARRANTY</p><p style={{ fontWeight: '900', margin: 0 }}>{asset.warrantyExpiry}</p></div></div>
              </motion.div>
            ))}
          </div>
        )}

        {assetSubTab === 'maintenance' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(420px, 1fr))', gap: '1.5rem', animation: 'fadeIn 0.3s ease' }}>
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
                    <button onClick={() => triggerNotification('Service Call Initiated', 'purple')} style={{ padding: '0.6rem 1.2rem', background: '#3B82F6', color: 'white', border: 'none', borderRadius: '10px', fontWeight: '800', fontSize: '0.8rem' }}>Schedule Now</button>
                    <button style={{ padding: '0.6rem 1.2rem', background: '#F1F5F9', border: 'none', borderRadius: '10px', fontWeight: '800', fontSize: '0.8rem', color: '#475569' }}>Full History</button>
                  </div>
                </div>
              </div>
            ))}
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
                      <td style={{ padding: '1.2rem 1rem', fontWeight: '800' }}>₹{a.purchaseCost.toLocaleString()}</td>
                      <td style={{ padding: '1.2rem 1rem' }}>
                        <Badge color="cyan">{a.depreciationRate} / Year</Badge>
                      </td>
                      <td style={{ padding: '1.2rem 1rem', fontWeight: '900', color: '#3B82F6' }}>₹{a.currentValue.toLocaleString()}</td>
                      <td style={{ padding: '1.2rem 1rem' }}>
                        <Badge color={new Date(a.warrantyExpiry) < new Date() ? 'red' : 'green'}>{a.warrantyExpiry}</Badge>
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
            const prefill = inventory.filter(i => i.stock < i.minThreshold).map(i => ({ name: i.name, needed: i.minThreshold - i.stock + 10, unit: i.unit }));
            setRestockItems(prefill);
            setRestockSent(false);
            setRestockOpen(true);
          }} style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', color: '#3B82F6', fontWeight: '700', padding: '0.8rem 1.2rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShoppingCart size={18} /> Launch Restock P.O.
          </button>
          <button onClick={() => alert('Add Item flow triggered!')} className="btn" style={{ background: '#3B82F6', border: 'none', color: 'white', padding: '0.8rem 1.2rem', borderRadius: '12px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Plus size={18} /> Add Item
          </button>
        </div>
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
      <div style={{ flex: 1 }}>
        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: '400px' }}>
            <RefreshCw className="animate-spin" size={40} color="#3B82F6" />
          </div>
        ) : (
          <div style={{ animation: 'fadeIn 0.3s ease' }}>
            {activeTab === 'inventory' && renderInventoryTab()}
            {activeTab === 'procurement' && renderProcurementTab()}
            {activeTab === 'assets' && renderAssetsTab()}
          </div>
        )}
      </div>

      {/* RESTOCK PO MODAL */}
      <Modal isOpen={restockOpen} onClose={() => { if (!restockSent) setRestockOpen(false); }} title="🛒 Launch Restock P.O." maxWidth="650px">
        {restockSent ? (
          <div style={{ textAlign: 'center', padding: '3rem 0' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>📦</div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: '900', color: '#10B981', marginBottom: '0.5rem' }}>Purchase Order Launched!</h2>
            <p style={{ color: '#64748B', marginBottom: '2rem', fontWeight: '500' }}>Your restock PO has been generated and sent to the supplier automatically.</p>
            <button className="btn" onClick={() => setRestockOpen(false)} style={{ padding: '1rem 3rem', borderRadius: '12px', background: '#10B981', border: 'none', color: 'white', fontWeight: '800', fontSize: '1rem' }}>Done</button>
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
              <button className="btn" onClick={() => setRestockSent(true)} style={{ width: '100%', padding: '1.2rem', fontSize: '1.1rem', fontWeight: '900', borderRadius: '12px', background: '#3B82F6', border: 'none', color: 'white' }}>✅ Confirm & Launch P.O.</button>
            )}
          </>
        )}
      </Modal>

      <style>{`
        .card { background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 24px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.03); transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .card:hover { transform: translateY(-5px); box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04); }
        .btn { padding: 0.8rem 1.5rem; border-radius: 12px; border: none; font-weight: 700; cursor: pointer; transition: all 0.2s; }
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
        ::-webkit-scrollbar { height: 6px; width: 6px; }
        ::-webkit-scrollbar-track { background: #F1F5F9; }
        ::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: #94A3B8; }
      `}</style>
    </div>
  );
};

export default Inventory;
