// Invite-only note under the sign-in form.
export default function AuthFooter() {
  return (
    <p className="mt-8 flex gap-2.5 rounded-card bg-background-light p-4 text-[13px] leading-5 text-muted">
      <span
        aria-hidden="true"
        className="material-symbols-outlined mt-0.5 shrink-0 !text-[16px] text-subtle"
      >
        lock
      </span>
      <span>
        Access is by invitation only. If you need an account, ask your system
        administrator to invite you.
      </span>
    </p>
  );
}
