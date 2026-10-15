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
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-card border border-slate-200 max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-semibold text-slate-900 text-sm flex items-center gap-2">
                <Radio className="w-4 h-4 text-primary" />
                Select System Execution Mode
              </h3>
              <button
                onClick={() => setIsModeModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-semibold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              PathMyo can operate in two distinct modes to support both presentation/review and live PyTorch inference execution.
            </p>

            <div className="space-y-3">
              <div
                onClick={() => toggleMode('demo')}
                className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                  currentMode === 'demo'
                    ? 'border-primary bg-primary-light/50 ring-1 ring-primary'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-slate-900 text-xs flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    Demo & Offline Exploration Mode (Active Default)
                  </span>
                  {currentMode === 'demo' && <CheckCircle className="w-4 h-4 text-primary" />}
                </div>
                <p className="text-[11px] text-slate-500 leading-normal">
                  Loads authentic benchmark test predictions, Grad-CAM maps, and sample fundus photographs. Allows zero-backend testing of the entire user workflow.
                </p>
              </div>

              <div
                onClick={() => toggleMode('connected')}
                className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                  currentMode === 'connected'
                    ? 'border-primary bg-primary-light/50 ring-1 ring-primary'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-slate-900 text-xs flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    Connected Backend Mode (Live API)
                  </span>
                  {currentMode === 'connected' && <CheckCircle className="w-4 h-4 text-primary" />}
                </div>
                <p className="text-[11px] text-slate-500 leading-normal">
                  Connects to the configured local Python/FastAPI endpoint (`http://localhost:8000/api/v1`) using `best.pth` checkpoint weights for real-time model inference.
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsModeModalOpen(false)}
                className="px-3 py-1.5 rounded-md text-xs font-medium text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
