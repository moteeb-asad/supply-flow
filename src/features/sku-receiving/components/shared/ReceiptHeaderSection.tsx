"use client";

import type { ReceiptHeaderSectionProps } from "../../types/form.types";
import { useWatch } from "react-hook-form";

const RECEIVING_GATES = [
  { value: "dock_door_01", label: "Dock Door 01" },
  { value: "dock_door_02", label: "Dock Door 02" },
  { value: "dock_door_03", label: "Dock Door 03" },
  { value: "dock_door_04", label: "Dock Door 04" },
  { value: "dock_door_05", label: "Dock Door 05" },
  { value: "main_entrance", label: "Main Entrance" },
  { value: "back_gate", label: "Back Gate" },
];

export default function ReceiptHeaderSection({
  control,
  register,
  errors,
}: ReceiptHeaderSectionProps) {
  const role = useWatch({ control, name: "received_by_role" });

  return (
    <>
      <section className="space-y-5 border-t border-slate-200 pt-2">
        <div className="mb-1 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-lg">
            assignment
          </span>
          <h3 className="text-xs font-bold uppercase tracking-widest text-[#4e6797]">
            RECEIPT HEADER
          </h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-1 space-y-1.5">
            <label className="text-sm font-semibold text-[#0e121b]">
              Receipt DateTime <span className="text-red-600">*</span>
            </label>
            <input
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-[#0e121b] outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-primary"
              defaultValue=""
              type="datetime-local"
              {...register("receipt_datetime", {
                required: "Receipt date and time is required",
              })}
            />
            {errors.receipt_datetime && (
              <p className="text-xs text-red-600">
                {errors.receipt_datetime.message}
              </p>
            )}
          </div>
          <div className="col-span-1 space-y-1.5">
            <label className="text-sm font-semibold text-[#0e121b]">
              Delivery Note Number
            </label>
            <input
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-[#0e121b] outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-primary"
              defaultValue=""
              placeholder="DN-XXXXX"
              type="text"
              {...register("delivery_note_number")}
            />
            {errors.delivery_note_number && (
              <p className="text-xs text-red-600">
                {errors.delivery_note_number.message}
              </p>
            )}
          </div>
          <div className="col-span-1 space-y-1.5">
            <label className="text-sm font-semibold text-[#0e121b]">
              Received By
            </label>
            <input
              className="w-full cursor-not-allowed rounded-lg border border-gray-200 bg-slate-100 px-3 py-2.5 text-sm text-[#4e6797]"
              defaultValue=""
              placeholder="Current user"
              readOnly
              type="text"
              {...register("received_by_name")}
            />
            <input type="hidden" {...register("received_by_role")} />
            <p className="text-xs text-[#4e6797]">
              {role ? `Role: ${role}` : "Role is auto-filled from your account"}
            </p>
            {errors.received_by_name && (
              <p className="text-xs text-red-600">
                {errors.received_by_name.message}
              </p>
            )}
          </div>
          <div className="col-span-1 space-y-1.5">
            <label className="text-sm font-semibold text-[#0e121b]">
              Receiving Location/Gate
            </label>
            <select
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-[#0e121b] outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-primary"
              defaultValue="dock_door_04"
              {...register("receiving_location", {
                required: "Receiving location is required",
              })}
            >
              {RECEIVING_GATES.map((gate) => (
                <option key={gate.value} value={gate.value}>
                  {gate.label}
                </option>
              ))}
            </select>
            {errors.receiving_location && (
              <p className="text-xs text-red-600">
                {errors.receiving_location.message}
              </p>
            )}
          </div>
          <div className="col-span-2 space-y-1.5">
            <label className="text-sm font-semibold text-[#0e121b]">
              Vehicle/Driver Ref
            </label>
            <input
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-[#0e121b] outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-primary"
              defaultValue=""
              placeholder="Plate # / Driver Name"
              type="text"
              {...register("vehicle_ref")}
            />
            {errors.vehicle_ref && (
              <p className="text-xs text-red-600">
                {errors.vehicle_ref.message}
              </p>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
