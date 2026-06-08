import React from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useApp, currentUserByRole } from "@/lib/store";
import {
  LayoutDashboard, Users, Briefcase, Calendar as CalendarIcon, Clock, CheckSquare,
  ListTodo, FolderLock, Eye, FileEdit, Receipt, BarChart3, GraduationCap,
  Bot, AlertTriangle, HeartPulse, TrendingUp, Settings, ChevronsLeft, ChevronsRight, Sparkles,
} from "lucide-react";

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/clients", label: "Clients", icon: Users },
  { to: "/engagements", label: "Engagements", icon: Briefcase },
  { to: "/resources", label: "Resource Allocation", icon: CalendarIcon },
  { to: "/time", label: "Time Tracking", icon: Clock },
  { to: "/time-approval", label: "Time Approval", icon: CheckSquare },
  { to: "/tasks", label: "Task Manager", icon: ListTodo },
  { to: "/documents", label: "Document Vault", icon: FolderLock },
  { to: "/portal-preview", label: "Client Portal Preview", icon: Eye },
  { to: "/forms", label: "Forms & Templates", icon: FileEdit },
  { to: "/billing", label: "Billing & Invoices", icon: Receipt },
  { to: "/reports", label: "Reports", icon: BarChart3 },
  { to: "/learning", label: "Learning Center", icon: GraduationCap },
  { to: "/ai-assistant", label: "AI Assistant", icon: Bot },
  { to: "/tax-deadlines", label: "Tax Deadline Tracker", icon: AlertTriangle },
  { to: "/client-health", label: "Client Health", icon: HeartPulse },
  { to: "/profitability", label: "Engagement Profitability", icon: TrendingUp },
  { to: "/ai-allocation/existing", label: "AI Staff Allocation", icon: Sparkles },
  { to: "/admin", label: "Admin Settings", icon: Settings },
];

export const Sidebar = () => {
  const { sidebarCollapsed, setSidebarCollapsed, role } = useApp();
  const user = currentUserByRole(role);

  return (
    <aside
      data-testid="app-sidebar"
      className={cn(
        "fixed inset-y-0 left-0 z-30 flex flex-col border-r border-border bg-card transition-all duration-200",
        sidebarCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Brand */}
      <div className={cn("flex items-center h-16 border-b border-border", sidebarCollapsed ? "justify-center px-0" : "px-4")}>
        {sidebarCollapsed ? (
          <div className="h-10 w-10 rounded-md overflow-hidden flex items-center justify-center shrink-0">
            <img
              src="/capactix-logo.webp"
              alt="CapActix"
              className="h-10 w-auto object-cover object-left max-w-[40px]"
            />
          </div>
        ) : (
          <div className="flex items-center gap-2 min-w-0">
            <img
              src="/capactix-logo.webp"
              alt="CapActix"
              className="h-9 w-auto object-contain shrink-0"
              data-testid="brand-logo"
            />
            <span className="text-sm font-semibold text-muted-foreground border-l border-border pl-2 tracking-tight whitespace-nowrap">PMS</span>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto scrollbar-thin py-3 px-2">
        {NAV.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              data-testid={`sidebar-nav-${item.label.toLowerCase().replace(/\s+/g, "-").replace(/&/g, "and")}`}
              className={({ isActive }) =>
                cn(
                  "group flex items-center gap-3 rounded-md px-3 py-2 mb-0.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )
              }
              title={sidebarCollapsed ? item.label : undefined}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-border p-3">
        <div className={cn("flex items-center gap-2", sidebarCollapsed && "justify-center")}>
          <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold shrink-0">
            {user.initials}
          </div>
          {!sidebarCollapsed && (
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold truncate">{user.name}</div>
              <div className="text-[10px] text-muted-foreground truncate">{role} · {user.title}</div>
            </div>
          )}
          <button
            data-testid="sidebar-collapse-toggle"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="h-7 w-7 rounded-md hover:bg-muted flex items-center justify-center text-muted-foreground"
          >
            {sidebarCollapsed ? <ChevronsRight className="h-4 w-4" /> : <ChevronsLeft className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
