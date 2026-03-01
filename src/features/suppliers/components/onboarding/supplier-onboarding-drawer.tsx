interface Props {
  onClose?: () => void;
}

export default function SupplierOnboardingDrawer({ onClose }: Props) {
  // Animate drawer in from right
  // Optionally, you could add a state for mounting/unmounting for exit animation
  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-40 backdrop-blur-[1px] flex justify-end">
        <div className="w-full max-w-lg bg-white dark:bg-[#1a1f2e] h-full shadow-2xl flex flex-col transition-transform duration-300">
          <div className="p-6 border-b border-[#e7ebf3] dark:border-gray-800 flex items-center justify-between bg-white dark:bg-[#1a1f2e] z-10">
            <div>
              <h3 className="text-xl font-bold text-[#0e121b] dark:text-white">
                Add New Supplier
              </h3>
              <p className="text-sm text-[#4e6797] mt-1">
                Fill in the details to onboard a new vendor.
              </p>
            </div>
            <button
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-[#4e6797] transition-colors"
              onClick={onClose}
              aria-label="Close"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
          <div className="px-8 py-4 bg-gray-50 dark:bg-[#111621] border-b border-[#e7ebf3] dark:border-gray-800">
            <div className="flex items-center">
              <div className="flex items-center gap-3">
                <div className="size-7 bg-primary text-white text-xs font-bold rounded-full flex items-center justify-center shadow-md shadow-primary/20">
                  1
                </div>
                <span className="text-sm font-semibold text-[#0e121b] dark:text-white">
                  General Information
                </span>
              </div>
              <div className="flex-1 mx-4 h-[2px] bg-gray-200 dark:bg-gray-800"></div>
              <div className="flex items-center gap-3">
                <div className="size-7 border-2 border-gray-300 dark:border-gray-700 text-gray-400 text-xs font-bold rounded-full flex items-center justify-center">
                  2
                </div>
                <span className="text-sm font-medium text-[#4e6797]">
                  Agreement Terms
                </span>
              </div>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-8 space-y-8">
            <section className="space-y-5">
              <div className="flex items-center gap-2 mb-1">
                <span className="material-symbols-outlined text-primary text-lg">
                  business
                </span>
                <h4 className="text-xs font-bold text-[#4e6797] uppercase tracking-widest">
                  Supplier Identity
                </h4>
              </div>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold flex items-center gap-1">
                    Supplier Name <span className="text-danger">*</span>
                  </label>
                  <input
                    className="w-full bg-white dark:bg-background-dark border-gray-200 dark:border-gray-700 rounded-lg py-2.5 px-4 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                    placeholder="e.g., North Star Distributing"
                    type="text"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold">
                    Category Selection
                  </label>
                  <div className="grid grid-cols-3 gap-0 p-1 bg-gray-100 dark:bg-[#111621] rounded-xl border border-gray-200 dark:border-gray-800">
                    <label className="relative flex items-center justify-center py-2.5 rounded-lg cursor-pointer transition-all group has-[:checked]:bg-white has-[:checked]:dark:bg-gray-800 has-[:checked]:shadow-sm">
                      {/* <input
                        checked={checked}
                        className="hidden"
                        name="category"
                        type="radio"
                        defaultValue="dry"
                      /> */}
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-lg text-[#4e6797] group-has-[:checked]:text-primary transition-colors">
                          inventory
                        </span>
                        <span className="text-xs font-bold group-has-[:checked]:text-primary">
                          Dry
                        </span>
                      </div>
                    </label>
                    <label className="relative flex items-center justify-center py-2.5 rounded-lg cursor-pointer transition-all group has-[:checked]:bg-white has-[:checked]:dark:bg-gray-800 has-[:checked]:shadow-sm">
                      <input
                        className="hidden"
                        name="category"
                        type="radio"
                        defaultValue="liquid"
                      />
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-lg text-[#4e6797] group-has-[:checked]:text-primary transition-colors">
                          water_drop
                        </span>
                        <span className="text-xs font-bold group-has-[:checked]:text-primary">
                          Liquid
                        </span>
                      </div>
                    </label>
                    <label className="relative flex items-center justify-center py-2.5 rounded-lg cursor-pointer transition-all group has-[:checked]:bg-white has-[:checked]:dark:bg-gray-800 has-[:checked]:shadow-sm">
                      <input
                        className="hidden"
                        name="category"
                        type="radio"
                        defaultValue="mixed"
                      />
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-lg text-[#4e6797] group-has-[:checked]:text-primary transition-colors">
                          layers
                        </span>
                        <span className="text-xs font-bold group-has-[:checked]:text-primary">
                          Mixed
                        </span>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </section>
            <section className="space-y-5">
              <div className="flex items-center gap-2 mb-1">
                <span className="material-symbols-outlined text-primary text-lg">
                  person_pin
                </span>
                <h4 className="text-xs font-bold text-[#4e6797] uppercase tracking-widest">
                  Primary Contact Details
                </h4>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold">Contact Name</label>
                  <input
                    className="w-full bg-white dark:bg-background-dark border-gray-200 dark:border-gray-700 rounded-lg py-2.5 px-4 text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
                    placeholder="John Doe"
                    type="text"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold">Role</label>
                  <input
                    className="w-full bg-white dark:bg-background-dark border-gray-200 dark:border-gray-700 rounded-lg py-2.5 px-4 text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
                    placeholder="Account Manager"
                    type="text"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold">Email Address</label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#4e6797] text-lg group-focus-within:text-primary transition-colors">
                    mail
                  </span>
                  <input
                    className="w-full pl-10 bg-white dark:bg-background-dark border-gray-200 dark:border-gray-700 rounded-lg py-2.5 px-4 text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
                    placeholder="contact@supplier.com"
                    type="email"
                  />
                </div>
              </div>
            </section>
            <section className="space-y-5">
              <div className="flex items-center gap-2 mb-1">
                <span className="material-symbols-outlined text-primary text-lg">
                  handshake
                </span>
                <h4 className="text-xs font-bold text-[#4e6797] uppercase tracking-widest">
                  Initial Negotiated Terms
                </h4>
              </div>
              <div className="bg-gray-50 dark:bg-[#111621] p-5 rounded-xl border border-gray-200 dark:border-gray-800 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#4e6797]">
                      Payment Terms
                    </label>
                    <select className="w-full bg-white dark:bg-[#1a1f2e] border-gray-200 dark:border-gray-700 rounded-lg py-2.5 px-3 text-sm outline-none focus:ring-2 focus:ring-primary cursor-pointer">
                      <option>Net 30</option>
                      <option>Net 60</option>
                      <option>Net 90</option>
                      <option>Due on Receipt</option>
                      <option>Advance Payment</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#4e6797]">
                      Min. Order Qty (Units)
                    </label>
                    <input
                      className="w-full bg-white dark:bg-[#1a1f2e] border-gray-200 dark:border-gray-700 rounded-lg py-2.5 px-3 text-sm outline-none focus:ring-2 focus:ring-primary"
                      type="number"
                      defaultValue={100}
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-[#4e6797]">
                      Standard Lead Time
                    </label>
                    <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-[10px] font-bold">
                      7 Days
                    </span>
                  </div>
                  <div className="relative pt-1">
                    <input
                      className="w-full accent-primary h-1.5 bg-gray-200 dark:bg-gray-800 rounded-lg appearance-none cursor-pointer"
                      max="30"
                      min="1"
                      type="range"
                    />
                    <div className="flex justify-between mt-2 text-[10px] text-[#4e6797] font-medium">
                      <span className="flex flex-col items-center">
                        1<span>Day</span>
                      </span>
                      <span className="flex flex-col items-center">
                        15<span>Days</span>
                      </span>
                      <span className="flex flex-col items-center">
                        30<span>Days</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
          <div className="p-6 border-t border-[#e7ebf3] dark:border-gray-800 bg-white dark:bg-[#1a1f2e] flex items-center justify-between gap-4">
            <button className="px-6 py-2.5 text-sm font-bold text-[#4e6797] hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
              Save Draft
            </button>
            <button className="flex-1 bg-primary text-white px-6 py-3 rounded-lg text-sm font-bold shadow-lg shadow-primary/25 hover:bg-primary/90 transition-all flex items-center justify-center gap-2">
              <span>Save &amp; Onboard Supplier</span>
              <span className="material-symbols-outlined text-lg">
                arrow_forward
              </span>
            </button>
          </div>
        </div>
      </div>
      <style jsx>{`
        .translate-x-full {
          transform: translateX(100%);
        }
        .fixed.inset-0.flex > .translate-x-full {
          transform: translateX(0);
        }
      `}</style>
    </>
  );
}
