import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getNavigationForRole, type NavItem } from "../lib/permissions";
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  CalendarOff,
  Clock,
  Calendar,
  Calculator,
  Receipt,
  FolderOpen,
  Award,
  Megaphone,
  BarChart3,
  FileText,
  Settings,
  Shield,
  UserCheck,
  CheckSquare,
  User,
} from "lucide-react";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard,
  Users,
  CalendarCheck,
  CalendarOff,
  Clock,
  Calendar,
  Calculator,
  Receipt,
  FolderOpen,
  Award,
  Megaphone,
  BarChart3,
  FileText,
  Settings,
  Shield,
  UserCheck,
  CheckSquare,
  User,
};

export default function Sidebar() {
  const { user } = useAuth();
  const navItems: NavItem[] = getNavigationForRole(user?.role || "EMPLOYEE");

  return (
    <aside className="w-64 bg-surface border-r border-slate-200/80 flex flex-col h-screen sticky top-0 select-none">
      {/* Brand Header */}
      <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-200/80">
        <img
          src="/src/assets/attendlogo.png"
          alt="EMS Logo"
          className="h-8 w-auto object-contain"
        />
        <div>
          <span className="font-bold text-base tracking-tight text-primary">
            EMS Enterprise
          </span>
          <span className="block text-[10px] font-semibold text-text-muted uppercase tracking-wider">
            Workforce 2026
          </span>
        </div>
      </div>

      {/* Role Pill Banner */}
      <div className="px-6 py-3 bg-slate-50/70 border-b border-slate-100 flex items-center justify-between">
        <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
          Workspace
        </span>
        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
          {user?.role} Portal
        </span>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = ICON_MAP[item.iconName] || LayoutDashboard;
          return (
            <NavLink
              key={item.href}
              to={item.href}
              end={item.href === "/"}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                  isActive
                    ? "bg-primary text-white shadow-xs font-semibold"
                    : "text-slate-600 hover:text-text-main hover:bg-slate-100"
                }`
              }
            >
              <div className="flex items-center gap-3">
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
              </div>
              {item.badge && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-accent/20 text-accent">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
