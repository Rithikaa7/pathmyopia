import React, { useState } from 'react';
import { Sparkles, Sliders, Info, AlertTriangle, Eye, Layers } from 'lucide-react';
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
      <div className={`p-6 bg-white rounded-xl border border-slate-200 text-center text-slate-500 text-xs shadow-card ${className}`}>
        <div className="flex items-center justify-center gap-2 mb-2 font-medium text-slate-700">
          <Sparkles className="w-4 h-4 text-primary" />
          Explainability Artifacts Not Found
        </div>
        <p className="max-w-md mx-auto text-slate-500">
          Grad-CAM heatmaps require the backward gradient pass through the last feature map of the model. Run inference with explainability enabled to generate this visualization.
        </p>
      </div>
    );
  }

  const activeHeatmapUrl = useRollout && explainability.attentionRolloutUrl
    ? explainability.attentionRolloutUrl
    : explainability.gradCamUrl;

  return (
    <div className={`bg-card rounded-xl border border-slate-200 shadow-card overflow-hidden space-y-4 p-5 ${className}`}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            Task 5: Latent Attribution & Explainability
          </span>
          <h4 className="text-sm font-bold text-slate-900 mt-0.5">
            {useRollout ? 'Vision Transformer Attention Rollout' : 'Gradient-Weighted Class Activation Map (Grad-CAM)'}
          </h4>
        </div>

        {/* View Mode Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
          <button
            onClick={() => setViewMode('overlay')}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
              viewMode === 'overlay' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Overlay
          </button>
          <button
            onClick={() => setViewMode('sideBySide')}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
              viewMode === 'sideBySide' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Side-by-Side
          </button>
          <button
            onClick={() => setViewMode('heatmapOnly')}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
              viewMode === 'heatmapOnly' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Heatmap Only
          </button>
        </div>
      </div>

      {/* Main Visualizer Stage */}
      <div className="relative bg-slate-950 rounded-lg p-3 min-h-[340px] flex items-center justify-center overflow-hidden">
        {viewMode === 'sideBySide' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full h-full items-center">
            <div className="flex flex-col items-center">
              <span className="text-[11px] font-mono text-slate-400 mb-2">Original Fundus</span>
              <img
                src={originalImageUrl}
                alt="Original Retinal Image"
                className="max-h-[300px] object-contain rounded shadow"
              />
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[11px] font-mono text-slate-400 mb-2">
                {useRollout ? 'Attention Rollout Map' : 'Grad-CAM Activation Map'}
              </span>
              <img
                src={activeHeatmapUrl}
                alt="Explainability Visualization"
                className="max-h-[300px] object-contain rounded shadow"
              />
            </div>
          </div>
        ) : viewMode === 'heatmapOnly' ? (
          <div className="flex flex-col items-center">
            <img
              src={activeHeatmapUrl}
              alt="Model Heatmap"
              className="max-h-[320px] object-contain rounded shadow"
            />
          </div>
        ) : (
          /* Overlay Mode */
          <div className="relative inline-block">
            <img
              src={originalImageUrl}
              alt="Original Fundus"
              className="max-h-[340px] object-contain rounded"
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
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs">
        {/* Rollout Toggle if available */}
        <div className="flex items-center gap-3">
          {explainability.attentionRolloutUrl && (
            <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 select-none">
              <input
                type="checkbox"
                checked={useRollout}
                onChange={(e) => setUseRollout(e.target.checked)}
                className="rounded text-primary focus:ring-primary w-3.5 h-3.5"
              />
              <span className="font-medium text-slate-700">Attention Rollout (ViT)</span>
            </label>
          )}

          <div className="text-[11px] text-slate-500 font-mono">
            Target Layer: <span className="text-slate-800">{explainability.targetLayer}</span>
          </div>
        </div>

        {/* Opacity slider */}
        {viewMode === 'overlay' && (
          <div className="flex items-center gap-2">
            <Sliders className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-[11px] text-slate-600">Overlay Opacity:</span>
            <input
              type="range"
              min="10"
              max="100"
              value={opacity}
              onChange={(e) => setOpacity(Number(e.target.value))}
              className="w-24 accent-primary h-1.5 bg-slate-200 rounded cursor-pointer"
            />
            <span className="font-mono text-[11px] text-slate-700 w-8">{opacity}%</span>
          </div>
        )}
      </div>

      {/* Scientific Interpretation Notice */}
      <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg flex items-start gap-2.5 text-xs text-amber-900">
        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed text-[11px]">
          <span className="font-semibold">Explainability Limitation:</span> Heatmap activations reflect regions of high gradient magnitude in the Vision Transformer's latent representation. They do not constitute an anatomical proof or clinical confirmation of chorioretinal lesions.
        </p>
      </div>
    </div>
  );
};
