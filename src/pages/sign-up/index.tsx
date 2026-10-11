import { SignUpForm } from "@/components/sign-up-form";
import { useSignUp } from "@/pages/sign-up/useSignUp";

function SignUp() {
  const { onSubmit } = useSignUp();

  return (
    <div className="relative flex min-h-svh w-full items-center justify-center overflow-hidden px-4 py-10">
      <SignUpForm onSubmit={onSubmit} />
    </div>
  );
}

export default SignUp;
