import type { FormEventHandler } from "react";
import { Input } from "@/src/components/ui/Input";

export type SupplierFormValues = {
  name: string;
  category: "dry" | "liquid" | "mixed";
  contactName: string;
  contactRole: string;
  email: string;
  paymentTerms: string;
  minOrderQty: number;
  leadTimeDays: number;
};

export const SUPPLIER_FORM_ID = "supplier-form";

type SupplierFormProps = {
  formId?: string;
  initialValues?: Partial<SupplierFormValues>;
  onSubmit?: FormEventHandler<HTMLFormElement>;
};

export function SupplierForm({
  formId = SUPPLIER_FORM_ID,
  initialValues,
  onSubmit,
}: SupplierFormProps) {
  const leadTimeDays = initialValues?.leadTimeDays ?? 7;
  const paymentTerms = initialValues?.paymentTerms ?? "Net 30";

  return (
    <form
      className="flex-1 overflow-y-auto p-8 space-y-8"
      id={formId}
      onSubmit={onSubmit}
    >
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
            <Input
              className="w-full bg-white dark:bg-background-dark border-gray-200 dark:border-gray-700 rounded-lg py-2.5 px-4 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
              placeholder="e.g., North Star Distributing"
              type="text"
              defaultValue={initialValues?.name}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-semibold">Category Selection</label>
            <div className="grid grid-cols-3 gap-0 p-1 bg-gray-100 dark:bg-[#111621] rounded-xl border border-gray-200 dark:border-gray-800">
              <label className="relative flex items-center justify-center py-2.5 rounded-lg cursor-pointer transition-all group has-[:checked]:bg-white has-[:checked]:dark:bg-gray-800 has-[:checked]:shadow-sm">
                <Input
                  className="hidden"
                  name="category"
                  type="radio"
                  defaultValue="dry"
                  defaultChecked={initialValues?.category === "dry"}
                />
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
                <Input
                  className="hidden"
                  name="category"
                  type="radio"
                  defaultValue="liquid"
                  defaultChecked={initialValues?.category === "liquid"}
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
                <Input
                  className="hidden"
                  name="category"
                  type="radio"
                  defaultValue="mixed"
                  defaultChecked={initialValues?.category === "mixed"}
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
            <Input
              className="w-full bg-white dark:bg-background-dark border-gray-200 dark:border-gray-700 rounded-lg py-2.5 px-4 text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
              placeholder="John Doe"
              type="text"
              defaultValue={initialValues?.contactName}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-semibold">Role</label>
            <Input
              className="w-full bg-white dark:bg-background-dark border-gray-200 dark:border-gray-700 rounded-lg py-2.5 px-4 text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
              placeholder="Account Manager"
              type="text"
              defaultValue={initialValues?.contactRole}
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-semibold">Email Address</label>
          <div className="relative group">
            <Input
              className="w-full pl-10 bg-white dark:bg-background-dark border-gray-200 dark:border-gray-700 rounded-lg py-2.5 px-4 text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
              placeholder="contact@supplier.com"
              type="email"
              defaultValue={initialValues?.email}
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
              <select
                className="w-full bg-white dark:bg-[#1a1f2e] border-gray-200 dark:border-gray-700 rounded-lg py-2.5 px-3 text-sm outline-none focus:ring-2 focus:ring-primary cursor-pointer"
                defaultValue={paymentTerms}
              >
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
              <Input
                className="w-full bg-white dark:bg-[#1a1f2e] border-gray-200 dark:border-gray-700 rounded-lg py-2.5 px-3 text-sm outline-none focus:ring-2 focus:ring-primary"
                type="number"
                defaultValue={initialValues?.minOrderQty ?? 100}
              />
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-[#4e6797]">
                Standard Lead Time
              </label>
              <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-[10px] font-bold">
                {leadTimeDays} Days
              </span>
            </div>
            <div className="relative pt-1">
              <input
                className="w-full accent-primary h-1.5 bg-gray-200 dark:bg-gray-800 rounded-lg appearance-none cursor-pointer"
                max="30"
                min="1"
                type="range"
                defaultValue={leadTimeDays}
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
    </form>
  );
}
