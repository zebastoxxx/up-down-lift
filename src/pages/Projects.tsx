import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DataTable, createSortableHeader } from "@/components/ui/data-table";
import { Search, Plus, Filter, Download, Building } from "lucide-react";
import { ProjectForm } from "@/components/projects/ProjectForm";
import { ColumnDef } from "@tanstack/react-table";
import { toast } from "@/hooks/use-toast";

interface Project {
  id: string;
  name: string;
  client_name?: string;
  status: string;
  location?: string;
  city?: string;
  country?: string;
  address?: string;
  start_date?: string;
  end_date?: string;
  description?: string;
  created_at: string;
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          project_clients (
            clients (
              name
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transform data to include client names
      const transformedProjects = data?.map(project => ({
        ...project,
        client_name: project.project_clients?.[0]?.clients?.name || null
      })) || [];
      
      setProjects(transformedProjects);
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los proyectos",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (project: Project) => {
    setSelectedProject(project);
    setIsFormOpen(true);
  };

  const handleDelete = async (project: Project) => {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', project.id);

      if (error) throw error;
      
      setProjects(prev => prev.filter(p => p.id !== project.id));
      toast({
        title: "Éxito",
        description: "Proyecto eliminado correctamente"
      });
    } catch (error) {
      console.error('Error deleting project:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el proyecto",
        variant: "destructive"
      });
    }
  };

  const handleBulkDelete = async (selectedProjects: Project[]) => {
    try {
      const ids = selectedProjects.map(p => p.id);
      const { error } = await supabase
        .from('projects')
        .delete()
        .in('id', ids);

      if (error) throw error;
      
      setProjects(prev => prev.filter(p => !ids.includes(p.id)));
      toast({
        title: "Éxito",
        description: `${selectedProjects.length} proyectos eliminados correctamente`
      });
    } catch (error) {
      console.error('Error bulk deleting projects:', error);
      toast({
        title: "Error",
        description: "No se pudieron eliminar los proyectos seleccionados",
        variant: "destructive"
      });
    }
  };

  const statusCounts = projects.reduce((acc, project) => {
    acc[project.status] = (acc[project.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.client_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.location?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || project.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleProjectCreated = () => {
    fetchProjects();
    setIsFormOpen(false);
    setSelectedProject(null);
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      'activo': { label: 'Activo', variant: 'default' as const },
      'completado': { label: 'Completado', variant: 'secondary' as const },
      'planificacion': { label: 'Planificación', variant: 'outline' as const },
      'pausado': { label: 'Pausado', variant: 'destructive' as const }
    };
    
    const config = statusMap[status as keyof typeof statusMap] || { label: status, variant: 'outline' as const };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const columns: ColumnDef<Project>[] = [
    {
      accessorKey: "name",
      header: createSortableHeader("Nombre"),
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Building className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{row.getValue("name")}</span>
        </div>
      ),
    },
    {
      accessorKey: "client_name",
      header: "Cliente",
      cell: ({ row }) => (
        <div className="text-sm">{row.getValue("client_name") || "-"}</div>
      ),
    },
    {
      accessorKey: "status",
      header: "Estado",
      cell: ({ row }) => getStatusBadge(row.getValue("status")),
    },
    {
      accessorKey: "city",
      header: "Ciudad",
      cell: ({ row }) => (
        <div className="text-sm">{row.getValue("city") || row.original.location || "-"}</div>
      ),
    },
    {
      accessorKey: "start_date",
      header: createSortableHeader("Fecha Inicio"),
      cell: ({ row }) => {
        const date = row.getValue("start_date") as string;
        return (
          <div className="text-sm">
            {date ? new Date(date).toLocaleDateString('es-ES') : "-"}
          </div>
        );
      },
    },
    {
      accessorKey: "end_date",
      header: createSortableHeader("Fecha Fin"),
      cell: ({ row }) => {
        const date = row.getValue("end_date") as string;
        return (
          <div className="text-sm">
            {date ? new Date(date).toLocaleDateString('es-ES') : "-"}
          </div>
        );
      },
    },
    {
      accessorKey: "created_at",
      header: createSortableHeader("Fecha Registro"),
      cell: ({ row }) => {
        const date = row.getValue("created_at") as string;
        return (
          <div className="text-sm">
            {new Date(date).toLocaleDateString('es-ES')}
          </div>
        );
      },
    },
  ];

  return (
    <div className="container mx-auto p-4 sm:p-6 space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Gestión de Proyectos</h1>
          <p className="text-muted-foreground">
            Administra y monitorea todos los proyectos de construcción
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Proyecto
          </Button>
        </div>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar por nombre, cliente o ubicación..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filtros Avanzados
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Status Filter Buttons */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={statusFilter === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setStatusFilter("all")}
        >
          Todos ({projects.length})
        </Button>
        <Button
          variant={statusFilter === "activo" ? "default" : "outline"}
          size="sm"
          onClick={() => setStatusFilter("activo")}
        >
          Activos ({statusCounts.activo || 0})
        </Button>
        <Button
          variant={statusFilter === "completado" ? "default" : "outline"}
          size="sm"
          onClick={() => setStatusFilter("completado")}
        >
          Completados ({statusCounts.completado || 0})
        </Button>
        <Button
          variant={statusFilter === "planificacion" ? "default" : "outline"}
          size="sm"
          onClick={() => setStatusFilter("planificacion")}
        >
          En Planificación ({statusCounts.planificacion || 0})
        </Button>
        <Button
          variant={statusFilter === "pausado" ? "default" : "outline"}
          size="sm"
          onClick={() => setStatusFilter("pausado")}
        >
          Pausados ({statusCounts.pausado || 0})
        </Button>
      </div>

      {/* Data Table */}
      <Card>
        <CardContent className="p-6">
          {isLoading ? (
            <div className="text-center py-8">Cargando proyectos...</div>
          ) : (
            <DataTable
              columns={columns}
              data={filteredProjects}
              searchKey="name"
              searchPlaceholder="Buscar proyectos..."
              onEdit={handleEdit}
              onDelete={handleDelete}
              onBulkDelete={handleBulkDelete}
            />
          )}
        </CardContent>
      </Card>

      {/* Project Form Dialog */}
      <ProjectForm 
        open={isFormOpen}
        onOpenChange={(open) => {
          setIsFormOpen(open);
          if (!open) setSelectedProject(null);
        }}
        onProjectCreated={handleProjectCreated}
        project={selectedProject}
      />
    </div>
  );
}