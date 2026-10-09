import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

import { signUp } from "@/api/sign-up";

export function useSignUp() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      await signUp({ name, email, password });

      toast.success("Conta criada com sucesso!");
      navigate("/sign-in");
    } catch {
      toast.error("Falha ao criar conta. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, onSubmit };
}
