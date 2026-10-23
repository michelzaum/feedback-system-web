import { useDroppable } from "@dnd-kit/react";
import { CollisionPriority } from "@dnd-kit/abstract";
import { cn } from "cn";

import { Badge } from "@/components/ui/badge";
import { FeedbackCard } from "./feedback-card";
import type { Feedback, FeedbackStatus } from "@/api/feedback/types";

interface FeedbackColumnProps {
  status: FeedbackStatus;
  label: string;
  icon: React.ReactNode;
  accent: string;
  feedbacks: Feedback[];
}

export function FeedbackColumn({
  status,
  label,
  icon,
  accent,
  feedbacks,
}: FeedbackColumnProps) {
  const { ref, isDropTarget } = useDroppable({
    id: status,
    type: "column",
    accept: "feedback",
    collisionPriority: CollisionPriority.Low,
  });

  return (
    <div
      ref={ref}
      data-status={status}
      className={cn(
        "flex min-h-40 flex-col gap-3 rounded-xl border bg-muted/30 p-3 transition-colors",
        isDropTarget && "border-primary/60 bg-primary/5"
      )}
    >
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "flex size-6 items-center justify-center rounded-md",
              accent
            )}
          >
            {icon}
          </span>
          <span className="text-sm font-semibold">{label}</span>
        </div>
        <Badge variant="secondary">{feedbacks.length}</Badge>
      </div>

      <div className="flex flex-1 flex-col gap-3">
        {feedbacks.map((feedback, index) => (
          <FeedbackCard
            key={feedback.id}
            feedback={feedback}
            status={status}
            index={index}
          />
        ))}

        {feedbacks.length === 0 && (
          <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed px-3 py-6 text-center text-xs text-muted-foreground">
            Arraste um feedback para cá
          </div>
        )}
      </div>
    </div>
  );
}
