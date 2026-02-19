-- Add email and last_sign_in_at columns to profiles table
-- This allows us to avoid using auth.admin.listUsers() in runtime

ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS email TEXT UNIQUE NOT NULL,
ADD COLUMN IF NOT EXISTS last_sign_in_at TIMESTAMPTZ;

-- Create index for email lookups
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);

-- Add comment
COMMENT ON COLUMN profiles.email IS 'User email stored in profiles for easy access without auth.admin API';
COMMENT ON COLUMN profiles.last_sign_in_at IS 'Last sign in timestamp, updated by trigger or manually';
