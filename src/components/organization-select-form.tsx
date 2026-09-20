import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Organization {
  id: string;
  name: string;
  slug: string;
  role: string;
}

interface OrganizationSelectFormProps {
  organizations: Organization[];
  isLoading: boolean;
  onSubmit: React.FormEventHandler<HTMLFormElement>;
}

export function OrganizationSelectForm({
  organizations,
  isLoading,
  onSubmit,
}: OrganizationSelectFormProps) {
  return (
    <div className="flex w-full flex-col gap-6">
      <Card className="w-full shadow-sm">
        <CardHeader className="text-center sm:text-left">
          <CardTitle className="text-xl sm:text-2xl">Select your organization</CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Choose the organization you want to manage
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="organization">Organization</FieldLabel>
                <Select name="organization" required>
                  <SelectTrigger id="organization">
                    <SelectValue placeholder="Select an organization">
                      {(value) => {
                        const org = organizations.find((o) => o.id === value);
                        return org?.name ?? "Select an organization";
                      }}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {organizations.map((org) => (
                      <SelectItem key={org.id} value={org.id}>
                        {org.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field className="gap-2">
                <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
                  Continue
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
