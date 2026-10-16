import type { ReactNode } from "react";
import { Navigate, Outlet } from "react-router";
import { useAuthStore } from "@/store/auth";

interface AdminRouteProps {
  children?: ReactNode;
}

export function AdminRoute({ children }: AdminRouteProps) {
  const selectedOrganization = useAuthStore((state) => state.selectedOrganization);

  if (selectedOrganization?.role !== "ADMIN") {
    return <Navigate to="/no-access" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
}

export default AdminRoute;
