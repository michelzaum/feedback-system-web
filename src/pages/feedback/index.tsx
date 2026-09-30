import { Check, MessageSquareText, Send } from "lucide-react";

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
import { Textarea } from "@/components/ui/textarea";

import { useFeedback } from "./useFeedback";

export function Feedback() {
  const {
    project,
    isLoading,
    isSubmitting,
    title,
    setTitle,
    description,
    setDescription,
    isSubmitted,
    onSubmit,
  } = useFeedback();

  if (isLoading) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-muted/40 p-6">
        <div className="flex items-center gap-3 rounded-full border bg-background px-5 py-3 text-sm text-muted-foreground shadow-sm">
          <span className="size-2 animate-pulse rounded-full bg-primary" />
          Carregando projeto...
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-muted/40 p-6">
        <div className="w-full max-w-md rounded-3xl border bg-background p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
            <MessageSquareText className="size-5" />
          </div>
          <h1 className="text-lg font-semibold tracking-tight">Projeto não encontrado</h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Não foi possível encontrar este projeto. Verifique o link e tente novamente.
          </p>
        </div>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="relative flex min-h-svh items-center justify-center overflow-hidden bg-muted/40 p-6">
        <div className="pointer-events-none absolute -top-32 left-1/2 size-96 -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />
        <Card className="relative w-full max-w-md rounded-3xl border-border/70 shadow-xl shadow-primary/5">
          <CardContent className="flex flex-col items-center px-8 py-10 text-center">
            <div className="mb-5 flex size-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Check className="size-8" strokeWidth={2.5} />
            </div>
            <h2 className="text-xl font-semibold tracking-tight">Feedback enviado!</h2>
            <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Obrigado por compartilhar sua opinião. Sua contribuição ajuda a melhorar este projeto.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-svh flex-1 items-center justify-center overflow-hidden bg-muted/40 px-4 py-12 sm:px-6">
      <div className="pointer-events-none absolute -top-40 left-1/2 size-[30rem] -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />
      <main className="relative w-full max-w-xl">
        <div className="mb-7 text-center">
          <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/15">
            <MessageSquareText className="size-5" />
          </div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Sua opinião importa
          </p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Enviar feedback</h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
            Conte pra gente o que você pensa. Cada sugestão ajuda este projeto a ficar melhor.
          </p>
        </div>

        <Card className="overflow-hidden rounded-3xl border-border/70 bg-card shadow-xl shadow-primary/5">
          <CardHeader className="border-b bg-muted/30 px-6 py-5 sm:px-8">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-xl border bg-background text-primary">
                <MessageSquareText className="size-4" />
              </div>
              <div className="min-w-0">
                <CardTitle className="truncate text-base">{project.name}</CardTitle>
                {project.description && (
                  <CardDescription className="mt-1 leading-relaxed">
                    {project.description}
                  </CardDescription>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-6 py-6 sm:px-8 sm:py-8">
            <form onSubmit={onSubmit}>
              <FieldGroup className="gap-5">
                <Field>
                  <FieldLabel htmlFor="title" className="text-sm font-medium">Título</FieldLabel>
                  <Input
                    id="title"
                    name="title"
                    placeholder="Resuma sua ideia em poucas palavras"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="h-11 rounded-xl bg-background px-3.5"
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="description" className="text-sm font-medium">Descrição</FieldLabel>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Compartilhe sua experiência, uma sugestão ou algo que podemos melhorar..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    rows={6}
                    className="min-h-36 resize-y rounded-xl bg-background px-3.5 py-3 leading-relaxed"
                  />
                  <FieldDescription className="leading-relaxed">
                    Inclua detalhes que ajudem a entender sua experiência.
                  </FieldDescription>
                </Field>
                <Field>
                  <Button type="submit" size="lg" className="h-11 w-full gap-2 rounded-xl hover:cursor-pointer" disabled={isSubmitting}>
                    {isSubmitting ? "Enviando..." : "Enviar feedback"}
                    {!isSubmitting && <Send className="size-4" />}
                  </Button>
                </Field>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
        <p className="mt-5 text-center text-xs text-muted-foreground">
          Agradecemos por dedicar um momento para nos ajudar.
        </p>
      </main>
    </div>
  );
}

export default Feedback;
