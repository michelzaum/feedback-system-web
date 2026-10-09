import { useLocation } from "react-router";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function useBreadcrumb() {
  const { pathname } = useLocation();

  const segments = pathname.split("/").filter(Boolean);

  const items: BreadcrumbItem[] = [];

  if (segments[0] === "overview") {
    items.push({ label: "Visão geral", href: "/overview" });
  } else if (segments[0] === "feedbacks") {
    items.push({ label: "Feedbacks", href: "/feedbacks" });
  } else if (segments[0] === "members") {
    items.push({ label: "Membros", href: "/members" });
  } else if (segments[0] === "projects" && segments[1]) {
    items.push({ label: "Projetos", href: "/projects" });
    items.push({ label: segments[1], href: `/projects/${segments[1]}` });
  }

  return items;
}
