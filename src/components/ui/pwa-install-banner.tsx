import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, X } from "lucide-react";
import { usePWAInstall } from "@/hooks/usePWAInstall";
import { useIsMobile } from "@/hooks/use-mobile";

export function PWAInstallBanner() {
  const { isInstallable, installApp } = usePWAInstall();
  const isMobile = useIsMobile();
  const [isDismissed, setIsDismissed] = useState(false);

  if (!isInstallable || isDismissed || !isMobile) {
    return null;
  }

  const handleInstall = async () => {
    const success = await installApp();
    if (success) {
      setIsDismissed(true);
    }
  };

  return (
    <Card className="mx-4 mb-4 border-primary/20 bg-primary/5">
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="bg-primary/10 p-2 rounded-lg">
              <Download className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-sm">Instalar App</h3>
              <p className="text-xs text-muted-foreground">
                Añade Up Down Lift a tu pantalla de inicio
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleInstall}
              className="text-xs h-8"
            >
              Instalar
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsDismissed(true)}
              className="h-8 w-8 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}