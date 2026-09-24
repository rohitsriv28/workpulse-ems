import { useState } from "react";
import { Search, Filter, Download } from "lucide-react";

interface AuditLog {
  id: string;
  action: string;
  resource: string;
  user: string;
  timestamp: string;
  status: "SUCCESS" | "FAILURE";
}

const MOCK_LOGS: AuditLog[] = [
  {
    id: "1",
    action: "LOGIN",
    resource: "Auth",
    user: "admin@company.com",
    timestamp: "2023-10-25 08:00:00",
    status: "SUCCESS",
  },
  {
    id: "2",
    action: "CREATE_EMPLOYEE",
    resource: "Employee: Narendra Modi",
    user: "admin@company.com",
    timestamp: "2023-10-25 09:15:00",
    status: "SUCCESS",
  },
  {
    id: "3",
    action: "UPDATE_ATTENDANCE",
    resource: "Attendance: EMP001",
    user: "hr@company.com",
    timestamp: "2023-10-25 10:30:00",
    status: "SUCCESS",
  },
  {
    id: "4",
    action: "DELETE_EMPLOYEE",
    resource: "Employee: Anjali Verma",
    user: "admin@company.com",
    timestamp: "2023-10-25 11:45:00",
    status: "FAILURE",
  },
];

export default function AuditLogsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredLogs = MOCK_LOGS.filter(
    (log) =>
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.resource.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-main">Audit Logs</h1>
          <p className="text-text-muted text-sm mt-1">
            Track system activities and security events
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="text"
              placeholder="Search logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary bg-white w-64"
            />
          </div>
          <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-text-muted transition-colors cursor-pointer hidden sm:block">
            <Filter className="w-5 h-5" />
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-text-main rounded-lg hover:bg-gray-50 transition-colors shadow-sm cursor-pointer">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      <div className="bg-surface rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase text-text-muted font-semibold tracking-wider">
                <th className="p-4">Timestamp</th>
                <th className="p-4">Action</th>
                <th className="p-4">Resource</th>
                <th className="p-4">User</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredLogs.map((log) => (
                <tr
                  key={log.id}
                  className="hover:bg-gray-50 transition-colors bg-white"
                >
                  <td className="p-4 text-sm text-text-muted font-mono">
                    {log.timestamp}
                  </td>
                  <td className="p-4">
                    <span className="font-medium text-text-main bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs border border-blue-100">
                      {log.action}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-text-main">{log.resource}</td>
                  <td className="p-4 text-sm text-text-muted">{log.user}</td>
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${
                        log.status === "SUCCESS"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
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
