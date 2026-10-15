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
  CircleDot,
  CheckCircle2,
  AlertCircle,
  Home,
  ChevronRight
} from 'lucide-react';
import { getAppMode } from '../services/api';

interface AppSidebarProps {
  isOpen: boolean;
  onClose?: () => void;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({ isOpen, onClose }) => {
  const currentMode = getAppMode();

  const navItems = [
    { to: '/dashboard', label: 'Overview', index: '01', icon: LayoutDashboard },
    { to: '/analyze', label: 'Analyze Image', index: '02', icon: ScanEye },
    { to: '/history', label: 'Analysis History', index: '03', icon: History },
    { to: '/explainability', label: 'Explainability', index: '04', icon: Sparkles },
    { to: '/insights', label: 'Research Insights', index: '05', icon: BarChart3 },
    { to: '/models', label: 'Models & Methodology', index: '06', icon: Cpu },
    { to: '/settings', label: 'Settings', index: '07', icon: Settings },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-[#17231F]/70 z-40 lg:hidden backdrop-blur-xs transition-opacity"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#17231F] text-[#DADBD3] flex flex-col border-r border-[#2A3632] transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand / Logo */}
        <div className="p-5 border-b border-[#2A3632]">
          <NavLink to="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-full border border-[#86A89B]/40 flex items-center justify-center bg-[#254E43]/30 group-hover:border-[#86A89B] transition-colors">
              <div className="w-2.5 h-2.5 rounded-full bg-[#86A89B]" />
            </div>
            <div>
              <div className="text-white font-serif text-lg tracking-tight flex items-center gap-2">
                <span>OcuLoom</span>
                <span className="text-[9px] font-mono tracking-widest text-[#86A89B] uppercase border border-[#86A89B]/30 px-1 py-0.2 rounded-xs">
                  v2.0
                </span>
              </div>
              <p className="text-[10px] font-mono text-[#777B76] uppercase tracking-wider">
                Retinal Intelligence
              </p>
            </div>
          </NavLink>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 py-4 px-3 overflow-y-auto space-y-1">
          <div className="px-3 pb-2 text-[9px] font-mono uppercase tracking-widest text-[#777B76]">
            Workspace Index
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2 text-xs font-sans rounded-xs transition-colors group ${
                    isActive
                      ? 'bg-[#254E43] text-white font-medium shadow-xs border-l-2 border-[#86A89B]'
                      : 'text-[#DADBD3]/80 hover:bg-[#202E29] hover:text-white'
                  }`
                }
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 text-[#86A89B]/80 group-hover:text-[#86A89B] shrink-0" />
                  <span>{item.label}</span>
                </div>
                <span className="font-mono text-[10px] text-[#777B76] group-hover:text-[#86A89B]/70">
                  {item.index}
                </span>
              </NavLink>
            );
          })}

          <div className="pt-5 px-3 pb-2 text-[9px] font-mono uppercase tracking-widest text-[#777B76]">
            Platform Overview
          </div>
          <NavLink
            to="/"
            onClick={onClose}
            className="flex items-center justify-between px-3 py-2 text-xs font-sans rounded-xs text-[#777B76] hover:bg-[#202E29] hover:text-white transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <Home className="w-3.5 h-3.5 text-[#777B76]" />
              <span>Editorial Journal</span>
            </div>
            <ChevronRight className="w-3 h-3 text-[#777B76]" />
          </NavLink>
        </div>

        {/* Scientific Model Status Panel */}
        <div className="p-3 mx-3 mb-3 bg-[#101815] rounded-xs border border-[#2A3632] text-xs space-y-2">
          <div className="flex items-center justify-between pb-1.5 border-b border-[#2A3632]">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#DADBD3] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#86A89B] animate-pulse" />
              RETFound-MT
            </span>
            {currentMode === 'connected' ? (
              <span className="text-[9px] font-mono text-[#86A89B] border border-[#86A89B]/30 px-1 py-0.2 rounded-xs">
                Cloud Live
              </span>
            ) : (
              <span className="text-[9px] font-mono text-[#B97854] border border-[#B97854]/30 px-1 py-0.2 rounded-xs">
                Demo
              </span>
            )}
          </div>
          <div className="space-y-1 text-[10px] text-[#777B76] font-mono">
            <div className="flex justify-between">
              <span>Weights:</span>
              <span className="text-[#DADBD3]">best.pth (1.22 GB)</span>
            </div>
            <div className="flex justify-between">
              <span>Active Heads:</span>
              <span className="text-[#86A89B]">PM • Sev • Seg • Fov</span>
            </div>
          </div>
        </div>

        {/* Bottom Research Notice */}
        <div className="p-3 border-t border-[#2A3632] text-[10px] font-mono text-[#777B76] flex items-center justify-between">
          <span className="truncate">Explainable Retinal Intelligence</span>
          <span className="px-1.5 py-0.5 rounded-xs text-[9px] font-mono bg-[#254E43]/40 text-[#86A89B] border border-[#86A89B]/20">
            Research
          </span>
        </div>
      </aside>
    </>
  );
};
