import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

import { LoginForm } from "@/components/login-form";
import { signIn } from "@/api/auth";

function SignIn() {
  const navigate = useNavigate();
  const [, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      await signIn({ email, password });
      toast.success("Signed in successfully!");
      navigate("/");
    } catch {
      toast.error("Failed to sign in. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center">
      <div className="w-xl">
        <LoginForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
}

export default SignIn;
