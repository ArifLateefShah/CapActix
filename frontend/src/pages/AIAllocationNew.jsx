import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { PageHeader } from "@/components/common/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sparkles, CheckCircle, AlertTriangle, ArrowLeftRight } from "lucide-react";
import { toast } from "sonner";
import { STAFF } from "@/lib/seed";

const CERTS = ["CPA", "EA", "QBO ProAdvisor", "CGMA", "CFA"];

const TabsBar = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const tab = pathname.endsWith("/new") ? "new" : "existing";
  return (
    <Tabs value={tab} onValueChange={(v) => navigate(v === "new" ? "/ai-allocation/new" : "/ai-allocation/existing")} className="mb-5">
      <TabsList>
        <TabsTrigger value="existing">Existing Engagements</TabsTrigger>
        <TabsTrigger value="new">New Engagement</TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

const AIAllocationNew = () => {
  const [generated, setGenerated] = useState(true); // start with proposal visible (seed)
  const [loading, setLoading] = useState(false);
  const [selectedCerts, setSelectedCerts] = useState(["CPA", "EA"]);

  const proposal = [
    { ...STAFF[1], match: 96, exp: "8 similar 1120S engagements", certs: ["CPA", "CGMA"] },
    { ...STAFF[2], match: 91, exp: "12 partnership returns", certs: ["CPA", "QBO ProAdvisor"] },
    { ...STAFF[3], match: 88, exp: "1120 preparer · 14 returns last year", certs: ["EA"] },
    { ...STAFF[5], match: 78, exp: "Junior support · 22 hours availability", certs: [] },
  ];
  const teamScore = 91;

  const toggleCert = (c) => setSelectedCerts((s) => s.includes(c) ? s.filter(x => x !== c) : [...s, c]);

  const generate = () => {
    setLoading(true);
    setGenerated(false);
    setTimeout(() => {
      setLoading(false);
      setGenerated(true);
      toast.success("Team proposal generated");
    }, 1100);
  };

  return (
    <div data-testid="ai-allocation-new-page">
      <PageHeader title="AI Staff Allocation" description="Generate the optimal team for a new engagement" />
      <TabsBar />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Context form */}
        <Card className="lg:col-span-5 p-5 h-fit">
          <h3 className="text-base font-semibold mb-4">Engagement Context</h3>
          <div className="space-y-3">
            <div><Label>Service Type</Label>
              <Select defaultValue="Tax"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>
                <SelectItem value="Tax">Tax</SelectItem><SelectItem value="Audit">Audit</SelectItem><SelectItem value="Advisory">Advisory</SelectItem><SelectItem value="Bookkeeping">Bookkeeping</SelectItem>
              </SelectContent></Select>
            </div>
            <div><Label>Entity Type</Label>
              <Select defaultValue="1120S"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>
                <SelectItem value="1040">1040 Individual</SelectItem><SelectItem value="1120">1120 C-Corp</SelectItem><SelectItem value="1120S">1120S S-Corp</SelectItem><SelectItem value="1065">1065 Partnership</SelectItem><SelectItem value="990">990 Non-Profit</SelectItem>
              </SelectContent></Select>
            </div>
            <div><Label>Engagement Size (estimated hours)</Label><Input type="number" defaultValue="220" /></div>
            <div><Label>Client Industry</Label>
              <Select defaultValue="Financial Services"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>
                <SelectItem value="Financial Services">Financial Services</SelectItem><SelectItem value="Healthcare">Healthcare</SelectItem><SelectItem value="Real Estate">Real Estate</SelectItem><SelectItem value="Manufacturing">Manufacturing</SelectItem><SelectItem value="Non-Profit">Non-Profit</SelectItem><SelectItem value="Retail">Retail</SelectItem>
              </SelectContent></Select>
            </div>
            <div>
              <Label className="mb-1.5 block">Required Certifications</Label>
              <div className="flex flex-wrap gap-1.5">
                {CERTS.map(c => (
                  <button
                    key={c}
                    data-testid={`cert-${c}`}
                    onClick={() => toggleCert(c)}
                    className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${selectedCerts.includes(c) ? "bg-primary text-primary-foreground border-primary" : "bg-background border-border text-muted-foreground hover:border-primary/50"}`}
                  >{c}</button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Start Date</Label><Input type="date" defaultValue="2026-02-15" /></div>
              <div><Label>End Date</Label><Input type="date" defaultValue="2026-04-15" /></div>
            </div>
            <Button data-testid="generate-proposal-btn" className="w-full mt-2 gap-1.5" onClick={generate}><Sparkles className="h-4 w-4" />Generate AI Team Proposal</Button>
          </div>
        </Card>

        {/* Proposal */}
        <div className="lg:col-span-7">
          {loading && (
            <Card className="p-8 text-center">
              <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                <span className="h-2.5 w-2.5 rounded-full bg-primary animate-pulse" />
                <span className="h-2.5 w-2.5 rounded-full bg-primary animate-pulse" style={{ animationDelay: "150ms" }} />
                <span className="h-2.5 w-2.5 rounded-full bg-primary animate-pulse" style={{ animationDelay: "300ms" }} />
                <span className="ml-2">AI is matching your requirements...</span>
              </div>
            </Card>
          )}

          {generated && !loading && (
            <Card className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold">Recommended Team</h3>
                <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-semibold">{teamScore}% match</span>
              </div>

              <div className="space-y-3 mb-5">
                {proposal.map((s, i) => (
                  <div key={s.id} data-testid={`proposed-${s.id}`} className="p-3 border border-border rounded-md">
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 text-primary text-xs font-semibold flex items-center justify-center">{s.initials}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <div>
                            <div className="text-sm font-semibold">{s.name}</div>
                            <div className="text-[11px] text-muted-foreground">{s.role}</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-24 flex items-center gap-1.5">
                              <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden"><div className="h-full bg-emerald-500" style={{ width: `${s.match}%` }} /></div>
                              <span className="text-[10px] tabular-nums w-7 text-right">{s.match}%</span>
                            </div>
                            <Button size="sm" variant="outline" className="h-7 gap-1"><ArrowLeftRight className="h-3 w-3" />Swap</Button>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {s.certs.map(c => <span key={c} className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">{c}</span>)}
                        </div>
                        <div className="text-[11px] text-muted-foreground mt-1.5">{s.exp} · Utilization {s.utilization}%</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-3 mb-4 text-xs">
                <div className="p-3 border border-border rounded-md"><div className="text-muted-foreground">Seniority</div><div className="font-semibold mt-0.5">1M + 2S + 1J</div></div>
                <div className="p-3 border border-border rounded-md"><div className="text-muted-foreground">Capacity</div><div className="font-semibold mt-0.5">238h / 220h needed</div></div>
                <div className="p-3 border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/20 rounded-md"><div className="text-amber-800 dark:text-amber-300">Cert Gap</div><div className="font-semibold mt-0.5 text-amber-900 dark:text-amber-200">CFA missing</div></div>
              </div>

              <div className="flex items-center gap-2 p-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-md mb-4">
                <CheckCircle className="h-4 w-4 text-emerald-700 dark:text-emerald-400" />
                <div className="text-sm text-emerald-900 dark:text-emerald-200"><span className="font-semibold">No conflicts detected</span> — all team members cleared</div>
              </div>

              <div className="flex gap-2">
                <Button data-testid="accept-team-btn" className="flex-1" onClick={() => toast.success("Engagement created with proposed team")}>Accept Team & Create Engagement</Button>
                <Button variant="outline" onClick={() => window.scrollTo(0, 0)}>Adjust Requirements</Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIAllocationNew;
