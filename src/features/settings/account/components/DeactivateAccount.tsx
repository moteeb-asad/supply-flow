export default function DeactivateAccount() {
  return (
    <div className="p-6 border border-danger/20 bg-danger/5 rounded-xl flex items-center justify-between">
      <div className="flex items-center gap-4">
        <span className="material-symbols-outlined text-danger">warning</span>
        <div>
          <p className="text-sm font-bold text-danger">Deactivate Account</p>
          <p className="text-xs text-danger/70">
            Once you deactivate your account, there is no going back. Please be
            certain.
          </p>
        </div>
      </div>
      <button className="px-4 py-2 bg-danger text-white text-sm font-bold rounded-lg hover:bg-danger/90 transition-colors">
        Deactivate
      </button>
    </div>
  );
}
