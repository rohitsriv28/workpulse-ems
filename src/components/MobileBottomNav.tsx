import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  FileBarChart,
  ScanLine,
} from "lucide-react";

export default function MobileBottomNav() {
  const navItems = [
    { to: "/", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/attendance", icon: CalendarCheck, label: "Attendance" },
    { to: "/employees", icon: Users, label: "Employees" },
    { to: "/reports", icon: FileBarChart, label: "Reports" },
    { to: "/scanner", icon: ScanLine, label: "Scanner" },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-gray-200 z-50 pb-safe">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center w-full h-full space-y-1 ${
                isActive
                  ? "text-primary"
                  : "text-text-muted hover:text-text-main"
              }`
            }
          >
            <item.icon className="w-6 h-6" />
            <span className="text-[10px] font-medium">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
