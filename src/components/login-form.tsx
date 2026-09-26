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

export function LoginForm({
  className,
  onSubmit,
  ...props
}: Omit<React.ComponentProps<"div">, "onSubmit"> & { onSubmit?: React.FormEventHandler<HTMLFormElement> }) {
  return (
    <div className={cn("flex w-full flex-col gap-6", className)} {...props}>
      <Card className="w-full shadow-sm">
        <CardHeader className="text-center sm:text-left">
          <CardTitle className="text-xl sm:text-2xl">Login to your account</CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="m@example.com"
                  autoComplete="email"
                  required
                  className="h-9"
                />
              </Field>
              <Field>
                <div className="flex items-center justify-between gap-2">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <a
                    href="#"
                    className="text-xs sm:text-sm underline-offset-4 hover:underline text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="h-9"
                />
              </Field>
              <Field className="gap-2">
                <Button type="submit" size="lg" className="w-full">
                  Login
                </Button>
                <Button variant="outline" type="button" size="lg" className="w-full">
                  Login with Google
                </Button>
                <FieldDescription className="text-center text-xs sm:text-sm mt-2">
                  Don&apos;t have an account?{" "}
                  <Link
                    to="/sign-up"
                    className="font-medium underline underline-offset-4 hover:text-primary"
                  >
                    Sign up
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
