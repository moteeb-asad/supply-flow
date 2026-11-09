"use client";

import { useWatch } from "react-hook-form";
import {
  DEFAULT_RECEIVING_GATE,
  RECEIVING_GATES,
} from "../../constants/form-options";
import type { ReceiptHeaderSectionProps } from "../../types";

const labelClassName = "text-[13px] font-medium text-muted";
const errorClassName = "mt-1.5 text-xs text-danger";
const fieldClassName =
  "h-9 w-full rounded-control border border-line bg-surface px-3 text-sm text-ink placeholder:text-subtle focus:border-primary focus:outline-none focus:ring-3 focus:ring-primary/15 aria-[invalid=true]:border-danger aria-[invalid=true]:ring-3 aria-[invalid=true]:ring-danger/12";

export default function ReceiptHeaderSection({
  control,
  register,
  errors,
}: ReceiptHeaderSectionProps) {
  const role = useWatch({ control, name: "received_by_role" });

  return (
    <section
      aria-labelledby="receiving-receipt"
      className="space-y-3 border-t border-line-soft pt-6"
    >
      <h3 id="receiving-receipt" className="text-[13px] font-semibold">
        Receipt
      </h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="receipt-datetime" className={labelClassName}>
            Received on
          </label>
          <input
            id="receipt-datetime"
            className={`mt-1.5 ${fieldClassName}`}
            aria-invalid={errors.receipt_datetime ? true : undefined}
            defaultValue=""
            type="datetime-local"
            {...register("receipt_datetime")}
          />
          {errors.receipt_datetime && (
            <p className={errorClassName}>{errors.receipt_datetime.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="receipt-delivery-note" className={labelClassName}>
            Delivery note
          </label>
          <input
            id="receipt-delivery-note"
            className={`mt-1.5 ${fieldClassName} font-mono text-[13px] placeholder:font-sans`}
            aria-invalid={errors.delivery_note_number ? true : undefined}
            defaultValue=""
            placeholder="DN number from the driver"
            type="text"
            {...register("delivery_note_number")}
          />
          {errors.delivery_note_number && (
            <p className={errorClassName}>
              {errors.delivery_note_number.message}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="receipt-location" className={labelClassName}>
            Location
          </label>
          <select
            id="receipt-location"
            className={`mt-1.5 ${fieldClassName} cursor-pointer`}
            aria-invalid={errors.receiving_location ? true : undefined}
            defaultValue={DEFAULT_RECEIVING_GATE}
            {...register("receiving_location")}
          >
            {RECEIVING_GATES.map((gate) => (
              <option key={gate.value} value={gate.value}>
                {gate.label}
              </option>
            ))}
          </select>
          {errors.receiving_location && (
            <p className={errorClassName}>
              {errors.receiving_location.message}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="receipt-received-by" className={labelClassName}>
            Received by
          </label>
          <input
            id="receipt-received-by"
            className="mt-1.5 h-9 w-full cursor-not-allowed rounded-control border-0 bg-background-light px-3 text-sm text-ink"
            defaultValue=""
            placeholder="Current user"
            readOnly
            type="text"
            {...register("received_by_name")}
          />
          <input type="hidden" {...register("received_by_role")} />
          <p className="mt-1 text-xs text-subtle">
            {role ? `Role: ${role}` : "Role is auto-filled from your account"}
          </p>
          {errors.received_by_name && (
            <p className={errorClassName}>{errors.received_by_name.message}</p>
          )}
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="receipt-vehicle" className={labelClassName}>
            Vehicle / driver ref
          </label>
          <input
            id="receipt-vehicle"
            className={`mt-1.5 ${fieldClassName}`}
            aria-invalid={errors.vehicle_ref ? true : undefined}
            defaultValue=""
            placeholder="Plate number or driver name"
            type="text"
            {...register("vehicle_ref")}
          />
          {errors.vehicle_ref && (
            <p className={errorClassName}>{errors.vehicle_ref.message}</p>
          )}
        </div>
      </div>
    </section>
  );
}
