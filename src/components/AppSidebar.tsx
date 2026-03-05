import {
  Truck,
  Users,
  FolderOpen,
  ClipboardCheck,
  Settings,
  PackageCheck,
  BarChart3,
  TrendingUp,
  Factory,
  HardHat,
  Wrench,
  Package,
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
  const { hasPermission, user } = useAuth();

  const getNavClasses = ({ isActive }: { isActive: boolean }) =>
    cn(
      "text-sm font-medium tracking-wide transition-colors rounded-md",
      isActive
        ? "text-sidebar-primary-foreground font-semibold border-l-2 border-sidebar-primary bg-sidebar-primary/15"
        : "text-sidebar-foreground hover:text-sidebar-primary-foreground hover:bg-white/5"
    );

  const getNavigationItems = () => {
    const items = [];
    items.push({ title: "Preoperacionales", url: "/", icon: ClipboardCheck });
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

  const getSystemItems = () => {
    const items = [];
    if (hasPermission("administrador")) {
      items.push({ title: "Configuración", url: "/settings", icon: Settings });
    }
    return items;
  };

  const navigationItems = getNavigationItems();
  const systemItems = getSystemItems();

  return (
    <Sidebar collapsible="icon">
      <SidebarContent className="bg-sidebar border-r-0 flex flex-col">
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-4 py-4 border-b border-sidebar-border">
          <img src={logo} alt="Up & Down Solar" className="h-8 w-8 object-contain" />
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-bold text-white tracking-wide uppercase">
              UpDown Solar
            </span>
            <span className="text-[10px] text-sidebar-foreground/50 uppercase tracking-widest">
              Powered by God
            </span>
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] font-bold uppercase tracking-[0.15em] text-sidebar-foreground/40 px-4">
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

        {systemItems.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-[10px] font-bold uppercase tracking-[0.15em] text-sidebar-foreground/40 px-4">
              Sistema
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {systemItems.map((item) => (
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

        {/* Footer */}
        <div className="mt-auto border-t border-sidebar-border px-4 py-3 group-data-[collapsible=icon]:hidden">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-full bg-sidebar-primary/20 flex items-center justify-center text-xs font-bold text-sidebar-primary">
              {user?.full_name?.charAt(0) || user?.username?.charAt(0) || "U"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-white truncate">{user?.full_name || user?.username}</p>
              <p className="text-[10px] text-sidebar-foreground/50 uppercase">{user?.role}</p>
            </div>
          </div>
          <p className="text-[9px] text-sidebar-foreground/30 mt-2">v1.0.0</p>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}