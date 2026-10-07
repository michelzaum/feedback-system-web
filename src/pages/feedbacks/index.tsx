import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Clock, Loader, CheckCircle2, MessageSquareText, FolderKanban, Inbox } from "lucide-react";
import { useFeedbacks } from "./useFeedbacks";
import type { Feedback, FeedbackStatus } from "@/api/feedback/types";

const STATUS_OPTIONS: { value: FeedbackStatus; label: string }[] = [
  { value: "PENDING", label: "Pendente" },
  { value: "IN_REVIEW", label: "Em Revisão" },
  { value: "COMPLETED", label: "Concluído" },
];

function StatusBadge({ status }: { status: FeedbackStatus }) {
  const config: Record<FeedbackStatus, { label: string; className: string }> = {
    PENDING: {
      label: "Pendente",
      className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100",
    },
    IN_REVIEW: {
      label: "Em Revisão",
      className: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
    },
    COMPLETED: {
      label: "Concluído",
      className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
    },
  };

  const { label, className } = config[status] ?? { label: status, className: "bg-muted text-muted-foreground" };

  return (
    <Badge className={className}>
      {status === "PENDING" && <Clock className="mr-1 h-3 w-3" />}
      {status === "IN_REVIEW" && <Loader className="mr-1 h-3 w-3" />}
      {status === "COMPLETED" && <CheckCircle2 className="mr-1 h-3 w-3" />}
      {label}
    </Badge>
  );
}

function FeedbackCard({
  feedback,
  onStatusChange,
}: {
    feedback: Feedback;
    onStatusChange: (status: FeedbackStatus) => void;
  }) {
  return (
    <Card className="group flex flex-col overflow-hidden border-border/70 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="text-sm font-semibold leading-5">{feedback.title}</CardTitle>
          <StatusBadge status={feedback.status} />
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="line-clamp-3 text-sm leading-6 text-muted-foreground">{feedback.description}</p>
      </CardContent>
      <CardFooter className="flex items-center justify-between gap-3 border-t bg-muted/20 px-4 py-3">
        <span className="text-xs text-muted-foreground">
          {new Date(feedback.createdAt).toLocaleDateString("pt-BR")}
        </span>
        <div className="flex items-center gap-2">
          <Select
            value={feedback.status}
            onValueChange={(value) => onStatusChange(value as FeedbackStatus)}
            items={STATUS_OPTIONS}
          >
            <SelectTrigger
              id={`feedback-status-${feedback.id}`}
              className="h-8 w-36 rounded-md border-border bg-background px-3 text-xs font-medium shadow-none hover:bg-accent hover:text-accent-foreground hover:cursor-pointer"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectLabel>Status</SelectLabel>
              {STATUS_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value} className="hover:cursor-pointer">
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardFooter>
    </Card>
  );
}

export function Feedbacks() {
  const { projectFeedbacks, isLoading, handleUpdateStatus } = useFeedbacks();
  const feedbackCount = projectFeedbacks.reduce((total, group) => total + group.feedbacks.length, 0);
  const pendingCount = projectFeedbacks.reduce(
    (total, group) => total + group.feedbacks.filter((feedback) => feedback.status === "PENDING").length,
    0,
  );

  return (
    <div className="flex flex-1 flex-col gap-7 bg-neutral-50 p-4 pt-0 dark:bg-neutral-950 md:p-6 md:pt-2">
      <header className="flex flex-col gap-5 rounded-xl border bg-card p-5 shadow-sm md:flex-row md:items-center md:justify-between md:p-6">
        <div className="flex items-start gap-4">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <MessageSquareText className="size-5" />
          </div>
          <div className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">Central de feedback</p>
            <h1 className="text-2xl font-semibold tracking-tight">Feedbacks</h1>
            <p className="text-sm text-muted-foreground">Acompanhe e atualize as solicitações recebidas nos seus projetos.</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 md:min-w-64">
          <div className="rounded-lg border bg-background px-4 py-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground"><MessageSquareText className="size-3.5" /> Total</div>
            <p className="mt-1 text-2xl font-semibold">{isLoading ? "—" : feedbackCount}</p>
          </div>
          <div className="rounded-lg border bg-background px-4 py-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground"><Clock className="size-3.5" /> Pendentes</div>
            <p className="mt-1 text-2xl font-semibold">{isLoading ? "—" : pendingCount}</p>
          </div>
        </div>
      </header>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {[0, 1, 2].map((item) => (
            <Card key={item} className="h-44 animate-pulse border-border/60 bg-card/70" />
          ))}
        </div>
      ) : projectFeedbacks.length === 0 ? (
        <Card className="flex min-h-72 flex-col items-center justify-center border-dashed bg-card/60 px-6 text-center">
          <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <Inbox className="size-6" />
          </div>
          <CardTitle className="text-base">Nenhum feedback por enquanto</CardTitle>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">Quando alguém enviar uma sugestão ou relatar um problema, os feedbacks aparecerão aqui.</p>
        </Card>
      ) : (
        <div className="flex flex-col gap-8">
          {projectFeedbacks.map((group) => (
            <section key={group.projectId} className="flex flex-col gap-4">
              <div className="flex items-center justify-between border-b pb-3">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                    <FolderKanban className="size-4" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="truncate text-base font-semibold">{group.projectName}</h2>
                    <p className="text-xs text-muted-foreground">Feedbacks recebidos neste projeto</p>
                  </div>
                </div>
                <Badge variant="secondary" className="shrink-0">{group.feedbacks.length}</Badge>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {group.feedbacks.map((feedback) => (
                  <FeedbackCard
                    key={feedback.id}
                    feedback={feedback}
                    onStatusChange={(status) => handleUpdateStatus(group.projectId, feedback.id, status)}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

export default Feedbacks;
