import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../lib/api/client";
import type { LeaveRequest, LeaveBalance } from "../../types";
import { Plus } from "lucide-react";
import { formatDate } from "../../lib/utils";
import { LeaveRequestModal } from "./LeaveRequestModal";

export default function MyLeavePage() {
  const { user } = useAuth();
  const empId = user?.employeeId || "EMP004";

  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [balance, setBalance] = useState<LeaveBalance | null>(null);
  const [isApplyOpen, setIsApplyOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [reqs, bal] = await Promise.all([
        api.getLeaveRequests(empId),
        api.getLeaveBalances(empId),
      ]);
      setRequests(reqs);
      setBalance(bal);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [empId]);

  const handleCancel = async (id: string) => {
    if (confirm("Are you sure you want to cancel this leave application?")) {
      await api.cancelLeaveRequest(id);
      loadData();
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-main tracking-tight">
            My Leave Portal
          </h1>
          <p className="text-sm text-text-muted mt-1">
            Track annual entitlements, leave quotas, and supervisor review
            timelines.
          </p>
        </div>
        <button
          onClick={() => setIsApplyOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white text-xs font-semibold rounded-xl hover:bg-primary-hover transition-colors shadow-2xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Apply for Leave</span>
        </button>
      </div>

      {/* Leave Balance Quota Cards */}
      {balance && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-surface p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase">
                Annual Leave
              </span>
              <span className="text-xs bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded-full">
                {balance.annual.available} available
              </span>
            </div>
            <div className="text-2xl font-black text-text-main">
              {balance.annual.used} / {balance.annual.total}{" "}
              <span className="text-xs font-normal text-text-muted">
                days used
              </span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
              <div
                className="bg-blue-600 h-full rounded-full"
                style={{
                  width: `${Math.round((balance.annual.used / balance.annual.total) * 100)}%`,
                }}
              />
            </div>
          </div>

          <div className="bg-surface p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase">
                Casual Leave
              </span>
              <span className="text-xs bg-purple-100 text-purple-700 font-bold px-2 py-0.5 rounded-full">
                {balance.casual.available} available
              </span>
            </div>
            <div className="text-2xl font-black text-text-main">
              {balance.casual.used} / {balance.casual.total}{" "}
              <span className="text-xs font-normal text-text-muted">
                days used
              </span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
              <div
                className="bg-purple-600 h-full rounded-full"
                style={{
                  width: `${Math.round((balance.casual.used / balance.casual.total) * 100)}%`,
                }}
              />
            </div>
          </div>

          <div className="bg-surface p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase">
                Sick Leave
              </span>
              <span className="text-xs bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded-full">
                {balance.sick.available} available
              </span>
            </div>
            <div className="text-2xl font-black text-text-main">
              {balance.sick.used} / {balance.sick.total}{" "}
              <span className="text-xs font-normal text-text-muted">
                days used
              </span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
              <div
                className="bg-emerald-600 h-full rounded-full"
                style={{
                  width: `${Math.round((balance.sick.used / balance.sick.total) * 100)}%`,
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Leave Application History Table */}
      <div className="bg-surface rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-text-main">
            Leave Request History
          </h3>
          <span className="text-xs text-text-muted">
            3-Day Monthly Paid Leave Policy Active
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-500 font-semibold uppercase text-[10px]">
                <th className="py-3.5 px-4">Leave Type</th>
                <th className="py-3.5 px-4">Duration</th>
                <th className="py-3.5 px-4">Dates</th>
                <th className="py-3.5 px-4">Reason</th>
                <th className="py-3.5 px-4">Status & Reviewer</th>
                <th className="py-3.5 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {requests.map((r) => (
                <tr
                  key={r.id}
                  className="hover:bg-slate-50/60 transition-colors"
                >
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-text-main block">
                      {r.leaveType}
                    </span>
                    <span className="text-[10px] text-text-muted">
                      Applied {formatDate(r.appliedAt)}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 font-semibold text-slate-700">
                    {r.daysCount} {r.daysCount === 1 ? "day" : "days"}{" "}
                    {r.isHalfDay && `(${r.halfDayPeriod?.toLowerCase()})`}
                  </td>

                  <td className="py-3.5 px-4 text-text-muted font-medium">
                    {formatDate(r.startDate)} - {formatDate(r.endDate)}
                  </td>

                  <td className="py-3.5 px-4 max-w-xs truncate text-slate-600">
                    "{r.reason}"
                  </td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        r.status === "APPROVED"
                          ? "bg-emerald-100 text-emerald-800"
                          : r.status === "PENDING"
                            ? "bg-amber-100 text-amber-800"
                            : r.status === "CANCELLED"
                              ? "bg-slate-100 text-slate-600"
                              : "bg-rose-100 text-rose-800"
                      }`}
                    >
                      {r.status}
                    </span>
                    {r.approvedBy && (
                      <span className="block text-[10px] text-text-muted mt-0.5">
                        By {r.approvedBy}
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    {r.status === "PENDING" && (
                      <button
                        onClick={() => handleCancel(r.id)}
                        className="text-[11px] font-semibold text-rose-600 hover:underline cursor-pointer"
                      >
                        Cancel
                      </button>
                    )}
                    {r.status !== "PENDING" && (
                      <span className="text-slate-300">--</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {requests.length === 0 && !loading && (
          <div className="p-8 text-center text-text-muted text-xs">
            No leave requests submitted yet.
          </div>
        )}
      </div>

      {/* Apply Leave Modal */}
      <LeaveRequestModal
        isOpen={isApplyOpen}
        onClose={() => setIsApplyOpen(false)}
        onSuccess={loadData}
      />
    </div>
  );
}
