-- Create users table (custom auth, not using Supabase Auth)
CREATE TABLE public.users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'operario',
  status TEXT NOT NULL DEFAULT 'activo',
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create clients table
CREATE TABLE public.clients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  tax_id TEXT,
  contact_person TEXT,
  email TEXT,
  phone TEXT,
  website TEXT,
  address TEXT,
  city TEXT,
  country TEXT NOT NULL DEFAULT 'Colombia',
  status TEXT NOT NULL DEFAULT 'activo',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create machines table
CREATE TABLE public.machines (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  brand TEXT,
  model TEXT,
  serial_number TEXT,
  location TEXT,
  status TEXT NOT NULL DEFAULT 'operativo',
  current_hours NUMERIC DEFAULT 0,
  next_certification_date DATE,
  last_corrective_maintenance_date DATE,
  last_preventive_maintenance_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create projects table
CREATE TABLE public.projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  location TEXT,
  city TEXT,
  country TEXT DEFAULT 'Colombia',
  address TEXT,
  start_date DATE,
  end_date DATE,
  status TEXT NOT NULL DEFAULT 'planificacion',
  client_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create project_clients junction table
CREATE TABLE public.project_clients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(project_id, client_id)
);

-- Create project_machines junction table
CREATE TABLE public.project_machines (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  machine_id UUID NOT NULL REFERENCES public.machines(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(project_id, machine_id)
);

-- Create preoperational table
CREATE TABLE public.preoperational (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  datetime TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  project_id UUID NOT NULL REFERENCES public.projects(id),
  machine_id UUID NOT NULL REFERENCES public.machines(id),
  username TEXT NOT NULL,
  horometer_initial NUMERIC DEFAULT 0,
  horometer_final NUMERIC DEFAULT 0,
  hours_worked NUMERIC DEFAULT 0,
  hours_fraction NUMERIC DEFAULT 0,
  oil_level TEXT,
  hydraulic_level TEXT,
  coolant_level TEXT,
  fuel_level TEXT,
  tires_wear TEXT,
  tires_punctured BOOLEAN DEFAULT false,
  tires_bearing_issue BOOLEAN DEFAULT false,
  tires_action TEXT,
  hoses_status TEXT,
  hoses_note TEXT,
  lights_status TEXT,
  lights_note TEXT,
  lights_front_left JSONB,
  lights_front_right JSONB,
  lights_rear_left JSONB,
  lights_rear_right JSONB,
  reverse_horn JSONB,
  greased BOOLEAN DEFAULT false,
  checklist JSONB,
  observations TEXT,
  sync_status TEXT DEFAULT 'synced',
  operator_signature_url TEXT,
  supervisor_signature_url TEXT,
  operator_signature_timestamp TIMESTAMP WITH TIME ZONE,
  supervisor_signature_timestamp TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create preoperational_photos table
CREATE TABLE public.preoperational_photos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  preoperational_id UUID NOT NULL REFERENCES public.preoperational(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  photo_type TEXT DEFAULT 'general',
  caption TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.machines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_machines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.preoperational ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.preoperational_photos ENABLE ROW LEVEL SECURITY;

-- Since this app uses custom auth (not Supabase Auth), allow anon access.
-- The app handles authorization via custom JWT in edge functions.
CREATE POLICY "Allow all access" ON public.users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access" ON public.clients FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access" ON public.machines FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access" ON public.projects FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access" ON public.project_clients FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access" ON public.project_machines FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access" ON public.preoperational FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access" ON public.preoperational_photos FOR ALL USING (true) WITH CHECK (true);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Add updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON public.clients FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_machines_updated_at BEFORE UPDATE ON public.machines FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_preoperational_updated_at BEFORE UPDATE ON public.preoperational FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();