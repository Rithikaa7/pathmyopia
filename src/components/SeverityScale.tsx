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
      <div className={`p-5 bg-white/70 rounded-xs border border-[#DADBD3] text-center text-[#777B76] text-xs font-mono ${className}`}>
        <div className="flex items-center justify-center gap-1.5 text-[#171A19] mb-1 font-medium">
          <AlertCircle className="w-3.5 h-3.5 text-[#B97854]" />
          Severity Head Not Configured for this Cohort
        </div>
        <p className="text-[11px] text-[#777B76]">
          This specimen originated from a dataset without multi-level maculopathy severity annotations (e.g. PALM or HRF-Seg+).
        </p>
      </div>
    );
  }

  const levels = [
    { level: 0, code: 'C0', name: 'No Retinal Lesions', dotColor: 'bg-[#254E43]' },
    { level: 1, code: 'C1', name: 'Tessellated Fundus', dotColor: 'bg-[#86A89B]' },
    { level: 2, code: 'C2', name: 'Diffuse Atrophy', dotColor: 'bg-[#B97854]/70' },
    { level: 3, code: 'C3', name: 'Patchy Atrophy', dotColor: 'bg-[#B97854]' },
    { level: 4, code: 'C4', name: 'Macular Atrophy', dotColor: 'bg-[#8A3822]' },
  ];

  return (
    <div className={`bg-white/80 rounded-xs p-5 border border-[#DADBD3] space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-mono uppercase tracking-widest text-[#777B76] flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-[#254E43]" />
          Task 02: 5-Level Maculopathy Severity (META-PM)
        </span>
        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-xs bg-[#254E43]/10 text-[#254E43] border border-[#254E43]/20 font-semibold">
          {severity.label}
        </span>
      </div>

      {/* Current Level Overview */}
      <div className="p-4 rounded-xs border border-[#DADBD3] bg-[#F5F3ED]/60">
        <div className="flex items-center justify-between mb-1">
          <div className="font-serif text-base text-[#171A19]">{severity.name}</div>
          <span className="text-xs font-mono font-medium text-[#254E43]">
            {severity.probabilities[severity.level] !== undefined
              ? `${(severity.probabilities[severity.level] * 100).toFixed(1)}%`
              : ''}
          </span>
        </div>
        <p className="text-xs text-[#777B76] leading-relaxed font-sans">{severity.description}</p>
        <div className="mt-2.5 pt-2 border-t border-[#DADBD3]/60 text-[11px] text-[#777B76] font-sans">
          <span className="font-medium text-[#171A19]">Structural Phenotype:</span>{' '}
          {severity.clinicalSignificance}
        </div>
      </div>

      {/* 5-Level Segmented Indicator */}
      <div className="space-y-2">
        <div className="grid grid-cols-5 gap-1.5">
          {levels.map((lvl) => {
            const isSelected = lvl.level === severity.level;
            const prob = severity.probabilities[lvl.level] || 0;
            return (
              <div
                key={lvl.level}
                className={`flex flex-col items-center p-2 rounded-xs border text-center transition-all ${
                  isSelected
                    ? 'border-[#254E43] bg-white ring-1 ring-[#254E43] shadow-xs'
                    : 'border-[#DADBD3] bg-white/60 hover:bg-white'
                }`}
              >
                <div className="flex items-center gap-1 mb-1">
                  <span className={`w-1.5 h-1.5 rounded-full ${lvl.dotColor}`} />
                  <span className="text-[10px] font-mono font-bold text-[#171A19]">{lvl.code}</span>
                </div>
                <div className="text-[9px] text-[#777B76] truncate w-full font-sans" title={lvl.name}>
                  {lvl.name.split(' ')[0]}
                </div>
                <div className="mt-1 text-[10px] font-mono text-[#171A19]">
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
