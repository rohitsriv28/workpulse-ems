import { useState } from "react";
import { BarChart, Calendar, Download, Wallet } from "lucide-react";
import EmployeePayrollReport from "../features/employees/EmployeePayrollReport";

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState("This Month");
  const [activeTab, setActiveTab] = useState<"general" | "employee">("general");

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-main">
            Reports & Analytics
          </h1>
          <p className="text-text-muted text-sm mt-1">
            Analyze attendance trends and employee performance
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab("general")}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                activeTab === "general"
                  ? "bg-white text-primary shadow-sm"
                  : "text-text-muted hover:text-text-main"
              }`}
            >
              General
            </button>
            <button
              onClick={() => setActiveTab("employee")}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                activeTab === "employee"
                  ? "bg-white text-primary shadow-sm"
                  : "text-text-muted hover:text-text-main"
              }`}
            >
              Employee Reports
            </button>
          </div>
        </div>
      </div>

      {activeTab === "employee" ? (
        <EmployeePayrollReport />
      ) : (
        <>
          <div className="flex justify-end">
            <div className="flex items-center gap-3">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary bg-white"
              >
                <option>Today</option>
                <option>This Week</option>
                <option>This Month</option>
                <option>Last 3 Months</option>
              </select>
              <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors shadow-sm cursor-pointer">
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Export Report</span>
              </button>
            </div>
          </div>

          {/* Analytics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-surface p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-text-muted">
                  Avg. Attendance
                </h3>
                <div className="p-2 bg-blue-50 rounded-lg text-primary">
                  <BarChart className="w-5 h-5" />
                </div>
              </div>
              <div className="text-2xl font-bold text-text-main">94%</div>
              <p className="text-xs text-success mt-1">+2.5% vs last month</p>
            </div>

            <div className="bg-surface p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-text-muted">
                  On-Time Arrival
                </h3>
                <div className="p-2 bg-green-50 rounded-lg text-success">
                  <Calendar className="w-5 h-5" />
                </div>
              </div>
              <div className="text-2xl font-bold text-text-main">88%</div>
              <p className="text-xs text-error mt-1">-1.2% vs last month</p>
            </div>

            <div className="bg-surface p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-text-muted">
                  Payroll Liability
                </h3>
                <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                  <Wallet className="w-5 h-5" />
                </div>
              </div>
              <div className="text-2xl font-bold text-text-main">$42,500</div>
              <p className="text-xs text-text-muted mt-1">
                Estim. for current month
              </p>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-surface p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-text-main mb-6">
                Attendance Trend
              </h3>
              <div className="h-64 flex items-end justify-between gap-2 px-2">
                {[60, 75, 40, 80, 95, 65, 85].map((h, i) => (
                  <div
                    key={i}
                    className="w-full bg-blue-100 rounded-t-sm relative group hover:bg-primary transition-colors cursor-pointer"
                  >
                    <div
                      className="absolute bottom-0 w-full bg-primary/80 rounded-t-sm transition-all duration-500"
                      style={{ height: `${h}%` }}
                    ></div>
                    <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded">
                      {h}%
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-4 text-xs text-text-muted px-2">
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
                <span>Sun</span>
              </div>
            </div>

            <div className="bg-surface p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-text-main mb-6">
                Department Breakdown
              </h3>
              <div className="space-y-4">
                {[
                  { label: "Engineering", val: 85, color: "bg-blue-500" },
                  { label: "HR", val: 92, color: "bg-green-500" },
                  { label: "Sales", val: 78, color: "bg-orange-500" },
                  { label: "Marketing", val: 65, color: "bg-purple-500" },
                ].map((dept, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-text-main font-medium">
                        {dept.label}
                      </span>
                      <span className="text-text-muted">{dept.val}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2.5">
                      <div
                        className={`h-2.5 rounded-full ${dept.color}`}
                        style={{ width: `${dept.val}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
