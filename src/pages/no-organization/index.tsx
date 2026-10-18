import { Building2, Loader2, LogOut, Plus, RefreshCw, UsersRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useNoOrganization } from "@/pages/no-organization/useNoOrganization";

function NoOrganization() {
  const {
    isCheckingOrganizations,
    isCreateFormOpen,
    setIsCreateFormOpen,
    isSubmitting,
    isLoggingOut,
    onCheckOrganizations,
    onSubmit,
    onLogout,
  } = useNoOrganization();

  return (
    <div className="relative flex min-h-svh w-full items-center justify-center overflow-hidden bg-muted/30 px-4 py-10">
      <div className="pointer-events-none absolute -left-24 -top-24 size-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-20 size-80 rounded-full bg-primary/10 blur-3xl" />
      <div className="relative w-full max-w-lg">
        <Card className="w-full overflow-hidden border-border/70 shadow-xl shadow-primary/5">
          <div className="h-1.5 bg-linear-to-r from-primary/40 via-primary to-primary/40" />
          {isCheckingOrganizations ? (
            <CardContent className="flex items-center justify-center gap-3 px-6 py-20 text-sm text-muted-foreground sm:px-10">
              <Loader2 className="size-4 animate-spin" />
              Verificando organizações...
            </CardContent>
          ) : (
            <>
              <CardHeader className="flex flex-col items-center gap-6 px-6 pt-9 text-center sm:px-10">
                <div className="relative flex size-20 items-center justify-center rounded-3xl bg-primary/10 text-primary ring-1 ring-primary/15">
                  <Building2 className="size-9" />
                  <span className="absolute -bottom-2 -right-2 flex size-8 items-center justify-center rounded-full bg-background text-muted-foreground shadow-sm ring-1 ring-border">
                    <UsersRound className="size-4" />
                  </span>
                </div>
                <div className="space-y-2">
                  <CardTitle className="text-lg tracking-tight sm:text-2xl">Você ainda não faz parte de uma organização</CardTitle>
                  <CardDescription className="mx-auto max-w-sm text-sm leading-relaxed">
                    Para acessar a plataforma, peça a um administrador de uma organização para adicioná-lo como membro. Depois de ser adicionado, verifique novamente abaixo.
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col gap-4 px-6 pb-8 pt-4 sm:px-10">
                <Button
                  type="button"
                  size="lg"
                  className="w-full gap-2 hover:cursor-pointer"
                  onClick={onCheckOrganizations}
                >
                  <RefreshCw className="size-4" />
                  Verificar novamente
                </Button>

                <div className="flex items-center gap-3">
                  <Separator className="flex-1" />
                  <span className="text-xs text-muted-foreground">ou</span>
                  <Separator className="flex-1" />
                </div>

                <Collapsible open={isCreateFormOpen} onOpenChange={setIsCreateFormOpen}>
                  <CollapsibleTrigger
                    render={
                      <Button
                        type="button"
                        variant="outline"
                        size="lg"
                        className="w-full gap-2 hover:cursor-pointer"
                      />
                    }
                  >
                    <Plus className="size-4" />
                    Criar nova organização
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-4">
                    <form onSubmit={onSubmit}>
                      <FieldGroup>
                        <Field>
                          <FieldLabel htmlFor="name">Nome da organização</FieldLabel>
                          <Input id="name" name="name" placeholder="Ex.: Minha Empresa" required className="h-11" />
                        </Field>
                        <Field>
                          <Button
                            type="submit"
                            size="lg"
                            className="w-full gap-2 hover:cursor-pointer"
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
                            {isSubmitting ? "Criando..." : "Criar organização"}
                          </Button>
                        </Field>
                      </FieldGroup>
                    </form>
                  </CollapsibleContent>
                </Collapsible>

                <Button
                  type="button"
                  variant="ghost"
                  size="lg"
                  className="w-full gap-2 hover:cursor-pointer"
                  disabled={isLoggingOut}
                  onClick={onLogout}
                >
                  <LogOut className="size-4" />
                  {isLoggingOut ? "Saindo..." : "Sair da conta"}
                </Button>
              </CardContent>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}

export default NoOrganization;
