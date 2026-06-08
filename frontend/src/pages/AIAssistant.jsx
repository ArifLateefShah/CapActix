import React, { useState, useRef } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bot, Send, Mic, Copy, Download, Clock, AlertTriangle, DollarSign, Briefcase } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { toast } from "sonner";

const SUGGESTIONS = [
  { cat: "Time & Hours", icon: Clock, qs: ["How many hours were billed to Hartwell & Associates this month?", "Who has the most pending approvals?"] },
  { cat: "Deadlines", icon: AlertTriangle, qs: ["Which engagements have deadlines in the next 14 days?", "Any overdue tasks across all clients?"] },
  { cat: "Billing", icon: DollarSign, qs: ["Show me unpaid invoices older than 30 days", "What is our total outstanding revenue?"] },
  { cat: "Project Status", icon: Briefcase, qs: ["What is the completion percentage for all active engagements?", "Which tasks are stuck in Review?"] },
];

const SEEDED_CHATS = [
  {
    id: "s1",
    title: "Hours by staff this week",
    date: "2 hours ago",
    messages: [
      { role: "user", text: "Show hours by staff this week" },
      {
        role: "ai",
        source: "Based on time entries: Feb 3–9, 2026",
        text: "Mike Reeves leads with 38.5 hours, followed by Lisa Park at 32 hours. 4 entries are still pending approval.",
        chart: {
          type: "bar",
          data: [
            { name: "Mike Reeves", hours: 38.5 },
            { name: "Lisa Park", hours: 32 },
            { name: "Sarah Chen", hours: 28.5 },
            { name: "David Kim", hours: 26 },
            { name: "Emma Wilson", hours: 22.5 },
          ],
        },
      },
    ],
  },
  {
    id: "s2",
    title: "Overdue invoices",
    date: "Yesterday",
    messages: [
      { role: "user", text: "Show me unpaid invoices older than 30 days" },
      {
        role: "ai",
        source: "Based on Billing data as of Feb 10, 2026",
        text: "You have 2 invoices overdue more than 30 days, totaling $10,150.",
        table: [
          { invoice: "INV-2026-0045", client: "Summit Financial", amount: "$4,750", overdue: "26 days" },
          { invoice: "INV-2025-0210", client: "Cornerstone Tax", amount: "$5,400", overdue: "52 days" },
        ],
      },
    ],
  },
  {
    id: "s3",
    title: "Upcoming deadlines next 14 days",
    date: "Yesterday",
    messages: [
      { role: "user", text: "Which engagements have deadlines in the next 14 days?" },
      {
        role: "ai",
        source: "Based on Tax Deadline Tracker, Feb 10–24, 2026",
        text: "3 deadlines fall in the next 14 days. 2 are At Risk and require attention.",
        list: [
          "1120S — Hartwell & Associates LLC · 4 days",
          "1065 — Summit Financial Services · 10 days (At Risk)",
          "1120 — Cornerstone Tax Solutions · 11 days (At Risk)",
        ],
      },
    ],
  },
];

