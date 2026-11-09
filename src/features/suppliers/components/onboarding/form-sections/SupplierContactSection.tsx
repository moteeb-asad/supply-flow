import type { SupplierContactSectionProps } from "@/src/features/suppliers/types/suppliers.types";
import { cn } from "@/src/lib/utils";
import {
  FieldError,
  SectionHeading,
  fieldClassName,
  labelClassName,
} from "./fields";

export function SupplierContactSection({
  register,
  errors,
}: SupplierContactSectionProps) {
  return (
    <section
      aria-labelledby="supplier-contact"
      className="space-y-4 border-t border-line-soft pt-6"
    >
      <SectionHeading id="supplier-contact" optional>
        Contact
      </SectionHeading>

      <div>
        <label htmlFor="supplier-contact-name" className={labelClassName}>
          Contact person
        </label>
        <input
          id="supplier-contact-name"
          type="text"
          className={fieldClassName}
          {...register("contactName")}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="supplier-email" className={labelClassName}>
            Email
          </label>
          <input
            id="supplier-email"
            type="email"
            placeholder="name@company.com"
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={errors.email ? "supplier-email-error" : undefined}
            className={fieldClassName}
            {...register("email")}
          />
          <FieldError
            id="supplier-email-error"
            message={errors.email?.message}
          />
        </div>
        <div>
          <label htmlFor="supplier-phone" className={labelClassName}>
            Phone
          </label>
          <input
            id="supplier-phone"
            type="tel"
            placeholder="+92 300 1234567"
            className={cn(fieldClassName, "tabular-nums")}
            {...register("contactPhone")}
          />
        </div>
      </div>
    </section>
  );
}
