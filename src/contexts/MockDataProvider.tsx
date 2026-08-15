import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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

export interface AIRecommendation {
  crops: { name: string; match: number }[];
  explanation: string;
  irrigation: string;
  irrigationExplanation: string;
  fertilizer: string;
}

interface BhoomiContextType {
  latestData: SoilData | null;
  historyData: SoilData[];
  devices: Device[];
  alerts: Alert[];
  recommendations: AIRecommendation | null;
  healthScore: number;
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

const generateMockReading = (prevData: SoilData | null): SoilData => {
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

  return {
    ...prevData,
    id: crypto.randomUUID(),
    moisture: Math.max(10, Math.min(100, drift(prevData.moisture, 2))),
    ph: Math.max(4, Math.min(9, drift(prevData.ph, 0.2))),
    temperature: drift(prevData.temperature, 0.5),
    nitrogen: Math.max(0, Math.min(100, drift(prevData.nitrogen, 3))),
    phosphorus: Math.max(0, Math.min(100, drift(prevData.phosphorus, 2))),
    potassium: Math.max(0, Math.min(100, drift(prevData.potassium, 1))),
    battery_level: Math.max(0, prevData.battery_level - 0.1),
    created_at: now.toISOString()
  };
};

const calculateAIRecommendations = (data: SoilData): AIRecommendation => {
  let irrigation = 'Wait';
  let irrigationExplanation = `Soil moisture is ${data.moisture}%. Irrigation is not required today.`;
  if (data.moisture < 30) {
    irrigation = 'Water Now';
    irrigationExplanation = `Soil moisture is critically low at ${data.moisture}%. Immediate irrigation required.`;
  } else if (data.moisture > 60) {
    irrigation = 'No Irrigation Needed Today';
    irrigationExplanation = `Soil moisture is high at ${data.moisture}%. Hold off on watering.`;
  }

  let fertilizer = 'Nutrient levels are adequate. No immediate action required.';
  if (data.nitrogen < 40) {
    fertilizer = 'Nitrogen level is low. Apply 25 kg urea per acre.';
  } else if (data.phosphorus < 25) {
    fertilizer = 'Phosphorus level is low. Apply 30 kg DAP per acre.';
  } else if (data.potassium < 15) {
    fertilizer = 'Potassium level is low. Apply 15 kg MOP per acre.';
  }

  return {
    crops: [
      { name: 'Tomato', match: 94 },
      { name: 'Chili', match: 90 },
      { name: 'Brinjal', match: 87 },
      { name: 'Groundnut', match: 79 },
      { name: 'Cotton', match: 68 }
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

  useEffect(() => {
    // Initial data
    const initialData = generateMockReading(null);
    setLatestData(initialData);
    setHistoryData([initialData]);
    setRecommendations(calculateAIRecommendations(initialData));

    // Simulate real-time updates every 15 seconds for demonstration purposes
    const interval = setInterval(() => {
      setLatestData(prev => {
        const newData = generateMockReading(prev);
        setHistoryData(h => [...h.slice(-50), newData]); // Keep last 50 points
        
        // Update recommendations
        setRecommendations(calculateAIRecommendations(newData));
        
        // Update Health Score (mock logic)
        const score = Math.max(0, Math.min(100, 100 - Math.abs(6.5 - newData.ph) * 10 - (newData.moisture < 30 ? 20 : 0)));
        setHealthScore(Math.round(score));

        // Generate Alerts
        if (newData.moisture < 30) {
          setAlerts(a => [{ id: crypto.randomUUID(), message: 'Low moisture detected in Field-A', severity: 'high', timestamp: new Date().toISOString() }, ...a]);
        }
        if (newData.battery_level < 20) {
          setAlerts(a => [{ id: crypto.randomUUID(), message: 'Device ESP32-001 battery low', severity: 'medium', timestamp: new Date().toISOString() }, ...a]);
        }

        return newData;
      });
      
      setDevices(prev => prev.map(d => ({ ...d, last_sync: new Date().toISOString() })));

    }, 15000);

    return () => clearInterval(interval);
  }, []);

  return (
    <BhoomiContext.Provider value={{ latestData, historyData, devices, alerts, recommendations, healthScore }}>
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
