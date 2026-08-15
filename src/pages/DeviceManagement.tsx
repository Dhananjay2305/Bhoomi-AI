import { useBhoomiData } from '../contexts/MockDataProvider';
import { Cpu, Plus, Activity, MapPin, Settings, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

export default function DeviceManagement() {
  const { devices, historyData } = useBhoomiData();

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white font-display">Fleet Management</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Configure and monitor your Bhoomi IoT sensors</p>
        </div>
        
        <button className="flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-200 text-white dark:text-slate-900 rounded-full font-bold transition-all shadow-xl shadow-slate-900/20 dark:shadow-white/20 hover:scale-105">
          <Plus size={20} /> Provision Node
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {devices.map((device, index) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            key={device.device_id} 
            className="glass-card p-6 lg:p-8"
          >
            <div className="flex justify-between items-start mb-8">
              <div className="flex items-center gap-5">
                <div className="p-4 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 rounded-2xl border border-white/50 dark:border-slate-700/50 shadow-inner">
                  <Cpu size={36} className="text-slate-700 dark:text-slate-300" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white font-display mb-1">{device.name}</h3>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-500 dark:text-slate-400 text-sm font-mono bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">{device.device_id}</span>
                    <span className="text-slate-400 text-sm font-medium">{device.firmware}</span>
                  </div>
                </div>
              </div>
              <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest ${
                device.status === 'Online' 
                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' 
                  : 'bg-red-100 text-red-700'
              }`}>
                {device.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-white/40 dark:bg-slate-900/40 p-4 rounded-2xl border border-white/60 dark:border-slate-700/50">
                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-1 font-bold">
                  <MapPin size={16} className="text-bhoomi-500" /> Deployment Area
                </div>
                <div className="font-bold text-slate-900 dark:text-white">{device.field_id}</div>
              </div>
              <div className="bg-white/40 dark:bg-slate-900/40 p-4 rounded-2xl border border-white/60 dark:border-slate-700/50">
                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-1 font-bold">
                  <Activity size={16} className="text-bhoomi-500" /> Last Telemetry Sync
                </div>
                <div className="font-bold text-slate-900 dark:text-white">
                  {new Date(device.last_sync).toLocaleTimeString()}
                </div>
              </div>
            </div>

            {/* Mini Health Graph */}
            <div className="mb-8 p-4 bg-white/40 dark:bg-slate-900/40 border border-white/60 dark:border-slate-700/50 rounded-2xl">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Moisture Live Trend</span>
                <span className="text-xs font-bold text-bhoomi-500">Live</span>
              </div>
              <div className="h-16 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={historyData.slice(-20)}>
                    <Line type="stepAfter" dataKey="moisture" stroke="#22c55e" strokeWidth={2} dot={false} isAnimationActive={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <button className="flex-1 min-w-[120px] flex items-center justify-center gap-2 px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors font-bold text-sm shadow-sm">
                <Settings size={18} /> Configure Node
              </button>
              <button className="flex-1 min-w-[120px] flex items-center justify-center gap-2 px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors font-bold text-sm shadow-sm">
                <RefreshCw size={18} /> Calibrate Sensors
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
