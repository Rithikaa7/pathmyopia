import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Menu,
  ScanEye,
  Settings,
  HelpCircle,
  Radio,
  CheckCircle,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import { getAppMode, setAppMode, AppMode } from '../services/api';

interface AppHeaderProps {
  onMenuClick: () => void;
  title?: string;
  subtitle?: string;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ onMenuClick, title, subtitle }) => {
  const location = useLocation();
  const [currentMode, setCurrentModeState] = useState<AppMode>(getAppMode());
  const [isModeModalOpen, setIsModeModalOpen] = useState(false);

  const toggleMode = (newMode: AppMode) => {
    setAppMode(newMode);
    setCurrentModeState(newMode);
    setIsModeModalOpen(false);
    window.location.reload(); // Refresh to ensure state updates consistently
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-slate-200 px-4 sm:px-6 py-3 transition-all">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile hamburger & Page Titles */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            className="p-2 -ml-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 lg:hidden focus:outline-none focus:ring-2 focus:ring-primary/20"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-semibold text-slate-900 tracking-tight">
                {title || 'Research Workspace'}
              </h1>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
                PALM • MMAC • HRF
              </span>
            </div>
            {subtitle && (
              <p className="text-xs text-slate-500 hidden sm:block truncate max-w-xl">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Right: Mode Badge & Quick Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mode Switcher Chip */}
          <button
            onClick={() => setIsModeModalOpen(true)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium border transition-colors ${
              currentMode === 'connected'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
            }`}
            title="Click to toggle between Demo Mode and Live Inference Backend"
          >
            <Radio className={`w-3.5 h-3.5 ${currentMode === 'connected' ? 'text-emerald-600 animate-pulse' : 'text-amber-600'}`} />
            <span className="hidden xs:inline">Mode:</span>
            <span className="font-semibold capitalize">{currentMode}</span>
          </button>

          {/* Quick Action: New Analysis */}
          {location.pathname !== '/analyze' && (
            <Link
              to="/analyze"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-primary text-white hover:bg-primary-hover shadow-subtle transition-all focus:ring-2 focus:ring-primary/30"
            >
              <ScanEye className="w-4 h-4" />
              <span className="hidden sm:inline">New Analysis</span>
            </Link>
          )}

          {/* Settings Link */}
          <Link
            to="/settings"
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            title="Workspace Preferences"
          >
            <Settings className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Mode Switch Modal */}
      {isModeModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setIsModeModalOpen(false)}
        >
          <div
            className="relative bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full p-6 space-y-4 my-auto max-h-[85vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Radio className="w-4 h-4 text-primary" />
                Select System Execution Mode
              </h3>
              <button
                type="button"
                onClick={() => setIsModeModalOpen(false)}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              PathMyo can operate in two distinct modes to support both presentation/review and live cloud PyTorch inference execution.
            </p>

            <div className="space-y-3 pt-1">
              {/* Option 1: Demo Mode */}
              <div
                onClick={() => toggleMode('demo')}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  currentMode === 'demo'
                    ? 'border-primary bg-primary-light/50 ring-2 ring-primary/30 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/50'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-slate-900 text-xs flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
                    <span>Demo & Offline Exploration Mode</span>
                  </span>
                  {currentMode === 'demo' && <CheckCircle className="w-4 h-4 text-primary shrink-0" />}
                </div>
                <p className="text-[11px] text-slate-500 leading-normal pl-4.5">
                  Loads authentic benchmark test predictions, Grad-CAM maps, and sample fundus photographs. Allows zero-backend testing of the entire user workflow.
                </p>
              </div>

              {/* Option 2: Connected Backend Mode */}
              <div
                onClick={() => toggleMode('connected')}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  currentMode === 'connected'
                    ? 'border-primary bg-primary-light/50 ring-2 ring-primary/30 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/50'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-slate-900 text-xs flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                    <span>Connected Backend Mode (Live API)</span>
                  </span>
                  {currentMode === 'connected' && <CheckCircle className="w-4 h-4 text-primary shrink-0" />}
                </div>
                <p className="text-[11px] text-slate-500 leading-normal pl-4.5">
                  Connects directly to your live cloud Render endpoint (<code className="font-mono text-slate-700 bg-slate-100 px-1 py-0.5 rounded">https://pathmyopia.onrender.com</code>) for real-time model inference.
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setIsModeModalOpen(false)}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
