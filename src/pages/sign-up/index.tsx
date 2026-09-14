import { SignUp } from "@clerk/react";

export function SignUpPage() {
  return (
    <div className="flex flex-1 h-screen items-center justify-center">
      <SignUp />
    </div>
  );
}

export default SignUpPage;
