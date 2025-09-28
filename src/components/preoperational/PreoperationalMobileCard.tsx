import { MobileCard } from "@/components/ui/mobile-card";
import { ClipboardCheck, Calendar, User, Wrench, Building } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface PreoperationalRecord {
  id: string;
  datetime: string;
  username?: string;
  machines?: { name: string };
  projects?: { name: string };
  oil_level?: string;
  fuel_level?: string;
  is_synced?: boolean;
  observations?: string;
}

interface PreoperationalMobileCardProps {
  record: PreoperationalRecord;
  onView: (record: PreoperationalRecord) => void;
  onEdit?: (record: PreoperationalRecord) => void;
}

export function PreoperationalMobileCard({ 
  record, 
  onView, 
  onEdit 
}: PreoperationalMobileCardProps) {
  const formatDateTime = (datetime: string) => {
    try {
      return format(new Date(datetime), 'dd/MM/yyyy HH:mm');
    } catch {
      return datetime;
    }
  };

  const getLevelBadge = (level?: string) => {
    const levelMap = {
      'alto': { variant: 'default' as const, text: 'Alto' },
      'medio': { variant: 'secondary' as const, text: 'Medio' },
      'bajo': { variant: 'destructive' as const, text: 'Bajo' }
    };
    
    const config = levelMap[level as keyof typeof levelMap];
    return config ? (
      <Badge variant={config.variant} className="text-xs">
        {config.text}
      </Badge>
    ) : (
      <span className="text-xs text-muted-foreground">-</span>
    );
  };

  const getSyncStatus = (synced?: boolean) => {
    return synced ? (
      <Badge variant="default" className="text-xs">Sincronizado</Badge>
    ) : (
      <Badge variant="outline" className="text-xs">Pendiente</Badge>
    );
  };

  const details = [
    {
      icon: <User className="h-3 w-3" />,
      label: "Operador",
      value: record.username || "Sin asignar"
    },
    {
      icon: <Wrench className="h-3 w-3" />,
      label: "Máquina", 
      value: record.machines?.name || "Sin máquina"
    },
    {
      icon: <Building className="h-3 w-3" />,
      label: "Proyecto",
      value: record.projects?.name || "Sin proyecto"
    },
    {
      icon: <span className="text-xs font-semibold">🛢️</span>,
      label: "Aceite",
      value: getLevelBadge(record.oil_level)
    },
    {
      icon: <span className="text-xs font-semibold">⛽</span>,
      label: "Combustible", 
      value: getLevelBadge(record.fuel_level)
    }
  ];

  if (record.observations) {
    details.push({
      icon: <ClipboardCheck className="h-3 w-3" />,
      label: "Observaciones",
      value: record.observations.length > 30 
        ? `${record.observations.substring(0, 30)}...`
        : record.observations
    });
  }

  const actions = [
    {
      label: "Ver Detalles",
      onClick: () => onView(record),
      variant: "outline" as const
    }
  ];

  if (onEdit) {
    actions.push({
      label: "Editar",
      onClick: () => onEdit(record),
      variant: "outline" as const
    });
  }

  return (
    <MobileCard
      title={`Inspección ${record.id.slice(-6)}`}
      subtitle={formatDateTime(record.datetime)}
      badge={{
        text: record.is_synced ? "Sincronizado" : "Pendiente",
        variant: record.is_synced ? "default" : "outline"
      }}
      icon={<ClipboardCheck className="h-4 w-4" />}
      details={details}
      actions={actions}
    />
  );
}