import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import VoiceAssistantPage from './pages/VoiceAssistantPage';
import DeviceManagement from './pages/DeviceManagement';

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/voice" element={<VoiceAssistantPage />} />
        <Route path="/devices" element={<DeviceManagement />} />
      </Route>
    </Routes>
  );
}

export default App;
