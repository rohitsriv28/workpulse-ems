import type { AttendanceRecord } from "./types";
import { Edit2, Trash2 } from "lucide-react";
import { format } from "date-fns";

interface AttendanceTableProps {
  data: AttendanceRecord[];
  isLoading: boolean;
}

export default function AttendanceTable({
  data,
  isLoading,
}: AttendanceTableProps) {
  if (isLoading) {
    return (
      <div className="p-8 text-center text-text-muted">
        Loading attendance data...
      </div>
    );
  }

  return (
    <div className="bg-surface rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase text-text-muted font-semibold tracking-wider">
              <th className="p-4">Employee</th>
              <th className="p-4">Department</th>
              <th className="p-4">Check In</th>
              <th className="p-4">Check Out</th>
              <th className="p-4">Break</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {data.map((record) => (
              <tr
                key={record.id}
                className="hover:bg-gray-50 transition-colors bg-white"
              >
                <td className="p-4">
                  <div>
                    <p className="font-medium text-text-main">
                      {record.employeeName}
                    </p>
                    <p className="text-xs text-text-muted">
                      {record.employeeId}
                    </p>
                  </div>
                </td>
                <td className="p-4 text-sm text-text-muted">
                  {record.department}
                </td>
                <td className="p-4 text-sm text-text-main">
                  {record.checkIn
                    ? format(new Date(record.checkIn), "hh:mm a")
                    : "-"}
                </td>
                <td className="p-4 text-sm text-text-main">
                  {record.checkOut
                    ? format(new Date(record.checkOut), "hh:mm a")
                    : "-"}
                </td>
                <td className="p-4 text-sm text-text-muted">
                  {record.totalBreakMinutes} mins
                </td>
                <td className="p-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                    ${
                      record.status === "PRESENT"
                        ? "bg-green-100 text-green-800"
                        : record.status === "ABSENT"
                        ? "bg-red-100 text-red-800"
                        : record.status === "LATE"
                        ? "bg-orange-100 text-orange-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {record.status}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-1.5 text-text-muted hover:text-primary hover:bg-blue-50 rounded transition-colors cursor-pointer">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 text-text-muted hover:text-error hover:bg-red-50 rounded transition-colors cursor-pointer">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {data.length === 0 && (
        <div className="p-8 text-center text-text-muted">
          No attendance records found for this date.
        </div>
      )}
    </div>
  );
}
