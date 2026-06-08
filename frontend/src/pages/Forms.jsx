import React, { useState, useRef } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Type, Hash, ChevronDown, Calendar, Upload, PenSquare, Minus, Send, Eye, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

const FIELDS = [
  { id: "text", icon: Type, label: "Text" },
  { id: "number", icon: Hash, label: "Number" },
  { id: "ssn", icon: ShieldCheck, label: "SSN" },
  { id: "dropdown", icon: ChevronDown, label: "Dropdown" },
  { id: "date", icon: Calendar, label: "Date" },
  { id: "file", icon: Upload, label: "File Upload" },
  { id: "signature", icon: PenSquare, label: "Signature" },
  { id: "section", icon: Minus, label: "Section Break" },
];

// Format a raw digit string (up to 9 digits) as XXX-XX-XXXX
const formatSSN = (digits) => {
  const d = digits.slice(0, 9);
  if (d.length <= 3) return d;
  if (d.length <= 5) return `${d.slice(0, 3)}-${d.slice(3)}`;
  return `${d.slice(0, 3)}-${d.slice(3, 5)}-${d.slice(5)}`;
};

const SSNField = ({ id, label }) => {
  const [raw, setRaw] = useState("");
  const [touched, setTouched] = useState(false);
  const onChange = (e) => {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 9);
    setRaw(digits);
  };
  const isComplete = raw.length === 9;
  const showError = touched && raw.length > 0 && !isComplete;
  return (
    <div className="space-y-1">
      <label htmlFor={`field-input-${id}`} className="text-xs font-medium text-foreground flex items-center gap-1.5">
        <ShieldCheck className="h-3.5 w-3.5 text-primary" />
        {label} <span className="text-red-600">*</span>
      </label>
      <input
        id={`field-input-${id}`}
        data-testid={`ssn-input-${id}`}
        type="text"
        inputMode="numeric"
        autoComplete="off"
        placeholder="XXX-XX-XXXX"
        maxLength={11}
        value={formatSSN(raw)}
        onChange={onChange}
        onBlur={() => setTouched(true)}
        aria-invalid={showError}
        className={`w-full h-9 px-3 rounded-md border bg-background text-sm tabular-nums tracking-wider focus:outline-none focus:ring-2 focus:ring-ring/30 ${
          showError ? "border-red-500 focus:ring-red-500/30" : "border-input"
        }`}
      />
      {showError ? (
        <p data-testid={`ssn-error-${id}`} className="text-[11px] text-red-600">SSN must be exactly 9 digits</p>
      ) : (
        <p className="text-[11px] text-muted-foreground">9-digit US Social Security Number · numeric only</p>
      )}
    </div>
  );
};

const FieldPreview = ({ f }) => {
  if (f.type === "section") {
    return <div className="py-2 border-y border-border text-xs font-semibold uppercase tracking-wider text-muted-foreground">{f.label}</div>;
  }
  if (f.type === "ssn") {
    return <SSNField id={f.id} label={f.label} />;
  }
  const label = (
    <label className="text-xs font-medium text-foreground block mb-1">{f.label}</label>
  );
  if (f.type === "number") {
    return (
      <div>
        {label}
        <input type="number" inputMode="numeric" className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm" placeholder="0" />
      </div>
    );
  }
  if (f.type === "date") {
    return (
      <div>
        {label}
        <input type="date" className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm" />
      </div>
    );
  }
  if (f.type === "dropdown") {
    return (
      <div>
        {label}
        <select className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm">
          <option>Select an option…</option>
          <option>Option A</option>
          <option>Option B</option>
        </select>
      </div>
    );
  }
  if (f.type === "file") {
    return (
      <div>
        {label}
        <div className="border border-dashed border-input rounded-md p-3 text-xs text-muted-foreground flex items-center gap-2">
          <Upload className="h-3.5 w-3.5" /> Drop files here or click to upload
        </div>
      </div>
    );
  }
  if (f.type === "signature") {
    return (
      <div>
        {label}
        <div className="border border-dashed border-input rounded-md h-14 flex items-center justify-center text-xs text-muted-foreground italic">
          Sign here
        </div>
      </div>
    );
  }
  return (
    <div>
      {label}
      <input type="text" className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm" placeholder={f.label} />
    </div>
  );
};

const TEMPLATES = [
  { name: "Tax Organizer 2025", desc: "Comprehensive client info gathering for individual returns", fields: 24 },
  { name: "KYC Form", desc: "Know Your Customer compliance form", fields: 12 },
  { name: "Payroll Info", desc: "Payroll setup for new business clients", fields: 18 },
  { name: "NDA", desc: "Non-disclosure agreement template", fields: 6 },
  { name: "Engagement Letter", desc: "Standard engagement letter template", fields: 9 },
];

