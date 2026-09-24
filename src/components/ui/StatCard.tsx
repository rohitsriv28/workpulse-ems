import { type ReactNode } from "react";
import { cn } from "../../lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  className?: string;
  onClick?: () => void;
}

export function StatCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  className,
  onClick,
}: StatCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "bg-surface p-5 rounded-xl border border-slate-200/70 shadow-xs hover:shadow-sm transition-all duration-200 flex flex-col justify-between",
        onClick && "cursor-pointer hover:border-primary/40",
        className,
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-text-muted">{title}</span>
        <div className="p-2.5 rounded-lg bg-slate-50 text-primary border border-slate-100">
          {icon}
        </div>
      </div>

      <div>
        <div className="text-2xl font-bold text-text-main tracking-tight">
          {value}
        </div>
        {(subtitle || trend) && (
          <div className="flex items-center gap-2 mt-1.5 text-xs">
            {trend && (
              <span
                className={cn(
                  "font-medium px-1.5 py-0.5 rounded",
                  trend.isPositive
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-rose-50 text-rose-700",
                )}
              >
                {trend.value}
              </span>
            )}
            {subtitle && <span className="text-text-muted">{subtitle}</span>}
          </div>
        )}
      </div>
    </div>
  );
}
