import React from 'react';
import {
  Cpu,
  Database,
  GitBranch
} from 'lucide-react';
import { PageContainer } from '../components/PageContainer';
import { MetricCard } from '../components/MetricCard';
import { getModelInfo, getResearchMetrics } from '../services/api';

export const ModelsPage: React.FC = () => {
  const modelInfo = getModelInfo();
  const metrics = getResearchMetrics();

  return (
    <PageContainer
      title="Models, Training Architecture & Cohorts"
      subtitle="Detailed technical specifications of the RETFound multi-task foundation architecture, checkpoint configuration, and dataset-specific annotation availability."
    >
      <div className="space-y-6">
        {/* Technical Architecture Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            label="Backbone Architecture"
            value="RETFound (ViT-L)"
            subtext="303.3 Million Parameters"
            badge="Foundation Model"
            badgeColor="forest"
            tooltip="Retinal foundation model pretrained via self-supervised Masked Autoencoding on 1.6M ophthalmology images."
          />
          <MetricCard
            label="Checkpoint Weights"
            value="best.pth (1.22 GB)"
            subtext="Best Epoch: 3 / 15 (14.08 min)"
            badge="Local Checkpoint"
            badgeColor="teal"
            tooltip="Trained multi-task PyTorch checkpoint stored in pm_results/pm_research/multitask/best.pth."
          />
          <MetricCard
            label="Input Spatial Resolution"
            value="448 × 448 px"
            subtext="Lightness (L*) CLAHE enhanced"
            badge="CIELAB Space"
            badgeColor="slate"
            tooltip="Square input tensor size chosen to ensure exact divisibility by 16, 32, and Swin window constraints."
          />
          <MetricCard
            label="Joint Loss Scheme"
            value="Weighted Multi-Task"
            subtext="PM: 1, Sev: 1, Seg: 1, Fov: 10"
            badge="Loss Formulation"
            badgeColor="copper"
            tooltip="Relative loss weighting applied across binary cross entropy, ordinal severity, Dice/BCE segmentation, and L1 fovea distance."
          />
        </div>

        {/* Deep Architecture Breakdown Card */}
        <div className="bg-white/80 rounded-xs border border-[#DADBD3] p-6 space-y-4">
          <div className="flex items-center justify-between pb-3.5 border-b border-[#DADBD3]">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[#254E43]" />
              <h3 className="font-serif text-base text-[#171A19]">
                Selected Final Multi-Task Architecture: RETFound
              </h3>
            </div>
            <span className="px-2 py-0.5 rounded-xs text-[10px] font-mono bg-[#254E43]/10 text-[#254E43] border border-[#254E43]/20">
              PyTorch RETFound Backbone
            </span>
          </div>

          <p className="text-xs text-[#777B76] leading-relaxed font-sans">
            The multi-task framework uses a two-stage training scheme. First, single-task classification establishes baseline performance. Next, the classification-tuned backbone is initialized for multi-task joint optimization. Task heads sit on pooled latent features, while segmentation decoders progressively upsample the terminal 2D token representation.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-1 text-xs">
            <div className="p-4 bg-[#F5F3ED]/70 rounded-xs border border-[#DADBD3] space-y-1.5">
              <div className="flex items-center gap-2 font-mono text-[11px] font-semibold text-[#171A19] uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-[#254E43]" />
                <span>Classification & Severity Heads</span>
              </div>
              <p className="text-[#777B76] leading-relaxed text-[11px] font-sans">
                Global average pooling across the output tokens yields a 1024-dimensional latent embedding. Linear projection heads compute binary PM logits and 5-class maculopathy softmax probabilities.
              </p>
            </div>

            <div className="p-4 bg-[#F5F3ED]/70 rounded-xs border border-[#DADBD3] space-y-1.5">
              <div className="flex items-center gap-2 font-mono text-[11px] font-semibold text-[#171A19] uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-[#86A89B]" />
                <span>Progressive Segmentation Decoders</span>
              </div>
              <p className="text-[#777B76] leading-relaxed text-[11px] font-sans">
                A progressive upsampling decoder reconstructs pixel-level masks from the 28×28 token feature map for Optic Disc (HRF-Seg+), Lacquer Cracks (MMAC), and Fuchs Spots (MMAC).
              </p>
            </div>

            <div className="p-4 bg-[#F5F3ED]/70 rounded-xs border border-[#DADBD3] space-y-1.5">
              <div className="flex items-center gap-2 font-mono text-[11px] font-semibold text-[#171A19] uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-[#B97854]" />
                <span>Fovea Coordinate Regression Head</span>
              </div>
              <p className="text-[#777B76] leading-relaxed text-[11px] font-sans">
                A 2-layer MLP with Sigmoid normalization outputs normalized (x, y) coordinates mapped onto the 448×448 space, trained with L1 Smooth loss (loss weight = 10.0).
              </p>
            </div>
          </div>
        </div>

        {/* Dataset Breakdown & Annotation Availability Table */}
        <div className="bg-white/80 rounded-xs border border-[#DADBD3] overflow-hidden">
          <div className="px-6 py-4 border-b border-[#DADBD3] bg-[#F5F3ED] flex items-center justify-between">
            <div>
              <h3 className="font-serif text-base text-[#171A19] flex items-center gap-2">
                <Database className="w-4 h-4 text-[#254E43]" />
                Cohort Harmonization & Annotation Availability
              </h3>
              <p className="text-xs text-[#777B76] mt-0.5 font-sans">
                Each task head is supervised only on images possessing verified ground truth. Missing labels are never imputed as negative controls.
              </p>
            </div>
            <span className="text-[10px] font-mono text-[#777B76]">4 External Cohorts</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#F5F3ED]/70 border-b border-[#DADBD3] text-[#777B76] uppercase text-[10px]">
                <tr>
                  <th className="py-2.5 px-4 font-bold text-[#171A19]">Dataset Cohort</th>
                  <th className="py-2.5 px-4">Research Role</th>
                  <th className="py-2.5 px-4 text-[#254E43]">Available Supervised Annotations</th>
                  <th className="py-2.5 px-4 text-[#B97854]">Unavailable / Masked Labels</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DADBD3]/60 text-[#171A19]">
                {modelInfo.datasets.map((ds) => (
                  <tr key={ds.name} className="hover:bg-[#F5F3ED]/50 transition-colors">
                    <td className="py-2.5 px-4 font-bold text-[#171A19]">
                      {ds.name}
                    </td>
                    <td className="py-2.5 px-4 text-[#777B76]">
                      {ds.role}
                    </td>
                    <td className="py-2.5 px-4 text-[#254E43]">
                      {ds.annotations}
                    </td>
                    <td className="py-2.5 px-4 text-[#B97854] text-[11px]">
                      {ds.unavailable}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Original vs Improved vs Benchmark Comparison */}
        <div className="bg-white/80 rounded-xs border border-[#DADBD3] overflow-hidden">
          <div className="px-6 py-4 border-b border-[#DADBD3] bg-[#F5F3ED] flex items-center justify-between">
            <div>
              <h3 className="font-serif text-base text-[#171A19] flex items-center gap-2">
                <GitBranch className="w-4 h-4 text-[#254E43]" />
                Original vs Improved vs Benchmark Evaluation
              </h3>
              <p className="text-xs text-[#777B76] mt-0.5 font-sans">
                Tracking whether hyperparameter improvements match or exceed the selected benchmark (DenseNet-121).
              </p>
            </div>
            <span className="text-[10px] font-mono text-[#777B76]">original_vs_improved_vs_benchmark.csv</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#F5F3ED]/70 border-b border-[#DADBD3] text-[#777B76] uppercase text-[10px]">
                <tr>
                  <th className="py-2.5 px-4 font-sans text-[#171A19]">Model</th>
                  <th className="py-2.5 px-3">Improved Factor</th>
                  <th className="py-2.5 px-3">Original AUROC</th>
                  <th className="py-2.5 px-3 text-[#254E43] font-bold">Improved AUROC</th>
                  <th className="py-2.5 px-3">Benchmark AUROC</th>
                  <th className="py-2.5 px-3">Improved F1</th>
                  <th className="py-2.5 px-3 font-sans">Statistical Verdict</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DADBD3]/60 text-[#171A19]">
                {metrics.original_vs_improved.map((row: any) => (
                  <tr key={row.model} className="hover:bg-[#F5F3ED]/50 transition-colors">
                    <td className="py-2.5 px-4 font-sans font-medium text-[#171A19]">{row.model}</td>
                    <td className="py-2.5 px-3 text-[#777B76]">{row.improved_from}</td>
                    <td className="py-2.5 px-3">{parseFloat(row.original_auroc).toFixed(4)}</td>
                    <td className="py-2.5 px-3 text-[#254E43] font-bold">{parseFloat(row.improved_auroc).toFixed(4)}</td>
                    <td className="py-2.5 px-3">{parseFloat(row.benchmark_auroc).toFixed(4)}</td>
                    <td className="py-2.5 px-3">{parseFloat(row.improved_f1).toFixed(4)}</td>
                    <td className="py-2.5 px-3 font-sans text-[#777B76]">{row.verdict}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};
