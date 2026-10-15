import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Sliders,
  AlertTriangle,
  Info,
  Layers,
  ArrowRight,
  Eye,
  CheckCircle2,
  ScanEye
} from 'lucide-react';
import { PageContainer } from '../components/PageContainer';
import { GradCAMViewer } from '../components/GradCAMViewer';
import { getAnalysisHistory } from '../services/api';
import { AnalysisRecord } from '../types';

export const ExplainabilityPage: React.FC = () => {
  const [history, setHistory] = useState<AnalysisRecord[]>([]);
  const [selectedRecordId, setSelectedRecordId] = useState<string>('');

  useEffect(() => {
    const list = getAnalysisHistory();
    setHistory(list);
    if (list.length > 0) {
      setSelectedRecordId(list[0].id);
    }
  }, []);

  const selectedRecord = history.find((r) => r.id === selectedRecordId) || history[0];

  return (
    <PageContainer
      title="Explainability & Latent Attribution Explorer"
      subtitle="Investigate spatial gradient attributions and attention mechanisms computed by the RETFound Vision Transformer backbone across diverse clinical cohorts."
    >
      <div className="space-y-6">
        {/* Selector Gallery Bar */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-card space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-primary" />
              Select Evaluated Fundus Eye for Attribution Audit
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              {history.length} cases available
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {history.map((rec) => {
              const isSelected = rec.id === (selectedRecord?.id);
              const isPM = rec.pmClassification?.predictedClass === 'Pathological Myopia';
              return (
                <button
                  key={rec.id}
                  onClick={() => setSelectedRecordId(rec.id)}
                  className={`flex items-center gap-3 p-2.5 rounded-lg border text-left transition-all ${
                    isSelected
                      ? 'border-primary bg-primary-light/60 ring-2 ring-primary/30 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-slate-50/50 hover:bg-slate-50'
                  }`}
                >
                  <img
                    src={rec.thumbnailUrl || rec.imageUrl}
                    alt={rec.title}
                    className="w-12 h-12 rounded object-cover border border-slate-200 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold text-slate-900 truncate">{rec.title}</div>
                    <div className="flex items-center gap-2 mt-0.5 text-[11px]">
                      <span className={`font-mono font-semibold ${isPM ? 'text-red-700' : 'text-emerald-700'}`}>
                        {rec.pmClassification ? `${(rec.pmClassification.probability * 100).toFixed(0)}% PM` : 'Pending'}
                      </span>
                      <span className="text-slate-400">•</span>
                      <span className="text-slate-500 truncate">{rec.severity?.label || 'Cat N/A'}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Record Explainability Inspection */}
        {selectedRecord && (
          <div className="space-y-6">
            <GradCAMViewer
              originalImageUrl={selectedRecord.imageUrl}
              explainability={selectedRecord.explainability}
            />

            {/* Scientific Explanation & Methodology Note */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-card space-y-3">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-primary" />
                  Methodology: Vision Transformer Attribution
                </h4>
                <div className="text-xs text-slate-600 space-y-2 leading-relaxed">
                  <p>
                    For Convolutional Neural Networks, Grad-CAM targets the activations of the final convolutional stage. In contrast, for Vision Transformers such as <strong>RETFound</strong>, Grad-CAM targets the patch token representations entering the terminal encoder block.
                  </p>
                  <p>
                    The 1D sequence of output tokens is reshaped into a spatial 2D lattice corresponding to the original 448×448 input patch grid, weighted by the backward gradients of the predicted Pathological Myopia class logit.
                  </p>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 font-mono text-[11px] text-slate-700">
                    Target Layer: Transformer Block 24 Token Map
                    <br />
                    Grid Resolution: 28 × 28 tokens (upsampled via bilinear interpolation to 448 × 448 px)
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-card space-y-3">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  Interpretation Caveats & Clinical Limitations
                </h4>
                <div className="text-xs text-slate-600 space-y-2 leading-relaxed">
                  <p>
                    Heatmap high-intensity regions indicate areas of the latent feature representation that contributed most positively to the classification logit.
                  </p>
                  <p>
                    <strong className="text-slate-800">Critical Disclaimer:</strong> An activation heatmap is not anatomical segmentation. Co-occurrence of heatmap focus on posterior staphyloma or peripapillary atrophy indicates algorithmic sensitivity, but does not independently establish clinical diagnosis.
                  </p>
                  <p className="text-amber-800 bg-amber-50 p-2.5 rounded border border-amber-200 text-[11px]">
                    Never present model heatmaps as definitive clinical reasoning. PathMyo is strictly an academic research prototype.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageContainer>
  );
};