const RESPONSES = [
  { client: "Hartwell & Associates", form: "Tax Organizer 2025", sent: "2026-01-15", status: "Completed" },
  { client: "Meridian Tax Group", form: "KYC Form", sent: "2026-01-22", status: "Completed" },
  { client: "Blue Ridge Advisory", form: "Tax Organizer 2025", sent: "2026-02-01", status: "Pending" },
  { client: "Coastal CPA Partners", form: "Payroll Info", sent: "2026-02-03", status: "Pending" },
  { client: "Summit Financial", form: "Engagement Letter", sent: "2026-01-28", status: "Completed" },
  { client: "Apex Accounting", form: "Tax Organizer 2025", sent: "2026-02-05", status: "Pending" },
];

const Forms = () => {
  const idCounter = useRef(100);
  const [canvas, setCanvas] = useState([
    { id: 1, type: "text", label: "Full Name" },
    { id: 2, type: "ssn", label: "Social Security Number" },
    { id: 3, type: "date", label: "Date of Birth" },
    { id: 4, type: "section", label: "Income Information" },
    { id: 5, type: "file", label: "Upload W-2s" },
  ]);

  const addField = (type, label) => {
    idCounter.current += 1;
    setCanvas((prev) => [...prev, { id: idCounter.current, type, label: `${label} ${prev.length + 1}` }]);
    toast.success(`${label} field added`);
  };

  return (
    <div data-testid="forms-page">
      <PageHeader title="Forms & Templates" description="Collect structured information from clients" />

      <Tabs defaultValue="builder">
        <TabsList>
          <TabsTrigger value="builder">Form Builder</TabsTrigger>
          <TabsTrigger value="templates">Form Templates</TabsTrigger>
          <TabsTrigger value="responses">Responses</TabsTrigger>
        </TabsList>

        <TabsContent value="builder" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <Card className="lg:col-span-3 p-4 h-fit">
              <div className="text-xs uppercase tracking-wider text-muted-foreground mb-3">Field Palette</div>
              <div className="space-y-1.5">
                {FIELDS.map((f) => (
                  <button key={f.id} data-testid={`field-${f.id}`} onClick={() => addField(f.id, f.label)} className="w-full flex items-center gap-2 p-2 rounded-md border border-border hover:bg-muted text-sm">
                    <f.icon className="h-4 w-4 text-muted-foreground" />{f.label}
                  </button>
                ))}
              </div>
            </Card>

            <Card className="lg:col-span-6 p-5 min-h-[500px]">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-semibold">2026 Tax Organizer (Draft)</h3>
                  <p className="text-xs text-muted-foreground">Drag fields onto the canvas, configure logic per field</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm"><Eye className="h-3.5 w-3.5 mr-1" />Preview</Button>
                  <Button size="sm" onClick={() => toast.success("Form sent to selected clients")}><Send className="h-3.5 w-3.5 mr-1" />Send to client</Button>
                </div>
              </div>
              <div className="space-y-3">
                {canvas.map((f) => (
                  <div key={f.id} data-testid={`canvas-field-${f.type}-${f.id}`} className="p-3 border border-dashed border-border rounded-md hover:border-primary/50 transition-colors group">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <FieldPreview f={f} />
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground shrink-0 mt-0.5">{f.type}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="lg:col-span-3 p-4 h-fit">
              <div className="text-xs uppercase tracking-wider text-muted-foreground mb-3">Field Settings</div>
              <div className="space-y-3 text-sm">
                <div>
                  <label className="text-xs font-medium block mb-1">Label</label>
                  <input className="w-full h-8 px-2 rounded-md border border-input text-sm" defaultValue="Full Name" />
                </div>
                <div>
                  <label className="text-xs font-medium block mb-1">Required</label>
                  <select className="w-full h-8 px-2 rounded-md border border-input text-sm"><option>Yes</option><option>No</option></select>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <span className="text-xs">Conditional logic</span>
                  <input type="checkbox" />
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="templates" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {TEMPLATES.map((t) => (
              <Card key={t.name} className="p-5">
                <h4 className="text-base font-semibold mb-1">{t.name}</h4>
                <p className="text-xs text-muted-foreground mb-3">{t.desc}</p>
                <div className="text-[11px] text-muted-foreground mb-4">{t.fields} fields</div>
                <div className="flex gap-2"><Button size="sm" className="flex-1" onClick={() => toast.success(`Using ${t.name}`)}>Use Template</Button><Button size="sm" variant="outline">Edit</Button></div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="responses" className="mt-4">
          <Card className="overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-[11px] uppercase text-muted-foreground"><tr><th className="text-left py-2 px-4">Client</th><th className="text-left py-2 px-4">Form Name</th><th className="text-left py-2 px-4">Sent Date</th><th className="text-left py-2 px-4">Status</th><th className="text-right py-2 px-4">Action</th></tr></thead>
              <tbody>
                {RESPONSES.map((r, i) => (
                  <tr key={i} className="border-t border-border">
                    <td className="py-2.5 px-4 font-medium">{r.client}</td>
                    <td className="py-2.5 px-4">{r.form}</td>
                    <td className="py-2.5 px-4 text-muted-foreground">{r.sent}</td>
                    <td className="py-2.5 px-4"><StatusBadge status={r.status} /></td>
                    <td className="py-2.5 px-4 text-right"><Button variant="ghost" size="sm">View Responses</Button></td>
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

export default Forms;
