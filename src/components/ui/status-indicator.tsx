import { cn } from "@/lib/utils";

type MachineStatus = "activa_en_campo" | "disponible_bodega" | "en_campo_dañada" | "varada_bodega";

const indicatorConfig: Record<MachineStatus, { label: string; dotColor: string; animation: string }> = {
  activa_en_campo: { label: "Activa en Campo", dotColor: "bg-[hsl(142,71%,45%)]", animation: "animate-pulse-fast" },
  disponible_bodega: { label: "Disponible Bodega", dotColor: "bg-[hsl(142,64%,40%)]", animation: "" },
  en_campo_dañada: { label: "En Campo Dañada", dotColor: "bg-destructive", animation: "animate-pulse-slow" },
  varada_bodega: { label: "Varada Bodega", dotColor: "bg-[hsl(215,14%,27%)]", animation: "" },
};

interface StatusIndicatorProps {
  status: MachineStatus;
  showLabel?: boolean;
  className?: string;
}

export function StatusIndicator({ status, showLabel = true, className }: StatusIndicatorProps) {
  const config = indicatorConfig[status] || indicatorConfig.disponible_bodega;
  return (
    <span className={cn("inline-flex items-center gap-2 text-sm", className)}>
      <span className={cn("h-2 w-2 rounded-full", config.dotColor, config.animation)} />
      {showLabel && <span className="text-foreground">{config.label}</span>}
    </span>
  );
}