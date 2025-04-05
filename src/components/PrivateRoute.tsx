import { useAuth } from "@/hooks/useAuth";
import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

export const PrivateRoute: React.FC = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <Outlet />;
};
