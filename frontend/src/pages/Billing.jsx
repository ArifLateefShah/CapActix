import React from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Eye, Edit, Send, Download, RefreshCw, CheckCircle2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { INVOICES, ENGAGEMENTS } from "@/lib/seed";

const KPI = ({ label, value, color = "text-foreground" }) => (
  <Card className="p-5">
    <div className="text-xs text-muted-foreground">{label}</div>
    <div className={`text-2xl font-bold tabular-nums mt-1 ${color}`}>{value}</div>
  </Card>
);

const Billing = () => {
  const totalInvoiced = INVOICES.reduce((s, x) => s + x.amount, 0);
  const collected = INVOICES.filter(i => i.status === "Paid").reduce((s, x) => s + x.amount, 0);
  const outstanding = INVOICES.filter(i => i.status === "Sent" || i.status === "Draft").reduce((s, x) => s + x.amount, 0);
  const overdue = INVOICES.filter(i => i.status === "Overdue").reduce((s, x) => s + x.amount, 0);

  return (
    <div data-testid="billing-page">
      <PageHeader
        title="Billing & Invoices"
        description="Manage invoicing, track collections, sync to QuickBooks"
        actions={
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-300 text-xs font-medium">
            <CheckCircle2 className="h-3.5 w-3.5" />QuickBooks Connected
          </div>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KPI label="Invoiced This Month" value={`$${totalInvoiced.toLocaleString()}`} />
        <KPI label="Collected" value={`$${collected.toLocaleString()}`} color="text-emerald-700 dark:text-emerald-400" />
        <KPI label="Outstanding" value={`$${outstanding.toLocaleString()}`} color="text-blue-700 dark:text-blue-400" />
        <KPI label="Overdue" value={`$${overdue.toLocaleString()}`} color="text-red-700 dark:text-red-400" />
      </div>

      <Tabs defaultValue="invoices">
        <TabsList>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="generate">Generate Invoice</TabsTrigger>
          <TabsTrigger value="reminders">Payment Reminders</TabsTrigger>
        </TabsList>

        <TabsContent value="invoices" className="mt-4">
          <Card className="overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-[11px] uppercase text-muted-foreground">
                <tr><th className="text-left py-2 px-4">Invoice #</th><th className="text-left py-2 px-4">Client</th><th className="text-left py-2 px-4">Engagement</th><th className="text-left py-2 px-4">Period</th><th className="text-right py-2 px-4">Amount</th><th className="text-left py-2 px-4">Status</th><th className="text-right py-2 px-4">Actions</th></tr>
              </thead>
              <tbody>
                {INVOICES.map((inv) => (
                  <tr key={inv.id} className="border-t border-border hover:bg-muted/30">
                    <td className="py-2.5 px-4 font-mono text-xs font-semibold">{inv.id}</td>
                    <td className="py-2.5 px-4">{inv.client}</td>
                    <td className="py-2.5 px-4 font-mono text-xs">{inv.engagement}</td>
                    <td className="py-2.5 px-4 text-muted-foreground">{inv.period}</td>
                    <td className="py-2.5 px-4 text-right tabular-nums font-medium">${inv.amount.toLocaleString()}</td>
                    <td className="py-2.5 px-4"><StatusBadge status={inv.status} /></td>
                    <td className="py-2.5 px-4 text-right">
                      <div className="inline-flex gap-0.5">
                        <Button size="icon" variant="ghost" className="h-7 w-7"><Eye className="h-3.5 w-3.5" /></Button>
                        <Button size="icon" variant="ghost" className="h-7 w-7"><Edit className="h-3.5 w-3.5" /></Button>
                        <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => toast.success("Posted to QBO")}><RefreshCw className="h-3.5 w-3.5" /></Button>
                        <Button size="icon" variant="ghost" className="h-7 w-7"><Download className="h-3.5 w-3.5" /></Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </TabsContent>

        <TabsContent value="generate" className="mt-4">
          <Card className="p-5">
            <h3 className="text-base font-semibold mb-4">Generate Invoice</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div><Label>Engagement</Label>
                  <Select><SelectTrigger><SelectValue placeholder="Select engagement" /></SelectTrigger><SelectContent>
                    {ENGAGEMENTS.map(e => <SelectItem key={e.id} value={e.id}>{e.id} — {e.client}</SelectItem>)}
                  </SelectContent></Select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>Period Start</Label><Input type="date" /></div>
                  <div><Label>Period End</Label><Input type="date" /></div>
                </div>
                <div className="p-3 bg-muted/40 rounded-md text-sm space-y-1">
                  <div className="flex justify-between"><span>Hours</span><span className="tabular-nums font-medium">42.5</span></div>
                  <div className="flex justify-between"><span>Bill Rate</span><span className="tabular-nums font-medium">$285/hr</span></div>
                  <div className="flex justify-between border-t border-border pt-1 mt-1 font-semibold"><span>Total</span><span className="tabular-nums">$12,112.50</span></div>
                </div>
              </div>
              <div>
                <Label>Preview</Label>
                <div className="border border-border rounded-md p-4 mt-1 text-sm space-y-2">
                  <div className="flex justify-between"><span className="font-semibold">INVOICE</span><span className="text-muted-foreground">DRAFT</span></div>
                  <div className="text-xs text-muted-foreground">To: Hartwell & Associates LLC</div>
                  <table className="w-full text-xs mt-3">
                    <thead className="border-b border-border"><tr><th className="text-left py-1">Description</th><th className="text-right py-1">Hours</th><th className="text-right py-1">Amount</th></tr></thead>
                    <tbody>
                      <tr><td className="py-1">Federal Tax 1120S Preparation</td><td className="text-right tabular-nums">42.5</td><td className="text-right tabular-nums">$12,112.50</td></tr>
                    </tbody>
                  </table>
                  <div className="text-right font-bold tabular-nums">$12,112.50</div>
                </div>
                <div className="flex gap-2 mt-3">
                  <Button variant="outline" className="flex-1">Save Draft</Button>
                  <Button className="flex-1" onClick={() => toast.success("Invoice posted to QBO")}><Send className="h-3.5 w-3.5 mr-1" />Post to QBO</Button>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="reminders" className="mt-4">
          <Card className="overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-[11px] uppercase text-muted-foreground"><tr><th className="text-left py-2 px-4">Invoice</th><th className="text-left py-2 px-4">Client</th><th className="text-right py-2 px-4">Amount</th><th className="text-left py-2 px-4">Last Sent</th><th className="text-right py-2 px-4">Auto Reminder</th></tr></thead>
              <tbody>
                {INVOICES.filter(i => i.status === "Overdue").map((inv) => (
                  <tr key={inv.id} className="border-t border-border">
                    <td className="py-2.5 px-4 font-mono text-xs">{inv.id}</td>
                    <td className="py-2.5 px-4">{inv.client}</td>
                    <td className="py-2.5 px-4 text-right tabular-nums">${inv.amount.toLocaleString()}</td>
                    <td className="py-2.5 px-4 text-muted-foreground">2026-02-01</td>
                    <td className="py-2.5 px-4 text-right"><Switch defaultChecked /></td>
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

export default Billing;
