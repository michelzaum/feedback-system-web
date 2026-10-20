import { isAxiosError } from "axios";

export interface BlockedOrganization {
  id: string;
  name: string;
}

export interface AccountDeletionError {
  message: string;
  blockedOrganizations: BlockedOrganization[];
}

const ONLY_ADMIN_BLOCKED_MESSAGE =
  "Você é o único administrador de uma ou mais organizações que ainda têm outros membros. Para continuar, promova outro membro a administrador em cada organização afetada e tente excluir sua conta novamente.";

const CONCURRENT_CHANGES_MESSAGE =
  "Suas organizações foram alteradas enquanto a exclusão era processada. Revise os membros das suas organizações e tente novamente.";

const INVALID_REQUEST_MESSAGE =
  "Não foi possível confirmar a exclusão da sua conta. Revise as informações e tente novamente.";

const PERMISSION_MESSAGE = "Você não tem permissão para excluir esta conta.";

const GENERIC_FAILURE_MESSAGE = "Não foi possível excluir sua conta. Tente novamente em alguns instantes.";

export function getAccountDeletionError(error: unknown): AccountDeletionError {
  if (!isAxiosError(error) || !error.response) {
    return { message: GENERIC_FAILURE_MESSAGE, blockedOrganizations: [] };
  }

  const { status, data } = error.response;

  if (status === 403) {
    return { message: PERMISSION_MESSAGE, blockedOrganizations: [] };
  }

  if (status === 400) {
    return { message: INVALID_REQUEST_MESSAGE, blockedOrganizations: [] };
  }

  if (status === 409) {
    const blockedOrganizations = parseBlockedOrganizations(data);

    if (blockedOrganizations.length > 0) {
      return { message: ONLY_ADMIN_BLOCKED_MESSAGE, blockedOrganizations };
    }

    return { message: CONCURRENT_CHANGES_MESSAGE, blockedOrganizations: [] };
  }

  return { message: GENERIC_FAILURE_MESSAGE, blockedOrganizations: [] };
}

function parseBlockedOrganizations(data: unknown): BlockedOrganization[] {
  if (typeof data !== "object" || data === null) {
    return [];
  }

  const organizations = (data as { organizations?: unknown }).organizations;

  if (!Array.isArray(organizations)) {
    return [];
  }

  const blockedOrganizations: BlockedOrganization[] = [];

  for (const organization of organizations) {
    if (typeof organization !== "object" || organization === null) {
      continue;
    }

    const { id, name } = organization as { id?: unknown; name?: unknown };

    if (typeof id === "string" && typeof name === "string") {
      blockedOrganizations.push({ id, name });
    }
  }

  return blockedOrganizations;
}
