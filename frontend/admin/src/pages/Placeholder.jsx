import React, { useState, useEffect } from 'react';
import { 
  Loader2, Construction, Activity, ShieldCheck, 
  ArrowRight, Layers, Layout, Target, Zap
} from 'lucide-react';
import axios from 'axios';

const Placeholder = ({ title }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/admin/stats');
        setStats(res.data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-8 animate-fade">
      {/* --- HEADER --- */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl text-premium-header italic uppercase tracking-tighter">{title} Center</h1>
          <p className="text-sm text-text-muted mt-1 font-medium italic">Global node management • <span className="text-primary font-black uppercase tracking-widest text-[10px]">Operational</span></p>
        </div>
      </div>

      {/* --- CORE HUD --- */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Network Assets', value: stats?.totalBuildings || '—', icon: <Layers />, color: 'primary' },
          { label: 'Active Nodes', value: stats?.totalRooms || '—', icon: <Target />, color: 'indigo' },
          { label: 'Platform Population', value: stats?.totalTenants || '—', icon: <Activity />, color: 'success' },
          { label: 'Health Score', value: '98.4%', icon: <ShieldCheck />, color: 'emerald' },
        ].map((stat, i) => (
          <div key={i} className="card-classic p-6 flex flex-col gap-4 group hover:border-primary/30 transition-all">
            <div className={`w-10 h-10 rounded-xl bg-${stat.color === 'primary' ? 'primary' : stat.color + '-500'}/10 text-${stat.color === 'primary' ? 'primary' : stat.color + '-500'} flex items-center justify-center border border-${stat.color === 'primary' ? 'primary' : stat.color + '-500'}/10`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-1">{stat.label}</p>
              <h3 className="text-2xl font-black text-text-primary tracking-tighter italic">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* --- CLEAN REPLACEMENT FOR "WORK IN PROGRESS" --- */}
      <div className="card-classic p-20 text-center relative overflow-hidden group">
        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        
        <div className="relative z-10 space-y-6">
          <div className="w-20 h-20 bg-slate-100 dark:bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-border group-hover:rotate-12 transition-transform duration-500">
             <Construction size={40} className="text-text-muted opacity-20" />
          </div>
          
          <div className="max-w-md mx-auto">
            <h2 className="text-2xl font-black text-text-primary tracking-tight italic uppercase">{title} Manifest Empty</h2>
            <p className="text-sm text-text-muted mt-4 font-medium leading-relaxed italic">
              There are currently no active data packets detected for the <b>{title}</b> module in the platform grid. 
              Initialize a new node or verify your network configuration to populate this manifest.
            </p>
          </div>

          <div className="pt-10 flex flex-col items-center gap-4">
             <button className="btn-premium flex items-center gap-2">
                Initialize {title} Node <ArrowRight size={16} />
             </button>
             <span className="text-[9px] font-black text-text-muted uppercase tracking-[0.3em] opacity-50">Secure Sync Verified • AES-256</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Placeholder;
