import React, { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { ENGAGEMENTS, CLIENTS, TASKS, TIME_ENTRIES } from "@/lib/seed";

const Engagements = () => {
  const [search, setSearch] = useState("");
  const [serviceFilter, setServiceFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  const filtered = ENGAGEMENTS.filter((e) => {
    if (search && !(e.id + " " + e.client).toLowerCase().includes(search.toLowerCase())) return false;
    if (serviceFilter !== "all" && !e.service.includes(serviceFilter)) return false;
    if (statusFilter !== "all" && e.status !== statusFilter) return false;
    return true;
  });

  if (selected) {
    return (
      <div data-testid="engagement-detail-page">
        <Button variant="ghost" size="sm" onClick={() => setSelected(null)} className="mb-4">← Back to Engagements</Button>
        <PageHeader
          title={selected.id}
          description={`${selected.client} · ${selected.service}`}
          actions={<StatusBadge status={selected.status} />}
        />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="p-4"><div className="text-xs text-muted-foreground">Approver</div><div className="text-sm font-semibold mt-1">{selected.approver}</div></Card>
          <Card className="p-4"><div className="text-xs text-muted-foreground">Manager</div><div className="text-sm font-semibold mt-1">{selected.manager}</div></Card>
          <Card className="p-4"><div className="text-xs text-muted-foreground">Bill Rate</div><div className="text-sm font-semibold mt-1 tabular-nums">${selected.billRate}/hr</div></Card>
          <Card className="p-4"><div className="text-xs text-muted-foreground">Progress</div><div className="text-sm font-semibold mt-1 tabular-nums">{selected.progress}%</div><Progress value={selected.progress} className="h-1.5 mt-2" /></Card>
        </div>
        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="time">Time Entries</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
            <TabsTrigger value="activity">Activity Log</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="mt-4">
            <Card className="p-5 grid grid-cols-2 gap-4 text-sm">
              <div><div className="text-muted-foreground text-xs">Start</div><div>{selected.start}</div></div>
              <div><div className="text-muted-foreground text-xs">End</div><div>{selected.end}</div></div>
              <div><div className="text-muted-foreground text-xs">Type</div><div>{selected.type}</div></div>
              <div><div className="text-muted-foreground text-xs">Cycle</div><div>{selected.cycle}</div></div>
              <div><div className="text-muted-foreground text-xs">Tracking</div><div>{selected.tracking}</div></div>
            </Card>
          </TabsContent>
          <TabsContent value="tasks" className="mt-4">
            <Card className="overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted/40 text-[11px] uppercase text-muted-foreground"><tr><th className="text-left py-2 px-3">Task</th><th className="text-left py-2 px-3">Assignee</th><th className="text-left py-2 px-3">Due</th><th className="text-right py-2 px-3">Status</th></tr></thead>
                <tbody>{TASKS.filter(t => t.engagement === selected.id).map(t => (
                  <tr key={t.id} className="border-t border-border"><td className="py-2 px-3">{t.title}</td><td className="py-2 px-3">{t.assignee}</td><td className="py-2 px-3 text-muted-foreground">{t.due}</td><td className="py-2 px-3 text-right"><StatusBadge status={t.status} /></td></tr>
                ))}</tbody>
              </table>
            </Card>
          </TabsContent>
          <TabsContent value="time" className="mt-4">
            <Card className="overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted/40 text-[11px] uppercase text-muted-foreground"><tr><th className="text-left py-2 px-3">Staff</th><th className="text-left py-2 px-3">Date</th><th className="text-right py-2 px-3">Hours</th><th className="text-right py-2 px-3">Status</th></tr></thead>
                <tbody>{TIME_ENTRIES.filter(e => e.engagement === selected.id).map(e => (
                  <tr key={e.id} className="border-t border-border"><td className="py-2 px-3">{e.staff}</td><td className="py-2 px-3">{e.date}</td><td className="py-2 px-3 text-right tabular-nums">{e.hours}</td><td className="py-2 px-3 text-right"><StatusBadge status={e.status} /></td></tr>
                ))}</tbody>
              </table>
            </Card>
          </TabsContent>
          <TabsContent value="documents" className="mt-4"><Card className="p-8 text-center text-sm text-muted-foreground">14 documents in vault</Card></TabsContent>
          <TabsContent value="team" className="mt-4"><Card className="p-8 text-center text-sm text-muted-foreground">{selected.manager}, {selected.approver}, +2 more</Card></TabsContent>
          <TabsContent value="activity" className="mt-4"><Card className="p-5 space-y-3 text-sm">
            <div><span className="font-medium">Mike Reeves</span> logged 4.5h <span className="text-muted-foreground">· 2h ago</span></div>
            <div><span className="font-medium">Lisa Park</span> approved time entry <span className="text-muted-foreground">· 5h ago</span></div>
            <div><span className="font-medium">Sarah Chen</span> uploaded W-9.pdf <span className="text-muted-foreground">· Yesterday</span></div>
          </Card></TabsContent>
        </Tabs>
      </div>
    );
  }

  return (
    <div data-testid="engagements-page">
      <PageHeader
        title="Engagements"
        description="The core operational unit — every billable workstream lives here"
        actions={<Button data-testid="new-engagement-btn" onClick={() => setOpen(true)}><Plus className="h-4 w-4 mr-1.5" />New Engagement</Button>}
      />
      <Card className="p-4 mb-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input data-testid="engagements-search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by ID or client..." className="pl-9" />
          </div>
          <Select value={serviceFilter} onValueChange={setServiceFilter}>
            <SelectTrigger className="w-44"><SelectValue placeholder="Service type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Services</SelectItem>
              <SelectItem value="Tax">Tax</SelectItem>
              <SelectItem value="Audit">Audit</SelectItem>
              <SelectItem value="Bookkeeping">Bookkeeping</SelectItem>
              <SelectItem value="Advisory">Advisory</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Not Started">Not Started</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Review">Review</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-[11px] uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="text-left py-3 px-4">Engagement ID</th>
                <th className="text-left py-3 px-4">Client</th>
                <th className="text-left py-3 px-4">Service Type</th>
                <th className="text-left py-3 px-4">Type</th>
                <th className="text-left py-3 px-4">Period</th>
                <th className="text-left py-3 px-4">Approver</th>
                <th className="text-left py-3 px-4">Progress</th>
                <th className="text-right py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((e) => (
                <tr key={e.id} data-testid={`engagement-row-${e.id}`} onClick={() => setSelected(e)} className="border-t border-border hover:bg-muted/40 cursor-pointer">
                  <td className="py-3 px-4 font-mono text-xs text-primary font-semibold">{e.id}</td>
                  <td className="py-3 px-4 font-medium">{e.client}</td>
                  <td className="py-3 px-4 text-muted-foreground">{e.service}</td>
                  <td className="py-3 px-4">{e.type}</td>
                  <td className="py-3 px-4 text-xs text-muted-foreground">{e.start} → {e.end}</td>
                  <td className="py-3 px-4 text-xs">{e.approver}</td>
                  <td className="py-3 px-4 w-40"><div className="flex items-center gap-2"><Progress value={e.progress} className="h-1.5 flex-1" /><span className="text-xs tabular-nums">{e.progress}%</span></div></td>
                  <td className="py-3 px-4 text-right"><StatusBadge status={e.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>New Engagement</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>Client</Label>
              <Select><SelectTrigger><SelectValue placeholder="Select active client" /></SelectTrigger><SelectContent>
                {CLIENTS.filter(c => c.status === "Active").map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
              </SelectContent></Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Service Type</Label>
                <Select defaultValue="Tax"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>
                  <SelectItem value="Tax">Tax</SelectItem><SelectItem value="Audit">Audit</SelectItem><SelectItem value="Accounting">Accounting</SelectItem><SelectItem value="Advisory">Advisory</SelectItem>
                </SelectContent></Select></div>
              <div><Label>Engagement Type</Label>
                <Select defaultValue="Fixed Price"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>
                  <SelectItem value="Dedicated">Dedicated</SelectItem><SelectItem value="Fixed Price">Fixed Price</SelectItem>
                </SelectContent></Select></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Start Date</Label><Input type="date" /></div>
              <div><Label>End Date</Label><Input type="date" /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Approver</Label><Input placeholder="John Carter" /></div>
              <div><Label>Resource Manager</Label><Input placeholder="Lisa Park" /></div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div><Label>Bill Rate</Label><Input type="number" placeholder="285" /></div>
              <div><Label>Cycle</Label>
                <Select defaultValue="Monthly"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>
                  <SelectItem value="Weekly">Weekly</SelectItem><SelectItem value="Bi-Weekly">Bi-Weekly</SelectItem><SelectItem value="Monthly">Monthly</SelectItem>
                </SelectContent></Select></div>
              <div><Label>Tracking</Label>
                <Select defaultValue="Progressive"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>
                  <SelectItem value="Simple">Simple</SelectItem><SelectItem value="Progressive">Progressive</SelectItem>
                </SelectContent></Select></div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button data-testid="create-engagement-submit" onClick={() => { setOpen(false); toast.success("Engagement created"); }}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Engagements;
