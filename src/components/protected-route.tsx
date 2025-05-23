import { useEffect } from "react";
import { useNavigate, Outlet } from "react-router";

import { useAuth } from "@providers/auth-provider";
import { APP_ROUTES } from "@common/constants";

interface ProtectedRouteProps {
  children?: React.ReactNode;
  fallback?: React.ReactNode;
}

const ProtectedRoute = ({ children, fallback }: ProtectedRouteProps) => {
  const navigate = useNavigate();
  const { userAuth, isLoadingUser } = useAuth();

  useEffect(() => {
    if (!isLoadingUser && !userAuth) {
      navigate(APP_ROUTES.SIGN_IN, { replace: true });
    }
  }, [isLoadingUser, userAuth]);

  if (isLoadingUser) {
    if (fallback) return fallback;
  }

  // If children is provided, render it (for direct usage), otherwise render <Outlet /> for nested routes
  if (userAuth) return children ?? <Outlet />;
  return null;
};

export default ProtectedRoute;
