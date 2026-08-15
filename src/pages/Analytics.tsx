import { useState } from 'react';
import { useBhoomiData } from '../contexts/MockDataProvider';
import { 
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { motion } from 'framer-motion';
import { Droplets, Sprout } from 'lucide-react';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-panel p-4 !rounded-xl !bg-white/90 dark:!bg-slate-900/90 shadow-glass border-none">
        <p className="text-slate-500 text-xs font-bold mb-2 uppercase tracking-widest">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 text-sm font-bold">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></div>
            <span className="text-slate-800 dark:text-white capitalize">{entry.name}:</span>
            <span style={{ color: entry.color }}>{Number(entry.value).toFixed(1)}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function Analytics() {
  const { historyData } = useBhoomiData();
  const [timeRange, setTimeRange] = useState('Today');

  const chartData = historyData.map(d => ({
    ...d,
    time: new Date(d.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  }));

  const filters = ['Today', '7 Days', '30 Days', 'Season'];

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white font-display">Farm Analytics</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Historical telemetry & performance tracking</p>
        </div>
        
        <div className="flex flex-wrap glass-card p-1 gap-1">
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setTimeRange(f)}
              className={`px-4 sm:px-5 py-2 text-xs sm:text-sm font-bold rounded-full transition-all ${
                timeRange === f 
                  ? 'bg-bhoomi-500 text-white shadow-md shadow-bhoomi-500/20' 
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Top Value Add Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-panel p-6 flex items-center justify-between bg-gradient-to-r from-blue-50 to-transparent dark:from-blue-900/10">
          <div>
            <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-1">Water Saved</h4>
            <div className="text-3xl sm:text-4xl font-black text-blue-600 dark:text-blue-400 font-display">42,000<span className="text-lg sm:text-xl">L</span></div>
            <p className="text-xs sm:text-sm text-blue-500 mt-1 font-medium">+12% this season</p>
          </div>
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-500 shrink-0">
            <Droplets className="w-6 h-6 sm:w-8 sm:h-8"/>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-panel p-6 flex items-center justify-between bg-gradient-to-r from-emerald-50 to-transparent dark:from-emerald-900/10">
          <div>
            <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-1">Expected Yield</h4>
            <div className="text-3xl sm:text-4xl font-black text-emerald-600 dark:text-emerald-400 font-display">14.2<span className="text-lg sm:text-xl">Tons</span></div>
            <p className="text-xs sm:text-sm text-emerald-500 mt-1 font-medium">Optimal trajectory maintained</p>
          </div>
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center text-emerald-500 shrink-0">
            <Sprout className="w-6 h-6 sm:w-8 sm:h-8"/>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Moisture Trend */}
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="glass-card p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-bold text-slate-800 dark:text-white mb-4 sm:mb-6 font-display">Moisture Over Time</h3>
          <div className="h-60 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorMoisture" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="opacity-10 dark:opacity-5" />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} minTickGap={20} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} domain={[0, 100]} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="moisture" stroke="#3b82f6" strokeWidth={3} sm:strokeWidth={4} fillOpacity={1} fill="url(#colorMoisture)" activeDot={{ r: 6, strokeWidth: 0 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* pH Trend */}
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }} className="glass-card p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-bold text-slate-800 dark:text-white mb-4 sm:mb-6 font-display">Soil pH Trend</h3>
          <div className="h-60 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="opacity-10 dark:opacity-5" />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} minTickGap={20} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} domain={[4, 9]} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="ph" stroke="#8b5cf6" strokeWidth={3} dot={false} activeDot={{ r: 6, strokeWidth: 0 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* NPK Trend */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card p-4 sm:p-6 lg:col-span-2">
          <h3 className="text-base sm:text-lg font-bold text-slate-800 dark:text-white mb-4 sm:mb-6 font-display">Macronutrients (NPK)</h3>
          <div className="h-64 sm:h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="opacity-10 dark:opacity-5" />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} minTickGap={20} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '10px', fontSize: '12px', fontWeight: 'bold' }} />
                <Line type="monotone" dataKey="nitrogen" name="Nitrogen" stroke="#22c55e" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
                <Line type="monotone" dataKey="phosphorus" name="Phosphorus" stroke="#f59e0b" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
                <Line type="monotone" dataKey="potassium" name="Potassium" stroke="#ef4444" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
