-- Create user_table_preferences table
CREATE TABLE public.user_table_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  table_name TEXT NOT NULL,
  preferences JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, table_name)
);

-- Create warehouse_inspections table
CREATE TABLE public.warehouse_inspections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  machine_id UUID NOT NULL REFERENCES public.machines(id),
  user_id UUID NOT NULL,
  username TEXT NOT NULL,
  inspection_type TEXT NOT NULL,
  horometer_reading NUMERIC DEFAULT 0,
  fuel_level TEXT,
  oil_level TEXT,
  coolant_level TEXT,
  hydraulic_level TEXT,
  tire_condition TEXT,
  tire_pressure_ok BOOLEAN DEFAULT true,
  body_condition TEXT,
  lights_working BOOLEAN DEFAULT true,
  lights_note TEXT,
  horn_working BOOLEAN DEFAULT true,
  windows_intact BOOLEAN DEFAULT true,
  windows_note TEXT,
  mirrors_intact BOOLEAN DEFAULT true,
  seat_condition TEXT,
  cabin_cleanliness TEXT,
  leaks_detected BOOLEAN DEFAULT false,
  leaks_location TEXT,
  hoses_condition TEXT,
  battery_condition TEXT,
  tools_complete BOOLEAN DEFAULT true,
  tools_missing TEXT,
  fire_extinguisher BOOLEAN DEFAULT true,
  first_aid_kit BOOLEAN DEFAULT true,
  safety_cones BOOLEAN DEFAULT true,
  reflective_triangles BOOLEAN DEFAULT true,
  documents_complete BOOLEAN DEFAULT true,
  documents_missing TEXT,
  overall_condition TEXT DEFAULT 'bueno',
  observations TEXT,
  checklist JSONB,
  photos_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create warehouse_inspection_photos table
CREATE TABLE public.warehouse_inspection_photos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  warehouse_inspection_id UUID NOT NULL REFERENCES public.warehouse_inspections(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  photo_type TEXT DEFAULT 'general',
  caption TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_table_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.warehouse_inspections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.warehouse_inspection_photos ENABLE ROW LEVEL SECURITY;

-- Allow all access (custom auth)
CREATE POLICY "Allow all access" ON public.user_table_preferences FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access" ON public.warehouse_inspections FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access" ON public.warehouse_inspection_photos FOR ALL USING (true) WITH CHECK (true);

-- Add updated_at triggers
CREATE TRIGGER update_user_table_preferences_updated_at BEFORE UPDATE ON public.user_table_preferences FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_warehouse_inspections_updated_at BEFORE UPDATE ON public.warehouse_inspections FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();