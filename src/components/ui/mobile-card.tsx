import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface MobileCardProps {
  title: string;
  subtitle?: string;
  badge?: {
    text: string;
    variant?: "default" | "secondary" | "destructive" | "outline";
  };
  icon?: ReactNode;
  details: Array<{
    icon?: ReactNode;
    label: string;
    value: string | ReactNode;
  }>;
  actions?: Array<{
    label: string;
    onClick: () => void;
    variant?: "default" | "outline" | "destructive" | "secondary";
    size?: "sm" | "default";
  }>;
  className?: string;
  onClick?: () => void;
}

export function MobileCard({
  title,
  subtitle,
  badge,
  icon,
  details,
  actions = [],
  className,
  onClick
}: MobileCardProps) {
  return (
    <Card 
      className={cn(
        "hover:shadow-md transition-shadow cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {icon && (
              <div className="text-muted-foreground flex-shrink-0">
                {icon}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-sm leading-tight truncate">
                {title}
              </h3>
              {subtitle && (
                <p className="text-xs text-muted-foreground truncate">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          {badge && (
            <Badge 
              variant={badge.variant || "default"}
              className="text-xs flex-shrink-0 ml-2"
            >
              {badge.text}
            </Badge>
          )}
        </div>

        {/* Details */}
        {details.length > 0 && (
          <div className="space-y-2 mb-3">
            {details.map((detail, index) => (
              <div key={index} className="flex items-center gap-2 text-xs">
                {detail.icon && (
                  <div className="text-muted-foreground flex-shrink-0">
                    {detail.icon}
                  </div>
                )}
                <span className="text-muted-foreground whitespace-nowrap">
                  {detail.label}:
                </span>
                <span className="truncate flex-1 font-medium">
                  {detail.value}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        {actions.length > 0 && (
          <div className="flex gap-2 pt-2 border-t">
            {actions.map((action, index) => (
              <Button
                key={index}
                variant={action.variant || "outline"}
                size={action.size || "sm"}
                className="flex-1 text-xs h-8"
                onClick={(e) => {
                  e.stopPropagation();
                  action.onClick();
                }}
              >
                {action.label}
              </Button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}