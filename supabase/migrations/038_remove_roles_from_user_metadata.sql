-- Remove role fields from user-editable metadata.
--
-- Run ONLY after the app reading roles from app_metadata (migration 037 +
-- feat/rbac-permissions) is deployed to production. Older app versions read
-- these fields, so running this earlier would remove everyone's access.
--
-- Roles now live in raw_app_meta_data.role (server-only), synced from
-- profiles.primary_role_id by the triggers from migration 037.

UPDATE auth.users
SET raw_user_meta_data = raw_user_meta_data - 'roles' - 'primary_role' - 'role'
WHERE raw_user_meta_data ?| ARRAY['roles', 'primary_role', 'role'];

-- Check (run separately): should return no rows.
--   SELECT email, raw_user_meta_data
--   FROM auth.users
--   WHERE raw_user_meta_data ?| ARRAY['roles', 'primary_role', 'role'];
