import {
  Truck,
  Users,
  FolderOpen,
  ClipboardCheck,
  Settings,
  BarChart3,
  PackageCheck,
  Wrench,
  DollarSign,
  HardHat,
  LayoutDashboard,
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function AppSidebar() {
  const { user, hasPermission } = useAuth();
  const location = useLocation();

  const getNavClasses = ({ isActive }: { isActive: boolean }) =>
    cn(
      "text-sm",
      isActive
        ? "bg-primary text-primary-foreground font-medium"
        : "hover:bg-muted text-sidebar-foreground"
    );

  const getNavigationItems = () => {
    const items = [];

    // Preoperational — all users
    items.push({ title: "Preoperacional", url: "/", icon: ClipboardCheck });

    // Supervisor + Admin items
    if (hasPermission("supervisor")) {
      items.push(
        { title: "Bodega", url: "/warehouse-inspection", icon: PackageCheck },
        { title: "Equipos", url: "/machines", icon: Truck },
        { title: "Clientes", url: "/clients", icon: Users },
        { title: "Proyectos", url: "/projects", icon: FolderOpen }
      );
    }

    return items;
  };

  const getQuickActions = () => {
    const items = [];
    if (hasPermission("administrador")) {
      items.push({ title: "Configuración", url: "/settings", icon: Settings });
    }
    return items;
  };

  const navigationItems = getNavigationItems();
  const quickActions = getQuickActions();

  return (
    <Sidebar collapsible="icon">
      <SidebarContent className="bg-card border-r-0">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground font-sans">
            Menú
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end className={getNavClasses}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {quickActions.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground font-sans">
              Sistema
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {quickActions.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink to={item.url} className={getNavClasses}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
