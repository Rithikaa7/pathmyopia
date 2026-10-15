import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ResearchDisclaimerProps {
  compact?: boolean;
  className?: string;
}

export const ResearchDisclaimer: React.FC<ResearchDisclaimerProps> = ({ compact = false, className = '' }) => {
  if (compact) {
    return (
      <div className={`flex items-center gap-2 px-3 py-1.5 bg-[#B97854]/10 border border-[#B97854]/20 rounded-xs text-[11px] font-mono text-[#B97854] ${className}`}>
        <AlertTriangle className="w-3.5 h-3.5 text-[#B97854] shrink-0" />
        <span className="font-semibold uppercase tracking-wider">Research Prototype:</span>
        <span className="text-[#171A19]/80 font-sans">For scientific investigation only; not for clinical diagnostic decisions.</span>
      </div>
    );
  }

  return (
    <div className={`p-4 bg-white/70 border border-[#DADBD3] rounded-xs flex items-start gap-3.5 ${className}`}>
      <div className="p-1.5 bg-[#B97854]/10 border border-[#B97854]/20 rounded-xs text-[#B97854] shrink-0 mt-0.5">
        <AlertTriangle className="w-4 h-4 text-[#B97854]" />
      </div>
      <div className="text-xs space-y-1">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] uppercase tracking-wider font-semibold text-[#171A19]">
            Research & Academic Evaluation Protocol
          </span>
          <span className="px-1.5 py-0.2 rounded-xs text-[9px] font-mono bg-[#EAE8E0] text-[#777B76] border border-[#DADBD3]">
            Non-Diagnostic
          </span>
        </div>
        <p className="text-[#777B76] leading-relaxed font-sans">
          OcuLoom is an explainable deep learning research platform developed to quantify structural phenotypes in pathological myopia.
          Model predictions, segmentation contours, fovea coordinates, and Grad-CAM activations are intended solely for algorithmic benchmarking and scientific discovery.
          They do not substitute for certified ophthalmic examination.
        </p>
      </div>
    </div>
  );
};
