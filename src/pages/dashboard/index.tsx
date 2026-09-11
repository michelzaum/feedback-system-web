import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import {
  ArrowUpRight,
  ArrowDownRight,
  MessageCircle,
  TrendingUp,
  Activity,
  CheckCircle2,
  XCircle,
  AlertCircle,
  MinusCircle,
} from "lucide-react"
import { cn } from "cn"
import { feedbacks, stats, categoryLabels, statusLabels, type Feedback, type FeedbackStatus } from "@/data/feedbacks"

function StatCard({
  title,
  value,
  icon: Icon,
  change,
  changeLabel,
  variant = "default",
}: {
  title: string
  value: string | number
  icon: React.ElementType
  change?: string
  changeLabel?: string
  variant?: "default" | "positive" | "negative" | "neutral" | "yellow"
}) {
  const variantColors = {
    default: "text-foreground",
    positive: "text-green-600 dark:text-green-400",
    negative: "text-red-600 dark:text-red-400",
    neutral: "text-muted-foreground",
    yellow: "text-yellow-600",
  }

  const variantBgColors = {
    default: "bg-muted/50",
    positive: "bg-green-50 dark:bg-green-950/30",
    negative: "bg-red-50 dark:bg-red-950/30",
    neutral: "bg-muted/50",
    yellow: "bg-yellow-50 dark:bg-yellow-950/30",
  }

  return (
    <Card className={cn(variantBgColors[variant])}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={cn("h-5 w-5", variantColors[variant])} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
            {variant === "positive" && <ArrowUpRight className="h-3 w-3 text-green-600" />}
            {variant === "negative" && <ArrowDownRight className="h-3 w-3 text-red-600" />}
            {changeLabel && <span className="ml-1">{changeLabel}</span>}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function StatusBadge({ status }: { status: FeedbackStatus }) {
  return (
    <Badge variant={status === "positive" ? "default" : status === "negative" ? "destructive" : status === "pending" ? "outline" : "secondary"}>
      {status === "positive" && <CheckCircle2 className="mr-1 h-3 w-3" />}
      {status === "negative" && <XCircle className="mr-1 h-3 w-3" />}
      {status === "pending" && <AlertCircle className="mr-1 h-3 w-3 text-muted-foreground" />}
      {status === "neutral" && <MinusCircle className="mr-1 h-3 w-3 text-yellow-600" />}
      {statusLabels[status]}
    </Badge>
  )
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
        <div className="flex items-center gap-2 mt-3">
          <Badge variant="outline" className="text-[10px]">
            {categoryLabels[feedback.category]}
          </Badge>
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{feedback.createdAt}</span>
        <Button variant="ghost" size="sm">
          <MessageCircle className="mr-1 h-3 w-3" />
          Responder
        </Button>
      </CardFooter>
    </Card>
  )
}

function CategoryChart() {
  const categories = Object.entries(categoryLabels)
  const maxCount = Math.max(...categories.map(([, cat]) => feedbacks.filter(f => f.category === cat).length))

  return (
    <Card>
      <CardHeader className="pb-1">
        <CardTitle className="text-xs font-medium">Feedbacks por Categoria</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col justify-center gap-1.5 px-4 pb-2">
        {categories.map(([key, label]) => {
          const count = feedbacks.filter(f => f.category === key).length
          const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0
          return (
            <div key={key} className="flex items-center gap-2">
              <Label className="w-16 text-xs">{label}</Label>
              <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="text-xs font-medium w-6 text-right">{count}</span>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}

function RecentFeedbacks({ items }: { items: Feedback[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Feedbacks Recentes</CardTitle>
        <CardDescription>Últimos feedbacks do público</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-3">
        {items.map((feedback) => (
          <FeedbackCard key={feedback.id} feedback={feedback} />
        ))}
      </CardContent>
    </Card>
  )
}

export function Dashboard() {
  const recentFeedbacks = [...feedbacks].reverse().slice(0, 4)

  return (
    <div className="flex flex-1 flex-col gap-4 bg-neutral-50 dark:bg-neutral-950 p-4 pt-0">
      <div className="grid auto-rows-min gap-4 md:grid-cols-5">
        <StatCard title="Total de Feedbacks" value={stats.total} icon={MessageCircle} variant="default" />
        <StatCard title="Positivos" value={stats.positive} icon={CheckCircle2} variant="positive" />
        <StatCard title="Negativos" value={stats.negative} icon={XCircle} variant="negative" />
        <StatCard title="Neutros" value={stats.neutral} icon={MinusCircle} variant="yellow" />
        <StatCard title="Pendentes" value={stats.pending} icon={AlertCircle} variant="neutral" />
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <RecentFeedbacks items={recentFeedbacks} />
        </div>
        <div className="flex flex-col gap-4 md:w-1/3">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-medium">Atividade Geral</CardTitle>
                  <CardDescription>Tendências de feedback em todos os projetos</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <TrendingUp className="mr-1 h-3 w-3" />
                  Ver Tudo
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-green-600" />
                    <div className="flex-1">
                      <div className="text-xs font-medium">Positivo</div>
                      <div className="flex h-2 w-full rounded-full bg-muted mt-1">
                        <div className="h-full rounded-full bg-green-500" style={{ width: "38%" }} />
                      </div>
                    </div>
                    <span className="text-xs font-medium">38%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-red-600" />
                    <div className="flex-1">
                      <div className="text-xs font-medium">Negativo</div>
                      <div className="flex h-2 w-full rounded-full bg-muted mt-1">
                        <div className="h-full rounded-full bg-red-500" style={{ width: "25%" }} />
                      </div>
                    </div>
                    <span className="text-xs font-medium">25%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-yellow-600" />
                    <div className="flex-1">
                      <div className="text-xs font-medium">Neutro</div>
                      <div className="flex h-2 w-full rounded-full bg-muted mt-1">
                        <div className="h-full rounded-full bg-yellow-500" style={{ width: "12%" }} />
                      </div>
                    </div>
                    <span className="text-xs font-medium">12%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                      <div className="text-xs font-medium">Pendente</div>
                      <div className="flex h-2 w-full rounded-full bg-muted mt-1">
                        <div className="h-full rounded-full bg-muted-foreground" style={{ width: "25%" }} />
                      </div>
                    </div>
                    <span className="text-xs font-medium">25%</span>
                  </div>
                </div>
                <Separator orientation="vertical" className="h-32" />
                <div className="flex flex-col items-center gap-2">
                  <div className="text-center">
                    <div className="text-2xl font-bold">62%</div>
                    <div className="text-xs text-muted-foreground">Taxa de Satisfação</div>
                  </div>
                  <Badge variant="default" className="text-xs">
                    <TrendingUp className="mr-1 h-3 w-3" />
                    +4% desde o último mês
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
          <CategoryChart />
        </div>
      </div>
    </div>
  )
}

export default Dashboard;
