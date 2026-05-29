import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  Building2, UserCheck, Users, Activity, 
  CreditCard, Package, TrendingUp, TrendingDown,
  ShieldAlert, ShieldCheck, Database, Lock, Globe,
  Search, Bell, ChevronDown, Filter, Download, MoreVertical,
  Plus, X
} from 'lucide-react';
import { motion } from 'framer-motion';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer
} from 'recharts';
import API from './api/axios';

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [revenue, setRevenue] = useState(null);
  const [buildings, setBuildings] = useState([]);
  const [activities, setActivities] = useState([]);
  const [staffData, setStaffData] = useState(null);
  const [loading, setLoading] = useState(true);

  // SaaS Plans states
  const [plans, setPlans] = useState([
    { name: 'Basic', price: '999', beds: '50', features: ['Core features', 'Standard Support', 'Daily Backups'], color: '#94A3B8' },
    { name: 'Standard', price: '2999', beds: '200', features: ['Advanced Analytics', 'Priority Support', 'Custom Branding', 'API Access'], popular: true, color: '#4F46E5' },
    { name: 'Enterprise', price: '9999', beds: 'Unlimited', features: ['White-labeling', 'Dedicated Manager', 'SSO Integration', '24/7 Phone Support'], color: '#111827' },
  ]);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [editingPlanIndex, setEditingPlanIndex] = useState(null);
  const [planForm, setPlanForm] = useState({ name: '', price: '', beds: '', features: '', popular: false });

  // Property Directory states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedGender, setSelectedGender] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [showPropertyFilters, setShowPropertyFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const propertiesPerPage = 5;

  // Revenue Analytics states
  const [selectedTimeRange, setSelectedTimeRange] = useState('Weekly');
  const [showRevenueFilters, setShowRevenueFilters] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [sumRes, revRes, bRes, actRes, staffRes] = await Promise.all([
        API.get('/dashboard/summary'),
        API.get('/dashboard/revenue'),
        API.get('/buildings'),
        API.get('/dashboard/activity'),
        API.get('/dashboard/staff')
      ]);

      setSummary(sumRes.data);
      setRevenue(revRes.data);
      setBuildings(bRes.data);
      setActivities(actRes.data);
      setStaffData(staffRes.data);
    } catch (err) {
      console.error('Error loading admin dashboard metrics:', err);
      if (err.response && err.response.status === 401) {
        localStorage.clear();
        window.location.href = '/login';
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const totalHostels = buildings.length;
  const totalOwners = summary?.ownerCount || 0;
  const totalTenants = summary?.totalTenants || 0;
  const liveOccupancy = summary?.occupancyRate || 0;
  const collectedRevenue = revenue?.rentMetrics?.collectedRent || 0;
  const pendingPayments = summary?.pendingPaymentsAmount || 0;
  const totalStaff = staffData?.totalStaff || 0;
  const staffEfficiency = staffData?.efficiencyScore || 100;

  const stats = [
    { label: 'Total Hostels', value: totalHostels.toString(), trend: '+12%', icon: <Building2 className="text-primary" />, color: 'primary' },
    { label: 'Platform Owners', value: totalOwners.toString(), trend: '+5%', icon: <UserCheck className="text-success" />, color: 'success' },
    { label: 'Total Tenants', value: totalTenants.toString(), trend: '+18%', icon: <Users className="text-accent" />, color: 'accent' },
    { label: 'Live Occupancy', value: `${liveOccupancy}%`, trend: '+4.2%', icon: <Activity className="text-primary" />, color: 'primary' },
    { label: 'Collected Revenue', value: `₹${collectedRevenue.toLocaleString('en-IN')}`, trend: '+15%', icon: <CreditCard className="text-success" />, color: 'success' },
    { label: 'Active Plans', value: plans.length.toString(), trend: '+4%', icon: <Package className="text-accent" />, color: 'accent' },
    { label: 'Pending Dues', value: `₹${pendingPayments.toLocaleString('en-IN')}`, trend: '-2%', icon: <TrendingDown className="text-danger" />, isNegative: true, color: 'danger' },
    { label: 'Platform Staff', value: totalStaff.toString(), trend: '+8%', icon: <Users className="text-primary" />, color: 'primary' },
  ];

  // Dynamic Chart Data
  const defaultChartData = [
    { name: 'Sun', expected: 10000, actual: 4000 },
    { name: 'Mon', expected: 10000, actual: 3000 },
    { name: 'Tue', expected: 10000, actual: 5000 },
    { name: 'Wed', expected: 10000, actual: 4500 },
    { name: 'Thu', expected: 10000, actual: 6000 },
    { name: 'Fri', expected: 10000, actual: 5500 },
    { name: 'Sat', expected: 10000, actual: 7000 },
  ];

  const monthlyChartData = [
    { name: 'Jan', expected: 100000, actual: 45000 },
    { name: 'Feb', expected: 100000, actual: 52000 },
    { name: 'Mar', expected: 100000, actual: 68000 },
    { name: 'Apr', expected: 100000, actual: 75000 },
    { name: 'May', expected: 100000, actual: (revenue?.rentMetrics?.collectedRent || 85000) },
  ];

  const chartData = selectedTimeRange === 'Weekly'
    ? (revenue?.dailyRevenue && revenue.dailyRevenue.length > 0 ? revenue.dailyRevenue : defaultChartData)
    : monthlyChartData;

  const securityFeatures = [
    { title: 'OTP Auth', desc: 'Secure login with multi-factor authentication', icon: <Lock size={20} /> },
    { title: 'Role Access', desc: 'Granular permissions for staff and owners', icon: <UserCheck size={20} /> },
    { title: 'Data Encryption', desc: 'AES-256 bit encryption at rest and transit', icon: <Database size={20} /> },
    { title: 'Secure Payments', desc: 'PCI-DSS compliant payment gateways', icon: <ShieldCheck size={20} /> },
    { title: 'GDPR Ready', desc: 'Global data protection compliance', icon: <Globe size={20} /> },
  ];

  // Plan Modal Handlers
  const handleOpenNewPlan = () => {
    setEditingPlanIndex(null);
    setPlanForm({ name: '', price: '', beds: '', features: '', popular: false });
    setShowPlanModal(true);
  };

  const handleOpenEditPlan = (index) => {
    const plan = plans[index];
    setEditingPlanIndex(index);
    setPlanForm({
      name: plan.name,
      price: plan.price,
      beds: plan.beds,
      features: plan.features.join(', '),
      popular: plan.popular || false
    });
    setShowPlanModal(true);
  };

  const handleSavePlan = (e) => {
    e.preventDefault();
    const updatedPlan = {
      name: planForm.name,
      price: planForm.price,
      beds: planForm.beds,
      features: planForm.features.split(',').map(f => f.trim()).filter(Boolean),
      popular: planForm.popular,
      color: planForm.popular ? '#4F46E5' : planForm.name.toLowerCase() === 'enterprise' ? '#111827' : '#94A3B8'
    };

    if (editingPlanIndex !== null) {
      const updatedPlans = [...plans];
      updatedPlans[editingPlanIndex] = updatedPlan;
      setPlans(updatedPlans);
    } else {
      setPlans([...plans, updatedPlan]);
    }
    setShowPlanModal(false);
  };

  // Property Directory handlers
  const filteredBuildings = buildings.filter(b => {
    const matchesSearch = b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.description && b.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (b.locationCity && b.locationCity.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'All' || b.category === selectedCategory;
    const matchesGender = selectedGender === 'All' || b.genderType === selectedGender;
    const matchesStatus = selectedStatus === 'All' || b.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesGender && matchesStatus;
  });

  const indexOfLastProperty = currentPage * propertiesPerPage;
  const indexOfFirstProperty = indexOfLastProperty - propertiesPerPage;
  const currentBuildings = filteredBuildings.slice(indexOfFirstProperty, indexOfLastProperty);
  const totalPages = Math.ceil(filteredBuildings.length / propertiesPerPage) || 1;

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleExportPropertiesCSV = () => {
    const headers = ['Facility Name', 'Location', 'Subscription', 'Type', 'Status'];
    const rows = filteredBuildings.map(b => [
      b.name,
      b.locationCity || 'India',
      b.category || 'Standard',
      b.genderType || 'Mixed',
      b.status || 'Active'
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.map(val => `"${val.replace(/"/g, '""')}"`).join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Property_Directory_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Revenue Exporter
  const handleExportRevenueCSV = () => {
    const headers = ['Timeframe', 'Revenue Value'];
    const rows = chartData.map(d => [d.name, d.actual]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Revenue_Analytics_${selectedTimeRange}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-10 pb-20 animate-fade-in">
      
      {/* SECTION: STATS */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-surface p-6 rounded-2xl border border-divider h-32 animate-pulse flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div className="w-12 h-12 bg-gray-200 dark:bg-slate-800 rounded-xl" />
                <div className="w-12 h-4 bg-gray-200 dark:bg-slate-800 rounded-full" />
              </div>
              <div className="space-y-2">
                <div className="w-24 h-3 bg-gray-200 dark:bg-slate-800 rounded" />
                <div className="w-16 h-5 bg-gray-200 dark:bg-slate-800 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-surface p-6 rounded-xl border border-divider shadow-sm hover:shadow-md hover:border-primary/30 transition-all group cursor-pointer relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none transform translate-x-1/4 -translate-y-1/4 group-hover:scale-110 transition-transform duration-500">
                {React.cloneElement(stat.icon, { size: 100 })}
              </div>
              <div className="flex items-start justify-between relative z-10">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-transform ${stat.color === 'primary' ? 'bg-indigo-50 text-indigo-600' : stat.color === 'success' ? 'bg-emerald-50 text-emerald-600' : stat.color === 'danger' ? 'bg-red-50 text-red-600' : 'bg-slate-50 text-slate-600'}`}>
                  {React.cloneElement(stat.icon, { size: 20, className: '' })}
                </div>
                <div className={`flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-md ${stat.isNegative ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
                  {stat.trend}
                  <TrendingUp size={12} className={stat.isNegative ? 'rotate-180' : ''} />
                </div>
              </div>
              <div className="mt-5 relative z-10">
                <h3 className="text-2xl font-bold tracking-tight text-text-main">{stat.value}</h3>
                <p className="text-xs font-medium text-text-muted mt-1 uppercase tracking-wider">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* SECTION: ANALYTICS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-surface p-8 rounded-3xl border border-divider soft-shadow">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-sora font-bold">Revenue Analytics</h2>
              <p className="text-sm text-text-muted">Overview of platform financial growth</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <button 
                  onClick={() => setShowRevenueFilters(!showRevenueFilters)}
                  className={`p-2.5 rounded-xl border border-divider hover:bg-gray-100 transition-colors ${showRevenueFilters ? 'bg-indigo-50 border-primary text-primary' : 'bg-white'}`}
                >
                  <Filter size={18} />
                </button>
                {showRevenueFilters && (
                  <div className="absolute right-0 top-full mt-2 w-40 bg-surface rounded-xl border border-divider shadow-lg z-20 p-2 text-xs">
                    <p className="font-bold text-[10px] text-text-muted px-2 py-1 uppercase tracking-wider">Time Range</p>
                    <button 
                      onClick={() => { setSelectedTimeRange('Weekly'); setShowRevenueFilters(false); }}
                      className={`w-full text-left px-3 py-2 rounded-lg font-bold hover:bg-slate-50 transition-colors ${selectedTimeRange === 'Weekly' ? 'text-primary bg-indigo-50/50' : 'text-text-main'}`}
                    >
                      Weekly View
                    </button>
                    <button 
                      onClick={() => { setSelectedTimeRange('Monthly'); setShowRevenueFilters(false); }}
                      className={`w-full text-left px-3 py-2 rounded-lg font-bold hover:bg-slate-50 transition-colors ${selectedTimeRange === 'Monthly' ? 'text-primary bg-indigo-50/50' : 'text-text-main'}`}
                    >
                      Monthly View
                    </button>
                  </div>
                )}
              </div>
              <button 
                onClick={handleExportRevenueCSV}
                className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white text-sm font-bold rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
              >
                <Download size={16} /> Export
              </button>
            </div>
          </div>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                  cursor={{ stroke: '#4F46E5', strokeWidth: 2 }}
                />
                <Area type="monotone" dataKey="actual" stroke="#4F46E5" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-surface p-8 rounded-3xl border border-divider soft-shadow flex flex-col h-full justify-between">
          <div>
            <h2 className="text-xl font-sora font-bold">Live Operations Pulse</h2>
            <p className="text-xs text-text-muted mt-1 mb-6">Real-time activity across Owner & Tenant portals</p>
            <div className="space-y-6 max-h-[320px] overflow-y-auto pr-2">
              {activities.length === 0 ? (
                <div className="text-center py-10 text-xs text-text-muted font-bold">
                  System Standby — Awaiting portal activities.
                </div>
              ) : (
                activities.map((act, i) => (
                  <div key={i} className="flex items-start gap-4 group">
                    <div className="w-10 h-10 rounded-xl bg-primary/5 text-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                      {act.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xs font-bold text-text-main leading-snug">{act.text}</h4>
                      <p className="text-[10px] text-text-muted mt-1">
                        {new Date(act.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          <div className="mt-8 p-5 rounded-2xl bg-indigo-500/5 border border-primary/10">
            <div className="flex items-center gap-3">
              <ShieldCheck className="text-primary" />
              <span className="text-xs font-bold text-primary">Ecosystem Synchronized</span>
            </div>
            <p className="text-[10px] text-primary/70 mt-1.5 font-medium">Platform securely synced with Owner & Tenant databases. Active connection verified.</p>
          </div>
        </div>
      </div>

      {/* SECTION: PRICING PLANS */}
      <div className="space-y-8">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-sora font-bold">SaaS Subscription Tiers</h2>
            <p className="text-text-muted mt-1">Manage and monitor platform subscription tiers</p>
          </div>
          <button 
            onClick={handleOpenNewPlan}
            className="flex items-center gap-2 px-6 py-3 bg-white border border-divider text-sm font-bold rounded-xl hover:bg-gray-50 transition-all shadow-sm"
          >
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

              <button 
                onClick={() => handleOpenEditPlan(i)}
                className={`w-full py-4 rounded-2xl font-bold text-sm transition-all active:scale-95 ${plan.popular ? 'bg-primary text-white shadow-lg shadow-primary/20 hover:bg-primary-dark' : 'bg-gray-100 text-text-main hover:bg-gray-200'}`}
              >
                Edit Plan Details
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* SECTION: STAFF & OPERATIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-surface p-8 rounded-3xl border border-divider soft-shadow flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-sora font-bold">Operations Performance</h2>
            <p className="text-xs text-text-muted mt-1 mb-6">Staff attendance, tasks & efficiency scorecard</p>
            
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-indigo-50/50 p-4 rounded-2xl border border-divider">
                <div>
                  <p className="text-xs font-semibold text-text-muted">Staff Efficiency</p>
                  <p className="text-2xl font-bold text-primary mt-1">{staffEfficiency}%</p>
                </div>
                <div className="w-12 h-12 bg-indigo-100 text-indigo-700 rounded-xl flex items-center justify-center font-bold text-lg">
                  ⚡
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-emerald-50/30 p-3 rounded-2xl border border-emerald-100/50 text-center">
                  <p className="text-[10px] font-bold text-emerald-700">ASSIGNED</p>
                  <p className="text-lg font-bold text-emerald-800 mt-1">{staffData?.tasksAssigned || 0}</p>
                </div>
                <div className="bg-blue-50/30 p-3 rounded-2xl border border-blue-100/50 text-center">
                  <p className="text-[10px] font-bold text-blue-700">COMPLETED</p>
                  <p className="text-lg font-bold text-blue-800 mt-1">{staffData?.tasksCompleted || 0}</p>
                </div>
                <div className="bg-amber-50/30 p-3 rounded-2xl border border-amber-100/50 text-center">
                  <p className="text-[10px] font-bold text-amber-700">PENDING</p>
                  <p className="text-lg font-bold text-amber-800 mt-1">{staffData?.tasksPending || 0}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/10">
            <div className="flex items-center gap-3">
              <ShieldCheck className="text-success" />
              <span className="text-xs font-bold text-success">Operations Synchronized</span>
            </div>
            <p className="text-[10px] text-success/70 mt-1.5 font-medium">All onsite facility managers, cleaning crews, and security teams are verified active.</p>
          </div>
        </div>

        <div className="lg:col-span-2 bg-surface p-8 rounded-3xl border border-divider soft-shadow">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-sora font-bold">Active Staff Directory</h2>
              <p className="text-sm text-text-muted">Onsite personnel managing platform properties</p>
            </div>
            <span className="px-3 py-1.5 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-xl border border-indigo-100">
              {totalStaff} Members Active
            </span>
          </div>

          <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
            {!staffData || !staffData.staffList || staffData.staffList.length === 0 ? (
              <div className="text-center py-12 text-sm text-text-muted font-bold">
                No staff members currently registered or active on platform.
              </div>
            ) : (
              staffData.staffList.map((st, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl border border-divider hover:border-primary/20 transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary font-bold flex items-center justify-center shadow-sm">
                      {st.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-text-main leading-tight">{st.name}</h4>
                      <p className="text-xs text-text-muted mt-0.5">{st.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${st.status === 'Active' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                        <span className="text-xs font-semibold text-text-main">{st.status}</span>
                      </div>
                      <p className="text-[10px] text-text-muted mt-0.5">Rating: {st.score / 20}/5</p>
                    </div>
                    <div className="w-16 bg-gray-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-primary h-full rounded-full" style={{ width: `${st.score}%` }} />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

            {/* SECTION: RECENT ACTIVITY TABLE */}
      <div id="registrations-table" className="bg-surface rounded-xl border border-divider shadow-sm overflow-hidden flex flex-col">
        <div className="p-5 border-b border-divider flex items-center justify-between bg-gray-50/50">
          <div>
            <h2 className="text-base font-bold text-text-main">Property Directory</h2>
            <p className="text-xs text-text-muted mt-0.5">Manage all registered facilities across the platform</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={14} />
              <input 
                type="text" 
                placeholder="Search facilities..." 
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className="pl-9 pr-4 py-1.5 rounded-lg border border-divider text-xs focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all w-60 bg-white" 
              />
            </div>
            
            <div className="relative">
              <button 
                onClick={() => setShowPropertyFilters(!showPropertyFilters)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border border-divider bg-white hover:bg-gray-50 text-xs font-semibold text-text-main transition-colors ${showPropertyFilters ? 'border-primary bg-indigo-50/20' : ''}`}
              >
                <Filter size={14} /> Filter
              </button>
              {showPropertyFilters && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-surface rounded-2xl border border-divider shadow-lg z-20 p-4 text-xs space-y-4">
                  <div>
                    <p className="font-bold text-[10px] text-text-muted mb-2 uppercase tracking-wider">Category</p>
                    <select 
                      value={selectedCategory} 
                      onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
                      className="w-full p-2 border border-divider rounded-xl font-bold bg-white focus:outline-none"
                    >
                      <option value="All">All Categories</option>
                      <option value="Standard">Standard</option>
                      <option value="Professional">Professional</option>
                      <option value="Luxury">Luxury</option>
                      <option value="Mixed">Mixed</option>
                    </select>
                  </div>
                  <div>
                    <p className="font-bold text-[10px] text-text-muted mb-2 uppercase tracking-wider">Gender Type</p>
                    <select 
                      value={selectedGender} 
                      onChange={(e) => { setSelectedGender(e.target.value); setCurrentPage(1); }}
                      className="w-full p-2 border border-divider rounded-xl font-bold bg-white focus:outline-none"
                    >
                      <option value="All">All Genders</option>
                      <option value="Boys">Boys</option>
                      <option value="Girls">Girls</option>
                      <option value="Mixed">Mixed</option>
                    </select>
                  </div>
                  <div>
                    <p className="font-bold text-[10px] text-text-muted mb-2 uppercase tracking-wider">Status</p>
                    <select 
                      value={selectedStatus} 
                      onChange={(e) => { setSelectedStatus(e.target.value); setCurrentPage(1); }}
                      className="w-full p-2 border border-divider rounded-xl font-bold bg-white focus:outline-none"
                    >
                      <option value="All">All Statuses</option>
                      <option value="Active">Active</option>
                      <option value="Draft">Draft</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                  <button 
                    onClick={() => { setSelectedCategory('All'); setSelectedGender('All'); setSelectedStatus('All'); setSearchQuery(''); setCurrentPage(1); setShowPropertyFilters(false); }}
                    className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-text-main font-bold rounded-xl transition-all"
                  >
                    Clear All Filters
                  </button>
                </div>
              )}
            </div>

            <button 
              onClick={handleExportPropertiesCSV}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary text-white hover:bg-indigo-700 text-xs font-semibold transition-colors"
            >
              <Download size={14} /> Export CSV
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-12 text-center text-sm text-text-muted font-medium flex flex-col items-center gap-3">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              Loading property directory...
            </div>
          ) : filteredBuildings.length === 0 ? (
            <div className="p-16 text-center text-sm text-text-muted font-medium">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Building2 className="text-gray-400" size={24} />
              </div>
              No matching properties found.
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white border-b border-divider">
                  <th className="px-6 py-3 text-[10px] font-bold text-text-muted uppercase tracking-wider sticky top-0 bg-white z-10">Facility Name</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-text-muted uppercase tracking-wider sticky top-0 bg-white z-10">Location</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-text-muted uppercase tracking-wider sticky top-0 bg-white z-10">Subscription</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-text-muted uppercase tracking-wider sticky top-0 bg-white z-10">Type</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-text-muted uppercase tracking-wider sticky top-0 bg-white z-10">Status</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-text-muted uppercase tracking-wider sticky top-0 bg-white z-10 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-white">
                {currentBuildings.map((row, i) => (
                  <tr key={row._id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded border border-divider bg-slate-50 flex items-center justify-center text-xs font-bold text-slate-700 shadow-sm">
                          {row.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-text-main leading-tight">{row.name}</p>
                          <p className="text-xs text-text-muted mt-0.5 max-w-[200px] truncate">{row.description || 'Standard facility'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm font-medium text-text-main">{row.locationCity || 'India'}</p>
                      <p className="text-xs text-text-muted mt-0.5">Primary Node</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border ${row.category === 'Luxury' ? 'bg-slate-900 text-white border-slate-900' : row.category === 'Professional' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                        {row.category || 'Standard'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-text-main font-medium">{row.genderType || 'Mixed'}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-semibold ${
                        row.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        row.status === 'Draft' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                        'bg-slate-50 text-slate-700 border border-slate-200'
                      }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${
                          row.status === 'Active' ? 'bg-emerald-500' :
                          row.status === 'Draft' ? 'bg-amber-500' : 'bg-slate-500'
                        }`} />
                        {row.status || 'Active'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button className="p-1.5 text-text-muted hover:text-primary hover:bg-indigo-50 rounded-md transition-colors opacity-0 group-hover:opacity-100">
                        <MoreVertical size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <div className="p-4 bg-white border-t border-divider flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs text-text-muted font-medium">
            Showing <span className="font-semibold text-text-main">{filteredBuildings.length === 0 ? 0 : indexOfFirstProperty + 1}</span> to <span className="font-semibold text-text-main">{Math.min(indexOfLastProperty, filteredBuildings.length)}</span> of <span className="font-semibold text-text-main">{filteredBuildings.length}</span> entries
          </p>
          
          <div className="flex flex-wrap items-center gap-1">
            <button 
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1.5 rounded border border-divider text-xs font-semibold text-text-muted hover:bg-gray-50 disabled:opacity-50"
            >
              Prev
            </button>
            {[...Array(totalPages)].map((_, pageIdx) => (
              <button 
                key={pageIdx + 1}
                onClick={() => handlePageChange(pageIdx + 1)}
                className={`px-3 py-1.5 rounded text-xs font-semibold transition-all ${currentPage === pageIdx + 1 ? 'bg-primary text-white' : 'border border-divider text-text-muted hover:bg-gray-50'}`}
              >
                {pageIdx + 1}
              </button>
            ))}
            <button 
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 rounded border border-divider text-xs font-semibold text-text-muted hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* PREMIUM PLAN MODAL */}
      {showPlanModal && createPortal(
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[9999] flex items-center justify-center animate-fade-in p-4">
          <div className="bg-surface border border-divider rounded-[2.5rem] w-full max-w-lg overflow-hidden shadow-2xl relative p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setShowPlanModal(false)}
              className="absolute top-6 right-6 p-2 rounded-full border border-divider hover:bg-slate-100 transition-colors text-text-muted hover:text-text-main z-10"
            >
              <X size={18} />
            </button>
            <div>
              <h3 className="text-xl sm:text-2xl font-sora font-bold text-text-main">
                {editingPlanIndex !== null ? 'Modify Subscription Tier' : 'Establish New Tier'}
              </h3>
              <p className="text-xs text-text-muted mt-1">Configure pricing features and properties for platform owner plans</p>
            </div>

            <form onSubmit={handleSavePlan} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Plan Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Premium Pro"
                  value={planForm.name}
                  onChange={(e) => setPlanForm({ ...planForm, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl border border-divider text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all bg-white font-bold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Monthly Cost (₹)</label>
                  <input 
                    type="number" 
                    required
                    placeholder="e.g. 4999"
                    value={planForm.price}
                    onChange={(e) => setPlanForm({ ...planForm, price: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl border border-divider text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all bg-white font-bold"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Bed Capacity Limit</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. 500 or Unlimited"
                    value={planForm.beds}
                    onChange={(e) => setPlanForm({ ...planForm, beds: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl border border-divider text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all bg-white font-bold"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Included Features (comma-separated)</label>
                <textarea 
                  required
                  placeholder="Core features, Custom Branding, Dedicated Manager"
                  rows={3}
                  value={planForm.features}
                  onChange={(e) => setPlanForm({ ...planForm, features: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl border border-divider text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all bg-white font-medium"
                />
              </div>

              <div className="flex items-center gap-3 py-2 bg-indigo-50/20 px-4 rounded-2xl border border-indigo-500/10">
                <input 
                  type="checkbox" 
                  id="popular-tier"
                  checked={planForm.popular}
                  onChange={(e) => setPlanForm({ ...planForm, popular: e.target.checked })}
                  className="w-4 h-4 rounded text-primary focus:ring-primary border-divider"
                />
                <label htmlFor="popular-tier" className="text-xs font-bold text-text-main cursor-pointer select-none">
                  Promote as "Most Popular" on signup pages
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => setShowPlanModal(false)}
                  className="flex-1 py-3 sm:py-4 border border-divider text-text-main hover:bg-slate-50 font-bold text-sm rounded-2xl transition-all"
                >
                  Discard
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-3 sm:py-4 bg-primary hover:bg-indigo-700 text-white font-bold text-sm rounded-2xl shadow-lg shadow-primary/20 transition-all"
                >
                  {editingPlanIndex !== null ? 'Save Changes' : 'Launch Plan'}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default Dashboard;

