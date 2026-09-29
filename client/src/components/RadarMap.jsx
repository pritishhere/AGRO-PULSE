import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Circle, Marker, Popup, useMap, Polygon } from 'react-leaflet';
import L from 'leaflet';
import { Compass, AlertTriangle, ShieldCheck, Radio, MapPin, Wind, Navigation } from 'lucide-react';

// Fix Leaflet default marker icons in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Center change helper
function MapUpdater({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, map, zoom]);
  return null;
}

// Generate downwind plume polygon based on wind bearing and speed
function getWindPlumeCoords(center, windBearing, radiusKm = 5.0) {
  const [lat, lng] = center;
  const dLat = (radiusKm / 111.0);
  const dLng = (radiusKm / (111.0 * Math.cos(lat * Math.PI / 180)));

  // Convert bearing (0° = North, 90° = East) to radians
  const rad = (windBearing * Math.PI) / 180;
  
  // Plume apex
  const tipLat = lat + Math.cos(rad) * dLat * 1.3;
  const tipLng = lng + Math.sin(rad) * dLng * 1.3;

  // Plume wings
  const wing1Lat = lat + Math.cos(rad + 0.6) * dLat * 0.8;
  const wing1Lng = lng + Math.sin(rad + 0.6) * dLng * 0.8;

  const wing2Lat = lat + Math.cos(rad - 0.6) * dLat * 0.8;
  const wing2Lng = lng + Math.sin(rad - 0.6) * dLng * 0.8;

  return [
    [lat, lng],
    [wing1Lat, wing1Lng],
    [tipLat, tipLng],
    [wing2Lat, wing2Lng]
  ];
}

export default function RadarMap({
  farmLocation = [22.5726, 88.3639],
  contagionRadiusMeters = 5000,
  hasThreat = false,
  diseaseName = '',
  windSpeed = 15.4,
  windBearing = 48,
  onLocationChange
}) {
  const [mapZoom, setMapZoom] = useState(6);
  const plumeCoords = getWindPlumeCoords(farmLocation, windBearing, 5.0);

  const handleDetectLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setMapZoom(12);
          if (onLocationChange) {
            onLocationChange([pos.coords.latitude, pos.coords.longitude]);
          }
        },
        (err) => console.log('Geolocation unavailable:', err.message)
      );
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Map Header with Real Wind and Controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Radio size={20} color={hasThreat ? "#ef4444" : "#10b981"} />
            Bio-Surveillance Contagion Radar
          </h2>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            {hasThreat
              ? `Active Outbreak: 5km spore dispersion trajectory along ${windBearing}° wind`
              : 'Standby Radar: Monitoring regional agricultural micro-districts'}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(0,0,0,0.4)',
            padding: '6px 12px',
            borderRadius: '8px',
            fontSize: '12px',
            border: '1px solid var(--border-subtle)'
          }}>
            <Wind size={15} color="#34d399" />
            <span>{windSpeed} km/h</span>
            <Navigation size={13} color="#60a5fa" style={{ transform: `rotate(${windBearing}deg)` }} />
            <span>{windBearing}°</span>
          </div>

          <button
            onClick={handleDetectLocation}
            title="Use current GPS coordinates"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              background: 'rgba(16, 185, 129, 0.1)',
              color: '#34d399',
              border: '1px solid rgba(52, 211, 153, 0.3)',
              borderRadius: '8px',
              padding: '6px 10px',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <MapPin size={13} /> GPS
          </button>
        </div>
      </div>

      {/* Leaflet Map Frame */}
      <div style={{
        height: '460px',
        width: '100%',
        borderRadius: '12px',
        overflow: 'hidden',
        border: '1px solid var(--border-subtle)',
        position: 'relative'
      }}>
        <MapContainer
          center={farmLocation}
          zoom={6}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={true}
        >
          <MapUpdater center={farmLocation} zoom={mapZoom} />
          
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Epicenter Marker */}
          <Marker position={farmLocation}>
            <Popup>
              <strong>{hasThreat ? '🚨 Infected Farm Epicenter' : '📍 Farm Location'}</strong><br />
              Coordinates: {farmLocation[0].toFixed(4)}, {farmLocation[1].toFixed(4)}<br />
              Status: {hasThreat ? `Diagnosed: ${diseaseName}` : 'Under Surveillance (Standby)'}
            </Popup>
          </Marker>

          {/* Active Contagion Dispersion Layer (When Threat Detected) */}
          {hasThreat && (
            <>
              {/* 5km Radial Boundary */}
              <Circle
                center={farmLocation}
                radius={contagionRadiusMeters}
                pathOptions={{
                  color: '#ef4444',
                  fillColor: '#ef4444',
                  fillOpacity: 0.12,
                  weight: 2,
                  dashArray: '6, 6'
                }}
              />
              
              {/* High Intensity Core Area */}
              <Circle
                center={farmLocation}
                radius={contagionRadiusMeters * 0.35}
                pathOptions={{
                  color: '#f97316',
                  fillColor: '#f97316',
                  fillOpacity: 0.25,
                  weight: 2
                }}
              />

              {/* Wind-Driven Airborne Dispersion Plume */}
              <Polygon
                positions={plumeCoords}
                pathOptions={{
                  color: '#ef4444',
                  fillColor: '#ef4444',
                  fillOpacity: 0.22,
                  weight: 1
                }}
              />
            </>
          )}

        </MapContainer>
      </div>

      {/* Radar Metrics Footer */}
      <div style={{ marginTop: '16px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <div style={{
          flex: 1,
          minWidth: '140px',
          background: hasThreat ? 'rgba(239, 68, 68, 0.08)' : 'rgba(255, 255, 255, 0.02)',
          border: `1px solid ${hasThreat ? 'rgba(239, 68, 68, 0.25)' : 'var(--border-subtle)'}`,
          borderRadius: '10px',
          padding: '10px 14px'
        }}>
          <div style={{ fontSize: '11px', color: hasThreat ? '#f87171' : 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
            Surveillance Radius
          </div>
          <div style={{ fontSize: '18px', fontWeight: 800, color: hasThreat ? '#ef4444' : 'var(--text-primary)' }}>
            {hasThreat ? '5.0 KM (Active Blast)' : '5.0 KM (Standby)'}
          </div>
        </div>

      </div>
    </div>
  );
}
