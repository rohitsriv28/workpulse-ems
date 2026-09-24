import { type ReactNode } from "react";

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-surface rounded-xl border border-dashed border-slate-200">
      <div className="p-3.5 rounded-full bg-slate-50 text-slate-400 mb-3 border border-slate-100">
        {icon}
      </div>
      <h3 className="text-base font-semibold text-text-main mb-1">{title}</h3>
      <p className="text-sm text-text-muted max-w-sm mb-5">{description}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-hover transition-colors shadow-xs"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
