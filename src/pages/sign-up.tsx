import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

import { SignUpForm } from "@/components/sign-up-form";
import { signUp, me } from "@/api/auth";
import { useAuthStore } from "@/store/auth";

function SignUp() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      await signUp({ name, email, password });
      const user = await me();
      login({ name: user.name, email: user.email });
      toast.success("Account created successfully!");
      navigate("/sign-in");
    } catch {
      toast.error("Failed to create account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-svh w-full flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <SignUpForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
}

export default SignUp;
