import { MobileCard } from "@/components/ui/mobile-card";
import { User, Calendar, Shield, AlertCircle, CheckCircle } from "lucide-react";

interface User {
  id: string;
  username: string;
  full_name: string | null;
  role: string;
  status: string;
  created_at: string;
}

interface UserMobileCardProps {
  user: User;
  onView: (user: User) => void;
  onDelete: (user: User) => void;
}

export function UserMobileCard({ 
  user, 
  onView, 
  onDelete 
}: UserMobileCardProps) {
  const getRoleVariant = (role: string) => {
    const roleMap = {
      'administrador': 'default',
      'supervisor': 'secondary',
      'operario': 'outline'
    } as const;
    
    return roleMap[role as keyof typeof roleMap] || 'outline';
  };

  const getRoleLabel = (role: string) => {
    const roleMap = {
      'administrador': 'Administrador',
      'supervisor': 'Supervisor',
      'operario': 'Operario'
    };
    
    return roleMap[role as keyof typeof roleMap] || role;
  };

  const getStatusVariant = (status: string) => {
    return status === 'activo' ? 'default' : 'destructive';
  };

  const getStatusLabel = (status: string) => {
    return status === 'activo' ? 'Activo' : 'Inactivo';
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('es-ES');
    } catch {
      return dateString;
    }
  };

  const details = [
    {
      icon: <User className="h-3 w-3" />,
      label: "Usuario",
      value: user.username
    },
    {
      icon: <User className="h-3 w-3" />,
      label: "Nombre",
      value: user.full_name || "-"
    },
    {
      icon: <Shield className="h-3 w-3" />,
      label: "Rol",
      value: getRoleLabel(user.role)
    },
    {
      icon: user.status === 'activo' ? <CheckCircle className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />,
      label: "Estado",
      value: getStatusLabel(user.status)
    },
    {
      icon: <Calendar className="h-3 w-3" />,
      label: "Creado",
      value: formatDate(user.created_at)
    }
  ];

  const actions = [
    {
      label: "Ver Detalles",
      onClick: () => onView(user),
      variant: "outline" as const
    },
    {
      label: "Eliminar",
      onClick: () => onDelete(user),
      variant: "destructive" as const
    }
  ];

  return (
    <MobileCard
      title={user.full_name || user.username}
      subtitle={`@${user.username}`}
      badge={{
        text: getRoleLabel(user.role),
        variant: getRoleVariant(user.role)
      }}
      icon={<User className="h-4 w-4" />}
      details={details}
      actions={actions}
    />
  );
}