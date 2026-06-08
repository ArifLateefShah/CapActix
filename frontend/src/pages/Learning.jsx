import React from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Award, Clock, BookOpen, TrendingUp, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { LEARNING_COURSES, STAFF } from "@/lib/seed";

const KPI = ({ label, value, icon: Icon }) => (
  <Card className="p-5">
    <div className="flex items-center justify-between">
      <div><div className="text-xs text-muted-foreground">{label}</div><div className="text-2xl font-bold mt-1 tabular-nums">{value}</div></div>
      <div className="h-9 w-9 rounded-md bg-primary/10 text-primary flex items-center justify-center"><Icon className="h-4 w-4" /></div>
    </div>
  </Card>
);

const Learning = () => {
  return (
    <div data-testid="learning-page">
      <PageHeader title="Learning Center" description="Stay sharp. CPE credits and firm-required training." />

      <Tabs defaultValue="my-learning">
        <TabsList>
          <TabsTrigger value="my-learning">My Learning</TabsTrigger>
          <TabsTrigger value="catalog">Course Catalog</TabsTrigger>
          <TabsTrigger value="progress">Employee Progress</TabsTrigger>
        </TabsList>

        <TabsContent value="my-learning" className="mt-4 space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <KPI label="Completed" value="12" icon={Award} />
            <KPI label="In Progress" value="3" icon={BookOpen} />
            <KPI label="Certificates" value="8" icon={Award} />
            <KPI label="Hours" value="48.5" icon={Clock} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {LEARNING_COURSES.map((c) => (
              <Card key={c.id} data-testid={`course-${c.id}`} className="overflow-hidden">
                <div className="aspect-video bg-muted relative overflow-hidden">
                  <img src={c.thumb} alt={c.title} className="w-full h-full object-cover" />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-background/90 text-[10px] font-semibold">{c.category}</div>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-semibold truncate">{c.title}</h4>
                    <StatusBadge status={c.difficulty === "Required" ? "Critical" : c.difficulty === "Advanced" ? "High" : c.difficulty === "Intermediate" ? "Medium" : "Low"} />
                  </div>
                  <div className="text-[11px] text-muted-foreground mb-3">{c.duration} · {c.status}</div>
                  <Progress value={c.progress} className="h-1.5 mb-3" />
                  <Button size="sm" variant={c.progress === 100 ? "outline" : "default"} className="w-full">
                    {c.progress === 100 ? "View Certificate" : c.progress === 0 ? "Start Course" : "Continue"}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="catalog" className="mt-4">
          <Card className="p-4 mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search courses..." className="pl-9" />
            </div>
          </Card>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {LEARNING_COURSES.map((c) => (
              <Card key={c.id} className="overflow-hidden">
                <div className="aspect-video bg-muted"><img src={c.thumb} alt={c.title} className="w-full h-full object-cover" /></div>
                <div className="p-4">
                  <h4 className="text-sm font-semibold mb-1">{c.title}</h4>
                  <div className="text-[11px] text-muted-foreground mb-3">{c.duration} · {c.difficulty}</div>
                  <Button size="sm" className="w-full">Enroll</Button>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="progress" className="mt-4">
          <Card className="overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-[11px] uppercase text-muted-foreground"><tr><th className="text-left py-2 px-4">Staff</th><th className="text-right py-2 px-4">Enrolled</th><th className="text-right py-2 px-4">Completed</th><th className="text-right py-2 px-4">Hours</th><th className="text-right py-2 px-4">Certificates</th></tr></thead>
              <tbody>
                {STAFF.map((s, i) => (
                  <tr key={s.id} className="border-t border-border">
                    <td className="py-2.5 px-4"><div className="flex items-center gap-2"><div className="h-7 w-7 rounded-full bg-primary/10 text-primary text-[10px] font-semibold flex items-center justify-center">{s.initials}</div>{s.name}</div></td>
                    <td className="py-2.5 px-4 text-right tabular-nums">{8 - i}</td>
                    <td className="py-2.5 px-4 text-right tabular-nums">{6 - i}</td>
                    <td className="py-2.5 px-4 text-right tabular-nums">{48 - i * 5}.5</td>
                    <td className="py-2.5 px-4 text-right tabular-nums">{4 - Math.floor(i / 2)}</td>
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

export default Learning;
