import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

import type { DiseaseScanRecord } from '../services/diseaseService';

export interface SoilData {
  id: string;
  device_id: string;
  field_id: string;
  moisture: number;
  ph: number;
  temperature: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  electrical_conductivity: number;
  battery_level: number;
  signal_strength: number;
  created_at: string;
}

export interface Device {
  device_id: string;
  name: string;
  field_id: string;
  status: 'Online' | 'Offline';
  last_sync: string;
  battery: number;
  signal: number;
  firmware: string;
}

export interface Alert {
  id: string;
  message: string;
  severity: 'high' | 'medium' | 'low';
  timestamp: string;
}

export interface CropRecommendationData {
  name: string;
  match: number;
  reason: string;
  waterReq: string;
  growingPeriod: string;
}

export interface AIRecommendation {
  crops: CropRecommendationData[];
  explanation: string;
  irrigation: string;
  irrigationExplanation: string;
  fertilizer: string;
  diseaseMockResult?: {
    disease: string;
    confidence: number;
    severity: string;
    action: string;
  };
}

export interface WeatherData {
  temperature: number;
  humidity: number;
  rainProbability: number;
  condition: string;
  forecast: string;
}

interface BhoomiContextType {
  latestData: SoilData | null;
  historyData: SoilData[];
  devices: Device[];
  alerts: Alert[];
  recommendations: AIRecommendation | null;
  healthScore: number;
  pumpStatus: 'ON' | 'OFF';
  pumpMode: 'AUTO' | 'MANUAL';
  weather: WeatherData;
  farmProfile: {
    crop: string;
    stage: string;
  };
  diseaseHistory: DiseaseScanRecord[];
  togglePump: () => void;
  setPumpMode: (mode: 'AUTO' | 'MANUAL') => void;
  analyzeDiseaseImage: () => void;
  addDiseaseScan: (scan: DiseaseScanRecord) => void;
}

const BhoomiContext = createContext<BhoomiContextType | undefined>(undefined);

const initialDevice: Device = {
  device_id: 'ESP32-001',
  name: 'Field-A Node 1',
  field_id: 'Field-A',
  status: 'Online',
  last_sync: new Date().toISOString(),
  battery: 86,
  signal: -63,
  firmware: 'v2.1.4'
};

const initialWeather: WeatherData = {
  temperature: 32,
  humidity: 64,
  rainProbability: 20, // Let's set it to 20 to trigger some AI logic variations
  condition: 'Partly Cloudy',
  forecast: 'Clear skies expected later.'
};

const generateMockReading = (prevData: SoilData | null, pumpStatus: 'ON' | 'OFF'): SoilData => {
  const now = new Date();
  
  if (!prevData) {
    return {
      id: crypto.randomUUID(),
      device_id: 'ESP32-001',
      field_id: 'Field-A',
      moisture: 42.5,
      ph: 6.4,
      temperature: 28.3,
      nitrogen: 45,
      phosphorus: 32,
      potassium: 18,
      electrical_conductivity: 1.2,
      battery_level: 86,
      signal_strength: -63,
      created_at: now.toISOString()
    };
  }

  // Small random drifts
  const drift = (val: number, maxDrift: number) => Number((val + (Math.random() * maxDrift * 2 - maxDrift)).toFixed(1));

  // If pump is ON, moisture should go up faster
  const moistureChange = pumpStatus === 'ON' ? (Math.random() * 2 + 1) : drift(0, 1) - 0.5;

  return {
    ...prevData,
    id: crypto.randomUUID(),
    moisture: Math.max(10, Math.min(100, Number((prevData.moisture + moistureChange).toFixed(1)))),
    ph: Math.max(4, Math.min(9, drift(prevData.ph, 0.05))),
    temperature: drift(prevData.temperature, 0.2),
    nitrogen: Math.max(0, Math.min(100, drift(prevData.nitrogen, 1))),
    phosphorus: Math.max(0, Math.min(100, drift(prevData.phosphorus, 1))),
    potassium: Math.max(0, Math.min(100, drift(prevData.potassium, 1))),
    battery_level: Math.max(0, prevData.battery_level - 0.1),
    created_at: now.toISOString()
  };
};

