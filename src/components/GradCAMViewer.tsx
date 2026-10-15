import React, { useState } from 'react';
import { Sparkles, Sliders, AlertTriangle } from 'lucide-react';
import { ExplainabilityData } from '../types';

interface GradCAMViewerProps {
  originalImageUrl: string;
  explainability: ExplainabilityData | null;
  className?: string;
}

export const GradCAMViewer: React.FC<GradCAMViewerProps> = ({
  originalImageUrl,
  explainability,
  className = '',
}) => {
  const [viewMode, setViewMode] = useState<'overlay' | 'sideBySide' | 'heatmapOnly'>('overlay');
  const [opacity, setOpacity] = useState(75);
  const [useRollout, setUseRollout] = useState(false);

  if (!explainability) {
    return (
      <div className={`p-8 bg-white/70 rounded-xs border border-[#DADBD3] text-center text-[#777B76] text-xs font-mono ${className}`}>
        <div className="flex items-center justify-center gap-2 mb-2 font-medium text-[#171A19]">
          <Sparkles className="w-4 h-4 text-[#254E43]" />
          Explainability Artifacts Not Available
        </div>
        <p className="max-w-md mx-auto text-[#777B76] font-sans">
          Grad-CAM heatmaps require the backward gradient pass through the last feature map of the model. Run inference with explainability enabled to generate this visualization.
        </p>
      </div>
    );
  }

  const activeHeatmapUrl = useRollout && explainability.attentionRolloutUrl
    ? explainability.attentionRolloutUrl
    : explainability.gradCamUrl;

  return (
    <div className={`bg-white/80 rounded-xs border border-[#DADBD3] overflow-hidden space-y-4 p-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3.5 border-b border-[#DADBD3]">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#254E43] font-semibold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#254E43]" />
            Task 05: Latent Attribution & Visual Explainability
          </span>
          <h4 className="font-serif text-base text-[#171A19] mt-0.5">
            {useRollout ? 'Vision Transformer Attention Rollout' : 'Gradient-Weighted Class Activation Map (Grad-CAM)'}
          </h4>
        </div>

        {/* View Mode Tabs */}
        <div className="flex items-center gap-1 bg-[#F5F3ED] p-0.5 rounded-xs border border-[#DADBD3] text-xs font-mono">
          <button
            onClick={() => setViewMode('overlay')}
            className={`px-2.5 py-1 rounded-xs transition-colors ${
              viewMode === 'overlay' ? 'bg-[#254E43] text-white' : 'text-[#777B76] hover:text-[#171A19]'
            }`}
          >
            Overlay
          </button>
          <button
            onClick={() => setViewMode('sideBySide')}
            className={`px-2.5 py-1 rounded-xs transition-colors ${
              viewMode === 'sideBySide' ? 'bg-[#254E43] text-white' : 'text-[#777B76] hover:text-[#171A19]'
            }`}
          >
            Side-by-Side
          </button>
          <button
            onClick={() => setViewMode('heatmapOnly')}
            className={`px-2.5 py-1 rounded-xs transition-colors ${
              viewMode === 'heatmapOnly' ? 'bg-[#254E43] text-white' : 'text-[#777B76] hover:text-[#171A19]'
            }`}
          >
            Heatmap Only
          </button>
        </div>
      </div>

      {/* Main Visualizer Stage */}
      <div className="relative bg-[#101815] rounded-xs p-4 min-h-[340px] flex items-center justify-center overflow-hidden border border-[#2A3632]">
        <div className="absolute inset-0 bg-[radial-gradient(#2A3632_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

        {viewMode === 'sideBySide' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full h-full items-center z-10">
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-mono text-[#DADBD3] mb-2">Original Fundus</span>
              <img
                src={originalImageUrl}
                alt="Original Retinal Image"
                className="max-h-[300px] object-contain rounded-xs border border-[#2A3632]"
              />
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-mono text-[#86A89B] mb-2">
                {useRollout ? 'Attention Rollout Map' : 'Grad-CAM Activation Map'}
              </span>
              <img
                src={activeHeatmapUrl}
                alt="Explainability Visualization"
                className="max-h-[300px] object-contain rounded-xs border border-[#2A3632]"
              />
            </div>
          </div>
        ) : viewMode === 'heatmapOnly' ? (
          <div className="flex flex-col items-center z-10">
            <img
              src={activeHeatmapUrl}
              alt="Model Heatmap"
              className="max-h-[320px] object-contain rounded-xs border border-[#2A3632]"
            />
          </div>
        ) : (
          /* Overlay Mode */
          <div className="relative inline-block z-10">
            <img
              src={originalImageUrl}
              alt="Original Fundus"
              className="max-h-[340px] object-contain rounded-xs border border-[#2A3632]"
            />
            <img
              src={activeHeatmapUrl}
              alt="Heatmap Overlay"
              className="absolute inset-0 w-full h-full object-contain mix-blend-screen transition-opacity duration-150"
              style={{ opacity: opacity / 100 }}
            />
          </div>
        )}
      </div>

      {/* Controls & Options Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-xs">
        {/* Rollout Toggle if available */}
        <div className="flex items-center gap-3">
          {explainability.attentionRolloutUrl && (
            <label className="flex items-center gap-1.5 cursor-pointer text-[#171A19] select-none font-mono text-[11px]">
              <input
                type="checkbox"
                checked={useRollout}
                onChange={(e) => setUseRollout(e.target.checked)}
                className="rounded-xs text-[#254E43] focus:ring-[#254E43] w-3 h-3"
              />
              <span>Attention Rollout (ViT)</span>
            </label>
          )}

          <div className="text-[10px] text-[#777B76] font-mono">
            Target Layer: <span className="text-[#171A19] font-medium">{explainability.targetLayer}</span>
          </div>
        </div>

        {/* Opacity slider */}
        {viewMode === 'overlay' && (
          <div className="flex items-center gap-2">
            <Sliders className="w-3 h-3 text-[#777B76]" />
            <span className="text-[10px] font-mono text-[#777B76] uppercase">Opacity:</span>
            <input
              type="range"
              min="10"
              max="100"
              value={opacity}
              onChange={(e) => setOpacity(Number(e.target.value))}
              className="w-20 accent-[#254E43] h-1 bg-[#DADBD3] rounded-xs cursor-pointer"
            />
            <span className="font-mono text-[10px] text-[#171A19] w-7">{opacity}%</span>
          </div>
        )}
      </div>

      {/* Scientific Interpretation Notice */}
      <div className="p-3.5 bg-[#B97854]/10 border border-[#B97854]/20 rounded-xs flex items-start gap-2.5 text-xs text-[#B97854]">
        <AlertTriangle className="w-4 h-4 text-[#B97854] shrink-0 mt-0.5" />
        <p className="leading-relaxed text-[11px] font-sans">
          <span className="font-semibold font-mono uppercase tracking-wider">Scientific Attribution Constraint:</span> Heatmap activations reflect regions of high gradient magnitude in the Vision Transformer's latent representation. They do not constitute anatomical proof of chorioretinal lesions.
        </p>
      </div>
    </div>
  );
};
