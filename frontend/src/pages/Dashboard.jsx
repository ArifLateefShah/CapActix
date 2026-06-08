import React, { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Users, Briefcase, Clock, CheckSquare, DollarSign, TrendingUp, TrendingDown } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts";
import { HOURS_BY_ENGAGEMENT, TASKS, TIME_ENTRIES, RESOURCE_GRID, PROJECT_COMPLETION, LEARNING_PROGRESS } from "@/lib/seed";

const KPI = ({ label, value, delta, icon: Icon, deltaPositive = true, testId }) => (
  <Card data-testid={testId} className="p-5 rounded-lg">
    <div className="flex items-start justify-between">
      <div>
        <div className="text-xs text-muted-foreground font-medium">{label}</div>
        <div className="text-2xl font-bold mt-1 tabular-nums">{value}</div>
      </div>
      <div className="h-9 w-9 rounded-md bg-primary/10 text-primary flex items-center justify-center">
        <Icon className="h-4 w-4" />
      </div>
    </div>
    <div className="mt-3 flex items-center gap-1.5">
      <span className={`inline-flex items-center gap-0.5 text-[11px] font-semibold rounded-full px-1.5 py-0.5 ${deltaPositive ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300" : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"}`}>
        {deltaPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
        {delta}
      </span>
      <span className="text-[11px] text-muted-foreground">vs last month</span>
    </div>
  </Card>
);

const ENG_COLORS = ["#234C82", "#446F8A", "#5C8A6F", "#A57E3B", "#A55B4A"];
const ENG_KEYS = ["A-2025-001", "A-2025-002", "A-2025-003", "A-2025-005", "A-2025-006"];

const ResourceGrid = () => (
  <Card className="p-5">
    <div className="flex items-center justify-between mb-4">
      <div>
        <h3 className="text-base font-semibold">Resource Availability</h3>
        <p className="text-xs text-muted-foreground">14-day rolling window</p>
      </div>
      <div className="flex items-center gap-3 text-[11px]">
        <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-sm bg-emerald-500" /> Available</span>
        <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-sm bg-amber-500" /> Partial</span>
        <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-sm bg-red-500" /> Full</span>
      </div>
    </div>
    <div className="space-y-1.5">
      <div className="flex items-center gap-2 pl-32 pr-1">
        {Array.from({ length: 14 }).map((_, i) => (
          <div key={i} className="flex-1 text-center text-[10px] text-muted-foreground">{i + 1}</div>
        ))}
      </div>
      {RESOURCE_GRID.map((row) => (
        <div key={row.staff} className="flex items-center gap-2">
          <div className="w-32 flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-primary/10 text-primary text-[10px] font-semibold flex items-center justify-center">{row.initials}</div>
            <div className="text-xs truncate">{row.staff}</div>
          </div>
          <div className="flex-1 flex gap-1">
            {row.cells.map((c, i) => (
              <div
                key={i}
                className={`flex-1 h-6 rounded-sm ${c === "available" ? "bg-emerald-500/70" : c === "partial" ? "bg-amber-500/70" : "bg-red-500/70"}`}
                title={`${row.staff} – Day ${i + 1} – ${c}`}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  </Card>
);

const Dashboard = () => {
  const [tab, setTab] = useState("overview");

  const upcomingDeadlines = TASKS.filter((t) => t.status !== "Done").slice(0, 5);
  const recentTime = TIME_ENTRIES.slice(0, 5);
  const invoiceData = [
    { name: "Paid", value: 14850, color: "#5C8A6F" },
    { name: "Unpaid", value: 27450, color: "#234C82" },
    { name: "Overdue", value: 10150, color: "#A55B4A" },
  ];
  const totalInvoice = invoiceData.reduce((s, x) => s + x.value, 0);

  return (
    <div data-testid="dashboard-page">
      <PageHeader
        title="Dashboard"
        description="Your firm at a glance — Linear meets QuickBooks."
      />

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <KPI label="Total Clients" value="48" delta="+6.2%" icon={Users} testId="kpi-total-clients" />
        <KPI label="Active Engagements" value="23" delta="+3.1%" icon={Briefcase} testId="kpi-active-engagements" />
        <KPI label="Hours This Week" value="218.5" delta="+12.4%" icon={Clock} testId="kpi-hours-week" />
        <KPI label="Pending Approvals" value="14" delta="-8.3%" icon={CheckSquare} deltaPositive={false} testId="kpi-pending-approvals" />
        <KPI label="Revenue This Month" value="$52,450" delta="+18.7%" icon={DollarSign} testId="kpi-revenue-month" />
      </div>

      {/* Tabs */}
      <Tabs value={tab} onValueChange={setTab} className="mb-6">
        <TabsList data-testid="dashboard-tabs">
          <TabsTrigger data-testid="tab-overview" value="overview">Overview</TabsTrigger>
          <TabsTrigger data-testid="tab-analytics" value="analytics">Analytics</TabsTrigger>
          <TabsTrigger data-testid="tab-learning" value="learning">Learning</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <Card className="lg:col-span-3 p-5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-base font-semibold">Hours Logged by Engagement</h3>
                  <p className="text-xs text-muted-foreground">Last 7 days</p>
                </div>
              </div>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={HOURS_BY_ENGAGEMENT} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
                    <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    {ENG_KEYS.map((k, i) => <Bar key={k} dataKey={k} fill={ENG_COLORS[i]} radius={[3, 3, 0, 0]} />)}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card className="lg:col-span-2 p-5">
              <h3 className="text-base font-semibold mb-3">Upcoming Deadlines</h3>
              <div className="space-y-3">
                {upcomingDeadlines.map((t) => (
                  <div key={t.id} className="flex items-start justify-between gap-3 pb-3 border-b last:border-0 border-border">
                    <div className="min-w-0">
                      <div className="text-sm font-medium truncate">{t.title}</div>
                      <div className="text-[11px] text-muted-foreground mt-0.5">{t.engagement} · Due {t.due}</div>
                    </div>
                    <StatusBadge status={t.status} />
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <ResourceGrid />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-5">
              <h3 className="text-base font-semibold mb-3">Recent Time Entries</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="text-[11px] uppercase tracking-wide text-muted-foreground">
                    <tr><th className="text-left py-2 pr-2">Staff</th><th className="text-left py-2 pr-2">Engagement</th><th className="text-left py-2 pr-2">Date</th><th className="text-right py-2 pr-2">Hours</th><th className="text-right py-2">Status</th></tr>
                  </thead>
                  <tbody>
                    {recentTime.map((e) => (
                      <tr key={e.id} className="border-t border-border">
                        <td className="py-2 pr-2">{e.staff}</td>
                        <td className="py-2 pr-2 font-mono text-xs">{e.engagement}</td>
                        <td className="py-2 pr-2 text-muted-foreground">{e.date}</td>
                        <td className="py-2 pr-2 text-right tabular-nums">{e.hours.toFixed(1)}</td>
                        <td className="py-2 text-right"><StatusBadge status={e.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            <Card className="p-5">
              <h3 className="text-base font-semibold mb-3">Invoice Summary</h3>
              <div className="flex items-center gap-6">
                <div className="relative h-48 w-48">
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie data={invoiceData} dataKey="value" innerRadius={55} outerRadius={80} paddingAngle={2}>
                        {invoiceData.map((d) => <Cell key={d.name} fill={d.color} />)}
                      </Pie>
                      <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <div className="text-[11px] text-muted-foreground">Total</div>
                    <div className="text-xl font-bold tabular-nums">${(totalInvoice / 1000).toFixed(1)}K</div>
                  </div>
                </div>
                <div className="flex-1 space-y-2">
                  {invoiceData.map((d) => (
                    <div key={d.name} className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2"><span className="h-3 w-3 rounded-sm" style={{ background: d.color }} />{d.name}</span>
                      <span className="font-semibold tabular-nums">${d.value.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="mt-4 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <Card className="lg:col-span-3 p-5">
              <h3 className="text-base font-semibold mb-3">Project Completion Rate</h3>
              <p className="text-xs text-muted-foreground mb-3">Planned vs Actual % per engagement</p>
              <div className="h-72">
                <ResponsiveContainer>
                  <BarChart data={PROJECT_COMPLETION}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
                    <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Bar dataKey="planned" fill="#446F8A" radius={[3, 3, 0, 0]} />
                    <Bar dataKey="actual" fill="#234C82" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
            <Card className="lg:col-span-2 p-5">
              <h3 className="text-base font-semibold mb-1">Resource Utilization</h3>
              <p className="text-xs text-muted-foreground mb-3">14-day rolling</p>
              <ResourceGrid />
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="learning" className="mt-4">
          <Card className="p-5">
            <h3 className="text-base font-semibold mb-4">Learning Progress by Employee</h3>
            <div className="space-y-4">
              {LEARNING_PROGRESS.map((e) => (
                <div key={e.name}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-full bg-primary/10 text-primary text-[10px] font-semibold flex items-center justify-center">{e.initials}</div>
                      <span className="text-sm font-medium">{e.name}</span>
                    </div>
                    <span className="text-sm font-semibold tabular-nums">{e.progress}%</span>
                  </div>
                  <Progress value={e.progress} className="h-2" />
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
