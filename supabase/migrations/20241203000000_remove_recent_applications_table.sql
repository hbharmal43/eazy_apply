-- =====================================================
-- REMOVE RECENT APPLICATIONS TABLE MIGRATION
-- Drop the recent_applications table as it's no longer needed
-- =====================================================

-- Drop the recent_applications table if it exists
DROP TABLE IF EXISTS public.recent_applications;

-- Verify the table has been dropped
DO $$
BEGIN
  -- Check that the table no longer exists
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_name = 'recent_applications' 
    AND table_schema = 'public'
  ) THEN
    RAISE EXCEPTION 'recent_applications table still exists after migration';
  END IF;
  
  RAISE NOTICE 'Migration completed successfully - recent_applications table removed';
END $$;

