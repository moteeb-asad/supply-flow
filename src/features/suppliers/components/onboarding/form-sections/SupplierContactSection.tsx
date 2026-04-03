import { Input } from "@/src/components/ui/Input";
import type { SupplierContactSectionProps } from "@/src/features/suppliers/types/suppliers.types";

export function SupplierContactSection({
  register,
  errors,
}: SupplierContactSectionProps) {
  return (
    <section className="space-y-5">
      <div className="flex items-center gap-2 mb-1">
        <span className="material-symbols-outlined text-primary text-lg">
          person_pin
        </span>
        <h4 className="text-xs font-bold text-[#4e6797] uppercase tracking-widest">
          Primary Contact Details
        </h4>
      </div>
      <div className="grid grid-cols gap-4">
        <div className="space-y-1.5">
          <label className="text-sm font-semibold">Contact Name</label>
          <Input
            className="w-full bg-white border-gray-200 rounded-lg py-2.5 px-4 text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
            placeholder="John Doe"
            type="text"
            {...register("contactName")}
          />
        </div>
      </div>
      <div className="space-y-1.5">
        <label className="text-sm font-semibold">Email Address</label>
        <div className="relative group">
          <Input
            className="w-full pl-10 bg-white border-gray-200 rounded-lg py-2.5 px-4 text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
            placeholder="contact@supplier.com"
            type="email"
            {...register("email")}
          />
        </div>
        {errors.email && (
          <p className="text-xs text-danger">{errors.email.message}</p>
        )}
      </div>
      <div className="space-y-1.5">
        <label className="text-sm font-semibold">Phone Number</label>
        <Input
          className="w-full bg-white border-gray-200 rounded-lg py-2.5 px-4 text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
          placeholder="+1 (555) 123-4567"
          type="tel"
          {...register("contactPhone")}
        />
      </div>
    </section>
  );
}
