import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ScanEye,
  History,
  BarChart3,
  Sparkles,
  Cpu,
  Settings,
  Eye,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Home
} from 'lucide-react';
import { getAppMode } from '../services/api';

interface AppSidebarProps {
  isOpen: boolean;
  onClose?: () => void;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({ isOpen, onClose }) => {
  const currentMode = getAppMode();

  const navItems = [
    { to: '/dashboard', label: 'Overview', icon: LayoutDashboard },
    { to: '/analyze', label: 'Analyze Image', icon: ScanEye },
    { to: '/history', label: 'Analysis History', icon: History },
    { to: '/insights', label: 'Research Insights', icon: BarChart3 },
    { to: '/explainability', label: 'Explainability', icon: Sparkles },
    { to: '/models', label: 'Models & Methodology', icon: Cpu },
    { to: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-sidebar text-slate-300 flex flex-col border-r border-sidebar-border transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand / Logo */}
        <div className="p-5 border-b border-sidebar-border">
          <NavLink to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center text-white shadow-sm ring-2 ring-primary/30 group-hover:bg-primary-hover transition-colors">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <div className="text-white font-semibold text-base tracking-tight flex items-center gap-1.5">
                PathMyo
                <span className="text-[10px] font-mono uppercase bg-primary/20 text-primary px-1.5 py-0.5 rounded border border-primary/30">
                  AI v2.0
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-normal truncate max-w-[150px]">
                Retinal AI Research Lab
              </p>
            </div>
          </NavLink>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 py-4 px-3 overflow-y-auto space-y-1">
          <div className="px-3 pb-2 text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
            Workspace Navigation
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary text-white shadow-sm font-semibold'
                      : 'text-slate-300 hover:bg-sidebar-hover hover:text-white'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}

          <div className="pt-4 px-3 pb-2 text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
            Project Overview
          </div>
          <NavLink
            to="/"
            onClick={onClose}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-slate-400 hover:bg-sidebar-hover hover:text-slate-200 transition-colors"
          >
            <Home className="w-3.5 h-3.5 shrink-0" />
            <span>Landing Presentation</span>
          </NavLink>
        </div>

        {/* Model Status Card */}
        <div className="p-3 mx-3 mb-3 bg-[#16253B] rounded-lg border border-sidebar-border text-xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-semibold text-slate-200 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-primary" />
              RETFound Backbone
            </span>
            {currentMode === 'connected' ? (
              <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-medium">
                <CheckCircle2 className="w-3 h-3" /> Live
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[10px] text-amber-400 font-medium">
                <AlertCircle className="w-3 h-3" /> Demo Mode
              </span>
            )}
          </div>
          <div className="space-y-1 text-[11px] text-slate-400 font-mono">
            <div className="flex justify-between">
              <span>Weights:</span>
              <span className="text-slate-300">best.pth (1.22 GB)</span>
            </div>
            <div className="flex justify-between">
              <span>Active Heads:</span>
              <span className="text-slate-300">PM • Sev • Seg • Fov</span>
            </div>
          </div>
        </div>

        {/* Bottom Research Notice */}
        <div className="p-3 border-t border-sidebar-border text-[11px] text-slate-400 flex items-center justify-between">
          <span className="truncate">Explainable Multi-Task PM</span>
          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300">
            Research
          </span>
        </div>
      </aside>
    </>
  );
};
