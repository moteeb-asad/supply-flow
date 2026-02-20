import TableHeader from "@/src/features/settings/users/components/TableHeader";
import TablePagination from "@/src/features/settings/users/components/TablePagination";

export default function InvitationsTable() {
  return (
    <div className="flex-1 overflow-y-auto p-8">
      <div className="bg-white border border-[#e7ebf3] rounded-xl overflow-hidden shadow-sm">
        <TableHeader />
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-background-light/50">
              <th className="px-6 py-4 text-xs font-bold text-[#4e6797] uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-4 text-xs font-bold text-[#4e6797] uppercase tracking-wider">
                Role Assigned
              </th>
              <th className="px-6 py-4 text-xs font-bold text-[#4e6797] uppercase tracking-wider">
                Invited By
              </th>
              <th className="px-6 py-4 text-xs font-bold text-[#4e6797] uppercase tracking-wider">
                Sent Date
              </th>
              <th className="px-6 py-4 text-xs font-bold text-[#4e6797] uppercase tracking-wider">
                Expiry
              </th>
              <th className="px-6 py-4 text-xs font-bold text-[#4e6797] uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-xs font-bold text-[#4e6797] uppercase tracking-wider text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e7ebf3]">
            <tr className="hover:bg-gray-50/50 transition-colors">
              <td className="px-6 py-4 text-sm font-medium text-[#0e121b]">
                carol.thompson@partner.com
              </td>
              <td className="px-6 py-4">
                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-orange-100 text-orange-600 uppercase">
                  Manager
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <div
                    className="size-6 rounded-full bg-cover bg-center"
                    style={{
                      backgroundImage:
                        'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDlX8vRI_H_-Z6AOQuJQ1hgGxZFk4-W0Jenictidlx7tU-vzXiVjtcZ3u17khzV98Ene5AEItubY50MgZp2spHHOmCQX8rrJd43T8wUsBVkCWNDQ7kDElmi2f6gw-CKy5pr7sCRQ71jiVv88w_vYu9FT0h9XpxLtn7bllfo5o-mNYpPIk9p84B9ocT7yvNzPFNPAUT4WWc1DJ2C7aRni86DgYwc_5sqny5MZNzmUDY5AmoCWk8luZb83QmsW_lX4qkRuQ4jNfNjhF0")',
                    }}
                  ></div>
                  <span className="text-sm text-[#4e6797]">Alex Miller</span>
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-[#4e6797]">Oct 12, 2023</td>
              <td className="px-6 py-4 text-sm text-[#4e6797]">In 2 days</td>
              <td className="px-6 py-4">
                <span className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full text-xs font-medium bg-blue-50 text-blue-600">
                  <span className="size-1.5 rounded-full bg-blue-600"></span>
                  Pending
                </span>
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex justify-end gap-2">
                  <button className="px-3 py-1 text-xs font-bold text-primary hover:bg-primary/10 rounded transition-colors">
                    Resend
                  </button>
                  <button
                    className="p-1.5 hover:bg-red-50 rounded-lg text-[#4e6797] hover:text-danger transition-colors"
                    title="Revoke Invitation"
                  >
                    <span className="material-symbols-outlined text-xl">
                      cancel
                    </span>
                  </button>
                </div>
              </td>
            </tr>
            <tr className="hover:bg-gray-50/50 transition-colors">
              <td className="px-6 py-4 text-sm font-medium text-[#0e121b]">
                mark.vance@warehouse.com
              </td>
              <td className="px-6 py-4">
                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-gray-100 text-[#4e6797] uppercase">
                  Storekeeper
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <div className="size-6 rounded-full bg-purple-100 flex items-center justify-center text-[10px] font-bold text-purple-600">
                    DW
                  </div>
                  <span className="text-sm text-[#4e6797]">David Wong</span>
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-[#4e6797]">Oct 08, 2023</td>
              <td className="px-6 py-4 text-sm text-danger font-medium">
                Expired
              </td>
              <td className="px-6 py-4">
                <span className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full text-xs font-medium bg-red-50 text-red-600">
                  <span className="size-1.5 rounded-full bg-red-600"></span>
                  Expired
                </span>
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex justify-end gap-2">
                  <button className="px-3 py-1 text-xs font-bold text-primary hover:bg-primary/10 rounded transition-colors">
                    Resend
                  </button>
                  <button
                    className="p-1.5 hover:bg-red-50 rounded-lg text-[#4e6797] hover:text-danger transition-colors"
                    title="Revoke Invitation"
                  >
                    <span className="material-symbols-outlined text-xl">
                      cancel
                    </span>
                  </button>
                </div>
              </td>
            </tr>
            <tr className="hover:bg-gray-50/50 transition-colors">
              <td className="px-6 py-4 text-sm font-medium text-[#0e121b]">
                lisa.ray@hq.com
              </td>
              <td className="px-6 py-4">
                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-primary/10 text-primary uppercase">
                  Admin
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <div
                    className="size-6 rounded-full bg-cover bg-center"
                    style={{
                      backgroundImage:
                        'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDlX8vRI_H_-Z6AOQuJQ1hgGxZFk4-W0Jenictidlx7tU-vzXiVjtcZ3u17khzV98Ene5AEItubY50MgZp2spHHOmCQX8rrJd43T8wUsBVkCWNDQ7kDElmi2f6gw-CKy5pr7sCRQ71jiVv88w_vYu9FT0h9XpxLtn7bllfo5o-mNYpPIk9p84B9ocT7yvNzPFNPAUT4WWc1DJ2C7aRni86DgYwc_5sqny5MZNzmUDY5AmoCWk8luZb83QmsW_lX4qkRuQ4jNfNjhF0")',
                    }}
                  ></div>
                  <span className="text-sm text-[#4e6797]">Alex Miller</span>
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-[#4e6797]">Oct 11, 2023</td>
              <td className="px-6 py-4 text-sm text-[#4e6797]">In 6 days</td>
              <td className="px-6 py-4">
                <span className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full text-xs font-medium bg-blue-50 text-blue-600">
                  <span className="size-1.5 rounded-full bg-blue-600"></span>
                  Pending
                </span>
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex justify-end gap-2">
                  <button className="px-3 py-1 text-xs font-bold text-primary hover:bg-primary/10 rounded transition-colors">
                    Resend
                  </button>
                  <button
                    className="p-1.5 hover:bg-red-50 rounded-lg text-[#4e6797] hover:text-danger transition-colors"
                    title="Revoke Invitation"
                  >
                    <span className="material-symbols-outlined text-xl">
                      cancel
                    </span>
                  </button>
                </div>
              </td>
            </tr>
            <tr className="hover:bg-gray-50/50 transition-colors">
              <td className="px-6 py-4 text-sm font-medium text-[#0e121b]">
                john.doe@logistics.com
              </td>
              <td className="px-6 py-4">
                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-gray-100 text-[#4e6797] uppercase">
                  Storekeeper
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <div className="size-6 rounded-full bg-orange-100 flex items-center justify-center text-[10px] font-bold text-orange-600">
                    SM
                  </div>
                  <span className="text-sm text-[#4e6797]">Sarah Manning</span>
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-[#4e6797]">Oct 10, 2023</td>
              <td className="px-6 py-4 text-sm text-[#4e6797]">In 4 days</td>
              <td className="px-6 py-4">
                <span className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full text-xs font-medium bg-blue-50 text-blue-600">
                  <span className="size-1.5 rounded-full bg-blue-600"></span>
                  Pending
                </span>
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex justify-end gap-2">
                  <button className="px-3 py-1 text-xs font-bold text-primary hover:bg-primary/10 rounded transition-colors">
                    Resend
                  </button>
                  <button
                    className="p-1.5 hover:bg-red-50 rounded-lg text-[#4e6797] hover:text-danger transition-colors"
                    title="Revoke Invitation"
                  >
                    <span className="material-symbols-outlined text-xl">
                      cancel
                    </span>
                  </button>
                </div>
              </td>
            </tr>
            <tr className="hover:bg-gray-50/50 transition-colors">
              <td className="px-6 py-4 text-sm font-medium text-[#0e121b]">
                sam.becket@suppliers.net
              </td>
              <td className="px-6 py-4">
                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-orange-100 text-orange-600 uppercase">
                  Manager
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <div
                    className="size-6 rounded-full bg-cover bg-center"
                    style={{
                      backgroundImage:
                        'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDlX8vRI_H_-Z6AOQuJQ1hgGxZFk4-W0Jenictidlx7tU-vzXiVjtcZ3u17khzV98Ene5AEItubY50MgZp2spHHOmCQX8rrJd43T8wUsBVkCWNDQ7kDElmi2f6gw-CKy5pr7sCRQ71jiVv88w_vYu9FT0h9XpxLtn7bllfo5o-mNYpPIk9p84B9ocT7yvNzPFNPAUT4WWc1DJ2C7aRni86DgYwc_5sqny5MZNzmUDY5AmoCWk8luZb83QmsW_lX4qkRuQ4jNfNjhF0")',
                    }}
                  ></div>
                  <span className="text-sm text-[#4e6797]">Alex Miller</span>
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-[#4e6797]">Oct 01, 2023</td>
              <td className="px-6 py-4 text-sm text-danger font-medium">
                Expired
              </td>
              <td className="px-6 py-4">
                <span className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full text-xs font-medium bg-red-50 text-red-600">
                  <span className="size-1.5 rounded-full bg-red-600"></span>
                  Expired
                </span>
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex justify-end gap-2">
                  <button className="px-3 py-1 text-xs font-bold text-primary hover:bg-primary/10 rounded transition-colors">
                    Resend
                  </button>
                  <button
                    className="p-1.5 hover:bg-red-50 rounded-lg text-[#4e6797] hover:text-danger transition-colors"
                    title="Revoke Invitation"
                  >
                    <span className="material-symbols-outlined text-xl">
                      cancel
                    </span>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <TablePagination
          currentPage={1}
          total={24}
          itemsPerPage={10}
          itemLabel="invitations"
        />
      </div>
    </div>
  );
}
