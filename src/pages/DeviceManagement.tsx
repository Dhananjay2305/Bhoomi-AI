import { useState } from 'react';
import { useBhoomiData } from '../contexts/MockDataProvider';
import { 
  Home, LayoutDashboard, Cpu, BarChart2, Mic, Bell, FileText, Settings, HelpCircle,
  Plus, Wifi, Battery, MapPin, Activity, Droplets, Thermometer, FlaskConical, Sprout,
  RefreshCw, Settings2, ChevronDown, CheckCircle, AlertTriangle, PlayCircle, Map, Target
} from 'lucide-react';
import { motion } from 'framer-motion';
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';

export default function DeviceManagement() {
  const { latestData, historyData, devices, alerts, recommendations } = useBhoomiData();
  const [timeFilter] = useState('24h');

  // Find the primary device
  const primaryDevice = devices[0];
  const isOnline = latestData && (new Date().getTime() - new Date(latestData.created_at).getTime()) < 60000;

  const kpis = [
    { label: 'Total Devices', value: devices.length, icon: Cpu, color: 'text-bhoomi-500', bg: 'bg-bhoomi-100 dark:bg-bhoomi-900/30' },
    { label: 'Online', value: devices.filter(d => d.status === 'Online').length, icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-100 dark:bg-emerald-900/30' },
    { label: 'Offline', value: devices.filter(d => d.status === 'Offline').length, icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-100 dark:bg-red-900/30' },
    { label: 'Avg Soil Health', value: '85/100', icon: Sprout, color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/30' },
    { label: 'Water Saved', value: '1.2M L', icon: Droplets, color: 'text-cyan-500', bg: 'bg-cyan-100 dark:bg-cyan-900/30' },
    { label: 'AI Recs Today', value: '4', icon: Target, color: 'text-purple-500', bg: 'bg-purple-100 dark:bg-purple-900/30' },
  ];

  const sidebarNav = [
    { label: 'Home', icon: Home, active: false },
    { label: 'Dashboard', icon: LayoutDashboard, active: false },
    { label: 'Devices', icon: Cpu, active: true },
    { label: 'Analytics', icon: BarChart2, active: false },
    { label: 'Irrigation', icon: Droplets, active: false },
    { label: 'AI Insights', icon: Target, active: false },
    { label: 'Voice Assistant', icon: Mic, active: false },
    { label: 'Alerts', icon: Bell, active: false },
    { label: 'Reports', icon: FileText, active: false },
    { label: 'Farm Mgmt', icon: Map, active: false },
    { label: 'Settings', icon: Settings, active: false },
    { label: 'Help & Support', icon: HelpCircle, active: false },
  ];

  return (
    <div className="fixed inset-0 z-50 flex bg-earth-50 dark:bg-bhoomi-950 overflow-hidden font-sans">
      {/* Dynamic Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-bhoomi-300/10 dark:bg-bhoomi-900/20 blur-[100px] animate-blob"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-earth-300/20 dark:bg-earth-800/10 blur-[120px] animate-blob animation-delay-2000"></div>
      </div>

      {/* Left Sidebar */}
      <aside className="w-72 border-r border-slate-200/50 dark:border-slate-800/50 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl flex flex-col z-10 hidden lg:flex relative">
        <div className="p-6 flex items-center gap-3">
          <div className="bg-gradient-to-tr from-bhoomi-600 to-bhoomi-400 p-2 rounded-xl text-white shadow-lg shadow-bhoomi-500/30">
            <Sprout size={24} />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white font-display">
            Bhoomi <span className="text-bhoomi-600 dark:text-bhoomi-400">AI</span>
          </span>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-1 custom-scrollbar">
          {sidebarNav.map((item, i) => (
            <button key={i} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${item.active ? 'bg-bhoomi-500 text-white shadow-md shadow-bhoomi-500/20' : 'text-slate-600 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white'}`}>
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </div>

        <div className="p-4">
          <div className="bg-gradient-to-br from-bhoomi-500 to-bhoomi-700 p-5 rounded-2xl text-white relative overflow-hidden shadow-xl shadow-bhoomi-500/20 group">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all"></div>
            <h4 className="font-bold mb-1 flex items-center gap-2"><Mic size={16} /> Ask Bhoomi AI</h4>
            <p className="text-xs text-bhoomi-100 mb-4">Get voice guidance in your language.</p>
            <div className="flex gap-2 relative z-10">
              <select className="bg-white/20 border border-white/30 rounded-lg text-xs px-2 py-1.5 outline-none backdrop-blur-sm cursor-pointer text-white">
                <option value="te" className="text-slate-900">Telugu</option>
                <option value="hi" className="text-slate-900">Hindi</option>
                <option value="en" className="text-slate-900">English</option>
              </select>
              <button className="flex-1 bg-white text-bhoomi-700 font-bold text-xs rounded-lg py-1.5 hover:bg-bhoomi-50 transition-colors shadow-sm">Talk Now</button>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-slate-200/50 dark:border-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold">
              K
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">Kumar Farm</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Premium Plan</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Column */}
      <main className="flex-1 flex flex-col h-full overflow-hidden z-10">
        {/* Top Header */}
        <header className="h-20 px-8 flex items-center justify-between border-b border-slate-200/50 dark:border-slate-800/50 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white font-display">Devices Overview</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-4 bg-white/60 dark:bg-slate-800/60 px-5 py-2.5 rounded-full border border-slate-200/50 dark:border-slate-700/50 shadow-sm">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isOnline ? 'bg-bhoomi-400' : 'bg-red-400'}`}></span>
                  <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isOnline ? 'bg-bhoomi-500' : 'bg-red-500'}`}></span>
                </span>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{isOnline ? 'Node Active' : 'Offline'}</span>
              </div>
              <div className="w-px h-4 bg-slate-300 dark:bg-slate-600"></div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-400">
                <Wifi size={14} className={latestData?.signal_strength && latestData.signal_strength > -70 ? 'text-bhoomi-500' : 'text-amber-500'} /> 
                {latestData?.signal_strength || -63} dBm
              </div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-400">
                <Battery size={14} className={latestData?.battery_level && latestData.battery_level > 20 ? 'text-bhoomi-500' : 'text-red-500'} />
                {Math.round(latestData?.battery_level || 86)}%
              </div>
            </div>
            
            <button className="flex items-center gap-2 px-6 py-2.5 bg-bhoomi-500 hover:bg-bhoomi-600 text-white rounded-full font-bold transition-all shadow-lg shadow-bhoomi-500/30 hover:scale-105 text-sm">
              <Plus size={18} /> Provision New Node
            </button>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          
          {/* KPI Row */}
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
            {kpis.map((kpi, idx) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
                key={idx} className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-md rounded-2xl p-4 border border-slate-200/50 dark:border-slate-800/50 shadow-sm flex items-center gap-4 hover:bg-white dark:hover:bg-slate-800 transition-colors cursor-pointer group"
              >
                <div className={`p-3 rounded-xl ${kpi.bg} ${kpi.color} group-hover:scale-110 transition-transform`}>
                  <kpi.icon size={20} />
                </div>
                <div>
                  <div className="text-2xl font-black text-slate-900 dark:text-white leading-none mb-1">{kpi.value}</div>
                  <div className="text-xs font-medium text-slate-500 dark:text-slate-400">{kpi.label}</div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Main Showcase Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl rounded-[32px] border border-white/50 dark:border-slate-800/50 shadow-xl shadow-slate-200/20 dark:shadow-none overflow-hidden flex flex-col xl:flex-row mb-8 relative"
          >
            {/* Left Side: Device Render */}
            <div className="xl:w-[40%] bg-gradient-to-br from-bhoomi-50 to-bhoomi-100/50 dark:from-bhoomi-900/20 dark:to-slate-900 p-10 flex flex-col items-center justify-center relative overflow-hidden border-r border-slate-200/50 dark:border-slate-800/50">
              {/* Subtle texture/glow */}
              <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(#22c55e 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-bhoomi-400/20 blur-[80px] rounded-full"></div>
              
              <div className="relative z-10 drop-shadow-2xl hover:scale-105 transition-transform duration-500 flex items-center justify-center w-full h-full min-h-[400px]">
                <img src="/bhoomi_device.jpg" alt="Bhoomi AI IoT Sensor Device" className="w-[85%] max-w-[420px] object-contain rounded-3xl" style={{ filter: 'drop-shadow(0 25px 25px rgb(0 0 0 / 0.15))' }} />
              </div>
            </div>

            {/* Right Side: Details & Data */}
            <div className="xl:w-[60%] p-8 lg:p-10 flex flex-col justify-between">
              
              <div className="flex flex-col sm:flex-row justify-between items-start mb-8 gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white font-display">{primaryDevice?.name || 'Field-A Node 1'}</h2>
                    <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold uppercase tracking-widest rounded-full border border-emerald-200 dark:border-emerald-800">Online</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm font-medium text-slate-500 dark:text-slate-400">
                    <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded font-mono">{primaryDevice?.device_id || 'ESP32-001'}</span>
                    <span>Firmware {primaryDevice?.firmware || 'v2.1.4'}</span>
                    <span className="flex items-center gap-1"><MapPin size={14} className="text-bhoomi-500"/> {primaryDevice?.field_id || 'Field-A'}</span>
                    <span className="flex items-center gap-1"><Activity size={14} className="text-bhoomi-500"/> Sync: 12s ago</span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-bhoomi-500 hover:border-bhoomi-500 transition-colors shadow-sm"><Settings2 size={20}/></button>
                  <button className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-bhoomi-500 hover:border-bhoomi-500 transition-colors shadow-sm"><RefreshCw size={20}/></button>
                </div>
              </div>

              {/* Sensor Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                  { label: 'Moisture', value: `${latestData?.moisture || 42}%`, icon: Droplets, color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/30' },
                  { label: 'pH Level', value: latestData?.ph || 6.4, icon: FlaskConical, color: 'text-purple-500', bg: 'bg-purple-100 dark:bg-purple-900/30' },
                  { label: 'Temperature', value: `${latestData?.temperature || 28.3}°C`, icon: Thermometer, color: 'text-orange-500', bg: 'bg-orange-100 dark:bg-orange-900/30' },
                  { label: 'Soil Health', value: '82/100', icon: Sprout, color: 'text-bhoomi-500', bg: 'bg-bhoomi-100 dark:bg-bhoomi-900/30' }
                ].map((sensor, i) => (
                  <div key={i} className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200/50 dark:border-slate-700/50">
                    <div className="flex items-center gap-2 mb-3">
                      <div className={`p-1.5 rounded-lg ${sensor.bg} ${sensor.color}`}>
                        <sensor.icon size={16} />
                      </div>
                      <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{sensor.label}</span>
                    </div>
                    <div className="text-2xl font-black text-slate-900 dark:text-white">{sensor.value}</div>
                  </div>
                ))}
              </div>

              {/* Large Moisture Chart */}
              <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-200/50 dark:border-slate-700/50 flex-1 flex flex-col">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-3">
                    <h3 className="font-bold text-slate-900 dark:text-white">Moisture Trend</h3>
                    <div className="flex items-center gap-1.5 bg-bhoomi-100 dark:bg-bhoomi-900/30 px-2 py-0.5 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-bhoomi-500 animate-pulse"></span>
                      <span className="text-[10px] font-bold text-bhoomi-700 dark:text-bhoomi-400 uppercase tracking-wider">Live</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700">
                    {timeFilter} <ChevronDown size={14} />
                  </div>
                </div>
                
                <div className="flex-1 min-h-[160px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={historyData.slice(-30)}>
                      <defs>
                        <linearGradient id="colorMoisture" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }} />
                      <Area type="monotone" dataKey="moisture" stroke="#22c55e" strokeWidth={3} fillOpacity={1} fill="url(#colorMoisture)" isAnimationActive={false} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 mt-8">
                <button className="flex-1 py-3.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold hover:shadow-lg hover:shadow-slate-900/20 dark:hover:shadow-white/20 transition-all active:scale-95 text-sm">
                  Configure Node
                </button>
                <button className="flex-1 py-3.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-all active:scale-95 text-sm shadow-sm">
                  View Diagnostics
                </button>
              </div>

            </div>
          </motion.div>

          {/* Bottom Banner */}
          <div className="bg-gradient-to-r from-bhoomi-800 to-bhoomi-600 rounded-[32px] p-8 lg:p-12 text-white relative overflow-hidden shadow-2xl flex items-center justify-between">
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}></div>
            
            <div className="relative z-10 max-w-xl">
              <h3 className="text-3xl font-black font-display mb-3">Bhoomi AI Connected Ecosystem</h3>
              <p className="text-bhoomi-100 mb-8 font-medium">Your farm is connected. Real-time sensor data is being analyzed by our AI to provide optimal irrigation and nutrient recommendations.</p>
              <button className="px-6 py-3 bg-white text-bhoomi-700 rounded-full font-bold shadow-lg flex items-center gap-2 hover:scale-105 transition-transform">
                <Mic size={18} /> Ask Bhoomi AI
              </button>
            </div>

            <div className="relative z-10 hidden md:block">
              <div className="w-48 h-48 bg-white/10 rounded-full blur-xl absolute -inset-4"></div>
              {/* Abstract farm illustration representation */}
              <div className="w-32 h-32 relative">
                <Sprout size={120} className="text-white/80 drop-shadow-2xl" />
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Right Side Info Panel */}
      <aside className="w-80 border-l border-slate-200/50 dark:border-slate-800/50 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md hidden xl:flex flex-col z-10">
        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
          
          {/* AI Recommendation */}
          <div>
            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest mb-4">Latest AI Insight</h3>
            <div className="bg-gradient-to-br from-bhoomi-50 to-bhoomi-100 dark:from-bhoomi-900/40 dark:to-bhoomi-800/20 p-5 rounded-2xl border border-bhoomi-200/50 dark:border-bhoomi-700/30 relative">
              <div className="absolute top-4 right-4 text-bhoomi-500">
                <Target size={20} />
              </div>
              <p className="text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed mb-4">
                {recommendations?.irrigationExplanation || "Irrigation recommended in Field-A within the next 4 hours. Soil moisture is optimal for Tomato crop."}
              </p>
              <button className="w-full py-2.5 bg-bhoomi-500/10 hover:bg-bhoomi-500/20 text-bhoomi-700 dark:text-bhoomi-400 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2">
                <PlayCircle size={16} /> Play in Telugu
              </button>
            </div>
          </div>

          {/* Network Overview */}
          <div>
            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest mb-4">Network Flow</h3>
            <div className="bg-white/60 dark:bg-slate-800/40 p-5 rounded-2xl border border-slate-200/50 dark:border-slate-700/50 flex flex-col gap-3">
              {[
                { label: 'Devices', icon: Cpu, active: true },
                { label: 'Cloud Sync', icon: Wifi, active: true },
                { label: 'AI Engine', icon: Target, active: true },
                { label: 'Voice Assistant', icon: Mic, active: false }
              ].map((step, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step.active ? 'bg-bhoomi-100 text-bhoomi-600 dark:bg-bhoomi-900/50 dark:text-bhoomi-400' : 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500'}`}>
                    <step.icon size={14} />
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm font-bold ${step.active ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>{step.label}</p>
                  </div>
                  {step.active && <div className="w-2 h-2 rounded-full bg-bhoomi-500 shadow-[0_0_8px_#22c55e]"></div>}
                </div>
              ))}
            </div>
          </div>

          {/* Recent Alerts */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Recent Alerts</h3>
              <span className="text-xs font-bold text-bhoomi-500 cursor-pointer hover:underline">View All</span>
            </div>
            <div className="space-y-3">
              {(alerts.length > 0 ? alerts.slice(0, 3) : [
                { id: '1', message: 'Low Moisture in Field-A', severity: 'high', timestamp: new Date().toISOString() },
                { id: '2', message: 'Irrigation Completed', severity: 'low', timestamp: new Date().toISOString() }
              ]).map((alert, i) => (
                <div key={alert.id || i} className={`p-4 rounded-2xl border flex items-start gap-3 ${
                  alert.severity === 'high' ? 'bg-red-50/50 border-red-100 dark:bg-red-900/10 dark:border-red-900/30' :
                  alert.severity === 'medium' ? 'bg-amber-50/50 border-amber-100 dark:bg-amber-900/10 dark:border-amber-900/30' :
                  'bg-bhoomi-50/50 border-bhoomi-100 dark:bg-bhoomi-900/10 dark:border-bhoomi-900/30'
                }`}>
                  <div className={`mt-0.5 ${
                    alert.severity === 'high' ? 'text-red-500' :
                    alert.severity === 'medium' ? 'text-amber-500' :
                    'text-bhoomi-500'
                  }`}>
                    <AlertTriangle size={16} />
                  </div>
                  <div>
                    <p className={`text-sm font-bold ${
                      alert.severity === 'high' ? 'text-red-900 dark:text-red-400' :
                      alert.severity === 'medium' ? 'text-amber-900 dark:text-amber-400' :
                      'text-bhoomi-900 dark:text-bhoomi-400'
                    }`}>{alert.message}</p>
                    <p className="text-xs text-slate-500 mt-1">{new Date(alert.timestamp).toLocaleTimeString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Field Map Placeholder */}
          <div>
            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest mb-4">Deployment Map</h3>
            <div className="h-48 bg-slate-200 dark:bg-slate-800 rounded-2xl border border-slate-300 dark:border-slate-700 relative overflow-hidden flex items-center justify-center">
               <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")' }}></div>
               <div className="relative z-10 flex flex-col items-center gap-2">
                 <MapPin size={32} className="text-bhoomi-500 drop-shadow-lg" />
                 <span className="text-sm font-bold text-slate-600 dark:text-slate-400 bg-white/80 dark:bg-slate-900/80 px-3 py-1 rounded-full backdrop-blur-sm">Field-A Sector 4</span>
               </div>
            </div>
          </div>

        </div>
      </aside>

    </div>
  );
}
