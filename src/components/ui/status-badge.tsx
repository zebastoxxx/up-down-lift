import { cn } from "@/lib/utils";

type EquipmentStatus = "activo" | "en_mantenimiento" | "disponible" | "fuera_servicio";

const statusConfig: Record<EquipmentStatus, { label: string; dotClass: string; bgClass: string }> = {
  activo: { label: "Operativo", dotClass: "bg-[hsl(140,45%,38%)]", bgClass: "bg-[hsl(140,40%,93%)] text-[hsl(140,45%,28%)]" },
  en_mantenimiento: { label: "Mantenimiento", dotClass: "bg-[hsl(33,78%,47%)]", bgClass: "bg-[hsl(37,60%,94%)] text-[hsl(33,78%,35%)]" },
  disponible: { label: "Disponible", dotClass: "bg-status-available", bgClass: "bg-primary-light text-primary" },
  fuera_servicio: { label: "Fuera de Servicio", dotClass: "bg-[hsl(4,70%,46%)]", bgClass: "bg-[hsl(4,70%,96%)] text-[hsl(4,70%,40%)]" },
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
