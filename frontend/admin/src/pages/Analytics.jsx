import React, { useState } from 'react';
import { 
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { 
  Filter, Calendar, Download, TrendingUp, TrendingDown, 
  Brain, Zap, Target, Activity, DollarSign, Users, 
  ChevronRight, ArrowUpRight, ArrowDownRight, Sparkles, ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const REVENUE_VELOCITY = [
  { name: 'Jan', actual: 42, predicted: 40 },
  { name: 'Feb', actual: 48, predicted: 45 },
  { name: 'Mar', actual: 52, predicted: 50 },
  { name: 'Apr', actual: 58, predicted: 55 },
  { name: 'May', actual: 61, predicted: 60 },
  { name: 'Jun', actual: 72, predicted: 70 },
  { name: 'Jul', actual: 85, predicted: 80 },
];

const OCCUPANCY_MIX = [
  { name: 'Standard', value: 420, color: 'var(--primary)' },
  { name: 'Premium', value: 340, color: 'var(--accent)' },
  { name: 'Elite', value: 180, color: '#10b981' },
];

const PREDICTIONS = [
  { id: 1, metric: 'Aug Revenue', value: '₹92.4L', confidence: 94, trend: 'up', desc: 'Driven by seasonal student intake in Bangalore cluster.' },
  { id: 2, metric: 'Churn Risk', value: '2.1%', confidence: 88, trend: 'down', desc: 'Predictive reduction due to improved mess feedback loops.' },
];

const Analytics = () => {
  const navigate = useNavigate();
  const [range, setRange] = useState('Last 6 Months');

  return (
    <div className="space-y-6 animate-fade">
      {/* --- BACK NAVIGATION --- */}
      <button 
        onClick={() => navigate('/dashboard')}
        className="flex items-center gap-2 text-text-muted hover:text-primary transition-colors text-[10px] font-black uppercase tracking-[0.2em] group"
      >
        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
        Back to Dashboard
      </button>
      {/* --- TOP ROW: KPI SUMMARY --- */}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-4 layer-2 p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <DollarSign size={16} />
              </div>
              <span className="text-sm font-bold text-text-secondary tracking-tight">Total Portfolio Value</span>
            </div>
            <span className="text-[10px] font-bold text-success bg-success/10 px-2 py-0.5 rounded-full">+14.2%</span>
          </div>
          <div className="text-3xl font-bold text-text-primary tracking-tight">₹8.42 Cr</div>
          <div className="mt-4 flex items-center gap-2 text-xs text-text-muted">
            <Activity size={14} className="text-primary" />
            <span>82% Liquidity efficiency index</span>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4 layer-2 p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-accent/10 text-accent flex items-center justify-center">
                <Users size={16} />
              </div>
              <span className="text-sm font-bold text-text-secondary tracking-tight">Net Promoter Score (NPS)</span>
            </div>
            <span className="text-[10px] font-bold text-success bg-success/10 px-2 py-0.5 rounded-full">+4.2</span>
          </div>
          <div className="text-3xl font-bold text-text-primary tracking-tight">72.4</div>
          <div className="mt-4 flex items-center gap-2 text-xs text-text-muted">
            <Brain size={14} className="text-accent" />
            <span>AI sentiment analysis: "Highly Positive"</span>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4 layer-3 p-6 bg-gradient-to-br from-primary/10 to-accent/5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-primary animate-pulse" />
              <span className="text-sm font-bold text-text-primary tracking-tight">Growth Forecast</span>
            </div>
          </div>
          <div className="text-2xl font-bold text-text-primary mb-1">Q3 Goal: 94%</div>
          <p className="text-xs text-text-muted leading-relaxed">System predicts 92.4% occupancy based on current booking velocity.</p>
          <div className="mt-4 w-full h-1.5 bg-background rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full" style={{ width: '88%' }}></div>
          </div>
        </div>
      </div>

      {/* --- MIDDLE ROW: DEEP ANALYTICS --- */}
      <div className="grid grid-cols-12 gap-6">
        {/* Revenue Velocity Chart */}
        <div className="col-span-12 lg:col-span-8 layer-2 p-6 flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-lg font-bold text-text-primary tracking-tight">Revenue Velocity</h2>
              <p className="text-xs text-text-muted mt-1">Comparing Actual vs AI-Predicted Performance</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-md bg-background border border-divider text-text-secondary hover:bg-text-primary/5 transition-colors">
                <Calendar size={12} className="inline mr-2" /> {range}
              </button>
              <button className="p-1.5 rounded-md bg-primary text-white hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20">
                <Download size={14} />
              </button>
            </div>
          </div>
          
          <div className="flex-1 min-h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={REVENUE_VELOCITY}>
                <defs>
                  <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="rgb(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="rgb(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgb(var(--border) / 0.5)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'rgb(var(--text-muted))', fontSize: 11}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: 'rgb(var(--text-muted))', fontSize: 11}} tickFormatter={(val) => `₹${val}L`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgb(var(--card))', borderColor: 'rgb(var(--border))', borderRadius: '12px', fontSize: '12px' }}
                  itemStyle={{ padding: '2px 0' }}
                />
                <Area type="monotone" dataKey="actual" stroke="rgb(var(--primary))" strokeWidth={3} fillOpacity={1} fill="url(#colorActual)" />
                <Area type="monotone" dataKey="predicted" stroke="rgb(var(--text-muted))" strokeWidth={2} strokeDasharray="5 5" fillOpacity={0} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Portfolio Distribution */}
        <div className="col-span-12 lg:col-span-4 layer-2 p-6 flex flex-col">
          <h2 className="text-lg font-bold text-text-primary tracking-tight mb-8">Portfolio Mix</h2>
          <div className="flex-1 flex flex-col justify-center">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={OCCUPANCY_MIX}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {OCCUPANCY_MIX.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgb(var(--card))', borderColor: 'rgb(var(--border))', borderRadius: '12px', fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-8 space-y-3">
              {OCCUPANCY_MIX.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-background border border-divider group hover:border-primary/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: item.color }}></div>
                    <span className="text-xs font-semibold text-text-secondary group-hover:text-text-primary transition-colors">{item.name} Units</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-text-primary">{item.value}</span>
                    <span className="text-[10px] text-text-muted">{Math.round((item.value / 940) * 100)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* --- BOTTOM ROW: AI PREDICTIVE INSIGHTS --- */}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 layer-3 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Zap size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-text-primary tracking-tight">AI Predictive Engine</h2>
              <p className="text-xs text-text-muted">Analyzing 1.2M historical data points for Q3 projections</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {PREDICTIONS.map((pred) => (
              <div key={pred.id} className="p-5 rounded-2xl bg-background border border-divider hover:border-primary/40 transition-all group relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Brain size={80} />
                </div>
                <div className="flex justify-between items-start mb-4">
                  <span className="text-xs font-bold text-text-muted uppercase tracking-widest">{pred.metric}</span>
                  <div className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${pred.trend === 'up' ? 'bg-success/10 text-success' : 'bg-success/10 text-success'}`}>
                    {pred.confidence}% CONFIDENCE
                  </div>
                </div>
                <div className="flex items-end gap-3 mb-3">
                  <span className="text-3xl font-bold text-text-primary tracking-tight">{pred.value}</span>
                  <span className={`text-xs font-bold flex items-center gap-0.5 mb-1 ${pred.trend === 'up' ? 'text-success' : 'text-success'}`}>
                    {pred.trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                    {pred.trend === 'up' ? '+18.4%' : '-2.4%'}
                  </span>
                </div>
                <p className="text-xs text-text-muted leading-relaxed pr-8">{pred.desc}</p>
                <button className="mt-4 flex items-center gap-2 text-[10px] font-bold text-primary uppercase tracking-widest group-hover:gap-3 transition-all">
                  Analyze Root Cause <ChevronRight size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
