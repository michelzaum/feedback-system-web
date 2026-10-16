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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, ShieldCheck, UserPlus, UserRound } from "lucide-react";

import { useAddMember } from "./useAddMember";
import type { AddMemberModalProps } from "./types";

export function AddMemberModal({ isModalOpen, onOpenModalChange, organizationId, onMemberAdded }: AddMemberModalProps) {
  const {
    emailRef,
    step,
    foundUser,
    selectedRole,
    setSelectedRole,
    isLoading,
    isSubmitting,
    onFindByEmail,
    onConfirm,
    onBackToEmail,
    reset,
  } = useAddMember({ organizationId, onMemberAdded });

  const handleClose = () => {
    reset();
    onOpenModalChange(false);
  };

  return (
    <Dialog open={isModalOpen}>
      <DialogContent className="w-[calc(100%-2rem)] overflow-hidden rounded-2xl p-0 sm:max-w-md" showCloseButton={false}>
        <DialogHeader className="border-b bg-muted/20 px-6 py-5 pr-12">
          <div className="mb-1 flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <UserPlus className="size-5" />
          </div>
          {step === "email" && (
            <>
              <DialogTitle className="text-lg font-semibold">Adicionar membro</DialogTitle>
              <DialogDescription>Busque a pessoa pelo e-mail usado na conta.</DialogDescription>
            </>
          )}
          {step === "confirm" && foundUser && (
            <>
              <DialogTitle className="text-lg font-semibold">Confirmar membro</DialogTitle>
              <DialogDescription>Revise os dados e escolha o nível de acesso.</DialogDescription>
            </>
          )}

        </DialogHeader>

        {step === "email" && (
          <form onSubmit={onFindByEmail} className="flex flex-col gap-5 px-6 py-5">
            <Field>
              <Label htmlFor="member-email">E-mail do membro</Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="member-email" name="email" type="email" placeholder="nome@exemplo.com" ref={emailRef} className="h-10 pl-9" />
              </div>
            </Field>
            <DialogFooter className="flex-col-reverse gap-2 border-t px-0 pb-0 pt-4 sm:flex-row sm:justify-end">
              <DialogClose render={
                <Button onClick={handleClose} variant="outline" className="w-full hover:cursor-pointer sm:w-auto">
                  Cancelar
                </Button>
              } />
              <Button type="submit" className="w-full hover:cursor-pointer sm:w-auto" disabled={isLoading}>
                {isLoading ? "Buscando..." : "Próximo"}
              </Button>
            </DialogFooter>
          </form>
        )}

        {step === "confirm" && foundUser && (
          <form onSubmit={(e) => { e.preventDefault(); onConfirm(); }} className="flex flex-col gap-5 px-6 py-5">
            <div className="flex items-center gap-3 rounded-lg border bg-muted/20 p-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary"><UserRound className="size-5" /></div>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{foundUser.name}</p>
                <p className="truncate text-xs text-muted-foreground">{foundUser.email}</p>
              </div>
            </div>
            <Field>
              <Label htmlFor="member-role">Nível de acesso</Label>
              <Select value={selectedRole} onValueChange={(value) => setSelectedRole(value as "ADMIN" | "MEMBER")} itemToStringLabel={(value) => (value === "ADMIN" ? "Administrador" : "Membro")}>
                <SelectTrigger id="member-role" className="h-10 hover:cursor-pointer">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ADMIN" className="hover:cursor-pointer">Administrador</SelectItem>
                  <SelectItem value="MEMBER" className="hover:cursor-pointer">Membro</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <DialogFooter className="flex-col-reverse gap-2 border-t px-0 pb-0 pt-4 sm:flex-row sm:justify-end">
              <Button onClick={onBackToEmail} variant="outline" className="w-full hover:cursor-pointer sm:w-auto" type="button">
                Voltar
              </Button>
              <Button type="submit" className="w-full hover:cursor-pointer sm:w-auto" disabled={isSubmitting}>
                <ShieldCheck className="size-4" />
                {isSubmitting ? "Adicionando..." : "Confirmar"}
              </Button>
            </DialogFooter>
          </form>
        )}


      </DialogContent>
    </Dialog>
  );
}
