import { MobileCard } from "@/components/ui/mobile-card";
import { Building2, User, Mail, Phone, MapPin, Calendar } from "lucide-react";

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

interface ClientMobileCardProps {
  client: Client;
  onEdit: (client: Client) => void;
  onDelete: (client: Client) => void;
}

export function ClientMobileCard({ 
  client, 
  onEdit, 
  onDelete 
}: ClientMobileCardProps) {
  const getStatusVariant = (status: string) => {
    return status === "activo" ? "default" : "secondary";
  };

  const getStatusLabel = (status: string) => {
    return status === "activo" ? "Activo" : "Inactivo";
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
      label: "Contacto",
      value: client.contact_person || "-"
    },
    {
      icon: <Mail className="h-3 w-3" />,
      label: "Email",
      value: client.email || "-"
    },
    {
      icon: <Phone className="h-3 w-3" />,
      label: "Teléfono",
      value: client.phone || "-"
    },
    {
      icon: <MapPin className="h-3 w-3" />,
      label: "Ciudad",
      value: client.city || "-"
    },
    {
      icon: <Calendar className="h-3 w-3" />,
      label: "Registro",
      value: formatDate(client.created_at)
    }
  ];

  if (client.tax_id) {
    details.splice(4, 0, {
      icon: <span className="text-xs font-semibold">#</span>,
      label: "NIT/RUT",
      value: client.tax_id
    });
  }

  const actions = [
    {
      label: "Editar",
      onClick: () => onEdit(client),
      variant: "outline" as const
    },
    {
      label: "Eliminar",
      onClick: () => onDelete(client),
      variant: "destructive" as const
    }
  ];

  return (
    <MobileCard
      title={client.name}
      subtitle={client.address}
      badge={{
        text: getStatusLabel(client.status),
        variant: getStatusVariant(client.status)
      }}
      icon={<Building2 className="h-4 w-4" />}
      details={details}
      actions={actions}
    />
  );
}