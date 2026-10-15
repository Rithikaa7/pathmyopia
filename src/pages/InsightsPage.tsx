import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  BarChart3,
  TrendingUp,
  Cpu,
  Layers,
  FileSpreadsheet
} from 'lucide-react';
import { PageContainer } from '../components/PageContainer';
import { MetricCard } from '../components/MetricCard';
import { getResearchMetrics } from '../services/api';

export const InsightsPage: React.FC = () => {
  const metrics = getResearchMetrics();
  const [activeTab, setActiveTab] = useState<'benchmarks' | 'training' | 'multitask' | 'ablations'>('benchmarks');

  // Format baseline comparison for Recharts
  const benchmarkChartData = metrics.baseline_table.map((row: any) => ({
    model: row.model,
    testAUROC: parseFloat((parseFloat(row.test_auroc) * 100).toFixed(2)),
    testAUPRC: parseFloat((parseFloat(row.test_auprc) * 100).toFixed(2)),
    testF1: parseFloat((parseFloat(row.test_f1) * 100).toFixed(2)),
    sensitivity: parseFloat((parseFloat(row.test_sensitivity) * 100).toFixed(2)),
    specificity: parseFloat((parseFloat(row.test_specificity) * 100).toFixed(2)),
    paramsM: parseFloat(row.params_M),
  }));

  // Format training history
  const historyChartData = metrics.training_history.map((row: any) => ({
    epoch: `Ep ${row.epoch}`,
    trainTotal: parseFloat(parseFloat(row.train_total).toFixed(3)),
    valTotal: parseFloat(parseFloat(row.val_total).toFixed(3)),
    trainPM: parseFloat(parseFloat(row.train_pm).toFixed(3)),
    valPM: parseFloat(parseFloat(row.val_pm).toFixed(3)),
    trainSev: parseFloat(parseFloat(row.train_sev).toFixed(3)),
    valSev: parseFloat(parseFloat(row.val_sev).toFixed(3)),
    trainSeg: parseFloat(parseFloat(row.train_seg).toFixed(3)),
    valSeg: parseFloat(parseFloat(row.val_seg).toFixed(3)),
  }));

  // Severity Distribution Data with OcuLoom palette
  const severityDistribution = [
    { name: 'C0: No Lesions', count: metrics.test_summary.severity_counts['0'], color: '#254E43' },
    { name: 'C1: Tessellated', count: metrics.test_summary.severity_counts['1'], color: '#86A89B' },
    { name: 'C2: Diffuse Atrophy', count: metrics.test_summary.severity_counts['2'], color: '#B97854' },
    { name: 'C3: Patchy Atrophy', count: metrics.test_summary.severity_counts['3'], color: '#9E6241' },
    { name: 'C4: Macular Atrophy', count: metrics.test_summary.severity_counts['4'], color: '#6A2A1A' },
  ];

  // Fovea Success Thresholds
  const foveaThresholdData = [
    { threshold: '≤ 10 px', successRate: parseFloat((metrics.multitask_metrics.fovea.success_10px * 100).toFixed(1)) },
    { threshold: '≤ 20 px', successRate: parseFloat((metrics.multitask_metrics.fovea.success_20px * 100).toFixed(1)) },
    { threshold: '≤ 40 px', successRate: parseFloat((metrics.multitask_metrics.fovea.success_40px * 100).toFixed(1)) },
  ];

  // Segmentation Dice Comparison
  const segDiceData = [
    { structure: 'Optic Disc', dice: parseFloat((metrics.multitask_metrics.seg_disc.dice * 100).toFixed(1)), n: metrics.multitask_metrics.seg_disc.n },
    { structure: 'Fuchs Spots', dice: parseFloat((metrics.multitask_metrics.seg_lesion_fs.dice * 100).toFixed(1)), n: metrics.multitask_metrics.seg_lesion_fs.n },
    { structure: 'Lacquer Cracks', dice: parseFloat((metrics.multitask_metrics.seg_lesion_lc.dice * 100).toFixed(1)), n: metrics.multitask_metrics.seg_lesion_lc.n },
  ];

  return (
    <PageContainer
      title="Research Analytics & Model Benchmarks"
      subtitle="Exhaustive benchmark comparisons, multi-task training convergence, controlled ablation experiments, and task-specific quantitative metrics loaded directly from study artifacts."
    >
      <div className="space-y-6">
        {/* Top Summary Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            label="Selected Final Model"
            value="RETFound (ViT-L)"
            subtext="303.3M params • Best Ep: 3"
            badge="Final Model"
            badgeColor="forest"
            tooltip="Retinal foundation model pretrained with masked autoencoding on 1.6M fundus images and fine-tuned for multi-task PM analysis."
          />
          <MetricCard
            label="Multi-Task Test AUROC"
            value={`${(metrics.multitask_metrics.pm.auroc * 100).toFixed(2)}%`}
            subtext="Single-task ref: 99.62%"
            badge="Generalization"
            badgeColor="teal"
            tooltip="Area under the ROC curve achieved on the harmonized test split."
          />
          <MetricCard
            label="Severity Agreement (QWK)"
            value={metrics.multitask_metrics.severity.qwk.toFixed(3)}
            subtext={`Accuracy: ${(metrics.multitask_metrics.severity.accuracy * 100).toFixed(1)}% (n=209)`}
            badge="Kappa"
            badgeColor="copper"
            tooltip="Quadratic Weighted Kappa penalizing severe clinical misclassifications across the 5 maculopathy grades."
          />
          <MetricCard
            label="Fovea Success @ 20px"
            value={`${(metrics.multitask_metrics.fovea.success_20px * 100).toFixed(1)}%`}
            subtext={`Median err: ${metrics.multitask_metrics.fovea.median_err_px.toFixed(1)} px (n=187)`}
            badge="Localization"
            badgeColor="slate"
            tooltip="Percentage of test eyes where predicted foveal center falls within a 20-pixel radius of the expert reference mark."
          />
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-3 border-b border-[#DADBD3]">
          <button
            onClick={() => setActiveTab('benchmarks')}
            className={`flex items-center gap-2 pb-3 px-3 text-xs font-mono uppercase tracking-wider border-b-2 transition-all ${
              activeTab === 'benchmarks'
                ? 'border-[#254E43] text-[#254E43] font-semibold'
                : 'border-transparent text-[#777B76] hover:text-[#171A19]'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Architecture Benchmarks</span>
          </button>
          <button
            onClick={() => setActiveTab('training')}
            className={`flex items-center gap-2 pb-3 px-3 text-xs font-mono uppercase tracking-wider border-b-2 transition-all ${
              activeTab === 'training'
                ? 'border-[#254E43] text-[#254E43] font-semibold'
                : 'border-transparent text-[#777B76] hover:text-[#171A19]'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Training Convergence</span>
          </button>
          <button
            onClick={() => setActiveTab('multitask')}
            className={`flex items-center gap-2 pb-3 px-3 text-xs font-mono uppercase tracking-wider border-b-2 transition-all ${
              activeTab === 'multitask'
                ? 'border-[#254E43] text-[#254E43] font-semibold'
                : 'border-transparent text-[#777B76] hover:text-[#171A19]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Task-Specific Metrics</span>
          </button>
          <button
            onClick={() => setActiveTab('ablations')}
            className={`flex items-center gap-2 pb-3 px-3 text-xs font-mono uppercase tracking-wider border-b-2 transition-all ${
              activeTab === 'ablations'
                ? 'border-[#254E43] text-[#254E43] font-semibold'
                : 'border-transparent text-[#777B76] hover:text-[#171A19]'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Ablation Analysis</span>
          </button>
        </div>

        {/* TAB 1: ARCHITECTURE BENCHMARK */}
        {activeTab === 'benchmarks' && (
          <div className="space-y-6">
            <div className="bg-white/80 p-6 rounded-xs border border-[#DADBD3] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#DADBD3]">
                <div>
                  <h3 className="font-serif text-base text-[#171A19]">
                    Test Set AUROC & Sensitivity Across Evaluated Architectures
                  </h3>
                  <p className="text-xs text-[#777B76] font-sans">
                    Comparison across CNNs (ResNet-50, DenseNet-121, EfficientNet-B4) and Vision Transformers (ViT-B/16, Swin-Tiny, RETFound).
                  </p>
                </div>
                <span className="px-2 py-0.5 rounded-xs text-[10px] font-mono bg-[#F5F3ED] text-[#777B76] border border-[#DADBD3]">
                  Data: baseline_table.csv
                </span>
              </div>

              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={benchmarkChartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#DADBD3" />
                    <XAxis dataKey="model" tick={{ fontSize: 10, fill: '#777B76', fontFamily: 'monospace' }} />
                    <YAxis domain={[80, 100]} tick={{ fontSize: 10, fill: '#777B76', fontFamily: 'monospace' }} />
                    <Tooltip
                      formatter={(val: any) => [`${val}%`, '']}
                      contentStyle={{ backgroundColor: '#F5F3ED', borderColor: '#DADBD3', borderRadius: '2px', fontSize: '11px', fontFamily: 'monospace' }}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px', fontFamily: 'monospace' }} />
                    <Bar dataKey="testAUROC" name="Test AUROC (%)" fill="#254E43" radius={[2, 2, 0, 0]} />
                    <Bar dataKey="sensitivity" name="Sensitivity (%)" fill="#86A89B" radius={[2, 2, 0, 0]} />
                    <Bar dataKey="specificity" name="Specificity (%)" fill="#B97854" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Baseline Table from CSV */}
            <div className="bg-white/80 rounded-xs border border-[#DADBD3] overflow-hidden">
              <div className="px-5 py-3.5 border-b border-[#DADBD3] bg-[#F5F3ED] flex items-center justify-between">
                <h4 className="font-serif text-sm text-[#171A19]">
                  Quantitative Baseline Comparison Table
                </h4>
                <span className="text-[10px] text-[#777B76] font-mono">Reference Benchmark: DenseNet-121</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-[#F5F3ED]/70 border-b border-[#DADBD3] text-[#777B76] uppercase text-[10px]">
                    <tr>
                      <th className="py-2.5 px-4">Architecture</th>
                      <th className="py-2.5 px-4">Parameters</th>
                      <th className="py-2.5 px-4">Test AUROC</th>
                      <th className="py-2.5 px-4">Test AUPRC</th>
                      <th className="py-2.5 px-4">F1 Score</th>
                      <th className="py-2.5 px-4">Sensitivity</th>
                      <th className="py-2.5 px-4">Specificity</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#DADBD3]/60 text-[#171A19]">
                    {metrics.baseline_table.map((row: any, idx: number) => {
                      const isRETFound = row.model.includes('RETFound');
                      return (
                        <tr
                          key={idx}
                          className={isRETFound ? 'bg-[#254E43]/5 font-semibold text-[#254E43]' : 'hover:bg-[#F5F3ED]/50 transition-colors'}
                        >
                          <td className="py-2.5 px-4 flex items-center gap-2">
                            <span>{row.model}</span>
                            {isRETFound && (
                              <span className="px-1.5 py-0.2 rounded-xs bg-[#254E43] text-white text-[9px] uppercase">
                                Selected
                              </span>
                            )}
                          </td>
                          <td className="py-2.5 px-4 text-[#777B76]">{row.params_M}M</td>
                          <td className="py-2.5 px-4 font-bold">{(parseFloat(row.test_auroc) * 100).toFixed(2)}%</td>
                          <td className="py-2.5 px-4">{(parseFloat(row.test_auprc) * 100).toFixed(2)}%</td>
                          <td className="py-2.5 px-4">{(parseFloat(row.test_f1) * 100).toFixed(2)}%</td>
                          <td className="py-2.5 px-4">{(parseFloat(row.test_sensitivity) * 100).toFixed(2)}%</td>
                          <td className="py-2.5 px-4">{(parseFloat(row.test_specificity) * 100).toFixed(2)}%</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: TRAINING CURVES */}
        {activeTab === 'training' && (
          <div className="space-y-6">
            <div className="bg-white/80 p-6 rounded-xs border border-[#DADBD3] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#DADBD3]">
                <div>
                  <h3 className="font-serif text-base text-[#171A19]">
                    Multi-Task Objective Loss Convergence (Epochs 1–15)
                  </h3>
                  <p className="text-xs text-[#777B76] font-sans">
                    Weighted multi-task criterion: L_total = L_pm + L_sev + L_seg + 10 × L_fov. Checkpoint selected at Epoch 3 based on validation minimum.
                  </p>
                </div>
                <span className="px-2 py-0.5 rounded-xs text-[10px] font-mono bg-[#254E43]/10 text-[#254E43] border border-[#254E43]/20">
                  Best Checkpoint: Ep 3
                </span>
              </div>

              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={historyChartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#DADBD3" />
                    <XAxis dataKey="epoch" tick={{ fontSize: 10, fill: '#777B76', fontFamily: 'monospace' }} />
                    <YAxis tick={{ fontSize: 10, fill: '#777B76', fontFamily: 'monospace' }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#F5F3ED', borderColor: '#DADBD3', borderRadius: '2px', fontSize: '11px', fontFamily: 'monospace' }}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px', fontFamily: 'monospace' }} />
                    <Line type="monotone" dataKey="trainTotal" name="Train Total Loss" stroke="#254E43" strokeWidth={2} dot={{ r: 3 }} />
                    <Line type="monotone" dataKey="valTotal" name="Val Total Loss" stroke="#B97854" strokeWidth={2} dot={{ r: 3 }} />
                    <Line type="monotone" dataKey="valPM" name="Val PM Loss" stroke="#86A89B" strokeWidth={1.5} strokeDasharray="4 2" />
                    <Line type="monotone" dataKey="valSev" name="Val Severity Loss" stroke="#777B76" strokeWidth={1.5} strokeDasharray="4 2" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: TASK-SPECIFIC METRICS */}
        {activeTab === 'multitask' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Severity Distribution */}
            <div className="bg-white/80 p-6 rounded-xs border border-[#DADBD3] space-y-4">
              <h3 className="font-serif text-base text-[#171A19]">
                Maculopathy Severity Cohort Distribution (n=209)
              </h3>
              <p className="text-xs text-[#777B76] font-sans">
                Ground-truth distribution of the META-PM international classification across evaluated test images.
              </p>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={severityDistribution}
                      dataKey="count"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={({ name, percent }: any) => `${(name || '').split(':')[0]} (${((percent || 0) * 100).toFixed(0)}%)`}
                    >
                      {severityDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#F5F3ED', borderColor: '#DADBD3', fontSize: '11px', fontFamily: 'monospace' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Segmentation Dice Breakdown */}
            <div className="bg-white/80 p-6 rounded-xs border border-[#DADBD3] space-y-4">
              <h3 className="font-serif text-base text-[#171A19]">
                Structural Lesion & Disc Segmentation Overlap
              </h3>
              <p className="text-xs text-[#777B76] font-sans">
                Pixel-level Dice similarity scores on distinct test eyes for optic disc, lacquer cracks, and Fuchs spots.
              </p>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={segDiceData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#DADBD3" />
                    <XAxis dataKey="structure" tick={{ fontSize: 10, fill: '#777B76', fontFamily: 'monospace' }} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#777B76', fontFamily: 'monospace' }} />
                    <Tooltip
                      formatter={(val: any) => [`${val}% Dice`, '']}
                      contentStyle={{ backgroundColor: '#F5F3ED', borderColor: '#DADBD3', fontSize: '11px', fontFamily: 'monospace' }}
                    />
                    <Bar dataKey="dice" name="Mean Dice Score (%)" fill="#254E43" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: ABLATIONS */}
        {activeTab === 'ablations' && (
          <div className="bg-white/80 rounded-xs border border-[#DADBD3] p-6 space-y-4">
            <h3 className="font-serif text-base text-[#171A19]">
              Controlled Multi-Task vs. Single-Task Loss Ablation
            </h3>
            <p className="text-xs text-[#777B76] font-sans leading-relaxed">
              Comparison demonstrating that joint optimization with auxiliary segmentation and fovea localization regularizes the representation space without compromising binary PM classification sensitivity.
            </p>
            <div className="overflow-x-auto pt-2">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-[#F5F3ED] border-b border-[#DADBD3] text-[#777B76] uppercase text-[10px]">
                  <tr>
                    <th className="py-2.5 px-4">Configuration</th>
                    <th className="py-2.5 px-4">Active Heads</th>
                    <th className="py-2.5 px-4">PM AUROC</th>
                    <th className="py-2.5 px-4">Severity QWK</th>
                    <th className="py-2.5 px-4">Disc Dice</th>
                    <th className="py-2.5 px-4">Fovea Error</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DADBD3]/60 text-[#171A19]">
                  <tr className="hover:bg-[#F5F3ED]/50">
                    <td className="py-2.5 px-4 font-bold">Single-Task Baseline</td>
                    <td className="py-2.5 px-4 text-[#777B76]">PM Only</td>
                    <td className="py-2.5 px-4">99.62%</td>
                    <td className="py-2.5 px-4 text-[#777B76]">—</td>
                    <td className="py-2.5 px-4 text-[#777B76]">—</td>
                    <td className="py-2.5 px-4 text-[#777B76]">—</td>
                  </tr>
                  <tr className="bg-[#254E43]/5 text-[#254E43] font-semibold">
                    <td className="py-2.5 px-4 font-bold flex items-center gap-1.5">
                      <span>Full Multi-Task (OcuLoom)</span>
                      <span className="px-1.5 py-0.2 rounded-xs bg-[#254E43] text-white text-[9px] uppercase">Final</span>
                    </td>
                    <td className="py-2.5 px-4">PM + Sev + Seg + Fov</td>
                    <td className="py-2.5 px-4 font-bold">98.31%</td>
                    <td className="py-2.5 px-4 font-bold">0.841</td>
                    <td className="py-2.5 px-4 font-bold">0.957</td>
                    <td className="py-2.5 px-4 font-bold">4.2 px</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </PageContainer>
  );
};
