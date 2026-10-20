import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

import { useAuthStore } from "@/store/auth";
import { me } from "@/api/sign-in";
import { updateProfile, deleteAccount } from "@/api/profile";
import type { Profile } from "@/api/profile/types";

export function useProfile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingName, setIsSavingName] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  const authUser = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const data = await me();

        setProfile(data);
      } catch (error) {
        toast.error("Erro ao carregar perfil");

        console.log(error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProfile();
  }, []);

  const onSubmitName = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!profile) return;

    const formData = new FormData(e.currentTarget);
    const name = (formData.get("name") as string).trim();

    if (!name) {
      toast.error("O nome não pode estar vazio");

      return;
    }

    setIsSavingName(true);

    try {
      const updatedProfile = await updateProfile(profile.id, { name });

      setProfile(updatedProfile);
      setUser({ ...authUser, id: updatedProfile.id, name: updatedProfile.name, email: updatedProfile.email });

      toast.success("Nome atualizado com sucesso!");
    } catch (error) {
      toast.error("Erro ao atualizar nome");

      console.log(error);
    } finally {
      setIsSavingName(false);
    }
  };

  const onSubmitPassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!profile) return;

    const form = e.currentTarget;
    const formData = new FormData(form);
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password.length < 6) {
      toast.error("A nova senha deve ter pelo menos 6 caracteres");

      return;
    }

    if (password !== confirmPassword) {
      toast.error("As senhas não coincidem");

      return;
    }

    setIsSavingPassword(true);

    try {
      await updateProfile(profile.id, { password });

      form.reset();

      toast.success("Senha atualizada com sucesso!");
    } catch (error) {
      toast.error("Erro ao atualizar senha");

      console.log(error);
    } finally {
      setIsSavingPassword(false);
    }
  };

  const onConfirmDeleteAccount = async () => {
    if (!profile || isDeletingAccount) return;

    setIsDeletingAccount(true);
    try {
      await deleteAccount(profile.id);

      logout();

      toast.success("Conta excluída com sucesso!");

      navigate("/sign-in", { replace: true });
    } catch (error) {
      toast.error("Erro ao excluir sua conta");

      console.log(error);
    } finally {
      setIsDeletingAccount(false);
      setIsDeleteDialogOpen(false);
    }
  };

  return {
    profile,
    isLoading,
    isSavingName,
    isSavingPassword,
    isDeleteDialogOpen,
    isDeletingAccount,
    onSubmitName,
    onSubmitPassword,
    setIsDeleteDialogOpen,
    onConfirmDeleteAccount,
  };
}
