import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ScanEye,
  Activity,
  Layers,
  Cpu,
  History,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Target,
  FileText,
  Clock,
  HardDrive
} from 'lucide-react';
import { PageContainer } from '../components/PageContainer';
import { MetricCard } from '../components/MetricCard';
import { getAnalysisHistory, getModelInfo, getResearchMetrics, getAppMode } from '../services/api';
import { AnalysisRecord } from '../types';

export const DashboardPage: React.FC = () => {
  const [history, setHistory] = useState<AnalysisRecord[]>([]);
  const modelInfo = getModelInfo();
  const researchMetrics = getResearchMetrics();
  const appMode = getAppMode();

  useEffect(() => {
    setHistory(getAnalysisHistory());
  }, []);

  const totalAnalyzed = history.length;
  const pmPositive = history.filter((r) => r.pmClassification?.predictedClass === 'Pathological Myopia').length;
  const pmNegative = history.filter((r) => r.pmClassification?.predictedClass === 'Non-PM').length;
  const severeCases = history.filter((r) => r.severity && r.severity.level >= 3).length;

  return (
    <PageContainer
      title="Research Dashboard"
      subtitle="Overview of pathological myopia evaluation cohort, multi-task model status, and recent retinal image analyses."
      badge={appMode === 'connected' ? 'Connected Mode' : 'Demo Mode'}
      action={
        <Link
          to="/analyze"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary-hover shadow-subtle transition-all"
        >
          <ScanEye className="w-4 h-4" />
          <span>Analyze Fundus Image</span>
        </Link>
      }
    >
      <div className="space-y-6">
        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            label="Analyzed Images"
            value={totalAnalyzed}
            subtext="Local workspace records"
            icon={History}
            badge="Workspace"
            badgeColor="slate"
            tooltip="Number of retinal images currently evaluated and stored in this local research workspace."
          />
          <MetricCard
            label="PM Positive"
            value={pmPositive}
            subtext={`${totalAnalyzed > 0 ? ((pmPositive / totalAnalyzed) * 100).toFixed(0) : 0}% of workspace records`}
            icon={AlertTriangle}
            badge="P(PM) ≥ 0.50"
            badgeColor="amber"
            tooltip="Fundus images classified with high probability of Pathological Myopia."
          />
          <MetricCard
            label="Non-PM Controls"
            value={pmNegative}
            subtext={`${totalAnalyzed > 0 ? ((pmNegative / totalAnalyzed) * 100).toFixed(0) : 0}% of workspace records`}
            icon={CheckCircle2}
            badge="P(PM) < 0.50"
            badgeColor="emerald"
            tooltip="Images categorized as control or non-pathological fundus architecture."
          />
          <MetricCard
            label="Advanced Atrophy"
            value={severeCases}
            subtext="Category 3 & 4 Maculopathy"
            icon={Layers}
            badge="High Risk"
            badgeColor="teal"
            tooltip="Cases showing patchy or macular chorioretinal atrophy."
          />
        </div>

        {/* Real Benchmark & Multi-Task Model Performance Snapshot */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-card p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold text-primary uppercase tracking-wider">
                  Test Cohort Evaluation
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-100 text-slate-700 border border-slate-200">
                  473 Real Test Images
                </span>
              </div>
              <h3 className="text-sm font-bold text-slate-900 mt-0.5">
                Authentic Multi-Task RETFound Test Metrics
              </h3>
            </div>
            <Link
              to="/insights"
              className="text-xs text-primary hover:text-primary-hover font-semibold flex items-center gap-1 self-start sm:self-auto"
            >
              <span>View Full Research Insights</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">Test AUROC</span>
              <span className="text-lg font-bold font-mono text-slate-900">
                {(researchMetrics.multitask_metrics.pm.auroc * 100).toFixed(2)}%
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">AUPRC: {(researchMetrics.multitask_metrics.pm.auprc * 100).toFixed(1)}%</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">Sensitivity</span>
              <span className="text-lg font-bold font-mono text-slate-900">
                {(researchMetrics.multitask_metrics.pm.sensitivity * 100).toFixed(1)}%
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Recall on PM Cases</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">Specificity</span>
              <span className="text-lg font-bold font-mono text-slate-900">
                {(researchMetrics.multitask_metrics.pm.specificity * 100).toFixed(1)}%
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Control Specificity</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">Severity QWK</span>
              <span className="text-lg font-bold font-mono text-slate-900">
                {researchMetrics.multitask_metrics.severity.qwk.toFixed(3)}
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Accuracy: {(researchMetrics.multitask_metrics.severity.accuracy * 100).toFixed(1)}%</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">Disc Dice</span>
              <span className="text-lg font-bold font-mono text-slate-900">
                {researchMetrics.multitask_metrics.seg_disc.dice.toFixed(3)}
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">IoU: {researchMetrics.multitask_metrics.seg_disc.iou.toFixed(3)}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">Fovea Error</span>
              <span className="text-lg font-bold font-mono text-slate-900">
                {researchMetrics.multitask_metrics.fovea.median_err_px.toFixed(1)} px
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Median error</span>
            </div>
          </div>
        </div>

        {/* Model Status & Configured Heads */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Model Artifact Configuration */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-card p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-bold text-slate-900">
                  Model Artifacts & Inference Heads
                </h3>
              </div>
              <span className="px-2 py-0.5 text-[11px] font-mono rounded bg-primary/10 text-primary border border-primary/20">
                checkpoint: best.pth
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                <span className="text-[11px] font-semibold text-slate-500 uppercase">Architecture</span>
                <p className="font-bold text-slate-800">{modelInfo.modelName}</p>
                <p className="text-slate-500 text-[11px]">303.3 Million Parameters (Vision Transformer)</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                <span className="text-[11px] font-semibold text-slate-500 uppercase">Input Preprocessing</span>
                <p className="font-bold text-slate-800">448 × 448 px (Square CLAHE)</p>
                <p className="text-slate-500 text-[11px]">Circular mask on L* channel in CIELAB</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                <span className="text-[11px] font-semibold text-slate-500 uppercase">Trained Task Heads</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  <span className="px-1.5 py-0.5 rounded bg-white text-slate-700 border border-slate-200 text-[10px] font-mono">PM Class</span>
                  <span className="px-1.5 py-0.5 rounded bg-white text-slate-700 border border-slate-200 text-[10px] font-mono">Severity (5-Class)</span>
                  <span className="px-1.5 py-0.5 rounded bg-white text-slate-700 border border-slate-200 text-[10px] font-mono">Optic Disc</span>
                  <span className="px-1.5 py-0.5 rounded bg-white text-slate-700 border border-slate-200 text-[10px] font-mono">Lacquer Cracks</span>
                  <span className="px-1.5 py-0.5 rounded bg-white text-slate-700 border border-slate-200 text-[10px] font-mono">Fuchs Spots</span>
                  <span className="px-1.5 py-0.5 rounded bg-white text-slate-700 border border-slate-200 text-[10px] font-mono">Fovea (x, y)</span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                <span className="text-[11px] font-semibold text-slate-500 uppercase">Training Regime</span>
                <p className="font-bold text-slate-800">Epoch 3/15 (Best checkpoint saved)</p>
                <p className="text-slate-500 text-[11px]">Loss weights: PM 1.0, Sev 1.0, Seg 1.0, Fov 10.0</p>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <HardDrive className="w-3.5 h-3.5 text-slate-400" />
                Local weights path: <code className="font-mono text-slate-700">pm_results/pm_research/multitask/best.pth</code>
              </span>
              <Link to="/models" className="text-primary hover:underline font-medium">
                Detailed architecture specifications →
              </Link>
            </div>
          </div>

          {/* Right Col: Quick Actions & Launch */}
          <div className="bg-card rounded-xl border border-slate-200 shadow-card p-5 flex flex-col justify-between space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">
                Quick Action: New Analysis
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Test the complete multi-task inference pipeline by uploading your colour fundus photograph or choosing a benchmark preset.
              </p>
            </div>

            <div className="space-y-2">
              <Link
                to="/analyze"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-white text-xs font-bold hover:bg-primary-hover shadow-subtle transition-all"
              >
                <ScanEye className="w-4 h-4" />
                <span>Upload Fundus Photograph</span>
              </Link>
              <Link
                to="/explainability"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-semibold transition-all border border-slate-200"
              >
                <span>Explore Explainability Gallery</span>
              </Link>
            </div>

            <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg text-[11px] text-amber-900">
              <span className="font-semibold">Notice:</span> No inference predictions are fabricated. If backend server is not connected, demo samples are explicitly labeled.
            </div>
          </div>
        </div>

        {/* Recent Analyses Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-card overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Recent Image Analyses in Workspace
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Evaluation history saved in local browser storage.
              </p>
            </div>
            <Link
              to="/history"
              className="text-xs font-semibold text-primary hover:text-primary-hover flex items-center gap-1"
            >
              <span>View All History</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Fundus Preview</th>
                  <th className="py-3 px-4">Image ID / Title</th>
                  <th className="py-3 px-4">PM Probability</th>
                  <th className="py-3 px-4">Severity Grade</th>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {history.slice(0, 5).map((rec) => {
                  const isPM = rec.pmClassification?.predictedClass === 'Pathological Myopia';
                  return (
                    <tr key={rec.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-2.5 px-4">
                        <img
                          src={rec.thumbnailUrl || rec.imageUrl}
                          alt={rec.title}
                          className="w-10 h-10 rounded-md object-cover border border-slate-200"
                        />
                      </td>
                      <td className="py-2.5 px-4">
                        <div className="font-semibold text-slate-900">{rec.title}</div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          {rec.imageIdentifier || rec.id}
                        </div>
                      </td>
                      <td className="py-2.5 px-4">
                        {rec.pmClassification ? (
                          <div className="flex items-center gap-2">
                            <span
                              className={`w-2 h-2 rounded-full ${
                                isPM ? 'bg-red-500' : 'bg-emerald-500'
                              }`}
                            />
                            <span className="font-mono font-bold text-slate-800">
                              {(rec.pmClassification.probability * 100).toFixed(1)}%
                            </span>
                            <span className="text-[11px] text-slate-500">
                              ({isPM ? 'PM' : 'Non-PM'})
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">Not evaluated</span>
                        )}
                      </td>
                      <td className="py-2.5 px-4">
                        {rec.severity ? (
                          <span className="px-2 py-0.5 rounded font-mono text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                            {rec.severity.label}
                          </span>
                        ) : (
                          <span className="text-slate-400 italic">N/A</span>
                        )}
                      </td>
                      <td className="py-2.5 px-4 text-[11px] text-slate-500 font-mono">
                        {rec.timestamp}
                      </td>
                      <td className="py-2.5 px-4 text-right">
                        <Link
                          to={`/results/${rec.id}`}
                          className="inline-flex items-center gap-1 text-primary hover:text-primary-hover font-semibold hover:underline"
                        >
                          <span>Review</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};
