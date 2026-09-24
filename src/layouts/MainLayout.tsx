import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import MobileBottomNav from "../components/MobileBottomNav";

export default function MainLayout() {
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <Header />
        <main className="flex-1 overflow-auto p-4 md:p-6 mb-16 md:mb-0">
          <Outlet />
        </main>
        <footer className="hidden md:block py-3 px-6 text-center text-xs text-text-muted border-t border-gray-100 bg-surface">
          <p>
            &copy; {new Date().getFullYear()} Attendance Management System. All
            rights reserved.
          </p>
        </footer>
        <MobileBottomNav />
      </div>
    </div>
  );
}
