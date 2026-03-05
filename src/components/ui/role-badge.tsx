import { cn } from "@/lib/utils";

type UserRole = "superadmin" | "gerente" | "supervisor" | "tecnico" | "operario" | "administrador";

const roleConfig: Record<UserRole, { label: string; classes: string }> = {
  superadmin: { label: "Super Admin", classes: "bg-foreground text-background" },
  administrador: { label: "Administrador", classes: "bg-foreground text-background" },
  gerente: { label: "Gerente", classes: "bg-primary text-primary-foreground" },
  supervisor: { label: "Supervisor", classes: "bg-primary-mid text-primary-foreground" },
  tecnico: { label: "Técnico", classes: "bg-info-bg text-info" },
  operario: { label: "Operario", classes: "bg-muted text-muted-foreground border border-border" },
};

interface RoleBadgeProps {
  role: string;
  className?: string;
}

export function RoleBadge({ role, className }: RoleBadgeProps) {
  const config = roleConfig[role as UserRole] || { label: role, classes: "bg-muted text-muted-foreground" };
  return (
    <span className={cn(
      "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
      config.classes,
      className
    )}>
      {config.label}
    </span>
  );
}