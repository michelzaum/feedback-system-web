import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useNoOrganization } from "@/pages/no-organization/useNoOrganization";

function NoOrganization() {
  const { isLoading, onLogout } = useNoOrganization();

  return (
    <div className="min-h-svh w-full flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <Card className="w-full shadow-sm">
          <CardHeader className="text-center flex flex-col gap-3">
            <CardTitle className="text-xl sm:text-2xl">Nenhuma organização encontrada</CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Nenhuma organização encontrada para este usuário. Peça ao dono de sua organização para adicioná-lo.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onLogout}>
              <Button type="submit" size="lg" className="w-full mt-4 hover:cursor-pointer" disabled={isLoading}>
                Logout
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default NoOrganization;
