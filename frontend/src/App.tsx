import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AppLayout from "./layouts/AppLayout";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import StudentsListPage from "./pages/StudentsListPage";
import StudentDetailPage from "./pages/StudentDetailPage";
import SeatsPage from "./pages/SeatsPage";
import PaymentsPage from "./pages/PaymentsPage";
import ReportsPage from "./pages/ReportsPage";
import SettingsPage from "./pages/SettingsPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 15_000,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ToastProvider>
          <AuthProvider>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <AppLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<DashboardPage />} />
                <Route path="students" element={<StudentsListPage />} />
                <Route path="students/:id" element={<StudentDetailPage />} />
                <Route path="seats" element={<SeatsPage />} />
                <Route path="payments" element={<PaymentsPage />} />
                <Route path="reports" element={<ReportsPage />} />
                <Route path="settings" element={<SettingsPage />} />
              </Route>
            </Routes>
          </AuthProvider>
        </ToastProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
