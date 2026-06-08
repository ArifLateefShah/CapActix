import React, { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Download } from "lucide-react";
import { toast } from "sonner";
import { PROFITABILITY, STAFF } from "@/lib/seed";

const SERVICES = ["Tax", "Audit", "Advisory", "Bookkeeping"];
const HEATMAP = [
  { client: "Hartwell & Associates", Tax: 45, Audit: 38, Advisory: 22, Bookkeeping: 18 },
  { client: "Meridian Tax Group", Tax: 28, Audit: 35, Advisory: 12, Bookkeeping: 14 },
  { client: "Blue Ridge Advisory", Tax: 15, Audit: -8, Advisory: 31, Bookkeeping: 9 },
  { client: "Coastal CPA Partners", Tax: 18, Audit: 12, Advisory: 8, Bookkeeping: 5 },
  { client: "Summit Financial", Tax: 52, Audit: 41, Advisory: 28, Bookkeeping: 22 },
  { client: "Apex Accounting", Tax: -12, Audit: 5, Advisory: 14, Bookkeeping: 8 },
];

const ADJUSTMENTS = [
  { eng: "A-2025-006", orig: 32000, adj: 27300, reason: "Scope Creep", by: "John Carter", date: "2026-02-05" },
  { eng: "A-2025-003", orig: 21000, adj: 18900, reason: "Courtesy Discount", by: "Lisa Park", date: "2026-01-28" },
  { eng: "A-2025-004", orig: 24500, adj: 23100, reason: "Complexity", by: "John Carter", date: "2026-01-20" },
];

const heatColor = (v) => {
  if (v < 0) return "bg-red-600 text-white";
  if (v < 15) return "bg-amber-500 text-white";
  if (v < 30) return "bg-emerald-400 text-white";
  return "bg-emerald-700 text-white";
};

