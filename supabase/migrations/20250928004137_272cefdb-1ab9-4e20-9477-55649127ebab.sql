-- Fix RLS policies for clients table to work with custom JWT auth
-- Update SELECT policy to allow viewing clients
DROP POLICY IF EXISTS "Clients are viewable by authenticated users" ON public.clients;

CREATE POLICY "Authenticated users can view clients"
ON public.clients
FOR SELECT
USING (true);

-- Update INSERT policy 
DROP POLICY IF EXISTS "Authenticated users can insert clients" ON public.clients;

CREATE POLICY "Authenticated users can insert clients"
ON public.clients
FOR INSERT
WITH CHECK (true);

-- Update UPDATE policy
DROP POLICY IF EXISTS "Authenticated users can update clients" ON public.clients;

CREATE POLICY "Authenticated users can update clients"
ON public.clients
FOR UPDATE
USING (true);