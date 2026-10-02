import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  MessageCircle,
  Clock,
  Loader,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Activity,
} from "lucide-react";
import { cn } from "cn";
import { useDashboard } from "./useDashboard";
import type { Feedback } from "@/api/feedback/types";

function StatCard({
  title,
  value,
  icon: Icon,
  variant = "default",
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  variant?: "default" | "yellow" | "blue" | "green";
}) {
  const variantColors = {
    default: "text-foreground",
    yellow: "text-yellow-600",
    blue: "text-blue-600",
    green: "text-green-600 dark:text-green-400",
  };

  const variantBgColors = {
    default: "bg-muted/50",
    yellow: "bg-yellow-50 dark:bg-yellow-950/30",
    blue: "bg-blue-50 dark:bg-blue-950/30",
    green: "bg-green-50 dark:bg-green-950/30",
  };

  return (
    <Card className={cn(variantBgColors[variant])}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={cn("h-5 w-5", variantColors[variant])} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; className: string }> = {
    PENDING: {
      label: "Pendente",
      className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100",
    },
    IN_PROGRESS: {
      label: "Em Progresso",
      className: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
    },
    DONE: {
      label: "Concluído",
      className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
    },
  };

  const { label, className } = config[status] ?? { label: status, className: "bg-muted text-muted-foreground" };

  return (
    <Badge className={className}>
      {status === "PENDING" && <Clock className="mr-1 h-3 w-3" />}
      {status === "IN_PROGRESS" && <Loader className="mr-1 h-3 w-3" />}
      {status === "DONE" && <CheckCircle2 className="mr-1 h-3 w-3" />}
      {label}
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

function RecentFeedbacks({ items, onViewAll }: { items: Feedback[]; onViewAll: () => void }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Feedbacks Recentes</CardTitle>
        <CardDescription>Últimos feedbacks do público</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-3 py-4">
        {items.map((feedback) => (
          <FeedbackCard key={feedback.id} feedback={feedback} />
        ))}
      </CardContent>
      <CardFooter className="flex items-center justify-end p-4">
        <Button variant="outline" size="sm" onClick={onViewAll} className="hover:cursor-pointer">
          Ver todos feedbacks
          <ArrowRight className="ml-1 h-3 w-3" />
        </Button>
      </CardFooter>
    </Card>
  );
}

function ActivityChart({ stats }: { stats: { total: number; pending: number; inProgress: number; done: number } }) {
  const items = [
    { label: "Pendente", count: stats.pending, color: "bg-yellow-500", textColor: "text-yellow-600" },
    { label: "Em Progresso", count: stats.inProgress, color: "bg-blue-500", textColor: "text-blue-600" },
    { label: "Concluído", count: stats.done, color: "bg-green-500", textColor: "text-green-600" },
  ];

  return (
    <Card>
      <CardHeader className="pb-1">
        <CardTitle className="text-xs font-medium">Status dos Feedbacks</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col justify-center gap-1.5 px-4 pb-2">
        {items.map((item) => {
          const percentage = stats.total > 0 ? (item.count / stats.total) * 100 : 0;
          return (
            <div key={item.label} className="flex items-center gap-2">
              <span className="w-20 text-xs">{item.label}</span>
              <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                <div
                  className={cn("h-full rounded-full transition-all duration-500", item.color)}
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className={cn("text-xs font-medium w-6 text-right", item.textColor)}>{item.count}</span>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

export function Dashboard() {
  const { stats, isLoading, recentFeedbacks, handleViewAll } = useDashboard();

  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col gap-4 bg-neutral-50 dark:bg-neutral-950 p-4 pt-0">
        <div>Carregando...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4 bg-neutral-50 dark:bg-neutral-950 p-4 pt-0">
      <div className="grid auto-rows-min gap-4 md:grid-cols-4">
        <StatCard title="Total de Feedbacks" value={stats.total} icon={MessageCircle} variant="default" />
        <StatCard title="Pendentes" value={stats.pending} icon={Clock} variant="yellow" />
        <StatCard title="Em Progresso" value={stats.inProgress} icon={Loader} variant="blue" />
        <StatCard title="Concluídos" value={stats.done} icon={CheckCircle2} variant="green" />
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <RecentFeedbacks items={recentFeedbacks} onViewAll={handleViewAll} />
        </div>
        <div className="flex flex-col gap-4 md:w-1/3">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-medium">Atividade Geral</CardTitle>
                  <CardDescription>Distribuição de status em todos os projetos</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="flex-1 space-y-3">
                  {[
                    { label: "Pendente", percentage: stats.total > 0 ? (stats.pending / stats.total) * 100 : 0, color: "bg-yellow-500", iconColor: "text-yellow-600" },
                    { label: "Em Progresso", percentage: stats.total > 0 ? (stats.inProgress / stats.total) * 100 : 0, color: "bg-blue-500", iconColor: "text-blue-600" },
                    { label: "Concluído", percentage: stats.total > 0 ? (stats.done / stats.total) * 100 : 0, color: "bg-green-500", iconColor: "text-green-600" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-2">
                      <Activity className={cn("h-4 w-4", item.iconColor)} />
                      <div className="flex-1">
                        <div className="text-xs font-medium">{item.label}</div>
                        <div className="flex h-2 w-full rounded-full bg-muted mt-1">
                          <div className={cn("h-full rounded-full", item.color)} style={{ width: `${item.percentage}%` }} />
                        </div>
                      </div>
                      <span className="text-xs font-medium">{Math.round(item.percentage)}%</span>
                    </div>
                  ))}
                </div>
                <Separator orientation="vertical" className="h-32" />
                <div className="flex flex-col items-center gap-2">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{stats.total}</div>
                    <div className="text-xs text-muted-foreground">Total de Feedbacks</div>
                  </div>
                  <Badge variant="default" className="text-xs">
                    <TrendingUp className="mr-1 h-3 w-3" />
                    {stats.total} feedbacks
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
          <ActivityChart stats={stats} />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
