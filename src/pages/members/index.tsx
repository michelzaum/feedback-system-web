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
import { Plus, MoreHorizontal, Pencil, Trash2, Users, UserRound, ShieldCheck, TriangleAlert } from "lucide-react";
import { useMembers } from "./useMembers";
import { AddMemberModal } from "@/components/add-member";
import { Field } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function Members() {
  const {
    members,
    isLoading,
    refetch,
    selectedOrganization,
    isModalOpen,
    setIsEditDialogOpen,
    isEditDialogOpen,
    setEditingMember,
    editingMember,
    setIsDeleteDialogOpen,
    isDeleteDialogOpen,
    handleEdit,
    handleDelete,
    onUpdateRole,
    onConfirmDelete,
    toggleIsModalOpen,
  } = useMembers();
  const adminCount = members.filter((member) => member.role === "ADMIN").length;

  return (
    <div className="flex flex-1 flex-col gap-6 bg-neutral-50 p-4 pt-0 dark:bg-neutral-950 md:p-6 md:pt-2">
      <header className="flex flex-col gap-5 rounded-xl border bg-card p-5 shadow-sm md:flex-row md:items-center md:justify-between md:p-6">
        <div className="flex items-start gap-4">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Users className="size-5" />
          </div>
          <div className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">Equipe da organização</p>
            <h1 className="text-2xl font-semibold tracking-tight">Membros</h1>
            <p className="text-sm text-muted-foreground">Gerencie quem tem acesso e as permissões da sua equipe.</p>
          </div>
        </div>
        {selectedOrganization && (
          <Button onClick={toggleIsModalOpen} className="hover:cursor-pointer">
            <Plus className="size-4" />
            Adicionar membro
          </Button>
        )}
      </header>

      <div className="grid gap-3 sm:grid-cols-2">
        <Card className="bg-card/80">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex size-10 items-center justify-center rounded-lg bg-muted text-muted-foreground"><Users className="size-4" /></div>
            <div><p className="text-xs text-muted-foreground">Total de membros</p><p className="text-xl font-semibold">{isLoading ? "—" : members.length}</p></div>
          </CardContent>
        </Card>
        <Card className="bg-card/80">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary"><ShieldCheck className="size-4" /></div>
            <div>
              <p className="text-xs text-muted-foreground">Administradores</p>
              <p className="text-xl font-semibold">{isLoading ? "—" : adminCount}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {isLoading ? (
        <Card className="overflow-hidden">
          <div className="h-12 animate-pulse bg-muted/60" />
          <CardContent className="space-y-4 p-5">
            {[0, 1, 2].map((item) => <div key={item} className="h-10 animate-pulse rounded-md bg-muted/50" />)}
          </CardContent>
        </Card>
      ) : members.length === 0 ? (
        <Card className="flex min-h-64 flex-col items-center justify-center border-dashed bg-card/60 px-6 text-center">
          <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-muted text-muted-foreground"><UserRound className="size-6" /></div>
          <CardTitle className="text-base">Sua equipe ainda está vazia</CardTitle>
          <CardDescription className="mt-2 max-w-sm">Adicione pessoas para colaborar na organização e gerenciar os projetos juntos.</CardDescription>
          {selectedOrganization && <Button onClick={toggleIsModalOpen} className="mt-5 hover:cursor-pointer"><Plus className="size-4" />Adicionar membro</Button>}
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <CardHeader className="border-b bg-muted/20">
            <CardTitle className="text-base">Pessoas com acesso</CardTitle>
            <CardDescription>Consulte e atualize as permissões da equipe.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 hover:bg-muted/30">
              <TableHead className="pl-5">Membro</TableHead>
              <TableHead>E-mail</TableHead>
              <TableHead>Permissão</TableHead>
              <TableHead className="w-12 pr-5"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((member) => (
              <TableRow key={member.id} className="group">
                <TableCell className="pl-5">
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">{member.name?.charAt(0).toLocaleUpperCase() ?? "?"}</div>
                    <span className="font-medium">{member.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">{member.email}</TableCell>
                <TableCell>
                  <Badge variant={member.role === "ADMIN" ? "default" : "secondary"}>{member.role === "ADMIN" ? "Administrador" : "Membro"}</Badge>
                </TableCell>
                <TableCell className="pr-5">
                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground hover:cursor-pointer" aria-label={`Ações para ${member.name}`}>
                      <MoreHorizontal className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(member)} className="hover:cursor-pointer">
                        <Pencil className="mr-2 h-4 w-4" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(member.id)} className="hover:cursor-pointer">
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
          </CardContent>
        </Card>
      )}
      {selectedOrganization && (
        <AddMemberModal
          isModalOpen={isModalOpen}
          onOpenModalChange={toggleIsModalOpen}
          organizationId={selectedOrganization.id}
          onMemberAdded={() => {
            refetch();
            toggleIsModalOpen();
          }}
        />
      )}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="w-[calc(100%-2rem)] overflow-hidden rounded-2xl p-0 sm:max-w-md">
          <DialogHeader className="border-b bg-muted/20 px-6 py-5 pr-12">
            <div className="mb-1 flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <ShieldCheck className="size-5" />
            </div>
            <DialogTitle className="text-lg font-semibold">Editar permissões</DialogTitle>
            <DialogDescription>Escolha o nível de acesso deste membro na organização.</DialogDescription>
          </DialogHeader>
          {editingMember && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                onUpdateRole();
              }}
              className="flex flex-col gap-5 px-6 py-5"
            >
              <div className="flex items-center gap-3 rounded-lg border bg-muted/20 p-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
                  {members.find((member) => member.id === editingMember.id)?.name?.charAt(0).toLocaleUpperCase() ?? "?"}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{members.find((member) => member.id === editingMember.id)?.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{members.find((member) => member.id === editingMember.id)?.email}</p>
                </div>
              </div>
              <Field>
                <Label htmlFor="member-role">Nível de acesso</Label>
                <Select
                  value={editingMember.role}
                  onValueChange={(value) => {
                    const role = value as string;
                    setEditingMember((prev) => (prev ? { ...prev, role } : prev));
                  }}
                >
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
                <Button
                  onClick={() => setIsEditDialogOpen(false)}
                  variant="outline"
                  className="w-full hover:cursor-pointer sm:w-auto"
                  type="button"
                >
                  Cancelar
                </Button>
                <Button type="submit" className="w-full hover:cursor-pointer sm:w-auto">
                  <Pencil className="size-4" />
                  Salvar permissões
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="w-[calc(100%-2rem)] overflow-hidden rounded-2xl p-0 sm:max-w-md">
          <DialogHeader className="border-b bg-destructive/5 px-6 py-5 pr-12">
            <div className="mb-1 flex size-10 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
              <TriangleAlert className="size-5" />
            </div>
            <DialogTitle className="text-lg font-semibold">Remover membro</DialogTitle>
            <DialogDescription>Esta pessoa perderá o acesso à organização e aos projetos dela.</DialogDescription>
          </DialogHeader>
          <div className="px-6 py-5">
            <div className="flex items-center gap-3 rounded-lg border bg-muted/20 p-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted font-semibold text-muted-foreground">
                {members.find((member) => member.id === editingMember?.id)?.name?.charAt(0).toLocaleUpperCase() ?? "?"}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{members.find((member) => member.id === editingMember?.id)?.name}</p>
                <p className="truncate text-xs text-muted-foreground">{members.find((member) => member.id === editingMember?.id)?.email}</p>
              </div>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">Essa ação não pode ser desfeita.</p>
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
              onClick={onConfirmDelete}
              variant="destructive"
              className="w-full hover:cursor-pointer sm:w-auto"
            >
              <Trash2 className="size-4" />
              Remover membro
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Members;
