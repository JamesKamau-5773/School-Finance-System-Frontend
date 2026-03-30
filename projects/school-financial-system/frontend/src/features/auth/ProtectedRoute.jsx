import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getHomeRouteForRole } from "../../auth/roleAccess";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useAuth();
  const location = useLocation();

  // 1. Check Authentication: Is the user logged in at all?
  if (!user) {
    // Redirect them to the /login page, but save the URL they were trying to reach
    // so we can send them there after a successful login.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. Check Authorization: Does the user have the required role for this specific module?
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={getHomeRouteForRole(user.role)} replace />;
  }

  // 3. Access Granted: Render the requested module
  return children;
}
