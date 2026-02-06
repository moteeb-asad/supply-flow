export default function AccountSettingsPage() {
  return (
    <div className="flex-1 overflow-y-auto p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="bg-white border border-[#e7ebf3] rounded-xl overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-[#e7ebf3] flex items-center justify-between">
            <h3 className="text-base font-bold">Profile Details</h3>
            <button className="text-primary text-sm font-bold hover:underline">
              Edit Profile
            </button>
          </div>
          <div className="p-6">
            <div className="flex items-start gap-8">
              <div className="flex flex-col items-center gap-3">
                <div
                  className="size-24 rounded-full bg-cover bg-center border-4 border-gray-50 shadow-sm"
                  style={{
                    backgroundImage:
                      "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDlX8vRI_H_-Z6AOQuJQ1hgGxZFk4-W0Jenictidlx7tU-vzXiVjtcZ3u17khzV98Ene5AEItubY50MgZp2spHHOmCQX8rrJd43T8wUsBVkCWNDQ7kDElmi2f6gw-CKy5pr7sCRQ71jiVv88w_vYu9FT0h9XpxLtn7bllfo5o-mNYpPIk9p84B9ocT7yvNzPFNPAUT4WWc1DJ2C7aRni86DgYwc_5sqny5MZNzmUDY5AmoCWk8luZb83QmsW_lX4qkRuQ4jNfNjhF0')",
                  }}
                />
                <button className="text-xs font-bold text-[#4e6797] hover:text-primary transition-colors">
                  Change Photo
                </button>
              </div>
              <div className="flex-1 grid grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#4e6797] uppercase tracking-wider">
                    Full Name
                  </label>
                  <input
                    className="w-full bg-gray-50 border-none rounded-lg text-sm px-4 py-2.5 focus:ring-2 focus:ring-primary/50 cursor-default"
                    readOnly
                    type="text"
                    defaultValue="Alex Miller"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#4e6797] uppercase tracking-wider">
                    Job Role
                  </label>
                  <input
                    className="w-full bg-gray-50 border-none rounded-lg text-sm px-4 py-2.5 focus:ring-2 focus:ring-primary/50 cursor-default"
                    readOnly
                    type="text"
                    defaultValue="Logistics Lead"
                  />
                </div>
                <div className="space-y-1.5 col-span-2">
                  <label className="text-xs font-bold text-[#4e6797] uppercase tracking-wider">
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      className="w-full bg-gray-50 border-none rounded-lg text-sm px-4 py-2.5 focus:ring-2 focus:ring-primary/50 cursor-default"
                      readOnly
                      type="email"
                      defaultValue="alex.miller@supplychain.com"
                    />
                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-success text-lg">
                      verified
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="px-6 py-4 bg-gray-50/50 border-t border-[#e7ebf3] flex justify-end">
            <button className="bg-primary text-white px-6 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-primary/90 transition-colors">
              Save Changes
            </button>
          </div>
        </div>
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
        <div className="p-6 border border-danger/20 bg-danger/5 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="material-symbols-outlined text-danger">
              warning
            </span>
            <div>
              <p className="text-sm font-bold text-danger">
                Deactivate Account
              </p>
              <p className="text-xs text-danger/70">
                Once you deactivate your account, there is no going back. Please
                be certain.
              </p>
            </div>
          </div>
          <button className="px-4 py-2 bg-danger text-white text-sm font-bold rounded-lg hover:bg-danger/90 transition-colors">
            Deactivate
          </button>
        </div>
      </div>
    </div>
  );
}
