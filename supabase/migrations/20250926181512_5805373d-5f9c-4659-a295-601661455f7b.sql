-- Create preoperational records table
CREATE TABLE public.preoperational (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  machine_id UUID NOT NULL,
  project_id UUID NOT NULL, 
  user_id UUID NOT NULL,
  datetime TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  horometer_initial DECIMAL(10,2),
  hours_worked DECIMAL(4,1),
  horometer_final DECIMAL(10,2),
  fuel_level TEXT CHECK (fuel_level IN ('alto', 'medio', 'bajo')),
  oil_level TEXT CHECK (oil_level IN ('alto', 'medio', 'bajo')),
  coolant_level TEXT CHECK (coolant_level IN ('alto', 'medio', 'bajo')),
  hydraulic_level TEXT CHECK (hydraulic_level IN ('alto', 'medio', 'bajo')),
  greased BOOLEAN DEFAULT false,
  tires_wear TEXT CHECK (tires_wear IN ('alto', 'medio', 'bajo')),
  tires_punctured BOOLEAN DEFAULT false,
  tires_bearing_issue BOOLEAN DEFAULT false,
  tires_action TEXT CHECK (tires_action IN ('none', 'repair', 'replace')) DEFAULT 'none',
  lights_status TEXT CHECK (lights_status IN ('bueno', 'foco_danado', 'farola_partida')) DEFAULT 'bueno',
  lights_note TEXT,
  hoses_status TEXT CHECK (hoses_status IN ('bueno', 'requiere_reparacion', 'reemplazo')) DEFAULT 'bueno',
  hoses_note TEXT,
  checklist JSONB DEFAULT '[]',
  observations TEXT,
  sync_status TEXT CHECK (sync_status IN ('synced', 'pending')) DEFAULT 'synced',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create preoperational photos table
CREATE TABLE public.preoperational_photos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  preoperational_id UUID NOT NULL REFERENCES public.preoperational(id) ON DELETE CASCADE,
  photo_type TEXT NOT NULL, -- 'general', 'manguera', 'llanta', 'luz', etc.
  url TEXT NOT NULL,
  caption TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create projects table
CREATE TABLE public.projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  client_name TEXT,
  status TEXT CHECK (status IN ('activo', 'completado', 'planificacion', 'pausado')) DEFAULT 'activo',
  location TEXT,
  start_date DATE,
  end_date DATE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create machines table
CREATE TABLE public.machines (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  model TEXT,
  brand TEXT,
  serial_number TEXT UNIQUE,
  current_hours DECIMAL(10,2) DEFAULT 0,
  next_preventive_hours DECIMAL(10,2),
  last_greasing_hours DECIMAL(10,2),
  next_certification_date DATE,
  action_required BOOLEAN DEFAULT false,
  last_preop_id UUID,
  last_preop_date TIMESTAMP WITH TIME ZONE,
  status TEXT CHECK (status IN ('operativo', 'mantenimiento', 'reparacion', 'fuera_servicio')) DEFAULT 'operativo',
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create project_machines junction table
CREATE TABLE public.project_machines (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  machine_id UUID NOT NULL REFERENCES public.machines(id) ON DELETE CASCADE,
  assigned_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(project_id, machine_id)
);

-- Create profiles table for users
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  role TEXT CHECK (role IN ('operario', 'supervisor', 'administrador')) DEFAULT 'operario',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.preoperational ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.preoperational_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.machines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_machines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own preoperational records" 
ON public.preoperational FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own preoperational records" 
ON public.preoperational FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Photos are viewable by preop owner" 
ON public.preoperational_photos FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.preoperational p 
  WHERE p.id = preoperational_id AND p.user_id = auth.uid()
));

CREATE POLICY "Users can insert photos for their preops" 
ON public.preoperational_photos FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM public.preoperational p 
  WHERE p.id = preoperational_id AND p.user_id = auth.uid()
));

CREATE POLICY "Projects are viewable by authenticated users" 
ON public.projects FOR SELECT TO authenticated 
USING (true);

CREATE POLICY "Machines are viewable by authenticated users" 
ON public.machines FOR SELECT TO authenticated 
USING (true);

CREATE POLICY "Machine assignments are viewable by authenticated users" 
ON public.project_machines FOR SELECT TO authenticated 
USING (true);

CREATE POLICY "Users can view their own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Create function to update machine hours after preoperational
CREATE OR REPLACE FUNCTION public.update_machine_after_preop()
RETURNS TRIGGER AS $$
BEGIN
  -- Update machine current hours and last preop data
  UPDATE public.machines 
  SET 
    current_hours = COALESCE(NEW.horometer_final, NEW.horometer_initial + COALESCE(NEW.hours_worked, 0)),
    last_preop_id = NEW.id,
    last_preop_date = NEW.datetime,
    next_preventive_hours = CASE 
      WHEN current_hours IS NULL THEN 300
      ELSE current_hours + 300 
    END,
    action_required = CASE
      WHEN NEW.tires_action IN ('repair', 'replace') 
        OR NEW.hoses_status IN ('requiere_reparacion', 'reemplazo')
        OR NEW.lights_status IN ('foco_danado', 'farola_partida')
      THEN true
      ELSE action_required
    END,
    updated_at = now()
  WHERE id = NEW.machine_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
CREATE TRIGGER update_machine_after_preop_trigger
  AFTER INSERT ON public.preoperational
  FOR EACH ROW
  EXECUTE FUNCTION public.update_machine_after_preop();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for timestamp updates
CREATE TRIGGER update_preoperational_updated_at
  BEFORE UPDATE ON public.preoperational
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_machines_updated_at
  BEFORE UPDATE ON public.machines
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample data
INSERT INTO public.projects (name, client_name, status, location, description) VALUES
('Construcción Torre Central', 'Inmobiliaria XYZ', 'activo', 'Bogotá, Colombia', 'Proyecto de construcción de torre residencial'),
('Pavimentación Vía Norte', 'Alcaldía Municipal', 'activo', 'Medellín, Colombia', 'Mejoramiento de infraestructura vial'),
('Centro Comercial Plaza', 'Inversiones ABC', 'planificacion', 'Cali, Colombia', 'Desarrollo centro comercial');

INSERT INTO public.machines (name, model, brand, serial_number, current_hours, status, location) VALUES
('Excavadora CAT-001', 'CAT 320', 'Caterpillar', 'EXC001', 1250.5, 'operativo', 'Bogotá'),
('Grúa Liebherr-001', 'LTM 1070', 'Liebherr', 'GRU001', 890.0, 'operativo', 'Medellín'),
('Retroexcavadora JCB-001', 'JCB 3CX', 'JCB', 'RET001', 1580.5, 'mantenimiento', 'Cali');

INSERT INTO public.project_machines (project_id, machine_id) VALUES
((SELECT id FROM public.projects WHERE name = 'Construcción Torre Central'), (SELECT id FROM public.machines WHERE name = 'Excavadora CAT-001')),
((SELECT id FROM public.projects WHERE name = 'Pavimentación Vía Norte'), (SELECT id FROM public.machines WHERE name = 'Grúa Liebherr-001')),
((SELECT id FROM public.projects WHERE name = 'Centro Comercial Plaza'), (SELECT id FROM public.machines WHERE name = 'Retroexcavadora JCB-001'));