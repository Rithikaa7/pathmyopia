import React from 'react';
import {
  Cpu,
  Database,
  Layers,
  FileCheck2,
  HardDrive,
  CheckCircle2,
  AlertTriangle,
  Info,
  ExternalLink,
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
      title="Models, Training Architecture & Dataset Harmonization"
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
            badgeColor="teal"
            tooltip="Retinal foundation model pretrained via self-supervised Masked Autoencoding on 1.6M ophthalmology images."
          />
          <MetricCard
            label="Checkpoint Weights"
            value="best.pth (1.22 GB)"
            subtext="Best Epoch: 3 / 15 (14.08 min)"
            badge="Local Artifact"
            badgeColor="emerald"
            tooltip="Trained multi-task PyTorch checkpoint stored in pm_results/pm_research/multitask/best.pth."
          />
          <MetricCard
            label="Input Spatial Resolution"
            value="448 × 448 px"
            subtext="Lightness (L*) CLAHE enhanced"
            badge="CIELAB Space"
            badgeColor="blue"
            tooltip="Square input tensor size chosen to ensure exact divisibility by 16, 32, and Swin window constraints."
          />
          <MetricCard
            label="Joint Loss Scheme"
            value="Weighted Multi-Task"
            subtext="PM: 1, Sev: 1, Seg: 1, Fov: 10"
            badge="Loss Balancer"
            badgeColor="slate"
            tooltip="Relative loss weighting applied across binary cross entropy, ordinal severity, Dice/BCE segmentation, and L1 fovea distance."
          />
        </div>

        {/* Deep Architecture Breakdown Card */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-card p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Cpu className="w-5 h-5 text-primary" />
              <h3 className="text-base font-bold text-slate-900">
                Selected Final Multi-Task Architecture: RETFound
              </h3>
            </div>
            <span className="px-2.5 py-1 rounded text-xs font-mono bg-primary/10 text-primary border border-primary/20 font-semibold">
              PyTorch RETFound Backbone
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            The multi-task framework uses a two-stage training scheme. First, single-task classification establishes baseline performance. Next, the classification-tuned backbone is initialized for multi-task joint optimization. Task heads sit on pooled latent features, while segmentation decoders progressively upsample the terminal 2D token representation.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2 text-xs">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center gap-2 font-bold text-slate-800">
                <span className="w-2.5 h-2.5 rounded-full bg-primary" />
                <span>Classification & Severity Heads</span>
              </div>
              <p className="text-slate-500 leading-normal text-[11px]">
                Global average pooling across the output tokens yields a 1024-dimensional latent embedding. Linear projection heads with dropout compute binary PM logits and 5-class maculopathy softmax probabilities.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center gap-2 font-bold text-slate-800">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>Progressive Segmentation Decoders</span>
              </div>
              <p className="text-slate-500 leading-normal text-[11px]">
                A progressive upsampling decoder reconstructs pixel-level masks from the 28×28 token feature map for Optic Disc (HRF-Seg+), Lacquer Cracks (MMAC), and Fuchs Spots (MMAC).
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center gap-2 font-bold text-slate-800">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <span>Fovea Coordinate Regression Head</span>
              </div>
              <p className="text-slate-500 leading-normal text-[11px]">
                A 2-layer MLP with Sigmoid normalization outputs normalized (x, y) coordinates mapped onto the 448×448 space, trained with L1 Smooth loss (loss weight = 10.0).
              </p>
            </div>
          </div>
        </div>

        {/* Dataset Breakdown & Annotation Availability Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-card overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Database className="w-4 h-4 text-primary" />
                Cohort Harmonization & Annotation Availability
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Each task head is supervised only on images possessing verified ground truth. Missing labels are never imputed as negative controls.
              </p>
            </div>
            <span className="text-[11px] font-mono text-slate-500">4 External Cohorts</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/70 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4 font-bold">Dataset Cohort</th>
                  <th className="py-3 px-4">Research Role</th>
                  <th className="py-3 px-4 text-emerald-800">Available Supervised Annotations</th>
                  <th className="py-3 px-4 text-amber-800">Unavailable / Masked Labels</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {modelInfo.datasets.map((ds) => (
                  <tr key={ds.name} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {ds.name}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {ds.role}
                    </td>
                    <td className="py-3 px-4 text-emerald-700 font-medium">
                      {ds.annotations}
                    </td>
                    <td className="py-3 px-4 text-amber-700 text-[11px]">
                      {ds.unavailable}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Original vs Improved vs Benchmark Comparison */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-card overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <GitBranch className="w-4 h-4 text-primary" />
                Original vs Improved vs Benchmark Model Evaluation
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Tracking whether hyperparameter improvements match or exceed the selected benchmark (DenseNet-121).
              </p>
            </div>
            <span className="text-[11px] font-mono text-slate-500">original_vs_improved_vs_benchmark.csv</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-50/70 border-b border-slate-200 text-slate-500 uppercase text-[10px]">
                <tr>
                  <th className="py-2.5 px-4 font-sans">Model</th>
                  <th className="py-2.5 px-3">Improved Factor</th>
                  <th className="py-2.5 px-3">Original AUROC</th>
                  <th className="py-2.5 px-3 text-primary font-bold">Improved AUROC</th>
                  <th className="py-2.5 px-3">Benchmark AUROC</th>
                  <th className="py-2.5 px-3">Improved F1</th>
                  <th className="py-2.5 px-3 font-sans">Statistical Verdict</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {metrics.original_vs_improved.map((row: any) => (
                  <tr key={row.model} className="hover:bg-slate-50">
                    <td className="py-2.5 px-4 font-sans font-bold text-slate-900">{row.model}</td>
                    <td className="py-2.5 px-3 text-slate-600">{row.improved_from}</td>
                    <td className="py-2.5 px-3">{parseFloat(row.original_auroc).toFixed(4)}</td>
                    <td className="py-2.5 px-3 text-primary font-bold">{parseFloat(row.improved_auroc).toFixed(4)}</td>
                    <td className="py-2.5 px-3">{parseFloat(row.benchmark_auroc).toFixed(4)}</td>
                    <td className="py-2.5 px-3">{parseFloat(row.improved_f1).toFixed(4)}</td>
                    <td className="py-2.5 px-3 font-sans text-slate-600">{row.verdict}</td>
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
