import React, { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ChevronRight, ChevronDown, Folder, FileText, Upload, Search, Download, Eye, Share2, Trash2, History, Plus } from "lucide-react";
import { toast } from "sonner";

const FLAT_TREE = [
  { id: "c1", name: "Hartwell & Associates LLC", depth: 0 },
  { id: "c1-y25", name: "2025 Tax Season", depth: 1, parent: "c1" },
  { id: "c1-y25-on", name: "Onboarding", depth: 2, parent: "c1-y25" },
  { id: "c1-y25-wp", name: "Work Papers", depth: 2, parent: "c1-y25" },
  { id: "c1-y25-dl", name: "Deliverables", depth: 2, parent: "c1-y25" },
  { id: "c1-y25-sd", name: "Signed Docs", depth: 2, parent: "c1-y25" },
  { id: "c1-y24", name: "2024 Tax Season", depth: 1, parent: "c1" },
  { id: "c1-y24-on", name: "Onboarding", depth: 2, parent: "c1-y24" },
  { id: "c1-y24-dl", name: "Deliverables", depth: 2, parent: "c1-y24" },
  { id: "c2", name: "Meridian Tax Group", depth: 0 },
  { id: "c2-a25", name: "2025 Audit", depth: 1, parent: "c2" },
  { id: "c2-a25-wp", name: "Work Papers", depth: 2, parent: "c2-a25" },
  { id: "c2-a25-dl", name: "Deliverables", depth: 2, parent: "c2-a25" },
  { id: "c3", name: "Blue Ridge Advisory", depth: 0 },
  { id: "c3-fy25", name: "Advisory FY25", depth: 1, parent: "c3" },
  { id: "c3-fy25-on", name: "Onboarding", depth: 2, parent: "c3-fy25" },
];

const FILES = [
  { name: "W-2 Robert Hartwell 2025.pdf", size: "412 KB", type: "PDF", uploader: "Mike Reeves", date: "2026-02-09", version: "v2" },
  { name: "1120S Draft Return.xlsx", size: "2.3 MB", type: "XLSX", uploader: "Sarah Chen", date: "2026-02-08", version: "v3" },
  { name: "K-1 Schedule.pdf", size: "189 KB", type: "PDF", uploader: "Sarah Chen", date: "2026-02-07", version: "v1" },
  { name: "Bank Statements Q4.zip", size: "8.7 MB", type: "ZIP", uploader: "Emma Wilson", date: "2026-02-05", version: "v1" },
  { name: "Engagement Letter Signed.pdf", size: "267 KB", type: "PDF", uploader: "John Carter", date: "2026-02-01", version: "v1" },
  { name: "Prior Year Return 2024.pdf", size: "1.4 MB", type: "PDF", uploader: "Sarah Chen", date: "2026-02-01", version: "v1" },
];

const Documents = () => {
  const [history, setHistory] = useState(null);
  const [collapsed, setCollapsed] = useState({});

  const toggle = (id) => setCollapsed((s) => ({ ...s, [id]: !s[id] }));

  const isVisible = (node) => {
    if (!node.parent) return true;
    let cur = node;
    while (cur.parent) {
      if (collapsed[cur.parent]) return false;
      cur = FLAT_TREE.find((n) => n.id === cur.parent);
      if (!cur) return true;
    }
    return true;
  };

  const hasChildren = (id) => FLAT_TREE.some((n) => n.parent === id);

  return (
    <div data-testid="documents-page">
      <PageHeader
        title="Document Vault"
        description="Secure file storage organized by client and engagement"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" data-testid="new-folder-btn"><Plus className="h-4 w-4 mr-1.5" />New Folder</Button>
            <Button data-testid="upload-btn"><Upload className="h-4 w-4 mr-1.5" />Upload</Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <Card className="lg:col-span-3 p-3 h-fit max-h-[calc(100vh-12rem)] overflow-y-auto scrollbar-thin">
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-2 px-1">Folders</div>
          {FLAT_TREE.filter(isVisible).map((node) => {
            const expandable = hasChildren(node.id);
            const isOpen = !collapsed[node.id];
            return (
              <div
                key={node.id}
                className="flex items-center gap-1.5 py-1 px-1.5 rounded hover:bg-muted cursor-pointer text-sm"
                style={{ paddingLeft: node.depth * 12 + 6 }}
                onClick={() => expandable && toggle(node.id)}
              >
                {expandable ? (isOpen ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />) : <span className="w-3.5 inline-block" />}
                <Folder className="h-3.5 w-3.5 text-amber-600" />
                <span className="truncate">{node.name}</span>
              </div>
            );
          })}
        </Card>

        <div className="lg:col-span-9 space-y-4">
          <Card className="p-4 flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search files or OCR content..." className="pl-9" />
            </div>
            <Button variant="outline">All types</Button>
          </Card>

          <Card className="border-dashed border-2 p-8 text-center hover:bg-muted/30 transition-colors cursor-pointer" data-testid="upload-dropzone">
            <Upload className="h-8 w-8 text-muted-foreground/60 mx-auto mb-2" />
            <div className="text-sm font-medium">Drop files here or click to upload</div>
            <div className="text-xs text-muted-foreground mt-1">Max 50MB · PDF, XLSX, DOCX, ZIP</div>
          </Card>

          <Card className="overflow-hidden">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 p-4">
              {FILES.map((f, i) => (
                <div key={i} data-testid={`file-${i}`} className="border border-border rounded-lg p-3 hover:shadow-md transition-shadow group">
                  <div className="flex items-start gap-2 mb-2">
                    <div className="h-10 w-10 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 flex items-center justify-center">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate" title={f.name}>{f.name}</div>
                      <div className="text-[11px] text-muted-foreground">{f.size} · {f.type} · {f.version}</div>
                    </div>
                  </div>
                  <div className="text-[11px] text-muted-foreground mb-2">{f.uploader} · {f.date}</div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => toast.success("Downloading...")}><Download className="h-3.5 w-3.5" /></Button>
                    <Button size="icon" variant="ghost" className="h-7 w-7"><Eye className="h-3.5 w-3.5" /></Button>
                    <Button size="icon" variant="ghost" className="h-7 w-7"><Share2 className="h-3.5 w-3.5" /></Button>
                    <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setHistory(f)}><History className="h-3.5 w-3.5" /></Button>
                    <Button size="icon" variant="ghost" className="h-7 w-7 text-red-600"><Trash2 className="h-3.5 w-3.5" /></Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      <Sheet open={!!history} onOpenChange={(o) => !o && setHistory(null)}>
        <SheetContent className="w-96">
          <SheetHeader><SheetTitle>Version History</SheetTitle></SheetHeader>
          {history && (
            <div className="mt-4 space-y-3">
              <div className="text-sm text-muted-foreground">{history.name}</div>
              {["v3", "v2", "v1"].map((v, i) => (
                <div key={v} className="p-3 border border-border rounded-md">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold">{v} {i === 0 && <span className="text-[10px] ml-1 px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">Current</span>}</div>
                    <div className="text-[11px] text-muted-foreground">2026-02-{9 - i}</div>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">Updated by Sarah Chen</div>
                  <div className="text-xs mt-2 p-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-900 dark:text-emerald-200 rounded">+12 lines · Schedule K-1 updated</div>
                </div>
              ))}
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Documents;
