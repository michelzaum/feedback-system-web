export type FeedbackStatus = "positive" | "negative" | "neutral" | "pending"
export type FeedbackCategory = "usability" | "performance" | "design" | "content" | "bug" | "feature"

export interface Feedback {
  id: string
  author: string
  avatar: string
  project: string
  category: FeedbackCategory
  status: FeedbackStatus
  rating: number
  title: string
  description: string
  createdAt: string
  helpfulCount: number
}

export const feedbacks: Feedback[] = [
  {
    id: "1",
    author: "Ana Silva",
    avatar: "AS",
    project: "Project Alpha",
    category: "usability",
    status: "positive",
    rating: 5,
    title: "Fluxo de integração excelente",
    description: "O novo fluxo de integração é muito intuitivo e fácil de seguir. Os usuários vão adorar.",
    createdAt: "2026-09-10",
    helpfulCount: 24,
  },
  {
    id: "2",
    author: "Carlos Mendes",
    avatar: "CM",
    project: "Project Beta",
    category: "performance",
    status: "negative",
    rating: 2,
    title: "Carregamento lento do painel",
    description: "O painel leva mais de 8 segundos para carregar com uma conexão estável. Precisa de atenção urgente.",
    createdAt: "2026-09-09",
    helpfulCount: 18,
  },
  {
    id: "3",
    author: "Julia Rocha",
    avatar: "JR",
    project: "Project Gamma",
    category: "design",
    status: "positive",
    rating: 4,
    title: "Interface limpa e moderna",
    description: "A interface redesenhada parece profissional e facilita muito a navegação.",
    createdAt: "2026-09-08",
    helpfulCount: 31,
  },
  {
    id: "4",
    author: "Pedro Lima",
    avatar: "PL",
    project: "Project Alpha",
    category: "bug",
    status: "negative",
    rating: 1,
    title: "Envio do formulário falha",
    description: "Enviar o formulário de feedback gera um erro 500 ao fazer upload de anexos.",
    createdAt: "2026-09-07",
    helpfulCount: 42,
  },
  {
    id: "5",
    author: "Maria Santos",
    avatar: "MS",
    project: "Project Beta",
    category: "feature",
    status: "pending",
    rating: 3,
    title: "Suporte ao modo escuro",
    description: "O modo escuro seria uma ótima adição para usuários que preferem temas escuros.",
    createdAt: "2026-09-06",
    helpfulCount: 56,
  },
  {
    id: "6",
    author: "Lucas Ferreira",
    avatar: "LF",
    project: "Project Gamma",
    category: "content",
    status: "neutral",
    rating: 3,
    title: "Documentação poderia ser mais clara",
    description: "A documentação da API está faltando exemplos para alguns endpoints. Mais exemplos necessários.",
    createdAt: "2026-09-05",
    helpfulCount: 12,
  },
  {
    id: "7",
    author: "Fernanda Costa",
    avatar: "FC",
    project: "Project Alpha",
    category: "usability",
    status: "positive",
    rating: 5,
    title: "Ótima funcionalidade de busca",
    description: "A funcionalidade de busca funciona perfeitamente e retorna resultados precisos sempre.",
    createdAt: "2026-09-04",
    helpfulCount: 29,
  },
  {
    id: "8",
    author: "Rafael Gomes",
    avatar: "RG",
    project: "Project Beta",
    category: "performance",
    status: "pending",
    rating: 3,
    title: "Atrasos na renderização de páginas",
    description: "Algumas páginas apresentam atrasos notáveis ao renderizar grandes conjuntos de dados.",
    createdAt: "2026-09-03",
    helpfulCount: 7,
  },
]

export const stats = {
  total: feedbacks.length,
  positive: feedbacks.filter(f => f.status === "positive").length,
  negative: feedbacks.filter(f => f.status === "negative").length,
  pending: feedbacks.filter(f => f.status === "pending").length,
  neutral: feedbacks.filter(f => f.status === "neutral").length,
} as const

export const categoryLabels: Record<FeedbackCategory, string> = {
  usability: "Usabilidade",
  performance: "Desempenho",
  design: "Design",
  content: "Conteúdo",
  bug: "Bug",
  feature: "Recurso",
}

export const statusLabels: Record<FeedbackStatus, string> = {
  positive: "Positivo",
  negative: "Negativo",
  neutral: "Neutro",
  pending: "Pendente",
}

export const statusColors: Record<FeedbackStatus, string> = {
  positive: "default",
  negative: "destructive",
  neutral: "secondary",
  pending: "outline",
}
