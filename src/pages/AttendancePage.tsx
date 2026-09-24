import { useState } from "react";
import { useAttendance } from "../features/attendance/useAttendance";
import AttendanceStats from "../features/attendance/AttendanceStats";
import AttendanceTable from "../features/attendance/AttendanceTable";
import {
  Calendar as CalendarIcon,
  Download,
  SlidersHorizontal,
} from "lucide-react";
import { format } from "date-fns";

export default function AttendancePage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { data: attendanceData, isLoading } = useAttendance(selectedDate);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-main">
            Daily Attendance
          </h1>
          <p className="text-text-muted text-sm mt-1">
            Manage employee checks-ins and attendance records
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="date"
              value={format(selectedDate, "yyyy-MM-dd")}
              onChange={(e) => setSelectedDate(new Date(e.target.value))}
              className="pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary bg-white"
            />
          </div>
          <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-text-muted transition-colors cursor-pointer hidden sm:block">
            <SlidersHorizontal className="w-5 h-5" />
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors shadow-sm cursor-pointer">
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>

      {!isLoading && attendanceData && (
        <AttendanceStats data={attendanceData} />
      )}

      <AttendanceTable data={attendanceData || []} isLoading={isLoading} />
    </div>
  );
}
