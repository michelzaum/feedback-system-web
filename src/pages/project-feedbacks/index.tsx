import {
  ArrowLeft,
  Clock,
  FolderKanban,
  Inbox,
  MessageSquareText,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";

import { FeedbackBoard } from "./board";
import { useProjectFeedbacks } from "./useProjectFeedbacks";

function BoardSkeleton() {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {[0, 1, 2].map((column) => (
        <div
          key={column}
          className="flex min-h-64 flex-col gap-3 rounded-xl border bg-muted/30 p-3"
        >
          <div className="h-8 w-28 animate-pulse rounded-lg bg-muted" />
          <div className="h-28 animate-pulse rounded-lg border bg-card/70" />
          <div className="h-28 animate-pulse rounded-lg border bg-card/70" />
        </div>
      ))}
    </div>
  );
}

function EmptyBoard() {
  return (
    <Card className="flex min-h-72 flex-col items-center justify-center border-dashed bg-card/60 px-6 text-center">
      <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <Inbox className="size-6" />
      </div>
      <CardTitle className="text-base">Nenhum feedback por enquanto</CardTitle>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        Quando alguém enviar uma sugestão ou relatar um problema, os feedbacks
        aparecerão aqui.
      </p>
    </Card>
  );
}

export function ProjectFeedbacks() {
  const {
    project,
    columns,
    isLoading,
    feedbackCount,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    handleBack,
  } = useProjectFeedbacks();

  if (!isLoading && !project) {
    return (
      <div className="flex flex-1 items-center justify-center bg-neutral-50 p-4 pt-0 dark:bg-neutral-950 md:p-6 md:pt-2">
        <Card className="w-full max-w-md border-dashed bg-card/60 px-6 py-10 text-center">
          <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <FolderKanban className="size-6" />
          </div>
          <CardTitle className="text-base">Projeto não encontrado</CardTitle>
          <p className="mt-2 text-sm text-muted-foreground">
            Não foi possível encontrar este projeto. Verifique o link e tente
            novamente.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={handleBack}
            className="mt-6 hover:cursor-pointer"
          >
            <ArrowLeft className="size-3.5" />
            Voltar para feedbacks
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-7 bg-neutral-50 p-4 pt-0 dark:bg-neutral-950 md:p-6 md:pt-2">
      <header className="flex flex-col gap-5 rounded-xl border bg-card p-5 shadow-sm md:flex-row md:items-center md:justify-between md:p-6">
        <div className="flex items-start gap-4">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <FolderKanban className="size-5" />
          </div>
          <div className="min-w-0 space-y-1">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
              Feedbacks do projeto
            </p>
            <h1 className="truncate text-2xl font-semibold tracking-tight">
              {project?.name ?? "Carregando..."}
            </h1>
            <p className="text-sm text-muted-foreground">
              Arraste os cartões entre as colunas para atualizar o status dos
              feedbacks.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 md:min-w-64">
          <div className="rounded-lg border bg-background px-4 py-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <MessageSquareText className="size-3.5" /> Total
            </div>
            <p className="mt-1 text-2xl font-semibold">
              {isLoading ? "—" : feedbackCount}
            </p>
          </div>
          <div className="rounded-lg border bg-background px-4 py-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="size-3.5" /> Novos
            </div>
            <p className="mt-1 text-2xl font-semibold">
              {isLoading ? "—" : columns.NEW.length}
            </p>
          </div>
        </div>
      </header>

      <div className="flex flex-col gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={handleBack}
          className="w-fit hover:cursor-pointer"
        >
          <ArrowLeft className="size-3.5" />
          Voltar
        </Button>

        {isLoading ? (
          <BoardSkeleton />
        ) : feedbackCount === 0 ? (
          <EmptyBoard />
        ) : (
          <FeedbackBoard
            columns={columns}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
          />
        )}
      </div>
    </div>
  );
}

export default ProjectFeedbacks;
