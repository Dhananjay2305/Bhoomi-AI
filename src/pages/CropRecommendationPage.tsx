import { useBhoomiData } from '../contexts/MockDataProvider';
import { Sprout, Target, Droplets, Thermometer, FlaskConical } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CropRecommendationPage() {
  const { latestData, recommendations, farmProfile } = useBhoomiData();

  if (!recommendations) return null;

  return (
    <div className="space-y-6 font-sans">
      <div className="bg-gradient-to-r from-emerald-600 to-teal-500 rounded-[32px] p-8 lg:p-10 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-3xl rounded-full pointer-events-none"></div>
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 mb-4 text-emerald-100 font-bold tracking-widest uppercase text-sm">
            <Sprout size={18} /> AI Crop Intelligence
          </div>
          <h1 className="text-3xl lg:text-5xl font-black font-display mb-4">Crop Suitability Analysis</h1>
          <p className="text-emerald-50 text-lg leading-relaxed mb-6">
            Based on your current soil profile, weather patterns, and field history, our AI has identified the most suitable crops for maximum yield and minimum risk.
          </p>
          <div className="inline-flex items-center gap-2 bg-black/20 backdrop-blur-md px-4 py-2 rounded-xl text-sm font-bold">
            <span>Current Farm Setting:</span>
            <span className="text-emerald-200">{farmProfile.crop} ({farmProfile.stage})</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col: Soil Profile Context */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-[32px] p-6 border border-slate-200/50 dark:border-slate-800/50 shadow-sm">
            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest mb-6">Current Soil Profile</h3>
            
            <div className="space-y-5">
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-bold">
                  <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1"><FlaskConical size={14}/> pH Level</span>
                  <span className="text-slate-900 dark:text-white">{latestData?.ph.toFixed(1)}</span>
                </div>
                <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 rounded-full" style={{ width: `${(latestData?.ph || 0) / 14 * 100}%` }}></div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm font-bold">
                  <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1"><Droplets size={14}/> Moisture</span>
                  <span className="text-slate-900 dark:text-white">{latestData?.moisture.toFixed(1)}%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: `${latestData?.moisture}%` }}></div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mt-4">
                <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-2xl text-center">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Nitrogen</div>
                  <div className="text-lg font-black text-slate-900 dark:text-white mt-1">{latestData?.nitrogen}</div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-2xl text-center">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Phosphorus</div>
                  <div className="text-lg font-black text-slate-900 dark:text-white mt-1">{latestData?.phosphorus}</div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-2xl text-center">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Potassium</div>
                  <div className="text-lg font-black text-slate-900 dark:text-white mt-1">{latestData?.potassium}</div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-emerald-50 dark:bg-emerald-900/10 rounded-2xl border border-emerald-100 dark:border-emerald-900/30">
               <h4 className="text-xs font-bold text-emerald-800 dark:text-emerald-400 uppercase mb-2">AI Soil Summary</h4>
               <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300 leading-relaxed">
                 {recommendations.explanation}
               </p>
            </div>
          </div>
        </div>

        {/* Right Col: Recommendations List */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest pl-2">Top Recommendations</h3>
          
          {recommendations.crops.map((crop, idx) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              key={idx} 
              className={`p-6 rounded-[24px] border backdrop-blur-md shadow-sm transition-all hover:shadow-md ${
                idx === 0 
                  ? 'bg-emerald-50/50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800/50 relative overflow-hidden' 
                  : 'bg-white/80 dark:bg-slate-900/80 border-slate-200/50 dark:border-slate-800/50'
              }`}
            >
              {idx === 0 && (
                <div className="absolute top-4 right-4 flex items-center gap-1 bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                  <Target size={12}/> Best Match
                </div>
              )}
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <div>
                  <h3 className="text-2xl font-black font-display text-slate-900 dark:text-white">{crop.name}</h3>
                  <p className={`text-sm font-medium mt-1 ${idx === 0 ? 'text-emerald-700 dark:text-emerald-300' : 'text-slate-500 dark:text-slate-400'}`}>
                    {crop.reason}
                  </p>
                </div>
                <div className="shrink-0 flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Suitability</div>
                    <div className={`text-3xl font-black ${idx === 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'}`}>
                      {crop.match}%
                    </div>
                  </div>
                  {/* Circular progress visual */}
                  <div className="relative w-12 h-12 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="none" className="text-slate-100 dark:text-slate-800" />
                      <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="none" className={idx === 0 ? 'text-emerald-500' : 'text-slate-300 dark:text-slate-600'} strokeDasharray="125" strokeDashoffset={125 - (125 * crop.match) / 100} strokeLinecap="round" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/50 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300">
                  <Droplets size={14} className="text-blue-500"/> Water: {crop.waterReq}
                </div>
                <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/50 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300">
                  <Thermometer size={14} className="text-orange-500"/> Period: {crop.growingPeriod}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
