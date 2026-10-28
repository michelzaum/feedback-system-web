import { Link } from "react-router";
import { Loader2 } from "lucide-react";
import { cn } from "cn";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/password-input";

export function SignUpForm({
  className,
  onSubmit,
  isLoading = false,
  ...props
}: Omit<React.ComponentProps<"div">, "onSubmit"> & {
  onSubmit?: React.FormEventHandler<HTMLFormElement>;
  isLoading?: boolean;
}) {
  return (
    <div
      className={cn("flex w-full flex-col [--ring:var(--brand)]", className)}
      {...props}
    >
      <div className="flex flex-col items-center gap-3 text-center">
        <img
          src="/logo.svg"
          alt="Impruv"
          width="774"
          height="236"
          className="h-10 w-auto sm:h-11"
        />
        <h1 className="text-xl font-semibold tracking-tight">
          Crie sua conta<span className="text-brand">.</span>
        </h1>
        <p className="text-sm text-muted-foreground">
          Preencha seus dados para começar a usar a plataforma.
        </p>
      </div>

      <form onSubmit={onSubmit} className="mt-8">
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="name">Nome</FieldLabel>
            <Input
              id="name"
              name="name"
              placeholder="Seu nome"
              autoComplete="name"
              required
              className="h-10"
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
              className="h-10"
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="password">Senha</FieldLabel>
            <PasswordInput
              id="password"
              name="password"
              autoComplete="new-password"
              required
              className="h-10"
              placeholder="********"
            />
          </Field>
          <Button
            type="submit"
            size="lg"
            disabled={isLoading}
            className="mt-2 h-10 w-full bg-brand text-brand-foreground hover:cursor-pointer hover:bg-brand/85"
          >
            {isLoading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Criando...
              </>
            ) : (
              "Criar conta"
            )}
          </Button>
          <FieldDescription className="text-center">
            Já tem uma conta?{" "}
            <Link
              to="/sign-in"
              className="font-medium text-brand underline-offset-4 hover:cursor-pointer hover:underline"
            >
              Entrar
            </Link>
          </FieldDescription>
        </FieldGroup>
      </form>
    </div>
  );
}
