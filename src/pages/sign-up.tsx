import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

import { SignUpForm } from "@/components/sign-up-form";

function SignUp() {
  const navigate = useNavigate();
  const [, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
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
