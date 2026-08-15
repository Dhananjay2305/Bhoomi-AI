import React, { useState } from 'react';
import { useBhoomiData } from '../contexts/MockDataProvider';
import { Activity, Thermometer, Droplets, Zap, Leaf, CheckCircle2, ChevronDown, CloudRain } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

const getStatusColor = (val: number, min: number, max: number) => {
  if (val < min) return 'text-red-500 bg-red-100 dark:bg-red-500/20 stroke-red-500';
  if (val > max) return 'text-amber-500 bg-amber-100 dark:bg-amber-500/20 stroke-amber-500';
  return 'text-bhoomi-500 bg-bhoomi-100 dark:bg-bhoomi-500/20 stroke-bhoomi-500';
};

const GaugeCard = ({ title, value, unit, icon: Icon, history, dataKey, min, max, delay }: any) => {
  const currentVal = Number(value);
  const colorClass = getStatusColor(currentVal, min, max);
  
  // Calculate percentage for circular gauge (mock math for visual purposes)
  const range = max * 1.5; 
  const percentage = Math.min(100, Math.max(0, (currentVal / range) * 100));
  const strokeDasharray = `${(percentage * 251.2) / 100} 251.2`;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay }}
      className="glass-card p-6 flex flex-col justify-between group"
    >
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
          <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg group-hover:bg-bhoomi-50 dark:group-hover:bg-bhoomi-900/30 transition-colors">
            <Icon size={18} className="text-slate-700 dark:text-slate-300 group-hover:text-bhoomi-500 transition-colors"/>
          </div>
          <span className="font-bold text-sm">{title}</span>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="relative w-24 h-24 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" className="stroke-slate-200 dark:stroke-slate-800" strokeWidth="8" fill="none" />
            <circle 
              cx="50" cy="50" r="40" 
              className={`${colorClass.split(' ')[2]} transition-all duration-1000 ease-out`} 
              strokeWidth="8" fill="none" 
              strokeLinecap="round"
              strokeDasharray={strokeDasharray}
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center">
            <span className="text-xl font-black text-slate-900 dark:text-white font-display">{value}</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{unit}</span>
          </div>
        </div>

        <div className="w-24 h-16 opacity-50 group-hover:opacity-100 transition-opacity">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={history}>
              <Line type="monotone" dataKey={dataKey} stroke="currentColor" strokeWidth={2.5} dot={false} className="text-bhoomi-500" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
};

