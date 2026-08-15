import { useState } from 'react';
import { useBhoomiData } from '../contexts/MockDataProvider';
import { 
  Droplets, Thermometer, FlaskConical, Sprout, Wind, 
  CloudRain, Sun, Wifi, AlertTriangle, 
  Target, Mic, TrendingUp
} from 'lucide-react';
import { motion } from 'framer-motion';
import { 
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';

export default function Dashboard() {
  const { latestData, historyData, devices, alerts } = useBhoomiData();
  const [chartFilter, setChartFilter] = useState('24h');

  const primaryDevice = devices[0];
  const isOnline = latestData && (new Date().getTime() - new Date(latestData.created_at).getTime()) < 60000;

  const kpis = [
    { label: 'Soil Moisture', value: `${latestData?.moisture || 42.5}`, unit: '%', status: 'Optimal', icon: Droplets, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
    { label: 'pH Level', value: `${latestData?.ph || 6.5}`, unit: '', status: 'Optimal', icon: FlaskConical, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/20' },
    { label: 'Temperature', value: `${latestData?.temperature || 28.8}`, unit: '°C', status: 'High', icon: Thermometer, color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-900/20' },
    { label: 'Nitrogen', value: `${latestData?.nitrogen || 45}`, unit: 'mg/kg', status: 'Low', icon: Sprout, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
    { label: 'Phosphorus', value: `${latestData?.phosphorus || 30}`, unit: 'mg/kg', status: 'Optimal', icon: Sprout, color: 'text-cyan-500', bg: 'bg-cyan-50 dark:bg-cyan-900/20' },
    { label: 'Potassium', value: `${latestData?.potassium || 120}`, unit: 'mg/kg', status: 'Optimal', icon: Sprout, color: 'text-indigo-500', bg: 'bg-indigo-50 dark:bg-indigo-900/20' },
  ];

  return (
    <div className="space-y-6 pb-12 font-sans relative">
      
      {/* Background Ornaments */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-[50%] h-[50%] rounded-full bg-bhoomi-300/5 dark:bg-bhoomi-900/10 blur-[120px]"></div>
        <div className="absolute top-[40%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-300/5 dark:bg-blue-900/10 blur-[120px]"></div>
      </div>

      {/* 1. Hero Section */}
      <div className="relative z-10 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 rounded-[24px] sm:rounded-[32px] overflow-hidden flex flex-col lg:flex-row shadow-sm hover:shadow-lg transition-shadow">
        
        {/* Left Stats */}
        <div className="lg:w-[60%] p-6 sm:p-8 lg:p-12 flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-6">
            <span className="flex items-center gap-1.5 px-3 py-1 bg-bhoomi-100 dark:bg-bhoomi-900/30 text-bhoomi-700 dark:text-bhoomi-400 text-xs font-bold rounded-full uppercase tracking-wider">
              <span className="w-1.5 h-1.5 bg-bhoomi-500 rounded-full animate-pulse"></span>
              Live Data
            </span>
            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-bold rounded-full uppercase tracking-wider flex items-center gap-1">
              <Target size={12}/> AI Active
            </span>
          </div>

          <h1 className="text-4xl lg:text-5xl font-black text-slate-900 dark:text-white font-display mb-4 tracking-tight">
            Field-A Overview
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium mb-8 max-w-lg text-lg">
            Real-time intelligence from <span className="font-mono text-slate-700 dark:text-slate-300">{primaryDevice?.device_id || 'ESP32-001'}</span>. Farm conditions are currently stable.
          </p>

          <div className="flex flex-wrap gap-6 mb-8">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl"><Wifi size={20} className={isOnline ? 'text-bhoomi-500' : 'text-slate-400'}/></div>
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">{isOnline ? 'Device Online' : 'Offline'}</p>
                <p className="text-xs text-slate-500">Sync: 12s ago</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl"><CloudRain size={20} className="text-blue-500"/></div>
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">72% Rain Prob.</p>
                <p className="text-xs text-slate-500">Weather Today</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Device Render */}
        <div className="lg:w-[40%] bg-gradient-to-br from-bhoomi-50 to-white dark:from-bhoomi-900/20 dark:to-slate-900 p-8 flex items-center justify-center relative h-[250px] sm:h-[300px] lg:h-auto lg:min-h-[350px]">
          <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(#22c55e 1.5px, transparent 1.5px)', backgroundSize: '30px 30px' }}></div>
          <img 
            src="/bhoomi_device.jpg" 
            alt="Bhoomi AI Device" 
            className="absolute inset-0 w-full h-full object-cover z-10 scale-110 lg:translate-y-4 hover:scale-110 lg:hover:scale-125 hover:translate-y-0 transition-transform duration-1000 ease-out" 
            style={{ maskImage: 'linear-gradient(to top, transparent 5%, black 40%)', WebkitMaskImage: 'linear-gradient(to top, transparent 5%, black 40%)' }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 relative z-10">
        
        {/* Health Score Card (Mobile Only - Moved up) */}
        <div className="block xl:hidden">
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-[24px] sm:rounded-[32px] p-6 sm:p-8 border border-slate-200/50 dark:border-slate-800/50 shadow-sm flex flex-col items-center relative overflow-hidden">
            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest self-start mb-2">Overall Soil Health</h3>
            
            <div className="relative w-40 h-40 sm:w-48 sm:h-48 mt-4 mb-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={[{value: 97}, {value: 3}]} cx="50%" cy="50%" innerRadius="70%" outerRadius="85%" startAngle={210} endAngle={-30} dataKey="value" stroke="none" cornerRadius={10}>
                    <Cell fill="#22c55e" />
                    <Cell fill="rgba(148, 163, 184, 0.2)" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
                <span className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white font-display">97</span>
                <span className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-widest">Excellent</span>
              </div>
            </div>
            
            <div className="w-full bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300">
                <Target size={16} className="text-bhoomi-500"/> AI Confidence
              </div>
              <span className="text-sm font-black text-slate-900 dark:text-white">High (98%)</span>
            </div>
          </div>
        </div>

        {/* Main Analytics Area (Left 2 Columns) */}
        <div className="xl:col-span-2 space-y-6">
          
          {/* 2. KPI Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {kpis.map((kpi, idx) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}
                key={idx} className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-[24px] p-4 sm:p-5 border border-slate-200/50 dark:border-slate-800/50 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-2.5 rounded-xl ${kpi.bg} ${kpi.color} group-hover:scale-110 transition-transform`}>
                    <kpi.icon size={20} />
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                    kpi.status === 'Optimal' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                    kpi.status === 'Low' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                    'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                  }`}>
                    {kpi.status}
                  </span>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{kpi.label}</h4>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-slate-900 dark:text-white">{kpi.value}</span>
                    <span className="text-xs font-bold text-slate-400">{kpi.unit}</span>
                  </div>
                </div>
                {/* Mini Sparkline Background */}
                <div className="absolute bottom-0 left-0 right-0 h-10 opacity-20">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={historyData.slice(-10)}>
                      <Line type="monotone" dataKey="moisture" stroke="currentColor" className={kpi.color} strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            ))}
          </div>

          {/* 4. Live Analytics Section */}
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-[32px] p-6 lg:p-8 border border-slate-200/50 dark:border-slate-800/50 shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white font-display">Live Farm Analytics</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Moisture & Temperature Trends</p>
              </div>
              <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                {['24h', '7d', '30d'].map(filter => (
                  <button 
                    key={filter}
                    onClick={() => setChartFilter(filter)}
                    className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${chartFilter === filter ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={historyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorMoist" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f97316" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.1)" />
                  <XAxis dataKey="timestamp" tickFormatter={(t) => new Date(t).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} stroke="rgba(148, 163, 184, 0.5)" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis yAxisId="left" stroke="rgba(148, 163, 184, 0.5)" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis yAxisId="right" orientation="right" stroke="rgba(148, 163, 184, 0.5)" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)', backgroundColor: 'rgba(255,255,255,0.9)' }} />
                  <Area yAxisId="left" type="monotone" dataKey="moisture" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorMoist)" />
                  <Area yAxisId="right" type="monotone" dataKey="temperature" stroke="#f97316" strokeWidth={3} fillOpacity={1} fill="url(#colorTemp)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 7. Weather Integration */}
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-[24px] p-6 border border-slate-200/50 dark:border-slate-800/50 shadow-sm">
              <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest mb-4">Local Weather</h3>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-orange-100 dark:bg-orange-900/20 text-orange-500 rounded-2xl">
                    <Sun size={32} />
                  </div>
                  <div>
                    <div className="text-3xl font-black text-slate-900 dark:text-white">32°C</div>
                    <div className="text-sm font-medium text-slate-500">Sunny • AQI 42</div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { l: 'Humidity', v: '64%', i: Droplets },
                  { l: 'Wind', v: '12 km/h', i: Wind },
                  { l: 'Rain Prob.', v: '72%', i: CloudRain },
                  { l: 'Sunrise', v: '05:42 AM', i: Sun }
                ].map((w, i) => (
                  <div key={i} className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                    <w.i size={16} className="text-slate-400"/>
                    <div>
                      <div className="text-[10px] text-slate-500 font-bold uppercase">{w.l}</div>
                      <div className="text-sm font-bold text-slate-900 dark:text-white">{w.v}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 11. Daily Farm Summary */}
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-[24px] p-6 border border-slate-200/50 dark:border-slate-800/50 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest mb-2">Today's Intelligence</h3>
                <p className="text-xs text-slate-500 mb-6">Automated summary of farm activities and predictions.</p>
              </div>
              <ul className="space-y-4">
                {[
                  { text: 'Soil Health improved by 2% since yesterday', i: TrendingUp, c: 'text-bhoomi-500' },
                  { text: 'Saved 120L water by skipping morning irrigation', i: Droplets, c: 'text-blue-500' },
                  { text: 'Generated 4 new AI crop recommendations', i: Target, c: 'text-purple-500' },
                  { text: 'Predicted yield increase of 5% for Tomato crop', i: Sprout, c: 'text-emerald-500' }
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className={`mt-0.5 ${item.c}`}><item.i size={16} /></div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>

        {/* AI & Intelligence Sidebar (Right Column) */}
        <div className="space-y-6">
          
          {/* 3. Soil Health Score (Gauge) - Hidden on Mobile */}
          <div className="hidden xl:flex bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-[32px] p-8 border border-slate-200/50 dark:border-slate-800/50 shadow-sm flex-col items-center relative overflow-hidden">
            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest self-start mb-2">Overall Soil Health</h3>
            
            <div className="relative w-48 h-48 mt-4 mb-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={[{value: 97}, {value: 3}]} cx="50%" cy="50%" innerRadius={70} outerRadius={85} startAngle={210} endAngle={-30} dataKey="value" stroke="none" cornerRadius={10}>
                    <Cell fill="#22c55e" />
                    <Cell fill="rgba(148, 163, 184, 0.2)" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
                <span className="text-5xl font-black text-slate-900 dark:text-white font-display">97</span>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Excellent</span>
              </div>
            </div>
            
            <div className="w-full bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300">
                <Target size={16} className="text-bhoomi-500"/> AI Confidence
              </div>
              <span className="text-sm font-black text-slate-900 dark:text-white">High (98%)</span>
            </div>
          </div>

          {/* 5. AI Insights Panel */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[32px] p-6 text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-bhoomi-500/20 blur-3xl rounded-full"></div>
            
            <div className="flex items-center justify-between mb-6 relative z-10">
              <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                <Target size={16} className="text-bhoomi-400"/> AI Insights
              </h3>
            </div>

            <div className="space-y-4 relative z-10">
              {/* Crop Recommendation */}
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                <div className="flex items-center gap-2 mb-2 text-bhoomi-300">
                  <Sprout size={16} /> <span className="text-xs font-bold uppercase">Best Crop</span>
                </div>
                <div className="flex justify-between items-baseline mb-2">
                  <span className="text-xl font-bold">Tomato</span>
                  <span className="text-xs bg-bhoomi-500/20 text-bhoomi-300 px-2 py-0.5 rounded-full font-bold">94% Match</span>
                </div>
                <div className="text-xs text-slate-300 flex justify-between">
                  <span>Yield: 14 t/ac</span>
                  <span className="text-bhoomi-300 font-bold">Est: ₹1.1L</span>
                </div>
              </div>

              {/* Irrigation Forecast */}
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                <div className="flex items-center gap-2 mb-2 text-blue-300">
                  <Droplets size={16} /> <span className="text-xs font-bold uppercase">Irrigation</span>
                </div>
                <p className="text-sm font-medium mb-2">No irrigation required today.</p>
                <div className="text-xs text-slate-300">
                  Next: Tomorrow 6:00 AM (18 L/m²)
                </div>
              </div>

              {/* Fertilizer Rec */}
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                <div className="flex items-center gap-2 mb-2 text-purple-300">
                  <FlaskConical size={16} /> <span className="text-xs font-bold uppercase">Fertilizer</span>
                </div>
                <p className="text-sm font-medium">Nitrogen slightly low. Apply 25 kg urea per acre within 48h.</p>
              </div>
            </div>
          </div>

          {/* 6. Voice Assistant Card */}
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-[32px] p-6 border border-slate-200/50 dark:border-slate-800/50 shadow-sm text-center">
            <h3 className="text-lg font-black text-slate-900 dark:text-white font-display mb-1">Ask Bhoomi AI</h3>
            <p className="text-xs text-slate-500 mb-6">Talk to your farm in your language</p>
            
            <button className="w-20 h-20 bg-gradient-to-tr from-bhoomi-600 to-bhoomi-400 rounded-full flex items-center justify-center text-white mx-auto shadow-xl shadow-bhoomi-500/30 hover:scale-105 transition-transform relative group mb-6">
              <div className="absolute inset-0 rounded-full bg-bhoomi-400/50 animate-ping group-hover:animate-none"></div>
              <Mic size={32} className="relative z-10" />
            </button>

            <select className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm font-bold text-slate-700 dark:text-slate-300 outline-none mb-4 appearance-none text-center">
              <option value="te">🗣 Telugu</option>
              <option value="hi">🗣 Hindi</option>
              <option value="en">🗣 English</option>
            </select>

            <div className="flex flex-col gap-2">
              {['Do I need irrigation today?', 'Which crop should I plant?'].map((q, i) => (
                <button key={i} className="text-xs font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 py-2 rounded-lg transition-colors">
                  "{q}"
                </button>
              ))}
            </div>
          </div>

          {/* 10. Alerts */}
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-[24px] p-6 border border-slate-200/50 dark:border-slate-800/50 shadow-sm">
             <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Recent Alerts</h3>
              <span className="text-xs font-bold text-bhoomi-500 cursor-pointer hover:underline">View All</span>
            </div>
            <div className="space-y-3">
              {(alerts.length > 0 ? alerts.slice(0, 3) : [
                { id: '1', message: 'Low Moisture in Field-A', severity: 'high', timestamp: new Date().toISOString() },
                { id: '2', message: 'Irrigation Completed', severity: 'low', timestamp: new Date().toISOString() }
              ]).map((alert, i) => (
                <div key={alert.id || i} className={`p-3 rounded-xl border flex items-center justify-between ${
                  alert.severity === 'high' ? 'bg-red-50/50 border-red-100 dark:bg-red-900/10 dark:border-red-900/30' :
                  alert.severity === 'medium' ? 'bg-amber-50/50 border-amber-100 dark:bg-amber-900/10 dark:border-amber-900/30' :
                  'bg-bhoomi-50/50 border-bhoomi-100 dark:bg-bhoomi-900/10 dark:border-bhoomi-900/30'
                }`}>
                  <div className="flex items-center gap-3">
                    <div className={`${
                      alert.severity === 'high' ? 'text-red-500' :
                      alert.severity === 'medium' ? 'text-amber-500' :
                      'text-bhoomi-500'
                    }`}>
                      <AlertTriangle size={16} />
                    </div>
                    <p className={`text-xs font-bold ${
                      alert.severity === 'high' ? 'text-red-900 dark:text-red-400' :
                      alert.severity === 'medium' ? 'text-amber-900 dark:text-amber-400' :
                      'text-bhoomi-900 dark:text-bhoomi-400'
                    }`}>{alert.message}</p>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium">Just now</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
