export default function AuthFooter() {
  return (
    <div className="max-w-md w-full mx-auto pt-12">
      <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 flex gap-4">
        <span className="material-symbols-outlined text-gray-400">
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
      <p className="text-center text-[10px] text-gray-400 mt-8 uppercase tracking-widest font-bold">
        © 2026 SupplyFlow Operations. All Rights Reserved.
      </p>
    </div>
  );
}