const CropRecommendation = ({ crop }: { crop: any }) => {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <div className="glass-panel bg-white/40 dark:bg-slate-800/40 p-5 border border-slate-200/50 dark:border-slate-700/50 rounded-2xl transition-all hover:bg-white/60 dark:hover:bg-slate-800/60">
      <div className="flex justify-between items-center mb-4 cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-bhoomi-400 to-emerald-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-bhoomi-500/20">
            {crop.name.charAt(0)}
          </div>
          <div>
            <h4 className="font-bold text-lg text-slate-900 dark:text-white">{crop.name}</h4>
            <div className="flex items-center gap-1 text-xs font-semibold text-bhoomi-600 dark:text-bhoomi-400">
              <CheckCircle2 size={12}/> {crop.match}% Match
            </div>
          </div>
        </div>
        <ChevronDown className={`text-slate-400 transition-transform ${expanded ? 'rotate-180' : ''}`} />
      </div>
      
      <AnimatePresence>
        {expanded && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pt-4 border-t border-slate-200 dark:border-slate-700/50 grid grid-cols-2 gap-4 mb-4">
              <div>
                <div className="text-xs text-slate-500 font-medium mb-1">Expected Yield</div>
                <div className="font-bold text-slate-900 dark:text-white">14 tons/acre</div>
              </div>
              <div>
                <div className="text-xs text-slate-500 font-medium mb-1">Est. Profit</div>
                <div className="font-bold text-slate-900 dark:text-white text-emerald-500">₹1,10,000</div>
              </div>
              <div>
                <div className="text-xs text-slate-500 font-medium mb-1">Water Required</div>
                <div className="font-bold text-slate-900 dark:text-white">Low</div>
              </div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl text-xs text-slate-600 dark:text-slate-400 font-medium">
              <span className="font-bold text-slate-900 dark:text-white">Why?</span> Current pH and NPK levels perfectly align with the optimal growth parameters for {crop.name}.
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function Dashboard() {
  const { latestData, historyData, recommendations, healthScore } = useBhoomiData();

  if (!latestData || !recommendations) {
    return (
      <div className="flex h-[80vh] items-center justify-center flex-col gap-4">
        <div className="w-12 h-12 border-4 border-bhoomi-200 border-t-bhoomi-500 rounded-full animate-spin"></div>
        <div className="text-slate-500 font-medium animate-pulse">Syncing with ESP32...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Overview Top Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white font-display tracking-tight">Field A Overview</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Real-time intelligence from Node ESP32-001</p>
        </div>
        <div className="glass-card px-6 py-3 flex items-center gap-6">
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Health Score</div>
            <div className="flex items-center gap-2">
              <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-bhoomi-600 to-emerald-400 font-display">{healthScore}</div>
              <div className="text-sm font-bold text-slate-400">/100</div>
            </div>
          </div>
          <div className="w-16 h-16">
            {/* Mini Health Gauge */}
            <svg viewBox="0 0 100 100" className="transform -rotate-90">
              <circle cx="50" cy="50" r="40" className="stroke-slate-100 dark:stroke-slate-800" strokeWidth="12" fill="none" />
              <circle cx="50" cy="50" r="40" className="stroke-bhoomi-500 transition-all duration-1000" strokeWidth="12" fill="none" strokeLinecap="round" strokeDasharray={`${(healthScore * 251.2) / 100} 251.2`} />
            </svg>
          </div>
        </div>
      </div>

      {/* Sensor Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
        <GaugeCard title="Soil Moisture" value={latestData.moisture.toFixed(1)} unit="%" icon={Droplets} history={historyData} dataKey="moisture" min={30} max={60} delay={0.1} />
        <GaugeCard title="pH Level" value={latestData.ph.toFixed(1)} unit="pH" icon={Activity} history={historyData} dataKey="ph" min={5.5} max={7.5} delay={0.2} />
        <GaugeCard title="Temperature" value={latestData.temperature.toFixed(1)} unit="°C" icon={Thermometer} history={historyData} dataKey="temperature" min={20} max={35} delay={0.3} />
        <GaugeCard title="Nitrogen (N)" value={Math.round(latestData.nitrogen)} unit="mg/kg" icon={Leaf} history={historyData} dataKey="nitrogen" min={35} max={80} delay={0.4} />
        <GaugeCard title="Phosphorus (P)" value={Math.round(latestData.phosphorus)} unit="mg/kg" icon={Leaf} history={historyData} dataKey="phosphorus" min={20} max={60} delay={0.5} />
        <GaugeCard title="Potassium (K)" value={Math.round(latestData.potassium)} unit="mg/kg" icon={Leaf} history={historyData} dataKey="potassium" min={15} max={50} delay={0.6} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AI Recommendations Panel */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.7 }}
          className="glass-panel p-6 lg:p-8 lg:col-span-2"
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-r from-bhoomi-500 to-emerald-400 text-white shadow-neon-green">
                <Zap size={20} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white font-display">AI Crop Insights</h3>
            </div>
            <div className="px-3 py-1 bg-bhoomi-50 text-bhoomi-600 dark:bg-bhoomi-900/30 dark:text-bhoomi-400 text-xs font-bold rounded-full uppercase tracking-widest">
              Live Evaluation
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {recommendations.crops.slice(0, 4).map((crop, i) => (
              <CropRecommendation key={i} crop={crop} />
            ))}
          </div>
          
          <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-start gap-4">
            <div className="p-2 bg-slate-200 dark:bg-slate-800 rounded-lg text-slate-500 mt-1"><Leaf size={16}/></div>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white">Fertilizer Action Plan</h4>
              <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">{recommendations.fertilizer}</p>
            </div>
          </div>
        </motion.div>

        {/* Smart Irrigation Forecast */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.8 }}
          className="glass-card bg-gradient-to-b from-blue-50/50 to-white dark:from-blue-900/10 dark:to-slate-900/40 p-6 lg:p-8 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400/10 blur-[40px] rounded-full"></div>
          
          <h3 className="text-xl font-bold text-slate-900 dark:text-white font-display mb-6 flex items-center gap-2">
            <CloudRain className="text-blue-500"/> Irrigation Forecast
          </h3>

          <div className="text-center py-6 mb-6">
            <div className={`inline-block px-4 py-1 rounded-full text-sm font-bold mb-4 uppercase tracking-widest ${
              recommendations.irrigation === 'Water Now' ? 'bg-red-100 text-red-600' : 
              recommendations.irrigation === 'Wait' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'
            }`}>
              {recommendations.irrigation}
            </div>
            <p className="text-slate-600 dark:text-slate-400 font-medium">{recommendations.irrigationExplanation}</p>
          </div>

          <div className="space-y-4">
            <div className="bg-white/60 dark:bg-slate-800/60 p-4 rounded-2xl flex justify-between items-center border border-slate-100 dark:border-slate-700/50">
              <span className="text-sm font-bold text-slate-500">Next Irrigation</span>
              <span className="font-black text-slate-900 dark:text-white">Tomorrow, 6:00 AM</span>
            </div>
            <div className="bg-white/60 dark:bg-slate-800/60 p-4 rounded-2xl flex justify-between items-center border border-slate-100 dark:border-slate-700/50">
              <span className="text-sm font-bold text-slate-500">Water Required</span>
              <span className="font-black text-blue-600 dark:text-blue-400">18 L/m²</span>
            </div>
            <div className="bg-white/60 dark:bg-slate-800/60 p-4 rounded-2xl flex justify-between items-center border border-slate-100 dark:border-slate-700/50">
              <span className="text-sm font-bold text-slate-500">Rain Probability</span>
              <span className="font-black text-slate-900 dark:text-white">72%</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
