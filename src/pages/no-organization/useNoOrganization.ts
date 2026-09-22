import { useState } from "react"
import { useNavigate } from "react-router"
import { toast } from "sonner"

import { useAuthStore } from "@/store/auth"

export function useNoOrganization() {
  const navigate = useNavigate()
  const logout = useAuthStore((state) => state.logout)
  const [isLoading, setIsLoading] = useState(false)

  const onLogout = async () => {
    setIsLoading(true)
    try {
      logout()
      navigate("/sign-in", { replace: true })
      toast.success("Logged out successfully.")
    } catch {
      toast.error("Failed to log out. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return { isLoading, onLogout }
}
