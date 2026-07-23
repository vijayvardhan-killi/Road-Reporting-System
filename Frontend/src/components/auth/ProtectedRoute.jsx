import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "@/context/auth/authcontext";

// Wrap a route element with this to require login (and optionally specific roles).
// Usage: <ProtectedRoute roles={["admin","superadmin"]}><AdminDashboard/></ProtectedRoute>
const ProtectedRoute = ({ children, roles }) => {
  const { loggedIn, user } = useContext(AuthContext);

  if (!loggedIn) {
    return <Navigate to="/signin" replace />;
  }

  if (roles && !roles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
