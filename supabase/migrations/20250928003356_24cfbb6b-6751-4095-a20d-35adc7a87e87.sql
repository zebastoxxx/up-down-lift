-- Fix the RLS policy for user creation to work with JWT authentication
-- Drop the existing insert policy that's causing issues
DROP POLICY IF EXISTS "Admins can insert users" ON public.users;

-- Create a new policy that works with JWT tokens from our edge function
CREATE POLICY "Admins can insert users"
ON public.users
FOR INSERT
WITH CHECK (
  -- Allow if the current authenticated user is an admin
  EXISTS (
    SELECT 1 FROM public.users u
    WHERE u.id = auth.uid() 
    AND u.role = 'administrador'
  )
);