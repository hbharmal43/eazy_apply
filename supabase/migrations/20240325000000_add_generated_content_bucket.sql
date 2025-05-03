-- Create a new storage bucket for AI-generated content
INSERT INTO storage.buckets (id, name, public)
VALUES ('generated_content', 'generated_content', false);

-- Set up security policies for the generated_content bucket
-- Only allow users to access their own content
CREATE POLICY "Users can access their own generated content"
ON storage.objects FOR SELECT
USING (auth.uid()::text = (storage.foldername(name))[1]);

-- Only allow users to insert their own content
CREATE POLICY "Users can insert their own generated content"
ON storage.objects FOR INSERT
WITH CHECK (auth.uid()::text = (storage.foldername(name))[1]);

-- Only allow users to update their own content
CREATE POLICY "Users can update their own generated content"
ON storage.objects FOR UPDATE
USING (auth.uid()::text = (storage.foldername(name))[1]);

-- Only allow users to delete their own content
CREATE POLICY "Users can delete their own generated content"
ON storage.objects FOR DELETE
USING (auth.uid()::text = (storage.foldername(name))[1]); 