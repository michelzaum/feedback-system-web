import { OrganizationSelectForm } from "@/components/organization-select-form";
import { useSelectOrg } from "@/pages/select-org/useSelectOrg";

function SelectOrg() {
  const { organizations, isLoading, onSubmit } = useSelectOrg();

  return (
    <div className="min-h-svh w-full flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <OrganizationSelectForm
          organizations={organizations}
          isLoading={isLoading}
          onSubmit={onSubmit}
        />
      </div>
    </div>
  );
}

export default SelectOrg;
