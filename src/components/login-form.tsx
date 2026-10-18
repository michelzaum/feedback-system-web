import { Link } from "react-router";
import { cn } from "cn";

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
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/password-input";
import { ArrowRight, KeyRound } from "lucide-react";

export function LoginForm({
  className,
  onSubmit,
  ...props
}: Omit<React.ComponentProps<"div">, "onSubmit"> & { onSubmit?: React.FormEventHandler<HTMLFormElement> }) {
  return (
    <div className={cn("flex w-full flex-col gap-6", className)} {...props}>
      <Card className="w-full overflow-hidden border-border/70 shadow-xl shadow-primary/5">
        <div className="h-1.5 bg-linear-to-r from-primary/40 via-primary to-primary/40" />
        <CardHeader className="gap-4 px-6 pt-7 sm:px-8">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/15">
            <KeyRound className="size-6" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-2xl tracking-tight sm:text-3xl">Acesse sua conta</CardTitle>
            <CardDescription className="text-sm leading-relaxed">
              Entre para acompanhar seus projetos e feedbacks.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="px-6 pb-7 sm:px-8">
          <form onSubmit={onSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">E-mail</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="m@example.com"
                  autoComplete="email"
                  required
                  className="h-11"
                />
              </Field>
              <Field>
                <div className="flex items-center justify-between gap-2">
                  <FieldLabel htmlFor="password">Senha</FieldLabel>
                </div>
                <PasswordInput
                  id="password"
                  name="password"
                  autoComplete="current-password"
                  required
                  className="h-11"
                  placeholder="********"
                />
              </Field>
              <Field className="gap-2">
                <Button type="submit" size="lg" className="w-full hover:cursor-pointer">
                  Entrar
                  <ArrowRight className="size-4" />
                </Button>
                <FieldDescription className="text-center text-xs sm:text-sm mt-2">
                  Ainda não tem uma conta?{" "}
                  <Link
                    to="/sign-up"
                    className="font-medium text-primary underline underline-offset-4 hover:cursor-pointer hover:text-primary/80"
                  >
                    Criar conta
                  </Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
