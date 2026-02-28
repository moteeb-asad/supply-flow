-- Sync auth.users -> public.profiles
--
-- Purpose:
-- Keep selected profile fields synchronized with Supabase Auth source-of-truth.
--
-- Synced fields:
--   auth.users.email            -> public.profiles.email
--   auth.users.last_sign_in_at  -> public.profiles.last_login_at
--
-- Not synced intentionally:
--   - primary_role_id / user_roles (owned by app tables)
--   - app-specific flags like is_active

-- ============================================================
-- 0) One-time backfill for existing users
-- ============================================================
UPDATE public.profiles p
SET
  email = u.email,
  last_login_at = u.last_sign_in_at,
  updated_at = NOW()
FROM auth.users u
WHERE p.id = u.id;

-- ============================================================
-- 1) Create/Upsert profile row when a new auth user is created
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    full_name,
    email,
    last_login_at,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      split_part(NEW.email, '@', 1),
      'User'
    ),
    NEW.email,
    NEW.last_sign_in_at,
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE
    SET
      email = EXCLUDED.email,
      last_login_at = EXCLUDED.last_login_at,
      updated_at = NOW();

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_auth_user();

-- ============================================================
-- 2) Keep email + last_login_at synced on auth user updates
-- ============================================================
CREATE OR REPLACE FUNCTION public.sync_profile_from_auth_user_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
  UPDATE public.profiles
  SET
    email = NEW.email,
    last_login_at = NEW.last_sign_in_at,
    updated_at = NOW()
  WHERE id = NEW.id;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;
CREATE TRIGGER on_auth_user_updated
AFTER UPDATE OF email, last_sign_in_at ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.sync_profile_from_auth_user_update();
