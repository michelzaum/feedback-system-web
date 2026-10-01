import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle } from "lucide-react";
import { useFeedbacks } from "./useFeedbacks";
import type { Feedback } from "@/api/feedback/types";

function StatusBadge({ status }: { status: string }) {
  return (
    <Badge className="bg-muted text-muted-foreground">
      <AlertCircle className="mr-1 h-3 w-3 text-muted-foreground" />
      {status}
    </Badge>
  );
}

function FeedbackCard({ feedback }: { feedback: Feedback }) {
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
      </CardFooter>
    </Card>
  );
}

export function Feedbacks() {
  const { feedbacks, isLoading } = useFeedbacks();

  return (
    <div className="flex-1 flex flex-col gap-4 bg-neutral-50 dark:bg-neutral-950 p-4 pt-0">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Feedbacks</h2>
      </div>
      {isLoading ? (
        <div>Carregando...</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {feedbacks.map((feedback) => (
            <FeedbackCard key={feedback.id} feedback={feedback} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Feedbacks;
