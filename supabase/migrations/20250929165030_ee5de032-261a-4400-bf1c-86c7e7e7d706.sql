-- Add DELETE policy for preoperational table
CREATE POLICY "Authenticated users can delete preoperational records" 
ON public.preoperational 
FOR DELETE 
USING (auth.uid() IS NOT NULL);