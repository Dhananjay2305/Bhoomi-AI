import { useState, useEffect } from 'react';
import { useBhoomiData } from '../contexts/MockDataProvider';
import { Mic, Globe, AlertCircle, Sparkles, StopCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const languages = [
  { code: 'te-IN', name: 'Telugu', localName: 'తెలుగు' },
  { code: 'hi-IN', name: 'Hindi', localName: 'हिंदी' },
  { code: 'mr-IN', name: 'Marathi', localName: 'मराठी' },
  { code: 'en-US', name: 'English', localName: 'English' },
  { code: 'ta-IN', name: 'Tamil', localName: 'தமிழ்' },
  { code: 'kn-IN', name: 'Kannada', localName: 'ಕನ್ನಡ' }
];

export default function VoiceAssistantPage() {
  const { latestData, recommendations } = useBhoomiData();
  const [selectedLang, setSelectedLang] = useState(languages[3]); // Default English
  const [isPlaying, setIsPlaying] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [conversation, setConversation] = useState<{role: 'ai' | 'user', text: string}[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const loadVoices = () => setVoices(window.speechSynthesis.getVoices());
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  const getTranslatedMessage = () => {
    if (!latestData || !recommendations) return "";
    const m = Math.round(latestData.moisture);
    const p = latestData.ph.toFixed(1);
    
    if (selectedLang.code === 'te-IN') return `మీ నేలలో తేమ ${m} శాతం ఉంది. pH ${p} ఉంది. ${recommendations.irrigation === 'Water Now' ? 'వెంటనే నీరు పెట్టాలి.' : 'ఈరోజు నీరు అవసరం లేదు.'} టమోటా మరియు మిర్చి పంటలు ఈ నేలకు అనుకూలంగా ఉన్నాయి.`;
    if (selectedLang.code === 'hi-IN') return `आपकी मिट्टी में नमी ${m} प्रतिशत है। pH ${p} है। ${recommendations.irrigation === 'Water Now' ? 'तुरंत पानी दें।' : 'आज सिंचाई की आवश्यकता नहीं है।'} यह मिट्टी टमाटर और मिर्च के लिए बहुत अच्छी है।`;
    
    return `Soil moisture is at ${m} percent. pH is ${p}. ${recommendations.irrigationExplanation} ${recommendations.explanation}`;
  };

  const handleAskBhoomi = () => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    
    // Add user prompt to conversation
    setConversation(prev => [...prev, { role: 'user', text: `Give me the latest field report in ${selectedLang.name}.` }]);
    setIsTyping(true);
    
    setTimeout(() => {
      const text = getTranslatedMessage();
      setIsTyping(false);
      setConversation(prev => [...prev, { role: 'ai', text }]);
      
      const utterance = new SpeechSynthesisUtterance(text);
      const voice = voices.find(v => v.lang.startsWith(selectedLang.code.split('-')[0]));
      if (voice) utterance.voice = voice;
      utterance.lang = selectedLang.code;
      
      utterance.onstart = () => setIsPlaying(true);
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);

      window.speechSynthesis.speak(utterance);
    }, 1500);
  };

  const handleStop = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
  };

  return (
    <div className="max-w-6xl mx-auto h-[80vh] flex flex-col lg:flex-row gap-8 pb-12">
      {/* Left Sidebar: Language & Status */}
      <div className="w-full lg:w-1/3 flex flex-col gap-6">
        <div className="glass-card p-6">
          <div className="flex items-center gap-2 mb-6 text-slate-800 dark:text-slate-200 font-bold text-lg font-display">
            <Globe className="text-bhoomi-500"/> Interface Language
          </div>
          <div className="grid grid-cols-2 gap-3">
            {languages.map(lang => (
              <button
                key={lang.code}
                onClick={() => setSelectedLang(lang)}
                className={`p-3 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all border-2 ${
                  selectedLang.code === lang.code 
                    ? 'border-bhoomi-500 bg-bhoomi-50 text-bhoomi-700 shadow-sm dark:bg-bhoomi-900/40 dark:text-bhoomi-300' 
                    : 'border-transparent bg-white/50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800'
                }`}
              >
                <span className="text-lg font-bold font-display">{lang.localName}</span>
                <span className="text-xs opacity-70 font-medium">{lang.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="glass-panel p-8 text-center flex-1 flex flex-col items-center justify-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-b from-bhoomi-400/5 to-emerald-500/10 pointer-events-none"></div>
          
          <button 
            onClick={isPlaying ? handleStop : handleAskBhoomi}
            className={`relative flex items-center justify-center w-32 h-32 rounded-full transition-all duration-500 ${
              isPlaying 
                ? 'bg-red-500 shadow-[0_0_60px_rgba(239,68,68,0.6)]' 
                : 'bg-gradient-to-br from-slate-900 to-slate-800 dark:from-white dark:to-slate-200 hover:scale-105 hover:shadow-[0_0_40px_rgba(47,164,92,0.4)]'
            }`}
          >
            {isPlaying ? (
              <StopCircle size={48} className="text-white" />
            ) : (
              <Mic size={48} className="text-white dark:text-slate-900" />
            )}
            
            {/* Pulsing rings */}
            {isPlaying && (
              <>
                <div className="absolute inset-0 rounded-full border border-red-500 animate-ping" style={{ animationDuration: '1.5s' }}></div>
                <div className="absolute inset-0 rounded-full border border-red-500 animate-ping" style={{ animationDuration: '2s', animationDelay: '0.5s' }}></div>
              </>
            )}
          </button>
          
          <h3 className="text-xl font-bold mt-8 mb-2 text-slate-900 dark:text-white font-display">
            {isPlaying ? 'Speaking...' : 'Tap to ask Bhoomi'}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium max-w-[200px]">
            {isPlaying ? 'Tap the icon to stop the voice assistant.' : 'Get an instant localized voice report on your field.'}
          </p>
        </div>
      </div>

      {/* Right Area: Conversational Interface */}
      <div className="w-full lg:w-2/3 glass-card flex flex-col overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-bhoomi-500/10 blur-[80px] rounded-full pointer-events-none"></div>
        
        <div className="p-6 border-b border-slate-200/50 dark:border-slate-700/50 flex justify-between items-center bg-white/40 dark:bg-slate-900/40">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-bhoomi-500 to-emerald-400 rounded-full flex items-center justify-center text-white shadow-lg shadow-bhoomi-500/30">
              <Sparkles size={20}/>
            </div>
            <div>
              <h2 className="font-bold text-lg text-slate-900 dark:text-white font-display">Bhoomi Intelligence</h2>
              <div className="flex items-center gap-1.5 text-xs font-bold text-bhoomi-600 dark:text-bhoomi-400">
                <span className="w-2 h-2 rounded-full bg-bhoomi-500 animate-pulse"></span> Online & Analyzing
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 p-6 overflow-y-auto space-y-6">
          {conversation.length === 0 && !isTyping ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-50">
              <Mic size={48} className="mb-4" />
              <p className="font-medium text-lg">No conversation history yet.</p>
            </div>
          ) : (
            <AnimatePresence>
              {conversation.map((msg, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                  key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] p-4 rounded-3xl ${
                    msg.role === 'user' 
                      ? 'bg-slate-900 text-white rounded-br-sm dark:bg-white dark:text-slate-900' 
                      : 'glass border-none shadow-sm rounded-bl-sm text-slate-800 dark:text-slate-200'
                  }`}>
                    {msg.text}
                    {msg.role === 'ai' && i === conversation.length - 1 && isPlaying && (
                      <div className="mt-4 flex gap-1 h-8 items-center bg-black/5 dark:bg-white/5 p-2 rounded-xl w-fit">
                        {[1,2,3,4,5,6].map(bar => (
                          <motion.div
                            key={bar}
                            animate={{ height: ['20%', '100%', '20%'] }}
                            transition={{ duration: 0.8 + (Math.random() * 0.4), repeat: Infinity, ease: 'easeInOut' }}
                            className="w-1.5 bg-bhoomi-500 rounded-full"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                  <div className="glass p-4 rounded-3xl rounded-bl-sm border-none shadow-sm flex gap-1.5 items-center">
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>

        {!('speechSynthesis' in window) && (
          <div className="m-6 flex items-center gap-2 text-red-500 bg-red-50 p-4 rounded-xl font-medium text-sm">
            <AlertCircle size={18} />
            Your browser does not support Speech Synthesis. Please use Chrome or Edge.
          </div>
        )}
      </div>
    </div>
  );
}
