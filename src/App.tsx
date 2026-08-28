import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import VoiceAssistantPage from './pages/VoiceAssistantPage';
import DeviceManagement from './pages/DeviceManagement';
import IrrigationPage from './pages/IrrigationPage';
import CropRecommendationPage from './pages/CropRecommendationPage';
import DiseaseDetectionPage from './pages/DiseaseDetectionPage';

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/devices" element={<DeviceManagement />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/voice" element={<VoiceAssistantPage />} />
        <Route path="/irrigation" element={<IrrigationPage />} />
        <Route path="/crop-recommendation" element={<CropRecommendationPage />} />
        <Route path="/disease-detection" element={<DiseaseDetectionPage />} />
      </Route>
    </Routes>
  );
}

export default App;
