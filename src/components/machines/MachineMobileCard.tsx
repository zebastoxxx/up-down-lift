import { MobileCard } from "@/components/ui/mobile-card";
import { Truck, MapPin, Gauge, Calendar, User, Building } from "lucide-react";

interface Machine {
  id: string;
  name: string;
  model?: string;
  serial_number?: string;
  status: string;
  location?: string;
  project?: string;
  operator?: string;
  hourometer?: number;
  fuel_level?: number;
  last_inspection?: string;
  next_maintenance?: string;
}

interface MachineMobileCardProps {
  machine: Machine;
  onViewDetails: (machine: Machine) => void;
  onStartInspection: (machine: Machine) => void;
}

export function MachineMobileCard({ 
  machine, 
  onViewDetails, 
  onStartInspection 
}: MachineMobileCardProps) {
  const getStatusVariant = (status: string) => {
    const statusMap = {
      'operacional': 'default',
      'mantenimiento': 'secondary', 
      'fuera_servicio': 'destructive',
      'inspeccion': 'outline'
    } as const;
    
    return statusMap[status as keyof typeof statusMap] || 'outline';
  };

  const getStatusLabel = (status: string) => {
    const statusMap = {
      'operacional': 'Operacional',
      'mantenimiento': 'Mantenimiento',
      'fuera_servicio': 'Fuera de Servicio', 
      'inspeccion': 'Inspección'
    };
    
    return statusMap[status as keyof typeof statusMap] || status;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    try {
      return new Date(dateString).toLocaleDateString('es-ES');
    } catch {
      return dateString;
    }
  };

  const details = [
    {
      icon: <Truck className="h-3 w-3" />,
      label: "Modelo",
      value: machine.model || "-"
    },
    {
      icon: <MapPin className="h-3 w-3" />,
      label: "Ubicación",
      value: machine.location || "-"
    },
    {
      icon: <Building className="h-3 w-3" />,
      label: "Proyecto",
      value: machine.project || "-"
    },
    {
      icon: <User className="h-3 w-3" />,
      label: "Operador",
      value: machine.operator || "-"
    },
    {
      icon: <Gauge className="h-3 w-3" />,
      label: "Horómetro",
      value: machine.hourometer ? `${machine.hourometer} hrs` : "-"
    },
    {
      icon: <span className="text-xs font-semibold">⛽</span>,
      label: "Combustible",
      value: machine.fuel_level ? `${machine.fuel_level}%` : "-"
    },
    {
      icon: <Calendar className="h-3 w-3" />,
      label: "Últ. Inspección",
      value: formatDate(machine.last_inspection)
    }
  ];

  if (machine.next_maintenance) {
    details.push({
      icon: <Calendar className="h-3 w-3" />,
      label: "Próx. Mant.",
      value: formatDate(machine.next_maintenance)
    });
  }

  const actions = [
    {
      label: "Ver Detalles",
      onClick: () => onViewDetails(machine),
      variant: "outline" as const
    },
    {
      label: "Inspección",
      onClick: () => onStartInspection(machine),
      variant: "default" as const
    }
  ];

  return (
    <MobileCard
      title={machine.name}
      subtitle={machine.serial_number}
      badge={{
        text: getStatusLabel(machine.status),
        variant: getStatusVariant(machine.status)
      }}
      icon={<Truck className="h-4 w-4" />}
      details={details}
      actions={actions}
    />
  );
}