import { LoginForm } from "@/components/login-form";
import { useSignIn } from "@/pages/sign-in/useSignIn";

function SignIn() {
  const { onSubmit, isLoading } = useSignIn();

  return <LoginForm onSubmit={onSubmit} isLoading={isLoading} />;
}

export default SignIn;