const calculateAIRecommendations = (data: SoilData, weather: WeatherData, farmProfile: {crop: string, stage: string}): AIRecommendation => {
  let irrigation = 'Wait';
  let irrigationExplanation = `Soil moisture is adequate (${data.moisture}%). No irrigation needed.`;
  
  if (data.moisture < 35) {
    if (weather.rainProbability > 60) {
      irrigation = 'Wait';
      irrigationExplanation = `Soil moisture is low (${data.moisture}%), but rain probability is ${weather.rainProbability}%. Irrigation postponed.`;
    } else {
      irrigation = 'Water Now';
      irrigationExplanation = `Soil moisture is low (${data.moisture}%) and no significant rain expected. Recommended duration: 15-20 minutes.`;
    }
  } else if (data.moisture > 65) {
    irrigation = 'No Irrigation Needed Today';
    irrigationExplanation = `Soil moisture is high (${data.moisture}%). Avoid watering.`;
  }

  let fertilizer = 'Nutrient levels are adequate. No immediate action required.';
  if (data.nitrogen < 40) {
    fertilizer = 'Nitrogen appears to be the limiting nutrient. Apply 25 kg urea per acre.';
  } else if (data.phosphorus < 25) {
    fertilizer = 'Phosphorus level is low. Apply 30 kg DAP per acre.';
  } else if (data.potassium < 15) {
    fertilizer = 'Potassium level is low. Apply 15 kg MOP per acre.';
  }

  return {
    crops: [
      { name: 'Tomato', match: 94, reason: `Optimal pH and temperature range matches for ${farmProfile.crop} in ${farmProfile.stage} stage.`, waterReq: 'Moderate', growingPeriod: '90-120 days' },
      { name: 'Chili', match: 90, reason: 'Good nitrogen levels support early vegetative growth.', waterReq: 'Moderate', growingPeriod: '120-150 days' },
      { name: 'Brinjal', match: 87, reason: 'Soil structure and current NPK are suitable.', waterReq: 'High', growingPeriod: '100-130 days' },
      { name: 'Groundnut', match: 79, reason: 'Requires slightly less moisture, but soil pH is perfect.', waterReq: 'Low', growingPeriod: '90-110 days' },
    ],
    explanation: `This soil has ${data.ph < 7 ? 'slightly acidic' : 'alkaline'} pH (${data.ph}) and ${data.moisture < 40 ? 'low' : 'moderate'} moisture, making it highly suitable for tomato and chili cultivation.`,
    irrigation,
    irrigationExplanation,
    fertilizer
  };
};

