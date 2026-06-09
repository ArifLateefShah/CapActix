import React, { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, MessageSquare, Paperclip, Calendar, LayoutGrid, Table as TableIcon } from "lucide-react";
import { toast } from "sonner";
import { TASKS, ENGAGEMENTS } from "@/lib/seed";

const COLUMNS = ["Not Started", "In Progress", "Review", "Done"];

const Tasks = () => {
  const [filter, setFilter] = useState("All");
  const [view, setView] = useState("kanban");
  const [selected, setSelected] = useState(null);
  const [newOpen, setNewOpen] = useState(false);

  const filtered = filter === "All" ? TASKS : TASKS.filter(t => t.status === filter);
  const counts = { All: TASKS.length };
  COLUMNS.forEach(c => (counts[c] = TASKS.filter(t => t.status === c).length));

  const isOverdue = (due) => new Date(due) < new Date("2026-02-10");

  return (
    <div data-testid="tasks-page">
      <PageHeader
        title="Task Manager"
        description="Track work across all engagements"
        actions={<div className="flex items-center gap-2">
          <div className="inline-flex border border-border rounded-md p-0.5">
            <button data-testid="view-kanban" onClick={() => setView("kanban")} className={`px-2 py-1 rounded ${view === "kanban" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}><LayoutGrid className="h-3.5 w-3.5" /></button>
            <button data-testid="view-table" onClick={() => setView("table")} className={`px-2 py-1 rounded ${view === "table" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}><TableIcon className="h-3.5 w-3.5" /></button>
            <button data-testid="view-calendar" onClick={() => setView("calendar")} className={`px-2 py-1 rounded ${view === "calendar" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}><Calendar className="h-3.5 w-3.5" /></button>
          </div>
          <Button data-testid="new-task-btn" onClick={() => setNewOpen(true)}><Plus className="h-4 w-4 mr-1.5" />New Task</Button>
        </div>}
      />

      <Tabs value={filter} onValueChange={setFilter} className="mb-5">
        <TabsList>
          {["All", ...COLUMNS].map((c) => (
            <TabsTrigger key={c} value={c} data-testid={`task-tab-${c.toLowerCase().replace(/\s+/g, "-")}`}>
              {c} <span className="ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full bg-muted">{counts[c]}</span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {view === "kanban" && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {COLUMNS.map((col) => {
            const items = filtered.filter(t => t.status === col);
            return (
              <div key={col} className="bg-muted/30 rounded-lg p-3 min-h-[400px]">
                <div className="flex items-center justify-between mb-3"><h4 className="text-sm font-semibold">{col}</h4><span className="text-xs text-muted-foreground">{items.length}</span></div>
                <div className="space-y-2">
                  {items.map(t => (
                    <Card key={t.id} data-testid={`task-card-${t.id}`} onClick={() => setSelected(t)} className="p-3 cursor-pointer hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-2"><StatusBadge status={t.priority} /><span className={`text-[10px] ${isOverdue(t.due) ? "text-red-600 font-semibold" : "text-muted-foreground"}`}>{t.due}</span></div>
                      <div className="text-sm font-medium mb-1.5 leading-snug">{t.title}</div>
                      <div className="text-[11px] font-mono text-primary mb-2">{t.engagement}</div>
                      <div className="flex items-center justify-between">
                        <div className="h-6 w-6 rounded-full bg-primary/10 text-primary text-[9px] font-semibold flex items-center justify-center" title={t.assignee}>{t.assignee.split(" ").map(p => p[0]).join("")}</div>
                        <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                          {t.comments > 0 && <span className="flex items-center gap-0.5"><MessageSquare className="h-3 w-3" />{t.comments}</span>}
                          {t.attachments > 0 && <span className="flex items-center gap-0.5"><Paperclip className="h-3 w-3" />{t.attachments}</span>}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {view === "table" && (
        <Card className="overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-[11px] uppercase text-muted-foreground"><tr><th className="text-left py-2 px-4">Task</th><th className="text-left py-2 px-4">Engagement</th><th className="text-left py-2 px-4">Assignee</th><th className="text-left py-2 px-4">Due</th><th className="text-left py-2 px-4">Priority</th><th className="text-right py-2 px-4">Status</th></tr></thead>
            <tbody>
              {filtered.map(t => (
                <tr key={t.id} onClick={() => setSelected(t)} className="border-t border-border hover:bg-muted/30 cursor-pointer">
                  <td className="py-2.5 px-4 font-medium">{t.title}</td>
                  <td className="py-2.5 px-4 font-mono text-xs">{t.engagement}</td>
                  <td className="py-2.5 px-4">{t.assignee}</td>
                  <td className={`py-2.5 px-4 ${isOverdue(t.due) ? "text-red-600 font-semibold" : "text-muted-foreground"}`}>{t.due}</td>
                  <td className="py-2.5 px-4"><StatusBadge status={t.priority} /></td>
                  <td className="py-2.5 px-4 text-right"><StatusBadge status={t.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {view === "calendar" && (
        <Card className="p-5">
          <h3 className="text-base font-semibold mb-3">February 2026</h3>
          <div className="grid grid-cols-7 gap-1 text-[11px]">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => <div key={d} className="text-muted-foreground font-medium text-center py-1">{d}</div>)}
            {Array.from({ length: 28 }).map((_, i) => {
              const day = i + 1;
              const tasksOn = TASKS.filter(t => Number(t.due.slice(-2)) === day);
              return (
                <div key={i} className="min-h-[80px] border border-border rounded p-1.5">
                  <div className="text-[10px] text-muted-foreground">{day}</div>
                  {tasksOn.map(t => <div key={t.id} className="text-[9px] bg-primary/10 text-primary rounded px-1 py-0.5 mt-0.5 truncate">{t.title}</div>)}
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Task detail */}
      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-2xl">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle>{selected.title}</DialogTitle>
                <div className="flex items-center gap-2 mt-2"><StatusBadge status={selected.status} /><StatusBadge status={selected.priority} /><span className="text-xs text-muted-foreground font-mono">{selected.engagement}</span></div>
              </DialogHeader>
              <div className="space-y-4">
                <p className="text-sm">{selected.description}</p>
                <div className="grid grid-cols-3 gap-3 text-sm">
                  <div><div className="text-xs text-muted-foreground">Assignee</div><div>{selected.assignee}</div></div>
                  <div><div className="text-xs text-muted-foreground">Due Date</div><div>{selected.due}</div></div>
                  <div><div className="text-xs text-muted-foreground">Priority</div><div>{selected.priority}</div></div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold mb-2">Sub-tasks</h4>
                  <div className="space-y-1.5">
                    <label className="flex items-center gap-2 text-sm"><input type="checkbox" defaultChecked />Request docs from client</label>
                    <label className="flex items-center gap-2 text-sm"><input type="checkbox" />Index in document vault</label>
                    <label className="flex items-center gap-2 text-sm"><input type="checkbox" />Mark engagement progress</label>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold mb-2">Comments ({selected.comments})</h4>
                  <div className="space-y-2 text-sm">
                    <div className="p-2 bg-muted/40 rounded"><span className="font-medium">Lisa Park:</span> Looks good, please post review notes.</div>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={newOpen} onOpenChange={setNewOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>New Task</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>Title</Label><Input placeholder="Task title" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Engagement</Label>
                <Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent>
                  {ENGAGEMENTS.map(e => <SelectItem key={e.id} value={e.id}>{e.id}</SelectItem>)}
                </SelectContent></Select></div>
              <div><Label>Assignee</Label><Input placeholder="Mike Reeves" /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Due Date</Label><Input type="date" /></div>
              <div><Label>Priority</Label>
                <Select defaultValue="Medium"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>
                  <SelectItem value="Low">Low</SelectItem><SelectItem value="Medium">Medium</SelectItem><SelectItem value="High">High</SelectItem><SelectItem value="Critical">Critical</SelectItem>
                </SelectContent></Select></div>
            </div>
            <div><Label>Description</Label><Textarea rows={3} /></div>
            <div><Label>Recurrence</Label>
              <Select defaultValue="None"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>
                <SelectItem value="None">None</SelectItem><SelectItem value="Daily">Daily</SelectItem><SelectItem value="Weekly">Weekly</SelectItem><SelectItem value="Monthly">Monthly</SelectItem>
              </SelectContent></Select></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewOpen(false)}>Cancel</Button>
            <Button onClick={() => { setNewOpen(false); toast.success("Task created"); }}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Tasks;
