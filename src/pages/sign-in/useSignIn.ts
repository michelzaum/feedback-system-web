import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

import { signIn, me } from "@/api/sign-in";
import { useAuthStore } from "@/store/auth";
import { getOrganizations } from "@/api/organizations";
import { getProjects } from "@/api/projects";

export function useSignIn() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const setOrganizationsWithProjects = useAuthStore((state) => state.setOrganizationsWithProjects);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      await signIn({ email, password });

      const user = await me();
      const orgs = await getOrganizations();
      const projects = await getProjects();

      const organizationsWithProjects = orgs.map((org) => ({
        ...org,
        projects: projects.filter((p) => p.organizationId === org.id),
      }));

      setOrganizationsWithProjects(organizationsWithProjects);

      if (organizationsWithProjects.length === 0) {
        login({ name: user.name, email: user.email });

        toast.success("Signed in successfully!");
        navigate("/no-organization", { replace: true });
      } else if (organizationsWithProjects.length === 1) {
        login({ name: user.name, email: user.email }, organizationsWithProjects[0]);

        toast.success("Signed in successfully!");
        navigate("/", { replace: true });
      } else {
        login({ name: user.name, email: user.email });

        toast.success("Signed in successfully!");
        navigate("/select-org", { replace: true });
      }
    } catch {
      toast.error("Failed to sign in. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, onSubmit };
}
