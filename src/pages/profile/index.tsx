import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { KeyRound, Loader2, Save, UserRound } from "lucide-react";
import { useProfile } from "./useProfile";

export function Profile() {
  const { profile, isLoading, isSavingName, isSavingPassword, onSubmitName, onSubmitPassword } = useProfile();

  return (
    <div className="flex flex-1 flex-col gap-6 bg-neutral-50 p-4 pt-0 dark:bg-neutral-950 md:p-6 md:pt-2">
      <header className="flex flex-col gap-5 rounded-xl border bg-card p-5 shadow-sm md:flex-row md:items-center md:justify-between md:p-6">
        <div className="flex items-start gap-4">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <UserRound className="size-5" />
          </div>
          <div className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">Sua conta</p>
            <h1 className="text-2xl font-semibold tracking-tight">Perfil</h1>
            <p className="text-sm text-muted-foreground">Consulte suas informações e atualize seu nome e senha.</p>
          </div>
        </div>
      </header>

      {isLoading ? (
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
          {[0, 1].map((item) => (
            <Card key={item}>
              <CardHeader className="border-b bg-muted/20">
                <div className="h-5 w-40 animate-pulse rounded-md bg-muted/50" />
                <div className="h-4 w-64 animate-pulse rounded-md bg-muted/50" />
              </CardHeader>
              <CardContent className="space-y-5 p-6">
                {[0, 1, 2].map((field) => (
                  <div key={field} className="space-y-2">
                    <div className="h-4 w-24 animate-pulse rounded-md bg-muted/50" />
                    <div className="h-10 animate-pulse rounded-lg bg-muted/50" />
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : !profile ? (
        <Card className="flex min-h-64 flex-col items-center justify-center border-dashed bg-card/60 px-6 text-center">
          <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <UserRound className="size-6" />
          </div>
          <CardTitle className="text-base">Não foi possível carregar seu perfil</CardTitle>
          <CardDescription className="mt-2 max-w-sm">Tente recarregar a página em alguns instantes.</CardDescription>
        </Card>
      ) : (
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
          <Card>
            <CardHeader className="border-b bg-muted/20">
              <CardTitle className="text-base">Informações pessoais</CardTitle>
              <CardDescription>Atualize seu nome. O e-mail não pode ser alterado.</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={onSubmitName}>
                <FieldGroup>
                  <Field>
                    <Label htmlFor="name">Nome</Label>
                    <Input
                      id="name"
                      name="name"
                      defaultValue={profile.name}
                      autoComplete="name"
                      className="h-10"
                    />
                  </Field>
                  <Field>
                    <Label htmlFor="email">E-mail</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      defaultValue={profile.email}
                      readOnly
                      tabIndex={-1}
                      className="h-10 cursor-not-allowed opacity-70"
                    />
                    <FieldDescription>O e-mail é fixo e não pode ser atualizado.</FieldDescription>
                  </Field>
                  <Button type="submit" disabled={isSavingName} className="w-full hover:cursor-pointer sm:w-auto">
                    {isSavingName ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
                    Salvar alterações
                  </Button>
                </FieldGroup>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="border-b bg-muted/20">
              <CardTitle className="text-base">Senha</CardTitle>
              <CardDescription>
                Defina uma nova senha com pelo menos 6 caracteres. Deixe os campos vazios para manter a atual.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={onSubmitPassword}>
                <FieldGroup>
                  <Field>
                    <Label htmlFor="password">Nova senha</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="new-password"
                      placeholder="********"
                      className="h-10"
                    />
                  </Field>
                  <Field>
                    <Label htmlFor="confirmPassword">Confirmar nova senha</Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      autoComplete="new-password"
                      placeholder="********"
                      className="h-10"
                    />
                  </Field>
                  <Button type="submit" disabled={isSavingPassword} className="w-full hover:cursor-pointer sm:w-auto">
                    {isSavingPassword ? <Loader2 className="size-4 animate-spin" /> : <KeyRound className="size-4" />}
                    Atualizar senha
                  </Button>
                </FieldGroup>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

export default Profile;
