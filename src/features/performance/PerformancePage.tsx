import { useState, useEffect } from "react";
import { api } from "../../lib/api/client";
import type { PerformanceGoal } from "../../types";

export default function PerformancePage() {
  const [goals, setGoals] = useState<PerformanceGoal[]>([]);

  useEffect(() => {
    async function load() {
      const data = await api.getGoals();
      setGoals(data);
    }
    load();
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-main tracking-tight">
            Performance & Goals Oversight
          </h1>
          <p className="text-sm text-text-muted mt-1">
            Track engineering milestones, OKR completion metrics, and quarterly
            reviews.
          </p>
        </div>
      </div>

      {/* Goal Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {goals.map((g) => (
          <div
            key={g.id}
            className="bg-surface rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-500 uppercase">
                  {g.employeeName}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    g.status === "COMPLETED"
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {g.status}
                </span>
              </div>

              <h3 className="text-base font-bold text-text-main">{g.title}</h3>
              <p className="text-xs text-text-muted mt-1 leading-relaxed">
                {g.description}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="text-slate-500">Milestone Progress:</span>
                <span className="text-primary font-mono font-bold">
                  {g.progress}%
                </span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-primary h-full rounded-full transition-all duration-300"
                  style={{ width: `${g.progress}%` }}
                />
              </div>

              {g.reviewerFeedback && (
                <div className="mt-3 p-3 bg-slate-50 border border-slate-100 rounded-xl text-[11px] text-slate-600">
                  <span className="font-semibold text-text-main block">
                    Manager Review Note:
                  </span>
                  <p className="italic">"{g.reviewerFeedback}"</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
