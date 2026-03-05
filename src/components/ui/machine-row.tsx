import { StatusBadge } from "@/components/ui/status-badge";
import { cn } from "@/lib/utils";

interface MachineRowProps {
  code: string;
  name: string;
  type?: string;
  location?: string;
  status: "activo" | "en_mantenimiento" | "disponible" | "fuera_servicio";
  hours?: number;
  onClick?: () => void;
  className?: string;
}

export function MachineRow({ code, name, type, location, status, hours, onClick, className }: MachineRowProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "flex items-center justify-between gap-3 px-4 py-3 border-b border-border cursor-pointer hover:bg-muted/50 transition-colors",
        className
      )}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground truncate">{name}</span>
          <span className="text-xs text-muted-foreground">{code}</span>
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          {type && <span className="text-xs text-muted-foreground">{type}</span>}
          {location && (
            <>
              <span className="text-xs text-muted-foreground">·</span>
              <span className="text-xs text-muted-foreground truncate">{location}</span>
            </>
          )}
        </div>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        {hours !== undefined && (
          <span className="text-xs text-muted-foreground tabular-nums">{hours}h</span>
        )}
        <StatusBadge status={status} />
      </div>
    </div>
  );
}
