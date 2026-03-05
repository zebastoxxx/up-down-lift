import {
  Truck,
  Users,
  FolderOpen,
  ClipboardCheck,
  Settings,
  PackageCheck,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import logo from "@/assets/logo.png";

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
  const { hasPermission } = useAuth();

  const getNavClasses = ({ isActive }: { isActive: boolean }) =>
    cn(
      "text-sm font-condensed tracking-wide transition-colors rounded-lg",
      isActive
        ? "text-sidebar-primary font-semibold border-l-2 border-sidebar-primary bg-sidebar-primary/10"
        : "text-sidebar-foreground hover:text-sidebar-primary-foreground hover:bg-sidebar-primary/5"
    );

  const getNavigationItems = () => {
    const items = [];
    items.push({ title: "Preoperacional", url: "/", icon: ClipboardCheck });
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
      <SidebarContent className="bg-sidebar border-r-0">
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-4 py-4 border-b border-sidebar-border">
          <img src={logo} alt="Up & Down Solar" className="h-8 w-8 object-contain" />
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-bold text-sidebar-primary font-condensed tracking-wide uppercase">
              UpDown Solar
            </span>
            <span className="text-[10px] text-sidebar-foreground/50 uppercase tracking-widest">
              Powered by God
            </span>
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] font-bold uppercase tracking-[0.15em] text-sidebar-foreground/40 font-condensed px-4">
            Menú
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end className={getNavClasses}>
                      <item.icon className="h-4 w-4" />
                      <span className="font-condensed">{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {quickActions.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-[10px] font-bold uppercase tracking-[0.15em] text-sidebar-foreground/40 font-condensed px-4">
              Sistema
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {quickActions.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink to={item.url} className={getNavClasses}>
                        <item.icon className="h-4 w-4" />
                        <span className="font-condensed">{item.title}</span>
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
