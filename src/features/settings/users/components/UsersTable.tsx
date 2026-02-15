"use client";

import TableHeader from "@/src/features/settings/users/components/TableHeader";
import TablePagination from "@/src/features/settings/users/components/TablePagination";

export default function UsersTable() {
  return (
    <div className="flex-1 overflow-y-auto p-8">
      <div className="bg-white border border-[#e7ebf3] rounded-xl overflow-hidden shadow-sm">
        <TableHeader />

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-background-light/50">
              <th className="px-6 py-4 text-xs font-bold text-[#4e6797] uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-4 text-xs font-bold text-[#4e6797] uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-4 text-xs font-bold text-[#4e6797] uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-4 text-xs font-bold text-[#4e6797] uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-xs font-bold text-[#4e6797] uppercase tracking-wider">
                Last Login
              </th>
              <th className="px-6 py-4 text-xs font-bold text-[#4e6797] uppercase tracking-wider text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e7ebf3]">
            <tr className="hover:bg-gray-50/50 transition-colors">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div
                    className="size-9 rounded-full bg-cover bg-center border border-gray-200"
                    style={{
                      backgroundImage:
                        'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDlX8vRI_H_-Z6AOQuJQ1hgGxZFk4-W0Jenictidlx7tU-vzXiVjtcZ3u17khzV98Ene5AEItubY50MgZp2spHHOmCQX8rrJd43T8wUsBVkCWNDQ7kDElmi2f6gw-CKy5pr7sCRQ71jiVv88w_vYu9FT0h9XpxLtn7bllfo5o-mNYpPIk9p84B9ocT7yvNzPFNPAUT4WWc1DJ2C7aRni86DgYwc_5sqny5MZNzmUDY5AmoCWk8luZb83QmsW_lX4qkRuQ4jNfNjhF0")',
                    }}
                  ></div>
                  <span className="text-sm font-semibold text-[#0e121b]">
                    Alex Miller
                  </span>
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-[#4e6797]">
                alex.miller@supplychain.com
              </td>
              <td className="px-6 py-4">
                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-primary/10 text-primary uppercase">
                  Admin
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center">
                  <div className="relative inline-block w-10 h-5 mr-2 align-middle select-none transition duration-200 ease-in">
                    <input
                      defaultChecked
                      className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 border-gray-300 appearance-none cursor-pointer focus:outline-none"
                      id="toggle1"
                      name="toggle"
                      type="checkbox"
                    />
                    <label
                      className="toggle-label block overflow-hidden h-5 rounded-full bg-gray-300 cursor-pointer"
                      htmlFor="toggle1"
                    ></label>
                  </div>
                  <span className="text-xs font-medium text-success">
                    Active
                  </span>
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-[#4e6797]">2 mins ago</td>
              <td className="px-6 py-4 text-right">
                <div className="flex justify-end gap-2">
                  <button
                    className="p-1.5 hover:bg-gray-100 rounded-lg text-[#4e6797] hover:text-primary transition-colors"
                    title="Edit Role"
                  >
                    <span className="material-symbols-outlined text-xl">
                      manage_accounts
                    </span>
                  </button>
                  <button
                    className="p-1.5 hover:bg-red-50 rounded-lg text-[#4e6797] hover:text-danger transition-colors"
                    title="Disable User"
                  >
                    <span className="material-symbols-outlined text-xl">
                      block
                    </span>
                  </button>
                </div>
              </td>
            </tr>
            <tr className="hover:bg-gray-50/50 transition-colors">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="size-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
                    SM
                  </div>
                  <span className="text-sm font-semibold text-[#0e121b]">
                    Sarah Manning
                  </span>
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-[#4e6797]">
                s.manning@supplychain.com
              </td>
              <td className="px-6 py-4">
                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-orange-100 text-orange-600 uppercase">
                  Manager
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center">
                  <div className="relative inline-block w-10 h-5 mr-2 align-middle select-none transition duration-200 ease-in">
                    <input
                      defaultChecked
                      className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 border-gray-300 appearance-none cursor-pointer focus:outline-none"
                      id="toggle2"
                      name="toggle"
                      type="checkbox"
                    />
                    <label
                      className="toggle-label block overflow-hidden h-5 rounded-full bg-gray-300 cursor-pointer"
                      htmlFor="toggle2"
                    ></label>
                  </div>
                  <span className="text-xs font-medium text-success">
                    Active
                  </span>
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-[#4e6797]">Oct 11, 2023</td>
              <td className="px-6 py-4 text-right">
                <div className="flex justify-end gap-2">
                  <button className="p-1.5 hover:bg-gray-100 rounded-lg text-[#4e6797] hover:text-primary transition-colors">
                    <span className="material-symbols-outlined text-xl">
                      manage_accounts
                    </span>
                  </button>
                  <button className="p-1.5 hover:bg-red-50 rounded-lg text-[#4e6797] hover:text-danger transition-colors">
                    <span className="material-symbols-outlined text-xl">
                      block
                    </span>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <TablePagination
          currentPage={1}
          totalPages={5}
          from={1}
          to={5}
          total={24}
          itemLabel="users"
        />
      </div>
    </div>
  );
}
