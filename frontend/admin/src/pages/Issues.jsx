import React, { useState } from 'react';
import { MessageSquare, Wrench, Search, Filter, Download, FileText, Zap, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Complaints from './Complaints';
import Maintenance from './Maintenance';

const Issues = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = React.useState('complaints');

  return (
    <div className="space-y-6">
      {/* --- BACK NAVIGATION --- */}
      <button 
        onClick={() => navigate('/dashboard')}
        className="flex items-center gap-2 text-text-muted hover:text-primary transition-colors text-[10px] font-black uppercase tracking-[0.2em] group"
      >
        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
        Back to Dashboard
      </button>
      {/* --- TAB STRATEGY --- */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-2">
        <div>
          <h1 className="text-3xl font-black text-text-primary tracking-tight uppercase italic">Operations Hub</h1>
          <p className="text-sm text-text-muted mt-1 font-medium italic">Unified resolution center for tenant grievances and asset infrastructure</p>
        </div>
        
        <div className="flex bg-card p-1.5 rounded-2xl border border-divider shadow-subtle shrink-0 self-start lg:self-center">
          <button
            onClick={() => setActiveTab('complaints')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
              activeTab === 'complaints' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-text-muted hover:text-text-primary'
            }`}
          >
            <MessageSquare size={16} strokeWidth={2.5} /> Tenant Complaints
          </button>
          <button
            onClick={() => setActiveTab('maintenance')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
              activeTab === 'maintenance' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-text-muted hover:text-text-primary'
            }`}
          >
            <Wrench size={16} strokeWidth={2.5} /> Maintenance Tasks
          </button>
        </div>
      </div>

      <div className="h-px bg-border/50 -mx-4" />

      {/* --- RENDERER --- */}
      <div className="animate-fade">
         <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'complaints' ? <Complaints /> : <Maintenance />}
            </motion.div>
         </AnimatePresence>
      </div>
    </div>
  );
};

export default Issues;
