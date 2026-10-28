import { SignUpForm } from "@/components/sign-up-form";
import { useSignUp } from "@/pages/sign-up/useSignUp";

function SignUp() {
  const { onSubmit, isLoading } = useSignUp();

  return <SignUpForm onSubmit={onSubmit} isLoading={isLoading} />;
}

export default SignUp;
