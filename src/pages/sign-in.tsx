import { LoginForm } from "@/components/login-form"
import { useSignIn } from "@/hooks/useSignIn"

function SignIn() {
  const { onSubmit } = useSignIn()

  return (
    <div className="min-h-svh w-full flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <LoginForm onSubmit={onSubmit} />
      </div>
    </div>
  )
}

export default SignIn