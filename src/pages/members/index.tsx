import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useMembers } from "./useMembers";

function flattenMembers(members: { id: string; name: string; email: string; organizations: { id: string; name: string; role: string }[] }[]) {
  return members.flatMap((member) =>
    member.organizations.map((org) => ({
      memberId: member.id,
      memberName: member.name,
      memberEmail: member.email,
      orgName: org.name + ",,,",
      orgRole: org.role,
    }))
  );
}

export function Members() {
  const { members, isLoading } = useMembers();
  const rows = flattenMembers(members);

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="flex-1 flex flex-col gap-4 bg-neutral-50 dark:bg-neutral-950 p-4 pt-0">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>E-mail</TableHead>
            <TableHead>Organização</TableHead>
            <TableHead>Role</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={`${row.memberId}-${row.orgName}`}>
              <TableCell>{row.memberName}</TableCell>
              <TableCell>{row.memberEmail}</TableCell>
              <TableCell>{row.orgName}</TableCell>
              <TableCell>
                <Badge variant="outline">{row.orgRole}</Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default Members;
