import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  className?: string;
  children?: React.ReactNode;
}

export function SectionHeader({ title, className, children }: SectionHeaderProps) {
  return (
    <div className={cn("flex items-center justify-between px-3 py-2 bg-muted/60 border-b border-border", className)}>
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground font-sans">
        {title}
      </h3>
      {children}
    </div>
  );
}
