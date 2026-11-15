import { useState } from "react";
import {
  CalendarDays,
  FolderKanban,
  LoaderCircle,
  MessageSquareText,
  Send,
  ShieldCheck,
  Trash2,
  X,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { Feedback, FeedbackNote, FeedbackStatus } from "@/api/feedback/types";
import type { Project } from "@/api/projects/types";

const STATUS_LABELS: Record<FeedbackStatus, string> = {
  NEW: "Novo",
  IN_PROGRESS: "Em progresso",
  COMPLETED: "Concluído",
};

const STATUS_STYLES: Record<FeedbackStatus, string> = {
  NEW: "bg-amber-500/10 text-amber-800 dark:text-amber-300",
  IN_PROGRESS: "bg-blue-500/10 text-blue-800 dark:text-blue-300",
  COMPLETED: "bg-emerald-600/10 text-emerald-800 dark:text-emerald-300",
};

interface FeedbackDetailsDialogProps {
  feedback: Feedback | null;
  project: Project | null;
  open: boolean;
  notes: FeedbackNote[];
  currentUserId: string | undefined;
  isNotesLoading: boolean;
  noteContent: string;
  isSavingNote: boolean;
  deletingNoteId: string | null;
  isUpdatingStatus: boolean;
  onOpenChange: (open: boolean) => void;
  onNoteContentChange: (content: string) => void;
  onCreateNote: (event: React.FormEvent<HTMLFormElement>) => void;
  onDeleteNote: (noteId: string) => Promise<boolean>;
  onStatusChange: (status: FeedbackStatus) => Promise<boolean>;
}

function formatDate(value: string, options: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat("pt-BR", options).format(new Date(value));
}

export function FeedbackDetailsDialog({
  feedback,
  project,
  open,
  notes,
  currentUserId,
  isNotesLoading,
  noteContent,
  isSavingNote,
  deletingNoteId,
  isUpdatingStatus,
  onOpenChange,
  onNoteContentChange,
  onCreateNote,
  onDeleteNote,
  onStatusChange,
}: FeedbackDetailsDialogProps) {
  const [commentToDelete, setCommentToDelete] = useState<FeedbackNote | null>(null);
  const [pendingStatus, setPendingStatus] = useState<{
    feedbackId: string;
    previous: FeedbackStatus;
    next: FeedbackStatus;
  } | null>(null);

  const status = feedback
    ? pendingStatus?.feedbackId === feedback.id && feedback.status === pendingStatus.previous
      ? pendingStatus.next
      : feedback.status
    : "NEW";

  const handleStatusSelection = async (nextStatus: FeedbackStatus) => {
    if (!feedback) return;

    const previousStatus = status;
    setPendingStatus({
      feedbackId: feedback.id,
      previous: previousStatus,
      next: nextStatus,
    });

    const saved = await onStatusChange(nextStatus);

    if (!saved) {
      setPendingStatus(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!commentToDelete) return;

    const deleted = await onDeleteNote(commentToDelete.id);

    if (deleted) {
      setCommentToDelete(null);
    }
  };

  return (
    <>
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="flex h-[min(88dvh,760px)] w-[calc(100%-1.5rem)] flex-col overflow-hidden rounded-2xl p-0 sm:max-w-2xl"
        showCloseButton={false}
      >
        {feedback && (
          <>
            <DialogHeader className="shrink-0 border-b bg-card px-5 pb-5 pt-5 sm:px-7 sm:pt-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex min-w-0 flex-1 items-start justify-between gap-3">
                  <DialogTitle className="max-w-xl flex-1 text-balance text-2xl font-semibold leading-tight tracking-[-0.035em]">
                    {feedback.title}
                  </DialogTitle>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label="Fechar detalhes"
                    onClick={() => onOpenChange(false)}
                    className="size-10 shrink-0 hover:cursor-pointer sm:hidden"
                  >
                    <X className="size-4" />
                  </Button>
                </div>
                <div className="flex shrink-0 justify-start items-center gap-1.5 sm:self-end">
                  <Select
                    value={status}
                    onValueChange={(value) => {
                      if (value) void handleStatusSelection(value as FeedbackStatus);
                    }}
                    disabled={isUpdatingStatus}
                  >
                    <SelectTrigger
                      aria-label="Status do feedback"
                      className="h-9 min-w-32 bg-muted/30 px-2.5 focus-visible:outline-none focus-visible:ring-2 sm:min-w-36 cursor-pointer"
                    >
                      <SelectValue>
                        {(value) => {
                          const selectedStatus = value as FeedbackStatus;

                          return (
                            <span className={`rounded-md px-2 py-1 text-xs font-medium ${STATUS_STYLES[selectedStatus]}`}>
                              {STATUS_LABELS[selectedStatus]}
                            </span>
                          );
                        }}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NEW">Novo</SelectItem>
                      <SelectItem value="IN_PROGRESS">Em progresso</SelectItem>
                      <SelectItem value="COMPLETED">Concluído</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label="Fechar detalhes"
                    onClick={() => onOpenChange(false)}
                    className="hidden size-10 shrink-0 hover:cursor-pointer sm:inline-flex"
                  >
                    <X className="size-4" />
                  </Button>
                </div>
              </div>
            </DialogHeader>

            <div className="min-h-0 flex-1 flex flex-col gap-6 overflow-y-auto px-5 py-5 sm:px-7 sm:py-6">
              <section className="space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                  Descrição
                </h3>
                <DialogDescription className="whitespace-pre-wrap rounded-xl border bg-muted/25 px-4 py-3.5 text-sm leading-6 text-foreground/85">
                  {feedback.description}
                </DialogDescription>
              </section>
              <section>
                <div className="flex flex-col flex-wrap justify-start gap-x-4 gap-y-4 text-xs text-muted-foreground">
                  <div className="flex flex-col min-w-0 items-start gap-1.5">
                    <div className="flex justify-start items-start gap-1.5">
                      <FolderKanban className="size-3.5 shrink-0" />
                      <span>Projeto</span>
                    </div>
                    <span className="truncate text-md font-semibold">{project?.name ?? "Projeto"}</span>
                  </div>
                  <div className="flex flex-col flex-wrap justify-start gap-x-4 gap-y-2 text-xs text-muted-foreground">
                    <div className="flex flex-col min-w-0 items-start gap-1.5">
                      <div className="flex items-center gap-1.5">
                        <CalendarDays className="size-3.5 shrink-0" />
                        <span>Criado em</span>
                      </div>
                      <span className="truncate text-md font-semibold">
                        {formatDate(feedback.createdAt, {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </section>
              <section className="mt-7 space-y-4">
                <div className="flex items-center justify-between gap-3 border-b border-border/70 pb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="flex size-8 items-center justify-center rounded-lg bg-brand/10 text-brand">
                      <MessageSquareText className="size-4" />
                    </span>
                    <div>
                      <h3 className="text-sm font-semibold">Comentários da equipe</h3>
                    </div>
                  </div>
                  <Badge variant="secondary" className="min-w-7 justify-center tabular-nums">
                    {notes.length}
                  </Badge>
                </div>

                {isNotesLoading ? (
                  <div className="space-y-4 py-1" aria-label="Carregando comentários">
                    {[0, 1].map((item) => (
                      <div key={item} className="flex gap-3">
                        <div className="size-8 animate-pulse rounded-full bg-muted" />
                        <div className="flex-1 space-y-2 pt-1">
                          <div className="h-3 w-28 animate-pulse rounded bg-muted" />
                          <div className="h-14 animate-pulse rounded-xl bg-muted/70" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : notes.length === 0 ? (
                  <div className="flex items-center justify-center gap-3 rounded-xl bg-muted/25 px-4 py-4">
                    <div>
                      <p className="text-sm text-center font-medium">Nenhum comentário por enquanto</p>
                      <p className="mt-0.5 text-xs text-center leading-5 text-muted-foreground">
                        Adicione contexto para ajudar sua equipe a acompanhar este feedback.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="relative space-y-4 before:absolute before:bottom-4 before:left-4 before:top-4 before:w-px before:bg-brand/20">
                    {notes.map((note) => (
                      <article key={note.id} className="group relative flex gap-3">
                        <span className="z-10 flex size-8 shrink-0 items-center justify-center rounded-full bg-brand/10 text-xs font-semibold text-brand ring-4 ring-background">
                          {note.author.name.trim().charAt(0).toLocaleUpperCase() || "?"}
                        </span>
                        <div className="min-w-0 flex-1 space-y-1.5">
                          <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                            <span className="text-xs font-semibold">{note.author.name}</span>
                            <div className="flex items-center gap-1">
                              <time className="text-[11px] tabular-nums text-muted-foreground" dateTime={note.createdAt}>
                                {formatDate(note.createdAt, {
                                  day: "2-digit",
                                  month: "short",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </time>
                              {note.author.id === currentUserId && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  aria-label="Excluir comentário"
                                  title="Excluir comentário"
                                  disabled={deletingNoteId !== null}
                                  onClick={() => setCommentToDelete(note)}
                                  className="size-9 text-muted-foreground hover:cursor-pointer hover:text-destructive sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100"
                                >
                                  {deletingNoteId === note.id ? (
                                    <LoaderCircle className="animate-spin" />
                                  ) : (
                                    <Trash2 className="size-4" />
                                  )}
                                </Button>
                              )}
                            </div>
                          </div>
                          <p className="whitespace-pre-wrap rounded-xl bg-card px-3.5 py-3 text-sm leading-6 ring-1 ring-border/70">
                            {note.content}
                          </p>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </section>
            </div>

            <form
              onSubmit={onCreateNote}
              className="shrink-0 space-y-3 border-t bg-card px-5 py-4 sm:px-7"
            >
              <Textarea
                value={noteContent}
                onChange={(event) => onNoteContentChange(event.currentTarget.value)}
                placeholder="Escreva um comentário para a equipe..."
                aria-label="Novo comentário interno"
                disabled={isSavingNote}
                required
                className="min-h-20 resize-y bg-muted/30 text-sm leading-5 placeholder:text-muted-foreground/80"
              />
              <div className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  <ShieldCheck className="size-3.5 text-brand" />
                  Visível somente para a equipe
                </span>
                <Button
                  type="submit"
                  disabled={isSavingNote || !noteContent.trim()}
                  className="hover:cursor-pointer"
                >
                  {isSavingNote ? <LoaderCircle className="animate-spin" /> : <Send />}
                  Adicionar comentário
                </Button>
              </div>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
      <Dialog
        open={commentToDelete !== null}
        onOpenChange={(open) => {
          if (!open && deletingNoteId === null) {
            setCommentToDelete(null);
          }
        }}
      >
        <DialogContent className="w-[calc(100%-2rem)] rounded-2xl p-0 sm:max-w-md">
          <DialogHeader className="border-b bg-muted/20 px-6 py-5 pr-12">
            <DialogTitle className="text-lg font-semibold">Excluir comentário?</DialogTitle>
            <DialogDescription>
              Este comentário será removido da conversa e não poderá ser recuperado.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col-reverse gap-2 px-6 py-4 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              disabled={deletingNoteId !== null}
              onClick={() => setCommentToDelete(null)}
              className="hover:cursor-pointer"
            >
              Cancelar
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={deletingNoteId !== null}
              onClick={() => void handleConfirmDelete()}
              className="hover:cursor-pointer"
            >
              {deletingNoteId === commentToDelete?.id ? (
                <LoaderCircle className="animate-spin" />
              ) : (
                <Trash2 />
              )}
              Excluir comentário
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
