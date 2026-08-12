import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { PageLoading } from "./ui";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <PageLoading />;
  if (!user) return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  return <>{children}</>;
}
