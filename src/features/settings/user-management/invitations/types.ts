// Invitation types

export interface Invitation {
  id: string;
  email: string;
  role?: {
    id: string;
    name: string;
  };
  invited_by: string;
  sent_at?: string;
  expires_at?: string;
  status: string;
  inviter_profile?: {
    id: string;
    full_name: string;
    primary_role?: {
      id: string;
      name: string;
    };
  };
}

export type InvitationsTableQueryParams = {
  page: number;
  pageSize: number;
  search?: string;
  filters?: Record<string, unknown>;
};
