import React from 'react';
import { AlertTriangle, ShieldCheck } from 'lucide-react';

interface ResearchDisclaimerProps {
  compact?: boolean;
  className?: string;
}

export const ResearchDisclaimer: React.FC<ResearchDisclaimerProps> = ({ compact = false, className = '' }) => {
  if (compact) {
    return (
      <div className={`flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-md text-xs text-amber-800 ${className}`}>
        <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
        <span className="font-medium">Research Prototype:</span>
        <span className="text-amber-700">Not clinically validated for diagnostic decision-making.</span>
      </div>
    );
  }

  return (
    <div className={`p-4 bg-slate-50 border border-slate-200 rounded-lg flex items-start gap-3 shadow-subtle ${className}`}>
      <div className="p-2 bg-amber-100/80 rounded-md text-amber-800 shrink-0 mt-0.5">
        <AlertTriangle className="w-4 h-4 text-amber-700" />
      </div>
      <div className="text-xs space-y-1">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-800 uppercase tracking-wide text-[11px]">Academic & Research Evaluation Only</span>
          <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-200 text-slate-700">Non-Diagnostic</span>
        </div>
        <p className="text-slate-600 leading-relaxed">
          PathMyo is an explainable deep learning research framework developed to quantify structural phenotypes in high myopia.
          Model predictions, segmentation contours, fovea coordinates, and Grad-CAM activations are intended solely for scientific investigation and algorithm benchmarking.
          They do not substitute for certified ophthalmic examination.
        </p>
      </div>
    </div>
  );
};
