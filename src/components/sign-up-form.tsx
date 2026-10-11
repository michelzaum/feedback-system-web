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
import { ArrowRight, UserRound } from "lucide-react";

export function SignUpForm({
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
            <UserRound className="size-6" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-2xl tracking-tight sm:text-3xl">Crie sua conta</CardTitle>
            <CardDescription className="text-sm leading-relaxed">
              Preencha seus dados para começar a usar a plataforma.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="px-6 pb-7 sm:px-8">
          <form onSubmit={onSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="name">Nome</FieldLabel>
                <Input
                  id="name"
                  name="name"
                  placeholder="Seu nome"
                  autoComplete="name"
                  required
                  className="h-11"
                />
              </Field>
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
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="h-11"
                  placeholder="********"
                />
              </Field>
              <Field className="gap-2">
                <Button type="submit" size="lg" className="w-full hover:cursor-pointer">
                  Criar conta
                  <ArrowRight className="size-4" />
                </Button>
                <FieldDescription className="text-center text-xs sm:text-sm mt-2">
                  Já tem uma conta?{" "}
                  <Link
                    to="/sign-in"
                    className="font-medium text-primary underline underline-offset-4 hover:cursor-pointer hover:text-primary/80"
                  >
                    Entrar
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
