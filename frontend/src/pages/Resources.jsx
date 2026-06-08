import React from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { STAFF, ENGAGEMENTS, ENGAGEMENT_GANTT } from "@/lib/seed";

const MONTHS = ["May", "Jun", "Jul", "Aug", "Sep"];

const Resources = () => {
  return (
    <div data-testid="resources-page">
      <PageHeader title="Resource Allocation" description="Gantt-style staffing across all engagements" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Assign form */}
        <Card className="lg:col-span-4 p-5 h-fit">
          <h3 className="text-base font-semibold mb-3">Assign Staff</h3>
          <div className="space-y-3">
            <div><Label>Engagement</Label>
              <Select><SelectTrigger><SelectValue placeholder="Select engagement" /></SelectTrigger><SelectContent>
                {ENGAGEMENTS.map(e => <SelectItem key={e.id} value={e.id}>{e.id} — {e.client}</SelectItem>)}
              </SelectContent></Select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div><Label>Start</Label><Input type="date" /></div>
              <div><Label>End</Label><Input type="date" /></div>
            </div>
            <div>
              <Label className="mb-2 block">Staff (multi-select)</Label>
              <div className="space-y-1.5 max-h-72 overflow-y-auto scrollbar-thin border border-border rounded-md p-2">
                {STAFF.map(s => (
                  <label key={s.id} data-testid={`staff-select-${s.id}`} className="flex items-center gap-2 p-2 rounded-md hover:bg-muted cursor-pointer text-sm">
                    <input type="checkbox" className="rounded border-border" />
                    <div className="h-7 w-7 rounded-full bg-primary/10 text-primary text-[10px] font-semibold flex items-center justify-center">{s.initials}</div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{s.name}</div>
                      <div className="flex flex-wrap gap-1 mt-0.5">
                        {s.skills.slice(0, 2).map(t => <span key={t} className="text-[9px] px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground">{t}</span>)}
                      </div>
                    </div>
                    <span className={`h-2 w-2 rounded-full ${s.available ? "bg-emerald-500" : "bg-red-500"}`} />
                  </label>
                ))}
              </div>
            </div>
            <Button data-testid="assign-staff-btn" className="w-full" onClick={() => toast.success("Staff allocation saved")}>Assign Staff</Button>
          </div>
        </Card>

        {/* Gantt */}
        <Card className="lg:col-span-8 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-semibold">Resource Gantt</h3>
              <p className="text-xs text-muted-foreground">May → September 2025</p>
            </div>
            <div className="flex items-center gap-3 text-[11px]">
              <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-sm bg-emerald-500" />Available</span>
              <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-sm bg-amber-500" />Partially</span>
              <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-sm bg-red-500" />Fully</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 pl-32">
              {MONTHS.map(m => <div key={m} className="flex-1 text-center text-[10px] text-muted-foreground font-medium">{m}</div>)}
            </div>
            {ENGAGEMENT_GANTT.map(row => (
              <div key={row.staff} className="flex items-center gap-2">
                <div className="w-32 flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-primary/10 text-primary text-[10px] font-semibold flex items-center justify-center">{row.initials}</div>
                  <div className="text-xs truncate">{row.staff}</div>
                </div>
                <div className="flex-1 relative h-8 bg-muted/30 rounded">
                  {row.bars.map((b, i) => (
                    <div
                      key={i}
                      title={b.label}
                      className="absolute top-1 bottom-1 rounded text-[10px] text-white font-semibold flex items-center px-2 truncate"
                      style={{ left: `${(b.start / 20) * 100}%`, width: `${(b.len / 20) * 100}%`, background: b.color }}
                    >
                      {b.label}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="mt-6 overflow-hidden">
        <div className="p-4 border-b border-border"><h3 className="text-base font-semibold">Current Allocations</h3></div>
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-[11px] uppercase text-muted-foreground">
            <tr><th className="text-left py-2 px-4">Staff</th><th className="text-left py-2 px-4">Engagement</th><th className="text-left py-2 px-4">Period</th><th className="text-right py-2 px-4">Allocated</th><th className="text-right py-2 px-4">Logged</th><th className="text-left py-2 px-4 w-40">Utilization</th></tr>
          </thead>
          <tbody>
            {STAFF.slice(0, 6).map((s, i) => {
              const eng = ENGAGEMENTS[i % ENGAGEMENTS.length];
              const allocated = 80 + (i * 8);
              const logged = Math.round(allocated * (s.utilization / 100));
              return (
                <tr key={s.id} className="border-t border-border">
                  <td className="py-3 px-4"><div className="flex items-center gap-2"><div className="h-7 w-7 rounded-full bg-primary/10 text-primary text-[10px] font-semibold flex items-center justify-center">{s.initials}</div>{s.name}</div></td>
                  <td className="py-3 px-4 font-mono text-xs">{eng.id}</td>
                  <td className="py-3 px-4 text-xs text-muted-foreground">{eng.start} → {eng.end}</td>
                  <td className="py-3 px-4 text-right tabular-nums">{allocated}h</td>
                  <td className="py-3 px-4 text-right tabular-nums">{logged}h</td>
                  <td className="py-3 px-4"><div className="flex items-center gap-2"><Progress value={s.utilization} className="h-1.5 flex-1" /><span className="text-xs tabular-nums">{s.utilization}%</span></div></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </div>
  );
};

export default Resources;
