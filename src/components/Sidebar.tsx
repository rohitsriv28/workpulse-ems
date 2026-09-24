import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  FileBarChart,
  ScanLine,
  LogOut,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

import logo from "../assets/attendlogo.png";

export default function Sidebar() {
  const { logout } = useAuth();

  const navItems = [
    { to: "/", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/attendance", icon: CalendarCheck, label: "Attendance" },
    { to: "/employees", icon: Users, label: "Employees" },
    { to: "/reports", icon: FileBarChart, label: "Reports" },
    { to: "/scanner", icon: ScanLine, label: "Scanner" },
  ];

  return (
    <aside className="w-64 bg-surface border-r border-gray-200 flex flex-col shadow-sm z-10 hidden md:flex">
      <div className="h-16 flex items-center px-6 border-b border-gray-100">
        <img src={logo} alt="AttendSys Logo" className="h-8 w-auto" />
      </div>

      <nav className="flex-1 py-6 px-3 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? "bg-blue-50 text-primary"
                  : "text-text-muted hover:bg-gray-50 hover:text-text-main"
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 px-3 py-2.5 text-sm font-medium text-error hover:bg-red-50 rounded-md transition-colors cursor-pointer"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </aside>
  );
}
