// Centralized seed data for the CapActix-PMS prototype (US CPA firm context).

export const STAFF = [
  { id: "u1", name: "John Carter", initials: "JC", role: "Managing Partner", seniority: "Partner", skills: ["Tax", "Audit", "Advisory"], utilization: 78, available: true },
  { id: "u2", name: "Lisa Park", initials: "LP", role: "Senior Manager", seniority: "Manager", skills: ["Audit", "GAAP", "IFRS"], utilization: 92, available: false },
  { id: "u3", name: "Mike Reeves", initials: "MR", role: "Senior Associate", seniority: "Senior", skills: ["Tax", "QuickBooks", "Payroll"], utilization: 65, available: true },
  { id: "u4", name: "Sarah Chen", initials: "SC", role: "Tax Associate", seniority: "Associate", skills: ["Tax", "1040", "1120"], utilization: 81, available: true },
  { id: "u5", name: "David Kim", initials: "DK", role: "Audit Senior", seniority: "Senior", skills: ["Audit", "GAAP", "Advisory"], utilization: 88, available: false },
  { id: "u6", name: "Emma Wilson", initials: "EW", role: "Staff Accountant", seniority: "Staff", skills: ["QuickBooks", "Payroll", "Bookkeeping"], utilization: 54, available: true },
];

export const CLIENTS = [
  { id: "c1", name: "Hartwell & Associates LLC", industry: "Financial Services", type: "Recurring", country: "USA", tz: "America/New_York", status: "Active", engagements: 4, contact: "Robert Hartwell", email: "r.hartwell@hartwell.com", phone: "(212) 555-0143" },
  { id: "c2", name: "Meridian Tax Group", industry: "Professional Services", type: "Recurring", country: "USA", tz: "America/Chicago", status: "Active", engagements: 3, contact: "Jennifer Meridian", email: "j@meridiantax.com", phone: "(312) 555-0198" },
  { id: "c3", name: "Blue Ridge Advisory", industry: "Real Estate", type: "Adhoc", country: "USA", tz: "America/New_York", status: "Active", engagements: 2, contact: "Michael Reid", email: "m.reid@blueridge.com", phone: "(704) 555-0177" },
  { id: "c4", name: "Coastal CPA Partners", industry: "Healthcare", type: "Seasonal", country: "USA", tz: "America/Los_Angeles", status: "Active", engagements: 3, contact: "Amanda Foster", email: "amanda@coastalcpa.com", phone: "(415) 555-0156" },
  { id: "c5", name: "Summit Financial Services", industry: "Financial Services", type: "Recurring", country: "USA", tz: "America/Denver", status: "Active", engagements: 5, contact: "James Summit", email: "james@summitfin.com", phone: "(303) 555-0122" },
  { id: "c6", name: "Apex Accounting Inc", industry: "Manufacturing", type: "Recurring", country: "USA", tz: "America/Chicago", status: "Active", engagements: 2, contact: "Diana Apex", email: "d.apex@apexaccounting.com", phone: "(773) 555-0134" },
  { id: "c7", name: "Cornerstone Tax Solutions", industry: "Retail", type: "Adhoc", country: "USA", tz: "America/New_York", status: "Inactive", engagements: 1, contact: "Patrick Stone", email: "p.stone@cornerstonetax.com", phone: "(617) 555-0189" },
  { id: "c8", name: "Lakewood Audit Group", industry: "Non-Profit", type: "Seasonal", country: "USA", tz: "America/Los_Angeles", status: "Active", engagements: 2, contact: "Maria Lakewood", email: "maria@lakewoodaudit.com", phone: "(206) 555-0167" },
];

