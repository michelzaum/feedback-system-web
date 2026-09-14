export type CreateProjectModalProps = {
  isModalOpen: boolean;
  onOpenModalChange: (open: boolean) => void;
  onProjectCreated?: (name: string) => void;
};

export type UseCreateProjectModalProps = {
  onOpenModalChange: (open: boolean) => void;
  onProjectCreated?: (name: string) => void;
};