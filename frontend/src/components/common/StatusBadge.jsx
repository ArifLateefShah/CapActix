import React from "react";
import { cn } from "@/lib/utils";

const MAP = {
  Active: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  Inactive: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  Pending: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
  Approved: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
  Rejected: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  Draft: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  Sent: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  Paid: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
  Overdue: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  "On Track": "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
  "At Risk": "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
  Critical: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  Healthy: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
  Profitable: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
  "Break-Even": "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  Loss: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  Optimal: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
  "Needs Review": "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
  "Not Started": "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  "In Progress": "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  Review: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
  Done: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
  Completed: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
  Low: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  Medium: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  High: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
};

export const StatusBadge = ({ status, className }) => {
  const cls = MAP[status] || "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";
  return (
    <span
      data-testid={`status-badge-${String(status).toLowerCase().replace(/\s+/g, "-")}`}
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold tracking-wide whitespace-nowrap",
        cls,
        className
      )}
    >
      {status}
    </span>
  );
};

export default StatusBadge;
