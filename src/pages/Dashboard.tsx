import {
  Users,
  CalendarCheck,
  Clock,
  UserPlus,
  ScanLine,
  TrendingUp,
  ArrowRight,
  MoreHorizontal,
} from "lucide-react";
import { Link } from "react-router-dom";
import { format } from "date-fns";

export default function Dashboard() {
  const today = new Date();

  // Mock Data for Activity Feed
  const recentActivity = [
    {
      id: 1,
      user: "Priya Sharma",
      action: "Clocked In",
      time: "08:58 AM",
      status: "ontime",
    },
    {
      id: 2,
      user: "Rahul Gupta",
      action: "Clocked In",
      time: "09:12 AM",
      status: "late",
    },
    {
      id: 3,
      user: "Neha Singh",
      action: "Break Start",
      time: "11:30 AM",
      status: "break",
    },
    {
      id: 4,
      user: "Vikram Patel",
      action: "Clocked Out",
      time: "05:01 PM",
      status: "left",
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-main">
            Dashboard Overview
          </h1>
          <p className="text-text-muted mt-1">
            {format(today, "EEEE, MMMM do, yyyy")}
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            to="/scanner"
            className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-hover shadow-sm transition-all hover:scale-105"
          >
            <ScanLine className="w-4 h-4" />
            <span>Launch Scanner</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-surface p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-text-muted">
                Total Employees
              </p>
              <h3 className="text-3xl font-bold text-text-main mt-2">156</h3>
              <p className="text-xs text-success mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                +4 New this month
              </p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg text-primary">
              <Users className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-surface p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-text-muted">
                Present Today
              </p>
              <h3 className="text-3xl font-bold text-success mt-2">142</h3>
              <p className="text-xs text-text-muted mt-1">
                91% Attendance Rate
              </p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg text-success">
              <CalendarCheck className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-surface p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-text-muted">
                Late Arrivals
              </p>
              <h3 className="text-3xl font-bold text-accent mt-2">12</h3>
              <p className="text-xs text-error mt-1">+2 vs Yesterday</p>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg text-accent">
              <Clock className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-surface p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-text-muted">On Leave</p>
              <h3 className="text-3xl font-bold text-text-muted mt-2">8</h3>
              <p className="text-xs text-text-muted mt-1">Scheduled Leaves</p>
            </div>
            <div className="p-3 bg-gray-100 rounded-lg text-gray-500">
              <MoreHorizontal className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="bg-surface p-6 rounded-xl shadow-sm border border-gray-100 lg:col-span-1">
          <h3 className="font-semibold text-text-main mb-6">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <Link
              to="/employees?action=add"
              className="flex flex-col items-center justify-center p-4 rounded-xl border border-dashed border-gray-300 hover:border-primary hover:bg-blue-50 transition-all group cursor-pointer"
            >
              <UserPlus className="w-6 h-6 text-text-muted group-hover:text-primary mb-2" />
              <span className="text-sm font-medium text-text-main">
                Add Employee
              </span>
            </Link>
            <Link
              to="/attendance"
              className="flex flex-col items-center justify-center p-4 rounded-xl border border-dashed border-gray-300 hover:border-success hover:bg-green-50 transition-all group cursor-pointer"
            >
              <CalendarCheck className="w-6 h-6 text-text-muted group-hover:text-success mb-2" />
              <span className="text-sm font-medium text-text-main">
                Mark Manual
              </span>
            </Link>
          </div>

          <div className="mt-6">
            <h4 className="text-sm font-medium text-text-muted mb-4">
              Weekly Overview
            </h4>
            <div className="flex items-end justify-between h-32 gap-2">
              {[45, 78, 98, 92, 85, 40, 60].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 bg-gray-100 rounded-t-sm relative group"
                >
                  <div
                    className="absolute bottom-0 w-full bg-primary/20 group-hover:bg-primary transition-all rounded-t-sm"
                    style={{ height: `${h}%` }}
                  ></div>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-[10px] text-text-muted uppercase">
              <span>M</span>
              <span>T</span>
              <span>W</span>
              <span>T</span>
              <span>F</span>
              <span>S</span>
              <span>S</span>
            </div>
          </div>
        </div>

        {/* Live Activity Feed */}
        <div className="bg-surface p-6 rounded-xl shadow-sm border border-gray-100 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-text-main">Recent Activity</h3>
            <Link
              to="/audit-logs"
              className="text-primary text-sm hover:underline flex items-center gap-1"
            >
              View All <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm
                            ${
                              activity.status === "ontime"
                                ? "bg-green-100 text-green-700"
                                : ""
                            }
                            ${
                              activity.status === "late"
                                ? "bg-orange-100 text-orange-700"
                                : ""
                            }
                            ${
                              activity.status === "break"
                                ? "bg-blue-100 text-blue-700"
                                : ""
                            }
                            ${
                              activity.status === "left"
                                ? "bg-gray-100 text-gray-700"
                                : ""
                            }
                        `}
                  >
                    {activity.user.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text-main">
                      {activity.user}
                    </p>
                    <p className="text-xs text-text-muted">{activity.action}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-mono font-medium text-text-main">
                    {activity.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
