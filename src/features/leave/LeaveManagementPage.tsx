import { useState, useEffect } from "react";
import { api } from "../../lib/api/client";
import type { LeaveRequest } from "../../types";
import { formatDate } from "../../lib/utils";
import { useNavigate } from "react-router-dom";

export default function LeaveManagementPage() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [filterType, setFilterType] = useState("ALL");
  const [filterStatus, setFilterStatus] = useState("ALL");

  const loadData = async () => {
    try {
      const data = await api.getLeaveRequests();
      setRequests(data);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filtered = requests.filter((r) => {
    const matchesType = filterType === "ALL" || r.leaveType === filterType;
    const matchesStatus = filterStatus === "ALL" || r.status === filterStatus;
    return matchesType && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-main tracking-tight">
            Organization Leave Management
          </h1>
          <p className="text-sm text-text-muted mt-1">
            Company-wide leave calendar, annual quotas, and multi-department
            approvals.
          </p>
        </div>
        <button
          onClick={() => navigate("/leave-approvals")}
          className="px-4 py-2 bg-primary text-white text-xs font-semibold rounded-xl hover:bg-primary-hover shadow-2xs transition-colors"
        >
          Open Approvals Queue
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-surface p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-text-muted">Type:</span>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5"
          >
            <option value="ALL">All Categories</option>
            <option value="ANNUAL">Annual Leave</option>
            <option value="CASUAL">Casual Leave</option>
            <option value="SICK">Sick Leave</option>
            <option value="UNPAID">Unpaid / Loss of Pay</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-text-muted">Status:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">Pending Approval</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Roster Table */}
      <div className="bg-surface rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-500 font-semibold uppercase text-[10px]">
                <th className="py-3.5 px-4">Employee</th>
                <th className="py-3.5 px-4">Department</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Dates & Duration</th>
                <th className="py-3.5 px-4">Reason</th>
                <th className="py-3.5 px-4">Approval State</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/50">
                  <td className="py-3.5 px-4 font-bold text-text-main">
                    {r.employeeName}
                  </td>
                  <td className="py-3.5 px-4 text-text-muted">
                    {r.department}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-primary">
                    {r.leaveType}
                  </td>
                  <td className="py-3.5 px-4 text-slate-700">
                    {formatDate(r.startDate)} - {formatDate(r.endDate)} (
                    {r.daysCount}d)
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
                            : "bg-rose-100 text-rose-800"
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
