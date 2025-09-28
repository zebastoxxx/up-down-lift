import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Settings, ArrowLeft, Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
interface Machine {
  id: string;
  name: string;
  model: string;
  brand: string;
  current_hours: number;
  status: string;
  serial_number?: string;
  location?: string;
}
interface MachineSelectorProps {
  projectId: string;
  onMachineSelect: (machine: Machine) => void;
  selectedMachine: Machine | null;
  onBack: () => void;
}
export function MachineSelector({
  projectId,
  onMachineSelect,
  selectedMachine,
  onBack
}: MachineSelectorProps) {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [filteredMachines, setFilteredMachines] = useState<Machine[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    if (projectId) {
      fetchMachines();
    }
  }, [projectId]);
  useEffect(() => {
    const filtered = machines.filter(machine => machine.name.toLowerCase().includes(searchTerm.toLowerCase()) || machine.model?.toLowerCase().includes(searchTerm.toLowerCase()) || machine.brand?.toLowerCase().includes(searchTerm.toLowerCase()));
    setFilteredMachines(filtered);
  }, [machines, searchTerm]);
  const fetchMachines = async () => {
    try {
      const {
        data,
        error
      } = await supabase.from('project_machines').select(`
          machine_id,
          machines (
            id,
            name,
            model,
            brand,
            current_hours,
            status,
            serial_number,
            location
          )
        `).eq('project_id', projectId);
      if (error) throw error;
      const machineData = data?.map(item => item.machines).filter(Boolean) || [];
      setMachines(machineData as Machine[]);
    } catch (error) {
      console.error('Error fetching machines:', error);
    } finally {
      setIsLoading(false);
    }
  };
  const getStatusBadge = (status: string) => {
    const variants = {
      operativo: "default",
      mantenimiento: "secondary",
      reparacion: "destructive",
      fuera_servicio: "outline"
    } as const;
    const colors = {
      operativo: "bg-green-100 text-green-800",
      mantenimiento: "bg-yellow-100 text-yellow-800",
      reparacion: "bg-red-100 text-red-800",
      fuera_servicio: "bg-gray-100 text-gray-800"
    } as const;
    return <Badge variant={variants[status as keyof typeof variants] || "outline"} className={colors[status as keyof typeof colors] || ""}>
        {status.replace('_', ' ')}
      </Badge>;
  };
  const formatHours = (hours: number) => {
    return new Intl.NumberFormat('es-ES', {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1
    }).format(hours);
  };
  if (isLoading) {
    return <div className="space-y-4 p-4">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
        <div className="space-y-3">
          {[1, 2, 3].map(i => <Card key={i}>
              <CardContent className="p-4">
                <Skeleton className="h-5 w-48 mb-2" />
                <Skeleton className="h-4 w-32 mb-2" />
                <Skeleton className="h-4 w-24" />
              </CardContent>
            </Card>)}
        </div>
      </div>;
  }
  return <div className="space-y-4 p-4">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Seleccionar Máquina
              </CardTitle>
              <CardDescription>
                Elija la máquina para realizar el preoperacional
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        
      </Card>

      <div className="space-y-3">
        {filteredMachines.length === 0 ? <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">
                {searchTerm ? "No se encontraron máquinas" : "No hay máquinas asignadas a este proyecto"}
              </p>
            </CardContent>
          </Card> : filteredMachines.map(machine => <Card key={machine.id} className={`cursor-pointer transition-colors hover:bg-accent ${selectedMachine?.id === machine.id ? 'ring-2 ring-primary' : ''}`} onClick={() => onMachineSelect(machine)}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-lg">{machine.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {machine.brand} {machine.model}
                    </p>
                  </div>
                  {getStatusBadge(machine.status)}
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Horómetro:</span>
                    <span className="font-medium">{formatHours(machine.current_hours || 0)}h</span>
                  </div>
                  
                  {machine.serial_number && <div>
                      <span className="text-muted-foreground">Serie:</span>
                      <span className="font-medium ml-1">{machine.serial_number}</span>
                    </div>}
                </div>

                {machine.location && <p className="text-sm text-muted-foreground mt-2">
                    Ubicación: {machine.location}
                  </p>}
              </CardContent>
            </Card>)}
      </div>

      {selectedMachine && <div className="fixed bottom-4 left-4 right-4 max-w-2xl mx-auto">
          <Card className="border-primary shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Máquina seleccionada:</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedMachine.name} - {formatHours(selectedMachine.current_hours || 0)}h
                  </p>
                </div>
                <Button onClick={() => onMachineSelect(selectedMachine)} className="bg-yellow-500 hover:bg-yellow-600 text-black">
                  Continuar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>}
    </div>;
}