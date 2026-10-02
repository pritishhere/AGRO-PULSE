import React from 'react';
import { ShieldAlert, Activity, Wifi, MapPin } from 'lucide-react';

export default function Navbar({ activeIncidents = 1 }) {
  return (
    <header className="site-navbar" style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '16px 32px',
      borderBottom: '1px solid rgba(148, 163, 184, 0.16)',
      background: 'linear-gradient(115deg, rgba(10, 18, 15, 0.82), rgba(13, 31, 24, 0.68))',
      backdropFilter: 'blur(18px) saturate(135%)',
      WebkitBackdropFilter: 'blur(18px) saturate(135%)',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.18), inset 0 -1px 0 rgba(52, 211, 153, 0.08)',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div className="logo-mark" style={{
          width: '42px',
          height: '42px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 10px 18px rgba(5, 150, 105, 0.28), 0 0 20px rgba(16, 185, 129, 0.35)'
        }}>
          <ShieldAlert size={24} color="#ffffff" />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 style={{ fontSize: '20px', fontWeight: 800, letterSpacing: '-0.02em', color: '#fff' }}>
              AGRO-PULSE
            </h1>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            Predictive Crop Epidemic Surveillance & Containment
          </p>
        </div>
      </div>

      <div className="navbar-status" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '13px',
          color: 'var(--text-secondary)',
          background: 'rgba(255, 255, 255, 0.03)',
          padding: '6px 14px',
          borderRadius: '20px',
          border: '1px solid var(--border-subtle)'
        }}>
          <span style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: '#10b981',
            boxShadow: '0 0 8px #10b981'
          }}></span>
          <span>Radar Online</span>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '13px',
          color: activeIncidents > 0 ? '#f87171' : '#34d399',
          background: activeIncidents > 0 ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
          padding: '6px 14px',
          borderRadius: '20px',
          border: `1px solid ${activeIncidents > 0 ? 'rgba(239, 68, 68, 0.25)' : 'rgba(52, 211, 153, 0.25)'}`
        }}>
          <Activity size={15} />
          <span>{activeIncidents > 0 ? 'Active Threat: Late Blight' : 'Surveillance: All Clear'}</span>
        </div>
      </div>
    </header>
  );
}
