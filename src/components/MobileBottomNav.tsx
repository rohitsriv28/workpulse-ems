import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getNavigationForRole } from "../lib/permissions";
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  CalendarOff,
  Receipt,
  MoreHorizontal,
  X,
  Settings,
  Shield,
  Clock,
  Award,
  Calculator,
  FolderOpen,
  Megaphone,
  BarChart3,
  FileText,
  User,
} from "lucide-react";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard,
  Users,
  CalendarCheck,
  CalendarOff,
  Receipt,
  Settings,
  Shield,
  Clock,
  Award,
  Calculator,
  FolderOpen,
  Megaphone,
  BarChart3,
  FileText,
  User,
};

export default function MobileBottomNav() {
  const { user } = useAuth();
  const [showMore, setShowMore] = useState(false);
  const navItems = getNavigationForRole(user?.role || "EMPLOYEE");

  // First 4 items go to the bottom bar, remainder accessible in 'More' menu
  const primaryItems = navItems.slice(0, 4);

  return (
    <>
      {/* Mobile Slide-Up 'More' Menu */}
      {showMore && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end bg-slate-900/50 backdrop-blur-xs md:hidden">
          <div className="bg-surface rounded-t-3xl p-6 border-t border-slate-200 shadow-2xl max-h-[75vh] overflow-y-auto animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div>
                <h3 className="text-base font-bold text-text-main">
                  All Navigation
                </h3>
                <p className="text-xs text-text-muted">
                  {user?.role} Workspace Directory
                </p>
              </div>
              <button
                onClick={() => setShowMore(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {navItems.map((item) => {
                const Icon = ICON_MAP[item.iconName] || LayoutDashboard;
                return (
                  <NavLink
                    key={item.href}
                    to={item.href}
                    end={item.href === "/"}
                    onClick={() => setShowMore(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-2.5 p-3 rounded-xl border text-xs font-semibold transition-all ${
                        isActive
                          ? "bg-primary text-white border-primary"
                          : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                      }`
                    }
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{item.name}</span>
                  </NavLink>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Main Bottom Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-surface border-t border-slate-200 flex items-center justify-around z-40 px-2 shadow-lg">
        {primaryItems.map((item) => {
          const Icon = ICON_MAP[item.iconName] || LayoutDashboard;
          return (
            <NavLink
              key={item.href}
              to={item.href}
              end={item.href === "/"}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center w-14 h-12 rounded-xl transition-all ${
                  isActive
                    ? "text-primary font-bold"
                    : "text-slate-500 hover:text-text-main"
                }`
              }
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span className="text-[10px] truncate max-w-[56px]">
                {item.name}
              </span>
            </NavLink>
          );
        })}

        {/* More Button */}
        <button
          onClick={() => setShowMore(true)}
          className="flex flex-col items-center justify-center w-14 h-12 rounded-xl text-slate-500 hover:text-text-main"
        >
          <MoreHorizontal className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">More</span>
        </button>
      </nav>
    </>
  );
}
