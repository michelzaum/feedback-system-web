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
import { Plus } from "lucide-react";
import { useMembers } from "./useMembers";
import { AddMemberModal } from "@/components/add-member";
import { useState } from "react";
import { useAuthStore } from "@/store/auth";

export function Members() {
  const { members, isLoading, refetch } = useMembers();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const selectedOrganization = useAuthStore((state) => state.selectedOrganization);

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
    </div>
  );
}

export default Members;
