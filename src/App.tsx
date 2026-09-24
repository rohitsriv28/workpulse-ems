import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import ProtectedRoute from "./features/auth/ProtectedRoute";
import LoginPage from "./features/auth/LoginPage";
import ForgotPasswordPage from "./features/auth/ForgotPasswordPage";

// Lazy-loaded route components for performance & code splitting
const Dashboard = lazy(() => import("./pages/Dashboard"));
const AttendancePage = lazy(() => import("./pages/AttendancePage"));
const MyAttendance = lazy(() => import("./features/attendance/MyAttendance"));
const EmployeesPage = lazy(() => import("./pages/EmployeesPage"));
const ReportsPage = lazy(() => import("./pages/ReportsPage"));
const AuditLogsPage = lazy(() => import("./pages/AuditLogsPage"));
const LeaveManagementPage = lazy(
  () => import("./features/leave/LeaveManagementPage"),
);
const MyLeavePage = lazy(() => import("./features/leave/MyLeavePage"));
const LeaveApprovalsPage = lazy(
  () => import("./features/leave/LeaveApprovalsPage"),
);
const SchedulesPage = lazy(() => import("./features/schedules/SchedulesPage"));
const MySchedulePage = lazy(
  () => import("./features/schedules/MySchedulePage"),
);
const HolidayCalendarPage = lazy(
  () => import("./features/holidays/HolidayCalendarPage"),
);
const PayrollPage = lazy(() => import("./features/payroll/PayrollPage"));
const MyPayslipsPage = lazy(() => import("./features/payroll/MyPayslipsPage"));
const DocumentsPage = lazy(() => import("./features/documents/DocumentsPage"));
const MyDocumentsPage = lazy(
  () => import("./features/documents/MyDocumentsPage"),
);
const PerformancePage = lazy(
  () => import("./features/performance/PerformancePage"),
);
const MyPerformancePage = lazy(
  () => import("./features/performance/MyPerformancePage"),
);
const AnnouncementsPage = lazy(
  () => import("./features/announcements/AnnouncementsPage"),
);
const SettingsPage = lazy(() => import("./features/settings/SettingsPage"));
const UserProfilePage = lazy(() => import("./pages/UserProfilePage"));

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[300px]">
      <div className="flex flex-col items-center gap-2">
        <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
        <span className="text-xs text-text-muted font-medium">
          Loading view...
        </span>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* Authenticated Application Shell */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route
            index
            element={
              <Suspense fallback={<PageLoader />}>
                <Dashboard />
              </Suspense>
            }
          />

          {/* Employee Directory & Team */}
          <Route
            path="employees"
            element={
              <Suspense fallback={<PageLoader />}>
                <EmployeesPage />
              </Suspense>
            }
          />
          <Route
            path="team"
            element={
              <Suspense fallback={<PageLoader />}>
                <EmployeesPage />
              </Suspense>
            }
          />
          <Route
            path="users"
            element={
              <Suspense fallback={<PageLoader />}>
                <EmployeesPage />
              </Suspense>
            }
          />

          {/* Attendance Routes */}
          <Route
            path="attendance"
            element={
              <Suspense fallback={<PageLoader />}>
                <AttendancePage />
              </Suspense>
            }
          />
          <Route
            path="team-attendance"
            element={
              <Suspense fallback={<PageLoader />}>
                <AttendancePage />
              </Suspense>
            }
          />
          <Route
            path="my-attendance"
            element={
              <Suspense fallback={<PageLoader />}>
                <MyAttendance />
              </Suspense>
            }
          />

          {/* Leave Management Routes */}
          <Route
            path="leave"
            element={
              <Suspense fallback={<PageLoader />}>
                <LeaveManagementPage />
              </Suspense>
            }
          />
          <Route
            path="my-leave"
            element={
              <Suspense fallback={<PageLoader />}>
                <MyLeavePage />
              </Suspense>
            }
          />
          <Route
            path="leave-approvals"
            element={
              <Suspense fallback={<PageLoader />}>
                <LeaveApprovalsPage />
              </Suspense>
            }
          />

          {/* Schedules & Shifts */}
          <Route
            path="schedules"
            element={
              <Suspense fallback={<PageLoader />}>
                <SchedulesPage />
              </Suspense>
            }
          />
          <Route
            path="my-schedule"
            element={
              <Suspense fallback={<PageLoader />}>
                <MySchedulePage />
              </Suspense>
            }
          />

          {/* Holidays */}
          <Route
            path="holidays"
            element={
              <Suspense fallback={<PageLoader />}>
                <HolidayCalendarPage />
              </Suspense>
            }
          />

          {/* Payroll & Compensation */}
          <Route
            path="payroll"
            element={
              <Suspense fallback={<PageLoader />}>
                <PayrollPage />
              </Suspense>
            }
          />
          <Route
            path="my-payslips"
            element={
              <Suspense fallback={<PageLoader />}>
                <MyPayslipsPage />
              </Suspense>
            }
          />

          {/* Documents */}
          <Route
            path="documents"
            element={
              <Suspense fallback={<PageLoader />}>
                <DocumentsPage />
              </Suspense>
            }
          />
          <Route
            path="my-documents"
            element={
              <Suspense fallback={<PageLoader />}>
                <MyDocumentsPage />
              </Suspense>
            }
          />

          {/* Performance & Goals */}
          <Route
            path="performance"
            element={
              <Suspense fallback={<PageLoader />}>
                <PerformancePage />
              </Suspense>
            }
          />
          <Route
            path="my-performance"
            element={
              <Suspense fallback={<PageLoader />}>
                <MyPerformancePage />
              </Suspense>
            }
          />

          {/* Announcements */}
          <Route
            path="announcements"
            element={
              <Suspense fallback={<PageLoader />}>
                <AnnouncementsPage />
              </Suspense>
            }
          />

          {/* Reports & Analytics */}
          <Route
            path="reports"
            element={
              <Suspense fallback={<PageLoader />}>
                <ReportsPage />
              </Suspense>
            }
          />

          {/* Audit Logs */}
          <Route
            path="audit-logs"
            element={
              <Suspense fallback={<PageLoader />}>
                <AuditLogsPage />
              </Suspense>
            }
          />

          {/* System Settings & User Profile */}
          <Route
            path="settings"
            element={
              <Suspense fallback={<PageLoader />}>
                <SettingsPage />
              </Suspense>
            }
          />
          <Route
            path="roles"
            element={
              <Suspense fallback={<PageLoader />}>
                <SettingsPage />
              </Suspense>
            }
          />
          <Route
            path="profile"
            element={
              <Suspense fallback={<PageLoader />}>
                <UserProfilePage />
              </Suspense>
            }
          />

          {/* Catch-all 404 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
