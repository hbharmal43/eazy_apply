-- =====================================================
-- REMOVE OLD APPLICATION COLUMNS MIGRATION
-- Remove salary and apply_time columns that are no longer needed
-- =====================================================

-- Remove the old columns that are no longer used
ALTER TABLE public.applications 
  DROP COLUMN IF EXISTS apply_time,
  DROP COLUMN IF EXISTS salary_min,
  DROP COLUMN IF EXISTS salary_max,
  DROP COLUMN IF EXISTS salary_currency;

-- Verify the changes
DO $$
BEGIN
  -- Check that the old columns are gone
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'applications' 
    AND column_name IN ('apply_time', 'salary_min', 'salary_max', 'salary_currency')
  ) THEN
    RAISE EXCEPTION 'Old columns still exist after migration';
  END IF;
  
  -- Check that new columns exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'applications' 
    AND column_name IN ('custom_resume_url', 'custom_resume_generated_at', 'custom_resume_status')
  ) THEN
    RAISE EXCEPTION 'New custom resume columns missing';
  END IF;
  
  RAISE NOTICE 'Migration completed successfully - old columns removed, new columns present';
END $$; 