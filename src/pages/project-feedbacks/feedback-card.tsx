import { CalendarDays, GripVertical } from "lucide-react";
import { useSortable } from "@dnd-kit/react/sortable";
import { cn } from "cn";

import {
  Card,
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
  const { ref, handleRef, isDragging } = useSortable({
    id: feedback.id,
    index,
    type: "feedback",
    accept: "feedback",
    group: status,
  });

  const handleOpen = () => onOpen(feedback);

  return (
    <Card
      ref={ref}
      className={cn(
        "relative gap-2 rounded-lg border-border/70 py-3 shadow-sm transition-all select-none hover:border-primary/40 hover:shadow-md",
        isDragging && "border-primary/50 shadow-lg ring-2 ring-primary/40"
      )}
    >
      <button type="button" onClick={handleOpen} className="w-full text-left hover:cursor-pointer">
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
        <CardFooter className="px-4 py-2.5">
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <CalendarDays className="size-3.5" />
            {new Date(feedback.createdAt).toLocaleDateString("pt-BR")}
          </span>
        </CardFooter>
      </button>
      <button
        ref={handleRef}
        type="button"
        aria-label="Arrastar feedback"
        className="absolute right-3 bottom-4 rounded p-1 text-muted-foreground/60 hover:cursor-grab hover:bg-muted active:cursor-grabbing"
      >
        <GripVertical className="size-4" />
      </button>
    </Card>
  );
}
