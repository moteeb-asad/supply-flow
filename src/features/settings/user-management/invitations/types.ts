// Invitation types

import { FilterPeriod } from "@/src/lib/date-range-utils";

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
  filters?: InvitationsFiltersValue;
};

export type InvitationsFiltersProps = {
  values: Record<string, unknown>;
  onChange: (filters: Record<string, unknown>) => void;
};

export type InvitationsFiltersValue = {
  lastLogin?: FilterPeriod | string;
  roleIds?: string[];
};

export type InvitationsFilters = {
  page?: number;
  pageSize?: number;
  search?: string;
  filters?: InvitationsFiltersValue;
};
