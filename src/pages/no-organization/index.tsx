import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useNoOrganization } from "@/pages/no-organization/useNoOrganization"

function NoOrganization() {
  const { isLoading, onLogout } = useNoOrganization()

  return (
    <div className="min-h-svh w-full flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <Card className="w-full shadow-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-xl sm:text-2xl">No organization found</CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              You do not belong to any organization. Please log out and sign in with an account
              that has an organization membership.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onLogout}>
              <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
                Logout
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default NoOrganization
