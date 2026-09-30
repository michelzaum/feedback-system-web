import { CheckCircle2 } from "lucide-react";

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
      <div className="flex-1 flex items-center justify-center bg-neutral-50 dark:bg-neutral-950 p-4 pt-0">
        <p>Carregando...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex-1 flex items-center justify-center bg-neutral-50 dark:bg-neutral-950 p-4 pt-0">
        <p>Projeto não encontrado</p>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="flex-1 flex items-center justify-center bg-neutral-50 dark:bg-neutral-950 p-4 pt-0">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center gap-4 pt-6">
            <CheckCircle2 className="h-12 w-12 text-green-500" />
            <h2 className="text-lg font-semibold">Feedback enviado!</h2>
            <p className="text-sm text-muted-foreground text-center">
              Obrigado pelo seu feedback. Ele foi enviado com sucesso.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col gap-4 bg-neutral-50 dark:bg-neutral-950 p-4 pt-0">
      <div className="flex items-center gap-3">
        <h2 className="text-lg font-semibold">Enviar Feedback</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{project.name}</CardTitle>
          <CardDescription>{project.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="title">Título</FieldLabel>
                <Input
                  id="title"
                  name="title"
                  placeholder="Título do feedback"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="h-9"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="description">Descrição</FieldLabel>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Descreva seu feedback"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  rows={5}
                />
                <FieldDescription>
                  Descreva sua experiência, sugestões ou problemas encontrados.
                </FieldDescription>
              </Field>
              <Field>
                <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Enviando..." : "Enviar feedback"}
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default Feedback;
