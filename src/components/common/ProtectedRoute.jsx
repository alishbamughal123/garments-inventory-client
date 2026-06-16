import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";

const ProtectedRoute = ({
  children,
}) => {
  const { authReady } = useAuth();
  const token =
    localStorage.getItem(
      "token"
    );

  if (!authReady) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 text-sm text-slate-500">
        Checking session...
      </div>
    );
  }

  if (!token) {
    return (
      <Navigate to="/login" />
    );
  }

  return children;
};

export default ProtectedRoute;
