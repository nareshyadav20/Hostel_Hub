import React, { useState } from 'react';
import { Package, AlertTriangle, Filter, Plus, RefreshCw, ShoppingCart, Info, TrendingDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Inventory = () => {
  const [items, setItems] = useState([
    { id: 1, name: 'Milk (Packets)', stock: 5, minThreshold: 10, category: 'Grocery', unit: 'Packs', lastUpdated: 'Today, 8:00 AM' },
    { id: 2, name: 'Rice (Sona Masoori)', stock: 45, minThreshold: 20, category: 'Grocery', unit: 'Kg', lastUpdated: 'Yesterday' },
    { id: 3, name: 'Floor Cleaner', stock: 2, minThreshold: 5, category: 'Hygiene', unit: 'Bottles', lastUpdated: '3 days ago' },
    { id: 4, name: 'Sugar', stock: 20, minThreshold: 15, category: 'Grocery', unit: 'Kg', lastUpdated: '2 days ago' },
    { id: 5, name: 'LED Bulbs (9W)', stock: 12, minThreshold: 10, category: 'Maintenance', unit: 'Pieces', lastUpdated: '1 week ago' },
    { id: 6, name: 'Hand Wash Refill', stock: 1, minThreshold: 5, category: 'Hygiene', unit: 'Liters', lastUpdated: 'Today, 9:30 AM' },
  ]);

  const [activeCategory, setActiveCategory] = useState('All');
  const categories = ['All', 'Grocery', 'Hygiene', 'Maintenance'];

  const filteredItems = items.filter(item => activeCategory === 'All' || item.category === activeCategory);
  const lowStockItems = items.filter(i => i.stock < i.minThreshold);

  return (
    <div className="inventory-page" style={{ animation: 'fadeIn 0.5s ease-out' }}>
      <header style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: '800', marginBottom: '0.4rem', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Package size={32} color="var(--accent-primary)" /> Inventory Control
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>Global view of stock levels, usage rates, and alerts across all buildings.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
             Launch Restock P.O.
          </button>
          <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShoppingCart size={16} /> Add Item
          </button>
        </div>
      </header>

      {/* Alerts Section */}
      <AnimatePresence>
        {lowStockItems.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card" 
            style={{ marginBottom: '2rem', background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.3)', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}
          >
             <div style={{ padding: '0.8rem', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--accent-error)', borderRadius: '12px' }}>
                <AlertTriangle size={24} />
             </div>
             <div>
                <h3 style={{ fontSize: '1.2rem', color: 'var(--accent-error)', fontWeight: '800', marginBottom: '0.4rem' }}>Low Stock Alert</h3>
                <p style={{ color: 'var(--text-secondary)' }}>{lowStockItems.length} items have fallen below their minimum threshold and require immediate restocking.</p>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '1rem' }}>
                  {lowStockItems.map(item => (
                    <span key={item.id} style={{ background: 'var(--bg-primary)', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '600', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      {item.name} <span style={{ color: 'var(--accent-error)' }}>({item.stock} left)</span>
                    </span>
                  ))}
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filter and Table Card */}
      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        
        {/* Toolbar */}
        <div style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', background: 'var(--bg-tertiary)' }}>
           <div style={{ display: 'flex', gap: '0.5rem' }}>
             {categories.map(cat => (
               <button 
                 key={cat}
                 onClick={() => setActiveCategory(cat)}
                 className="btn" 
                 style={{ 
                   fontSize: '0.85rem', padding: '0.5rem 1rem', 
                   background: activeCategory === cat ? 'var(--accent-primary)' : 'var(--bg-primary)',
                   color: activeCategory === cat ? '#fff' : 'var(--text-primary)',
                   border: activeCategory === cat ? 'none' : '1px solid var(--border-color)'
                 }}
               >
                 {cat}
               </button>
             ))}
           </div>
           <div>
             <button className="btn" style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem', border: '1px solid var(--border-color)', background: 'var(--bg-primary)' }}>
                <Filter size={14} /> Advanced Filters
             </button>
           </div>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'var(--bg-primary)', borderBottom: '1px solid var(--border-color)', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <th style={{ padding: '1.2rem' }}>Item Information</th>
              <th style={{ padding: '1.2rem' }}>Category</th>
              <th style={{ padding: '1.2rem' }}>Current Stock</th>
              <th style={{ padding: '1.2rem' }}>Status</th>
              <th style={{ padding: '1.2rem', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {filteredItems.map(item => {
                const isLow = item.stock < item.minThreshold;
                return (
                  <motion.tr 
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    key={item.id} 
                    style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.2s', background: isLow ? 'rgba(239, 68, 68, 0.02)' : 'transparent' }}
                    className="table-row-hover"
                  >
                    <td style={{ padding: '1.2rem' }}>
                      <p style={{ fontWeight: '700', fontSize: '1rem', color: 'var(--text-primary)' }}>{item.name}</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Updated: {item.lastUpdated}</p>
                    </td>
                    <td style={{ padding: '1.2rem' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', background: 'var(--bg-tertiary)', padding: '0.3rem 0.6rem', borderRadius: '6px' }}>
                         {item.category}
                      </span>
                    </td>
                    <td style={{ padding: '1.2rem' }}>
                       <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.3rem' }}>
                         <span style={{ fontSize: '1.2rem', color: isLow ? 'var(--accent-error)' : 'var(--text-primary)', fontWeight: isLow ? '800' : '600' }}>
                           {item.stock}
                         </span>
                         <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.unit}</span>
                       </div>
                       {item.stock > 0 && <p style={{ fontSize: '0.7rem', color: 'var(--accent-success)', display: 'flex', alignItems: 'center', gap: '0.2rem', marginTop: '0.2rem' }}><TrendingDown size={10}/> ~2 /day</p>}
                    </td>
                    <td style={{ padding: '1.2rem' }}>
                      <span style={{ 
                        display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                        padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700',
                        background: isLow ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                        color: isLow ? 'var(--accent-error)' : 'var(--accent-success)'
                      }}>
                        {isLow ? <AlertTriangle size={12}/> : <CheckCircle size={12}/>}
                        {isLow ? 'LOW STOCK' : 'SUFFICIENT'}
                      </span>
                    </td>
                    <td style={{ padding: '1.2rem', textAlign: 'right' }}>
                       <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                          <button className="btn" style={{ padding: '0.5rem', border: '1px solid var(--border-color)' }} title="View Details">
                            <Info size={16} color="var(--text-secondary)"/>
                          </button>
                          <button className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <RefreshCw size={14} /> Update
                          </button>
                       </div>
                    </td>
                  </motion.tr>
                );
              })}
            </AnimatePresence>
            {filteredItems.length === 0 && (
               <tr>
                 <td colSpan="5" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No items found in this category.
                 </td>
               </tr>
            )}
          </tbody>
        </table>
      </div>
      <style>{`
        .table-row-hover:hover {
          background: var(--bg-tertiary) !important;
        }
      `}</style>
    </div>
  );
};

// Quick CheckCircle substitute
const CheckCircle = ({size}) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>;

export default Inventory;
