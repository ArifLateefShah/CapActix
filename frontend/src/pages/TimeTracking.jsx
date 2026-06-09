import React, { useState, useEffect, useRef } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Play, Pause, Square, Edit } from "lucide-react";
import { toast } from "sonner";
import { ENGAGEMENTS, TIME_ENTRIES } from "@/lib/seed";

const TimeTracking = () => {
  const [mode, setMode] = useState("manual");
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    if (running) {
      timerRef.current = setInterval(() => setElapsed((s) => s + 1), 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => timerRef.current && clearInterval(timerRef.current);
  }, [running]);

  const formatTime = (s) => {
    const h = Math.floor(s / 3600).toString().padStart(2, "0");
    const m = Math.floor((s % 3600) / 60).toString().padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${h}:${m}:${sec}`;
  };

  const weekTotal = 32.5;
  const pendingHours = 12.0;

  return (
    <div data-testid="time-tracking-page">
      <PageHeader title="Time Tracking" description="Log billable time accurately. Every minute matters." />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <Card className="lg:col-span-5 p-5">
          <h3 className="text-base font-semibold mb-4">Log Time</h3>
          <Tabs value={mode} onValueChange={setMode}>
            <TabsList className="grid grid-cols-2 w-full mb-4">
              <TabsTrigger data-testid="mode-manual" value="manual">Manual Entry</TabsTrigger>
              <TabsTrigger data-testid="mode-timer" value="timer">Timer</TabsTrigger>
            </TabsList>

            <div className="space-y-3">
              <div><Label>Engagement</Label>
                <Select><SelectTrigger><SelectValue placeholder="Select engagement" /></SelectTrigger><SelectContent>
                  {ENGAGEMENTS.map(e => <SelectItem key={e.id} value={e.id}>{e.id} — {e.client}</SelectItem>)}
                </SelectContent></Select>
              </div>
              <div><Label>Task</Label>
                <Select><SelectTrigger><SelectValue placeholder="Select task" /></SelectTrigger><SelectContent>
                  <SelectItem value="t1">Gather W-2 forms</SelectItem><SelectItem value="t2">Prepare draft return</SelectItem><SelectItem value="t3">Reconcile bank accounts</SelectItem>
                </SelectContent></Select>
              </div>
              <div><Label>Work Date</Label><Input type="date" max={new Date().toISOString().split("T")[0]} /></div>
              <div><Label>Description</Label><Textarea placeholder="Describe your work (min 10 chars)" rows={3} /></div>

              <TabsContent value="manual" className="mt-0 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>Hours</Label><Input type="number" step="0.5" max="24" placeholder="0.0" /></div>
                  <div><Label>Count</Label><Input type="number" placeholder="1" /></div>
                </div>
              </TabsContent>

              <TabsContent value="timer" className="mt-0 space-y-3">
                <div className="border border-border rounded-lg p-6 text-center bg-muted/30">
                  <div className="text-4xl font-bold tabular-nums tracking-tight">{formatTime(elapsed)}</div>
                  <div className="flex justify-center gap-2 mt-4">
                    {!running ? (
                      <Button data-testid="timer-start" onClick={() => setRunning(true)} className="gap-1.5"><Play className="h-4 w-4" />Start</Button>
                    ) : (
                      <Button data-testid="timer-pause" variant="secondary" onClick={() => setRunning(false)} className="gap-1.5"><Pause className="h-4 w-4" />Pause</Button>
                    )}
                    <Button data-testid="timer-stop" variant="outline" onClick={() => { setRunning(false); setElapsed(0); toast.success(`Time logged: ${(elapsed / 3600).toFixed(2)}h`); }} className="gap-1.5">
                      <Square className="h-4 w-4" />Stop
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <Button data-testid="log-time-btn" className="w-full" onClick={() => toast.success("Time entry submitted for approval")}>Submit Entry</Button>
            </div>
          </Tabs>
        </Card>

        <Card className="lg:col-span-7 p-5">
          <h3 className="text-base font-semibold mb-3">Weekly Summary</h3>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="p-3 rounded-md border border-border"><div className="text-xs text-muted-foreground">Total hours</div><div className="text-2xl font-bold tabular-nums">{weekTotal}</div></div>
            <div className="p-3 rounded-md border border-border"><div className="text-xs text-muted-foreground">Pending approval</div><div className="text-2xl font-bold tabular-nums text-amber-700 dark:text-amber-400">{pendingHours}</div></div>
          </div>
          <div className="space-y-3">
            {ENGAGEMENTS.slice(0, 5).map((e, i) => {
              const hrs = [8, 6.5, 5, 7, 6][i];
              return (
                <div key={e.id}>
                  <div className="flex justify-between mb-1 text-xs">
                    <span className="font-mono">{e.id}</span>
                    <span className="tabular-nums">{hrs}h</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden"><div className="h-full bg-primary rounded-full" style={{ width: `${(hrs / 10) * 100}%` }} /></div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      <Card className="mt-6 overflow-hidden">
        <div className="p-4 border-b border-border"><h3 className="text-base font-semibold">Recent Time Entries</h3></div>
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-[11px] uppercase text-muted-foreground">
            <tr><th className="text-left py-2 px-4">Engagement</th><th className="text-left py-2 px-4">Task</th><th className="text-left py-2 px-4">Date</th><th className="text-left py-2 px-4">Description</th><th className="text-right py-2 px-4">Hours</th><th className="text-right py-2 px-4">Count</th><th className="text-right py-2 px-4">Status</th><th className="text-right py-2 px-4">Action</th></tr>
          </thead>
          <tbody>
            {TIME_ENTRIES.map((e) => (
              <tr key={e.id} className="border-t border-border">
                <td className="py-2.5 px-4 font-mono text-xs">{e.engagement}</td>
                <td className="py-2.5 px-4">{e.task}</td>
                <td className="py-2.5 px-4 text-muted-foreground">{e.date}</td>
                <td className="py-2.5 px-4 max-w-xs truncate text-muted-foreground">{e.desc}</td>
                <td className="py-2.5 px-4 text-right tabular-nums">{e.hours}</td>
                <td className="py-2.5 px-4 text-right tabular-nums">{e.count}</td>
                <td className="py-2.5 px-4 text-right"><StatusBadge status={e.status} /></td>
                <td className="py-2.5 px-4 text-right">
                  {e.status !== "Approved" && <Button size="icon" variant="ghost" className="h-7 w-7"><Edit className="h-3.5 w-3.5" /></Button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
};

export default TimeTracking;
