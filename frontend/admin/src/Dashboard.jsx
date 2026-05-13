import React from 'react';
import { 
  Building2, UserCheck, Users, Activity, 
  CreditCard, Package, TrendingUp, TrendingDown,
  ShieldAlert, ShieldCheck, Database, Lock, Globe,
  Search, Bell, ChevronDown, Filter, Download, MoreVertical,
  Plus
} from 'lucide-react';
import { motion } from 'framer-motion';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, BarChart, Bar, Cell
} from 'recharts';

// --- MOCK DATA ---
const stats = [
  { label: 'Total Hostels', value: '1,284', trend: '+12%', icon: <Building2 className="text-primary" /> },
  { label: 'Total Owners', value: '842', trend: '+5%', icon: <UserCheck className="text-success" /> },
  { label: 'Total Tenants', value: '24,592', trend: '+18%', icon: <Users className="text-accent" /> },
  { label: 'Active Staff', value: '3,120', trend: '+8%', icon: <Activity className="text-primary" /> },
  { label: 'Monthly Revenue', value: '₹12.4M', trend: '+15%', icon: <CreditCard className="text-success" /> },
  { label: 'Active Plans', value: '812', trend: '+4%', icon: <Package className="text-accent" /> },
  { label: 'Pending Payments', value: '₹1.2M', trend: '-2%', icon: <TrendingDown className="text-danger" />, isNegative: true },
  { label: 'Platform Growth', value: '24.8%', trend: '+2.4%', icon: <TrendingUp className="text-primary" /> },
];

const revenueData = [
  { name: 'Jan', value: 4000 },
  { name: 'Feb', value: 3000 },
  { name: 'Mar', value: 5000 },
  { name: 'Apr', value: 4500 },
  { name: 'May', value: 6000 },
  { name: 'Jun', value: 5500 },
  { name: 'Jul', value: 7000 },
];

const plans = [
  { name: 'Basic', price: '999', beds: '50', features: ['Core features', 'Standard Support', 'Daily Backups'], color: '#94A3B8' },
  { name: 'Standard', price: '2999', beds: '200', features: ['Advanced Analytics', 'Priority Support', 'Custom Branding', 'API Access'], popular: true, color: '#4F46E5' },
  { name: 'Enterprise', price: '9999', beds: 'Unlimited', features: ['White-labeling', 'Dedicated Manager', 'SSO Integration', '24/7 Phone Support'], color: '#111827' },
];

const securityFeatures = [
  { title: 'OTP Auth', desc: 'Secure login with multi-factor authentication', icon: <Lock size={20} /> },
  { title: 'Role Access', desc: 'Granular permissions for staff and owners', icon: <UserCheck size={20} /> },
  { title: 'Data Encryption', desc: 'AES-256 bit encryption at rest and transit', icon: <Database size={20} /> },
  { title: 'Secure Payments', desc: 'PCI-DSS compliant payment gateways', icon: <ShieldCheck size={20} /> },
  { title: 'GDPR Ready', desc: 'Global data protection compliance', icon: <Globe size={20} /> },
];

const activities = [
  { hostel: 'Elite Residency', owner: 'Rahul Sharma', plan: 'Standard', status: 'Active', date: '2 mins ago' },
  { hostel: 'Sai Tejaswini', owner: 'Prasanna Kumar', plan: 'Basic', status: 'Pending', date: '15 mins ago' },
  { hostel: 'Skyline Premium', owner: 'Vikram Singh', plan: 'Enterprise', status: 'Active', date: '1 hour ago' },
  { hostel: 'Metro PG', owner: 'Ananya Reddy', plan: 'Standard', status: 'Review', date: '3 hours ago' },
  { hostel: 'Green View', owner: 'Suresh Raina', plan: 'Basic', status: 'Active', date: 'Yesterday' },
];

