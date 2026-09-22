import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useMembers } from "./useMembers";
import { AddMemberModal } from "@/components/add-member";
import { useState } from "react";
import { useAuthStore } from "@/store/auth";
import { Field } from "@/components/ui/field";
import { Label } from "@/components/ui/label";

export function Members() {
  const { members, isLoading, refetch, updateMember, deleteMember } = useMembers();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<{ id: string; role: string } | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const selectedOrganization = useAuthStore((state) => state.selectedOrganization);

  const handleEdit = (member: { id: string; role: string }) => {
    setEditingMember(member);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (memberId: string) => {
    setEditingMember({ id: memberId, role: "" });
    setIsDeleteDialogOpen(true);
  };

  const onUpdateRole = async () => {
    if (!editingMember) return;
    await updateMember(editingMember.id, editingMember.role as "ADMIN" | "MEMBER");
    setIsEditDialogOpen(false);
    setEditingMember(null);
  };

  const onConfirmDelete = async () => {
    if (!editingMember) return;
    await deleteMember(editingMember.id);
    setIsDeleteDialogOpen(false);
    setEditingMember(null);
  };

  return (
    <div className="flex-1 flex flex-col gap-4 bg-neutral-50 dark:bg-neutral-950 p-4 pt-0">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Membros</h2>
        {selectedOrganization && (
          <Button onClick={() => setIsModalOpen(true)} className="hover:cursor-pointer transition-all duration-300">
            <Plus className="mr-2 h-4 w-4" />
            Adicionar membro
          </Button>
        )}
      </div>
      {isLoading ? (
        <div>Carregando...</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>E-mail</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((member) => (
              <TableRow key={member.id}>
                <TableCell>{member.name}</TableCell>
                <TableCell>{member.email}</TableCell>
                <TableCell>
                  <Badge variant="outline">{member.role}</Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <Button variant="ghost" size="icon-sm" className="hover:cursor-pointer">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(member)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(member.id)}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      {selectedOrganization && (
        <AddMemberModal
          isModalOpen={isModalOpen}
          onOpenModalChange={setIsModalOpen}
          organizationId={selectedOrganization.id}
          onMemberAdded={() => {
            refetch();
            setIsModalOpen(false);
          }}
        />
      )}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-sm p-2">
          <DialogHeader className="flex flex-col gap-2 py-8">
            <DialogTitle>Editar role</DialogTitle>
            <DialogDescription>
              Altere a role do membro
            </DialogDescription>
          </DialogHeader>
          {editingMember && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                onUpdateRole();
              }}
              className="flex flex-col gap-6"
            >
              <div className="px-4 flex items-center gap-3">
                <p className="text-sm font-medium">{members.find((m) => m.id === editingMember.id)?.name}</p>
              </div>
              <Field className="px-4">
                <Label htmlFor="member-role">Role</Label>
                <Select
                  value={editingMember.role}
                  onValueChange={(value) => {
                    const role = value as string;
                    setEditingMember((prev) => (prev ? { ...prev, role } : prev));
                  }}
                >
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
                <Button
                  onClick={() => setIsEditDialogOpen(false)}
                  variant="secondary"
                  className="flex-1 h-12 hover:cursor-pointer transition-all duration-300"
                  type="button"
                >
                  Cancelar
                </Button>
                <Button type="submit" className="flex-1 h-12 hover:cursor-pointer transition-all duration-300">
                  Salvar
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-sm p-2">
          <DialogHeader className="flex flex-col gap-2 py-8">
            <DialogTitle>Excluir membro</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir este membro? Essa ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-row items-center py-8">
            <Button
              onClick={() => setIsDeleteDialogOpen(false)}
              variant="secondary"
              className="flex-1 h-12 hover:cursor-pointer transition-all duration-300"
            >
              Cancelar
            </Button>
            <Button
              onClick={onConfirmDelete}
              variant="destructive"
              className="flex-1 h-12 hover:cursor-pointer transition-all duration-300"
            >
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Members;