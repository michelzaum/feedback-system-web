import { useState, useEffect } from "react";
import { toast } from "sonner";

import { getMembers } from "@/api/auth";
import type { Member } from "@/api/auth";

export function useMembers() {
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchMembers() {
      try {
        const data = await getMembers();
        setMembers(data);
      } catch (error) {
        toast.error("Erro ao carregar membros");
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchMembers();
  }, []);

  return { members, isLoading };
}
