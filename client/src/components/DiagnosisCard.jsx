import React from 'react';
import { CheckCircle2, AlertOctagon, HelpCircle, Pill, ArrowRightCircle, Cpu, Radio, Shield } from 'lucide-react';

export default function DiagnosisCard({ result, isAnalyzing }) {
  if (isAnalyzing) {
    return (
      <div className="glass-panel" style={{ padding: '28px', textAlign: 'center' }}>
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          border: '3px solid rgba(16, 185, 129, 0.2)',
          borderTopColor: '#10b981',
          margin: '0 auto 12px auto',
          animation: 'spin 0.8s linear infinite'
        }}></div>
        <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>
          Processing Neural Tensor Transformations
        </h4>
        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
          Extracting feature maps via PyTorch EfficientNetB0 backbone...
        </p>
      </div>
    );
  }

  // Standby initial state when no leaf has been analyzed yet
  if (!result) {
    return (
      <div className="glass-panel" style={{ padding: '24px', textAlign: 'center' }}>
        <div style={{
          width: '44px',
          height: '44px',
          borderRadius: '50%',
          backgroundColor: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 10px auto'
        }}>
          <Radio size={20} color="#64748b" />
        </div>
        <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>
          Diagnostic Console: Standby
        </h3>
        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '6px', maxWidth: '320px', margin: '6px auto 0 auto' }}>
          Upload a field leaf specimen or click one of the quick test samples above to calculate disease probability.
        </p>
      </div>
    );
  }

  const isHealthy = result.disease.toLowerCase().includes('healthy');
  const isLateBlight = result.disease.toLowerCase().includes('late blight');

  return (
    <div className="glass-panel" style={{ padding: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
        <span style={{
          fontSize: '11px',
          fontWeight: 700,
          textTransform: 'uppercase',
          padding: '3px 10px',
          borderRadius: '999px',
          backgroundColor: result.source === 'Local AI' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(59, 130, 246, 0.15)',
          color: result.source === 'Local AI' ? '#34d399' : '#60a5fa',
          border: `1px solid ${result.source === 'Local AI' ? 'rgba(52, 211, 153, 0.3)' : 'rgba(96, 165, 250, 0.3)'}`
        }}>
          {result.source === 'Local AI' ? '⚡ PyTorch EfficientNetB0' : '🌐 Routed to Plant.id'}
        </span>

        <span style={{ fontSize: '13px', fontWeight: 700, color: isHealthy ? '#34d399' : '#ef4444' }}>
          Confidence: {(result.confidence * 100).toFixed(1)}%
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
        <div style={{
          width: '46px',
          height: '46px',
          borderRadius: '12px',
          backgroundColor: isHealthy ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          {isHealthy ? (
            <CheckCircle2 size={24} color="#10b981" />
          ) : (
            <AlertOctagon size={24} color="#ef4444" />
          )}
        </div>

        <div>
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: isHealthy ? '#34d399' : '#f87171' }}>
            {result.disease}
          </h3>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            Specimen: <strong>{result.plant}</strong> &bull; {result.scientificName || 'Solanum tuberosum'}
          </p>
        </div>
      </div>

      {/* Probability Bar */}
      <div style={{ marginTop: '14px' }}>
        <div style={{
          width: '100%',
          height: '6px',
          backgroundColor: 'rgba(255, 255, 255, 0.08)',
          borderRadius: '3px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${result.confidence * 100}%`,
            height: '100%',
            backgroundColor: isHealthy ? '#10b981' : isLateBlight ? '#ef4444' : '#f59e0b',
            borderRadius: '3px',
            transition: 'width 0.8s ease'
          }}></div>
        </div>
      </div>

      {/* Probabilities breakdown if available from PyTorch */}
      {result.all_probabilities && (
        <div style={{
          marginTop: '14px',
          padding: '10px',
          borderRadius: '8px',
          backgroundColor: 'rgba(0,0,0,0.2)',
          fontSize: '11px',
          color: 'var(--text-secondary)',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Early Blight (Alternaria):</span>
            <span style={{ fontWeight: 600 }}>{((result.all_probabilities['Potato Early Blight (Alternaria solani)'] || 0) * 100).toFixed(1)}%</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Late Blight (Phytophthora):</span>
            <span style={{ fontWeight: 600 }}>{((result.all_probabilities['Potato Late Blight (Phytophthora infestans)'] || 0) * 100).toFixed(1)}%</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Healthy Vigor:</span>
            <span style={{ fontWeight: 600 }}>{((result.all_probabilities['Potato Healthy Leaf'] || 0) * 100).toFixed(1)}%</span>
          </div>
        </div>
      )}

      {/* Agronomic Action Protocol */}
      <div style={{
        marginTop: '16px',
        padding: '12px',
        borderRadius: '10px',
        backgroundColor: 'rgba(0,0,0,0.3)',
        border: '1px solid var(--border-subtle)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <Pill size={14} color="#34d399" />
          <h4 style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>
            Agronomic Action Protocol:
          </h4>
        </div>
        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
          {result.prescription}
        </p>
      </div>
    </div>
  );
}
