export default function ProfileCard() {
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
          <button className="px-4 py-2 text-sm font-bold text-[#4e6797] border border-[#e7ebf3] rounded-lg hover:bg-gray-50 transition-colors">
            Change Password
          </button>
        </div>
        <hr className="border-[#e7ebf3]" />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined">security</span>
            </div>
            <div>
              <p className="text-sm font-bold">
                Two-Factor Authentication (2FA)
              </p>
              <p className="text-xs text-[#4e6797]">
                Add an extra layer of security to your account
              </p>
            </div>
          </div>
          <div className="flex items-center">
            <div className="relative inline-block w-10 h-5 mr-3 align-middle select-none transition duration-200 ease-in">
              <input
                defaultChecked
                className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 border-gray-300 appearance-none cursor-pointer focus:outline-none"
                id="2fa-toggle"
                name="2fa"
                type="checkbox"
              />
              <label
                className="toggle-label block overflow-hidden h-5 rounded-full bg-gray-300 cursor-pointer"
                htmlFor="2fa-toggle"
              />
            </div>
            <span className="text-xs font-bold text-success uppercase">
              Enabled
            </span>
          </div>
        </div>
        <hr className="border-[#e7ebf3]" />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="size-10 rounded-lg bg-gray-100 flex items-center justify-center text-[#4e6797]">
              <span className="material-symbols-outlined">devices</span>
            </div>
            <div>
              <p className="text-sm font-bold">Active Sessions</p>
              <p className="text-xs text-[#4e6797]">
                Manage your active sessions on other devices
              </p>
            </div>
          </div>
          <button className="text-sm font-bold text-danger hover:underline">
            Log out all devices
          </button>
        </div>
      </div>
    </div>
  );
}
