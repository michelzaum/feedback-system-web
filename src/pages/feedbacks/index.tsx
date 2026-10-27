import { Card, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Clock,
  Loader,
  CheckCircle2,
  MessageSquareText,
  FolderKanban,
  Inbox,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "cn";
import { useFeedbacks, type ProjectFeedbacks } from "./useFeedbacks";
import type { Feedback, FeedbackStatus } from "@/api/feedback/types";

const MAX_FEEDBACKS_PER_PROJECT = 3;

const STATUS_OPTIONS: {
  value: FeedbackStatus;
  label: string;
  shortSingular: string;
  shortPlural: string;
}[] = [
  {
    value: "NEW",
    label: "Novo",
    shortSingular: "novo",
    shortPlural: "novos",
  },
  {
    value: "IN_PROGRESS",
    label: "Em Progresso",
    shortSingular: "em progresso",
    shortPlural: "em progresso",
  },
  {
    value: "COMPLETED",
    label: "Concluído",
    shortSingular: "concluído",
    shortPlural: "concluídos",
  },
];

const STATUS_CONFIG: Record<
  FeedbackStatus,
  { label: string; icon: React.ElementType; pill: string; bar: string; dot: string }
> = {
  NEW: {
    label: "Novo",
    icon: Clock,
    pill: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900 dark:text-yellow-100 dark:hover:bg-yellow-800",
    bar: "bg-yellow-500",
    dot: "bg-yellow-500",
  },
  IN_PROGRESS: {
    label: "Em Progresso",
    icon: Loader,
    pill: "bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-100 dark:hover:bg-blue-800",
    bar: "bg-blue-500",
    dot: "bg-blue-500",
  },
  COMPLETED: {
    label: "Concluído",
    icon: CheckCircle2,
    pill: "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-100 dark:hover:bg-green-800",
    bar: "bg-green-500",
    dot: "bg-green-500",
  },
};

const FALLBACK_STATUS_CONFIG = {
  label: "Desconhecido",
  icon: MessageSquareText,
  pill: "bg-muted text-muted-foreground",
  bar: "bg-muted-foreground/40",
  dot: "bg-muted-foreground/40",
};

function StatusPill({
  feedback,
  onStatusChange,
}: {
  feedback: Feedback;
  onStatusChange: (status: FeedbackStatus) => void;
}) {
  const config = STATUS_CONFIG[feedback.status] ?? FALLBACK_STATUS_CONFIG;
  const Icon = config.icon;

  return (
    <Select
      value={feedback.status}
      onValueChange={(value) => onStatusChange(value as FeedbackStatus)}
      items={STATUS_OPTIONS}
    >
      <SelectTrigger
        id={`feedback-status-${feedback.id}`}
        className={cn(
          "h-7 w-fit gap-1 rounded-full border-0 px-2.5 text-xs font-medium shadow-none hover:cursor-pointer [&_svg]:size-3",
          config.pill
        )}
      >
        <Icon />
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectLabel>Status</SelectLabel>
        {STATUS_OPTIONS.map((option) => (
          <SelectItem
            key={option.value}
            value={option.value}
            className="hover:cursor-pointer"
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function ProjectPanel({
  group,
  onUpdateStatus,
  onViewAll,
}: {
  group: ProjectFeedbacks;
  onUpdateStatus: (
    projectId: string,
    feedbackId: string,
    status: FeedbackStatus
  ) => void;
  onViewAll: (projectSlug: string) => void;
}) {
  const total = group.feedbacks.length;
  const counts = group.feedbacks.reduce(
    (acc, feedback) => {
      acc[feedback.status] += 1;

      return acc;
    },
    { NEW: 0, IN_PROGRESS: 0, COMPLETED: 0 } as Record<FeedbackStatus, number>
  );

  return (
    <Card className="gap-0 py-0">
      <div className="flex flex-col gap-4 p-5">
        <div className="flex items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
            <FolderKanban className="size-5" />
          </div>
          <div className="flex min-w-0 flex-col gap-0.5">
            <h2 className="truncate text-sm font-semibold leading-none">
              {group.projectName}
            </h2>
            <p className="text-xs text-muted-foreground">
              {total === 0
                ? "Nenhum feedback ainda"
                : `${total} ${total === 1 ? "feedback" : "feedbacks"}`}
            </p>
          </div>
        </div>

        {total > 0 && (
          <div className="flex flex-col gap-2">
            <div className="flex h-1.5 w-full gap-0.5">
              {STATUS_OPTIONS.map((option) =>
                counts[option.value] > 0 ? (
                  <div
                    key={option.value}
                    className={cn(
                      "h-full rounded-full",
                      (STATUS_CONFIG[option.value] ?? FALLBACK_STATUS_CONFIG).bar
                    )}
                    style={{
                      width: `${(counts[option.value] / total) * 100}%`,
                    }}
                  />
                ) : null
              )}
            </div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
              {STATUS_OPTIONS.map((option) => (
                <span
                  key={option.value}
                  className={cn(
                    "flex items-center gap-1.5",
                    counts[option.value] === 0 && "opacity-40"
                  )}
                >
                  <span
                    className={cn(
                      "size-1.5 rounded-full",
                      (STATUS_CONFIG[option.value] ?? FALLBACK_STATUS_CONFIG).dot
                    )}
                  />
                  <span className="font-medium tabular-nums text-foreground">
                    {counts[option.value]}
                  </span>
                  {counts[option.value] === 1
                    ? option.shortSingular
                    : option.shortPlural}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {total > 0 ? (
        <ul className="flex flex-1 flex-col divide-y divide-border/70 border-t border-border/70">
          {group.feedbacks.slice(0, MAX_FEEDBACKS_PER_PROJECT).map((feedback) => (
            <li
              key={feedback.id}
              className="flex items-center gap-3 px-5 py-2.5"
            >
              <p className="min-w-0 flex-1 truncate text-sm font-medium">
                {feedback.title}
              </p>
              <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
                {new Date(feedback.createdAt).toLocaleDateString("pt-BR")}
              </span>
              <StatusPill
                feedback={feedback}
                onStatusChange={(status) =>
                  onUpdateStatus(group.projectId, feedback.id, status)
                }
              />
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex flex-1 items-center justify-center border-t border-border/70 px-5 py-8">
          <p className="text-xs text-muted-foreground">
            Nenhum feedback recebido ainda
          </p>
        </div>
      )}

      {group.projectSlug && (
        <div className="border-t border-border/70 p-1.5">
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-muted-foreground hover:cursor-pointer hover:text-foreground"
            onClick={() => onViewAll(group.projectSlug)}
          >
            Ver todos
            <ArrowRight className="size-3.5" />
          </Button>
        </div>
      )}
    </Card>
  );
}

export function Feedbacks() {
  const { projectFeedbacks, isLoading, handleUpdateStatus, handleViewAll } =
    useFeedbacks();
  const feedbackCount = projectFeedbacks.reduce(
    (total, group) => total + group.feedbacks.length,
    0
  );
  const newFeedbacksCount = projectFeedbacks.reduce(
    (total, group) =>
      total +
      group.feedbacks.filter((feedback) => feedback.status === "NEW").length,
    0
  );

  return (
    <div className="flex flex-1 flex-col gap-7 bg-neutral-50 p-4 pt-0 dark:bg-neutral-950 md:p-6 md:pt-2">
      <header className="flex flex-col gap-5 rounded-xl border bg-card p-5 shadow-sm md:flex-row md:items-center md:justify-between md:p-6">
        <div className="flex items-start gap-4">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <MessageSquareText className="size-5" />
          </div>
          <div className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
              Central de feedback
            </p>
            <h1 className="text-2xl font-semibold tracking-tight">Feedbacks</h1>
            <p className="text-sm text-muted-foreground">
              Acompanhe e atualize as solicitações recebidas nos seus projetos.
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
              {isLoading ? "—" : newFeedbacksCount}
            </p>
          </div>
        </div>
      </header>

      {isLoading ? (
        <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {[0, 1, 2].map((item) => (
            <Card
              key={item}
              className="h-80 animate-pulse gap-0 py-0 ring-foreground/10"
            />
          ))}
        </div>
      ) : projectFeedbacks.length === 0 ? (
        <Card className="flex min-h-72 flex-col items-center justify-center border-dashed bg-card/60 px-6 text-center">
          <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <Inbox className="size-6" />
          </div>
          <CardTitle className="text-base">
            Nenhum feedback por enquanto
          </CardTitle>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            Quando alguém enviar uma sugestão ou relatar um problema, os
            feedbacks aparecerão aqui.
          </p>
        </Card>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {projectFeedbacks.map((group) => (
            <ProjectPanel
              key={group.projectId}
              group={group}
              onUpdateStatus={handleUpdateStatus}
              onViewAll={handleViewAll}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Feedbacks;
