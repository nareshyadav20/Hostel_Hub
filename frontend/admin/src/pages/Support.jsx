import React, { useState, useEffect } from 'react';
import { 
  MessageCircle, BookOpen, LifeBuoy, Search, 
  ChevronRight, Send, Phone, Mail, Clock,
  DollarSign, Users, Building2, Wrench, Shield,
  ChevronDown, ExternalLink, HelpCircle,
  MessageSquare, ArrowLeft, XCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import Modal from '../components/Modal';
import API from '../api/axios';

const iconMap = {
  'HelpCircle': <HelpCircle size={18} />,
  'DollarSign': <DollarSign size={18} />,
  'Users': <Users size={18} />,
  'Building2': <Building2 size={18} />,
  'Wrench': <Wrench size={18} />,
};

const Support = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('General');
  const [expandedFaq, setExpandedFaq] = useState(null);

  // Dynamic States from DB
  const [categories, setCategories] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [showCallModal, setShowCallModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [emailForm, setEmailForm] = useState({ department: 'Operations', subject: '', body: '', priority: 'Medium' });
  const [callDialing, setCallDialing] = useState(false);
  const [callConnected, setCallConnected] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);

  // Escalate ticket states
  const [escalateName, setEscalateName] = useState('');
  const [escalateEmail, setEscalateEmail] = useState('');
  const [escalateDesc, setEscalateDesc] = useState('');

  // Fetch Support details on mount
  useEffect(() => {
    const fetchSupport = async () => {
      try {
        setLoading(true);
        const res = await API.get('/admin/support');
        if (res.data) {
          setCategories(res.data.categories || []);
          setFaqs(res.data.faqs || []);
          setTickets(res.data.tickets || []);
          setChatMessages(res.data.chatLogs || []);
        }
      } catch (err) {
        console.error('Failed to load support data', err);
        showToast('Error syncing with live support manifest.', 'danger');
      } finally {
        setLoading(false);
      }
    };
    fetchSupport();
  }, []);

  const handleCallSupport = () => { setShowCallModal(true); setCallDialing(false); setCallConnected(false); };
  const handleEmailOps = () => setShowEmailModal(true);
  const handleLiveChat = () => setShowChatModal(true);

  const initiateCall = () => {
    setCallDialing(true);
    setTimeout(() => { setCallDialing(false); setCallConnected(true); }, 2500);
  };

  const endCall = () => { setCallConnected(false); setShowCallModal(false); showToast('Call session ended.', 'info'); };

  const sendChatMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    
    // Optimistically add user message locally
    const typedText = chatInput;
    setChatInput('');
    setChatMessages(prev => [...prev, { from: 'user', text: typedText, time: 'Just now' }]);
    
    try {
      const res = await API.post('/admin/support/chat', { message: typedText });
      if (res.data) {
        // Sync full dialog logs from server
        setChatMessages(res.data.chatLogs || []);
      }
    } catch (err) {
      console.error('Failed to send support chat message', err);
      showToast('Failed to transmit message to tactical agent.', 'danger');
    }
  };

  const sendEmail = async (e) => {
    e.preventDefault();
    setSendingEmail(true);
    await new Promise(r => setTimeout(r, 1500));
    setSendingEmail(false);
    setShowEmailModal(false);
    setEmailForm({ department: 'Operations', subject: '', body: '', priority: 'Medium' });
    showToast(`Email dispatched to ${emailForm.department} ops team!`, 'success');
  };

  const handleTransmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/admin/support/escalate', {
        name: escalateName,
        email: escalateEmail,
        description: escalateDesc
      });
      if (res.data) {
        setTickets(res.data.support.tickets || []);
        showToast("Incident report securely transmitted to tactical ops command.", "success");
        setEscalateName('');
        setEscalateEmail('');
        setEscalateDesc('');
      }
    } catch (err) {
      console.error('Failed to escalate support ticket', err);
      showToast('Failed to escalate incident report.', 'danger');
    }
  };

  const getCategoryIcon = (id) => {
    switch(id) {
      case 'Payments': return <DollarSign size={18} />;
      case 'Tenants': return <Users size={18} />;
      case 'Properties': return <Building2 size={18} />;
      case 'Technical': return <Wrench size={18} />;
      default: return <HelpCircle size={18} />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-20 animate-fade">
      
      {/* --- BACK NAVIGATION --- */}
      <button 
        onClick={() => navigate('/dashboard')}
        className="flex items-center gap-2 text-text-muted hover:text-primary transition-colors text-[10px] font-black uppercase tracking-[0.2em] group bg-transparent border-none cursor-pointer"
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
              <button onClick={handleCallSupport} className="flex items-center gap-2 px-4 py-1.5 hover:bg-slate-50 dark:hover:bg-white/5 rounded-lg text-[10px] font-black uppercase tracking-widest text-text-secondary transition-all bg-transparent border-none cursor-pointer">
                <Phone size={14} className="text-emerald-500" /> Call Support
              </button>
              <div className="w-px h-4 bg-border" />
              <button onClick={handleEmailOps} className="flex items-center gap-2 px-4 py-1.5 hover:bg-slate-50 dark:hover:bg-white/5 rounded-lg text-[10px] font-black uppercase tracking-widest text-text-secondary transition-all bg-transparent border-none cursor-pointer">
                <Mail size={14} className="text-primary" /> Email Ops
              </button>
           </div>
           <button onClick={handleLiveChat} className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 cursor-pointer border-none">
             <MessageCircle size={16} strokeWidth={3} /> Start Live Chat
           </button>
        </div>
      </div>

      {/* --- SUPPORT HUD --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {[
           { label: 'Knowledge Base', sub: 'Guides, FAQs & Protocols', icon: <BookOpen />, color: 'primary', onClick: () => showToast("Knowledge Base Protocol Manifest opened.", "info") },
           { label: 'Contact Support', sub: '24/7 Administrative Help', icon: <MessageSquare />, color: 'success', onClick: () => { document.querySelector('form')?.scrollIntoView({ behavior: 'smooth' }); showToast("Support contact channels loaded.", "info"); } },
           { label: 'System Health', sub: 'Technical & API Status', icon: <Shield />, color: 'accent', onClick: () => showToast("Operational Node Diagnostic: 100% Green Status.", "success") },
         ].map((stat, i) => (
           <div key={i} onClick={stat.onClick} className="card-classic p-8 group hover:shadow-glow transition-all duration-500 relative overflow-hidden cursor-pointer">
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
                      className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all border cursor-pointer text-left ${
                        activeCategory === cat.id 
                          ? 'bg-primary/5 border-primary/20 text-primary shadow-subtle' 
                          : 'bg-transparent border-transparent text-text-secondary hover:bg-background'
                      }`}
                    >
                       <div className="flex items-center gap-3">
                          <div className={activeCategory === cat.id ? 'text-primary' : 'text-text-muted'}>
                            {getCategoryIcon(cat.id)}
                          </div>
                          <span className="text-[11px] font-black uppercase tracking-widest">{cat.label}</span>
                       </div>
                       {activeCategory === cat.id && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
                    </button>
                  ))}
               </div>
            </div>

            <div className="card-classic p-6 bg-surface border-dashed">
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
                 .filter(f => f.q.toLowerCase().includes(searchTerm.toLowerCase()) || f.a.toLowerCase().includes(searchTerm.toLowerCase()))
                 .map((faq) => (
                 <div 
                    key={faq.id} 
                    className={`card-classic overflow-hidden transition-all duration-500 ${expandedFaq === faq.id ? 'border-primary/30 ring-4 ring-primary/5' : ''}`}
                 >
                    <button 
                      onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                      className="w-full p-6 flex items-center justify-between text-left bg-transparent border-none cursor-pointer"
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
                                   <button onClick={() => showToast("Opening Detailed System Protocol Guide...", "info")} className="px-4 py-2 bg-primary/10 text-primary rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all italic border-none cursor-pointer">Protocol Detailed</button>
                                   <button onClick={() => showToast("Feedback registered. Thank you!", "success")} className="text-[10px] font-black text-text-muted uppercase tracking-widest hover:text-primary transition-all bg-transparent border-none cursor-pointer">Was this helpful?</button>
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
               <div className="p-6 border-b border-divider flex items-center justify-between bg-surface">
                  <h4 className="text-[11px] font-black text-text-primary uppercase tracking-[0.2em] flex items-center gap-2">
                    <Clock size={14} className="text-warning" /> Support Manifest
                  </h4>
                  <button onClick={() => showToast("Opening Support Ticket Archive...", "info")} className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline italic bg-transparent border-none cursor-pointer">View All Tickets</button>
               </div>
               <div className="divide-y divide-border/50">
                  {tickets.map((t) => (
                    <div key={t.id} onClick={() => showToast(`Opening Ticket Details for ${t.id}...`, "info")} className="p-6 flex items-center justify-between hover:bg-background/50 transition-all cursor-pointer group">
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
                       <button onClick={(e) => { e.stopPropagation(); showToast(`Opening Ticket Details for ${t.id}...`, "info"); }} className="p-2.5 rounded-xl bg-background border border-divider text-text-muted group-hover:text-primary group-hover:border-primary transition-all cursor-pointer">
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
                  <form onSubmit={handleTransmit} className="space-y-4">
                     <div className="grid grid-cols-2 gap-4">
                        <input required type="text" placeholder="Personnel Name" value={escalateName} onChange={e => setEscalateName(e.target.value)} className="w-full bg-card border border-divider rounded-xl py-3 px-4 text-xs font-bold focus:outline-none focus:border-primary text-text-primary" />
                        <input required type="email" placeholder="Auth Email" value={escalateEmail} onChange={e => setEscalateEmail(e.target.value)} className="w-full bg-card border border-divider rounded-xl py-3 px-4 text-xs font-bold focus:outline-none focus:border-primary text-text-primary" />
                     </div>
                     <textarea required placeholder="Describe the operational anomaly..." value={escalateDesc} onChange={e => setEscalateDesc(e.target.value)} rows={3} className="w-full bg-card border border-divider rounded-xl py-3 px-4 text-xs font-bold focus:outline-none focus:border-primary resize-none text-text-primary" />
                     <button type="submit" className="flex items-center gap-2 px-8 py-3 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 cursor-pointer border-none">
                        <Send size={14} strokeWidth={3} /> Transmit Manifest
                     </button>
                  </form>
               </div>
            </div>
         </div>
      </div>

      {/* Call Support Modal */}
      <Modal isOpen={showCallModal} onClose={() => setShowCallModal(false)} title="Tactical VoIP Channel">
        <div className="p-8 text-center space-y-6">
          <div className="w-24 h-24 rounded-full bg-emerald-500/10 mx-auto flex items-center justify-center relative">
             <Phone size={40} className="text-emerald-500 relative z-10" />
             {callDialing && <div className="absolute inset-0 rounded-full border-2 border-emerald-500 animate-ping opacity-50" />}
             {callConnected && <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-pulse" />}
          </div>
          <div>
            <h3 className="text-xl font-black text-text-primary uppercase tracking-tight">StayNest Elite Support</h3>
            <p className="text-sm text-text-muted mt-2">{callConnected ? 'Connected - Live Agent' : callDialing ? 'Establishing secure connection...' : 'Ready to initiate call'}</p>
          </div>
          <div className="flex justify-center gap-4 pt-4">
            {!callConnected && !callDialing && (
               <button onClick={initiateCall} className="px-8 py-3 bg-emerald-500 text-white rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-all flex items-center gap-2 cursor-pointer border-none">
                 <Phone size={14} /> Connect Now
               </button>
            )}
            {(callDialing || callConnected) && (
               <button onClick={endCall} className="px-8 py-3 bg-rose-500 text-white rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-rose-500/20 hover:bg-rose-600 transition-all flex items-center gap-2 cursor-pointer border-none">
                 <XCircle size={14} /> End Call
               </button>
            )}
          </div>
        </div>
      </Modal>

      {/* Email Ops Modal */}
      <Modal isOpen={showEmailModal} onClose={() => setShowEmailModal(false)} title="Secure Mail Transmission">
        <form onSubmit={sendEmail} className="p-6 space-y-5">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Target Division</label>
            <select value={emailForm.department} onChange={(e) => setEmailForm({...emailForm, department: e.target.value})} className="w-full bg-background border border-divider rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-primary text-text-primary cursor-pointer">
              <option>Operations</option>
              <option>Technical Support</option>
              <option>Finance & Billing</option>
              <option>Legal & Compliance</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Subject</label>
            <input required type="text" value={emailForm.subject} onChange={(e) => setEmailForm({...emailForm, subject: e.target.value})} className="w-full bg-background border border-divider rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-primary text-text-primary" placeholder="Brief subject line" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Message Body</label>
            <textarea required rows={5} value={emailForm.body} onChange={(e) => setEmailForm({...emailForm, body: e.target.value})} className="w-full bg-background border border-divider rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-primary text-text-primary resize-none" placeholder="Provide detailed operational intelligence..." />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-divider">
            <button type="button" onClick={() => setShowEmailModal(false)} className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-text-muted hover:text-text-primary transition-all bg-transparent border-none cursor-pointer">Cancel</button>
            <button type="submit" disabled={sendingEmail} className="px-8 py-3 bg-primary text-white rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all disabled:opacity-50 flex items-center gap-2 cursor-pointer border-none">
              {sendingEmail ? <span className="animate-pulse">Transmitting...</span> : <><Send size={14} /> Dispatch Mail</>}
            </button>
          </div>
        </form>
      </Modal>

      {/* Live Chat Modal */}
      <Modal isOpen={showChatModal} onClose={() => setShowChatModal(false)} title="Live Ops Chat" width="max-w-2xl">
        <div className="flex flex-col h-[60vh]">
          <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
            {chatMessages.map((msg, i) => (
              <div key={i} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl p-4 ${msg.from === 'user' ? 'bg-primary text-white rounded-tr-sm' : 'bg-background border border-divider text-text-primary rounded-tl-sm'}`}>
                   <p className="text-sm leading-relaxed">{msg.text}</p>
                   <span className={`text-[9px] font-bold block mt-2 uppercase tracking-widest ${msg.from === 'user' ? 'text-primary-100' : 'text-text-muted'}`}>{msg.time}</span>
                </div>
              </div>
            ))}
          </div>
          <form onSubmit={sendChatMessage} className="p-4 border-t border-divider bg-card">
             <div className="relative flex items-center">
                <input type="text" value={chatInput} onChange={e => setChatInput(e.target.value)} placeholder="Type your message..." className="w-full bg-background border border-divider rounded-full py-4 pl-6 pr-16 text-sm focus:outline-none focus:border-primary text-text-primary shadow-inner" />
                <button type="submit" disabled={!chatInput.trim()} className="absolute right-2 p-3 bg-primary text-white rounded-full hover:bg-primary-dark transition-all disabled:opacity-50 shadow-md cursor-pointer border-none flex items-center justify-center">
                   <Send size={16} />
                </button>
             </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default Support;
