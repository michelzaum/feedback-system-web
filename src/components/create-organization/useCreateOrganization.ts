import { useRef, type SubmitEvent } from "react";
import { toast } from "sonner";

import { createOrganization } from "@/api/organizations";
import type { UseCreateOrganizationModalProps } from "./types";

export function useCreateOrganization({ onOpenModalChange }: UseCreateOrganizationModalProps) {
  const organizationName = useRef<HTMLInputElement>({} as HTMLInputElement);

  const onSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    const newOrganizationName = organizationName.current.value;

    if (!newOrganizationName) return;

    try {
      await createOrganization({ name: newOrganizationName });
      toast.success("Organização criada com sucesso!");
    } catch (error) {
      toast.error("Erro ao criar organização");
      console.log(error);
    }

    onOpenModalChange(false);
  };

  return {
    organizationName,
    onSubmit,
  };
}
