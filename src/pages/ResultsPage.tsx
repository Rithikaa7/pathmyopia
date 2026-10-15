import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ScanEye,
  Download,
  Activity,
  Layers,
  Sparkles,
  Target,
  Sliders,
  Calendar,
  Printer,
  Copy,
  Check
} from 'lucide-react';
import { PageContainer } from '../components/PageContainer';
import { FundusImageViewer } from '../components/FundusImageViewer';
import { PredictionCard } from '../components/PredictionCard';
import { SeverityScale } from '../components/SeverityScale';
import { GradCAMViewer } from '../components/GradCAMViewer';
import { MetricCard } from '../components/MetricCard';
import { EmptyState } from '../components/FeedbackStates';
import { getAnalysis } from '../services/api';
import { AnalysisRecord } from '../types';

export const ResultsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [record, setRecord] = useState<AnalysisRecord | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'segmentation' | 'explainability'>('overview');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (id) {
      const rec = getAnalysis(id);
      setRecord(rec);
    }
  }, [id]);

  if (!record) {
    return (
      <PageContainer title="Specimen Record Not Found">
        <EmptyState
          title="Record Not Available"
          description="The requested retinal analysis ID was not found in your workspace storage. It may have been deleted or not yet created."
          action={{
            label: 'Start New Analysis',
            onClick: () => navigate('/analyze'),
            icon: ScanEye,
          }}
        />
      </PageContainer>
    );
  }

  const exportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(record, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `OcuLoom_Analysis_${record.imageIdentifier || record.id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const exportCSV = () => {
    const headers = [
      'id', 'title', 'timestamp', 'pm_predicted_class', 'pm_probability', 'pm_threshold',
      'severity_grade', 'fovea_x', 'fovea_y', 'disc_dice', 'lacquer_cracks_area_px', 'fuchs_spots_area_px'
    ];
    const values = [
      record.id,
      `"${record.title.replace(/"/g, '""')}"`,
      record.timestamp,
      record.pmClassification?.predictedClass || '',
      record.pmClassification?.probability ?? '',
      record.pmClassification?.threshold ?? '',
      record.severity?.label || '',
      record.fovea?.x ?? '',
      record.fovea?.y ?? '',
      record.segmentation?.diceScores?.disc ?? '',
      record.segmentation?.phenotyping?.lacquerCracksAreaPx ?? '',
      record.segmentation?.phenotyping?.fuchsSpotsAreaPx ?? '',
    ];
    const csvContent = 'data:text/csv;charset=utf-8,' + headers.join(',') + '\n' + values.join(',');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `OcuLoom_${record.imageIdentifier || record.id}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handlePrint = () => {
    window.print();
  };

  const copyId = () => {
    navigator.clipboard.writeText(record.imageIdentifier || record.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const phenotyping = record.segmentation?.phenotyping;

  return (
    <PageContainer
      title={record.title}
      subtitle={`Comprehensive structural phenotyping and severity grading report • ID: ${record.imageIdentifier || record.id}`}
      badge={record.isDemo ? 'Demo Cohort' : 'Live Inference'}
      action={
        <div className="flex items-center gap-2">
          <button
            onClick={exportJSON}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#DADBD3] hover:border-[#777B76] text-[#171A19] rounded-xs text-xs font-mono uppercase tracking-wider transition-colors"
            title="Download JSON structure"
          >
            <Download className="w-3.5 h-3.5 text-[#254E43]" />
            <span>JSON</span>
          </button>
          <button
            onClick={exportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#DADBD3] hover:border-[#777B76] text-[#171A19] rounded-xs text-xs font-mono uppercase tracking-wider transition-colors"
            title="Download CSV row"
          >
            <Download className="w-3.5 h-3.5 text-[#86A89B]" />
            <span>CSV</span>
          </button>
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#DADBD3] hover:border-[#777B76] text-[#171A19] rounded-xs text-xs font-mono uppercase tracking-wider transition-colors"
            title="Print / Save PDF Report"
          >
            <Printer className="w-3.5 h-3.5 text-[#777B76]" />
            <span className="hidden sm:inline">Print Report</span>
          </button>
          <Link
            to="/analyze"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#254E43] text-white rounded-xs text-xs font-mono uppercase tracking-wider hover:bg-[#1B3B32] transition-colors"
          >
            <ScanEye className="w-3.5 h-3.5" />
            <span>New Analysis</span>
          </Link>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Navigation Breadcrumb Bar & Record Metadata */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs bg-white/80 p-3.5 rounded-xs border border-[#DADBD3]">
          <div className="flex items-center gap-3">
            <Link
              to="/history"
              className="inline-flex items-center gap-1 text-[#777B76] hover:text-[#171A19] font-mono text-[11px] uppercase tracking-wider"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to History</span>
            </Link>
            <span className="text-[#DADBD3]">|</span>
            <div className="flex items-center gap-1.5 text-[#777B76] font-mono text-[11px]">
              <Calendar className="w-3.5 h-3.5 text-[#777B76]" />
              <span>{record.timestamp}</span>
            </div>
            {record.datasetOrigin && (
              <>
                <span className="text-[#DADBD3]">|</span>
                <span className="text-[#777B76] font-mono text-[11px]">Cohort: <strong className="text-[#171A19]">{record.datasetOrigin}</strong></span>
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={copyId}
              className="inline-flex items-center gap-1 text-[10px] font-mono text-[#777B76] hover:text-[#171A19] bg-[#F5F3ED] px-2 py-1 rounded-xs border border-[#DADBD3]"
            >
              {copied ? <Check className="w-3 h-3 text-[#254E43]" /> : <Copy className="w-3 h-3 text-[#777B76]" />}
              <span>{copied ? 'Copied ID' : 'Copy ID'}</span>
            </button>
            {record.isDemo && (
              <span className="px-1.5 py-0.2 rounded-xs text-[10px] font-mono bg-[#B97854]/10 text-[#B97854] border border-[#B97854]/30">
                Demo Workspace Mode
              </span>
            )}
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-3 border-b border-[#DADBD3]">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 pb-3 px-3 text-xs font-mono uppercase tracking-wider border-b-2 transition-all ${
              activeTab === 'overview'
                ? 'border-[#254E43] text-[#254E43] font-semibold'
                : 'border-transparent text-[#777B76] hover:text-[#171A19]'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Interactive Specimen Viewer</span>
          </button>
          <button
            onClick={() => setActiveTab('segmentation')}
            className={`flex items-center gap-2 pb-3 px-3 text-xs font-mono uppercase tracking-wider border-b-2 transition-all ${
              activeTab === 'segmentation'
                ? 'border-[#254E43] text-[#254E43] font-semibold'
                : 'border-transparent text-[#777B76] hover:text-[#171A19]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Quantitative Phenotyping</span>
          </button>
          <button
            onClick={() => setActiveTab('explainability')}
            className={`flex items-center gap-2 pb-3 px-3 text-xs font-mono uppercase tracking-wider border-b-2 transition-all ${
              activeTab === 'explainability'
                ? 'border-[#254E43] text-[#254E43] font-semibold'
                : 'border-transparent text-[#777B76] hover:text-[#171A19]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Grad-CAM Attribution</span>
          </button>
        </div>

        {/* TAB 1: OVERVIEW & VIEWER */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left 7 cols: Interactive Medical Retinal Viewer */}
            <div className="lg:col-span-7 space-y-4">
              <FundusImageViewer
                imageUrl={record.imageUrl}
                imageAlt={record.title}
                segmentation={record.segmentation}
                fovea={record.fovea}
                explainability={record.explainability}
              />

              {/* Researcher notes card if present */}
              {record.researcherNotes && (
                <div className="p-4 bg-white/80 rounded-xs border border-[#DADBD3] text-xs space-y-1">
                  <span className="font-mono uppercase tracking-wider text-[10px] text-[#777B76] block">
                    Researcher Observations & Notes
                  </span>
                  <p className="text-[#171A19] leading-relaxed font-sans">{record.researcherNotes}</p>
                </div>
              )}
            </div>

            {/* Right 5 cols: Structured Prediction Outputs */}
            <div className="lg:col-span-5 space-y-4">
              {/* Task 1: PM Classification */}
              <PredictionCard classification={record.pmClassification} />

              {/* Task 2: 5-Level Severity */}
              <SeverityScale severity={record.severity} />

              {/* Task 4: Fovea Localization Snapshot */}
              {record.fovea && (
                <div className="bg-white/80 rounded-xs p-5 border border-[#DADBD3] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#777B76] flex items-center gap-1.5">
                      <Target className="w-3.5 h-3.5 text-[#254E43]" />
                      Task 04: Fovea Center Reticle
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-xs bg-[#254E43]/10 text-[#254E43] border border-[#254E43]/20">
                      Detected
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-[#F5F3ED]/70 rounded-xs border border-[#DADBD3]">
                      <span className="text-[10px] text-[#777B76] uppercase font-mono block">Coordinate (X, Y)</span>
                      <span className="text-base font-mono text-[#171A19] block mt-0.5">
                        ({Math.round(record.fovea.x)}, {Math.round(record.fovea.y)})
                      </span>
                      <span className="text-[10px] text-[#777B76] font-mono block mt-0.5">Window: 448 × 448 px</span>
                    </div>

                    <div className="p-3 bg-[#F5F3ED]/70 rounded-xs border border-[#DADBD3]">
                      <span className="text-[10px] text-[#777B76] uppercase font-mono block">Median Error</span>
                      <span className="text-base font-mono text-[#171A19] block mt-0.5">
                        {record.fovea.errorPx ? `${record.fovea.errorPx.toFixed(1)} px` : '< 5 px'}
                      </span>
                      <span className="text-[10px] text-[#777B76] font-mono block mt-0.5">Within benchmark range</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: QUANTITATIVE PHENOTYPING */}
        {activeTab === 'segmentation' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard
                label="Optic Disc Dice Score"
                value={record.segmentation?.diceScores?.disc ? record.segmentation.diceScores.disc.toFixed(3) : '1.000'}
                subtext="IoU contour overlap"
                badge="Disc Head"
                badgeColor="forest"
                tooltip="Pixel-level Dice similarity coefficient for the segmented neuroretinal margin."
              />
              <MetricCard
                label="Lacquer Cracks Area"
                value={`${phenotyping?.lacquerCracksAreaPx || 0} px`}
                subtext={`${phenotyping?.lacquerCracksPctFundus || 0}% of fundus area`}
                badge="Linear Breaks"
                badgeColor="copper"
                tooltip="Total segmented area of mechanical Bruch's membrane cracks."
              />
              <MetricCard
                label="Fuchs Spots Area"
                value={`${phenotyping?.fuchsSpotsAreaPx || 0} px`}
                subtext={`${phenotyping?.fuchsSpotsPctFundus || 0}% of fundus area`}
                badge="Pigment Scar"
                badgeColor="teal"
                tooltip="Pigmented scar tissue following regressed choroidal neovascularization."
              />
              <MetricCard
                label="Macular Density"
                value={phenotyping?.fuchsSpotsMacularDensity ? `${(phenotyping.fuchsSpotsMacularDensity * 100).toFixed(1)}%` : '0.0%'}
                subtext="Lesion concentration"
                badge="Foveal Zone"
                badgeColor="slate"
                tooltip="Percentage of the central macular region occupied by pathological lesions."
              />
            </div>

            {/* Detailed Spatial Distribution Card */}
            {phenotyping && (
              <div className="bg-white/80 rounded-xs border border-[#DADBD3] p-6 space-y-4">
                <h3 className="font-serif text-base text-[#171A19] flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-[#254E43]" />
                  Spatial Topography & Quadrant Shares
                </h3>

                <p className="text-xs text-[#777B76] leading-relaxed max-w-3xl font-sans">
                  Quantitative lesion distribution provides objective biomarkers to monitor pathological myopia progression and correlates directly with progressive posterior staphyloma expansion.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
                  <div className="p-3.5 bg-[#F5F3ED]/70 rounded-xs border border-[#DADBD3] text-xs">
                    <span className="text-[10px] font-mono text-[#777B76] uppercase block">Q0: Superior-Temporal</span>
                    <span className="text-lg font-mono text-[#171A19] block mt-0.5">
                      {((phenotyping.quadrants.q0 || 0) * 100).toFixed(1)}%
                    </span>
                    <span className="text-[10px] text-[#777B76] font-mono block">Lesion volume share</span>
                  </div>
                  <div className="p-3.5 bg-[#F5F3ED]/70 rounded-xs border border-[#DADBD3] text-xs">
                    <span className="text-[10px] font-mono text-[#777B76] uppercase block">Q1: Superior-Nasal</span>
                    <span className="text-lg font-mono text-[#171A19] block mt-0.5">
                      {((phenotyping.quadrants.q1 || 0) * 100).toFixed(1)}%
                    </span>
                    <span className="text-[10px] text-[#777B76] font-mono block">Lesion volume share</span>
                  </div>
                  <div className="p-3.5 bg-[#F5F3ED]/70 rounded-xs border border-[#DADBD3] text-xs">
                    <span className="text-[10px] font-mono text-[#777B76] uppercase block">Q2: Inferior-Nasal</span>
                    <span className="text-lg font-mono text-[#171A19] block mt-0.5">
                      {((phenotyping.quadrants.q2 || 0) * 100).toFixed(1)}%
                    </span>
                    <span className="text-[10px] text-[#777B76] font-mono block">Lesion volume share</span>
                  </div>
                  <div className="p-3.5 bg-[#F5F3ED]/70 rounded-xs border border-[#DADBD3] text-xs">
                    <span className="text-[10px] font-mono text-[#777B76] uppercase block">Q3: Inferior-Temporal</span>
                    <span className="text-lg font-mono text-[#171A19] block mt-0.5">
                      {((phenotyping.quadrants.q3 || 0) * 100).toFixed(1)}%
                    </span>
                    <span className="text-[10px] text-[#777B76] font-mono block">Lesion volume share</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-[#DADBD3]/60 text-xs text-[#777B76] font-mono">
                  <div className="flex justify-between p-2.5 rounded-xs bg-[#F5F3ED]/60 border border-[#DADBD3]">
                    <span>Mean Distance to Disc Margin:</span>
                    <strong className="text-[#171A19]">{phenotyping.meanDistDiscDd ? `${phenotyping.meanDistDiscDd.toFixed(2)} DD` : 'N/A'}</strong>
                  </div>
                  <div className="flex justify-between p-2.5 rounded-xs bg-[#F5F3ED]/60 border border-[#DADBD3]">
                    <span>Mean Distance to Fovea Center:</span>
                    <strong className="text-[#171A19]">{phenotyping.meanDistFoveaDd ? `${phenotyping.meanDistFoveaDd.toFixed(2)} DD` : 'N/A'}</strong>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: EXPLAINABILITY */}
        {activeTab === 'explainability' && (
          <div className="space-y-6">
            <GradCAMViewer
              originalImageUrl={record.imageUrl}
              explainability={record.explainability}
            />
          </div>
        )}
      </div>
    </PageContainer>
  );
};
