import { useState } from "react";
import { DashboardHeader } from "./DashboardHeader";
import { DashboardSidebar } from "./DashboardSidebar";

export function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar - controlled by state */}
      <DashboardSidebar open={sidebarOpen} onOpenChange={setSidebarOpen} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header - with menu toggle button */}
        <DashboardHeader onMenuClick={() => setSidebarOpen((prev) => !prev)} />

        {/* Content Area - scrollable */}
        <main className="flex-1 overflow-auto">
          <div className="p-4 pt-6 md:p-8 mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
