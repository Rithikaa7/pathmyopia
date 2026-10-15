import React, { useState } from 'react';
import {
  Settings,
  Radio,
  Sliders,
  Eye,
  FileText,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  HardDrive,
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
    if (window.confirm('Reset local analysis records to the initial authentic benchmark samples?')) {
      localStorage.setItem('pathmyo_analysis_records_v1', JSON.stringify(INITIAL_ANALYSES));
      window.location.reload();
    }
  };

  return (
    <PageContainer
      title="Settings & Workspace Configuration"
      subtitle="Configure inference backend endpoints, execution modes, viewer defaults, and local data persistence."
    >
      <div className="max-w-4xl space-y-6">
        {saveNotice && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs font-semibold text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Workspace settings updated and saved successfully.</span>
          </div>
        )}

        {/* 1. Inference Backend & Execution Mode */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-card p-6 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-bold text-slate-900">
                Inference Backend & Execution Mode
              </h3>
            </div>
            <span className={`px-2 py-0.5 rounded text-[11px] font-mono font-semibold ${
              mode === 'connected' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
            }`}>
              Active: {mode.toUpperCase()}
            </span>
          </div>

          <div className="space-y-4 text-xs">
            {/* Mode selection radio */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label
                className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                  mode === 'demo'
                    ? 'border-primary bg-primary-light/50 ring-1 ring-primary'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <input
                    type="radio"
                    name="appMode"
                    value="demo"
                    checked={mode === 'demo'}
                    onChange={() => setMode('demo')}
                    className="accent-primary"
                  />
                  <span className="font-bold text-slate-900">Demo & Exploration Mode</span>
                </div>
                <p className="text-[11px] text-slate-500 pl-5">
                  Operates client-side using saved authentic research predictions from the test set. Does not require a live GPU inference server.
                </p>
              </label>

              <label
                className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                  mode === 'connected'
                    ? 'border-primary bg-primary-light/50 ring-1 ring-primary'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <input
                    type="radio"
                    name="appMode"
                    value="connected"
                    checked={mode === 'connected'}
                    onChange={() => setMode('connected')}
                    className="accent-primary"
                  />
                  <span className="font-bold text-slate-900">Connected Backend Mode</span>
                </div>
                <p className="text-[11px] text-slate-500 pl-5">
                  Sends uploaded fundus photographs directly to the configured Python FastAPI/PyTorch inference server loaded with `best.pth`.
                </p>
              </label>
            </div>

            {/* Backend URL Input & Health Check */}
            <div className="space-y-2 pt-2">
              <label className="block font-semibold text-slate-700">
                Inference API Endpoint URL
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={backendUrl}
                  onChange={(e) => setBackendUrlState(e.target.value)}
                  placeholder="http://localhost:8000/api/v1"
                  className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-slate-800 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
                <button
                  type="button"
                  disabled={healthStatus.testing}
                  onClick={testConnection}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold text-xs transition-colors flex items-center gap-1.5 shrink-0"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${healthStatus.testing ? 'animate-spin' : ''}`} />
                  <span>Test Connection</span>
                </button>
              </div>

              {/* Health Test Result */}
              {healthStatus.result && (
                <div
                  className={`p-2.5 rounded-lg border text-[11px] font-medium flex items-center gap-2 ${
                    healthStatus.result.online
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-amber-50 text-amber-800 border-amber-200'
                  }`}
                >
                  {healthStatus.result.online ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  )}
                  <span>{healthStatus.result.message}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 2. Medical Image Viewer Preferences */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-card p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Eye className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-bold text-slate-900">
              Default Retinal Viewer Settings
            </h3>
          </div>

          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-semibold text-slate-800 block">Default Overlay Opacity</span>
                <span className="text-[11px] text-slate-500">Initial blending transparency for segmentation masks and Grad-CAM</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={defaultOpacity}
                  onChange={(e) => setDefaultOpacity(Number(e.target.value))}
                  className="w-24 accent-primary h-1.5 bg-slate-200 rounded cursor-pointer"
                />
                <span className="font-mono text-slate-700 w-8">{defaultOpacity}%</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="font-semibold text-slate-800 block">Auto-Show Fovea Crosshair</span>
                <span className="text-[11px] text-slate-500">Display white target crosshair over predicted fovea center</span>
              </div>
              <input
                type="checkbox"
                checked={defaultShowFovea}
                onChange={(e) => setDefaultShowFovea(e.target.checked)}
                className="rounded text-primary focus:ring-primary w-4 h-4"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="font-semibold text-slate-800 block">Auto-Enable Heatmap Overlay</span>
                <span className="text-[11px] text-slate-500">Render Grad-CAM activation heatmap by default when loading analysis</span>
              </div>
              <input
                type="checkbox"
                checked={defaultShowHeatmap}
                onChange={(e) => setDefaultShowHeatmap(e.target.checked)}
                className="rounded text-primary focus:ring-primary w-4 h-4"
              />
            </div>
          </div>
        </div>

        {/* 3. Data Privacy & Local Workspace */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-card p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <ShieldCheck className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-bold text-slate-900">
              Data Handling & Privacy Safeguards
            </h3>
          </div>

          <div className="text-xs text-slate-600 space-y-2 leading-relaxed">
            <p>
              PathMyo operates as a local research application. Retinal fundus photographs uploaded during analysis remain inside your browser session or are transmitted exclusively to your configured on-premises research inference server.
            </p>
            <p>
              No images or identifiers are uploaded to public cloud infrastructure, external advertising trackers, or unauthenticated third-party services.
            </p>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <div>
              <span className="font-semibold text-slate-800 text-xs block">Reset Workspace Records</span>
              <span className="text-[11px] text-slate-500">Restore default benchmark evaluation samples</span>
            </div>
            <button
              type="button"
              onClick={handleResetHistory}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 rounded-lg text-xs font-semibold transition-colors"
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
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-white text-xs font-bold hover:bg-primary-hover shadow-subtle transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save Preferences</span>
          </button>
        </div>
      </div>
    </PageContainer>
  );
};
