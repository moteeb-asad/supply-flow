import SidebarNav from "./SidebarNav";
import { getCurrentUser } from "@/src/actions/auth.actions";

export default async function Sidebar() {
  const user = await getCurrentUser();
  return (
    <aside className="w-64 flex flex-col border-r border-[#e7ebf3] bg-white min-h-screen shrink-0">
      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="bg-primary size-10 rounded-lg flex items-center justify-center text-white">
            <span className="material-symbols-outlined">inventory_2</span>
          </div>
          <div className="flex flex-col">
            <h1 className="text-base font-bold leading-none">SupplyFlow</h1>
            <p className="text-[#4e6797] text-xs font-normal">
              Warehouse Admin
            </p>
          </div>
        </div>
      </div>
      <SidebarNav />
      <div className="p-4 border-t border-[#e7ebf3]">
        <button className="flex w-full items-center gap-3 px-3 py-2 rounded-lg text-[#4e6797] hover:bg-gray-100">
          <span className="material-symbols-outlined">settings</span>
          <span className="text-sm font-medium">Settings</span>
        </button>
        <div className="mt-4 flex items-center gap-3 px-3">
          <div
            className="size-8 rounded-full bg-cover bg-center"
            style={{
              backgroundImage:
                'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDlX8vRI_H_-Z6AOQuJQ1hgGxZFk4-W0Jenictidlx7tU-vzXiVjtcZ3u17khzV98Ene5AEItubY50MgZp2spHHOmCQX8rrJd43T8wUsBVkCWNDQ7kDElmi2f6gw-CKy5pr7sCRQ71jiVv88w_vYu9FT0h9XpxLtn7bllfo5o-mNYpPIk9p84B9ocT7yvNzPFNPAUT4WWc1DJ2C7aRni86DgYwc_5sqny5MZNzmUDY5AmoCWk8luZb83QmsW_lX4qkRuQ4jNfNjhF0")',
            }}
          />
          <div className="flex flex-col">
            <p className="text-sm font-medium leading-none truncate max-w-32">
              {user?.email?.split("@")[0] || "User"}
            </p>
            <p className="text-xs text-[#4e6797] truncate max-w-32">
              {user?.email}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
