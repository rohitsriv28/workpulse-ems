import { useState, useEffect } from "react";
import { api } from "../../lib/api/client";
import type { ShiftSchedule } from "../../types";
import { Users, ShieldCheck } from "lucide-react";

export default function SchedulesPage() {
  const [schedules, setSchedules] = useState<ShiftSchedule[]>([]);

  useEffect(() => {
    async function load() {
      const data = await api.getSchedules();
      setSchedules(data);
    }
    load();
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-main tracking-tight">
            Work Schedules & Shift Templates
          </h1>
          <p className="text-sm text-text-muted mt-1">
            Configure expected shift hours, grace periods, break rules, and
            allowed work modes.
          </p>
        </div>
      </div>

      {/* Schedules Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {schedules.map((sch) => (
          <div
            key={sch.id}
            className="bg-surface rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                  {sch.id}
                </span>
                <h3 className="text-base font-bold text-text-main mt-1">
                  {sch.name}
                </h3>
              </div>
              <span className="text-xs text-text-muted flex items-center gap-1 font-semibold">
                <Users className="w-4 h-4 text-slate-400" />
                {sch.assignedEmployeesCount} Assigned
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-xl">
              <div>
                <span className="text-text-muted block text-[10px]">
                  Shift Window:
                </span>
                <span className="font-bold text-text-main text-sm font-mono">
                  {sch.startTime} – {sch.endTime}
                </span>
              </div>
              <div>
                <span className="text-text-muted block text-[10px]">
                  Expected Hours:
                </span>
                <span className="font-bold text-text-main text-sm font-mono">
                  {sch.expectedHours} Hours / Day
                </span>
              </div>
              <div>
                <span className="text-text-muted block text-[10px]">
                  Punctuality Grace:
                </span>
                <span className="font-semibold text-emerald-700">
                  {sch.gracePeriodMinutes} Minutes
                </span>
              </div>
              <div>
                <span className="text-text-muted block text-[10px]">
                  Break Allowance:
                </span>
                <span className="font-semibold text-slate-700">
                  {sch.breakMinutes} Minutes
                </span>
              </div>
            </div>

            <div className="space-y-1 text-xs">
              <span className="text-text-muted font-semibold">
                Working Days:
              </span>
              <div className="flex gap-1.5 pt-1">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                  (day) => {
                    const isActive = sch.workingDays.includes(day);
                    return (
                      <span
                        key={day}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                          isActive
                            ? "bg-primary text-white"
                            : "bg-slate-100 text-slate-400"
                        }`}
                      >
                        {day}
                      </span>
                    );
                  },
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-text-muted">
              <span>Allowed Modes: {sch.allowedWorkModes.join(", ")}</span>
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-4 h-4" /> Active Policy
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
