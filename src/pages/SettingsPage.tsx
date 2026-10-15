import React, { useState } from 'react';
import {
  Radio,
  Eye,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Trash2,
  Save
} from 'lucide-react';
import { PageContainer } from '../components/PageContainer';
import {
  getAppMode,
  setAppMode,
  getBackendUrl,
  setBackendUrl,
  checkBackendHealth,
  AppMode
} from '../services/api';
import { INITIAL_ANALYSES } from '../data/initialRecords';

export const SettingsPage: React.FC = () => {
  const [mode, setMode] = useState<AppMode>(getAppMode());
  const [backendUrl, setBackendUrlState] = useState<string>(getBackendUrl());
  const [healthStatus, setHealthStatus] = useState<{ testing: boolean; result?: { online: boolean; message: string } }>({
    testing: false,
  });

  // Image Viewer Defaults
  const [defaultOpacity, setDefaultOpacity] = useState(70);
  const [defaultShowFovea, setDefaultShowFovea] = useState(true);
  const [defaultShowHeatmap, setDefaultShowHeatmap] = useState(false);
  const [saveNotice, setSaveNotice] = useState(false);

  const handleSaveSettings = () => {
    setAppMode(mode);
    setBackendUrl(backendUrl);
    setSaveNotice(true);
    setTimeout(() => setSaveNotice(false), 3000);
  };

  const testConnection = async () => {
    setHealthStatus({ testing: true });
    setBackendUrl(backendUrl);
    const res = await checkBackendHealth();
    setHealthStatus({ testing: false, result: res });
  };

  const handleResetHistory = () => {
    if (window.confirm('Reset local analysis records to the initial authentic benchmark specimens?')) {
      localStorage.setItem('pathmyo_analysis_records_v1', JSON.stringify(INITIAL_ANALYSES));
      window.location.reload();
    }
  };

  return (
    <PageContainer
      title="Settings & Workspace Preferences"
      subtitle="Configure inference backend endpoints, execution modes, viewer defaults, and local data persistence."
    >
      <div className="max-w-4xl space-y-6">
        {saveNotice && (
          <div className="p-3 bg-[#254E43]/10 border border-[#254E43]/30 rounded-xs text-xs font-mono text-[#254E43] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#254E43]" />
            <span>Workspace preferences saved successfully.</span>
          </div>
        )}

        {/* 1. Inference Backend & Execution Mode */}
        <div className="bg-white/80 rounded-xs border border-[#DADBD3] p-6 space-y-5">
          <div className="flex items-center justify-between pb-3.5 border-b border-[#DADBD3]">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-[#254E43]" />
              <h3 className="font-serif text-base text-[#171A19]">
                Inference Backend & Execution Mode
              </h3>
            </div>
            <span className={`px-2 py-0.5 rounded-xs text-[10px] font-mono uppercase tracking-wider ${
              mode === 'connected' ? 'bg-[#254E43]/10 text-[#254E43] border border-[#254E43]/30' : 'bg-[#B97854]/10 text-[#B97854] border border-[#B97854]/30'
            }`}>
              Active: {mode.toUpperCase()}
            </span>
          </div>

          <div className="space-y-4 text-xs">
            {/* Mode selection radio */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label
                className={`p-4 rounded-xs border cursor-pointer transition-all ${
                  mode === 'demo'
                    ? 'border-[#254E43] bg-white ring-1 ring-[#254E43]'
                    : 'border-[#DADBD3] hover:border-[#777B76] bg-white/60'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <input
                    type="radio"
                    name="appMode"
                    value="demo"
                    checked={mode === 'demo'}
                    onChange={() => setMode('demo')}
                    className="accent-[#254E43]"
                  />
                  <span className="font-serif text-sm text-[#171A19]">Demo & Offline Exploration</span>
                </div>
                <p className="text-[11px] text-[#777B76] pl-5 font-sans leading-relaxed">
                  Operates client-side using authentic pre-computed benchmark predictions from the test set. Zero external server requirement.
                </p>
              </label>

              <label
                className={`p-4 rounded-xs border cursor-pointer transition-all ${
                  mode === 'connected'
                    ? 'border-[#254E43] bg-white ring-1 ring-[#254E43]'
                    : 'border-[#DADBD3] hover:border-[#777B76] bg-white/60'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <input
                    type="radio"
                    name="appMode"
                    value="connected"
                    checked={mode === 'connected'}
                    onChange={() => setMode('connected')}
                    className="accent-[#254E43]"
                  />
                  <span className="font-serif text-sm text-[#171A19]">Connected Cloud Backend</span>
                </div>
                <p className="text-[11px] text-[#777B76] pl-5 font-sans leading-relaxed">
                  Transmits uploaded fundus photographs directly to the live cloud inference server (<code className="font-mono text-[#171A19]">https://pathmyopia.onrender.com</code>).
                </p>
              </label>
            </div>

            {/* Backend URL Input & Health Check */}
            <div className="space-y-2 pt-2">
              <label className="block font-mono text-[10px] uppercase tracking-wider text-[#777B76]">
                Inference API Endpoint URL
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={backendUrl}
                  onChange={(e) => setBackendUrlState(e.target.value)}
                  placeholder="https://pathmyopia.onrender.com"
                  className="flex-1 px-3 py-2 border border-[#DADBD3] rounded-xs bg-white text-[#171A19] font-mono text-xs focus:outline-none focus:border-[#254E43]"
                />
                <button
                  type="button"
                  disabled={healthStatus.testing}
                  onClick={testConnection}
                  className="px-4 py-2 bg-[#F5F3ED] hover:bg-[#EAE8E0] text-[#171A19] border border-[#DADBD3] rounded-xs font-mono text-xs uppercase tracking-wider transition-colors flex items-center gap-1.5 shrink-0"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${healthStatus.testing ? 'animate-spin' : ''}`} />
                  <span>Test Connection</span>
                </button>
              </div>

              {/* Health Test Result */}
              {healthStatus.result && (
                <div
                  className={`p-3 rounded-xs border text-[11px] font-mono flex items-center gap-2 ${
                    healthStatus.result.online
                      ? 'bg-[#254E43]/10 text-[#254E43] border-[#254E43]/30'
                      : 'bg-[#B97854]/10 text-[#B97854] border-[#B97854]/30'
                  }`}
                >
                  {healthStatus.result.online ? (
                    <CheckCircle2 className="w-4 h-4 text-[#254E43] shrink-0" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-[#B97854] shrink-0" />
                  )}
                  <span>{healthStatus.result.message}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 2. Medical Image Viewer Preferences */}
        <div className="bg-white/80 rounded-xs border border-[#DADBD3] p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3.5 border-b border-[#DADBD3]">
            <Eye className="w-4 h-4 text-[#254E43]" />
            <h3 className="font-serif text-base text-[#171A19]">
              Default Specimen Viewer Settings
            </h3>
          </div>

          <div className="space-y-4 text-xs font-sans">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-medium text-[#171A19] block">Default Overlay Opacity</span>
                <span className="text-[11px] text-[#777B76]">Initial blending transparency for segmentation contours and Grad-CAM</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={defaultOpacity}
                  onChange={(e) => setDefaultOpacity(Number(e.target.value))}
                  className="w-24 accent-[#254E43] h-1 bg-[#DADBD3] rounded-xs cursor-pointer"
                />
                <span className="font-mono text-[10px] text-[#171A19] w-8">{defaultOpacity}%</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="font-medium text-[#171A19] block">Auto-Show Fovea Reticle</span>
                <span className="text-[11px] text-[#777B76]">Display target crosshair over predicted fovea center</span>
              </div>
              <input
                type="checkbox"
                checked={defaultShowFovea}
                onChange={(e) => setDefaultShowFovea(e.target.checked)}
                className="rounded-xs text-[#254E43] focus:ring-[#254E43] w-3.5 h-3.5"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="font-medium text-[#171A19] block">Auto-Enable Heatmap Overlay</span>
                <span className="text-[11px] text-[#777B76]">Render Grad-CAM activation heatmap by default when loading analysis</span>
              </div>
              <input
                type="checkbox"
                checked={defaultShowHeatmap}
                onChange={(e) => setDefaultShowHeatmap(e.target.checked)}
                className="rounded-xs text-[#254E43] focus:ring-[#254E43] w-3.5 h-3.5"
              />
            </div>
          </div>
        </div>

        {/* 3. Data Privacy & Local Workspace */}
        <div className="bg-white/80 rounded-xs border border-[#DADBD3] p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3.5 border-b border-[#DADBD3]">
            <ShieldCheck className="w-4 h-4 text-[#254E43]" />
            <h3 className="font-serif text-base text-[#171A19]">
              Data Handling & Privacy Safeguards
            </h3>
          </div>

          <div className="text-xs text-[#777B76] space-y-2 leading-relaxed font-sans">
            <p>
              OcuLoom operates as a privacy-preserving research application. Retinal fundus photographs uploaded during analysis remain inside your browser session or are transmitted exclusively to your configured research inference endpoint.
            </p>
            <p>
              No images or identifiers are uploaded to public advertising trackers or unauthenticated third-party services.
            </p>
          </div>

          <div className="pt-3 border-t border-[#DADBD3]/60 flex items-center justify-between">
            <div>
              <span className="font-medium text-[#171A19] text-xs block">Reset Workspace Records</span>
              <span className="text-[11px] text-[#777B76]">Restore default benchmark evaluation specimens</span>
            </div>
            <button
              type="button"
              onClick={handleResetHistory}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#B97854]/10 text-[#B97854] hover:bg-[#B97854]/20 border border-[#B97854]/30 rounded-xs text-xs font-mono uppercase tracking-wider transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Reset Records</span>
            </button>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={handleSaveSettings}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xs bg-[#254E43] text-white text-xs font-mono uppercase tracking-wider hover:bg-[#1B3B32] transition-colors"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Preferences</span>
          </button>
        </div>
      </div>
    </PageContainer>
  );
};
