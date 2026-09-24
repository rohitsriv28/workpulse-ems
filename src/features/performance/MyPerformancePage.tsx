import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../lib/api/client";
import type { PerformanceGoal } from "../../types";

export default function MyPerformancePage() {
  const { user } = useAuth();
  const empId = user?.employeeId || "EMP004";

  const [goals, setGoals] = useState<PerformanceGoal[]>([]);

  const loadData = async () => {
    const data = await api.getGoals(empId);
    setGoals(data);
  };

  useEffect(() => {
    loadData();
  }, [empId]);

  const handleSliderChange = async (id: string, newProgress: number) => {
    setGoals((prev) =>
      prev.map((g) => (g.id === id ? { ...g, progress: newProgress } : g)),
    );
    await api.updateGoalProgress(id, newProgress);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-main tracking-tight">
          My Performance Goals & Milestones
        </h1>
        <p className="text-sm text-text-muted mt-1">
          Quarterly deliverables, technical key results, and managerial
          feedback.
        </p>
      </div>

      {/* Goal Cards */}
      <div className="space-y-4">
        {goals.map((g) => (
          <div
            key={g.id}
            className="bg-surface rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full uppercase">
                  Target: {g.targetDate}
                </span>
                <h3 className="text-base font-bold text-text-main mt-1">
                  {g.title}
                </h3>
              </div>
              <span
                className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                  g.status === "COMPLETED"
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-blue-100 text-blue-800"
                }`}
              >
                {g.status}
              </span>
            </div>

            <p className="text-xs text-text-muted leading-relaxed">
              {g.description}
            </p>

            {/* Interactive Progress Slider */}
            <div className="space-y-2 pt-2 bg-slate-50 p-4 rounded-xl">
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="text-slate-600">
                  Update Your Current Completion:
                </span>
                <span className="text-primary font-mono text-sm font-bold">
                  {g.progress}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={g.progress}
                onChange={(e) =>
                  handleSliderChange(g.id, Number(e.target.value))
                }
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>

            {g.reviewerFeedback && (
              <div className="p-3 bg-blue-50/50 border border-blue-100 rounded-xl text-xs text-blue-950">
                <span className="font-semibold block mb-0.5">
                  Manager Evaluation:
                </span>
                <p className="italic">"{g.reviewerFeedback}"</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
