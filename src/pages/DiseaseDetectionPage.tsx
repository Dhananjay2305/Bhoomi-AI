import { useState, useRef } from 'react';
import { useBhoomiData } from '../contexts/MockDataProvider';
import { Camera, Upload, AlertTriangle, CheckCircle, ShieldCheck, Leaf, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DiseaseDetectionPage() {
  const { recommendations, analyzeDiseaseImage } = useBhoomiData();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImagePreview(url);
      setAnalyzed(false);
    }
  };

  const handleSimulateCamera = () => {
    // In demo mode, just load a sample leaf image
    setImagePreview('https://images.unsplash.com/photo-1590807895083-d343469e8b7c?q=80&w=600&auto=format&fit=crop');
    setAnalyzed(false);
  };

  const handleAnalyze = () => {
    if (!imagePreview) return;
    setIsAnalyzing(true);
    analyzeDiseaseImage(); // Triggers mock delay in context
    
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalyzed(true);
    }, 2000);
  };

  return (
    <div className="space-y-6 font-sans max-w-5xl mx-auto">
      
      <div className="text-center py-6 lg:py-10">
        <h1 className="text-3xl lg:text-5xl font-black font-display text-slate-900 dark:text-white mb-4">Plant Health Check</h1>
        <p className="text-slate-500 font-medium max-w-xl mx-auto">
          Upload or capture a photo of an affected leaf, and our AI will identify potential diseases and suggest immediate treatments.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Upload Section */}
        <div className="space-y-4">
          <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest pl-2">Image Input</h3>
          
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-[32px] p-6 border border-slate-200/50 dark:border-slate-800/50 shadow-sm">
            
            {imagePreview ? (
              <div className="relative aspect-square md:aspect-[4/3] rounded-2xl overflow-hidden mb-6 bg-slate-100 dark:bg-slate-800">
                <img src={imagePreview} alt="Leaf preview" className="w-full h-full object-cover" />
                
                {isAnalyzing && (
                  <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm flex flex-col items-center justify-center text-white">
                    <Loader2 size={48} className="animate-spin text-bhoomi-500 mb-4" />
                    <p className="font-bold tracking-widest uppercase text-sm animate-pulse">Running Computer Vision Model...</p>
                  </div>
                )}

                {analyzed && (
                  <motion.div 
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="absolute top-4 right-4 bg-white text-slate-900 p-2 rounded-full shadow-lg"
                  >
                    <CheckCircle size={24} className="text-bhoomi-500" />
                  </motion.div>
                )}
              </div>
            ) : (
              <div className="aspect-square md:aspect-[4/3] rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center mb-6 bg-slate-50 dark:bg-slate-800/50 text-slate-400">
                <Leaf size={48} className="mb-4 opacity-50" />
                <p className="font-medium text-sm">No image selected</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 mb-4">
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center justify-center gap-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 p-4 rounded-2xl transition-colors font-bold text-sm text-slate-700 dark:text-slate-300"
              >
                <Upload size={20} /> Upload
              </button>
              <button 
                onClick={handleSimulateCamera}
                className="flex flex-col items-center justify-center gap-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 p-4 rounded-2xl transition-colors font-bold text-sm text-slate-700 dark:text-slate-300"
              >
                <Camera size={20} /> Capture
              </button>
              <input 
                type="file" 
                ref={fileInputRef}
                accept="image/*" 
                className="hidden" 
                onChange={handleImageUpload} 
              />
            </div>

            <button 
              onClick={handleAnalyze}
              disabled={!imagePreview || isAnalyzing || analyzed}
              className={`w-full py-4 rounded-2xl font-bold text-lg transition-all ${
                !imagePreview || analyzed
                  ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                  : 'bg-bhoomi-600 hover:bg-bhoomi-700 text-white shadow-lg shadow-bhoomi-500/30 hover:scale-[1.02]'
              }`}
            >
              {isAnalyzing ? 'Analyzing...' : analyzed ? 'Analysis Complete' : 'Analyze Image'}
            </button>
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-4">
          <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest pl-2">Diagnosis</h3>
          
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-[32px] p-6 border border-slate-200/50 dark:border-slate-800/50 shadow-sm min-h-[400px]">
            <AnimatePresence mode="wait">
              {!analyzed ? (
                <motion.div 
                  key="empty"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="h-full flex flex-col items-center justify-center text-slate-400 opacity-50 text-center p-8"
                >
                  <ShieldCheck size={64} className="mb-4" />
                  <p className="font-medium text-lg">Upload an image and run analysis to see the diagnosis here.</p>
                </motion.div>
              ) : (
                <motion.div 
                  key="result"
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-1">Detected Disease</h4>
                      <h2 className="text-3xl font-black font-display text-slate-900 dark:text-white">{recommendations?.diseaseMockResult?.disease}</h2>
                    </div>
                    <div className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 px-3 py-1 rounded-full text-xs font-bold uppercase flex items-center gap-1">
                      <AlertTriangle size={14}/> {recommendations?.diseaseMockResult?.severity}
                    </div>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl flex items-center justify-between">
                    <span className="font-bold text-slate-600 dark:text-slate-400">AI Confidence</span>
                    <span className="text-2xl font-black text-bhoomi-500">{recommendations?.diseaseMockResult?.confidence}%</span>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-3">Recommended Action</h4>
                    <div className="bg-bhoomi-50/50 dark:bg-bhoomi-900/10 border border-bhoomi-100 dark:border-bhoomi-900/30 p-5 rounded-2xl">
                      <p className="text-bhoomi-900 dark:text-bhoomi-100 font-medium leading-relaxed">
                        {recommendations?.diseaseMockResult?.action}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                    <p className="text-xs text-slate-500 text-center">
                      Disclaimer: This is an AI-assisted diagnosis. Always consult a local agricultural expert for severe issues.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
