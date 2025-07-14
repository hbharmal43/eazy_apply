-- ============================================================================
-- WORKDAY AUTOFILL PROFILES TABLE MIGRATION
-- This script extends the existing profiles table with fields needed for 
-- Workday job application autofill functionality
-- ============================================================================

-- 1. ADD CRITICAL PERSONAL INFORMATION FIELDS
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email VARCHAR(255);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS first_name VARCHAR(100);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_name VARCHAR(100);

-- 2. ADD DETAILED ADDRESS FIELDS
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS address_line_1 VARCHAR(255);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS address_line_2 VARCHAR(255);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS city VARCHAR(100);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS state VARCHAR(100);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS postal_code VARCHAR(20);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS country VARCHAR(100) DEFAULT 'United States of America';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS county VARCHAR(100);

-- 3. ADD ENHANCED PHONE INFORMATION
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone_device_type VARCHAR(50) DEFAULT 'Mobile';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS country_phone_code VARCHAR(10) DEFAULT '+1';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone_extension VARCHAR(10);

-- 4. ADD WORKDAY-SPECIFIC APPLICATION FIELDS
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS how_did_you_hear_about_us VARCHAR(100) DEFAULT 'Website → Workday.com';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS previously_worked_for_workday BOOLEAN DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS work_authorization_status VARCHAR(50) DEFAULT 'Yes';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS visa_sponsorship_required VARCHAR(50) DEFAULT 'No';

-- 5. ADD VOLUNTARY DISCLOSURE FIELDS (EEO COMPLIANCE)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS gender VARCHAR(50);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS ethnicity VARCHAR(100);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS military_veteran VARCHAR(50);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS disability_status VARCHAR(100);

-- 6. ADD ADDITIONAL DOCUMENT FIELDS
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS cover_letter_url TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS cover_letter_filename VARCHAR(255);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS portfolio_urls TEXT[] DEFAULT '{}';

-- 7. ADD ADDITIONAL PROFILE QUESTIONS FOR COMPREHENSIVE AUTOFILL
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS preferred_work_location VARCHAR(100); -- Remote, On-site, Hybrid
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS salary_expectation VARCHAR(50);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS available_start_date DATE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS willing_to_relocate BOOLEAN DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS years_of_experience INTEGER;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS highest_education_level VARCHAR(100);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS certifications TEXT[];
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS linkedin_url VARCHAR(255);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS github_url VARCHAR(255);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS personal_website VARCHAR(255);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS references_available BOOLEAN DEFAULT true;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS background_check_consent BOOLEAN DEFAULT true;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS drug_test_consent BOOLEAN DEFAULT true;

-- 8. CREATE PERFORMANCE INDEXES
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_first_name ON profiles(first_name);
CREATE INDEX IF NOT EXISTS idx_profiles_last_name ON profiles(last_name);
CREATE INDEX IF NOT EXISTS idx_profiles_country ON profiles(country);
CREATE INDEX IF NOT EXISTS idx_profiles_city ON profiles(city);
CREATE INDEX IF NOT EXISTS idx_profiles_state ON profiles(state);
CREATE INDEX IF NOT EXISTS idx_profiles_work_authorization ON profiles(work_authorization_status);
CREATE INDEX IF NOT EXISTS idx_profiles_visa_sponsorship ON profiles(visa_sponsorship_required);

-- 9. FUNCTION TO AUTOMATICALLY SPLIT FULL_NAME INTO FIRST/LAST NAME
CREATE OR REPLACE FUNCTION split_full_name()
RETURNS void AS $$
DECLARE
    profile_record RECORD;
    name_parts TEXT[];
BEGIN
    -- Process all profiles where names need to be split
    FOR profile_record IN 
        SELECT id, full_name 
        FROM profiles 
        WHERE full_name IS NOT NULL 
        AND (first_name IS NULL OR last_name IS NULL)
    LOOP
        -- Split full name on spaces
        name_parts := string_to_array(trim(profile_record.full_name), ' ');
        
        -- Handle different name formats
        IF array_length(name_parts, 1) >= 2 THEN
            -- "John Doe" or "John Michael Doe"
            UPDATE profiles 
            SET 
                first_name = name_parts[1],
                last_name = array_to_string(name_parts[2:array_upper(name_parts,1)], ' ')
            WHERE id = profile_record.id;
        ELSIF array_length(name_parts, 1) = 1 THEN
            -- "John" (single name)
            UPDATE profiles 
            SET 
                first_name = name_parts[1],
                last_name = ''
            WHERE id = profile_record.id;
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- 10. FUNCTION TO AUTOMATICALLY PARSE LOCATION INTO CITY/STATE/COUNTRY
CREATE OR REPLACE FUNCTION parse_location()
RETURNS void AS $$
DECLARE
    profile_record RECORD;
    location_parts TEXT[];