export const MockDataProvider = ({ children }: { children: ReactNode }) => {
  const [latestData, setLatestData] = useState<SoilData | null>(null);
  const [historyData, setHistoryData] = useState<SoilData[]>([]);
  const [devices, setDevices] = useState<Device[]>([initialDevice]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [recommendations, setRecommendations] = useState<AIRecommendation | null>(null);
  const [healthScore, setHealthScore] = useState(85);
  
  // New States for upgraded features
  const [pumpStatus, setPumpStatus] = useState<'ON' | 'OFF'>('OFF');
  const [pumpMode, setPumpMode] = useState<'AUTO' | 'MANUAL'>('MANUAL');
  const [weather] = useState<WeatherData>(initialWeather);
  const [farmProfile] = useState({ crop: 'Tomato', stage: 'Vegetative' });
  const [diseaseHistory, setDiseaseHistory] = useState<DiseaseScanRecord[]>([]);

  const togglePump = () => {
    setPumpStatus(prev => prev === 'ON' ? 'OFF' : 'ON');
  };

  const addDiseaseScan = (scan: DiseaseScanRecord) => {
    setDiseaseHistory(prev => [scan, ...prev].slice(0, 10)); // keep last 10 scans
    if (scan.result.health_status !== 'Healthy') {
      const alertMsg = `🌿 Plant Health Alert: Possible ${scan.result.problem || scan.result.disease} detected in ${scan.result.crop} crop. Confidence: ${scan.result.confidence}%`;
      setAlerts(a => [{ id: crypto.randomUUID(), message: alertMsg, severity: scan.result.severity === 'High' || scan.result.severity === 'Severe' ? 'high' : 'medium', timestamp: new Date().toISOString() }, ...a]);
    }
  };

  const analyzeDiseaseImage = () => {
    // Simulate AI delay
    setTimeout(() => {
      setRecommendations(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          diseaseMockResult: {
            disease: 'Early Blight',
            confidence: 92,
            severity: 'Moderate',
            action: 'Remove heavily affected leaves and apply recommended copper-based fungicide.'
          }
        };
      });
    }, 2000);
  };

  // Improved Interval logic for real-time data
  useEffect(() => {
    // We only want to generate initial data once
    if (!latestData) {
      const initialData = generateMockReading(null, pumpStatus);
      setLatestData(initialData);
      setHistoryData([initialData]);
      setRecommendations(calculateAIRecommendations(initialData, weather, farmProfile));
    }

    const interval = setInterval(() => {
      setLatestData(prev => {
        const newData = generateMockReading(prev, pumpStatus);
        setHistoryData(h => [...h.slice(-50), newData]); // Keep last 50 points
        
        // Update recommendations
        setRecommendations(prevRecs => {
          const newRecs = calculateAIRecommendations(newData, weather, farmProfile);
          // Preserve disease mock result if it exists
          if (prevRecs && prevRecs.diseaseMockResult) {
            newRecs.diseaseMockResult = prevRecs.diseaseMockResult;
          }
          return newRecs;
        });
        
        // Update Health Score (mock logic)
        const score = Math.max(0, Math.min(100, 100 - Math.abs(6.5 - newData.ph) * 10 - (newData.moisture < 30 ? 20 : 0)));
        setHealthScore(Math.round(score));

        // Generate Alerts
        if (newData.moisture < 30 && pumpMode === 'MANUAL') {
          setAlerts(a => {
            const hasRecentAlert = a.some(alert => alert.message.includes('Low moisture') && (new Date().getTime() - new Date(alert.timestamp).getTime() < 60000));
            if (!hasRecentAlert) {
               return [{ id: crypto.randomUUID(), message: 'Low moisture detected in Field-A', severity: 'high', timestamp: new Date().toISOString() }, ...a];
            }
            return a;
          });
        }
        
        // Auto Irrigation Logic
        if (pumpMode === 'AUTO') {
          if (newData.moisture < 35 && weather.rainProbability < 60 && pumpStatus === 'OFF') {
             setPumpStatus('ON');
          } else if (newData.moisture > 60 && pumpStatus === 'ON') {
             setPumpStatus('OFF');
          }
        }

        return newData;
      });
      
      setDevices(prev => prev.map(d => ({ ...d, last_sync: new Date().toISOString() })));

    }, 5000);

    return () => clearInterval(interval);
  }, [pumpStatus, pumpMode, weather, farmProfile, latestData]); // Re-bind interval when these change

  return (
    <BhoomiContext.Provider value={{ 
      latestData, historyData, devices, alerts, recommendations, healthScore,
      pumpStatus, pumpMode, weather, farmProfile, diseaseHistory, togglePump, setPumpMode, analyzeDiseaseImage, addDiseaseScan
    }}>
      {children}
    </BhoomiContext.Provider>
  );
};

export const useBhoomiData = () => {
  const context = useContext(BhoomiContext);
  if (context === undefined) {
    throw new Error('useBhoomiData must be used within a MockDataProvider');
  }
  return context;
};
