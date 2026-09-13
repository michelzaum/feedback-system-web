import { useRef, type SubmitEvent } from "react";
import { toast } from "sonner";

import { api } from "@/api/request";

export function useCreateOrganization(onOpenChange: (open: boolean) => void) {
  const organizationName = useRef<HTMLInputElement>({} as HTMLInputElement);

  const onSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    const newOrganizationName = organizationName.current.value;

    if (!newOrganizationName) return;

    try {
      await api.post("/organizations", { name: newOrganizationName });
      toast.success("Organização criada com sucesso!");
    } catch (error) {
      toast.error("Erro ao criar organização");
      console.log(error);
    }

    onOpenChange(false);
  }

  return {
    organizationName,
    onSubmit,
  };
}
