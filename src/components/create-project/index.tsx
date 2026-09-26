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

import { useCreateProject } from "./useCreateProject";
import type { CreateProjectModalProps } from "./types";

export function CreateProjectModal({ isModalOpen, onOpenModalChange, onProjectCreated }: CreateProjectModalProps) {
  const { projectName, projectDescription, organizations, selectedOrgId, handleOrgChange, onSubmit } = useCreateProject({ onOpenModalChange, onProjectCreated });

  return (
    <Dialog open={isModalOpen}>
      <DialogContent className="sm:max-w-sm p-2" showCloseButton={false}>
        <DialogHeader className="flex flex-col gap-2 py-8">
          <DialogTitle>Adicionar projeto</DialogTitle>
          <DialogDescription>
            Crie um novo projeto para gerenciar feedback
          </DialogDescription>
        </DialogHeader>
        <form className="flex flex-col gap-6" onSubmit={onSubmit}>
          <Field className="px-4">
            <Label htmlFor="organization-1">Organização</Label>
            <Select value={selectedOrgId} onValueChange={handleOrgChange}>
              <SelectTrigger id="organization-1">
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
                  <SelectItem key={org.id} value={org.id}>
                    {org.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field className="px-4">
            <Label htmlFor="name-1">Nome do projeto</Label>
            <Input id="name-1" name="name" ref={projectName} />
          </Field>
          <Field className="px-4">
            <Label htmlFor="description-1">Descrição do projeto</Label>
            <Input id="description-1" name="description" ref={projectDescription} />
          </Field>
          <DialogFooter className="flex flex-row items-center py-8">
            <DialogClose
              render={
                <Button onClick={() => onOpenModalChange(false)} variant="secondary" className="flex-1 h-12 hover:cursor-pointer transition-all duration-300">
                  Cancel
                </Button>
              }
            />
            <Button type="submit" className="flex-1 h-12 hover:cursor-pointer transition-all duration-300">
              Salvar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