export const ENGAGEMENTS = [
  { id: "A-2025-001", client: "Hartwell & Associates LLC", clientId: "c1", service: "Federal Tax 1120S", type: "Fixed Price", start: "2025-01-15", end: "2025-04-15", approver: "Lisa Park", manager: "John Carter", progress: 78, status: "In Progress", billRate: 285, cycle: "Monthly", tracking: "Progressive" },
  { id: "A-2025-002", client: "Meridian Tax Group", clientId: "c2", service: "Audit & Assurance", type: "Dedicated", start: "2025-02-01", end: "2025-06-30", approver: "John Carter", manager: "Lisa Park", progress: 45, status: "In Progress", billRate: 320, cycle: "Bi-Weekly", tracking: "Progressive" },
  { id: "A-2025-003", client: "Blue Ridge Advisory", clientId: "c3", service: "Advisory", type: "Fixed Price", start: "2025-02-10", end: "2025-05-10", approver: "Lisa Park", manager: "John Carter", progress: 62, status: "In Progress", billRate: 350, cycle: "Monthly", tracking: "Simple" },
  { id: "A-2025-004", client: "Coastal CPA Partners", clientId: "c4", service: "Bookkeeping", type: "Dedicated", start: "2025-01-01", end: "2025-12-31", approver: "John Carter", manager: "Mike Reeves", progress: 22, status: "Not Started", billRate: 165, cycle: "Weekly", tracking: "Simple" },
  { id: "A-2025-005", client: "Summit Financial Services", clientId: "c5", service: "Federal Tax 1065", type: "Fixed Price", start: "2025-02-15", end: "2025-03-15", approver: "Lisa Park", manager: "John Carter", progress: 95, status: "Review", billRate: 285, cycle: "Monthly", tracking: "Progressive" },
  { id: "A-2025-006", client: "Apex Accounting Inc", clientId: "c6", service: "Federal Tax 1120", type: "Dedicated", start: "2025-02-20", end: "2025-04-15", approver: "John Carter", manager: "Lisa Park", progress: 88, status: "In Progress", billRate: 295, cycle: "Bi-Weekly", tracking: "Progressive" },
];

export const TASKS = [
  { id: "T-001", title: "Gather W-2 and 1099 forms", engagement: "A-2025-001", assignee: "Mike Reeves", due: "2026-02-18", status: "In Progress", priority: "High", comments: 3, attachments: 2, description: "Collect all wage forms from client portal." },
  { id: "T-002", title: "Prepare draft 1120S return", engagement: "A-2025-001", assignee: "Sarah Chen", due: "2026-02-25", status: "Not Started", priority: "High", comments: 0, attachments: 0, description: "Use prior year as baseline." },
  { id: "T-003", title: "Reconcile bank accounts (Q4)", engagement: "A-2025-004", assignee: "Emma Wilson", due: "2026-02-12", status: "In Progress", priority: "Medium", comments: 5, attachments: 4, description: "Match all 12 statements to ledger." },
  { id: "T-004", title: "Partner review – Audit fieldwork", engagement: "A-2025-002", assignee: "John Carter", due: "2026-02-20", status: "Review", priority: "Critical", comments: 8, attachments: 6, description: "Review materials before partner sign-off." },
  { id: "T-005", title: "Client approval – Tax draft", engagement: "A-2025-005", assignee: "Lisa Park", due: "2026-02-10", status: "Review", priority: "High", comments: 2, attachments: 3, description: "Send draft to client for sign-off." },
  { id: "T-006", title: "File 1065 return electronically", engagement: "A-2025-005", assignee: "Sarah Chen", due: "2026-03-15", status: "Not Started", priority: "Critical", comments: 0, attachments: 1, description: "File via IRS e-file portal." },
  { id: "T-007", title: "Issue engagement letter", engagement: "A-2025-003", assignee: "John Carter", due: "2026-02-08", status: "Done", priority: "Low", comments: 1, attachments: 1, description: "Sent and signed." },
  { id: "T-008", title: "Quarterly payroll reconciliation", engagement: "A-2025-006", assignee: "Emma Wilson", due: "2026-02-15", status: "In Progress", priority: "Medium", comments: 2, attachments: 0, description: "Q4 payroll vs 941 returns." },
  { id: "T-009", title: "GAAP disclosure review", engagement: "A-2025-002", assignee: "David Kim", due: "2026-02-22", status: "Not Started", priority: "High", comments: 0, attachments: 0, description: "Footnote disclosures per ASC 842." },
  { id: "T-010", title: "Final review & file return", engagement: "A-2025-006", assignee: "Lisa Park", due: "2026-02-28", status: "Not Started", priority: "Critical", comments: 0, attachments: 0, description: "Awaiting partner final review." },
];

