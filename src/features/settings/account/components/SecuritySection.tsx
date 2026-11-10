"use client";

import { useState } from "react";
import { Button } from "@/src/components/ui/Button";
import AppIcon from "@/src/components/ui/AppIcon";
import ChangePasswordModal from "./ChangePasswordModal";
import { formatRelative } from "@/src/lib/dates";
import { SecuritySectionProps } from "../types";
import { useUser } from "@/src/providers/UserProvider";
import {
  DEMO_ACCOUNT_DISABLED_MESSAGE,
  isDemoAccount,
} from "@/src/features/auth/utils/demo-account";

export default function SecuritySection({
  passwordChangedAt,
}: SecuritySectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useUser();
  const isDemo = isDemoAccount(user?.email);

  const passwordChangedText = passwordChangedAt
    ? `Last changed ${formatRelative(passwordChangedAt)}`
    : "Never changed";

  return (
    <section
      aria-labelledby="account-security-title"
      className="rounded-card border border-line"
    >
      <div className="grid gap-6 p-6 md:grid-cols-[14rem_minmax(0,1fr)]">
        <div>
          <h2 id="account-security-title" className="text-[15px] font-semibold">
            Sign-in and security
          </h2>
          <p className="mt-1 text-[13px] text-muted">
            Use a password you don&apos;t use anywhere else.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 self-start rounded-card border border-line-soft p-4">
          <div className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className="inline-flex size-9 items-center justify-center rounded-control bg-background-light text-subtle"
            >
              <AppIcon name="lock" />
            </span>
            <div>
              <p className="text-sm font-medium">Password</p>
              <p className="text-[13px] text-subtle">
                {isDemo ? DEMO_ACCOUNT_DISABLED_MESSAGE : passwordChangedText}
              </p>
            </div>
          </div>
          <Button
            type="button"
            variant="secondary"
            size="md"
            disabled={isDemo}
            onClick={() => setIsModalOpen(true)}
          >
            Change password
          </Button>
        </div>
      </div>

      <ChangePasswordModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
    </section>
  );
}
