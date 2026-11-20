import { CalendarDays, GripVertical, UserRound } from "lucide-react";
import { useSortable } from "@dnd-kit/react/sortable";
import { cn } from "cn";

import {
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Feedback, FeedbackStatus } from "@/api/feedback/types";

interface FeedbackCardProps {
  feedback: Feedback;
  status: FeedbackStatus;
  index: number;
  onOpen: (feedback: Feedback) => void;
}

export function FeedbackCard({ feedback, status, index, onOpen }: FeedbackCardProps) {
  const { ref, isDragging } = useSortable({
    id: feedback.id,
    index,
    type: "feedback",
    accept: "feedback",
    group: status,
  });

  const handleOpen = () => onOpen(feedback);
  const handleKeyDownCapture = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key !== "Enter") return;

    event.preventDefault();
    event.stopPropagation();
    handleOpen();
  };

  return (
    <button
      ref={ref}
      type="button"
      onClick={handleOpen}
      onKeyDownCapture={handleKeyDownCapture}
      aria-label={`Abrir detalhes de ${feedback.title}.${feedback.assignee ? ` Responsável: ${feedback.assignee.name}.` : ""} Arraste para mudar de status.`}
      className={cn(
        "group/card relative flex w-full cursor-grab flex-col gap-2 overflow-hidden rounded-lg bg-card py-3 text-left text-sm text-card-foreground ring-1 ring-foreground/10 shadow-sm transition-all select-none hover:cursor-pointer hover:ring-primary/30 hover:shadow-md active:cursor-grabbing [--card-spacing:--spacing(4)] has-data-[slot=card-footer]:pb-0",
        isDragging && "border-primary/50 shadow-lg ring-2 ring-primary/40"
      )}
    >
      <CardHeader className="px-4">
        <CardTitle className="text-sm leading-5 font-semibold">
          {feedback.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4">
        <p className="line-clamp-3 text-xs leading-5 text-muted-foreground">
          {feedback.description}
        </p>
      </CardContent>
      <CardFooter className="justify-between px-4 py-2.5">
        <span className="flex min-w-0 items-center gap-2">
          {feedback.assignee && (
            <span
              title={feedback.assignee.name}
              className="flex min-w-0 max-w-32 items-center gap-1.5 text-xs"
            >
              <UserRound className="size-3.5 shrink-0" aria-hidden="true" />
              <span className="truncate">{feedback.assignee.name}</span>
            </span>
          )}
        </span>
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <CalendarDays className="size-3.5" />
          {new Date(feedback.createdAt).toLocaleDateString("pt-BR")}
        </span>
      </CardFooter>
    </button>
  );
}
