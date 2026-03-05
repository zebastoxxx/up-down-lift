import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  trend?: string;
  icon?: LucideIcon;
  className?: string;
}

export function StatCard({ title, value, trend, icon: Icon, className }: StatCardProps) {
  return (
    <div className={cn(
      "flex items-center gap-3 rounded-md border bg-card p-4 h-20",
      className
    )}>
      {Icon && (
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary-light">
          <Icon className="h-5 w-5 text-primary" />
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="text-xs text-muted-foreground truncate">{title}</p>
        <p className="text-xl font-display font-bold text-foreground">{value}</p>
      </div>
      {trend && (
        <span className="text-xs font-medium text-primary">{trend}</span>
      )}
    </div>
  );
}