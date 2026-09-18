import { useState, type FormEvent } from "react"
import { useLocation, useNavigate } from "react-router"
import { toast } from "sonner"

import { signIn, me } from "@/api/auth"
import { useAuthStore } from "@/store/auth"

export function useSignIn() {
  const navigate = useNavigate()
  const location = useLocation()
  const login = useAuthStore((state) => state.login)
  const [isLoading, setIsLoading] = useState(false)

  const from = (location.state as { from?: Location })?.from?.pathname || "/"

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    try {
      const [, user] = await Promise.all([
        signIn({ email, password }),
        me(),
      ])

      login({ name: user.name, email: user.email })
      toast.success("Signed in successfully!")
      navigate(from, { replace: true })
    } catch {
      toast.error("Failed to sign in. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return { isLoading, onSubmit }
}