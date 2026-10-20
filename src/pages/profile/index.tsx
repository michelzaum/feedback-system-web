import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldDescription, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { KeyRound, Loader2, Save, Trash2, TriangleAlert, UserRound } from "lucide-react";
import { useProfile } from "./useProfile";

export function Profile() {
  const {
    profile,
    isLoading,
    isSavingName,
    isSavingPassword,
    isDeleteDialogOpen,
    isDeletingAccount,
    onSubmitName,
    onSubmitPassword,
    setIsDeleteDialogOpen,
    onConfirmDeleteAccount,
  } = useProfile();

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

          <Card className="gap-0 border-destructive/30 py-0">
            <CardHeader className="border-b bg-destructive/5 px-6 pt-5 pb-5">
              <CardTitle className="flex items-center gap-2 text-base text-destructive">
                <TriangleAlert className="size-4" />
                Zona de perigo
              </CardTitle>
              <CardDescription>
                A exclusão da sua conta é permanente e não pode ser desfeita. Você perderá o acesso a todas as organizações das quais faz parte.
              </CardDescription>
            </CardHeader>
            <CardContent className="px-6 py-5">
              <Button
                variant="destructive"
                onClick={() => setIsDeleteDialogOpen(true)}
                className="w-full hover:cursor-pointer sm:w-auto"
              >
                <Trash2 className="size-4" />
                Excluir minha conta
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="w-[calc(100%-2rem)] overflow-hidden rounded-2xl p-0 sm:max-w-md">
          <DialogHeader className="border-b bg-destructive/5 px-6 py-5 pr-12">
            <div className="mb-1 flex size-10 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
              <TriangleAlert className="size-5" />
            </div>
            <DialogTitle className="text-lg font-semibold">Excluir conta</DialogTitle>
            <DialogDescription>
              Esta ação é permanente e não pode ser desfeita. Todos os seus dados serão removidos definitivamente.
            </DialogDescription>
          </DialogHeader>
          <div className="px-6 py-5">
            <div className="flex items-center gap-3 rounded-lg border bg-muted/20 p-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <UserRound className="size-4" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{profile?.name}</p>
                <p className="truncate text-xs text-muted-foreground">{profile?.email}</p>
              </div>
            </div>
          </div>
          <DialogFooter className="flex-col-reverse gap-2 border-t px-6 py-4 sm:flex-row sm:justify-end">
            <Button
              onClick={() => setIsDeleteDialogOpen(false)}
              variant="outline"
              className="w-full hover:cursor-pointer sm:w-auto"
            >
              Cancelar
            </Button>
            <Button
              onClick={onConfirmDeleteAccount}
              variant="destructive"
              className="w-full hover:cursor-pointer sm:w-auto"
              disabled={isDeletingAccount}
            >
              {isDeletingAccount ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
              {isDeletingAccount ? "Excluindo..." : "Excluir conta"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Profile;
