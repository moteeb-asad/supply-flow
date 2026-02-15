"use client";

import { useState } from "react";
import { Button } from "@/src/components/ui/Button";
import ChangePasswordModal from "./ChangePasswordModal";

export default function SecuritySection() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="bg-white border border-[#e7ebf3] rounded-xl overflow-hidden shadow-sm">
      <div className="px-6 py-4 border-b border-[#e7ebf3]">
        <h3 className="text-base font-bold">Account Security</h3>
      </div>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="size-10 rounded-lg bg-gray-100 flex items-center justify-center text-[#4e6797]">
              <span className="material-symbols-outlined">lock</span>
            </div>
            <div>
              <p className="text-sm font-bold">Password</p>
              <p className="text-xs text-[#4e6797]">
                Last changed 3 months ago
              </p>
            </div>
          </div>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => setIsModalOpen(true)}
          >
            Change Password
          </Button>
        </div>
      </div>

      <ChangePasswordModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
    </div>
  );
}
