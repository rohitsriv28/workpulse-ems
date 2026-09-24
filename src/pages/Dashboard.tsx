import { useAuth } from "../context/AuthContext";
import AdminDashboard from "../features/dashboard/AdminDashboard";
import HRDashboard from "../features/dashboard/HRDashboard";
import ManagerDashboard from "../features/dashboard/ManagerDashboard";
import EmployeeDashboard from "../features/dashboard/EmployeeDashboard";

export default function Dashboard() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-medium text-text-muted">
            Loading your workspace...
          </p>
        </div>
      </div>
    );
  }

  switch (user?.role) {
    case "ADMIN":
      return <AdminDashboard />;
    case "HR":
      return <HRDashboard />;
    case "MANAGER":
      return <ManagerDashboard />;
    case "EMPLOYEE":
    default:
      return <EmployeeDashboard />;
  }
}
