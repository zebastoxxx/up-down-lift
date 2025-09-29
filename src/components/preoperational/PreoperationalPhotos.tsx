import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Image as ImageIcon, Eye, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface PreoperationalPhoto {
  id: string;
  url: string;
  photo_type: string;
  caption: string | null;
  created_at: string;
}

interface PreoperationalPhotosProps {
  preoperationalId: string;
}

const PHOTO_CATEGORIES = [
  { value: "general", label: "General" },
  { value: "problema_llantas", label: "Problema de Llantas" },
  { value: "problema_luces", label: "Problema de Luces" },
  { value: "problema_mangueras", label: "Problema de Mangueras" },
  { value: "nivel_fluidos", label: "Nivel de Fluidos" },
  { value: "mantenimiento", label: "Mantenimiento" },
];

export function PreoperationalPhotos({ preoperationalId }: PreoperationalPhotosProps) {
  const { user, hasPermission } = useAuth();
  const [photos, setPhotos] = useState<PreoperationalPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState<PreoperationalPhoto | null>(null);

  // Only show photos to admin users
  if (!hasPermission('administrador')) {
    return null;
  }

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const { data, error } = await supabase
          .from('preoperational_photos')
          .select('*')
          .eq('preoperational_id', preoperationalId)
          .order('created_at', { ascending: true });

        if (error) {
          console.error('Error fetching photos:', error);
        } else {
          setPhotos(data || []);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPhotos();
  }, [preoperationalId]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Fotos del Preoperacional
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground">Cargando fotos...</div>
        </CardContent>
      </Card>
    );
  }

  if (photos.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Fotos del Preoperacional
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground">No hay fotos disponibles</div>
        </CardContent>
      </Card>
    );
  }

  const getCategoryLabel = (categoryValue: string) => {
    return PHOTO_CATEGORIES.find(cat => cat.value === categoryValue)?.label || categoryValue;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="h-5 w-5" />
          Fotos del Preoperacional
          <Badge variant="secondary">{photos.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.map((photo) => (
            <div key={photo.id} className="relative group">
              <div className="aspect-square rounded-lg overflow-hidden border bg-muted cursor-pointer">
                <img
                  src={photo.url}
                  alt={photo.caption || `Foto ${photo.photo_type}`}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              
              {/* Category Badge */}
              <Badge 
                variant="outline" 
                className="absolute bottom-2 left-2 text-xs bg-black/70 text-white border-white/20"
              >
                {getCategoryLabel(photo.photo_type)}
              </Badge>
              
              {/* View Button */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl">
                  <DialogHeader>
                    <DialogTitle>
                      {getCategoryLabel(photo.photo_type)}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="flex justify-center">
                    <img
                      src={photo.url}
                      alt={photo.caption || `Foto ${photo.photo_type}`}
                      className="max-w-full max-h-[70vh] object-contain rounded-lg"
                    />
                  </div>
                  {photo.caption && (
                    <div className="text-sm text-muted-foreground text-center">
                      {photo.caption}
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}