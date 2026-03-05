import { WifiOff } from "lucide-react";

export function OfflineBanner() {
  return (
    <div className="flex items-center justify-center gap-2 bg-warning text-warning-foreground px-4 py-2 text-sm font-medium">
      <WifiOff className="h-4 w-4" />
      <span>Sin conexión — Los datos se guardarán localmente</span>
    </div>
  );
}
