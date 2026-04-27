import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileBarChart, Download, Calendar, Filter, FileText, PieChart, TrendingUp, Users } from 'lucide-react';

const Reports = () => {
  const [selectedReport, setSelectedReport] = useState('revenue');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const reportTypes = [
    { id: 'revenue', name: 'Revenue & Occupancy', icon: <TrendingUp size={18} /> },
    { id: 'expenses', name: 'Expenses & Maintenance', icon: <PieChart size={18} /> },
    { id: 'tenants', name: 'Tenant Churn & Attrition', icon: <Users size={18} /> },
    { id: 'custom', name: 'Custom Builder', icon: <FileText size={18} /> }
  ];

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => setIsGenerating(false), 1500);
  };

  const handleExport = () => {
    alert(`Exporting ${selectedReport} report as PDF...`);
  };

  return (
    <div className="reports-page" style={{ animation: 'fadeIn 0.5s ease-out' }}>
      <header style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: '800', marginBottom: '0.4rem', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileBarChart size={32} color="var(--accent-primary)" /> Reports & Analytics
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>Generate, view, and export detailed business performance data.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
             <Calendar size={16} /> Last 30 Days
          </button>
          <button onClick={handleExport} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Download size={16} /> Export Selected
          </button>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(250px, 1fr) 3fr', gap: '2rem' }}>
        
        {/* Left Column: Report Types */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--text-secondary)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Report Modules</h3>
          {reportTypes.map((rt) => (
             <button 
               key={rt.id}
               onClick={() => setSelectedReport(rt.id)}
               className="btn"
               style={{ 
                 display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '1rem 1.2rem', 
                 justifyContent: 'flex-start', fontSize: '1rem', fontWeight: selectedReport === rt.id ? '700' : '500',
                 background: selectedReport === rt.id ? 'var(--bg-tertiary)' : 'transparent',
                 color: selectedReport === rt.id ? 'var(--accent-primary)' : 'var(--text-primary)',
                 border: '1px solid', borderColor: selectedReport === rt.id ? 'var(--accent-primary)' : 'transparent',
                 transition: 'var(--transition-fast)', borderRadius: '12px'
               }}
             >
                {rt.icon} {rt.name}
             </button>
          ))}
        </div>

        {/* Right Column: Report Display Area */}
        <div className="card" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', minHeight: '550px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}>
           
           {!isGenerating ? (
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: '800' }}>{reportTypes.find(r => r.id === selectedReport)?.name}</h2>
                  <div style={{ display: 'flex', gap: '0.8rem' }}>
                    <button className="btn" onClick={() => setIsFilterModalOpen(true)} style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                      <Filter size={14} /> Add Filters
                    </button>
                    <button className="btn btn-primary" onClick={handleGenerate} style={{ padding: '0.6rem 1.2rem', fontSize: '0.85rem' }}>
                        Run Analysis
                    </button>
                  </div>
                </div>

                {/* Mock Visualizations based on selected report */}
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
                   {/* Main Chart Card */}
                   <div className="card" style={{ padding: '1.5rem', background: 'var(--bg-primary)', minHeight: '300px', display: 'flex', flexDirection: 'column' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                         <p style={{ fontWeight: '700', fontSize: '0.9rem' }}>Monthly Performance Trend</p>
                         <div style={{ display: 'flex', gap: '1rem' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}><div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent-primary)' }}/> Revenue</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}><div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent-success)' }}/> Occupancy</span>
                         </div>
                      </div>
                      
                      {/* CSS-based Mock Line Chart */}
                      <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', gap: '5%', paddingBottom: '2rem', position: 'relative' }}>
                         {[40, 70, 45, 90, 65, 80, 95].map((h, i) => (
                           <div key={i} style={{ flex: 1, height: `${h}%`, background: 'var(--accent-primary)', opacity: 0.8, borderRadius: '4px 4px 0 0', position: 'relative' }}>
                              <div style={{ position: 'absolute', bottom: '-25px', left: '50%', transform: 'translateX(-50%)', fontSize: '0.7rem', color: 'var(--text-muted)' }}>M{i+1}</div>
                           </div>
                         ))}
                         {/* Overlaying line would go here in real chart */}
                      </div>
                   </div>

                   {/* Stats Side Card */}
                   <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <div className="card" style={{ padding: '1rem', background: 'var(--bg-primary)' }}>
                         <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700', marginBottom: '0.5rem' }}>AVG OCCUPANCY</p>
                         <p style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--accent-success)' }}>92.4%</p>
                      </div>
                      <div className="card" style={{ padding: '1rem', background: 'var(--bg-primary)' }}>
                         <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700', marginBottom: '0.5rem' }}>NET PROFIT MARGIN</p>
                         <p style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--accent-primary)' }}>64.2%</p>
                      </div>
                      <div className="card" style={{ padding: '1rem', background: 'var(--bg-primary)' }}>
                         <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700', marginBottom: '0.5rem' }}>MAINTENANCE COST</p>
                         <p style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--accent-error)' }}>₹14,500</p>
                      </div>
                   </div>
                </div>
             </motion.div>
           ) : (
             <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <motion.div 
                  animate={{ rotate: 360 }} 
                  transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                  style={{ width: '40px', height: '40px', border: '3px solid var(--border-color)', borderTopColor: 'var(--accent-primary)', borderRadius: '50%', marginBottom: '1.5rem' }}
                />
                <h3 style={{ fontSize: '1.2rem', fontWeight: '700' }}>Aggregating Data...</h3>
                <p style={{ color: 'var(--text-muted)' }}>Processing MongoDB pipelines for {selectedReport} metrics.</p>
             </div>
           )}
           
        </div>
      </div>

      <AnimatePresence>
        {isFilterModalOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, backdropFilter: 'blur(4px)' }} onClick={() => setIsFilterModalOpen(false)} />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} style={{ position: 'fixed', top: '25%', left: '50%', x: '-50%', width: '90%', maxWidth: '400px', background: 'var(--bg-primary)', zIndex: 1001, padding: '2rem', borderRadius: '24px', border: '1px solid var(--border-color)' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '1.5rem' }}>Report Filters</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                <div>
                   <label style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>Building</label>
                   <select style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}>
                      <option>All Buildings</option>
                      <option>Building A</option>
                      <option>Building B</option>
                   </select>
                </div>
                <div>
                   <label style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>Category Filter</label>
                   <select style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}>
                      <option>All Categories</option>
                      <option>Rent Only</option>
                      <option>Services & Mess</option>
                      <option>Late Fees</option>
                   </select>
                </div>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <button className="btn btn-primary" onClick={() => setIsFilterModalOpen(false)} style={{ flex: 1, padding: '1rem' }}>Apply Filters</button>
                  <button className="btn" onClick={() => setIsFilterModalOpen(false)} style={{ flex: 1, padding: '1rem', border: '1px solid var(--border-color)' }}>Clear All</button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Reports;
