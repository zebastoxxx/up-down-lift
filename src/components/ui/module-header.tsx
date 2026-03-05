import { cn } from "@/lib/utils";

interface ModuleHeaderProps {
  action?: React.ReactNode;
  secondaryAction?: React.ReactNode;
  className?: string;
}

export function ModuleHeader({ action, secondaryAction, className }: ModuleHeaderProps) {
  if (!action && !secondaryAction) return null;
  
  return (
    <div className={cn("flex items-center justify-end gap-2", className)}>
      {secondaryAction}
      {action}
    </div>
  );
}