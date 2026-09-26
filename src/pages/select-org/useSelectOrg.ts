import { useState, type FormEvent, useEffect } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

import { getOrganizations } from "@/api/organizations";
import { useAuthStore } from "@/store/auth";
import type { Organization } from "@/api/organizations/types";

export function useSelectOrg() {
  const navigate = useNavigate();
  const setSelectedOrganization = useAuthStore((state) => state.setSelectedOrganization);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchOrganizations() {
      try {
        const orgs = await getOrganizations();
        setOrganizations(orgs);
        if (orgs.length === 0) {
          navigate("/no-organization", { replace: true });
        }
      } catch {
        toast.error("Failed to load organizations.");
      }
    }
    fetchOrganizations();
  }, [navigate]);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const orgId = formData.get("organization") as string;
    const org = organizations.find((o) => o.id === orgId);

    if (!org) return;

    setIsLoading(true);
    try {
      setSelectedOrganization(org);

      navigate("/", { replace: true });
    } catch {
      toast.error("Failed to select organization.");
    } finally {
      setIsLoading(false);
    }
  };

  return { organizations, isLoading, onSubmit };
}
