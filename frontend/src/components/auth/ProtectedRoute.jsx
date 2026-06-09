import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { Loader2 } from "lucide-react";

export const ProtectedRoute = ({ adminOnly = false }) => {
  const { status, user } = useAuth();
  const location = useLocation();

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (status !== "authenticated") {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (adminOnly && !user?.is_admin) {
    return (
      <div className="p-12 text-center" data-testid="forbidden-screen">
        <h2 className="text-xl font-semibold mb-2">Admin access required</h2>
        <p className="text-sm text-muted-foreground">
          This page is restricted to administrators.
        </p>
      </div>
    );
  }

  return <Outlet />;
};
