import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ScanEye,
  Layers,
  Cpu,
  History,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  HardDrive,
  Compass,
  FileText
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
      subtitle="Evaluation cohort overview, multi-task deep learning checkpoint telemetry, and local specimen records."
      badge={appMode === 'connected' ? 'Cloud Live API' : 'Demo Cohort'}
      action={
        <Link
          to="/analyze"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xs bg-[#254E43] text-white text-xs font-medium hover:bg-[#1B3B32] transition-colors"
        >
          <ScanEye className="w-3.5 h-3.5" />
          <span>Analyze Fundus Photograph</span>
        </Link>
      }
    >
      <div className="space-y-6">
        {/* Top Metric Cards in Editorial Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            label="Specimen Cohort"
            value={totalAnalyzed}
            subtext="Local workspace records indexed"
            icon={History}
            badge="Workspace"
            badgeColor="slate"
            tooltip="Number of retinal images currently evaluated and stored in this local research workspace."
          />
          <MetricCard
            label="PM Positive"
            value={pmPositive}
            subtext={`${totalAnalyzed > 0 ? ((pmPositive / totalAnalyzed) * 100).toFixed(0) : 0}% of evaluated cohort`}
            icon={AlertTriangle}
            badge="P(PM) ≥ 0.50"
            badgeColor="copper"
            tooltip="Fundus images classified with high probability of Pathological Myopia."
          />
          <MetricCard
            label="Non-PM Controls"
            value={pmNegative}
            subtext={`${totalAnalyzed > 0 ? ((pmNegative / totalAnalyzed) * 100).toFixed(0) : 0}% of evaluated cohort`}
            icon={CheckCircle2}
            badge="P(PM) < 0.50"
            badgeColor="forest"
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
        <div className="bg-white/80 rounded-xs border border-[#DADBD3] p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#DADBD3]">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#254E43] font-semibold">
                  Test Cohort Benchmark
                </span>
                <span className="px-1.5 py-0.2 rounded-xs text-[10px] font-mono bg-[#F5F3ED] text-[#171A19] border border-[#DADBD3]">
                  473 Real Test Images
                </span>
              </div>
              <h3 className="font-serif text-lg text-[#171A19]">
                Authentic Multi-Task RETFound Evaluation Metrics
              </h3>
            </div>
            <Link
              to="/insights"
              className="text-xs text-[#254E43] hover:text-[#1B3B32] font-mono uppercase tracking-wider flex items-center gap-1.5 self-start sm:self-auto"
            >
              <span>Full Benchmark Insights</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="p-3.5 bg-[#F5F3ED]/70 rounded-xs border border-[#DADBD3]">
              <span className="text-[10px] text-[#777B76] uppercase font-mono block">Test AUROC</span>
              <span className="text-xl font-mono text-[#171A19] block mt-0.5">
                {(researchMetrics.multitask_metrics.pm.auroc * 100).toFixed(2)}%
              </span>
              <span className="text-[10px] text-[#777B76] font-mono block mt-1">AUPRC: {(researchMetrics.multitask_metrics.pm.auprc * 100).toFixed(1)}%</span>
            </div>
            <div className="p-3.5 bg-[#F5F3ED]/70 rounded-xs border border-[#DADBD3]">
              <span className="text-[10px] text-[#777B76] uppercase font-mono block">Sensitivity</span>
              <span className="text-xl font-mono text-[#171A19] block mt-0.5">
                {(researchMetrics.multitask_metrics.pm.sensitivity * 100).toFixed(1)}%
              </span>
              <span className="text-[10px] text-[#777B76] font-mono block mt-1">Recall on PM</span>
            </div>
            <div className="p-3.5 bg-[#F5F3ED]/70 rounded-xs border border-[#DADBD3]">
              <span className="text-[10px] text-[#777B76] uppercase font-mono block">Specificity</span>
              <span className="text-xl font-mono text-[#171A19] block mt-0.5">
                {(researchMetrics.multitask_metrics.pm.specificity * 100).toFixed(1)}%
              </span>
              <span className="text-[10px] text-[#777B76] font-mono block mt-1">Control specificity</span>
            </div>
            <div className="p-3.5 bg-[#F5F3ED]/70 rounded-xs border border-[#DADBD3]">
              <span className="text-[10px] text-[#777B76] uppercase font-mono block">Severity QWK</span>
              <span className="text-xl font-mono text-[#171A19] block mt-0.5">
                {researchMetrics.multitask_metrics.severity.qwk.toFixed(3)}
              </span>
              <span className="text-[10px] text-[#777B76] font-mono block mt-1">Acc: {(researchMetrics.multitask_metrics.severity.accuracy * 100).toFixed(1)}%</span>
            </div>
            <div className="p-3.5 bg-[#F5F3ED]/70 rounded-xs border border-[#DADBD3]">
              <span className="text-[10px] text-[#777B76] uppercase font-mono block">Disc Dice</span>
              <span className="text-xl font-mono text-[#171A19] block mt-0.5">
                {researchMetrics.multitask_metrics.seg_disc.dice.toFixed(3)}
              </span>
              <span className="text-[10px] text-[#777B76] font-mono block mt-1">IoU: {researchMetrics.multitask_metrics.seg_disc.iou.toFixed(3)}</span>
            </div>
            <div className="p-3.5 bg-[#F5F3ED]/70 rounded-xs border border-[#DADBD3]">
              <span className="text-[10px] text-[#777B76] uppercase font-mono block">Fovea Error</span>
              <span className="text-xl font-mono text-[#171A19] block mt-0.5">
                {researchMetrics.multitask_metrics.fovea.median_err_px.toFixed(1)} px
              </span>
              <span className="text-[10px] text-[#777B76] font-mono block mt-1">Median deviation</span>
            </div>
          </div>
        </div>

        {/* Model Status & Configured Heads */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Model Artifact Configuration */}
          <div className="lg:col-span-2 bg-white/80 rounded-xs border border-[#DADBD3] p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#DADBD3]">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-[#254E43]" />
                <h3 className="font-serif text-base text-[#171A19]">
                  Model Architecture & Multi-Task Heads
                </h3>
              </div>
              <span className="px-2 py-0.5 text-[10px] font-mono rounded-xs bg-[#254E43]/10 text-[#254E43] border border-[#254E43]/20">
                checkpoint: best.pth
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 bg-[#F5F3ED]/60 rounded-xs border border-[#DADBD3] space-y-1">
                <span className="text-[10px] font-mono uppercase text-[#777B76] tracking-wider">Backbone</span>
                <p className="font-serif text-sm text-[#171A19]">{modelInfo.modelName}</p>
                <p className="text-[#777B76] text-[11px] font-mono">303.3M Parameters (ViT-Large/16)</p>
              </div>

              <div className="p-3.5 bg-[#F5F3ED]/60 rounded-xs border border-[#DADBD3] space-y-1">
                <span className="text-[10px] font-mono uppercase text-[#777B76] tracking-wider">Input Normalization</span>
                <p className="font-serif text-sm text-[#171A19]">448 × 448 px (Square CLAHE)</p>
                <p className="text-[#777B76] text-[11px] font-mono">Retinal mask on L* channel in CIELAB</p>
              </div>

              <div className="p-3.5 bg-[#F5F3ED]/60 rounded-xs border border-[#DADBD3] space-y-1">
                <span className="text-[10px] font-mono uppercase text-[#777B76] tracking-wider">Trained Output Heads</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  <span className="px-1.5 py-0.2 rounded-xs bg-white text-[#171A19] border border-[#DADBD3] text-[10px] font-mono">PM Class</span>
                  <span className="px-1.5 py-0.2 rounded-xs bg-white text-[#171A19] border border-[#DADBD3] text-[10px] font-mono">5-Level Severity</span>
                  <span className="px-1.5 py-0.2 rounded-xs bg-white text-[#171A19] border border-[#DADBD3] text-[10px] font-mono">Optic Disc</span>
                  <span className="px-1.5 py-0.2 rounded-xs bg-white text-[#171A19] border border-[#DADBD3] text-[10px] font-mono">Lacquer Cracks</span>
                  <span className="px-1.5 py-0.2 rounded-xs bg-white text-[#171A19] border border-[#DADBD3] text-[10px] font-mono">Fuchs Spots</span>
                  <span className="px-1.5 py-0.2 rounded-xs bg-white text-[#171A19] border border-[#DADBD3] text-[10px] font-mono">Fovea (x, y)</span>
                </div>
              </div>

              <div className="p-3.5 bg-[#F5F3ED]/60 rounded-xs border border-[#DADBD3] space-y-1">
                <span className="text-[10px] font-mono uppercase text-[#777B76] tracking-wider">Loss Formulation</span>
                <p className="font-serif text-sm text-[#171A19]">Multi-Objective Weighted Criterion</p>
                <p className="text-[#777B76] text-[11px] font-mono">L_PM: 1.0, L_Sev: 1.0, L_Seg: 1.0, L_Fov: 10.0</p>
              </div>
            </div>

            <div className="pt-3 border-t border-[#DADBD3]/60 flex items-center justify-between text-xs text-[#777B76]">
              <span className="flex items-center gap-1.5 font-mono text-[11px]">
                <HardDrive className="w-3.5 h-3.5 text-[#777B76]" />
                Weights: <code className="text-[#171A19]">pm_results/pm_research/multitask/best.pth</code>
              </span>
              <Link to="/models" className="text-[#254E43] hover:underline font-mono text-[11px] uppercase tracking-wider">
                Model specifications →
              </Link>
            </div>
          </div>

          {/* Right Col: Quick Actions & Launch */}
          <div className="bg-[#17231F] text-[#DADBD3] rounded-xs border border-[#2A3632] p-6 flex flex-col justify-between space-y-5">
            <div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-[#86A89B] mb-1">
                Quick Inference
              </div>
              <h3 className="font-serif text-lg text-white mb-2">
                Evaluate Retinal Specimen
              </h3>
              <p className="text-xs text-[#DADBD3]/80 leading-relaxed font-sans">
                Execute multi-task inference across classification, 5-level maculopathy grading, structural lesion contours, and Grad-CAM visual attribution.
              </p>
            </div>

            <div className="space-y-2.5">
              <Link
                to="/analyze"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xs bg-[#254E43] text-white text-xs font-mono uppercase tracking-wider hover:bg-[#1B3B32] transition-colors"
              >
                <ScanEye className="w-3.5 h-3.5" />
                <span>Upload Photograph</span>
              </Link>
              <Link
                to="/explainability"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xs bg-[#202E29] text-[#DADBD3] hover:text-white text-xs font-mono uppercase tracking-wider transition-colors border border-[#2A3632]"
              >
                <span>Explainability Explorer</span>
              </Link>
            </div>

            <div className="p-3 bg-[#101815] border border-[#2A3632] rounded-xs text-[10px] font-mono text-[#777B76]">
              <span className="text-[#86A89B] font-semibold">Honest Research Protocol:</span> Real model outputs only; zero fabricated diagnoses.
            </div>
          </div>
        </div>

        {/* Recent Analyses Specimen Registry Table */}
        <div className="bg-white/80 rounded-xs border border-[#DADBD3] overflow-hidden">
          <div className="p-5 border-b border-[#DADBD3] flex items-center justify-between">
            <div>
              <h3 className="font-serif text-base text-[#171A19]">
                Recent Specimen Records in Workspace
              </h3>
              <p className="text-xs text-[#777B76] font-sans mt-0.5">
                Evaluation history indexed in browser storage.
              </p>
            </div>
            <Link
              to="/history"
              className="text-xs font-mono uppercase tracking-wider text-[#254E43] hover:text-[#1B3B32] flex items-center gap-1"
            >
              <span>View All History</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F5F3ED] border-b border-[#DADBD3] text-[#777B76] font-mono uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Specimen Preview</th>
                  <th className="py-3 px-4">Identifier / Cohort</th>
                  <th className="py-3 px-4">PM Probability</th>
                  <th className="py-3 px-4">Severity Grade</th>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DADBD3]/60 text-[#171A19]">
                {history.slice(0, 5).map((rec) => {
                  const isPM = rec.pmClassification?.predictedClass === 'Pathological Myopia';
                  return (
                    <tr key={rec.id} className="hover:bg-[#F5F3ED]/50 transition-colors">
                      <td className="py-2.5 px-4">
                        <img
                          src={rec.thumbnailUrl || rec.imageUrl}
                          alt={rec.title}
                          className="w-10 h-10 rounded-xs object-cover border border-[#DADBD3]"
                        />
                      </td>
                      <td className="py-2.5 px-4">
                        <div className="font-medium text-[#171A19]">{rec.title}</div>
                        <div className="text-[10px] text-[#777B76] font-mono">
                          {rec.imageIdentifier || rec.id}
                        </div>
                      </td>
                      <td className="py-2.5 px-4">
                        {rec.pmClassification ? (
                          <div className="flex items-center gap-2">
                            <span
                              className={`w-2 h-2 rounded-full ${
                                isPM ? 'bg-[#B97854]' : 'bg-[#254E43]'
                              }`}
                            />
                            <span className="font-mono text-[#171A19]">
                              {(rec.pmClassification.probability * 100).toFixed(1)}%
                            </span>
                            <span className="text-[10px] text-[#777B76] font-mono">
                              ({isPM ? 'PM' : 'Non-PM'})
                            </span>
                          </div>
                        ) : (
                          <span className="text-[#777B76] italic font-mono text-[10px]">Not evaluated</span>
                        )}
                      </td>
                      <td className="py-2.5 px-4">
                        {rec.severity ? (
                          <span className="px-1.5 py-0.2 rounded-xs font-mono text-[10px] bg-[#F5F3ED] text-[#171A19] border border-[#DADBD3]">
                            {rec.severity.label}
                          </span>
                        ) : (
                          <span className="text-[#777B76] font-mono text-[10px]">N/A</span>
                        )}
                      </td>
                      <td className="py-2.5 px-4 text-[10px] text-[#777B76] font-mono">
                        {rec.timestamp}
                      </td>
                      <td className="py-2.5 px-4 text-right">
                        <Link
                          to={`/results/${rec.id}`}
                          className="inline-flex items-center gap-1 text-[#254E43] hover:underline font-mono text-[11px] uppercase tracking-wider"
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
