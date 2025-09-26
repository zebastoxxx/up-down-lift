import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Camera, Upload, X, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Photo {
  type: string;
  file: File;
  preview: string;
  caption?: string;
}

interface PhotoCaptureProps {
  photos: Photo[];
  onPhotoAdd: (photo: Photo) => void;
  onPhotoRemove: (index: number) => void;
}

const PHOTO_TYPES = [
  { value: "general", label: "General" },
  { value: "manguera", label: "Mangueras" },
  { value: "llanta", label: "Llantas/Orugas" },
  { value: "luz", label: "Luces" },
  { value: "fuga", label: "Fugas" },
  { value: "rodamiento", label: "Rodamientos" },
  { value: "tablero", label: "Tablero/Alertas" },
  { value: "lugar", label: "Lugar de trabajo" }
];

export function PhotoCapture({ photos, onPhotoAdd, onPhotoRemove }: PhotoCaptureProps) {
  const [selectedType, setSelectedType] = useState("general");
  const [currentCaption, setCurrentCaption] = useState("");
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const compressImage = (file: File, maxSizeMB: number = 3): Promise<File> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        // Calculate new dimensions (max 1920px)
        const maxWidth = 1920;
        const maxHeight = 1920;
        let { width, height } = img;
        
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Draw and compress
        ctx?.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now()
              });
              resolve(compressedFile);
            } else {
              resolve(file);
            }
          },
          'image/jpeg',
          0.8 // 80% quality
        );
      };
      
      img.src = URL.createObjectURL(file);
    });
  };

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    const file = files[0];
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Archivo no válido",
        description: "Solo se permiten archivos de imagen",
        variant: "destructive"
      });
      return;
    }
    
    // Validate file size (20MB max)
    if (file.size > 20 * 1024 * 1024) {
      toast({
        title: "Archivo muy grande",
        description: "El archivo no debe exceder 20MB",
        variant: "destructive"
      });
      return;
    }

    try {
      // Compress image
      const compressedFile = await compressImage(file);
      
      // Create preview
      const preview = URL.createObjectURL(compressedFile);
      
      const photo: Photo = {
        type: selectedType,
        file: compressedFile,
        preview,
        caption: currentCaption || undefined
      };
      
      onPhotoAdd(photo);
      setCurrentCaption("");
      
      toast({
        title: "Foto agregada",
        description: `Foto ${selectedType} agregada correctamente`,
        variant: "default"
      });
      
    } catch (error) {
      console.error('Error processing image:', error);
      toast({
        title: "Error",
        description: "No se pudo procesar la imagen",
        variant: "destructive"
      });
    }
  };

  const handleCameraCapture = () => {
    cameraInputRef.current?.click();
  };

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const removePhoto = (index: number) => {
    // Revoke object URL to prevent memory leaks
    URL.revokeObjectURL(photos[index].preview);
    onPhotoRemove(index);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="h-5 w-5" />
          Fotos y Evidencias
          {photos.length > 0 && (
            <span className="ml-auto text-sm font-normal text-muted-foreground">
              {photos.length} foto{photos.length !== 1 ? 's' : ''}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Photo Type Selection */}
        <div className="space-y-2">
          <Label>Tipo de Foto</Label>
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PHOTO_TYPES.map(type => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Caption */}
        <div className="space-y-2">
          <Label htmlFor="photo-caption">Descripción (Opcional)</Label>
          <Input
            id="photo-caption"
            placeholder="Describa lo que muestra la foto..."
            value={currentCaption}
            onChange={(e) => setCurrentCaption(e.target.value)}
          />
        </div>

        {/* Capture Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            onClick={handleCameraCapture}
            className="h-12"
          >
            <Camera className="h-5 w-5 mr-2" />
            Tomar Foto
          </Button>
          <Button
            variant="outline"
            onClick={handleFileUpload}
            className="h-12"
          >
            <Upload className="h-5 w-5 mr-2" />
            Subir Archivo
          </Button>
        </div>

        {/* Hidden File Inputs */}
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
        />
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
        />

        {/* Photo Grid */}
        {photos.length > 0 && (
          <div className="space-y-3">
            <Label>Fotos Capturadas</Label>
            <div className="grid grid-cols-2 gap-3">
              {photos.map((photo, index) => (
                <div key={index} className="relative group">
                  <div className="aspect-square rounded-lg overflow-hidden border bg-muted">
                    <img
                      src={photo.preview}
                      alt={`Foto ${photo.type}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Photo Info Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-2 text-xs">
                    <p className="font-medium capitalize">
                      {PHOTO_TYPES.find(t => t.value === photo.type)?.label}
                    </p>
                    {photo.caption && (
                      <p className="truncate">{photo.caption}</p>
                    )}
                  </div>
                  
                  {/* Remove Button */}
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removePhoto(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Info Note */}
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-sm text-blue-800">
            💡 Las fotos se comprimen automáticamente para optimizar el almacenamiento y velocidad de sincronización.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}