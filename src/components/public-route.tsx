import type { ReactNode } from "react";
import { Navigate, Outlet } from "react-router";
import { useAuthStore } from "@/store/auth";

interface PublicRouteProps {
  children?: ReactNode;
}

export function PublicRoute({ children }: PublicRouteProps) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
}

export default PublicRoute;
