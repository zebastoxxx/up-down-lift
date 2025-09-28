import { MobileCard } from "@/components/ui/mobile-card";
import { Building, User, MapPin, Calendar, FileText } from "lucide-react";

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

interface ProjectMobileCardProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
}

export function ProjectMobileCard({ 
  project, 
  onEdit, 
  onDelete 
}: ProjectMobileCardProps) {
  const getStatusVariant = (status: string) => {
    const statusMap = {
      'activo': 'default',
      'completado': 'secondary',
      'planificacion': 'outline',
      'pausado': 'destructive'
    } as const;
    
    return statusMap[status as keyof typeof statusMap] || 'outline';
  };

  const getStatusLabel = (status: string) => {
    const statusMap = {
      'activo': 'Activo',
      'completado': 'Completado',
      'planificacion': 'Planificación',
      'pausado': 'Pausado'
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
      icon: <User className="h-3 w-3" />,
      label: "Cliente",
      value: project.client_name || "-"
    },
    {
      icon: <MapPin className="h-3 w-3" />,
      label: "Ubicación",
      value: project.city || project.location || "-"
    },
    {
      icon: <Calendar className="h-3 w-3" />,
      label: "Inicio",
      value: formatDate(project.start_date)
    },
    {
      icon: <Calendar className="h-3 w-3" />,
      label: "Fin",
      value: formatDate(project.end_date)
    }
  ];

  if (project.description) {
    details.push({
      icon: <FileText className="h-3 w-3" />,
      label: "Descripción",
      value: project.description.length > 30 
        ? `${project.description.substring(0, 30)}...`
        : project.description
    });
  }

  const actions = [
    {
      label: "Editar",
      onClick: () => onEdit(project),
      variant: "outline" as const
    },
    {
      label: "Eliminar",
      onClick: () => onDelete(project),
      variant: "destructive" as const
    }
  ];

  return (
    <MobileCard
      title={project.name}
      subtitle={project.address}
      badge={{
        text: getStatusLabel(project.status),
        variant: getStatusVariant(project.status)
      }}
      icon={<Building className="h-4 w-4" />}
      details={details}
      actions={actions}
    />
  );
}