import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../lib/api/client";
import type { LeaveRequest } from "../../types";
import { CheckCircle2 } from "lucide-react";
import { formatDate } from "../../lib/utils";

export default function LeaveApprovalsPage() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>(
    {},
  );

  const loadData = async () => {
    try {
      const all = await api.getLeaveRequests();
      setRequests(all);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleReview = async (id: string, status: "APPROVED" | "REJECTED") => {
    const comment =
      commentInputs[id] || (status === "APPROVED" ? "Approved" : "Rejected");
    await api.reviewLeaveRequest(id, status, user?.name || "Manager", comment);
    loadData();
  };

  const pendingRequests = requests.filter((r) => r.status === "PENDING");
  const pastRequests = requests.filter((r) => r.status !== "PENDING");

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-text-main tracking-tight">
              Leave Approvals Queue
            </h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800">
              {pendingRequests.length} Pending Actions
            </span>
          </div>
          <p className="text-sm text-text-muted mt-1">
            Review team leave applications, check schedule conflicts, and record
            approval decisions.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-bold text-text-main uppercase tracking-wider text-slate-500">
          Awaiting Decision ({pendingRequests.length})
        </h3>

        <div className="grid grid-cols-1 gap-4">
          {pendingRequests.map((req) => (
            <div
              key={req.id}
              className="bg-surface rounded-2xl p-5 border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                    {req.employeeName[0]}
                  </div>
                  <div>
                    <span className="font-bold text-sm text-text-main">
                      {req.employeeName}
                    </span>
                    <span className="text-xs text-text-muted ml-2">
                      {req.department}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 ml-auto md:ml-2">
                    {req.leaveType} LEAVE
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs bg-slate-50 p-3 rounded-xl">
                  <div>
                    <span className="text-text-muted block text-[10px]">
                      Start Date
                    </span>
                    <span className="font-semibold text-text-main">
                      {formatDate(req.startDate)}
                    </span>
                  </div>
                  <div>
                    <span className="text-text-muted block text-[10px]">
                      End Date
                    </span>
                    <span className="font-semibold text-text-main">
                      {formatDate(req.endDate)}
                    </span>
                  </div>
                  <div>
                    <span className="text-text-muted block text-[10px]">
                      Duration
                    </span>
                    <span className="font-semibold text-primary">
                      {req.daysCount} working{" "}
                      {req.daysCount === 1 ? "day" : "days"}
                    </span>
                  </div>
                </div>

                <div className="text-xs text-slate-700 bg-amber-50/40 p-2.5 rounded-xl border border-amber-100">
                  <span className="font-semibold text-text-main mr-1">
                    Employee Reason:
                  </span>
                  <span className="italic">"{req.reason}"</span>
                </div>
              </div>

              <div className="flex flex-col gap-2 min-w-[220px]">
                <input
                  type="text"
                  placeholder="Optional review feedback..."
                  value={commentInputs[req.id] || ""}
                  onChange={(e) =>
                    setCommentInputs({
                      ...commentInputs,
                      [req.id]: e.target.value,
                    })
                  }
                  className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden"
                />
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleReview(req.id, "REJECTED")}
                    className="flex-1 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => handleReview(req.id, "APPROVED")}
                    className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-colors shadow-2xs cursor-pointer"
                  >
                    Approve
                  </button>
                </div>
              </div>
            </div>
          ))}

          {pendingRequests.length === 0 && (
            <div className="p-10 bg-surface rounded-2xl border border-dashed border-slate-200 text-center text-xs text-text-muted">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              All leave applications have been reviewed!
            </div>
          )}
        </div>
      </div>

      <div className="bg-surface rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h3 className="text-sm font-semibold text-text-main">
            Decision Audit History ({pastRequests.length})
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-500 font-semibold uppercase text-[10px]">
                <th className="py-3 px-4">Applicant</th>
                <th className="py-3 px-4">Type & Duration</th>
                <th className="py-3 px-4">Dates</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Reviewed By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {pastRequests.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/50">
                  <td className="py-3 px-4 font-semibold text-text-main">
                    {r.employeeName}
                  </td>
                  <td className="py-3 px-4">
                    {r.leaveType} ({r.daysCount}d)
                  </td>
                  <td className="py-3 px-4 text-text-muted">
                    {formatDate(r.startDate)} - {formatDate(r.endDate)}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        r.status === "APPROVED"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-rose-100 text-rose-800"
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-text-muted">
                    {r.approvedBy || "Manager"}{" "}
                    {r.approverComment && `("${r.approverComment}")`}
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
