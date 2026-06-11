import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";

// Contexts
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./components/DashboardLayout";

// Public Pages
import Home from "./pages/Home";
import About from "./pages/About";
import QuickStart from "./pages/QuickStart";
import Resources from "./pages/Resources";
import Updates from "./pages/Updates";
import Contact from "./pages/Contact";
import Login from "./pages/Login";

// SME Pages
import DashboardOverview from "./pages/DashboardOverview";
import ComplianceChecklist from "./pages/ComplianceChecklist";
import RiskAssessment from "./pages/RiskAssessment";
import DocumentCentre from "./pages/DocumentCentre";
import CompanySettings from "./pages/CompanySettings";

// Admin Pages
import AdminDashboard from "./pages/AdminDashboard";
import AdminUserList from "./pages/AdminUserList";
import AdminCompanyList from "./pages/AdminCompanyList";
import AdminResources from "./pages/AdminResources";
import AdminUpdates from "./pages/AdminUpdates";
import AdminFeedback from "./pages/AdminFeedback";

const queryClient = new QueryClient();

// Public Layout Wrapper
function PublicLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
              <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
              <Route path="/quick-start" element={<PublicLayout><QuickStart /></PublicLayout>} />
              <Route path="/resources" element={<PublicLayout><Resources /></PublicLayout>} />
              <Route path="/updates" element={<PublicLayout><Updates /></PublicLayout>} />
              <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
              <Route path="/login" element={<PublicLayout><Login /></PublicLayout>} />

              {/* SME Dashboard Protected Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute allowedRoles={["owner", "officer"]}>
                    <DashboardLayout>
                      <DashboardOverview />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/checklist"
                element={
                  <ProtectedRoute allowedRoles={["owner", "officer"]}>
                    <DashboardLayout>
                      <ComplianceChecklist />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/risks"
                element={
                  <ProtectedRoute allowedRoles={["owner", "officer"]}>
                    <DashboardLayout>
                      <RiskAssessment />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/documents"
                element={
                  <ProtectedRoute allowedRoles={["owner", "officer"]}>
                    <DashboardLayout>
                      <DocumentCentre />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/settings"
                element={
                  <ProtectedRoute allowedRoles={["owner"]}>
                    <DashboardLayout>
                      <CompanySettings />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />

              {/* System Admin Dashboard Protected Routes */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <DashboardLayout>
                      <AdminDashboard />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <DashboardLayout>
                      <AdminUserList />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/companies"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <DashboardLayout>
                      <AdminCompanyList />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/resources"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <DashboardLayout>
                      <AdminResources />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/updates"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <DashboardLayout>
                      <AdminUpdates />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/feedback"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <DashboardLayout>
                      <AdminFeedback />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Router>

          {/* Toast Notification Container */}
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 3500,
              style: {
                background: "#0f172a",
                color: "#f8fafc",
                border: "1px solid rgba(51, 65, 85, 0.5)",
                fontSize: "13px",
                borderRadius: "14px"
              }
            }}
          />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
