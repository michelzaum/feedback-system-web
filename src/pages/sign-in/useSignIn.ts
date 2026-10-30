import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

import { signIn, me } from "@/api/sign-in";
import { useAuthStore } from "@/store/auth";
import { getOrganizations } from "@/api/organizations";
import { getProjects } from "@/api/projects";
import { mapOrganizationsWithProjects } from "@/utils/organizations";

export function useSignIn() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const setOrganizationsWithProjects = useAuthStore((state) => state.setOrganizationsWithProjects);
  const setOrganizations = useAuthStore((state) => state.setOrganizations);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string | null;
    const password = formData.get("password") as string | null;

    if (!email || !password) {
      toast.error("E-mail e senha são obrigatórios.");
      setIsLoading(false);
      return;
    }

    try {
      await signIn({ email, password });

      const user = await me();
      const orgs = await getOrganizations();
      const projects = await getProjects();

      const organizationsWithProjects = mapOrganizationsWithProjects(orgs, projects);

      setOrganizations(orgs);
      setOrganizationsWithProjects(organizationsWithProjects);

      if (organizationsWithProjects.length === 0) {
        login({ id: user.id, name: user.name, email: user.email });

        toast.success("Login realizado com sucesso!");
        navigate("/no-organization", { replace: true });
      } else if (organizationsWithProjects.length === 1) {
        login({ id: user.id, name: user.name, email: user.email }, organizationsWithProjects[0]);

        toast.success("Login realizado com sucesso!");
        navigate("/overview", { replace: true });
      } else {
        login({ id: user.id, name: user.name, email: user.email });

        toast.success("Login realizado com sucesso!");
        navigate("/select-org", { replace: true });
      }
    } catch {
      toast.error("Falha ao fazer login. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, onSubmit };
}
