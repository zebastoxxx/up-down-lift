import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DataTable, createSortableHeader } from "@/components/ui/data-table";
import { AdaptiveDataView } from "@/components/ui/adaptive-data-view";
import { ClientMobileCard } from "@/components/clients/ClientMobileCard";
import { Search, Plus, Filter, Download, Building2 } from "lucide-react";
import { ClientForm } from "@/components/clients/ClientForm";
import { ColumnDef } from "@tanstack/react-table";
import { toast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Client {
  id: string;
  name: string;
  contact_person?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  website?: string;
  tax_id?: string;
  status: string;
  created_at: string;
}

export default function Clients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setClients(data || []);
    } catch (error) {
      console.error('Error fetching clients:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los clientes",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (client: Client) => {
    setSelectedClient(client);
    setIsFormOpen(true);
  };

  const handleDelete = async (client: Client) => {
    try {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', client.id);

      if (error) throw error;
      
      setClients(prev => prev.filter(c => c.id !== client.id));
      toast({
        title: "Éxito",
        description: "Cliente eliminado correctamente"
      });
    } catch (error) {
      console.error('Error deleting client:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el cliente",
        variant: "destructive"
      });
    }
  };

  const handleBulkDelete = async (selectedClients: Client[]) => {
    try {
      const ids = selectedClients.map(c => c.id);
      const { error } = await supabase
        .from('clients')
        .delete()
        .in('id', ids);

      if (error) throw error;
      
      setClients(prev => prev.filter(c => !ids.includes(c.id)));
      toast({
        title: "Éxito",
        description: `${selectedClients.length} clientes eliminados correctamente`
      });
    } catch (error) {
      console.error('Error bulk deleting clients:', error);
      toast({
        title: "Error",
        description: "No se pudieron eliminar los clientes seleccionados",
        variant: "destructive"
      });
    }
  };

  const statusCounts = clients.reduce((acc, client) => {
    acc[client.status] = (acc[client.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.contact_person?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.city?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || client.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleClientCreated = () => {
    fetchClients();
    setIsFormOpen(false);
    setSelectedClient(null);
  };

  const columns: ColumnDef<Client>[] = [
    {
      accessorKey: "name",
      header: createSortableHeader("Nombre"),
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Building2 className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{row.getValue("name")}</span>
        </div>
      ),
    },
    {
      accessorKey: "contact_person",
      header: "Contacto",
      cell: ({ row }) => (
        <div className="text-sm">{row.getValue("contact_person") || "-"}</div>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => (
        <div className="text-sm">{row.getValue("email") || "-"}</div>
      ),
    },
    {
      accessorKey: "phone",
      header: "Teléfono",
      cell: ({ row }) => (
        <div className="text-sm">{row.getValue("phone") || "-"}</div>
      ),
    },
    {
      accessorKey: "city",
      header: "Ciudad",
      cell: ({ row }) => (
        <div className="text-sm">{row.getValue("city") || "-"}</div>
      ),
    },
    {
      accessorKey: "status",
      header: "Estado",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return (
          <Badge variant={status === "activo" ? "default" : "secondary"}>
            {status === "activo" ? "Activo" : "Inactivo"}
          </Badge>
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
    {
      id: "actions",
      header: "Acciones",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleEdit(row.original)}
          >
            Editar
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm">
                Eliminar
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta acción no se puede deshacer. Esto eliminará permanentemente el cliente.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={() => handleDelete(row.original)}>
                  Eliminar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      ),
    },
  ];

  return (
    <div className="container mx-auto p-4 sm:p-6 space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Gestión de Clientes</h1>
          <p className="text-muted-foreground">
            Administra tu cartera de clientes y proyectos
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Cliente
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
                  placeholder="Buscar por nombre, contacto o email..."
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
          Todos ({clients.length})
        </Button>
        <Button
          variant={statusFilter === "activo" ? "default" : "outline"}
          size="sm"
          onClick={() => setStatusFilter("activo")}
        >
          Activos ({statusCounts.activo || 0})
        </Button>
        <Button
          variant={statusFilter === "inactivo" ? "default" : "outline"}
          size="sm"
          onClick={() => setStatusFilter("inactivo")}
        >
          Inactivos ({statusCounts.inactivo || 0})
        </Button>
      </div>

      {/* Data Table */}
      <Card>
        <CardContent className="p-6">
          {isLoading ? (
            <div className="text-center py-8">Cargando clientes...</div>
          ) : (
            <AdaptiveDataView
              columns={columns}
              data={filteredClients}
              searchKey="name"
              searchPlaceholder="Buscar clientes..."
              onEdit={handleEdit}
              onDelete={handleDelete}
              onBulkDelete={handleBulkDelete}
              mobileCardComponent={(client) => (
                <ClientMobileCard
                  client={client}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              )}
              emptyMessage="No se encontraron clientes"
              loading={isLoading}
            />
          )}
        </CardContent>
      </Card>

      {/* Client Form Dialog */}
      <ClientForm 
        open={isFormOpen}
        onOpenChange={(open) => {
          setIsFormOpen(open);
          if (!open) setSelectedClient(null);
        }}
        onClientCreated={handleClientCreated}
        client={selectedClient}
      />
    </div>
  );
}