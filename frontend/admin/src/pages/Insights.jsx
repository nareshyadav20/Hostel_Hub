import React, { useState, useEffect } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Radar, RadarChart, PolarGrid, PolarAngleAxis
} from 'recharts';
import { Sparkles, Brain, Target, ArrowRight, ArrowLeft, Lightbulb, AlertCircle, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useToast } from '../context/ToastContext';

const iconMap = {
  'primary': <Lightbulb />,
  'danger': <AlertCircle />,
  'success': <Zap />
};

const Insights = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  const [radarData, setRadarData] = useState([]);
  const [forecastData, setForecastData] = useState([]);
  const [efficiencyTarget, setEfficiencyTarget] = useState('94% / 100%');
  const [recommendations, setRecommendations] = useState([]);
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        setLoading(true);
        const res = await API.get('/admin/insights');
        if (res.data) {
          setRadarData(res.data.radarData || []);
          setForecastData(res.data.forecastData || []);
          setEfficiencyTarget(res.data.efficiencyTarget || '94% / 100%');
          setRecommendations(res.data.recommendations || []);
        }
      } catch (err) {
        console.error('Failed to load predictive insights', err);
        showToast('Error loading neural intelligence forecasts.', 'danger');
      } finally {
        setLoading(false);
      }
    };
    fetchInsights();
  }, []);

  const handleApplySuggestion = (title) => {
    showToast(`Strategic recommendation "${title}" queued for execution.`, 'success');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      {/* --- BACK NAVIGATION --- */}
      <button 
        onClick={() => navigate('/dashboard')}
        className="flex items-center gap-2 text-text-muted hover:text-primary transition-colors text-[10px] font-black uppercase tracking-[0.2em] group bg-transparent border-none cursor-pointer"
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
                 <AreaChart data={forecastData}>
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
                 <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                    <PolarGrid stroke="rgb(var(--border))" />
                    <PolarAngleAxis dataKey="subject" tick={{fill: '#64748b', fontSize: 10, fontWeight: 'bold'}} />
                    <Radar name="StayNest AI" dataKey="A" stroke="rgb(var(--primary))" fill="rgb(var(--primary))" fillOpacity={0.3} />
                 </RadarChart>
              </ResponsiveContainer>
           </div>
           <div className="mt-6 w-full space-y-4">
              <div className="p-4 rounded-2xl bg-background border border-divider flex items-center justify-between group cursor-default">
                 <div className="flex items-center gap-3">
                    <Target size={18} className="text-primary" />
                    <span className="text-xs font-bold text-text-secondary">Efficiency Target</span>
                 </div>
                 <span className="text-xs font-black text-text-primary">{efficiencyTarget}</span>
              </div>
           </div>
        </div>

        {/* AI Recommendations */}
        <div className="col-span-12 space-y-6">
           <h2 className="text-xl font-bold text-text-primary">Strategic Recommendations</h2>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recommendations.map((rec, i) => (
                <div key={i} className="layer-2 p-6 group hover:border-primary/30 transition-all cursor-pointer" onClick={() => handleApplySuggestion(rec.title)}>
                   <div className={`w-12 h-12 rounded-2xl bg-${rec.color}/10 text-${rec.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      {iconMap[rec.color] || <Lightbulb />}
                   </div>
                   <h3 className="text-lg font-bold text-text-primary mb-2">{rec.title}</h3>
                   <p className="text-xs text-text-muted leading-relaxed mb-6">{rec.desc}</p>
                   <button className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-widest group-hover:gap-4 transition-all bg-transparent border-none cursor-pointer">
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
