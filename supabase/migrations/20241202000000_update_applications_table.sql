-- =====================================================
-- UPDATE APPLICATIONS TABLE MIGRATION
-- Add custom resume columns and remove unused columns
-- =====================================================

-- 1. ADD NEW CUSTOM RESUME COLUMNS
ALTER TABLE public.applications
  ADD COLUMN custom_resume_url TEXT NULL,
  ADD COLUMN custom_resume_generated_at TIMESTAMP WITH TIME ZONE NULL,
  ADD COLUMN custom_resume_status TEXT NULL DEFAULT 'not_generated';

-- 2. REMOVE UNUSED COLUMNS
ALTER TABLE public.applications 
  DROP COLUMN IF EXISTS apply_time,
  DROP COLUMN IF EXISTS salary_min,
  DROP COLUMN IF EXISTS salary_max,
  DROP COLUMN IF EXISTS salary_currency;

-- 3. CREATE INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_applications_custom_resume_status ON applications(custom_resume_status);
CREATE INDEX IF NOT EXISTS idx_applications_custom_resume_generated_at ON applications(custom_resume_generated_at);

-- 4. ADD DOCUMENTATION COMMENTS
COMMENT ON COLUMN applications.custom_resume_url IS 'URL to the custom generated resume for this application';
COMMENT ON COLUMN applications.custom_resume_generated_at IS 'Timestamp when the custom resume was generated';
COMMENT ON COLUMN applications.custom_resume_status IS 'Status of custom resume generation: not_generated, generating, completed, failed';

-- 5. ADD CONSTRAINT FOR CUSTOM RESUME STATUS
ALTER TABLE applications 
  ADD CONSTRAINT check_custom_resume_status 
  CHECK (custom_resume_status IN ('not_generated', 'generating', 'completed', 'failed'));

-- 6. UPDATE RLS POLICIES IF THEY EXIST
-- (This ensures the new columns are properly secured)
DO $$
BEGIN
  -- Check if RLS is enabled and update policies if needed
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_name = 'applications' 
    AND table_schema = 'public'
  ) THEN
    -- Ensure RLS is enabled
    ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
    
    -- Update or create policies for the new columns
    -- (This assumes existing policies will automatically apply to new columns)
  END IF;
END $$; 