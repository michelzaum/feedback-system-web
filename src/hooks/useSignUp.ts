import { useState, type FormEvent } from "react"
import { useNavigate } from "react-router"
import { toast } from "sonner"

import { signUp, me } from "@/api/auth"
import { useAuthStore } from "@/store/auth"

export function useSignUp() {
  const navigate = useNavigate()
  const login = useAuthStore((state) => state.login)
  const [isLoading, setIsLoading] = useState(false)

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    try {
      await signUp({ name, email, password })
      const user = await me()
      login({ name: user.name, email: user.email })
      toast.success("Account created successfully!")
      navigate("/sign-in")
    } catch {
      toast.error("Failed to create account. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return { isLoading, onSubmit }
}