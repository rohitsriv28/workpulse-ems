import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import MobileBottomNav from "../components/MobileBottomNav";
import { HRAssistantDrawer } from "../features/ai/HRAssistantDrawer";

export default function MainLayout() {
  const [isAIOpen, setIsAIOpen] = useState(false);

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex shrink-0">
        <Sidebar />
      </div>

      {/* Main Area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Header onOpenAI={() => setIsAIOpen(true)} />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 pb-20 md:pb-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>

        {/* Mobile Navigation */}
        <MobileBottomNav />
      </div>

      {/* AI Assistant Drawer */}
      <HRAssistantDrawer isOpen={isAIOpen} onClose={() => setIsAIOpen(false)} />
    </div>
  );
}
