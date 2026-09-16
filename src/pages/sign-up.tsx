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

  return <SignUpForm onSubmit={handleSubmit} />;
}

export default SignUp;
