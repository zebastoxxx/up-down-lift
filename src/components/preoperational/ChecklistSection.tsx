import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CheckSquare, AlertCircle } from "lucide-react";

interface ChecklistItem {
  key: string;
  label: string;
}

interface ChecklistSectionProps {
  items: ChecklistItem[];
  checklist: Record<string, { checked: boolean; comment: string }>;
  onChange: (key: string, field: 'checked' | 'comment', value: boolean | string) => void;
}

export function ChecklistSection({ items, checklist, onChange }: ChecklistSectionProps) {
  const checkedCount = Object.values(checklist).filter(item => item.checked).length;
  const totalCount = items.length;
  const completionPercentage = totalCount > 0 ? Math.round((checkedCount / totalCount) * 100) : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckSquare className="h-5 w-5" />
          Lista de Verificación
          <div className="ml-auto flex items-center gap-2">
            <span className="text-sm font-normal text-muted-foreground">
              {checkedCount}/{totalCount}
            </span>
            <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-green-500 transition-all duration-300"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.map((item) => {
          const itemData = checklist[item.key] || { checked: false, comment: "" };
          
          return (
            <div key={item.key} className="space-y-2 p-3 rounded-lg border">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id={`checklist-${item.key}`}
                  checked={itemData.checked}
                  onCheckedChange={(checked) => 
                    onChange(item.key, 'checked', checked as boolean)
                  }
                  className="mt-0.5"
                />
                <Label 
                  htmlFor={`checklist-${item.key}`}
                  className={`text-sm leading-relaxed ${
                    itemData.checked ? 'line-through text-muted-foreground' : ''
                  }`}
                >
                  {item.label}
                </Label>
              </div>
              
              {/* Comment field - always visible for important items or when checked */}
              {(itemData.checked || 
                item.key === 'procedimientos' || 
                item.key === 'fugas' || 
                item.key === 'alertas') && (
                <Input
                  placeholder={
                    item.key === 'procedimientos' 
                      ? "Describa los procedimientos específicos..."
                      : itemData.checked 
                        ? "Comentarios adicionales (opcional)..."
                        : "Describa el problema encontrado..."
                  }
                  value={itemData.comment}
                  onChange={(e) => onChange(item.key, 'comment', e.target.value)}
                  className="text-sm"
                />
              )}
            </div>
          );
        })}
        
        {completionPercentage < 100 && (
          <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <p className="text-sm text-yellow-800">
              Complete todos los elementos de la lista antes de enviar
            </p>
          </div>
        )}
        
        {completionPercentage === 100 && (
          <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-md">
            <CheckSquare className="h-4 w-4 text-green-600" />
            <p className="text-sm text-green-800">
              ✓ Lista de verificación completa
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}