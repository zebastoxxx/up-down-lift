import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FluidLevelSelectorProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

const LEVELS = [
  { value: "alto", label: "Alto", color: "bg-green-100 text-green-800 border-green-300" },
  { value: "medio", label: "Medio", color: "bg-yellow-100 text-yellow-800 border-yellow-300" },
  { value: "bajo", label: "Bajo", color: "bg-red-100 text-red-800 border-red-300" }
];

export function FluidLevelSelector({ label, value, onChange }: FluidLevelSelectorProps) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{label}</Label>
      <div className="grid grid-cols-3 gap-2">
        {LEVELS.map((level) => (
          <Button
            key={level.value}
            variant="outline"
            size="sm"
            onClick={() => onChange(level.value)}
            className={cn(
              "h-10 transition-all duration-200",
              value === level.value 
                ? level.color + " border-2" 
                : "hover:bg-accent"
            )}
          >
            {level.label}
          </Button>
        ))}
      </div>
      
      {value === "bajo" && (
        <p className="text-xs text-red-600 flex items-center gap-1">
          ⚠️ Nivel bajo detectado - considere reabastecer
        </p>
      )}
    </div>
  );
}