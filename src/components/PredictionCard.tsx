import React from 'react';
import { CheckCircle2, AlertTriangle, ShieldCheck, Activity } from 'lucide-react';
import { PMClassification } from '../types';

interface PredictionCardProps {
  classification: PMClassification | null;
  className?: string;
}

export const PredictionCard: React.FC<PredictionCardProps> = ({ classification, className = '' }) => {
  if (!classification) {
    return (
      <div className={`p-5 bg-white rounded-xl border border-slate-200 shadow-card text-center text-slate-500 text-xs ${className}`}>
        PM Classification Head not available for this record.
      </div>
    );
  }

  const isPM = classification.predictedClass === 'Pathological Myopia';
  const probPercent = (classification.probability * 100).toFixed(1);
  const thresholdPercent = (classification.threshold * 100).toFixed(0);

  return (
    <div className={`bg-card rounded-xl p-5 border border-slate-200 shadow-card space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5 text-primary" />
          Task 1: Pathological Myopia Classification
        </span>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
          Threshold: {classification.threshold.toFixed(2)}
        </span>
      </div>

      {/* Main Prediction Result */}
      <div className="flex items-center justify-between p-3.5 rounded-lg border bg-slate-50/70 border-slate-200">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-sm ${
              isPM ? 'bg-red-500 ring-4 ring-red-100' : 'bg-emerald-500 ring-4 ring-emerald-100'
            }`}
          >
            {isPM ? <AlertTriangle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
          </div>
          <div>
            <div className="text-base font-bold text-slate-900 tracking-tight">
              {classification.predictedClass}
            </div>
            <div className="text-xs text-slate-500 flex items-center gap-2">
              <span>Confidence Band:</span>
              <span
                className={`font-semibold ${
                  classification.confidenceBand === 'High'
                    ? 'text-emerald-700'
                    : classification.confidenceBand === 'Moderate'
                    ? 'text-amber-700'
                    : 'text-slate-700'
                }`}
              >
                {classification.confidenceBand}
              </span>
            </div>
          </div>
        </div>

        <div className="text-right">
          <div className="text-2xl font-bold font-mono text-slate-900">{probPercent}%</div>
          <div className="text-[11px] text-slate-500 font-mono">P(PM = 1)</div>
        </div>
      </div>

      {/* Probability Progress Bar with Threshold Marker */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-[11px] text-slate-500 font-mono">
          <span>0% (Non-PM)</span>
          <span className="text-slate-700 font-medium">Optimal Cutoff ({thresholdPercent}%)</span>
          <span>100% (PM Positive)</span>
        </div>
        <div className="relative w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
          {/* Progress fill */}
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isPM ? 'bg-red-500' : 'bg-emerald-500'
            }`}
            style={{ width: `${Math.min(Math.max(classification.probability * 100, 2), 100)}%` }}
          />
          {/* Threshold marker line */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-slate-900 z-10"
            style={{ left: `${classification.threshold * 100}%` }}
            title={`Decision Cutoff: ${thresholdPercent}%`}
          />
        </div>
      </div>

      {/* Model & Metadata Footnote */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
        <span className="truncate">Model: {classification.modelName}</span>
        {classification.rawLogit !== undefined && (
          <span className="font-mono text-slate-600">logit: {classification.rawLogit > 0 ? `+${classification.rawLogit.toFixed(2)}` : classification.rawLogit.toFixed(2)}</span>
        )}
      </div>
    </div>
  );
};
