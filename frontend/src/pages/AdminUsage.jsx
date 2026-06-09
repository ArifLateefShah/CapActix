import React, { useEffect, useState } from "react";
import api, { formatApiError } from "@/lib/api";
import PageHeader from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, Clock, ChevronDown, ChevronRight, Loader2, RefreshCw } from "lucide-react";

const fmt = (iso) => {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    year: "numeric", month: "short", day: "2-digit",
    hour: "2-digit", minute: "2-digit",
  });
};

const Row = ({ row }) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <tr className="border-t border-border hover:bg-muted/30 transition-colors" data-testid={`usage-row-${row.email}`}>
        <td className="py-3 px-4">
          <button
            onClick={() => setOpen((o) => !o)}
            className="flex items-center gap-2 text-left"
            data-testid={`usage-toggle-${row.email}`}
          >
            {open ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
            <div>
              <div className="text-sm font-medium">{row.full_name}</div>
              <div className="text-xs text-muted-foreground">{row.email}</div>
            </div>
          </button>
        </td>
        <td className="py-3 px-4 text-sm tabular-nums">{fmt(row.created_at)}</td>
        <td className="py-3 px-4 text-sm tabular-nums">{fmt(row.last_login_at)}</td>
        <td className="py-3 px-4 text-sm tabular-nums">{row.login_count}</td>
      </tr>
      {open && (
        <tr className="bg-muted/20">
          <td colSpan={4} className="px-4 py-3" data-testid={`usage-history-${row.email}`}>
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-2">Login History (latest 50)</div>
            {row.login_history.length === 0 ? (
              <div className="text-xs text-muted-foreground italic">No logins recorded yet.</div>
            ) : (
              <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1 text-xs tabular-nums">
                {row.login_history.map((t, i) => (
                  <li key={i} className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-3 w-3 shrink-0" /> {fmt(t)}
                  </li>
                ))}
              </ul>
            )}
          </td>
        </tr>
      )}
    </>
  );
};

const StatCard = ({ icon: Icon, label, value, testid }) => (
  <Card data-testid={testid}>
    <CardContent className="pt-5">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
          <div className="text-3xl font-bold mt-1 tabular-nums">{value}</div>
        </div>
        <div className="h-10 w-10 rounded-md bg-primary/10 text-primary flex items-center justify-center">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </CardContent>
  </Card>
);

const AdminUsage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/admin/usage");
      setData(data);
    } catch (err) {
      setError(formatApiError(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, []);

  const totalUsers = data?.total_users ?? 0;
  const totalLogins = data?.total_logins ?? 0;
  const last24h = data?.active_last_24h ?? 0;

  return (
    <div className="space-y-6" data-testid="admin-usage-page">
      <PageHeader
        title="Admin Usage"
        description="User registrations, logins, and access history."
        actions={
          <button
            onClick={load}
            disabled={loading}
            className="inline-flex items-center gap-2 h-9 px-3 rounded-md border border-input bg-background text-sm hover:bg-muted disabled:opacity-50"
            data-testid="admin-usage-refresh"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Refresh
          </button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard icon={Users} label="Total Registered Users" value={totalUsers} testid="stat-total-users" />
        <StatCard icon={UserCheck} label="Active Last 24h" value={last24h} testid="stat-active-24h" />
        <StatCard icon={Clock} label="Total Logins" value={totalLogins} testid="stat-total-logins" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Users</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading…
            </div>
          ) : error ? (
            <div className="text-sm text-red-600 bg-red-50 dark:bg-red-950/40 rounded-md p-3" data-testid="admin-usage-error">{error}</div>
          ) : !data?.rows?.length ? (
            <div className="text-sm text-muted-foreground italic py-8 text-center">
              No users yet. Once people sign up, they&apos;ll appear here.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground">
                    <th className="py-2 px-4">User</th>
                    <th className="py-2 px-4">Registered</th>
                    <th className="py-2 px-4">Last Login</th>
                    <th className="py-2 px-4">Logins</th>
                  </tr>
                </thead>
                <tbody data-testid="admin-usage-tbody">
                  {data.rows.map((r) => <Row key={r.id} row={r} />)}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUsage;
