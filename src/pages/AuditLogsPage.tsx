import { useState, useEffect } from "react";
import { Search, Download, CheckCircle2, XCircle } from "lucide-react";
import { api } from "../lib/api/client";
import type { AuditLog } from "../types";

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAction, setSelectedAction] = useState("ALL");

  useEffect(() => {
    async function load() {
      const data = await api.getAuditLogs();
      setLogs(data);
    }
    load();
  }, []);

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.resource.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAction =
      selectedAction === "ALL" || log.action === selectedAction;
    return matchesSearch && matchesAction;
  });

  const exportAuditCSV = () => {
    const headers = [
      "Timestamp",
      "Action",
      "Resource",
      "User",
      "Role",
      "Status",
      "Details",
    ];
    const rows = filteredLogs.map((l) => [
      l.timestamp,
      l.action,
      l.resource,
      l.user,
      l.role,
      l.status,
      l.details || "",
    ]);
    api.exportCSV("Audit_Log_Ledger", headers, rows);
  };

  const actionTypes = [
    "ALL",
    ...Array.from(new Set(logs.map((l) => l.action))),
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-main tracking-tight">
            Security & Compliance Audit Ledger
          </h1>
          <p className="text-sm text-text-muted mt-1">
            Immutable tracking of user authentication, state mutations, and
            privileged administrative actions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={exportAuditCSV}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-text-main rounded-xl hover:bg-slate-50 transition-colors shadow-2xs text-xs font-semibold cursor-pointer"
          >
            <Download className="w-4 h-4 text-slate-500" />
            Export Ledger
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-surface p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search action, user, record..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-semibold text-text-muted">
            Action Type:
          </span>
          <select
            value={selectedAction}
            onChange={(e) => setSelectedAction(e.target.value)}
            className="text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-slate-700 focus:outline-hidden"
          >
            {actionTypes.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-surface rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
                <th className="py-3.5 px-4">Timestamp</th>
                <th className="py-3.5 px-4">Action Event</th>
                <th className="py-3.5 px-4">Target Resource</th>
                <th className="py-3.5 px-4">Actor</th>
                <th className="py-3.5 px-4">Role</th>
                <th className="py-3.5 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/50">
                  <td className="py-3.5 px-4 text-slate-600 font-mono text-[11px]">
                    {log.timestamp}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full text-[10px] font-mono">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-text-main font-medium">
                    {log.resource}
                  </td>
                  <td className="py-3.5 px-4 text-text-muted">{log.user}</td>
                  <td className="py-3.5 px-4 font-semibold text-slate-700">
                    {log.role}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        log.status === "SUCCESS"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-rose-100 text-rose-800"
                      }`}
                    >
                      {log.status === "SUCCESS" ? (
                        <CheckCircle2 className="w-3 h-3" />
                      ) : (
                        <XCircle className="w-3 h-3" />
                      )}
                      {log.status}
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
