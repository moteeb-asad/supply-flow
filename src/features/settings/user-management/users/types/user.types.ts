import type { UserRole } from "@/src/types/auth";

export interface User {
  id: string;
  full_name: string;
  avatar_url: string | null;
  created_at: string;
  email: string;
  last_sign_in_at: string | null;
  primary_role_label: UserRole | null;
  roles: string[];
}

export interface UsersTableProps {
  users?: User[];
  total: number;
  currentPage: number;
  itemsPerPage: number;
  isPending?: boolean;
  onPageChange: (page: number) => void;
}

export interface UserManagementContainerProps {
  initialUsers: User[];
  initialTotal: number;
}
