-- Keep a read-only copy of each user's role in auth.users.raw_app_meta_data.role.
--
-- Why: app_metadata is part of the signed session JWT and can only be written
-- by the server (service role / SQL). user_metadata can be edited by the user
-- themselves, so it must never be used for authorization.
--
-- One role per user: roles are nested (super_admin > operations_manager >
-- store_keeper), so a user only needs their highest role and permissions in
-- code (ROLE_PERMISSIONS) decide access. Source of truth:
--   profiles.primary_role_id  (fallback: the user's user_roles row)
--
-- Steps:
--   1. seed the roles table (ids are referenced by existing RLS policies)
--   2. sync function
--   3. triggers on profiles.primary_role_id and user_roles
--   4. backfill existing users
--
-- Safe to run before deploying the app: current code still reads user_metadata
-- and ignores app_metadata. Run it at least 1 hour before deploying so every
-- active session token has been refreshed with the new claim.

-- 1. Seed roles --------------------------------------------------------------

INSERT INTO public.roles (id, name, description) VALUES
  (1, 'super_admin', 'Full system access'),
  (2, 'operations_manager', 'Manages suppliers and inventory'),
  (3, 'store_keeper', 'Handles stock receiving and physical inventory')
ON CONFLICT (name) DO NOTHING;

-- Keep the id sequence ahead of the explicit ids above.
SELECT setval(
  pg_get_serial_sequence('public.roles', 'id'),
  (SELECT max(id) FROM public.roles)
);

-- 2. Sync function -----------------------------------------------------------

CREATE OR REPLACE FUNCTION public.sync_role_to_app_metadata(p_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_role text;
BEGIN
  SELECT r.name
  INTO v_role
  FROM profiles p
  JOIN roles r ON r.id = p.primary_role_id
  WHERE p.id = p_user_id;

  -- Fallback for users without a primary role: their user_roles row.
  IF v_role IS NULL THEN
    SELECT r.name
    INTO v_role
    FROM user_roles ur
    JOIN roles r ON r.id = ur.role_id
    WHERE ur.user_id = p_user_id
    ORDER BY r.id
    LIMIT 1;
  END IF;

  UPDATE auth.users
  SET raw_app_meta_data = (coalesce(raw_app_meta_data, '{}'::jsonb)
      - 'roles' - 'primary_role')
    || jsonb_build_object('role', v_role)
  WHERE id = p_user_id;
END;
$$;

-- Only called by the triggers below, never by clients.
REVOKE ALL ON FUNCTION public.sync_role_to_app_metadata(uuid)
  FROM PUBLIC, anon, authenticated;

-- 3. Triggers ----------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.sync_app_metadata_from_profile()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  PERFORM public.sync_role_to_app_metadata(NEW.id);
  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS profiles_sync_app_metadata ON public.profiles;

CREATE TRIGGER profiles_sync_app_metadata
AFTER INSERT OR UPDATE OF primary_role_id ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.sync_app_metadata_from_profile();

-- user_roles only matters as the fallback, but keep it in sync either way.
CREATE OR REPLACE FUNCTION public.sync_app_metadata_from_user_roles()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  IF TG_OP IN ('INSERT', 'UPDATE') THEN
    PERFORM public.sync_role_to_app_metadata(NEW.user_id);
  END IF;

  IF TG_OP = 'DELETE'
     OR (TG_OP = 'UPDATE' AND OLD.user_id IS DISTINCT FROM NEW.user_id) THEN
    PERFORM public.sync_role_to_app_metadata(OLD.user_id);
  END IF;

  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS user_roles_sync_app_metadata ON public.user_roles;

CREATE TRIGGER user_roles_sync_app_metadata
AFTER INSERT OR UPDATE OR DELETE ON public.user_roles
FOR EACH ROW
EXECUTE FUNCTION public.sync_app_metadata_from_user_roles();

REVOKE ALL ON FUNCTION public.sync_app_metadata_from_profile() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.sync_app_metadata_from_user_roles() FROM PUBLIC, anon, authenticated;

-- 4. Backfill existing users -------------------------------------------------

DO $$
DECLARE
  v_user_id uuid;
BEGIN
  FOR v_user_id IN SELECT id FROM public.profiles LOOP
    PERFORM public.sync_role_to_app_metadata(v_user_id);
  END LOOP;
END;
$$;

-- Check (run separately): every user should have a role.
--   SELECT email, raw_app_meta_data->>'role' AS role
--   FROM auth.users ORDER BY email;