const Profitability = () => {
  const totalBilled = PROFITABILITY.reduce((s, x) => s + x.billed, 0);
  const totalCost = PROFITABILITY.reduce((s, x) => s + x.cost, 0);
  const avgReal = Math.round(PROFITABILITY.reduce((s, x) => s + x.realization, 0) / PROFITABILITY.length);
  const writeDown = PROFITABILITY.reduce((s, x) => s + Math.max(0, x.budget - x.billed), 0);
  const [partnerView, setPartnerView] = useState(false);

  return (
    <div data-testid="profitability-page">
      <PageHeader
        title="Engagement Profitability Dashboard"
        description="See which engagements pay and which bleed margin"
        actions={<Button variant="outline" onClick={() => toast.success("Export queued")}><Download className="h-4 w-4 mr-1.5" />Export</Button>}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="p-5"><div className="text-xs text-muted-foreground">Total Billed</div><div className="text-2xl font-bold tabular-nums">${totalBilled.toLocaleString()}</div></Card>
        <Card className="p-5"><div className="text-xs text-muted-foreground">Total Cost</div><div className="text-2xl font-bold tabular-nums">${totalCost.toLocaleString()}</div></Card>
        <Card className="p-5"><div className="text-xs text-muted-foreground">Avg Realization</div><div className="text-2xl font-bold tabular-nums text-emerald-700 dark:text-emerald-400">{avgReal}%</div></Card>
        <Card className="p-5"><div className="text-xs text-muted-foreground">Write-Down Total</div><div className="text-2xl font-bold tabular-nums text-red-700 dark:text-red-400">${writeDown.toLocaleString()}</div></Card>
      </div>

      <div className="flex items-center justify-end gap-2 mb-3">
        <span className="text-sm text-muted-foreground">Partner View</span>
        <Switch checked={partnerView} onCheckedChange={setPartnerView} data-testid="partner-view-toggle" />
      </div>

      <Tabs defaultValue="pl">
        <TabsList>
          <TabsTrigger value="pl">Engagement P&L</TabsTrigger>
          <TabsTrigger value="heat">Heatmap</TabsTrigger>
          <TabsTrigger value="realization">Staff Realization</TabsTrigger>
          <TabsTrigger value="adjust">Write-Up/Down Log</TabsTrigger>
        </TabsList>

        <TabsContent value="pl" className="mt-4">
          <Card className="overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-[11px] uppercase text-muted-foreground"><tr><th className="text-left py-2 px-4">ID</th><th className="text-left py-2 px-4">Client</th><th className="text-left py-2 px-4">Service</th><th className="text-right py-2 px-4">Billed</th><th className="text-right py-2 px-4">Cost</th><th className="text-right py-2 px-4">Budget</th><th className="text-right py-2 px-4">Margin</th><th className="text-right py-2 px-4">Realization</th><th className="text-right py-2 px-4">Status</th></tr></thead>
              <tbody>
                {PROFITABILITY.map((p) => (
                  <tr key={p.id} className={`border-t border-border ${p.status === "Loss" ? "bg-red-50/40 dark:bg-red-900/10" : ""}`}>
                    <td className="py-2.5 px-4 font-mono text-xs">{p.id}</td>
                    <td className="py-2.5 px-4 font-medium">{p.client}</td>
                    <td className="py-2.5 px-4 text-muted-foreground">{p.service}</td>
                    <td className="py-2.5 px-4 text-right tabular-nums">${p.billed.toLocaleString()}</td>
                    <td className="py-2.5 px-4 text-right tabular-nums">${p.cost.toLocaleString()}</td>
                    <td className="py-2.5 px-4 text-right tabular-nums text-muted-foreground">${p.budget.toLocaleString()}</td>
                    <td className={`py-2.5 px-4 text-right tabular-nums font-semibold ${p.margin < 0 ? "text-red-600" : ""}`}>${p.margin.toLocaleString()}</td>
                    <td className="py-2.5 px-4 text-right tabular-nums">{p.realization}%</td>
                    <td className="py-2.5 px-4 text-right"><StatusBadge status={p.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
          {PROFITABILITY.some(p => p.status === "Loss") && (
            <div className="mt-3 text-xs text-muted-foreground bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-md p-3">
              <span className="font-semibold text-amber-900 dark:text-amber-200">Suggested action:</span> Review billing rate for next renewal on A-2025-006 (Apex Accounting).
            </div>
          )}
        </TabsContent>

        <TabsContent value="heat" className="mt-4">
          <Card className="p-5">
            <div className="overflow-x-auto">
              <table className="text-sm w-full">
                <thead><tr><th className="text-left py-2 pr-3"></th>{SERVICES.map(s => <th key={s} className="text-center py-2 px-2 font-semibold">{s}</th>)}</tr></thead>
                <tbody>
                  {HEATMAP.map((row) => (
                    <tr key={row.client}>
                      <td className="py-2 pr-3 text-xs">{row.client}</td>
                      {SERVICES.map(s => (
                        <td key={s} className="py-1 px-1">
                          <div className={`${heatColor(row[s])} text-center py-3 rounded font-semibold text-xs tabular-nums`} title={`${row.client} · ${s}: ${row[s]}%`}>{row[s]}%</div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex items-center gap-3 mt-4 text-[11px] text-muted-foreground">
                <span>Low margin</span>
                <span className="inline-block h-3 w-6 bg-red-600 rounded" />
                <span className="inline-block h-3 w-6 bg-amber-500 rounded" />
                <span className="inline-block h-3 w-6 bg-emerald-400 rounded" />
                <span className="inline-block h-3 w-6 bg-emerald-700 rounded" />
                <span>High margin</span>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="realization" className="mt-4">
          <Card className="overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-[11px] uppercase text-muted-foreground"><tr><th className="text-left py-2 px-4">Staff</th><th className="text-left py-2 px-4">Role</th><th className="text-right py-2 px-4">Logged</th><th className="text-right py-2 px-4">Billed</th><th className="text-right py-2 px-4">Realization %</th><th className="text-right py-2 px-4">Avg Rate</th><th className="text-right py-2 px-4">Revenue</th></tr></thead>
              <tbody>
                {STAFF.map((s, i) => {
                  const logged = 142 - i * 12;
                  const billed = Math.round(logged * (s.utilization / 100));
                  const rate = 285 - i * 25;
                  return (
                    <tr key={s.id} className="border-t border-border">
                      <td className="py-2.5 px-4"><div className="flex items-center gap-2"><div className="h-6 w-6 rounded-full bg-primary/10 text-primary text-[10px] font-semibold flex items-center justify-center">{s.initials}</div>{s.name}</div></td>
                      <td className="py-2.5 px-4 text-muted-foreground">{s.role}</td>
                      <td className="py-2.5 px-4 text-right tabular-nums">{logged}h</td>
                      <td className="py-2.5 px-4 text-right tabular-nums">{billed}h</td>
                      <td className="py-2.5 px-4 text-right tabular-nums font-semibold">{s.utilization}%</td>
                      <td className="py-2.5 px-4 text-right tabular-nums">${rate}/h</td>
                      <td className="py-2.5 px-4 text-right tabular-nums">${(billed * rate).toLocaleString()}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Card>
        </TabsContent>

        <TabsContent value="adjust" className="mt-4">
          <Card className="overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-[11px] uppercase text-muted-foreground"><tr><th className="text-left py-2 px-4">Engagement</th><th className="text-right py-2 px-4">Original</th><th className="text-right py-2 px-4">Adjusted</th><th className="text-right py-2 px-4">Difference</th><th className="text-left py-2 px-4">Reason</th><th className="text-left py-2 px-4">Approved By</th><th className="text-left py-2 px-4">Date</th></tr></thead>
              <tbody>
                {ADJUSTMENTS.map((a, i) => (
                  <tr key={i} className="border-t border-border">
                    <td className="py-2.5 px-4 font-mono text-xs">{a.eng}</td>
                    <td className="py-2.5 px-4 text-right tabular-nums">${a.orig.toLocaleString()}</td>
                    <td className="py-2.5 px-4 text-right tabular-nums">${a.adj.toLocaleString()}</td>
                    <td className="py-2.5 px-4 text-right tabular-nums text-red-600 font-semibold">-${(a.orig - a.adj).toLocaleString()}</td>
                    <td className="py-2.5 px-4"><StatusBadge status={a.reason === "Scope Creep" ? "At Risk" : "Inactive"} /></td>
                    <td className="py-2.5 px-4">{a.by}</td>
                    <td className="py-2.5 px-4 text-muted-foreground">{a.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profitability;
