import { useRef, useState, type SubmitEvent } from "react";
import { toast } from "sonner";

import { findOrganizationMemberByEmail, createOrganizationMember } from "@/api/auth";
import type { MemberInfo } from "@/api/auth";
import type { UseAddMemberModalProps } from "./types";

type Step = "email" | "confirm" | "success";

export function useAddMember({ organizationId, onMemberAdded }: UseAddMemberModalProps) {
  const emailRef = useRef<HTMLInputElement>({} as HTMLInputElement);
  const [step, setStep] = useState<Step>("email");
  const [foundUser, setFoundUser] = useState<MemberInfo | null>(null);
  const [selectedRole, setSelectedRole] = useState<"ADMIN" | "MEMBER">("MEMBER");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onFindByEmail = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const email = emailRef.current.value.trim();
    if (!email) return;

    setIsLoading(true);
    try {
      const data = await findOrganizationMemberByEmail(organizationId, email);
      setFoundUser(data);
      setStep("confirm");
    } catch (error) {
      toast.error("Erro ao buscar usuário");
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const onConfirm = async () => {
    if (!foundUser) return;
    setIsSubmitting(true);
    try {
      await createOrganizationMember(organizationId, {
        userId: foundUser.userId,
        role: selectedRole,
      });
      toast.success("Membro adicionado com sucesso!");
      setStep("success");
      onMemberAdded();
    } catch (error) {
      toast.error("Erro ao adicionar membro");
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onBackToEmail = () => {
    setFoundUser(null);
    setStep("email");
  };

  const reset = () => {
    setStep("email");
    setFoundUser(null);
    setSelectedRole("MEMBER");
    setIsLoading(false);
    setIsSubmitting(false);
  };

  return {
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
  };
}
