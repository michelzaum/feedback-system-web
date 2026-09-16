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

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      toast.success("Account created successfully!");
      navigate("/sign-in");
    } catch (error) {
      toast.error("Failed to create account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center">
      <div className="w-xl">
        <SignUpForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
}

export default SignUp;
