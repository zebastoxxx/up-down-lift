import { cn } from "@/lib/utils";
import { AlertTriangle } from "lucide-react";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";

type ItemValue = "B" | "M" | "NA" | null;

interface PreopItemRowProps {
  id: string;
  label: string;
  critical?: boolean;
  value: ItemValue;
  observation?: string;
  onChange: (id: string, value: ItemValue) => void;
  onObservationChange?: (id: string, text: string) => void;
}

export function PreopItemRow({
  id,
  label,
  critical = false,
  value,
  observation,
  onChange,
  onObservationChange,
}: PreopItemRowProps) {
  const [showObs, setShowObs] = useState(value === "M");

  const handleChange = (v: ItemValue) => {
    onChange(id, v);
    if (v === "M") setShowObs(true);
    else setShowObs(false);
  };

  return (
    <div className="border-b border-border last:border-0">
      <div className="flex items-center justify-between gap-2 py-2 px-3">
        <span className={cn("text-sm flex-1", critical && "font-medium")}>
          {critical && <span className="text-destructive mr-1">*</span>}
          {label}
        </span>
        <div className="flex gap-1 shrink-0">
          <button
            type="button"
            onClick={() => handleChange("B")}
            className={cn(
              "h-8 w-8 rounded text-xs font-semibold border transition-colors",
              value === "B"
                ? "bg-success text-success-foreground border-success"
                : "bg-card text-muted-foreground border-border hover:border-success"
            )}
          >
            B
          </button>
          <button
            type="button"
            onClick={() => handleChange("M")}
            className={cn(
              "h-8 w-8 rounded text-xs font-semibold border transition-colors",
              value === "M"
                ? "bg-destructive text-destructive-foreground border-destructive"
                : "bg-card text-muted-foreground border-border hover:border-destructive"
            )}
          >
            M
          </button>
          <button
            type="button"
            onClick={() => handleChange("NA")}
            className={cn(
              "h-8 w-8 rounded text-xs font-semibold border transition-colors",
              value === "NA"
                ? "bg-muted text-foreground border-foreground/20"
                : "bg-card text-muted-foreground border-border hover:border-foreground/30"
            )}
          >
            N/A
          </button>
        </div>
      </div>

      {value === "M" && critical && (
        <div className="flex items-start gap-2 px-3 pb-2">
          <AlertTriangle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
          <p className="text-xs text-destructive font-medium">
            Este punto crítico INHABILITA el equipo para operar. Notificar a supervisor inmediatamente.
          </p>
        </div>
      )}

      {showObs && (
        <div className="px-3 pb-2">
          <Textarea
            placeholder="Observación..."
            value={observation || ""}
            onChange={(e) => onObservationChange?.(id, e.target.value)}
            className="text-sm h-16 resize-none"
          />
        </div>
      )}
    </div>
  );
}
