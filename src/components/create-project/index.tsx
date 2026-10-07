import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectIcon, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FolderPlus, Layers3 } from "lucide-react";

import { useCreateProject } from "./useCreateProject";
import type { CreateProjectModalProps } from "./types";

export function CreateProjectModal({ isModalOpen, onOpenModalChange, onProjectCreated }: CreateProjectModalProps) {
  const { projectName, projectDescription, organizations, selectedOrgId, handleOrgChange, onSubmit } = useCreateProject({ onOpenModalChange, onProjectCreated });

  return (
    <Dialog open={isModalOpen}>
      <DialogContent className="w-[calc(100%-2rem)] overflow-hidden rounded-2xl p-0 sm:max-w-lg" showCloseButton>
        <DialogHeader className="border-b bg-muted/20 px-6 py-5 pr-12">
          <div className="mb-1 flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <FolderPlus className="size-5" />
          </div>
          <DialogTitle className="text-lg font-semibold">Criar novo projeto</DialogTitle>
          <DialogDescription>
            Organize os feedbacks da sua equipe em um novo projeto.
          </DialogDescription>
        </DialogHeader>
        <form className="flex flex-col gap-5 px-6 py-5" onSubmit={onSubmit}>
          <Field>
            <Label htmlFor="organization-1">Organização</Label>
            <Select value={selectedOrgId} onValueChange={handleOrgChange}>
              <SelectTrigger id="organization-1" className="h-10 hover:cursor-pointer">
                <SelectValue placeholder="Selecione uma organização">
                  {(value) => {
                    const org = organizations.find((o) => o.id === value);
                    return org?.name ?? "Selecione uma organização";
                  }}
                </SelectValue>
                <SelectIcon />
              </SelectTrigger>
              <SelectContent>
                {organizations.map((org) => (
                  <SelectItem key={org.id} value={org.id} className="hover:cursor-pointer">
                    {org.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <Label htmlFor="name-1">Nome do projeto</Label>
            <Input id="name-1" name="name" ref={projectName} placeholder="Ex.: Aplicativo mobile" className="h-10" />
          </Field>
          <Field>
            <Label htmlFor="description-1">Descrição do projeto</Label>
            <Input id="description-1" name="description" ref={projectDescription} placeholder="Conte brevemente sobre este projeto" className="h-10" />
          </Field>
          <div className="flex items-start gap-2 rounded-lg bg-muted/50 px-3 py-2.5 text-xs text-muted-foreground">
            <Layers3 className="mt-0.5 size-4 shrink-0" />
            <span>Depois de criado, você poderá compartilhar o link público para receber feedbacks.</span>
          </div>
          <DialogFooter className="flex-col-reverse gap-2 border-t px-0 pb-0 pt-4 sm:flex-row sm:justify-end">
            <DialogClose
              render={
                <Button onClick={() => onOpenModalChange(false)} variant="outline" className="w-full hover:cursor-pointer sm:w-auto">
                  Cancelar
                </Button>
              }
            />
            <Button type="submit" className="w-full hover:cursor-pointer sm:w-auto">
              <FolderPlus className="size-4" />
              Criar projeto
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
