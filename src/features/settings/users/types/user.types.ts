export interface User {
  id: string;
  full_name: string;
  avatar_url: string | null;
  created_at: string;
  email: string;
  last_sign_in_at: string | null;
  primary_role_label: string;
  roles: string[];
}

export interface UsersTableProps {
  users?: User[];
}
