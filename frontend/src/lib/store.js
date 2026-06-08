import React, { createContext, useContext, useEffect, useState } from "react";

const AppContext = createContext(null);

const ROLES = ["Admin", "Approver", "Staff"];

export const AppProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => localStorage.getItem("capactix-pms-theme") || "light");
  const [role, setRole] = useState(() => localStorage.getItem("capactix-pms-role") || "Admin");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    localStorage.setItem("capactix-pms-theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("capactix-pms-role", role);
  }, [role]);

  const value = {
    theme,
    toggleTheme: () => setTheme((t) => (t === "light" ? "dark" : "light")),
    role,
    setRole,
    roles: ROLES,
    sidebarCollapsed,
    setSidebarCollapsed,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
};

export const currentUserByRole = (role) => {
  if (role === "Admin") return { name: "John Carter", initials: "JC", title: "Managing Partner" };
  if (role === "Approver") return { name: "Lisa Park", initials: "LP", title: "Senior Manager" };
  return { name: "Mike Reeves", initials: "MR", title: "Senior Associate" };
};
