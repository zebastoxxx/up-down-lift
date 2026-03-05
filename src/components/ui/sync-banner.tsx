import { Check } from "lucide-react";
import { useEffect, useState } from "react";

interface SyncBannerProps {
  count: number;
  onDismiss?: () => void;
}

export function SyncBanner({ count, onDismiss }: SyncBannerProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onDismiss?.();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  if (!visible) return null;

  return (
    <div className="flex items-center justify-center gap-2 bg-success text-success-foreground px-4 py-2 text-sm font-medium">
      <Check className="h-4 w-4" />
      <span>Sincronizado — {count} registro{count !== 1 ? "s" : ""} enviado{count !== 1 ? "s" : ""}</span>
    </div>
  );
}
