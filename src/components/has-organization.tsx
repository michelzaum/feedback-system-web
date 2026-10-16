import type { ReactNode } from "react";
import { Navigate, Outlet } from "react-router";
import { useAuthStore } from "@/store/auth";

interface HasOrganizationProps {
  children?: ReactNode;
}

export function HasOrganization({ children }: HasOrganizationProps) {
  const selectedOrganization = useAuthStore((state) => state.selectedOrganization);

  if (!selectedOrganization) {
    return <Navigate to="/select-org" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
}

export default HasOrganization;
