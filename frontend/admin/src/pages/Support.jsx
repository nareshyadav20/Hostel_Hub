import React, { useState } from 'react';
import { 
  MessageCircle, BookOpen, LifeBuoy, Search, 
  ChevronRight, Send, Phone, Mail, Clock,
  DollarSign, Users, Building2, Wrench, Shield,
  ChevronDown, Plus, ExternalLink, HelpCircle,
  MessageSquare, FileText, CheckCircle2, AlertCircle, ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const Support = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('General');
  const [expandedFaq, setExpandedFaq] = useState(null);

  const categories = [
    { id: 'General', label: 'General Info', icon: <HelpCircle size={18} /> },
    { id: 'Payments', label: 'Billing & Payments', icon: <DollarSign size={18} /> },
    { id: 'Tenants', label: 'Tenant Relations', icon: <Users size={18} /> },
    { id: 'Properties', label: 'Property Assets', icon: <Building2 size={18} /> },
    { id: 'Technical', label: 'System Help', icon: <Wrench size={18} /> },
  ];

  const faqs = [
    {
      id: 1,
      cat: 'Payments',
      q: 'How do I generate a bulk rent manifest for all properties?',
      a: 'Navigate to the Finance Hub, select the current period, and click the "Excel" or "PDF" export cluster in the header. The system will automatically generate a consolidated fiscal manifest.',
    },
    {
      id: 2,
      cat: 'Tenants',
      q: 'How can I offboard a tenant with pending dues?',
      a: 'Go to the Residents manifest, select the tenant, and expand their profile. Use the "Decision Matrix" to initiate the Offboarding protocol. The system will prompt you to resolve outstanding dues before finalization.',
    },
    {
      id: 3,
      cat: 'General',
      q: 'How do I switch between Light and Dark mode?',
      a: 'The theme toggle is located in the top bar actions cluster, next to the notifications bell. Switching themes will instantly recalibrate all tactical UI tokens.',
    },
    {
      id: 4,
      cat: 'Technical',
      q: 'System is showing Recharts dimension warnings. Is this critical?',
      a: 'No, these are standard layout warnings during high-velocity UI transitions. I have implemented min-dimension containers to silence these warnings in the latest manifest deployment.',
    },
  ];

  const tickets = [
    { id: 'STK-4011', subject: 'API Integration Timeout', status: 'In Progress', priority: 'High', time: '2h ago' },
    { id: 'STK-4009', subject: 'Incorrect Tax Calculation', status: 'Resolved', priority: 'Medium', time: '1d ago' },
  ];

  return (
    <div className="space-y-10 pb-20 animate-fade">
      
      {/* --- BACK NAVIGATION --- */}
      <button 
        onClick={() => navigate('/dashboard')}
        className="flex items-center gap-2 text-text-muted hover:text-primary transition-colors text-[10px] font-black uppercase tracking-[0.2em] group"
      >
        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
        Back to Dashboard
      </button>
      {/* --- ELITE HEADER --- */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-text-primary tracking-tight uppercase italic">Intelligence & Support</h1>
          <p className="text-sm text-text-muted mt-1 font-medium italic">Tactical help manifest and administrative assistance command center</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
           <div className="flex items-center gap-2 bg-card border border-divider rounded-xl px-2 py-1 shadow-subtle">
              <button className="flex items-center gap-2 px-4 py-1.5 hover:bg-slate-50 dark:hover:bg-white/5 rounded-lg text-[10px] font-black uppercase tracking-widest text-text-secondary transition-all">
                <Phone size={14} className="text-emerald-500" /> Call Support
              </button>
              <div className="w-px h-4 bg-border" />
              <button className="flex items-center gap-2 px-4 py-1.5 hover:bg-slate-50 dark:hover:bg-white/5 rounded-lg text-[10px] font-black uppercase tracking-widest text-text-secondary transition-all">
                <Mail size={14} className="text-primary" /> Email Ops
              </button>
           </div>
           <button className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-dark transition-all shadow-lg shadow-primary/20">
             <MessageCircle size={16} strokeWidth={3} /> Start Live Chat
           </button>
        </div>
      </div>

      {/* --- SUPPORT HUD --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {[
           { label: 'Knowledge Base', sub: 'Guides, FAQs & Protocols', icon: <BookOpen />, color: 'primary' },
           { label: 'Contact Support', sub: '24/7 Administrative Help', icon: <MessageSquare />, color: 'success' },
           { label: 'System Health', sub: 'Technical & API Status', icon: <Shield />, color: 'accent' },
         ].map((stat, i) => (
           <div key={i} className="card-classic p-8 group hover:shadow-glow transition-all duration-500 relative overflow-hidden cursor-pointer">
              <div className={`absolute -right-4 -bottom-4 w-32 h-32 bg-${stat.color}/5 rounded-full blur-3xl group-hover:bg-${stat.color}/10 transition-all`} />
              <div className="flex items-center justify-between mb-6">
                 <div className={`w-14 h-14 rounded-2xl bg-${stat.color}/10 text-${stat.color} flex items-center justify-center border border-${stat.color}/10`}>
                    {React.cloneElement(stat.icon, { size: 24, strokeWidth: 2.5 })}
                 </div>
                 <ChevronRight className="text-text-muted group-hover:translate-x-1 transition-all" size={20} />
              </div>
              <h3 className="text-xl font-black text-text-primary tracking-tight uppercase italic">{stat.label}</h3>
              <p className="text-[11px] text-text-muted font-bold mt-1 uppercase tracking-widest">{stat.sub}</p>
           </div>
         ))}
      </div>

      <div className="grid grid-cols-12 gap-8">
         {/* --- LEFT: CATEGORIES --- */}
         <div className="col-span-12 lg:col-span-4 space-y-8">
            <div className="card-classic p-6 space-y-4">
               <h4 className="text-[11px] font-black text-text-primary uppercase tracking-[0.2em] mb-6">Intelligence Clusters</h4>
               <div className="space-y-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all border ${
                        activeCategory === cat.id 
                          ? 'bg-primary/5 border-primary/20 text-primary shadow-subtle' 
                          : 'bg-transparent border-transparent text-text-secondary hover:bg-slate-50 dark:hover:bg-white/2'
                      }`}
                    >
                       <div className="flex items-center gap-3">
                          <div className={activeCategory === cat.id ? 'text-primary' : 'text-text-muted'}>{cat.icon}</div>
                          <span className="text-[11px] font-black uppercase tracking-widest">{cat.label}</span>
                       </div>
                       {activeCategory === cat.id && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
                    </button>
                  ))}
               </div>
            </div>

            <div className="card-classic p-6 bg-slate-50/50 dark:bg-white/2 border-dashed">
               <h4 className="text-[11px] font-black text-text-primary uppercase tracking-[0.2em] mb-4">Tactical Status</h4>
               <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                     <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">API Nodes</span>
                     <span className="text-[10px] font-black text-emerald-600 uppercase italic">Operational</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-primary/5 border border-primary/10">
                     <span className="text-[10px] font-black text-primary uppercase tracking-widest">Database</span>
                     <span className="text-[10px] font-black text-primary uppercase italic">Synchronized</span>
                  </div>
               </div>
            </div>
         </div>

         {/* --- RIGHT: CONTENT --- */}
         <div className="col-span-12 lg:col-span-8 space-y-8">
            {/* Search Cluster */}
            <div className="relative group">
               <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-all duration-300" size={20} />
               <input 
                  type="text" 
                  className="w-full bg-card border border-divider rounded-3xl py-5 pl-16 pr-6 text-sm focus:outline-none focus:ring-8 focus:ring-primary/5 focus:border-primary transition-all text-text-primary shadow-premium"
                  placeholder="Ask a question or search for a protocol..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
               />
            </div>

            {/* FAQ Manifest */}
            <div className="space-y-4">
               <h3 className="text-sm font-black text-text-primary uppercase tracking-[0.2em] px-2 italic">Knowledge Manifest: {activeCategory}</h3>
               {faqs
                 .filter(f => activeCategory === 'General' || f.cat === activeCategory)
                 .map((faq) => (
                 <div 
                   key={faq.id} 
                   className={`card-classic overflow-hidden transition-all duration-500 ${expandedFaq === faq.id ? 'border-primary/30 ring-4 ring-primary/5' : ''}`}
                 >
                    <button 
                      onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                      className="w-full p-6 flex items-center justify-between text-left"
                    >
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-background border border-divider flex items-center justify-center text-text-muted group-hover:text-primary transition-all">
                             <HelpCircle size={18} />
                          </div>
                          <span className="text-[13px] font-black text-text-primary tracking-tight uppercase">{faq.q}</span>
                       </div>
                       <ChevronDown className={`text-text-muted transition-transform duration-500 ${expandedFaq === faq.id ? 'rotate-180 text-primary' : ''}`} size={20} />
                    </button>
                    <AnimatePresence>
                       {expandedFaq === faq.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="px-6 pb-6"
                          >
                             <div className="pt-4 border-t border-divider/50">
                                <p className="text-[12px] font-medium text-text-secondary leading-relaxed italic">"{faq.a}"</p>
                                <div className="mt-6 flex items-center gap-4">
                                   <button className="px-4 py-2 bg-primary/10 text-primary rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all italic">Protocol Detailed</button>
                                   <button className="text-[10px] font-black text-text-muted uppercase tracking-widest hover:text-primary transition-all">Was this helpful?</button>
                                </div>
                             </div>
                          </motion.div>
                       )}
                    </AnimatePresence>
                 </div>
               ))}
            </div>

            {/* Support Ticket Tracking */}
            <div className="card-classic overflow-hidden">
               <div className="p-6 border-b border-divider flex items-center justify-between bg-slate-50/50 dark:bg-white/2">
                  <h4 className="text-[11px] font-black text-text-primary uppercase tracking-[0.2em] flex items-center gap-2">
                    <Clock size={14} className="text-warning" /> Support Manifest
                  </h4>
                  <button className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline italic">View All Tickets</button>
               </div>
               <div className="divide-y divide-border/50">
                  {tickets.map((t) => (
                    <div key={t.id} className="p-6 flex items-center justify-between hover:bg-background/50 transition-all cursor-pointer group">
                       <div className="flex items-center gap-6">
                          <div>
                             <p className="text-[10px] font-black text-text-muted uppercase tracking-tighter">{t.id}</p>
                             <h5 className="text-[13px] font-black text-text-primary uppercase tracking-tight">{t.subject}</h5>
                          </div>
                          <div className="h-8 w-px bg-border mx-2" />
                          <div className="flex flex-col gap-1">
                             <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest border ${
                               t.status === 'Resolved' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-primary/10 text-primary border-primary/20'
                             }`}>{t.status}</span>
                             <span className="text-[9px] font-bold text-text-muted italic">{t.time}</span>
                          </div>
                       </div>
                       <button className="p-2.5 rounded-xl bg-background border border-divider text-text-muted group-hover:text-primary group-hover:border-primary transition-all">
                          <ExternalLink size={16} />
                       </button>
                    </div>
                  ))}
               </div>
            </div>

            {/* Quick Contact Form (Simplified) */}
            <div className="card-classic p-8 bg-gradient-to-br from-primary/5 to-accent/5 relative overflow-hidden border border-primary/20">
               <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none">
                  <MessageSquare size={120} className="text-primary" />
               </div>
               <div className="relative z-10 max-w-xl">
                  <h3 className="text-xl font-black text-text-primary tracking-tight uppercase italic mb-2">Escalate Issue</h3>
                  <p className="text-[11px] text-text-muted font-bold uppercase tracking-widest mb-8 leading-relaxed">Direct transmission to the administrative response force</p>
                  <div className="space-y-4">
                     <div className="grid grid-cols-2 gap-4">
                        <input type="text" placeholder="Personnel Name" className="w-full bg-card border border-divider rounded-xl py-3 px-4 text-xs font-bold focus:outline-none focus:border-primary" />
                        <input type="email" placeholder="Auth Email" className="w-full bg-card border border-divider rounded-xl py-3 px-4 text-xs font-bold focus:outline-none focus:border-primary" />
                     </div>
                     <textarea placeholder="Describe the operational anomaly..." rows={3} className="w-full bg-card border border-divider rounded-xl py-3 px-4 text-xs font-bold focus:outline-none focus:border-primary resize-none" />
                     <button className="flex items-center gap-2 px-8 py-3 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-dark transition-all shadow-lg shadow-primary/20">
                        <Send size={14} strokeWidth={3} /> Transmit Manifest
                     </button>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default Support;
