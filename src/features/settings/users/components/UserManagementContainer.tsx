"use client";

import { useState, useTransition } from "react";
import UsersTable from "./UsersTable";
import { getUsersAction } from "../actions/get-users.actions";
import { User } from "../types/user.types";
import { UserManagementContainerProps } from "../types/user.types";

const ITEMS_PER_PAGE = 10;

export default function UserManagementContainer({
  initialUsers,
  initialTotal,
}: UserManagementContainerProps) {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [total, setTotal] = useState(initialTotal);
  const [currentPage, setCurrentPage] = useState(1);
  const [isPending, startTransition] = useTransition();

  const handlePageChange = (page: number) => {
    startTransition(async () => {
      setCurrentPage(page);
      const result = await getUsersAction({
        page,
        itemsPerPage: ITEMS_PER_PAGE,
      });

      if (result.success) {
        setUsers(result.users);
        setTotal(result.total ?? 0);
      }
    });
  };

  return (
    <UsersTable
      users={users}
      total={total}
      currentPage={currentPage}
      itemsPerPage={ITEMS_PER_PAGE}
      isPending={isPending}
      onPageChange={handlePageChange}
    />
  );
}
