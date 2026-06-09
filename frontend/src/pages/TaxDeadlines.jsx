import React, { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Plus, BellRing, AlertCircle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { TAX_DEADLINES } from "@/lib/seed";

const FORM_COLORS = { "1040": "#234C82", "1120": "#5E4A82", "1120S": "#5E4A82", "990": "#5C8A6F", "1065": "#446F8A", "W-2": "#A57E3B" };

const TaxDeadlines = () => {
  const next7 = TAX_DEADLINES.filter(d => d.days <= 7 && d.days >= 0).length;
  const next30 = TAX_DEADLINES.filter(d => d.days > 7 && d.days <= 30).length;
  const beyond = TAX_DEADLINES.filter(d => d.days > 30).length;
  const overdue = TAX_DEADLINES.filter(d => d.days < 0).length;
  const extensions = TAX_DEADLINES.filter(d => d.extended);

  const upcoming14 = TAX_DEADLINES.filter(d => d.days >= 0 && d.days <= 30).slice(0, 4);

  return (
    <div data-testid="tax-deadlines-page">
      <PageHeader
        title="Tax Deadline Intelligence Engine"
        description="Never miss a filing deadline"
        actions={<Button data-testid="add-deadline-btn" onClick={() => toast.success("Manual deadline added")}><Plus className="h-4 w-4 mr-1.5" />Add Deadline Override</Button>}
      />

      {/* Traffic light */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-5 border-l-4 border-l-red-600">
          <div className="text-xs text-muted-foreground">Next 7 days</div>
          <div className="text-3xl font-bold text-red-700 dark:text-red-400 tabular-nums">{next7}</div>
          <div className="text-[11px] text-muted-foreground mt-1">Critical attention</div>
        </Card>
        <Card className="p-5 border-l-4 border-l-amber-600">
          <div className="text-xs text-muted-foreground">8 – 30 days</div>
          <div className="text-3xl font-bold text-amber-700 dark:text-amber-400 tabular-nums">{next30}</div>
          <div className="text-[11px] text-muted-foreground mt-1">Plan now</div>
        </Card>
        <Card className="p-5 border-l-4 border-l-emerald-600">
          <div className="text-xs text-muted-foreground">Beyond 30 days</div>
          <div className="text-3xl font-bold text-emerald-700 dark:text-emerald-400 tabular-nums">{beyond}</div>
          <div className="text-[11px] text-muted-foreground mt-1">Comfortable</div>
        </Card>
        <Card className="p-5 border-l-4 border-l-red-800 bg-red-50/40 dark:bg-red-900/10">
          <div className="text-xs text-muted-foreground">Overdue</div>
          <div className="text-3xl font-bold text-red-800 dark:text-red-300 tabular-nums">{overdue}</div>
          <div className="text-[11px] text-muted-foreground mt-1">Take action immediately</div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-9">
          <Tabs defaultValue="calendar">
            <TabsList>
              <TabsTrigger value="calendar">Deadline Calendar</TabsTrigger>
              <TabsTrigger value="list">Deadline List</TabsTrigger>
              <TabsTrigger value="extensions">Extension Tracker</TabsTrigger>
            </TabsList>

            <TabsContent value="calendar" className="mt-4">
              <Card className="p-5">
                <h3 className="text-base font-semibold mb-3">April 2026</h3>
                <div className="grid grid-cols-7 gap-1 text-[11px] mb-2">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => <div key={d} className="text-center text-muted-foreground font-medium py-1">{d}</div>)}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: 30 }).map((_, i) => {
                    const day = i + 1;
                    const items = TAX_DEADLINES.filter(d => Number(d.original.slice(-2)) === day && d.original.includes("-04-"));
                    return (
                      <div key={i} className="min-h-[70px] border border-border rounded p-1.5 text-[10px]">
                        <div className="text-muted-foreground font-medium">{day}</div>
                        {items.map(d => (
                          <div key={d.id} className="mt-0.5 rounded px-1 py-0.5 text-white text-[9px] truncate" style={{ background: FORM_COLORS[d.form] || "#234C82" }} title={`${d.client} · ${d.form}`}>
                            {d.form} {d.client.split(" ")[0]}
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
                <div className="flex flex-wrap gap-3 mt-4 text-[11px]">
                  {Object.entries(FORM_COLORS).map(([k, v]) => <span key={k} className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-sm" style={{ background: v }} />{k}</span>)}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="list" className="mt-4">
              <Card className="overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-muted/40 text-[11px] uppercase text-muted-foreground"><tr><th className="text-left py-2 px-4">Client</th><th className="text-left py-2 px-4">Engagement</th><th className="text-left py-2 px-4">Form</th><th className="text-left py-2 px-4">Original</th><th className="text-left py-2 px-4">Extended</th><th className="text-right py-2 px-4">Days</th><th className="text-left py-2 px-4">Staff</th><th className="text-left py-2 px-4">Status</th></tr></thead>
                  <tbody>
                    {TAX_DEADLINES.map((d) => (
                      <tr key={d.id} className="border-t border-border hover:bg-muted/30">
                        <td className="py-2.5 px-4 font-medium">{d.client}</td>
                        <td className="py-2.5 px-4 font-mono text-xs">{d.engagement}</td>
                        <td className="py-2.5 px-4"><span className="px-2 py-0.5 rounded-full text-white text-[10px] font-semibold" style={{ background: FORM_COLORS[d.form] || "#234C82" }}>{d.form}</span></td>
                        <td className="py-2.5 px-4 text-muted-foreground">{d.original}</td>
                        <td className="py-2.5 px-4 text-muted-foreground">{d.extended || "—"}</td>
                        <td className={`py-2.5 px-4 text-right tabular-nums font-semibold ${d.days < 0 ? "text-red-600" : d.days < 14 ? "text-amber-600" : ""}`}>{d.days}</td>
                        <td className="py-2.5 px-4 text-xs">{d.assigned}</td>
                        <td className="py-2.5 px-4"><StatusBadge status={d.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>
            </TabsContent>

            <TabsContent value="extensions" className="mt-4">
              <Card className="overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-muted/40 text-[11px] uppercase text-muted-foreground"><tr><th className="text-left py-2 px-4">Client</th><th className="text-left py-2 px-4">Original</th><th className="text-left py-2 px-4">Extended To</th><th className="text-left py-2 px-4">Ref #</th><th className="text-left py-2 px-4">Filed By</th><th className="text-right py-2 px-4">Status</th></tr></thead>
                  <tbody>
                    {extensions.map((d, i) => (
                      <tr key={d.id} className="border-t border-border">
                        <td className="py-2.5 px-4">{d.client}</td>
                        <td className="py-2.5 px-4 text-muted-foreground">{d.original}</td>
                        <td className="py-2.5 px-4 font-semibold">{d.extended}</td>
                        <td className="py-2.5 px-4 font-mono text-xs">EXT-2026-{(i + 1).toString().padStart(4, "0")}</td>
                        <td className="py-2.5 px-4">{d.assigned}</td>
                        <td className="py-2.5 px-4 text-right"><StatusBadge status="Approved" /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Smart alerts */}
        <Card className="lg:col-span-3 p-4 h-fit">
          <div className="flex items-center gap-2 mb-3"><BellRing className="h-4 w-4 text-primary" /><h3 className="text-sm font-semibold">Smart Alerts</h3></div>
          <div className="space-y-3">
            {upcoming14.map((d) => (
              <div key={d.id} className="p-3 border border-border rounded-md">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="text-sm font-semibold truncate">{d.client}</div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">{d.form}</div>
                  </div>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${d.days <= 7 ? "bg-red-100 text-red-800" : "bg-amber-100 text-amber-800"}`}>{d.days}d</span>
                </div>
                <Button size="sm" variant="outline" className="w-full mt-2 h-7 text-[11px]" onClick={() => toast.success(`Team notified for ${d.client}`)}>
                  Notify Team
                </Button>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default TaxDeadlines;
