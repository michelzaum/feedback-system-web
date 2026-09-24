import type { ReactNode } from "react";
import { Navigate, Outlet } from "react-router";
import { getOrganizations } from "@/api/organizations";
import { useState, useEffect } from "react";

interface NoOrganizationRouteProps {
  children?: ReactNode;
}

export function NoOrganizationRoute({ children }: NoOrganizationRouteProps) {
  const [hasOrganization, setHasOrganization] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function check() {
      try {
        const orgs = await getOrganizations();
        setHasOrganization(orgs.length > 0);
      } catch {
        setHasOrganization(false);
      } finally {
        setIsLoading(false);
      }
    }
    check();
  }, []);

  if (isLoading) return null;

  if (hasOrganization) {
    return <Navigate to="/dashboard" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
}

export default NoOrganizationRoute;
