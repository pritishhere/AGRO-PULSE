import React, { useState } from 'react';
import { BellRing, CheckCircle2, MapPin } from 'lucide-react';
import { enrollForAlerts } from '../services/api.js';

export default function AlertEnrollment({ coords, onLocationChange }) {
  const [form, setForm] = useState({ name: '', phone: '', consent: false });
  const [status, setStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const detectLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(({ coords: position }) => {
      onLocationChange([position.latitude, position.longitude]);
    });
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
          <button type="button" onClick={detectLocation}>Use GPS</button>
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