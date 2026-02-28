"use client";

import { InvitationsFilters } from "./components/InvitationsFilters";
import { invitationsColumns } from "./components/InvitationsColumns";
import { invitationsFetcher } from "./fetchers/invitations.fetcher";

export const invitationsTableConfig = {
  fetcher: invitationsFetcher,
  filters: InvitationsFilters,
  columns: invitationsColumns,
  searchPlaceholder: "Search invitations...",
};
