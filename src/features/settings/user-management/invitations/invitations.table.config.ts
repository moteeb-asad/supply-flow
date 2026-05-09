"use client";

import type { DataTableConfig } from "@/src/components/data-table/types";
import { ROLES } from "@/src/constants/roles";
import {
  parseIdsFromLabelParam,
  serializeLabelParamFromIds,
  setOrDeleteParam,
} from "@/src/lib/url-filter-utils";
import { InvitationsFilters } from "./components/InvitationsFilters";
import { invitationsColumns } from "./components/InvitationsColumns";
import { invitationsFetcher } from "./fetchers/invitations.fetcher";
import type {
  Invitation,
  InvitationsFiltersValue,
  InvitationsTableQueryParams,
} from "./types";

const parseInvitationsFiltersFromUrl = (
  searchParams: URLSearchParams,
): InvitationsFiltersValue => {
  const roleParam = searchParams.get("role");
  return {
    roleIds: parseIdsFromLabelParam(roleParam, ROLES),
  };
};

export const invitationsTableConfig: DataTableConfig<
  Invitation,
  InvitationsTableQueryParams,
  InvitationsFiltersValue
> = {
  fetcher: invitationsFetcher,
  filters: InvitationsFilters,
  columns: invitationsColumns,
  searchPlaceholder: "Search invitations...",
  queryKey: (params: InvitationsTableQueryParams) => [
    "invitations-table",
    params,
  ],

  parseFiltersFromUrl: parseInvitationsFiltersFromUrl,
  writeFiltersToUrl: (filters, params) => {
    setOrDeleteParam(
      params,
      "role",
      serializeLabelParamFromIds(filters.roleIds, ROLES),
    );
  },
};
