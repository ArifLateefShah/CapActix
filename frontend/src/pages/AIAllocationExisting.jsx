import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { PageHeader } from "@/components/common/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, AlertTriangle, Flag, Check, X } from "lucide-react";
import { toast } from "sonner";
import { ENGAGEMENTS, STAFF } from "@/lib/seed";

const HEALTH = ["Optimal", "Needs Review", "Needs Review", "At Risk"];

const TabsBar = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const tab = pathname.endsWith("/new") ? "new" : "existing";
  return (
    <Tabs value={tab} onValueChange={(v) => navigate(v === "new" ? "/ai-allocation/new" : "/ai-allocation/existing")} className="mb-5">
      <TabsList>
        <TabsTrigger value="existing" data-testid="tab-existing">Existing Engagements</TabsTrigger>
        <TabsTrigger value="new" data-testid="tab-new">New Engagement</TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

const Suggest = ({ eng, health, onClose }) => {
  const isRisk = health === "At Risk";
  return (
    <Card className="mt-3 p-5 border-primary/30 bg-primary/5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-primary" /><h4 className="text-sm font-semibold">AI Analysis for {eng.id}</h4></div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold">{isRisk ? 76 : 87}% confidence</span>
          <Button size="icon" variant="ghost" className="h-6 w-6" onClick={onClose}><X className="h-3 w-3" /></Button>
        </div>
      </div>

      <div className="mb-4">
        <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-2">Current Team</div>
        <div className="space-y-2">
          {STAFF.slice(0, 3).map((s, i) => {
            const match = [82, 64, 71][i];
            return (
              <div key={s.id} className="flex items-center gap-2 p-2 rounded-md border border-border">
                <div className="h-7 w-7 rounded-full bg-primary/10 text-primary text-[10px] font-semibold flex items-center justify-center">{s.initials}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium">{s.name}</div>
                  <div className="text-[10px] text-muted-foreground">{s.role} · {s.utilization}% utilization</div>
                </div>
                <div className="w-24 flex items-center gap-1.5">
                  <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden"><div className={`h-full ${match > 80 ? "bg-emerald-500" : match > 60 ? "bg-amber-500" : "bg-red-500"}`} style={{ width: `${match}%` }} /></div>
                  <span className="text-[10px] tabular-nums w-7 text-right">{match}%</span>
                </div>
                {i === 1 && <Flag className="h-3.5 w-3.5 text-red-600" title="Risk: overutilized" />}
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-2">Recommendations</div>
        <div className="space-y-3">
          <div className="p-3 border border-border rounded-md bg-background">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold">ADD</span>
              <div className="h-6 w-6 rounded-full bg-primary/10 text-primary text-[10px] font-semibold flex items-center justify-center">MR</div>
              <span className="text-sm font-medium">Mike Reeves</span>
              <span className="text-[10px] ml-auto px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">94% match</span>
            </div>
            <div className="text-xs text-muted-foreground italic mb-3">12 similar engagements completed · 94% on-time rate · QuickBooks ProAdvisor</div>
            <div className="flex gap-2">
              <Button size="sm" data-testid={`accept-${eng.id}`} onClick={() => { toast.success(`Allocation updated. Mike Reeves added to ${eng.id}.`); onClose(); }} className="gap-1.5"><Check className="h-3.5 w-3.5" />Accept & Apply</Button>
              <Button size="sm" variant="outline" onClick={() => toast("Dismissed: client preference noted")}>Dismiss</Button>
            </div>
          </div>
          {isRisk && (
            <div className="p-3 border border-red-200 dark:border-red-900 rounded-md bg-red-50 dark:bg-red-900/10">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-red-100 text-red-800 font-semibold">REPLACE</span>
                <span className="text-sm font-medium">David Kim → Lisa Park</span>
                <span className="text-[10px] ml-auto px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-800">Urgent</span>
              </div>
              <div className="text-xs text-muted-foreground italic mb-3">David is at 88% utilization with 2 concurrent audits. Lisa has matching GAAP/IFRS skills and 23% capacity.</div>
              <div className="flex gap-2">
                <Button size="sm" onClick={() => { toast.success("Replacement applied"); onClose(); }}><Check className="h-3.5 w-3.5 mr-1" />Accept</Button>
                <Button size="sm" variant="outline">Dismiss</Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

const AIAllocationExisting = () => {
  const [expanded, setExpanded] = useState(null);

  return (
    <div data-testid="ai-allocation-existing-page">
      <PageHeader title="AI Staff Allocation" description="Smart team composition recommendations" />
      <TabsBar />

      <div className="mb-5 flex items-start gap-3 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-md">
        <AlertTriangle className="h-4 w-4 text-amber-700 dark:text-amber-300 mt-0.5" />
        <div className="text-sm text-amber-900 dark:text-amber-200">
          AI identified <span className="font-semibold">3 engagements</span> where team composition may risk on-time delivery. Review now →
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {ENGAGEMENTS.slice(0, 4).map((e, i) => (
          <Card key={e.id} data-testid={`alloc-card-${e.id}`} className="p-5">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="font-mono text-xs text-primary font-semibold">{e.id}</div>
                <div className="text-sm font-semibold mt-0.5">{e.client}</div>
                <div className="text-[11px] text-muted-foreground mt-0.5">{e.service}</div>
              </div>
              <StatusBadge status={HEALTH[i]} />
            </div>

            <div className="flex items-center gap-1 mb-4">
              {STAFF.slice(0, 4).map((s, j) => (
                <div key={s.id} className="h-7 w-7 rounded-full bg-primary/10 text-primary text-[10px] font-semibold flex items-center justify-center border-2 border-background" style={{ marginLeft: j === 0 ? 0 : -8 }} title={s.name}>{s.initials}</div>
              ))}
              <span className="text-xs text-muted-foreground ml-2">4 staff</span>
            </div>

            <Button data-testid={`ai-suggest-${e.id}`} size="sm" variant={HEALTH[i] === "Optimal" ? "outline" : "default"} onClick={() => setExpanded(expanded === e.id ? null : e.id)} className="gap-1.5">
              <Sparkles className="h-3.5 w-3.5" />{expanded === e.id ? "Hide" : "AI Suggest"}
            </Button>

            {expanded === e.id && <Suggest eng={e} health={HEALTH[i]} onClose={() => setExpanded(null)} />}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AIAllocationExisting;
