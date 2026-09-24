import { useState, useEffect } from "react";
import { api } from "../../lib/api/client";
import type { ShiftSchedule } from "../../types";

export default function MySchedulePage() {
  const [schedule, setSchedule] = useState<ShiftSchedule | null>(null);

  useEffect(() => {
    async function load() {
      const schs = await api.getSchedules();
      setSchedule(schs[0] || null);
    }
    load();
  }, []);

  const weekDays = [
    { day: "Monday", status: "Workday", time: "09:00 AM - 06:00 PM" },
    { day: "Tuesday", status: "Workday", time: "09:00 AM - 06:00 PM" },
    { day: "Wednesday", status: "Workday", time: "09:00 AM - 06:00 PM" },
    { day: "Thursday", status: "Workday", time: "09:00 AM - 06:00 PM" },
    { day: "Friday", status: "Workday", time: "09:00 AM - 06:00 PM" },
    { day: "Saturday", status: "Weekend", time: "Off Day" },
    { day: "Sunday", status: "Weekend", time: "Off Day" },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-main tracking-tight">
          My Work Schedule
        </h1>
        <p className="text-sm text-text-muted mt-1">
          Assigned shift hours, core working windows, and non-working days.
        </p>
      </div>

      {/* Main Shift Summary Card */}
      <div className="bg-surface rounded-2xl p-6 border border-slate-200/80 shadow-xs bg-gradient-to-r from-blue-50/30 via-white to-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <span className="text-xs font-bold text-primary uppercase">
              Current Active Assignment
            </span>
            <h2 className="text-lg font-bold text-text-main mt-0.5">
              {schedule?.name || "General Morning Shift"}
            </h2>
            <p className="text-xs text-text-muted">
              Effective Date: April 18, 2022 • Location: Remote (WFH)
            </p>
          </div>
          <div className="text-right">
            <span className="text-2xl font-extrabold text-primary font-mono">
              09:00 AM – 06:00 PM
            </span>
            <span className="block text-xs text-emerald-700 font-semibold">
              15-minute punctuality grace window
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 text-xs">
          <div>
            <span className="text-text-muted block">Core Hours</span>
            <span className="font-semibold text-text-main">
              10:00 AM – 05:00 PM
            </span>
          </div>
          <div>
            <span className="text-text-muted block">Expected Daily Hours</span>
            <span className="font-semibold text-text-main">8 Hours / Day</span>
          </div>
          <div>
            <span className="text-text-muted block">Meal / Break Quota</span>
            <span className="font-semibold text-text-main">60 Minutes</span>
          </div>
          <div>
            <span className="text-text-muted block">Overtime Policy</span>
            <span className="font-semibold text-text-main">
              Requires Manager Pre-approval
            </span>
          </div>
        </div>
      </div>

      {/* Weekly Schedule View */}
      <div className="bg-surface rounded-2xl p-6 border border-slate-200/80 shadow-xs">
        <h3 className="text-base font-semibold text-text-main mb-4">
          Weekly Working Hours Roster
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
          {weekDays.map((w, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-xl border text-center space-y-1.5 ${
                w.status === "Workday"
                  ? "bg-slate-50 border-slate-200/80"
                  : "bg-slate-100/50 border-dashed border-slate-200"
              }`}
            >
              <span className="text-xs font-bold text-text-main block">
                {w.day}
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block ${
                  w.status === "Workday"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-slate-200 text-slate-600"
                }`}
              >
                {w.status}
              </span>
              <p className="text-[11px] text-text-muted font-mono">{w.time}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
