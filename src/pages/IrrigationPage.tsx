import { useBhoomiData } from '../contexts/MockDataProvider';
import { Droplets, Power, AlertTriangle, CloudRain, Settings } from 'lucide-react';

export default function IrrigationPage() {
  const { 
    latestData, weather, recommendations, 
    pumpStatus, pumpMode, togglePump, setPumpMode 
  } = useBhoomiData();

  return (
    <div className="space-y-6 font-sans">
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-[32px] p-6 lg:p-8 border border-slate-200/50 dark:border-slate-800/50 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white font-display">AI Irrigation System</h1>
          <p className="text-slate-500 font-medium mt-1">Smart water management based on soil and weather data.</p>
        </div>
        <div className="flex items-center gap-3 bg-white dark:bg-slate-800 p-2 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
          <button 
            onClick={() => setPumpMode('MANUAL')}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${pumpMode === 'MANUAL' ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-md' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
          >
            Manual
          </button>
          <button 
            onClick={() => setPumpMode('AUTO')}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${pumpMode === 'AUTO' ? 'bg-blue-500 text-white shadow-md shadow-blue-500/30' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
          >
            AI Auto
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Control Panel */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-[32px] p-8 border border-slate-200/50 dark:border-slate-800/50 shadow-sm">
            <div className="flex flex-col md:flex-row items-center gap-8">
              
              {/* Pump Status Visual */}
              <div className="flex flex-col items-center justify-center shrink-0">
                <button 
                  onClick={() => pumpMode === 'MANUAL' && togglePump()}
                  disabled={pumpMode === 'AUTO'}
                  className={`relative w-48 h-48 rounded-full flex flex-col items-center justify-center transition-all duration-500 ${
                    pumpStatus === 'ON' 
                      ? 'bg-blue-500 text-white shadow-[0_0_60px_rgba(59,130,246,0.6)]' 
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-[8px] border-slate-200 dark:border-slate-700'
                  } ${pumpMode === 'AUTO' ? 'opacity-90 cursor-not-allowed' : 'hover:scale-105 cursor-pointer'}`}
                >
                  {pumpStatus === 'ON' && (
                    <>
                      <div className="absolute inset-0 rounded-full border border-blue-400 animate-ping" style={{ animationDuration: '2s' }}></div>
                      <div className="absolute inset-0 rounded-full border border-blue-300 animate-ping" style={{ animationDuration: '2.5s', animationDelay: '0.5s' }}></div>
                    </>
                  )}
                  <Power size={48} className={`mb-2 relative z-10 ${pumpStatus === 'ON' ? 'text-white' : 'text-slate-400'}`} />
                  <span className="text-2xl font-black tracking-widest relative z-10">{pumpStatus}</span>
                </button>
                {pumpMode === 'AUTO' && (
                  <span className="mt-4 text-xs font-bold text-blue-500 uppercase tracking-widest flex items-center gap-1">
                    <Settings size={14}/> AI Controlled
                  </span>
                )}
              </div>

              {/* AI Decision Panel */}
              <div className="flex-1 bg-blue-50/50 dark:bg-blue-900/10 p-6 rounded-3xl border border-blue-100 dark:border-blue-900/30">
                <div className="flex items-center gap-2 mb-4 text-blue-600 dark:text-blue-400">
                  <Droplets size={20} />
                  <h3 className="font-black uppercase tracking-widest text-sm">AI Irrigation Decision</h3>
                </div>
                
                <div className="text-2xl font-black text-slate-900 dark:text-white mb-2 font-display">
                  {recommendations?.irrigation || 'Wait'}
                </div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                  {recommendations?.irrigationExplanation}
                </p>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                    <span className="text-xs font-bold text-slate-400 uppercase">Soil Moisture</span>
                    <div className="text-xl font-black mt-1 text-slate-900 dark:text-white">{latestData?.moisture}%</div>
                  </div>
                  <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                    <span className="text-xs font-bold text-slate-400 uppercase">Rain Probability</span>
                    <div className="text-xl font-black mt-1 text-blue-500">{weather.rainProbability}%</div>
                  </div>
                </div>
              </div>

            </div>
          </div>
          
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-[32px] p-6 border border-slate-200/50 dark:border-slate-800/50 shadow-sm">
            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest mb-4">Safety & Limits</h3>
            <div className="flex gap-4 flex-wrap">
              <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 px-4 py-2 rounded-xl text-sm font-bold">
                Max Runtime: 45 min
              </div>
              <div className="flex items-center gap-2 bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400 px-4 py-2 rounded-xl text-sm font-bold">
                Cooldown: 2 hrs
              </div>
              <div className="flex items-center gap-2 bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400 px-4 py-2 rounded-xl text-sm font-bold">
                <AlertTriangle size={16}/> Override Active: Over-watering Protection
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-800 dark:to-slate-900 rounded-[32px] p-6 text-white shadow-xl">
            <h3 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-2">
              <CloudRain size={18} className="text-blue-400"/> Weather Impact
            </h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-white/10 pb-4">
                <span className="text-slate-400 font-medium text-sm">Condition</span>
                <span className="font-bold">{weather.condition}</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/10 pb-4">
                <span className="text-slate-400 font-medium text-sm">Temperature</span>
                <span className="font-bold">{weather.temperature}°C</span>
              </div>
              <div className="flex justify-between items-center pb-2">
                <span className="text-slate-400 font-medium text-sm">Forecast</span>
                <span className="font-bold text-right text-sm max-w-[120px]">{weather.forecast}</span>
              </div>
            </div>
          </div>

          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-[32px] p-6 border border-slate-200/50 dark:border-slate-800/50 shadow-sm">
             <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest mb-4">Irrigation History</h3>
             <div className="space-y-3">
               {[
                 { date: 'Today, 06:00 AM', duration: '20 mins', trigger: 'AI Auto' },
                 { date: 'Yesterday, 05:45 AM', duration: '18 mins', trigger: 'AI Auto' },
                 { date: 'Mon, 08:30 AM', duration: '15 mins', trigger: 'Manual' },
               ].map((log, i) => (
                 <div key={i} className="bg-slate-50 dark:bg-slate-800 p-3 rounded-2xl flex justify-between items-center">
                   <div>
                     <p className="text-sm font-bold text-slate-900 dark:text-white">{log.date}</p>
                     <p className="text-xs text-slate-500 font-medium mt-0.5">{log.trigger}</p>
                   </div>
                   <span className="text-sm font-black text-blue-500">{log.duration}</span>
                 </div>
               ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
