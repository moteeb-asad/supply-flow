"use client";

import { useEffect, useState } from "react";
import { Input } from "@/src/components/ui/Input";
import { Button } from "@/src/components/ui/Button";
import { MultiSelect } from "@/src/components/ui/MultiSelect";

const roleOptions = [
  { value: "super_admin", label: "Super Admin" },
  { value: "ops_manager", label: "Operations Manager" },
  { value: "store_keeper", label: "Store Keeper" },
];

export default function InviteUserModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [roles, setRoles] = useState<string[]>([]);
  const [note, setNote] = useState("");

  useEffect(() => {
    // Listen for header action events
    const handleHeaderAction = (event: CustomEvent) => {
      if (event.detail.action === "invite-user") {
        setIsOpen(true);
      }
    };

    window.addEventListener(
      "header-action",
      handleHeaderAction as EventListener,
    );

    return () => {
      window.removeEventListener(
        "header-action",
        handleHeaderAction as EventListener,
      );
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement invite user logic
    console.log("Inviting user:", { email, roles, note });
    setIsOpen(false);
    // Reset form
    setEmail("");
    setRoles([]);
    setNote("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={() => setIsOpen(false)}
      />
      <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl border border-[#e7ebf3] overflow-hidden relative z-10">
        <div className="px-6 py-4 border-b border-[#e7ebf3] flex justify-between items-center">
          <h3 className="text-lg font-bold">Invite New User</h3>
          <button
            className="text-[#4e6797] hover:text-[#0e121b] transition-colors"
            onClick={() => setIsOpen(false)}
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-5">
            <div className="space-y-1.5">
              <label
                className="text-sm font-semibold text-[#4e6797]"
                htmlFor="email"
              >
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                placeholder="e.g. jason@warehouse.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <MultiSelect
              id="roles"
              label="Select Role(s)"
              options={roleOptions}
              value={roles}
              onChange={setRoles}
              placeholder="Add roles..."
            />

            <div className="space-y-1.5">
              <label
                className="text-sm font-semibold text-[#4e6797]"
                htmlFor="note"
              >
                Optional Note
              </label>
              <textarea
                id="note"
                placeholder="Add a welcome message..."
                rows={3}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full px-4 py-2 bg-gray-50 border border-[#e7ebf3] rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm outline-none transition-all resize-none"
              />
            </div>

            <div className="flex items-start gap-3 p-4 bg-primary/5 rounded-lg border border-primary/10">
              <span className="material-symbols-outlined text-primary text-xl">
                info
              </span>
              <p className="text-xs text-[#4e6797] leading-relaxed">
                The user will receive a one-time invitation link via email,
                valid for{" "}
                <span className="font-bold text-primary">48 hours.</span>
              </p>
            </div>
          </div>

          <div className="px-6 py-4 bg-gray-50 border-t border-[#e7ebf3] flex justify-end gap-3">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              shadow="none"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" shadow="sm">
              <span className="material-symbols-outlined text-lg">send</span>
              Send Invite
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
