import React, { useState } from "react";
import { Search, Bell, Moon, Sun, ChevronDown } from "lucide-react";
import { useApp, currentUserByRole } from "@/lib/store";
import { cn } from "@/lib/utils";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { NOTIFICATIONS } from "@/lib/seed";
import { StatusBadge } from "@/components/common/StatusBadge";

export const Header = () => {
  const { theme, toggleTheme, role, setRole, roles, sidebarCollapsed } = useApp();
  const user = currentUserByRole(role);
  const [notifOpen, setNotifOpen] = useState(false);
  const unread = NOTIFICATIONS.filter((n) => n.unread).length;

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

          {/* User */}
          <div className="hidden md:flex items-center gap-2 pl-2 ml-1 border-l border-border h-9">
            <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold">
              {user.initials}
            </div>
            <div className="hidden lg:block leading-tight">
              <div className="text-xs font-semibold">{user.name}</div>
              <div className="text-[10px] text-muted-foreground">{user.title}</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
