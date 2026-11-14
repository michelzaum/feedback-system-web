import { CalendarDays, FolderKanban, LoaderCircle, MessageSquareText, Send, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { Feedback, FeedbackNote, FeedbackStatus } from "@/api/feedback/types";
import type { Project } from "@/api/projects/types";

const STATUS_LABELS: Record<FeedbackStatus, string> = {
  NEW: "Novo",
  IN_PROGRESS: "Em progresso",
  COMPLETED: "Concluído",
};

interface FeedbackDetailsDialogProps {
  feedback: Feedback | null;
  project: Project | null;
  open: boolean;
  notes: FeedbackNote[];
  isNotesLoading: boolean;
  noteContent: string;
  isSavingNote: boolean;
  isUpdatingStatus: boolean;
  onOpenChange: (open: boolean) => void;
  onNoteContentChange: (content: string) => void;
  onCreateNote: (event: React.FormEvent<HTMLFormElement>) => void;
  onStatusChange: (status: FeedbackStatus) => void;
}

export function FeedbackDetailsDialog({
  feedback,
  project,
  open,
  notes,
  isNotesLoading,
  noteContent,
  isSavingNote,
  isUpdatingStatus,
  onOpenChange,
  onNoteContentChange,
  onCreateNote,
  onStatusChange,
}: FeedbackDetailsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] overflow-y-auto rounded-2xl p-0 sm:max-w-2xl" showCloseButton={false}>
        {feedback && (
          <>
            <DialogHeader className="border-b bg-muted/20 px-6 py-5 pr-16">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 space-y-1.5">
                  <Badge variant="secondary">Detalhes do feedback</Badge>
                  <DialogTitle className="text-xl font-semibold">{feedback.title}</DialogTitle>
                  <DialogDescription className="flex flex-wrap items-center gap-x-4 gap-y-1">
                    <span className="inline-flex items-center gap-1.5">
                      <CalendarDays className="size-3.5" />
                      {new Date(feedback.createdAt).toLocaleString("pt-BR", {
                        dateStyle: "long",
                        timeStyle: "short",
                      })}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <FolderKanban className="size-3.5" />
                      {project?.name ?? "Projeto"}
                    </span>
                  </DialogDescription>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Fechar detalhes"
                  onClick={() => onOpenChange(false)}
                  className="hover:cursor-pointer"
                >
                  <X />
                </Button>
              </div>
            </DialogHeader>

            <div className="space-y-6 px-6 py-5">
              <section className="space-y-2">
                <h3 className="text-sm font-semibold">Descrição</h3>
                <p className="whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
                  {feedback.description}
                </p>
              </section>

              <section className="max-w-xs space-y-2">
                <h3 className="text-sm font-semibold">Status</h3>
                <Select
                  value={feedback.status}
                  onValueChange={(value) => {
                    if (value) onStatusChange(value as FeedbackStatus);
                  }}
                  disabled={isUpdatingStatus}
                >
                  <SelectTrigger aria-label="Status do feedback">
                    <SelectValue>{STATUS_LABELS[feedback.status]}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NEW">Novo</SelectItem>
                    <SelectItem value="IN_PROGRESS">Em progresso</SelectItem>
                    <SelectItem value="COMPLETED">Concluído</SelectItem>
                  </SelectContent>
                </Select>
              </section>

              <section className="space-y-3 border-t pt-5">
                <div className="flex items-center gap-2">
                  <MessageSquareText className="size-4 text-muted-foreground" />
                  <h3 className="text-sm font-semibold">Notas internas</h3>
                  <Badge variant="secondary">{notes.length}</Badge>
                </div>

                <div className="max-h-56 space-y-3 overflow-y-auto rounded-lg border bg-muted/20 p-3">
                  {isNotesLoading ? (
                    <div className="flex items-center justify-center gap-2 py-6 text-sm text-muted-foreground">
                      <LoaderCircle className="size-4 animate-spin" /> Carregando notas...
                    </div>
                  ) : notes.length === 0 ? (
                    <p className="py-5 text-center text-sm text-muted-foreground">
                      Ainda não há notas. Adicione a primeira nota para sua equipe.
                    </p>
                  ) : (
                    notes.map((note) => (
                      <article key={note.id} className="rounded-md border bg-background px-3 py-2.5">
                        <div className="mb-1.5 flex flex-wrap items-center justify-between gap-2">
                          <span className="text-xs font-semibold">{note.author.name}</span>
                          <time className="text-xs text-muted-foreground" dateTime={note.createdAt}>
                            {new Date(note.createdAt).toLocaleString("pt-BR", {
                              dateStyle: "short",
                              timeStyle: "short",
                            })}
                          </time>
                        </div>
                        <p className="whitespace-pre-wrap text-sm leading-5">{note.content}</p>
                      </article>
                    ))
                  )}
                </div>

                <form onSubmit={onCreateNote} className="space-y-2">
                  <Textarea
                    value={noteContent}
                    onChange={(event) => onNoteContentChange(event.currentTarget.value)}
                    placeholder="Escreva uma nota visível apenas para a equipe..."
                    aria-label="Nova nota interna"
                    disabled={isSavingNote}
                    required
                    className="min-h-20 resize-y"
                  />
                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      disabled={isSavingNote || !noteContent.trim()}
                      className="hover:cursor-pointer"
                    >
                      {isSavingNote ? <LoaderCircle className="animate-spin" /> : <Send />}
                      Adicionar nota
                    </Button>
                  </div>
                </form>
              </section>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
