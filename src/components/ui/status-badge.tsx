import { cn } from "@/lib/utils";

type EquipmentStatus = "activo" | "en_mantenimiento" | "disponible" | "fuera_servicio";

const statusConfig: Record<EquipmentStatus, { label: string; dotClass: string; bgClass: string }> = {
  activo: { label: "Operativo", dotClass: "bg-status-active", bgClass: "bg-success-bg text-[hsl(122,39%,25%)]" },
  en_mantenimiento: { label: "Mantenimiento", dotClass: "bg-status-maintenance", bgClass: "bg-warning-bg text-[hsl(28,91%,30%)]" },
  disponible: { label: "Disponible", dotClass: "bg-status-available", bgClass: "bg-primary-light text-primary" },
  fuera_servicio: { label: "Fuera de Servicio", dotClass: "bg-status-offline", bgClass: "bg-danger-bg text-[hsl(0,72%,30%)]" },
};

interface StatusBadgeProps {
  status: EquipmentStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.activo;
  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
      config.bgClass,
      className
    )}>
      <span className={cn("h-1.5 w-1.5 rounded-full", config.dotClass)} />
      {config.label}
    </span>
  );
}