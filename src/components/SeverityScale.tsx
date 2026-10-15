import React from 'react';
import { Layers, AlertCircle } from 'lucide-react';
import { SeverityAssessment } from '../types';

interface SeverityScaleProps {
  severity: SeverityAssessment | null;
  className?: string;
}

export const SeverityScale: React.FC<SeverityScaleProps> = ({ severity, className = '' }) => {
  if (!severity) {
    return (
      <div className={`p-5 bg-white rounded-xl border border-slate-200 shadow-card text-center text-slate-500 text-xs ${className}`}>
        <div className="flex items-center justify-center gap-1.5 text-slate-600 mb-1 font-medium">
          <AlertCircle className="w-4 h-4 text-amber-500" />
          Severity Head Not Configured for this Cohort
        </div>
        <p className="text-[11px] text-slate-400">
          This image originated from a dataset without multi-level maculopathy severity annotations (e.g. PALM or HRF-Seg+).
        </p>
      </div>
    );
  }

  const levels = [
    { level: 0, code: 'C0', name: 'No Retinal Lesions', color: 'bg-emerald-500', text: 'text-emerald-700' },
    { level: 1, code: 'C1', name: 'Tessellated Fundus', color: 'bg-blue-500', text: 'text-blue-700' },
    { level: 2, code: 'C2', name: 'Diffuse Atrophy', color: 'bg-amber-500', text: 'text-amber-700' },
    { level: 3, code: 'C3', name: 'Patchy Atrophy', color: 'bg-orange-500', text: 'text-orange-700' },
    { level: 4, code: 'C4', name: 'Macular Atrophy', color: 'bg-red-500', text: 'text-red-700' },
  ];

  return (
    <div className={`bg-card rounded-xl p-5 border border-slate-200 shadow-card space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-primary" />
          Task 2: Five-Level Myopic Maculopathy Severity
        </span>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 font-semibold">
          {severity.label}
        </span>
      </div>

      {/* Current Level Overview */}
      <div className="p-3.5 rounded-lg border bg-slate-50 border-slate-200">
        <div className="flex items-center justify-between mb-1">
          <div className="text-sm font-bold text-slate-900">{severity.name}</div>
          <span className="text-xs font-mono font-bold text-primary">
            {severity.probabilities[severity.level] !== undefined
              ? `${(severity.probabilities[severity.level] * 100).toFixed(1)}%`
              : ''}
          </span>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">{severity.description}</p>
        <div className="mt-2 pt-2 border-t border-slate-200 text-[11px] text-slate-500">
          <span className="font-semibold text-slate-700">Clinical Correlate:</span>{' '}
          {severity.clinicalSignificance}
        </div>
      </div>

      {/* 5-Level Progress Bar / Segmented Indicator */}
      <div className="space-y-2">
        <div className="grid grid-cols-5 gap-1.5">
          {levels.map((lvl) => {
            const isSelected = lvl.level === severity.level;
            const prob = severity.probabilities[lvl.level] || 0;
            return (
              <div
                key={lvl.level}
                className={`flex flex-col items-center p-2 rounded-lg border text-center transition-all ${
                  isSelected
                    ? 'border-primary bg-primary-light/50 ring-2 ring-primary/40 shadow-xs'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-1 mb-1">
                  <span className={`w-2 h-2 rounded-full ${lvl.color}`} />
                  <span className="text-[11px] font-mono font-bold text-slate-800">{lvl.code}</span>
                </div>
                <div className="text-[10px] text-slate-500 truncate w-full" title={lvl.name}>
                  {lvl.name.split(' ')[0]}
                </div>
                <div className="mt-1 text-[11px] font-mono font-semibold text-slate-700">
                  {(prob * 100).toFixed(0)}%
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