export const TIME_ENTRIES = [
  { id: "te1", staff: "Mike Reeves", engagement: "A-2025-001", task: "Gather W-2 forms", date: "2026-02-09", desc: "Collected W-2 forms from client and indexed", hours: 2.5, count: 1, status: "Approved" },
  { id: "te2", staff: "Sarah Chen", engagement: "A-2025-001", task: "Prepare draft return", date: "2026-02-09", desc: "Drafted Schedule K-1 for partners", hours: 4.0, count: 1, status: "Pending" },
  { id: "te3", staff: "Lisa Park", engagement: "A-2025-002", task: "Audit fieldwork", date: "2026-02-08", desc: "Tested revenue cutoff for Q4", hours: 6.5, count: 1, status: "Approved" },
  { id: "te4", staff: "David Kim", engagement: "A-2025-002", task: "GAAP disclosures", date: "2026-02-08", desc: "Drafted lease footnotes per ASC 842", hours: 3.5, count: 1, status: "Pending" },
  { id: "te5", staff: "Emma Wilson", engagement: "A-2025-004", task: "Bank reconciliation", date: "2026-02-07", desc: "Reconciled October bank statements", hours: 5.0, count: 1, status: "Approved" },
  { id: "te6", staff: "John Carter", engagement: "A-2025-003", task: "Advisory call", date: "2026-02-07", desc: "Strategy call with Blue Ridge CFO", hours: 1.5, count: 1, status: "Approved" },
  { id: "te7", staff: "Mike Reeves", engagement: "A-2025-005", task: "Review client docs", date: "2026-02-06", desc: "Reviewed partner buyout agreement", hours: 2.0, count: 1, status: "Rejected" },
  { id: "te8", staff: "Sarah Chen", engagement: "A-2025-006", task: "Draft 1120 return", date: "2026-02-06", desc: "Federal corporate return draft v1", hours: 5.5, count: 1, status: "Pending" },
  { id: "te9", staff: "Emma Wilson", engagement: "A-2025-004", task: "Payroll posting", date: "2026-02-05", desc: "Posted biweekly payroll for client", hours: 3.0, count: 1, status: "Approved" },
  { id: "te10", staff: "David Kim", engagement: "A-2025-002", task: "Confirmation letters", date: "2026-02-05", desc: "Sent AR confirmation letters", hours: 4.5, count: 12, status: "Pending" },
];

export const INVOICES = [
  { id: "INV-2026-0042", client: "Hartwell & Associates LLC", engagement: "A-2025-001", period: "Jan 2026", amount: 8550, status: "Paid", date: "2026-02-01" },
  { id: "INV-2026-0043", client: "Meridian Tax Group", engagement: "A-2025-002", period: "Jan 2026", amount: 14200, status: "Sent", date: "2026-02-02" },
  { id: "INV-2026-0044", client: "Blue Ridge Advisory", engagement: "A-2025-003", period: "Jan 2026", amount: 6300, status: "Paid", date: "2026-02-03" },
  { id: "INV-2026-0045", client: "Summit Financial Services", engagement: "A-2025-005", period: "Jan 2026", amount: 4750, status: "Overdue", date: "2026-01-15" },
  { id: "INV-2026-0046", client: "Apex Accounting Inc", engagement: "A-2025-006", period: "Jan 2026", amount: 9100, status: "Sent", date: "2026-02-04" },
  { id: "INV-2026-0047", client: "Coastal CPA Partners", engagement: "A-2025-004", period: "Jan 2026", amount: 3850, status: "Draft", date: "2026-02-05" },
  { id: "INV-2025-0210", client: "Cornerstone Tax Solutions", engagement: "A-2024-091", period: "Dec 2025", amount: 5400, status: "Overdue", date: "2025-12-20" },
];

export const TAX_DEADLINES = [
  { id: "td1", client: "Hartwell & Associates LLC", engagement: "A-2025-001", form: "1120S", original: "2026-03-15", extended: null, status: "On Track", days: 32, assigned: "Mike Reeves" },
  { id: "td2", client: "Summit Financial Services", engagement: "A-2025-005", form: "1065", original: "2026-03-15", extended: null, status: "At Risk", days: 32, assigned: "Sarah Chen" },
  { id: "td3", client: "Apex Accounting Inc", engagement: "A-2025-006", form: "1120", original: "2026-04-15", extended: null, status: "On Track", days: 63, assigned: "Lisa Park" },
  { id: "td4", client: "Meridian Tax Group", engagement: "A-2025-002", form: "1120", original: "2026-04-15", extended: "2026-09-15", status: "On Track", days: 63, assigned: "David Kim" },
  { id: "td5", client: "Blue Ridge Advisory", engagement: "A-2025-003", form: "1040", original: "2026-04-15", extended: null, status: "On Track", days: 63, assigned: "John Carter" },
  { id: "td6", client: "Lakewood Audit Group", engagement: "A-2025-007", form: "990", original: "2026-05-15", extended: null, status: "On Track", days: 93, assigned: "David Kim" },
  { id: "td7", client: "Coastal CPA Partners", engagement: "A-2025-004", form: "1040", original: "2026-04-15", extended: "2026-10-15", status: "On Track", days: 63, assigned: "Mike Reeves" },
  { id: "td8", client: "Cornerstone Tax Solutions", engagement: "A-2024-091", form: "1120", original: "2026-01-31", extended: null, status: "Overdue", days: -11, assigned: "Sarah Chen" },
];

