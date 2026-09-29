import React from 'react';
import { Send, CheckCheck, BellRing, PhoneCall } from 'lucide-react';

export default function AlertBanner({ isTriggered = true, farmCount = 3 }) {
  if (!isTriggered) return null;

  return (
    <div style={{
      background: 'linear-gradient(90deg, rgba(239, 68, 68, 0.15) 0%, rgba(18, 28, 24, 0.8) 100%)',
      border: '1px solid rgba(239, 68, 68, 0.35)',
      borderRadius: '12px',
      padding: '16px 20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '16px',
      boxShadow: '0 8px 30px rgba(239, 68, 68, 0.15)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '50%',
          backgroundColor: '#ef4444',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          boxShadow: '0 0 15px rgba(239, 68, 68, 0.6)'
        }}>
          <BellRing size={20} />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#fca5a5' }}>
              Bio-Radar Emergency Broadcast Deployed
            </h4>
            <span style={{
              fontSize: '11px',
              backgroundColor: 'rgba(239, 68, 68, 0.2)',
              color: '#f87171',
              padding: '2px 8px',
              borderRadius: '6px'
            }}>
              Twilio SMS Active
            </span>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Preemptive warning SMS dispatched to <strong>{farmCount} registered farmers</strong> within the 5.0 KM downwind contagion cone.
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#34d399', fontSize: '12px', fontWeight: 600 }}>
        <CheckCheck size={16} />
        <span>SMS Delivered</span>
      </div>
    </div>
  );
}
