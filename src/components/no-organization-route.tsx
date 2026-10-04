import type { ReactNode } from "react";
import { Navigate, Outlet } from "react-router";
import { useAuthStore } from "@/store/auth";

interface NoOrganizationRouteProps {
  children?: ReactNode;
}

export function NoOrganizationRoute({ children }: NoOrganizationRouteProps) {
  const organizationsWithProjects = useAuthStore((state) => state.organizationsWithProjects);

  if (organizationsWithProjects.length > 0) {
    return <Navigate to="/dashboard" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
}

export default NoOrganizationRoute;
