-- Add daily_goal column to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS daily_goal INTEGER DEFAULT 10;

-- Update existing profiles to have the default goal
UPDATE profiles 
SET daily_goal = 10 
WHERE daily_goal IS NULL; 