import React, { useState, useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Package, Search, Plus, AlertTriangle, Trash2, Edit, History,
  MapPin, ShoppingCart, Utensils, Brush, Hammer, MoreVertical,
  ChevronRight, ArrowUpRight, ArrowDownRight, Clock, CheckCircle2,
  AlertCircle, X, Save, Filter, ChevronLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../mockData';
import socket, { connectSocket } from '../utils/socket';

// --- CONFIGURATION ---
const CATEGORIES = [
  { id: 'Groceries', name: 'Groceries', icon: <Utensils size={20} />, color: '#FF6B6B', bg: '#FFF5F5' },
  { id: 'Cleaning', name: 'Cleaning Supplies', icon: <Brush size={20} />, color: '#4DABF7', bg: '#E7F5FF' },
  { id: 'Kitchen', name: 'Kitchen Equipment', icon: <Hammer size={20} />, color: '#51CF66', bg: '#EBFBEE' },
  { id: 'Miscellaneous', name: 'Miscellaneous', icon: <Package size={20} />, color: '#FCC419', bg: '#FFF9DB' }
];

const InventoryManagement = () => {
  const { buildingId: urlBuildingId } = useParams();
  const activeBuildingId = urlBuildingId || localStorage.getItem('selectedBuildingId');

  // Data States
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState([]);
  const [activityPage, setActivityPage] = useState(0);
  const activitiesPerPage = 5;

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const ROWS_PER_PAGE_OPTIONS = [5, 10, 20, 50];

  // UI States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const [formData, setFormData] = useState({
    name: '',
    category: 'Groceries',
    stock: 0,
    minThreshold: 5,
    unit: 'Kg',
    location: '',
    lastPurchased: new Date().toISOString().split('T')[0]
  });

  // Fetch Data
  useEffect(() => {
    fetchInventory();
    if (activeBuildingId) {
      connectSocket(activeBuildingId);

      const handleAdd = (item) => {
        setInventory(prev => {
          // Check for existing to prevent duplicates (4x bug fix)
          const exists = prev.find(i => (i._id === item._id || i.id === item.id));
          if (exists) return prev;
          return [item, ...prev];
        });
        addActivity(`${item.name} added to inventory`, 'plus');
      };
      const handleUpdate = (updated) => {
        setInventory(prev => prev.map(i => (i._id === updated._id || i.id === updated.id) ? updated : i));
        addActivity(`${updated.name} stock updated`, 'update');
      };
      const handleDelete = (id) => {
        setInventory(prev => prev.filter(i => i._id !== id && i.id !== id));
        addActivity(`Item removed from inventory`, 'delete');
      };

      socket.on('inventoryAdded', handleAdd);
      socket.on('inventoryUpdated', handleUpdate);
      socket.on('inventoryDeleted', handleDelete);

      return () => {
        socket.off('inventoryAdded', handleAdd);
        socket.off('inventoryUpdated', handleUpdate);
        socket.off('inventoryDeleted', handleDelete);
      };
    }
  }, [activeBuildingId]);

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const data = await api.getInventory(activeBuildingId);
      setInventory(data || []);
      // Initialize some activities if empty
      setActivities([
        { id: 1, text: 'Rice stock updated to 50kg', type: 'update', time: '2 mins ago' },
        { id: 2, text: 'Kitchen oil added', type: 'plus', time: '1 hour ago' },
        { id: 3, text: 'Soap stock reduced', type: 'update', time: '3 hours ago' }
      ]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addActivity = (text, type) => {
    setActivities(prev => [{ id: Date.now(), text, type, time: 'Just now' }, ...prev].slice(0, 10));
  };

  const triggerNotification = (msg, color = 'blue') => {
    setNotifications(prev => [{ msg, color, id: Date.now() }, ...prev]);
    setTimeout(() => setNotifications(prev => prev.slice(0, -1)), 5000);
  };

  // Logic
  const filteredInventory = useMemo(() => {
    return inventory.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory || item.categoryId === selectedCategory;
      const matchesLowStock = showLowStockOnly ? item.stock <= item.minThreshold : true;
      return matchesSearch && matchesCategory && matchesLowStock;
    });
  }, [inventory, searchQuery, selectedCategory, showLowStockOnly]);

  const totalPages = Math.ceil(filteredInventory.length / rowsPerPage);
  const paginatedInventory = filteredInventory.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const stats = useMemo(() => ({
    total: inventory.length,
    lowStock: inventory.filter(i => i.stock > 0 && i.stock <= i.minThreshold).length,
    outOfStock: inventory.filter(i => i.stock <= 0).length,
    monthlyUsage: 145 // Mocked for simplicity
  }), [inventory]);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (selectedItem) {
        await api.updateInventoryItem(selectedItem.id || selectedItem._id, formData);
        // Socket will handle setInventory
        triggerNotification('Item updated successfully', 'green');
      } else {
        await api.addInventoryItem({ ...formData, buildingId: activeBuildingId });
        // Socket will handle setInventory
        triggerNotification('Item added successfully', 'green');
      }
      setIsAddModalOpen(false);
      setSelectedItem(null);
      setFormData({ name: '', category: 'Groceries', stock: 0, minThreshold: 5, unit: 'Kg', location: '', lastPurchased: new Date().toISOString().split('T')[0] });
    } catch (err) {
      triggerNotification('Operation failed', 'red');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this item?')) return;
    try {
      await api.deleteInventoryItem(id);
      setInventory(prev => prev.filter(i => i.id !== id && i._id !== id));
      triggerNotification('Item removed', 'slate');
    } catch (err) {
      triggerNotification('Delete failed', 'red');
    }
  };

  const openEdit = (item) => {
    setSelectedItem(item);
    setFormData({
      name: item.name,
      category: item.category || item.categoryId || 'Groceries',
      stock: item.stock,
      minThreshold: item.minThreshold,
      unit: item.unit,
      location: item.location || '',
      lastPurchased: item.lastPurchased || new Date().toISOString().split('T')[0]
    });
    setIsAddModalOpen(true);
  };

  return (
    <div className="inventory-page-v2" style={{ padding: '2rem', background: '#FDFDFF', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>

      {/* 1. PAGE HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: '900', color: '#0F172A', margin: 0, letterSpacing: '-0.03em' }}>Inventory Management</h1>
          <p style={{ color: '#64748B', fontSize: '1.1rem', fontWeight: '500', marginTop: '0.4rem' }}>Track groceries, kitchen items, and hostel supplies in real-time.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            onClick={() => { setShowLowStockOnly(!showLowStockOnly); setSelectedCategory('All'); }}
            style={{
              padding: '0.8rem 1.5rem', borderRadius: '14px', border: 'none', fontWeight: '800',
              background: showLowStockOnly ? '#FFF1F2' : '#F8FAFC',
              color: showLowStockOnly ? '#E11D48' : '#475569',
              display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer',
              transition: '0.3s', border: showLowStockOnly ? '1px solid #FECACA' : '1px solid #E2E8F0'
            }}
          >
            <AlertTriangle size={20} /> Low Stock Alerts
          </button>
          <button
            onClick={() => { setSelectedItem(null); setIsAddModalOpen(true); }}
            style={{
              padding: '0.8rem 1.8rem', borderRadius: '14px', border: 'none', fontWeight: '900',
              background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
              color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer',
              boxShadow: '0 8px 16px rgba(79, 70, 229, 0.2)', transition: '0.3s'
            }}
          >
            <Plus size={22} /> Add Item
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '2rem' }} className="main-grid">

        <div className="content-side">
          {/* 2. TOP SUMMARY CARDS */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2.5rem' }} className="stats-grid">
            {[
              { label: 'Total Items', value: stats.total, color: '#6366F1', icon: <Package />, bg: 'linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%)' },
              { label: 'Low Stock', value: stats.lowStock, color: '#F59E0B', icon: <AlertTriangle />, bg: 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)' },
              { label: 'Out of Stock', value: stats.outOfStock, color: '#EF4444', icon: <AlertCircle />, bg: 'linear-gradient(135deg, #FEF2F2 0%, #FEE2E2 100%)' },
              { label: 'Monthly Usage', value: stats.monthlyUsage, color: '#10B981', icon: <ArrowUpRight />, bg: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)' }
            ].map((s, i) => (
              <motion.div whileHover={{ y: -5 }} key={i} style={{ padding: '1.5rem', borderRadius: '24px', background: '#FFFFFF', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', border: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: s.bg, color: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {s.icon}
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.02em' }}>{s.label}</p>
                  <h2 style={{ margin: 0, fontSize: '1.8rem', fontWeight: '900', color: '#0F172A' }}>{s.value}</h2>
                </div>
              </motion.div>
            ))}
          </div>

          {/* 3. INVENTORY CATEGORIES */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.2rem', marginBottom: '2.5rem' }} className="categories-grid">
            {CATEGORIES.map(cat => {
              const count = inventory.filter(i => i.category === cat.id || i.categoryId === cat.id).length;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id === selectedCategory ? 'All' : cat.id)}
                  style={{
                    padding: '1.5rem', borderRadius: '24px', cursor: 'pointer',
                    background: selectedCategory === cat.id ? cat.color : '#FFFFFF',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.02)', textAlign: 'left', transition: '0.3s',
                    border: selectedCategory === cat.id ? `2px solid ${cat.color}` : '2px solid #F1F5F9',
                    display: 'flex', flexDirection: 'column', gap: '1rem'
                  }}
                >
                  <div style={{
                    width: '40px', height: '40px', borderRadius: '12px',
                    background: selectedCategory === cat.id ? 'rgba(255,255,255,0.2)' : cat.bg,
                    color: selectedCategory === cat.id ? '#FFFFFF' : cat.color,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    {cat.icon}
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '800', color: selectedCategory === cat.id ? '#FFFFFF' : '#0F172A' }}>{cat.name}</h3>
                    <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: '600', color: selectedCategory === cat.id ? 'rgba(255,255,255,0.8)' : '#64748B' }}>{count} Items Available</p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* 4. MAIN INVENTORY TABLE */}
          <div style={{ background: '#FFFFFF', borderRadius: '28px', border: '1px solid #F1F5F9', boxShadow: '0 10px 30px rgba(0,0,0,0.02)', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
                <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                <input
                  type="text" placeholder="Search inventory..." value={searchQuery} onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                  style={{ width: '100%', padding: '0.8rem 1rem 0.8rem 3rem', borderRadius: '14px', border: '1px solid #E2E8F0', outline: 'none', background: '#F8FAFC', fontWeight: '600' }}
                />
              </div>
              <div style={{ display: 'flex', gap: '0.8rem' }}>
                <select 
                  value={rowsPerPage} onChange={e => { setRowsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                  style={{ padding: '0.8rem 1.2rem', borderRadius: '12px', border: '1px solid #E2E8F0', background: '#FFFFFF', color: '#475569', fontWeight: '700', outline: 'none', cursor: 'pointer' }}
                >
                  {ROWS_PER_PAGE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt} per page</option>)}
                </select>
                <button style={{ padding: '0.8rem 1.2rem', borderRadius: '12px', border: '1px solid #E2E8F0', background: '#FFFFFF', color: '#475569', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Filter size={18} /> Filter
                </button>
              </div>
            </div>

            <div style={{ overflowX: 'auto', marginTop: '1rem' }}>
              <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 0.8rem' }}>
                <thead>
                  <tr style={{ textAlign: 'left', color: '#94A3B8', fontSize: '0.85rem', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    <th style={{ padding: '1rem 1.5rem', background: 'linear-gradient(90deg, #F8FAFC 0%, transparent 100%)', borderRadius: '12px 0 0 12px' }}>Item Details</th>
                    <th style={{ padding: '1rem' }}>Category</th>
                    <th style={{ padding: '1rem' }}>Current Stock</th>
                    <th style={{ padding: '1rem' }}>Health Status</th>
                    <th style={{ padding: '1rem' }}>Last Action</th>
                    <th style={{ padding: '1rem 1.5rem', textAlign: 'right', background: 'linear-gradient(-90deg, #F8FAFC 0%, transparent 100%)', borderRadius: '0 12px 12px 0' }}>Management</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedInventory.map(item => {
                    const isLow = item.stock <= item.minThreshold && item.stock > 0;
                    const isOut = item.stock <= 0;
                    const cat = CATEGORIES.find(c => c.id === item.category || c.id === item.categoryId) || CATEGORIES[0];

                    return (
                      <motion.tr
                        layout
                        key={item.id || item._id}
                        className="inventory-table-row"
                        style={{
                          background: '#FFFFFF',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                          transition: '0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                          cursor: 'default'
                        }}
                      >
                        <td style={{ padding: '1.5rem', borderRadius: '20px 0 0 20px', borderTop: '1px solid #F1F5F9', borderBottom: '1px solid #F1F5F9', borderLeft: '1px solid #F1F5F9' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
                            <div style={{
                              width: '52px', height: '52px', borderRadius: '16px',
                              background: cat.bg, color: cat.color,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              boxShadow: `0 4px 12px ${cat.color}15`
                            }}>
                              {cat.icon}
                            </div>
                            <div>
                              <p style={{ margin: 0, fontWeight: '900', color: '#0F172A', fontSize: '1.1rem' }}>{item.name}</p>
                              <p style={{ margin: 0, fontSize: '0.85rem', color: '#94A3B8', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                <MapPin size={12} /> {item.location || 'Main Storage'}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '1.5rem 1rem', borderTop: '1px solid #F1F5F9', borderBottom: '1px solid #F1F5F9' }}>
                          <span style={{
                            padding: '0.5rem 1rem', borderRadius: '12px', fontSize: '0.8rem', fontWeight: '800',
                            background: cat.bg, color: cat.color, border: `1px solid ${cat.color}20`
                          }}>
                            {cat.name}
                          </span>
                        </td>
                        <td style={{ padding: '1.5rem 1rem', borderTop: '1px solid #F1F5F9', borderBottom: '1px solid #F1F5F9' }}>
                          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.3rem' }}>
                            <span style={{ fontWeight: '950', color: isOut ? '#EF4444' : (isLow ? '#F59E0B' : '#0F172A'), fontSize: '1.4rem' }}>{item.stock}</span>
                            <span style={{ color: '#94A3B8', fontSize: '0.9rem', fontWeight: '700' }}>{item.unit}</span>
                          </div>
                          <div style={{ width: '80px', height: '6px', background: '#F1F5F9', borderRadius: '10px', marginTop: '0.6rem', overflow: 'hidden' }}>
                            <div style={{
                              width: `${Math.min((item.stock / (item.minThreshold * 3)) * 100, 100)}%`,
                              height: '100%',
                              background: isOut ? '#EF4444' : (isLow ? '#F59E0B' : '#10B981'),
                              borderRadius: '10px'
                            }} />
                          </div>
                        </td>
                        <td style={{ padding: '1.5rem 1rem', borderTop: '1px solid #F1F5F9', borderBottom: '1px solid #F1F5F9' }}>
                          <div style={{
                            display: 'inline-flex', alignItems: 'center', gap: '0.6rem', padding: '0.6rem 1rem', borderRadius: '14px', fontSize: '0.8rem', fontWeight: '900',
                            background: isOut ? '#FEF2F2' : (isLow ? '#FFFBEB' : '#ECFDF5'),
                            color: isOut ? '#EF4444' : (isLow ? '#D97706' : '#10B981'),
                            border: `1px solid ${isOut ? '#FEE2E2' : (isLow ? '#FEF3C7' : '#D1FAE5')}`
                          }}>
                            {isOut ? <AlertCircle size={16} /> : (isLow ? <AlertTriangle size={16} /> : <CheckCircle2 size={16} />)}
                            {isOut ? 'Refill Now' : (isLow ? 'Low Level' : 'Healthy')}
                          </div>
                        </td>
                        <td style={{ padding: '1.5rem 1rem', borderTop: '1px solid #F1F5F9', borderBottom: '1px solid #F1F5F9', color: '#64748B', fontWeight: '700', fontSize: '0.9rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Clock size={14} style={{ opacity: 0.6 }} />
                            {item.updatedAt ? new Date(item.updatedAt).toLocaleDateString(undefined, { day: '2-digit', month: 'short' }) : 'Today'}
                          </div>
                        </td>
                        <td style={{ padding: '1.5rem', borderRadius: '0 20px 20px 0', borderTop: '1px solid #F1F5F9', borderBottom: '1px solid #F1F5F9', borderRight: '1px solid #F1F5F9', textAlign: 'right' }}>
                          <div style={{ display: 'flex', gap: '0.8rem', justifyContent: 'flex-end' }}>
                            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => openEdit(item)} style={{ width: '40px', height: '40px', borderRadius: '12px', border: 'none', background: '#EEF2FF', color: '#6366F1', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Edit size={18} /></motion.button>
                            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => handleDelete(item.id || item._id)} style={{ width: '40px', height: '40px', borderRadius: '12px', border: 'none', background: '#FEF2F2', color: '#EF4444', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Trash2 size={18} /></motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                  {paginatedInventory.length === 0 && (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center', padding: '3rem' }}>
                        <p style={{ color: '#94A3B8', fontWeight: '600' }}>No items found matching your criteria.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* PAGINATION CONTROLS */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #F1F5F9' }}>
              <div style={{ fontSize: '0.9rem', color: '#64748B', fontWeight: '600' }}>
                Showing <span style={{ color: '#0F172A', fontWeight: '800' }}>{(currentPage - 1) * rowsPerPage + 1}</span> to <span style={{ color: '#0F172A', fontWeight: '800' }}>{Math.min(currentPage * rowsPerPage, filteredInventory.length)}</span> of <span style={{ color: '#0F172A', fontWeight: '800' }}>{filteredInventory.length}</span> items
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <button 
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  style={{ padding: '0.6rem 1rem', borderRadius: '12px', border: '1px solid #E2E8F0', background: currentPage === 1 ? '#F8FAFC' : '#FFFFFF', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', color: '#475569', fontWeight: '700' }}
                >
                  <ChevronLeft size={18} />
                </button>
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  {[...Array(totalPages)].map((_, i) => (
                    <button 
                      key={i} 
                      onClick={() => setCurrentPage(i + 1)}
                      style={{ 
                        width: '36px', height: '36px', borderRadius: '10px', border: 'none', 
                        background: currentPage === i + 1 ? '#6366F1' : 'transparent',
                        color: currentPage === i + 1 ? '#FFFFFF' : '#64748B',
                        fontWeight: '800', cursor: 'pointer'
                      }}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <button 
                  disabled={currentPage === totalPages || totalPages === 0}
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  style={{ padding: '0.6rem 1rem', borderRadius: '12px', border: '1px solid #E2E8F0', background: (currentPage === totalPages || totalPages === 0) ? '#F8FAFC' : '#FFFFFF', cursor: (currentPage === totalPages || totalPages === 0) ? 'not-allowed' : 'pointer', color: '#475569', fontWeight: '700' }}
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="sidebar-side">
          {/* 5. LOW STOCK ALERT SECTION */}
          <div style={{ background: '#FFFFFF', borderRadius: '28px', border: '1px solid #F1F5F9', padding: '1.5rem', marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '900', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
              <AlertTriangle size={18} color="#F59E0B" /> Low Stock Alerts
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              {inventory.filter(i => i.stock <= i.minThreshold).length > 0 ? (
                inventory.filter(i => i.stock <= i.minThreshold).slice(0, 5).map((item, idx) => (
                  <div key={idx} style={{ padding: '1rem', borderRadius: '16px', background: item.stock <= 0 ? '#FFF1F2' : '#FFFBEB', border: `1px solid ${item.stock <= 0 ? '#FECACA' : '#FEF3C7'}`, display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <AlertTriangle size={14} color={item.stock <= 0 ? '#E11D48' : '#D97706'} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: '800', color: item.stock <= 0 ? '#991B1B' : '#92400E' }}>{item.name} stock is {item.stock <= 0 ? 'empty' : 'low'}</p>
                      <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: '600', color: item.stock <= 0 ? '#EF4444' : '#F59E0B' }}>Action required</p>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ textAlign: 'center', padding: '1.5rem', color: '#94A3B8' }}>
                  <CheckCircle2 size={32} style={{ marginBottom: '0.5rem', opacity: 0.5 }} />
                  <p style={{ fontSize: '0.85rem', fontWeight: '600' }}>All stock levels healthy</p>
                </div>
              )}
            </div>
          </div>

          <div style={{ background: '#FFFFFF', borderRadius: '28px', border: '1px solid #F1F5F9', padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '900', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
              <Clock size={18} color="#6366F1" /> Recent Activity
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', position: 'relative', minHeight: '320px' }}>
              <div style={{ position: 'absolute', left: '11px', top: '5px', bottom: '5px', width: '2px', background: 'linear-gradient(to bottom, #EEF2FF 0%, #E0E7FF 50%, #EEF2FF 100%)' }} />
              {activities.slice(activityPage * activitiesPerPage, (activityPage + 1) * activitiesPerPage).map((act, i) => (
                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} key={act.id} style={{ display: 'flex', gap: '1.2rem', position: 'relative', zIndex: 1 }}>
                  <div style={{
                    width: '24px', height: '24px', borderRadius: '50%', background: '#FFFFFF',
                    border: `2px solid ${act.type === 'plus' ? '#10B981' : (act.type === 'delete' ? '#EF4444' : '#6366F1')}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 0 10px rgba(0,0,0,0.05)'
                  }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: act.type === 'plus' ? '#10B981' : (act.type === 'delete' ? '#EF4444' : '#6366F1') }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: '800', color: '#1E293B' }}>{act.text}</p>
                    <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: '600', color: '#94A3B8', marginTop: '2px' }}>{act.time}</p>
                  </div>
                </motion.div>
              ))}
              {activities.length === 0 && (
                <div style={{ textAlign: 'center', padding: '3rem 0', color: '#94A3B8' }}>
                  <Clock size={30} style={{ opacity: 0.3, marginBottom: '0.5rem' }} />
                  <p style={{ fontSize: '0.8rem', fontWeight: '600' }}>No recent activities</p>
                </div>
              )}
            </div>

            {/* Pagination for Activity */}
            {activities.length > activitiesPerPage && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #F1F5F9' }}>
                <button
                  disabled={activityPage === 0}
                  onClick={() => setActivityPage(p => Math.max(0, p - 1))}
                  style={{ padding: '0.5rem', borderRadius: '10px', border: '1px solid #E2E8F0', background: activityPage === 0 ? '#F8FAFC' : '#FFFFFF', cursor: activityPage === 0 ? 'default' : 'pointer', color: activityPage === 0 ? '#CBD5E1' : '#475569' }}
                >
                  <ChevronRight size={18} style={{ transform: 'rotate(180deg)' }} />
                </button>
                <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#94A3B8' }}>
                  {activityPage + 1} / {Math.ceil(activities.length / activitiesPerPage)}
                </span>
                <button
                  disabled={(activityPage + 1) * activitiesPerPage >= activities.length}
                  onClick={() => setActivityPage(p => p + 1)}
                  style={{ padding: '0.5rem', borderRadius: '10px', border: '1px solid #E2E8F0', background: (activityPage + 1) * activitiesPerPage >= activities.length ? '#F8FAFC' : '#FFFFFF', cursor: (activityPage + 1) * activitiesPerPage >= activities.length ? 'default' : 'pointer', color: (activityPage + 1) * activitiesPerPage >= activities.length ? '#CBD5E1' : '#475569' }}
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 6. ADD/EDIT MODAL */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsAddModalOpen(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(8px)' }} />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} style={{ position: 'relative', width: '100%', maxWidth: '700px', background: '#FFFFFF', borderRadius: '40px', boxShadow: '0 40px 100px -12px rgba(15, 23, 42, 0.3)', padding: '3rem', zIndex: 1001, overflow: 'hidden' }}>
              {/* Colorful background accent */}
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '8px', background: 'linear-gradient(90deg, #6366F1, #A855F7, #EC4899)' }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '18px', background: 'linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Plus size={28} color="#6366F1" />
                  </div>
                  <div>
                    <h2 style={{ margin: 0, fontSize: '1.8rem', fontWeight: '950', color: '#0F172A', letterSpacing: '-0.02em' }}>{selectedItem ? 'Refine Item Details' : 'Add New Material'}</h2>
                    <p style={{ margin: 0, fontSize: '0.95rem', color: '#64748B', fontWeight: '600' }}>Populate your hostel registry with precision.</p>
                  </div>
                </div>
                <button onClick={() => setIsAddModalOpen(false)} style={{ padding: '0.8rem', borderRadius: '50%', border: 'none', background: '#F8FAFC', color: '#94A3B8', cursor: 'pointer', transition: '0.2s' }}><X size={24} /></button>
              </div>

              <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.8rem' }}>
                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', fontWeight: '800', color: '#334155', marginBottom: '0.8rem' }}>
                    <Package size={16} color="#6366F1" /> Item Name
                  </label>
                  <input required type="text" placeholder="e.g. Premium Basmati Rice" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} style={{ width: '100%', padding: '1.2rem', borderRadius: '20px', border: '2px solid #F1F5F9', outline: 'none', background: '#F8FAFC', fontWeight: '700', fontSize: '1rem', transition: '0.3s' }} className="modal-input" />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                  <div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', fontWeight: '800', color: '#334155', marginBottom: '0.8rem' }}>
                      <Filter size={16} color="#4DABF7" /> Category
                    </label>
                    <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} style={{ width: '100%', padding: '1.2rem', borderRadius: '20px', border: '2px solid #F1F5F9', outline: 'none', background: '#F8FAFC', fontWeight: '700', fontSize: '1rem', cursor: 'pointer' }}>
                      {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', fontWeight: '800', color: '#334155', marginBottom: '0.8rem' }}>
                      <ShoppingCart size={16} color="#51CF66" /> Initial Stock & Unit
                    </label>
                    <div style={{ display: 'flex', gap: '0.8rem' }}>
                      <input required type="number" min="0" value={formData.stock} onChange={e => setFormData({ ...formData, stock: parseInt(e.target.value) })} style={{ flex: 1, padding: '1.2rem', borderRadius: '20px', border: '2px solid #F1F5F9', outline: 'none', background: '#F8FAFC', fontWeight: '700', fontSize: '1rem' }} className="modal-input" />
                      <input required type="text" placeholder="Kg" value={formData.unit} onChange={e => setFormData({ ...formData, unit: e.target.value })} style={{ width: '80px', padding: '1.2rem', borderRadius: '20px', border: '2px solid #F1F5F9', outline: 'none', background: '#F8FAFC', fontWeight: '700', fontSize: '1rem', textAlign: 'center' }} className="modal-input" />
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                  <div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', fontWeight: '800', color: '#334155', marginBottom: '0.8rem' }}>
                      <AlertTriangle size={16} color="#FCC419" /> Minimum Threshold
                    </label>
                    <input required type="number" min="1" value={formData.minThreshold} onChange={e => setFormData({ ...formData, minThreshold: parseInt(e.target.value) })} style={{ width: '100%', padding: '1.2rem', borderRadius: '20px', border: '2px solid #F1F5F9', outline: 'none', background: '#F8FAFC', fontWeight: '700', fontSize: '1rem' }} className="modal-input" />
                  </div>
                  <div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', fontWeight: '800', color: '#334155', marginBottom: '0.8rem' }}>
                      <Clock size={16} color="#A855F7" /> Purchase Date
                    </label>
                    <input type="date" value={formData.lastPurchased} onChange={e => setFormData({ ...formData, lastPurchased: e.target.value })} style={{ width: '100%', padding: '1.2rem', borderRadius: '20px', border: '2px solid #F1F5F9', outline: 'none', background: '#F8FAFC', fontWeight: '700', fontSize: '1rem' }} className="modal-input" />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', fontWeight: '800', color: '#334155', marginBottom: '0.8rem' }}>
                    <MapPin size={16} color="#FF6B6B" /> Precise Location
                  </label>
                  <input type="text" placeholder="e.g. Ground Floor, Storage Room 01, Shelf B" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} style={{ width: '100%', padding: '1.2rem', borderRadius: '20px', border: '2px solid #F1F5F9', outline: 'none', background: '#F8FAFC', fontWeight: '700', fontSize: '1rem' }} className="modal-input" />
                </div>

                <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1rem' }}>
                  <button type="button" onClick={() => setIsAddModalOpen(false)} style={{ flex: 1, padding: '1.2rem', borderRadius: '22px', border: '2px solid #F1F5F9', background: '#FFFFFF', color: '#64748B', fontWeight: '850', cursor: 'pointer', transition: '0.3s' }} className="modal-cancel-btn">Discard</button>
                  <button type="submit" style={{ flex: 2, padding: '1.2rem', borderRadius: '22px', border: 'none', background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)', color: '#FFFFFF', fontWeight: '950', fontSize: '1.1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.8rem', boxShadow: '0 15px 30px rgba(79, 70, 229, 0.3)', transition: '0.3s' }} className="modal-save-btn">
                    <Save size={24} /> {selectedItem ? 'Sync Updates' : 'Publish to Registry'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        .modal-input:focus { border-color: #6366F1 !important; background: #FFFFFF !important; box-shadow: 0 0 0 5px rgba(99, 102, 241, 0.1); }
        .modal-cancel-btn:hover { background: #F8FAFC; color: #0F172A; border-color: #CBD5E1; }
        .modal-save-btn:hover { transform: translateY(-3px); box-shadow: 0 20px 40px rgba(79, 70, 229, 0.4) !important; }

        .inventory-table-row:hover { 
          transform: scale(1.005);
          box-shadow: 0 10px 25px rgba(0,0,0,0.05) !important;
          z-index: 10;
        }
        .inventory-table-row td {
          transition: all 0.3s ease;
          font-family: 'Inter', sans-serif;
          letter-spacing: -0.01em;
        }
        .inventory-table-row:hover td {
          border-color: #E2E8F0 !important;
          background: #FDFDFF;
        }
        
        table thead th {
          font-family: 'Poppins', sans-serif;
          letter-spacing: 0.05em;
        }
        
        .inventory-page-v2 {
          font-family: 'Inter', sans-serif;
        }
        
        h1, h2, h3 {
          font-family: 'Poppins', sans-serif;
        }

        @media (max-width: 1200px) {
          .main-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 900px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .categories-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 600px) {
          .stats-grid { grid-template-columns: 1fr !important; }
          .categories-grid { grid-template-columns: 1fr !important; }
        }
        select { appearance: none; background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e"); background-repeat: no-repeat; background-position: right 1rem center; background-size: 1.2em; }
      `}</style>
    </div>
  );
};

export default InventoryManagement;