export const CLIENT_HEALTH = [
  { client: "Hartwell & Associates LLC", industry: "Financial Services", score: 91, delta: 2, responseDays: 1.2, paymentDays: 18, taskRate: 98, logins: 24, openIssues: 0, action: "Maintain weekly check-ins" },
  { client: "Summit Financial Services", industry: "Financial Services", score: 82, delta: 5, responseDays: 2.1, paymentDays: 22, taskRate: 92, logins: 18, openIssues: 1, action: "Send Q1 planning agenda" },
  { client: "Meridian Tax Group", industry: "Professional Services", score: 78, delta: -3, responseDays: 3.4, paymentDays: 28, taskRate: 88, logins: 14, openIssues: 2, action: "Follow up on missing 1099s" },
  { client: "Lakewood Audit Group", industry: "Non-Profit", score: 71, delta: 1, responseDays: 4.2, paymentDays: 31, taskRate: 81, logins: 11, openIssues: 2, action: "Schedule audit kickoff call" },
  { client: "Blue Ridge Advisory", industry: "Real Estate", score: 65, delta: -4, responseDays: 5.8, paymentDays: 35, taskRate: 74, logins: 8, openIssues: 3, action: "Re-engage with advisory call" },
  { client: "Coastal CPA Partners", industry: "Healthcare", score: 58, delta: -2, responseDays: 6.5, paymentDays: 42, taskRate: 68, logins: 6, openIssues: 4, action: "Send onboarding refresher" },
  { client: "Apex Accounting Inc", industry: "Manufacturing", score: 44, delta: -7, responseDays: 9.2, paymentDays: 51, taskRate: 55, logins: 3, openIssues: 6, action: "Partner-level intervention needed" },
  { client: "Cornerstone Tax Solutions", industry: "Retail", score: 34, delta: -9, responseDays: 12.5, paymentDays: 67, taskRate: 41, logins: 1, openIssues: 8, action: "Client has not logged into portal in 23 days — send a check-in message" },
];

export const PROFITABILITY = [
  { id: "A-2025-001", client: "Hartwell & Associates LLC", service: "Tax", billed: 28500, cost: 14200, budget: 26000, margin: 14300, realization: 110, status: "Profitable" },
  { id: "A-2025-002", client: "Meridian Tax Group", service: "Audit", billed: 64000, cost: 41500, budget: 60000, margin: 22500, realization: 107, status: "Profitable" },
  { id: "A-2025-003", client: "Blue Ridge Advisory", service: "Advisory", billed: 18900, cost: 16800, budget: 20000, margin: 2100, realization: 95, status: "Break-Even" },
  { id: "A-2025-004", client: "Coastal CPA Partners", service: "Bookkeeping", billed: 23100, cost: 21900, budget: 22000, margin: 1200, realization: 105, status: "Break-Even" },
  { id: "A-2025-005", client: "Summit Financial Services", service: "Tax", billed: 14250, cost: 6400, budget: 13000, margin: 7850, realization: 112, status: "Profitable" },
  { id: "A-2025-006", client: "Apex Accounting Inc", service: "Tax", billed: 27300, cost: 30800, budget: 32000, margin: -3500, realization: 67, status: "Loss" },
];

