import React from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { StatusBadge } from "@/components/common/StatusBadge";
import { FileText, MessageCircle, Receipt, Clock, FormInput, Folder, Info } from "lucide-react";

const STEPS = ["Onboarding", "Documents Received", "In Progress", "Review", "Complete"];
const CURRENT_STEP = 2;

const PortalPreview = () => {
  return (
    <div data-testid="portal-preview-page">
      <PageHeader title="Client Portal Preview" description="Simulated view of what your client sees" />

      <div data-testid="impersonation-banner" className="mb-4 flex items-center gap-2 px-4 py-2.5 bg-amber-50 dark:bg-amber-900/20 text-amber-900 dark:text-amber-200 border border-amber-200 dark:border-amber-800 rounded-md text-sm">
        <Info className="h-4 w-4" />
        You are viewing as: <span className="font-semibold">Sarah Mitchell (Client)</span> — CapActix-PMS Portal
      </div>

      <div className="border border-border rounded-lg overflow-hidden bg-background shadow-sm">
        {/* Fake browser chrome */}
        <div className="flex items-center gap-2 px-4 py-2 bg-muted/60 border-b border-border">
          <div className="flex gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-red-400" /><div className="h-2.5 w-2.5 rounded-full bg-amber-400" /><div className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
          </div>
          <div className="flex-1 ml-3 text-[11px] text-muted-foreground font-mono">portal.hartwellcpa.com/sarah-mitchell</div>
        </div>

        {/* Branded header */}
        <div className="px-6 py-5 border-b border-border bg-gradient-to-r from-blue-50 via-background to-background dark:from-blue-900/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-md bg-primary text-primary-foreground flex items-center justify-center font-bold">H</div>
              <div>
                <div className="text-base font-bold">Hartwell & Associates LLC</div>
                <div className="text-xs text-muted-foreground">Client Portal · Welcome, Sarah</div>
              </div>
            </div>
            <div className="h-9 w-9 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">SM</div>
          </div>
        </div>

        {/* Progress */}
        <div className="px-6 py-5 border-b border-border">
          <div className="text-xs text-muted-foreground mb-3 font-medium">Engagement Progress · 2025 Tax Filing</div>
          <div className="flex items-center gap-2">
            {STEPS.map((s, i) => (
              <React.Fragment key={s}>
                <div className="flex flex-col items-center min-w-0 flex-1">
                  <div className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-semibold ${i <= CURRENT_STEP ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>{i + 1}</div>
                  <div className={`mt-1.5 text-[11px] font-medium text-center truncate w-full ${i === CURRENT_STEP ? "text-primary" : "text-muted-foreground"}`}>{s}</div>
                </div>
                {i < STEPS.length - 1 && <div className={`h-0.5 flex-1 ${i < CURRENT_STEP ? "bg-primary" : "bg-muted"}`} style={{ marginBottom: 20 }} />}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="p-6">
          <Tabs defaultValue="documents">
            <TabsList>
              <TabsTrigger value="documents"><Folder className="h-3.5 w-3.5 mr-1" />My Documents</TabsTrigger>
              <TabsTrigger value="tasks"><Clock className="h-3.5 w-3.5 mr-1" />My Tasks</TabsTrigger>
              <TabsTrigger value="messages"><MessageCircle className="h-3.5 w-3.5 mr-1" />Messages</TabsTrigger>
              <TabsTrigger value="forms"><FormInput className="h-3.5 w-3.5 mr-1" />Forms</TabsTrigger>
              <TabsTrigger value="invoices"><Receipt className="h-3.5 w-3.5 mr-1" />Invoices</TabsTrigger>
              <TabsTrigger value="timesheet"><FileText className="h-3.5 w-3.5 mr-1" />Timesheet</TabsTrigger>
            </TabsList>

            <TabsContent value="documents" className="mt-4 space-y-2">
              {["W-2 2025.pdf", "1099-MISC.pdf", "Prior Year Return.pdf", "Engagement Letter (Signed).pdf"].map((f) => (
                <Card key={f} className="p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2"><FileText className="h-4 w-4 text-blue-600" /><span className="text-sm">{f}</span></div>
                  <button className="text-xs text-primary font-medium">Download</button>
                </Card>
              ))}
            </TabsContent>
            <TabsContent value="tasks" className="mt-4 space-y-2">
              {[{ t: "Upload missing 1099-MISC", s: "Pending" }, { t: "Sign engagement letter", s: "Approved" }, { t: "Review draft return", s: "In Progress" }].map((x) => (
                <Card key={x.t} className="p-3 flex items-center justify-between"><span className="text-sm">{x.t}</span><StatusBadge status={x.s} /></Card>
              ))}
            </TabsContent>
            <TabsContent value="messages" className="mt-4 space-y-3">
              <Card className="p-3"><div className="text-xs text-muted-foreground mb-1">Mike Reeves · 2h ago</div><div className="text-sm">Hi Sarah — please upload your latest 1099 when you get a chance.</div></Card>
              <Card className="p-3"><div className="text-xs text-muted-foreground mb-1">You · Yesterday</div><div className="text-sm">Got it — will do today!</div></Card>
            </TabsContent>
            <TabsContent value="forms" className="mt-4">
              <Card className="p-4 flex items-center justify-between"><div><div className="text-sm font-medium">2025 Tax Organizer</div><div className="text-xs text-muted-foreground">12 of 18 questions complete</div></div><button className="text-xs text-primary font-medium">Continue</button></Card>
            </TabsContent>
            <TabsContent value="invoices" className="mt-4">
              <Card className="p-3 flex items-center justify-between"><div><div className="text-sm font-medium">INV-2026-0042</div><div className="text-xs text-muted-foreground">Jan 2026 · $8,550.00</div></div><StatusBadge status="Paid" /></Card>
            </TabsContent>
            <TabsContent value="timesheet" className="mt-4">
              <Card className="p-4 text-sm text-muted-foreground">Your firm has logged <span className="font-semibold text-foreground">14.5 hours</span> on your engagement this month.</Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default PortalPreview;
