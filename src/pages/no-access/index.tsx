import { ShieldX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router";

export function NoAccess() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 p-4 dark:bg-neutral-950">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <ShieldX className="size-7" />
          </div>
          <CardTitle className="text-xl">Acesso negado</CardTitle>
          <CardDescription className="mt-2">
            Você não tem permissão para acessar este recurso. Entre em contato com o administrador da sua organização se precisar de acesso.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => navigate("/overview")} className="w-full hover:cursor-pointer">
            Voltar ao início
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default NoAccess;
