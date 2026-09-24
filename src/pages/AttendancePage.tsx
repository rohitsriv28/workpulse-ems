import { useState, useEffect } from "react";
import { Download, CheckCircle2 } from "lucide-react";
import { api } from "../lib/api/client";
import type { AttendanceDay, AttendanceCorrection } from "../types";
import { formatDate, formatMinutesDuration } from "../lib/utils";

export default function AttendancePage() {
  const [activeTab, setActiveTab] = useState<
    "roster" | "exceptions" | "corrections"
  >("roster");
  const [selectedDate, setSelectedDate] = useState("2026-09-24");
  const [selectedDept, setSelectedDept] = useState("ALL");
  const [records, setRecords] = useState<AttendanceDay[]>([]);
  const [corrections, setCorrections] = useState<AttendanceCorrection[]>([]);

  const loadData = async () => {
    try {
      const [attData, corrData] = await Promise.all([
        api.getAttendance(selectedDate, selectedDept),
        api.getCorrections(),
      ]);
      setRecords(attData);
      setCorrections(corrData);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedDate, selectedDept]);

  const handleReviewCorrection = async (
    id: string,
    status: "APPROVED" | "REJECTED",
  ) => {
    await api.reviewAttendanceCorrection(
      id,
      status,
      status === "APPROVED"
        ? "Approved by HR"
        : "Rejected: insufficient evidence",
    );
    loadData();
  };

  const exceptions = records.filter(
    (r) =>
      r.punctuality.isLate ||
      r.exceptions.length > 0 ||
      r.workState === "ABSENT",
  );

  const pendingCorrections = corrections.filter((c) => c.status === "PENDING");

  const exportAttendanceCSV = () => {
    const headers = [
      "Employee ID",
      "Employee Name",
      "Department",
      "Date",
      "Work State",
      "Work Mode",
      "Worked Minutes",
      "Exceptions",
    ];
    const rows = records.map((r) => [
      r.employeeId,
      r.employeeName,
      r.department,
      r.date,
      r.workState,
      r.workMode,
      r.workedMinutes,
      r.exceptions.join(" | ") || "None",
    ]);
    api.exportCSV(`Attendance_${selectedDate}`, headers, rows);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-main tracking-tight">
            Attendance Operations & Exceptions
          </h1>
          <p className="text-sm text-text-muted mt-1">
            Realtime workforce punch tracking, punctuality exceptions, and
            dispute queues.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={exportAttendanceCSV}
            className="flex items-center gap-2 px-3.5 py-2 bg-white border border-slate-200 text-xs font-semibold text-slate-700 rounded-xl hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
          >
            <Download className="w-4 h-4 text-slate-500" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Primary Navigation Tabs */}
      <div className="flex border-b border-slate-200 gap-4">
        <button
          onClick={() => setActiveTab("roster")}
          className={`pb-3 text-xs sm:text-sm font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === "roster"
              ? "border-primary text-primary"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Daily Roster ({records.length})
        </button>

        <button
          onClick={() => setActiveTab("exceptions")}
          className={`pb-3 text-xs sm:text-sm font-semibold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === "exceptions"
              ? "border-rose-600 text-rose-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <span>Exceptions Queue</span>
          {exceptions.length > 0 && (
            <span className="text-[10px] bg-rose-100 text-rose-700 font-bold px-2 py-0.2 rounded-full">
              {exceptions.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab("corrections")}
          className={`pb-3 text-xs sm:text-sm font-semibold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === "corrections"
              ? "border-primary text-primary"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <span>Correction Requests</span>
          {pendingCorrections.length > 0 && (
            <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.2 rounded-full">
              {pendingCorrections.length} Pending
            </span>
          )}
        </button>
      </div>

      {/* Date & Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-surface p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-text-muted">
            Target Date:
          </span>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-text-main focus:outline-hidden"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-text-muted">
            Department:
          </span>
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-slate-700 focus:outline-hidden"
          >
            <option value="ALL">All Departments</option>
            <option value="Engineering">Engineering</option>
            <option value="Human Resources">Human Resources</option>
            <option value="Design">Design</option>
            <option value="Sales">Sales</option>
          </select>
        </div>
      </div>

      {/* Tab 1: Daily Roster Table */}
      {activeTab === "roster" && (
        <div className="bg-surface rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
                  <th className="py-3.5 px-4">Employee</th>
                  <th className="py-3.5 px-4">Department</th>
                  <th className="py-3.5 px-4">Work State</th>
                  <th className="py-3.5 px-4">Mode</th>
                  <th className="py-3.5 px-4">In / Out Timestamps</th>
                  <th className="py-3.5 px-4">Hours Logged</th>
                  <th className="py-3.5 px-4">Exceptions & Flags</th>
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
                      <td className="py-3.5 px-4 font-bold text-text-main">
                        {r.employeeName}
                        <span className="block text-[10px] font-normal text-text-muted">
                          {r.employeeId}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-text-muted">
                        {r.department}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
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
                      <td className="py-3.5 px-4 font-medium text-slate-600">
                        {r.workMode}
                      </td>
                      <td className="py-3.5 px-4 font-mono">
                        {firstIn ? firstIn.slice(11, 16) : "--:--"} -{" "}
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
                            <CheckCircle2 className="w-3.5 h-3.5" /> Punctual
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Exceptions View */}
      {activeTab === "exceptions" && (
        <div className="bg-surface rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-text-main">
                Attendance Exceptions ({exceptions.length})
              </h3>
              <p className="text-xs text-text-muted">
                Employees requiring punch verification, late review, or absence
                justification
              </p>
            </div>
            <span className="text-xs font-semibold bg-rose-100 text-rose-800 px-3 py-1 rounded-full">
              Requires HR Attention
            </span>
          </div>

          <div className="space-y-3">
            {exceptions.map((ex) => (
              <div
                key={ex.id}
                className="p-4 rounded-xl border border-rose-100 bg-rose-50/30 flex items-center justify-between"
              >
                <div>
                  <h4 className="text-sm font-bold text-text-main">
                    {ex.employeeName} ({ex.department})
                  </h4>
                  <p className="text-xs text-rose-700 font-medium mt-0.5">
                    Flag:{" "}
                    {ex.exceptions.join(", ") ||
                      (ex.punctuality.isLate
                        ? `Late by ${ex.punctuality.lateMinutes}m`
                        : "Absence")}
                  </p>
                  <p className="text-[11px] text-text-muted mt-1">
                    Scheduled: 09:00 AM – 06:00 PM • Work Mode: {ex.workMode}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab("corrections")}
                    className="px-3 py-1.5 bg-white border border-slate-200 text-xs font-semibold text-slate-700 rounded-xl hover:bg-slate-50"
                  >
                    Inspect Correction
                  </button>
                </div>
              </div>
            ))}

            {exceptions.length === 0 && (
              <div className="text-center py-10 text-xs text-text-muted">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                No attendance exceptions recorded for {selectedDate}.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Correction Requests Queue */}
      {activeTab === "corrections" && (
        <div className="bg-surface rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-text-main">
                Attendance Dispute & Correction Queue
              </h3>
              <p className="text-xs text-text-muted">
                Verify employee-submitted missing punch requests before payroll
                finalization
              </p>
            </div>
            <span className="text-xs font-semibold bg-amber-100 text-amber-800 px-3 py-1 rounded-full">
              {pendingCorrections.length} Awaiting Decision
            </span>
          </div>

          <div className="space-y-4">
            {corrections.map((corr) => (
              <div
                key={corr.id}
                className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-text-main">
                      {corr.employeeName}
                    </span>
                    <span className="text-[10px] text-text-muted font-mono">
                      ({corr.employeeId})
                    </span>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      corr.status === "PENDING"
                        ? "bg-amber-100 text-amber-800"
                        : corr.status === "APPROVED"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-rose-100 text-rose-800"
                    }`}
                  >
                    {corr.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-50 p-3 rounded-xl">
                  <div>
                    <span className="text-text-muted block">
                      Affected Workday:
                    </span>
                    <span className="font-semibold text-text-main">
                      {formatDate(corr.date)}
                    </span>
                  </div>
                  <div>
                    <span className="text-text-muted block">
                      Requested Adjustment:
                    </span>
                    <span className="font-semibold text-text-main font-mono">
                      {corr.requestedPunch.checkIn} →{" "}
                      {corr.requestedPunch.checkOut}
                    </span>
                  </div>
                </div>

                <div className="text-xs text-slate-700 bg-amber-50/50 border border-amber-100 p-2.5 rounded-lg">
                  <span className="font-semibold block mb-0.5">
                    Employee Justification:
                  </span>
                  <p className="italic text-slate-600">"{corr.reason}"</p>
                </div>

                {corr.status === "PENDING" && (
                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                    <button
                      onClick={() =>
                        handleReviewCorrection(corr.id, "REJECTED")
                      }
                      className="px-3 py-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                    >
                      Reject Request
                    </button>
                    <button
                      onClick={() =>
                        handleReviewCorrection(corr.id, "APPROVED")
                      }
                      className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors shadow-2xs cursor-pointer"
                    >
                      Approve & Adjust Record
                    </button>
                  </div>
                )}
              </div>
            ))}

            {corrections.length === 0 && (
              <div className="text-center py-8 text-xs text-text-muted">
                No correction requests found.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
