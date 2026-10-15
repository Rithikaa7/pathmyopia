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
  Target,
  FileSpreadsheet,
  CheckCircle2,
  Info
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

  // Severity Distribution Data
  const severityDistribution = [
    { name: 'Category 0: No Lesions', count: metrics.test_summary.severity_counts['0'], color: '#10B981' },
    { name: 'Category 1: Tessellated', count: metrics.test_summary.severity_counts['1'], color: '#3B82F6' },
    { name: 'Category 2: Diffuse Atrophy', count: metrics.test_summary.severity_counts['2'], color: '#F59E0B' },
    { name: 'Category 3: Patchy Atrophy', count: metrics.test_summary.severity_counts['3'], color: '#EA580C' },
    { name: 'Category 4: Macular Atrophy', count: metrics.test_summary.severity_counts['4'], color: '#EF4444' },
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
      title="Research Analytics & Model Evaluation Workspace"
      subtitle="Exhaustive benchmark comparisons, multi-task training convergence, controlled ablation experiments, and task-specific quantitative metrics loaded directly from study artifacts."
    >
      <div className="space-y-6">
        {/* Top Summary Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            label="Selected Final Model"
            value="RETFound (ViT-L)"
            subtext="303.3M params • Best Ep: 3"
            badge="Final Multi-Task"
            badgeColor="teal"
            tooltip="Retinal foundation model pretrained with masked autoencoding on 1.6M fundus images and fine-tuned for multi-task PM analysis."
          />
          <MetricCard
            label="Multi-Task Test AUROC"
            value={`${(metrics.multitask_metrics.pm.auroc * 100).toFixed(2)}%`}
            subtext="Single-task ref: 99.62%"
            badge="Generalization"
            badgeColor="emerald"
            tooltip="Area under the ROC curve achieved on the harmonized test split."
          />
          <MetricCard
            label="Severity Agreement (QWK)"
            value={metrics.multitask_metrics.severity.qwk.toFixed(3)}
            subtext={`Accuracy: ${(metrics.multitask_metrics.severity.accuracy * 100).toFixed(1)}% (n=209)`}
            badge="Kappa"
            badgeColor="amber"
            tooltip="Quadratic Weighted Kappa penalizing severe clinical misclassifications across the 5 maculopathy grades."
          />
          <MetricCard
            label="Fovea Success @ 20px"
            value={`${(metrics.multitask_metrics.fovea.success_20px * 100).toFixed(1)}%`}
            subtext={`Median err: ${metrics.multitask_metrics.fovea.median_err_px.toFixed(1)} px (n=187)`}
            badge="Localization"
            badgeColor="blue"
            tooltip="Percentage of test eyes where predicted foveal center falls within a 20-pixel radius of the expert reference mark."
          />
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-2 border-b border-slate-200">
          <button
            onClick={() => setActiveTab('benchmarks')}
            className={`flex items-center gap-2 pb-3 px-3 text-xs font-semibold border-b-2 transition-all ${
              activeTab === 'benchmarks'
                ? 'border-primary text-primary'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Architecture Benchmarks (6 Models)</span>
          </button>
          <button
            onClick={() => setActiveTab('training')}
            className={`flex items-center gap-2 pb-3 px-3 text-xs font-semibold border-b-2 transition-all ${
              activeTab === 'training'
                ? 'border-primary text-primary'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Multi-Task Training Curves</span>
          </button>
          <button
            onClick={() => setActiveTab('multitask')}
            className={`flex items-center gap-2 pb-3 px-3 text-xs font-semibold border-b-2 transition-all ${
              activeTab === 'multitask'
                ? 'border-primary text-primary'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Task-Specific Metrics</span>
          </button>
          <button
            onClick={() => setActiveTab('ablations')}
            className={`flex items-center gap-2 pb-3 px-3 text-xs font-semibold border-b-2 transition-all ${
              activeTab === 'ablations'
                ? 'border-primary text-primary'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>Controlled Ablation Analysis</span>
          </button>
        </div>

        {/* TAB 1: ARCHITECTURE BENCHMARK */}
        {activeTab === 'benchmarks' && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-card space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Test Set AUROC & Sensitivity Across Evaluated Architectures
                  </h3>
                  <p className="text-xs text-slate-500">
                    Comparison across CNNs (ResNet-50, DenseNet-121, EfficientNet-B4) and Vision Transformers (ViT-B/16, Swin-Tiny, RETFound).
                  </p>
                </div>
                <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-slate-100 text-slate-600 border border-slate-200">
                  Data: baseline_table.csv
                </span>
              </div>

              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={benchmarkChartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="model" tick={{ fontSize: 11, fill: '#475569' }} />
                    <YAxis domain={[80, 100]} tick={{ fontSize: 11, fill: '#475569' }} />
                    <Tooltip
                      formatter={(val: any) => [`${val}%`, '']}
                      contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#CBD5E1', borderRadius: '8px', fontSize: '11px' }}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                    <Bar dataKey="testAUROC" name="Test AUROC (%)" fill="#0F9F9A" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="sensitivity" name="Sensitivity (%)" fill="#2B6CB0" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="specificity" name="Specificity (%)" fill="#94A3B8" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Baseline Table from CSV */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-card overflow-hidden">
              <div className="px-5 py-3.5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Quantitative Baseline Comparison Table
                </h4>
                <span className="text-[11px] text-slate-500">Benchmark Model: DenseNet-121</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-50/70 border-b border-slate-200 text-slate-500 uppercase text-[10px]">
                    <tr>
                      <th className="py-2.5 px-4 font-sans">Model Architecture</th>
                      <th className="py-2.5 px-3">Params (M)</th>
                      <th className="py-2.5 px-3">Best Ep</th>
                      <th className="py-2.5 px-3">Train Min</th>
                      <th className="py-2.5 px-3">Val AUROC</th>
                      <th className="py-2.5 px-3 text-primary font-bold">Test AUROC</th>
                      <th className="py-2.5 px-3">Test F1</th>
                      <th className="py-2.5 px-3">Sensitivity</th>
                      <th className="py-2.5 px-3">Specificity</th>
                      <th className="py-2.5 px-3">Test ECE</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {metrics.baseline_table.map((row: any) => (
                      <tr
                        key={row.model}
                        className={`hover:bg-slate-50 transition-colors ${
                          row.model === 'RETFound' ? 'bg-primary-light/30 font-semibold' : ''
                        }`}
                      >
                        <td className="py-2.5 px-4 font-sans font-bold text-slate-900 flex items-center gap-1.5">
                          {row.model === 'RETFound' && <span className="w-2 h-2 rounded-full bg-primary" />}
                          {row.model}
                        </td>
                        <td className="py-2.5 px-3">{row.params_M}</td>
                        <td className="py-2.5 px-3">{row.best_epoch}</td>
                        <td className="py-2.5 px-3">{row.minutes}</td>
                        <td className="py-2.5 px-3">{parseFloat(row.val_auroc).toFixed(4)}</td>
                        <td className="py-2.5 px-3 text-primary font-bold">{parseFloat(row.test_auroc).toFixed(4)}</td>
                        <td className="py-2.5 px-3">{parseFloat(row.test_f1).toFixed(4)}</td>
                        <td className="py-2.5 px-3">{parseFloat(row.test_sensitivity).toFixed(4)}</td>
                        <td className="py-2.5 px-3">{parseFloat(row.test_specificity).toFixed(4)}</td>
                        <td className="py-2.5 px-3">{parseFloat(row.test_ece).toFixed(4)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: TRAINING CURVES */}
        {activeTab === 'training' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Total Loss Convergence */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-card space-y-4">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Total Multi-Task Loss Convergence</h4>
                  <p className="text-xs text-slate-500">Train vs Validation loss across 7 epochs (best checkpoint: Epoch 3)</p>
                </div>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={historyChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                      <XAxis dataKey="epoch" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }} />
                      <Line type="monotone" dataKey="trainTotal" name="Train Total Loss" stroke="#0F9F9A" strokeWidth={2} dot={{ r: 3 }} />
                      <Line type="monotone" dataKey="valTotal" name="Val Total Loss" stroke="#EA580C" strokeWidth={2} strokeDasharray="4 4" dot={{ r: 3 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Task Head Loss Components */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-card space-y-4">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Individual Task Head Validation Losses</h4>
                  <p className="text-xs text-slate-500">Validation loss tracking for PM classification, Severity, and Segmentation</p>
                </div>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={historyChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                      <XAxis dataKey="epoch" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }} />
                      <Line type="monotone" dataKey="valPM" name="Val PM Loss" stroke="#2B6CB0" strokeWidth={2} dot={{ r: 3 }} />
                      <Line type="monotone" dataKey="valSev" name="Val Severity Loss" stroke="#8B5CF6" strokeWidth={2} dot={{ r: 3 }} />
                      <Line type="monotone" dataKey="valSeg" name="Val Segmentation Loss" stroke="#10B981" strokeWidth={2} dot={{ r: 3 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: TASK SPECIFIC EVALUATION */}
        {activeTab === 'multitask' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Severity Distribution */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-card space-y-3">
                <h4 className="text-sm font-bold text-slate-900">Severity Cohort Distribution (n=209)</h4>
                <div className="h-48 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={severityDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={45}
                        outerRadius={70}
                        dataKey="count"
                        paddingAngle={3}
                      >
                        {severityDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value} eyes`, 'Count']} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-1 text-xs">
                  {severityDistribution.map((d) => (
                    <div key={d.name} className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-slate-600">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                        {d.name}
                      </span>
                      <span className="font-mono font-bold text-slate-800">{d.count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Fovea Localization Accuracy */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-card space-y-4">
                <h4 className="text-sm font-bold text-slate-900">Fovea Localization Success Rate</h4>
                <p className="text-xs text-slate-500">Distance from true anatomical fovea center (n=187)</p>
                <div className="h-48 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={foveaThresholdData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                      <XAxis dataKey="threshold" tick={{ fontSize: 11 }} />
                      <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                      <Tooltip formatter={(v) => [`${v}%`, 'Success Rate']} />
                      <Bar dataKey="successRate" fill="#2B6CB0" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg text-xs font-mono text-slate-600 flex justify-between border border-slate-200">
                  <span>Median Pixel Error:</span>
                  <strong className="text-slate-900">{metrics.multitask_metrics.fovea.median_err_px.toFixed(2)} px</strong>
                </div>
              </div>

              {/* Structural Segmentation Dice */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-card space-y-4">
                <h4 className="text-sm font-bold text-slate-900">Segmentation Dice by Structure</h4>
                <p className="text-xs text-slate-500">Optic Disc, Fuchs spots, and Lacquer cracks</p>
                <div className="h-48 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={segDiceData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                      <XAxis dataKey="structure" tick={{ fontSize: 11 }} />
                      <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                      <Tooltip formatter={(v) => [`${v}%`, 'Dice Score']} />
                      <Bar dataKey="dice" fill="#0F9F9A" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg text-[11px] text-slate-600 leading-normal border border-slate-200">
                  <strong>Clinical note:</strong> Optic disc contours segment with near-perfect fidelity (Dice 1.000). Lacquer cracks are thin linear fractures with lower pixel overlap due to strict spatial width.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: CONTROLLED ABLATIONS */}
        {activeTab === 'ablations' && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-card overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Controlled Ablation Experiments: Head LR vs Pos-Weight Loss
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Assessing validation delta when isolating head learning rate multipliers (`head_lr_x10`) and positive class reweighting (`pos_weight`).
                </p>
              </div>
              <span className="text-[11px] font-mono text-slate-500">ablation_table.csv</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-50/70 border-b border-slate-200 text-slate-500 uppercase text-[10px]">
                  <tr>
                    <th className="py-2.5 px-4 font-sans">Model</th>
                    <th className="py-2.5 px-3">Experiment</th>
                    <th className="py-2.5 px-3">Factor</th>
                    <th className="py-2.5 px-3">Val AUROC</th>
                    <th className="py-2.5 px-3">Val AUPRC</th>
                    <th className="py-2.5 px-3 font-sans">Δ Val AUROC</th>
                    <th className="py-2.5 px-3 font-sans">Δ Val AUPRC</th>
                    <th className="py-2.5 px-3">Best Ep</th>
                    <th className="py-2.5 px-3">Train Min</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {metrics.ablation_table.map((row: any, i: number) => {
                    const deltaAuroc = parseFloat(row.delta_val_auroc || '0');
                    return (
                      <tr key={i} className="hover:bg-slate-50">
                        <td className="py-2.5 px-4 font-sans font-semibold text-slate-900">{row.model}</td>
                        <td className="py-2.5 px-3 text-slate-600">{row.experiment}</td>
                        <td className="py-2.5 px-3 text-slate-600">{row.factor}</td>
                        <td className="py-2.5 px-3">{parseFloat(row.val_auroc).toFixed(4)}</td>
                        <td className="py-2.5 px-3">{parseFloat(row.val_auprc).toFixed(4)}</td>
                        <td className={`py-2.5 px-3 font-semibold ${deltaAuroc >= 0 ? 'text-emerald-700' : 'text-red-600'}`}>
                          {deltaAuroc >= 0 ? `+${deltaAuroc.toFixed(4)}` : deltaAuroc.toFixed(4)}
                        </td>
                        <td className="py-2.5 px-3">{parseFloat(row.delta_val_auprc || '0').toFixed(4)}</td>
                        <td className="py-2.5 px-3">{row.best_epoch || '—'}</td>
                        <td className="py-2.5 px-3">{row.minutes || '—'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </PageContainer>
  );
};
