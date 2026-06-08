import React, { useState, useMemo } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Eye, Edit, UserX, Mail, Phone, MapPin } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { CLIENTS } from "@/lib/seed";

const Clients = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selected, setSelected] = useState(null);
  const [addOpen, setAddOpen] = useState(false);
  const [step, setStep] = useState(1);

  const filtered = useMemo(() => {
    return CLIENTS.filter((c) => {
      if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (statusFilter !== "all" && c.status !== statusFilter) return false;
      if (typeFilter !== "all" && c.type !== typeFilter) return false;
      return true;
    });
  }, [search, statusFilter, typeFilter]);

  return (
    <div data-testid="clients-page">
      <PageHeader
        title="Clients"
        description="Manage your firm's book of business"
        actions={
          <Button data-testid="add-client-btn" onClick={() => { setStep(1); setAddOpen(true); }}>
            <Plus className="h-4 w-4 mr-1.5" />Add Client
          </Button>
        }
      />

      <Card className="p-4 mb-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input data-testid="clients-search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search clients..." className="pl-9" />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger data-testid="filter-status" className="w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger data-testid="filter-type" className="w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Recurring">Recurring</SelectItem>
              <SelectItem value="Adhoc">Adhoc</SelectItem>
              <SelectItem value="Seasonal">Seasonal</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-[11px] uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="text-left py-3 px-4">Company</th>
                <th className="text-left py-3 px-4">Industry</th>
                <th className="text-left py-3 px-4">Type</th>
                <th className="text-left py-3 px-4">Country</th>
                <th className="text-left py-3 px-4">Timezone</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-right py-3 px-4">Engagements</th>
                <th className="text-right py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr
                  key={c.id}
                  data-testid={`client-row-${c.id}`}
                  onClick={() => setSelected(c)}
                  className="border-t border-border hover:bg-muted/40 cursor-pointer"
                >
                  <td className="py-3 px-4 font-medium">{c.name}</td>
                  <td className="py-3 px-4 text-muted-foreground">{c.industry}</td>
                  <td className="py-3 px-4">{c.type}</td>
                  <td className="py-3 px-4 text-muted-foreground">{c.country}</td>
                  <td className="py-3 px-4 text-muted-foreground text-xs">{c.tz}</td>
                  <td className="py-3 px-4"><StatusBadge status={c.status} /></td>
                  <td className="py-3 px-4 text-right tabular-nums">{c.engagements}</td>
                  <td className="py-3 px-4 text-right">
                    <div className="inline-flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setSelected(c)}><Eye className="h-3.5 w-3.5" /></Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7"><Edit className="h-3.5 w-3.5" /></Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => toast.warning(`${c.name} deactivated`)}><UserX className="h-3.5 w-3.5" /></Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Side panel */}
      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent data-testid="client-detail-panel" className="w-[520px] sm:max-w-[520px] overflow-y-auto">
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle>{selected.name}</SheetTitle>
                <SheetDescription>{selected.industry} · {selected.type}</SheetDescription>
              </SheetHeader>
              <Tabs defaultValue="overview" className="mt-4">
                <TabsList className="w-full">
                  <TabsTrigger value="overview" className="flex-1">Overview</TabsTrigger>
                  <TabsTrigger value="contacts" className="flex-1">Contacts</TabsTrigger>
                  <TabsTrigger value="engagements" className="flex-1">Engagements</TabsTrigger>
                  <TabsTrigger value="documents" className="flex-1">Documents</TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="space-y-3 mt-4 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground"><MapPin className="h-4 w-4" />{selected.country} · {selected.tz}</div>
                  <div className="flex items-center gap-2 text-muted-foreground"><Mail className="h-4 w-4" />{selected.email}</div>
                  <div className="flex items-center gap-2 text-muted-foreground"><Phone className="h-4 w-4" />{selected.phone}</div>
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    <div className="p-3 rounded-md border border-border"><div className="text-[11px] text-muted-foreground">Active Engagements</div><div className="text-xl font-bold tabular-nums">{selected.engagements}</div></div>
                    <div className="p-3 rounded-md border border-border"><div className="text-[11px] text-muted-foreground">Status</div><div className="mt-1"><StatusBadge status={selected.status} /></div></div>
                  </div>
                </TabsContent>
                <TabsContent value="contacts" className="mt-4 text-sm">
                  <div className="p-3 rounded-md border border-border">
                    <div className="text-sm font-semibold">{selected.contact}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">Primary Contact</div>
                    <div className="text-xs text-muted-foreground mt-2">{selected.email} · {selected.phone}</div>
                  </div>
                </TabsContent>
                <TabsContent value="engagements" className="mt-4 text-sm text-muted-foreground">
                  {selected.engagements} active engagements. See Engagements tab for details.
                </TabsContent>
                <TabsContent value="documents" className="mt-4 text-sm text-muted-foreground">
                  Document vault contains 24 files across {selected.engagements} engagements.
                </TabsContent>
              </Tabs>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Add Client multi-step */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent data-testid="add-client-modal" className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add Client — Step {step} of 3</DialogTitle>
          </DialogHeader>
          {step === 1 && (
            <div className="space-y-3">
              <div><Label>Firm name</Label><Input placeholder="ACME Inc" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Industry</Label><Input placeholder="Financial Services" /></div>
                <div><Label>Type</Label>
                  <Select defaultValue="Recurring"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>
                    <SelectItem value="Recurring">Recurring</SelectItem><SelectItem value="Adhoc">Adhoc</SelectItem><SelectItem value="Seasonal">Seasonal</SelectItem>
                  </SelectContent></Select></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Country</Label><Input defaultValue="USA" /></div>
                <div><Label>Timezone</Label><Input defaultValue="America/New_York" /></div>
              </div>
            </div>
          )}
          {step === 2 && (
            <div className="space-y-3">
              <div><Label>Contact Name</Label><Input placeholder="Jane Doe" /></div>
              <div><Label>Email</Label><Input placeholder="jane@acme.com" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Phone</Label><Input placeholder="(212) 555-0100" /></div>
                <div><Label>Designation</Label><Input placeholder="CFO" /></div>
              </div>
            </div>
          )}
          {step === 3 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border border-border rounded-md">
                <div><div className="text-sm font-medium">Send portal invite</div><div className="text-xs text-muted-foreground">Email a setup link to the primary contact</div></div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between p-3 border border-border rounded-md">
                <div><div className="text-sm font-medium">Require 2FA</div><div className="text-xs text-muted-foreground">Force two-factor login</div></div>
                <Switch />
              </div>
            </div>
          )}
          <DialogFooter className="flex justify-between sm:justify-between">
            <Button variant="outline" disabled={step === 1} onClick={() => setStep(step - 1)}>Back</Button>
            {step < 3 ? (
              <Button data-testid="add-client-next" onClick={() => setStep(step + 1)}>Next</Button>
            ) : (
              <Button data-testid="add-client-submit" onClick={() => { setAddOpen(false); toast.success("Client added successfully"); }}>Create Client</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Clients;
