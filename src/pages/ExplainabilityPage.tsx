import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  AlertTriangle,
  Info,
  Eye
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
        <div className="bg-white/80 p-5 rounded-xs border border-[#DADBD3] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#254E43] font-semibold flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-[#254E43]" />
              Select Retinal Specimen for Attribution Audit
            </span>
            <span className="text-[10px] font-mono text-[#777B76]">
              {history.length} cases indexed
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
                  className={`flex items-center gap-3 p-2.5 rounded-xs border text-left transition-all ${
                    isSelected
                      ? 'border-[#254E43] bg-[#254E43]/5 ring-1 ring-[#254E43]'
                      : 'border-[#DADBD3] hover:border-[#777B76] bg-[#F5F3ED]/40 hover:bg-[#F5F3ED]'
                  }`}
                >
                  <img
                    src={rec.thumbnailUrl || rec.imageUrl}
                    alt={rec.title}
                    className="w-11 h-11 rounded-xs object-cover border border-[#DADBD3] shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-serif text-[#171A19] truncate">{rec.title}</div>
                    <div className="flex items-center gap-2 mt-0.5 text-[10px] font-mono">
                      <span className={`font-semibold ${isPM ? 'text-[#B97854]' : 'text-[#254E43]'}`}>
                        {rec.pmClassification ? `${(rec.pmClassification.probability * 100).toFixed(0)}% PM` : 'Pending'}
                      </span>
                      <span className="text-[#DADBD3]">•</span>
                      <span className="text-[#777B76] truncate">{rec.severity?.label || 'Cat N/A'}</span>
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
              <div className="bg-white/80 p-6 rounded-xs border border-[#DADBD3] space-y-3">
                <h4 className="font-serif text-base text-[#171A19] flex items-center gap-2">
                  <Info className="w-4 h-4 text-[#254E43]" />
                  Methodology: Vision Transformer Attribution
                </h4>
                <div className="text-xs text-[#777B76] space-y-2 leading-relaxed font-sans">
                  <p>
                    For Convolutional Neural Networks, Grad-CAM targets the activations of the final convolutional stage. In contrast, for Vision Transformers such as <strong>RETFound</strong>, Grad-CAM targets the patch token representations entering the terminal encoder block.
                  </p>
                  <p>
                    The 1D sequence of output tokens is reshaped into a spatial 2D lattice corresponding to the original 448×448 input patch grid, weighted by the backward gradients of the predicted Pathological Myopia class logit.
                  </p>
                  <div className="p-3 bg-[#F5F3ED]/70 rounded-xs border border-[#DADBD3] font-mono text-[10px] text-[#171A19]">
                    Target Layer: Transformer Block 24 Token Map
                    <br />
                    Grid Resolution: 28 × 28 tokens (upsampled via bilinear interpolation to 448 × 448 px)
                  </div>
                </div>
              </div>

              <div className="bg-white/80 p-6 rounded-xs border border-[#DADBD3] space-y-3">
                <h4 className="font-serif text-base text-[#171A19] flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-[#B97854]" />
                  Interpretation Caveats & Clinical Limitations
                </h4>
                <div className="text-xs text-[#777B76] space-y-2 leading-relaxed font-sans">
                  <p>
                    Heatmap high-intensity regions indicate areas of the latent feature representation that contributed most positively to the classification logit.
                  </p>
                  <p>
                    <strong className="text-[#171A19]">Scientific Integrity:</strong> An activation heatmap is not anatomical segmentation. Co-occurrence of heatmap focus on posterior staphyloma or peripapillary atrophy indicates algorithmic sensitivity, but does not independently establish clinical diagnosis.
                  </p>
                  <p className="text-[#B97854] bg-[#B97854]/10 p-2.5 rounded-xs border border-[#B97854]/20 text-[10px] font-mono">
                    Never present model heatmaps as definitive clinical reasoning. OcuLoom is strictly an academic research prototype.
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
