import React from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";

export const AppLayout = () => {
  const { sidebarCollapsed } = useApp();
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Sidebar />
      <Header />
      <main
        className={cn(
          "pt-16 transition-all duration-200 min-h-screen",
          sidebarCollapsed ? "pl-16" : "pl-64"
        )}
      >
        <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
          <Outlet />
        </div>
      </main>
      <Toaster position="bottom-right" />
    </div>
  );
};

export default AppLayout;
