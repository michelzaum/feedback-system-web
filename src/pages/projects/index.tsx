import { toast } from "sonner";
import { Check, Loader2, CircleHelp, Copy, FolderKanban, Link2, Pencil } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useProject } from "./useProject";

export function ProjectManagement() {
  const {
    project,
    isLoading,
    isSaving,
    publicUrl,
    editingName,
    nameValue,
    setNameValue,
    handleSaveName,
    setEditingName,
  } = useProject();


  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-neutral-50 dark:bg-neutral-950 p-4 pt-0">
        <p>Carregando...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex-1 flex items-center justify-center bg-neutral-50 dark:bg-neutral-950 p-4 pt-0">
        <p>Projeto não encontrado</p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-6 bg-neutral-50 p-4 pt-0 dark:bg-neutral-950 md:p-6 md:pt-2">
      <header className="flex flex-col gap-4 rounded-xl border bg-card p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between md:p-6">
        <div className="flex items-start gap-3">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <FolderKanban className="size-5" />
          </div>
          <div className="min-w-0 space-y-1">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">Configurações do projeto</p>
            <h1 className="truncate text-2xl font-semibold tracking-tight">{project.name}</h1>
            <p className="text-sm text-muted-foreground">Gerencie os detalhes e compartilhe o link público de feedback.</p>
          </div>
        </div>
      </header>

      <div className="grid gap-4 xl:grid-cols-5">
        <Card className="xl:col-span-3">
          <CardHeader className="border-b bg-muted/20">
            <CardTitle className="text-base">Nome do projeto</CardTitle>
            <CardDescription>Este nome identifica o projeto para sua equipe.</CardDescription>
          </CardHeader>
          <CardContent className="pt-5">
            {editingName ? (
              <div className="flex flex-col gap-4">
                <Input
                  aria-label="Nome do projeto"
                  value={nameValue}
                  onChange={(e) => setNameValue(e.target.value)}
                />
                <div className="flex gap-2">
                  <Button onClick={handleSaveName} disabled={isSaving} className="hover:cursor-pointer">
                    {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                    {isSaving ? "Salvando..." : "Salvar"}
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setEditingName(false);
                      setNameValue(project.name);
                    }}
                    className="hover:cursor-pointer"
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <span className="text-sm">{project.name}</span>
                <Button
                  variant="outline"
                  onClick={() => {
                    setNameValue(project.name);
                    setEditingName(true);
                  }}
                  className="hover:cursor-pointer"
                >
                  <Pencil className="size-4" />
                  Editar nome
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="xl:col-span-2">
          <CardHeader className="border-b bg-muted/20">
            <CardTitle>
              <div className="flex items-center gap-2 text-base">
                Identificador do projeto
                <Dialog>
                  <DialogTrigger render={<button aria-label="Sobre o identificador" className="hover:cursor-pointer" type="button"><CircleHelp className="h-4 w-4 text-muted-foreground" /></button>}>
                  </DialogTrigger>
                  <DialogContent className="w-[calc(100%-2rem)] overflow-hidden rounded-2xl p-0 sm:max-w-md">
                    <DialogHeader className="border-b bg-muted/20 px-6 py-5 pr-12">
                      <div className="mb-1 flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><Link2 className="size-5" /></div>
                      <DialogTitle className="text-lg font-semibold">O que é um slug?</DialogTitle>
                      <DialogDescription>O slug é o identificador único que aparece no endereço do projeto.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 px-6 py-5">
                      <p className="text-sm leading-6 text-muted-foreground">
                        Ele é criado automaticamente a partir do nome do projeto e não pode ser alterado. Esse identificador ajuda a compor o link público que as pessoas usam para enviar feedback.
                      </p>
                      <div className="rounded-lg border bg-muted/30 p-3">
                        <p className="mb-1 text-xs font-medium text-muted-foreground">Exemplo de identificador</p>
                        <code className="break-all text-sm font-medium text-foreground">meu-novo-projeto</code>
                      </div>
                    </div>
                    <DialogFooter className="border-t px-6 py-4">
                      <DialogClose render={<Button variant="outline" className="w-full hover:cursor-pointer sm:w-auto">Entendi</Button>} />
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardTitle>
            <CardDescription>Slug único usado nos links públicos.</CardDescription>
          </CardHeader>
          <CardContent className="pt-5">
            <code className="block break-all rounded-lg border bg-muted/40 px-3 py-2.5 text-sm text-foreground">{project.slug}</code>
          </CardContent>
        </Card>

        <Card className="xl:col-span-5">
          <CardHeader className="border-b bg-muted/20">
            <CardTitle className="flex items-center gap-2 text-base"><Link2 className="size-4 text-primary" /> Link público de feedback</CardTitle>
            <CardDescription>Compartilhe este endereço para receber feedbacks sobre o projeto.</CardDescription>
          </CardHeader>
          <CardContent className="pt-5">
            <div className="flex flex-col gap-3 sm:flex-row items-center">
              <Input value={publicUrl} readOnly aria-label="Link público de feedback" className="h-10 flex-1 bg-muted/30 font-mono text-xs" />
              <Button
                onClick={() => {
                  navigator.clipboard.writeText(publicUrl);
                  toast.success("URL copiada para a área de transferência");
                }}
                className="h-10 hover:cursor-pointer"
              >
                <Copy className="size-4" />
                Copiar link
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default ProjectManagement;
