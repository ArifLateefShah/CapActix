import React, { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Check, X } from "lucide-react";
import { toast } from "sonner";
import { TIME_ENTRIES } from "@/lib/seed";

const TimeApproval = () => {
  const pending = TIME_ENTRIES.filter(e => e.status === "Pending");
  const recent = TIME_ENTRIES.filter(e => e.status !== "Pending");
  const [selected, setSelected] = useState({});
  const [rejectingId, setRejectingId] = useState(null);
  const [reason, setReason] = useState("");

  const toggleAll = (checked) => {
    const next = {};
    if (checked) pending.forEach(e => (next[e.id] = true));
    setSelected(next);
  };
  const selectedCount = Object.values(selected).filter(Boolean).length;

  return (
    <div data-testid="time-approval-page">
      <PageHeader title="Time Approval" description="Review and approve pending time entries from your team" />

      <Card className="p-4 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <Select><SelectTrigger><SelectValue placeholder="All engagements" /></SelectTrigger><SelectContent><SelectItem value="all">All engagements</SelectItem></SelectContent></Select>
          <Select><SelectTrigger><SelectValue placeholder="All employees" /></SelectTrigger><SelectContent><SelectItem value="all">All employees</SelectItem></SelectContent></Select>
          <Input type="date" />
          <Select><SelectTrigger><SelectValue placeholder="Pending" /></SelectTrigger><SelectContent>
            <SelectItem value="Pending">Pending</SelectItem><SelectItem value="Approved">Approved</SelectItem><SelectItem value="Rejected">Rejected</SelectItem>
          </SelectContent></Select>
        </div>
      </Card>

      <div className="flex items-center justify-between mb-3">
        <div className="text-sm text-muted-foreground">{selectedCount > 0 ? `${selectedCount} selected` : `${pending.length} pending entries`}</div>
        <div className="flex gap-2">
          <Button data-testid="approve-selected-btn" disabled={selectedCount === 0} onClick={() => { toast.success(`${selectedCount} entries approved`); setSelected({}); }} className="gap-1.5">
            <Check className="h-4 w-4" />Approve Selected
          </Button>
          <Button data-testid="reject-selected-btn" disabled={selectedCount === 0} variant="outline" onClick={() => { toast.warning(`${selectedCount} entries rejected`); setSelected({}); }} className="gap-1.5">
            <X className="h-4 w-4" />Reject Selected
          </Button>
        </div>
      </div>

      <Card className="overflow-hidden mb-6">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-[11px] uppercase text-muted-foreground">
            <tr>
              <th className="py-2 px-4 w-10"><Checkbox data-testid="select-all-pending" onCheckedChange={toggleAll} /></th>
              <th className="text-left py-2 px-4">Engagement</th>
              <th className="text-left py-2 px-4">Employee</th>
              <th className="text-left py-2 px-4">Task</th>
              <th className="text-left py-2 px-4">Date</th>
              <th className="text-right py-2 px-4">Hours</th>
              <th className="text-right py-2 px-4">Count</th>
              <th className="text-right py-2 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pending.map((e) => (
              <React.Fragment key={e.id}>
                <tr className="border-t border-border hover:bg-muted/30">
                  <td className="py-2.5 px-4"><Checkbox data-testid={`select-${e.id}`} checked={!!selected[e.id]} onCheckedChange={(c) => setSelected((s) => ({ ...s, [e.id]: !!c }))} /></td>
                  <td className="py-2.5 px-4 font-mono text-xs">{e.engagement}</td>
                  <td className="py-2.5 px-4"><div className="flex items-center gap-2"><div className="h-6 w-6 rounded-full bg-primary/10 text-primary text-[10px] font-semibold flex items-center justify-center">{e.staff.split(" ").map(p => p[0]).join("")}</div>{e.staff}</div></td>
                  <td className="py-2.5 px-4">{e.task}</td>
                  <td className="py-2.5 px-4 text-muted-foreground">{e.date}</td>
                  <td className="py-2.5 px-4 text-right tabular-nums">{e.hours}</td>
                  <td className="py-2.5 px-4 text-right tabular-nums">{e.count}</td>
                  <td className="py-2.5 px-4 text-right">
                    <div className="inline-flex gap-1">
                      <Button data-testid={`approve-${e.id}`} size="icon" variant="ghost" className="h-7 w-7 text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/20" onClick={() => toast.success("Entry approved")}><Check className="h-4 w-4" /></Button>
                      <Button data-testid={`reject-${e.id}`} size="icon" variant="ghost" className="h-7 w-7 text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20" onClick={() => setRejectingId(rejectingId === e.id ? null : e.id)}><X className="h-4 w-4" /></Button>
                    </div>
                  </td>
                </tr>
                {rejectingId === e.id && (
                  <tr className="bg-red-50 dark:bg-red-900/10">
                    <td colSpan={8} className="p-3">
                      <div className="flex gap-2 items-center">
                        <Input placeholder="Reason for rejection..." value={reason} onChange={(ev) => setReason(ev.target.value)} className="flex-1" />
                        <Button size="sm" onClick={() => { toast.warning(`Rejected: ${reason}`); setRejectingId(null); setReason(""); }}>Confirm</Button>
                        <Button size="sm" variant="ghost" onClick={() => setRejectingId(null)}>Cancel</Button>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </Card>

      <h3 className="text-base font-semibold mb-3">Recent Approvals</h3>
      <Card className="overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-[11px] uppercase text-muted-foreground">
            <tr><th className="text-left py-2 px-4">Engagement</th><th className="text-left py-2 px-4">Employee</th><th className="text-left py-2 px-4">Task</th><th className="text-left py-2 px-4">Date</th><th className="text-right py-2 px-4">Hours</th><th className="text-left py-2 px-4">Approved By</th><th className="text-right py-2 px-4">Status</th></tr>
          </thead>
          <tbody>
            {recent.map((e) => (
              <tr key={e.id} className="border-t border-border">
                <td className="py-2.5 px-4 font-mono text-xs">{e.engagement}</td>
                <td className="py-2.5 px-4">{e.staff}</td>
                <td className="py-2.5 px-4">{e.task}</td>
                <td className="py-2.5 px-4 text-muted-foreground">{e.date}</td>
                <td className="py-2.5 px-4 text-right tabular-nums">{e.hours}</td>
                <td className="py-2.5 px-4">Lisa Park</td>
                <td className="py-2.5 px-4 text-right"><StatusBadge status={e.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
};

export default TimeApproval;
