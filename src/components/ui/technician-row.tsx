import { cn } from "@/lib/utils";
import { OTBadge } from "@/components/ui/ot-badge";

interface TechnicianRowProps {
  name: string;
  specialty?: string;
  activeOTs?: number;
  hoursThisWeek?: number;
  status?: "activo" | "inactivo";
  onClick?: () => void;
  className?: string;
}

export function TechnicianRow({ name, specialty, activeOTs = 0, hoursThisWeek = 0, status = "activo", onClick, className }: TechnicianRowProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "flex items-center justify-between gap-3 px-4 py-3 border-b border-border cursor-pointer hover:bg-muted/50 transition-colors",
        className
      )}
    >
      <div className="flex-1 min-w-0">
        <span className="text-sm font-medium text-foreground">{name}</span>
        {specialty && (
          <p className="text-xs text-muted-foreground mt-0.5">{specialty}</p>
        )}
      </div>
      <div className="flex items-center gap-3 shrink-0">
        {activeOTs > 0 && (
          <span className="text-xs text-muted-foreground">{activeOTs} OT</span>
        )}
        <span className="text-xs text-muted-foreground tabular-nums">{hoursThisWeek}h</span>
        <span className={cn(
          "h-2 w-2 rounded-full",
          status === "activo" ? "bg-success" : "bg-muted-foreground"
        )} />
      </div>
    </div>
  );
}