BEGIN
    -- Process all profiles where location needs to be parsed
    FOR profile_record IN 
        SELECT id, location 
        FROM profiles 
        WHERE location IS NOT NULL 
        AND (city IS NULL OR state IS NULL)
    LOOP
        -- Split location on commas
        location_parts := string_to_array(trim(profile_record.location), ',');
        
        -- Handle different location formats
        IF array_length(location_parts, 1) >= 2 THEN
            -- "San Francisco, CA" or "Dallas, TX, USA"  
            UPDATE profiles 
            SET 
                city = trim(location_parts[1]),
                state = trim(location_parts[2]),
                country = CASE 
                    WHEN array_length(location_parts, 1) >= 3 
                    THEN trim(location_parts[3])
                    ELSE 'United States of America'
                END
            WHERE id = profile_record.id;
        ELSIF array_length(location_parts, 1) = 1 THEN
            -- "Dallas" (city only)
            UPDATE profiles 
            SET city = trim(location_parts[1])
            WHERE id = profile_record.id;
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- 11. FUNCTION TO EXTRACT SOCIAL LINKS INTO DEDICATED COLUMNS
CREATE OR REPLACE FUNCTION extract_social_links()
RETURNS void AS $$
DECLARE
    profile_record RECORD;
BEGIN
    -- Process all profiles to extract social links
    FOR profile_record IN 
        SELECT id, socials 
        FROM profiles 
        WHERE socials IS NOT NULL
    LOOP
        -- Extract LinkedIn URL
        IF profile_record.socials ? 'linkedin' THEN
            UPDATE profiles 
            SET linkedin_url = profile_record.socials->>'linkedin'
            WHERE id = profile_record.id AND linkedin_url IS NULL;
        END IF;
        
        -- Extract GitHub URL
        IF profile_record.socials ? 'github' THEN
            UPDATE profiles 
            SET github_url = profile_record.socials->>'github'
            WHERE id = profile_record.id AND github_url IS NULL;
        END IF;
        
        -- Extract personal website
        IF profile_record.socials ? 'portfolio' THEN
            UPDATE profiles 
            SET personal_website = profile_record.socials->>'portfolio'
            WHERE id = profile_record.id AND personal_website IS NULL;
        ELSIF profile_record.socials ? 'website' THEN
            UPDATE profiles 
            SET personal_website = profile_record.socials->>'website'
            WHERE id = profile_record.id AND personal_website IS NULL;
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- 12. EXECUTE THE DATA MIGRATION FUNCTIONS
SELECT split_full_name();
SELECT parse_location();
SELECT extract_social_links();

-- 13. ADD DOCUMENTATION COMMENTS
COMMENT ON COLUMN profiles.email IS 'User email address - CRITICAL for job applications';
COMMENT ON COLUMN profiles.first_name IS 'First name (auto-derived from full_name)';
COMMENT ON COLUMN profiles.last_name IS 'Last name (auto-derived from full_name)';
COMMENT ON COLUMN profiles.address_line_1 IS 'Street address (123 Main St) - REQUIRED';
COMMENT ON COLUMN profiles.address_line_2 IS 'Apt/Suite number - OPTIONAL';
COMMENT ON COLUMN profiles.city IS 'City name (auto-derived from location)';
COMMENT ON COLUMN profiles.state IS 'State/Province (auto-derived from location)';
COMMENT ON COLUMN profiles.postal_code IS 'ZIP/Postal code - REQUIRED';
COMMENT ON COLUMN profiles.country IS 'Country name for address';
COMMENT ON COLUMN profiles.phone_device_type IS 'Mobile/Home/Work phone type';
COMMENT ON COLUMN profiles.country_phone_code IS 'International code (+1, +44)';
COMMENT ON COLUMN profiles.work_authorization_status IS 'Legal work authorization (Yes/No)';
COMMENT ON COLUMN profiles.visa_sponsorship_required IS 'Visa sponsorship needed (Yes/No)';
COMMENT ON COLUMN profiles.gender IS 'Gender selection for EEO compliance (voluntary)';
COMMENT ON COLUMN profiles.ethnicity IS 'Ethnicity selection for EEO compliance (voluntary)';
COMMENT ON COLUMN profiles.military_veteran IS 'Veteran status for EEO compliance (voluntary)';
COMMENT ON COLUMN profiles.disability_status IS 'Disability status for EEO compliance (voluntary)';
COMMENT ON COLUMN profiles.preferred_work_location IS 'Remote, On-site, or Hybrid preference';
COMMENT ON COLUMN profiles.salary_expectation IS 'Expected salary range';
COMMENT ON COLUMN profiles.available_start_date IS 'Earliest available start date';
COMMENT ON COLUMN profiles.willing_to_relocate IS 'Willingness to relocate for position';
COMMENT ON COLUMN profiles.years_of_experience IS 'Total years of professional experience';
COMMENT ON COLUMN profiles.highest_education_level IS 'Highest level of education completed';
COMMENT ON COLUMN profiles.certifications IS 'Professional certifications array';

-- 14. CLEANUP FUNCTIONS (OPTIONAL - UNCOMMENT TO REMOVE)
-- DROP FUNCTION IF EXISTS split_full_name();
-- DROP FUNCTION IF EXISTS parse_location();
-- DROP FUNCTION IF EXISTS extract_social_links();

-- Migration Complete! ✅ 