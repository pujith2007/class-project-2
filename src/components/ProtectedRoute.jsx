import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import PageLoader from "./PageLoader.jsx";

export default function ProtectedRoute({ children }) {
  const { authLoading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (authLoading) return <PageLoader />;

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace state={{ from: location }} />;
  }

  return children;
}
