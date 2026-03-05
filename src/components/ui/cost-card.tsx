import { cn } from "@/lib/utils";

interface CostCardProps {
  label: string;
  value: string | number;
  subtitle?: string;
  trend?: "up" | "down" | "neutral";
  className?: string;
}

export function CostCard({ label, value, subtitle, trend, className }: CostCardProps) {
  return (
    <div className={cn("rounded-lg border border-border bg-card p-3", className)}>
      <p className="text-xs text-muted-foreground font-medium">{label}</p>
      <p className={cn("text-lg font-semibold mt-0.5 font-sans tabular-nums", {
        "text-success": trend === "down",
        "text-destructive": trend === "up",
        "text-foreground": trend === "neutral" || !trend,
      })}>
        {typeof value === "number" ? `$${value.toLocaleString()}` : value}
      </p>
      {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
    </div>
  );
}
