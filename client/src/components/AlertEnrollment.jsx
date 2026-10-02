import React, { useState } from 'react';
import { BellRing, CheckCircle2, MapPin } from 'lucide-react';
import { enrollForAlerts } from '../services/api.js';

export default function AlertEnrollment({ coords, onLocationChange, onStartLocationTracking }) {
  const [form, setForm] = useState({ name: '', phone: '', consent: false });
  const [status, setStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setStatus({ type: 'error', message: 'GPS unavailable in this browser.' });
      return;
    }

    setStatus({ type: 'info', message: 'Requesting GPS location…' });

    const handleSuccess = ({ coords: position }) => {
      const nextCoords = [position.latitude, position.longitude];
      onLocationChange(nextCoords);
      onStartLocationTracking?.();
      setStatus({
        type: 'success',
        message: `GPS updated to ${nextCoords[0].toFixed(4)}, ${nextCoords[1].toFixed(4)}.`
      });
    };

    const handleError = (error) => {
      const errorMessage = {
        1: 'GPS permission blocked. Please allow location access in the browser.',
        2: 'GPS signal unavailable right now. Please try again in a moment.',
        3: 'GPS request timed out. Please try again.'
      }[error.code] || 'Unable to fetch GPS coordinates right now.';

      setStatus({ type: 'error', message: errorMessage });
    };

    navigator.geolocation.getCurrentPosition(
      handleSuccess,
      (error) => {
        if (error.code === 3) {
          navigator.geolocation.getCurrentPosition(handleSuccess, handleError, {
            enableHighAccuracy: false,
            timeout: 15000,
            maximumAge: 0
          });
          return;
        }
        handleError(error);
      },
      { enableHighAccuracy: false, timeout: 15000, maximumAge: 0 }
    );
  };

  const updateField = (event) => {
    const { name, value, checked, type } = event.target;
    setForm((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus(null);
    try {
      const result = await enrollForAlerts({ ...form, latitude: coords[0], longitude: coords[1] });
      setStatus({ type: 'success', message: result.message });
      setForm({ name: '', phone: '', consent: false });
    } catch (error) {
      setStatus({ type: 'error', message: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="glass-panel enrollment-panel">
      <div className="enrollment-heading">
        <div className="enrollment-icon"><BellRing size={18} /></div>
        <div>
          <h2>Enroll for Nearby Alerts</h2>
          <p>We will notify you if a serious crop threat is detected nearby.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="enrollment-form">
        <label>
          Name
          <input name="name" value={form.name} onChange={updateField} placeholder="Your name" required />
        </label>
        <label>
          Mobile number
          <input name="phone" value={form.phone} onChange={updateField} placeholder="+91 98765 43210" required />
        </label>
        <div className="enrollment-location">
          <span><MapPin size={14} /> {coords[0].toFixed(4)}, {coords[1].toFixed(4)}</span>
          <button type="button" onClick={requestLocation}>Use GPS</button>
        </div>
        <label className="consent-row">
          <input name="consent" type="checkbox" checked={form.consent} onChange={updateField} required />
          <span>I agree to receive crop-risk alerts by SMS.</span>
        </label>
        <button className="enrollment-submit" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Enrolling...' : 'Enroll for alerts'}
        </button>
      </form>

      {status && (
        <p className={`enrollment-status ${status.type}`}>
          {status.type === 'success' && <CheckCircle2 size={15} />}
          {status.message}
        </p>
      )}
    </section>
  );
}