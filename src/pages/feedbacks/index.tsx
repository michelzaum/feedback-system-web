import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Clock, Loader, CheckCircle2 } from "lucide-react";
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
  const selectedStatus = STATUS_OPTIONS.find((option) => feedback.status === option.value)?.label;

  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm">{feedback.title}</CardTitle>
          <StatusBadge status={feedback.status} />
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-xs text-muted-foreground line-clamp-2">{feedback.description}</p>
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          {new Date(feedback.createdAt).toLocaleDateString("pt-BR")}
        </span>
        <Select value={selectedStatus} onValueChange={(value) => onStatusChange(value as FeedbackStatus)}>
          <SelectTrigger className="h-7 w-32.5 text-xs hover:cursor-pointer">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value} className="hover:cursor-pointer">
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardFooter>
    </Card>
  );
}

export function Feedbacks() {
  const { projectFeedbacks, isLoading, handleUpdateStatus } = useFeedbacks();

  return (
    <div className="flex-1 flex flex-col gap-6 bg-neutral-50 dark:bg-neutral-950 p-4 pt-0">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Feedbacks</h2>
      </div>
      {isLoading ? (
        <div>Carregando...</div>
      ) : (
        projectFeedbacks.map((group) => (
          <section key={group.projectId} className="flex flex-col gap-3">
            <h3 className="text-xl font-bold text-muted-foreground">{group.projectName}</h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {group.feedbacks.map((feedback) => (
                <FeedbackCard
                  key={feedback.id}
                  feedback={feedback}
                  onStatusChange={(status) => handleUpdateStatus(group.projectId, feedback.id, status)}
                />
              ))}
            </div>
          </section>
        ))
      )}
    </div>
  );
}

export default Feedbacks;
