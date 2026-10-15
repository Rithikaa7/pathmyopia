import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Menu,
  ScanEye,
  Settings,
  Radio,
  CheckCircle,
  X
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
    window.location.reload();
  };

  return (
    <header className="sticky top-0 z-30 bg-[#F5F3ED]/95 backdrop-blur-xs border-b border-[#DADBD3] px-4 sm:px-8 py-3.5 transition-all">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile menu & Page Titles */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            className="p-1.5 -ml-1.5 rounded-xs text-[#171A19] hover:bg-[#EAE8E0] lg:hidden focus:outline-none"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="font-serif text-lg sm:text-xl font-normal text-[#171A19] tracking-tight">
                {title || 'Research Workspace'}
              </h1>
              <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded-xs text-[10px] font-mono text-[#777B76] border border-[#DADBD3] bg-white/60">
                PALM • MMAC • HRF
              </span>
            </div>
            {subtitle && (
              <p className="text-xs text-[#777B76] font-sans hidden sm:block truncate max-w-xl">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Right: Mode Badge & Quick Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Execution Mode Badge */}
          <button
            onClick={() => setIsModeModalOpen(true)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xs text-[11px] font-mono border transition-colors ${
              currentMode === 'connected'
                ? 'bg-[#254E43]/10 text-[#254E43] border-[#254E43]/30 hover:bg-[#254E43]/15'
                : 'bg-[#B97854]/10 text-[#B97854] border-[#B97854]/30 hover:bg-[#B97854]/15'
            }`}
            title="Toggle between Demo Mode and Live Cloud Inference"
          >
            <Radio className={`w-3 h-3 ${currentMode === 'connected' ? 'text-[#254E43] animate-pulse' : 'text-[#B97854]'}`} />
            <span className="hidden xs:inline">Mode:</span>
            <span className="font-semibold uppercase tracking-wider">{currentMode}</span>
          </button>

          {/* Quick Action: New Analysis */}
          {location.pathname !== '/analyze' && (
            <Link
              to="/analyze"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xs text-xs font-medium bg-[#254E43] text-white hover:bg-[#1B3B32] transition-colors"
            >
              <ScanEye className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">New Analysis</span>
            </Link>
          )}

          {/* Settings Link */}
          <Link
            to="/settings"
            className="p-1.5 text-[#777B76] hover:text-[#171A19] hover:bg-[#EAE8E0] rounded-xs transition-colors"
            title="Workspace Preferences"
          >
            <Settings className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Mode Switch Modal */}
      {isModeModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-[#17231F]/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setIsModeModalOpen(false)}
        >
          <div
            className="relative bg-[#F5F3ED] rounded-xs shadow-xl border border-[#DADBD3] max-w-md w-full p-6 space-y-4 my-auto max-h-[85vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#DADBD3] pb-3">
              <h3 className="font-serif text-base text-[#171A19] flex items-center gap-2">
                <Radio className="w-4 h-4 text-[#254E43]" />
                System Execution Mode
              </h3>
              <button
                type="button"
                onClick={() => setIsModeModalOpen(false)}
                className="w-6 h-6 flex items-center justify-center text-[#777B76] hover:text-[#171A19] hover:bg-[#EAE8E0] rounded-xs transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[#777B76] leading-relaxed">
              OcuLoom operates in two execution modes to support offline evaluation and live cloud deep learning inference.
            </p>

            <div className="space-y-2.5 pt-1">
              {/* Option 1: Demo Mode */}
              <div
                onClick={() => toggleMode('demo')}
                className={`p-3.5 rounded-xs border cursor-pointer transition-all ${
                  currentMode === 'demo'
                    ? 'border-[#254E43] bg-white ring-1 ring-[#254E43]'
                    : 'border-[#DADBD3] hover:border-[#777B76] bg-white/60'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-serif text-sm text-[#171A19] flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#B97854]" />
                    Demo & Offline Exploration
                  </span>
                  {currentMode === 'demo' && <CheckCircle className="w-4 h-4 text-[#254E43] shrink-0" />}
                </div>
                <p className="text-[11px] text-[#777B76] leading-normal pl-4">
                  Loads authentic benchmark predictions, Grad-CAM attention maps, and curated fundus photographs without requiring an active server connection.
                </p>
              </div>

              {/* Option 2: Connected Backend Mode */}
              <div
                onClick={() => toggleMode('connected')}
                className={`p-3.5 rounded-xs border cursor-pointer transition-all ${
                  currentMode === 'connected'
                    ? 'border-[#254E43] bg-white ring-1 ring-[#254E43]'
                    : 'border-[#DADBD3] hover:border-[#777B76] bg-white/60'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-serif text-sm text-[#171A19] flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#254E43]" />
                    Connected Backend (Live API)
                  </span>
                  {currentMode === 'connected' && <CheckCircle className="w-4 h-4 text-[#254E43] shrink-0" />}
                </div>
                <p className="text-[11px] text-[#777B76] leading-normal pl-4">
                  Connects directly to the live cloud endpoint (<code className="font-mono text-[#171A19] bg-[#EAE8E0] px-1 py-0.5 rounded-xs">https://pathmyopia.onrender.com</code>) for real-time model inference.
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setIsModeModalOpen(false)}
                className="px-4 py-1.5 rounded-xs text-xs font-mono uppercase text-[#777B76] hover:text-[#171A19] hover:bg-[#EAE8E0] transition-colors"
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