const ChartBubble = ({ data }) => (
  <div className="mt-3 h-40 w-full">
    <ResponsiveContainer>
      <BarChart data={data} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={10} />
        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} />
        <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
        <Bar dataKey="hours" fill="#234C82" radius={[3, 3, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

const Message = ({ m }) => {
  if (m.role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[80%] bg-primary text-primary-foreground rounded-2xl rounded-tr-sm px-4 py-3 text-sm">{m.text}</div>
      </div>
    );
  }
  return (
    <div className="flex justify-start gap-2">
      <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0"><Bot className="h-4 w-4" /></div>
      <div className="max-w-[80%] bg-muted/60 border border-border rounded-2xl rounded-tl-sm px-4 py-3">
        <div className="text-sm">{m.text}</div>
        {m.chart && <ChartBubble data={m.chart.data} />}
        {m.table && (
          <div className="mt-3 border border-border rounded-md overflow-hidden text-xs">
            <table className="w-full">
              <thead className="bg-muted"><tr>{Object.keys(m.table[0]).map(k => <th key={k} className="text-left py-1.5 px-2 capitalize">{k}</th>)}</tr></thead>
              <tbody>
                {m.table.map((row, i) => (
                  <tr key={i} className="border-t border-border">
                    {Object.values(row).map((v, j) => <td key={j} className="py-1.5 px-2">{v}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {m.list && (
          <ul className="mt-3 space-y-1 text-sm">
            {m.list.map((x, i) => <li key={i} className="flex items-start gap-2"><span className="text-primary mt-1">•</span><span>{x}</span></li>)}
          </ul>
        )}
        <div className="mt-3 flex items-center gap-3 text-[11px] text-muted-foreground">
          <span>{m.source}</span>
          <a className="text-primary font-medium hover:underline cursor-pointer">View full report →</a>
          <button className="ml-auto hover:text-foreground" onClick={() => toast.success("Copied to clipboard")}><Copy className="h-3 w-3" /></button>
        </div>
      </div>
    </div>
  );
};

const AIAssistant = () => {
  const [input, setInput] = useState("");
  const [activeChat, setActiveChat] = useState(SEEDED_CHATS[0]);
  const [messages, setMessages] = useState(SEEDED_CHATS[0].messages);
  const scrollRef = useRef(null);

  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    });
  };

  const selectChat = (chat) => {
    setActiveChat(chat);
    setMessages(chat.messages);
    scrollToBottom();
  };

  const send = (text) => {
    const q = (text || input).trim();
    if (!q) return;
    const newMsgs = [...messages, { role: "user", text: q }];
    setMessages(newMsgs);
    setInput("");
    scrollToBottom();
    // Scripted canned response
    setTimeout(() => {
      setMessages([
        ...newMsgs,
        {
          role: "ai",
          source: "Based on indexed firm data, real-time",
          text: `Here's what I found for "${q}". Across your active engagements, the data shows a 12% increase week-over-week. Pending approvals total 14 entries. Let me know if you'd like a deeper breakdown.`,
        },
      ]);
      scrollToBottom();
    }, 600);
  };

  return (
    <div data-testid="ai-assistant-page" className="h-[calc(100vh-7rem)] flex flex-col">
      <PageHeader title="AI Assistant" description="Ask anything about your practice — powered by CapActix-PMS data" />

      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 flex-1 min-h-0">
        {/* Left rail */}
        <div className="lg:col-span-3 flex flex-col gap-4 min-h-0">
          <Card className="p-4">
            <div className="text-xs uppercase tracking-wider text-muted-foreground mb-3">Suggested questions</div>
            <div className="space-y-3">
              {SUGGESTIONS.map((s) => (
                <div key={s.cat}>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground mb-1.5"><s.icon className="h-3.5 w-3.5 text-primary" />{s.cat}</div>
                  <div className="space-y-1">
                    {s.qs.map((q) => (
                      <button key={q} data-testid={`suggest-${q.slice(0, 20)}`} onClick={() => send(q)} className="w-full text-left text-xs px-2 py-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-4 flex-1 min-h-0 overflow-y-auto scrollbar-thin">
            <div className="text-xs uppercase tracking-wider text-muted-foreground mb-3">History</div>
            <div className="space-y-1">
              {SEEDED_CHATS.map((c) => (
                <button key={c.id} onClick={() => selectChat(c)} className={`w-full text-left p-2 rounded-md text-xs ${activeChat.id === c.id ? "bg-primary/10 text-primary" : "hover:bg-muted text-muted-foreground"}`}>
                  <div className="font-medium truncate">{c.title}</div>
                  <div className="text-[10px] mt-0.5 opacity-70">{c.date}</div>
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* Chat */}
        <Card className="lg:col-span-7 flex flex-col min-h-0">
          <div className="px-5 py-3 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center"><Bot className="h-4 w-4" /></div>
              <div><div className="text-sm font-semibold">CapActix AI</div><div className="text-[10px] text-muted-foreground">Reporting · Q&A · Insights</div></div>
            </div>
            <Button variant="outline" size="sm" data-testid="export-chat" onClick={() => toast.success("Conversation exported as PDF")}><Download className="h-3.5 w-3.5 mr-1.5" />Export</Button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-thin p-5 space-y-4">
            {messages.map((m, i) => <Message key={i} m={m} />)}
          </div>

          <div className="border-t border-border p-3 flex items-center gap-2">
            <Input
              data-testid="chat-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Ask anything about your practice..."
              className="flex-1"
            />
            <Button variant="ghost" size="icon" className="h-9 w-9"><Mic className="h-4 w-4" /></Button>
            <Button data-testid="chat-send" onClick={() => send()} className="gap-1.5"><Send className="h-4 w-4" />Ask</Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AIAssistant;
