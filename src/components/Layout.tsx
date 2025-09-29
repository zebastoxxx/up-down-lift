import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import logo from "@/assets/logo.png";

interface LayoutProps {
  children: React.ReactNode;
}
export default function Layout({
  children
}: LayoutProps) {
  const handleLogout = async () => {
    console.log("Logout clicked");
  };
  
  return (
    <div className="flex min-h-screen w-full bg-background">
      <div className="flex-1 flex flex-col">
        {/* Simple Header */}
        <header className="h-16 border-b bg-gradient-header flex items-center justify-between px-4 sticky top-0 z-40 bg-background/95 backdrop-blur">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <img src={logo} alt="Up & Down Lift" className="h-8 w-8 object-contain" />
              <div className="flex flex-col">
                <h1 className="text-lg font-semibold">Up & Down Lift</h1>
                <p className="text-xs text-muted-foreground">Sistema de Gestión de Maquinas</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">
              Usuario
            </Badge>
            <Button variant="outline" size="sm" onClick={handleLogout} className="flex items-center gap-2">
              <LogOut className="h-4 w-4" />
              <span>Cerrar Sesión</span>
            </Button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}