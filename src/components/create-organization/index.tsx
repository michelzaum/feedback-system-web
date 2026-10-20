import { Loader2, Plus } from "lucide-react";

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

import { useCreateOrganization } from "./useCreateOrganization";
import type { CreateOrganizationModalProps } from "./types";

export function CreateOrganizationModal({ isModalOpen, onOpenModalChange }: CreateOrganizationModalProps) {
  const { organizationName, isSubmitting, onSubmit } = useCreateOrganization({ onOpenModalChange });

  return (
    <Dialog open={isModalOpen} onOpenChange={onOpenModalChange}>
      <DialogContent className="sm:max-w-sm p-2" showCloseButton={false}>
        <DialogHeader className="flex flex-col gap-2 py-8">
          <DialogTitle>Adicionar organização</DialogTitle>
          <DialogDescription>
            Crie uma nova organização para gerenciar feedback dos projetos
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit}>
          <Field className="px-4">
            <Label htmlFor="name-1">Nome da organização</Label>
            <Input id="name-1" name="name" placeholder="Ex.: Minha Empresa" ref={organizationName} required />
          </Field>
          <DialogFooter className="flex flex-row items-center py-8">
            <DialogClose
              render={
                <Button onClick={() => onOpenModalChange(false)} variant="secondary" className="flex-1 h-12 hover:cursor-pointer transition-all duration-300">
                  Cancelar
                </Button>
              }
            />
            <Button type="submit" className="flex-1 h-12 hover:cursor-pointer transition-all duration-300" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
              {isSubmitting ? "Criando..." : "Criar organização"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
