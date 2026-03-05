import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { PWAInstallBanner } from "@/components/ui/pwa-install-banner";
import { useAuth } from "@/contexts/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { signOut, user } = useAuth();
  const isMobile = useIsMobile();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          {/* Slim header — 52px */}
          <header className={cn(
            "h-[52px] border-b border-border flex items-center justify-between px-4 sticky top-0 z-40 bg-card",
          )}>
            <div className="flex items-center gap-3">
              <SidebarTrigger className="-ml-1" />
              {!isMobile && (
                <span className="text-sm font-bold text-foreground font-condensed tracking-wide uppercase">
                  UpDown Solar OS
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {!isMobile && user && (
                <span className="text-xs font-medium text-muted-foreground font-condensed uppercase tracking-wide">
                  {user.role}
                </span>
              )}
              {!isMobile && (
                <span className="text-xs text-muted-foreground">
                  {user?.full_name || user?.username}
                </span>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => signOut()}
                className="h-8 w-8 p-0"
                title="Cerrar Sesión"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </header>

          <PWAInstallBanner />

          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
