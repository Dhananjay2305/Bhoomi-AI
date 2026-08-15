import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, Activity, Battery, Wifi, Cloud, Cpu, Sparkles, Star, ChevronDown, Leaf, Mic, Droplet } from 'lucide-react';
import { useBhoomiData } from '../contexts/MockDataProvider';

export default function LandingPage() {
  // Mock data context used for demonstrations if needed
  useBhoomiData();

  return (
    <div className="flex flex-col pb-24">
      {/* 1. HERO SECTION */}
      <section className="relative pt-16 pb-12 h-[calc(100vh-80px)] min-h-[550px] max-h-[750px] flex items-center">
        {/* Background Overlay */}
        <div className="absolute inset-0 z-0 overflow-hidden bg-white">
          <img src="/bhoomi-bg.png" alt="Bhoomi AI Field" className="w-full h-full object-contain object-right lg:object-[right_center]" />
          <div className="absolute top-0 left-0 bottom-0 w-full lg:w-[65%] bg-gradient-to-r from-white via-white/95 to-transparent"></div>
          {/* Bottom fade to match the dark stats bar */}
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#2a3028] to-transparent"></div>
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12 relative z-10 w-full max-w-[1400px] mx-auto px-6 lg:px-12">
          <motion.div 
            initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}
            className="flex-1 space-y-5 max-w-2xl"
          >
            <div className="inline-flex items-center gap-1.5 text-emerald-700 font-bold text-sm tracking-wide">
              Smart Soil Intelligence <Leaf size={16} /> <Sparkles size={14} />
            </div>
            
            <h1 className="text-6xl lg:text-[76px] font-extrabold text-[#0B1521] leading-[1.05] tracking-tight font-display">
              AI That <br className="hidden lg:block"/>
              Understands <br className="hidden lg:block"/>
              Your <span className="text-[#105e32]">Soil</span> Before <br className="hidden lg:block"/>
              You Plant.
            </h1>
            
            <p className="text-xl text-slate-600 leading-relaxed font-alt font-medium pt-2">
              Real-time soil monitoring, AI crop recommendation,<br className="hidden lg:block"/>
              smart irrigation, and voice assistance in your language.
            </p>
            
            <div className="flex flex-wrap items-center gap-3 py-4">
              <div className="flex items-center gap-3 bg-white/90 backdrop-blur-md px-4 py-2.5 rounded-[14px] shadow-sm">
                 <div className="bg-[#e6f4ea] text-[#1e8e3e] p-1.5 rounded-lg"><Leaf size={16}/></div>
                 <span className="text-xs font-bold text-slate-700 leading-tight">Real-time<br/>Monitoring</span>
              </div>
              <div className="flex items-center gap-3 bg-white/90 backdrop-blur-md px-4 py-2.5 rounded-[14px] shadow-sm">
                 <div className="bg-[#e8f0fe] text-[#1a73e8] p-1.5 rounded-lg"><Cpu size={16}/></div>
                 <span className="text-xs font-bold text-slate-700 leading-tight">AI Powered<br/>Insights</span>
              </div>
              <div className="flex items-center gap-3 bg-white/90 backdrop-blur-md px-4 py-2.5 rounded-[14px] shadow-sm">
                 <div className="bg-[#f3e8fd] text-[#9334e6] p-1.5 rounded-lg"><Mic size={16}/></div>
                 <span className="text-xs font-bold text-slate-700 leading-tight">Voice<br/>Assistant</span>
              </div>
              <div className="flex items-center gap-3 bg-white/90 backdrop-blur-md px-4 py-2.5 rounded-[14px] shadow-sm">
                 <div className="bg-[#fef7e0] text-[#f9ab00] p-1.5 rounded-lg"><Droplet size={16}/></div>
                 <span className="text-xs font-bold text-slate-700 leading-tight">Smart<br/>Irrigation</span>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button className="flex items-center gap-2 px-8 py-4 bg-[#105e32] text-white rounded-full font-bold text-lg hover:bg-[#0c4424] transition-all shadow-lg">
                Connect My Device <ArrowRight size={20} />
              </button>
              <button className="flex items-center gap-2 px-8 py-4 bg-white text-slate-900 rounded-full font-bold text-lg hover:bg-slate-50 transition-all shadow-md border border-slate-200">
                View Live Demo
              </button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.2 }}
            className="flex-1 relative w-full h-[480px] hidden lg:flex items-center justify-end"
          >
            {/* Floating cards removed as requested */}
          </motion.div>
        </div>
      </section>

      {/* 2. STATS BAR */}
      <section className="relative z-20 -mt-20 mx-4 lg:mx-8 mb-32">
        <div className="bg-[#2a3028]/95 backdrop-blur-xl rounded-[24px] shadow-2xl border border-white/5 overflow-hidden">
          <div className="max-w-[1400px] mx-auto px-8 py-8 flex flex-wrap justify-between items-center gap-8 lg:gap-4 divide-y lg:divide-y-0 lg:divide-x divide-white/10 text-white">
            
            <div className="flex items-center gap-4 flex-1 pt-4 lg:pt-0 lg:justify-center">
              <div className="text-white/40"><Cloud size={32} strokeWidth={1.5}/></div>
              <div>
                <div className="text-3xl font-black tracking-tight">10K+</div>
                <div className="text-xs text-white/60 font-semibold tracking-wide uppercase mt-1">Farmers Trust Us</div>
              </div>
            </div>
            
            <div className="flex items-center gap-4 flex-1 pt-4 lg:pt-0 lg:pl-8 lg:justify-center">
              <div className="text-white/40"><Cpu size={32} strokeWidth={1.5}/></div>
              <div>
                <div className="text-3xl font-black tracking-tight">25K+</div>
                <div className="text-xs text-white/60 font-semibold tracking-wide uppercase mt-1">Devices Connected</div>
              </div>
            </div>
            
            <div className="flex items-center gap-4 flex-1 pt-4 lg:pt-0 lg:pl-8 lg:justify-center">
              <div className="text-white/40"><Activity size={32} strokeWidth={1.5}/></div>
              <div>
                <div className="text-3xl font-black tracking-tight">1.2M+</div>
                <div className="text-xs text-white/60 font-semibold tracking-wide uppercase mt-1">Data Points Analyzed</div>
              </div>
            </div>
            
            <div className="flex items-center gap-4 flex-1 pt-4 lg:pt-0 lg:pl-8 lg:justify-center">
              <div className="text-white/40"><Leaf size={32} strokeWidth={1.5}/></div>
              <div>
                <div className="text-3xl font-black tracking-tight">30%+</div>
                <div className="text-xs text-white/60 font-semibold tracking-wide uppercase mt-1">Increase in Yield</div>
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* 3. PRODUCT SHOWCASE */}
      <section className="text-center max-w-4xl mx-auto px-6">
        <h2 className="text-3xl lg:text-5xl font-bold mb-6 font-display">Military-grade sensors.<br/>Consumer-grade simplicity.</h2>
        <p className="text-lg text-slate-600 dark:text-slate-400 mb-16 font-alt">Just place the Bhoomi node in your field and turn it on. It instantly connects to the cloud via GSM/Wi-Fi and starts streaming precision telemetry.</p>
        <div className="relative rounded-[40px] bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 p-8 shadow-inner overflow-hidden border border-white/50 dark:border-slate-700/50">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
            <div className="w-48 h-64 bg-slate-800 dark:bg-black rounded-3xl shadow-2xl relative border-4 border-slate-700 mx-auto flex flex-col items-center justify-between py-6">
              <div className="w-2 h-2 rounded-full bg-bhoomi-500 animate-pulse shadow-neon-green"></div>
              <Cpu size={48} className="text-slate-500" />
              <div className="w-12 h-2 bg-slate-700 rounded-full"></div>
            </div>
            <div className="flex-1 text-left space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm"><Battery className="text-bhoomi-500"/></div>
                <div><h4 className="font-bold text-lg">Solar Powered</h4><p className="text-sm text-slate-500">Built-in panel for infinite battery life.</p></div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm"><Wifi className="text-bhoomi-500"/></div>
                <div><h4 className="font-bold text-lg">Always Connected</h4><p className="text-sm text-slate-500">GSM & Wi-Fi fallback ensures zero data loss.</p></div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm"><Activity className="text-bhoomi-500"/></div>
                <div><h4 className="font-bold text-lg">6-in-1 Sensor</h4><p className="text-sm text-slate-500">Measures NPK, Moisture, pH, and Temp at 3 depths.</p></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS TIMELINE */}
      <section className="max-w-5xl mx-auto px-6">
        <h2 className="text-3xl font-bold mb-16 text-center font-display">How Bhoomi AI Works</h2>
        <div className="relative">
          <div className="absolute top-0 left-8 md:left-1/2 w-1 h-full bg-gradient-to-b from-bhoomi-300 via-bhoomi-500 to-emerald-400 -translate-x-1/2 rounded-full"></div>
          
          {[
            { step: 1, title: 'Place Sensor', desc: 'Install the probe in the soil profile.' },
            { step: 2, title: 'Collect Soil Data', desc: 'Node securely transmits encrypted telemetry.' },
            { step: 3, title: 'AI Analyzes', desc: 'Our engine computes health, yield, and needs.' },
            { step: 4, title: 'Voice Recommendation', desc: 'Get localized audio guidance on your phone.' },
            { step: 5, title: 'Grow Better Crops', desc: 'Optimize inputs, save water, and maximize profit.' }
          ].map((item, index) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }}
              key={item.step} className={`relative flex items-center gap-8 mb-12 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
            >
              <div className="hidden md:block flex-1 text-right"></div>
              <div className="absolute left-8 md:left-1/2 w-8 h-8 bg-bhoomi-500 rounded-full border-4 border-earth-50 dark:border-bhoomi-950 -translate-x-1/2 flex items-center justify-center text-xs font-bold text-white z-10 shadow-lg">{item.step}</div>
              <div className={`flex-1 pl-16 md:pl-0 ${index % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12 md:text-left'}`}>
                <div className="glass-panel p-6 inline-block w-full md:max-w-sm hover:-translate-y-1 transition-transform">
                  <h4 className="font-bold text-xl mb-2">{item.title}</h4>
                  <p className="text-slate-500 dark:text-slate-400">{item.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 5. TESTIMONIALS */}
      <section className="bg-slate-900 py-24 px-6 relative overflow-hidden text-white rounded-[48px] mx-4 lg:mx-12">
        <div className="absolute top-0 right-0 w-96 h-96 bg-bhoomi-500/20 blur-[100px] rounded-full"></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <h2 className="text-3xl lg:text-5xl font-bold mb-16 text-center font-display">Farmers driving the future</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Ramesh Reddy", loc: "Telangana", quote: "Bhoomi's AI told me exactly when to water my chilies. I saved 30% on my water bill this season and the yield is incredible." },
              { name: "Amit Sharma", loc: "Maharashtra", quote: "The voice assistant speaking Marathi makes it so easy for my farm hands to understand the fertilizer schedule. Game changer." },
              { name: "Priya Patel", loc: "Gujarat", quote: "Before planting cotton, the soil health score told me I needed DAP. The precision is just like having an agronomist on speed dial." }
            ].map((t, i) => (
              <div key={i} className="glass-card bg-white/5 border-white/10 p-8 flex flex-col gap-6">
                <div className="flex gap-1 text-yellow-400"><Star fill="currentColor" size={16}/><Star fill="currentColor" size={16}/><Star fill="currentColor" size={16}/><Star fill="currentColor" size={16}/><Star fill="currentColor" size={16}/></div>
                <p className="text-lg text-slate-300 flex-1">"{t.quote}"</p>
                <div>
                  <h4 className="font-bold">{t.name}</h4>
                  <p className="text-sm text-bhoomi-400">{t.loc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* 7. FAQ */}
      <section className="max-w-3xl mx-auto px-6 mb-20">
        <h2 className="text-3xl font-bold mb-10 text-center font-display">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {[
            { q: "How does the sensor connect to the cloud?", a: "The Bhoomi node automatically connects via built-in GSM. If cellular service drops, it fails over to a local Wi-Fi mesh network to ensure your data never stops streaming." },
            { q: "Is the hardware weather-proof?", a: "Yes, the device is IP67 rated, meaning it can withstand heavy monsoons, extreme heat, and dust storms without interruption." },
            { q: "Which languages does the Voice Assistant support?", a: "Currently, we support English, Hindi, Telugu, Marathi, Tamil, and Kannada. We are continuously adding more regional dialects." }
          ].map((faq, i) => (
            <details key={i} className="group glass-card p-6 cursor-pointer marker:content-['']">
              <summary className="flex justify-between items-center font-bold text-lg list-none">
                {faq.q}
                <ChevronDown className="transition-transform group-open:rotate-180 text-bhoomi-500" />
              </summary>
              <p className="mt-4 text-slate-600 dark:text-slate-400 leading-relaxed font-alt">{faq.a}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
