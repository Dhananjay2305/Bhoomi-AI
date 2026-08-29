import { useState, useRef } from 'react';
import { useBhoomiData } from '../contexts/MockDataProvider';
import { Camera, Upload, AlertTriangle, CheckCircle, ShieldCheck, Leaf, Loader2, Info, MessageSquare, History } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { analyzePlantImage, type DiseaseResult, type DiseaseScanRecord } from '../services/diseaseService';

export default function DiseaseDetectionPage() {
  const { latestData, weather, farmProfile, diseaseHistory, addDiseaseScan } = useBhoomiData();
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<DiseaseResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImagePreview(url);
      setResult(null);
      setError(null);
    }
  };

  const handleSimulateCamera = () => {
    // In demo mode, load a sample leaf image
    setImagePreview('https://images.unsplash.com/photo-1590807895083-d343469e8b7c?q=80&w=600&auto=format&fit=crop');
    setResult(null);
    setError(null);
  };

  const handleAnalyze = async () => {
    if (!imagePreview) return;
    setIsAnalyzing(true);
    setError(null);
    
    try {
      const analysisResult = await analyzePlantImage(imagePreview);
      setResult(analysisResult);
      
      // Save to history
      const record: DiseaseScanRecord = {
        id: crypto.randomUUID(),
        date: new Date().toISOString(),
        result: analysisResult
      };
      addDiseaseScan(record);
    } catch (err: any) {
      setError(err.message || 'An error occurred during analysis.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAskBhoomi = () => {
    if (result) {
      navigate('/voice', { state: { prefilledQuery: `I just scanned a ${result.crop} plant and it might have ${result.disease}. What should I do?` } });
    } else {
      navigate('/voice');
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Healthy': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50';
      case 'Low Risk': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800/50';
      case 'Moderate Risk': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800/50';
      case 'High Risk': return 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 border-rose-200 dark:border-rose-800/50';
      default: return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700';
    }
  };

  return (
    <div className="space-y-8 font-sans max-w-6xl mx-auto pb-10">
      
      <div className="text-center py-6 lg:py-10">
        <h1 className="text-3xl lg:text-5xl font-black font-display text-slate-900 dark:text-white mb-4">AI Plant Disease Detection</h1>
        <p className="text-slate-500 font-medium max-w-2xl mx-auto">
          Upload a plant or leaf image and let Bhoomi AI analyze its health.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* LEFT: Image Input */}
        <div className="space-y-4">
          <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest pl-2">Image Input</h3>
          
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-[32px] p-6 border border-slate-200/50 dark:border-slate-800/50 shadow-sm">
            
            {imagePreview ? (
              <div className="relative aspect-square md:aspect-[4/3] rounded-2xl overflow-hidden mb-6 bg-slate-100 dark:bg-slate-800">
                <img src={imagePreview} alt="Leaf preview" className="w-full h-full object-cover" />
                
                {isAnalyzing && (
                  <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm flex flex-col items-center justify-center text-white z-10">
                    <Loader2 size={48} className="animate-spin text-bhoomi-500 mb-4" />
                    <p className="font-bold tracking-widest uppercase text-sm animate-pulse">Running Computer Vision Model...</p>
                    <p className="text-xs text-slate-300 mt-2">Analyzing crop and detecting diseases</p>
                  </div>
                )}

                {result && !isAnalyzing && (
                  <motion.div 
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="absolute top-4 right-4 bg-white text-slate-900 p-2 rounded-full shadow-lg z-10"
                  >
                    <CheckCircle size={24} className="text-bhoomi-500" />
                  </motion.div>
                )}
                
                {/* DEMO MODE BADGE */}
                <div className="absolute top-4 left-4 bg-bhoomi-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg z-10">
                  Demo Mode
                </div>
              </div>
            ) : (
              <div className="aspect-square md:aspect-[4/3] rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center mb-6 bg-slate-50 dark:bg-slate-800/50 text-slate-400 relative overflow-hidden group">
                <Leaf size={48} className="mb-4 opacity-50 group-hover:scale-110 transition-transform duration-500 group-hover:text-bhoomi-500" />
                <p className="font-medium text-sm text-center px-4">Upload a clear photo of the affected leaf</p>
                <div className="absolute top-4 left-4 bg-bhoomi-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest opacity-80">
                  Demo Mode
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 mb-4">
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center justify-center gap-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 p-4 rounded-2xl transition-colors font-bold text-sm text-slate-700 dark:text-slate-300"
              >
                <Upload size={20} /> Upload Image
              </button>
              <button 
                onClick={handleSimulateCamera}
                className="flex flex-col items-center justify-center gap-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 p-4 rounded-2xl transition-colors font-bold text-sm text-slate-700 dark:text-slate-300"
              >
                <Camera size={20} /> Use Camera
              </button>
              <input 
                type="file" 
                ref={fileInputRef}
                accept="image/*" 
                className="hidden" 
                onChange={handleImageUpload} 
              />
            </div>

            {error && (
              <div className="mb-4 p-4 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 rounded-xl text-sm font-medium flex items-start gap-3 border border-rose-200 dark:border-rose-800/50">
                <AlertTriangle size={18} className="shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            )}

            <button 
              onClick={handleAnalyze}
              disabled={!imagePreview || isAnalyzing || result !== null}
              className={`w-full py-4 rounded-2xl font-bold text-lg transition-all ${
                !imagePreview || result !== null
                  ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                  : 'bg-bhoomi-600 hover:bg-bhoomi-700 text-white shadow-lg shadow-bhoomi-500/30 hover:scale-[1.02]'
              }`}
            >
              {isAnalyzing ? 'Analyzing...' : result ? 'Analysis Complete' : 'Analyze Plant'}
            </button>
            
            <div className="mt-4 text-center">
              <p className="text-xs text-slate-500 font-medium">Supported crops: Tomato, Potato, Rice, Cotton, Chilli</p>
            </div>
          </div>
        </div>

        {/* RIGHT: Analysis Results */}
        <div className="space-y-4">
          <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest pl-2">AI Analysis Result</h3>
          
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-[32px] p-6 border border-slate-200/50 dark:border-slate-800/50 shadow-sm min-h-[500px]">
            <AnimatePresence mode="wait">
              {!result && !isAnalyzing ? (
                <motion.div 
                  key="empty"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="h-full flex flex-col items-center justify-center text-slate-400 opacity-50 text-center p-8 min-h-[400px]"
                >
                  <ShieldCheck size={64} className="mb-4" />
                  <p className="font-medium text-lg">Upload an image and run analysis to see the plant health result here.</p>
                </motion.div>
              ) : isAnalyzing ? (
                <motion.div 
                  key="analyzing"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="h-full flex flex-col items-center justify-center text-slate-400 text-center p-8 min-h-[400px]"
                >
                  <div className="space-y-4 w-full max-w-sm">
                    <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-full w-3/4 mx-auto animate-pulse"></div>
                    <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-full w-1/2 mx-auto animate-pulse delay-75"></div>
                    <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-full w-5/6 mx-auto animate-pulse delay-150"></div>
                  </div>
                </motion.div>
              ) : result ? (
                <motion.div 
                  key="result"
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  {/* Header Card */}
                  <div className={`p-5 rounded-2xl border ${getSeverityColor(result.severity)}`}>
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-widest opacity-80 mb-1">Detected Crop</h4>
                        <p className="text-lg font-bold">{result.crop}</p>
                      </div>
                      <div className="text-right">
                        <h4 className="text-xs font-bold uppercase tracking-widest opacity-80 mb-1">Condition</h4>
                        <div className="flex items-center gap-1 font-black text-xl">
                          {result.severity !== 'Healthy' && <AlertTriangle size={20} />}
                          {result.disease}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between border-t border-current/20 pt-4 mt-2">
                      <div>
                        <p className="text-xs font-bold uppercase opacity-80">Confidence</p>
                        <p className="text-2xl font-black">{result.confidence}%</p>
                      </div>
                      <div className="text-right">
                         <p className="text-xs font-bold uppercase opacity-80">Severity</p>
                         <p className="text-lg font-bold">{result.severity}</p>
                      </div>
                    </div>
                  </div>

                  {/* Contextual Integration */}
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl flex items-center gap-3 border border-slate-100 dark:border-slate-800">
                    <Info size={20} className="text-bhoomi-500 shrink-0" />
                    <p className="text-sm text-slate-700 dark:text-slate-300">
                      <span className="font-bold">Farm Context:</span> Your {farmProfile.crop} field currently has {latestData?.moisture}% soil moisture and {weather.temperature}°C temperature. {result.disease !== 'Healthy' && 'These conditions might affect disease spread.'}
                    </p>
                  </div>

                  {/* Details Tabs / Sections */}
                  {result.disease !== 'Healthy' && (
                    <div className="space-y-5">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2 flex items-center gap-2">
                          <AlertTriangle size={16} className="text-amber-500" /> Symptoms
                        </h4>
                        <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                          {result.symptoms.map((symptom, i) => <li key={i}>{symptom}</li>)}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2 flex items-center gap-2">
                          <CheckCircle size={16} className="text-bhoomi-500" /> Recommended Actions
                        </h4>
                        <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                          {result.recommendations.map((rec, i) => <li key={i}>{rec}</li>)}
                        </ul>
                      </div>

                      <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2 flex items-center gap-2">
                          <ShieldCheck size={16} className="text-blue-500" /> Prevention
                        </h4>
                        <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                          {result.prevention.map((prev, i) => <li key={i}>{prev}</li>)}
                        </ul>
                      </div>
                    </div>
                  )}

                  {/* Ask Bhoomi AI */}
                  <button 
                    onClick={handleAskBhoomi}
                    className="w-full mt-4 flex items-center justify-center gap-2 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold rounded-xl transition-colors"
                  >
                    <MessageSquare size={18} className="text-bhoomi-500" />
                    Ask Bhoomi AI about this
                  </button>

                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                    <p className="text-xs text-slate-500 text-center leading-relaxed">
                      <strong>Disclaimer:</strong> AI-based identification is an assistive tool and should not replace advice from a qualified agricultural expert. Do not claim 100% accuracy.
                    </p>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Disease History Section */}
      {diseaseHistory.length > 0 && (
        <div className="mt-12 space-y-4">
          <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest pl-2 flex items-center gap-2">
            <History size={18} /> Recent Disease Scans
          </h3>
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-[32px] p-6 border border-slate-200/50 dark:border-slate-800/50 shadow-sm overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                <tr>
                  <th className="px-4 py-3 rounded-l-xl">Date</th>
                  <th className="px-4 py-3">Crop</th>
                  <th className="px-4 py-3">Detected Condition</th>
                  <th className="px-4 py-3">Confidence</th>
                  <th className="px-4 py-3 rounded-r-xl">Severity</th>
                </tr>
              </thead>
              <tbody>
                {diseaseHistory.map((scan) => (
                  <tr key={scan.id} className="border-b border-slate-100 dark:border-slate-800 last:border-0">
                    <td className="px-4 py-4 text-slate-600 dark:text-slate-400">
                      {new Date(scan.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-4 py-4 font-bold text-slate-900 dark:text-white">{scan.result.crop}</td>
                    <td className="px-4 py-4 font-medium text-slate-700 dark:text-slate-300">{scan.result.disease}</td>
                    <td className="px-4 py-4 text-slate-600 dark:text-slate-400">{scan.result.confidence}%</td>
                    <td className="px-4 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${
                        scan.result.severity === 'High Risk' ? 'bg-rose-100 text-rose-700' :
                        scan.result.severity === 'Moderate Risk' ? 'bg-amber-100 text-amber-700' :
                        scan.result.severity === 'Low Risk' ? 'bg-blue-100 text-blue-700' :
                        'bg-emerald-100 text-emerald-700'
                      }`}>
                        {scan.result.severity}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
