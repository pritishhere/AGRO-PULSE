import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar.jsx';
import LeafUpload from './components/LeafUpload.jsx';
import RadarMap from './components/RadarMap.jsx';
import DiagnosisCard from './components/DiagnosisCard.jsx';
import AlertBanner from './components/AlertBanner.jsx';
import AlertEnrollment from './components/AlertEnrollment.jsx';
import { uploadLeafForDiagnosis, fetchLiveWindData } from './services/api.js';
import { Activity, ShieldAlert, Cpu, Sparkles, Satellite } from 'lucide-react';

export default function App() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [diagnosis, setDiagnosis] = useState(null); // Clean standby initial state
  const [hasThreat, setHasThreat] = useState(false);
  const [farmCoords, setFarmCoords] = useState([0.0, 0.0]);
  const [windData, setWindData] = useState({ speed: 14.8, bearing: 50 });

  // Fetch real wind data when coordinates change
  useEffect(() => {
    fetchLiveWindData(farmCoords[0], farmCoords[1]).then((w) => {
      if (w) setWindData({ speed: w.windSpeed, bearing: w.windDirection });
    });
  }, [farmCoords]);

  const handleLeafUpload = async (file) => {
    setIsAnalyzing(true);
    try {
      const data = await uploadLeafForDiagnosis(file, { lat: farmCoords[0], lng: farmCoords[1] });
      setDiagnosis(data);
      const isLateBlightThreat = data.disease.toLowerCase().includes('late blight');
      setHasThreat(isLateBlightThreat);
      if (data.windSpeed) {
        setWindData({ speed: data.windSpeed, bearing: data.windBearing || 50 });
      }
    } catch (err) {
      console.error('Diagnosis upload error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="app-shell" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar activeIncidents={hasThreat ? 1 : 0} />

      <main className="dashboard-main" style={{ flex: 1, padding: '28px 32px 36px', maxWidth: '1440px', margin: '0 auto', width: '100%' }}>
        {/* Dynamic Threat Alert Banner (Only visible when actual outbreak occurs) */}
        {hasThreat && (
          <div style={{ marginBottom: '24px' }}>
            <AlertBanner isTriggered={hasThreat} farmCount={3} />
          </div>
        )}

        {/* 2-Column Responsive Surveillance Grid */}
        <div className="surveillance-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(320px, 380px) minmax(0, 1fr)',
          gap: '22px',
          alignItems: 'start'
        }}>
          {/* Left Column: Specimen Upload & Result Card */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <LeafUpload onUpload={handleLeafUpload} isAnalyzing={isAnalyzing} />
            <DiagnosisCard result={diagnosis} isAnalyzing={isAnalyzing} />
            <AlertEnrollment coords={farmCoords} onLocationChange={setFarmCoords} />
          </div>

          {/* Right Column: Bio-Surveillance Contagion Radar Map */}
          <div>
            <RadarMap
              farmLocation={farmCoords}
              contagionRadiusMeters={5000}
              hasThreat={hasThreat}
              diseaseName={diagnosis ? diagnosis.disease : ''}
              windSpeed={windData.speed}
              windBearing={windData.bearing}
              onLocationChange={(newCoords) => setFarmCoords(newCoords)}
            />
          </div>
        </div>

        {/* Academic & Engineering Reference Panel */}
        <div className="reference-strip" style={{
          marginTop: '32px',
          padding: '16px 20px',
          borderRadius: '12px',
          background: 'rgba(16, 185, 129, 0.04)',
          border: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '14px',
          fontSize: '12px',
          color: 'var(--text-secondary)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Cpu size={16} color="#10b981" />
            <span>
              <strong>Model Engine:</strong> PyTorch EfficientNetB0 (Paper 2 Architecture: ICSSAS 2025) &bull; PlantVillage 3-Class
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={16} color="#60a5fa" />
            <span>
              <strong>Smart Router:</strong> Potato → PyTorch Engine &bull; Non-Potato Flora → Plant.id Fallback
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Satellite size={16} color="#34d399" />
            <span>
              <strong>Atmospheric Feed:</strong> Open-Meteo Live Wind Radar
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}
