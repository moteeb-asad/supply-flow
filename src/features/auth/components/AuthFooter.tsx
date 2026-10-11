export default function AuthFooter() {
  return (
    <div className="mx-auto w-full max-w-md pt-8">
      <div className="flex gap-3 rounded-lg border border-gray-100 bg-gray-50 p-3">
        <span className="material-symbols-outlined !text-[20px] text-gray-400">
          lock_person
        </span>
        <div>
          <p className="text-xs leading-relaxed text-gray-500">
            <strong>Invite-Only Portal:</strong> Access to SupplyFlow is
            strictly for authorized personnel. If you are an employee or
            supplier without access, please contact your{" "}
            <a
              className="text-primary font-semibold underline decoration-primary/30"
              href="#"
            >
              System Administrator
            </a>{" "}
            for an invitation.
          </p>
        </div>
      </div>
      <p className="mt-5 text-center text-[10px] font-bold uppercase tracking-widest text-gray-400">
        © 2026 SupplyFlow Operations. All Rights Reserved.
      </p>
    </div>
  );
}
