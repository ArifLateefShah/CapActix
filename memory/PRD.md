# CapActix-PMS — Product Requirements Document

## Original Problem Statement
Build a complete, production-quality interactive prototype for a Practice Management
System (PMS) SaaS product called **CapActix-PMS** (renamed from the original
working name "ClarityPMS" at user request), purpose-built for US-based CPA firms.

The prototype must include 20 specific screens, a left sidebar navigation, a top
header with a role switcher (Admin / Approver / Staff), rich dummy data, Recharts
visualisations, and a "Linear meets QuickBooks" design system implemented with a
subtle, professional colour palette appropriate for a PMS application.

## User-Confirmed Scope (Feb 2026)
- All 20 screens built as a fully clickable static prototype
- Rich dummy data baked into the frontend (no backend, no persistence beyond localStorage for role/theme)
- AI Assistant uses scripted / canned responses
- No real authentication — only an in-app role switcher
- Brand: **CapActix-PMS** with tagline "Practice Management Suite"
- Subtle, standard professional colour palette (refined navy + slate-teal + sage + ochre + muted brick)

## Architecture
- **Frontend only**: React 19 SPA, react-router-dom v7, Tailwind CSS, Shadcn UI, Recharts, lucide-react, sonner toasts
- **State**: Context-based `AppProvider` in `/app/frontend/src/lib/store.js` (role, theme, sidebar collapse). LocalStorage keys: `capactix-pms-role`, `capactix-pms-theme`.
- **Data**: All dummy data lives in `/app/frontend/src/lib/seed.js` (STAFF, CLIENTS, ENGAGEMENTS, TASKS, TIME_ENTRIES, INVOICES, TAX_DEADLINES, CLIENT_HEALTH, PROFITABILITY, LEARNING_*, HOURS_BY_ENGAGEMENT, PROJECT_COMPLETION, RESOURCE_GRID, ENGAGEMENT_GANTT, NOTIFICATIONS).
- **No backend / no MongoDB / no /api calls.**

## Screens (20 total — all working, all wired to sidebar)
1. Dashboard (`/`) — KPI cards, hours-by-engagement bar chart, upcoming deadlines, recent time, invoice pie, project completion, resource grid, learning progress.
2. Clients (`/clients`) — searchable / filterable client table with status, industry, type, engagements count.
3. Engagements (`/engagements`) — list + detail tabs (Overview, Tasks, Time, Documents, Team, Activity).
4. Resource Allocation (`/resources`) — staff availability cards + 14-day Gantt.
5. Time Tracking (`/time`) — Manual entry + live timer (HH:MM:SS), weekly totals.
6. Time Approval (`/time-approval`) — bulk approve/reject with selection.
7. Task Manager (`/tasks`) — Kanban + table views, priority, comments, attachments.
8. Document Vault (`/documents`) — collapsible folder tree.
9. Client Portal Preview (`/portal-preview`) — multi-step onboarding stepper.
10. Forms & Templates (`/forms`) — drag-style form builder + templates + responses.
11. Billing & Invoices (`/billing`) — invoices table + generate + reminders.
12. Reports (`/reports`) — generated reports table.
13. Learning Center (`/learning`) — course cards + team progress.
14. AI Assistant (`/ai-assistant`) — scripted Q&A with charts/tables/lists in responses, suggested-questions rail, chat history.
15. Tax Deadline Tracker (`/tax-deadlines`) — calendar + table, color-coded forms.
16. Client Health (`/client-health`) — health score table + trend line chart.
17. Engagement Profitability (`/profitability`) — totals, table, write-down badges.
18. AI Staff Allocation — Existing (`/ai-allocation/existing`).
19. AI Staff Allocation — New (`/ai-allocation/new`).
20. Admin Settings (`/admin`) — staff list, billing rates, integrations.

## Design Tokens (subtle PMS palette)
- `--primary: 217 60% 34%` ≈ `#234C82` (refined navy)
- `--secondary: 200 25% 38%` (slate teal)
- `--success: 152 38% 32%` (sage green)
- `--warning: 36 55% 40%` (muted ochre)
- `--danger: 6 55% 42%` (muted brick)
- Chart palette: `#234C82 / #446F8A / #5C8A6F / #A57E3B / #A55B4A`
- Font: Inter (UI), JetBrains Mono (code/numbers)

## Implementation Status — COMPLETE ✅
- 2026-02-08 — Initial scaffolding by previous agent (all 20 pages, layout, store, seed)
- 2026-02-08 — Fixed 2 ESLint blocking errors (set-state-in-effect in AIAssistant, purity in Forms)
- 2026-02-08 — Renamed brand from ClarityPMS → CapActix-PMS across Sidebar, AIAssistant, PortalPreview, store, seed, public/index.html
- 2026-02-08 — Toned down colour palette to subtle professional PMS aesthetic (CSS variables + all hard-coded chart hex)
- 2026-02-08 — Testing agent: 100% pass on all 20 routes, role switcher, theme toggle, sidebar collapse, notifications, AI Assistant, Forms builder, dark mode, zero console errors, zero failed /api calls
- 2026-02-08 — Added official CapActix logo (`/public/capactix-logo.webp`) to sidebar brand area + favicon; expanded sidebar shows full wordmark, collapsed shows icon portion
- 2026-02-08 — Forms & Templates: introduced a dedicated **SSN** field type with numeric-only input, auto-format `XXX-XX-XXXX`, hard 9-digit cap, inline validation error on blur. Field Palette now exposes SSN. Canvas renders live interactive previews for every field type (text, number, ssn, date, dropdown, file, signature, section).

## Test Coverage
- Static frontend tested end-to-end via `testing_agent_v3_fork` — see `/app/test_reports/iteration_1.json`

## Future / Backlog (P2 — optional)
- Subtle micro-interactions / page-load stagger animations
- Wire AI Allocation drag-and-drop with HTML5 DnD
- Replace Form Builder placeholder with real drag-and-drop (`react-dnd`)
- Add a "Reset prototype" action in Admin to clear localStorage
- If user later wants persistence: add FastAPI + MongoDB and a simple JWT auth layer
