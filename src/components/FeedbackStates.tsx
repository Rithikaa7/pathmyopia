import React from 'react';
import { AlertCircle, FileSearch, RefreshCw, LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: LucideIcon;
  };
  icon?: LucideIcon;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  action,
  icon: Icon = FileSearch,
  className = '',
}) => {
  return (
    <div
      className={`p-10 text-center bg-white rounded-xl border border-dashed border-slate-300 shadow-subtle flex flex-col items-center justify-center space-y-3 ${className}`}
    >
      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
        <Icon className="w-6 h-6" />
      </div>
      <div className="max-w-md space-y-1">
        <h4 className="text-sm font-bold text-slate-800">{title}</h4>
        <p className="text-xs text-slate-500 leading-relaxed">{description}</p>
      </div>
      {action && (
        <button
          onClick={action.onClick}
          className="mt-2 inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-primary text-white rounded-lg text-xs font-semibold hover:bg-primary-hover shadow-subtle transition-colors"
        >
          {action.icon && <action.icon className="w-3.5 h-3.5" />}
          <span>{action.label}</span>
        </button>
      )}
    </div>
  );
};

interface LoadingStateProps {
  message?: string;
  submessage?: string;
  className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Processing Retinal Photograph...',
  submessage = 'Applying circular crop, LAB CLAHE normalization, and deep feature extraction.',
  className = '',
}) => {
  return (
    <div
      className={`p-12 text-center bg-white rounded-xl border border-slate-200 shadow-card flex flex-col items-center justify-center space-y-4 ${className}`}
    >
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-3 border-slate-200 border-t-primary animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center text-[10px] font-mono text-primary font-bold">
          AI
        </div>
      </div>
      <div className="max-w-sm space-y-1">
        <h4 className="text-sm font-bold text-slate-900">{message}</h4>
        <p className="text-xs text-slate-500 leading-relaxed">{submessage}</p>
      </div>
    </div>
  );
};

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Analysis Unavailable',
  message,
  onRetry,
  className = '',
}) => {
  return (
    <div
      className={`p-6 bg-red-50/70 border border-red-200 rounded-xl flex items-start gap-3 shadow-subtle ${className}`}
    >
      <div className="p-2 bg-red-100 rounded-lg text-red-600 shrink-0">
        <AlertCircle className="w-5 h-5" />
      </div>
      <div className="flex-1 space-y-1">
        <h4 className="text-xs font-bold uppercase tracking-wider text-red-900">{title}</h4>
        <p className="text-xs text-red-700 leading-relaxed">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-red-300 text-red-700 hover:bg-red-50 rounded text-xs font-semibold transition-colors"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Retry Operation</span>
          </button>
        )}
      </div>
    </div>
  );
};
