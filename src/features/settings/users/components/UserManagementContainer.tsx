"use client";

import { useState, useTransition } from "react";
import type { UserTableFilters } from "../types";
import UsersTable from "./UsersTable";
import { User } from "../types/user.types";
import { getUsersAction } from "../actions/get-users.actions";
import { UserManagementContainerProps } from "../types/user.types";
import { useProgress } from "@/src/providers/ProgressProvider";

const ITEMS_PER_PAGE = 10;

export default function UserManagementContainer({
  initialUsers,
  initialTotal,
}: UserManagementContainerProps) {
  const { start, stop } = useProgress();
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [total, setTotal] = useState(initialTotal);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<UserTableFilters>({
    roles: ["super_admin", "operations_manager", "store_keeper"],
    lastLoginRange: "Last 7 days",
  });
  const [isPending, startTransition] = useTransition();

  const handlePageChange = (page: number) => {
    startTransition(async () => {
      setCurrentPage(page);
      const result = await getUsersAction({
        page,
        itemsPerPage: ITEMS_PER_PAGE,
        roles: filters.roles,
        lastLoginRange: filters.lastLoginRange,
      });
      if (result.success) {
        setUsers(result.users);
        setTotal(result.total ?? 0);
      }
    });
  };

  const handleApplyFilters = (newFilters: UserTableFilters) => {
    start();
    setFilters(newFilters);
    setCurrentPage(1);
    startTransition(async () => {
      const result = await getUsersAction({
        page: 1,
        itemsPerPage: ITEMS_PER_PAGE,
        roles: newFilters.roles,
        lastLoginRange: newFilters.lastLoginRange,
      });
      if (result.success) {
        setUsers(result.users);
        setTotal(result.total ?? 0);
      }
      stop();
    });
  };

  const handleClearFilters = () => {
    setFilters({
      roles: ["super_admin", "operations_manager", "store_keeper"],
      lastLoginRange: "Last 7 days",
    });
    setCurrentPage(1);
    setUsers(initialUsers);
    setTotal(initialTotal);
  };

  return (
    <UsersTable
      users={users}
      total={total}
      currentPage={currentPage}
      itemsPerPage={ITEMS_PER_PAGE}
      isPending={isPending}
      onPageChange={handlePageChange}
      filters={filters}
      onApplyFilters={handleApplyFilters}
      setFilters={setFilters}
      onClearFilters={handleClearFilters}
    />
  );
}
