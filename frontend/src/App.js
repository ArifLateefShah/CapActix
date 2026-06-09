import React from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider } from "@/lib/store";
import { AuthProvider } from "@/lib/auth";
import { AppLayout } from "@/components/layout/AppLayout";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

import { Login, Signup } from "@/pages/Auth";
import Dashboard from "@/pages/Dashboard";
import Clients from "@/pages/Clients";
import Engagements from "@/pages/Engagements";
import Resources from "@/pages/Resources";
import TimeTracking from "@/pages/TimeTracking";
import TimeApproval from "@/pages/TimeApproval";
import Tasks from "@/pages/Tasks";
import Documents from "@/pages/Documents";
import PortalPreview from "@/pages/PortalPreview";
import Forms from "@/pages/Forms";
import Billing from "@/pages/Billing";
import Reports from "@/pages/Reports";
import Learning from "@/pages/Learning";
import AIAssistant from "@/pages/AIAssistant";
import TaxDeadlines from "@/pages/TaxDeadlines";
import ClientHealth from "@/pages/ClientHealth";
import Profitability from "@/pages/Profitability";
import AIAllocationExisting from "@/pages/AIAllocationExisting";
import AIAllocationNew from "@/pages/AIAllocationNew";
import AdminSettings from "@/pages/AdminSettings";
import AdminUsage from "@/pages/AdminUsage";

function App() {
  return (
    <div className="App">
      <AppProvider>
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              {/* Public */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              {/* Protected app shell */}
              <Route element={<ProtectedRoute />}>
                <Route element={<AppLayout />}>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/clients" element={<Clients />} />
                  <Route path="/engagements" element={<Engagements />} />
                  <Route path="/resources" element={<Resources />} />
                  <Route path="/time" element={<TimeTracking />} />
                  <Route path="/time-approval" element={<TimeApproval />} />
                  <Route path="/tasks" element={<Tasks />} />
                  <Route path="/documents" element={<Documents />} />
                  <Route path="/portal-preview" element={<PortalPreview />} />
                  <Route path="/forms" element={<Forms />} />
                  <Route path="/billing" element={<Billing />} />
                  <Route path="/reports" element={<Reports />} />
                  <Route path="/learning" element={<Learning />} />
                  <Route path="/ai-assistant" element={<AIAssistant />} />
                  <Route path="/tax-deadlines" element={<TaxDeadlines />} />
                  <Route path="/client-health" element={<ClientHealth />} />
                  <Route path="/profitability" element={<Profitability />} />
                  <Route path="/ai-allocation" element={<Navigate to="/ai-allocation/existing" replace />} />
                  <Route path="/ai-allocation/existing" element={<AIAllocationExisting />} />
                  <Route path="/ai-allocation/new" element={<AIAllocationNew />} />
                  <Route path="/admin" element={<AdminSettings />} />
                </Route>

                {/* Admin-only */}
                <Route element={<ProtectedRoute adminOnly />}>
                  <Route element={<AppLayout />}>
                    <Route path="/admin/usage" element={<AdminUsage />} />
                  </Route>
                </Route>
              </Route>

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </AppProvider>
    </div>
  );
}

export default App;