export const LEARNING_COURSES = [
  { id: "lc1", title: "Federal Tax Update 2026", category: "Tax", difficulty: "Intermediate", duration: "6h", progress: 65, thumb: "https://images.pexels.com/photos/8062355/pexels-photo-8062355.jpeg?auto=compress&cs=tinysrgb&w=600", status: "In Progress" },
  { id: "lc2", title: "GAAP for Lease Accounting", category: "Audit", difficulty: "Advanced", duration: "8h", progress: 100, thumb: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&auto=format&fit=crop", status: "Completed" },
  { id: "lc3", title: "QuickBooks Online Mastery", category: "Bookkeeping", difficulty: "Beginner", duration: "4h", progress: 30, thumb: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=600&auto=format&fit=crop", status: "In Progress" },
  { id: "lc4", title: "IRS Audit Defense Tactics", category: "Tax", difficulty: "Advanced", duration: "5h", progress: 0, thumb: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600&auto=format&fit=crop", status: "Not Started" },
  { id: "lc5", title: "Client Advisory Services 101", category: "Advisory", difficulty: "Beginner", duration: "3h", progress: 100, thumb: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&auto=format&fit=crop", status: "Completed" },
  { id: "lc6", title: "Ethics for CPAs (Required)", category: "Ethics", difficulty: "Required", duration: "4h", progress: 50, thumb: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=600&auto=format&fit=crop", status: "In Progress" },
];

export const LEARNING_PROGRESS = [
  { name: "John Carter", initials: "JC", progress: 92 },
  { name: "Lisa Park", initials: "LP", progress: 78 },
  { name: "Mike Reeves", initials: "MR", progress: 65 },
  { name: "Sarah Chen", initials: "SC", progress: 54 },
  { name: "Emma Wilson", initials: "EW", progress: 41 },
];

export const HOURS_BY_ENGAGEMENT = [
  { day: "Mon", "A-2025-001": 6, "A-2025-002": 8, "A-2025-003": 4, "A-2025-005": 5, "A-2025-006": 6 },
  { day: "Tue", "A-2025-001": 7, "A-2025-002": 6, "A-2025-003": 5, "A-2025-005": 4, "A-2025-006": 7 },
  { day: "Wed", "A-2025-001": 5, "A-2025-002": 7, "A-2025-003": 6, "A-2025-005": 6, "A-2025-006": 5 },
  { day: "Thu", "A-2025-001": 8, "A-2025-002": 5, "A-2025-003": 3, "A-2025-005": 7, "A-2025-006": 8 },
  { day: "Fri", "A-2025-001": 6, "A-2025-002": 9, "A-2025-003": 5, "A-2025-005": 5, "A-2025-006": 6 },
  { day: "Sat", "A-2025-001": 2, "A-2025-002": 0, "A-2025-003": 1, "A-2025-005": 2, "A-2025-006": 0 },
  { day: "Sun", "A-2025-001": 0, "A-2025-002": 0, "A-2025-003": 0, "A-2025-005": 1, "A-2025-006": 0 },
];

export const PROJECT_COMPLETION = [
  { name: "A-2025-001", planned: 80, actual: 78 },
  { name: "A-2025-002", planned: 50, actual: 45 },
  { name: "A-2025-003", planned: 60, actual: 62 },
  { name: "A-2025-004", planned: 30, actual: 22 },
  { name: "A-2025-005", planned: 90, actual: 95 },
];

// Resource availability cells (14 days) per staff
export const RESOURCE_GRID = STAFF.slice(0, 6).map((s, i) => ({
  staff: s.name,
  initials: s.initials,
  cells: Array.from({ length: 14 }, (_, d) => {
    const seed = (i * 7 + d * 3) % 10;
    if (seed < 3) return "available";
    if (seed < 7) return "partial";
    return "full";
  }),
}));

export const ENGAGEMENT_GANTT = [
  { staff: "John Carter", initials: "JC", bars: [{ start: 0, len: 5, label: "A-2025-001", color: "#234C82" }, { start: 6, len: 8, label: "A-2025-003", color: "#446F8A" }] },
  { staff: "Lisa Park", initials: "LP", bars: [{ start: 1, len: 10, label: "A-2025-002", color: "#446F8A" }, { start: 12, len: 8, label: "A-2025-006", color: "#A57E3B" }] },
  { staff: "Mike Reeves", initials: "MR", bars: [{ start: 0, len: 6, label: "A-2025-001", color: "#234C82" }, { start: 8, len: 6, label: "A-2025-004", color: "#5C8A6F" }] },
  { staff: "Sarah Chen", initials: "SC", bars: [{ start: 2, len: 5, label: "A-2025-001", color: "#234C82" }, { start: 9, len: 9, label: "A-2025-005", color: "#A57E3B" }] },
  { staff: "David Kim", initials: "DK", bars: [{ start: 0, len: 14, label: "A-2025-002", color: "#446F8A" }] },
  { staff: "Emma Wilson", initials: "EW", bars: [{ start: 3, len: 17, label: "A-2025-004", color: "#5C8A6F" }] },
];

export const NOTIFICATIONS = [
  { id: "n1", title: "Time entry approved", desc: "Lisa Park approved 6.5h on A-2025-002", time: "2m ago", unread: true },
  { id: "n2", title: "Invoice overdue", desc: "INV-2026-0045 is 9 days overdue", time: "1h ago", unread: true },
  { id: "n3", title: "Task due soon", desc: "Partner review – A-2025-002 due in 2 days", time: "3h ago", unread: true },
  { id: "n4", title: "New comment", desc: "Mike Reeves commented on T-004", time: "Yesterday", unread: false },
];
