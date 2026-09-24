import type { Role, Permission, UserSession } from "../types";

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  ADMIN: [
    "view:own_profile",
    "edit:own_profile",
    "manage:users",
    "manage:roles",
    "view:all_employees",
    "manage:employees",
    "view:team_employees",
    "view:own_attendance",
    "view:org_attendance",
    "view:team_attendance",
    "mark:employee_attendance",
    "review:attendance_corrections",
    "manage:schedules",
    "view:schedules",
    "manage:leave_policies",
    "view:own_payslips",
    "view:employee_payroll",
    "process:payroll",
    "lock:payroll",
    "manage:documents",
    "view:own_documents",
    "manage:performance",
    "view:reports",
    "view:audit_logs",
    "manage:notifications",
    "manage:system_settings",
    "access:ai_assistant",
  ],
  HR: [
    "view:own_profile",
    "edit:own_profile",
    "view:all_employees",
    "manage:employees",
    "view:team_employees",
    "view:own_attendance",
    "view:org_attendance",
    "view:team_attendance",
    "record:own_attendance",
    "mark:employee_attendance",
    "review:attendance_corrections",
    "manage:schedules",
    "view:schedules",
    "apply:leave",
    "approve:team_leave",
    "manage:leave_policies",
    "view:own_payslips",
    "view:employee_payroll",
    "process:payroll",
    "lock:payroll",
    "manage:documents",
    "view:own_documents",
    "manage:performance",
    "view:reports",
    "view:audit_logs",
    "manage:notifications",
    "manage:system_settings",
    "access:ai_assistant",
  ],
  MANAGER: [
    "view:own_profile",
    "edit:own_profile",
    "view:team_employees",
    "view:own_attendance",
    "view:team_attendance",
    "record:own_attendance",
    "review:attendance_corrections",
    "view:schedules",
    "apply:leave",
    "approve:team_leave",
    "view:own_payslips",
    "manage:documents",
    "view:own_documents",
    "manage:performance",
    "view:own_performance",
    "view:reports",
    "access:ai_assistant",
  ],
  EMPLOYEE: [
    "view:own_profile",
    "edit:own_profile",
    "view:own_attendance",
    "record:own_attendance",
    "view:schedules",
    "apply:leave",
    "view:own_payslips",
    "view:own_documents",
    "view:own_performance",
    "access:ai_assistant",
  ],
};

export function hasPermission(
  user: UserSession | null,
  permission: Permission,
): boolean {
  if (!user) return false;
  return user.permissions.includes(permission);
}

export interface NavItem {
  name: string;
  href: string;
  iconName: string;
  badge?: string;
}

export function getNavigationForRole(role: Role): NavItem[] {
  switch (role) {
    case "ADMIN":
      return [
        { name: "Dashboard", href: "/", iconName: "LayoutDashboard" },
        { name: "Users & Accounts", href: "/users", iconName: "UserCheck" },
        { name: "Roles & Permissions", href: "/roles", iconName: "Shield" },
        { name: "Employees", href: "/employees", iconName: "Users" },
        { name: "Attendance", href: "/attendance", iconName: "CalendarCheck" },
        { name: "Holidays", href: "/holidays", iconName: "Calendar" },
        { name: "Payroll", href: "/payroll", iconName: "Receipt" },
        { name: "Reports", href: "/reports", iconName: "BarChart3" },
        { name: "Audit Logs", href: "/audit-logs", iconName: "FileText" },
        { name: "Settings", href: "/settings", iconName: "Settings" },
      ];
    case "HR":
      return [
        { name: "Dashboard", href: "/", iconName: "LayoutDashboard" },
        { name: "Employees", href: "/employees", iconName: "Users" },
        { name: "Attendance", href: "/attendance", iconName: "CalendarCheck" },
        { name: "Leave Management", href: "/leave", iconName: "CalendarOff" },
        { name: "Schedules", href: "/schedules", iconName: "Clock" },
        { name: "Holidays", href: "/holidays", iconName: "Calendar" },
        { name: "Payroll Run", href: "/payroll", iconName: "Calculator" },
        { name: "Documents", href: "/documents", iconName: "FolderOpen" },
        { name: "Performance", href: "/performance", iconName: "Award" },
        {
          name: "Announcements",
          href: "/announcements",
          iconName: "Megaphone",
        },
        { name: "Reports", href: "/reports", iconName: "BarChart3" },
      ];
    case "MANAGER":
      return [
        { name: "Dashboard", href: "/", iconName: "LayoutDashboard" },
        { name: "My Team", href: "/team", iconName: "Users" },
        {
          name: "Team Attendance",
          href: "/team-attendance",
          iconName: "CalendarCheck",
        },
        {
          name: "Leave Approvals",
          href: "/leave-approvals",
          iconName: "CheckSquare",
        },
        { name: "Team Schedule", href: "/schedules", iconName: "Clock" },
        { name: "Performance", href: "/performance", iconName: "Award" },
        { name: "Team Reports", href: "/reports", iconName: "BarChart3" },
        {
          name: "Announcements",
          href: "/announcements",
          iconName: "Megaphone",
        },
        { name: "My Profile", href: "/profile", iconName: "User" },
      ];
    case "EMPLOYEE":
    default:
      return [
        { name: "Dashboard", href: "/", iconName: "LayoutDashboard" },
        {
          name: "My Attendance",
          href: "/my-attendance",
          iconName: "CalendarCheck",
        },
        { name: "My Leave", href: "/my-leave", iconName: "CalendarOff" },
        { name: "My Schedule", href: "/my-schedule", iconName: "Clock" },
        { name: "My Payslips", href: "/my-payslips", iconName: "Receipt" },
        { name: "My Documents", href: "/my-documents", iconName: "FolderOpen" },
        { name: "My Performance", href: "/my-performance", iconName: "Award" },
        {
          name: "Announcements",
          href: "/announcements",
          iconName: "Megaphone",
        },
        { name: "My Profile", href: "/profile", iconName: "User" },
      ];
  }
}
