export type AddMemberModalProps = {
  isModalOpen: boolean;
  onOpenModalChange: (open: boolean) => void;
  organizationId: string;
  onMemberAdded: () => void;
};

export type UseAddMemberModalProps = {
  organizationId: string;
  onMemberAdded: () => void;
};
