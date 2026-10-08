import { LoginForm } from "@/components/login-form";
import { useSignIn } from "@/pages/sign-in/useSignIn";

function SignIn() {
  const { onSubmit } = useSignIn();

  return (
    <div className="relative flex min-h-svh w-full items-center justify-center overflow-hidden px-4 py-10">
      <LoginForm onSubmit={onSubmit} />
    </div>
  );
}

export default SignIn;
