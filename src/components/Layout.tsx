import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { PWAInstallBanner } from "@/components/ui/pwa-install-banner";
import { useAuth } from "@/contexts/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { LogOut } from "lucide-react";
import { RoleBadge } from "@/components/ui/role-badge";
import { useLocation } from "react-router-dom";

const routeNames: Record<string, string> = {
  "/": "Preoperacionales",
  "/preoperational": "Preoperacionales",
  "/warehouse-inspection": "Bodega",
  "/machines": "Equipos",
  "/clients": "Clientes",
  "/projects": "Proyectos",
  "/settings": "Configuración",
};

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { signOut, user } = useAuth();
  const isMobile = useIsMobile();
  const location = useLocation();
  const moduleName = routeNames[location.pathname] || "";

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header — 48px */}
          <header className="h-12 border-b border-border flex items-center justify-between px-4 sticky top-0 z-40 bg-card">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="-ml-1" />
              {!isMobile && (
                <span className="text-sm font-semibold text-foreground tracking-wide">
                  {moduleName}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {!isMobile && user && <RoleBadge role={user.role} />}
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