import { Button } from "@/components/ui/button";
import { Building2, LogOut, UsersRound } from "lucide-react";
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
    <div className="relative flex min-h-svh w-full items-center justify-center overflow-hidden bg-muted/30 px-4 py-10">
      <div className="pointer-events-none absolute -left-24 -top-24 size-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-20 size-80 rounded-full bg-primary/10 blur-3xl" />
      <div className="relative w-full max-w-lg">
        <Card className="w-full overflow-hidden border-border/70 shadow-xl shadow-primary/5">
          <div className="h-1.5 bg-linear-to-r from-primary/40 via-primary to-primary/40" />
          <CardHeader className="flex flex-col items-center gap-6 px-6 pt-9 text-center sm:px-10">
            <div className="relative flex size-20 items-center justify-center rounded-3xl bg-primary/10 text-primary ring-1 ring-primary/15">
              <Building2 className="size-9" />
              <span className="absolute -bottom-2 -right-2 flex size-8 items-center justify-center rounded-full bg-background text-muted-foreground shadow-sm ring-1 ring-border">
                <UsersRound className="size-4" />
              </span>
            </div>
            <div className="space-y-2">
              <CardTitle className="text-2xl tracking-tight sm:text-3xl">Você ainda não faz parte de uma organização</CardTitle>
              <CardDescription className="mx-auto max-w-sm text-sm leading-relaxed">
                Peça ao administrador da sua organização para convidar você. Quando receber o convite, seus projetos estarão disponíveis aqui.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="px-6 pb-8 pt-4 sm:px-10">
            <form onSubmit={onLogout}>
              <Button type="submit" size="lg" className="w-full gap-2 hover:cursor-pointer" disabled={isLoading}>
                <LogOut className="size-4" />
                {isLoading ? "Saindo..." : "Sair da conta"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default NoOrganization;
