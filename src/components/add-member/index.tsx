import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Field } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UserCircle } from "lucide-react"

import { useAddMember } from "./useAddMember"
import type { AddMemberModalProps } from "./types"

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
      <DialogContent className="sm:max-w-sm p-2" showCloseButton={false}>
        <DialogHeader className="flex flex-col gap-2 py-8">
          {step === "email" && (
            <>
              <DialogTitle>Adicionar membro</DialogTitle>
              <DialogDescription>
                Informe o e-mail do membro que deseja adicionar
              </DialogDescription>
            </>
          )}
          {step === "confirm" && foundUser && (
            <>
              <DialogTitle>Confirmar membro</DialogTitle>
              <DialogDescription>
                Verifique os dados do usuário antes de adicionar
              </DialogDescription>
            </>
          )}
          {step === "success" && (
            <>
              <DialogTitle>Membro adicionado</DialogTitle>
              <DialogDescription>
                O membro foi adicionado com sucesso!
              </DialogDescription>
            </>
          )}
        </DialogHeader>

        {step === "email" && (
          <form onSubmit={onFindByEmail} className="flex flex-col gap-6">
            <Field className="px-4">
              <Label htmlFor="member-email">E-mail do membro</Label>
              <Input id="member-email" name="email" ref={emailRef} />
            </Field>
            <DialogFooter className="flex flex-row items-center py-8">
              <DialogClose render={
                <Button onClick={handleClose} variant="secondary" className="flex-1 h-12 hover:cursor-pointer transition-all duration-300">
                  Cancelar
                </Button>
              } />
              <Button type="submit" className="flex-1 h-12 hover:cursor-pointer transition-all duration-300" disabled={isLoading}>
                {isLoading ? "Buscando..." : "Próximo"}
              </Button>
            </DialogFooter>
          </form>
        )}

        {step === "confirm" && foundUser && (
          <form onSubmit={(e) => { e.preventDefault(); onConfirm(); }} className="flex flex-col gap-6">
            <div className="px-4 flex items-center gap-3">
              <UserCircle className="h-10 w-10 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">{foundUser.name}</p>
                <p className="text-sm text-muted-foreground">{foundUser.email}</p>
              </div>
            </div>
            <Field className="px-4">
              <Label htmlFor="member-role">Role</Label>
              <Select value={selectedRole} onValueChange={(value) => setSelectedRole(value as "ADMIN" | "MEMBER")}>
                <SelectTrigger id="member-role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ADMIN">ADMIN</SelectItem>
                  <SelectItem value="MEMBER">MEMBER</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <DialogFooter className="flex flex-row items-center py-8">
              <Button onClick={onBackToEmail} variant="secondary" className="flex-1 h-12 hover:cursor-pointer transition-all duration-300" type="button">
                Voltar
              </Button>
              <Button type="submit" className="flex-1 h-12 hover:cursor-pointer transition-all duration-300" disabled={isSubmitting}>
                {isSubmitting ? "Adicionando..." : "Confirmar"}
              </Button>
            </DialogFooter>
          </form>
        )}

        {step === "success" && (
          <DialogFooter className="flex flex-row items-center py-8">
            <Button onClick={handleClose} className="flex-1 h-12 hover:cursor-pointer transition-all duration-300">
              Concluído
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
