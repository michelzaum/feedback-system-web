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
}

export function FeedbackCard({ feedback, status, index }: FeedbackCardProps) {
  const { ref, isDragging } = useSortable({
    id: feedback.id,
    index,
    type: "feedback",
    accept: "feedback",
    group: status,
  });

  return (
    <Card
      ref={ref}
      className={cn(
        "cursor-grab gap-2 rounded-lg border-border/70 py-3 shadow-sm transition-all select-none hover:border-primary/40 hover:shadow-md active:cursor-grabbing",
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
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <CalendarDays className="size-3.5" />
          {new Date(feedback.createdAt).toLocaleDateString("pt-BR")}
        </span>
        <GripVertical className="size-4 text-muted-foreground/50" />
      </CardFooter>
    </Card>
  );
}
