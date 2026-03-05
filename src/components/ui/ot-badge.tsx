import { cn } from "@/lib/utils";

type OTStatus = "creada" | "asignada" | "en_curso" | "pausada" | "cerrada" | "firmada";

const otStatusConfig: Record<OTStatus, { label: string; className: string }> = {
  creada: { label: "Creada", className: "bg-muted text-muted-foreground" },
  asignada: { label: "Asignada", className: "bg-primary-light text-primary" },
  en_curso: { label: "En Curso", className: "bg-success-bg text-success" },
  pausada: { label: "Pausada", className: "bg-warning-bg text-warning" },
  cerrada: { label: "Cerrada", className: "bg-muted text-foreground" },
  firmada: { label: "Firmada", className: "bg-primary text-primary-foreground" },
};

interface OTBadgeProps {
  status: OTStatus;
  className?: string;
}

export function OTBadge({ status, className }: OTBadgeProps) {
  const config = otStatusConfig[status] || otStatusConfig.creada;
  return (
    <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium", config.className, className)}>
      {config.label}
    </span>
  );
}
