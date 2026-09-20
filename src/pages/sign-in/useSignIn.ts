import { useState, type FormEvent } from "react"
import { useNavigate } from "react-router"
import { toast } from "sonner"

import { signIn, me, getOrganizations } from "@/api/auth"
import { useAuthStore } from "@/store/auth"

export function useSignIn() {
  const navigate = useNavigate()
  const login = useAuthStore((state) => state.login)
  const [isLoading, setIsLoading] = useState(false)

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    try {
      await signIn({ email, password })
      const user = await me()
      const orgs = await getOrganizations()
      if (orgs.length === 1) {
        login({ name: user.name, email: user.email }, orgs[0])
        toast.success("Signed in successfully!")
        navigate("/", { replace: true })
      } else {
        login({ name: user.name, email: user.email })
        toast.success("Signed in successfully!")
        navigate("/select-org", { replace: true })
      }
    } catch {
      toast.error("Failed to sign in. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return { isLoading, onSubmit }
}
