import { OrganizationSelectForm } from "@/components/organization-select-form";
import { useSelectOrg } from "@/pages/select-org/useSelectOrg";

function SelectOrg() {
  const { organizations, isLoading, selectedOrgId, handleOrgChange, onSubmit } = useSelectOrg();

  return (
    <div className="relative flex min-h-svh w-full items-center justify-center overflow-hidden bg-muted/30 px-4 py-10">
      <div className="pointer-events-none absolute -left-24 -top-24 size-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-20 size-80 rounded-full bg-primary/10 blur-3xl" />
      <div className="relative w-full max-w-md">
        <OrganizationSelectForm
          organizations={organizations}
          isLoading={isLoading}
          selectedOrgId={selectedOrgId}
          onSelectOrganization={handleOrgChange}
          onSubmit={onSubmit}
        />
      </div>
    </div>
  );
}

export default SelectOrg;
