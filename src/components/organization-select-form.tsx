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
import { ArrowRight, Building2, Sparkles } from "lucide-react";

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
      <div className="mb-1 flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground">
        <Sparkles className="size-4 text-primary" />
        <span>Seu espaço de trabalho</span>
      </div>
      <Card className="w-full overflow-hidden border-border/70 shadow-xl shadow-primary/5">
        <div className="h-1.5 bg-linear-to- from-primary/40 via-primary to-primary/40" />
        <CardHeader className="gap-4 px-6 pt-7 sm:px-8">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/15">
            <Building2 className="size-6" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-lg tracking-tight sm:text-2xl">Escolha uma organização</CardTitle>
            <CardDescription className="text-sm leading-relaxed">
              Selecione o espaço de trabalho que deseja acessar.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="px-6 pb-7 sm:px-8">
          <form onSubmit={onSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="organization">Organização</FieldLabel>
                <Select name="organization" required>
                  <SelectTrigger id="organization" className="h-12 hover:cursor-pointer">
                    <SelectValue placeholder="Selecione uma organização">
                      {(value) => {
                        const org = organizations.find((o) => o.id === value);
                        return org?.name ?? "Selecione uma organização";
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
                <Button type="submit" size="lg" className="mt-2 w-full gap-2 hover:cursor-pointer" disabled={isLoading}>
                  {isLoading ? "Aguarde..." : "Continuar"}
                  {!isLoading && <ArrowRight className="size-4" />}
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
