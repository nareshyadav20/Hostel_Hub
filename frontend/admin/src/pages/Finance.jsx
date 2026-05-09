import React, { useState } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from 'recharts';
import { 
  CreditCard, TrendingUp, ArrowUpRight, ArrowDownRight, 
  Download, Filter, Receipt, Wallet, Banknote, PieChart
} from 'lucide-react';

const REVENUE_DATA = [
  { month: 'Jan', amount: 450000, expenses: 120000 },
  { month: 'Feb', amount: 520000, expenses: 140000 },
  { month: 'Mar', amount: 480000, expenses: 110000 },
  { month: 'Apr', amount: 610000, expenses: 180000 },
  { month: 'May', amount: 590000, expenses: 160000 },
  { month: 'Jun', amount: 820000, expenses: 220000 },
];

const EXPENSE_CATEGORIES = [
  { name: 'Maintenance', value: 35, color: '#6366f1' },
  { name: 'Electricity', value: 25, color: '#10b981' },
  { name: 'Staff Salary', value: 20, color: '#f59e0b' },
  { name: 'Marketing', value: 10, color: '#3b82f6' },
  { name: 'Others', value: 10, color: '#ef4444' },
];

const Finance = () => {
  const [isExporting, setIsExporting] = useState(false);

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">Financial Intelligence</h1>
          <p className="text-sm font-medium text-text-muted mt-1">Global revenue tracking, expense management, and P&L analytics.</p>
        </div>
        <button 
          onClick={() => { setIsExporting(true); setTimeout(() => setIsExporting(false), 2000); }}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-all shadow-lg shadow-primary/20"
        >
          {isExporting ? 'Generating...' : <><Download size={18} /> Export Fin-Report</>}
        </button>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-12 gap-6">
        {[
          { label: 'Total Revenue', value: '₹42.5L', change: '+12.5%', icon: <Banknote />, color: 'primary' },
          { label: 'Net Profit', value: '₹28.4L', change: '+8.2%', icon: <TrendingUp />, color: 'success' },
          { label: 'Total Expenses', value: '₹14.1L', change: '+4.5%', icon: <Receipt />, color: 'danger' },
          { label: 'Wallet Balance', value: '₹8.2L', change: 'Stable', icon: <Wallet />, color: 'accent' }
        ].map((stat, i) => (
          <div key={i} className="col-span-12 md:col-span-6 lg:col-span-3 layer-2 p-6 group">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-2xl bg-${stat.color}/10 text-${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                {stat.icon}
              </div>
              <div className={`flex items-center gap-1 text-[10px] font-bold ${stat.color === 'danger' ? 'text-danger bg-danger/10' : 'text-success bg-success/10'} px-2 py-1 rounded-full`}>
                {stat.change}
              </div>
            </div>
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{stat.label}</p>
            <h3 className="text-2xl font-bold text-text-primary mt-1 tracking-tight">{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* Main Analytics Grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* Revenue vs Expenses Chart */}
        <div className="col-span-12 lg:col-span-8 layer-2 p-6">
           <div className="flex items-center justify-between mb-8">
              <h2 className="text-lg font-bold tracking-tight">Revenue vs Operating Expenses</h2>
              <select className="bg-background border border-border text-[10px] font-bold px-3 py-1.5 rounded-lg outline-none cursor-pointer">
                <option>Last 6 Months</option>
                <option>Year to Date</option>
              </select>
           </div>
           <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={REVENUE_DATA}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="rgb(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="rgb(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgb(var(--border) / 0.5)" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11}} tickFormatter={(val) => `₹${val/1000}k`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgb(var(--card))', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area type="monotone" dataKey="amount" name="Revenue" stroke="rgb(var(--primary))" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                  <Area type="monotone" dataKey="expenses" name="Expenses" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#colorExp)" />
                </AreaChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/* Expense Distribution */}
        <div className="col-span-12 lg:col-span-4 layer-2 p-6">
           <h2 className="text-lg font-bold tracking-tight mb-8">Expense Distribution</h2>
           <div className="h-[250px] mb-8">
              <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={EXPENSE_CATEGORIES} layout="vertical">
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11}} width={80} />
                    <Tooltip cursor={{fill: 'transparent'}} />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={12}>
                       {EXPENSE_CATEGORIES.map((entry, index) => (
                         <Cell key={`cell-${index}`} fill={entry.color} />
                       ))}
                    </Bar>
                 </BarChart>
              </ResponsiveContainer>
           </div>
           <div className="space-y-4">
              {EXPENSE_CATEGORIES.map((cat, i) => (
                <div key={i} className="flex items-center justify-between">
                   <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }}></div>
                      <span className="text-xs font-bold text-text-secondary uppercase">{cat.name}</span>
                   </div>
                   <span className="text-xs font-bold text-text-primary">{cat.value}%</span>
                </div>
              ))}
           </div>
        </div>
      </div>

      {/* Transaction Log */}
      <div className="layer-2 overflow-hidden">
        <div className="p-6 border-b border-border flex justify-between items-center">
          <h2 className="text-lg font-bold tracking-tight text-text-primary">Global Transaction Ledger</h2>
          <div className="flex gap-2">
             <button className="p-2 bg-background border border-border rounded-lg text-text-muted hover:text-primary transition-all"><Filter size={16} /></button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-card/20 border-b border-border">
                <th className="py-4 px-6 text-[9px] font-bold text-text-muted uppercase tracking-[0.2em]">Transaction ID</th>
                <th className="py-4 px-6 text-[9px] font-bold text-text-muted uppercase tracking-[0.2em]">Entity</th>
                <th className="py-4 px-6 text-[9px] font-bold text-text-muted uppercase tracking-[0.2em]">Category</th>
                <th className="py-4 px-6 text-[9px] font-bold text-text-muted uppercase tracking-[0.2em]">Amount</th>
                <th className="py-4 px-6 text-[9px] font-bold text-text-muted uppercase tracking-[0.2em]">Method</th>
                <th className="py-4 px-6 text-[9px] font-bold text-text-muted uppercase tracking-[0.2em]">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {[
                { id: 'TX-9021', entity: 'Sapphire PG - Electricity', cat: 'Utilities', amount: '-₹42,000', method: 'Bank Transfer', status: 'COMPLETED' },
                { id: 'TX-9022', entity: 'Arjun Das - Rent', cat: 'Revenue', amount: '+₹12,000', method: 'UPI', status: 'COMPLETED' },
                { id: 'TX-9023', entity: 'Zomato Vendor Pay', cat: 'Mess', amount: '-₹18,500', method: 'Wallet', status: 'PENDING' },
                { id: 'TX-9024', entity: 'Elite Living - Marketing', cat: 'Ads', amount: '-₹8,000', method: 'Credit Card', status: 'COMPLETED' },
              ].map((tx, i) => (
                <tr key={i} className="group hover:bg-background/50 transition-all cursor-pointer">
                  <td className="py-4 px-6 text-xs font-bold text-text-secondary">{tx.id}</td>
                  <td className="py-4 px-6 text-xs font-bold text-text-primary">{tx.entity}</td>
                  <td className="py-4 px-6">
                    <span className="px-2 py-0.5 rounded bg-background border border-border text-[10px] font-bold text-text-muted">{tx.cat}</span>
                  </td>
                  <td className={`py-4 px-6 text-xs font-bold ${tx.amount.startsWith('+') ? 'text-success' : 'text-danger'}`}>{tx.amount}</td>
                  <td className="py-4 px-6 text-xs text-text-muted">{tx.method}</td>
                  <td className="py-4 px-6">
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                      tx.status === 'COMPLETED' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
                    }`}>{tx.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Finance;
