-- Sync password change timestamp from auth.users to public.profiles
--
-- Purpose:
-- Keep public.profiles.password_changed_at updated when a user's password
-- hash changes in auth.users.
--
-- Notes:
-- - This does not store or expose password data.
-- - Social/OAuth users may keep password_changed_at as NULL.

CREATE OR REPLACE FUNCTION public.sync_password_changed_at_from_auth()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
  IF (OLD.encrypted_password IS DISTINCT FROM NEW.encrypted_password) THEN
    UPDATE public.profiles
    SET
      password_changed_at = NOW(),
      updated_at = NOW()
    WHERE id = NEW.id;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_password_updated ON auth.users;
CREATE TRIGGER on_auth_password_updated
AFTER UPDATE OF encrypted_password ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.sync_password_changed_at_from_auth();
