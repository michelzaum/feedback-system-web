import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { ArrowLeft, Check, Loader2, CircleHelp } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useProject } from "./useProject";

export function ProjectManagement() {
  const { project, isLoading, isSaving, publicUrl, onSaveName } = useProject();
  const navigate = useNavigate();
  const [editingName, setEditingName] = useState(false);
  const [nameValue, setNameValue] = useState("");

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

  const handleSaveName = async () => {
    if (!nameValue.trim()) return;

    await onSaveName(nameValue.trim());
    setEditingName(false);
  };

  return (
    <div className="flex-1 flex flex-col gap-4 bg-neutral-50 dark:bg-neutral-950 p-4 pt-0">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => navigate("/")}
          className="hover:cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-lg font-semibold">Gerenciar Projeto</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Nome do Projeto</CardTitle>
            <CardDescription>O nome do seu projeto</CardDescription>
          </CardHeader>
          <CardContent>
            {editingName ? (
              <div className="flex flex-col gap-4">
                <Input
                  value={nameValue}
                  onChange={(e) => setNameValue(e.target.value)}
                  defaultValue={project.name}
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
                  Editar
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              <div className="flex items-center gap-2">
                Slug do Projeto
                <Dialog>
                  <DialogTrigger render={<button className="hover:cursor-pointer" type="button"><CircleHelp className="h-4 w-4 text-muted-foreground" /></button>}>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-sm p-2">
                    <DialogHeader className="flex flex-col gap-2 py-8">
                      <DialogTitle>O que é um slug?</DialogTitle>
                      <DialogDescription>
                        O slug é o identificador único do projeto na URL. Ele é gerado automaticamente a partir do nome do projeto e não pode ser alterado. É usado para que os usuários possam acessar a URL pública de feedback.
                      </DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
              </div>
            </CardTitle>
            <CardDescription>Identificador único do projeto</CardDescription>
          </CardHeader>
          <CardContent>
            <span className="text-sm">{project.slug}</span>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>URL Pública</CardTitle>
            <CardDescription>URL para os usuários escreverem feedback</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Input value={publicUrl} readOnly className="flex-1" />
              <Button
                variant="outline"
                onClick={() => {
                  navigator.clipboard.writeText(publicUrl);
                  toast.success("URL copiada para a área de transferência");
                }}
                className="hover:cursor-pointer"
              >
                Copiar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default ProjectManagement;
