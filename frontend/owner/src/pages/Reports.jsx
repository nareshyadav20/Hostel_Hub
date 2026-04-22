import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileBarChart, Download, Calendar, Filter, FileText, PieChart, TrendingUp, Users } from 'lucide-react';

const Reports = () => {
  const [selectedReport, setSelectedReport] = useState('revenue');
  
  const reportTypes = [
    { id: 'revenue', name: 'Revenue & Occupancy', icon: <TrendingUp size={18} /> },
    { id: 'expenses', name: 'Expenses & Maintenance', icon: <PieChart size={18} /> },
    { id: 'tenants', name: 'Tenant Churn & Attrition', icon: <Users size={18} /> },
    { id: 'custom', name: 'Custom Builder', icon: <FileText size={18} /> }
  ];

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
          <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
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
        <div className="card" style={{ padding: '3rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '500px', background: 'var(--bg-tertiary)', border: '2px dashed var(--border-color)' }}>
           
           <div style={{ background: 'var(--bg-primary)', padding: '2rem', borderRadius: '50%', marginBottom: '1.5rem', boxShadow: '0 10px 40px rgba(0,0,0,0.05)' }}>
             <FileBarChart size={64} color="var(--accent-primary)" opacity={0.8} />
           </div>
           <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '1rem' }}>Select metrics to generate report</h2>
           <p style={{ color: 'var(--text-secondary)', textAlign: 'center', maxWidth: '400px', marginBottom: '2rem' }}>
             Currently viewing the <b>{reportTypes.find(r => r.id === selectedReport)?.name}</b> module. Define your parameters and run the report to visualize data.
           </p>

           <div style={{ display: 'flex', gap: '1rem' }}>
             <button className="btn" style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
               <Filter size={16} /> Add Filters
             </button>
             <button className="btn btn-primary" style={{ padding: '0.8rem 2rem' }}>
                Generate Visuals
             </button>
           </div>
           
        </div>
      </div>
    </div>
  );
};

export default Reports;
