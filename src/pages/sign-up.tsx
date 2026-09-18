import { SignUpForm } from "@/components/sign-up-form"
import { useSignUp } from "@/hooks/useSignUp"

function SignUp() {
  const { onSubmit } = useSignUp()

  return (
    <div className="min-h-svh w-full flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <SignUpForm onSubmit={onSubmit} />
      </div>
    </div>
  )
}

export default SignUp