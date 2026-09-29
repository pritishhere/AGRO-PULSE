import React, { useState, useRef } from 'react';
import { UploadCloud, Zap, Sparkles, RefreshCw, Layers } from 'lucide-react';

const SAMPLES = [
  { id: 'lb', name: 'Late Blight (Threat)', file: '/samples/late_blight.jpg', desc: 'Active fungal outbreak' },
  { id: 'eb', name: 'Early Blight', file: '/samples/early_blight.jpg', desc: 'Concentric lesions' },
  { id: 'hl', name: 'Healthy Leaf', file: '/samples/healthy_potato.jpg', desc: 'Normal chlorophyll' },
  { id: 'op', name: 'Other Crop (Tomato)', file: '/samples/other_plant.jpg', desc: 'Plant.id auto-route' }
];

export default function LeafUpload({ onUpload, isAnalyzing }) {
  const [dragOver, setDragOver] = useState(false);
  const [preview, setPreview] = useState(null);
  const [selectedSample, setSelectedSample] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (file, sampleId = null) => {
    if (!file) return;
    setSelectedSample(sampleId);
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target.result);
      if (onUpload) onUpload(file);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleSelectSample = async (sample) => {
    try {
      const response = await fetch(sample.file);
      const blob = await response.blob();
      const file = new File([blob], `${sample.id}_specimen.jpg`, { type: 'image/jpeg' });
      handleFileChange(file, sample.id);
    } catch (err) {
      console.error('Error loading sample:', err);
    }
  };

  const handleReset = (e) => {
    e.stopPropagation();
    setPreview(null);
    setSelectedSample(null);
  };

  return (
    <div className="glass-panel" style={{ padding: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Zap size={18} color="#10b981" />
          Field Specimen Diagnostics
        </h2>
        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
          EfficientNetB0 (Paper 2)
        </span>
      </div>

      {/* Main Drag-Drop Upload Area */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current && fileInputRef.current.click()}
        style={{
          border: `2px dashed ${dragOver ? '#10b981' : 'rgba(46, 204, 113, 0.25)'}`,
          borderRadius: '14px',
          padding: preview ? '16px' : '32px 16px',
          textAlign: 'center',
          cursor: isAnalyzing ? 'wait' : 'pointer',
          background: dragOver ? 'rgba(16, 185, 129, 0.08)' : 'rgba(0, 0, 0, 0.3)',
          transition: 'all 0.2s ease',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={(e) => e.target.files && handleFileChange(e.target.files[0])}
          disabled={isAnalyzing}
        />

        {preview ? (
          <div style={{ position: 'relative' }}>
            <img
              src={preview}
              alt="Leaf specimen"
              style={{
                maxWidth: '100%',
                maxHeight: '200px',
                borderRadius: '10px',
                objectFit: 'contain',
                boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                filter: isAnalyzing ? 'brightness(0.5)' : 'none'
              }}
            />

            {/* Reset button */}
            <button
              onClick={handleReset}
              style={{
                position: 'absolute',
                top: '8px',
                right: '8px',
                background: 'rgba(0,0,0,0.7)',
                color: '#fff',
                border: '1px solid var(--border-subtle)',
                borderRadius: '6px',
                padding: '4px 8px',
                fontSize: '11px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <RefreshCw size={12} /> Clear
            </button>

            {isAnalyzing && (
              <div style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px'
              }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  border: '3px solid rgba(16, 185, 129, 0.3)',
                  borderTopColor: '#10b981',
                  animation: 'spin 0.8s linear infinite'
                }}></div>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#34d399', textShadow: '0 2px 6px #000' }}>
                  Analyzing Neural Features...
                </span>
              </div>
            )}
          </div>
        ) : (
          <div>
            <div style={{
              width: '52px',
              height: '52px',
              borderRadius: '50%',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 10px auto'
            }}>
              <UploadCloud size={26} color="#10b981" />
            </div>
            <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
              Click to select or drag & drop leaf photo
            </p>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
              Supports JPG, PNG, WEBP specimens
            </p>
          </div>
        )}
      </div>

      {/* Quick Test Samples */}
      <div style={{ marginTop: '18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
          <Layers size={14} color="#10b981" />
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>
            Quick Specimen Test Samples:
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
          {SAMPLES.map((sample) => (
            <button
              key={sample.id}
              onClick={() => handleSelectSample(sample)}
              disabled={isAnalyzing}
              style={{
                textAlign: 'left',
                padding: '8px 10px',
                borderRadius: '8px',
                border: `1px solid ${selectedSample === sample.id ? '#10b981' : 'var(--border-subtle)'}`,
                background: selectedSample === sample.id ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ fontSize: '12px', fontWeight: 700, color: selectedSample === sample.id ? '#34d399' : 'var(--text-primary)' }}>
                {sample.name}
              </div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                {sample.desc}
              </div>
            </button>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
