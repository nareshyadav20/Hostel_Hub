import React, { useState } from 'react';
import { Package, AlertTriangle, Filter, Plus, RefreshCw, ShoppingCart, Info, TrendingDown, X } from 'lucide-react';
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
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [newItem, setNewItem] = useState({ name: '', stock: '', minThreshold: '', category: 'Grocery', unit: 'Units' });
  const [restockOpen, setRestockOpen] = useState(false);
  const [restockItems, setRestockItems] = useState([]);
  const [restockSent, setRestockSent] = useState(false);
  const [detailsItem, setDetailsItem] = useState(null);

  const categories = ['All', 'Grocery', 'Hygiene', 'Maintenance'];
  const filteredItems = items.filter(item => activeCategory === 'All' || item.category === activeCategory);
  const lowStockItems = items.filter(i => i.stock < i.minThreshold);

  const handleAddItem = (e) => {
    e.preventDefault();
    const itemToAdd = {
      ...newItem,
      id: items.length + 1,
      stock: parseInt(newItem.stock),
      minThreshold: parseInt(newItem.minThreshold),
      lastUpdated: 'Just now'
    };
    setItems([...items, itemToAdd]);
    setIsAddModalOpen(false);
    setNewItem({ name: '', stock: '', minThreshold: '', category: 'Grocery', unit: 'Units' });
  };

  const handleUpdateStock = (e) => {
    e.preventDefault();
    setItems(items.map(item => 
      item.id === selectedItem.id 
        ? { ...item, stock: parseInt(selectedItem.stock), lastUpdated: 'Just now' } 
        : item
    ));
    setIsUpdateModalOpen(false);
    setSelectedItem(null);
  };

  const inputStyle = { padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-tertiary)', color: 'var(--text-primary)', width: '100%' };

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
          <button className="btn" onClick={() => {
             const prefill = lowStockItems.map(i => ({ name: i.name, needed: i.minThreshold - i.stock + 5, unit: i.unit }));
             setRestockItems(prefill);
             setRestockSent(false);
             setRestockOpen(true);
           }} style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
             Launch Restock P.O.
          </button>
          <button onClick={() => setIsAddModalOpen(true)} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Plus size={16} /> Add Item
          </button>
        </div>
      </header>

      {/* Alerts Section */}
      <AnimatePresence>
        {lowStockItems.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="card" 
            style={{ marginBottom: '2rem', background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.3)', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}
          >
             <div style={{ padding: '0.8rem', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--accent-error)', borderRadius: '12px' }}>
                <AlertTriangle size={24} />
             </div>
             <div style={{ flex: 1 }}>
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
                          <button onClick={() => { setDetailsItem(item); }} className="btn" style={{ padding: '0.5rem', border: '1px solid var(--border-color)' }} title="View Details">
                            <Info size={16} color="var(--text-secondary)"/>
                          </button>
                          <button onClick={() => { setSelectedItem(item); setIsUpdateModalOpen(true); }} className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
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

      {/* Add Item Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, backdropFilter: 'blur(4px)' }} onClick={() => setIsAddModalOpen(false)} />
            <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} style={{ position: 'fixed', top: '15%', left: '50%', x: '-50%', width: '90%', maxWidth: '500px', background: 'var(--bg-primary)', zIndex: 1001, padding: '2rem', borderRadius: '24px', border: '1px solid var(--border-color)' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '1.5rem' }}>Add New Inventory Item</h2>
              <form onSubmit={handleAddItem} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                <input placeholder="Item Name" value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} style={inputStyle} required />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                   <input type="number" placeholder="Stock Level" value={newItem.stock} onChange={e => setNewItem({...newItem, stock: e.target.value})} style={inputStyle} required />
                   <input type="number" placeholder="Min. Threshold" value={newItem.minThreshold} onChange={e => setNewItem({...newItem, minThreshold: e.target.value})} style={inputStyle} required />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                   <select value={newItem.category} onChange={e => setNewItem({...newItem, category: e.target.value})} style={inputStyle}>
                      {categories.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                   </select>
                   <input placeholder="Unit (e.g. Kg, Packs)" value={newItem.unit} onChange={e => setNewItem({...newItem, unit: e.target.value})} style={inputStyle} required />
                </div>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <button className="btn btn-primary" type="submit" style={{ flex: 1, padding: '1rem' }}>Add Item</button>
                  <button className="btn" type="button" onClick={() => setIsAddModalOpen(false)} style={{ flex: 1, padding: '1rem', border: '1px solid var(--border-color)' }}>Cancel</button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Update Stock Modal */}
      <AnimatePresence>
        {isUpdateModalOpen && selectedItem && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, backdropFilter: 'blur(4px)' }} onClick={() => setIsUpdateModalOpen(false)} />
            <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} style={{ position: 'fixed', top: '25%', left: '50%', x: '-50%', width: '90%', maxWidth: '400px', background: 'var(--bg-primary)', zIndex: 1001, padding: '2rem', borderRadius: '24px', border: '1px solid var(--border-color)' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '1rem' }}>Update Stock: {selectedItem.name}</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Current stock: {selectedItem.stock} {selectedItem.unit}</p>
              <form onSubmit={handleUpdateStock} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                   <input type="number" value={selectedItem.stock} onChange={e => setSelectedItem({...selectedItem, stock: e.target.value})} style={{ ...inputStyle, textAlign: 'center', fontSize: '1.2rem' }} required />
                   <span style={{ fontWeight: '600' }}>{selectedItem.unit}</span>
                </div>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <button className="btn btn-primary" type="submit" style={{ flex: 1, padding: '1rem' }}>Update Stock</button>
                  <button className="btn" type="button" onClick={() => setIsUpdateModalOpen(false)} style={{ flex: 1, padding: '1rem', border: '1px solid var(--border-color)' }}>Cancel</button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── ITEM DETAILS MODAL ── */}
      <AnimatePresence>
        {detailsItem && (
          <>
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:1000, backdropFilter:'blur(4px)' }} onClick={() => setDetailsItem(null)} />
            <motion.div initial={{ y:40, opacity:0 }} animate={{ y:0, opacity:1 }} exit={{ y:40, opacity:0 }} style={{ position:'fixed', top:'20%', left:'50%', x:'-50%', width:'90%', maxWidth:'420px', background:'var(--bg-primary)', zIndex:1001, padding:'2rem', borderRadius:'24px', border:'1px solid var(--border-color)' }}>
              <h2 style={{ fontSize:'1.3rem', fontWeight:'800', marginBottom:'1.5rem' }}>{detailsItem.name}</h2>
              {[['Category', detailsItem.category], ['Current Stock', `${detailsItem.stock} ${detailsItem.unit}`], ['Min Threshold', `${detailsItem.minThreshold} ${detailsItem.unit}`], ['Last Updated', detailsItem.lastUpdated]].map(([l,v]) => (
                <div key={l} style={{ display:'flex', justifyContent:'space-between', padding:'0.7rem 0', borderBottom:'1px solid var(--border-color)' }}>
                  <span style={{ color:'var(--text-secondary)', fontSize:'0.88rem' }}>{l}</span>
                  <span style={{ fontWeight:'700' }}>{v}</span>
                </div>
              ))}
              <button className="btn" onClick={() => setDetailsItem(null)} style={{ width:'100%', marginTop:'1.5rem', border:'1px solid var(--border-color)', padding:'0.8rem' }}>Close</button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── RESTOCK PO MODAL ── */}
      <AnimatePresence>
        {restockOpen && (
          <>
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:1000, backdropFilter:'blur(4px)' }} onClick={() => { if (!restockSent) setRestockOpen(false); }} />
            <motion.div initial={{ y:50, opacity:0 }} animate={{ y:0, opacity:1 }} exit={{ y:50, opacity:0 }} style={{ position:'fixed', top:'8%', left:'50%', x:'-50%', width:'90%', maxWidth:'540px', background:'var(--bg-primary)', zIndex:1001, padding:'2rem', borderRadius:'24px', border:'1px solid var(--border-color)', maxHeight:'85vh', overflowY:'auto' }}>
              {restockSent ? (
                <div style={{ textAlign:'center', padding:'2rem 0' }}>
                  <div style={{ fontSize:'3rem', marginBottom:'1rem' }}>📦</div>
                  <h2 style={{ fontSize:'1.4rem', fontWeight:'800', color:'#10B981', marginBottom:'0.5rem' }}>Purchase Order Launched!</h2>
                  <p style={{ color:'var(--text-secondary)', marginBottom:'1.5rem' }}>Your restock PO has been generated and sent to the supplier.</p>
                  <button className="btn btn-primary" onClick={() => setRestockOpen(false)} style={{ padding:'0.9rem 2rem' }}>Done</button>
                </div>
              ) : (
                <>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem' }}>
                    <h2 style={{ fontSize:'1.3rem', fontWeight:'800', margin:0 }}>🛒 Launch Restock P.O.</h2>
                    <button onClick={() => setRestockOpen(false)} style={{ background:'var(--bg-tertiary)', border:'none', borderRadius:'50%', width:'32px', height:'32px', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}><X size={16}/></button>
                  </div>
                  <p style={{ color:'var(--text-secondary)', fontSize:'0.85rem', marginBottom:'1.2rem' }}>Review and adjust quantities for each item. Add extra items if needed.</p>
                  <div style={{ display:'flex', flexDirection:'column', gap:'0.8rem', marginBottom:'1.5rem' }}>
                    {restockItems.map((ri, idx) => (
                      <div key={idx} style={{ display:'flex', gap:'0.8rem', alignItems:'center', padding:'0.8rem', background:'var(--bg-tertiary)', borderRadius:'12px' }}>
                        <span style={{ flex:1, fontWeight:'700', fontSize:'0.9rem' }}>{ri.name}</span>
                        <input type="number" value={ri.needed} onChange={e => setRestockItems(prev => prev.map((r,i) => i===idx ? {...r, needed: e.target.value} : r))}
                          style={{ width:'70px', padding:'0.5rem', borderRadius:'8px', border:'1px solid var(--border-color)', background:'var(--bg-primary)', color:'var(--text-primary)', textAlign:'center', fontWeight:'700' }}/>
                        <span style={{ fontSize:'0.82rem', color:'var(--text-muted)', minWidth:'35px' }}>{ri.unit}</span>
                        <button onClick={() => setRestockItems(prev => prev.filter((_,i) => i!==idx))} style={{ background:'none', border:'none', cursor:'pointer', color:'#EF4444', padding:'0.2rem' }}><X size={14}/></button>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => setRestockItems(prev => [...prev, { name:'', needed:1, unit:'Units' }])} className="btn" style={{ width:'100%', border:'2px dashed var(--border-color)', background:'transparent', marginBottom:'1.5rem', padding:'0.7rem', color:'var(--text-secondary)', fontWeight:'700' }}>+ Add Extra Item</button>
                  {restockItems.length > 0 && restockItems.some(r => r.name) && (
                    <button className="btn btn-primary" onClick={() => setRestockSent(true)} style={{ width:'100%', padding:'1rem', fontSize:'1rem', fontWeight:'800', borderRadius:'12px' }}>✅ Confirm & Launch P.O.</button>
                  )}
                </>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

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
