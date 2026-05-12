import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import { Sparkles, Brain, TrendingUp, AlertCircle, Zap, Shield, Target, Lightbulb, ArrowRight, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const RADAR_DATA = [
  { subject: 'Occupancy', A: 120, fullMark: 150 },
  { subject: 'Revenue', A: 98, fullMark: 150 },
  { subject: 'Retention', A: 86, fullMark: 150 },
  { subject: 'Maintenance', A: 99, fullMark: 150 },
  { subject: 'Efficiency', A: 85, fullMark: 150 },
  { subject: 'Growth', A: 65, fullMark: 150 },
];

const Insights = () => {
  const navigate = useNavigate();
  return (
    <div className="space-y-8 pb-10">
      {/* --- BACK NAVIGATION --- */}
      <button 
        onClick={() => navigate('/dashboard')}
        className="flex items-center gap-2 text-text-muted hover:text-primary transition-colors text-[10px] font-black uppercase tracking-[0.2em] group"
      >
        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
        Back to Dashboard
      </button>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary flex items-center gap-2">
             <Sparkles className="text-primary" /> Predictive Intelligence
          </h1>
          <p className="text-sm font-medium text-text-muted mt-1">AI-driven forecasts, demand modeling, and operational optimizations.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-xl">
           <Brain size={18} className="text-primary" />
           <span className="text-xs font-bold text-primary uppercase tracking-widest">Neural Engine Active</span>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Main Forecast Card */}
        <div className="col-span-12 lg:col-span-8 layer-2 p-8 bg-gradient-to-br from-primary/5 via-transparent to-accent/5">
           <div className="flex items-center justify-between mb-10">
              <div>
                 <h2 className="text-xl font-bold text-text-primary">Demand Forecast Model</h2>
                 <p className="text-xs text-text-muted mt-1">Simulated occupancy levels for the next 90 days based on historical trends.</p>
              </div>
              <div className="flex items-center gap-4">
                 <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                    <span className="text-[10px] font-bold text-text-muted uppercase">Predicted</span>
                 </div>
                 <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-border border border-dashed border-text-muted"></div>
                    <span className="text-[10px] font-bold text-text-muted uppercase">Actual</span>
                 </div>
              </div>
           </div>

           <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={[
                   { name: 'W1', val: 70 }, { name: 'W2', val: 75 }, { name: 'W3', val: 82 }, 
                   { name: 'W4', val: 78 }, { name: 'W5', val: 85 }, { name: 'W6', val: 92 },
                   { name: 'W7', val: 95 }, { name: 'W8', val: 88 }, { name: 'W9', val: 99 }
                 ]}>
                    <defs>
                       <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="rgb(var(--primary))" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="rgb(var(--primary))" stopOpacity={0}/>
                       </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgb(var(--border) / 0.5)" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11}} tickFormatter={(v) => `${v}%`} />
                    <Tooltip contentStyle={{ backgroundColor: 'rgb(var(--card))', borderRadius: '12px', border: 'none' }} />
                    <Area type="monotone" dataKey="val" stroke="rgb(var(--primary))" strokeWidth={4} fillOpacity={1} fill="url(#colorVal)" />
                 </AreaChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/* System Health Radar */}
        <div className="col-span-12 lg:col-span-4 layer-2 p-8 flex flex-col items-center">
           <h2 className="text-lg font-bold text-text-primary self-start mb-6">Operational Integrity</h2>
           <div className="w-full h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                 <RadarChart cx="50%" cy="50%" outerRadius="80%" data={RADAR_DATA}>
                    <PolarGrid stroke="rgb(var(--border))" />
                    <PolarAngleAxis dataKey="subject" tick={{fill: '#64748b', fontSize: 10, fontWeight: 'bold'}} />
                    <Radar name="Livora AI" dataKey="A" stroke="rgb(var(--primary))" fill="rgb(var(--primary))" fillOpacity={0.3} />
                 </RadarChart>
              </ResponsiveContainer>
           </div>
           <div className="mt-6 w-full space-y-4">
              <div className="p-4 rounded-2xl bg-background border border-border flex items-center justify-between group cursor-default">
                 <div className="flex items-center gap-3">
                    <Target size={18} className="text-primary" />
                    <span className="text-xs font-bold text-text-secondary">Efficiency Target</span>
                 </div>
                 <span className="text-xs font-black text-text-primary">94% / 100%</span>
              </div>
           </div>
        </div>

        {/* AI Recommendations */}
        <div className="col-span-12 space-y-6">
           <h2 className="text-xl font-bold text-text-primary">Strategic Recommendations</h2>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: 'Dynamic Pricing Opportunity', desc: 'Predicting 18% surge in Pune demand. Suggesting 5% price adjustment for vacant units.', icon: <Lightbulb />, color: 'primary' },
                { title: 'Retention Risk Alert', desc: '3 tenants in Bangalore show 85% churn probability due to service lag. Issue urgent maintenance voucher.', icon: <AlertCircle />, color: 'danger' },
                { title: 'Energy Optimization', desc: 'Auto-adjust HVAC schedules in common areas to save 12% on utility costs this month.', icon: <Zap />, color: 'success' }
              ].map((rec, i) => (
                <div key={i} className="layer-2 p-6 group hover:border-primary/30 transition-all cursor-pointer">
                   <div className={`w-12 h-12 rounded-2xl bg-${rec.color}/10 text-${rec.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      {rec.icon}
                   </div>
                   <h3 className="text-lg font-bold text-text-primary mb-2">{rec.title}</h3>
                   <p className="text-xs text-text-muted leading-relaxed mb-6">{rec.desc}</p>
                   <button className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-widest group-hover:gap-4 transition-all">
                      Apply Suggestion <ArrowRight size={14} />
                   </button>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default Insights;