const Dashboard = () => {
  return (
    <div className="space-y-10 pb-20 animate-fade-in">
      
      {/* SECTION: STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-surface p-6 rounded-2xl border border-divider soft-shadow hover:premium transition-all group cursor-pointer"
          >
            <div className="flex items-start justify-between">
              <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                {stat.icon}
              </div>
              <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${stat.isNegative ? 'bg-red-50 text-danger' : 'bg-green-50 text-success'}`}>
                {stat.trend}
                <TrendingUp size={12} className={stat.isNegative ? 'rotate-180' : ''} />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium text-text-muted">{stat.label}</p>
              <h3 className="text-2xl font-bold mt-1 tracking-tight">{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      {/* SECTION: ANALYTICS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-surface p-8 rounded-3xl border border-divider soft-shadow">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-sora font-bold">Revenue Analytics</h2>
              <p className="text-sm text-text-muted">Overview of platform financial growth</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-2.5 rounded-xl border border-divider hover:bg-gray-50 transition-colors"><Filter size={18} /></button>
              <button className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white text-sm font-bold rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
                <Download size={16} /> Export
              </button>
            </div>
          </div>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                  cursor={{ stroke: '#4F46E5', strokeWidth: 2 }}
                />
                <Area type="monotone" dataKey="value" stroke="#4F46E5" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-surface p-8 rounded-3xl border border-divider soft-shadow">
          <h2 className="text-xl font-sora font-bold mb-6">Security Pulse</h2>
          <div className="space-y-6">
            {securityFeatures.map((feat, i) => (
              <div key={i} className="flex items-center gap-4 group cursor-pointer">
                <div className="w-10 h-10 rounded-lg bg-primary/5 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                  {feat.icon}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-text-main">{feat.title}</h4>
                  <p className="text-xs text-text-muted mt-0.5">{feat.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10 p-5 rounded-2xl bg-primary-light border border-primary/10">
            <div className="flex items-center gap-3">
              <ShieldCheck className="text-primary" />
              <span className="text-sm font-bold text-primary">System Secure</span>
            </div>
            <p className="text-[11px] text-primary/70 mt-2 font-medium">Last full security audit completed on May 12, 2026. No vulnerabilities detected.</p>
          </div>
        </div>
      </div>

      {/* SECTION: PRICING PLANS */}
      <div className="space-y-8">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-sora font-bold">SaaS Subscription Plans</h2>
            <p className="text-text-muted mt-1">Manage and monitor platform subscription tiers</p>
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-white border border-divider text-sm font-bold rounded-xl hover:bg-gray-50 transition-all shadow-sm">
            <Plus size={18} /> New Plan
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -10 }}
              className={`relative bg-surface p-8 rounded-[2.5rem] border border-divider soft-shadow overflow-hidden flex flex-col ${plan.popular ? 'border-primary ring-4 ring-primary/5' : ''}`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-primary text-white text-[10px] font-black uppercase px-4 py-1.5 rounded-bl-2xl">
                  Most Popular
                </div>
              )}
              <h3 className="text-xl font-sora font-bold">{plan.name}</h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-bold tracking-tight text-text-main">₹{plan.price}</span>
                <span className="text-sm font-medium text-text-muted">/month</span>
              </div>
              <p className="text-sm text-text-muted mt-4">For hostels with up to <span className="font-bold text-text-main">{plan.beds} beds</span>.</p>
              
              <div className="my-8 space-y-4 flex-1">
                {plan.features.map((feat, j) => (
                  <div key={j} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-green-50 text-success flex items-center justify-center">
                      <ShieldCheck size={12} />
                    </div>
                    <span className="text-sm font-medium text-text-main">{feat}</span>
                  </div>
                ))}
              </div>

              <button className={`w-full py-4 rounded-2xl font-bold text-sm transition-all active:scale-95 ${plan.popular ? 'bg-primary text-white shadow-lg shadow-primary/20 hover:bg-primary-dark' : 'bg-gray-100 text-text-main hover:bg-gray-200'}`}>
                Edit Plan Details
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* SECTION: RECENT ACTIVITY TABLE */}
      <div className="bg-surface rounded-3xl border border-divider soft-shadow overflow-hidden">
        <div className="p-8 border-b border-divider flex items-center justify-between">
          <h2 className="text-xl font-sora font-bold">Recent Registrations</h2>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
              <input type="text" placeholder="Search hostels..." className="pl-10 pr-4 py-2 rounded-xl border border-divider text-sm focus:outline-none focus:border-primary transition-all w-64" />
            </div>
            <button className="p-2.5 rounded-xl border border-divider hover:bg-gray-50 transition-colors"><MoreVertical size={18} /></button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-8 py-4 text-[11px] font-black text-text-muted uppercase tracking-wider">Hostel Details</th>
                <th className="px-8 py-4 text-[11px] font-black text-text-muted uppercase tracking-wider">Owner Name</th>
                <th className="px-8 py-4 text-[11px] font-black text-text-muted uppercase tracking-wider">SaaS Plan</th>
                <th className="px-8 py-4 text-[11px] font-black text-text-muted uppercase tracking-wider">Status</th>
                <th className="px-8 py-4 text-[11px] font-black text-text-muted uppercase tracking-wider">Reg. Date</th>
                <th className="px-8 py-4 text-[11px] font-black text-text-muted uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {activities.map((row, i) => (
                <tr key={i} className="hover:bg-gray-50/30 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/5 text-primary flex items-center justify-center font-bold text-sm">
                        {row.hostel.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-text-main">{row.hostel}</p>
                        <p className="text-[11px] text-text-muted">Bangalore, IN</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-sm font-medium text-text-main">{row.owner}</td>
                  <td className="px-8 py-5">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tight ${row.plan === 'Enterprise' ? 'bg-gray-900 text-white' : row.plan === 'Standard' ? 'bg-primary-light text-primary' : 'bg-gray-100 text-text-muted'}`}>
                      {row.plan}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${row.status === 'Active' ? 'bg-success' : row.status === 'Pending' ? 'bg-warning' : 'bg-primary'}`} />
                      <span className="text-sm font-semibold">{row.status}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-sm text-text-muted font-medium">{row.date}</td>
                  <td className="px-8 py-5">
                    <button className="p-2 rounded-lg hover:bg-gray-100 text-text-muted transition-colors"><ChevronDown size={18} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-6 bg-gray-50/30 border-t border-divider flex items-center justify-between">
          <p className="text-sm text-text-muted font-medium">Showing 5 of 1,284 registrations</p>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 rounded-lg border border-divider text-sm font-bold hover:bg-white transition-all disabled:opacity-50">Previous</button>
            <button className="px-4 py-2 rounded-lg bg-white border border-divider text-sm font-bold hover:shadow-sm transition-all">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
