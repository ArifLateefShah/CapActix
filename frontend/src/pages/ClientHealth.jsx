import React, { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ArrowUp, ArrowDown, Mail, PhoneCall } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { toast } from "sonner";
import { CLIENT_HEALTH } from "@/lib/seed";

const scoreColor = (s) => s >= 75 ? "bg-emerald-500" : s >= 40 ? "bg-amber-500" : "bg-red-500";
const scoreText = (s) => s >= 75 ? "Healthy" : s >= 40 ? "At Risk" : "Critical";

const ClientHealth = () => {
  const [selected, setSelected] = useState(null);
  const healthy = CLIENT_HEALTH.filter(c => c.score >= 75).length;
  const atRisk = CLIENT_HEALTH.filter(c => c.score >= 40 && c.score < 75).length;
  const critical = CLIENT_HEALTH.filter(c => c.score < 40).length;

  const trend = Array.from({ length: 12 }).map((_, i) => ({ week: `W${i + 1}`, score: 65 + Math.round(Math.sin(i / 2) * 15 + i * 1.5) }));

  return (
    <div data-testid="client-health-page">
      <PageHeader
        title="Client Health"
        description="Spot churn risk before it becomes a problem"
        actions={<Button data-testid="send-digest-btn" onClick={() => toast.success("Weekly digest sent to partners")}><Mail className="h-4 w-4 mr-1.5" />Send Digest to Partners</Button>}
      />

      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card className="p-5 border-l-4 border-l-emerald-600">
          <div className="text-xs text-muted-foreground">Healthy</div>
          <div className="text-3xl font-bold text-emerald-700 dark:text-emerald-400 tabular-nums">{healthy}</div>
          <div className="text-[11px] text-muted-foreground">Score 75 – 100</div>
        </Card>
        <Card className="p-5 border-l-4 border-l-amber-600">
          <div className="text-xs text-muted-foreground">At Risk</div>
          <div className="text-3xl font-bold text-amber-700 dark:text-amber-400 tabular-nums">{atRisk}</div>
          <div className="text-[11px] text-muted-foreground">Score 40 – 74</div>
        </Card>
        <Card className="p-5 border-l-4 border-l-red-600">
          <div className="text-xs text-muted-foreground">Critical</div>
          <div className="text-3xl font-bold text-red-700 dark:text-red-400 tabular-nums">{critical}</div>
          <div className="text-[11px] text-muted-foreground">Score 0 – 39</div>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-[11px] uppercase text-muted-foreground">
            <tr>
              <th className="text-left py-2 px-4">Client</th>
              <th className="text-left py-2 px-4">Industry</th>
              <th className="text-left py-2 px-4 w-56">Health Score</th>
              <th className="text-right py-2 px-4">Δ Week</th>
              <th className="text-right py-2 px-4">Resp (days)</th>
              <th className="text-right py-2 px-4">Pay (days)</th>
              <th className="text-right py-2 px-4">Task %</th>
              <th className="text-right py-2 px-4">Logins</th>
              <th className="text-right py-2 px-4">Issues</th>
              <th className="text-right py-2 px-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {CLIENT_HEALTH.map((c, i) => (
              <tr key={i} data-testid={`health-row-${i}`} onClick={() => setSelected(c)} className="border-t border-border hover:bg-muted/30 cursor-pointer">
                <td className="py-3 px-4 font-medium">{c.client}</td>
                <td className="py-3 px-4 text-muted-foreground">{c.industry}</td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden"><div className={`h-full ${scoreColor(c.score)}`} style={{ width: `${c.score}%` }} /></div>
                    <span className="text-xs tabular-nums font-semibold w-8 text-right">{c.score}</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-right">
                  <span className={`inline-flex items-center gap-0.5 text-xs ${c.delta >= 0 ? "text-emerald-700" : "text-red-700"} font-semibold`}>
                    {c.delta >= 0 ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                    {Math.abs(c.delta)}
                  </span>
                </td>
                <td className="py-3 px-4 text-right tabular-nums">{c.responseDays}</td>
                <td className="py-3 px-4 text-right tabular-nums">{c.paymentDays}</td>
                <td className="py-3 px-4 text-right tabular-nums">{c.taskRate}%</td>
                <td className="py-3 px-4 text-right tabular-nums">{c.logins}</td>
                <td className={`py-3 px-4 text-right tabular-nums ${c.openIssues > 3 ? "text-red-600 font-semibold" : ""}`}>{c.openIssues}</td>
                <td className="py-3 px-4 text-right text-[11px] text-muted-foreground max-w-[200px] truncate" title={c.action}>{c.action}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent className="w-[560px] sm:max-w-[560px] overflow-y-auto">
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle>{selected.client}</SheetTitle>
                <div className="flex items-center gap-2 mt-1">
                  <div className={`px-2 py-0.5 rounded-full text-xs font-semibold ${selected.score >= 75 ? "bg-emerald-100 text-emerald-800" : selected.score >= 40 ? "bg-amber-100 text-amber-800" : "bg-red-100 text-red-800"}`}>
                    Score {selected.score} · {scoreText(selected.score)}
                  </div>
                </div>
              </SheetHeader>

              <div className="grid grid-cols-2 gap-3 mt-5">
                <div className="p-3 border border-border rounded-md"><div className="text-[11px] text-muted-foreground">Doc Response Time</div><div className="text-lg font-bold tabular-nums">{selected.responseDays}d</div></div>
                <div className="p-3 border border-border rounded-md"><div className="text-[11px] text-muted-foreground">Payment Speed</div><div className="text-lg font-bold tabular-nums">{selected.paymentDays}d</div></div>
                <div className="p-3 border border-border rounded-md"><div className="text-[11px] text-muted-foreground">Task Completion</div><div className="text-lg font-bold tabular-nums">{selected.taskRate}%</div></div>
                <div className="p-3 border border-border rounded-md"><div className="text-[11px] text-muted-foreground">Portal Logins (30d)</div><div className="text-lg font-bold tabular-nums">{selected.logins}</div></div>
                <div className="p-3 border border-border rounded-md col-span-2"><div className="text-[11px] text-muted-foreground">Open Issues</div><div className="text-lg font-bold tabular-nums">{selected.openIssues}</div></div>
              </div>

              <div className="mt-5">
                <h4 className="text-sm font-semibold mb-2">12-Week Trend</h4>
                <div className="h-32">
                  <ResponsiveContainer>
                    <LineChart data={trend} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                      <XAxis dataKey="week" fontSize={10} stroke="hsl(var(--muted-foreground))" />
                      <YAxis fontSize={10} stroke="hsl(var(--muted-foreground))" />
                      <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                      <Line type="monotone" dataKey="score" stroke="#234C82" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <Card className="mt-5 p-4 bg-primary/5 border-primary/30">
                <div className="text-[11px] uppercase tracking-wider text-primary font-semibold mb-1">AI Suggested Action</div>
                <div className="text-sm">{selected.action}</div>
              </Card>

              <div className="flex gap-2 mt-5">
                <Button variant="outline" className="flex-1"><Mail className="h-4 w-4 mr-1.5" />Send Check-in</Button>
                <Button className="flex-1"><PhoneCall className="h-4 w-4 mr-1.5" />Schedule Call</Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default ClientHealth;
