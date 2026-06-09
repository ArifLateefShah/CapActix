import React, { useState } from "react";
import { Search, Bell, Moon, Sun, ChevronDown, LogOut, ShieldCheck } from "lucide-react";
import { useApp, currentUserByRole } from "@/lib/store";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { NOTIFICATIONS } from "@/lib/seed";

export const Header = () => {
  const { theme, toggleTheme, role, setRole, roles, sidebarCollapsed } = useApp();
  const { user: authUser, logout } = useAuth();
  const personaUser = currentUserByRole(role);
  const [notifOpen, setNotifOpen] = useState(false);
  const unread = NOTIFICATIONS.filter((n) => n.unread).length;
  const initials = (authUser?.full_name || authUser?.email || "?")
    .split(/[\s.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("") || "?";

  return (
    <header
      data-testid="app-header"
      className={cn(
        "fixed top-0 right-0 z-20 h-16 border-b border-border bg-background/95 backdrop-blur transition-all",
        sidebarCollapsed ? "left-16" : "left-64"
      )}
    >
      <div className="h-full flex items-center justify-between px-6 gap-4">
        {/* Search */}
        <div className="flex-1 max-w-md relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            data-testid="header-search"
            placeholder="Search clients, engagements, tasks..."
            className="w-full pl-10 pr-3 h-9 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/30"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Role switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button data-testid="role-switcher" variant="outline" size="sm" className="h-9 gap-1.5">
                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-primary/10 text-primary">{role}</span>
                <ChevronDown className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>View as role</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {roles.map((r) => (
                <DropdownMenuItem
                  key={r}
                  data-testid={`role-option-${r.toLowerCase()}`}
                  onClick={() => setRole(r)}
                  className={cn("cursor-pointer", role === r && "bg-muted")}
                >
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{r}</span>
                    <span className="text-[10px] text-muted-foreground">{currentUserByRole(r).name}</span>
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Theme */}
          <Button
            data-testid="theme-toggle"
            variant="ghost"
            size="icon"
            className="h-9 w-9"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </Button>

          {/* Notifications */}
          <DropdownMenu open={notifOpen} onOpenChange={setNotifOpen}>
            <DropdownMenuTrigger asChild>
              <Button data-testid="header-notifications" variant="ghost" size="icon" className="h-9 w-9 relative">
                <Bell className="h-4 w-4" />
                {unread > 0 && (
                  <span className="absolute top-1.5 right-1.5 h-4 min-w-4 px-1 rounded-full bg-red-600 text-white text-[9px] font-bold flex items-center justify-center">
                    {unread}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel className="flex items-center justify-between">
                Notifications <span className="text-[10px] text-muted-foreground">{unread} new</span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {NOTIFICATIONS.map((n) => (
                <DropdownMenuItem key={n.id} className="flex flex-col items-start gap-0.5 py-2">
                  <div className="flex items-center gap-2 w-full">
                    {n.unread && <div className="h-2 w-2 rounded-full bg-primary" />}
                    <span className="text-sm font-medium flex-1">{n.title}</span>
                    <span className="text-[10px] text-muted-foreground">{n.time}</span>
                  </div>
                  <span className="text-xs text-muted-foreground line-clamp-1 pl-4">{n.desc}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User (authenticated) */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                data-testid="user-menu-trigger"
                className="hidden md:flex items-center gap-2 pl-2 ml-1 border-l border-border h-9 hover:bg-muted/40 rounded-r-md pr-2 transition-colors"
              >
                <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold">
                  {initials}
                </div>
                <div className="hidden lg:block leading-tight text-left">
                  <div className="text-xs font-semibold flex items-center gap-1">
                    {authUser?.full_name || personaUser.name}
                    {authUser?.is_admin && <ShieldCheck className="h-3 w-3 text-primary" />}
                  </div>
                  <div className="text-[10px] text-muted-foreground truncate max-w-[160px]">
                    {authUser?.email || personaUser.title}
                  </div>
                </div>
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground hidden lg:block" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="flex flex-col gap-0.5">
                <span className="text-sm">{authUser?.full_name || "Signed in"}</span>
                <span className="text-[10px] text-muted-foreground font-normal truncate">{authUser?.email}</span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {authUser?.is_admin && (
                <DropdownMenuItem className="text-[11px] text-muted-foreground cursor-default focus:bg-transparent" disabled>
                  <ShieldCheck className="h-3 w-3 mr-1.5 text-primary" /> Admin
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                data-testid="user-menu-logout"
                onClick={logout}
                className="cursor-pointer text-red-600 focus:text-red-700"
              >
                <LogOut className="h-4 w-4 mr-2" /> Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
