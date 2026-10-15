import React from 'react';
import { CheckCircle2, AlertTriangle, Activity } from 'lucide-react';
import { PMClassification } from '../types';

interface PredictionCardProps {
  classification: PMClassification | null;
  className?: string;
}

export const PredictionCard: React.FC<PredictionCardProps> = ({ classification, className = '' }) => {
  if (!classification) {
    return (
      <div className={`p-5 bg-white/70 rounded-xs border border-[#DADBD3] text-center text-[#777B76] text-xs font-mono ${className}`}>
        PM Classification Head not available for this record.
      </div>
    );
  }

  const isPM = classification.predictedClass === 'Pathological Myopia';
  const probPercent = (classification.probability * 100).toFixed(1);
  const thresholdPercent = (classification.threshold * 100).toFixed(0);

  return (
    <div className={`bg-white/80 rounded-xs p-5 border border-[#DADBD3] space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-mono uppercase tracking-widest text-[#777B76] flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5 text-[#254E43]" />
          Task 01: Binary Classification
        </span>
        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-xs bg-[#F5F3ED] text-[#777B76] border border-[#DADBD3]">
          Cutoff: {classification.threshold.toFixed(2)}
        </span>
      </div>

      {/* Main Prediction Result */}
      <div className="flex items-center justify-between p-4 rounded-xs border border-[#DADBD3] bg-[#F5F3ED]/60">
        <div className="flex items-center gap-3.5">
          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center font-serif text-white ${
              isPM ? 'bg-[#B97854]' : 'bg-[#254E43]'
            }`}
          >
            {isPM ? <AlertTriangle className="w-4 h-4 text-white" /> : <CheckCircle2 className="w-4 h-4 text-white" />}
          </div>
          <div>
            <div className="font-serif text-base sm:text-lg text-[#171A19] tracking-tight">
              {classification.predictedClass}
            </div>
            <div className="text-xs text-[#777B76] flex items-center gap-2 font-mono text-[11px]">
              <span>Confidence:</span>
              <span
                className={`font-semibold ${
                  classification.confidenceBand === 'High'
                    ? 'text-[#254E43]'
                    : classification.confidenceBand === 'Moderate'
                    ? 'text-[#B97854]'
                    : 'text-[#777B76]'
                }`}
              >
                {classification.confidenceBand}
              </span>
            </div>
          </div>
        </div>

        <div className="text-right">
          <div className="text-2xl font-mono font-medium text-[#171A19]">{probPercent}%</div>
          <div className="text-[10px] text-[#777B76] font-mono">P(PM = 1)</div>
        </div>
      </div>

      {/* Probability Progress Bar with Threshold Marker */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-[10px] text-[#777B76] font-mono">
          <span>0% Non-PM</span>
          <span className="text-[#171A19]">Threshold ({thresholdPercent}%)</span>
          <span>100% Pathological</span>
        </div>
        <div className="relative w-full h-2 bg-[#EAE8E0] rounded-xs overflow-hidden border border-[#DADBD3]">
          {/* Progress fill */}
          <div
            className={`h-full transition-all duration-500 ${
              isPM ? 'bg-[#B97854]' : 'bg-[#254E43]'
            }`}
            style={{ width: `${Math.min(Math.max(classification.probability * 100, 2), 100)}%` }}
          />
          {/* Threshold marker line */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-[#171A19] z-10"
            style={{ left: `${classification.threshold * 100}%` }}
            title={`Decision Cutoff: ${thresholdPercent}%`}
          />
        </div>
      </div>

      {/* Model & Metadata Footnote */}
      <div className="pt-2 border-t border-[#DADBD3]/60 flex items-center justify-between text-[10px] font-mono text-[#777B76]">
        <span className="truncate">Backbone: {classification.modelName}</span>
        {classification.rawLogit !== undefined && (
          <span className="text-[#171A19]">logit: {classification.rawLogit > 0 ? `+${classification.rawLogit.toFixed(2)}` : classification.rawLogit.toFixed(2)}</span>
        )}
      </div>
    </div>
  );
};
