import React from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Upload, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { STAFF } from "@/lib/seed";

const EVENTS = [
  { event: "Time Entry Submitted", roles: "Approver" },
  { event: "Time Entry Approved", roles: "Staff" },
  { event: "Time Entry Rejected", roles: "Staff" },
  { event: "Task Overdue", roles: "Assignee + Manager" },
  { event: "Invoice Sent", roles: "Client" },
  { event: "Invoice Overdue", roles: "Admin + Client" },
  { event: "Engagement Deadline (7 days)", roles: "Manager + Assigned" },
  { event: "Client Health Drop", roles: "Partner" },
];

const ROLES = ["Admin", "Manager", "Approver", "Staff"];

const AdminSettings = () => {
  return (
    <div data-testid="admin-settings-page">
      <PageHeader title="Admin Settings" description="Configure your firm — users, roles, integrations" />

      <Tabs defaultValue="users">
        <TabsList>
          <TabsTrigger value="users">Users & Roles</TabsTrigger>
          <TabsTrigger value="lms">LMS Management</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="system">System Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="mt-4">
          <div className="flex justify-end mb-3"><Button data-testid="add-user-btn" onClick={() => toast.success("User invited")}><Plus className="h-4 w-4 mr-1.5" />Add User</Button></div>
          <Card className="overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-[11px] uppercase text-muted-foreground"><tr><th className="text-left py-2 px-4">User</th><th className="text-left py-2 px-4">Email</th><th className="text-left py-2 px-4">Role</th><th className="text-left py-2 px-4">Status</th><th className="text-right py-2 px-4">Action</th></tr></thead>
              <tbody>
                {STAFF.map((s, i) => (
                  <tr key={s.id} className="border-t border-border">
                    <td className="py-2.5 px-4"><div className="flex items-center gap-2"><div className="h-7 w-7 rounded-full bg-primary/10 text-primary text-[10px] font-semibold flex items-center justify-center">{s.initials}</div>{s.name}</div></td>
                    <td className="py-2.5 px-4 text-muted-foreground">{s.name.toLowerCase().replace(" ", ".")}@firm.com</td>
                    <td className="py-2.5 px-4"><span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold">{i === 0 ? "Admin" : i === 1 ? "Approver" : "Staff"}</span></td>
                    <td className="py-2.5 px-4"><Switch defaultChecked /></td>
                    <td className="py-2.5 px-4 text-right"><Button size="icon" variant="ghost" className="h-7 w-7"><Edit className="h-3.5 w-3.5" /></Button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </TabsContent>

        <TabsContent value="lms" className="mt-4">
          <Card className="p-5">
            <h3 className="text-base font-semibold mb-3">LMS Management</h3>
            <p className="text-sm text-muted-foreground mb-4">Configure CPE tracking, assign required courses, and manage learning paths.</p>
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 border border-border rounded-md"><div className="text-xs text-muted-foreground">Required Courses</div><div className="text-2xl font-bold tabular-nums mt-1">8</div></div>
              <div className="p-4 border border-border rounded-md"><div className="text-xs text-muted-foreground">Total Enrollments</div><div className="text-2xl font-bold tabular-nums mt-1">142</div></div>
              <div className="p-4 border border-border rounded-md"><div className="text-xs text-muted-foreground">Completion Rate</div><div className="text-2xl font-bold tabular-nums mt-1 text-emerald-700">76%</div></div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-4">
          <Card className="overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-[11px] uppercase text-muted-foreground"><tr><th className="text-left py-2 px-4">Event</th><th className="text-center py-2 px-4">Email</th><th className="text-center py-2 px-4">In-App</th><th className="text-left py-2 px-4">Recipient Role</th></tr></thead>
              <tbody>
                {EVENTS.map((e) => (
                  <tr key={e.event} className="border-t border-border">
                    <td className="py-2.5 px-4 font-medium">{e.event}</td>
                    <td className="py-2.5 px-4 text-center"><Switch defaultChecked /></td>
                    <td className="py-2.5 px-4 text-center"><Switch defaultChecked /></td>
                    <td className="py-2.5 px-4 text-xs text-muted-foreground">{e.roles}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="mt-4">
          <Card className="p-5">
            <div className="grid grid-cols-2 gap-5">
              <div><Label>Firm Name</Label><Input defaultValue="Hartwell Capital CPA" /></div>
              <div>
                <Label>Logo</Label>
                <div className="flex items-center gap-2 mt-1">
                  <div className="h-10 w-10 rounded-md bg-primary text-primary-foreground font-bold flex items-center justify-center">H</div>
                  <Button variant="outline" size="sm"><Upload className="h-3.5 w-3.5 mr-1.5" />Upload</Button>
                </div>
              </div>
              <div><Label>Default Timezone</Label>
                <Select defaultValue="America/New_York"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>
                  <SelectItem value="America/New_York">America/New_York</SelectItem><SelectItem value="America/Chicago">America/Chicago</SelectItem><SelectItem value="America/Los_Angeles">America/Los_Angeles</SelectItem>
                </SelectContent></Select>
              </div>
              <div><Label>Date Format</Label>
                <Select defaultValue="MM/DD/YYYY"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>
                  <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem><SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem><SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                </SelectContent></Select>
              </div>
              <div><Label>Working Hours/Day</Label><Input type="number" defaultValue="8" /></div>
              <div><Label>Currency</Label>
                <Select defaultValue="USD"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>
                  <SelectItem value="USD">USD</SelectItem><SelectItem value="EUR">EUR</SelectItem><SelectItem value="GBP">GBP</SelectItem>
                </SelectContent></Select>
              </div>
              <div><Label>Time Entry Lock Period (days)</Label><Input type="number" defaultValue="14" /></div>
              <div className="flex items-end">
                <div className="w-full flex items-center justify-between p-3 border border-border rounded-md">
                  <div>
                    <div className="text-sm font-medium">QuickBooks Online</div>
                    <div className="text-xs text-emerald-700 dark:text-emerald-400 flex items-center gap-1 mt-0.5"><CheckCircle className="h-3 w-3" />Connected</div>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </div>
            <div className="flex justify-end mt-5">
              <Button data-testid="save-system-btn" onClick={() => toast.success("Settings saved")}>Save Settings</Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSettings;
