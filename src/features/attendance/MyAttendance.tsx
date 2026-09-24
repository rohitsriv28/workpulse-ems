import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../lib/api/client";
import type { AttendanceDay } from "../../types";
import { CheckCircle2, FileEdit } from "lucide-react";
import { formatMinutesDuration, formatDate } from "../../lib/utils";
import { AttendanceCorrectionModal } from "./AttendanceCorrectionModal";

export default function MyAttendance() {
  const { user } = useAuth();
  const empId = user?.employeeId || "EMP004";

  const [records, setRecords] = useState<AttendanceDay[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<AttendanceDay | null>(
    null,
  );
  const [isCorrectionOpen, setIsCorrectionOpen] = useState(false);

  const loadData = async () => {
    try {
      const data = await api.getEmployeeAttendance(empId);
      setRecords(data);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    loadData();
  }, [empId]);

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-main tracking-tight">
            My Attendance History
          </h1>
          <p className="text-sm text-text-muted mt-1">
            Official punch log, daily working duration, and correction request
            ledger.
          </p>
        </div>
        <button
          onClick={() => {
            setSelectedRecord(null);
            setIsCorrectionOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-xs font-semibold rounded-xl hover:bg-primary-hover transition-colors shadow-2xs cursor-pointer"
        >
          <FileEdit className="w-4 h-4" />
          <span>Request Punch Correction</span>
        </button>
      </div>

      {/* Summary Stat Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-surface p-4 rounded-xl border border-slate-200/80 shadow-2xs">
          <span className="text-xs font-medium text-text-muted">
            Recorded Days
          </span>
          <p className="text-xl font-bold text-text-main mt-1">
            {records.length}
          </p>
        </div>
        <div className="bg-surface p-4 rounded-xl border border-slate-200/80 shadow-2xs">
          <span className="text-xs font-medium text-text-muted">
            Present State
          </span>
          <p className="text-xl font-bold text-emerald-700 mt-1">
            {records.filter((r) => r.workState === "PRESENT").length} days
          </p>
        </div>
        <div className="bg-surface p-4 rounded-xl border border-slate-200/80 shadow-2xs">
          <span className="text-xs font-medium text-text-muted">
            Late Arrivals
          </span>
          <p className="text-xl font-bold text-amber-700 mt-1">
            {records.filter((r) => r.punctuality.isLate).length}
          </p>
        </div>
        <div className="bg-surface p-4 rounded-xl border border-slate-200/80 shadow-2xs">
          <span className="text-xs font-medium text-text-muted">
            Pending Disputes
          </span>
          <p className="text-xl font-bold text-primary mt-1">
            {records.filter((r) => r.correctionRequested).length}
          </p>
        </div>
      </div>

      {/* Attendance Log Table */}
      <div className="bg-surface rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-text-main">
            Daily Work Logs (September 2026)
          </h3>
          <span className="text-xs text-text-muted">
            Shift: 09:00 AM – 06:00 PM (SCH01)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-500 font-semibold uppercase text-[10px]">
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Work State</th>
                <th className="py-3.5 px-4">Mode</th>
                <th className="py-3.5 px-4">First Check-In</th>
                <th className="py-3.5 px-4">Final Check-Out</th>
                <th className="py-3.5 px-4">Duration</th>
                <th className="py-3.5 px-4">Punctuality & Exceptions</th>
                <th className="py-3.5 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {records.map((r) => {
                const firstIn = r.events.find(
                  (e) => e.type === "CHECK_IN",
                )?.timestamp;
                const lastOut = [...r.events]
                  .reverse()
                  .find((e) => e.type === "CHECK_OUT")?.timestamp;

                return (
                  <tr
                    key={r.id}
                    className="hover:bg-slate-50/60 transition-colors"
                  >
                    <td className="py-3.5 px-4 font-semibold text-text-main">
                      {formatDate(r.date)}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          r.workState === "PRESENT"
                            ? "bg-emerald-100 text-emerald-800"
                            : r.workState === "PARTIAL_DAY"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-rose-100 text-rose-800"
                        }`}
                      >
                        {r.workState}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-text-muted">
                      {r.workMode}
                    </td>
                    <td className="py-3.5 px-4 font-mono">
                      {firstIn ? firstIn.slice(11, 16) : "--:--"}
                    </td>
                    <td className="py-3.5 px-4 font-mono">
                      {lastOut ? lastOut.slice(11, 16) : "--:--"}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-semibold text-slate-700">
                      {formatMinutesDuration(r.workedMinutes)}
                    </td>
                    <td className="py-3.5 px-4">
                      {r.punctuality.isLate && (
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full mr-1.5">
                          Late {r.punctuality.lateMinutes}m
                        </span>
                      )}
                      {r.exceptions.map((ex, i) => (
                        <span
                          key={i}
                          className="text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full mr-1.5"
                        >
                          {ex}
                        </span>
                      ))}
                      {!r.punctuality.isLate && r.exceptions.length === 0 && (
                        <span className="text-[10px] font-medium text-emerald-700 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Standard Day
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {r.exceptions.length > 0 || !lastOut ? (
                        <button
                          onClick={() => {
                            setSelectedRecord(r);
                            setIsCorrectionOpen(true);
                          }}
                          className="text-[11px] font-bold text-primary hover:underline"
                        >
                          {r.correctionRequested
                            ? "Pending Review"
                            : "Dispute Punch"}
                        </button>
                      ) : (
                        <span className="text-slate-300">--</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Correction Request Modal */}
      <AttendanceCorrectionModal
        isOpen={isCorrectionOpen}
        onClose={() => setIsCorrectionOpen(false)}
        attendanceRecord={selectedRecord}
        onSuccess={loadData}
      />
    </div>
  );
}
