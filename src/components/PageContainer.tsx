import React from 'react';
import { ResearchDisclaimer } from './ResearchDisclaimer';

interface PageContainerProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  badge?: string;
  action?: React.ReactNode;
  showDisclaimer?: boolean;
  className?: string;
}

export const PageContainer: React.FC<PageContainerProps> = ({
  children,
  title,
  subtitle,
  badge,
  action,
  showDisclaimer = true,
  className = '',
}) => {
  return (
    <div className={`p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 ${className}`}>
      {/* Header section if title provided */}
      {title && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                {title}
              </h2>
              {badge && (
                <span className="px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                  {badge}
                </span>
              )}
            </div>
            {subtitle && (
              <p className="mt-1 text-xs sm:text-sm text-slate-500 leading-relaxed max-w-3xl">
                {subtitle}
              </p>
            )}
          </div>
          {action && <div className="flex items-center gap-2 shrink-0">{action}</div>}
        </div>
      )}

      {/* Main content */}
      <div>{children}</div>

      {/* Persistent Research Disclaimer */}
      {showDisclaimer && (
        <div className="pt-6">
          <ResearchDisclaimer />
        </div>
      )}
    </div>
  );
};
