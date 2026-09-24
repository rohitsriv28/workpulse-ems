import { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import {
  Bell,
  Search,
  Sparkles,
  LogOut,
  User,
  Settings,
  Shield,
  Calendar,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Role } from "../types";
import { getStore } from "../lib/api/store";

interface HeaderProps {
  onOpenAI: () => void;
}

export default function Header({ onOpenAI }: HeaderProps) {
  const { user, logout, switchRole } = useAuth();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const store = getStore();
  const notifications = store.notifications;
  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        notifRef.current &&
        !notifRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    switchRole(e.target.value as Role);
  };

  const getRoleBadgeColor = (role?: Role) => {
    switch (role) {
      case "ADMIN":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "HR":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "MANAGER":
        return "bg-amber-100 text-amber-700 border-amber-200";
      default:
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
    }
  };

  return (
    <header className="h-16 bg-surface border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
      {/* Search Input */}
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search employees, policies, requests..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-text-main placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Role Switcher Pill for Demo */}
        <div className="hidden sm:flex items-center gap-1.5 bg-slate-100/80 px-2.5 py-1 rounded-xl border border-slate-200 text-xs">
          <Shield className="w-3.5 h-3.5 text-primary" />
          <span className="text-[11px] font-medium text-text-muted">
            Persona:
          </span>
          <select
            value={user?.role || "EMPLOYEE"}
            onChange={handleRoleChange}
            aria-label="Select Persona"
            className="bg-transparent font-semibold text-text-main focus:outline-hidden cursor-pointer"
          >
            <option value="ADMIN">Admin (CTO)</option>
            <option value="HR">HR Business Partner</option>
            <option value="MANAGER">Manager (Engineering)</option>
            <option value="EMPLOYEE">Employee (Senior Dev)</option>
          </select>
        </div>

        {/* AI Assistant Button */}
        <button
          onClick={onOpenAI}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-600 to-primary text-white text-xs font-semibold rounded-xl shadow-xs hover:shadow-sm hover:opacity-95 transition-all cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 animate-pulse text-amber-300" />
          <span className="hidden sm:inline">Ask HR AI</span>
        </button>

        {/* Notifications Popover */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label="View Notifications"
            className="p-2 text-slate-500 hover:text-text-main hover:bg-slate-100 rounded-xl transition-colors relative cursor-pointer"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full ring-2 ring-white" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-surface rounded-2xl shadow-xl border border-slate-200 p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-2">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-semibold text-text-main">
                    Notifications
                  </h4>
                  {unreadCount > 0 && (
                    <span className="text-[10px] bg-primary/10 text-primary font-bold px-2 py-0.5 rounded-full">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                <button
                  onClick={() => navigate("/announcements")}
                  className="text-xs text-primary hover:underline font-medium"
                >
                  View Announcements
                </button>
              </div>

              <div className="space-y-2 max-h-72 overflow-y-auto">
                {notifications.slice(0, 5).map((n) => (
                  <div
                    key={n.id}
                    onClick={() => {
                      if (n.targetUrl) navigate(n.targetUrl);
                      setShowNotifications(false);
                    }}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      n.read
                        ? "bg-slate-50/50 border-slate-100 text-text-muted"
                        : "bg-blue-50/40 border-blue-100 text-text-main hover:bg-blue-50/70"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs font-semibold">{n.title}</p>
                      <span className="text-[10px] text-slate-400 whitespace-nowrap">
                        {n.createdAt.slice(11, 16)}
                      </span>
                    </div>
                    <p className="text-xs text-text-muted mt-1 leading-snug">
                      {n.message}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            aria-label="User Profile Menu"
            className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-blue-400 text-white flex items-center justify-center font-bold text-xs shadow-2xs">
              {user?.name
                ?.split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2) || "U"}
            </div>
            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-semibold text-text-main line-clamp-1">
                {user?.name}
              </span>
              <span
                className={`text-[10px] font-medium border px-1.5 py-0.2 rounded-full w-fit ${getRoleBadgeColor(
                  user?.role,
                )}`}
              >
                {user?.role}
              </span>
            </div>
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-surface rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-2.5 border-b border-slate-100 mb-1">
                <p className="text-sm font-semibold text-text-main">
                  {user?.name}
                </p>
                <p className="text-xs text-text-muted truncate">
                  {user?.email}
                </p>
                <div className="mt-1 text-[11px] text-primary font-medium">
                  {user?.department} • {user?.designation}
                </div>
              </div>

              <button
                onClick={() => {
                  navigate("/profile");
                  setShowProfileMenu(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-xl transition-colors text-left"
              >
                <User className="w-4 h-4 text-slate-400" />
                My Profile
              </button>

              <button
                onClick={() => {
                  navigate("/holidays");
                  setShowProfileMenu(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-xl transition-colors text-left"
              >
                <Calendar className="w-4 h-4 text-slate-400" />
                Holidays Calendar
              </button>

              <button
                onClick={() => {
                  navigate("/settings");
                  setShowProfileMenu(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-xl transition-colors text-left"
              >
                <Settings className="w-4 h-4 text-slate-400" />
                Settings & Preferences
              </button>

              <div className="border-t border-slate-100 my-1" />

              <button
                onClick={logout}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-xl transition-colors text-left"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
