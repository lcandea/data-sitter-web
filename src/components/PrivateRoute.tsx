import React from "react";
import { useAppSelector } from "@/hooks/useStore";
import { Navigate, Outlet, useLocation } from "react-router-dom";

export const PrivateRoute: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const location = useLocation();

  if (!user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <Outlet />;
};
