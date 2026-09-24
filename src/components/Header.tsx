import { useAuth } from "../context/AuthContext";
import { UserCircle } from "lucide-react";

export default function Header() {
  const { user } = useAuth();

  return (
    <header className="h-16 bg-surface border-b border-gray-200 flex items-center justify-between px-6 shadow-sm z-10">
      <h2 className="text-lg font-semibold text-text-main">
        Welcome back, {user?.name || "Admin"}
      </h2>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-text-main">
              {user?.name || "Admin User"}
            </p>
            <p className="text-xs text-text-muted">
              {user?.role || "Administrator"}
            </p>
          </div>
          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-text-muted">
            <UserCircle className="w-6 h-6" />
          </div>
        </div>
      </div>
    </header>
  );
}
