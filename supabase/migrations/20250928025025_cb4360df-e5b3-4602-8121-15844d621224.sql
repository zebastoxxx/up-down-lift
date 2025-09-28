-- Storage policies for preoperational photos bucket
-- Only admins can see the photos for security and privacy

-- Policy for SELECT (only admins can view photos)
CREATE POLICY "Only admins can view preoperational photos" 
ON storage.objects 
FOR SELECT 
USING (
  bucket_id = 'Updown preoperational photos' 
  AND is_admin(auth.uid())
);

-- Policy for INSERT (authenticated users can upload photos)
CREATE POLICY "Authenticated users can upload preoperational photos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'Updown preoperational photos' 
  AND auth.uid() IS NOT NULL
);

-- Policy for UPDATE (no updates allowed to preserve evidence)
-- No UPDATE policy = no updates allowed

-- Policy for DELETE (no deletes allowed to preserve evidence)  
-- No DELETE policy = no deletes allowed