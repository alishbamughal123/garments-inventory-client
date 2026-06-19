import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import Loader from "../ui/Loader";

const ProtectedRoute = ({
  children,
  roles,
}) => {
  const { authReady, user } = useAuth();
  const token =
    localStorage.getItem(
      "token"
    );

  if (!authReady) {
    return <Loader message="Verifying secure session..." fullPage={true} />;
  }

  if (!token) {
    return (
      <Navigate to="/login" />
    );
  }

  if (roles && !roles.includes(user?.role)) {
    return (
      <Navigate to="/dashboard" />
    );
  }

  return children;
};

export default ProtectedRoute;
