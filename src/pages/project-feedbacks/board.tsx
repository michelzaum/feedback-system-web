import { CheckCircle2, Clock, Loader } from "lucide-react";
import { DragDropProvider } from "@dnd-kit/react";
import type { DragEndEvent, DragOverEvent } from "@dnd-kit/react";

import { FeedbackColumn } from "./column";
import type { FeedbackColumns } from "./useProjectFeedbacks";
import type { FeedbackStatus } from "@/api/feedback/types";

const COLUMN_ITEMS: {
  status: FeedbackStatus;
  label: string;
  icon: React.ReactNode;
  accent: string;
}[] = [
  {
    status: "NEW",
    label: "Novo",
    icon: <Clock className="size-3.5" />,
    accent:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100",
  },
  {
    status: "IN_PROGRESS",
    label: "Em Progresso",
    icon: <Loader className="size-3.5" />,
    accent: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
  },
  {
    status: "COMPLETED",
    label: "Concluído",
    icon: <CheckCircle2 className="size-3.5" />,
    accent:
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
  },
];

interface FeedbackBoardProps {
  columns: FeedbackColumns;
  onDragStart: () => void;
  onDragOver: (event: DragOverEvent) => void;
  onDragEnd: (event: DragEndEvent) => void;
}

export function FeedbackBoard({
  columns,
  onDragStart,
  onDragOver,
  onDragEnd,
}: FeedbackBoardProps) {
  return (
    <DragDropProvider
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
    >
      <div className="grid gap-4 lg:grid-cols-3">
        {COLUMN_ITEMS.map((column) => (
          <FeedbackColumn
            key={column.status}
            status={column.status}
            label={column.label}
            icon={column.icon}
            accent={column.accent}
            feedbacks={columns[column.status]}
          />
        ))}
      </div>
    </DragDropProvider>
  );
}
